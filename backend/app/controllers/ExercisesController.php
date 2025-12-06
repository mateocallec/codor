<?php
/**
 * @file ExercisesController.php
 * @brief Controller handling exercise-related operations.
 */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../utils/functions.php';

/**
 * @brief Creates a new exercise.
 *
 * Generates a unique exercise identifier, stores the exercise content,
 * and saves metadata in the database.
 *
 * @param string|null $content Optional content of the exercise
 *
 * @return void
 */
function createExercise($content) {
    global $db;

    // Generate a unique exercise sub identifier
    do {
        $sub = str_random(16);

        $stmt = $db->prepare("SELECT * FROM exercises WHERE sub = :sub");
        $stmt->execute([':sub' => $sub]);
    } while ($stmt->fetch());

    /** @var int $creation_time Unix timestamp of exercise creation */
    $creation_time = time();

    // Store exercise content
    if (!add_storage_file('exercises', $sub, (isset($content)) ? $content : "")) {
        http_response_code(400);
        echo json_encode(["error" => "An error occured"]);
        return;
    }

    // Insert exercise metadata into database
    $stmt = $db->prepare("INSERT INTO exercises (sub, creation_time) VALUES (:sub, :creation_time)");
    $stmt->execute([
        ':sub' => $sub,
        ':creation_time' => $creation_time
    ]);

    // Return exercise information
    echo json_encode([
        "sub" => $sub,
        "creation_time" => $creation_time
    ]);
}

/**
 * @brief Retrieves information about a specific exercise.
 *
 * Fetches exercise metadata from the database and loads
 * the associated content from storage.
 *
 * @param string $exercise_sub Exercise unique identifier
 *
 * @return void
 */
function getExerciseInfo($exercise_sub) {
    global $db;

    // Retrieve exercise from database
    $stmt = $db->prepare("SELECT * FROM exercises WHERE sub = :sub");
    $stmt->execute([':sub' => $exercise_sub]);
    $exercise = $stmt->fetch();

    if (!$exercise) {
        http_response_code(404);
        echo json_encode(["error" => "Exercise not found"]);
        return;
    }

    // Remove internal database ID from response
    unset($exercise->id);

    // Load exercise content from storage
    $exercise->content = read_storage_file('exercises', $exercise_sub);

    //if (!$exercise->content) {
    //    http_response_code(400);
    //    echo json_encode(["error" => "An error occured"]);
    //    return;
    //}

    echo json_encode($exercise);
}

/**
 * @brief Updates an existing exercise.
 *
 * Replaces the stored content of an exercise.
 *
 * @param string $exercise_sub Exercise unique identifier
 * @param array  $data Data containing the new exercise content
 *
 * @return void
 */
function updateExercise($exercise_sub, $data) {
    global $db;

    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Content is required"]);
        return;
    }

    // Update stored exercise content
    if (!add_storage_file('exercises', $exercise_sub, isset($data['content']) ? $data['content'] : "")) {
        http_response_code(400);
        echo json_encode(["error" => "An error occured"]);
        return;
    }

    http_response_code(200);
    echo json_encode(["message" => "Exercise $exercise_sub updated"]);
}

/**
 * @brief Deletes an exercise.
 *
 * Removes the exercise content from storage and deletes
 * the exercise entry from the database.
 *
 * @param string $exercise_sub Exercise unique identifier
 * @param array  $params Optional parameters (unused)
 *
 * @return void
 */
function deleteExercise($exercise_sub, $params = []) {
    global $db;

    // Remove content from storage
    remove_storage_file('exercises', $exercise_sub);

    // Delete exercise from database
    $stmt = $db->prepare("DELETE FROM exercises WHERE sub = :sub");
    $stmt->execute([':sub' => $exercise_sub]);

    echo json_encode(["message" => "Exercise $exercise_sub deleted"]);
}

/**
 * @brief Retrieves all participants of a specific exercise.
 *
 * Returns a list of user identifiers associated with an exercise.
 *
 * @param string $exercise_sub Exercise unique identifier
 *
 * @return void
 */
function getExerciseParticipants($exercise_sub) {
    global $db;

    // Fetch users associated with the exercise
    $stmt = $db->prepare("
        SELECT * FROM users 
        WHERE exercise_id = (SELECT id FROM exercises WHERE sub = :sub)
    ");
    $stmt->execute([':sub' => $exercise_sub]);
    $users = $stmt->fetchAll();

    $usersList = [];

    foreach ($users as $user) {
        $usersList[] = $user->sub;
    }

    echo json_encode($usersList);
}

/**
 * @brief Retrieves a participant's submission for a specific exercise.
 *
 * Fetches user information and loads the associated return content
 * from storage.
 *
 * @param string $exercise_sub Exercise unique identifier
 * @param string $user_sub User unique identifier
 *
 * @return void
 */
function getExerciseParticipantByUser($exercise_sub, $user_sub) {
    global $db;

    // Retrieve user linked to the exercise
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

    // Load user return content from storage
    $content = read_storage_file('returns', $user_sub);

    echo json_encode([
        'sub' => $result->sub,
        'academic_id' => $result->academic_id,
        'content' => $content ? $content : null,
    ]);
}
