<?php
// controllers/UsersController.php

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../utils/functions.php';

/**
 * Crée un nouvel utilisateur
 * @param int $academic_id
 * @param string $exercise_id (sub de l'exercise)
 */
function createUser($academic_id, $exercise_sub) {
    global $db;

    if (!$academic_id || !$exercise_sub) {
        http_response_code(400);
        echo json_encode(["error" => "academic_id and exercise_sub are required"]);
        return;
    }

    // Vérifie que l'exercise existe
    $stmt = $db->prepare("SELECT id FROM exercises WHERE sub = :sub");
    $stmt->execute([':sub' => $exercise_sub]);
    $exercise = $stmt->fetch();

    if (!$exercise) {
        http_response_code(404);
        echo json_encode(["error" => "Exercise not found"]);
        return;
    }

    $exercise_id = $exercise->id;
    $sub = bin2hex(random_bytes(8)); // identifiant unique pour l'utilisateur
    $creation_time = time();

    $stmt = $db->prepare("
        INSERT INTO users (sub, exercise_id, creation_time, academic_id)
        VALUES (:sub, :exercise_id, :creation_time, :academic_id)
    ");

    $stmt->execute([
        ':sub' => $sub,
        ':exercise_id' => $exercise_id,
        ':creation_time' => $creation_time,
        ':academic_id' => $academic_id
    ]);

    echo json_encode([
        "sub" => $sub,
        "exercise_sub" => $exercise_sub,
        "academic_id" => $academic_id,
        "creation_time" => $creation_time
    ]);
}

/**
 * Supprime un utilisateur par sub
 * @param string $user_sub
 */
function deleteUser($user_sub, $params = []) {
    global $db;

    $stmt = $db->prepare("DELETE FROM users WHERE sub = :sub");
    $stmt->execute([':sub' => $user_sub]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        return;
    }

    echo json_encode(["message" => "User $user_sub deleted"]);
}

/**
 * Récupère les informations d'un utilisateur
 * @param string $user_sub
 */
function getUserInfo($user_sub) {
    global $db;

    $stmt = $db->prepare("SELECT * FROM users WHERE sub = :sub");
    $stmt->execute([':sub' => $user_sub]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        return;
    }

    echo json_encode($user);
}
