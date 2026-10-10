<?php

require_once __DIR__ . '/../config/supabase.php';

class AlertHistoryModel
{
    public function list(string $token): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];

        $response = supabaseRequest(
            '/rest/v1/user_alerts?select=*&user_id=eq.' . rawurlencode($userId) . '&order=created_at.desc',
            'GET',
            [],
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo consultar el historial de alertas.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [],
            'message' => 'Historial de alertas obtenido.',
        ];
    }

    public function create(string $token, array $payload): array
    {
        $user = $this->getAuthUser($token);
        $data = $this->normalizePayload($payload);
        $data['user_id'] = (string) $user['id'];
        $data['created_at'] = gmdate('Y-m-d\TH:i:s\Z');

        $response = supabaseRequest(
            '/rest/v1/user_alerts',
            'POST',
            $data,
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo crear la alerta.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [$body],
            'message' => 'Alerta creada correctamente.',
        ];
    }

    public function delete(string $token, string $alertId): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];

        $response = supabaseRequest(
            '/rest/v1/user_alerts?id=eq.' . rawurlencode($alertId) . '&user_id=eq.' . rawurlencode($userId),
            'DELETE',
            [],
            $token,
            false,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo eliminar la alerta.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [],
            'message' => 'Alerta eliminada correctamente.',
        ];
    }

    private function normalizePayload(array $payload): array
    {
        $type = strtolower(trim((string) ($payload['type'] ?? 'general')));
        $message = trim((string) ($payload['message'] ?? ''));
        $severity = strtolower(trim((string) ($payload['severity'] ?? 'info')));

        if ($message === '') {
            throw new InvalidArgumentException('El mensaje de la alerta es obligatorio.');
        }

        $allowedTypes = ['pico', 'clima', 'bloqueo', 'general'];
        if (!in_array($type, $allowedTypes, true)) {
            $type = 'general';
        }

        $allowedSeverities = ['low', 'medium', 'high', 'info'];
        if (!in_array($severity, $allowedSeverities, true)) {
            $severity = 'info';
        }

        return [
            'type' => $type,
            'message' => $message,
            'severity' => $severity,
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
