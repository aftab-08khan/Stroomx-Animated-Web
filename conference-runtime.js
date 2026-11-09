const TESTVID = "data:";
      /* StroomX — app.js (v3, written against the real index.html + style.css)
   No GSAP needed. The loader (#ld) is run by the inline script in the HTML;
   this file hooks into it through window.stxReady(fn). Edit CONFIG / SERVICES / TEAM below. */
      (() => {
        "use strict";

        /* ===================== CONTENT — EDIT THESE ===================== */
        const CONFIG = {
          formEndpoint: "", // e.g. "https://formspree.io/f/xxxxxxx". Empty = opens the visitor's email app.
          contactEmail: "hello@stroomx.com",
          reelVideo: TESTVID, // e.g. "assets/stroomx-reel.mp4" (replaces the broken Pixabay sources)
          reelYouTubeId: "", // optional: YouTube video id for a looping background (uses the .rfw CSS)
          fullVideoUrl: "", // target of the "Watch the full video" button (hidden while empty)
        };

        const SERVICES = [
          {
            t: "Strategy",
            tag: "Plan",
            d: "A clear map of where your business is and where it flows next.",
            p: [
              "Business and flow audit",
              "Priority roadmap",
              "Success metrics",
            ],
          },
          {
            t: "Experience design",
            tag: "Design",
            d: "Interfaces your customers and teams actually enjoy using.",
            p: ["Research and journeys", "Prototypes", "Design systems"],
          },
          {
            t: "Automation",
            tag: "Automate",
            d: "Remove the manual hand-offs that slow everything down.",
            p: ["Workflow automation", "Tool integrations", "Approval flows"],
          },
          {
            t: "Data & insight",
            tag: "Measure",
            d: "One trusted view of the numbers behind your decisions.",
            p: ["Dashboards", "Data pipelines", "Reporting"],
          },
          {
            t: "Web & apps",
            tag: "Build",
            d: "Fast, reliable products shipped in small, visible releases.",
            p: ["Websites", "Web apps", "Mobile"],
          },
          {
            t: "Integration",
            tag: "Connect",
            d: "Join up the systems that were never meant to be apart.",
            p: ["APIs", "ERP / CRM sync", "Legacy bridges"],
          },
          {
            t: "Growth",
            tag: "Grow",
            d: "Turn smoother operations into measurable momentum.",
            p: ["Funnel analysis", "Experiments", "Lifecycle"],
          },
          {
            t: "Support",
            tag: "Care",
            d: "We stay after launch to measure, refine and keep it moving.",
            p: ["Monitoring", "Training", "Continuous improvement"],
          },
        ];

        const TEAM = [
          {
            n: "Emmanuel Rego",
            r: "CEO",
            img: "./assets/teams/Emmanuel-Rego-CEO-black.jpg",
          },
          { n: "Ajmal Khan", r: "CTO", img: "./assets/teams/Ajmal.jpeg" },
          {
            n: "Shahed Khan",
            r: "Curriculum Lead",
            img: "./assets/teams/Shahed.jpeg",
          },
          {
            n: "Nishant Verma",
            r: "Sales Manager",
            img: "./assets/teams/Nishant-Verma.jpg",
          },
        ];

        const LOCATIONS = [
          [28.54, -81.38, "Las Vegas", "r"],
          [38.72, -9.14, "California", "l"],
          // Americas
          [43.65, -79.38, "Canada", "r"],
          [-33.45, -70.67, "Chile", "l"],
          [18.11, -77.3, "Jamaica & Caribbean", "r"],
          [39.83, -98.58, "United States", "r"],

          // Europe
          [48.86, 2.35, "France", "l"],
          [53.35, -6.26, "Ireland", "r"],
          [41.9, 12.5, "Italy", "l"],
          [54.69, 25.28, "Lithuania", "r"],
          [49.61, 6.13, "Luxembourg", "l"],
          [52.23, 21.01, "Poland", "r"],
          [44.43, 26.1, "Romania", "r"],
          [46.95, 7.45, "Switzerland", "l"],
          [39.93, 32.85, "Turkey", "r"],
          [51.51, -0.13, "United Kingdom", "l"],

          // Middle East & Africa
          [26.07, 50.55, "Bahrain", "r"],
          [29.38, 47.98, "Kuwait", "l"],
          [31.79, -7.09, "Morocco", "r"],
          [9.08, 8.68, "Nigeria", "l"],
          [25.2, 55.27, "United Arab Emirates", "r"],

          // Asia Pacific
          [-33.87, 151.21, "Australia", "r"],
          [28.61, 77.21, "India", "l"],
          [-6.21, 106.85, "Indonesia", "r"],
          [3.14, 101.69, "Malaysia", "l"],
          [47.92, 106.92, "Mongolia", "r"],
          [-36.85, 174.76, "New Zealand", "r"],
          [14.6, 120.98, "Philippines", "l"],
          [1.35, 103.82, "Singapore", "r"],
          [13.76, 100.5, "Thailand", "l"],
          [21.03, 105.85, "Vietnam", "r"],
        ];

        /* ===================== helpers ===================== */
        const $ = (s, r = document) => r.querySelector(s);
        const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const finePointer = matchMedia(
          "(hover: hover) and (pointer: fine)",
        ).matches;
        const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
        const el = (tag, props = {}, kids = []) => {
          const e = Object.assign(document.createElement(tag), props);
          kids.forEach((k) => e.append(k));
          return e;
        };
        const whenReady = (fn) =>
          typeof window.stxReady === "function" ? window.stxReady(fn) : fn();
        const root = document.documentElement;

        /* ===================== progress + anchors ===================== */
        function initProgress() {
          const bar = $(".progress");
          const update = () => {
            const max = root.scrollHeight - innerHeight;
            if (bar)
              bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
          };
          addEventListener("scroll", update, { passive: true });
          update();
          document.addEventListener("click", (e) => {
            const a = e.target.closest && e.target.closest('a[href^="#"]');
            if (!a || a.getAttribute("href") === "#") return;
            const t = $(a.getAttribute("href"));
            if (!t) return;
            e.preventDefault();
            t.scrollIntoView({
              behavior: reduced ? "auto" : "smooth",
              block: "start",
            });
          });
        }

        /* ===================== hero headline ===================== */
        function initHero() {
          const h = $("#hero-title");
          if (!h) return;
          const text = h.textContent.trim();
          h.setAttribute("aria-label", text);
          h.textContent = "";
          const spans = text.split(/\s+/).map((word, i) => {
            const inner = el("span", { textContent: word });
            inner.setAttribute("aria-hidden", "true");
            if (!reduced) {
              inner.style.transform = "translateY(110%)";
              inner.style.transition = `transform .95s cubic-bezier(.2,.8,.2,1) ${i * 90}ms`;
            }
            h.append(el("span", { className: "w" }, [inner]), " ");
            return inner;
          });
          whenReady(() =>
            requestAnimationFrame(() =>
              spans.forEach((s) => (s.style.transform = "none")),
            ),
          );
        }

        /* ===================== marquee ===================== */
        function initMarquee() {
          const mq = $("#mq");
          if (!mq || reduced || !mq.animate) return;
          mq.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
            { duration: 30000, iterations: Infinity, easing: "linear" },
          );
        }

        /* ===================== custom cursor (#cd dot, #cr ring) ===================== */
        function initCursor() {
          if (!finePointer || reduced) return;
          const dot = el("div", { id: "cd" }, [el("i")]);
          const ring = el("div", { id: "cr" }, [el("b", {}, [el("em")])]);
          document.body.append(ring, dot);
          const label = $("em", ring);
          root.classList.add("cu-on", "cu-hide");
          let mx = innerWidth / 2,
            my = innerHeight / 2,
            rx = mx,
            ry = my,
            state = "";
          const setState = (s, text) => {
            if (s === state && !text) return;
            state = s;
            if (s) root.dataset.cu = s;
            else delete root.dataset.cu;
            if (text !== undefined) label.textContent = text;
          };
          addEventListener(
            "pointermove",
            (e) => {
              mx = e.clientX;
              my = e.clientY;
              root.classList.remove("cu-hide");
              const t = e.target instanceof Element ? e.target : null;
              if (!t) return;
              if (t.closest(".fc")) setState("v", "View");
              else if (t.closest(".rib, .bricks, #gl")) setState("d", "Drag");
              else if (t.closest("a, button, label, .pill")) setState("h", "");
              else setState("", "");
            },
            { passive: true },
          );
          document.addEventListener("pointerleave", () =>
            root.classList.add("cu-hide"),
          );
          document.addEventListener("pointerdown", () =>
            root.classList.add("cu-dn"),
          );
          addEventListener("pointerup", () => root.classList.remove("cu-dn"));
          (function loop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
            ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
            requestAnimationFrame(loop);
          })();
        }

        /* ===================== background canvases ===================== */
        function fitCanvas(cv, w, h) {
          const dpr = Math.min(devicePixelRatio || 1, 2);
          cv.width = Math.max(1, Math.round(w * dpr));
          cv.height = Math.max(1, Math.round(h * dpr));
          return dpr;
        }

        // #cur — soft orange trail following the pointer (light sections)
        function initTrail() {
          const cv = $("#cur");
          if (!cv || !finePointer || reduced) return;
          const ctx = cv.getContext("2d");
          let dpr = fitCanvas(cv, innerWidth, innerHeight);
          addEventListener(
            "resize",
            () => (dpr = fitCanvas(cv, innerWidth, innerHeight)),
          );
          const pts = [];
          let px = -999,
            py = -999;
          addEventListener(
            "pointermove",
            (e) => {
              px = e.clientX;
              py = e.clientY;
            },
            { passive: true },
          );
          (function loop() {
            requestAnimationFrame(loop);
            if (document.hidden) return;
            const last = pts[pts.length - 1];
            pts.push(
              last
                ? {
                    x: last.x + (px - last.x) * 0.25,
                    y: last.y + (py - last.y) * 0.25,
                  }
                : { x: px, y: py },
            );
            if (pts.length > 26) pts.shift();
            ctx.clearRect(0, 0, cv.width, cv.height);
            pts.forEach((p, i) => {
              const k = i / pts.length,
                r = (40 + k * 110) * dpr;
              const g = ctx.createRadialGradient(
                p.x * dpr,
                p.y * dpr,
                0,
                p.x * dpr,
                p.y * dpr,
                r,
              );
              g.addColorStop(0, `rgba(255,122,69,${0.07 * k})`);
              g.addColorStop(1, "rgba(255,122,69,0)");
              ctx.fillStyle = g;
              ctx.beginPath();
              ctx.arc(p.x * dpr, p.y * dpr, r, 0, 7);
              ctx.fill();
            });
          })();
        }

        // #curDark — flowing lines behind the services section
        function initFlowLines() {
          const cv = $("#curDark");
          if (!cv) return;
          const host = cv.parentElement,
            ctx = cv.getContext("2d");
          let w = 0,
            h = 0,
            dpr = 1,
            vis = true,
            my = 0.5,
            t = 0;
          const fit = () => {
            w = host.clientWidth;
            h = host.clientHeight;
            dpr = fitCanvas(cv, w, h);
          };
          fit();
          addEventListener("resize", fit);
          new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(
            host,
          );
          host.addEventListener(
            "pointermove",
            (e) => {
              const r = host.getBoundingClientRect();
              my = (e.clientY - r.top) / r.height;
            },
            { passive: true },
          );
          const draw = () => {
            ctx.clearRect(0, 0, cv.width, cv.height);
            for (let k = 0; k < 7; k++) {
              ctx.beginPath();
              for (let x = 0; x <= w; x += 12) {
                const y =
                  h * (0.2 + k * 0.1) +
                  Math.sin(x * 0.006 + t + k) * (30 + my * 40) +
                  Math.sin(x * 0.013 - t * 1.3 + k * 2) * 14;
                x ? ctx.lineTo(x * dpr, y * dpr) : ctx.moveTo(0, y * dpr);
              }
              ctx.strokeStyle = `rgba(255,64,0,${0.07 + k * 0.02})`;
              ctx.lineWidth = 1.5 * dpr;
              ctx.stroke();
            }
          };
          if (reduced) return draw();
          (function loop() {
            requestAnimationFrame(loop);
            if (!vis || document.hidden) return;
            t += 0.012;
            draw();
          })();
        }

        /* =========================================================
   GLOBE v2 — StroomX
   In app.js, replace the whole `function initGlobe() { ... }`
   (the one under the "globe" comment banner) with everything below.
   Needs nothing new: it uses the helpers already in app.js
   ($, clamp, el, fitCanvas, reduced, LOCATIONS).
   ========================================================= */

        /* 180 x 90 land mask (2° cells, row 0 = 89°N, col 0 = 179°W), bit-packed + base64 */
        const GLOBE_LAND = (window.STROOMX_GLOBE_LAND =
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAD/////4AAAAAAAAAAAAAAAAAAAAAAAP/////4AAfAAAAAAAAAAAAAAAAAAAAH8P///wAAAAAAAAAPAAAAAAAAAAAPAPwAf//wAAAAADAAP/wAAAAAAAAADwHB4AP//gAAAAAMAD///8AAAAABgAAf4B/AH//gAAAwAAHH/////8AAAP///vg7P8H/+AAAP+AA/v////////+///////H+H/gAAAf/7///////////gf/////8B8D8A+AA+f////////////Af/////4AYB4AAAD5/////////////Af/////gHgAwAAAH5///////////P4ADwH///gHkAAAAAG4/////////+AcAADAA///wH+AAAAGCx/////////wA8AAIAAf///H/AAAAKCD/////////wA4AAAAAf///v/wAAAbv//////////9AwAAAAAP/////gAAADf//////////9AAAAAAAH////8YAAAB///////////9AAAAAAAD//w/8IAAAB///////////5AAAAAAAD//9P+AAAAB/f7fH//////wAAAAAAAD//9/gAAAAfxnwHP//////jAAAAAAAD///+AAAAAPiT//v/////eAAAAAAAAD///+AAAAAfAKf/n////+MCAAAAAAAB///8AAAAAOCRP/n/////mMAAAAAAAA///8AAAAAH+AC///////E8AAAAAAAAf//wAAAAAP/AA///////BgAAAAAAAAP//gAAAAAf/73///////gAAAAAAAAAL/AwAAAAAf////f/////gAAAAAAAAAF+AQAAAAB///+/n/////AAAAAAAAAAC+AAAAAAB///+fwD///+gAAAAAAAAAAeAQAAAAD////f/B///8gAAAAAAAAAAfEEAAAAD////v+B/j/AAAAAAAAAAAAPMBwAAAD////n+A/B+gAAAAAAAAAAAD8AAAAAD////38AeB+AgAAAAAAAAAAAPAAAAAH////3gAcAfAgAAAAAAAAAAADAAAAAD////6AAcAfgAAAAAAAAAAAABBgAAAD/////wAMATAYAAAAAAAAAAAA7+AAAB/////gAIASAIAAAAAAAAAAAAH/gAAA/////gACAIAYAAAAAAAAAAAAH/8AAAKH///AAAAoCAAAAAAAAAAAAAH/+AAAAB//+AAAA0OAAAAAAAAAAAAAP/+AAAAB//8AAAAceQAAAAAAAAAAAAP//AAAAB/94AAAAMewwAAAAAAAAAAAP//8AAAB//wAAAAGdg+AAAAAAAAAAAf///AAAA//gAAAACAAPgAAAAAAAAAAP///gAAA//wAAAABwAHwAAAAAAAAAAH///AAAAf/wAAAAAAACQAAAAAAAAAAH///AAAAf/wAAAAAAAAAAAAAAAAAAAD//+AAAAf/wgAAAAABxAAAAAAAAAAAD//8AAAA//wgAAAAAPxgAAAAAAAAAAA//8AAAA//jgAAAAAP9gAAAAAAAAAAAf/8AAAA//DgAAAAAf/gAAAAAAAAAAAf/8AAAAf/DAAAAAD//4AAAAAAAAAAAf/wAAAAf/DAAAAAH//4AAAAAAAAAAAf/gAAAAP+CAAAAAH//8AAAAAAAAAAAf/AAAAAP+AAAAAAH//+AAAAAAAAAAA/+AAAAAP8AAAAAAH//+AAAAAAAAAAA/+AAAAAH4AAAAAAD//8AAAAAAAAAAA/8AAAAAHwAAAAAAD4f8AAAAAAAAAAA/gAAAAAAAAAAAAAAAH4AAAAAAAAAAB/gAAAAAAAAAAAAAAAD4AEAAAAAAAAB+AAAAAAAAAAAAAAAAAAAGAAAAAAAAB8AAAAAAAAAAAAAAAAAwAMAAAAAAAAB8AAAAAAAAAAAAAAAAAQAYAAAAAAAAB4AAAAAAAAAAAAAAAAAAAgAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAD////+AAAAAAAAAAAADAAAAAAAH//8//////4AAAAAAAAAAAOAAAAP/////////////8AAAAAAAAAP+AAAH//////////////+AAAAB/////+AAB////////////////AAAP///////4B/////////////////gAf////////////////////////////D/////////////////////////////f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");

        function initGlobe() {
          const cv = $("#gl");
          if (!cv) return;
          const ctx = cv.getContext("2d");
          const gw = cv.closest(".gw");
          const INK = "#15171c",
            ORANGE = "#ff4000";
          const TAU = Math.PI * 2;

          /* ---------- data ---------- */
          const REGIONS = {
            "Dubai 2026": ["United Arab Emirates"],
            "Las Vegas 2024": ["Las Vegas"],
            "Las Vegas 2022": ["Las Vegas"],
          };
          const vec = (la, lo, r = 1) => {
            const p = (la * Math.PI) / 180,
              l = (lo * Math.PI) / 180;
            return [
              r * Math.cos(p) * Math.sin(l),
              r * Math.sin(p),
              r * Math.cos(p) * Math.cos(l),
            ];
          };
          const unit = LOCATIONS.map(([a, b]) => vec(a, b));
          const names = LOCATIONS.map((l) => l[2]);
          const regionOf = names.map(
            (n) =>
              Object.keys(REGIONS).find((k) => REGIONS[k].includes(n)) || "",
          );

          /* land dots: even spacing over the sphere, kept only where the mask says land */
          const bytes = Uint8Array.from(atob(GLOBE_LAND), (c) =>
            c.charCodeAt(0),
          );
          const isLand = (lat, lon) => {
            const x = Math.floor(((((lon + 180) % 360) + 360) % 360) / 2) % 180;
            const y = clamp(Math.floor((90 - lat) / 2), 0, 89),
              i = y * 180 + x;
            return (bytes[i >> 3] >> (7 - (i & 7))) & 1;
          };
          const dots = [];
          const STEP = 2.5;
          for (let la = -86, row = 0; la <= 86; la += STEP, row++) {
            const n = Math.max(
              1,
              Math.round((360 * Math.cos((la * Math.PI) / 180)) / STEP),
            );
            for (let i = 0; i < n; i++) {
              const lo = (i + (row % 2) * 0.5) * (360 / n) - 180;
              if (isLand(la, lo)) dots.push(vec(la, lo));
            }
          }

          /* flow network: minimum spanning tree over great-circle distance, so arcs link
     neighbours instead of criss-crossing the planet */
          const dist = (a, b) =>
            Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
          const edges = [];
          {
            const inTree = new Set([0]);
            while (inTree.size < unit.length) {
              let best = null;
              inTree.forEach((i) =>
                unit.forEach((_, j) => {
                  if (inTree.has(j)) return;
                  const d = dist(unit[i], unit[j]);
                  if (!best || d < best.d) best = { i, j, d };
                }),
              );
              edges.push(best);
              inTree.add(best.j);
            }
          }
          const arcs = edges.map(({ i, j, d }) => {
            const a = unit[i],
              b = unit[j],
              s = Math.sin(d) || 1,
              lift = clamp(d * 0.4, 0.05, 0.32),
              pts = [];
            for (let k = 0; k <= 28; k++) {
              const f = k / 28,
                A = Math.sin((1 - f) * d) / s,
                B = Math.sin(f * d) / s,
                h = 1 + lift * Math.sin(Math.PI * f);
              pts.push([
                (a[0] * A + b[0] * B) * h,
                (a[1] * A + b[1] * B) * h,
                (a[2] * A + b[2] * B) * h,
              ]);
            }
            return pts;
          });

          /* ---------- state ---------- */
          let S = 0,
            dpr = 1,
            vis = true,
            last = performance.now();
          let lon0 = 0.6,
            lat0 = 0.35,
            vel = 0,
            auto = 1;
          let drag = false,
            lx = 0,
            ly = 0,
            lt = 0,
            moved = 0;
          let hover = -1,
            selected = -1,
            region = "All",
            target = null;
          const pinScreen = unit.map(() => ({ x: 0, y: 0, z: -1 }));
          const labelAlpha = unit.map(() => 0),
            labelSlot = unit.map(() => 0);
          const widthCache = {};
          const angDiff = (a, b) =>
            ((((a - b + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

          const fit = () => {
            S = cv.clientWidth || 400;
            dpr = fitCanvas(cv, S, S);
          };
          fit();
          addEventListener("resize", fit);
          new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(
            cv,
          );

          const view = ([X, Y, Z]) => {
            const x = X * Math.cos(lon0) - Z * Math.sin(lon0),
              z0 = X * Math.sin(lon0) + Z * Math.cos(lon0);
            return {
              x,
              y: Math.cos(lat0) * Y - Math.sin(lat0) * z0,
              z: Math.sin(lat0) * Y + Math.cos(lat0) * z0,
            };
          };

          /* ---------- region chips (built here, no HTML edits needed) ---------- */
          const chips = el("div", { className: "gl-chips" });
          chips.setAttribute("role", "group");
          chips.setAttribute("aria-label", "Focus the globe on a region");
          const setRegion = (name) => {
            region = name;
            selected = -1;
            $$("button", chips).forEach((b) => {
              b.classList.toggle("on", b.textContent === name);
              b.setAttribute("aria-pressed", String(b.textContent === name));
            });
            if (name === "All") {
              target = null;
              return;
            }
            const m = unit
              .filter((_, i) => regionOf[i] === name)
              .reduce(
                (s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]],
                [0, 0, 0],
              );
            const len = Math.hypot(...m);
            target = {
              lon: Math.atan2(m[0], m[2]),
              lat: clamp(Math.asin(m[1] / len) * 0.8, -0.9, 0.9),
            };
          };
          ["All", ...Object.keys(REGIONS)].forEach((n) => {
            const b = el("button", { type: "button", textContent: n });
            b.addEventListener("click", () => setRegion(n));
            chips.append(b);
          });
          if (gw) gw.append(chips);
          setRegion("All");
          window.__setRegion = setRegion;

          /* ---------- pointer: drag to rotate, hover / tap a pin ---------- */
          const pointerPx = (e) => {
            const r = cv.getBoundingClientRect(),
              k = (S * dpr) / r.width;
            return [(e.clientX - r.left) * k, (e.clientY - r.top) * k];
          };
          const pinAt = (px, py) => {
            let best = -1,
              bd = 18 * dpr;
            pinScreen.forEach((p, i) => {
              if (p.z < 0.1 || (region !== "All" && regionOf[i] !== region))
                return;
              const d = Math.hypot(p.x - px, p.y - py);
              if (d < bd) {
                bd = d;
                best = i;
              }
            });
            return best;
          };
          cv.addEventListener("pointerdown", (e) => {
            drag = true;
            lx = e.clientX;
            ly = e.clientY;
            lt = performance.now();
            vel = 0;
            moved = 0;
            cv.setPointerCapture(e.pointerId);
          });
          cv.addEventListener("pointermove", (e) => {
            if (!drag) {
              hover = pinAt(...pointerPx(e));
              cv.style.cursor = hover >= 0 ? "pointer" : "";
              return;
            }
            const dx = e.clientX - lx,
              dy = e.clientY - ly,
              now = performance.now();
            moved += Math.abs(dx) + Math.abs(dy);
            if (moved > 6) target = null;
            const dl = -dx * 0.006;
            lon0 += dl;
            vel = clamp(dl / Math.max((now - lt) / 1000, 0.008), -6, 6);
            lat0 = clamp(lat0 + dy * 0.004, -0.9, 0.9);
            lx = e.clientX;
            ly = e.clientY;
            lt = now;
          });
          const release = (e) => {
            if (!drag) return;
            drag = false;
            if (moved <= 6) {
              /* a tap: select / clear a pin */
              const i = pinAt(...pointerPx(e));
              selected = i === selected ? -1 : i;
              if (selected >= 0) {
                const u = unit[selected];
                target = {
                  lon: Math.atan2(u[0], u[2]),
                  lat: clamp(Math.asin(u[1]) * 0.85, -0.9, 0.9),
                };
              }
            }
          };
          cv.addEventListener("pointerup", release);
          cv.addEventListener("pointercancel", () => (drag = false));
          cv.addEventListener("pointerleave", () => {
            if (!drag) hover = -1;
          });

          /* ---------- label layout ---------- */
          const SLOT_ANGLES = [
            0, -0.45, 0.45, -0.9, 0.9, -1.4, 1.4, 3.14, -2.7, 2.7, -2.2, 2.2,
          ];
          const RINGS = [10, 36, 66, 100]; /* distance from pin, in css px */
          const SLOTS = RINGS.flatMap((d, r) =>
            SLOT_ANGLES.map((a, k) => ({
              d,
              a,
              id: r * SLOT_ANGLES.length + k,
            })),
          );

          function layoutLabels(W, fs) {
            const pad = 5 * dpr,
              h = fs + 12 * dpr,
              rects = [],
              out = [];
            ctx.font = `600 ${fs}px Barlow, system-ui, sans-serif`;
            const pins = pinScreen.map((p, i) => ({ ...p, i }));
            const cand = [];
            names.forEach((n, i) => {
              const p = pinScreen[i];
              const show =
                p.z > 0.25 && (region === "All" || regionOf[i] === region);
              if (!show) {
                labelAlpha[i] += (0 - labelAlpha[i]) * 0.3;
                return;
              }
              const key = n + fs;
              if (!widthCache[key])
                widthCache[key] = ctx.measureText(n).width + 18 * dpr;
              cand.push(i);
            });
            /* priority: hovered / selected, then labels already on screen (so they don't jump), then front-most */
            cand.sort((a, b) => {
              const pa =
                a === hover || a === selected ? 2 : labelAlpha[a] > 0.5 ? 1 : 0;
              const pb =
                b === hover || b === selected ? 2 : labelAlpha[b] > 0.5 ? 1 : 0;
              return pb - pa || pinScreen[b].z - pinScreen[a].z;
            });
            const free = (rx, ry, bw, i) => {
              if (
                rx < 4 * dpr ||
                ry < 4 * dpr ||
                rx + bw > W - 4 * dpr ||
                ry + h > W - 4 * dpr
              )
                return false;
              for (const r of rects)
                if (
                  rx < r.x + r.w + pad &&
                  rx + bw + pad > r.x &&
                  ry < r.y + r.h + pad &&
                  ry + h + pad > r.y
                )
                  return false;
              for (const p of pins)
                if (
                  p.i !== i &&
                  p.z > 0.05 &&
                  p.x > rx - 8 * dpr &&
                  p.x < rx + bw + 8 * dpr &&
                  p.y > ry - 8 * dpr &&
                  p.y < ry + h + 8 * dpr
                )
                  return false;
              return true;
            };
            cand.forEach((i) => {
              const p = pinScreen[i],
                bw = widthCache[names[i] + fs],
                base = LOCATIONS[i][3] === "l" ? Math.PI : 0;
              const place = (s) => {
                const a = base + s.a,
                  d = s.d * dpr,
                  cx = p.x + Math.cos(a) * (d + bw / 2),
                  cy = p.y + Math.sin(a) * (d + h / 2);
                return {
                  x: cx - bw / 2,
                  y: cy - h / 2,
                  w: bw,
                  h,
                  d: s.d,
                  id: s.id,
                };
              };
              /* try the slot this label used last frame first, then every other slot in order */
              const order = [
                SLOTS[labelSlot[i]],
                ...SLOTS.filter((s) => s.id !== labelSlot[i]),
              ];
              let spot = null;
              for (const s of order) {
                const r = place(s);
                if (free(r.x, r.y, bw, i)) {
                  spot = r;
                  break;
                }
              }
              const priority = i === hover || i === selected;
              if (!spot && priority)
                spot = place(SLOTS[0]); /* the one you point at always shows */
              const depth = clamp((p.z - 0.25) * 4, 0, 1);
              if (spot) {
                rects.push(spot);
                labelSlot[i] = spot.id;
                labelAlpha[i] += (depth - labelAlpha[i]) * 0.2;
              } else
                labelAlpha[i] +=
                  (0 - labelAlpha[i]) * 0.3; /* no room: pin only */
              const r = place(SLOTS[labelSlot[i]]);
              out.push({
                i,
                rect: r,
                alpha: labelAlpha[i] * (spot ? 1 : labelAlpha[i]),
              });
            });
            return out;
          }

          /* ---------- frame ---------- */
          function frame(now) {
            requestAnimationFrame(frame);
            if (!vis || document.hidden) {
              last = now;
              return;
            }
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            if (target && !drag) {
              const k = Math.min(1, dt * 4);
              lon0 += angDiff(target.lon, lon0) * k;
              lat0 += (target.lat - lat0) * k;
            } else if (!drag) {
              const speed =
                reduced || region !== "All" || hover >= 0 || selected >= 0
                  ? 0
                  : 1;
              auto += (speed - auto) * Math.min(1, dt * 3);
              lon0 += (0.21 * auto + vel) * dt;
              vel *= Math.exp(-dt * 3.2);
            }
            if (Math.abs(lon0) > 20) lon0 = angDiff(lon0, 0);
            draw(now / 1000);
          }

          function draw(t) {
            const W = S * dpr,
              R = W * 0.42,
              c = W / 2;
            ctx.clearRect(0, 0, W, W);
            const sx = (q) => c + q.x * R,
              sy = (q) => c - q.y * R;

            /* graticule */
            ctx.strokeStyle = "rgba(21,23,28,.09)";
            ctx.lineWidth = dpr;
            ctx.beginPath();
            const trace = (fn, n) => {
              let pen = false;
              for (let k = 0; k <= n; k++) {
                const q = view(fn(k / n));
                if (q.z <= 0) {
                  pen = false;
                  continue;
                }
                pen ? ctx.lineTo(sx(q), sy(q)) : ctx.moveTo(sx(q), sy(q));
                pen = true;
              }
            };
            for (let lo = -180; lo < 180; lo += 30)
              trace((f) => vec(-90 + f * 180, lo), 36);
            for (let la = -60; la <= 60; la += 30)
              trace((f) => vec(la, -180 + f * 360), 72);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(c, c, R, 0, TAU);
            ctx.strokeStyle = "rgba(21,23,28,.16)";
            ctx.stroke();

            /* land, bucketed by depth so it costs five fills */
            const buckets = [[], [], [], [], []],
              dotR = clamp(S / 280, 1.1, 2.1) * dpr;
            for (const u of dots) {
              const q = view(u);
              if (q.z <= 0) continue;
              buckets[Math.min(4, (q.z * 5) | 0)].push(sx(q), sy(q));
            }
            ctx.fillStyle = INK;
            buckets.forEach((b, k) => {
              ctx.globalAlpha = [0.2, 0.36, 0.55, 0.74, 0.9][k];
              ctx.beginPath();
              for (let i = 0; i < b.length; i += 2) {
                ctx.moveTo(b[i] + dotR, b[i + 1]);
                ctx.arc(b[i], b[i + 1], dotR * (0.6 + k * 0.1), 0, TAU);
              }
              ctx.fill();
            });
            ctx.globalAlpha = 1;

            /* flow arcs: a faint base line, marching dashes, and a pulse travelling each link */
            const seen = (q) => q.z > 0 || q.x * q.x + q.y * q.y > 1;
            const strokeArcs = () => {
              ctx.beginPath();
              arcs.forEach((pts) => {
                let pen = false;
                pts.forEach((p) => {
                  const q = view(p);
                  if (!seen(q)) {
                    pen = false;
                    return;
                  }
                  pen ? ctx.lineTo(sx(q), sy(q)) : ctx.moveTo(sx(q), sy(q));
                  pen = true;
                });
              });
              ctx.stroke();
            };
            ctx.lineWidth = 3 * dpr;
            ctx.strokeStyle = "rgba(21,23,28,.10)";
            strokeArcs();
            ctx.lineWidth = 1.4 * dpr;
            ctx.strokeStyle = "#fff";
            ctx.setLineDash([4 * dpr, 6 * dpr]);
            ctx.lineDashOffset = reduced ? 0 : -t * 16 * dpr;
            strokeArcs();
            ctx.setLineDash([]);
            if (!reduced) {
              arcs.forEach((pts, n) => {
                const f = (t * 0.11 + n * 0.173) % 1,
                  k = f * (pts.length - 1),
                  a = pts[k | 0],
                  b = pts[Math.min((k | 0) + 1, pts.length - 1)],
                  m = k - (k | 0);
                const q = view([
                  a[0] + (b[0] - a[0]) * m,
                  a[1] + (b[1] - a[1]) * m,
                  a[2] + (b[2] - a[2]) * m,
                ]);
                if (!seen(q)) return;
                ctx.beginPath();
                ctx.arc(sx(q), sy(q), 2.6 * dpr, 0, TAU);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(sx(q), sy(q), 1.2 * dpr, 0, TAU);
                ctx.fillStyle = ORANGE;
                ctx.fill();
              });
            }

            /* pins */
            unit.forEach((u, i) => {
              const q = view(u),
                p = pinScreen[i];
              p.x = sx(q);
              p.y = sy(q);
              p.z = q.z;
              if (q.z <= 0.05) return;
              const dim = region !== "All" && regionOf[i] !== region,
                on = i === hover || i === selected;
              const ph = (t * 1.4 + i * 0.5) % 2,
                k = on ? 1.35 : 1;
              ctx.globalAlpha = clamp(q.z * 4, 0, 1) * (dim ? 0.35 : 1);
              ctx.beginPath();
              ctx.arc(p.x, p.y, 6 * k * dpr, 0, TAU);
              ctx.fillStyle = "#fff";
              ctx.fill();
              ctx.beginPath();
              ctx.arc(p.x, p.y, 3 * k * dpr, 0, TAU);
              ctx.fillStyle = ORANGE;
              ctx.fill();
              if (!dim) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, (7 + ph * 11) * dpr, 0, TAU);
                ctx.strokeStyle = `rgba(255,255,255,${0.7 - ph * 0.35})`;
                ctx.lineWidth = dpr;
                ctx.stroke();
              }
            });
            ctx.globalAlpha = 1;

            /* labels: placed so none overlap each other or another pin */
            const fs = Math.round(clamp(S / 46, 11, 14) * dpr);
            const labels = layoutLabels(W, fs);
            ctx.font = `600 ${fs}px Barlow, system-ui, sans-serif`;
            ctx.textBaseline = "middle";
            labels.forEach(({ i, rect: r, alpha }) => {
              /* leader lines first, under the pills */
              if (alpha < 0.03 || r.d < 30) return;
              const p = pinScreen[i];
              ctx.globalAlpha = alpha * 0.8;
              ctx.strokeStyle = INK;
              ctx.lineWidth = 1.2 * dpr;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(
                clamp(p.x, r.x, r.x + r.w),
                clamp(p.y, r.y, r.y + r.h),
              );
              ctx.stroke();
            });
            labels.forEach(({ i, rect: r, alpha }) => {
              if (alpha < 0.03) return;
              ctx.globalAlpha = alpha;
              ctx.fillStyle = i === hover || i === selected ? ORANGE : INK;
              ctx.beginPath();
              ctx.roundRect
                ? ctx.roundRect(r.x, r.y, r.w, r.h, r.h / 2)
                : ctx.rect(r.x, r.y, r.w, r.h);
              ctx.fill();
              ctx.fillStyle = "#fff";
              ctx.fillText(names[i], r.x + 9 * dpr, r.y + r.h / 2 + dpr);
            });
            ctx.globalAlpha = 1;
          }

          requestAnimationFrame(frame);
        }

        /* ===================== story (scroll-driven chapters) ===================== */
        function initStory() {
          const sec = $(".story");
          const chaps = $$(".chap", sec || document);
          if (!sec || !chaps.length) return;
          const dots = $$(".dots i b", sec);
          // pin the content: wrap children in a sticky 100svh stage, make the section tall
          const stage = el("div");
          while (sec.firstChild) stage.append(sec.firstChild);
          Object.assign(stage.style, {
            position: "sticky",
            top: "0",
            height: "100svh",
            overflow: "hidden",
          });
          sec.append(stage);
          const n = chaps.length;
          const size = () => {
            sec.style.height = innerHeight * (n + 1) + "px";
            sec.style.overflow = "visible";
          };
          size();
          addEventListener("resize", size);
          chaps.forEach((c, i) => {
            c.style.transition = reduced
              ? "none"
              : "opacity .6s, transform .6s";
            c.style.opacity = i ? "0" : "1";
            c.style.transform = i ? "translateY(30px)" : "none";
          });
          const update = () => {
            const r = sec.getBoundingClientRect(),
              total = sec.offsetHeight - innerHeight;
            const p = clamp(-r.top / Math.max(1, total), 0, 0.9999);
            const f = p * n,
              active = Math.floor(f);
            if (active !== window.__la) {
              window.__la = active;
              window.__edit && window.__edit(active);
            }
            chaps.forEach((c, i) => {
              c.style.opacity = i === active ? "1" : "0";
              c.style.transform =
                i === active
                  ? "none"
                  : i < active
                    ? "translateY(-30px)"
                    : "translateY(30px)";
            });
            dots.forEach(
              (b, i) =>
                (b.style.transform = `scaleX(${i < active ? 1 : i === active ? f - active : 0})`),
            );
          };
          addEventListener("scroll", update, { passive: true });
          addEventListener("resize", update);
          update();
        }

        /* ===================== services: ribbon + bricks + modal ===================== */
        function makeCard(i, tagName) {
          const s = SERVICES[i];
          const c = el(tagName, { className: `fc t${i % 4}` });
          if (tagName === "button") c.type = "button";
          const fn = el("div", { className: "fn" }, [
            el("u"),
            el("u"),
            el("u"),
          ]);
          $$("u", fn).forEach((u, j) => {
            if (j <= i % 3) u.style.opacity = "1";
          });
          const art = el("div", { className: "fa" });
          const round = i % 2;
          for (let j = 0; j < 3; j++) {
            const b = el("b");
            if (round)
              Object.assign(b.style, {
                left: j * 22 + "%",
                bottom: j * 14 + "%",
                width: 58 - j * 14 + "%",
                height: 58 - j * 14 + "%",
                borderRadius: "50%",
              });
            else
              Object.assign(b.style, {
                left: j * 34 + "%",
                bottom: "0",
                width: "26%",
                height: 32 + (((i + j * 2) * 17) % 58) + "%",
                borderRadius: "7px",
              });
            Object.assign(b.style, {
              background: "currentColor",
              opacity: String(0.22 + j * 0.2),
            });
            art.append(b);
          }
          c.append(
            el("div", { className: "fb" }, [
              el("i"),
              el("i"),
              el("i"),
              el("span", { textContent: s.tag }),
            ]),
            el("div", { className: "fcb" }, [
              fn,
              el("h3", { textContent: s.t }),
              el("p", { textContent: s.d }),
              art,
            ]),
            el("div", { className: "ft" }, [
              el("span", { textContent: "Explore" }),
            ]),
          );
          return c;
        }

        function initServices() {
          const sec = $("#services"),
            stage = $(".flow-stage", sec),
            rib = $("#rib"),
            world = $("#wd");
          const bk = $("#bk"),
            track = $("#tk"),
            modal = $("#md");
          if (!sec || !stage || !rib || !world || !bk || !track) return;

          const count = SERVICES.length;
          const cards = SERVICES.map((_, i) => makeCard(i, "button"));
          cards.forEach((card, i) => {
            card.dataset.i = String(i);
            card.setAttribute("aria-label", `${SERVICES[i].t} — open details`);
            world.append(card);
          });
          for (let row = 0; row < Math.ceil(count / 4); row++) {
            const line = el("div", { className: "row" });
            SERVICES.slice(row * 4, row * 4 + 4).forEach((_, index) => {
              const i = row * 4 + index,
                card = makeCard(i, "button");
              card.dataset.i = String(i);
              card.setAttribute(
                "aria-label",
                `${SERVICES[i].t} — open details`,
              );
              line.append(card);
            });
            track.append(line);
          }

          let view = "ribbon",
            target = 0,
            rendered = 0,
            frame = 0;
          let pointerId = null,
            startX = 0,
            startTarget = 0,
            dragging = false,
            dragged = false;
          let brickPointer = null,
            brickStartX = 0,
            brickStartScroll = 0,
            brickDragged = false;
          let previousFocus = null,
            previousOverflow = "";

          const size = () => {
            const viewport = stage.clientHeight || innerHeight;
            sec.style.height = `${Math.round(viewport * (1 + (count - 1) * 0.55))}px`;
            onScroll();
          };
          const range = () =>
            Math.max(1, sec.offsetHeight - stage.clientHeight);
          const progress = () =>
            clamp(-sec.getBoundingClientRect().top / range(), 0, 1);
          const topFor = (index) =>
            sec.getBoundingClientRect().top +
            scrollY +
            (clamp(index, 0, count - 1) / (count - 1)) * range();
          const scheduleRender = () => {
            if (!frame) frame = requestAnimationFrame(render);
          };
          const render = () => {
            frame = 0;
            const delta = target - rendered;
            rendered +=
              reduced || Math.abs(delta) < 0.002 ? delta : delta * 0.16;
            const cardWidth = cards[0].offsetWidth || 300;
            cards.forEach((card, i) => {
              const offset = i - rendered,
                distance = Math.abs(offset);
              const x =
                offset * cardWidth * 0.8 +
                Math.sin(offset * 0.8) * cardWidth * 0.14;
              const y =
                -offset * cardWidth * 0.3 +
                Math.cos(offset * 0.6) * cardWidth * 0.07;
              const z = -Math.pow(distance, 1.25) * cardWidth * 0.55;
              const rx = Math.sin(offset * 0.9) * 12;
              const ry = -offset * 46;
              const rz = -offset * 3.5 - Math.sin(offset * 0.7) * 3;
              const opacity = clamp((3.6 - distance) / 1.1, 0, 1);
              card.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
              card.style.opacity = String(opacity);
              card.style.visibility = opacity < 0.02 ? "hidden" : "visible";
              card.tabIndex = opacity < 0.02 ? -1 : 0;
            });
            if (Math.abs(target - rendered) >= 0.002) scheduleRender();
          };
          const setTarget = (value, syncScroll = false) => {
            target = clamp(value, 0, count - 1);
            if (syncScroll) scrollTo({ top: topFor(target), behavior: "auto" });
            scheduleRender();
          };
          const goTo = (index) => {
            const next = clamp(index, 0, count - 1);
            target = next;
            scrollTo({
              top: topFor(next),
              behavior: reduced ? "auto" : "smooth",
            });
            scheduleRender();
          };
          const onScroll = () => {
            const p = progress();
            if (view === "ribbon") setTarget(p * (count - 1));
            else
              bk.scrollLeft = p * Math.max(0, bk.scrollWidth - bk.clientWidth);
          };

          track.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "touch" || event.button !== 0) return;
            brickPointer = event.pointerId;
            brickStartX = event.clientX;
            brickStartScroll = bk.scrollLeft;
            brickDragged = false;
            bk.setPointerCapture(event.pointerId);
          });
          track.addEventListener("pointermove", (event) => {
            if (event.pointerId !== brickPointer) return;
            const distance = event.clientX - brickStartX;
            if (Math.abs(distance) > 4) {
              brickDragged = true;
              bk.classList.add("dg");
            }
            if (brickDragged) bk.scrollLeft = brickStartScroll - distance;
          });
          const endBrickDrag = (event) => {
            if (event.pointerId !== brickPointer) return;
            brickPointer = null;
            bk.classList.remove("dg");
          };
          bk.addEventListener("pointerup", endBrickDrag);
          bk.addEventListener("pointercancel", endBrickDrag);
          bk.addEventListener(
            "click",
            (event) => {
              if (brickDragged) {
                event.preventDefault();
                event.stopPropagation();
                brickDragged = false;
                return;
              }
              const card = event.target.closest(".fc");
              if (card && bk.contains(card)) openCard(Number(card.dataset.i));
            },
            true,
          );

          rib.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) return;
            pointerId = event.pointerId;
            startX = event.clientX;
            startTarget = target;
            dragging = false;
            dragged = false;
            const card = event.target.closest(".fc");
            (card || rib).setPointerCapture(event.pointerId);
          });
          rib.addEventListener("pointermove", (event) => {
            if (event.pointerId !== pointerId) return;
            const distance = event.clientX - startX;
            if (Math.abs(distance) > 4) dragging = true;
            if (!dragging) return;
            dragged = true;
            event.preventDefault();
            rib.classList.add("dg");
            setTarget(
              startTarget - distance / ((cards[0].offsetWidth || 300) * 0.8),
              true,
            );
          });
          const endRibbonDrag = (event) => {
            if (event.pointerId !== pointerId) return;
            pointerId = null;
            dragging = false;
            rib.classList.remove("dg");
          };
          rib.addEventListener("pointerup", endRibbonDrag);
          rib.addEventListener("pointercancel", endRibbonDrag);
          rib.addEventListener(
            "click",
            (event) => {
              if (dragged) {
                event.preventDefault();
                event.stopPropagation();
                dragged = false;
                return;
              }
              const card = event.target.closest(".fc");
              if (card && world.contains(card))
                openCard(Number(card.dataset.i));
            },
            true,
          );

          const openCard = (index) => {
            if (!modal || !Number.isInteger(index) || !SERVICES[index]) return;
            const service = SERVICES[index];
            const preview = makeCard(index, "div");
            preview.style.cursor = "default";
            $("#mp", modal)?.replaceChildren(preview);
            $("#mg", modal).textContent = service.tag;
            $("#mt", modal).textContent = service.t;
            $("#ml", modal).textContent = service.d;
            $("#mu", modal).replaceChildren(
              ...service.p.map((item) => el("li", { textContent: item })),
            );
            previousFocus = document.activeElement;
            previousOverflow = document.body.style.overflow;
            modal.classList.add("on");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            $("#mx", modal).focus();
          };
          const closeCard = () => {
            if (!modal?.classList.contains("on")) return;
            modal.classList.remove("on");
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
          };
          modal?.setAttribute("aria-hidden", "true");
          $("#mx", modal)?.addEventListener("click", closeCard);
          $("#mc", modal)?.addEventListener("click", closeCard);
          modal?.addEventListener("click", (event) => {
            if (event.target === modal) closeCard();
          });
          addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeCard();
          });

          $$(".vt button", sec).forEach((button) => {
            button.addEventListener("click", () => {
              view = button.dataset.v;
              sec.dataset.v = view;
              $$(".vt button", sec).forEach((item) =>
                item.classList.toggle("on", item === button),
              );
              onScroll();
            });
          });
          $("#pv", sec)?.addEventListener("click", () => {
            if (view === "ribbon") goTo(Math.ceil(target) - 1);
            else
              bk.scrollBy({
                left: -bk.clientWidth * 0.7,
                behavior: reduced ? "auto" : "smooth",
              });
          });
          $("#nx", sec)?.addEventListener("click", () => {
            if (view === "ribbon") goTo(Math.floor(target) + 1);
            else
              bk.scrollBy({
                left: bk.clientWidth * 0.7,
                behavior: reduced ? "auto" : "smooth",
              });
          });

          addEventListener("scroll", onScroll, { passive: true });
          addEventListener("resize", size);
          size();
        }

        /* ===================== reel ===================== */
        function initReel() {
          const sec = $("#reel"),
            v = $("#rv"),
            link = $("#rl");
          if (link) {
            const url =
              CONFIG.fullVideoUrl ||
              (CONFIG.reelYouTubeId
                ? "https://www.youtube.com/watch?v=" + CONFIG.reelYouTubeId
                : "");
            if (url) link.href = url;
            else link.style.display = "none";
          }
          if (!sec) return;
          if (CONFIG.reelYouTubeId) {
            const id = CONFIG.reelYouTubeId;
            const f = el("iframe", {
              src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1`,
              title: "",
            });
            f.setAttribute("allow", "autoplay; encrypted-media");
            f.setAttribute("aria-hidden", "true");
            f.tabIndex = -1;
            sec.prepend(el("div", { className: "rfw" }, [f]));
            if (v) v.remove();
            return;
          }
          if (!v) return;
          if (CONFIG.reelVideo) {
            v.replaceChildren(
              el("source", { src: CONFIG.reelVideo, type: "video/mp4" }),
            );
            v.load();
          }
          v.muted = true;
          new IntersectionObserver(
            (e) =>
              e.forEach((x) =>
                x.isIntersecting && !reduced
                  ? v.play().catch(() => {})
                  : v.pause(),
              ),
            { threshold: 0.15 },
          ).observe(v);
        }

        /* ===================== counters ===================== */
        function initCounters() {
          const run = (e) => {
            const target = Number(e.dataset.n ?? e.dataset.count);
            if (!Number.isFinite(target)) return;
            if (reduced) {
              e.textContent = target;
              return;
            }
            const t0 = performance.now(),
              dur = 1500;
            const step = (now) => {
              const p = Math.min((now - t0) / dur, 1);
              e.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          };
          const io = new IntersectionObserver(
            (en) =>
              en.forEach((x) => {
                if (x.isIntersecting) {
                  run(x.target);
                  io.unobserve(x.target);
                }
              }),
            { threshold: 0.4 },
          );
          $$(".count[data-n], [data-count]").forEach((c) => io.observe(c));
        }

        /* ===================== team ===================== */
        function initTeam() {
          const g = $("#tg");
          if (!g) return;
          TEAM.forEach((m) => {
            const pf = el("div", { className: "pf" }, [
              el("span", { textContent: m.n.charAt(0) }),
            ]);
            if (m.img)
              pf.append(el("img", { src: m.img, alt: m.n, loading: "lazy" }));
            g.append(
              el("article", { className: "tm" }, [
                pf,
                el("h3", { textContent: m.n }),
                el("p", { textContent: m.r }),
              ]),
            );
          });
        }

        /* ===================== process ===================== */
        function initProcess() {
          const steps = $(".process .steps"),
            fill = $(".process .fill");
          if (!steps) return;
          const items = $$(".step", steps);
          const update = () => {
            const r = steps.getBoundingClientRect();
            const p = clamp((innerHeight * 0.65 - r.top) / r.height, 0, 1);
            if (fill) fill.style.transform = `scaleY(${p})`;
            items.forEach((s, i) =>
              s.classList.toggle("on", p > (i + 0.15) / items.length),
            );
          };
          addEventListener("scroll", update, { passive: true });
          addEventListener("resize", update);
          update();
        }

        /* ===================== contact form ===================== */
        function initForm() {
          const f = $("#cf"),
            st = $("#st");
          if (!f) return;
          const say = (m, ok) => {
            if (st) {
              st.textContent = m;
              st.style.color = ok ? "#9be7b0" : "#ff9c8a";
            }
          };
          f.addEventListener("submit", async (e) => {
            e.preventDefault();
            const d = new FormData(f);
            const name = String(d.get("name") || "").trim(),
              email = String(d.get("email") || "").trim(),
              msg = String(d.get("msg") || "").trim();
            if (!name) return say("Please add your name.", false);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              return say("Please enter a valid email address.", false);
            if (!msg)
              return say("Please tell us where work gets stuck.", false);
            const btn = $(".send", f);
            if (CONFIG.formEndpoint) {
              btn.disabled = true;
              say("Sending…", true);
              try {
                const r = await fetch(CONFIG.formEndpoint, {
                  method: "POST",
                  headers: { Accept: "application/json" },
                  body: d,
                });
                if (!r.ok) throw new Error("bad status");
                f.reset();
                say("Thanks — we'll be in touch soon.", true);
              } catch {
                say(
                  "Couldn't send your message. Email us at " +
                    CONFIG.contactEmail +
                    ".",
                  false,
                );
              }
              btn.disabled = false;
            } else {
              const body = `Name: ${name}\nEmail: ${email}\nCompany: ${d.get("company") || ""}\nTopics: ${d.getAll("topic").join(", ")}\n\n${msg}`;
              say("Opening your email app…", true);
              location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent("Message from " + name)}&body=${encodeURIComponent(body)}`;
            }
          });
        }

        /* ===================== boot (each feature isolated) ===================== */

        /* ===================== StroomVerse content — EDIT THESE ===================== */
        const ED = [
          {
            k: "Dubai 2026",
            t: "StroomVerse 2026 · Dubai",
            p: "Five days, February 10–14, at the Grand Mercure Dubai: keynotes, workshops, a desert safari, Burj Khalifa and a dhow cruise with the Bricks 4 Kidz family.",
          },
          {
            k: "Las Vegas 2024",
            t: "StroomVerse 2024 · Las Vegas (sample)",
            p: "Sample copy. Replace with the real story, venue and film of the 2024 edition.",
          },
          {
            k: "California 2022",
            t: "StroomVerse 2022 · California (sample)",
            p: "Sample copy. Replace with the real story, venue and film of the 2022 edition.",
          },
        ];
        const AG = [
          [
            "Feb 10",
            [
              ["06:30 PM", "Registration", "Mohra Hall, Grand Mercure Dubai"],
              [
                "07:00 PM",
                "Meet and Greet",
                "Meet the StroomX team and the Bricks 4 Kidz family",
              ],
              ["08:00 PM", "Mocktail reception and dinner", "Until 10:00 PM"],
            ],
          ],
          [
            "Feb 11",
            [
              ["09:00 AM", "Opening keynote", "Chris Rego"],
              ["09:30 AM", "Business growth acceleration", "Ford Saeks"],
              ["10:45 AM", "The Resource Trade Tower", "Jerry Parchman"],
              ["11:30 AM", "Research & development keynote", "Shahed Bagwan"],
              ["01:15 PM", "Growing with Bricks 4 Kidz", "Panel discussion"],
              [
                "02:00 PM",
                "Building the future of your business, together",
                "Lamar VanDusen",
              ],
              ["02:45 PM", "Technology keynote", "Ajmal Alavi"],
              [
                "03:45 PM",
                "Breakout sessions",
                "Curriculum, customer success, technology, camps and P&L workshops",
              ],
              [
                "06:00 PM",
                "Global Village trip",
                "Cultures, cuisines and crafts from around the globe",
                1,
              ],
            ],
          ],
          [
            "Feb 12",
            [
              [
                "08:00 AM",
                "Growing business as a master franchisor",
                "Nishant Verma",
              ],
              ["09:00 AM", "Hacking the AI hype", "Ford Saeks"],
              ["10:00 AM", "Curriculum keynote", "Shahed Bagwan"],
              [
                "11:00 AM",
                "From national brand to local enrollments",
                "Dave Nicolanti",
              ],
              ["11:45 AM", "Drone workshop", "Shahed Bagwan"],
              [
                "01:15 PM",
                "Breakout sessions",
                "Same five workshops as Feb 11",
              ],
              ["03:00 PM", "Desert safari", "Golden dunes, until 10:00 PM", 1],
            ],
          ],
          [
            "Feb 13",
            [
              ["09:00 AM", "Local marketing mastery", "Ford Saeks"],
              [
                "10:00 AM",
                "Marketing & franchise development keynote",
                "Nishant Verma",
              ],
              ["10:45 AM", "The Stroom Bridge Challenge", "Emmanuel Rego"],
              ["11:45 AM", "Hot topic: winning the people game", "Ford Saeks"],
              [
                "03:00 PM",
                "Peer perspectives: sharing wins and wisdom",
                "Sue Pamboris",
              ],
              [
                "03:30 PM",
                "Fireside chat with the team",
                "Ford Saeks & StroomX team",
              ],
              ["04:15 PM", "StroomVerse Awards 2026", ""],
              [
                "06:00 PM",
                "Dubai Mall & Burj Khalifa outing",
                "Dubai Fountain, until 10:00 PM",
                1,
              ],
            ],
          ],
          [
            "Feb 14",
            [
              [
                "09:00 AM",
                "Dubai tour",
                "Abra, Gold Souq, Burj Al Arab, Palm Jumeirah, Miracle Garden",
                1,
              ],
              [
                "07:00 PM",
                "Dubai Marina dhow cruise",
                "A Valentine’s evening celebrating success, until 11:00 PM",
                1,
              ],
            ],
          ],
        ];
        const SPK = [
          [
            "Ford Saeks",
            "Hall-of-Fame keynote: growth, AI and local marketing",
          ],
          ["Chris Rego", "Opening keynote"],
          ["Shahed Bagwan", "Curriculum, R&D and drone workshop"],
          ["Jerry Parchman", "Resource Trade Tower, customer success"],
          ["Ajmal Alavi", "Technology keynote and workshop"],
          ["Nishant Verma", "Master franchisor and marketing keynotes"],
          ["Lamar VanDusen", "Building the future of your business"],
          ["Dave Nicolanti", "National brand to local enrollments"],
          ["Emmanuel Rego", "The Stroom Bridge Challenge"],
          ["Tim Walker", "Camps: tips, tricks and insights"],
          ["Jennie Morris", "You’re judged by your P&L"],
          ["Sue Pamboris", "Peer perspectives"],
        ];
        const INFO = [
          [
            "Venue",
            "Grand Mercure Dubai, next to Dubai International Airport (1 km). Adult participants only, with no childcare.",
          ],
          [
            "Hotel",
            "Discounted room block Feb 10–15, 2026. Two adults per room, breakfast Feb 11–15. Other airports: Sharjah 27 km, Al Maktoum 66 km, Abu Dhabi 122 km.",
          ],
          [
            "What’s included",
            "All sessions and events, daily entertainment, snacks and coffee/tea, hotel Feb 10–15, breakfast Feb 11–15 and lunch on conference days. Travel is not included.",
          ],
          [
            "Registration",
            "StroomVerse 2026 has reached maximum capacity and is no longer accepting registrations.",
          ],
        ];
        const FAQ = [
          [
            "Do I need a visa for Dubai?",
            "It depends on your citizenship. Most passport holders get a visa on arrival at no cost; others may need to apply beforehand. Check visitdubai.com for the requirements.",
          ],
          [
            "Can I bring my family?",
            "The conference and its activities are for adults only. Family can visit Dubai separately; rooms hold up to two people.",
          ],
          [
            "When does it end on Feb 14?",
            "By 11 PM. Your booking includes your stay until 12:00 PM on Feb 15.",
          ],
          [
            "How do I reach the venue?",
            "The hotel is 1 km from Dubai International Airport. Use the Dubai Metro or an airport taxi.",
          ],
          ["Who can I ask?", "Call 1-888-787-0069, extension 2."],
        ];
        function initConf() {
          let cur = 0;
          const tabs = (id, labels, cb) => {
            const h = $(id);
            h.innerHTML = labels
              .map(
                (l, i) => `<button type="button" data-i="${i}">${l}</button>`,
              )
              .join("");
            $$("button", h).forEach((b) =>
              b.addEventListener("click", () => cb(+b.dataset.i)),
            );
          };
          window.__edit = (i) => {
            cur = i;
            $$(".edb").forEach((b) =>
              b.classList.toggle("on", +b.dataset.i === i),
            );
            window.__setRegion && window.__setRegion(ED[i].k);
            const t = $("#rt"),
              p = $("#rp");
            if (t) {
              t.textContent = ED[i].t;
              p.textContent = ED[i].p;
            }
          };
          ["#edt2"].forEach((id) => {
            tabs(
              id,
              ED.map((e) => e.k),
              (i) => window.__edit(i),
            );
            $$(`${id} button`).forEach((b) => b.classList.add("edb"));
          });
          window.__edit(0);
          const ag = $("#ag"),
            draw = (d) => {
              $$("#dtabs button").forEach((b, i) =>
                b.classList.toggle("on", i === d),
              );
              ag.innerHTML = AG[d][1]
                .map(
                  (r, i) =>
                    `<div class="ar${r[3] ? " trip" : ""}" style="animation-delay:${i * 50}ms"><span class="at">${r[0]}</span><div><b>${r[1]}</b>${r[2] ? `<small>${r[2]}</small>` : ""}</div></div>`,
                )
                .join("");
            };
          tabs(
            "#dtabs",
            AG.map((a) => a[0]),
            draw,
          );
          draw(0);
          $("#spk").innerHTML = SPK.map(
            (s) =>
              `<div class="rvl card sp"><i>${s[0]
                .split(" ")
                .map((w) => w[0])
                .join("")}</i><b>${s[0]}</b><small>${s[1]}</small></div>`,
          ).join("");
          const ci = (s) =>
            `<div class="rvl card"><h3>${s[0]}</h3><p>${s[1]}</p></div>`;
          $("#vinfo").innerHTML = [INFO[0], INFO[2]].map(ci).join("");
          $("#hinfo").innerHTML = [INFO[1], INFO[3]].map(ci).join("");
          $("#faqList").innerHTML = FAQ.map(
            (s) =>
              `<details class="rvl"><summary>${s[0]}</summary><p>${s[1]}</p></details>`,
          ).join("");
          $$(
            ".sec .eyebrow,.sec h2,.sec .lead,.stats h2,.stats .eyebrow",
          ).forEach((n) => n.classList.add("rvl"));
          const io = new IntersectionObserver(
            (es) =>
              es.forEach(
                (e) =>
                  e.isIntersecting &&
                  (e.target.classList.add("in"), io.unobserve(e.target)),
              ),
            { threshold: 0.15 },
          );
          $$(".rvl").forEach((n, i) => {
            n.style.transitionDelay = (i % 4) * 70 + "ms";
            io.observe(n);
          });
        }

        const GAL = [
          [
            "Desert Safari",
            "Golden dunes and an evening under the stars.",
            "dunes",
            0,
          ],
          [
            "Global Village",
            "Cultures, cuisines and crafts from around the globe.",
            "bricks",
            2,
          ],
          [
            "Burj Khalifa",
            "The Dubai Fountain beneath the glittering tower.",
            "tower",
            1,
          ],
          ["Dhow Cruise", "A Marina evening celebrating success.", "waves", 3],
          [
            "Keynotes",
            "The family comes together on the main stage.",
            "sun",
            0,
          ],
          [
            "Awards",
            "StroomVerse Awards, celebrating the community.",
            "tower",
            2,
          ],
        ]; /* add a 5th item, e.g. "/photos/safari.jpg", to use a real photo */
        function initGallery() {
          const a = $("#acc");
          if (!a) return;
          const pal = [
            ["#ff4000", "#ffb08a"],
            ["#15171c", "#ff7a45"],
            ["#ffd8c2", "#ff4000"],
            ["#3a1d12", "#ff7a45"],
          ];
          const art = (k, c) => {
            const m = {
              dunes:
                '<path d="M0 190 Q50 140 100 180 T200 160 V260 H0Z" fill="#fff" opacity=".35"/><path d="M0 220 Q60 170 120 210 T200 200 V260 H0Z" fill="#fff" opacity=".5"/><circle cx="145" cy="70" r="26" fill="#fff" opacity=".7"/>',
              waves:
                '<path d="M0 150 Q25 130 50 150 T100 150 T150 150 T200 150 V260 H0Z" fill="#fff" opacity=".3"/><path d="M0 190 Q25 170 50 190 T100 190 T150 190 T200 190 V260 H0Z" fill="#fff" opacity=".45"/><circle cx="60" cy="70" r="20" fill="#fff" opacity=".7"/>',
              tower:
                '<rect x="88" y="40" width="24" height="190" fill="#fff" opacity=".6"/><rect x="95" y="20" width="10" height="30" fill="#fff" opacity=".8"/><rect x="40" y="150" width="30" height="80" fill="#fff" opacity=".35"/><rect x="130" y="130" width="34" height="100" fill="#fff" opacity=".4"/>',
              bricks: [0, 1, 2, 3, 4, 5]
                .map(
                  (i) =>
                    `<rect x="${24 + (i % 3) * 54}" y="${60 + Math.floor(i / 3) * 54}" width="46" height="46" rx="8" fill="#fff" opacity="${0.3 + i * 0.08}"/>`,
                )
                .join(""),
              sun: '<circle cx="100" cy="100" r="50" fill="#fff" opacity=".6"/><circle cx="100" cy="100" r="78" fill="none" stroke="#fff" opacity=".4" stroke-width="3"/>',
            }[k];
            return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="200" height="260" fill="url(#g)"/>${m}</svg>`)}")`;
          };
          a.innerHTML = GAL.map(
            (it, i) =>
              `<button type="button" class="acc-i" aria-label="${it[0]}" style="background-image:${it[4] ? `url(${it[4]})` : art(it[2], pal[it[3]])}"><b class="v">${it[0]}</b><span class="acc-c"><small>${String(i + 1).padStart(2, "0")} / ${String(GAL.length).padStart(2, "0")}</small><h3>${it[0]}</h3><p>${it[1]}</p></span></button>`,
          ).join("");
          const items = $$(".acc-i", a);
          let cur = 0,
            vis = false,
            hov = false;
          const set = (i) => {
            cur = i;
            items.forEach((e, j) => {
              e.classList.toggle("on", j === i);
              e.setAttribute("aria-expanded", String(j === i));
            });
          };
          items.forEach((e, i) => {
            e.addEventListener("click", () => set(i));
            e.addEventListener("focus", () => set(i));
            e.addEventListener("pointerenter", (ev) => {
              if (ev.pointerType === "mouse") set(i);
            });
          });
          a.addEventListener("pointerenter", () => (hov = true));
          a.addEventListener("pointerleave", () => (hov = false));
          new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(
            a,
          );
          set(0);
          if (!reduced)
            setInterval(() => {
              if (vis && !hov && !document.hidden)
                set((cur + 1) % items.length);
            }, 4200);
        }
        function initSectionMotion() {
          const refresh = () => {
            const targets = $$(
              ".g4 > .card, #ag .ar, .faq details, .destination-gallery figure, .event-photo-card",
            );
            $$(".event-photo-card").forEach((card) => {
              if (card.dataset.spotlightBound) return;
              card.dataset.spotlightBound = "true";
              card.addEventListener("pointermove", (event) => {
                const bounds = card.getBoundingClientRect();
                card.style.setProperty(
                  "--spot-x",
                  `${event.clientX - bounds.left}px`,
                );
                card.style.setProperty(
                  "--spot-y",
                  `${event.clientY - bounds.top}px`,
                );
              });
            });
            if (window.ScrollTrigger) {
              window.ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.id === "conference-content-reveal")
                  trigger.kill();
              });
            }
            if (reduced || !window.gsap || !window.ScrollTrigger) return;

            const groups = new Map();
            targets.forEach((target) => {
              const parent = target.parentElement;
              if (!groups.has(parent)) groups.set(parent, []);
              groups.get(parent).push(target);
            });
            groups.forEach((items) => {
              gsap.fromTo(
                items,
                { autoAlpha: 0, y: 22 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.7,
                  stagger: 0.09,
                  ease: "power3.out",
                  clearProps: "transform",
                  scrollTrigger: {
                    id: "conference-content-reveal",
                    trigger: items[0],
                    start: "top 86%",
                    once: true,
                  },
                },
              );
            });
          };
          window.__refreshSectionMotion = refresh;
          refresh();
        }
        function initNav() {
          const nav = $("#nav"),
            bg = $("#bg"),
            setOpen = (o) => {
              nav.classList.toggle("open", o);
              bg.setAttribute("aria-expanded", String(o));
            };
          bg.addEventListener("click", () =>
            setOpen(!nav.classList.contains("open")),
          );
          $$("#links a[href^='#']").forEach((a) =>
            a.addEventListener("click", (e) => {
              e.preventDefault();
              setOpen(false);
              document.documentElement.classList.remove("lock");
              const h = a.getAttribute("href");
              if (h === "#top") return scrollTo({ top: 0, behavior: "smooth" });
              const t = $(h);
              if (t)
                t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
            }),
          );
          $$("#links a:not([href^='#'])").forEach((a) =>
            a.addEventListener("click", () => setOpen(false)),
          );
          addEventListener(
            "keydown",
            (e) => e.key === "Escape" && setOpen(false),
          );
        }

        const boot = () => {
          [
            initProgress,
            initHero,
            initMarquee,
            initCursor,
            initTrail,
            initReel,
            initCounters,
            initConf,
            initGallery,
            initSectionMotion,
            initNav,
          ].forEach((fn) => {
            try {
              fn();
            } catch (err) {
              console.error("[StroomX] " + fn.name + " failed:", err);
            }
          });
        };
        document.readyState === "loading"
          ? document.addEventListener("DOMContentLoaded", boot, { once: true })
          : boot();
      })();
