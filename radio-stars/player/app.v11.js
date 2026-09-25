
"use strict";

const playButton = document.querySelector("#play");
const statusBox = document.querySelector("#status");
const statusTitle = document.querySelector("#status-title");
const statusDetail = document.querySelector("#status-detail");
const volume = document.querySelector("#volume");
const volumeValue = document.querySelector("#volume-value");
const shareButton = document.querySelector("#share");
const sharePanel = document.querySelector("#share-panel");
const shareUrlField = document.querySelector("#share-url");
const copyShareButton = document.querySelector("#copy-share");
const nativeShareButton = document.querySelector("#native-share");
const whatsappShare = document.querySelector("#whatsapp-share");
const facebookShare = document.querySelector("#facebook-share");
const emailShare = document.querySelector("#email-share");
const gmailShare = document.querySelector("#gmail-share");
const outlookShare = document.querySelector("#outlook-share");
const smsShare = document.querySelector("#sms-share");
const xShare = document.querySelector("#x-share");
const telegramShare = document.querySelector("#telegram-share");
const tiktokShareButton = document.querySelector("#tiktok-share");
const shareFeedback = document.querySelector("#share-feedback");
const toast = document.querySelector("#toast");

const STREAM_PATH = "https://radio-stars-player.gzqlah8.chatgpt.site/stream";
const SHARE_URL = new URL("./", location.href).href;
const STARTUP_TIMEOUT_MS = 9000;
const audio = new Audio();
audio.preload = "none";
audio.playsInline = true;

let toastTimer = 0;
let playPending = false;
let playbackAttempt = 0;
let startupTimer = 0;
let playbackTimedOut = false;
let remoteReady = false;
let remoteFailed = false;
let shareReturnFocus = null;

const query = new URLSearchParams(location.search);
const playerLanguage = document.querySelector("#player-language");
function normalizeLocale(value) {
  const code = String(value || "").toLowerCase().trim().replace("_", "-").split("-")[0];
  return ["fr", "nl", "en"].includes(code) ? code : null;
}
let storedLanguage = null;
try { storedLanguage = normalizeLocale(localStorage.getItem("radioStarsLocale")); } catch (_) {}
const activeLocale = normalizeLocale(query.get("lang")) || storedLanguage || normalizeLocale(navigator.language) || "fr";
try { localStorage.setItem("radioStarsLocale", activeLocale); } catch (_) {}
document.documentElement.lang = activeLocale;
playerLanguage.value = activeLocale;
playerLanguage.addEventListener("change", function () {
  const selected = normalizeLocale(playerLanguage.value) || "fr";
  try { localStorage.setItem("radioStarsLocale", selected); } catch (_) {}
  const destination = new URL(location.href);
  destination.searchParams.set("lang", selected);
  location.assign(destination.href);
});

