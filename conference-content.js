/* Edition-specific content. Archived event details must be verified before adding. */
(() => {
  "use strict";
  const editions = [
    {
      city: "Dubai",
      country: "United Arab Emirates",
      year: "2026",
      reelVideo: "./Highlight.mp4",
      file: "Dubai skyline - Dubai, UAE.jpg",
      photo: "./assets/conference-gallery/dubai/poster-2.jpg",
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
    {
      city: "Orlando",
      country: "United States",
      year: "2024",
      reelVideo: "./Highlight.mp4",
      file: "Lake Eola and Orlando skyline.jpg",
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/3/30/Lake_Eola_and_Orlando_skyline.jpg",
      description:
        "Explore the Orlando edition of StroomVerse in Central Florida. This archive introduces the destination; the confirmed conference programme and event photographs have not yet been added.",
      highlights: [
        "Orlando, Florida",
        "2024 edition archive",
        "Event programme awaiting confirmation",
      ],
      events: [
        [
          "Keynotes",
          "Illustrative image · conference speaker on stage.",
          "./assets/conference-gallery/keynotes/keynote.jpg",
        ],
        [
          "Workshops",
          "Illustrative image · collaborative session.",
          "./assets/conference-gallery/workshops/workshop.jpg",
        ],
        [
          "The StroomVerse community",
          "Illustrative image · audience gathering.",
          "./assets/conference-gallery/community/audience.jpg",
        ],
        [
          "Dubai experiences",
          "Illustrative image · city after dark.",
          "./assets/conference-gallery/dubai/dubai-night.jpg",
        ],
      ],
    },
    {
      city: "Lisbon",
      country: "Portugal",
      reelVideo: "./Highlight.mp4",
      year: "2022",
      file: "Lisboa Skyline from the Roof of the Santa Justa Lift (42789303172).jpg",
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/c6/Lisboa_Skyline_from_the_Roof_of_the_Santa_Justa_Lift_(42789303172).jpg",
      description:
        "Explore the Lisbon edition of StroomVerse, set in Portugal’s capital. This destination archive offers a look at the city; the confirmed conference programme and event photographs have not yet been added.",
      highlights: [
        "Lisbon, Portugal",
        "2022 edition archive",
        "Event programme awaiting confirmation",
      ],
      events: [
        [
          "Keynotes",
          "Illustrative image · conference speaker on stage.",
          "./assets/conference-gallery/keynotes/keynote.jpg",
        ],
        [
          "Workshops",
          "Illustrative image · collaborative session.",
          "./assets/conference-gallery/workshops/workshop.jpg",
        ],
        [
          "The StroomVerse community",
          "Illustrative image · audience gathering.",
          "./assets/conference-gallery/community/audience.jpg",
        ],
        [
          "Dubai experiences",
          "Illustrative image · city after dark.",
          "./assets/conference-gallery/dubai/dubai-night.jpg",
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
            "Edition programme",
            "The detailed agenda for this edition has not yet been added to the archive.",
          ],
          speakers: [
            "Speakers",
            "The confirmed speaker list for this edition has not yet been added.",
          ],
          venue: [
            "Conference venue",
            "The venue for this edition has not yet been confirmed in this archive.",
          ],
          hotel: [
            "Stay in " + e.city,
            "Hotel arrangements for this past edition are not available in this archive.",
          ],
          faq: [
            "Edition information",
            "For questions about this past edition, contact the StroomX team.",
          ],
        };
        Object.entries(copy).forEach(([id, [title, text]]) => {
          $("#" + id).innerHTML =
            `<div class="wrap"><div class="eyebrow">${e.city} ${e.year}</div><h2>${title}</h2><p class="archive-note">${text}</p></div>`;
        });
      }
      $("#rt").textContent = `StroomVerse ${e.year} · ${e.city}`;
     const reelVideo = $("#rv");

reelVideo.pause();
reelVideo.removeAttribute("src");
reelVideo.replaceChildren();

if (e.reelVideo) {
  const source = document.createElement("source");
  source.src = e.reelVideo;
  source.type = "video/mp4";

  reelVideo.appendChild(source);
  reelVideo.hidden = false;

  reelVideo.load();

  reelVideo.play().catch((error) => {
    console.log("Video autoplay prevented:", error);
  });
} else {
  reelVideo.hidden = true;
  reelVideo.load();
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
        `<figure style="border-radius: 16px; overflow: hidden;">
    <img src="${e.photo}" width="1200" height="100%"
         loading="lazy"
         alt="${e.city} city skyline"
         style="width: 100%; height: 650px; object-fit: cover; border-radius: 16px;">
 
</figure>
<div class="archive-note">
    <div class="eyebrow">StroomVerse ${e.year}</div>
    <h3>${e.city}</h3>
    <p>${e.description}</p>
    <p>Looking for event photos? <a href="mailto:hello@stroomx.com">Contact the StroomX team ↗</a></p>
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
      $("#event-gallery-note").textContent = e.events
        ? "Illustrative event imagery; replace with official photos when available."
        : "Destination imagery for this edition; official event photos are not yet available.";
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
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", start, { once: true })
    : start();
})();
