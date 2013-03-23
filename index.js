$(document).ready(function(){
    init();

    //Sync with server
    if(typeof(Worker) !== "undefined"){
	var syncW = new Worker("syncall.js");

	var mail = localStorage.getItem("email");
	var notesHigh = JSON.parse(localStorage.getItem("highNotes"));
	var notesMed = JSON.parse(localStorage.getItem("mediumNotes"));
	var notesLow = JSON.parse(localStorage.getItem("lowNotes"));
	var notesNo = JSON.parse(localStorage.getItem("noneNotes"));
	var delNotes = JSON.parse(localStorage.getItem("deletedNotes"));
	var allNotes = [];
	allNotes.push(notesNo);
	allNotes.push(notesLow);
	allNotes.push(notesMed);
	allNotes.push(notesHigh);
	allNotes.push(delNotes);
	allNotes.push(mail);

	syncW.postMessage(JSON.stringify(allNotes));

	syncW.onmessage = function(evt){
	    alert(evt.data);
	};
    }

    document.oncontextmenu = function(){return false;};

    $("#noteMenu").on({
	popupbeforeposition: function () {
            $('.ui-popup-screen').off();
	}
    });

    $("#allButton a").click(allButtonClicked);    
    $("#highButton a").click(highButtonClicked);
    $("#mediumButton a").click(mediumButtonClicked);
    $("#lowButton a").click(lowButtonClicked);
    $("#noneButton a").click(noneButtonClicked);

    $("#allButton a").click();

    $("#callDeleteNote").click(function(){
	$("#noteMenu").popup("close");
	setTimeout(function(){	$("#deleteMenu").popup("open");}, 200);
    });

    $("#deleteButton").click(function(){
	deleteNote();
    });

    $("#newButton").click(function(){
	sessionStorage.notePage = "new";
	if($("#noteHeaderText"))
	    notePageInit();
    });

    $("#editNoteButton").click(function(){
	sessionStorage.notePage = "edit";
	if($("#noteHeaderText"))
	    notePageInit();
    });

    $("#optionButton").click(optionPopupInit);
    $("#buttonOkSort").click(sortChanged);

    $("#notePage").on("pageinit", notePageInit);
    $("#notePage").on("pagehide", function(){
	$("#noteButtonCancel").removeClass("ui-btn-active");
	$("#noteButtonSave").removeClass("ui-btn-active");
    });

    $("#noteButtonSave").click(saveNote);

    $("#noteButtonCancel").click(function(){
	if($("#allButton a").hasClass("ui-btn-active"))
	    sessionStorage.removeItem("currentPrio");
    });


    $("#noteShowPage").on("pagehide", function(){
	$("#noteShowButtonCancel").removeClass("ui-btn-active");
	$("#noteShowButtonEdit").removeClass("ui-btn-active");
    });

    $("#noteShowButtonEdit").click(function(){
	sessionStorage.notePage = "edit";
	if($("#noteHeaderText"))
	    notePageInit();
    });

    $("#noteShowButtonCancel").click(function(){
	if($("#allButton a").hasClass("ui-btn-active"))
	    sessionStorage.removeItem("currentPrio");
    });
});

function init(){
    if(!navigator.mozApps)
	$("#installButton").remove();
    else{
	var request = navigator.mozApps.getSelf();
	request.onsuccess = function(){
	    if(request.result)
		$("#installButton").remove();
	    else
		$("#installButton").click(install);
	};

	request.onerror = function(){
	    alert("Error checking installation status: " + this.error.message);
	}
    }

    var high = localStorage.getItem("highNotes");
    high = JSON.parse(high);
    var medium = localStorage.getItem("mediumNotes");
    medium = JSON.parse(medium);
    var low = localStorage.getItem("lowNotes");
    low = JSON.parse(low);
    var none = localStorage.getItem("noneNotes");
    none = JSON.parse(none);

    var noNotes = 0;
    if(high)
	noNotes = high.length;
    if(medium)
	noNotes +=  medium.length;
    if(low)
	noNotes += low.length;
    if(none)
	noNotes += none.length;

    $("#totalCount").text(noNotes);

    fillTable();
}

