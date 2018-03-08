var a= document.getElementsByClassName('cell c0');
var b= document.getElementsByClassName('cell c1 lastcol');
var deadline="Undefined";
var courseName="Undefined";


// Finding Deadline of the assignement
for (var i=0;i<a.length;i++)
{
  //console.log(a[i].innerText);
  if(a[i].innerText=="Due date")
  {
    deadline=b[i].innerHTML;
    console.log("Added");
    break;
  }
}

// Finding the name of the course
var aTag=document.getElementsByTagName('a');
var tempCounter=0;
for(var i=0;i<aTag.length;i++)
{
  if(aTag[i].getAttribute("itemprop")=="url" && tempCounter==1)
  {
    courseName=aTag[i].getAttribute("title");
    break;
  }
  else if(aTag[i].getAttribute("itemprop")=="url")
  {
    tempCounter=tempCounter+1;
  }
}

// Checking whether assignment already exists in storage and adding only new assignments
var assignementExists=false;
chrome.storage.sync.get(null,function(assignments){

  for (key in assignments)
  {
    var as=assignments[key];
    if(key!="counter")
    {
      if(as.courseName===courseName && as.deadline===deadline)
        assignementExists=true;
    }
  }

  if(assignementExists==false)
  {
    //console.log(assignementExists+"assignementExists");
    chrome.storage.sync.get({"counter":0},function(count){
      if(count.counter==0)
      {
          chrome.storage.sync.set({'counter':1},function(){
          //console.log("counting started");
          });
      }
      else {
          chrome.storage.sync.set({'counter':count.counter+1},function(){
          //console.log("count increased");
          });
      }
    });
    var newkey='Assignment'+Date.now();
    var obj={};
    obj[newkey]={"courseName":courseName,"deadline":deadline};
    chrome.storage.sync.set(obj,function(){
      alert("added");
    })
  }
});


//chrome.runtime.sendMessage(deadline);
//chrome.runtime.sendMessage("hello");
