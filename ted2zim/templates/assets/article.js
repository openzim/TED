$.urlParam = function(name){
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
};

window.onload = function() {
    let lang = $.urlParam('lang');
    if (lang === "undefined") {
        document.getElementById("title-head").innerHTML = $("p.title.lang-default").text();
    }
    else {
        document.getElementById("title-head").innerHTML = $("p.title.lang-" + lang).text();
        $(".lang-default").css("display", "none");
        $(".lang-" + lang).css("display", "block");
    }
};