function fillTable(){
    var notesArray;

    if(sessionStorage.currentPrio != undefined){
	notesArray = localStorage.getItem(sessionStorage.currentPrio + "Notes");
	notesArray = JSON.parse(notesArray);
    }
    else{
	if(localStorage.highNotes != undefined){
	    var tempNotes = JSON.parse(localStorage.highNotes);
	    for(var i=0; i<tempNotes.length; i++)
		tempNotes[i].prio = "high";
	    notesArray = tempNotes;
	}

	if(localStorage.mediumNotes != undefined){
	    tempNotes = JSON.parse(localStorage.mediumNotes);
	    for(var j=0; j<tempNotes.length; j++)
		tempNotes[j].prio = "medium";
	    notesArray = notesArray.concat(tempNotes);
	}

	if(localStorage.lowNotes != undefined){
	    tempNotes = JSON.parse(localStorage.lowNotes);
	    for(var k=0; k<tempNotes.length; k++)
		tempNotes[k].prio = "low";
	    notesArray = notesArray.concat(tempNotes);
	}

	if(localStorage.noneNotes != undefined){
	    tempNotes = JSON.parse(localStorage.noneNotes);
	    for(var l=0; l<tempNotes.length; l++)
		tempNotes[l].prio = "none";
	    notesArray = notesArray.concat(tempNotes);
	}
    }

    if(notesArray)
	sortNotes(notesArray);

    $("#noteList li").each(function(){
	if($(this).attr("data-role") != "list-divider")
	    $(this).remove();
    });
    $("#noteListDiv p").remove();

    var head = $("#prioHeader");
    if(sessionStorage.currentPrio == "medium")
	head.text("Medium Priority");
    else if(sessionStorage.currentPrio == "low")
	head.text("Low Priority");
    else if(sessionStorage.currentPrio == "none")
	head.text("None Priority");
    else if(sessionStorage.currentPrio == "high")
	head.text("High Priority");
    else
	head.text("All notes");

    if(notesArray && notesArray.length > 0){
	$("#prioCount").text(notesArray.length);
	var ulList = $("#noteList");
	for(var i=0; i<notesArray.length; i++){
	    var li = $("<li></li>");
	    var a = $("<a href='#' id='" + notesArray[i].number + "'></a>");
	    var p = $("<p class='ui-li-aside'></p>");

	    var d;
	    if(localStorage.sortOrder == "creationDate" ||
	       localStorage.sortOrder == "reverseCreationDate")
		d = new Date(notesArray[i].number);
	    else
		d = new Date(notesArray[i].editDate);
	    var dStr = d.getFullYear() + "-";
	    if(d.getMonth() < 10)
		dStr += "0" + (d.getMonth() + 1)  + "-";
	    else
		dStr += (d.getMonth() + 1) + "-";
	    if(d.getDate() < 10)
		dStr += "0" + d.getDate() + " ";
	    else
		dStr += d.getDate() + " ";

	    if(d.getHours() < 10)
		dStr += "0" + d.getHours() + ":";
	    else
		dStr += d.getHours() + ":";

	    if(d.getMinutes() < 10)
		dStr += "0" + d.getMinutes();
	    else
		dStr += d.getMinutes();

	    a.html("<h1></h1>" + notesArray[i].text);
	    p.html("<strong>" + dStr + "</strong>");
	    a.append(p);
	    li.append(a);
	    li.attr("id", notesArray[i].number);
	    if(notesArray[i].prio != undefined)
		li.attr("data-prio", notesArray[i].prio);
	    ulList.append(li);

	    li.click(noteShowPageInit);
	    li.bind("taphold", function(evt){
		if($(this).attr("data-prio"))
		    sessionStorage.currentPrio = $(this).attr("data-prio");
		sessionStorage.note = JSON.stringify(getNote($(this).attr("id")));
		$("#noteMenu").popup("open");
	    });

	}
	ulList.listview("refresh");
    }
    else{
	$("#noteListDiv").append("<p><strong>There are no notes to show...<strong></p>");
	$("#prioCount").text("0");
    }
}

