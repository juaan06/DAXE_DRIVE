<?php

require_once __DIR__ . '/../config/supabase.php';

class UserProfileModel
{
    public function me(string $token): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];

        $response = supabaseRequest(
            '/rest/v1/profiles?id=eq.' . rawurlencode($userId) . '&select=*',
            'GET',
            [],
            null,
            true,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo obtener el perfil del usuario.';
            throw new RuntimeException($message);
        }

        $profile = is_array($body) && count($body) > 0 ? $body[0] : [
            'id' => $userId,
            'email' => $user['email'],
            'full_name' => $user['user_metadata']['full_name'] ?? 'Usuario DAXE',
            'avatar_url' => $user['user_metadata']['avatar_url'] ?? null,
        ];

        return [
            'success' => true,
            'data' => [
                'user' => $user,
                'profile' => $profile,
            ],
            'message' => 'Perfil obtenido.',
        ];
    }

    public function upsertProfileFromAuth(array $userData): array
    {
        if (empty($userData['id']) || empty($userData['email'])) {
            throw new InvalidArgumentException('El usuario autenticado no tiene un perfil válido.');
        }

        $id = (string) $userData['id'];
        $email = trim((string) $userData['email']);
        $fullName = trim((string) ($userData['user_metadata']['full_name'] ?? $userData['full_name'] ?? ''));
        $avatarUrl = $userData['user_metadata']['avatar_url'] ?? $userData['avatar_url'] ?? null;

        $profile = [
            'id' => $id,
            'email' => $email,
            'full_name' => $fullName !== '' ? $fullName : 'Usuario DAXE',
            'avatar_url' => $avatarUrl,
            'updated_at' => gmdate('Y-m-d\TH:i:s\Z'),
        ];

        $response = supabaseRequest(
            '/rest/v1/profiles?id=eq.' . rawurlencode($id) . '&select=*',
            'POST',
            $profile,
            null,
            true,
            ['Prefer: resolution=merge-duplicates', 'Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo crear el perfil del usuario.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [$body],
            'message' => 'Perfil sincronizado.',
        ];
    }

    public function updateProfile(string $token, array $payload): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];
        $fullName = trim((string) ($payload['full_name'] ?? ''));
        $avatarUrl = trim((string) ($payload['avatar_url'] ?? ''));

        if ($fullName === '') {
            throw new InvalidArgumentException('El nombre es obligatorio.');
        }

        $data = [
            'full_name' => $fullName,
            'avatar_url' => $avatarUrl !== '' ? $avatarUrl : null,
            'updated_at' => gmdate('Y-m-d\TH:i:s\Z'),
        ];

        $response = supabaseRequest(
            '/rest/v1/profiles?id=eq.' . rawurlencode($userId),
            'PATCH',
            $data,
            null,
            true,
            ['Prefer: return=representation']
        );

        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['message'] ?? $body['error'] ?? 'No se pudo actualizar el perfil.';
            throw new RuntimeException($message);
        }

        return [
            'success' => true,
            'data' => is_array($body) ? $body : [$body],
            'message' => 'Perfil actualizado correctamente.',
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
