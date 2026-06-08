<?php
setcookie("loggedIN", "1", [
    'expires' => time() + 36000,
    'path' => '/',
    'samesite' => 'Lax'
]);
exit();