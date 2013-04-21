<?php
    include_once '/home/macmarcu/public_html/prionote/server/include/magicquotes.inc.php';
    include_once '/home/macmarcu/public_html/prionote/server/include/db.inc.php';

if(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off'){
    header("content-type: application/json");
    $returnobj = new stdClass;

    if($error == ""){
        include_once '/home/macmarcu/public_html/prionote/server/include/verifyuser.inc.php';

        if(isset($_GET['deleteNotes'])){
	    $delete = json_decode($_GET['deleteNotes'], true);

	    if($userobj->mail == 'OK'){
	        $userid = $userobj->id;

	        foreach($delete as $del){
	            $sql_del = "DELETE FROM notes WHERE userId='$userid' AND createId='$del';";
		    if(!$result_del = mysqli_query($link, $sql_del)){
		        $returnobj->error = "Could not delete note.";
		    }
		    else{
		        $returnobj->delete = 'OK';
		    }
	        }
	    }
        }

        $notes;
        if(isset($_GET['notes'])){
	    $notes = json_decode($_GET['notes'], true);

	    if($userobj->mail == 'OK'){
	        $userid = $userobj->id;

	        foreach($notes as $note){
	            $number = mysqli_real_escape_string($link, $note['number']);
		    $editDate = mysqli_real_escape_string($link, $note['editDate']);
		    $text = mysqli_real_escape_string($link, $note['text']);
		    $prio = mysqli_real_escape_string($link, $note['prio']);

		    // Check if it exists in db if it does delete exixistng note and insert new
		    $sql_exists = "SELECT * FROM notes WHERE createId='$number' AND userId='$userid';";
		    $result_exists = mysqli_query($link, $sql_exists);
		    if(!$result_exists){
		        $returnobj->error = "Could not select duplicates from notes table.";
		    }
		    else if(mysqli_num_rows($result_exists) > 0){
		        while($row = mysqli_fetch_array($result_exists)){
		            $createid = $row['createId'];
		            $sql_delete = "DELETE FROM notes WHERE createId='$createid' AND userId='$userid';";
			    if(!$result_del_exists = mysqli_query($link, $sql_delete)){
			        $returnobj->error = "Could not delete existing note from notes table.";
			    }
		        }
		    }

	            $sql_ins = "INSERT INTO notes (createId, edit, text, prio, userId)";
		    $sql_ins = $sql_ins . " VALUES ('$number', '$editDate', '$text', '$prio',  '$userid');";
		    if(!mysqli_query($link, $sql_ins)){
		        $returnobj->error = "Could not insert values in notes db: " . mysqli_error($link);
		    }
		    else{
		        $returnobj->insert = "OK";
		    }
	        }
    	    }
	    else{
	        $returnobj->error = "Could not verify user.";
	    }
        }
        else if(isset($_GET['lastNote']) && $_GET['lastNote'] == 0){
            if($userobj->mail == 'OK'){
                $sql_all = "SELECT * FROM notes WHERE userId='$userobj->id';";
	        $result_all = mysqli_query($link, $sql_all);
	        if(!$result_all){
	            $returnobj->error = "Could not select all note from db: " . mysqli_error($link);
	        }
	        else if(mysqli_num_rows($result_all) == 0){
	            $returnobj->notes = 0;
	        }
	        else{
	            while($row = mysqli_fetch_array($result_all)){
		        $returnobj->notes[] = array("number" => $row['createId'], "editDate" => $row['edit'], 
		            "text" => $row['text'], "prio" => $row['prio']);
		    }
	        }
	    }
	    else{
	        $returnobj->error = "Could not verify user.";
	    }
        }
        else if(isset($_GET['lastNote'])){
            if($userobj->mail == 'OK'){
	        $lastNote = mysqli_real_escape_string($link, $_GET['lastNote']);
	        //$sql_larger = "SELECT * FROM notes WHERE userId='$userobj->id' AND createId>'$lastNote';";
	        $sql_larger = "SELECT * FROM notes WHERE userId='$userobj->id' AND edit>'$lastNote';";
	        $result_larger = mysqli_query($link, $sql_larger);
	        if(!$result_larger){
	            $returnobj->error = "Could not select notes larger then...";
	        }
	        else if(mysqli_num_rows($result_larger) == 0){
	            $returnobj->notes = 0;
	        }
	        else{
	            while($row = mysqli_fetch_array($result_larger)){
		        $returnobj->notes[] = array("number" => $row['createId'], "editDate" => $row['edit'],
		            "text" => $row['text'], "prio" => $row['prio']);
		    }
	        }
	    }
	    else{
	        $returnobj->error = "Could not verify user";
	    }
        }
    }
    else{
        $returnobj->error = $error;
    }
    echo $_GET['callback'] . '(' . json_encode($returnobj) . ')';
}
?>