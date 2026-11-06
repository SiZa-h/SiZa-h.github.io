/* 展示框 · 05 联系 · 内容
   data-copy="邮箱" 的按钮点击后会复制到剪贴板。 */
RawaeaFrame.content("AE-FR-CT", {
  html: `
  <div class="contact">
    <div class="contact-layout">
      <div class="contact-lead">
        <p class="overline">LET'S TALK</p>
        <h2 class="contact-title">发一束<br><span>信号给我。</span></h2>
        <p class="lead">无论是一次合作、一个还没成形的念头，还是只想分享一首歌，我都愿意接收。</p>
        <p class="contact-quote">“在足够远的地方，所有声音都会变成光。”</p>
      </div>

      <div class="contact-card">
        <span class="contact-label">SIGNAL / EMAIL</span>
        <button class="email-copy" type="button" data-copy="hello@rawaea.me">
          <span>hello@rawaea.me</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
        </button>

        <div class="social-list">
          <a class="social-link" href="https://github.com/SiZa-h" target="_blank" rel="noreferrer"><span>GitHub</span><span>↗</span></a>
        </div>

        <p class="contact-note">通常在 1–2 个工作日内回复。<br>如果邮件没有抵达，也可以在任意一个入口找到我。</p>
      </div>
    </div>
  </div>`
});
