<?php
    /* $user->mail is 0 if user does not exist.
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

	    $sql_exist = "SELECT id FROM user WHERE mail='$mail';";
	    $result_exist = mysqli_query($link, $sql_exist);
	    if(!$result_exist){
		$result->error = "Could not read from database.";
	    }
	    else if(mysqli_num_rows($result_exist) == 0){
	    	 $sql_new_user = "INSERT INTO user (loggedIn, mail) VALUES ('$assert', '$mail');";
		 if(!mysqli_query($link, $sql_new_user)){
		     $result->error = "Could not insert new user in database.";
		 }
	    }
	    else{
		$sql_logged_in = "UPDATE user SET loggedIn='$assert' WHERE mail='$mail';";
		if(!mysqli_query($link, $sql_logged_in)){
		    $result->error = "Could not update assertion.";
		}
	    }
	}

    	echo json_encode($result);
    }
    else if(isset($_POST['logout']) && isset($_POST['user'])){
    	 $mail = mysqli_real_escape_string($link, $_POST['user']);
    	 $sql_logout = "UPDATE user SET loggedIn='false' WHERE mail='$mail';";
    	 if(!mysqli_query($link, $sql_logout)){
	     return "Error: Could not update database logout.";
	 }
	 echo "LoggedOut";
    }
    else{
      if(isset($_POST['email']) || isset($_GET['email'])){
        if(isset($_POST['email'])){
	    $userobj->mail = mysqli_real_escape_string($link, $_POST['email']);
	}
	else{
	    $userobj->mail = mysqli_real_escape_string($link, $_GET['email']);
	}
	$userobj->mail = urldecode($userobj->mail);
	$sql_mail = "SELECT id, loggedIn FROM user WHERE mail='$userobj->mail';";
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
	    if($assert != "false"){
		//if user exists and is logged in set $user->id to fetched user id
		//$userobj->id = mysqli_fetch_array($result_mail);
		if(isset($_POST['loggedIn']) && $_POST['loggedIn'] == "?"){
		    echo '{"loggedIn": "true"}';
		}
		else{
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
?>