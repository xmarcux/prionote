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
    if(highArr.length > 0){
	var high = localStorage.getItem("highNotes");
	high = JSON.parse(high);
	high = high.concat(highArr);
	localStorage.setItem("highNotes", JSON.stringify(high));
    }
    if(mediumArr.length > 0){
	var medium = localStorage.getItem("mediumNotes");
	medium = JSON.parse(medium);
	medium = medium.concat(mediumArr);
	localStorage.setItem("mediumNotes", JSON.stringify(medium));
    }
    if(lowArr.length > 0){
	var low = localStorgae.getItem("lowNotes");
	low = JSON.parse(low);
	low = low.concat(lowArr);
	localStorage.setItem("lowNotes", JSON.stringify(low));
    }
    if(noneArr.length > 0){
	var none = localStorage.getItem("noneNotes");
	none = JSON.parse(none);
	none = none.concat(noneArr);
	localStorage.setItem("noneNotes", JSON.stringify(none));
    }
//    alert(JSON.stringify(rtndata));
}
