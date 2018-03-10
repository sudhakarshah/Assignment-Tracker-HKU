var deadline= document.getElementsByClassName('data cell c2')[0].innerText;
deadline = deadline.replace('-',' ');
var courseName="Undefined";
var status="Submitted";
var submittedOn="Undefined";
var assignmentName="Undefined";
if(document.getElementsByClassName('left cell c2')[0].innerText=="--")
{
    status="Not Submitted";
}

//finding course name
var aTag=document.querySelectorAll('[itemprop="url"]')[1];
courseName=aTag.getAttribute("title");
console.log(courseName);

/*
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
*/


// finding assignment name
assignmentName=document.querySelectorAll('[itemprop="title"]')[3].innerText;
console.log(assignmentName);

function updateRecord(key,courseName,assignmentName,deadline,status,submittedOn)
{
  var obj={};
  obj[key]={"courseName":courseName,"name":assignmentName,"deadline":deadline,"status":status,"submittedOn":submittedOn};
  chrome.storage.sync.set(obj,function(){
    alert("record updated");
  })
}
// confirming if the current page is of assignment submission
if (deadline!="Undefined"){

  // Checking whether assignment already exists in storage and adding only new assignments
  var assignmentExists=false;
  chrome.storage.sync.get(null,function(data){

    for (key in data)
    {
      var as=data[key];
      if(key!="counter")
      {
        var storedDeadline=new Date(as.deadline);
        var scrapedDeadline=new Date(deadline);
        console.log(storedDeadline.getTime()+" "+scrapedDeadline.getTime());
        // If record already exists then check cif status has changed from last time and update if required
        if(as.courseName===courseName && storedDeadline.getTime()===scrapedDeadline.getTime())
        {
          console.log("yes the assignment already exists");
          assignmentExists=true;
          if(status!=as.status)
            updateRecord(key,courseName,deadline,status);
        }

      }
    }

    if(assignmentExists==false)
    {
      //console.log(assignementExists+"assignementExists");
      chrome.storage.sync.get({"counter":0},function(data){
        if(data.counter==0)
        {
            chrome.storage.sync.set({'counter':1},function(){
            //console.log("counting started");
            });
        }
        else {
            chrome.storage.sync.set({'counter':data.counter+1},function(){
            //console.log("count increased");
            });
        }
      });
      var newkey='Assignment'+Date.now();
      alert(deadline);
      updateRecord(newkey,courseName,assignmentName,deadline,status,submittedOn);
      /*
      var obj={};
      obj[newkey]={"courseName":courseName,"deadline":deadline,"status":status};
      chrome.storage.sync.set(obj,function(){
        alert("added");

      })
        */
    }
  });

}


//chrome.runtime.sendMessage(deadline);
//chrome.runtime.sendMessage("hello");
