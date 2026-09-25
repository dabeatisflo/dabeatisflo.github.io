
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
  playButton.setAttribute("aria-label", isPlaying ? "Mettre Radio Stars en pause" : "Écouter Radio Stars");
  playButton.setAttribute("aria-pressed", String(isPlaying));
  document.title = isPlaying ? "En direct — Radio Stars" : "Le Player — Radio Stars";
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
    setStatus("Vous êtes hors ligne", "Vérifiez votre connexion internet.", "error");
  } else if (automatic && error && error.name === "NotAllowedError") {
    setStatus(
      "Touchez pour écouter",
      "Votre navigateur bloque le son automatique. Le bouton rouge lance immédiatement la radio."
    );
  } else {
    setStatus(
      "Touchez à nouveau pour écouter",
      "La connexion a été interrompue. Réessayez avec le bouton rouge.",
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
    automatic ? "Démarrage du direct…" : "Connexion…",
    automatic
      ? "Radio Stars se lance automatiquement."
      : "Le direct va démarrer dans un instant."
  );

  startupTimer = window.setTimeout(function () {
    if (attempt !== playbackAttempt || !playPending) return;
    playbackTimedOut = true;
    finishPlaybackAttempt(attempt);
    if (audio.paused) {
      setPlaying(false);
      setStatus(
        "Touchez pour écouter",
        "Le direct tarde à répondre. Le bouton rouge relance une nouvelle connexion.",
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
    setStatus("Connexion au direct…", "La lecture démarre avec votre clic.");
  } else if (state.playing) {
    setPlaying(true);
    setStatus("Vous écoutez Radio Stars", "Le direct 98.5 FM est en cours.");
  } else if (remoteFailed) {
    setPlaying(false);
    setStatus("Touchez pour écouter", "Le bouton rouge relance directement la radio.", "error");
  } else {
    setPlaying(false);
    setStatus("Lecture en pause", "Appuyez sur le bouton rouge pour reprendre.");
  }
});

audio.addEventListener("playing", function () {
  playbackTimedOut = false;
  finishPlaybackAttempt(playbackAttempt);
  setPlaying(true);
  setStatus("Vous écoutez Radio Stars", "Le direct 98.5 FM est en cours.");
});

audio.addEventListener("pause", function () {
  setPlaying(false);
  if (!audio.error) setStatus("Lecture en pause", "Appuyez sur le bouton rouge pour reprendre.");
});

audio.addEventListener("waiting", function () {
  setStatus("Connexion au direct…", "Quelques secondes peuvent être nécessaires.");
});

audio.addEventListener("stalled", function () {
  setStatus("Reconnexion…", "Le lecteur cherche à retrouver le direct.");
});

audio.addEventListener("error", function () {
  playbackTimedOut = true;
  finishPlaybackAttempt(playbackAttempt);
  setPlaying(false);
  setStatus(
    "Le direct est momentanément indisponible",
    "Patientez quelques secondes puis réessayez.",
    "error"
  );
});

window.addEventListener("offline", function () {
  setStatus("Vous êtes hors ligne", "Vérifiez votre connexion internet.", "error");
});

window.addEventListener("online", function () {
  if (audio.paused) setStatus("Prêt à écouter", "Appuyez sur le bouton rouge pour lancer le direct.");
});

function openSharePanel() {
  shareReturnFocus = document.activeElement;
  shareUrlField.value = SHARE_URL;
  shareFeedback.hidden = true;
  const shareText = "Écoutez Radio Stars en direct : " + SHARE_URL;
  const shortText = "Écoutez Radio Stars en direct.";
  const emailSubject = "Radio Stars 98.5 FM — en direct";
  whatsappShare.href = "https://wa.me/?text=" + encodeURIComponent(shareText);
  facebookShare.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(SHARE_URL);
  emailShare.href = "mailto:?subject=" + encodeURIComponent(emailSubject)
    + "&body=" + encodeURIComponent(shareText);
  gmailShare.href = "https://mail.google.com/mail/?view=cm&fs=1&su=" + encodeURIComponent(emailSubject)
    + "&body=" + encodeURIComponent(shareText);
  outlookShare.href = "https://outlook.live.com/mail/0/deeplink/compose?subject=" + encodeURIComponent(emailSubject)
    + "&body=" + encodeURIComponent(shareText);
  const smsSeparator = /iPad|iPhone|iPod/.test(navigator.userAgent || "") ? "&" : "?";
  smsShare.href = "sms:" + smsSeparator + "body=" + encodeURIComponent(shareText);
  xShare.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText);
  telegramShare.href = "https://t.me/share/url?url=" + encodeURIComponent(SHARE_URL)
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
      await navigator.clipboard.writeText(SHARE_URL);
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

  const message = copied ? "Lien du player copié" : "Le lien est sélectionné — choisissez Copier";
  shareFeedback.textContent = message;
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
    if (tiktokRequested) showToast("Lien copié — collez-le dans TikTok");
    return;
  }

  try {
    await navigator.share({
      title: "Radio Stars 98.5 FM",
      text: "Écoutez Radio Stars en direct.",
      url: SHARE_URL
    });
  } catch (error) {
    if (!error || error.name !== "AbortError") {
      showToast(tiktokRequested ? "Lien prêt — choisissez TikTok" : "Utilisez Copier, WhatsApp ou Facebook");
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
      ? "Lien copié — collez-le dans un message TikTok."
      : "Sélectionnez le lien, copiez-le puis collez-le dans TikTok.";
    shareFeedback.textContent = message;
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
      title: "Radio Stars — En direct",
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
  setStatus("Vous écoutez Radio Stars", "Le direct 98.5 FM est en cours.");
  sendRemoteCommand("state");
} else if (query.get("autoplay") !== "0") {
  startPlayback(true);
}
