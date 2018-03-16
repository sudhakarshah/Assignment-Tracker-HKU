var deadline= document.getElementsByClassName('data cell c2')[0].innerText;
deadline = deadline.replace('-',' ');
var courseName="Undefined";
var status="Submitted";
var submittedOn="Undefined";
var assignmentName="Undefined";
var update=require('./update');

if(document.getElementsByClassName('left cell c2')[0].innerText=="--")
{
    status="Not Submitted";
}

//finding course name
var aTag=document.querySelectorAll('[itemprop="url"]')[1];
courseName=aTag.getAttribute("title");
console.log(courseName);

// finding assignment name
assignmentName=document.querySelectorAll('[itemprop="title"]')[3].innerText;
console.log(assignmentName);

if (deadline!="Undefined" && status="Not Submitted"){
  update(courseName,assignmentName,deadline,status,submittedOn);
}

//chrome.runtime.sendMessage(deadline);
//chrome.runtime.sendMessage("hello");
