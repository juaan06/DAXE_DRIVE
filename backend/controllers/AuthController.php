<?php

require_once __DIR__ . '/../models/AuthModel.php';

class AuthController
{
    public function register(): void
    {
        $payload = $this->readJson();

        try {
            $result = (new AuthModel())->register($payload);
            $accessToken = $result['data']['token'] ?? null;
            $refreshToken = $result['data']['refresh_token'] ?? null;

            if ($accessToken) {
                setcookie('daxe_access_token', $accessToken, [
                    'expires' => time() + 60 * 60 * 24 * 7,
                    'path' => '/',
                    'httponly' => true,
                    'samesite' => 'Lax',
                    'secure' => false,
                ]);
            }

            if ($refreshToken) {
                setcookie('daxe_refresh_token', $refreshToken, [
                    'expires' => time() + 60 * 60 * 24 * 30,
                    'path' => '/',
                    'httponly' => true,
                    'samesite' => 'Lax',
                    'secure' => false,
                ]);
            }

            $this->sendJson(200, $result['success'], $result['data'], $result['message']);
        } catch (InvalidArgumentException | RuntimeException $exception) {
            $this->sendJson(400, false, [], $exception->getMessage());
        }
    }

    public function login(): void
    {
        $payload = $this->readJson();

        try {
            $result = (new AuthModel())->login($payload);
            $accessToken = $result['data']['token'] ?? null;
            $refreshToken = $result['data']['refresh_token'] ?? null;

            if ($accessToken) {
                setcookie('daxe_access_token', $accessToken, [
                    'expires' => time() + 60 * 60 * 24 * 7,
                    'path' => '/',
                    'httponly' => true,
                    'samesite' => 'Lax',
                    'secure' => false,
                ]);
            }

            if ($refreshToken) {
                setcookie('daxe_refresh_token', $refreshToken, [
                    'expires' => time() + 60 * 60 * 24 * 30,
                    'path' => '/',
                    'httponly' => true,
                    'samesite' => 'Lax',
                    'secure' => false,
                ]);
            }

            $this->sendJson(200, $result['success'], $result['data'], $result['message']);
        } catch (InvalidArgumentException | RuntimeException $exception) {
            $this->sendJson(401, false, [], $exception->getMessage());
        }
    }

    public function me(): void
    {
        $token = $this->getBearerToken();

        try {
            $result = (new AuthModel())->me($token);
            $this->sendJson(200, $result['success'], $result['data'], $result['message']);
        } catch (InvalidArgumentException | RuntimeException $exception) {
            $this->sendJson(401, false, [], $exception->getMessage());
        }
    }

    public function logout(): void
    {
        setcookie('daxe_access_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => false,
        ]);

        setcookie('daxe_refresh_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => false,
        ]);

        $this->sendJson(200, true, [], 'Sesión cerrada.');
    }

    private function getBearerToken(): string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (str_starts_with(strtolower($header), 'bearer ')) {
            return trim(substr($header, 7));
        }

        return (string) ($_COOKIE['daxe_access_token'] ?? '');
    }

    private function readJson(): array
    {
        $input = file_get_contents('php://input');
        if ($input === false || trim($input) === '') {
            return [];
        }

        $decoded = json_decode($input, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function sendJson(int $status, bool $success, array $data, string $message): void
    {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status);

        echo json_encode([
            'success' => $success,
            'data' => $data,
            'message' => $message,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
