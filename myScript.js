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

if (deadline!="Undefined" && status=="Not Submitted"){
  update(courseName,assignmentName,deadline,status,submittedOn);
}
