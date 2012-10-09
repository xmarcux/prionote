function init(){
    var saveButton = document.getElementById("save_button");
    var cancelButton = document.getElementById("cancel_button");

    saveButton.onclick = saveButtonClicked;
    cancelButton.onclick = cancelButtonClicked;

    var select = document.getElementById("prio_select");
    if(sessionStorage.currentPrio == "medium")
	select.selectedIndex = 1;
    else if(sessionStorage.currentPrio == "low")
	select.selectedIndex = 2;
    else if(sessionStorage.currentPrio == "none")
	select.selectedIndex = 3;

    var header = document.getElementsByTagName("header")[0];
    var footer = document.getElementsByTagName("footer")[0];
    var prioSelect = document.getElementById("select_prio");
    var textarea = document.getElementById("textarea");

    prioSelect.style.paddingTop = header.scrollHeight + "px";

    var height = window.innerHeight;
    height -= (header.scrollHeight + footer.scrollHeight + prioSelect.scrollHeight + 2);
    textarea.style.height = height + "px";
}

function saveButtonClicked(){
    var text = document.getElementById("textarea").value;

    if(text.length > 0){
	var time = new Date();
	time = time.getTime();
	var selectedPrio = document.getElementById("prio_select").selectedIndex;
	var notes;

	if(selectedPrio == 0){
	    sessionStorage.currentPrio = "high";
	}
	else if(selectedPrio == 1){
	    sessionStorage.currentPrio = "medium";
	}
	else if(selectedPrio == 2){
	    sessionStorage.currentPrio = "low";
	}
	else{
	    sessionStorage.currentPrio = "none";
	}

	if(!localStorage.getItem(sessionStorage.currentPrio + "Notes"))
	    notes = new Array();
	else{
	    notes = localStorage.getItem(sessionStorage.currentPrio + "Notes");
	    notes = JSON.parse(notes);
	}

	notes.push(new Note(time, text, time));

	localStorage.setItem(sessionStorage.currentPrio + "Notes", 
			     JSON.stringify(notes));

	window.location = "index.html";
    }
    else
	alert("There is no text,\nplease enter text and save again!");
}

function cancelButtonClicked(){
    window.location = "index.html";
}

window.onload = init;