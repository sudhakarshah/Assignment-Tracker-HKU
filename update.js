function updateRecord(key,courseName,assignmentName,deadline,status,submittedOn)
{
  var obj={};
  obj[key]={"courseName":courseName,"name":assignmentName,"deadline":deadline,"status":status,"submittedOn":submittedOn};
  chrome.storage.sync.set(obj,function(){
    alert("record updated");
  })

}

function update(courseName,assignmentName,deadline,status,submittedOn)
{  // Checking whether assignment already exists in storage and adding only new assignments
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
        if(as.courseName===courseName && assignmentName==as.name)
        {
          console.log("yes the assignment already exists");
          assignmentExists=true;
          if(status!=as.status)
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
        else {
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
