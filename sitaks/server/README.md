# SITAKS live radio — deployment requirements

The web preview on GitHub Pages is static. It CANNOT execute \`radio-stream.php\`.

The radio player is visible **only** under **Audio & Broadcasting** (the separate \`webradio.html\` page) and requires no login, as requested.

## Why the prior player failed
The existing NAS source is plain HTTP and the public demo uses HTTPS. Browser mixed-content policy blocks or upgrades insecure audio requests. The URL is therefore intentionally removed from all CURRENT HTML / JS.

## How to make the player truly work
1. Deploy \`radio-stream.php\` from this folder to a PHP 8.2 HTTPS host, at the exact public URL \`https://www.sitaksdolphinproductions.be/sitaks/radio-stream.php\`, OR update \`webradio.html\` to the final HTTPS endpoint after deployment.
2. Configure the **server-only** \`SITAKS_RADIO_SOURCE\` environment variable using OVH server configuration. Keep the actual NAS address outside this PUBLIC repository and outside public webroot.
3. Confirm the source is reachable from that PHP server and that PHP/cURL is enabled and not terminating long-lived streams.
4. Test on desktop Chrome, Firefox, Edge, Safari, Android and iOS, including several minutes continuous playback.
5. On shared hosting, infinite streaming connections may exhaust PHP workers. A dedicated nginx/Icecast HTTPS relay or HTTPS port on the Synology NAS is more robust than a PHP relay for many listeners.
6. Protect/rotate the NAS stream URL/credentials if secrecy is essential: earlier public demo commits contained the old address and deleting it from the current source does NOT erase Git history.

The public HTTPS proxy address can still be found with browser developer tools; visitors can listen through it. Hiding a publicly accessible playback address completely is not possible without adding authentication or expiring tokens.

## Assets and responsive styles
\`theme.css\` covers phones, tablets, desktops, 4K and higher, with \`connected-world.svg\` as a scalable consistent space/Earth theme. Final approved high-resolution images can replace the vector fallback without altering layout.

## Explicitly not live yet
Do not claim the radio works until the HTTPS relay is installed, configured and checked. GitHub Pages alone cannot fulfill that requirement.
