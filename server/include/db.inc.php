<?php

if(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off'){

    $link = mysqli_connect('localhost', $user, $pword);

    $error = "";
    if(!$link){
	$error = "Could not connect to sql";
    }

    if(!mysqli_set_charset($link, 'utf8')){
        $error = "Could not set charset on sql.";
    }

    if(!mysqli_select_db($link, $database)){
        $error = "Could not select database.";
    }
}
?>
