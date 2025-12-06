<?php
// routing.php

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = rtrim($path, '/');
$path = $path === '' ? '/' : $path;

// Helper pour inclure et appeler un controller
function callController($file, $function, $params = []) {
    if (!file_exists($file)) {
        http_response_code(500);
        echo json_encode(["error" => "Controller not found"]);
        exit;
    }
    require_once $file;
    if (!function_exists($function)) {
        http_response_code(500);
        echo json_encode(["error" => "Function $function not found in controller"]);
        exit;
    }
    call_user_func_array($function, $params);
}

// Détecte les routes dynamiques et remplace par des placeholders
$routeKey = "$method $path";

// Routes dynamiques
if (preg_match('#^/v1/exercise/([^/]+)/info$#', $path, $matches)) {
    $routeKey = "$method /v1/exercise/{exercise_sub}/info";
    $params = [$matches[1]];
}

if (preg_match('#^/v1/exercise/([^/]+)/update$#', $path, $matches)) {
    $routeKey = "$method /v1/exercise/{exercise_sub}/update";
    $params = [$matches[1], $_POST];
}

if (preg_match('#^/v1/exercise/([^/]+)/delete$#', $path, $matches)) {
    $routeKey = "$method /v1/exercise/{exercise_sub}/delete";
    parse_str(file_get_contents("php://input"), $deleteParams);
    $params = [$matches[1], $deleteParams];
}

if (preg_match('#^/v1/exercise/([^/]+)/returns$#', $path, $matches)) {
    $routeKey = "$method /v1/exercise/{exercise_sub}/returns";
    $params = [$matches[1]];
}

if (preg_match('#^/v1/exercise/([^/]+)/return/([^/]+)$#', $path, $matches)) {
    $routeKey = "$method /v1/exercise/{exercise_sub}/return/{user_sub}";
    $params = [$matches[1], $matches[2]];
}

if (preg_match('#^/v1/user/([^/]+)/delete$#', $path, $matches)) {
    $routeKey = "$method /v1/user/{user_sub}/delete";
    parse_str(file_get_contents("php://input"), $deleteParams);
    $params = [$matches[1], $deleteParams];
}

if (preg_match('#^/v1/user/([^/]+)/info$#', $path, $matches)) {
    $routeKey = "$method /v1/user/{user_sub}/info";
    $params = [$matches[1]];
}

// Switch pour toutes les routes
switch ($routeKey) {
    case 'POST /v1/exercises/new':
        callController('controllers/ExercisesController.php', 'createExercise', [$_POST['content'] ?? null]);
        break;

    case 'GET /v1/exercise/{exercise_sub}/info':
        callController('controllers/ExercisesController.php', 'getExerciseInfo', $params);
        break;

    case 'POST /v1/exercise/{exercise_sub}/update':
        callController('controllers/ExercisesController.php', 'updateExercise', $params);
        break;

    case 'DELETE /v1/exercise/{exercise_sub}/delete':
        callController('controllers/ExercisesController.php', 'deleteExercise', $params);
        break;

    case 'GET /v1/exercise/{exercise_sub}/returns':
        callController('controllers/ExercisesController.php', 'getExerciseReturns', $params);
        break;

    case 'GET /v1/exercise/{exercise_sub}/return/{user_sub}':
        callController('controllers/ExercisesController.php', 'getExerciseReturnByUser', $params);
        break;

    case 'POST /v1/users/new':
        callController('controllers/UsersController.php', 'createUser', [
            $_POST['academic_id'] ?? null,
            $_POST['exercise_id'] ?? null
        ]);
        break;

    case 'DELETE /v1/user/{user_sub}/delete':
        callController('controllers/UsersController.php', 'deleteUser', $params);
        break;

    case 'GET /v1/user/{user_sub}/info':
        callController('controllers/UsersController.php', 'getUserInfo', $params);
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
        break;
}
