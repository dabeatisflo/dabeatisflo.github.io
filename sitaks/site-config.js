/* SITAKS Radio – MP3 via afzonderlijke HTTPS-relay.
 * De originele Icecast-bron van Peter blijft HTTP op poort 8000.
 * Deze HTTPS-doorgifte is op OVH getest met echte audiogegevens.
 * Er is geen AAC-fallback en er opent geen nieuw tabblad.
 */
window.SITAKS_CONFIG = {
  radioUrl: "https://power-events.be/sitaks-radio/stream.php"
};
