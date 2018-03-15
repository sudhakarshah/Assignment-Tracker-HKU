chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){

        toggle();
    }
})

var iframe = document.createElement('iframe'); 
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.frameBorder = "2";



document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.width == "0px"){
    	iframe.src = chrome.extension.getURL("popup.html")
        iframe.style.width="350px";
    }
    else{
        iframe.style.width="0px";
        iframe.src = chrome.extension.getURL("popup.html")
    }
}