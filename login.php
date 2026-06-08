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

$salt = "c5ae78705c1d94be8ecd8931e55f29d2";
$saltBytes = hex2bin($salt);

$passwordHASH = "ed2068fa9d3063f3b964677ac4236b2d4f15d1bccc21028b7aeadfddc9cc3bd568fe9fb344d735c81c517af02421194cc11fbf1d485ad36529a3643061eebad0";
$passwordBytes = hex2bin($passwordHASH);

$hash = hash_pbkdf2("sha512", $enteredPassword, $saltBytes, 100000, 64, true);

if (hash_equals($passwordBytes, $hash)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Falsches Passwort"]);
}
exit;