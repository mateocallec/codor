<?php

$db = new PDO("mysql:dbname={$_ENV['DB_NAME']};host={$_ENV['DB_HOST']};", $_ENV['DB_USER'], $_ENV['DB_PASSWORD']);

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
