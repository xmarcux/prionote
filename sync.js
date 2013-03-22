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
