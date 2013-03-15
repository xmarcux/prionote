<?php
    /* $user->mail is 0 if user does not exist.
     * -1 if error in database occurred.
     * -2 if an email is not recieved.
     * and contains the mail address if ok.
     */

    $userobj = new stdClass;
    $userobj->mail = -2;

    if(isset($_COOKIE['loggedin'])){
	$userobj->mail = 'OK';
	$userobj->id = mysqli_real_escape_string($link, $_COOKIE['loggedin']);
    }
    else{
      if(isset($_GET['email'])){
        $userobj->mail = mysqli_real_escape_string($link, $_GET['email']);
	$userobj->mail = urldecode($userobj->mail);
	$sql_mail = "SELECT id FROM user WHERE mail='$userobj->mail';";
	$result_mail = mysqli_query($link, $sql_mail);
	if(!$result_mail){
	    $userobj->mail = -1;
	}
	else if(mysqli_num_rows($result_mail) == 0){
	    $userobj->mail = 0;
	}
	else{
	    //if user exists set $user->id to fetched user id
	    $userobj->id = mysqli_fetch_array($result_mail);
	    $userobj->id = $userobj->id['id'];

	    // Set cookie to verify login
	    $timeout = time() + 60 * 60 * 24 * 7;
	    setcookie('loggedin', $userobj->id, $timeout);
	}
      }
    }
?>