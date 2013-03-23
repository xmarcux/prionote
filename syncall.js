var notes;

onmessage = function(evt){
    notes = JSON.parse(evt.data);
    var mail = notes[5];
    postMessage(mail);
    mail = encodeURIComponent(mail);
    var surl = "https://manu4.manufrog.com/~macmarcu/prionote/server/index.php";
    surl = surl + "?callback=noteFromServer&email=" + mail;

    importScripts(surl);
}

    function noteFromServer(rtndata){
	if(rtndata.lastNote != null && rtndata.error == null && rtndata.notes != 0){
	    syncData(rtndata.lastNote);
	}
    }

    function syncData(lastNote){
	var mail = notes[5];
	mail = encodeURIComponent(mail);
	var surl = "https://manu4.manufrog.com/~macmarcu/prionote/server/syncdata.php";

	var notesHigh = notes[1];
	var notesMed = notes[2];
	var notesLow = notes[3];
	var notesNo = notes[0];
	var delNotes = notes[4];
	var allNotes;

	if(Array.isArray(notesHigh)){
	    allNotes = notesHigh;
	    if(Array.isArray(notesMed)){
		allNotes = allNotes.concat(notesMed);
	    }
	    if(Array.isArray(notesLow)){
		allNotes = allNotes.concat(notesLow);
	    }
	    if(Array.isArray(notesNo)){
		allNotes = allNotes.concat(notesNo);
	    }
	}
	else if(Array.isArray(notesMed)){
	    allNotes = notesMed;
	    if(Array.isArray(notesLow)){
		allNotes = allNotes.concat(notesLow);
	    }
	    if(Array.isArray(notesNo)){
		allNotes = allNotes.concat(notesNo);
	    }
	}
	else if(Array.isArray(notesLow)){
	    allNotes = notesLow;
	    if(Array.isArray(notesNo)){
		allNotes = allNotes.concat(notesNo);
	    }
	}
	else if(Array.isArray(notesNo)){
	    allNotes = notesNo;
	}

	var syncNotes = [];
	var snddata;
	if(Array.isArray(allNotes)){
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
    
	if(Array.isArray(delNotes) && delNotes.length > 0){
	    var del = JSON.stringify(delNotes);
	    snddata.deleteNotes = del;
	}

	surl = surl + "?callback=syncFromServer&" + JSON.stringify(snddata);
	importScripts(surl);

/*
	xhrObject = new XMLHttpRequest();
	xhrObject.onreadystatechange = syncFromServer;
	xhrObject.open("GET", surl, false);
	xhrObject.send(snddata); 


	$.ajax({
	    url: surl,
	    data: snddata,
	    dataType: "jsonp",
	    jsonp: "callback",
	    jsonpCallback: "syncFromServer"
	});
*/
    }

    function syncFromServer(rtndata){
	// insert new notes from server into localStorage
	// verify sent notes is inserted ok
	// if delete ok remove from delete in localStorage
	postMessage("In syncFromServer");

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

	var allNotes = [];
	if(highArr.length > 0){
	    allNotes.push(highArr);
	}
	if(mediumArr.length > 0){
	    allNotes.push(mediumArr);
	}
	if(lowArr.length > 0){
	    allNotes.push(lowArr);
	}
	if(noneArr.length > 0){
	    allNotes.push(noneArr);
	}
	postMessage(allNotes);
	//    alert(JSON.stringify(rtndata));
    }

function sortReverseCreationDate(a, b){
    return b.number - a.number;
}
