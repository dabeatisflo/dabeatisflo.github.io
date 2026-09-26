
"use strict";

const PLAYER_URL = new URL("player/", location.href).href;
const PLAYER_ORIGIN = new URL(PLAYER_URL).origin;
const AVAILABLE_LOCALES = Object.freeze(["fr", "nl", "en"]);
const KNOWN_LOCALES = Object.freeze(["fr", "nl", "en"]);
const APP_DOWNLOAD_URLS = Object.freeze({ android: "", ios: "" });

const TRANSLATIONS = {
  "nl": {
    "Radio Stars 98.5 FM — Appréciez la différence": "Radio Stars 98.5 FM — Beleef het verschil",
    "Aller au contenu": "Ga naar de inhoud",
    "Ouvrir ou fermer le menu": "Menu openen of sluiten",
    "Accueil": "Home",
    "La radio": "De radio",
    "Vidéo": "Video",
    "Application": "App",
    "Programmes": "Programma's",
    "Communauté": "Community",
    "Contact": "Contact",
    "Disponible": "Beschikbaar",
    "Écouter": "Luisteren",
    "Depuis 1981 · Havré — Mons": "Sinds 1981 · Havré — Bergen",
    "appréciez la différence.": "beleef het verschil.",
    "Une radio locale, vivante et proche de vous. Retrouvez la musique, les voix et les émissions de Radio Stars sur 98.5 FM, en DAB+ et en ligne.": "Een levendige lokale radio, dicht bij jou. Luister naar de muziek, de stemmen en de programma's van Radio Stars op 98.5 FM, via DAB+ en online.",
    "Écouter le direct": "Luister live",
    "Découvrir les programmes": "Ontdek de programma's",
    "En ligne": "Online",
    "En direct": "Live",
    "À l’antenne": "Now playing",
    "Chargement du titre…": "Loading track…",
    "À l’antenne": "Nu op de radio",
    "Chargement du titre…": "Titel wordt geladen…",
    "Le player officiel": "De officiële speler",
    "Le direct dans sa propre fenêtre.": "Luister live in een apart venster.",
    "Le player s’ouvre séparément : il ne gêne jamais votre lecture et son adresse peut être partagée directement.": "De speler opent in een apart venster. Zo kun je rustig verder lezen en de link rechtstreeks delen.",
    "Ouvrir le player": "Open de speler",
    "Partager le lien du player": "Deel de link naar de speler",
    "Player autonome et sécurisé": "Zelfstandige en beveiligde speler",
    "Depuis 1981": "Sinds 1981",
    "Havré — Mons": "Havré — Bergen",
    "Appréciez la différence": "Beleef het verschil",
    "Votre radio, ici": "Jouw radio, hier",
    "Une fréquence. Mille moments à partager.": "Eén frequentie. Duizend momenten om te delen.",
    "Radio Stars accompagne Havré, Mons et toute la région avec une programmation accessible, des rendez-vous variés et l’énergie d’une radio de proximité.": "Radio Stars is er voor Havré, Bergen en de hele streek, met toegankelijke muziek, gevarieerde programma's en de energie van een lokale radio.",
    "01 · Proximité": "01 · Dichtbij",
    "Ancrée à Havré": "Geworteld in Havré",
    "Une radio associative qui connaît sa région et garde le contact avec ses auditeurs.": "Een verenigingsradio die haar streek kent en contact houdt met haar luisteraars.",
    "02 · Musique": "02 · Muziek",
    "Des titres qui rassemblent": "Muziek die mensen samenbrengt",
    "Une sélection musicale généreuse, des classiques aux découvertes, au fil de la journée.": "De hele dag door een ruime muziekkeuze, van klassiekers tot nieuwe ontdekkingen.",
    "03 · Partout": "03 · Overal",
    "À la radio et en ligne": "Via de radio en online",
    "Écoutez-nous sur 98.5 FM, en DAB+ ou grâce au player autonome sur tous vos appareils.": "Luister op 98.5 FM, via DAB+ of met de losse speler op al je toestellen.",
    "La fréquence de vos journées": "De frequentie van elke dag",
    "Branchez-vous.": "Stem af.",
    "On s’occupe du reste.": "Wij zorgen voor de rest.",
    "À la maison, en voiture, au travail ou dans vos écouteurs : Radio Stars vous suit sans vous imposer un player sur la page.": "Thuis, in de auto, op het werk of met je oortjes: Radio Stars gaat met je mee, zonder dat een speler de pagina in de weg zit.",
    "FM · DAB+ · En ligne": "FM · DAB+ · Online",
    "Le direct, bientôt en images.": "Binnenkort ook live in beeld.",
    "L’espace vidéo est prêt. Dès que le flux sera disponible, vous pourrez suivre Radio Stars en direct ici.": "De videoruimte staat klaar. Zodra de stream beschikbaar is, kun je Radio Stars hier live volgen.",
    "Vidéo · bientôt": "Video · binnenkort",
    "Le direct vidéo arrive bientôt.": "De livevideo komt binnenkort.",
    "Le flux vidéo n’est pas encore disponible.": "De videostream is nog niet beschikbaar.",
    "L’application Radio Stars": "De Radio Stars-app",
    "Le bon téléchargement pour votre téléphone.": "De juiste download voor jouw telefoon.",
    "Cette page reconnaît automatiquement Android ou iPhone/iPad et met en avant la version adaptée. Les liens seront activés dès que les applications seront prêtes.": "Deze pagina herkent automatisch Android of iPhone/iPad en toont de geschikte versie. De downloadlinks worden geactiveerd zodra de apps klaar zijn.",
    "Détection de votre appareil…": "Je toestel wordt herkend…",
    "Le téléchargement correspondant sera recommandé automatiquement.": "De juiste download wordt automatisch aanbevolen.",
    "Recommandé pour vous": "Aanbevolen voor jou",
    "Application Android": "Android-app",
    "Le futur lien permettra de télécharger directement le fichier APK officiel de Radio Stars.": "Via de toekomstige link kun je het officiële APK-bestand van Radio Stars rechtstreeks downloaden.",
    "Bientôt disponible": "Binnenkort beschikbaar",
    "Application iOS": "iOS-app",
    "Le futur lien dirigera les utilisateurs d’iPhone et d’iPad vers le téléchargement officiel.": "De toekomstige link brengt iPhone- en iPad-gebruikers naar de officiële download.",
    "À l’antenne": "Op de radio",
    "Vos rendez-vous Radio Stars.": "Je vaste afspraken met Radio Stars.",
    "Une semaine rythmée par la musique et des émissions identifiables. Suivez nos réseaux pour les horaires et annonces les plus récents.": "Een week vol muziek en herkenbare programma's. Volg onze sociale media voor de recentste uitzenduren en aankondigingen.",
    "En semaine · Matin": "Weekdagen · ochtend",
    "La matinale": "Het ochtendprogramma",
    "De l’énergie, de la musique et une vraie présence locale pour commencer la journée.": "Begin je dag met energie, muziek en een vertrouwde stem uit de streek.",
    "Musique": "Muziek",
    "Bonne humeur": "Goed humeur",
    "En semaine · Midi": "Weekdagen · middag",
    "La bande-son de votre pause et une sélection musicale pour poursuivre la journée.": "De soundtrack van je middagpauze en muziek voor de rest van de dag.",
    "Classiques": "Klassiekers",
    "En semaine · Soir": "Weekdagen · avond",
    "Le retour à la maison et la soirée accompagnés par Radio Stars.": "Radio Stars vergezelt je op weg naar huis en de hele avond.",
    "Détente": "Ontspanning",
    "Soirée": "Avond",
    "Le week-end": "In het weekend",
    "Les émissions thématiques": "Themaprogramma's",
    "Le Mike Show, Italia Forever, Génération Vinyles et Génération Tubes.": "Le Mike Show, Italia Forever, Génération Vinyles en Génération Tubes.",
    "Italie": "Italië",
    "Vinyles": "Vinyl",
    "Tubes": "Hits",
    "Restons connectés": "Blijf op de hoogte",
    "La radio continue": "De radio gaat verder",
    "avec vous.": "met jou.",
    "Actualités, rendez-vous et échanges : retrouvez Radio Stars sur Facebook et rejoignez la communauté des auditeurs.": "Nieuws, programma's en gesprekken: volg Radio Stars op Facebook en sluit je aan bij onze luisteraars.",
    "La page officielle": "De officiële pagina",
    "Les nouvelles et publications de Radio Stars.": "Nieuws en berichten van Radio Stars.",
    "Le groupe des auditeurs": "De luisteraarsgroep",
    "Un espace pour partager la passion de Radio Stars.": "Een plek om je passie voor Radio Stars te delen.",
    "Contactez Radio Stars": "Neem contact op met Radio Stars",
    "Une question ?": "Een vraag?",
    "Parlons-nous.": "Laat van je horen.",
    "Pour une information, une demande ou simplement pour entrer en contact avec l’équipe, complétez le formulaire ou utilisez les coordonnées officielles.": "Heb je een vraag of wil je het team bereiken? Vul het formulier in of gebruik de officiële contactgegevens.",
    "Votre nom": "Je naam",
    "Votre e-mail": "Je e-mailadres",
    "Objet": "Onderwerp",
    "Votre message": "Je bericht",
    "Préparer mon message": "Mijn bericht opstellen",
    "Votre messagerie s’ouvrira avec le message adressé à info@radiostars.be.": "Je mailprogramma opent met een bericht aan info@radiostars.be.",
    "Envoyer un e-mail": "E-mail sturen",
    "Nous appeler": "Bel ons",
    "Téléphone": "Telefoon",
    "Adresse": "Adres",
    "7021 Havré (Mons), Belgique": "7021 Havré (Bergen), België",
    "BCE / TVA : BE 0422.025.224": "KBO / btw: BE 0422.025.224",
    "Le player ↗": "De speler ↗",
    "© 2026 Poignie Floris. Tous droits réservés.": "© 2026 Poignie Floris. Alle rechten voorbehouden.",
    "Droits d’auteur et utilisation du code": "Auteursrecht en gebruik van de code",
    "Ce projet et son code source associé sont la propriété intellectuelle exclusive de l’auteur, sous réserve des droits préexistants de Stars ASBL et des tiers sur leurs noms, logos, contenus et flux.": "Dit project en de bijbehorende broncode zijn uitsluitend intellectueel eigendom van de auteur, met eerbiediging van de bestaande rechten van Stars ASBL en derden op hun namen, logo's, inhoud en streams.",
    "Il est expressément interdit à Radio Stars (ou à tout tiers) de copier, distribuer, modifier, héberger ou exploiter commercialement ou non commercialement ce code sans l’autorisation écrite préalable et explicite de Poignie Floris.": "Het is Radio Stars (en elke derde) uitdrukkelijk verboden deze code te kopiëren, te verspreiden, te wijzigen, te hosten of commercieel dan wel niet-commercieel te gebruiken zonder voorafgaande, uitdrukkelijke schriftelijke toestemming van Poignie Floris.",
    "Le code source complet est mis à disposition uniquement pour consultation et évaluation dans le dépôt GitHub privé. La présentation publique de cette démonstration n’accorde aucune licence de réutilisation.": "De volledige broncode wordt in de private GitHub-repository uitsluitend ter inzage en beoordeling beschikbaar gesteld. De openbare presentatie van deze demo verleent geen licentie voor hergebruik.",
    "Navigation principale": "Hoofdnavigatie",
    "Radio Stars, retour à l’accueil": "Radio Stars, terug naar home",
    "Choisir la langue": "Kies een taal",
    "Langues": "Talen",
    "Modes d’écoute": "Luistermogelijkheden",
    "Radio Stars sur 98.5 FM et DAB plus": "Radio Stars op 98.5 FM en DAB+",
    "Écran noir réservé au futur direct vidéo de Radio Stars": "Zwart scherm voor de toekomstige livevideo van Radio Stars",
    "Aperçu des programmes": "Overzicht van de programma's",
    "Nom et prénom": "Voor- en achternaam",
    "vous@exemple.be": "jij@voorbeeld.be",
    "Comment pouvons-nous vous aider ?": "Waarmee kunnen we je helpen?",
    "Écrivez votre message ici…": "Schrijf hier je bericht…",
    "Radio Stars, retour en haut": "Radio Stars, terug naar boven",
    "Liens de bas de page": "Links onderaan de pagina",
    "98.5 FM · DAB+ · Havré — Mons": "98.5 FM · DAB+ · Havré — Bergen",
    "Radio Stars, la radio locale de Havré et Mons. Écoutez-nous sur 98.5 FM, en DAB+ et en ligne.": "Radio Stars, de lokale radio voor Havré en Bergen. Luister op 98.5 FM, via DAB+ en online.",
    "Votre radio locale à Havré : 98.5 FM, DAB+ et en ligne. Musique, émissions et proximité depuis 1981.": "Jouw lokale radio in Havré: 98.5 FM, DAB+ en online. Muziek, programma's en verbondenheid sinds 1981.",
    "Appréciez la différence. Écoutez Radio Stars en direct.": "Beleef het verschil. Luister live naar Radio Stars.",
    "Le direct tarde à répondre — touchez le bouton rouge du player": "De live-uitzending laat op zich wachten — tik op de rode knop van de speler",
    "Touchez le bouton rouge du player pour écouter": "Tik op de rode knop van de speler om te luisteren",
    "Appareil Android détecté": "Android-toestel herkend",
    "La version APK sera automatiquement recommandée dès que son lien est disponible.": "De APK-versie wordt automatisch aanbevolen zodra de downloadlink beschikbaar is.",
    "iPhone ou iPad détecté": "iPhone of iPad herkend",
    "La version iOS sera automatiquement recommandée dès que son lien est disponible.": "De iOS-versie wordt automatisch aanbevolen zodra de downloadlink beschikbaar is.",
    "Vous consultez la page sur un ordinateur": "Je bekijkt de pagina op een computer",
    "Sur un téléphone, la page recommandera automatiquement Android ou iPhone/iPad.": "Op een telefoon beveelt de pagina automatisch de versie voor Android of iPhone/iPad aan.",
    "Télécharger l’APK": "APK downloaden",
    "Télécharger pour iPhone": "Downloaden voor iPhone",
    "Le lien de téléchargement sera ajouté prochainement": "De downloadlink wordt binnenkort toegevoegd",
    "Lien du player copié": "Link naar de speler gekopieerd",
    "Copiez le lien du player depuis votre navigateur": "Kopieer de link naar de speler via je browser",
    "Écoutez Radio Stars 98.5 FM en direct.": "Luister live naar Radio Stars 98.5 FM.",
    "Votre messagerie va s’ouvrir": "Je mailprogramma wordt geopend",
    "Nom : ": "Naam: ",
    "Cette langue sera bientôt disponible. Le français reste affiché.": "Deze taal is binnenkort beschikbaar. De Franse versie blijft zichtbaar.",
    "Envoyer le message": "Bericht verzenden",
    "Votre message sera envoyé à info@radiostars.be.": "Je bericht wordt naar info@radiostars.be verstuurd.",
    "Envoi impossible. Réessayez plus tard.": "Verzenden mislukt. Probeer het later opnieuw.",
    "Votre message a été envoyé.": "Je bericht is verzonden.",
    "Méthode non autorisée.": "Methode niet toegestaan.",
    "Origine non autorisée.": "Herkomst niet toegestaan.",
    "Merci pour votre message.": "Bedankt voor je bericht.",
    "Veuillez vérifier les champs du formulaire.": "Controleer de velden van het formulier.",
    "Veuillez attendre une minute avant de renvoyer un message.": "Wacht een minuut voordat je opnieuw een bericht verstuurt.",
    "Envoi indisponible. Écrivez à info@radiostars.be.": "Verzenden is tijdelijk niet mogelijk. Mail naar info@radiostars.be."
  },
  "en": {
    "Radio Stars 98.5 FM — Appréciez la différence": "Radio Stars 98.5 FM — Hear the difference",
    "Aller au contenu": "Skip to content",
    "Ouvrir ou fermer le menu": "Open or close menu",
    "Accueil": "Home",
    "La radio": "The station",
    "Vidéo": "Video",
    "Application": "App",
    "Programmes": "Shows",
    "Communauté": "Community",
    "Contact": "Contact",
    "Disponible": "Available",
    "Écouter": "Listen",
    "Depuis 1981 · Havré — Mons": "Since 1981 · Havré — Mons",
    "appréciez la différence.": "hear the difference.",
    "Une radio locale, vivante et proche de vous. Retrouvez la musique, les voix et les émissions de Radio Stars sur 98.5 FM, en DAB+ et en ligne.": "Lively local radio, close to you. Enjoy the music, voices and shows of Radio Stars on 98.5 FM, DAB+ and online.",
    "Écouter le direct": "Listen live",
    "Découvrir les programmes": "Explore the shows",
    "En ligne": "Online",
    "En direct": "Live",
    "Le player officiel": "The official player",
    "Le direct dans sa propre fenêtre.": "Live radio in its own window.",
    "Le player s’ouvre séparément : il ne gêne jamais votre lecture et son adresse peut être partagée directement.": "The player opens in a separate window, so you can keep browsing and share its link directly.",
    "Ouvrir le player": "Open the player",
    "Partager le lien du player": "Share the player link",
    "Player autonome et sécurisé": "Independent and secure player",
    "Depuis 1981": "Since 1981",
    "Havré — Mons": "Havré — Mons",
    "Appréciez la différence": "Hear the difference",
    "Votre radio, ici": "Your local station",
    "Une fréquence. Mille moments à partager.": "One frequency. A thousand moments to share.",
    "Radio Stars accompagne Havré, Mons et toute la région avec une programmation accessible, des rendez-vous variés et l’énergie d’une radio de proximité.": "Radio Stars serves Havré, Mons and the surrounding area with accessible music, varied shows and the energy of a local station.",
    "01 · Proximité": "01 · Local",
    "Ancrée à Havré": "Rooted in Havré",
    "Une radio associative qui connaît sa région et garde le contact avec ses auditeurs.": "A community radio station that knows its area and stays in touch with its listeners.",
    "02 · Musique": "02 · Music",
    "Des titres qui rassemblent": "Music that brings people together",
    "Une sélection musicale généreuse, des classiques aux découvertes, au fil de la journée.": "A wide range of music throughout the day, from classics to new discoveries.",
    "03 · Partout": "03 · Everywhere",
    "À la radio et en ligne": "On the radio and online",
    "Écoutez-nous sur 98.5 FM, en DAB+ ou grâce au player autonome sur tous vos appareils.": "Listen on 98.5 FM, DAB+ or through the standalone player on any device.",
    "La fréquence de vos journées": "The sound of your day",
    "Branchez-vous.": "Tune in.",
    "On s’occupe du reste.": "We'll take it from there.",
    "À la maison, en voiture, au travail ou dans vos écouteurs : Radio Stars vous suit sans vous imposer un player sur la page.": "At home, in the car, at work or on your headphones: Radio Stars goes with you without getting in the way of the page.",
    "FM · DAB+ · En ligne": "FM · DAB+ · Online",
    "Le direct, bientôt en images.": "Live video is coming soon.",
    "L’espace vidéo est prêt. Dès que le flux sera disponible, vous pourrez suivre Radio Stars en direct ici.": "The video area is ready. Once the stream is available, you will be able to watch Radio Stars live here.",
    "Vidéo · bientôt": "Video · coming soon",
    "Le direct vidéo arrive bientôt.": "Live video is coming soon.",
    "Le flux vidéo n’est pas encore disponible.": "The video stream is not available yet.",
    "L’application Radio Stars": "The Radio Stars app",
    "Le bon téléchargement pour votre téléphone.": "The right download for your phone.",
    "Cette page reconnaît automatiquement Android ou iPhone/iPad et met en avant la version adaptée. Les liens seront activés dès que les applications seront prêtes.": "This page detects Android or iPhone/iPad and highlights the right version. Download links will be activated when the apps are ready.",
    "Détection de votre appareil…": "Detecting your device…",
    "Le téléchargement correspondant sera recommandé automatiquement.": "The right download will be recommended automatically.",
    "Recommandé pour vous": "Recommended for you",
    "Application Android": "Android app",
    "Le futur lien permettra de télécharger directement le fichier APK officiel de Radio Stars.": "The upcoming link will let you download the official Radio Stars APK directly.",
    "Bientôt disponible": "Coming soon",
    "Application iOS": "iOS app",
    "Le futur lien dirigera les utilisateurs d’iPhone et d’iPad vers le téléchargement officiel.": "The upcoming link will take iPhone and iPad users to the official download.",
    "À l’antenne": "On air",
    "Vos rendez-vous Radio Stars.": "Your Radio Stars favourites.",
    "Une semaine rythmée par la musique et des émissions identifiables. Suivez nos réseaux pour les horaires et annonces les plus récents.": "A week of music and familiar shows. Follow us on social media for the latest broadcast times and announcements.",
    "En semaine · Matin": "Weekdays · morning",
    "La matinale": "The morning show",
    "De l’énergie, de la musique et une vraie présence locale pour commencer la journée.": "Start the day with energy, music and familiar local voices.",
    "Musique": "Music",
    "Bonne humeur": "Good vibes",
    "En semaine · Midi": "Weekdays · midday",
    "La bande-son de votre pause et une sélection musicale pour poursuivre la journée.": "The soundtrack to your lunch break and music for the rest of the day.",
    "Classiques": "Classics",
    "En semaine · Soir": "Weekdays · evening",
    "Le retour à la maison et la soirée accompagnés par Radio Stars.": "Radio Stars keeps you company on the way home and throughout the evening.",
    "Détente": "Relaxation",
    "Soirée": "Evening",
    "Le week-end": "At the weekend",
    "Les émissions thématiques": "Themed shows",
    "Le Mike Show, Italia Forever, Génération Vinyles et Génération Tubes.": "Le Mike Show, Italia Forever, Génération Vinyles and Génération Tubes.",
    "Italie": "Italy",
    "Vinyles": "Vinyl",
    "Tubes": "Hits",
    "Restons connectés": "Stay connected",
    "La radio continue": "The radio goes on",
    "avec vous.": "with you.",
    "Actualités, rendez-vous et échanges : retrouvez Radio Stars sur Facebook et rejoignez la communauté des auditeurs.": "News, shows and conversations: follow Radio Stars on Facebook and join the listener community.",
    "La page officielle": "The official page",
    "Les nouvelles et publications de Radio Stars.": "News and updates from Radio Stars.",
    "Le groupe des auditeurs": "The listeners' group",
    "Un espace pour partager la passion de Radio Stars.": "A place to share your passion for Radio Stars.",
    "Contactez Radio Stars": "Contact Radio Stars",
    "Une question ?": "A question?",
    "Parlons-nous.": "Get in touch.",
    "Pour une information, une demande ou simplement pour entrer en contact avec l’équipe, complétez le formulaire ou utilisez les coordonnées officielles.": "Have a question or want to reach the team? Fill in the form or use the official contact details.",
    "Votre nom": "Your name",
    "Votre e-mail": "Your email address",
    "Objet": "Subject",
    "Votre message": "Your message",
    "Préparer mon message": "Compose my message",
    "Votre messagerie s’ouvrira avec le message adressé à info@radiostars.be.": "Your email app will open with a message addressed to info@radiostars.be.",
    "Envoyer un e-mail": "Send an email",
    "Nous appeler": "Call us",
    "Téléphone": "Phone",
    "Adresse": "Address",
    "7021 Havré (Mons), Belgique": "7021 Havré (Mons), Belgium",
    "BCE / TVA : BE 0422.025.224": "Company / VAT number: BE 0422.025.224",
    "Le player ↗": "The player ↗",
    "© 2026 Poignie Floris. Tous droits réservés.": "© 2026 Poignie Floris. All rights reserved.",
    "Droits d’auteur et utilisation du code": "Copyright and use of the code",
    "Ce projet et son code source associé sont la propriété intellectuelle exclusive de l’auteur, sous réserve des droits préexistants de Stars ASBL et des tiers sur leurs noms, logos, contenus et flux.": "This project and its associated source code are the author's exclusive intellectual property, subject to the existing rights of Stars ASBL and third parties in their names, logos, content and streams.",
    "Il est expressément interdit à Radio Stars (ou à tout tiers) de copier, distribuer, modifier, héberger ou exploiter commercialement ou non commercialement ce code sans l’autorisation écrite préalable et explicite de Poignie Floris.": "Radio Stars (and any third party) is expressly prohibited from copying, distributing, modifying, hosting or using this code, commercially or otherwise, without the prior, explicit written permission of Poignie Floris.",
    "Le code source complet est mis à disposition uniquement pour consultation et évaluation dans le dépôt GitHub privé. La présentation publique de cette démonstration n’accorde aucune licence de réutilisation.": "The complete source code is available in the private GitHub repository solely for review and evaluation. The public display of this demo grants no licence for reuse.",
    "Navigation principale": "Main navigation",
    "Radio Stars, retour à l’accueil": "Radio Stars, back to home",
    "Choisir la langue": "Choose a language",
    "Langues": "Languages",
    "Modes d’écoute": "Ways to listen",
    "Radio Stars sur 98.5 FM et DAB plus": "Radio Stars on 98.5 FM and DAB+",
    "Écran noir réservé au futur direct vidéo de Radio Stars": "Black screen reserved for the future Radio Stars live video stream",
    "Aperçu des programmes": "Show schedule overview",
    "Nom et prénom": "First and last name",
    "vous@exemple.be": "you@example.com",
    "Comment pouvons-nous vous aider ?": "How can we help?",
    "Écrivez votre message ici…": "Write your message here…",
    "Radio Stars, retour en haut": "Radio Stars, back to top",
    "Liens de bas de page": "Footer links",
    "98.5 FM · DAB+ · Havré — Mons": "98.5 FM · DAB+ · Havré — Mons",
    "Radio Stars, la radio locale de Havré et Mons. Écoutez-nous sur 98.5 FM, en DAB+ et en ligne.": "Radio Stars, your local station in Havré and Mons. Listen on 98.5 FM, DAB+ and online.",
    "Votre radio locale à Havré : 98.5 FM, DAB+ et en ligne. Musique, émissions et proximité depuis 1981.": "Your local station in Havré: 98.5 FM, DAB+ and online. Music, shows and community since 1981.",
    "Appréciez la différence. Écoutez Radio Stars en direct.": "Hear the difference. Listen to Radio Stars live.",
    "Le direct tarde à répondre — touchez le bouton rouge du player": "The live stream is taking longer than expected — tap the player's red button",
    "Touchez le bouton rouge du player pour écouter": "Tap the player's red button to listen",
    "Appareil Android détecté": "Android device detected",
    "La version APK sera automatiquement recommandée dès que son lien est disponible.": "The APK version will be recommended automatically once its link is available.",
    "iPhone ou iPad détecté": "iPhone or iPad detected",
    "La version iOS sera automatiquement recommandée dès que son lien est disponible.": "The iOS version will be recommended automatically once its link is available.",
    "Vous consultez la page sur un ordinateur": "You are viewing this page on a computer",
    "Sur un téléphone, la page recommandera automatiquement Android ou iPhone/iPad.": "On a phone, the page will automatically recommend the Android or iPhone/iPad version.",
    "Télécharger l’APK": "Download the APK",
    "Télécharger pour iPhone": "Download for iPhone",
    "Le lien de téléchargement sera ajouté prochainement": "The download link will be added soon",
    "Lien du player copié": "Player link copied",
    "Copiez le lien du player depuis votre navigateur": "Copy the player link from your browser",
    "Écoutez Radio Stars 98.5 FM en direct.": "Listen to Radio Stars 98.5 FM live.",
    "Votre messagerie va s’ouvrir": "Your email app will open",
    "Nom : ": "Name: ",
    "Cette langue sera bientôt disponible. Le français reste affiché.": "This language will be available soon. The French version remains visible.",
    "Envoyer le message": "Send the message",
    "Votre message sera envoyé à info@radiostars.be.": "Your message will be sent to info@radiostars.be.",
    "Envoi impossible. Réessayez plus tard.": "Unable to send. Please try again later.",
    "Votre message a été envoyé.": "Your message has been sent.",
    "Méthode non autorisée.": "Method not allowed.",
    "Origine non autorisée.": "Origin not allowed.",
    "Merci pour votre message.": "Thank you for your message.",
    "Veuillez vérifier les champs du formulaire.": "Please check the form fields.",
    "Veuillez attendre une minute avant de renvoyer un message.": "Please wait one minute before sending another message.",
    "Envoi indisponible. Écrivez à info@radiostars.be.": "Sending is temporarily unavailable. Email info@radiostars.be."
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


const header = document.querySelector("#site-header");
const menuToggle = document.querySelector("#menu-toggle");
const navPanel = document.querySelector("#nav-panel");
const language = document.querySelector("#language");
const languageTrigger = document.querySelector("#language-trigger");
const siteNowPlayingLabel = document.querySelector("#site-now-playing-label");
const siteNowPlayingTitle = document.querySelector("#site-now-playing-title");
const languageOptions = Array.from(document.querySelectorAll("[data-language]"));
const contactForm = document.querySelector("#contact-form");
const appSection = document.querySelector("#application");
const appDeviceLabel = document.querySelector("#app-device-label");
const appDeviceHelp = document.querySelector("#app-device-help");
const toast = document.querySelector("#toast");
let toastTimer = 0;

const SITE_STREAM_URL = "https://radio-stars-player.gzqlah8.chatgpt.site/stream";
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
    showToast(t("Le direct tarde à répondre — touchez le bouton rouge du player"));
  }, SITE_STARTUP_TIMEOUT_MS);

  let playResult;
  try {
    playResult = siteAudio.play();
  } catch (_) {
    sitePlaybackTimedOut = true;
    showToast(t("Touchez le bouton rouge du player pour écouter"));
    finishSitePlaybackAttempt(attempt);
    return;
  }

  Promise.resolve(playResult).then(function () {
    finishSitePlaybackAttempt(attempt);
  }).catch(function () {
    if (attempt !== sitePlaybackAttempt) return;
    sitePlaybackTimedOut = true;
    showToast(t("Touchez le bouton rouge du player pour écouter"));
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
  return query || storedLocale() || "fr";
}

const detectedLocale = browserLocale();
const preferredLocale = requestedLocale();
const activeLocale = AVAILABLE_LOCALES.includes(preferredLocale) ? preferredLocale : "fr";

document.documentElement.lang = activeLocale;
document.documentElement.dataset.detectedLanguage = detectedLocale;
document.documentElement.dataset.preferredLanguage = preferredLocale;
translateDocument();
languageTrigger.firstChild.nodeValue = activeLocale.toUpperCase() + "\n                ";
document.querySelectorAll("[data-player]").forEach(function (link) {
  const destination = new URL(link.href);
  destination.searchParams.set("lang", activeLocale);
  link.href = destination.href;
});

languageOptions.forEach(function (option) {
  option.setAttribute("aria-current", option.dataset.language === activeLocale ? "true" : "false");
});

async function refreshSiteNowPlaying() {
  if (!siteNowPlayingTitle) return;
  try {
    const result = await fetch(NOW_PLAYING_URL + "?_=" + Date.now(), { cache: "no-store" });
    if (!result.ok) return;
    const data = await result.json();
    const title = String(data && data.title || "").trim();
    if (!title) return;
    siteNowPlayingTitle.textContent = title;
    if (siteNowPlayingLabel) siteNowPlayingLabel.textContent = t("À l’antenne");
  } catch (_) {}
}
refreshSiteNowPlaying();
window.setInterval(refreshSiteNowPlaying, NOW_PLAYING_INTERVAL_MS);

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
      label: t("Appareil Android détecté"),
      help: t("La version APK sera automatiquement recommandée dès que son lien est disponible.")
    },
    ios: {
      label: t("iPhone ou iPad détecté"),
      help: t("La version iOS sera automatiquement recommandée dès que son lien est disponible.")
    },
    other: {
      label: t("Vous consultez la page sur un ordinateur"),
      help: t("Sur un téléphone, la page recommandera automatiquement Android ou iPhone/iPad.")
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
      link.textContent = platformName === "android" ? t("Télécharger l’APK") : t("Télécharger pour iPhone");
      return;
    }

    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", function (event) {
      event.preventDefault();
      showToast(t("Le lien de téléchargement sera ajouté prochainement"));
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

    if (selected !== activeLocale) {
      const destination = new URL(location.href);
      destination.searchParams.set("lang", selected);
      location.assign(destination.href);
      return;
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
    event.preventDefault();
    stopSiteAudio();

    const destination = PLAYER_URL + "?lang=" + activeLocale + "&autoplay=1";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

    if (isMobile) {
      location.href = destination;
      return;
    }

    const features = "popup=yes,width=460,height=720,resizable=yes,scrollbars=yes";
    const popup = window.open(destination, "_blank", features);
    if (!popup) {
      location.href = destination;
      return;
    }

    playerPopup = popup;
    watchPlayerWindow();
    try { popup.focus(); } catch (_) {}
  });
});

document.querySelectorAll("[data-share-player]").forEach(function (button) {
  button.addEventListener("click", async function () {
    const shareData = {
      title: "Radio Stars — Le Player",
      text: t("Écoutez Radio Stars 98.5 FM en direct."),
      url: PLAYER_URL + "?lang=" + activeLocale
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareData.url);
      showToast(t("Lien du player copié"));
    } catch (error) {
      if (error && error.name === "AbortError") return;
      try {
        const helper = document.createElement("textarea");
        helper.value = shareData.url;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
        showToast(t("Lien du player copié"));
      } catch (_) {
        showToast(t("Copiez le lien du player depuis votre navigateur"));
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
    const mailBody = [t("Nom : ") + name, "E-mail : " + email, "", message].join("\n");

    showToast(t("Votre messagerie va s’ouvrir"));
    window.location.href = "mailto:info@radiostars.be?subject="
      + encodeURIComponent(mailSubject) + "&body=" + encodeURIComponent(mailBody);
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
