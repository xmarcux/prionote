$(document).ready(function(){
    $("#personaButton").removeClass("ui-link");
    $("#personaButton").click(personaLogin);

    isLoggedIn();

    $("#toggleSyncSwitch").change(function(){
	if($(this).val() == "off")
	    localStorage.setItem("sync", "false");
	else
	    localStorage.setItem("sync", "true");
    });

    navigator.id.watch({
	loggedInUser: localStorage.getItem("email"),
	onlogin: function(assertion){
	  $.ajax({
	      type: 'POST',
	      url: 'https://manu4.manufrog.com/~macmarcu/prionote/server/include/verifyuser.inc.php',
	      data: {assertion: assertion},
	      success: function(res, status, xhr) {
		  alert(res);
		  res = JSON.parse(res);
		  $("#personaButtonTxt").html("Sign out");
		  $("#toggleSyncSwitch").slider("enable");
		  $("#toggleSyncSwitch").val("on");
		  $("#toggleSyncSwitch").slider("refresh");
		  localStorage.setItem("sync", "true");
		  if((res.status == "okay") && (status == "success"))
		      localStorage.setItem("email", res.email);
		  alert(JSON.stringify(res));
		  alert(JSON.stringify(status));
		  alert(JSON.stringify(xhr));
		  alert(JSON.stringify(assertion));
	      },
	      error: function(xhr, status, err){
		  alert("Error login");
		  alert(JSON.stringify(xhr));
		  alert(JSON.stringify(status));
		  alert(JSON.stringify(err));
		  alert(JSON.stringify(assertion));
	      }
	  });  
	},
	onlogout: function(){
	    $.ajax({
		type: 'POST',
		url: 'https://manu4.manufrog.com/~macmarcu/prionote/server/include/verifyuser.inc.php',
		data: {logout: "true", user: localStorage.getItem("email")},
		success: function(res, status, xhr){
		    $("#personaButtonTxt").html("Sign in");
		    $("#toggleSyncSwitch").slider("disable");
		    $("#toggleSyncSwitch").val("off");
		    $("#toggleSyncSwitch").slider("refresh");
		    localStorage.removeItem("sync");
		    localStorage.removeItem("email");
		    alert(JSON.stringify(res));
		    alert(JSON.stringify(status));
		    alert(JSON.stringify(xhr));
		},
		error: function(xhr, status, err){
		    alert("Logout fail!");
		    alert(JSON.stringify(xhr));
		    alert(JSON.stringify(status));
		    alert(JSON.stringify(err));
		}
	    });
	}
    });
});

function personaLogin(){
    if($("#personaButtonTxt").html() == "Sign out"){
	navigator.id.logout();
    }
    else{
	navigator.id.request();
    }
}

function isLoggedIn(){
    if(localStorage.getItem("email")){
	var mail = localStorage.getItem("email");
	if(mail.length > 1){
	    //test
	    //	navigator.id.request();
	    $.ajax({
		type: 'POST',
		url: 'https://manu4.manufrog.com/~macmarcu/prionote/server/include/verifyuser.inc.php',
		data: {email: mail, loggedIn: "?"},
		success: function(res, status, xhr){
		    alert(JSON.stringify(res));
		    alert(JSON.stringify(status));
		    alert(JSON.stringify(xhr));
		},
		error: function(xhr, status, err){
		    alert(JSON.stringify(xhr));
		    alert(JSON.stringify(status));
		    alert(JSON.stringify(err));
		}
	    });

	    if(localStorage.getItem("sync") == "true"){
		alert("Sync is on");
		$("#toggleSyncSwitch").val("on");
	    }
	}
    }
}