var notes;

onmessage = function(evt){
    notes = JSON.parse(evt.data);
    var mail = notes[5];
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
	allNotes.sort(sortReverseEditDate);	//allNotes.sort(sortReverseCreationDate);

	for(var i=0; i < allNotes.length; i++){
	    if(allNotes[i].editDate > lastNote){//if(allNotes[i].number > lastNote){
		syncNotes.push(allNotes[i]);
	    }
	    else
		break;
	}
	
	if(syncNotes.length > 0){
	    syncNotes = JSON.stringify(syncNotes);
	    snddata = "email=" +  mail + "&notes=" + syncNotes;
	}
	else if(allNotes.length > 0){
	    snddata = "email=" +  mail + "&lastNote=" + allNotes[0].editDate;//allNotes[0].number;
	}
	else{
	    snddata = "email=" +  mail + "&lastNote=" + 0;
	}
    }
    else{
	snddata = "email=" +  mail + "&lastNote=" + 0;
    }
    
    if(Array.isArray(delNotes) && delNotes.length > 0){
	var del = JSON.stringify(delNotes);
	if(snddata.length > 0)
	    snddata = snddata + "&deleteNotes=" + del;
	else
	    snddata = snddata + "deleteNotes=" + del;
    }

    surl = surl + "?callback=syncFromServer&" + snddata;
    importScripts(surl);   
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
    if(Array.isArray(rtnArray)){
	for(var i=0; i < rtnArray.length; i++){
	    var n = {number: parseInt(rtnArray[i].number), editDate: parseInt(rtnArray[i].editDate), 
		     text: rtnArray[i].text, prio: parseInt(rtnArray[i].prio)};
	    if(rtnArray[i].prio == 1)
		highArr.push(n);
	    else if(rtnArray[i].prio == 2)
		mediumArr.push(n);
	    else if(rtnArray[i].prio == 3)
		lowArr.push(n);
	    else
		noneArr.push(n);
	}
    }

    var allNotes = {};
    if(highArr.length > 0){
	allNotes.high = highArr;
    }
    if(mediumArr.length > 0){
	allNotes.medium = mediumArr;
    }
    if(lowArr.length > 0){
	allNotes.low = lowArr;
    }
    if(noneArr.length > 0){
	allNotes.none = noneArr;
    }

    if(rtndata.delete == "OK")
	allNotes.delete = rtndata.delete;

    postMessage(allNotes);
}
/*
function sortReverseCreationDate(a, b){
    return b.number - a.number;
}
*/

function sortReverseEditDate(a, b){
    return b.editDate - a.editDate;
}
