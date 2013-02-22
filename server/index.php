<?php
    include_once $_SERVER['DOCUMENT_ROOT'] . '/include/magicquotes.inc.php';
    include_once $_SERVER['DOCUMENT_ROOT'] . '/include/db.inc.php';
    include_once $_SERVER['DOCUMENT_ROOT'] . '/include/verifyuser.inc.php';

    header("content-type: application/json");

    $returnobj = new stdClass;
    if($userobj->mail == -2){
      $returnobj->error = "An email not recieved";
    }
    else if($userobj->mail == -1){
      $returnobj->error = "Error fetching email from db.";
    }
    else if(!$userobj->mail){
      // If mail does not exist, return a zero to client
      $returnobj->notes = 0;
    }
    else{
      $sql_note = "SELECT createId FROM notes WHERE userId='$userobj->id' ORDER BY createId DESC LIMIT 1;";
      $resultLastNote = mysqli_query($link, $sql_note);
      if(!$resultLastNote){
        $error = "Error fetching last note from database.";
        $returnobj->error = $error;
      }
      else if(mysqli_num_rows($resultLastNote) == 0){
        $returnobj->lastNote = 0;
      }
      else{
        $returnobj->lastNote =  mysqli_fetch_array($resultLastNote)[0];
      }
    }
    echo $_GET['callback'] . '(' . json_encode($returnobj) . ')';
    exit();
?>
