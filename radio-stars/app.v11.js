
"use strict";

const PLAYER_URL = "https://radio-stars-player.gzqlah8.chatgpt.site/";
const PLAYER_ORIGIN = new URL(PLAYER_URL).origin;
const AVAILABLE_LOCALES = Object.freeze(["fr"]);
const KNOWN_LOCALES = Object.freeze(["fr", "nl", "en"]);
const APP_DOWNLOAD_URLS = Object.freeze({ android: "", ios: "" });

const header = document.querySelector("#site-header");
const menuToggle = document.querySelector("#menu-toggle");
const navPanel = document.querySelector("#nav-panel");
const language = document.querySelector("#language");
const languageTrigger = document.querySelector("#language-trigger");
const languageOptions = Array.from(document.querySelectorAll("[data-language]"));
const contactForm = document.querySelector("#contact-form");
const appSection = document.querySelector("#application");
const appDeviceLabel = document.querySelector("#app-device-label");
const appDeviceHelp = document.querySelector("#app-device-help");
const toast = document.querySelector("#toast");
let toastTimer = 0;

const SITE_STREAM_URL = PLAYER_URL + "stream";
const SITE_STARTUP_TIMEOUT_MS = 9000;
const siteAudio = new Audio();
siteAudio.preload = "none";
siteAudio.playsInline = true;

let playerPopup = null;
let sitePlayPending = false;
let playerPopupMonitor = 0;
let sitePlaybackAttempt = 0;
let siteStartupTimer = 0;
let sitePlaybackTimedOut = false;

function clearSiteStartupTimer() {
  window.clearTimeout(siteStartupTimer);
  siteStartupTimer = 0;
}

function finishSitePlaybackAttempt(attempt) {
  if (attempt !== sitePlaybackAttempt) return;
  clearSiteStartupTimer();
  sitePlayPending = false;
  sendPlayerState();
}

function loadFreshSiteStream() {
  siteAudio.pause();
  siteAudio.src = SITE_STREAM_URL + "?session=" + Date.now().toString(36);
  siteAudio.load();
  sitePlaybackTimedOut = false;
}

function stopSiteAudio() {
  sitePlaybackAttempt += 1;
  clearSiteStartupTimer();
  sitePlayPending = false;
  sitePlaybackTimedOut = false;
  siteAudio.pause();
  sendPlayerState();
}

function watchPlayerWindow() {
  window.clearInterval(playerPopupMonitor);
  playerPopupMonitor = window.setInterval(function () {
    if (!playerPopup || !playerPopup.closed) return;
    stopSiteAudio();
    playerPopup = null;
    window.clearInterval(playerPopupMonitor);
    playerPopupMonitor = 0;
  }, 400);
}

function sendPlayerState() {
  if (!playerPopup || playerPopup.closed) return;
  try {
    playerPopup.postMessage({
      type: "radio-stars-state",
      playing: !siteAudio.paused && !siteAudio.ended,
      pending: sitePlayPending,
      volume: siteAudio.volume,
      error: Boolean(siteAudio.error) || sitePlaybackTimedOut
    }, PLAYER_ORIGIN);
  } catch (_) {}
}

function startSiteAudio() {
  if (sitePlayPending || !siteAudio.paused) {
    sendPlayerState();
    return;
  }

  if (!siteAudio.src || sitePlaybackTimedOut || siteAudio.error) loadFreshSiteStream();

  const attempt = ++sitePlaybackAttempt;
  sitePlayPending = true;
  sendPlayerState();

  siteStartupTimer = window.setTimeout(function () {
    if (attempt !== sitePlaybackAttempt || !sitePlayPending) return;
    sitePlaybackTimedOut = true;
    finishSitePlaybackAttempt(attempt);
    showToast("Le direct tarde à répondre — touchez le bouton rouge du player");
  }, SITE_STARTUP_TIMEOUT_MS);

  let playResult;
  try {
    playResult = siteAudio.play();
  } catch (_) {
    sitePlaybackTimedOut = true;
    showToast("Touchez le bouton rouge du player pour écouter");
    finishSitePlaybackAttempt(attempt);
    return;
  }

  Promise.resolve(playResult).then(function () {
    finishSitePlaybackAttempt(attempt);
  }).catch(function () {
    if (attempt !== sitePlaybackAttempt) return;
    sitePlaybackTimedOut = true;
    showToast("Touchez le bouton rouge du player pour écouter");
    finishSitePlaybackAttempt(attempt);
  });
}

