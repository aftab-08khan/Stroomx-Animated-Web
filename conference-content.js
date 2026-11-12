/* Edition-specific content. Archived event details must be verified before adding. */
(() => {
  "use strict";
 const editions = [
  // DUBAI 2026
  {
    city: "Dubai",
    country: "United Arab Emirates",
    year: "2026",
    reelVideo: "./Highlight.mp4",
    file: "Dubai skyline - Dubai, UAE.jpg",
    photo: "./assets/conference-gallery/dubai/poster.jpg",

    description:
      "The Dubai edition brought the Bricks 4 Kidz family together for five days of keynotes, workshops, awards and city experiences, February 10–14, 2026.",

    highlights: [
      "Grand Mercure Dubai",
      "February 10–14, 2026",
      "Keynotes, workshops and city experiences",
    ],

    events: [
      [
        "Keynotes",
        "Illustrative image · conference speaker on stage.",
        "./assets/conference-gallery/dubai/gallery/gallery-1.jpg",
      ],
      [
        "Workshops",
        "Illustrative image · collaborative session.",
        "./assets/conference-gallery/dubai/gallery/gallery-2.jpg",
      ],
      [
        "The StroomVerse community",
        "Illustrative image · audience gathering.",
        "./assets/conference-gallery/dubai/gallery/gallery-3.jpg",
      ],
      [
        "Dubai experiences",
        "Illustrative image · city after dark.",
        "./assets/conference-gallery/dubai/gallery/gallery-4.jpg",
      ],
    ],
  },

  // Las Vegas 2024
  {
    city: "Las Vegas",
    country: "United States",
    year: "2024",

    file: "The StripLas Vegas Strip.jpg",

    photo:
      "./assets/conference-gallery/lasVegas/poster.jpg",


    description:
      "The 2024 StroomVerse edition brought the Bricks 4 Kidz franchise network together in Las Vegas. This archive highlights the global community, shared learning and connections across the network. Exact dates, the venue and a confirmed programme are not available in the current archive.",

    highlights: [
      "Las Vegas, Nevada",
      "2024 · United States",
      "Franchise community and shared learning",
    ],
    speaker: {
      name: "Toni Harris Taylor",
      role: "Keynote speaker",
      detail: "Marketing, networking and building business relationships",
      image: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https%3A//assets.cdn.filesafe.space/DZtzENamPFiCJrbraFIG/media/66bda9fe08a2a1ff5f850133.png",
      imageAlt: "Toni Harris Taylor",
      source: "https://toniharristaylor.com/reviews",
    },

    events: [
      [
        "Conference sessions",
        "Illustrative conference image · replace with an official Las Vegas event photograph.",
        "./assets/conference-gallery/lasVegas/gallery/gallery-1.jpg",
      ],
      [
        "Collaborative workshops",
        "Illustrative workshop image · replace with an official Las Vegas event photograph.",
        "./assets/conference-gallery/lasVegas/gallery/gallery-2.jpg",
      ],
      [
        "The StroomVerse community",
        "Illustrative audience image · replace with an official Las Vegas event photograph.",
        "./assets/conference-gallery/lasVegas/gallery/gallery-3.jpg",
      ],
      [
        "Discover Las Vegas",
        "Destination photograph of Las Vegas; not an event photograph.",
                "./assets/conference-gallery/lasVegas/gallery/gallery-4.jpg",

      ],
    ],
  },

  // California 2022
  {
    city: "California",
    country: "United States",
    year: "2022",

    file: "Big Sur Coastline.jpg",

    photo:
      "./assets/conference-gallery/california/poster.jpg",

    description:
      "The 2022 StroomVerse edition brought the Bricks 4 Kidz franchise community together in California. This archive highlights the relationships and shared learning that connect the network across regions. Exact dates, the venue and a confirmed programme are not available in the current archive.",

    highlights: [
      "California",
      "2022 · United States",
      "Global community and shared learning",
    ],
    speaker: null,

    events: [
      [
        "Conference sessions",
        "Illustrative conference image · replace with an official California event photograph.",
      "./assets/conference-gallery/california/gallery/gallery-1.jpg",
      ],
      [
        "Collaborative workshops",
        "Illustrative workshop image · replace with an official California event photograph.",
      "./assets/conference-gallery/california/gallery/gallery-2.jpg",

      ],
      [
        "The StroomVerse community",
        "Illustrative audience image · replace with an official California event photograph.",
      "./assets/conference-gallery/california/gallery/gallery-3.jpeg",

      ],
      [
        "Discover California",
        "Destination photograph of California; not an event photograph.",
      "./assets/conference-gallery/california/poster.jpg",
      ],
    ],
  },
];
  const $ = (s) => document.querySelector(s);
  function start() {
    const sections = ["about", "schedule", "speakers", "venue", "hotel", "faq"];
    const originals = Object.fromEntries(
      sections.map((id) => [id, Array.from($("#" + id).childNodes)]),
    );
    const switcher = document.createElement("section");
    switcher.className = "edition-switch";
    switcher.setAttribute("aria-label", "Conference location");
    // switcher.innerHTML =
    //   '<div class="wrap"><b>Explore StroomVerse</b><div class="edition-options">' +
    //   editions
    //     .map(
    //       (e, i) =>
    //         `<button type="button" data-edition="${i}" aria-pressed="false">${e.city} ${e.year}</button>`,
    //     )
    //     .join("") +
    //   "</div></div>";
    // $("#site").prepend(switcher);
    const gallery = $("#gallery .wrap");
    gallery.innerHTML =
      '<div class="eyebrow">The destination</div><h2 id="destination-title"></h2><p class="lead">Explore the destination, then browse moments from each edition.</p><div class="destination-gallery" id="destination-photos"></div><div class="event-gallery-head" id="event-gallery-head"><div><div class="eyebrow">Event gallery</div><h3 id="event-gallery-title"></h3></div><p id="event-gallery-note"></p></div><div class="event-stack" id="event-stack" aria-label="Conference event photo gallery"></div>';
    let current = -1;
    const apply = (i) => {
      if (!Number.isInteger(i) || !editions[i]) return;
      // The legacy globe can emit repeated selection events while scrolling.
      if (i === current) return;
      current = i;
      const e = editions[i];
      document.querySelector(".stats").hidden = i !== 0;
      const marquee = document.querySelector(".marquee");
      if (marquee) marquee.hidden = i !== 0;
      document.querySelectorAll("[data-edition],.edb,.loc").forEach((b) => {
        const selected = Number(b.dataset.edition ?? b.dataset.i) === i;
        b.setAttribute("aria-pressed", String(selected));
        b.classList.toggle("on", selected);
      });
      sections.forEach((id) => {
        $("#" + id).replaceChildren(...originals[id]);
      });
      $("#about .lead").textContent = e.description;
      $("#about .facts").innerHTML = e.highlights
        .map(
          (h, j) =>
            `<div><b>${j === 0 ? e.city : j === 1 ? e.year : "StroomVerse"}</b><span>${h}</span></div>`,
        )
        .join("");
      if (i === 0) {
        $("#hotel h2").textContent = "Your Dubai stay.";
        $("#hotel .lead").textContent =
          "The 2026 conference package included a discounted room block at Grand Mercure Dubai. This edition has concluded.";
      } else {
        const copy = {
          schedule: [
            `${e.city} edition programme`,
            `The StroomVerse ${e.year} archive places the franchise community in ${e.city}. Session times and a detailed agenda are not available in the current archive.`,
          ],
          speakers: [
            e.speaker ? `Keynote speaker · ${e.city}` : "Speaker archive",
            e.speaker
              ? `${e.speaker.name joined StroomVerse ${e.year} in ${e.city} as a keynote speaker, sharing practical ideas on ${e.speaker.detail.toLowerCase()}.`
              : `Confirmed speaker names and portraits for the ${e.city} ${e.year} edition are not available in the current archive.`,
          ],
          venue: [
            "Conference venue",
            `The conference venue for the ${e.city} ${e.year} edition has not been confirmed in the current archive.`,
          ],
          hotel: [
            "Stay in " + e.city,
            `Hotel and travel arrangements for the ${e.city} edition are not available in this archive.`,
          ],
          faq: [
            "Edition information",
            `This archive covers StroomVerse ${e.year} in ${e.city}. Contact the StroomX team for additional historical event information.`,
          ],
        };
        Object.entries(copy).forEach(([id, [title, text]]) => {
          const speakerCard = id === "speakers"
            ? e.speaker
              ? `<article class="archive-speaker"><img src="${e.speaker.image}" alt="${e.speaker.imageAlt}" loading="lazy"><div class="speaker-glass"><span>${e.speaker.role} · ${e.year}</span><b>${e.speaker.name}</b><small>${e.speaker.detail}</small><a href="${e.speaker.source}" target="_blank" rel="noopener">Speaker source ↗</a></div></article>`
              : `<article class="archive-speaker is-placeholder"><img src="./assets/conference-gallery/keynotes/keynote.jpg" alt="Illustrative conference speaker image; not a California 2022 speaker portrait" loading="lazy"><div class="speaker-glass"><span>Illustrative image</span><b>Speaker details unavailable</b><small>Names and confirmed portraits for this edition have not been found in the archive.</small></div></article>`
            : "";
          $("#" + id).innerHTML =
            `<div class="wrap archive-section"><div class="eyebrow">StroomVerse archive · ${e.year}</div><h2>${title}</h2><p class="lead">${text}</p>${speakerCard}<div class="archive-facts">${[
              ["Edition", `${e.city} · ${e.year}`],
              ["Community", "Bricks 4 Kidz franchise network"],
              ["Archive status", id === "schedule" ? "Detailed agenda unavailable" : id === "speakers" ? "Confirmed speaker list unavailable" : id === "venue" ? "Venue details unavailable" : id === "hotel" ? "Travel and hotel details unavailable" : "Ask the StroomX team"],
            ].map(([label, value]) => `<article><span>${label}</span><b>${value}</b></article>`).join("")}</div></div>`;
        });
      }
      $("#rt").textContent = `StroomVerse ${e.year} · ${e.city}`;
      const reelVideo = $("#rv");
      const filmPlay = $("#film-play");
      reelVideo.pause();
      reelVideo.removeAttribute("src");
      reelVideo.replaceChildren();
      reelVideo.dataset.filmSrc = e.reelVideo || "";
      reelVideo.poster = e.photo;

      if (e.reelVideo) {
        reelVideo.hidden = false;
        reelVideo.load();
        filmPlay.hidden = false;
        filmPlay.querySelector("b").textContent = `Play ${e.city} conference film`;
      } else {
        reelVideo.hidden = true;
        reelVideo.load();
        filmPlay.hidden = true;
      }

      $("#rp").textContent = e.reelVideo
        ? e.description
        : `${e.description} A conference film is not available for this edition yet.`;

      $("#reel .eyebrow").textContent = e.reelVideo
        ? `${e.city} conference film`
        : `${e.city} edition archive`;
      const credit =
        "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(e.file);
      $("#destination-photos").innerHTML =
        `<figure class="destination-photo">
    <img src="${e.photo}" width="1200" height="800" loading="lazy" decoding="async" alt="${e.city}, ${e.country}">
    <span class="destination-photo-shade" aria-hidden="true"></span>
    <figcaption>${e.city} · ${e.year}</figcaption>
</figure>
<div class="archive-note">
    <div class="eyebrow">StroomVerse ${e.year}</div>
    <h3>${e.city}</h3>
    <p>${e.description}</p>
    <p>Looking for event photos? <a href="mailto:support@stroomx.com">Contact the StroomX team ↗</a></p>
</div>`;
      const eventStack = $("#event-stack");
      const events = e.events || [
        [
          `${e.city} destination`,
          `A destination view of ${e.city}, ${e.country}. Official event photos are not yet available.`,
          e.photo,
        ],
      ];
      $("#event-gallery-title").textContent = e.events
        ? `${e.city} ${e.year} · moments`
        : `${e.city} ${e.year} · destination`;
      // $("#event-gallery-note").textContent = e.events
      //   ? "Illustrative event imagery; replace with official photos when available."
      //   : "Destination imagery for this edition; official event photos are not yet available.";
      eventStack.innerHTML = events
        .map(
          ([title, detail, image], j) =>
            `<article class="event-photo-card" style="--card-index:${j}"><div class="event-photo-placeholder">${image ? `<img class="event-photo-image" src="${image}" alt="Illustrative reference for ${title}; not a StroomVerse event photograph" loading="lazy">` : `<span class="event-photo-mark">0${j + 1}</span><span class="event-photo-label">Photo coming soon</span><span class="event-photo-orbit" aria-hidden="true"></span>`}</div><div class="event-photo-caption"><span>${e.city} · ${e.year}</span><h4>${title}</h4><p>${detail}</p></div></article>`,
        )
        .join("");
      document.querySelectorAll(".rvl").forEach((n) => n.classList.add("in"));
      if (typeof window.__refreshSectionMotion === "function")
        window.__refreshSectionMotion();
    };
    window.__edit = (i) => {
      apply(i);
    };
    switcher.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-edition]");
      if (b) apply(Number(b.dataset.edition));
    });
    document
      .querySelectorAll("#edt2 button")
      .forEach((b, i) => b.addEventListener("click", () => apply(i)));
    // Location controls also work when WebGL or an animation CDN is unavailable.
    if (!$("#pick button"))
      $("#pick").innerHTML = editions
        .map(
          (e, i) =>
            `<button class="loc" type="button" data-i="${i}"><em>STROOMVERSE ${e.year}</em><b>${e.city}</b><span>${e.country}</span></button>`,
        )
        .join("");
    document.querySelectorAll("#pick button").forEach((b, i) =>
      b.addEventListener("click", () => {
        apply(i);
        document.documentElement.classList.remove("lock");
      }),
    );
    const registration = document.querySelector("nav .pill");
    if (registration) {
      registration.textContent = "Contact us";
      registration.href = "#contact";
      registration.removeAttribute("target");
    }
    apply(0);
    document.documentElement.classList.remove("lock");
    $("#reel .ed-tabs").setAttribute("aria-label", "Choose conference edition");
    $("#film-play").addEventListener("click", () => {
      const video = $("#rv");
      if (!video.getAttribute("src") && video.dataset.filmSrc) {
        video.src = video.dataset.filmSrc;
        video.load();
      }
      video.play().then(() => { $("#film-play").hidden = true; }).catch(() => {
        $("#film-play").hidden = false;
        $("#film-play b").textContent = "Film unavailable · try again";
      });
    });
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", start, { once: true })
    : start();
})();
