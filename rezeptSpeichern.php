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
    $schwierigkeit = $data['schwierigkeit'] ?? 'Einfach';
    $dauer         = $data['dauer'] ?? '';
    $personen      = intval($data['personen'] ?? 1);
    $zutaten       = $data['zutaten'] ?? '';
    $text          = $data['text'] ?? '';
    $ersteller          = $data['ersteller'] ?? '';

    $db = new PDO('sqlite:Datenbank/Rezepte.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_TIMEOUT, 5); 

    $sql = "INSERT INTO rezepte (Rezeptname, Schwierigkeit, Dauer, Personenanzahl, Zutaten, Rezept, Ersteller) 
            VALUES (:Rezeptname, :Schwierigkeit, :Dauer, :Personenanzahl, :Zutaten, :Rezept, :Ersteller)";
    
    $stmt = $db->prepare($sql);
    
    $stmt->execute([
        ':Rezeptname'         => $name,
        ':Schwierigkeit' => $schwierigkeit,
        ':Dauer'         => $dauer,
        ':Personenanzahl'      => $personen,
        ':Zutaten'       => $zutaten,
        ':Rezept'  => $text,
        ':Ersteller'  => $ersteller
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Erfolgreich gespeichert.']);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>