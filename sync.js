var mail = localStorage.getItem("email");
mail = encodeURIComponent(mail);
var surl = "https://manu4.manufrog.com/~macmarcu/prionote/server/index.php";

$.ajax({
    url: surl,
    data: {email: mail},
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "noteFromServer"
});


function noteFromServer(rtndata){
    if(rtndata.lastNote != null && rtndata.error == null && rtndata.notes != 0){
	syncData(rtndata.lastNote);
    }
}

function syncData(lastNote){
    var mail = localStorage.getItem("email");
    mail = encodeURIComponent(mail);
    var surl = "https://manu4.manufrog.com/~macmarcu/prionote/server/syncdata.php";

    var notesHigh = JSON.parse(localStorage.getItem("highNotes"));
    var notesMed = JSON.parse(localStorage.getItem("mediumNotes"));
    var notesLow = JSON.parse(localStorage.getItem("lowNotes"));
    var notesNo = JSON.parse(localStorage.getItem("noneNotes"));
    var delNotes = JSON.parse(localStorage.getItem("deletedNotes"));
    var allNotes;

    if($.isArray(notesHigh)){
	allNotes = notesHigh;
	if($.isArray(notesMed)){
	    allNotes = allNotes.concat(notesMed);
	}
	if($.isArray(notesLow)){
	    allNotes = allNotes.concat(notesLow);
	}
	if($.isArray(notesNo)){
	    allNotes = allNotes.concat(notesNo);
	}
    }
    else if($.isArray(notesMed)){
	allNotes = notesMed;
	if($.isArray(notesLow)){
	    allNotes = allNotes.concat(notesLow);
	}
	if($.isArray(notesNo)){
	    allNotes = allNotes.concat(notesNo);
	}
    }
    else if($.isArray(notesLow)){
	allNotes = notesLow;
	if($.isArray(notesNo)){
	    allNotes = allNotes.concat(notesNo);
	}
    }
    else if($.isArray(notesNo)){
	allNotes = notesNo;
    }

    var syncNotes = [];
    var snddata;
    if($.isArray(allNotes)){
	allNotes.sort(sortReverseCreationDate);

	for(var i=0; i < allNotes.length; i++){
	    if(allNotes[i].number > lastNote)
		syncNotes.push(allNotes[i]);
	    else
		break;
	}

	if(syncNotes.length > 0){
	    syncNotes = JSON.stringify(syncNotes);
	    snddata = {email: mail, notes: syncNotes};
	}
	else if(allNotes.length > 0){
	    snddata = {email: mail, lastNote: allNotes[0].number};
	}
	else{
	    snddata = {email: mail, lastNote: 0};
	}
    }
    else{
	snddata = {email: mail, lastNote: 0}
    }
    
    if($.isArray(delNotes) && delNotes.length > 0){
	var del = JSON.stringify(delNotes);
	snddata.deleteNotes = del;
    }

    $.ajax({
	url: surl,
	data: snddata,
	dataType: "jsonp",
	jsonp: "callback",
	jsonpCallback: "syncFromServer"
    });

}

function syncFromServer(rtndata){
    // insert new notes from server into localStorage
    // verify sent notes is inserted ok
    // if delete ok remove from delete in localStorage
    var rtnArray = rtndata.notes;
    var highArr = [];
    var mediumArr = [];
    var lowArr = [];
    var noneArr = [];
    for(var i=0; i < rtnArray.length; i++){
	var n = {number: rtnArray[i].number, editDate: rtnArray[i].editDate, 
		 text: rtnArray[i].text, prio: rtnArray[i].prio};
	if(rtnArray[i].prio == 1)
	    highArr.push(n);
	else if(rtnArray[i].prio == 2)
	    mediumArr.push(n);
	else if(rtnArray[i].prio == 3)
	    lowArr.push(n);
	else
	    noneArr.push(n);
    }
    alert(JSON.stringify(rtndata));
}

// if updated note change in server so note is updated and not
// added a new note.
function syncNewOrUpdateNote(note){
    var mail = localStorage("email");
    mail = encodeURIComponent(mail);
    var surl = "https://manu4.manufrog.com/~macmarcu/prionote/server/syncdata.php";

    var notes = [];
    notes.push(note);
    notes = JSON.stringify(notes);

    var snddata = {email: mail, notes: notes};

    $.ajax({
	url: surl,
	data: snddata,
	dataType: "jsonp",
	jsonp: "callback",
	jsonpCallback: "syncFromServer"
    });
}

function deleteOneNote(noteNumber){
    var mail = localStorage("email");
    mail = encodeURIComponent(mail);
    var surl = "https://manu4.manufrog.com/~macmarcu/prionote/server/syncdata.php";

    var del = [];
    del.push(noteNumber);
    del = JSON.stringify(del);

    var snddata = {email: mail, deleteNotes: del};

    $.ajax({
	url: surl,
	data: snddata,
	dataType: "jsonp",
	jsonp: "callback",
	jsonpCallback: "syncFromServer"
    });
}
