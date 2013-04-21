//To use with a worker and sync with server
onmessage = function(evt){
    var surl = "https://manu4.manufrog.com/~macmarcu/prionote/server/syncdata.php?";

    if(evt.data.newUpdate){
	var mail = evt.data.mail;
	mail = encodeURIComponent(mail);

	var notes = [];
	notes.push(evt.data.newUpdate);
	notes = JSON.stringify(notes);

	var snddata = "email=" +  mail + "&notes=" +  notes;
	surl += "callback=syncFromServer&" + snddata;

	importScripts(surl);
    }

    if(evt.data.deleteNote){
	var mail = evt.data.mail;
	mail = encodeURIComponent(mail);
	var surl = "https://manu4.manufrog.com/~macmarcu/prionote/server/syncdata.php?";

	var del = [];
	del.push(evt.data.deleteNote.number);
	del = JSON.stringify(del);
	
	var snddata = "email=" +  mail + "&deleteNotes=" +  del;
	surl += "callback=syncFromServer&" + snddata;

	var returnobj = {};
	try{
	    importScripts(surl);
	}
	catch(e){
	    returnobj.error = "Error deleting note: " + e.message;
	    returnobj.note = evt.data.deleteNote;
	    postMessage(returnobj);
	}
	postMessage(returnobj.success = "success");
    }
}

function syncFromServer(rtndata){
    if(rtndata.error)
	postMessage(rtndata.error);
    else
	postMessage(rtndata.success = "success");
}