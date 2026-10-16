/* Publieke HTTPS-relayadressen; NOOIT het interne Icecast-adres of wachtwoorden publiceren. */
/* Vereist NAS/HTTPS reverse proxy: /radio/live -> Icecast /live; /radio/live.mp3 -> /live.mp3. */
window.SITAKS_CONFIG = {
  radioUrl: "https://sitaks.sitaksnas2.synology.me/radio/live",
  radioFallbackUrl: "https://sitaks.sitaksnas2.synology.me/radio/live.mp3"
};
