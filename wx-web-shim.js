/*
 * 微信小游戏 SDK 浏览器兼容层（wx-web-shim.js）
 * ------------------------------------------------------------------
 * 问题：工程里装了微信小游戏 Unity 插件（com.qq.weixin.minigame），
 *      它会把 PlayerPrefs 等调用转发到 window.WXWASMSDK（只在微信环境才存在）。
 *      普通浏览器里没有这个对象 → 读存档时报
 *      "Cannot read properties of undefined (reading 'WXStorageGetIntSync')" 而崩溃。
 * 解法：在加载 Unity 之前，给浏览器提供一个假的 WXWASMSDK：
 *      · 存储类接口 → 用浏览器 localStorage 实现（存档照常能保存）
 *      · 其他微信专属接口（震动、胶囊按钮、上报等）→ 安全的空操作
 * 只在「不是微信小游戏环境」时生效，不影响微信端。
 */
(function () {
  if (window.WXWASMSDK) return;            // 真·微信环境，啥也不做
  var P = 'wxweb:';                         // localStorage 键前缀，避免和其它站点数据混
  var ls = (function () { try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return localStorage; } catch (e) { return null; } })();
  var mem = {};
  function get(k) { return ls ? ls.getItem(P + k) : (k in mem ? mem[k] : null); }
  function set(k, v) { v = String(v); if (ls) { try { ls.setItem(P + k, v); } catch (e) { mem[k] = v; } } else mem[k] = v; }
  function del(k) { if (ls) ls.removeItem(P + k); delete mem[k]; }

  var impl = {
    WXStorageSetIntSync: function (k, v) { set(k, v | 0); },
    WXStorageGetIntSync: function (k, d) { var v = get(k); return v === null ? d : (parseInt(v, 10) || 0); },
    WXStorageSetFloatSync: function (k, v) { set(k, v); },
    WXStorageGetFloatSync: function (k, d) { var v = get(k); return v === null ? d : (parseFloat(v) || 0); },
    WXStorageSetStringSync: function (k, v) { set(k, v == null ? '' : v); },
    WXStorageGetStringSync: function (k, d) { var v = get(k); return v === null ? (d == null ? '' : d) : v; },
    WXStorageDeleteKeySync: function (k) { del(k); },
    WXStorageHasKeySync: function (k) { return get(k) !== null; },
    WXStorageDeleteAllSync: function () {
      if (ls) { Object.keys(ls).forEach(function (x) { if (x.indexOf(P) === 0) ls.removeItem(x); }); }
      mem = {};
    }
  };

  var seen = {};
  window.WXWASMSDK = new Proxy(impl, {
    get: function (t, name) {
      if (name in t) return t[name];
      if (typeof name !== 'string') return undefined;
      // 其余微信专属接口：返回一个安全的空函数。
      // 同步取值类（名字含 Sync / Get）返回 "{}"，让 C# 侧 JSON 解析拿到空对象而不是 undefined。
      return function () {
        if (!seen[name]) { seen[name] = 1; console.log('[wx-web-shim] 浏览器中跳过微信接口：' + name); }
        return (/Sync$|^WX_?Get|GetSync/.test(name)) ? '{}' : undefined;
      };
    }
  });
  // 部分插件代码直接访问 GameGlobal，补一个空壳
  if (typeof window.GameGlobal === 'undefined') window.GameGlobal = window;
})();
