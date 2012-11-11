//$(document).ready(fixHeight);

function fixHeight(){
    var newHeight = $("html").height() - $("#header").height() - $("#footer").height();// - ($("#prioDiv").height());
    var textHeight = $("#prioDiv").outerHeight(true);
    $("#content").css("height", newHeight + "px");
//    $("#text").css("height", newHeight-textHeight + "px");
    alert($(window).height()+"\n"+$("body").height() +"\n"+$("html").height() +"\n" + $("#header").height() + "\n" + $("#footer").height() +"\n" + $("#prioDiv").height() + "\n" + $("#text").height() +"\n" + newHeight);
}