["pause", "waiting", "stalled", "volumechange"].forEach(function (eventName) {
  siteAudio.addEventListener(eventName, sendPlayerState);
});

siteAudio.addEventListener("playing", function () {
  sitePlaybackTimedOut = false;
  finishSitePlaybackAttempt(sitePlaybackAttempt);
  sendPlayerState();
});

siteAudio.addEventListener("error", function () {
  sitePlaybackTimedOut = true;
  finishSitePlaybackAttempt(sitePlaybackAttempt);
  sendPlayerState();
});

window.addEventListener("message", function (event) {
  if (event.origin !== PLAYER_ORIGIN || event.source !== playerPopup) return;
  const message = event.data;
  if (!message || message.type !== "radio-stars-command") return;

  if (message.action === "state") {
    sendPlayerState();
  } else if (message.action === "play") {
    startSiteAudio();
  } else if (message.action === "pause") {
    stopSiteAudio();
  } else if (message.action === "toggle") {
    if (siteAudio.paused) startSiteAudio();
    else stopSiteAudio();
  } else if (message.action === "volume") {
    const numeric = Number(message.value);
    if (Number.isFinite(numeric)) siteAudio.volume = Math.max(0, Math.min(1, numeric));
  }
});

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

function detectMobilePlatform() {
  const userAgent = String(navigator.userAgent || "");
  const platform = String((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "");
  const touchMac = /Mac/i.test(platform) && Number(navigator.maxTouchPoints || 0) > 1;

  if (/Android/i.test(userAgent) || /Android/i.test(platform)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent) || touchMac) return "ios";
  return "other";
}

function setupAppDownloads() {
  if (!appSection) return;

  const device = detectMobilePlatform();
  appSection.dataset.device = device;

  const messages = {
    android: {
      label: "Appareil Android détecté",
      help: "La version APK sera automatiquement recommandée dès que son lien est disponible."
    },
    ios: {
      label: "iPhone ou iPad détecté",
      help: "La version iOS sera automatiquement recommandée dès que son lien est disponible."
    },
    other: {
      label: "Vous consultez la page sur un ordinateur",
      help: "Sur un téléphone, la page recommandera automatiquement Android ou iPhone/iPad."
    }
  };

  if (appDeviceLabel) appDeviceLabel.textContent = messages[device].label;
  if (appDeviceHelp) appDeviceHelp.textContent = messages[device].help;

  document.querySelectorAll("[data-app-platform]").forEach(function (card) {
    card.dataset.recommended = String(card.dataset.appPlatform === device);
  });

  document.querySelectorAll("[data-app-download]").forEach(function (link) {
    const platformName = link.dataset.appDownload;
    const downloadUrl = APP_DOWNLOAD_URLS[platformName];

    if (downloadUrl) {
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-disabled", "false");
      link.textContent = platformName === "android" ? "Télécharger l’APK" : "Télécharger pour iPhone";
      return;
    }

    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", function (event) {
      event.preventDefault();
      showToast("Le lien de téléchargement sera ajouté prochainement");
    });
  });
}

setupAppDownloads();

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
  if (window.innerWidth > 1040) closeMenu();
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
    startSiteAudio();

    const features = "popup=yes,width=460,height=720,resizable=yes,scrollbars=yes";
    const destination = PLAYER_URL + "?remote=1&controller=" + encodeURIComponent(location.origin);
    const popup = window.open(destination, "_blank", features);
    if (!popup) return;

    event.preventDefault();
    playerPopup = popup;
    watchPlayerWindow();
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

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const fields = new FormData(contactForm);
    const name = String(fields.get("name") || "").trim().slice(0, 100);
    const email = String(fields.get("email") || "").trim().slice(0, 160);
    const subject = String(fields.get("subject") || "").trim().slice(0, 140);
    const message = String(fields.get("message") || "").trim().slice(0, 1500);
    const mailSubject = "[Site Radio Stars] " + subject;
    const mailBody = [
      "Nom : " + name,
      "E-mail : " + email,
      "",
      message
    ].join("\n");

    showToast("Votre messagerie va s’ouvrir");
    window.location.href = "mailto:info@radiostars.be?subject="
      + encodeURIComponent(mailSubject)
      + "&body="
      + encodeURIComponent(mailBody);
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
