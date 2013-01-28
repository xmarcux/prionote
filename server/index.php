<?php
$database = "prionote";
$user = "php_user";
$pword = "php@milesdavis";

$link = mysqli_connect('localhost', $user, $pword);

if(!$link){
    $output = "Could not connect to sql";
    exit();
}

if(!mysqli_set_charset($link, 'utf8')){
    $output = "Could not set cahrset on sql.";
    exit();
}

if(!mysqli_select_db($link, $database)){
    $output = "Could not select database.";
    exit();
}

$output = "Connected to database";

?>
