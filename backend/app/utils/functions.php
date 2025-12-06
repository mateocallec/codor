<?php
/**
 * @file functions.php
 * @brief Utility functions for random string generation and file-based storage.
 */

/**
 * @brief Generates a cryptographically secure random string.
 *
 * @param int    $length     Length of the generated string
 * @param string $characters Set of characters used for generation
 *
 * @return string The generated random string
 */
function str_random(
    int $length = 16,
    string $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
): string {
    /** @var int $char_length Number of available characters */
    $char_length = strlen($characters);

    /** @var string $random_string Accumulator for generated string */
    $random_string = '';

    // Build the random string character by character
    for ($i = 0; $i < $length; $i++) {
        $random_index = random_int(0, $char_length - 1);
        $random_string .= $characters[$random_index];
    }

    return $random_string;
}

/**
 * @brief Creates or overwrites a file in a storage directory.
 *
 * Ensures the storage directory exists before writing the file.
 *
 * @param string $storage_id   Storage namespace (directory name)
 * @param string $file_name    File identifier (without extension)
 * @param string $file_content Content to write into the file
 *
 * @return bool True on success, false on failure
 */
function add_storage_file(
    string $storage_id,
    string $file_name,
    string $file_content
): bool {
    /** @var string $storage_dir Absolute path to storage directory */
    $storage_dir = "/storage/" . $storage_id;

    // Create storage directory if it does not exist
    if (!is_dir($storage_dir)) {
        if (!mkdir($storage_dir, 0755, true)) {
            error_log("Failed to create storage directory: " . $storage_dir);
            return false;
        }
    }

    /** @var string $file_path Absolute path to target file */
    $file_path = $storage_dir . "/" . $file_name . ".txt";

    // Write content to file
    $result = file_put_contents($file_path, $file_content);

    if ($result === false) {
        error_log("Failed to write content to file: " . $file_path);
        return false;
    }

    return true;
}

/**
 * @brief Deletes a file from storage.
 *
 * If the file does not exist, the function returns true.
 *
 * @param string $storage_id Storage namespace (directory name)
 * @param string $file_name  File identifier (without extension)
 *
 * @return bool True on success, false on failure
 */
function remove_storage_file(
    string $storage_id,
    string $file_name
): bool {
    /** @var string $file_path Absolute path of the file to delete */
    $file_path = "/storage/" . $storage_id . "/" . $file_name . ".txt";

    if (!file_exists($file_path)) {
        return true;
    }

    if (!unlink($file_path)) {
        error_log("Failed to delete file: " . $file_path);
        return false;
    }

    return true;
}

/**
 * @brief Reads a file from storage.
 *
 * @param string $storage_id Storage namespace (directory name)
 * @param string $file_name  File identifier (without extension)
 *
 * @return string|false File content on success, false on failure
 */
function read_storage_file(
    string $storage_id,
    string $file_name
): string|false {
    /** @var string $file_path Absolute path of the file to read */
    $file_path = "/storage/" . $storage_id . "/" . $file_name . ".txt";

    if (!is_readable($file_path)) {
        error_log("File not found or not readable: " . $file_path);
        return false;
    }

    $file_content = file_get_contents($file_path);

    if ($file_content === false) {
        error_log("Failed to read content from file: " . $file_path);
        return false;
    }

    return $file_content;
}
