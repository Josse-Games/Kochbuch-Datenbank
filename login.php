<?php
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Ungültige Anfragemethode"]);
    exit;
}

$inputData = json_decode(file_get_contents("php://input"), true);
$enteredPassword = $inputData['password'] ?? '';

if (empty($enteredPassword)) {
    echo json_encode(["success" => false, "message" => "Kein Passwort übergeben"]);
    exit;
}

$salt = "61be90496ef5e0dbec0755c678e6dea7";
$saltBytes = hex2bin($salt);

$passwordHASH = "ac364ec2f6f44a130257aade473cb6aac7e0bac80bcda3203ed1b2d11a38fd4c1e554ba571dfa8f15226fb9cbb1e0e706358f3441f2569384e104084e70c1632";
$passwordBytes = hex2bin($passwordHASH);

$hash = hash_pbkdf2("sha512", $enteredPassword, $saltBytes, 100000, 64, true);

if (hash_equals($passwordBytes, $hash)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Falsches Passwort"]);
}
exit;