<?php
if(get_magic_quotes_gpc()){
    function striplashes_deep($value){
        $value = is_array($value) ?
	    array_map('striplashes_deep', $value) :
	    striplashes($value);

	return $value;
    }

    $_POST = array_map('striplashes_deep', $_POST);
    $_GET = array_map('striplashes_deep', $_GET);
    $_COOKIE = array_map('striplashes_deep', $_COOKIE);
    $_REQUEST = array_map('striplashes_deep', $_REQUEST);
}
?>