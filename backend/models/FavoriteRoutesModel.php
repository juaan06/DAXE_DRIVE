<?php

require_once __DIR__ . '/../config/supabase.php';

class FavoriteRoutesModel
{
    public function list(string $token): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];

        $response = supabaseRequest(
            '/rest/v1/favorite_routes?select=*&user_id=eq.' . rawurlencode($userId) . '&order=created_at.desc',
            'GET',
            [],
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudieron obtener las rutas favoritas.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [],
            'message' => 'Rutas favoritas obtenidas.',
        ];
    }

    public function create(string $token, array $payload): array
    {
        $user = $this->getAuthUser($token);
        $data = $this->normalizePayload($payload);
        $data['user_id'] = (string) $user['id'];
        $data['created_at'] = gmdate('Y-m-d\TH:i:s\Z');
        $data['updated_at'] = gmdate('Y-m-d\TH:i:s\Z');

        $response = supabaseRequest(
            '/rest/v1/favorite_routes',
            'POST',
            $data,
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo guardar la ruta favorita.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [$body],
            'message' => 'Ruta favorita guardada correctamente.',
        ];
    }

    public function delete(string $token, string $routeId): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];

        $response = supabaseRequest(
            '/rest/v1/favorite_routes?id=eq.' . rawurlencode($routeId) . '&user_id=eq.' . rawurlencode($userId),
            'DELETE',
            [],
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo eliminar la ruta favorita.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [],
            'message' => 'Ruta favorita eliminada correctamente.',
        ];
    }

    private function normalizePayload(array $payload): array
    {
        $name = trim((string) ($payload['name'] ?? ''));
        $origin = trim((string) ($payload['origin'] ?? ''));
        $destination = trim((string) ($payload['destination'] ?? ''));
        $distanceKm = (float) ($payload['distanceKm'] ?? $payload['distance_km'] ?? 0);
        $durationMin = (int) ($payload['durationMin'] ?? $payload['duration_min'] ?? 0);

        if ($name === '') {
            throw new InvalidArgumentException('El nombre de la ruta es obligatorio.');
        }

        if ($origin === '') {
            throw new InvalidArgumentException('El origen es obligatorio.');
        }

        if ($destination === '') {
            throw new InvalidArgumentException('El destino es obligatorio.');
        }

        if ($origin === $destination) {
            throw new InvalidArgumentException('El origen y destino deben ser diferentes.');
        }

        return [
            'name' => $name,
            'origin' => $origin,
            'destination' => $destination,
            'distance_km' => $distanceKm > 0 ? $distanceKm : 0,
            'duration_min' => $durationMin > 0 ? $durationMin : 0,
        ];
    }

    private function getAuthUser(string $token): array
    {
        $response = supabaseRequest('/auth/v1/user', 'GET', [], $token, false);
        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['msg'] ?? $body['message'] ?? $body['error_description'] ?? 'La sesión no es válida.';
            throw new RuntimeException($message);
        }

        if (empty($body['id']) || empty($body['email'])) {
            throw new RuntimeException('No se pudo obtener la sesión autenticada.');
        }

        return $body;
    }
}
