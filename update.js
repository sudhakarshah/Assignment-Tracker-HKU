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
