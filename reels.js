/* =========================================================
   TEAM REELS — card stack + animated dot-grid background
   Loaded from app.js as an on-demand module when the reels section is near view.
   ========================================================= */

/* ---------- 1. card stack (drag / tilt / spotlight) ---------- */
(function () {
  "use strict";

  function init() {
    var stack = document.getElementById("teamReels");
    if (!stack) return;

    var cards = Array.prototype.slice.call(stack.querySelectorAll(".team-reel-card"));
    var total = cards.length;
    if (!total) return;

    var nextBtn = document.getElementById("reelsNext");
    var prevBtn = document.getElementById("reelsPrev");
    var progress = document.getElementById("reelsProgress");
    var currentNumber = document.getElementById("reelsCurrent");
    var list = document.getElementById("reelsList");

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ROT = [0, -6, 5, -3, 4, -5, 3]; /* resting angle per stack position */
    var SEND_DISTANCE = 110;            /* px you must drag to send a card to the back */
    var order = cards.map(function (_, i) { return i; }); /* order[0] = top card */
    var onScreen = true;
    var items = [];

    /* ---------- member list (built from the cards) ---------- */

    if (list) {
      cards.forEach(function (card, i) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.innerHTML = '<img class="rl-img" alt="" /><span class="rl-t"><strong></strong><em></em></span>';
        var photo = card.querySelector(":scope > img");
        b.querySelector("img").src = photo ? photo.getAttribute("src") : "";
        b.querySelector("strong").textContent = card.querySelector("h3").textContent;
        b.querySelector("em").textContent = card.querySelector(".team-reel-role").textContent;
        b.addEventListener("click", function () { goTo(i); });
        li.appendChild(b);
        list.appendChild(li);
        items.push(li);
      });
    }

    /* ---------- video ---------- */

    function setPlayIcon(card, playing) {
      var btn = card.querySelector('[data-action="play"]');
      if (!btn) return;
      btn.querySelector("i").className = playing ? "bi bi-pause-fill" : "bi bi-play-fill";
      btn.setAttribute("aria-label", playing ? "Pause intro" : "Play intro");
    }

    function playCard(card) {
      var video = card.querySelector(".team-reel-video");
      if (!video) return;
      if (!video.getAttribute("src") && video.dataset.src) video.src = video.dataset.src; /* lazy load */
      var p = video.play();
      if (p && p.catch) p.catch(function () { setPlayIcon(card, false); });
    }

    function stopCard(card) {
      var video = card.querySelector(".team-reel-video");
      if (!video) return;
      video.pause();
      card.classList.remove("is-playing");
      setPlayIcon(card, false);
    }

    cards.forEach(function (card) {
      var video = card.querySelector(".team-reel-video");
      if (!video) return;
      video.addEventListener("playing", function () {
        card.classList.add("is-playing");
        setPlayIcon(card, true);
      });
      video.addEventListener("pause", function () { setPlayIcon(card, false); });
    });

    /* ---------- layout ---------- */

    function layout() {
      cards.forEach(function (card, i) {
        var pos = order.indexOf(i);
        var top = pos === 0;
        card.style.zIndex = String(total - pos);
        card.style.opacity = pos < 3 ? "1" : "0";
        card.style.setProperty("--y", pos * 14 + "px");
        card.style.setProperty("--s", String(1 - pos * 0.05));
        card.style.setProperty("--r", ROT[pos % ROT.length] + "deg");
        card.style.setProperty("--dx", "0px");
        card.style.setProperty("--dy", "0px");
        card.style.setProperty("--tx", "0deg");
        card.style.setProperty("--ty", "0deg");
        card.classList.toggle("is-top", top);
        card.classList.remove("is-tilting");
        card.setAttribute("aria-hidden", top ? "false" : "true");
        if ("inert" in card) card.inert = !top;
      });
    }

    function syncVideo() {
      cards.forEach(function (card, i) {
        if (order[0] === i) { if (!reduceMotion && onScreen) playCard(card); }
        else stopCard(card);
      });
    }

    function syncUI() {
      var cur = order[0];
      if (progress) progress.style.width = ((cur + 1) / total) * 100 + "%";
      if (currentNumber) currentNumber.textContent = String(cur + 1).padStart(2, "0");
      items.forEach(function (li, i) { li.classList.toggle("on", i === cur); });
    }

    function render() { layout(); syncVideo(); syncUI(); }

    /* ---------- navigation ---------- */

    function step(dir) {
      if (dir > 0) order.push(order.shift());   /* top card goes to the back */
      else order.unshift(order.pop());          /* back card comes to the front */
      render();
    }

    function goTo(index) {
      var p = order.indexOf(index);
      if (p < 1) return;
      order = order.slice(p).concat(order.slice(0, p));
      render();
    }

    if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });
    if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });

    stack.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    });

    /* ---------- drag the top card ---------- */

    var drag = null;

    stack.addEventListener("pointerdown", function (e) {
      var card = e.target.closest(".team-reel-card");
      if (!card || !card.classList.contains("is-top")) return;
      if (e.target.closest(".team-reel-action")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, dy: 0, axis: null, card: card };
      card.classList.add("is-dragging");
      card.classList.remove("is-tilting");
      card.style.setProperty("--tx", "0deg");
      card.style.setProperty("--ty", "0deg");
      try { card.setPointerCapture(e.pointerId); } catch (err) {}
    });

    stack.addEventListener("pointermove", function (e) {
      if (drag && e.pointerId === drag.id) {
        drag.dx = e.clientX - drag.x;
        drag.dy = e.clientY - drag.y;
        if (!drag.axis && Math.hypot(drag.dx, drag.dy) > 8) {
          drag.axis = Math.abs(drag.dx) > Math.abs(drag.dy) * 1.15 ? "x" : "y";
          if (drag.axis === "y") {
            var verticalCard = drag.card;
            drag = null;
            verticalCard.classList.remove("is-dragging");
            layout();
            return;
          }
        }
        if (drag.axis !== "x") return;
        drag.card.style.setProperty("--dx", drag.dx + "px");
        drag.card.style.setProperty("--dy", drag.dy + "px");
        drag.card.style.setProperty("--r", drag.dx * 0.06 + "deg");
        return;
      }

      /* hover: 3D tilt + spotlight on the top card (mouse only) */
      if (e.pointerType !== "mouse" || reduceMotion) return;
      var card = stack.querySelector(".is-top");
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      if (px < 0 || px > 1 || py < 0 || py > 1) return;
      card.classList.add("is-tilting");
      card.style.setProperty("--tx", ((0.5 - py) * 10).toFixed(2) + "deg");
      card.style.setProperty("--ty", ((px - 0.5) * 12).toFixed(2) + "deg");
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
    });

    function endDrag(e, cancelled) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag;
      drag = null;
      d.card.classList.remove("is-dragging");
      if (!cancelled && d.axis === "x" && Math.abs(d.dx) > SEND_DISTANCE) step(d.dx < 0 ? 1 : -1);
      else layout(); /* snap back */
    }
    stack.addEventListener("pointerup", function (e) { endDrag(e, false); });
    stack.addEventListener("pointercancel", function (e) { endDrag(e, true); });

    stack.addEventListener("pointerleave", function () {
      if (drag) return;
      var card = stack.querySelector(".is-top");
      if (!card) return;
      card.classList.remove("is-tilting");
      card.style.setProperty("--tx", "0deg");
      card.style.setProperty("--ty", "0deg");
    });

    /* ---------- pause when off screen ---------- */

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        var card = cards[order[0]];
        if (onScreen && !reduceMotion) playCard(card);
        else stopCard(card);
      }, { threshold: 0.3 }).observe(stack);
    }

    /* ---------- card actions (play / like / share) ---------- */

    stack.addEventListener("click", function (e) {
      var btn = e.target.closest(".team-reel-action");
      if (!btn) return;
      var action = btn.getAttribute("data-action");
      var icon = btn.querySelector("i");
      var card = btn.closest(".team-reel-card");

      if (action === "play") {
        var video = card.querySelector(".team-reel-video");
        if (!video) return;
        if (video.paused) playCard(card); else video.pause();
      }

      if (action === "like") {
        var liked = btn.classList.toggle("liked");
        btn.setAttribute("aria-pressed", liked ? "true" : "false");
        icon.className = liked ? "bi bi-heart-fill" : "bi bi-heart";
      }

      if (action === "share") {
        var name = card.querySelector("h3").textContent;
        var url = location.origin + location.pathname + "#reels";
        if (navigator.share) {
          navigator.share({ title: name, url: url }).catch(function () {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            icon.className = "bi bi-check2";
            setTimeout(function () { icon.className = "bi bi-share"; }, 1500);
          });
        }
      }
    });

    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* ---------- 2. background: interactive dot grid ---------- */
