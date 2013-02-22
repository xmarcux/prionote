<?php

$link = mysqli_connect('localhost', $user, $pword);

if(!$link){
    $error = "Could not connect to sql";
    include $_SERVER['DOCUMENT_ROOT'] . "include/error.inc.html.php";
    exit();
}

if(!mysqli_set_charset($link, 'utf8')){
    $error = "Could not set charset on sql.";
    include $_SERVER['DOCUMENT_ROOT'] . "include/error.inc.html.php";
    exit();
}

if(!mysqli_select_db($link, $database)){
    $error = "Could not select database.";
    include $_SERVER['DOCUMENT_ROOT'] . "include/error.inc.html.php";
    exit();
}
?>