const TRANSLATIONS = {
  "nl": {
    "Le Player — Radio Stars": "De speler — Radio Stars",
    "En direct": "Live",
    "Player officiel": "Officiële speler",
    "En ligne": "Online",
    "Prêt à écouter": "Klaar om te luisteren",
    "Appuyez sur le bouton rouge pour lancer le direct.": "Druk op de rode knop om de live-uitzending te starten.",
    "Partager": "Delen",
    "Le site": "De website",
    "Ce player fonctionne indépendamment du site principal. Une connexion internet est nécessaire.": "Deze speler werkt onafhankelijk van de hoofdwebsite. Je hebt een internetverbinding nodig.",
    "Radio Stars sur Facebook": "Radio Stars op Facebook",
    "© 2026 Poignie Floris. Tous droits réservés. Conception et code soumis à autorisation écrite.": "© 2026 Poignie Floris. Alle rechten voorbehouden. Voor ontwerp en code is schriftelijke toestemming vereist.",
    "JavaScript doit être activé pour utiliser le player.": "Schakel JavaScript in om de speler te gebruiken.",
    "Partager le player": "De speler delen",
    "Envoyez le lien officiel pour écouter Radio Stars partout.": "Deel de officiële link om overal naar Radio Stars te luisteren.",
    "Copier": "Kopiëren",
    "Messagerie": "E-mailprogramma",
    "Plus d’applications…": "Meer apps…",
    "Écouter Radio Stars": "Luister naar Radio Stars",
    "Mettre Radio Stars en pause": "Radio Stars pauzeren",
    "Fermer le partage": "Deelvenster sluiten",
    "Fermer": "Sluiten",
    "Lien du player Radio Stars": "Link naar de Radio Stars-speler",
    "Écoutez Radio Stars 98.5 FM et DAB+ en direct. Le player officiel, autonome et partageable.": "Luister live naar Radio Stars via 98.5 FM en DAB+. De officiële, zelfstandige speler die je kunt delen.",
    "Radio Stars — Le Player": "Radio Stars — De speler",
    "Écoutez Radio Stars 98.5 FM et DAB+ en direct.": "Luister live naar Radio Stars op 98.5 FM en via DAB+.",
    "Écoutez Radio Stars en direct.": "Luister live naar Radio Stars.",
    "En direct — Radio Stars": "Live — Radio Stars",
    "Vous êtes hors ligne": "Je bent offline",
    "Vérifiez votre connexion internet.": "Controleer je internetverbinding.",
    "Touchez pour écouter": "Tik om te luisteren",
    "Votre navigateur bloque le son automatique. Le bouton rouge lance immédiatement la radio.": "Je browser blokkeert automatisch geluid. Tik op de rode knop om de radio te starten.",
    "Touchez à nouveau pour écouter": "Tik opnieuw om te luisteren",
    "La connexion a été interrompue. Réessayez avec le bouton rouge.": "De verbinding is onderbroken. Probeer het opnieuw met de rode knop.",
    "Démarrage du direct…": "Live-uitzending wordt gestart…",
    "Connexion…": "Verbinden…",
    "Radio Stars se lance automatiquement.": "Radio Stars start automatisch.",
    "Le direct va démarrer dans un instant.": "De live-uitzending begint zo.",
    "Le direct tarde à répondre. Le bouton rouge relance une nouvelle connexion.": "De live-uitzending reageert traag. Met de rode knop maak je opnieuw verbinding.",
    "Connexion au direct…": "Verbinden met de live-uitzending…",
    "La lecture démarre avec votre clic.": "Het afspelen start zodra je klikt.",
    "Vous écoutez Radio Stars": "Je luistert naar Radio Stars",
    "Le direct 98.5 FM est en cours.": "De live-uitzending op 98.5 FM speelt.",
    "Le bouton rouge relance directement la radio.": "Met de rode knop start je de radio opnieuw.",
    "Lecture en pause": "Afspelen gepauzeerd",
    "Appuyez sur le bouton rouge pour reprendre.": "Druk op de rode knop om verder te luisteren.",
    "Quelques secondes peuvent être nécessaires.": "Dit kan enkele seconden duren.",
    "Reconnexion…": "Opnieuw verbinden…",
    "Le lecteur cherche à retrouver le direct.": "De speler probeert opnieuw verbinding te maken met de live-uitzending.",
    "Le direct est momentanément indisponible": "De live-uitzending is tijdelijk niet beschikbaar",
    "Patientez quelques secondes puis réessayez.": "Wacht enkele seconden en probeer het opnieuw.",
    "Écoutez Radio Stars en direct : ": "Luister live naar Radio Stars: ",
    "Radio Stars 98.5 FM — en direct": "Radio Stars 98.5 FM — live",
    "Lien du player copié": "Link naar de speler gekopieerd",
    "Le lien est sélectionné — choisissez Copier": "De link is geselecteerd — kies Kopiëren",
    "Lien copié — collez-le dans TikTok": "Link gekopieerd — plak hem in TikTok",
    "Lien prêt — choisissez TikTok": "Link klaar — kies TikTok",
    "Utilisez Copier, WhatsApp ou Facebook": "Gebruik Kopiëren, WhatsApp of Facebook",
    "Lien copié — collez-le dans un message TikTok.": "Link gekopieerd — plak hem in een TikTok-bericht.",
    "Sélectionnez le lien, copiez-le puis collez-le dans TikTok.": "Selecteer de link, kopieer hem en plak hem in TikTok.",
    "Radio Stars — En direct": "Radio Stars — Live",
    "Choisir la langue": "Kies een taal"
  },
  "en": {
    "Le Player — Radio Stars": "The Player — Radio Stars",
    "En direct": "Live",
    "Player officiel": "Official player",
    "En ligne": "Online",
    "Prêt à écouter": "Ready to listen",
    "Appuyez sur le bouton rouge pour lancer le direct.": "Press the red button to start the live stream.",
    "Partager": "Share",
    "Le site": "The website",
    "Ce player fonctionne indépendamment du site principal. Une connexion internet est nécessaire.": "This player works independently of the main website. An internet connection is required.",
    "Radio Stars sur Facebook": "Radio Stars on Facebook",
    "© 2026 Poignie Floris. Tous droits réservés. Conception et code soumis à autorisation écrite.": "© 2026 Poignie Floris. All rights reserved. Written permission is required to use the design and code.",
    "JavaScript doit être activé pour utiliser le player.": "Enable JavaScript to use the player.",
    "Partager le player": "Share the player",
    "Envoyez le lien officiel pour écouter Radio Stars partout.": "Share the official link to listen to Radio Stars anywhere.",
    "Copier": "Copy",
    "Messagerie": "Email app",
    "Plus d’applications…": "More apps…",
    "Écouter Radio Stars": "Listen to Radio Stars",
    "Mettre Radio Stars en pause": "Pause Radio Stars",
    "Fermer le partage": "Close sharing panel",
    "Fermer": "Close",
    "Lien du player Radio Stars": "Radio Stars player link",
    "Écoutez Radio Stars 98.5 FM et DAB+ en direct. Le player officiel, autonome et partageable.": "Listen to Radio Stars live on 98.5 FM and DAB+. The official standalone player, ready to share.",
    "Radio Stars — Le Player": "Radio Stars — The Player",
    "Écoutez Radio Stars 98.5 FM et DAB+ en direct.": "Listen to Radio Stars live on 98.5 FM and DAB+.",
    "Écoutez Radio Stars en direct.": "Listen to Radio Stars live.",
    "En direct — Radio Stars": "Live — Radio Stars",
    "Vous êtes hors ligne": "You are offline",
    "Vérifiez votre connexion internet.": "Check your internet connection.",
    "Touchez pour écouter": "Tap to listen",
    "Votre navigateur bloque le son automatique. Le bouton rouge lance immédiatement la radio.": "Your browser blocks automatic audio. Tap the red button to start the radio.",
    "Touchez à nouveau pour écouter": "Tap again to listen",
    "La connexion a été interrompue. Réessayez avec le bouton rouge.": "The connection was interrupted. Try again with the red button.",
    "Démarrage du direct…": "Starting live stream…",
    "Connexion…": "Connecting…",
    "Radio Stars se lance automatiquement.": "Radio Stars is starting automatically.",
    "Le direct va démarrer dans un instant.": "The live stream will start shortly.",
    "Le direct tarde à répondre. Le bouton rouge relance une nouvelle connexion.": "The live stream is taking a while to respond. Press the red button to reconnect.",
    "Connexion au direct…": "Connecting to the live stream…",
    "La lecture démarre avec votre clic.": "Playback starts when you click.",
    "Vous écoutez Radio Stars": "You are listening to Radio Stars",
    "Le direct 98.5 FM est en cours.": "The live 98.5 FM broadcast is playing.",
    "Le bouton rouge relance directement la radio.": "Press the red button to restart the radio.",
    "Lecture en pause": "Playback paused",
    "Appuyez sur le bouton rouge pour reprendre.": "Press the red button to resume.",
    "Quelques secondes peuvent être nécessaires.": "This may take a few seconds.",
    "Reconnexion…": "Reconnecting…",
    "Le lecteur cherche à retrouver le direct.": "The player is trying to reconnect to the live stream.",
    "Le direct est momentanément indisponible": "The live stream is temporarily unavailable",
    "Patientez quelques secondes puis réessayez.": "Wait a few seconds and try again.",
    "Écoutez Radio Stars en direct : ": "Listen to Radio Stars live: ",
    "Radio Stars 98.5 FM — en direct": "Radio Stars 98.5 FM — live",
    "Lien du player copié": "Player link copied",
    "Le lien est sélectionné — choisissez Copier": "The link is selected — choose Copy",
    "Lien copié — collez-le dans TikTok": "Link copied — paste it into TikTok",
    "Lien prêt — choisissez TikTok": "Link ready — choose TikTok",
    "Utilisez Copier, WhatsApp ou Facebook": "Use Copy, WhatsApp or Facebook",
    "Lien copié — collez-le dans un message TikTok.": "Link copied — paste it into a TikTok message.",
    "Sélectionnez le lien, copiez-le puis collez-le dans TikTok.": "Select the link, copy it and paste it into TikTok.",
    "Radio Stars — En direct": "Radio Stars — Live",
    "Choisir la langue": "Choose a language"
  }
};

