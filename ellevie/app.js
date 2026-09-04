const programGroups = [
  {
    id: "semaine",
    day: "📅 Du Lundi au Vendredi",
    programs: [
      ["06:00 - 09:00", "Ellevie Matin"],
      ["09:00 - 12:00", "Vos Mélodies au Boulot"],
      ["12:00 - 13:00", "Le Lunch Pop-Classic"],
      ["13:00 - 17:00", "L'Après-Midi Chic"],
      ["17:00 - 19:00", "Le Drive Énergie"],
      ["19:00 - 22:00", "Ellevie Lounge & Chill"],
      ["22:00 - 07:00", "La Nuit Douce"]
    ]
  },
  {
    id: "samedi",
    day: "🏖️ Le Samedi",
    programs: [
      ["07:00 - 10:00", "La Douceur du Matin"],
      ["10:00 - 14:00", "Chic & Shopping"],
      ["14:00 - 18:00", "Génération Ellevie"],
      ["18:00 - 21:00", "L'Apéro Ambiance"],
      ["21:00 - 00:00", "Ellevie Club Pop"],
      ["00:00 - 07:00", "La Nuit Douce"]
    ]
  },
  {
    id: "dimanche",
    day: "🧸 Le Dimanche",
    programs: [
      ["07:00 - 11:00", "Le Grand Petit-Déjeuner"],
      ["11:00 - 14:00", "Table En Famille"],
      ["14:00 - 17:00", "Balade & Détente"],
      ["17:00 - 20:00", "Nostalgie Douce"],
      ["20:00 - 23:00", "Sereine avant la Semaine"],
      ["23:00 - 06:00", "La Nuit Douce"]
    ]
  }
];

const scheduleList = document.querySelector("#schedule-list");

function renderSchedule() {
  scheduleList.innerHTML = programGroups
    .map(
      ({ id, day, programs }) => `
        <section class="schedule-group" aria-labelledby="${id}-title">
          <h3 class="schedule-day" id="${id}-title">${day}</h3>
          <div class="schedule-day-list">
            ${programs
              .map(
                ([time, title]) => `
                  <article class="program-slot">
                    <p class="program-time">${time.replace(" - ", " <span>—</span> ")}</p>
                    <h4><em>${title}</em></h4>
                  </article>`
              )
              .join("")}
          </div>
        </section>`
    )
    .join("");
}

renderSchedule();

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

const audioToggles = document.querySelectorAll("[data-audio-toggle]");
const audioStarts = document.querySelectorAll("[data-audio-start]");
const playerCard = document.querySelector(".player-card");
const streamAudio = document.querySelector("#stream-audio");
const volumeControl = document.querySelector("#stream-volume");
const persistentStatus = document.querySelector(".persistent-status");
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  toast.setAttribute("aria-hidden", "false");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
  }, 3200);
}

function updateControls(isPlaying) {
  document.body.classList.toggle("audio-playing", isPlaying);
  playerCard.classList.toggle("is-playing", isPlaying);

  audioToggles.forEach((button) => {
    const label = isPlaying ? button.dataset.playingLabel : button.dataset.pausedLabel;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(isPlaying));
    const visibleLabel = button.querySelector(".button-label");
    if (visibleLabel) visibleLabel.textContent = isPlaying ? "Pause" : "Écouter en direct";
  });
}

function updateStatus(message) {
  persistentStatus.textContent = message;
}

async function startStream() {
  updateStatus("Connexion…");

  try {
    await streamAudio.play();
  } catch {
    updateControls(false);
    updateStatus("Direct indisponible");
    showToast("Le direct ne peut pas être lu pour le moment.");
  }
}

audioToggles.forEach((button) => {
  button.addEventListener("click", () => {
    if (streamAudio.paused) startStream();
    else streamAudio.pause();
  });
});

audioStarts.forEach((button) => {
  button.addEventListener("click", () => {
    if (streamAudio.paused) startStream();
  });
});

streamAudio.addEventListener("playing", () => {
  updateControls(true);
  updateStatus("Vous écoutez le direct");
});

streamAudio.addEventListener("pause", () => {
  updateControls(false);
  updateStatus("En pause");
});

streamAudio.addEventListener("waiting", () => updateStatus("Connexion…"));
streamAudio.addEventListener("stalled", () => updateStatus("Reconnexion…"));
streamAudio.addEventListener("error", () => {
  updateControls(false);
  updateStatus("Direct indisponible");
});

volumeControl.addEventListener("input", () => {
  streamAudio.volume = Number(volumeControl.value);
});

streamAudio.volume = Number(volumeControl.value);
updateControls(false);

if ("mediaSession" in navigator && "MediaMetadata" in window) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "ellevie Radio",
    artist: "Lady's first",
    album: "En direct"
  });

  try {
    navigator.mediaSession.setActionHandler("play", startStream);
    navigator.mediaSession.setActionHandler("pause", () => streamAudio.pause());
  } catch {
    // Media-key controls are optional; the on-page player remains available.
  }
}

document.querySelector("#year").textContent = new Date().getFullYear();
