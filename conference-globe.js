gsap.registerPlugin(ScrollTrigger);
      const D = Math.PI / 180,
        $ = (s) => document.querySelector(s),
        RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
      const ll = (a, o, r = 1) =>
        new THREE.Vector3(
          r * Math.cos(a * D) * Math.cos(o * D),
          r * Math.sin(a * D),
          -r * Math.cos(a * D) * Math.sin(o * D),
        );
      const sl = (a, b, t) => {
        const o = Math.acos(Math.min(1, a.dot(b))),
          s = Math.sin(o);
        return a
          .clone()
          .multiplyScalar(Math.sin((1 - t) * o) / s)
          .add(b.clone().multiplyScalar(Math.sin(t * o) / s));
      };
      const LOCS = [
        {
          y: "2026",
          n: "Dubai",
          c: "United Arab Emirates",
          rg: "Arabian Peninsula",
          poster: "./assets/conference-gallery/dubai/poster.jpg",
          lat: 25.2,
          lon: 55.27,
          r: [24, 50],
        },
        {
          y: "2024",
          n: "Las Vegas",
          c: "United States",
          rg: "North America",
          poster: "./assets/conference-gallery/lasVegas/poster.jpg",
          lat: 36.17,
          lon: -115.14,
          r: [30, -90],
        },
        {
          y: "2022",
          n: "California",
          c: "United States",
          rg: "North America",
          poster: "./assets/conference-gallery/california/poster.jpg",
          lat: 36.78,
          lon: -119.42,
          r: [40, -122],
        },
      ];
      $("#pick").innerHTML = LOCS.map(
        (L, i) =>
          `<button class="loc" data-i="${i}"><em>STROOMVERSE ${L.y}</em><b>${L.n}</b><span>${L.c}</span></button>`,
      ).join("");
      const cv = $("#gl"),
        renderer = new THREE.WebGLRenderer({
          canvas: cv,
          antialias: true,
          alpha: true,
        });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      const theme = getComputedStyle(document.documentElement);
      const brand = new THREE.Color(theme.getPropertyValue("--o").trim());
      const brandLight = theme.getPropertyValue("--a").trim();
      const brandSoft = theme.getPropertyValue("--b").trim();
      const scene = new THREE.Scene(),
        cam = new THREE.PerspectiveCamera(45, 1, 0.05, 200),
        root = new THREE.Group(),
        globe = new THREE.Group();
      root.add(globe);
      scene.add(root);
      const makeEarthTexture = (mode) => {
        const canvas = document.createElement("canvas");
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        if (mode === "cloud") {
          ctx.strokeStyle = brandSoft;
          ctx.globalAlpha = 0.18;
          ctx.lineWidth = 12;
          for (let i = 0; i < 80; i++) {
            const x = (i * 197) % canvas.width;
            const y = (i * 83) % canvas.height;
            ctx.beginPath();
            ctx.ellipse(
              x,
              y,
              35 + (i % 5) * 12,
              4 + (i % 4) * 2,
              0.2,
              0,
              Math.PI * 2,
            );
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        } else {
          const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
          ocean.addColorStop(0, mode === "day" ? "#27303a" : "#10131a");
          ocean.addColorStop(0.5, mode === "day" ? "#15171c" : "#090b10");
          ocean.addColorStop(1, mode === "day" ? "#202630" : "#11141b");
          ctx.fillStyle = ocean;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (mode === "day") {
            ctx.strokeStyle = brandLight;
            ctx.globalAlpha = 0.12;
            ctx.lineWidth = 2;
            for (let lon = -180; lon <= 180; lon += 30) {
              const x = ((lon + 180) / 360) * canvas.width;
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, canvas.height);
              ctx.stroke();
            }
            for (let lat = -60; lat <= 60; lat += 30) {
              const y = ((90 - lat) / 180) * canvas.height;
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(canvas.width, y);
              ctx.stroke();
            }
            ctx.globalAlpha = 1;
          }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = Math.min(
          16,
          renderer.capabilities.getMaxAnisotropy(),
        );
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        return texture;
      };
      Promise.all(["day", "night", "cloud"].map(makeEarthTexture)).then(
        ([day, night, cloud]) => {
          const sun = { value: new THREE.Vector3(-1, 0.25, 0.55).normalize() };
          globe.add(
            new THREE.Mesh(
              new THREE.SphereGeometry(1, 256, 256),
              new THREE.ShaderMaterial({
                uniforms: {
                  d: { value: day },
                  n: { value: night },
                  sun,
                  brand: { value: brand },
                },
                vertexShader:
                  "varying vec2 u;varying vec3 w,v;void main(){u=uv;w=normalize(mat3(modelMatrix)*normal);v=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
                fragmentShader:
                  "uniform sampler2D d,n;uniform vec3 sun,brand;varying vec2 u;varying vec3 w,v;void main(){float s=dot(normalize(w),sun);float k=smoothstep(-.12,.3,s);vec3 dc=texture2D(d,u).rgb*(.2+1.05*max(s,0.));vec3 nc=texture2D(n,u).rgb*vec3(1.6,1.2,.7)+texture2D(d,u).rgb*.04;float f=pow(1.-max(v.z,0.),4.);vec3 c=mix(nc,dc,k)+brand*f*(.05+.22*k);gl_FragColor=vec4(c,1.);}",
              }),
            ),
          );
          const cl = new THREE.Mesh(
            new THREE.SphereGeometry(1.012, 160, 160),
            new THREE.MeshBasicMaterial({
              map: cloud,
              blending: THREE.AdditiveBlending,
              transparent: true,
              opacity: 0.2,
              depthWrite: false,
            }),
          );
          globe.add(cl);
          /* softer, tighter atmosphere */
          const atm = new THREE.Mesh(
            new THREE.SphereGeometry(1.08, 64, 64),
            new THREE.ShaderMaterial({
              vertexShader:
                "varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
              fragmentShader:
                "uniform vec3 brand;varying vec3 n;void main(){float i=pow(max(0.,.68-dot(n,vec3(0.,0.,1.))),3.);gl_FragColor=vec4(brand,1.)*i*.45;}",
              uniforms: { brand: { value: brand } },
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending,
              transparent: true,
              depthWrite: false,
            }),
          );
          root.add(atm);
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.012, 0.016, 48),
            new THREE.MeshBasicMaterial({
              color: brand,
              transparent: true,
              side: THREE.DoubleSide,
              depthWrite: false,
            }),
          );
          ring.visible = false;
          globe.add(ring);
          const sp = document.createElement("canvas");
          sp.width = sp.height = 32;
          const x = sp.getContext("2d"),
            g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
          g.addColorStop(0, "#fff");
          g.addColorStop(0.4, "#fff");
          g.addColorStop(1, "rgba(255,255,255,0)");
          x.fillStyle = g;
          x.fillRect(0, 0, 32, 32);
          const dot = new THREE.CanvasTexture(sp);
          const buildLand = () => {
            const encoded = window.STROOMX_GLOBE_LAND;
            if (!encoded) {
              console.error("[StroomX] Globe land data is unavailable.");
              return;
            }
            const bytes = Uint8Array.from(atob(encoded), (char) =>
              char.charCodeAt(0),
            );
            const positions = [];
            for (let lat = -89; lat <= 89; lat += 2) {
              const y = Math.max(0, Math.min(89, Math.floor((90 - lat) / 2)));
              for (let lon = -179; lon <= 179; lon += 2) {
                const x =
                  Math.floor(((((lon + 180) % 360) + 360) % 360) / 2) % 180;
                const index = y * 180 + x;
                if (!((bytes[index >> 3] >> (7 - (index & 7))) & 1)) continue;
                const point = ll(lat, lon, 1.02);
                positions.push(point.x, point.y, point.z);
              }
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute(
              "position",
              new THREE.Float32BufferAttribute(positions, 3),
            );
            const land = new THREE.Points(
              geometry,
              new THREE.PointsMaterial({
                color: new THREE.Color(brandLight),
                map: dot,
                size: 0.022,
                transparent: true,
                opacity: 0.95,
                depthWrite: false,
                blending: THREE.NormalBlending,
                toneMapped: false,
              }),
            );
            globe.add(land);
          };
          if (window.STROOMX_GLOBE_LAND) buildLand();
          else
            document.addEventListener("DOMContentLoaded", buildLand, {
              once: true,
            });
          const sa = [];
          for (let i = 0; i < 1400; i++) {
            const u = Math.random() * 2 - 1,
              t = Math.random() * 6.283,
              r = Math.sqrt(1 - u * u),
              d = 30 + Math.random() * 30;
            sa.push(Math.cos(t) * r * d, u * d, Math.sin(t) * r * d);
          }
          const sg = new THREE.BufferGeometry();
          sg.setAttribute("position", new THREE.Float32BufferAttribute(sa, 3));
          const stars = new THREE.Points(
            sg,
            new THREE.PointsMaterial({
              size: 0.14,
              map: dot,
              transparent: true,
              opacity: 0.8,
              depthWrite: false,
              color: new THREE.Color(brandSoft),
            }),
          );
          scene.add(stars);
          /* StroomX current: glowing arcs with pulses between the three places */
          const V = LOCS.map((L) => ll(L.lat, L.lon)),
            arcs = [],
            lm = new THREE.LineBasicMaterial({
              color: brand,
              transparent: true,
              opacity: 0.6,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            });
          [
            [0, 1],
            [1, 2],
            [2, 0],
          ].forEach(([a, b], k) => {
            const P = [];
            for (let i = 0; i <= 80; i++) {
              const t = i / 80;
              P.push(
                sl(V[a], V[b], t).multiplyScalar(
                  1.004 + 0.16 * Math.sin(Math.PI * t),
                ),
              );
            }
            globe.add(
              new THREE.Line(new THREE.BufferGeometry().setFromPoints(P), lm),
            );
            const pg = new THREE.BufferGeometry();
            pg.setAttribute("position", new THREE.Float32BufferAttribute(3, 3));
            const pm = new THREE.Points(
              pg,
              new THREE.PointsMaterial({
                size: 0.06,
                map: dot,
                color:
                  k === 1
                    ? new THREE.Color(brandLight)
                    : new THREE.Color(brandSoft),
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
              }),
            );
            globe.add(pm);
            arcs.push({ P, pg, pm, o: k / 3 });
          });
          function size() {
            const w = innerWidth,
              h = innerHeight;
            renderer.setSize(w, h, false);
            cam.aspect = w / h;
            cam.updateProjectionMatrix();
          }
          addEventListener("resize", size);
          size();
          const st = {
              lat: 16,
              lon: 70,
              z: cam.aspect < 1 ? 5.8 : 4.4,
              y: 0.5,
              sx: -1,
              cloud: 0.2,
              idle: 1,
              pin: 0,
              orb: 1,
              spin: 0,
              ca: 1,
              fov: 45,
              roll: 0,
              warp: 0,
            },
            intro = { v: 0 };
          let mx = 0,
            my = 0,
            tx = 0,
            ty = 0,
            sel = -1,
            tl = null;
          addEventListener("pointermove", (e) => {
            tx = (e.clientX / innerWidth) * 2 - 1;
            ty = (e.clientY / innerHeight) * 2 - 1;
          });
          const sticky = $(".sticky");
          sticky.insertAdjacentHTML(
            "beforeend",
            LOCS.map(
              (L) => `<div class="pin"><i></i><span>${L.n}</span></div>`,
            ).join(""),
          );
          const pins = [...document.querySelectorAll(".pin")],
            v3 = new THREE.Vector3(),
            nv = new THREE.Vector3();
          const spc = $("#space");
          gsap.ticker.add((t, dt) => {
            if (st.idle > 0.999) st.spin = (st.spin + dt * 0.006) % 360;
            mx += (tx - mx) * 0.05;
            my += (ty - my) * 0.05;
            globe.rotation.y =
              -(st.lon + st.spin * st.idle + 90) * D + mx * 0.06 * st.idle;
            globe.rotation.x = st.lat * D + my * 0.05 * st.idle;
            cl.rotation.y = t * 0.004 + st.warp * 0.2;
            cam.position.z = st.z;
            root.position.y = st.y;
            root.rotation.z = st.roll * D;
            root.scale.setScalar(0.5 + 0.5 * intro.v);
            if (cam.fov !== st.fov) {
              cam.fov = st.fov;
              cam.updateProjectionMatrix();
            }
            sun.value.set(st.sx, 0.25, 0.6).normalize();
            cl.material.opacity = st.cloud;
            cv.style.opacity = st.ca * Math.min(1, intro.v * 1.6);
            spc.style.opacity = st.ca;
            stars.rotation.y = t * 0.003;
            stars.material.size = 0.14 + st.warp * 0.3;
            lm.opacity = 0.6 * st.orb;
            arcs.forEach((a) => {
              const f = ((t * 0.14 + a.o) % 1) * 80,
                i = Math.floor(f),
                p = a.P[i];
              a.pg.attributes.position.setXYZ(0, p.x, p.y, p.z);
              a.pg.attributes.position.needsUpdate = true;
              a.pm.material.opacity = st.orb;
            });
            ring.visible = sel >= 0;
            if (sel >= 0) {
              const k = (t * 0.6) % 1;
              ring.scale.setScalar(1 + k * 4);
              ring.material.opacity = (1 - k) * 0.9 * (1 - st.warp * 0.5);
            }
            pins.forEach((p, i) => {
              v3.copy(V[i]).applyMatrix4(globe.matrixWorld);
              nv.copy(v3).sub(root.position).normalize();
              const front = nv.dot(cam.position.clone().sub(v3)) > 0 ? 1 : 0,
                s = v3.clone().project(cam);
              const o =
                (i === sel ? Math.max(st.orb * 0.9, st.pin) : st.orb * 0.9) *
                front;
              p.style.transform = `translate(${(s.x * 0.5 + 0.5) * innerWidth + 14}px,${(-s.y * 0.5 + 0.5) * innerHeight - 16}px)`;
              p.style.opacity = o;
              p.classList.toggle("sel", i === sel);
            });
            renderer.render(scene, cam);
          });
          /* selection */
          const sh = (c, t) => c + (((t - c + 540) % 360) - 180);
          function build(L) {
            const tc = ll(L.lat, L.lon, 1.004);
            ring.position.copy(tc);
            ring.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 0, 1),
              tc.clone().normalize(),
            );
            $("#c1").innerHTML =
              `<h2>${L.rg}</h2><p>Rotating to ${Math.abs(L.r[0]).toFixed(1)}° ${L.r[0] < 0 ? "S" : "N"}, ${Math.abs(L.r[1]).toFixed(1)}° ${L.r[1] < 0 ? "W" : "E"}</p>`;
            $("#c2").innerHTML =
              `<h2>${L.c}</h2><p>Descending through the clouds</p>`;
            $("#c3").innerHTML =
              `<h2>${L.n}</h2><p>${Math.abs(L.lat).toFixed(2)}° ${L.lat < 0 ? "S" : "N"}, ${Math.abs(L.lon).toFixed(2)}° ${L.lon < 0 ? "W" : "E"}</p>`;
            gsap.set(".cap", { opacity: 0 });
            gsap.set("#veil", { opacity: 0, backgroundColor: "#ffb08a" });
            const restoreIntro = () => {
              gsap.set("#veil", { opacity: 0, backgroundColor: "#ffb08a" });
              gsap.set(".ihero", { yPercent: 0, opacity: 1 });
              gsap.set(".cap", { opacity: 0, y: 0 });
              Object.assign(st, { ca: 1, pin: 0 });
              spc.style.opacity = "1";
            };
            tl = gsap.timeline({
              defaults: { ease: "power2.inOut" },
              scrollTrigger: {
                trigger: "#intro",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.18,
                onLeaveBack: restoreIntro,
                invalidateOnRefresh: true,
              },
            });
            tl.to(".ihero", { yPercent: -40, opacity: 0, duration: 0.6 }, 0)
              .to(
                st,
                {
                  lat: L.r[0],
                  lon: L.r[1],
                  z: 3.1,
                  y: 0,
                  sx: -0.5,
                  idle: 0,
                  orb: 0,
                  roll: -7,
                  warp: 0.3,
                  duration: 1.2,
                },
                0,
              )
              .to("#c1", { opacity: 1, y: 0, duration: 0.3 }, 0.6)
              .to("#c1", { opacity: 0, duration: 0.3 }, 1.3)
              .to(
                st,
                {
                  lat: L.lat,
                  lon: L.lon,
                  z: 1.9,
                  sx: -0.15,
                  cloud: 0.45,
                  pin: 1,
                  roll: 6,
                  warp: 0.6,
                  duration: 1.1,
                },
                1.2,
              )
              .to("#c2", { opacity: 1, duration: 0.3 }, 1.5)
              .to("#c2", { opacity: 0, duration: 0.3 }, 2.2)
              .to(
                st,
                { z: 1.28, cloud: 0.6, fov: 64, roll: 0, warp: 1, duration: 1 },
                2.2,
              )
              .to("#c3", { opacity: 1, duration: 0.3 }, 2.5)
              .to(
                "#veil",
                { opacity: 0.95, duration: 0.7, ease: "power1.in" },
                2.9,
              )
              .to("#c3", { opacity: 0, duration: 0.3 }, 3.1)
              .to(
                "#veil",
                { backgroundColor: "rgba(5, 7, 15, 0.18)", color: "#fff", duration: 0.6 },
                3.6,
              )
              .to(st, { ca: 0, pin: 0, duration: 0.3 }, 3.6);
          }
          function render() {}
          function choose(i) {
            const L = LOCS[i];
            const veil = $("#veil");
            veil.style.backgroundImage = `linear-gradient(180deg, rgba(5,7,15,.12), rgba(5,7,15,.38)), url("${L.poster}")`;
            veil.style.backgroundSize = "cover";
            veil.style.backgroundPosition = "center";
            veil.innerHTML = `<div class="veil-title"><span>STROOMVERSE · ${L.y}</span><b>${L.n}</b></div>`;
            sel = i;
            window.__edit && window.__edit(i);
            document
              .querySelectorAll(".loc")
              .forEach((b, j) => b.classList.toggle("on", j === i));
            if (tl) {
              tl.scrollTrigger.kill();
              tl.kill();
              tl = null;
            }
            scrollTo(0, 0);
            gsap.set(".ihero", { yPercent: 0, opacity: 1 });
            gsap.set("#veil", { opacity: 0 });
            Object.assign(st, {
              orb: 1,
              pin: 0,
              ca: 1,
              fov: 45,
              roll: 0,
              warp: 0,
              cloud: 0.2,
              idle: 0,
            });
            <!-- $("#ihint").textContent = "Now scroll to travel to " + L.n; -->
            gsap.to(st, {
              lat: L.lat,
              lon: sh(st.lon, L.lon),
              z: cam.aspect < 1 ? 4.6 : 3.6,
              y: 0.2,
              sx: -0.7,
              duration: RM ? 0.01 : 0.8,
              ease: "power3.inOut",
              onComplete: () => {
                render(L);
                build(L);
                ScrollTrigger.refresh();
                document.documentElement.classList.remove("lock");
                scrollTo({
                  top: innerHeight * 0.9,
                  behavior: RM ? "auto" : "smooth",
                });
              },
            });
          }
          document.querySelectorAll(".loc").forEach((b) => {
            const i = +b.dataset.i;
            b.addEventListener("click", () => choose(i));
            b.addEventListener("pointerenter", () => {
              if (!tl && sel < 0)
                gsap.to(st, {
                  lat: LOCS[i].lat,
                  lon: sh(st.lon, LOCS[i].lon),
                  idle: 0,
                  z: cam.aspect < 1 ? 5.4 : 4,
                  y: 0.3,
                  duration: 1.6,
                  ease: "power3.out",
                  overwrite: "auto",
                });
            });
          });
          /* intro */
          const h = $("#h1");
          h.innerHTML = h.textContent
            .split(" ")
            .map((w) => `<span class="w"><span>${w}</span></span>`)
            .join(" ");
          document.documentElement.classList.add("lock");
          (window.stxReady || ((f) => f()))(() =>
            gsap
              .timeline({ defaults: { ease: "power4.out" } })
              .to(intro, { v: 1, duration: 2.4, ease: "power3.inOut" }, 0)
              .from(
                "#h1 .w span",
                { yPercent: 115, duration: 1.2, stagger: 0.1 },
                0.6,
              )
              .from(
                ".ihint",
                { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 },
                1.3,
              )
              .from(
                ".loc",
                { y: 50, opacity: 0, scale: 0.92, duration: 1, stagger: 0.12 },
                1.4,
              ),
          );
          document.querySelectorAll("#orbit,#orbit2").forEach((a) =>
            a.addEventListener("click", (e) => {
              e.preventDefault();
              scrollTo({ top: 0, behavior: "smooth" });
            }),
          );
        },
      );
