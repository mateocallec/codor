<?php

function str_random(int $length = 16, string $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string
{
    $char_length = strlen($characters);
    $random_string = '';

    for ($i = 0; $i < $length; $i++) {
        $random_index = random_int(0, $char_length - 1);
        $random_string .= $characters[$random_index];
    }

    return $random_string;
}

function add_storage_file(string $storage_id, string $file_name, string $file_content): bool {
    $storage_dir = "/storage/" . $storage_id;

    if (!is_dir($storage_dir)) {
        if (!mkdir($storage_dir, 0755, true)) {
            error_log("Failed to create storage directory: " . $storage_dir);
            return false;
        }
    }

    $file_path = $storage_dir . "/" . $file_name . ".txt";

    $result = file_put_contents($file_path, $file_content);

    if ($result === false) {
        error_log("Failed to write content to file: " . $file_path);
        return false;
    }

    return true;
}

function remove_storage_file(string $storage_id, string $file_name): bool {
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

function read_storage_file(string $storage_id, string $file_name): string|false {
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
