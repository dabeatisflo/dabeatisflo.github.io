/* SITAKS Radio: MP3-only stream.
 * Icecast source: /live.mp3 (currently HTTP; not usable directly on GitHub Pages).
 * Set radioUrl below only after the HTTPS reverse proxy has been tested.
 * Planned HTTPS URL: https://sitaksnas2.synology.me:8443/live.mp3
 * Do not publish NAS credentials, internal IP addresses or HTTP :8000 source.
 */
window.SITAKS_CONFIG = {
  radioUrl: "",
  directMp3Url: "http://sitaksnas2.synology.me:8000/live.mp3"
};
