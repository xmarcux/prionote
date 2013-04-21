<?php
    include_once '/home/macmarcu/public_html/prionote/server/include/magicquotes.inc.php';
    include_once '/home/macmarcu/public_html/prionote/server/include/db.inc.php';

if(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off'){
    header("content-type: application/json");
    $returnobj = new stdClass;

    if($error == ""){
        include_once '/home/macmarcu/public_html/prionote/server/include/verifyuser.inc.php';

        if($userobj->mail == -3){
            $returnobj->error = "User is not logged in";
    	}
        if($userobj->mail == -2){
            $returnobj->error = "An email not recieved";
    	}
        else if($userobj->mail == -1){
            $returnobj->error = "Error fetching email from db.";
        }
        else if(!$userobj->mail){
            // If mail does not exist, return a -1 to client
            $returnobj->notes = -1;
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
		$row = mysqli_fetch_array($resultLastNote);
                $returnobj->lastNote =  $row['createId'];
            }
        }
    }
    else{
        $returnobj->error = $error;
    }
    echo $_GET['callback'] . '(' . json_encode($returnobj) . ')';
    exit();
}
?>
