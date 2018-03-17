(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
/*jshint -W054 */
;(function (exports) {
  'use strict';

  function forEachAsync(arr, fn, thisArg) {
    var dones = []
      , index = -1
      ;

    function next(BREAK, result) {
      index += 1;

      if (index === arr.length || BREAK === forEachAsync.__BREAK) {
        dones.forEach(function (done) {
          done.call(thisArg, result);
        });
        return;
      }

      fn.call(thisArg, next, arr[index], index, arr);
    }

    setTimeout(next, 4);

    return {
      then: function (_done) {
        dones.push(_done);
        return this;
      }
    };
  }
  forEachAsync.__BREAK = {};

  exports.forEachAsync = forEachAsync;
}('undefined' !== typeof exports && exports || new Function('return this')()));

},{}],2:[function(require,module,exports){
var forEachAsync = require('forEachAsync').forEachAsync;
var update= require("./update");

window.onload = function(){
  chrome.storage.sync.get(null,function(assignments){
      var s="";
      var diffdays = 0;
      var today = new Date();
      var oneDay = 24*60*60*1000;
      var diffhours = 0;
      var daystyle = "Days";
      var hourstyle = "Hours";

      for (key in assignments)
      {
        var as=assignments[key];
        s=as.courseName+" "+as.deadline+" "+as.status+"\n";
        var coursecode = as.courseName.substr(0,(as.courseName).indexOf(' '));
        var coursestring = (as.courseName).substr((as.courseName).indexOf(' ')+1);
        var assignmentName = as.assignmentName;
        var colors = ['#4A148C', '#004D40', '#3E2723','#0d47a1', '#311B92', '#004D40' , '#1B5E20' , '#E65100', '#212121', '#263238'];
        var buttonid = key;
        //to sort the assignment according to submission status
        if(as.status!="Submitted")
        {
          document.getElementById("defaultduemessage").style.display = "none";
          var id = guidGenerator();

          var clockid = "clockdiv" + key.toString();
          var deadlinedate = new Date(as.deadline);
          var deadlinedatenum = deadlinedate.getDate();
          var deadlinemonth = deadlinedate.getMonth();
          var deadlineyear = deadlinedate.getFullYear();
          var deadlinetime = deadlinedate.getHours().toString() + ':' + ((deadlinedate.getMinutes()<10?'0':'') + deadlinedate.getMinutes()).toString();

          var html = '<li><div class="card coursecard" id='+id+'>' + '<span class="cardtext"> <span class="cardtitle">' + coursecode + ' ' + '(' + assignmentName + ')' + '</span><br><span class="cardBody">' + coursestring + '</span><br><br><span class="cardBody">Due on:' + ' ' + deadlinedatenum.toString() + '-' + deadlinemonth.toString() + '-' + deadlineyear.toString() + ',' + ' ' + deadlinetime.toString()  + '</span><br><div class= "clockdiv" id="' + clockid +'"><div><span class="days"></span><div class="smalltext">Days</div></div><div><span class="hours"></span><div class="smalltext">Hours</div></div><div><span class="minutes"></span><div class="smalltext">Minutes</div></div><div><span class="seconds"></span><div class="smalltext">Seconds</div></div></div>' + '<br><br><input type = "checkbox" class="markbutton" id="'+buttonid+'"/>'+ ' ' + '<label class="cardtitle" for=' + '"' + buttonid + '"' + '><span class="cardtext"></span>Mark as Complete</label>' +'</div></li>';

          document.getElementById("duecardlist").innerHTML+= html;
          var random_color = colors[Math.floor(Math.random() * colors.length)];
          document.getElementById(id).style.backgroundColor = random_color;
          document.getElementById(buttonid).style.backgroundColor = random_color;

          //function to initialize clock
          var clocks = document.getElementsByClassName("clockdiv");
          for(var i=0 ; i<clocks.length ; i++){
            var keydate = clocks[i].id.substring(8);
            var dateobject = new Date(assignments[keydate].deadline);
            initializeClock(clocks[i].id, dateobject);
          }

          function initializeClock(id, endtime) {
            var clock = document.getElementById(id);
            var daysSpan = clock.querySelector('.days');
            var hoursSpan = clock.querySelector('.hours');
            var minutesSpan = clock.querySelector('.minutes');
            var secondsSpan = clock.querySelector('.seconds');


            function updateClock() {
              var t = getTimeRemaining(endtime);
              if(t.days<2){
                document.getElementById(id).style.color = "#F44336";
              }
              daysSpan.innerHTML = t.days;
              hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
              minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
              secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
              if (t.total <= 0){clearInterval(timeinterval);}
            }
            updateClock();
            var timeinterval = setInterval(updateClock, 1000);
          }
        }
        else
        {
          document.getElementById("defaultcompletemessage").style.display = "none";
          var submittedOnDate = new Date(as.submittedOn);
          var submittedOnDateNum = submittedOnDate.getDate();
          var submittedOnMonth = submittedOnDate.getMonth();
          var submittedOnYear = submittedOnDate.getFullYear();
          var submittedOnTime = submittedOnDate.getHours() + ':' + ((submittedOnDate.getMinutes()<10?'0':'') + submittedOnDate.getMinutes());
          var id = guidGenerator();
          var html = '<li class="card coursecard"' + 'id="'+ id + '"><span class="cardtext"><span class="cardtitle">' + coursecode + ' (' + as.assignmentName + ')' + '</span><br><span class="cardBody">' + coursestring + '</span><br><br><span class="cardBody">' + 'Completed on:  ' + submittedOnDateNum.toString() + '-' +  submittedOnMonth.toString() + '-' + submittedOnYear.toString() + ',' + ' ' + submittedOnTime  + '</span></span><input type = "checkbox" class="deletebutton" id="'+buttonid+'"/>'+ ' ' + '<label class="cardtitle" for="'+ buttonid+ '"><span class="cardtext"></span>Delete</label></li>';
          document.getElementById("submittedcardlist").innerHTML+= html;
          var random_color = colors[Math.floor(Math.random() * colors.length)];
          document.getElementById(id).style.backgroundColor = random_color;
        }
      }
    })
    // after everything is rendered
   setTimeout(function(){

         document.getElementById("formButton").onclick = function(){
           var x =document.getElementById("addform");
           if (x.style.display === "none"){
             x.style.display = "inline-block";
             document.getElementById("formButton").innerHTML = "Close";
           }
           else
           {
             x.style.display = "none";
             document.getElementById("formButton").innerHTML = "Add New Assignment";
           }
         }

         //Code to add the new assignment to database
         document.getElementById("addsubmit").onclick = function(){
            console.log("in submit");
            if(validateForm()==true)
             {

              var courseName= document.getElementById("cname").value;
              var status = "Not Submitted";
              var assignmentName = document.getElementById("aname").value;
              var deadline = document.getElementById("calender").value.toString();
              var submittedOn="Undefined";

              if (deadline!="Undefined"){
                update(courseName,assignmentName,deadline,status,submittedOn);
              }
              document.getElementById("addform").style.display = "none";
              document.getElementById("formButton").innerHTML = "Add New Assignment";

            }
         };
         // creating event listners for all the assignment cards
         var buttons=document.getElementsByClassName('markbutton');
         for (var i=0;i<buttons.length;i++){
           buttons[i].addEventListener('click', function(){submitAssignment(this.id)}, false);
         }

         var delButtons=document.getElementsByClassName('deletebutton');
         for(var i=0;i<delButtons.length;i++){
           console.log("but"+i);
           delButtons[i].addEventListener('click',function(){deleteAssignment(this.id)},false);
         }


   });
 }

function submitAssignment(id){
  completecard(id);
}

function deleteAssignment(id){
  chrome.storage.sync.remove(id,function(){
    console.log("assignment deleted");
  })
  setTimeout(function(){ window.location.reload(); },500);
}

// Function to generate random IDs for li items
function guidGenerator() {
    var S4 = function(){
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


//function to update the completed card
function completecard(key)
{

    chrome.storage.sync.get(null,function(assignments){
      var as=assignments[key];
      var presentDate = new Date();
      var submittedOn = presentDate.toString();
      update(as.courseName,as.assignmentName,as.deadline,"Submitted",submittedOn);
    })
    setTimeout(function(){ console.log("reloading being done");
    window.location.reload(); }, 500);
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}


function validateForm() {
    var x = document.forms["formadd"]["assignmentname"].value;
    if (x == "") {
        return false;
    }
    return true;
}

},{"./update":3,"forEachAsync":1}],3:[function(require,module,exports){
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

},{}]},{},[2]);