function t(value) {
  return (TRANSLATIONS[activeLocale] || {})[value] || value;
}

function translateDocument() {
  if (activeLocale === "fr") return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement && node.parentElement.closest("script, style, svg, noscript")) continue;
    const raw = node.nodeValue;
    const key = raw.replace(/\s+/g, " ").trim();
    if (!key || !TRANSLATIONS[activeLocale][key]) continue;
    const before = raw.match(/^\s*/)[0];
    const after = raw.match(/\s*$/)[0];
    node.nodeValue = before + t(key) + after;
  }
  document.querySelectorAll("[aria-label], [placeholder], [title]").forEach(function (element) {
    ["aria-label", "placeholder", "title"].forEach(function (attr) {
      if (element.hasAttribute(attr)) element.setAttribute(attr, t(element.getAttribute(attr)));
    });
  });
  document.querySelectorAll("meta[name='description'], meta[name='copyright'], meta[property^='og:'], meta[name^='twitter:']").forEach(function (element) {
    if (element.hasAttribute("content")) element.setAttribute("content", t(element.getAttribute("content")));
  });
  const ogLocale = document.querySelector("meta[property='og:locale']");
  if (ogLocale) ogLocale.content = activeLocale === "nl" ? "nl_BE" : "en_GB";
  document.title = t(document.title);
}

