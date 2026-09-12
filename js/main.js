/* =====================================================
   ABIZER & JUMANA — WEDDING INVITATION
   ===================================================== */
(function () {
  "use strict";

  /* -----------------------------------------------------
     CONFIG — edit these to update the site later
     ----------------------------------------------------- */
  var CONFIG = {
    // From the YouTube Music link provided:
    // https://music.youtube.com/watch?v=ZZCg8QYodOI
    youtubeVideoId: "ZZCg8QYodOI",

    countdownTarget: "2026-10-23T00:00:00", // local time

    // Set rsvpUrl to a real link (form, WhatsApp, mailto) to activate the RSVP button.
    rsvpUrl: ""
  };

  /* -----------------------------------------------------
     ENVELOPE OPEN + REVEAL
     ----------------------------------------------------- */
  var envelopeScreen = document.getElementById("envelope-screen");
  var envelopeTrigger = document.getElementById("envelope-trigger");
  var invitation = document.getElementById("invitation");
  var particlesWrap = document.getElementById("particles");
  var musicToggle = document.getElementById("music-toggle");

  var hasOpened = false;

  function spawnParticles() {
    for (var i = 0; i < 18; i++) {
      (function (i) {
        setTimeout(function () {
          var p = document.createElement("span");
          p.className = "particle";
          var left = 30 + Math.random() * 40; // %
          var drift = (Math.random() - 0.5) * 80;
          p.style.left = left + "%";
          p.style.top = "48%";
          p.style.setProperty("--drift", drift + "px");
          particlesWrap.appendChild(p);
          setTimeout(function () { p.remove(); }, 3300);
        }, i * 90);
      })(i);
    }
  }

  function openEnvelope() {
    if (hasOpened) return;
    hasOpened = true;

    envelopeTrigger.classList.add("is-opening");
    spawnParticles();
    startMusic();

    // Reveal main content after the physical open animation plays out
    setTimeout(function () {
      invitation.hidden = false;
      requestAnimationFrame(function () {
        envelopeScreen.classList.add("is-hidden");
        document.body.style.overflow = "";
        initScrollReveal();
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    }, 1500);

    setTimeout(function () {
      musicToggle.classList.add("is-visible");
    }, 1900);
  }

  envelopeTrigger.addEventListener("click", openEnvelope);
  envelopeTrigger.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  // lock scroll behind the envelope screen until opened
  document.body.style.overflow = "hidden";

  /* -----------------------------------------------------
     BACKGROUND MUSIC (YouTube IFrame API)
     Autoplay-with-sound is blocked by most mobile browsers,
     so playback begins on the envelope tap itself — which is
     already a user gesture, so this works reliably on iOS/Android.
     ----------------------------------------------------- */
  var ytPlayer = null;
  var ytReady = false;
  var wantsPlay = false;
  var isMuted = false;

  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player("yt-player", {
      videoId: CONFIG.youtubeVideoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        loop: 1,
        playlist: CONFIG.youtubeVideoId
      },
      events: {
        onReady: function () {
          ytReady = true;
          if (wantsPlay) ytPlayer.playVideo();
        }
      }
    });
  };

  (function loadYouTubeAPI() {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(tag, firstScript);
  })();

  function startMusic() {
    wantsPlay = true;
    if (ytReady && ytPlayer && ytPlayer.playVideo) {
      ytPlayer.playVideo();
    }
  }

  musicToggle.addEventListener("click", function () {
    if (!ytPlayer) return;
    isMuted = !isMuted;
    if (isMuted) {
      ytPlayer.mute();
    } else {
      ytPlayer.unMute();
    }
    musicToggle.classList.toggle("is-muted", isMuted);
    musicToggle.setAttribute("aria-pressed", String(isMuted));
  });

  /* -----------------------------------------------------
     COUNTDOWN
     ----------------------------------------------------- */
  (function countdown() {
    var target = new Date(CONFIG.countdownTarget).getTime();
    var elDays = document.getElementById("cd-days");
    var elHours = document.getElementById("cd-hours");
    var elMins = document.getElementById("cd-mins");
    var elSecs = document.getElementById("cd-secs");
    var countdownEl = document.getElementById("countdown");
    var fallbackEl = document.getElementById("countdown-fallback");

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        countdownEl.hidden = true;
        fallbackEl.hidden = false;
        clearInterval(timer);
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      elDays.textContent = pad(d);
      elHours.textContent = pad(h);
      elMins.textContent = pad(m);
      elSecs.textContent = pad(s);
    }

    tick();
    var timer = setInterval(tick, 1000);
  })();

  /* -----------------------------------------------------
     ADD TO CALENDAR
     Uses Google Calendar links. Where no time was supplied
     (Day Two, Day Three) the event is created as an all-day
     event rather than inventing a clock time.
     ----------------------------------------------------- */
  var CAL_EVENTS = {
    day1: {
      title: "Mama Musaala & Katha Ni Rasam — Abizer & Jumana",
      details: "Morning Programme, Day One of the wedding celebrations of Abizer & Jumana.",
      start: "20261023T095300",
      end: "20261023T105300",
      allDay: false
    },
    day2: {
      title: "Shehar Gasht (Procession) — Abizer & Jumana",
      details: "Evening Programme, Day Two of the wedding celebrations of Abizer & Jumana.",
      date: "20261024",
      dateEnd: "20261025",
      allDay: true
    },
    day3: {
      title: "Valeema Nu Jaman & Musafo — Abizer & Jumana",
      details: "Evening Programme, Day Three of the wedding celebrations of Abizer & Jumana.",
      date: "20261025",
      dateEnd: "20261026",
      allDay: true
    }
  };

  function buildGoogleCalendarUrl(evt) {
    var base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    var dates = evt.allDay ? (evt.date + "/" + evt.dateEnd) : (evt.start + "/" + evt.end);
    return base +
      "&text=" + encodeURIComponent(evt.title) +
      "&dates=" + dates +
      "&details=" + encodeURIComponent(evt.details);
  }

  document.querySelectorAll(".cal-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-cal");
      var evt = CAL_EVENTS[key];
      if (!evt) return;
      window.open(buildGoogleCalendarUrl(evt), "_blank", "noopener");
    });
  });

  /* -----------------------------------------------------
     RSVP — only activates once a real destination is set
     ----------------------------------------------------- */
  (function setupRsvp() {
    var rsvpBtn = document.getElementById("rsvp-btn");
    var rsvpHint = document.getElementById("rsvp-hint");
    if (CONFIG.rsvpUrl) {
      rsvpBtn.href = CONFIG.rsvpUrl;
      rsvpBtn.target = "_blank";
      rsvpBtn.rel = "noopener noreferrer";
      rsvpBtn.setAttribute("data-configured", "true");
      rsvpHint.hidden = true;
    } else {
      rsvpBtn.addEventListener("click", function (e) { e.preventDefault(); });
    }
  })();

  /* -----------------------------------------------------
     SCROLL REVEAL — one quiet pass, not per-card spam
     ----------------------------------------------------- */
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      ".card, .countdown-section, .celebrations__title, .celebrations__sub, .event-card, .location, .rsvp, .closing"
    );
    targets.forEach(function (el) { el.classList.add("reveal"); });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }
})();
