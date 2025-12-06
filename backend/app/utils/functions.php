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
