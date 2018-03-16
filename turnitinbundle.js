(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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

if (deadline!="Undefined" && status=="Not Submitted"){
  update(courseName,assignmentName,deadline,status,submittedOn);
}

},{"./update":2}],2:[function(require,module,exports){
function updateRecord(key,courseName,assignmentName,deadline,status,submittedOn)
{
  var obj={};

  obj[key]={"courseName":courseName,"assignmentName":assignmentName,"deadline":deadline,"status":status,"submittedOn":submittedOn};
  console.log(assignmentName+" an adding to db");
  chrome.storage.sync.set(obj,function(){
    alert("record updated");
  })

}

function update(courseName,assignmentName,deadline,status,submittedOn)
{  // Checking whether assignment already exists in storage and adding only new assignments
  console.log(courseName+" "+assignmentName+ "d"+deadline);
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
        console.log("yes the assignment already exists");
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
