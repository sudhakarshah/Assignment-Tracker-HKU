(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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

      for (key in assignments){
        var as=assignments[key];
        if(key!="counter")
        {
          s= as.courseName+" "+as.deadline+" "+as.status+"\n";
          //to sort the assignment according to submission status
          if(as.status!="Submitted")
          {
            var id = guidGenerator();
            var buttonid = key;
            var deadlinedate = new Date(as.deadline);
            diffdays = Math.round(Math.abs((deadlinedate.getTime() - today.getTime())/(oneDay)));
            diffhours = (Math.round(Math.abs((deadlinedate.getTime() - today.getTime())/(60*60*1000))))- ((diffdays-1)*24);
            if(diffdays-1 <= 1)
              daystyle = "Day";
            if(diffhours <= 1)
              hourstyle = "Hour";

            var html = '<li><div class="card coursecard" id='+id+'>' + '<span class="cardtext"> <span class="cardtitle">' + as.courseName + '</span><br><span class="cardBody">Due on:' + deadlinedate + '</span><br><span class="cardDays">' + (diffdays-1) + '</span> <span class = "cardtitle"> '+ daystyle +' '+ (diffhours-1) + ' ' + hourstyle + ' '+ 'Left </span><br><button class="markbutton" id="'+buttonid+'"> "Mark As Complete"'+'</button></div></li>';
            console.log(html);
            //var html = "<li class='card coursecard'" + "id=" + "'" + id + "'" + ">" + "<span class='cardtext'>" + "<span class='cardtitle'>" +  as.courseName + "</span>" + "<br><span class='cardBody'>" + "Due on:" + "  " + deadlinedate + "</span>"+ "<br><span class='cardDays'>" + (diffdays-1) + "</span>" + "  "+ "<span class = 'cardtitle'>" + "   " + daystyle + "  " + (diffhours-1) + " " + hourstyle + " "  + "Left"  + "</span>" +   "</li>";
            document.getElementById("duecardlist").innerHTML+= html;
            var colors = ['#7b1fa2', '#e53935', '#c2185b','#0d47a1', '#512da8', '#004d40' , '#2e7d32' , '#1b5e20'];
            var random_color = colors[Math.floor(Math.random() * colors.length)];
            document.getElementById(id).style.backgroundColor = random_color;
            document.getElementById(buttonid).style.backgroundColor = random_color;
            /*document.getElementById(buttonid).addEventListener('click', function(){
            completecard(this.buttonid); });
            */
          }
          else
          {
            var id = guidGenerator();
            var html = "<li class='card coursecard'" + "id=" + "'" + id + "'" + ">" + "<span class='cardtext'>" + "<span class='cardtitle'>" +  as.courseName + "</span>" + "<br><span class='cardBody'>" + "Completed on:" + "  " +as.submittedOn + "</span>"+"</span>" +"</li>";
            document.getElementById("submittedcardlist").innerHTML+= html;

            var colors = ['#7b1fa2', '#e53935', '#c2185b','#0d47a1', '#512da8', '#004d40' , '#2e7d32' , '#1b5e20'];
            var random_color = colors[Math.floor(Math.random() * colors.length)];
            document.getElementById(id).style.backgroundColor = random_color;
          }
        }
        else
        {
          s=s+as+" count"+'\n';
        }
      }
    });

    // after everything is rendered
   setTimeout(function(){
     // Everything will have rendered here

         document.getElementById("formButton").onclick = function(){
           var x =document.getElementById("addform");
           if (x.style.display === "none")
           {
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
              var courseName= document.getElementById("cname").value;
              var status = "Not Submitted";
              var assignmentName = document.getElementById("aname").value;
              var deadline = document.getElementById("calender").value;
              var submittedOn="Undefined";

              if (deadline!="Undefined"){
                update(courseName,assignmentName,deadline,status,submittedOn);
              }
              document.getElementById("addform").style.display = "none";
              document.getElementById("formButton").innerHTML = "Add New Assignment";
         };

         // creating event listners for all the assignment cards
         var buttons=document.getElementsByClassName('markbutton');
         for (var i=0;i<buttons.length;i++)
         {
           buttons[i].addEventListener('click', function(){submitAssignment(this.id)}, false);
         }

   });
 }



function submitAssignment(id){
  console.log(id+" has been clciked");
  completecard(id);
}

// Function to generate random IDs for li items
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


//function to update the completed card
function completecard(key)
{
  chrome.storage.sync.get(null,function(assignments){
    var as=assignments[key];
    var presentDate = new Date();
    var submittedOn = presentDate.toString();
    console.log("cn "+as.courseName+" an "+as.assignmentName);
    update(as.courseName,as.assignmentName,as.deadline,"Submitted",submittedOn);
    window.location.reload();
  });

}



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
      if(key!="counter")
      {
        var storedDeadline=new Date(as.deadline);
        var scrapedDeadline=new Date(deadline);
        //console.log(storedDeadline.getTime()+" "+scrapedDeadline.getTime());
        // If record already exists then check cif status has changed from last time and update if required
        if(as.courseName===courseName && assignmentName==as.assignmentName)
        {
          console.log("yes the assignment already exists");
          assignmentExists=true;
          if(status!=as.status || submittedOn!=as.submittedOn)
            updateRecord(key,courseName,assignmentName,deadline,status,submittedOn);
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
        else
        {
            chrome.storage.sync.set({'counter':data.counter+1},function(){
            //console.log("count increased");
            });
        }
      });
      var newkey='Assignment'+Date.now();
      alert(deadline);
      updateRecord(newkey,courseName,assignmentName,deadline,status,submittedOn);
    }
  });
}

module.exports=update;

},{}]},{},[1]);