translateDocument();

const allowedRemoteOrigins = Object.freeze([location.origin]);

let remoteOrigin = null;
if (query.get("remote") === "1" && window.opener && !window.opener.closed) {
  const requestedController = query.get("controller");
  if (allowedRemoteOrigins.includes(requestedController)) {
    remoteOrigin = requestedController;
  } else {
    try {
      const referrerOrigin = new URL(document.referrer).origin;
      if (allowedRemoteOrigins.includes(referrerOrigin)) remoteOrigin = referrerOrigin;
    } catch (_) {}
  }
}

function sendRemoteCommand(action, value) {
  if (!remoteOrigin || !window.opener || window.opener.closed) return false;
  try {
    window.opener.postMessage({ type: "radio-stars-command", action, value }, remoteOrigin);
    return true;
  } catch (_) {
    return false;
  }
}

window.addEventListener("pagehide", function () {
  if (remoteOrigin) sendRemoteCommand("pause");
});

function renderVolume(value, persist) {
  const numeric = Math.max(0, Math.min(1, value));
  const percent = Math.round(numeric * 100);
  volume.value = String(percent);
  volumeValue.textContent = percent + "%";
  volume.style.setProperty("--volume", percent + "%");
  if (persist) {
    try { localStorage.setItem("radioStarsVolume", String(numeric)); } catch (_) {}
  }
}

