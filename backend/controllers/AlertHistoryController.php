<?php

require_once __DIR__ . '/../models/AlertHistoryModel.php';

class AlertHistoryController
{
    public function list(): void
    {
        $token = $this->getBearerToken();

        try {
            $result = (new AlertHistoryModel())->list($token);
            $this->sendJson(200, $result['success'], $result['data'], $result['message']);
        } catch (InvalidArgumentException | RuntimeException $exception) {
            $this->sendJson(401, false, [], $exception->getMessage());
        }
    }

    public function create(): void
    {
        $token = $this->getBearerToken();
        $payload = $this->readJson();

        try {
            $result = (new AlertHistoryModel())->create($token, $payload);
            $this->sendJson(201, $result['success'], $result['data'], $result['message']);
        } catch (InvalidArgumentException | RuntimeException $exception) {
            $this->sendJson(400, false, [], $exception->getMessage());
        }
    }

    public function delete(): void
    {
        $token = $this->getBearerToken();
        $alertId = (string) ($_GET['id'] ?? '');

        if ($alertId === '') {
            $this->sendJson(400, false, [], 'Falta el identificador de la alerta.');
            return;
        }

        try {
            $result = (new AlertHistoryModel())->delete($token, $alertId);
            $this->sendJson(200, $result['success'], $result['data'], $result['message']);
        } catch (InvalidArgumentException | RuntimeException $exception) {
            $this->sendJson(400, false, [], $exception->getMessage());
        }
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
