(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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

},{"./update":2}],2:[function(require,module,exports){
function updateRecord(key,courseName,assignmentName,deadline,status,submittedOn,callback) {
	let obj = {};
	obj[key] = {"courseName":courseName,"assignmentName":assignmentName,"deadline":deadline,"status":status,"submittedOn":submittedOn};
	chrome.storage.sync.set(obj, () => {
		callback();
	})

}

function update(courseName,assignmentName,deadline,status,submittedOn,callback = () => {}) { 
	// Checking whether assignment already exists in storage and adding only new assignments
	let assignmentExists=false;
	chrome.storage.sync.get(null,function(data) {
		for (key in data) {
			let as = data[key];
			let storedDeadline = new Date(as.deadline);
			let scrapedDeadline = new Date(deadline);
			// If record already exists then check if status has changed from last time and update if required
			if(as.courseName===courseName && assignmentName==as.assignmentName) {
				assignmentExists=true;
				if(status!=as.status || submittedOn!=as.submittedOn)
					updateRecord(key,courseName,assignmentName,deadline,status,submittedOn,callback);
			}
		}

		if(assignmentExists==false) {
			let newkey='Assignment'+ Date.now();
			updateRecord(newkey,courseName,assignmentName,deadline,status,submittedOn,callback);
		}
		else {
			callback();
		}
	});
}

module.exports=update;

},{}]},{},[1,2]);
