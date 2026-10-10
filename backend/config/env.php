<?php

function env(string $key, mixed $default = null): mixed
{
    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return $value;
    }

    $envCandidates = [
        dirname(__DIR__, 1) . '/.env',
        dirname(__DIR__, 2) . '/.env',
    ];

    foreach ($envCandidates as $envPath) {
        if (!is_file($envPath)) {
            continue;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!$lines) {
            continue;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                continue;
            }

            [$name, $rawValue] = array_pad(explode('=', $trimmed, 2), 2, '');
            if (trim($name) === $key) {
                $value = trim($rawValue, " \t\n\r\0\x0B\"'");
                return $value === '' ? $default : $value;
            }
        }
    }

    return $default;
}