function setStatus(title, detail, tone) {
  statusTitle.textContent = title;
  statusDetail.textContent = detail;
  statusBox.dataset.tone = tone || "normal";
}

function setPlaying(isPlaying) {
  playButton.dataset.state = isPlaying ? "playing" : "paused";
  playButton.setAttribute("aria-label", isPlaying ? t("Mettre Radio Stars en pause") : t("Écouter Radio Stars"));
  playButton.setAttribute("aria-pressed", String(isPlaying));
  document.title = isPlaying ? t("En direct — Radio Stars") : t("Le Player — Radio Stars");
}

function showToast(message) {
  toast.textContent = message;
  toast.dataset.visible = "true";
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(function () {
    toast.dataset.visible = "false";
  }, 2400);
}

function updateVolume(value) {
  const numeric = Math.max(0, Math.min(1, value));
  audio.volume = numeric;
  renderVolume(numeric, true);
}

try {
  const savedValue = localStorage.getItem("radioStarsVolume");
  const savedVolume = savedValue === null ? Number.NaN : Number(savedValue);
  updateVolume(Number.isFinite(savedVolume) ? savedVolume : .82);
} catch (_) {
  updateVolume(.82);
}

function clearStartupTimer() {
  window.clearTimeout(startupTimer);
  startupTimer = 0;
}

function finishPlaybackAttempt(attempt) {
  if (attempt !== playbackAttempt) return;
  clearStartupTimer();
  playPending = false;
  playButton.removeAttribute("aria-busy");
}

function loadFreshStream() {
  audio.pause();
  audio.src = STREAM_PATH + "?session=" + Date.now().toString(36);
  audio.load();
  playbackTimedOut = false;
}

function showPlaybackFailure(error, automatic) {
  setPlaying(false);
  playbackTimedOut = true;
  if (!navigator.onLine) {
    setStatus(t("Vous êtes hors ligne"), t("Vérifiez votre connexion internet."), "error");
  } else if (automatic && error && error.name === "NotAllowedError") {
    setStatus(
      t("Touchez pour écouter"),
      t("Votre navigateur bloque le son automatique. Le bouton rouge lance immédiatement la radio.")
    );
  } else {
    setStatus(
      t("Touchez à nouveau pour écouter"),
      t("La connexion a été interrompue. Réessayez avec le bouton rouge."),
      "error"
    );
  }
}

function startPlayback(automatic) {
  if (playPending) return;

  if (!audio.src || playbackTimedOut || audio.error) loadFreshStream();

  const attempt = ++playbackAttempt;
  playPending = true;
  playButton.setAttribute("aria-busy", "true");
  setStatus(
    automatic ? t("Démarrage du direct…") : t("Connexion…"),
    automatic
      ? t("Radio Stars se lance automatiquement.")
      : t("Le direct va démarrer dans un instant.")
  );

  startupTimer = window.setTimeout(function () {
    if (attempt !== playbackAttempt || !playPending) return;
    playbackTimedOut = true;
    finishPlaybackAttempt(attempt);
    if (audio.paused) {
      setPlaying(false);
      setStatus(
        t("Touchez pour écouter"),
        t("Le direct tarde à répondre. Le bouton rouge relance une nouvelle connexion."),
        "error"
      );
    }
  }, STARTUP_TIMEOUT_MS);

  let playResult;
  try {
    playResult = audio.play();
  } catch (error) {
    showPlaybackFailure(error, automatic);
    finishPlaybackAttempt(attempt);
    return;
  }

  Promise.resolve(playResult).then(function () {
    finishPlaybackAttempt(attempt);
  }).catch(function (error) {
    if (attempt !== playbackAttempt) return;
    showPlaybackFailure(error, automatic);
    finishPlaybackAttempt(attempt);
  });
}

