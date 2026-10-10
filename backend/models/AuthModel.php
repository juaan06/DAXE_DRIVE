<?php

require_once __DIR__ . '/../config/supabase.php';

class AuthModel
{
    public function register(array $data): array
    {
        $name = trim((string) ($data['name'] ?? ''));
        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if ($name === '') {
            throw new InvalidArgumentException('El nombre es obligatorio.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('El correo no es válido.');
        }

        if (strlen($password) < 8) {
            throw new InvalidArgumentException('La contraseña debe tener al menos 8 caracteres.');
        }

        $payload = [
            'email' => $email,
            'password' => $password,
            'options' => [
                'data' => [
                    'full_name' => $name,
                ],
            ],
        ];

        $response = supabaseRequest('/auth/v1/signup', 'POST', $payload, null, false);
        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['msg'] ?? $body['error_description'] ?? $body['message'] ?? 'No se pudo registrar el usuario.';
            throw new RuntimeException($message);
        }

        $user = $body['user'] ?? null;
        $token = $body['access_token'] ?? null;

        return [
            'success' => true,
            'message' => 'Registro exitoso.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ];
    }

    public function login(array $data): array
    {
        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('El correo no es válido.');
        }

        if (strlen($password) < 8) {
            throw new InvalidArgumentException('La contraseña debe tener al menos 8 caracteres.');
        }

        $payload = [
            'email' => $email,
            'password' => $password,
        ];

        $response = supabaseRequest('/auth/v1/token', 'POST', $payload, null, false);
        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['msg'] ?? $body['error_description'] ?? $body['message'] ?? 'Credenciales incorrectas.';
            throw new RuntimeException($message);
        }

        $user = $body['user'] ?? null;
        $token = $body['access_token'] ?? null;
        $refreshToken = $body['refresh_token'] ?? null;

        return [
            'success' => true,
            'message' => 'Inicio de sesión exitoso.',
            'data' => [
                'user' => $user,
                'token' => $token,
                'refresh_token' => $refreshToken,
            ],
        ];
    }

    public function me(string $token): array
    {
        if ($token === '') {
            throw new InvalidArgumentException('Token de sesión faltante.');
        }

        $response = supabaseRequest('/auth/v1/user', 'GET', [], $token, false);
        $status = (int) $response['status'];
        $body = $response['body'];

        if ($status >= 400) {
            $message = $body['msg'] ?? $body['error_description'] ?? $body['message'] ?? 'La sesión no es válida.';
            throw new RuntimeException($message);
        }

        $user = $body['user'] ?? $body;

        return [
            'success' => true,
            'message' => 'Sesión validada.',
            'data' => [
                'user' => $user,
            ],
        ];
    }
}