function install(){
    var request = navigator.mozApps.install("http://xmarcux.github.com/prionote/manifest.webapp");
    request.onsuccess = function(){
	alert("Prio Note successfully installed!");
	$("#installButton").remove();
    };
    request.onerror = function(){
	alert("Error installing Prio Note: " + this.error.name);
    };
}

//For future use, not used today
function uninstall(){
    var request = navigator.mozApps.getInstalled();
    request.onsuccess = function(){
	for(var i=0; i<request.result.length; i++){
	    if(request.result[i].manifest.name == "Prio Note"){
		request.result[i].uninstall();
		alert("Prio Note successfully uninstalled!");
		break;
	    }
	}
    };
    request.onerror = function(){
	alert("Error uninstalling Prio Note: " + this.error.name);
    };
}

function notePageInit(){
    var title;

    if(sessionStorage.notePage == "new"){
	title = "New Note";
	$("#text").val("");
	$("#selectPrio").removeAttr("selected");
	$("#selectPrio option:first").attr("selected", "selected");

	$("#noteDatesDiv").hide();
    }
    else{
	var note = JSON.parse(sessionStorage.note);
	title = "Edit Note";
	$("#text").val(note.text);
	
	$("#selectPrio").removeAttr("selected");
	if(sessionStorage.currentPrio == "medium")
	    $("#selectPrio").children("[value='medium']").attr("selected", "selected");
	else if(sessionStorage.currentPrio == "low")
	    $("#selectPrio").children("[value='low']").attr("selected", "selected");
	else if(sessionStorage.currentPrio == "none")
	    $("#selectPrio").children("[value='none']").attr("selected", "selected");
	else
	    $("#selectPrio").children("[value='high']").attr("selected", "selected");
	if($("#header").hasClass("ui-header"))
	    $("#selectPrio").selectmenu("refresh", true);

	var cDate = new Date(note.number);
	var cDateStr = cDate.getFullYear() + "-";
	if(cDate.getMonth() < 9)
	    cDateStr += "0" + (cDate.getMonth() + 1) + "-";
	else
	    cDateStr += (cDate.getMonth() + 1) + "-";
	if(cDate.getDate() < 10)
	    cDateStr += "0" + cDate.getDate() + " ";
	else
	    cDateStr += cDate.getDate() + " ";
	if(cDate.getHours() < 10)
	    cDateStr += "0" + cDate.getHours() + ":";
	else
	    cDateStr += cDate.getHours() + ":";
	if(cDate.getMinutes() < 10)
	    cDateStr += "0" + cDate.getMinutes();
	else
	    cDateStr += cDate.getMinutes();

	var eDate = new Date(note.editDate);
	var eDateStr = eDate.getFullYear() + "-";
	if(eDate.getMonth() < 9)
	    eDateStr += "0" + (eDate.getMonth() + 1) + "-";
	else
	    eDateStr += (eDate.getMonth() + 1) + "-";
	if(eDate.getDate() < 10)
	    eDateStr += "0" + eDate.getDate() + " ";
	else
	    eDateStr += eDate.getDate() + " ";
	if(eDate.getHours() < 10)
	    eDateStr += "0" + eDate.getHours() + ":";
	else
	    eDateStr += eDate.getHours() + ":";
	if(eDate.getMinutes() < 10)
	    eDateStr += "0" + eDate.getMinutes();
	else
	    eDateStr += eDate.getMinutes();

	$("#noteCreateDate").text(cDateStr);
	$("#noteEditDate").text(eDateStr);

	$("#noteDatesDiv").show();
    }
 
    if($("#prioDiv").hasClass("ui-body"))
	$("#selectPrio").selectmenu("refresh", true);
    
    $("#noteHeaderText").text(title);
}

function allButtonClicked(){
    sessionStorage.removeItem("currentPrio");
    fillTable();
}

function highButtonClicked(){
    sessionStorage.currentPrio = "high";
    fillTable();
}

function mediumButtonClicked(){
    sessionStorage.currentPrio = "medium";
    fillTable();
}

function lowButtonClicked(){
    sessionStorage.currentPrio = "low";
    fillTable();
}

function noneButtonClicked(){
    sessionStorage.currentPrio = "none";
    fillTable();
}

