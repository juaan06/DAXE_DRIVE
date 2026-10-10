<?php

require_once __DIR__ . '/../config/supabase.php';

class PicoPlacaModel
{
    private const DAY_RULES = [
        1 => [1, 2],
        2 => [3, 4],
        3 => [5, 6],
        4 => [7, 8],
        5 => [9, 0],
    ];

    public function check(string $token, array $payload): array
    {
        $vehicle = $this->resolveVehicle($token, $payload);
        $plate = strtoupper(trim((string) ($vehicle['plate'] ?? $payload['plate'] ?? '')));
        $type = strtolower(trim((string) ($vehicle['type'] ?? $payload['type'] ?? 'particular')));
        $date = trim((string) ($payload['date'] ?? date('Y-m-d')));
        $time = trim((string) ($payload['time'] ?? date('H:i')));

        if ($plate === '') {
            throw new InvalidArgumentException('La placa es obligatoria para consultar Pico y Placa.');
        }

        $result = $this->evaluate($plate, $type, $date, $time);

        return [
            'success' => true,
            'data' => [
                'plate' => $plate,
                'type' => $type,
                'date' => $date,
                'time' => $time,
                'is_restricted' => $result['is_restricted'],
                'status' => $result['status'],
                'reason' => $result['reason'],
                'restricted_digits' => $result['restricted_digits'],
                'target_digit' => $result['target_digit'],
                'day_name' => $result['day_name'],
                'zone_exempt' => false,
                'windows' => [
                    'morning' => '07:00 - 09:30',
                    'afternoon' => '16:00 - 19:30',
                ],
            ],
            'message' => $result['reason'],
        ];
    }

    private function resolveVehicle(string $token, array $payload): array
    {
        $user = $this->getAuthUser($token);
        $userId = (string) $user['id'];

        if (!empty($payload['vehicle_id'])) {
            $response = supabaseRequest(
                '/rest/v1/user_vehicles?id=eq.' . rawurlencode((string) $payload['vehicle_id']) . '&user_id=eq.' . rawurlencode($userId) . '&select=*',
                'GET',
                [],
                $token,
                false,
                ['Prefer: return=representation']
            );

            $status = (int) $response['status'];
            $body = $response['body'];

            if ($status >= 400) {
                throw new RuntimeException($body['message'] ?? 'No se pudo consultar el vehículo.');
            }

            if (is_array($body) && !empty($body[0])) {
                return $body[0];
            }
        }

        if (!empty($payload['plate'])) {
            return [
                'plate' => trim((string) $payload['plate']),
                'type' => trim((string) ($payload['type'] ?? 'particular')),
            ];
        }

        throw new InvalidArgumentException('Debes enviar un vehículo o una placa válida.');
    }

    private function evaluate(string $plate, string $type, string $date, string $time): array
    {
        $cleanPlate = preg_replace('/[^A-Za-z0-9]/', '', strtoupper($plate)) ?? '';
        if ($cleanPlate === '') {
            throw new InvalidArgumentException('La placa es obligatoria para validar Pico y Placa.');
        }

        $dateValue = new DateTimeImmutable($date ?: date('Y-m-d'));
        $day = (int) $dateValue->format('N');

        if ($day === 6 || $day === 7) {
            return [
                'is_restricted' => false,
                'status' => 'weekend',
                'reason' => 'No hay Pico y Placa los fines de semana.',
                'restricted_digits' => [],
                'target_digit' => $this->getTargetDigit($cleanPlate, $type),
                'day_name' => 'Fin de semana',
            ];
        }

        $rule = self::DAY_RULES[$day] ?? null;
        if ($rule === null) {
            return [
                'is_restricted' => false,
                'status' => 'no-rule',
                'reason' => 'No aplica ninguna restricción para este día.',
                'restricted_digits' => [],
                'target_digit' => $this->getTargetDigit($cleanPlate, $type),
                'day_name' => 'No aplica',
            ];
        }

        $targetDigit = $this->getTargetDigit($cleanPlate, $type);
        $minutes = $this->minutesFromTime($time ?: date('H:i'));
        $inWindow = ($minutes >= 7 * 60 && $minutes < 9 * 60 + 30)
            || ($minutes >= 16 * 60 && $minutes < 19 * 60 + 30);

        $isRestricted = $inWindow && in_array($targetDigit, $rule, true);

        return [
            'is_restricted' => $isRestricted,
            'status' => $isRestricted ? 'restricted' : 'allowed',
            'reason' => $isRestricted ? 'Pico y Placa activo' : 'Fuera de horario o no aplica para esta placa.',
            'restricted_digits' => $rule,
            'target_digit' => $targetDigit,
            'day_name' => $this->dayName($day),
        ];
    }

    private function getTargetDigit(string $plate, string $type): int
    {
        preg_match_all('/\d/', $plate, $matches);
        $digits = $matches[0] ?? [];

        if (empty($digits)) {
            return 0;
        }

        if ($type === 'moto') {
            return (int) $digits[0];
        }

        return (int) $digits[count($digits) - 1];
    }

    private function minutesFromTime(string $time): int
    {
        $parts = explode(':', $time);
        $hours = (int) ($parts[0] ?? 0);
        $minutes = (int) ($parts[1] ?? 0);
        return ($hours * 60) + $minutes;
    }

    private function dayName(int $day): string
    {
        $days = [
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
            7 => 'Domingo',
        ];

        return $days[$day] ?? 'No aplica';
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
