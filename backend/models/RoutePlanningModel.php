<?php

class RoutePlanningModel
{
    private const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
    private const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';
    private const USER_AGENT = 'DAXE route planner/1.0';

    public function plan(array $payload): array
    {
        $origin = trim((string) ($payload['origin'] ?? ''));
        $destination = trim((string) ($payload['destination'] ?? ''));

        if ($origin === '' || $destination === '') {
            throw new InvalidArgumentException('Escribe un origen y un destino para calcular la ruta.');
        }

        if (strlen($origin) > 300 || strlen($destination) > 300) {
            throw new InvalidArgumentException('Cada dirección debe tener máximo 300 caracteres.');
        }

        if (strcasecmp($origin, $destination) === 0) {
            throw new InvalidArgumentException('El origen y el destino deben ser diferentes.');
        }

        $originPlace = $this->geocode($origin);
        // Nominatim's public endpoint asks clients to stay at or below one request per second.
        usleep(1100000);
        $destinationPlace = $this->geocode($destination);

        $routeUrl = sprintf(
            '%s/%s,%s;%s,%s?overview=full&geometries=geojson&steps=false',
            self::OSRM_URL,
            $originPlace['longitude'],
            $originPlace['latitude'],
            $destinationPlace['longitude'],
            $destinationPlace['latitude']
        );
        $routeResponse = $this->requestJson($routeUrl);

        if (($routeResponse['code'] ?? '') !== 'Ok' || empty($routeResponse['routes'][0])) {
            throw new RuntimeException('No se encontró una ruta en automóvil entre esos lugares.');
        }

        $route = $routeResponse['routes'][0];
        $rawCoordinates = $route['geometry']['coordinates'] ?? [];
        $distanceMeters = (float) ($route['distance'] ?? 0);
        $durationSeconds = (float) ($route['duration'] ?? 0);

        if (!is_array($rawCoordinates) || count($rawCoordinates) < 2 || $distanceMeters <= 0 || $durationSeconds <= 0) {
            throw new RuntimeException('El proveedor devolvió datos de ruta incompletos.');
        }

        $coordinates = [];
        foreach ($rawCoordinates as $coordinate) {
            if (!is_array($coordinate) || count($coordinate) < 2) {
                continue;
            }

            $longitude = (float) $coordinate[0];
            $latitude = (float) $coordinate[1];
            if (!is_finite($longitude) || !is_finite($latitude) || abs($longitude) > 180 || abs($latitude) > 90) {
                continue;
            }

            // Leaflet consumes [latitude, longitude], while GeoJSON is [longitude, latitude].
            $coordinates[] = [$latitude, $longitude];
        }

        if (count($coordinates) < 2) {
            throw new RuntimeException('El proveedor devolvió una geometría de ruta no válida.');
        }

        return [
            'origin' => $originPlace['display_name'],
            'destination' => $destinationPlace['display_name'],
            'coordinates' => $coordinates,
            'distanceKm' => round($distanceMeters / 1000, 1),
            'durationMin' => (int) ceil($durationSeconds / 60),
        ];
    }

    private function geocode(string $address): array
    {
        $queries = [
            $address,
            $address . ', Valle de Aburrá, Antioquia, Colombia',
            $address . ', Antioquia, Colombia',
            $address . ', Colombia',
        ];

        foreach ($queries as $index => $queryText) {
            if ($index > 0) {
                // Keep within Nominatim's public usage policy when a fallback query is needed.
                usleep(1100000);
            }

            $query = http_build_query([
                'q' => $queryText,
                'format' => 'jsonv2',
                'limit' => 1,
                'countrycodes' => 'co',
                'accept-language' => 'es',
            ]);
            $results = $this->requestJson(self::NOMINATIM_URL . '?' . $query);
            $place = is_array($results) ? ($results[0] ?? null) : null;

            if (is_array($place) && is_numeric($place['lat'] ?? null) && is_numeric($place['lon'] ?? null)) {
                return [
                    'latitude' => (float) $place['lat'],
                    'longitude' => (float) $place['lon'],
                    'display_name' => (string) ($place['display_name'] ?? $address),
                ];
            }
        }

        throw new InvalidArgumentException('No se encontró la ubicación «' . $address . '». Prueba con una dirección más específica.');
    }

    private function requestJson(string $url): array
    {
        $curl = curl_init($url);
        if ($curl === false) {
            throw new RuntimeException('No fue posible iniciar la consulta al servicio de mapas.');
        }

        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 25,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'User-Agent: ' . self::USER_AGENT,
            ],
        ]);

        $response = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $curlError = curl_error($curl);
        curl_close($curl);

        if ($response === false) {
            throw new RuntimeException('No se pudo conectar al servicio de mapas: ' . $curlError);
        }

        $decoded = json_decode($response, true);
        if ($status < 200 || $status >= 300 || !is_array($decoded)) {
            throw new RuntimeException('El servicio de mapas no está disponible temporalmente.');
        }

        return $decoded;
    }
}
