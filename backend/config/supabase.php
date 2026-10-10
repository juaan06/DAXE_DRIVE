<?php

require_once __DIR__ . '/env.php';

function supabaseConfig(): array
{
    $url = rtrim((string) env('SUPABASE_URL', ''), '/');
    $anonKey = (string) env('SUPABASE_ANON_KEY', '');
    $serviceKey = (string) env('SUPABASE_SERVICE_ROLE_KEY', '');

    return [
        'url' => $url,
        'anon_key' => $anonKey,
        'service_key' => $serviceKey,
    ];
}

function supabaseRequest(string $path, string $method = 'GET', array $payload = [], ?string $token = null, bool $useServiceRole = false, array $extraHeaders = []): array
{
    $config = supabaseConfig();
    $baseUrl = $config['url'];
    $apiKey = $useServiceRole ? $config['service_key'] : $config['anon_key'];

    if ($baseUrl === '' || str_contains(strtoupper($baseUrl), 'REEMPLAZA') || str_contains(strtolower($baseUrl), 'tu-proyecto')) {
        throw new RuntimeException('Configura SUPABASE_URL en backend/.env con la URL real del proyecto (Supabase: Project Settings → API).');
    }

    $keyName = $useServiceRole ? 'SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_ANON_KEY';
    $normalizedKey = strtolower($apiKey);
    $isPlaceholderKey = str_contains(strtoupper($apiKey), 'REEMPLAZA')
        || str_contains($normalizedKey, 'tu_anon_key')
        || str_contains($normalizedKey, 'tu_service_role_key');
    if ($apiKey === '' || $isPlaceholderKey) {
        throw new RuntimeException('Configura ' . $keyName . ' en backend/.env con la clave del proyecto Supabase.');
    }

    $url = $baseUrl . $path;
    $headers = [
        'Content-Type: application/json',
        'Accept: application/json',
        'apikey: ' . $apiKey,
    ];

    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    foreach ($extraHeaders as $header) {
        if (is_string($header) && $header !== '') {
            $headers[] = $header;
        }
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => strtoupper($method),
    ]);

    if (!empty($payload)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        throw new RuntimeException('No se pudo completar la petición a Supabase: ' . $err);
    }

    $decoded = json_decode($response, true);

    return [
        'status' => $httpCode,
        'body' => is_array($decoded) ? $decoded : ['message' => $response],
        'error' => $err,
    ];
}
