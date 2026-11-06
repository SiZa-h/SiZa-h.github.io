/* 展示框 · 01 首页 · 配置
   code     ：必须与轮盘配置的编号一致（第一组两位字母决定匹配关系）
   eyebrow  ：展示框顶部的眉标
   name     ：展示框标题
   english  ：右侧小字
   note     ：展示框底部注记
   content  ：内容文件名（同目录下，可多个，按顺序加载）
*/
RawaeaFrame.define({
  code: "AA-FR-HM",
  name: "首页",
  english: "HOME",
  eyebrow: "WELCOME · 序章",
  note: "受引力约束的一小块安静",
  content: ["AA-CN-HM-“首页内容”.js"]
});
