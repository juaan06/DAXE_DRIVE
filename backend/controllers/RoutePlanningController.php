<?php

require_once __DIR__ . '/../models/RoutePlanningModel.php';

class RoutePlanningController
{
    public function plan(): void
    {
        $payload = $this->readJson();

        try {
            $result = (new RoutePlanningModel())->plan($payload);
            $this->sendJson(200, true, $result, 'Ruta calculada correctamente.');
        } catch (InvalidArgumentException $exception) {
            $this->sendJson(400, false, [], $exception->getMessage());
        } catch (RuntimeException $exception) {
            $this->sendJson(502, false, [], $exception->getMessage());
        }
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
