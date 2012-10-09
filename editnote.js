function init(){
    var saveButton = document.getElementById("save_button");
    var deleteButton = document.getElementById("delete_button");
    var cancelButton = document.getElementById("cancel_button");

    saveButton.onclick = saveButtonClicked;
    deleteButton.onclick = deleteButtonClicked;
    cancelButton.onclick = cancelButtonClicked;

    var select = document.getElementById("prio_select");
    var editDate = document.getElementById("edit_date_label");
    var createDate = document.getElementById("created_label");
    var textarea = document.getElementById("textarea");
    var note = getNote();

    if(sessionStorage.currentPrio == "medium")
	select.selectedIndex = 1;
    else if(sessionStorage.currentPrio == "low")
	select.selectedIndex = 2;
    else if(sessionStorage.currentPrio == "none")
	select.selectedIndex = 3;

    var d = new Date(note.number);
    var dString = d.getFullYear() + "-";
    if(d.getMonth() < 9)
	dString += "0" + (d.getMonth()+1) + "-";
    else
	dString += (d.getMonth()+1) + "-";

    if(d.getDate() < 10)
	dString += "0" + d.getDate() + " ";
    else
	dString += d.getDate() + " ";

    if(d.getHours() < 10)
	dString += "0" + d.getHours() + ":";
    else
	dString += d.getHours() + ":";

    if(d.getMinutes() < 10)
	dString += "0" + d.getMinutes();
    else
	dString += d.getMinutes();

    editDate.innerHTML = "Edit date: " + dString;

    var dc = new Date(note.created);
    var cString = dc.getFullYear() + "-";
    if(dc.getMonth() < 9)
	cString += "0" + (dc.getMonth()+1) + "-";
    else
	cString += (dc.getMonth()+1) + "-";

    if(dc.getDate() < 10)
	cString += "0" + dc.getDate() + " ";
    else
	cString += dc.getDate() + " ";

    if(dc.getHours() < 10)
	cString += "0" + dc.getHours() + ":";
    else
	cString += dc.getHours() + ":";

    if(dc.getMinutes() < 10)
	cString += "0" + dc.getMinutes();
    else
	cString += dc.getMinutes();

    createDate.innerHTML = "Created date: " + cString;


    var header = document.getElementsByTagName("header")[0];
    var footer = document.getElementsByTagName("footer")[0];
    var prioSelect = document.getElementById("select_prio");
    var textarea = document.getElementById("textarea");
    var dateLabel = document.getElementById("div_date_label");

    prioSelect.style.paddingTop = header.scrollHeight + "px";

    var height = window.innerHeight;
    height -= (header.scrollHeight + footer.scrollHeight + prioSelect.scrollHeight + dateLabel.scrollHeight + 2);
    textarea.style.height = height + "px";

//fortsätt att sätta
//höjd på textarea

    if(note)
	textarea.value = note.text;
    else{
	saveButton.disabled = true;
	deleteButton.disabled = true;
	select.disabled = true;
	textarea.disabled = true;
	alert("Error: Can not find selected note!\n" +
	      "Click cancel button and\n" +
	      "please try again!");
    }
}

function getNote(){
    if(!localStorage.getItem(sessionStorage.currentPrio + "Notes"))
	return undefined;
    
    var notes = localStorage.getItem(sessionStorage.currentPrio + "Notes");
    notes = JSON.parse(notes);

    var note = undefined;
    for(var i=0; i<notes.length; i++){
	if(notes[i].number == sessionStorage.editnote)
	    return notes[i];
    }
}

function saveButtonClicked(){
    var textarea = document.getElementById("textarea");

    if(textarea.value.length > 0){
	var date = new Date();
	var note;// = new Note(date.getTime(), textarea.value);
	var newArray = new Array();
	var notes = localStorage.getItem(sessionStorage.currentPrio + "Notes");
	notes = JSON.parse(notes);

	for(var i=0; i < notes.length; i++){
	    if(notes[i].number != sessionStorage.editnote)
		newArray.push(notes[i]);
	    else{
		note = new Note(date.getTime(), textarea.value, notes[i].created);
	    }
	}

	newArray.push(note);
	localStorage.setItem(sessionStorage.currentPrio + "Notes",
			     JSON.stringify(newArray));

	window.location = "index.html";
    }
    else
	alert("There is no text,\nplease enter text and save again!");

}

function deleteButtonClicked(){
    var answer = confirm("Are you sure that you\nwant to delete this note?");
    if(answer){
	if(!localStorage.getItem(sessionStorage.currentPrio + "Notes")){
	    alert("Error: Could not delete note!\n" +
		  "SessionStorage is missing.\nPlease try again!");
	}
	else{
	    var notes = localStorage.getItem(sessionStorage.currentPrio + "Notes");
	    notes = JSON.parse(notes);
	    var newArray = new Array();
	    for(var i=0; i<notes.length; i++){
		if(notes[i].number != sessionStorage.editnote)
		    newArray.push(notes[i]);
	    }

	    localStorage.setItem(sessionStorage.currentPrio + "Notes",
				 JSON.stringify(newArray));

	    alert("Note deleted!");
	    window.location = "index.html";
	}
    }

}

function cancelButtonClicked(){
    sessionStorage.removeItem("editnote");
    window.location = "index.html";
}

window.onload = init;