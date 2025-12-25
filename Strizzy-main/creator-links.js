/*
  Configurable creator links + suggested videos renderer.

  How to use:
  - Edit the `config.platforms` array to add your platform links and Font Awesome icon classes.
  - Edit the `config.videos` array to add your YouTube video IDs (only ID, not full URL).
    Example: { id: 'dQw4w9WgXcQ', title: 'My Tutorial', description: 'Short desc' }

  This file is intentionally client-side only so you can edit values without a build step.
*/
(function () {
  const config = {
    platforms: [
      {
        name: "YouTube",
        url: "https://www.youtube.com/@StrizzyGG",
        icon: "fab fa-youtube",
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/strizzyg/",
        icon: "fab fa-instagram",
      },
      // Twitch then a custom box, then Twitter (X) — custom lets you provide your own image
      {
        name: "Twitch",
        url: "https://twitch.tv/strizzyg",
        icon: "fab fa-twitch",
      },

      { name: "X", url: "https://x.com/StrizzyGG", icon: "fab fa-twitter" },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@strizzyg",
        icon: "fab fa-tiktok",
      },
      {
        name: "Discord",
        url: "https://discord.gg/kYp23wWDAN",
        icon: "fab fa-discord",
      },
    ],
    // Replace VIDEO_ID_X with your YouTube video IDs. Keep placeholder IDs until you update.
    videos: [
      { id: "UTKLQQbn59k", title: "", description: "" },
      { id: "_6WSY3bUOD0", title: "", description: "" },
      { id: "gjNTUXgSPYA", title: "", description: "" },
    ],
  };

  function renderLinks(target) {
    const container = document.getElementById(target);
    if (!container) return;
    container.innerHTML = "";
    // render icon-only cards with a small "Follow" button beneath each
    config.platforms.forEach((p) => {
      const item = document.createElement("div");
      item.className = "platform-item";

      let a;
      if (p.custom) {
        // custom box — allow background image via p.image
        a = document.createElement("a");
        a.href = p.url || "#";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "platform-card custom";
        a.setAttribute("aria-label", p.name || "Custom");
        a.title = p.name || "Custom";
        if (p.image) {
          a.style.backgroundImage = `url('${p.image}')`;
          a.style.backgroundSize = "cover";
          a.style.backgroundPosition = "center";
        } else {
          a.style.background = "#000";
        }
        // empty content — image is background
        a.innerHTML = "";
        item.appendChild(a);
      } else {
        a = document.createElement("a");
        a.href = p.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "platform-card";
        a.setAttribute("aria-label", p.name);
        a.title = p.name;
        a.innerHTML = `<i class="${p.icon}" aria-hidden="true" style="color:#fff;"></i>`;
        a.style.background = "#000";
        a.style.backgroundSize = "cover";
        a.style.backgroundPosition = "center";
        item.appendChild(a);
      }

      // Do not render a follow/subscribe/join button for custom image boxes
      if (!p.custom) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "platform-follow";
        // Platform-specific button text: Discord -> 'Join', YouTube -> 'Subscribe', others -> 'Follow'
        const nameLower = (p.name || "").toLowerCase();
        if (nameLower.includes("discord")) {
          btn.textContent = "Join";
          btn.setAttribute("aria-label", `Join ${p.name}`);
        } else if (nameLower.includes("youtube")) {
          btn.textContent = "Subscribe";
          btn.setAttribute("aria-label", `Subscribe to ${p.name}`);
        } else {
          btn.textContent = "Follow";
          btn.setAttribute("aria-label", `Follow ${p.name}`);
        }
        // Style the follow button: black background, white text (subtle border/radius)
        // Clicking Follow will try a platform-specific follow/subscribe intent where supported
        btn.style.background = "#000";
        btn.style.color = "#fff";
        btn.style.border = "1px solid rgba(255,255,255,0.08)";
        btn.style.padding = "6px 10px";
        btn.style.borderRadius = "8px";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "600";
        btn.style.letterSpacing = "0.2px";
        function getFollowUrl(platform) {
          try {
            if (platform.follow) return platform.follow;
            const u = new URL(platform.url);
            const host = u.hostname.replace("www.", "").toLowerCase();
            const parts = u.pathname.split("/").filter(Boolean);
            const username = parts[0] || "";

            // X / Twitter: follow intent
            if (host.includes("twitter.com") || host.includes("x.com")) {
              if (username)
                return `https://twitter.com/intent/follow?screen_name=${username}`;
            }

            // YouTube: try adding subscription confirmation (works with channel or user paths)
            if (host.includes("youtube.com")) {
              let base = platform.url;
              if (base.endsWith("/")) base = base.slice(0, -1);
              return (
                base + (base.includes("?") ? "&" : "?") + "sub_confirmation=1"
              );
            }

            // Instagram / TikTok / LinkedIn etc.: no public follow-intent; open profile instead
            if (host.includes("instagram.com") && username) {
              return `https://www.instagram.com/${username}/`;
            }
            if (host.includes("tiktok.com") && username) {
              return `https://www.tiktok.com/@${username}`;
            }

            // Fallback to the provided URL
            return platform.url;
          } catch (err) {
            return platform.url;
          }
        }

        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          const followUrl = getFollowUrl(p) || p.url;
          // open follow intent or profile in new tab
          window.open(followUrl, "_blank", "noopener");
        });

        item.appendChild(btn);
      }
      container.appendChild(item);
    });
  }

  // Render videos by showing only the 3D feed for a clean, futuristic presentation
  function renderVideos() {
    const container = document.getElementById("suggestedVideos");
    if (!container) return;
    container.innerHTML = "";
    // Let render3DFeed handle the visible UI
    render3DFeed();
  }

  // Improved render3DFeed: lazy thumbnail loads, keyboard accessibility, ARIA
  function render3DFeed() {
    const container =
      document.getElementById("youtube3dFeed") ||
      document.getElementById("suggestedVideos");
    if (!container) return;
    container.innerHTML = "";
    container.style.minHeight = "220px";
    container.style.flexBasis = "100%";
    container.setAttribute("role", "region");
    container.setAttribute("aria-label", "Featured videos");
    console.log(
      "[creator-links] render3DFeed: videos count=",
      config.videos.length
    );
    // small debug badge so we can see the container in case of visual issues
    const debugBadge = document.createElement("div");
    debugBadge.className = "yt-debug-badge";
    debugBadge.textContent = `Loading ${config.videos.length} videos...`;
    debugBadge.style.cssText =
      "position:absolute;left:12px;top:12px;padding:6px 8px;background:rgba(0, 0, 0, 0.4);color:#fff;border-radius:6px;font-size:12px;z-index:50;pointer-events:none";
    container.appendChild(debugBadge);

    config.videos.forEach((v, idx) => {
      const card = document.createElement("div");
      card.className = "yt-card";
      card.setAttribute("data-id", v.id || "");
      card.setAttribute("data-idx", idx);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Play ${v.title || "video"}`);

      const depth = document.createElement("div");
      depth.className = "depth-layer";

      const thumb = document.createElement("div");
      thumb.className = "thumb";
      // create inner layer for true parallax
      const inner = document.createElement("div");
      inner.className = "thumb-inner";
      inner.style.backgroundImage = "linear-gradient(90deg,#131315,#0b0b13)";

      // lazy load real image into inner layer
      if (v.id && !v.id.startsWith("VIDEO_ID")) {
        const url = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
        const img = new Image();
        img.src = url;
        img.onload = function () {
          inner.style.backgroundImage = `url('${url}')`;
          inner.style.filter = "none";
        };
      }
      thumb.appendChild(inner);

      const play = document.createElement("div");
      play.className = "play";
      play.innerHTML = '<i class="fas fa-play"></i>';

      const meta = document.createElement("div");
      meta.className = "meta";
      const title = document.createElement("div");
      title.className = "title";
      title.textContent = v.title || "";
      const channel = document.createElement("div");
      channel.className = "small-muted";
      channel.textContent = v.channel || "";
      meta.appendChild(title);
      meta.appendChild(channel);

      depth.appendChild(thumb);
      card.appendChild(depth);
      card.appendChild(play);
      card.appendChild(meta);

      // mouse tilt (parallax inner layer)
      card.addEventListener("mousemove", function (e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = -y * 9;
        const ry = x * 13;
        card.style.transform = `translateY(-12px) translateZ(48px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        // inner parallax moves more
        inner.style.transform = `translateZ(90px) translateX(${
          x * 6
        }px) translateY(${y * 6}px) scale(1.06)`;
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        inner.style.transform = "";
      });

      // click / keyboard to open
      function activate() {
        if (!v.id || v.id.startsWith("VIDEO_ID")) return;
        openLightbox(v.id);
      }
      card.addEventListener("click", activate);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });

      container.appendChild(card);
    });
    console.log(
      "[creator-links] render3DFeed: rendered cards=",
      container.children.length
    );
    if (typeof debugBadge !== "undefined" && debugBadge) {
      debugBadge.textContent = `${container.children.length} cards rendered`;
      setTimeout(() => {
        try {
          debugBadge.style.transition = "opacity .35s";
          debugBadge.style.opacity = "0";
          setTimeout(() => {
            if (debugBadge && debugBadge.parentNode)
              debugBadge.parentNode.removeChild(debugBadge);
          }, 350);
        } catch (e) {}
      }, 800);
    }
  }

  // small helper: relative date formatter for ISO dates
  function formatRelativeDate(iso) {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = Math.floor((now - d) / 1000);
      const mins = Math.floor(diff / 60);
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      if (days < 1) return `${Math.max(mins, 1)} minutes ago`;
      if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
      if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
      return `${d.getFullYear()}`;
    } catch (e) {
      return "";
    }
  }

  // Lightbox helper
  function openLightbox(videoId) {
    // remove any existing lightbox nodes (defensive)
    const prev = document.getElementById("yt-lightbox");
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);

    // create a fresh lightbox appended to document.body with forced inline styles
    const lb = document.createElement("div");
    lb.id = "yt-lightbox";
    lb.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);z-index:2147483647;padding:24px;";
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLightbox();
    });
    const frame = document.createElement("div");
    frame.className = "frame";
    frame.style.cssText =
      "width: min(920px,96%); aspect-ratio: 16/9; background: #000; box-shadow: 0 30px 80px rgba(0,0,0,0.6);";
    lb.appendChild(frame);
    document.body.appendChild(lb);

    // create iframe with inline position to avoid global iframe rules
    frame.innerHTML = `<iframe class="yt-iframe" src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowfullscreen style="position:relative;width:100%; height:100%; border:0;"></iframe>`;
    // ensure it's visible and interactive
    lb.classList.add("active");
  }
  function closeLightbox() {
    const lb = document.getElementById("yt-lightbox");
    if (!lb) return;
    // clear iframe immediately to stop playback and prevent any floating artifacts
    const f = lb.querySelector(".frame");
    if (f) f.innerHTML = "";
    lb.classList.remove("active");
    // remove element from DOM to be extra-safe (clean state)
    try {
      lb.parentNode && lb.parentNode.removeChild(lb);
    } catch (e) {}
  }

  // Render on pages
  document.addEventListener("DOMContentLoaded", function () {
    renderLinks("creatorLinks");
    renderVideos();
    renderFooterSocials();
  });

  // Render footer social icons into any <ul class="social"> list
  function renderFooterSocials() {
    try {
      const ul = document.querySelectorAll("ul.social");
      if (!ul || ul.length === 0) return;
      ul.forEach((list) => {
        list.innerHTML = "";
        config.platforms.forEach((p) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = p.url || "#";
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.title = p.name || "";
          a.className = "social-link";
          a.innerHTML = `<i class="${p.icon}" aria-hidden="true"></i>`;
          li.appendChild(a);
          list.appendChild(li);
        });
      });
    } catch (e) {
      /* no-op */
    }
  }

  // Expose config for quick editing from console if desired
  window.__creatorConfig = config;
})();