function saveNote(){
    var text = $("#text").val();
    if(text.length <= 0)
	$("#noteNoTextAlert").popup("open");
    else{
	var prio = $("#selectPrio").val();
	var prioNo = 0;
	if(prio == "high")
	    prioNo = 1;
	else if(prio == "medium")
	    prioNo = 2;
	else if(prio == "low")
	    prioNo = 3;
	else
	    prioNo = 0;

	var date = new Date();
	date = date.getTime();
	var note = new Note(date, date, text, prioNo);

	var notes;
	if(!localStorage.getItem(prio + "Notes"))
	    notes = new Array();
	else{
	    notes = localStorage.getItem(prio + "Notes");
	    notes = JSON.parse(notes);
	}

	if(sessionStorage.notePage == "new"){
	    notes.push(note);
	}
	else{
	    var oldNote = JSON.parse(sessionStorage.note);
	    note.number = oldNote.number;
	    note.editDate = date;
	    var newNotes = new Array();
	    var notesArray = localStorage.getItem(sessionStorage.currentPrio + "Notes");
	    notesArray = JSON.parse(notesArray);

	    for(var i=0; i<notesArray.length; i++){
		if(note.number != notesArray[i].number)
		    newNotes.push(notesArray[i]);
	    }

	    if(prio != sessionStorage.currentPrio){
		localStorage.setItem(sessionStorage.currentPrio + "Notes",
				       JSON.stringify(newNotes));
		notes.push(note);
	    }
	    else{
		newNotes.push(note);
		notes = newNotes;
	    }
	}

	localStorage.setItem(prio + "Notes", JSON.stringify(notes));
	sessionStorage.currentPrio = prio;
	$("#" + prio + "Button a").click();
	
	if(sessionStorage.notePage == "new"){
	    var noNotes = new Number($("#totalCount").text());
	    $("#totalCount").text(noNotes + 1);
	}

	$.mobile.changePage($("#mainPage"));
    }
}

function noteShowPageInit(){
    var id = $(this).attr("id");
    var note;
    var noteArray;
    if($(this).attr("data-prio"))
	sessionStorage.currentPrio = $(this).attr("data-prio");
    $("#selectPrioShow").removeAttr("selected");
    if(sessionStorage.currentPrio == "medium"){
	notesArray = localStorage.getItem("mediumNotes");
	$("#selectPrioShow").children("[value='medium']").attr("selected", "selected");
    }
    else if(sessionStorage.currentPrio == "low"){
	notesArray = localStorage.getItem("lowNotes");
	$("#selectPrioShow").children("[value='low']").attr("selected", "selected");
    }
    else if(sessionStorage.currentPrio == "none"){
	notesArray = localStorage.getItem("noneNotes");
	$("#selectPrioShow").children("[value='none']").attr("selected", "selected");

    }
    else{
	notesArray = localStorage.getItem("highNotes");
	$("#selectPrioShow").children("[value='high']").attr("selected", "selected");
    }
    if($("#noteShowHeader").hasClass("ui-header"))
	$("#selectPrioShow").selectmenu("refresh", true);

    notesArray = JSON.parse(notesArray);

    for(var i=0; i<notesArray.length; i++){
	if(notesArray[i].number == id){
	    note = notesArray[i];
	    break;
	}
    }

    $("#textShow").html(replaceWithLinks(note.text));

    var createDate = new Date(note.number);
    var createStr = createDate.getFullYear() + "-";
    if(createDate.getMonth() < 9)
	createStr +=  "0" + (createDate.getMonth() + 1) + "-";
    else
	createStr += (createDate.getMonth() + 1) + "-";
    if(createDate.getDate() < 10)
	createStr += "0" + createDate.getDate() + " ";
    else
	createStr += createDate.getDate() + " ";
    if(createDate.getHours() < 10)
	createStr += "0" + createDate.getHours() + ":";
    else
	createStr += createDate.getHours() + ":";
    if(createDate.getMinutes() < 10)
	createStr += "0" + createDate.getMinutes();
    else
	createStr += createDate.getMinutes();
    $("#showNoteCreateDate").text(createStr);

    var editDate = new Date(note.editDate);
    var editStr = editDate.getFullYear() + "-";
    if(editDate.getMonth() < 9)
	editStr += "0" + (editDate.getMonth() + 1) + "-";
    else
	editStr += (editDate.getMonth() + 1) + "-";
    if(editDate.getDate() < 10)
	editStr += "0" + editDate.getDate() + " ";
    else
	editStr += editDate.getDate() + " ";
    if(editDate.getHours() < 10)
	editStr += "0" + editDate.getHours() + ":";
    else
	editStr += editDate.getHours() + ":";
    if(editDate.getMinutes() < 10)
	editStr += "0" + editDate.getMinutes();
    else
	editStr += editDate.getMinutes();
    $("#showNoteEditDate").text(editStr);

    sessionStorage.note = JSON.stringify(note);
    $.mobile.changePage($("#noteShowPage"));
}

