let deadline = document.getElementsByClassName('data cell c2')[0].innerText;
deadline = deadline.replace('-',' ');
let courseName = "Undefined";
let status = "Submitted";
let submittedOn = "Undefined";
let assignmentName = "Undefined";
let update = require('./update');

if (document.getElementsByClassName('left cell c2')[0].innerText == "--") {
    status = "Not Submitted";
}

if(status = "Submitted") {
  submittedOn = document.getElementsByClassName('right cell c7')[0].innerText;

  let slashIndex1 = submittedOn.indexOf('/');
  let slashIndex2 = submittedOn.indexOf('/',slashIndex1+1);
  submittedOn = submittedOn.substr(slashIndex1+1,slashIndex2-slashIndex1-1)+'/'+submittedOn.substr(0,slashIndex1)+'/'+submittedOn.substr(slashIndex2+1);
}

//finding course name
let aTag = document.querySelectorAll('[itemprop="url"]')[1];
courseName = aTag.getAttribute("title");

// finding assignment name
assignmentName = document.querySelectorAll('[itemprop="title"]')[3].innerText;


if (deadline != "Undefined") {
  update(courseName,assignmentName,deadline,status,submittedOn,()=>{});
}
