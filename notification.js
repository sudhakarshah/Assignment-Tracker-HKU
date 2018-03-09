window.onload=function(){
  document.getElementById('get').onclick=function(){
    chrome.storage.sync.get(null,function(assignments){
      var s="";
      for (key in assignments)
      {
        var as=assignments[key];
        if(key!="counter")
          s=s+as.courseName+" "+as.deadline+" "+as.status+"\n";
        else {
          s=s+as+" count"+'\n';
        }
      }
      alert(s+ "hahah");
    });
  };
}

/*
chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
});
*/
/*
var options={
  type:"list",
  title:"Assignment Due",
  message:"Your Assignment is due",
  iconUrl:"icon.png",
  items:[{title:"Assignment 1",message:"due"},
  {title:"Assignment 2",message:"due"}]
};

chrome.notifications.create(options);

chrome.notifications.onClicked.addListener(redirectWindow);
function redirectWindow(){
  alert("hihi");
}

function callback(){
  console.log("popup done");
};
*/
