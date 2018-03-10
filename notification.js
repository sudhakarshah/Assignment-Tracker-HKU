
window.onload = function(){

   chrome.storage.sync.get(null,function(assignments){
      var s="";
      var diffdays = 0;
      var today = new Date();
      var oneDay = 24*60*60*1000;

      for (key in assignments)
      {
        var as=assignments[key];
        if(key!="counter")
          {s= as.courseName+" "+as.deadline+" "+as.status+"\n";


          //to sort the assignment according to submission status
          if(as.status!="Submitted")
            {var id = guidGenerator();
            var deadlinedate = new Date(as.deadline);
            diffdays = Math.round(Math.abs((deadlinedate.getTime() - today.getTime())/(oneDay)));

            var html = "<li class='card coursecard'" + "id=" + "'" + id + "'" + ">" + "<span class='cardtext'>" + "<span class='cardtitle'>" +  as.courseName + "</span>" + "<br><span class='cardBody'>" + "Due on:" + "  " + as.deadline+ "</span>"+ "<br><span class='cardDays'>" + diffdays + "</span>" + "<span class = 'cardtitle'>" + "   "  + " Days Left" + "</span>" +   "</li>";
            document.getElementById("duecardlist").innerHTML+= html;

            var colors = ['#7b1fa2', '#e53935', '#c2185b','#0d47a1', '#512da8', '#004d40' , '#2e7d32' , '#1b5e20'];
            var random_color = colors[Math.floor(Math.random() * colors.length)];
            document.getElementById(id).style.backgroundColor = random_color;
           
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
        else {
          s=s+as+" count"+'\n';
        }

      }

    });

}

// Function to generate random IDs for li items
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/*
chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
});
*/
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
