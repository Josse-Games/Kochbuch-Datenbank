<?php
if (!isset($_COOKIE['loggedIN']) || $_COOKIE['loggedIN'] !== '1') {
    http_response_code(401);
    exit();
}
else{
    http_response_code(200);
    exit();
}
