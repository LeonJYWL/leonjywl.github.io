# U16L 首页视觉探索

下载本目录中的任意一个 HTML，在浏览器中打开即可。图像与样式均已内嵌，无需安装依赖或启动服务器。导航定位到本页四个栏目，栏目摘要支持鼠标、触摸及键盘展开。仅明确标注「正式站」的两个链接需要联网。screens 中包含六张全页图及桌面、手机两张首屏横向对照图。

| 方向 | 配色与字体 | 版式、交互与取舍 |
| --- | --- | --- |
| [Futuristic Technology](futuristic.html) | 夜蓝 #080D17、冰蓝 #8DCFFF、暖橙 #FFAB78。Georgia 斜体大标题，英文导航采用 Arial，中文采用苹方或 Noto Sans CJK SC。 | 以作者自述与静态蓝橙地平线开场，四路工作索引承接阅读。借鉴附件的暗色居中构图与地平线光带。适合突出品牌记忆，精选研究在首屏中的权重较低。 |
| [Editorial Research](editorial.html) | 纸白 #F7F4E9、墨绿 #252C26、赭色 #72452E。Georgia、宋体或 Noto Serif CJK SC 搭配等宽图注。 | 刊头、双细线、编者的话及原创城市版画建立杂志阅读顺序。编者导语限宽 30em，展开摘要限宽 38em；移动端先读导语再看图。适合长期研究写作，可在之后的期次轮换主图和选题。 |
| [Creative Digital Lab](creative.html) | 酸橙 #DFFF72、淡紫 #C9BCF7、珊瑚 #FFC6AC、墨黑 #191A20。粗重无衬线英文动词配中文短句与等宽作品说明。 | 左侧品牌宣言与右侧褶皱环面共同占据首屏。工作台优先呈现 Projects，以不同尺寸与色块区分内容。取附件的渐变实验感，把渐变集中在作品本身。适合作品与研究并重的主页。 |

## 研究依据与内容范围

在已安装的 ui-ux-pro-max 固定版本 a4fc248 上运行三次 design-system，并按方向检索 style、typography、landing。分别命中 Dark Mode (OLED)、Magazine Style、Bento Grid Showcase。选取暗色高对比、衬线标题与正文层级、模块网格等建议。为离线预览采用系统字体；科技方案的天空、编辑方案的建筑与实验室环面均为本次创作的静态图像。

金融研究和 Pelican Test 来自既有站点。投资笔记是标示为样例的内容；Blender 是预留作品方向。环面是程序生成的概念图，关于 Leon 的文案供作者审定。

## 预览与验证

- 首屏对照：[桌面](screens/compare-desktop.jpg) · [手机](screens/compare-mobile.jpg)。
- 全页截图：[科技桌面](screens/futuristic-desktop.jpg) · [科技手机](screens/futuristic-mobile.jpg) · [编辑桌面](screens/editorial-desktop.jpg) · [编辑手机](screens/editorial-mobile.jpg) · [实验室桌面](screens/creative-desktop.jpg) · [实验室手机](screens/creative-mobile.jpg)。
- Chromium 已检查 320、390、768、1440px 下的页面宽度、图片加载、四个导航目标、每项摘要的键盘开合和减少动态效果模式。截图视口为 1440×1000 和 390×844，六张独立截图保留完整页面高度。离线打开主要功能不依赖 JavaScript。

## 选定后的整合方式

1. 从当时最新的 main 切出实施分支。只移植选定方案的结构、设计变量和已审定文案；核对真实作品、日期与附件链接。
2. 复用既有研究 PDF、数据表和实验路径。投资手记和 Blender 栏目接入真实内容后再公开展示。保留旧首页的可恢复提交。
3. 在本地预览实施分支，复核中英换行、200% 缩放、手机导航、键盘焦点、减少动态效果、图片体积以及旧链接。截图与此次选定原型对照。
4. 通过 PR 审阅视觉与内容差异，经站主确认再合并。域名及 Pages 设置无需随首页视觉变更。
