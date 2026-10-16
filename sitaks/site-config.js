/* SITAKS Radio – originele Icecast HTTP MP3-bron van Peter.
   De speler gebruikt uitsluitend /live.mp3, zonder AAC en zonder nieuw tabblad.
   LET OP: GitHub Pages draait op HTTPS. Browsers blokkeren/upgraden doorgaans
   HTTP-audio daar. Op een HTTP-gehoste Synology-pagina werkt deze bron wel.
   Later kan alleen radioUrl naar een werkende HTTPS-relay worden veranderd. */
window.SITAKS_CONFIG = {
  radioUrl: "http://sitaksnas2.synology.me:8000/live.mp3"
};
