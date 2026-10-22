# 合成水果铺：在线试玩发布

目标仓库：mynameisspiderman266-stack/fruitshop-play
部署成功后的地址：https://mynameisspiderman266-stack.github.io/fruitshop-play/
本次只是本地发布包，尚未上传或开启远端 Pages。

1. 新建试玩仓库时确认 Public。若需要保密源码，保留私有源码库，只公开这个编译后的试玩库。仓库名称旁的小锁表示仍然私有；上传文件不会改变它。
2. 已决定公开该试玩库但它仍是私有时：Settings → General → 底部 Danger Zone → Change repository visibility → Change visibility → Public，按提示确认。
3. 打开 https://github.com/mynameisspiderman266-stack/fruitshop-play/settings/pages ，Build and deployment → Source 选择 GitHub Actions。免费账号的私有库可能显示 Upgrade；无需因此公开源码或购买套餐，先核对试玩库可见性与官方规则。
4. 将 update/ 里面的 WebGL 和 .github 合并到本地仓库根目录，保留其他工作流；不要把 ZIP 本身当网页上传，不要多套一层目录。
5. GitHub Desktop：Fetch/Pull 后在默认分支提交，Commit → Push origin。若用网页上传，确认 .github/workflows/deploy-pages.yml 存在，必要时 Add file → Create new file 手动添加同名文件。
6. 打开 https://github.com/mynameisspiderman266-stack/fruitshop-play/actions ，等 Publish playable demo to GitHub Pages 绿色成功。如果先上传后启用 Pages，选择该工作流 → Run workflow → 默认分支 → Run workflow。
7. 打开试玩地址。将 README_PLAY_LINK.md 的内容追加到现有 README.md，即可在仓库首页显示“点击试玩”，无需覆盖已有介绍。

网站目录中的 index.html 将成为站点首页；最终地址不再加 /WebGL/。Actions 只上传网站目录，不编译 Unity、不上传整个源码。网站文件需普通 Git 保存原字节，不能用 LFS 指针代替运行文件。

更新游戏应先重新编译，再重新制作发布包并提交新网站目录。为避免留下已删除的旧资源，先比较新旧文件清单，确认后只同步专用网站目录，不清空仓库或用户项目。

规则核对：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
发布设置：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 本次文件与检查

- 建议新建仓库名：fruitshop-play。若另取仓库名，网页运行文件无需更改，但 README 试玩链接需同步修改。
- 只上传解压后的 WebGL、.github、README.md 和说明文件；不要上传原项目、work、_backups 或整个 E 盘目录。
- Windows 可能隐藏 .github 文件夹；网页上传后必须核对仓库里的 .github/workflows/deploy-pages.yml 确实存在。
- 所有运行文件低于 25 MiB，可通过网页上传；不要上传 ZIP 本身。
- 源构建：2026-10-22 的 fruitshop_web；Player 版本 1.0.0，不将它标为微信审核包 1.0.3。
- 已检查完整资源、动态 Build 路径、Gzip 解压、WASM 文件头、解压回退标记、字体许可证、原构建逐字节一致和 ZIP CRC。
- 未进行远端部署、浏览器启动或整局试玩。手机与桌面浏览器兼容性以你上传后的实际试玩为准。