function replaceWithLinks(text){
   var strText = text;
    /* TODO add for phone number more than 3 digits or numbers with dash in between. */

    var linkStr = strText.match(/(\s|\n|$|^)(((http):*\/{0,})|(w{1,3}\.{0,1}))\d*[a-z]{1,}\.{1,1}\d*[a-z\/]{1,}\.{0,1}[^\s\n$]+/gi);

    if(linkStr){
	var repLinkStr = [];

	for(var i=0; i < linkStr.length; i++){
	    linkStr[i] = linkStr[i].replace(/[\s\n$]/g, "");
	    if(linkStr[i].indexOf("http") == 0)
		repLinkStr[i] = "<a href='" + linkStr[i]  + "' target='_blank'>" + linkStr[i] + "</a>";
	    else
		repLinkStr[i] = "<a href='http://" + linkStr[i] + "' target='_blank'>" + linkStr[i] + "</a>";
	}

	var tempLinkStr = strText;
	strText = "";
	var iFindLink = 0;
	for(var i=0; i < linkStr.length; i++){
	    tempLinkStr = tempLinkStr.replace(linkStr[i], repLinkStr[i]);
	    iFindLink = tempLinkStr.indexOf(repLinkStr[i]) + repLinkStr[i].length;
	    strText = strText + tempLinkStr.slice(0, iFindLink);
	    tempLinkStr = tempLinkStr.slice(iFindLink);
	}
	strText += tempLinkStr;
    }


    var noLinkStr = strText.match(/(http:\/\/)*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\s|\n|$)/g);
    if(noLinkStr){
	var repNoLinkStr = [];
	for(var i=0; i < noLinkStr.length; i++){
	    noLinkStr[i] = noLinkStr[i].replace(/[\s\n$]/g, "");
	    if(noLinkStr[i].indexOf("http") == 0)
		repNoLinkStr[i] = "<a href='" + noLinkStr[i] + "' target='_blank'>" + noLinkStr[i] + "</a>";
	    else
		repNoLinkStr[i] = "<a href='http://" + noLinkStr[i] + "' target='_blank'>" + noLinkStr[i] + "</a>";
	}

	var tempStr = strText;
	strText = "";
	var iFind = 0;
	for(var i=0; i < noLinkStr.length; i++){
	    tempStr = tempStr.replace(noLinkStr[i], repNoLinkStr[i]);
	    iFind = tempStr.indexOf(repNoLinkStr[i]) + repNoLinkStr[i].length;
	    strText = strText + tempStr.slice(0, iFind);
	    tempStr = tempStr.slice(iFind);
	}
	strText += tempStr;
    }

    while(strText.indexOf("\n") != -1)
	strText = strText.replace("\n", "<br/>");

    return strText;
}

function deleteNote(){
    var note = JSON.parse(sessionStorage.note);
    if(note){
	var oldNotes;
	var newNotes = new Array();
	if(sessionStorage.currentPrio == "medium")
	    oldNotes = localStorage.getItem("mediumNotes");
	else if(sessionStorage.currentPrio == "low")
	    oldNotes = localStorage.getItem("lowNotes");
	else if(sessionStorage.currentPrio == "none")
	    oldNotes = localStorage.getItem("noneNotes");
	else
	    oldNotes = localStorage.getItem("highNotes");

	oldNotes = JSON.parse(oldNotes);
	var noteFound;
	for(var i=0; i<oldNotes.length; i++){
	    if(note.number != oldNotes[i].number)
		newNotes.push(oldNotes[i]);
	    else
		noteFound = true;
	}

	localStorage.setItem(sessionStorage.currentPrio + "Notes", JSON.stringify(newNotes));

	if($("#allButton a").hasClass("ui-btn-active"))
	    sessionStorage.removeItem("currentPrio");
	init();

	setTimeout(function(){ $("#deleteConfirm").popup("open");}, 200);	
	setTimeout(function(){ $("#deleteConfirm").popup("close");}, 3000);
    }
}

