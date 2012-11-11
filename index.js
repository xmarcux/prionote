$(document).ready(function(){
    init();
    $("#highButton a").click(highButtonClicked);
    $("#mediumButton a").click(mediumButtonClicked);
    $("#lowButton a").click(lowButtonClicked);
    $("#noneButton a").click(noneButtonClicked);

    $("#highButton a").click();
//remove after testing
    $("#testMenu").bind("taphold", function(){
	$("#noteMenu").popup("open");
    });

    $("#testMenu").click(function(){
	if($("#noteShowPage"))
	    noteShowPageInit();
	$.mobile.changePage($("#noteShowPage"));
    });
//end remove
    $("#callDeleteNote").click(function(){
	$("#noteMenu").popup("close");
	setTimeout(function(){	$("#deleteMenu").popup("open");}, 200);
    });

    $("#deleteButton").click(function(){
	setTimeout(function(){ $("#deleteConfirm").popup("open");}, 200);
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

    $("#notePage").on("pageinit", notePageInit);
    $("#notePage").on("pagehide", function(){
	$("#noteButtonCancel").removeClass("ui-btn-active");
	$("#noteButtonSave").removeClass("ui-btn-active");
    });

    $("#noteButtonSave").click(saveNote);


    $("#noteShowPage").on("pagehide", function(){
	$("#noteShowButtonCancel").removeClass("ui-btn-active");
	$("#noteShowButtonEdit").removeClass("ui-btn-active");
    });

    $("#noteShowButtonEdit").click(function(){
	sessionStorage.notePage = "edit";
	if($("#noteHeaderText"))
	    notePageInit();
    });
});

function init(){
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

    var noPrioNotes = 0;
    if(sessionStorage.currentPrio == "medium"){
	if(medium)
	    noPrioNotes = medium.length;
    }
    else if(sessionStorage.currentPrio == "low"){
	if(low)
	    noPrioNotes = low.length;
    }
    else if(sessionStorage.currentPrio == "none"){
	if(none)
	    noPrioNotes = none.length;
    }
    else{
	if(high)
	    noPrioNotes = high.length;
    }
    $("#prioCount").text(noPrioNotes);

    fillTable();
}

function fillTable(){
    var notesArray;
    if(sessionStorage.currentPrio)
	notesArray = localStorage.getItem(sessionStorage.currentPrio + "Notes");
    else
	notesArray = localStorage.getItem("highNotes");

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
    else
	head.text("High Priority");

    if(notesArray){
	notesArray = JSON.parse(notesArray);
	$("#prioCount").text(notesArray.length);
	var ulList = $("#noteList");
	for(var i=0; i<notesArray.length; i++){
	    var li = $("<li></li>");
	    var a = $("<a href='#' id='" + notesArray[i].number + "'></a>");
	    var p = $("<p class='ui-li-aside'></p>");

	    var d = new Date(notesArray[i].editDate);
	    var dStr = d.getFullYear() + "-";
	    if(d.getMonth < 10)
		dStr += "0" + d.getMonth() + "-";
	    else
		dStr += d.getMonth() + "-";
	    if(d.getDate() < 10)
		dStr += "0" + d.getDate();
	    else
		dStr += d.getDate();

	    a.html("<h1></h1>" + notesArray[i].text);
	    p.html("<strong>" + dStr + "</strong>");
	    a.append(p);
	    li.append(a);
	    li.attr("id", notesArray[i].number);
	    ulList.append(li);

	    li.click(noteShowPageInit);
	    li.bind("taphold", function(){
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
	title = "Edit Note";
	$("#noteDatesDiv").show();
    }
 
    if($("#prioDiv").hasClass("ui-body"))
	$("#selectPrio").selectmenu("refresh", true);
    
    $("#noteHeaderText").text(title);
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
	var date = new Date();
	date = date.getTime();
	var note = new Note(date, date, text);

	var notes;
	if(!localStorage.getItem(prio + "Notes"))
	    notes = new Array();
	else{
	    notes = localStorage.getItem(prio + "Notes");
	    notes = JSON.parse(notes);
	}
	
	if(!sessionStorage.editNote){
	    notes.push(note);
	}
	else{
	    //editing a note...replace old note
	}

	localStorage.setItem(prio + "Notes", JSON.stringify(notes));
	sessionStorage.currentPrio = prio;
	$("#" + prio + "Button a").click();

	var noNotes = new Number($("#totalCount").text());
	$("#totalCount").text(noNotes + 1);

	$.mobile.changePage($("#mainPage"));
    }
}

function noteShowPageInit(){
    var id = $(this).attr("id");
    var note;
    var noteArray;
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
    $("#textShow").text(note.text);

    var createDate = new Date(note.number);
    var createStr = "Created date: " + createDate.getFullYear() + "-";
    if(createDate.getMonth() < 9)
	createStr +=  "0" + createDate.getMonth() + 1 + "-";
    else
	createStr += createDate.getMonth() + 1 + "-";
    if(createDate.getDate() < 10)
	createStr += "0" + createDate.getDate();
    else
	createStr += createDate.getDate();
    $("#showNoteCreateDate").text(createStr);

    var editDate = new Date(note.editDate);
    var editStr = "Edit date: " + editDate.getFullYear() + "-";
    if(editDate.getMonth() < 9)
	editStr += "0" + editDate.getMonth() + 1 + "-";
    else
	editStr += editDate.getMonth() + 1 + "-";
    if(editDate.getDate() < 10)
	editStr += "0" + editDate.getDate();
    else
	editStr += editDate.getDate();
    $("#showNoteEditDate").text(editStr);

    sessionStorage.note = JSON.stringify(note);
    $.mobile.changePage($("#noteShowPage"));
}