# Leon’s Research Library · 测试用设计规范

本规范用于评审 u16l.com 的研究阅读体验。样张只用于验证，正式页面采用设计前须另行确认。原始生成结果见 [generated.md](generated.md)，离线样张见 [sample.html](sample.html)。

| 项目 | 设计决策与验证依据 |
| --- | --- |
| 配色 | 采用 Portfolio/Personal。纸色背景 #FAFAFA 配墨色正文 #09090B（19.06∶1），浅灰底 #E8ECF0 配次要文字 #475569（6.38∶1）。链接蓝 #2563EB 在纸色上为 4.95∶1，蓝底白字为 5.17∶1。普通正文门槛 4.5∶1。 |
| 字体 | 编辑出版查询给出 Libre Bodoni 标题和 Public Sans 正文。中文标题依次回退至宋体、Noto Serif CJK SC 和系统衬线，正文回退至苹方、微软雅黑和系统无衬线。样张按本机可用字体展示，无外部字体请求。正文 17px、行高 1.75，长标题自然折行。财务表格数字用等宽数字并注明币种、期间。 |
| 布局 | 首页依次呈现作者研究方向、精选研究、研究分类、AI 实验及关于作者。主入口为阅读研究。样张取精选研究与实验两栏体现主次；研究内页依次呈现问题、摘要、图表、数据来源。 |
| 组件与间距 | 使用 4、8、16、24、48px 间距。研究条目由分类与期间、可读标题、摘要组成，实验条目突出实验编号与方法。正文链接保留下划线；图表用标签和线型同时区分序列。页面只设一个一级标题，分区用二级标题。 |
| 动效 | 链接颜色过渡 150ms ease-out；键盘焦点立即出现。减少动态效果模式下过渡归零。研究正文进入页面即完整可读。 |
| 响应式 | 移动端单列、边距最小 16px；768px 起精选研究与实验使用 2∶1 双栏。宽屏容器上限 70rem，段落上限 38em。 |
| 无障碍 | 导航具备名称，链接目标至少 44px 高，焦点环 3px、外偏移 3px。图表应配文字摘要及数据表入口；下载链接应标明格式。 |

## 验证记录

在仓库根目录使用 Python 3.12.14 运行以下命令，变量仅在当前 shell 有效。

```sh
s=.agents/skills/ui-ux-pro-max/scripts/search.py
python3 -B "$s" "personal portfolio research editorial" --design-system -f markdown -p "Leon's Research Library"
python3 -B "$s" "portfolio personal" --domain color -n 1
python3 -B "$s" "editorial publishing" --domain typography -n 1
python3 -B "$s" "newsletter content first" --domain landing -n 1
python3 -B "$s" "reduced motion" --domain ux -n 1
python3 -B "$s" "responsive breakpoints" --domain ux -n 1
python3 -B "$s" "focus visible keyboard" --domain ux -n 1
python3 -B .agents/skills/ui-ux-pro-max/scripts/validate_data.py
```

综合查询实际生成了配色、字体、布局、效果及检查清单。原始结果的滚动叙事和手写标题更接近创意作品集。针对研究站另行查询，命中 Magazine Style 和 Newsletter / Content First，取其出版字体与按内容组织的结构，并将订阅入口改为精选研究。三项 UX 查询分别命中 Reduced Motion、Horizontal Scroll 和 Focus States。数据校验通过 12 个领域文件、22 个技术栈文件及推理规则表。

使用 Chromium 与 Playwright 加载样张 HTML，在 320、375、768、1024、1440px 均验证无页面横向溢出、栏数符合规范。Tab 顺序命中两个目录链接，焦点环均为 3px。模拟 reduced motion 前后，计算得到的过渡时长从 0.15s 变为 0s。上述结果仅覆盖样张；生产站的读屏、真实设备和完整 WCAG 审核另计。
