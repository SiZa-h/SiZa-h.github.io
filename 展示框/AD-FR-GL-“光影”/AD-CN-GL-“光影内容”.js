/* 展示框 · 04 光影 · 内容
   ------------------------------------------------------------
   真实的地区照片，全部随站点打包在 assets/photos/。
   每张图的来源与授权记录在 credit 字段，并汇总在使用手册里。
   想换图：把同名文件替换掉即可，尺寸建议 1600px 宽。
   ------------------------------------------------------------ */
RawaeaFrame.content("AD-FR-GL", {
  gallery: [
    {
      src: "assets/photos/hangzhou.jpg",
      title: "西湖的午后",
      place: "浙江 · 杭州",
      credit: "Yinweichen / Wikimedia · CC BY-SA 4.0"
    },
    {
      src: "assets/photos/kyoto.jpg",
      title: "岚山竹径",
      place: "京都 · 日本",
      credit: "Erol Ahmed / Wikimedia · CC0"
    },
    {
      src: "assets/photos/santorini.jpg",
      title: "伊亚的白与蓝",
      place: "圣托里尼 · 希腊",
      credit: "Norbert Nagel / Wikimedia · CC BY-SA 3.0"
    },
    {
      src: "assets/photos/tokyo.jpg",
      title: "富士远望",
      place: "东京 · 日本",
      credit: "Syced / Wikimedia · CC0"
    },
    {
      src: "assets/photos/iceland.jpg",
      title: "冰川瀑布",
      place: "塞尔福斯 · 冰岛",
      credit: "Martin Falbisoner / Wikimedia · CC BY-SA 4.0"
    },
    {
      src: "assets/photos/paris.jpg",
      title: "塞纳河落日",
      place: "巴黎 · 法国",
      credit: "Lawrence W.K. Ho / Wikimedia · CC BY-SA 3.0"
    },
    {
      src: "assets/photos/newyork.jpg",
      title: "曼哈顿蓝调",
      place: "纽约 · 美国",
      credit: "King of Hearts / Wikimedia · CC BY-SA 4.0"
    },
    {
      src: "assets/photos/norway.jpg",
      title: "峡湾之上",
      place: "盖朗厄尔 · 挪威",
      credit: "Ximonic / Wikimedia · CC BY-SA 3.0"
    },
    {
      src: "assets/photos/huangshan.jpg",
      title: "黄山云海",
      place: "安徽 · 中国",
      credit: "eviltomthai / Wikimedia · CC BY 2.0"
    },
    {
      src: "assets/photos/capetown.jpg",
      title: "桌山的褶皱",
      place: "开普敦 · 南非",
      credit: "Dietmar Rabich / Wikimedia · CC BY-SA 4.0"
    },
    {
      src: "assets/photos/sydney.jpg",
      title: "歌剧院黄昏",
      place: "悉尼 · 澳大利亚",
      credit: "Benh LIEU SONG / Wikimedia · CC BY-SA 4.0"
    },
    {
      src: "assets/photos/rio.jpg",
      title: "糖面包山日出",
      place: "里约 · 巴西",
      credit: "Donatas Dabravolskas / Wikimedia · CC BY-SA 4.0"
    }
  ],
  html: `
  <div class="gallery">
    <header class="section-heading">
      <div>
        <p class="overline">LIGHT &amp; MEMORY</p>
        <h2>看见的，<span>都算数。</span></h2>
      </div>
      <p class="section-description">十二个真实的地方，十二段光。向下滚动，看完整的图片墙。</p>
    </header>

    <div class="masonry">{{GALLERY}}</div>

    <p class="gallery-foot">
      <span>所有照片来自 Wikimedia Commons</span>
      <span>·</span>
      <span>作者与授权见使用手册</span>
    </p>
  </div>`
});
