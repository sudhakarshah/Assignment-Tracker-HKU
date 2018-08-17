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
			if(as.courseName === courseName && assignmentName == as.assignmentName) {
				assignmentExists=true;
				if(status!=as.status || submittedOn!=as.submittedOn)
					updateRecord(key,courseName,assignmentName,deadline,status,submittedOn,callback);
			}
		}

		if (assignmentExists == false) {
			let newkey = 'Assignment'+ Date.now();
			updateRecord(newkey,courseName,assignmentName,deadline,status,submittedOn,callback);
		}
		else {
			callback();
		}
	});
}

module.exports=update;
