# Leon's Research Library

个人研究图书馆，记录金融与商业、科技与能源、经济与社会领域的学习与研究。

线上地址：https://leonjywl.github.io/

## 文件结构

- `index.html`：首页、分类目录、研究报告卡片、本站介绍。
- `assets/styles.css`：配色、排版、手机与电脑响应式布局。
- `real-estate-report.pdf`：首页当前使用的房地产研究 PDF。
- `中国四家房企财务故事（2013-2015）.pdf`：保留的另一份 PDF，不改变其路径。
- `四家房企财务数据.xlsx`：首页下载的财务数据。

网站使用原生 HTML 与 CSS，无构建步骤、JavaScript、外部字体或第三方依赖。继续使用仓库现有的 GitHub Pages 发布设置。

## 预览改版

Pull Request 不会自动替换正式网站。审核时可在 PR 的 **Files changed** 查看差异，也可下载 PR 分支的 ZIP，解压后双击 `index.html`，即可查看首页、使用分类导航并打开报告或下载数据。请勿直接打开 ZIP 内的文件，需先完整解压以保留相对路径。

如已安装 Python，可在解压目录运行 `python3 -m http.server 8000`，浏览器访问 `http://localhost:8000`。使用开发者工具的设备模式检查手机宽度。

审核并合并到 `main` 后，由现有 GitHub Pages 流程发布。不要为了预览切换 Pages 的正式发布分支。

## 添加研究报告

1. 将 PDF、Excel 等文件上传到仓库，推荐使用稳定的英文文件名。不要改名或覆盖已公开的文件，以免旧链接失效。
2. 在 `index.html` 的研究档案区域复制 `<article class="report-card">…</article>`，保留封面与正文结构。更换内容和文件链接；封面中的 SVG 是装饰性建筑线稿，可以按研究主题替换或移除。
3. 为文章与标题设置唯一的 `id`（如 `report-002`、`report-002-title`），同步更新 `aria-labelledby`。封面使用 `aria-hidden="true"`，完整信息应在正文提供。
4. PDF 链接保留 `target="_blank" rel="noopener noreferrer"`；数据下载保留 `download`。没有数据文件时删除对应按钮。
5. 同步更新首页馆藏索引的篇数、资料形式以及对应分类目录的篇数与研究入口。首篇研究发布后，移除该分类的“暂无已发布研究”状态，按金融分类添加真实文章链接。不要为未发布研究编造内容。
6. 在独立分支预览并检查链接后，通过 Pull Request 审核发布。

静态 HTML 保证关闭 JavaScript 后报告与导航仍可使用。报告数量增加后，可再考虑自动生成目录；目前无需安装工具或维护复杂框架。
