<?php
    /* $userobj->mail is 0 if user does not exist.
     * -1 if error in database occurred.
     * -2 if an email is not recieved.
     * and contains the mail address if ok.
     */

include_once '/home/macmarcu/public_html/prionote/server/include/magicquotes.inc.php';
include_once '/home/macmarcu/public_html/prionote/server/include/db.inc.php';

if(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off'){
    $userobj = new stdClass;
    $userobj->mail = -2;

    if(isset($_POST['assertion'])){

	$assert = filter_input(
    	    INPUT_POST,
    	    'assertion',
    	    FILTER_UNSAFE_RAW,
    	    FILTER_FLAG_STRIP_LOW|FILTER_FLAG_STRIP_HIGH
	);

        $url = "https://verifier.login.persona.org/verify";

	$params = 'assertion=' . urlencode($assert) . '&audience=' .
               	  urlencode('https://manu4.manufrog.com/~macmarcu:443');
        $ch = curl_init();

    	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_POST, 2);
    	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    	$result = curl_exec($ch);
	$result = json_decode($result);
    	curl_close($ch);

	if($result->{'status'} == 'okay'){
	    $mail = mysqli_real_escape_string($link, $result->{'email'});
	    $assert = mysqli_real_escape_string($link, $assert);
	    $verify = crypt(time() . "prionote018152356", $assert);//verify

	    $sql_exist = "SELECT id FROM base_user WHERE mail='$mail';";//verify
	    $result_exist = mysqli_query($link, $sql_exist);
	    if(!$result_exist){
		$result->error = "Could not read from database.";
	    }
	    else if(mysqli_num_rows($result_exist) == 0){
	    	 $sql_base_user = "INSERT INTO base_user (mail) VALUES ('$mail');";
		 if(!mysqli_query($link, $sql_base_user)){
		     $result->error = "Can not create new user.";
		 }
	    }

	    $user_id = -1;
	    $sql_base_exist = "SELECT id FROM base_user WHERE mail='$mail';";
	    $result_base_exist = mysqli_query($link, $sql_base_exist);
	    if(!$result_base_exist){
	        $result->error = "Can not get id from base_user";
	    }
	    else{
		$db_result_id_base = mysqli_fetch_array($result_base_exist);
		$user_id = $db_result_id_base['id'];
	    }
//Change so user table is searched if it is more then 5 and 
//in that case set id to $user_id.
//update logout and the rest for nre base_user table.
	    $sql_num_rows = "SELECT verify FROM user WHERE id='$user_id';";
	    $result_num_rows = mysqli_query($link, $sql_num_rows);
	    if(!$result_num_rows){
		$result->error = "Could not read from user table.";
	    }
	    else if((mysqli_num_rows($result_num_rows) <= 5) && $user_id != -1){//verify == 0
	    	 $sql_new_user = "INSERT INTO user (loggedIn, id, verify) VALUES ('$assert', '$user_id', '$verify');";//verify
		 if(!mysqli_query($link, $sql_new_user)){
		     $result->error = "Could not insert new user in database.";
		 }
		 else{//verify
		     $sql_id_new_user = "SELECT tableId FROM user WHERE verify='$verify';";
		     $result_id_new = mysqli_query($link, $sql_id_new_user);
		     if(!$result_id_new){
			$result->error = "Could not read newly created user.";
		     }
		     else{
		        $result->verify = $verify;
//verify			$db_result_id_new = mysqli_fetch_array($result_id_new);
//verify			$tableId = $db_result_id_new['tableId'];
//verify			if(!$tableId){
//verify			    $result->error = "Could not get tableId from newly created user";
//verify			}
//verify			else{
//verify			    $sql_update_new_id = "UPDATE user SET id='$tableId' WHERE mail='$mail' AND verify='$verify';";
//verify			    if(!mysqli_query($link, $sql_update_new_id)){
//verify			        $result->error = "Could not update newly created user";
//verify			    }
//verify			    else{
//verify				$result->verify = $verify;
//verify			    }
//verify			}
		     }
		 }
	    }
	    else{
		$result->error = "Maximum number of syncs is reached: 5";//verify
//verify		$sql_logged_in = "UPDATE user SET loggedIn='$assert' WHERE mail='$mail';";
//verify		if(!mysqli_query($link, $sql_logged_in)){
//verify		    $result->error = "Could not update assertion.";
//verify		}
	    }
	}

    	echo json_encode($result);
    }
    else if(isset($_POST['logout']) && isset($_POST['user'])){
    	 $mail = mysqli_real_escape_string($link, $_POST['user']);
	 $verify = mysqli_real_escape_string($link, $_POST['verify']); //verify
//verify    	 $sql_logout = "UPDATE user SET loggedIn='false' WHERE mail='$mail';";
//verify    	 $sql_logout = "UPDATE user SET loggedIn='false', verify='false' WHERE mail='$mail';";
	 $sql_logout = "DELETE FROM user WHERE verify='$verify';";//verify
    	 if(!mysqli_query($link, $sql_logout)){
	     return "Error: Could not update database logout.";
	 }
	 echo "LoggedOut";
    }
    else{
      if((isset($_POST['email']) || isset($_GET['email'])) &&
      	 (isset($_POST['verify']) || isset($_GET['verify']))){//verify
        if(isset($_POST['email'])){
	    $userobj->mail = mysqli_real_escape_string($link, $_POST['email']);
	}
	else{
	    $userobj->mail = mysqli_real_escape_string($link, $_GET['email']);
	}
	if(isset($_POST['verify'])){//verify
	    $verify = mysqli_real_escape_string($link, $_POST['verify']);
	}
	else{//verify
	    $verify = mysqli_real_escape_string($link, $_GET['verify']);
	}
	$userobj->mail = urldecode($userobj->mail);
	$sql_mail = "SELECT id, loggedIn FROM user WHERE verify='$verify';";//verify
	$result_mail = mysqli_query($link, $sql_mail);
	if(!$result_mail){
	    $userobj->mail = -1;
	}
	else if(mysqli_num_rows($result_mail) == 0){
	    $userobj->mail = 0;
	}
	else{
	    $db_result = mysqli_fetch_array($result_mail);
	    $url = "https://verifier.login.persona.org/verify";
    	    $assert = $db_result['loggedIn'];
/*
	    $params = 'assertion=' . urlencode($assert) . '&audience=' .
               	      urlencode('https://manu4.manufrog.com/~macmarcu:443');
            $ch = curl_init();

    	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	    curl_setopt($ch, CURLOPT_POST, 2);
    	    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    	    $result = curl_exec($ch);
	    //test
	    echo $result;
	    $result = json_decode($result);
    	    curl_close($ch);

	    if($result->{'status'} == "okay"){
*/
	    //test
	    if($assert != "false" && isset($assert)){
		//if user exists and is logged in set $user->id to fetched user id
		//$userobj->id = mysqli_fetch_array($result_mail);
		if(isset($_POST['loggedIn']) && $_POST['loggedIn'] == "?"){
		    echo '{"loggedIn": "true"}';
		}
		else{
		    $verify = crypt(time() . "prionote018152356", $assert);
		    $sql_verify = "UPDATE user SET verify='$verify' WHERE loggedIn='$assert';";
		    if(mysqli_query($link, $sql_verify)){
		        $userobj->verify = $verify;
		    }

	    	    $userobj->id = $db_result['id'];
		    $userobj->mail = 'OK';
		}

	    	// Set cookie to verify login
	    	//$timeout = time() + 60 * 60 * 24 * 7;
	    	//setcookie('loggedin', $userobj->id, $timeout);
	    }
	    else{
		$userobj->mail = -3;
	    }
	}
      }
    }
}

function newVerify($assert){
    $verify = crypt(time() . "prionote018152356", $assert);
    $sql_verify = "UPDATE user SET verify='$verify' WHERE loggedIn='$assert';";
    if(!mysqli_query($link, $sql_verify)){
        return -1;
    }
    else{
        return $verify;
    }
}
?>