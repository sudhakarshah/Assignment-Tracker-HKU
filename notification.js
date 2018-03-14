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
    window.location.reload();   // reloading page after db updated
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
