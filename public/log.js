<?php
$loggerID = $_GET['loggerID'];

// Obtain the current website URL
$websiteURL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";

// Include log.js
echo '<script src="' . $websiteURL . '/public/log.js"></script>';

// Use log.js to get user data
$userData = '<script>getUserData()</script>';

// Send user data to server.js on the current website
$response = file_get_contents("$websiteURL/server.js?loggerID=$loggerID&userData=$userData");

// Retrieve redirect link from server
$redirectLink = json_decode($response, true)['redirectLink'];

// Redirect the user
header("Location: $redirectLink");
exit;
?>
