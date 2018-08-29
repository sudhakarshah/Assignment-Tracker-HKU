var update= require("./update");
var moment = require('moment');



function addListeners() {
	document.getElementById("formButton").onclick = () => {
		
		var formSelector = document.getElementById("addform");
		if (window.getComputedStyle(formSelector,null).getPropertyValue("display")  === "none") {
			formSelector.style.display = "inline-block";
			document.getElementById("formButton").innerHTML = "Close";
			document.getElementById("calender").value = moment().format("YYYY-MM-DDTHH:mm");
		} else {
			formSelector.style.display = "none";
			document.getElementById("formButton").innerHTML = "Add New Assignment";
		}
	}
	//Code to add the new assignment to database
	document.getElementById("addsubmit").onclick = () => {
		const courseName = document.getElementById("ccode").value.replace(/\s/g,'') + " " + document.getElementById("cname").value;
		const status = "Not Submitted";
		const assignmentName = document.getElementById("assignmentname").value;
		const deadline = document.getElementById("calender").value.toString();
		const submittedOn = "Undefined";
		if ( deadline != "Undefined" ) {
			update(courseName,assignmentName,deadline,status,submittedOn);
		}
		document.getElementById("addform").style.display = "none";
		document.getElementById("formButton").innerHTML = "Add New Assignment";
	};
	// creating event listners for all the assignment cards
	let buttons = document.getElementsByClassName('markbutton');
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', function(){ submitAssignment(this.id); }, false);
	}
	
	let incompleteButtons = document.getElementsByClassName('incompletebutton');
	for (let i = 0; i < incompleteButtons.length; i++) {
		incompleteButtons[i].addEventListener('click', function(){ incompleteAssignment(this.id); }, false);
	}
	
	let delButtons = document.getElementsByClassName('deletebutton');
	for (let i = 0; i < delButtons.length; i++){
		delButtons[i].addEventListener('click', function(){ deleteAssignment(this.id); }, false);
	}
	
	// adding keyup event for assignment field
	let assignmentNameField = document.getElementById('assignmentname');
	assignmentNameField.addEventListener('keyup', function(){ document.getElementById("addsubmit").disabled = !isFormFilled(); }, false);
	
	//calling sortdeadline function to sort the list
	sortDeadlineList();

}
function addHtml(assignments, callback) {
	let assignmentCount = 0;
	if (assignmentCount == Object.keys(assignments).length)
		callback();
	for (key in assignments) {
		let as = assignments[key];
		let coursecode = as.courseName.substr(0,(as.courseName).indexOf(' '));
		let coursestring = (as.courseName).substr((as.courseName).indexOf(' ') + 1);
		let assignmentName = as.assignmentName;
		let buttonid = key;

		if (as.status != "Submitted") {
			document.getElementById("defaultduemessage").style.display = "none";
			let id = guidGenerator();
			let clockid = "clockdiv" + key.toString();
			let deadline = moment(as.deadline);
			let html = `
				<li>
				<div class="coursecard" id=${id}>
					<div class="display">
						<span class="cardtext">
							<span class="cardtitle">${coursecode} (${assignmentName})</span>
						</span>
						<br>
						<span class="cardBody">${coursestring}</span>
						<br>
						<br>
						<div class="clockdiv" id=${clockid}>
							<div><span class="days"></span><div class="smalltext">Days</div></div>
							<div><span class="hours"></span><div class="smalltext">Hours</div></div>
							<div><span class="minutes"></span><div class="smalltext">Minutes</div></div>
							<div><span class="seconds"></span><div class="smalltext">Seconds</div></div>
						</div>
						<br>
						<span class="cardtitle">Due on: ${deadline.format('Do MMM, HH:mm')}</span>
					</div>
					<div class="buttons">
						<button class="btn markbutton" id=${buttonid}>Completed</button>
					</div>
				</div>
				<span class="dd">${deadline}</span>
			</li>
			`;

			document.getElementById("duecardlist").innerHTML += html;
			document.getElementById(id).style.backgroundColor = "#0D47A1";
			// document.getElementById(buttonid).style.backgroundColor = "#0D47A1";

			//function to initialize clock
			let clocks = document.getElementsByClassName("clockdiv");
			let cards = document.getElementsByClassName("coursecard");
			for (let i = 0; i < clocks.length; i++) {
				let keydate = clocks[i].id.substring(8);
				let dateobject = new Date(assignments[keydate].deadline);
				initializeClock(clocks[i].id, dateobject, cards[i].id);
			}

			function initializeClock(id, endtime,card_id) {
				let clock = document.getElementById(id);
				let daysSpan = clock.querySelector('.days');
				let hoursSpan = clock.querySelector('.hours');
				let minutesSpan = clock.querySelector('.minutes');
				let secondsSpan = clock.querySelector('.seconds');

				function updateClock() {
					const t = getTimeRemaining(endtime);
					if (t.days < 2 && t.days >= 0) {
						document.getElementById(id).style.animation = "blinker 1s linear infinite";
						document.getElementById(id).style.backgroundColor = "#B71C1C";
						document.getElementById(card_id).style.backgroundColor = "#B71C1C";
						daysSpan.innerHTML = t.days;
						hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
						minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
						secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
						if (t.total <= 0) {
							clearInterval(timeinterval);
						}
					} else if (t.days < 0) {
						document.getElementById(id).innerHTML = '<span class = "cardtext">Assignment Overdue</span>';
						document.getElementById(id).style.backgroundColor = "#B71C1C";
						document.getElementById(card_id).style.backgroundColor = "#B71C1C";
					} else {
						daysSpan.innerHTML = t.days;
						hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
						minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
						secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
						if (t.total <= 0) {
							clearInterval(timeinterval);
						}
					}
				}
				updateClock();
				let timeinterval = setInterval(updateClock, 1000);
			}
		} else {
			document.getElementById("defaultcompletemessage").style.display = "none";
			const submitDate = moment(as.submittedOn);
			let id = guidGenerator();
			let html = `
				<li class="coursecard" id=${id}>
					<div class="display">
					<span class="cardtext">
						<span class="cardtitle">${coursecode} (${as.assignmentName})</span>
					</span>
					<br>
					<span class="cardBody">${coursestring}</span>
					<br>
					<br>
					<span class="cardtitle">Completed on: ${submitDate.format('Do MMM, HH:mm')}</span>
				</div>
				<div class="buttons">
					<button class="btn deletebutton" id=${buttonid}>Delete</button>
					<button class="btn incompletebutton" id=${buttonid}>Mark Due</button>
				</div>
				</li>`
			;
			document.getElementById("submittedcardlist").innerHTML += html;
			document.getElementById(id).style.backgroundColor = "#43A047";
		}
		assignmentCount++;
		if (assignmentCount == Object.keys(assignments).length)
			callback();
	}

}