playButton.addEventListener("click", function () {
  if (playPending) return;

  if (remoteOrigin && !remoteFailed) {
    sendRemoteCommand("toggle");
    return;
  }

  if (!audio.paused) {
    audio.pause();
    return;
  }

  startPlayback(false);
});

volume.addEventListener("input", function () {
  const numeric = Number(volume.value) / 100;
  if (remoteOrigin && !remoteFailed) {
    renderVolume(numeric, true);
    sendRemoteCommand("volume", numeric);
  } else {
    updateVolume(numeric);
  }
});

window.addEventListener("message", function (event) {
  if (!remoteOrigin || event.origin !== remoteOrigin || event.source !== window.opener) return;
  const state = event.data;
  if (!state || state.type !== "radio-stars-state") return;

  remoteReady = true;
  remoteFailed = Boolean(state.error);
  renderVolume(Number.isFinite(Number(state.volume)) ? Number(state.volume) : .82, false);

  if (state.pending) {
    setPlaying(false);
    setStatus(t("Connexion au direct…"), t("La lecture démarre avec votre clic."));
  } else if (state.playing) {
    setPlaying(true);
    setStatus(t("Vous écoutez Radio Stars"), t("Le direct 98.5 FM est en cours."));
  } else if (remoteFailed) {
    setPlaying(false);
    setStatus(t("Touchez pour écouter"), t("Le bouton rouge relance directement la radio."), "error");
  } else {
    setPlaying(false);
    setStatus(t("Lecture en pause"), t("Appuyez sur le bouton rouge pour reprendre."));
  }
});

audio.addEventListener("playing", function () {
  playbackTimedOut = false;
  finishPlaybackAttempt(playbackAttempt);
  setPlaying(true);
  setStatus(t("Vous écoutez Radio Stars"), t("Le direct 98.5 FM est en cours."));
});

audio.addEventListener("pause", function () {
  setPlaying(false);
  if (!audio.error) setStatus(t("Lecture en pause"), t("Appuyez sur le bouton rouge pour reprendre."));
});

audio.addEventListener("waiting", function () {
  setStatus(t("Connexion au direct…"), t("Quelques secondes peuvent être nécessaires."));
});

audio.addEventListener("stalled", function () {
  setStatus(t("Reconnexion…"), t("Le lecteur cherche à retrouver le direct."));
});

audio.addEventListener("error", function () {
  playbackTimedOut = true;
  finishPlaybackAttempt(playbackAttempt);
  setPlaying(false);
  setStatus(
    t("Le direct est momentanément indisponible"),
    t("Patientez quelques secondes puis réessayez."),
    "error"
  );
});

window.addEventListener("offline", function () {
  setStatus(t("Vous êtes hors ligne"), t("Vérifiez votre connexion internet."), "error");
});

window.addEventListener("online", function () {
  if (audio.paused) setStatus(t("Prêt à écouter"), t("Appuyez sur le bouton rouge pour lancer le direct."));
});

function openSharePanel() {
  shareReturnFocus = document.activeElement;
  shareUrlField.value = SHARE_URL + "?lang=" + activeLocale;
  shareFeedback.hidden = true;
  const shareText = t("Écoutez Radio Stars en direct : ") + SHARE_URL + "?lang=" + activeLocale;
  const shortText = t("Écoutez Radio Stars en direct.");
  const emailSubject = t("Radio Stars 98.5 FM — en direct");
  whatsappShare.href = "https://wa.me/?text=" + encodeURIComponent(shareText);
  facebookShare.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrlField.value);
  emailShare.href = "mailto:?subject=" + encodeURIComponent(emailSubject)
    + "&body=" + encodeURIComponent(shareText);
  gmailShare.href = "https://mail.google.com/mail/?view=cm&fs=1&su=" + encodeURIComponent(emailSubject)
    + "&body=" + encodeURIComponent(shareText);
  outlookShare.href = "https://outlook.live.com/mail/0/deeplink/compose?subject=" + encodeURIComponent(emailSubject)
    + "&body=" + encodeURIComponent(shareText);
  const smsSeparator = /iPad|iPhone|iPod/.test(navigator.userAgent || "") ? "&" : "?";
  smsShare.href = "sms:" + smsSeparator + "body=" + encodeURIComponent(shareText);
  xShare.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText);
  telegramShare.href = "https://t.me/share/url?url=" + encodeURIComponent(shareUrlField.value)
    + "&text=" + encodeURIComponent(shortText);
  nativeShareButton.hidden = typeof navigator.share !== "function";
  sharePanel.hidden = false;
  document.body.dataset.shareOpen = "true";
  window.setTimeout(function () { copyShareButton.focus(); }, 0);
}