/* Dots pulse in a slow diagonal wave, then light up orange and get
   pushed away from the pointer. On touch screens (no pointer) a soft
   light orbits on its own so the section never looks empty. */
(function () {
  "use strict";

  function init() {
    var cv = document.getElementById("reelsBg");
    if (!cv) return;

    var host = cv.parentElement;
    var ctx = cv.getContext("2d");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    var GAP = 30, RADIUS = 170, PUSH = 22;
    var w = 0, h = 0, dpr = 1, cols = 0, rows = 0, off = null;
    var mx = -9999, my = -9999, t = 0, visible = true;

    function fit() {
      w = host.clientWidth;
      h = host.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(w * dpr));
      cv.height = Math.max(1, Math.round(h * dpr));
      cols = Math.ceil(w / GAP) + 1;
      rows = Math.ceil(h / GAP) + 1;
      off = new Float32Array(cols * rows * 2);
      draw();
    }

    function draw() {
      var px = mx, py = my;
      if (!reduce && (!fine || mx < -999)) { /* idle: orbiting light */
        px = w * (0.5 + Math.cos(t * 0.5) * 0.32);
        py = h * (0.5 + Math.sin(t * 0.7) * 0.28);
      }

      ctx.clearRect(0, 0, cv.width, cv.height);
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var i = (r * cols + c) * 2;
          var ox = c * GAP, oy = r * GAP;
          var dx = ox - px, dy = oy - py;
          var d = Math.sqrt(dx * dx + dy * dy) || 1;
          var f = d < RADIUS ? 1 - d / RADIUS : 0;

          /* spring offset away from the light */
          off[i] += (dx / d * f * f * PUSH - off[i]) * 0.14;
          off[i + 1] += (dy / d * f * f * PUSH - off[i + 1]) * 0.14;

          var wave = 0.5 + 0.5 * Math.sin((ox + oy) * 0.008 - t * 1.2);
          var alpha = 0.13 + wave * 0.13 + f * 0.75;
          var size = 1.5 + wave * 0.6 + f * 2.8;

          ctx.fillStyle =
            "rgba(" + Math.round(21 + 234 * f) + "," + Math.round(23 + 41 * f) + "," + Math.round(28 - 28 * f) + "," + alpha.toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc((ox + off[i]) * dpr, (oy + off[i + 1]) * dpr, size * dpr, 0, 6.2832);
          ctx.fill();
        }
      }
    }

    fit();
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(host);
    else window.addEventListener("resize", fit);

    if (reduce) return; /* one static frame */

    if (fine) {
      host.addEventListener("pointermove", function (e) {
        var b = host.getBoundingClientRect();
        mx = e.clientX - b.left;
        my = e.clientY - b.top;
      }, { passive: true });
      host.addEventListener("pointerleave", function () { mx = my = -9999; });
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(host);
    }

    (function loop() {
      requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      t += 0.016;
      draw();
    })();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
