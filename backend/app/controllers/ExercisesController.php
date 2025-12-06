<?php
// controllers/ExercisesController.php

require_once __DIR__ . '/../utils/db.php';

function createExercise($content) {
    global $db;

    if (!$content) {
        http_response_code(400);
        echo json_encode(["error" => "Content is required"]);
        return;
    }

    $sub = bin2hex(random_bytes(8)); // identifiant unique pour l'exercise
    $creation_time = time();

    $stmt = $db->prepare("INSERT INTO exercises (sub, creation_time) VALUES (:sub, :creation_time)");
    $stmt->execute([
        ':sub' => $sub,
        ':creation_time' => $creation_time
    ]);

    echo json_encode([
        "sub" => $sub,
        "creation_time" => $creation_time,
        "content" => $content
    ]);
}

function getExerciseInfo($exercise_sub) {
    global $db;

    $stmt = $db->prepare("SELECT * FROM exercises WHERE sub = :sub");
    $stmt->execute([':sub' => $exercise_sub]);
    $exercise = $stmt->fetch();

    if (!$exercise) {
        http_response_code(404);
        echo json_encode(["error" => "Exercise not found"]);
        return;
    }

    echo json_encode($exercise);
}

function updateExercise($exercise_sub, $data) {
    global $db;

    // Ici on ne met à jour que ce qui existe. Pour l'instant, aucune colonne 'content' dans la table, donc on laisse vide
    // Tu peux adapter selon les colonnes que tu ajoutes plus tard
    http_response_code(200);
    echo json_encode(["message" => "Update not implemented yet for exercise $exercise_sub", "data" => $data]);
}

function deleteExercise($exercise_sub, $params = []) {
    global $db;

    $stmt = $db->prepare("DELETE FROM exercises WHERE sub = :sub");
    $stmt->execute([':sub' => $exercise_sub]);

    echo json_encode(["message" => "Exercise $exercise_sub deleted"]);
}

function getExerciseReturns($exercise_sub) {
    global $db;

    // Retourne tous les utilisateurs associés à l'exercise
    $stmt = $db->prepare("SELECT * FROM users WHERE exercise_id = (SELECT id FROM exercises WHERE sub = :sub)");
    $stmt->execute([':sub' => $exercise_sub]);
    $users = $stmt->fetchAll();

    echo json_encode($users);
}

function getExerciseReturnByUser($exercise_sub, $user_sub) {
    global $db;

    $stmt = $db->prepare("
        SELECT u.* 
        FROM users u
        JOIN exercises e ON u.exercise_id = e.id
        WHERE e.sub = :exercise_sub AND u.sub = :user_sub
    ");
    $stmt->execute([
        ':exercise_sub' => $exercise_sub,
        ':user_sub' => $user_sub
    ]);

    $result = $stmt->fetch();

    if (!$result) {
        http_response_code(404);
        echo json_encode(["error" => "Return not found for user $user_sub"]);
        return;
    }

    echo json_encode($result);
}
