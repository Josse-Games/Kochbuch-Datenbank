<?php
header('Content-Type: application/json');

try {
    $jsonInput = file_get_contents('php://input');
    $data = json_decode($jsonInput, true);

    if (!$data) {
        echo json_encode(['status' => 'error', 'message' => 'Keine Daten empfangen.']);
        exit;
    }

    $name          = $data['name'] ?? '';
    $personenanzahl = intval($data['personenanzahl'] ?? 1);
    $essensinfo         = $data['essensinfo'] ?? '';

    $db = new PDO('sqlite:Datenbank/Planung.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_TIMEOUT, 5); 

    $sql = "INSERT INTO Planung (name, personenanzahl, essensinfo) 
            VALUES (:name, :personenanzahl, :essensinfo)";
    
    $stmt = $db->prepare($sql);
    
    $stmt->execute([
        ':name'         => $name,
        ':personenanzahl' => $personenanzahl,
        ':essensinfo'         => $essensinfo,
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Erfolgreich gespeichert.']);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>