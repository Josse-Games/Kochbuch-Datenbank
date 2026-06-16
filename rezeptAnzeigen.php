<?php
header('Content-Type: application/json');

try {
    $db = new PDO('sqlite:Datenbank/Rezepte.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM rezepte ORDER BY rowid DESC"; 
    $stmt = $db->query($sql);
    $rezepte = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $rezepte]);

} catch (Throwable $e) {
    echo json_encode(['status' => 'error', 'message' => 'Fehler beim Laden: ' . $e->getMessage()]);
}
?>