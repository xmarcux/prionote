<?php
if(isset($_GET['username']) && isset($_GET['password'])){
    $username = $_GET['username'];
    $password = $_GET['password'];

    include_once 'db.inc.php';

    $sqlq_pass = 'SELECT id, pword FROM user WHERE uname="' . $username .'";';

    $result = mysqli_query($link, $sqlq_pass);
    
    if(!$result){
        echo  "Could not query user table.";
	exit();
    }

    $row = mysqli_fetch_array($result);
    if($row['pword'] != $password){
        echo "Password is wrong." . $row['pword'];
	exit();
    }

    // Password match.
    // Get latest edit date
    $sqlq_createId = 'SELECT createId FROM notes WHERE userId=' . $row['id'] .
    "order by createId desc limit 1;";
    $sqlq_edit = 'SELECT edit FROM notes WHERE userId=' . $row['id'] .
    "order by edit desc limit 1;";
    
    $result_createId = mysqli_query($link, $sqlq_createId);
    $result_edit = mysqli_query($link, $sqlq_edit);

    echo mysqli_fetch_array($result_createId)['createId'] . ", ";
    echo mysqli_fetch_array($result_edit)['edit'];

    exit();
}

echo "Username and password is not in the url";

?>