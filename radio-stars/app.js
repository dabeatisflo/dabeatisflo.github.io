
"use strict";

const PLAYER_URL = "https://radio-stars-player.gzqlah8.chatgpt.site/";
const AVAILABLE_LOCALES = Object.freeze(["fr"]);
const KNOWN_LOCALES = Object.freeze(["fr", "nl", "en"]);

const header = document.querySelector("#site-header");
const menuToggle = document.querySelector("#menu-toggle");
const navPanel = document.querySelector("#nav-panel");
const language = document.querySelector("#language");
const languageTrigger = document.querySelector("#language-trigger");
const languageOptions = Array.from(document.querySelectorAll("[data-language]"));
const toast = document.querySelector("#toast");
let toastTimer = 0;

function normalizeLocale(value) {
  const normalized = String(value || "").trim().toLowerCase().replace("_", "-").split("-")[0];
  return KNOWN_LOCALES.includes(normalized) ? normalized : null;
}

function browserLocale() {
  const candidates = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language];
  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale) return locale;
  }
  return "fr";
}

function storedLocale() {
  try { return normalizeLocale(localStorage.getItem("radioStarsLocale")); }
  catch (_) { return null; }
}

function requestedLocale() {
  const query = normalizeLocale(new URLSearchParams(location.search).get("lang"));
  return query || storedLocale() || browserLocale() || "fr";
}

const detectedLocale = browserLocale();
const preferredLocale = requestedLocale();
const activeLocale = AVAILABLE_LOCALES.includes(preferredLocale) ? preferredLocale : "fr";

document.documentElement.lang = activeLocale;
document.documentElement.dataset.detectedLanguage = detectedLocale;
document.documentElement.dataset.preferredLanguage = preferredLocale;

languageOptions.forEach(function (option) {
  option.setAttribute("aria-current", option.dataset.language === activeLocale ? "true" : "false");
});

function showToast(message) {
  toast.textContent = message;
  toast.dataset.visible = "true";
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(function () {
    toast.dataset.visible = "false";
  }, 2800);
}

function closeMenu() {
  header.dataset.menuOpen = "false";
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", function () {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  header.dataset.menuOpen = String(opening);
  menuToggle.setAttribute("aria-expanded", String(opening));
  document.body.classList.toggle("menu-open", opening);
});

navPanel.querySelectorAll("a[href^='#']").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 920) closeMenu();
});

window.addEventListener("scroll", function () {
  header.classList.toggle("is-sticky", window.scrollY > 18);
}, { passive: true });

languageTrigger.addEventListener("click", function () {
  const opening = language.dataset.open !== "true";
  language.dataset.open = String(opening);
  languageTrigger.setAttribute("aria-expanded", String(opening));
});

languageOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    const selected = normalizeLocale(option.dataset.language) || "fr";
    try { localStorage.setItem("radioStarsLocale", selected); } catch (_) {}

    if (!AVAILABLE_LOCALES.includes(selected)) {
      showToast("Cette langue sera bientôt disponible. Le français reste affiché.");
    }

    language.dataset.open = "false";
    languageTrigger.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", function (event) {
  if (!language.contains(event.target)) {
    language.dataset.open = "false";
    languageTrigger.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
    language.dataset.open = "false";
    languageTrigger.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll("[data-player]").forEach(function (link) {
  link.addEventListener("click", function (event) {
    const features = "popup=yes,width=460,height=720,resizable=yes,scrollbars=yes";
    const destination = link.href || (PLAYER_URL + "?autoplay=1");
    const popup = window.open(destination, "radioStarsPlayer", features);
    if (!popup) return;

    event.preventDefault();
    try { popup.opener = null; } catch (_) {}
    try { popup.focus(); } catch (_) {}
  });
});

document.querySelectorAll("[data-share-player]").forEach(function (button) {
  button.addEventListener("click", async function () {
    const shareData = {
      title: "Radio Stars — Le Player",
      text: "Écoutez Radio Stars 98.5 FM en direct.",
      url: PLAYER_URL
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(PLAYER_URL);
      showToast("Lien du player copié");
    } catch (error) {
      if (error && error.name === "AbortError") return;
      try {
        const helper = document.createElement("textarea");
        helper.value = PLAYER_URL;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
        showToast("Lien du player copié");
      } catch (_) {
        showToast("Copiez le lien du player depuis votre navigateur");
      }
    }
  });
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
