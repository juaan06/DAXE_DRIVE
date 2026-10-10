<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserProfileController.php';
require_once __DIR__ . '/controllers/VehicleController.php';
require_once __DIR__ . '/controllers/PicoPlacaController.php';
require_once __DIR__ . '/controllers/FavoriteRoutesController.php';
require_once __DIR__ . '/controllers/RoutePlanningController.php';
require_once __DIR__ . '/controllers/AlertHistoryController.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = array_values(array_filter(explode('/', $uri), 'strlen'));

if (!isset($segments[0]) || $segments[0] !== 'api') {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'data' => [],
        'message' => 'Ruta no encontrada.',
    ]);
    exit;
}

if (!isset($segments[1])) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'data' => [],
        'message' => 'Ruta no encontrada.',
    ]);
    exit;
}

if ($segments[1] === 'auth') {
    $controller = new AuthController();

    switch ($segments[2] ?? '') {
        case 'register':
            $controller->register();
            break;
        case 'login':
            $controller->login();
            break;
        case 'me':
            $controller->me();
            break;
        case 'logout':
            $controller->logout();
            break;
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'data' => [],
                'message' => 'Endpoint no disponible.',
            ]);
            break;
    }
    exit;
}

if ($segments[1] === 'profile') {
    $controller = new UserProfileController();

    switch ($segments[2] ?? '') {
        case 'me':
            $controller->me();
            exit;
        case 'sync':
            $controller->sync();
            exit;
        case 'update':
            $controller->update();
            exit;
        default:
            break;
    }
}

if ($segments[1] === 'vehicles') {
    $controller = new VehicleController();

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $controller->list();
            exit;
        case 'POST':
            $controller->create();
            exit;
        case 'PATCH':
            $controller->update();
            exit;
        case 'DELETE':
            $controller->delete();
            exit;
        default:
            break;
    }
}

if ($segments[1] === 'pico-placa') {
    $controller = new PicoPlacaController();
    if (($segments[2] ?? '') === 'check') {
        $controller->check();
        exit;
    }
}

if ($segments[1] === 'routes') {
    if (($segments[2] ?? '') === 'plan' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        (new RoutePlanningController())->plan();
        exit;
    }

    $controller = new FavoriteRoutesController();

    if (($segments[2] ?? '') === 'favorites') {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                $controller->list();
                exit;
            case 'POST':
                $controller->create();
                exit;
            case 'DELETE':
                $controller->delete();
                exit;
            default:
                break;
        }
    }
}

if ($segments[1] === 'alerts') {
    $controller = new AlertHistoryController();

    if (($segments[2] ?? '') === 'history') {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                $controller->list();
                exit;
            case 'POST':
                $controller->create();
                exit;
            case 'DELETE':
                $controller->delete();
                exit;
            default:
                break;
        }
    }
}

http_response_code(404);
echo json_encode([
    'success' => false,
    'data' => [],
    'message' => 'Ruta no encontrada.',
]);
