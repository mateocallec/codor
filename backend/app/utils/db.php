<?php
/**
 * @file db.php
 * @brief Database connection initialization using PDO.
 */

global $db;

/**
 * @var PDO $db
 * @brief Global PDO database connection instance.
 *
 * The connection parameters are read from environment variables:
 * - DB_NAME
 * - DB_HOST
 * - DB_USER
 * - DB_PASSWORD
 */
$db = new PDO(
    "mysql:dbname={$_ENV['DB_NAME']};host={$_ENV['DB_HOST']};",
    $_ENV['DB_USER'],
    $_ENV['DB_PASSWORD']
);

/**
 * @brief Configure PDO to throw exceptions on errors.
 */
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

/**
 * @brief Configure default fetch mode to return results as objects.
 */
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
