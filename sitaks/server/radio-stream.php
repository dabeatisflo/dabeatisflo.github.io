<?php
/**
 * SITAKS live-radio HTTPS relay, PHP 8.2
 *
 * DEPLOYMENT ONLY: This file MUST run on a PHP-capable HTTPS web host.
 * GitHub Pages will serve PHP as text and cannot execute it.
 *
 * Configure SITAKS_RADIO_SOURCE as a server-side environment variable.
 * Do not put the NAS address, source credentials or tokens in public HTML,
 * JavaScript, GitHub commits, or this file.
 *
 * Important: An HTTP audio stream relayed publicly is still a publicly
 * accessible stream via this endpoint. This hides the origin but cannot
 * make playback URLs undiscoverable. For truly private access, require
 * access control or expiring signed URLs on the relay.
 */
declare(strict_types=1);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    header('Allow: GET', true, 405);
    exit;
}

$source = getenv('SITAKS_RADIO_SOURCE') ?: '';
if ($source === '' || !preg_match('~^https?://~i', $source)) {
    header('Content-Type: text/plain; charset=utf-8', true, 503);
    header('Cache-Control: no-store');
    echo "Radio relay not configured.";
    exit;
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://dabeatisflo.github.io',
    'https://www.sitaksdolphinproductions.be',
    'https://sitaksdolphinproductions.be'
];
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

header('Content-Type: audio/mpeg');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Content-Disposition: inline');
header('X-Accel-Buffering: no');
header('Pragma: no-cache');

@set_time_limit(0);
@ini_set('zlib.output_compression', 'Off');
while (ob_get_level() > 0) {
    @ob_end_clean();
}

if (!function_exists('curl_init')) {
    http_response_code(503);
    exit;
}

$ch = curl_init($source);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_HEADER => false,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => 12,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_HTTPGET => true,
    CURLOPT_BUFFERSIZE => 16384,
    CURLOPT_USERAGENT => 'SITAKS-Radio-Relay/1.0',
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_WRITEFUNCTION => static function ($curl, string $data): int {
        echo $data;
        flush();
        return strlen($data);
    },
    CURLOPT_HEADERFUNCTION => static function ($curl, string $header): int {
        // Do not forward upstream server info, redirects or secret headers.
        return strlen($header);
    },
]);
curl_exec($ch);
curl_close($ch);
