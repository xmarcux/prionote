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
		  res = JSON.parse(res);
		  $("#personaButtonTxt").html("Sign out");
		  $("#toggleSyncSwitch").slider("enable");
		  $("#toggleSyncSwitch").val("on");
		  $("#toggleSyncSwitch").slider("refresh");
		  localStorage.setItem("sync", "true");
		  if((res.status == "okay") && (status == "success")){
		      localStorage.setItem("email", res.email);
		      localStorage.setItem("verify", res.verify);
		  }
	      },
	      error: function(xhr, status, err){
		  alert("Error login");
	      }
	  });  
	},
	onlogout: function(){
	    $.ajax({
		type: 'POST',
		url: 'https://manu4.manufrog.com/~macmarcu/prionote/server/include/verifyuser.inc.php',
		data: {logout: "true", user: localStorage.getItem("email"),
		       verify: localStorage.getItem("verify")},
		success: function(res, status, xhr){
		    $("#personaButtonTxt").html("Sign in");
		    $("#toggleSyncSwitch").slider("disable");
		    $("#toggleSyncSwitch").val("off");
		    $("#toggleSyncSwitch").slider("refresh");
		    localStorage.removeItem("sync");
		    localStorage.removeItem("email");
		    localStorage.removeItem("verify");
		},
		error: function(xhr, status, err){
		    alert("Logout fail!");
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
    if(localStorage.getItem("email") && localStorage.getItem("verify")){//verify
	var mail = localStorage.getItem("email");
	var verify = localStorage.getItem("verify");//verify
	if(mail.length > 1){
	    $.ajax({
		type: 'POST',
		url: 'https://manu4.manufrog.com/~macmarcu/prionote/server/include/verifyuser.inc.php',
		data: {email: mail, loggedIn: "?", verify: verify},
		success: function(res, status, xhr){
		    res = JSON.parse(res);
		    if(res.loggedIn == "true"){
			$("#personaButtonTxt").html("Sign out");
			$("#toggleSyncSwitch").slider("enable");

		    }
		},
		error: function(xhr, status, err){
		    alert("Error: " + err);
		}
	    });

	    if(localStorage.getItem("sync") == "true"){
		$("#toggleSyncSwitch").val("on");
		$("#toggleSyncSwitch").slider("refresh");
	    }
	}
    }
}