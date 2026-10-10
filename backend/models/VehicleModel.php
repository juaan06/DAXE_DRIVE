<?php

require_once __DIR__ . '/../config/supabase.php';

class VehicleModel
{
    public function list(string $token): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];

        $response = supabaseRequest(
            '/rest/v1/user_vehicles?select=*&user_id=eq.' . rawurlencode($userId) . '&order=created_at.desc',
            'GET',
            [],
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudieron obtener los vehículos.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [],
            'message' => 'Vehículos obtenidos.',
        ];
    }

    public function create(string $token, array $payload): array
    {
        $user = $this->getAuthUser($token);
        $data = $this->normalizePayload($payload, true);
        $data['user_id'] = (string) $user['id'];
        $data['created_at'] = gmdate('Y-m-d\TH:i:s\Z');
        $data['updated_at'] = gmdate('Y-m-d\TH:i:s\Z');

        $response = supabaseRequest(
            '/rest/v1/user_vehicles',
            'POST',
            $data,
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo crear el vehículo.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [$body],
            'message' => 'Vehículo creado correctamente.',
        ];
    }

    public function update(string $token, string $vehicleId, array $payload): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];
        $data = $this->normalizePayload($payload, false);

        if (empty($data)) {
            throw new InvalidArgumentException('No hay datos válidos para actualizar.');
        }

        $data['updated_at'] = gmdate('Y-m-d\TH:i:s\Z');

        $response = supabaseRequest(
            '/rest/v1/user_vehicles?id=eq.' . rawurlencode($vehicleId) . '&user_id=eq.' . rawurlencode($userId),
            'PATCH',
            $data,
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo actualizar el vehículo.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [$body],
            'message' => 'Vehículo actualizado correctamente.',
        ];
    }

    public function delete(string $token, string $vehicleId): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];

        $response = supabaseRequest(
            '/rest/v1/user_vehicles?id=eq.' . rawurlencode($vehicleId) . '&user_id=eq.' . rawurlencode($userId),
            'DELETE',
            [],
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo eliminar el vehículo.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [],
            'message' => 'Vehículo eliminado correctamente.',
        ];
    }

    private function normalizePayload(array $payload, bool $requireAllFields): array
    {
        $type = trim((string) ($payload['type'] ?? ''));
        $brand = trim((string) ($payload['brand'] ?? ''));
        $model = trim((string) ($payload['model'] ?? ''));
        $plate = strtoupper(trim((string) ($payload['plate'] ?? '')));
        $year = (int) ($payload['year'] ?? 0);
        $color = trim((string) ($payload['color'] ?? ''));
        $notes = trim((string) ($payload['notes'] ?? ''));

        $allowedTypes = ['particular', 'moto', 'taxi', 'camioneta', 'bus', 'otro'];
        if ($type === '') {
            if ($requireAllFields) {
                throw new InvalidArgumentException('El tipo de vehículo es obligatorio.');
            }
        } elseif (!in_array($type, $allowedTypes, true)) {
            throw new InvalidArgumentException('El tipo de vehículo no es válido.');
        }

        if ($brand === '') {
            if ($requireAllFields) {
                throw new InvalidArgumentException('La marca del vehículo es obligatoria.');
            }
        }

        if ($model === '') {
            if ($requireAllFields) {
                throw new InvalidArgumentException('El modelo del vehículo es obligatorio.');
            }
        }

        if ($plate === '') {
            if ($requireAllFields) {
                throw new InvalidArgumentException('La placa del vehículo es obligatoria.');
            }
        }

        if ($year !== 0 && ($year < 1900 || $year > 2100)) {
            throw new InvalidArgumentException('El año del vehículo no es válido.');
        }

        $data = [];

        if ($type !== '') {
            $data['type'] = $type;
        }

        if ($brand !== '') {
            $data['brand'] = $brand;
        }

        if ($model !== '') {
            $data['model'] = $model;
        }

        if ($plate !== '') {
            $data['plate'] = $plate;
        }

        if ($year !== 0) {
            $data['year'] = $year;
        }

        if ($color !== '') {
            $data['color'] = $color;
        }

        if ($notes !== '') {
            $data['notes'] = $notes;
        }

        return $data;
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
