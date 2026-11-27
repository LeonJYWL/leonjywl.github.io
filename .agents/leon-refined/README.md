# Leon · 首页与内容库

下载并解压 Leon-refinement.zip，双击根目录的 index.html。Home 顶部 Research、Projects、About 定位到首页板块；Explore 定位到研究入口。两个 View all 链接进入 research/index.html 和 projects/index.html。首页 About 板块的 More about me 链接进入 about/index.html。三个独立页面均有四页导航。网站无需安装依赖或构建，目录结构兼容 GitHub Pages 的 /research/、/projects/ 和 /about/ 路径。

## 设计

首屏沿用上一版标题、按钮、午夜蓝地平线背景及其手机取景。签名使用 Mrs Saint Delafield。三个候选均按 SIL Open Font License 1.1 发布。screens/signature-study.jpg 为三个字标在同一字号、两种底色下的 Chromium 实际渲染。Mrs Saint Delafield 的 L 横向舒展，eon 连笔清晰；Herr Von Muellerhoff 的 L 更陡峭，Sacramento 更圆润。去掉了额外装饰线，首页页首、About 落款及两座内容库使用同一签名。字体字节随本地 assets/fonts.css 提供；assets 中包含所使用字体的许可证。

首页 Research 的多层纸页插图以曲面和刻线表现阅读与积累；Projects 的扭转光带由程序生成后静态输出，适合手机。两幅图属于栏目视觉。独立 Research 使用安静的书封、内容摘要及附件入口；Projects 并排呈现两个真实项目的不同比例预览。首页导航在上滑时变为紧凑导航，下滑时收起；键盘导航有焦点时保持可见。减少动态效果偏好关闭平滑滚动与动效。

独立 About 页以暖灰纸页承载首页自述。未来可在 about/index.html 的自述段落和下方四个主题中逐项写入真实内容；每一项均可独立增加段落、链接或移除占位。

## 更新清单

content/research.js 和 content/projects.js 是可以由 file:// 直接加载的普通脚本，各自包含一份数据数组。两页共享 catalog.js。清单顺序即显示顺序。所有相对路径以对应内容库的 index.html 为起点。

**新增研究**：把附件放入例如 files/，封面放入 assets/，在 content/research.js 数组里追加一项（相邻条目之间加逗号）：

```js
{
  title: "实际报告标题",
  category: "研究分类",
  cover: "../assets/实际封面.webp",
  description: "一段真实的研究摘要。",
  links: [
    { label: "阅读报告 · PDF", url: "../files/报告.pdf" },
    { label: "下载数据 · XLSX", url: "../files/数据.xlsx", download: true }
  ]
}
```

已知发布日期时可添加 date 字段（YYYY-MM-DD）；研究覆盖年份用 period。现有报告的 2013—2015 是研究期间。正文、其他附件可追加到 links 中。封面可省略。

**新增项目**：将封面放入 assets/，上传作品文件或准备目标网址，在 content/projects.js 数组里追加一项：

```js
{
  title: "实际作品名称",
  category: "互动网页",
  cover: "../assets/实际作品.webp",
  alt: "对预览图的简要描述。",
  description: "作品的内容和体验。",
  links: [{ label: "打开作品", url: "../experiments/作品目录/index.html" }]
}
```

模型、视频或工具可以使用同一条目结构，链接到对应媒体或作品详情页。为离线访问本地页面，应显式使用 index.html。发布新条目只需更新清单和资源文件。

## 验证范围

- screens/ 提供四个页面在 1440×810 和 390×844 视口下的全页截图，另检查 320px 和 768px 宽度。
- 浏览器验证首页锚点、浮动导航显示/隐藏、隐藏状态下的键盘可达性、签名回顶、两个内容库入口、首页 About 按钮、独立页面间互跳与返回首页、图片与附件路径。PDF 和 XLSX 是仓库真实文件的本地副本。
- 四页和字体均无运行时外部依赖。Pelican Test 和 Date Invitation 保留正式站链接，访问项目本身需要联网。远端 main 中两条路径存在；云端代理对正式站返回 403，线上可用性未独立确认。
- 受管 Chromium 策略阻止 file:// 地址栏导航。ZIP 的交互复测采用解压目录的临时静态服务，另核验所有本地 HTML、脚本、样式、图片、附件及跨页链接均可从解压目录解析。未在真实手机或读屏软件上验证。
