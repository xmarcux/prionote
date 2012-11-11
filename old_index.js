var bgColor = "grey"; //"#B8B8B8";
var color = "white";

function init(){
    var highButton = document.getElementById("high_button");
    var mediumButton = document.getElementById("medium_button");
    var lowButton = document.getElementById("low_button");
    var noneButton = document.getElementById("none_button");
    var newButton = document.getElementById("new_button");

    highButton.style.backgroundColor = bgColor;
    highButton.style.color = color;
    highButton.style.fontWeight = "normal";
    mediumButton.style.backgroundColor = bgColor;
    mediumButton.style.color = color;
    mediumButton.style.fontWeight = "normal";
    lowButton.style.backgroundColor = bgColor;
    lowButton.style.color = color;
    lowButton.style.fontWeight = "normal";
    noneButton.style.backgroundColor = bgColor;
    noneButton.style.color = color;
    noneButton.style.fontWeight = "normal";

    if(!sessionStorage.currentPrio || sessionStorage.currentPrio == "high"){
	highButton.style.backgroundColor = "#FF3333";//"red";
	highButton.style.color = "black";//"white";
	highButton.style.fontWeight = "bold";
    }
    else if(sessionStorage.currentPrio == "medium"){
	mediumButton.style.backgroundColor = "#FFCC00";//"yellow";
	mediumButton.style.color = "black";
	mediumButton.style.fontWeight = "bold";
    }
    else if(sessionStorage.currentPrio == "low"){
	lowButton.style.backgroundColor = "#66CC00";//"green";
	lowButton.style.color = "black";//"white";
	lowButton.style.fontWeight = "bold";
    }
    else{
	noneButton.style.backgroundColor = "#0099FF";// "blue";
	noneButton.style.color = "black";//"white";
	noneButton.style.fontWeight = "bold";
    }

    highButton.onmousedown = headerMouseDown;
    highButton.onmouseout = headerMouseOut;
    highButton.onclick = headerMouseClick;

    mediumButton.onmousedown = headerMouseDown;
    mediumButton.onmouseout = headerMouseOut;
    mediumButton.onclick = headerMouseClick;

    lowButton.onmousedown = headerMouseDown;
    lowButton.onmouseout = headerMouseOut;
    lowButton.onclick = headerMouseClick;

    noneButton.onmousedown = headerMouseDown;
    noneButton.onmouseout = headerMouseOut;
    noneButton.onclick = headerMouseClick;

    newButton.onclick = newButtonClicked;

    var header = document.getElementsByTagName("header")[0];
    var footer = document.getElementsByTagName("footer")[0];
    var divTable = document.getElementById("div_note_table");

    divTable.style.paddingTop = header.scrollHeight + "px";
    divTable.style.paddingBottom = footer.scrollHeight + "px";

    buildNoteTable();
}

function newButtonClicked(){
    window.location = "newnote.html";
}

function headerMouseDown(e){
    var target = e.target;
    if(target.style.backgroundColor == bgColor){
	target.style.backgroundColor = "white";
	target.style.color = "black";
    }
}

function headerMouseOut(e){
    var target = e.target;
    var targetId = target.getAttribute("id");
    var high = document.getElementById("high_button");
    var medium = document.getElementById("medium_button");
    var low = document.getElementById("low_button");
    var none = document.getElementById("none_button");
    var clickedButton;
    if(high.style.backgroundColor != bgColor && high.style.backgroundColor != color)
	clickedButton = high;
    if(medium.style.backgroundColor != bgColor && medium.style.backgroundColor != color)
	clickedButton = medium;
    if(low.style.backgroundColor != bgColor && low.style.backgroundColor != color)
	clickedButton = low;
    if(none.style.backgroundColor != bgColor && none.style.backgroundColor != color)
	clickedButton = none;

    if(clickedButton.getAttribute("id") != targetId){
	target.style.backgroundColor = bgColor;
	target.style.color = color;
    }
}

function headerMouseClick(e){
    var target = e.target;
    var highButton = document.getElementById("high_button");
    var mediumButton = document.getElementById("medium_button");
    var lowButton = document.getElementById("low_button");
    var noneButton = document.getElementById("none_button");

    highButton.style.backgroundColor = bgColor;
    highButton.style.color = color;
    highButton.style.fontWeight = "normal";
    mediumButton.style.backgroundColor = bgColor;
    mediumButton.style.color = color;
    mediumButton.style.fontWeight = "normal";
    lowButton.style.backgroundColor = bgColor;
    lowButton.style.color = color;
    lowButton.style.fontWeight = "normal";
    noneButton.style.backgroundColor = bgColor;
    noneButton.style.color = color;
    noneButton.style.fontWeight = "normal";

    if(target.getAttribute("id") == "high_button"){
	target.style.backgroundColor = "#FF3333";//red";
	target.style.color = "black";//"white";
	sessionStorage.currentPrio = "high";
    }
    else if(target.getAttribute("id") == "medium_button"){
	target.style.backgroundColor = "#FFCC00";//"yellow";
	target.style.color = "black";
	sessionStorage.currentPrio = "medium";
    }
    else if(target.getAttribute("id") == "low_button"){
	target.style.backgroundColor = "#66CC00";//"green";
	target.style.color = "black";//"white";
	sessionStorage.currentPrio = "low";
    }
    else{
	target.style.backgroundColor = "#0099FF"; //"blue";
	target.style.color = "black";//"white";
	sessionStorage.currentPrio = "none";
    }

    target.style.fontWeight = "bold";

    buildNoteTable();

}

