<?php

// Path demandé par le client (sans le nom de fichier réel)
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Nettoyage optionnel
$path = rtrim($path, '/');
$path = $path === '' ? '/' : $path;

echo $path;