function getNote(id){
    var noteArray;
    if(sessionStorage.currentPrio == "medium")
	noteArray = localStorage.getItem("mediumNotes");
    else if(sessionStorage.currentPrio == "low")
	noteArray = localStorage.getItem("lowNotes");
    else if(sessionStorage.currentPrio == "none")
	noteArray = localStorage.getItem("noneNotes");
    else
	noteArray = localStorage.getItem("highNotes");

    noteArray = JSON.parse(noteArray);
    
    var note;
    for(var i=0; i<noteArray.length; i++){
	if(id == noteArray[i].number)
	    return noteArray[i];
    }
}

function optionPopupInit(){
    var sort = localStorage.sortOrder;

    $("#selectSort").remove("selected");
    if(sort == "reverseEditDate")
	$("#selectSort").children("[value='reverseEditDate']").attr("selected", "selected");
    else if(sort == "creationDate")
	$("#selectSort").children("[value='creationDate']").attr("selected", "selected");
    else if(sort == "reverseCreationDate")
	$("#selectSort").children("[value='reverseCreationDate']").attr("selected", "selected");
    else if(sort == "alphabetic")
	$("#selectSort").children("[value='alphabeticOrder']").attr("selected", "selected");
    else if(sort == "reverseAlphabetic")
	$("#selectSort").children("[value='reverseAlphabeticOrder']").attr("selected", "selected");
    else
	$("#selectSort").children("[value='editDate']").attr("selected", "selected");

    $("#selectSort").selectmenu("refresh", true);
}

function sortChanged(){
    var option = $("#selectSort").val();
    if(option == "reverseEditDate")
	localStorage.sortOrder = "reverseEditDate";
    else if(option == "creationDate")
	localStorage.sortOrder = "creationDate";
    else if(option == "reverseCreationDate")
	localStorage.sortOrder = "reverseCreationDate";
    else if(option == "alphabeticOrder")
	localStorage.sortOrder = "alphabetic";
    else if(option == "reverseAlphabeticOrder")
	localStorage.sortOrder = "reverseAlphabetic";
    else
	localStorage.sortOrder = "editDate";

    fillTable();
}

function sortNotes(notesArray){
    var sortOrder = localStorage.getItem("sortOrder");
    if(sortOrder == "reverseEditDate")
	notesArray.sort(sortReverseEditDate);
    else if(sortOrder == "creationDate")
	notesArray.sort(sortCreationDate);
    else if(sortOrder == "reverseCreationDate")
	notesArray.sort(sortReverseCreationDate);
    else if(sortOrder == "alphabetic")
	notesArray.sort(sortAlphabetic);
    else if(sortOrder == "reverseAlphabetic")
	notesArray.sort(sortReverseAlphabetic);
    else
	notesArray.sort(sortEditDate);

    return notesArray;
}

function sortEditDate(a, b){
    return a.editDate - b.editDate;
}

function sortReverseEditDate(a, b){
    return b.editDate - a.editDate;
}

function sortCreationDate(a, b){
    return a.number - b.number;
}

function sortReverseCreationDate(a, b){
    return b.number - a.number;
}

function sortAlphabetic(a, b){
    var aLow = a.text.toLowerCase();
    var bLow = b.text.toLowerCase();
    if(aLow < bLow)
	return -1;
    else if(aLow > bLow)
	return 1;
    return 0;
}

function sortReverseAlphabetic(a, b){
    var alpha = sortAlphabetic(a, b);
    if(alpha == -1)
	return 1;
    else if(alpha == 1)
	return -1;
    return 0;
    
}