function buildNoteTable(){
    /* test div
    var noteTable = document.getElementById("note_table");
    noteTable.innerHTML = "";
    */
    //test div
    var noteTable = document.getElementById("div_note_table");
    noteTable.innerHTML = "";

    if(!sessionStorage.currentPrio)
	sessionStorage.currentPrio = "high";

    if(!localStorage.getItem(sessionStorage.currentPrio + "Notes")){
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	td.innerHTML = "No notes...";
	tr.appendChild(td);
	noteTable.appendChild(tr);
    }
    else{
	var notes = localStorage.getItem(sessionStorage.currentPrio +"Notes");
	notes = JSON.parse(notes);
	for(var i=0; i<notes.length; i++){
	    /* test with div
	    var tr = document.createElement("tr");
	    var tdDate = document.createElement("td");
	    var tdText = document.createElement("td");
	    */

	    //testi
	    var t = document.createElement("table");
	    var trr = document.createElement("tr");
	    var td1 = document.createElement("td");
	    var td2 = document.createElement("td");
	    //testi css
	    t.setAttribute("width", "100%");
	    t.style.borderStyle = "none";
	    t.style.borderCollapse = "collapse";
	    td1.setAttribute("width", "50%");
	    td1.style.fontSize = "small";
	    td2.setAttribute("width", "50%");
	    td2.style.textAlign = "right";
	    td2.style.fontSize = "small";

	    var tr = document.createElement("div");
	    tr.setAttribute("class", "note_row");
	    var tdDate = document.createElement("div");
	    tdDate.setAttribute("class", "date_cell");
	    var tdText = document.createElement("div");
	    tdText.setAttribute("class", "text_cell");

	    var d = new Date(notes[i].number);
	    var dString = d.getFullYear() + "-";
	    if(d.getMonth() <9)
		dString += "0" + (d.getMonth()+1) + "-";
	    else
		dString += (d.getMonth()+1) + "-";

	    if(d.getDate() < 10)
		dString += "0" + d.getDate() + " ";
	    else
		dString += d.getDate() + "&nbsp;";

	    if(d.getHours() < 10)
		dString += "0" + d.getHours() + ":";
	    else
		dString += d.getHours() + ":";

	    if(d.getMinutes() < 10)
		dString += "0" + d.getMinutes();
	    else
		dString += d.getMinutes();

	    //testi
	    var dc = new Date(notes[i].created);
	    var cString = dc.getFullYear() + "-";
	    if(dc.getMonth() <9)
		cString += "0" + (dc.getMonth()+1) + "-";
	    else
		cString += (dc.getMonth()+1) + "-";

	    if(dc.getDate() < 10)
		cString += "0" + dc.getDate() + " ";
	    else
		cString += dc.getDate() + "&nbsp;";

	    if(dc.getHours() < 10)
		cString += "0" + dc.getHours() + ":";
	    else
		cString += dc.getHours() + ":";

	    if(dc.getMinutes() < 10)
		cString += "0" + dc.getMinutes();
	    else
		cString += dc.getMinutes();

	    td1.innerHTML = dString;
	    td2.innerHTML = cString;

	    tdText.innerHTML = notes[i].text;

	    t.appendChild(trr);
	    trr.appendChild(td1);
	    trr.appendChild(td2);
	    tdDate.appendChild(t);
	    tr.appendChild(tdDate);
	    tr.appendChild(tdText);
	    tr.setAttribute("id", notes[i].number);
	    // test div tr.setAttribute("class", "note_row");
	    tr.onclick = onNoteClick;
	    tr.onmousedown = onNoteMouseDown;
	    tr.onmouseup = onNoteMouseUp;
	    noteTable.appendChild(tr);

	    var width = window.innerWidth - tdDate.offsetWidth;
	    tdText.setAttribute("width", width + "px");
	    //alert(tdDate.offsetWidth);
	    //test if text overflows if it does cut it so it fits
	    // if a row already exists the test should be done
	    // before appendChild
	    // removeChild(tr)??, cut text and insert again??
	}
    }
}

function onNoteClick(e){
    var parent = e.target;
    while(parent.tagName != "DIV")
	parent = parent.parentNode;
    parent = parent.parentNode;
    sessionStorage.editnote = parent.getAttribute("id");
    window.location = "editnote.html"
}

function onNoteMouseDown(e){
    var parent = e.target;
    while(parent.tagName != "DIV")
	parent = parent.parentNode;
    parent = parent.parentNode;
    parent.firstChild.style.backgroundColor = "white";
    parent.lastChild.style.backgroundColor = "white";
    parent.firstChild.style.color = "black";
    parent.lastChild.style.color = "black";
}

function onNoteMouseUp(e){
    var parent = e.target;
    while(parent.tagName != "DIV")
	parent = parent.parentNode;
    parent = parent.parentNode;
    parent.firstChild.style.backgroundColor = "black";
    parent.lastChild.style.backgroundColor = "black";
    parent.firstChild.style.color = "#0099FF";
    parent.lastChild.style.color = "white";
}
/*
function noteTextOverflows(text){
    var table = document.getElementById("note_table");
    var dateCell = table.firstChild.firstChild;
    var ruler = document.getElementById("text_ruler");
    ruler.innerHTML = text;

    var width = table.offsetWidth - 10 - dateCell.offsetWidth - ruler.offsetWidth;
    if(width >= 0)
	return false;
    return true;
}
*/
window.onload=init;