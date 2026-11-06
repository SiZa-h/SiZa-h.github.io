/* 展示框 · 03 项目 · 内容
   每个 <article class="project-card"> 就是一张作品卡，复制即可新增。 */
RawaeaFrame.content("AC-FR-PJ", {
  html: `
  <div class="projects">
    <header class="section-heading">
      <div>
        <p class="overline">THINGS I BUILD</p>
        <h2>把想法，<span>造成星体。</span></h2>
      </div>
      <p class="section-description">从一颗小小的尘埃开始，慢慢让它拥有自己的引力。</p>
    </header>

    <div class="project-grid">
      <article class="project-card">
        <div class="project-top"><span>WEB APP / 01</span><span class="project-state"><i></i>进行中</span></div>
        <div class="project-number">/ 001</div>
        <h3>Perihelion</h3>
        <p>面向碎片灵感的本地优先笔记工具：安静、离线、克制，像一次靠近却不必着陆的经过。</p>
        <div class="tag-row"><span class="tag">Next.js</span><span class="tag">IndexedDB</span><span class="tag">Motion</span></div>
      </article>

      <article class="project-card">
        <div class="project-top"><span>DESIGN SYSTEM / 02</span><span class="project-state"><i></i>开源</span></div>
        <div class="project-number">/ 002</div>
        <h3>Lumen UI</h3>
        <p>一套强调空间、层级与触感的前端组件实验，让界面有更细的呼吸。</p>
        <div class="tag-row"><span class="tag">TypeScript</span><span class="tag">CSS</span><span class="tag">A11y</span></div>
      </article>

      <article class="project-card">
        <div class="project-top"><span>EXPERIMENT / 03</span><span class="project-state"><i></i>长期</span></div>
        <div class="project-number">/ 003</div>
        <h3>Still</h3>
        <p>关于声音与视觉的极小交互实验，每次打开只显示一个瞬间。</p>
        <div class="tag-row"><span class="tag">Web Audio</span><span class="tag">Canvas</span></div>
      </article>

      <article class="project-card">
        <div class="project-top"><span>WORKFLOW / 04</span><span class="project-state"><i></i>归档</span></div>
        <div class="project-number">/ 004</div>
        <h3>Orbit</h3>
        <p>为个人工作流搭建的自动化控制台，连接写作、归档与发布。</p>
        <div class="tag-row"><span class="tag">Node.js</span><span class="tag">CLI</span><span class="tag">Cron</span></div>
      </article>
    </div>
  </div>`
});
