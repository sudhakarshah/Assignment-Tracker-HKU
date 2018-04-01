(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var a= document.getElementsByClassName('cell c0');
var b= document.getElementsByClassName('cell c1 lastcol');
var deadline="Undefined";
var courseName="Undefined";
var status="Not Submitted";
var submittedOn="Undefined";
var assignmentName="Undefined"
var update=require('./update');

// Finding Deadline of the assignement
for (var i=0;i<a.length;i++)
{
  //console.log(a[i].innerText);
  if(a[i].innerText=="Submission status")
  {
    if(b[i].innerText=="Submitted for grading")
      status="Submitted";
  }
  if(a[i].innerText=="Last modified")
  {
    if(status=="Submitted")
      submittedOn=b[i].innerHTML;
  }
  if(a[i].innerText=="Due date")
  {
    deadline=b[i].innerHTML;
  }
}

// Finding the name of the course
var aTag=document.querySelectorAll('[itemprop="url"]')[1];
courseName=aTag.getAttribute("title");
console.log(courseName);

// finding assignment name
assignmentName=document.querySelectorAll('[itemprop="title"]')[3].innerText;
console.log(assignmentName);

if (deadline!="Undefined"){
  update(courseName,assignmentName,deadline,status,submittedOn);
}

},{"./update":2}],2:[function(require,module,exports){
function updateRecord(key,courseName,assignmentName,deadline,status,submittedOn)
{
  var obj={};

  obj[key]={"courseName":courseName,"assignmentName":assignmentName,"deadline":deadline,"status":status,"submittedOn":submittedOn};
  chrome.storage.sync.set(obj,function(){})

}

function update(courseName,assignmentName,deadline,status,submittedOn)
{  // Checking whether assignment already exists in storage and adding only new assignments
  var assignmentExists=false;
  chrome.storage.sync.get(null,function(data){

    for (key in data)
    {
      var as=data[key];
      var storedDeadline=new Date(as.deadline);
      var scrapedDeadline=new Date(deadline);
      // If record already exists then check if status has changed from last time and update if required
      if(as.courseName===courseName && assignmentName==as.assignmentName)
      {
        assignmentExists=true;
        if(status!=as.status || submittedOn!=as.submittedOn)
          updateRecord(key,courseName,assignmentName,deadline,status,submittedOn);
      }
    }

    if(assignmentExists==false)
    {
      var newkey='Assignment'+Date.now();
      updateRecord(newkey,courseName,assignmentName,deadline,status,submittedOn);
    }
  });
}

module.exports=update;

},{}]},{},[1]);
