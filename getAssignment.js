let a = document.getElementsByClassName('cell c0');
let b = document.getElementsByClassName('cell c1 lastcol');
let deadline = "Undefined";
let courseName = "Undefined";
let status = "Not Submitted";
let submittedOn = "Undefined";
let assignmentName = "Undefined"
let update = require('./update');

// Finding Deadline of the assignement
for (let i = 0; i < a.length; i++) {
	if(a[i].innerText == "Submission status") {
		if(b[i].innerText == "Submitted for grading")
			status = "Submitted";
	}
	if(a[i].innerText == "Last modified") {
		if(status == "Submitted")
			submittedOn = b[i].innerHTML;
	}
	if(a[i].innerText == "Due date") {
		deadline = b[i].innerHTML;
	}
}

// Finding the name of the course
let aTag = document.querySelectorAll('[itemprop="url"]')[1];
courseName = aTag.getAttribute("title");


// finding assignment name
assignmentName=document.querySelectorAll('[itemprop="title"]')[3].innerText;

if (deadline != "Undefined") {
  update(courseName,assignmentName,deadline,status,submittedOn,() => {});
}
