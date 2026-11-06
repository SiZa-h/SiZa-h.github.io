/* 展示框 · 01 首页 · 内容
   直接修改下面的 html 即可；按钮用 data-goto="编号-1" 跳转到其他分区。 */
RawaeaFrame.content("AA-FR-HM", {
  html: `
  <div class="home">
    <div class="hero-grid">
      <div class="hero-copy">
        <p class="overline">A QUIET CORNER IN THE COSMOS</p>
        <h1 class="display-title">在引力之外，<br><em>收藏一束光。</em></h1>
        <p class="lead">你好，我是 RaWaEa。这里没有算法投喂，也没有需要追赶的时间线——只有一些关于设计、代码与生活的观测记录，在黑暗里缓慢聚拢，成为可以靠近的光。</p>
        <div class="hero-actions">
          <button class="primary-action" type="button" data-goto="1">翻阅手记<span aria-hidden="true">↗</span></button>
          <button class="secondary-action" type="button" data-goto="4">发出信号</button>
        </div>
      </div>

      <aside class="quote-card" aria-label="手记">
        <span class="quote-mark" aria-hidden="true">“</span>
        <p>宇宙从不催促<br>任何一颗星。</p>
        <span class="quote-author">— 观测笔记 · 001</span>
      </aside>
    </div>

    <div class="home-metrics">
      <div class="metric"><strong>12</strong><span>篇观测</span></div>
      <div class="metric"><strong>08</strong><span>次试验</span></div>
      <div class="metric"><strong>∞</strong><span>好奇心</span></div>
      <div class="metric metric--now"><i></i><span>此刻 · 正在校准坐标</span></div>
    </div>
  </div>`
});