window.onload = function() {
	chrome.storage.sync.get(null, (assignments) => {
		addHtml(assignments, addListeners)
	})

	
}

function reload() {
	setTimeout(function(){ window.location.reload(); },300); // 300 ms just to give a realistic click experience
}

function deleteAssignment(id){
	chrome.storage.sync.remove(id,reload)
}

// enabling submit button
function isFormFilled(){
	const assignmentNameField =document.getElementById('assignmentname');
	return ( assignmentNameField.value !== "");
}

// Function to generate random IDs for li items
function guidGenerator() {
	let S4 = () => {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function submitAssignment(key) {
	chrome.storage.sync.get(null, function(assignments){
		const as = assignments[key];
		const presentDate = new Date();
		const submittedOn = presentDate.toString();
		update(as.courseName,as.assignmentName,as.deadline,"Submitted",submittedOn,reload);
	})
}

function incompleteAssignment(key) {
	chrome.storage.sync.get(null,function(assignments){
		const as = assignments[key];
		const submittedOn = "Undefined";
		update(as.courseName, as.assignmentName, as.deadline, "Not Submitted", submittedOn, reload);
	})
}

function getTimeRemaining(endtime) {
	const t = Date.parse(endtime) - Date.parse(new Date());
	const seconds = Math.floor((t / 1000) % 60);
	const minutes = Math.floor((t / 1000 / 60) % 60);
	const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	const days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

 //Sorting the assignments according to due date
function sortDeadlineList() {
	let i, b;
	const list = document.getElementById("duecardlist");
	let switching = true;
	let shouldSwitch = false;
	while (switching) {
		switching = false;
		b = list.getElementsByTagName("LI");
		for (i = 0; i < b.length - 1; i++) {
			shouldSwitch = false;
			if (moment( (b[i].getElementsByClassName("dd"))[0].innerHTML).isAfter(moment((b[i+1].getElementsByClassName("dd"))[0].innerHTML ))){
				shouldSwitch = true;
				break;
			}
		}
		if(shouldSwitch) { 
			b[i].parentNode.insertBefore(b[i + 1], b[i]);
			switching = true;
		}
	}
}
