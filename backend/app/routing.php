<?php
/**
 * @file routing.php
 * @brief Handles API routing and dispatching requests to the appropriate controllers.
 */

header('Content-Type: application/json');

/** 
 * @brief Gets the HTTP request method (GET, POST, DELETE, etc.)
 */
$method = $_SERVER['REQUEST_METHOD'];

/** 
 * @brief Parses the request URI and normalizes the path.
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = rtrim($path, '/');
$path = $path === '' ? '/' : $path;

/**
 * @brief Helper function to include a controller file and call a function within it.
 * 
 * @param string $file The controller file path
 * @param string $function The function name to call
 * @param array $params Optional array of parameters to pass to the function
 * 
 * @return void
 * 
 * If the controller or function does not exist, returns HTTP 500 with a JSON error.
 */
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

/**
 * @brief Creates a unique route key based on HTTP method and path
 */
$routeKey = "$method $path";

/** 
 * @brief Detects dynamic routes and replaces path segments with placeholders.
 * 
 * Examples:
 * - /v1/exercise/123/info → /v1/exercise/{exercise_sub}/info
 * - /v1/user/456/push → /v1/user/{user_sub}/push
 */
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

if (preg_match('#^/v1/exercise/([^/]+)/participants$#', $path, $matches)) {
    $routeKey = "$method /v1/exercise/{exercise_sub}/participants";
    $params = [$matches[1]];
}

if (preg_match('#^/v1/exercise/([^/]+)/participant/([^/]+)$#', $path, $matches)) {
    $routeKey = "$method /v1/exercise/{exercise_sub}/participant/{user_sub}";
    $params = [$matches[1], $matches[2]];
}

if (preg_match('#^/v1/user/([^/]+)/push$#', $path, $matches)) {
    $routeKey = "$method /v1/user/{user_sub}/push";
    parse_str(file_get_contents("php://input"), $pushParams);
    $params = [$matches[1], $pushParams];
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

if (preg_match('#^/v1/user/([^/]+)/note$#', $path, $matches)) {
    $routeKey = "$method /v1/user/{user_sub}/note";
    parse_str(file_get_contents("php://input"), $noteParams);
    $params = [$matches[1], $noteParams];
}

/**
 * @brief Main routing switch. Matches routeKey and calls the corresponding controller function.
 */
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

    case 'GET /v1/exercise/{exercise_sub}/participants':
        callController('controllers/ExercisesController.php', 'getExerciseParticipants', $params);
        break;

    case 'GET /v1/exercise/{exercise_sub}/participant/{user_sub}':
        callController('controllers/ExercisesController.php', 'getExerciseParticipantByUser', $params);
        break;

    case 'POST /v1/users/new':
        callController('controllers/UsersController.php', 'createUser', [
            $_POST['academic_id'] ?? null,
            $_POST['exercise_id'] ?? null
        ]);
        break;

    case 'POST /v1/user/{user_sub}/push':
        callController('controllers/UsersController.php', 'pushContent', $params);
        break;

    case 'DELETE /v1/user/{user_sub}/delete':
        callController('controllers/UsersController.php', 'deleteUser', $params);
        break;

    case 'GET /v1/user/{user_sub}/info':
        callController('controllers/UsersController.php', 'getUserInfo', $params);
        break;

    case 'POST /v1/user/{user_sub}/note':
        callController('controllers/UsersController.php', 'noteUser', $params);
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
        break;
}
