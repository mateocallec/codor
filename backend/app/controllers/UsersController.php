<?php
/**
 * @file UsersController.php
 * @brief Controller handling user-related operations.
 */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../utils/functions.php';

/**
 * @brief Creates a new user.
 *
 * Links a user to an existing exercise and assigns a unique user identifier.
 *
 * @param int    $academic_id Academic identifier of the user
 * @param string $exercise_sub Unique identifier (sub) of the exercise
 *
 * @return void
 */
function createUser($academic_id, $exercise_sub) {
    global $db;

    if (!$academic_id || !$exercise_sub) {
        http_response_code(400);
        echo json_encode(["error" => "academic_id and exercise_sub are required"]);
        return;
    }

    // Verify that the exercise exists
    $stmt = $db->prepare("SELECT id FROM exercises WHERE sub = :sub");
    $stmt->execute([':sub' => $exercise_sub]);
    $exercise = $stmt->fetch();

    if (!$exercise) {
        http_response_code(404);
        echo json_encode(["error" => "Exercise not found"]);
        return;
    }

    /** @var int $exercise_id Internal database ID of the exercise */
    $exercise_id = $exercise->id;

    // Generate a unique user sub identifier
    do {
        $sub = str_random(32);

        $stmt = $db->prepare("SELECT * FROM users WHERE sub = :sub");
        $stmt->execute([':sub' => $sub]);
    } while ($stmt->fetch());

    /** @var int $creation_time Unix timestamp of user creation */
    $creation_time = time();

    // Insert user into database
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

    // Return user information
    echo json_encode([
        "sub" => $sub,
        "exercise_sub" => $exercise_sub,
        "academic_id" => $academic_id,
        "creation_time" => $creation_time
    ]);
}

/**
 * @brief Publishes or updates a user's content submission.
 *
 * Stores user content in the returns storage.
 *
 * @param string $user_sub User unique identifier
 * @param array  $params   Data containing the content to publish
 *
 * @return void
 */
function pushContent($user_sub, $params = []) {
    global $db;

    if (!$params) {
        http_response_code(400);
        echo json_encode(["error" => "Content is required"]);
        return;
    }

    // Verify that the user exists
    $stmt = $db->prepare("SELECT id FROM users WHERE sub = :sub");
    $stmt->execute([':sub' => $user_sub]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        return;
    }

    // Store user content
    add_storage_file(
        'returns',
        $user_sub,
        (isset($params['content'])) ? $params['content'] : ""
    );

    echo json_encode(["message" => "Content of user $user_sub updated"]);
}

/**
 * @brief Deletes a user by its unique identifier.
 *
 * Removes the user entry from the database.
 *
 * @param string $user_sub User unique identifier
 * @param array  $params   Optional parameters (unused)
 *
 * @return void
 */
function deleteUser($user_sub, $params = []) {
    global $db;

    // Delete user from database
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
 * @brief Retrieves information about a user.
 *
 * Fetches all stored user data from the database.
 *
 * @param string $user_sub User unique identifier
 *
 * @return void
 */
function getUserInfo($user_sub) {
    global $db;

    // Retrieve user from database
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

/**
 * @brief Assigns a grade (note) to a user.
 *
 * Updates the user's note field in the database.
 *
 * @param string $user_sub User unique identifier
 * @param array  $params   Data containing the note value
 *
 * @return void
 */
function noteUser($user_sub, $params = []) {
    global $db;

    // Verify that the user exists
    $stmt = $db->prepare("SELECT id FROM users WHERE sub = :sub");
    $stmt->execute([':sub' => $user_sub]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        return;
    }

    // Update user note
    $stmt = $db->prepare("UPDATE users SET note = :note WHERE sub = :sub");
    $stmt->execute([
        ':note' => (isset($params['note'])) ? $params['note'] : "",
        ':sub' => $user_sub
    ]);

    echo json_encode(["message" => "User $user_sub noted"]);
}