function closeSharePanel() {
  sharePanel.hidden = true;
  delete document.body.dataset.shareOpen;
  if (shareReturnFocus && typeof shareReturnFocus.focus === "function") shareReturnFocus.focus();
}

async function copyShareLink() {
  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareUrlField.value);
      copied = true;
    } catch (_) {}
  }

  if (!copied) {
    try {
      shareUrlField.focus();
      shareUrlField.select();
      shareUrlField.setSelectionRange(0, shareUrlField.value.length);
      copied = document.execCommand("copy");
    } catch (_) {}
  }

  const message = copied ? t("Lien du player copié") : t("Le lien est sélectionné — choisissez Copier");
  shareFeedback.textContent = t(message);
  shareFeedback.hidden = false;
  showToast(message);
  return copied;
}

shareButton.addEventListener("click", openSharePanel);
copyShareButton.addEventListener("click", copyShareLink);

sharePanel.querySelectorAll("[data-share-close]").forEach(function (button) {
  button.addEventListener("click", closeSharePanel);
});

async function shareWithDevice(tiktokRequested) {
  if (typeof navigator.share !== "function") {
    await copyShareLink();
    if (tiktokRequested) showToast(t("Lien copié — collez-le dans TikTok"));
    return;
  }

  try {
    await navigator.share({
      title: "Radio Stars 98.5 FM",
      text: t("Écoutez Radio Stars en direct."),
      url: shareUrlField.value
    });
  } catch (error) {
    if (!error || error.name !== "AbortError") {
      showToast(tiktokRequested ? t("Lien prêt — choisissez TikTok") : t("Utilisez Copier, WhatsApp ou Facebook"));
    }
  }
}

nativeShareButton.addEventListener("click", function () { shareWithDevice(false); });
tiktokShareButton.addEventListener("click", function (event) {
  const mobileDevice = /Android|iPad|iPhone|iPod|Mobile/i.test(navigator.userAgent || "");
  if (mobileDevice && typeof navigator.share === "function") {
    event.preventDefault();
    shareWithDevice(true);
    return;
  }

  copyShareLink().then(function (copied) {
    const message = copied
      ? t("Lien copié — collez-le dans un message TikTok.")
      : t("Sélectionnez le lien, copiez-le puis collez-le dans TikTok.");
    shareFeedback.textContent = t(message);
    shareFeedback.hidden = false;
    showToast(message);
  });
});

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !sharePanel.hidden) closeSharePanel();
});

if ("mediaSession" in navigator) {
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t("Radio Stars — En direct"),
      artist: "98.5 FM · DAB+",
      album: "Radio Stars",
      artwork: [
        { src: location.origin + "/logo.png", sizes: "512x512", type: "image/png" }
      ]
    });
    navigator.mediaSession.setActionHandler("play", function () { startPlayback(false); });
    navigator.mediaSession.setActionHandler("pause", function () { audio.pause(); });
  } catch (_) {}
}

if (remoteOrigin) {
  setPlaying(true);
  setStatus(t("Vous écoutez Radio Stars"), t("Le direct 98.5 FM est en cours."));
  sendRemoteCommand("state");
} else if (query.get("autoplay") !== "0") {
  startPlayback(true);
}
