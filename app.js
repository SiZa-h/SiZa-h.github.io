/* ============================================================
   RaWaEa · 寰宇观测站
   ------------------------------------------------------------
   1. 背景：NASA 黑洞影像池，随机更换；
   2. 从「轮盘/」读取配置，生成轮盘；
   3. 从「展示框/」按编号读取对应子文件夹的配置与内容；
   4. 轮盘切换时，展示框内容切换，页面自身不滚动。
   ============================================================ */

(function () {
  "use strict";

  const TAU = Math.PI * 2;
  const pad = (value) => String(value).padStart(2, "0");
  const $ = (selector, root = document) => root.querySelector(selector);

  /* ---------------- 黑洞影像池 ---------------- */

  const BLACKHOLES = [
    { src: "assets/blackholes/01-tidal.jpg", credit: "NASA/JPL-Caltech · PIA20027" },
    { src: "assets/blackholes/02-echo.jpg", credit: "NASA/JPL-Caltech · PIA23866" },
    { src: "assets/splash-blackhole.jpg", credit: "NASA/JPL-Caltech · PIA22085" }
  ];

  const cosmosState = {
    layer: "a",
    index: -1,
    changedAt: 0,
    timer: null
  };

  /* ---------------- 图标库 ---------------- */

  const ICONS = {
    home: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.7"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-19 12 12)"/></svg>`,
    writing: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.6 7h14.8M4.6 12h14.8M4.6 17h9.4"/><circle cx="18.2" cy="17" r="1.1"/></svg>`,
    projects: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4.2" r="1.5"/><circle cx="19.1" cy="16.2" r="1.5"/><circle cx="4.9" cy="16.2" r="1.5"/><path d="M12 7.2v1.8M14.6 13.5l2.7 1.6M9.4 13.5l-2.7 1.6"/></svg>`,
    gallery: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.4"/><path d="M6.2 6.6 9.7 10.1M17.8 17.4l-3.5-3.5"/></svg>`,
    contact: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 15.6a8.6 8.6 0 0 1 0-7.2M8.2 13.9a4.6 4.6 0 0 1 0-3.8"/><path d="M12.6 12h7.2"/><circle cx="4.4" cy="12" r="1.1"/></svg>`,
    planet: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="10.6" r="5.6"/><path d="M4.2 15.6c3.4 2.2 8.6 2.6 12.2.6M6.2 19.2c3.1 1.9 7.5 2.2 10.6.4"/></svg>`,
    orbit: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2.4"/><ellipse cx="12" cy="12" rx="9.4" ry="4.2" transform="rotate(-28 12 12)"/><circle cx="19.6" cy="7.4" r="1.4"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.4 4.3a8.1 8.1 0 1 0 4.3 10.9 6.5 6.5 0 0 1-4.3-10.9Z"/></svg>`
  };

  /* ---------------- 状态与注册表 ---------------- */

  const state = {
    entries: [],
    frames: new Map(),
    contents: new Map(),
    contentJobs: new Map(),
    payload: null,
    index: 0,
    rotation: 0,
    step: 72,
    token: 0,
    ready: false,
    entered: false
  };

  let pendingFrameDir = "";
  const scriptJobs = new Map();

  /* ---------------- DOM ---------------- */

  const dom = {};

  function cacheDom() {
    dom.body = document.body;
    dom.app = $("#app");
    dom.wheelPanel = $("#wheelPanel");
    dom.wheelTrack = $("#wheelTrack");
    dom.wheelCounter = $("#wheelCounter");
    dom.centerIndex = $("#centerIndex");
    dom.centerName = $("#centerName");
    dom.frame = $("#displayFrame");
    dom.frameNumber = $("#frameNumber");
    dom.frameEyebrow = $("#frameEyebrow");
    dom.frameName = $("#frameName");
    dom.frameMeta = $("#frameMeta");
    dom.frameBody = $("#frameBody");
    dom.frameContent = $("#frameContent");
    dom.frameNote = $("#frameNote");
    dom.frameProgress = $("#frameProgress");
    dom.frameHead = $("#frameHead");
    dom.reader = $("#reader");
    dom.readerMeta = $("#readerMeta");
    dom.readerTitle = $("#readerTitle");
    dom.readerBody = $("#readerBody");
    dom.readerScroll = $("#readerScroll");
    dom.toast = $("#toast");
    dom.cursorGlow = $("#cursorGlow");
    dom.localTime = $("#localTime");
    dom.bootError = $("#bootError");
    dom.bootErrorText = $("#bootErrorText");
    dom.splash = $("#splash");
    dom.splashEnter = $("#splashEnter");
    dom.cosmosPhotoA = $("#cosmosPhotoA");
    dom.cosmosPhotoB = $("#cosmosPhotoB");
    dom.cosmosCredit = $("#cosmosCredit");
  }

  /* ---------------- 黑洞背景：随机更换 ---------------- */

  function applyBlackhole(index) {
    const item = BLACKHOLES[index];
    if (!item || !dom.cosmosPhotoA || !dom.cosmosPhotoB) return;

    const useA = cosmosState.layer === "a";
    const next = useA ? dom.cosmosPhotoA : dom.cosmosPhotoB;
    const prev = useA ? dom.cosmosPhotoB : dom.cosmosPhotoA;

    next.style.backgroundImage = `url("${item.src}")`;
    next.classList.add("is-on");
    prev.classList.remove("is-on");

    cosmosState.layer = useA ? "b" : "a";
    cosmosState.index = index;
    cosmosState.changedAt = performance.now();

    if (dom.cosmosCredit) {
      dom.cosmosCredit.textContent = item.credit;
    }
  }

  function rotateBlackhole() {
    if (!BLACKHOLES.length) return;

    let next = Math.floor(Math.random() * BLACKHOLES.length);
    if (BLACKHOLES.length > 1 && next === cosmosState.index) {
      next = (next + 1) % BLACKHOLES.length;
    }
    applyBlackhole(next);
  }

  function startBlackholeRotation() {
    const forced = Number((/[?&]bh=(\d+)/.exec(window.location.search) || [])[1]);
    const valid = Number.isInteger(forced) && forced >= 1 && forced <= BLACKHOLES.length;
    applyBlackhole(valid ? forced - 1 : Math.floor(Math.random() * BLACKHOLES.length));

    window.clearInterval(cosmosState.timer);
    cosmosState.timer = window.setInterval(() => {
      if (document.hidden) return;
      rotateBlackhole();
    }, 70000);
  }

  /* ---------------- 配置装载 ---------------- */

  function loadScript(src) {
    if (scriptJobs.has(src)) return scriptJobs.get(src);

    const job = new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.src = src;
      element.async = false;
      element.onload = () => resolve(src);
      element.onerror = () => reject(new Error("无法加载：" + src));
      document.head.appendChild(element);
    });

    scriptJobs.set(src, job);
    return job;
  }

  function joinPath(dir, file) {
    return `${String(dir).replace(/\/+$/, "")}/${file}`;
  }

  function prefixOf(code) {
    return String(code || "").slice(0, 2).toUpperCase();
  }

  function sortByCode(a, b) {
    return prefixOf(a.code).localeCompare(prefixOf(b.code));
  }

  window.RawaeaWheel = {
    add(entry) {
      if (!entry || typeof entry.code !== "string") {
        console.warn("轮盘配置缺少 code，已跳过：", entry);
        return;
      }
      state.entries.push(entry);
    }
  };

  window.RawaeaFrame = {
    define(config) {
      if (!config || typeof config.code !== "string") {
        console.warn("展示框配置缺少 code，已跳过：", config);
        return;
      }
      config.dir = pendingFrameDir;
      state.frames.set(prefixOf(config.code), config);
    },
    content(code, payload) {
      state.contents.set(code, payload || {});
    }
  };

  function showBootError(title, detail) {
    if (!dom.bootError) return;
    dom.bootError.hidden = false;
    dom.bootErrorText.textContent = `${title}${detail ? "：" + detail : ""}`;
    dom.body.classList.add("is-ready");
  }

  async function bootstrap() {
    try {
      await loadScript("轮盘/索引.js");
    } catch (error) {
      showBootError("找不到轮盘索引", "轮盘/索引.js");
      return;
    }

    const wheelFiles = (window.RAW_WHEEL_INDEX && window.RAW_WHEEL_INDEX.files) || [];
    const wheelResults = await Promise.allSettled(wheelFiles.map((file) => loadScript(file)));
    wheelResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.warn(wheelFiles[index], result.reason);
      }
    });

    state.entries = state.entries.filter((entry) => entry && entry.code).sort(sortByCode);

    if (!state.entries.length) {
      showBootError("轮盘里没有任何分区", "请检查 轮盘/索引.js 与各分区配置");
      return;
    }

    try {
      await loadScript("展示框/索引.js");
    } catch (error) {
      console.warn("展示框索引缺失", error);
    }

    const frameList = (window.RAW_FRAME_INDEX && window.RAW_FRAME_INDEX.frames) || [];
    for (const item of frameList) {
      if (!item || !item.dir || !item.config) continue;
      pendingFrameDir = item.dir;
      try {
        await loadScript(joinPath(item.dir, item.config));
      } catch (error) {
        console.warn("展示框配置缺失：", item.dir, error);
      }
    }

    state.step = 360 / state.entries.length;
    buildWheel();

    const deepLink = /^#s(\d+)$/.exec(window.location.hash);
    if (deepLink) {
      const target = Number(deepLink[1]) - 1;
      state.index = Math.min(state.entries.length - 1, Math.max(0, target));
      state.rotation = -state.index * state.step;
    }

    syncWheel();
    await renderSection(state.index, { instant: true });

    state.ready = true;
    dom.body.classList.add("is-ready");
    sizeWheel();
  }

  /* ---------------- 轮盘 ---------------- */

  function buildWheel() {
    dom.wheelTrack.innerHTML = "";

    state.entries.forEach((entry, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wheel-item";
      button.style.setProperty("--angle", `${index * state.step + 90}deg`);
      button.dataset.index = String(index);
      button.setAttribute("aria-label", `切换到${entry.name}`);
      button.innerHTML = `
        <span class="wheel-item-inner">
          <span class="wheel-icon">${ICONS[entry.icon] || ICONS.orbit}</span>
          <span class="wheel-item-copy">
            <span class="wheel-item-number">${pad(index + 1)}</span>
            <span class="wheel-item-name">${escapeHtml(entry.name)}</span>
          </span>
        </span>`;
      button.addEventListener("click", () => navigateTo(index));
      dom.wheelTrack.appendChild(button);
    });
  }

  const wheelItems = () => [...dom.wheelTrack.querySelectorAll(".wheel-item")];

  function syncWheel() {
    dom.wheelTrack.style.setProperty("--rot", `${state.rotation}deg`);
    wheelItems().forEach((item, index) => {
      item.classList.toggle("is-active", index === state.index);
      item.setAttribute("aria-current", index === state.index ? "page" : "false");
    });

    const entry = state.entries[state.index];
    dom.wheelCounter.textContent = `${pad(state.index + 1)} / ${pad(state.entries.length)}`;
    dom.centerIndex.textContent = pad(state.index + 1);
    dom.centerName.textContent = entry ? entry.name : "";
  }

  function navigateTo(index, options = {}) {
    const total = state.entries.length;
    if (!total) return;

    const next = ((index % total) + total) % total;
    if (next === state.index && !options.force) return;

    const forward = (next - state.index + total) % total;
    const steps = forward > total / 2 ? forward - total : forward;

    state.rotation -= steps * state.step;
    state.index = next;
    syncWheel();
    renderSection(next, options);
  }

  function step(direction) {
    const total = state.entries.length;
    state.rotation -= direction * state.step;
    state.index = (state.index + direction + total) % total;
    syncWheel();
    renderSection(state.index);
  }

  /* ---------------- 展示框 ---------------- */

  function ensureContent(frame) {
    if (!frame) return Promise.resolve(null);
    if (state.contentJobs.has(frame.code)) return state.contentJobs.get(frame.code);

    const job = (async () => {
      const files = Array.isArray(frame.content) ? frame.content : [];
      const results = await Promise.allSettled(
        files.map((file) => loadScript(joinPath(frame.dir, file)))
      );
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.warn("内容文件缺失：", joinPath(frame.dir, files[index]), result.reason);
        }
      });
      return state.contents.get(frame.code) || null;
    })();

    state.contentJobs.set(frame.code, job);
    return job;
  }

  async function renderSection(index, options = {}) {
    const entry = state.entries[index];
    if (!entry) return;

    const token = ++state.token;
    const frame = state.frames.get(prefixOf(entry.code));

    applyAccent(entry);
    updateFrameChrome(entry, frame, index);

    dom.frameBody.classList.add("is-loading");
    dom.frame.setAttribute("aria-busy", "true");

    let payload = null;
    if (frame) {
      try {
        payload = await ensureContent(frame);
      } catch (error) {
        console.warn(error);
      }
    }

    if (token !== state.token) return;
    state.payload = payload || null;
    dom.frameContent.innerHTML = buildContentHtml(payload, frame, entry);
    watchGalleryImages();
    dom.frameBody.classList.remove("is-loading");
    dom.frame.removeAttribute("aria-busy");

    if (!options.preserveScroll) {
      dom.frameBody.scrollTop = 0;
    }
    updateProgress();

    dom.frameContent.classList.remove("is-entering");
    void dom.frameContent.offsetWidth;
    dom.frameContent.classList.add("is-entering");

    if (!options.instant) {
      dom.frameHead.classList.remove("is-swapping");
      void dom.frameHead.offsetWidth;
      dom.frameHead.classList.add("is-swapping");
    }

    document.title = `RaWaEa · ${entry.name}`;

    if (state.entered && performance.now() - cosmosState.changedAt > 6000) {
      rotateBlackhole();
    }
  }

  function updateFrameChrome(entry, frame, index) {
    dom.frameNumber.textContent = pad(index + 1);
    dom.frameEyebrow.textContent =
      (frame && frame.eyebrow) || entry.kicker || entry.english || "OBSERVATORY";
    dom.frameName.textContent = (frame && frame.name) || entry.name || "";
    dom.frameMeta.innerHTML = `
      <span>${escapeHtml((frame && frame.english) || entry.english || "SECTION")}</span>
      <span>${pad(index + 1)} / ${pad(state.entries.length)}</span>`;
    dom.frameNote.textContent =
      (frame && frame.note) || "受引力约束的一小块安静";
  }

  function buildContentHtml(payload, frame, entry) {
    if (!payload || !payload.html) {
      return missingContentHtml(frame, entry);
    }
    return String(payload.html)
      .replace("{{POSTS}}", buildPostRows(payload.posts))
      .replace("{{GALLERY}}", buildGalleryRows(payload.gallery));
  }

  function buildGalleryRows(items) {
    if (!Array.isArray(items) || !items.length) {
      return `<p class="masonry-empty">还没有图片。</p>`;
    }
    return items
      .map((item) => {
        const src = escapeHtml(item.src || "");
        const alt = escapeHtml(item.alt || item.title || "光影");
        const title = item.title ? `<span>${escapeHtml(item.title)}</span>` : "";
        const place = item.place ? `<small>${escapeHtml(item.place)}</small>` : "";
        const caption = title || place ? `<figcaption>${title}${place}</figcaption>` : "";
        const credit = item.credit ? ` title="${escapeHtml(item.credit)}"` : "";
        return `<figure class="masonry-item"${credit}><img src="${src}" alt="${alt}" loading="lazy" decoding="async">${caption}</figure>`;
      })
      .join("");
  }

  function watchGalleryImages() {
    if (!dom.frameContent) return;
    dom.frameContent.querySelectorAll(".masonry-item img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0) img.classList.add("is-broken");
      img.addEventListener("error", () => img.classList.add("is-broken"), { once: true });
    });
  }

  function buildPostRows(posts) {
    if (!Array.isArray(posts) || !posts.length) {
      return `<p class="empty-note">还没有写下的笔记。</p>`;
    }
    return posts
      .map(
        (post, index) => `
        <button class="post-row" type="button" data-post="${index}">
          <span class="post-date">${escapeHtml(post.date || "")}</span>
          <span class="post-title">${escapeHtml(post.title || "")}</span>
          <span class="post-tags">${escapeHtml(post.tags || "")}</span>
          <span class="post-arrow" aria-hidden="true">↗</span>
        </button>`
      )
      .join("");
  }

  function missingContentHtml(frame, entry) {
    const expected = frame
      ? joinPath(frame.dir, (frame.content && frame.content[0]) || "内容文件.js")
      : `展示框/${prefixOf(entry.code)}-FR-XX-“${entry.name}”/`;

    return `
      <div class="frame-empty">
        <p class="overline">NO SIGNAL</p>
        <h2>这一站还没有收到内容。</h2>
        <p>轮盘编号 <code>${escapeHtml(prefixOf(entry.code))}</code> 已经就位，但展示框没有读到对应的配置文件或内容文件。</p>
        <p class="frame-empty-path">期望路径：<code>${escapeHtml(expected)}</code></p>
        <p class="frame-empty-note">请核对 <code>展示框/索引.js</code> 中的登记，以及配置文件里的 <code>content</code> 列表。</p>
      </div>`;
  }

  /* ---------------- 主题 ---------------- */

  function applyAccent(entry) {
    document.documentElement.style.setProperty("--accent", entry.accent || "#f4d29b");
  }

  /* ---------------- 轮盘尺寸 ---------------- */

  function sizeWheel() {
    if (!dom.wheelPanel) return;

    const root = document.documentElement;

    if (window.innerWidth <= 880) {
      root.style.removeProperty("--wheel-size");
      return;
    }

    const wrap = dom.wheelPanel.querySelector(".wheel-wrap");
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    if (!rect.height) return;

    const size = Math.max(320, Math.min(700, Math.floor(rect.height - 6)));
    root.style.setProperty("--wheel-size", `${size}px`);
  }

  /* ---------------- 展示框滚动 ---------------- */

  function updateProgress() {
    if (!dom.frameProgress || !dom.frameBody) return;
    const max = dom.frameBody.scrollHeight - dom.frameBody.clientHeight;
    const ratio = max > 12 ? dom.frameBody.scrollTop / max : 0;
    dom.frameProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    dom.frameBody.classList.toggle("is-scrolled", dom.frameBody.scrollTop > 6);
  }

  /* ---------------- 阅读层 ---------------- */

  function openReader(index) {
    const posts = (state.payload && state.payload.posts) || [];
    const post = posts[index];
    if (!post) return;

    dom.readerMeta.innerHTML = `
      <span>${escapeHtml(post.date || "")}</span>
      <span>${escapeHtml(post.tags || "")}</span>
      <span>${escapeHtml(post.reading || "")}</span>`;
    dom.readerTitle.textContent = post.title || "";
    dom.readerBody.innerHTML = post.body || "";
    dom.readerScroll.scrollTop = 0;
    dom.reader.classList.add("is-open");
    dom.reader.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      const back = dom.reader.querySelector(".reader-back");
      if (back) back.focus();
    }, 80);
  }

  function closeReader() {
    dom.reader.classList.remove("is-open");
    dom.reader.setAttribute("aria-hidden", "true");
  }

  function readerOpen() {
    return dom.reader.classList.contains("is-open");
  }

  /* ---------------- 开屏 ---------------- */

  function enterSite() {
    if (state.entered) return;

    state.entered = true;
    document.body.classList.add("is-entered");

    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }

    window.setTimeout(() => {
      if (!dom.splash) return;
      dom.splash.setAttribute("aria-hidden", "true");
      dom.splash.inert = true;
    }, 1350);
  }

  /* ---------------- 通用交互 ---------------- */

  let toastTimer = null;

  function showToast(message) {
    clearTimeout(toastTimer);
    dom.toast.textContent = message;
    dom.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), 2400);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("邮箱已复制");
    } catch (error) {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
        showToast("邮箱已复制");
      } catch (fallbackError) {
        showToast("复制失败，请手动选择");
      }
      field.remove();
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function scrollFrame(direction) {
    if (!dom.frameBody) return;
    const amount = Math.max(160, dom.frameBody.clientHeight * 0.72);
    dom.frameBody.scrollBy({ top: direction * amount, behavior: "smooth" });
  }

  /* ---------------- 时钟 ---------------- */

  function clock() {
    const now = new Date();
    if (dom.localTime) {
      dom.localTime.textContent = `LOCAL ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }
  }

  /* ---------------- 事件绑定 ---------------- */

  function bindEvents() {
    let lastNavigation = 0;

    if (dom.splash) {
      dom.splash.addEventListener("click", (event) => {
        if (event.target.closest("#splashEnter")) return;
        enterSite();
      });
    }

    if (dom.splashEnter) {
      dom.splashEnter.addEventListener("click", (event) => {
        event.preventDefault();
        enterSite();
      });
    }

    window.addEventListener(
      "wheel",
      (event) => {
        if (state.entered) return;
        event.preventDefault();
        enterSite();
      },
      { passive: false }
    );

    dom.wheelPanel.addEventListener(
      "wheel",
      (event) => {
        if (readerOpen()) return;
        event.preventDefault();

        const now = performance.now();
        if (now - lastNavigation < 640) return;

        const delta =
          Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        if (Math.abs(delta) < 6) return;

        lastNavigation = now;
        step(delta > 0 ? 1 : -1);
      },
      { passive: false }
    );

    let touchStart = null;
    dom.wheelPanel.addEventListener(
      "touchstart",
      (event) => {
        touchStart = event.touches[0] ? event.touches[0].clientY : null;
      },
      { passive: true }
    );
    dom.wheelPanel.addEventListener(
      "touchend",
      (event) => {
        if (touchStart == null) return;
        const endY = event.changedTouches[0] ? event.changedTouches[0].clientY : touchStart;
        const delta = endY - touchStart;
        touchStart = null;
        if (Math.abs(delta) > 36) step(delta < 0 ? 1 : -1);
      },
      { passive: true }
    );

    $("#prevButton").addEventListener("click", () => step(-1));
    $("#nextButton").addEventListener("click", () => step(1));

    const brand = $("[data-home]");
    if (brand) {
      brand.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(0);
      });
    }

    dom.frameContent.addEventListener("click", (event) => {
      const goto = event.target.closest("[data-goto]");
      if (goto) {
        const index = Number(goto.dataset.goto);
        if (Number.isFinite(index)) navigateTo(index);
        return;
      }

      const post = event.target.closest("[data-post]");
      if (post) {
        openReader(Number(post.dataset.post));
        return;
      }

      const copy = event.target.closest("[data-copy]");
      if (copy) {
        copyText(copy.dataset.copy);
      }
    });

    dom.frameBody.addEventListener("scroll", updateProgress, { passive: true });

    dom.reader.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-reader]")) closeReader();
    });

    document.addEventListener("keydown", (event) => {
      if (!state.entered) {
        if (["Tab", "Shift", "Control", "Alt", "Meta", "Escape"].includes(event.key)) return;
        event.preventDefault();
        enterSite();
        return;
      }

      if (event.key === "Escape" && readerOpen()) {
        closeReader();
        return;
      }
      if (readerOpen()) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select")) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        scrollFrame(-1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        scrollFrame(1);
      } else if (event.key === "PageUp") {
        event.preventDefault();
        scrollFrame(-1.4);
      } else if (event.key === "PageDown") {
        event.preventDefault();
        scrollFrame(1.4);
      } else if (event.key === "Home") {
        event.preventDefault();
        navigateTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        navigateTo(state.entries.length - 1);
      }
    });

    window.addEventListener("resize", () => {
      sizeWheel();
      updateProgress();
    });

    if (typeof ResizeObserver === "function" && dom.wheelPanel) {
      const wrap = dom.wheelPanel.querySelector(".wheel-wrap");
      if (wrap) {
        let frame = 0;
        const observer = new ResizeObserver(() => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(sizeWheel);
        });
        observer.observe(wrap);
      }
    }

    bindPointerLight();
  }

  function bindPointerLight() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    window.addEventListener(
      "pointermove",
      (event) => {
        if (dom.cursorGlow) {
          dom.cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        }
      },
      { passive: true }
    );

    dom.body.classList.add("has-pointer");
  }

  /* ---------------- 启动 ---------------- */

  function init() {
    cacheDom();

    /* 静帧模式：地址栏加 ?still 可关闭所有入场动画，便于截图与调试 */
    if (/[?&]still\b/.test(window.location.search)) {
      document.documentElement.classList.add("is-still");
    }

    clock();
    window.setInterval(clock, 20000);
    bindEvents();
    startBlackholeRotation();
    sizeWheel();

    if (/[?&]enter\b/.test(window.location.search)) {
      enterSite();
    }

    bootstrap();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
