/* SITAKS Radio – uitsluitend MP3, afspelen binnen de bestaande HTML5-player.
 * Vereist op de Synology: HTTPS :8443 -> HTTP Icecast :8000.
 * Het endpoint is VOORBEREID, maar de HTTPS-relay is nog NIET bevestigd.
 * Bronstream (HTTP) hoort niet rechtstreeks als audio.src op GitHub Pages.
 */
window.SITAKS_CONFIG = {
  radioUrl: "https://sitaksnas2.synology.me:8443/live.mp3"
};
