'use strict'

/* Add date */
console.log('Get date')
if (document.getElementById('date') != null){
    let today = new Date()
    let selectElement = document.getElementById('date')
    let formatDate = today.toDateString()
    selectElement.innerHTML = formatDate
}

// Automatic Slideshow - change image every 3 seconds
console.log('Try slideshow')
function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  myIndex++;
  if (myIndex > x.length) {myIndex = 1}
  x[myIndex-1].style.display = "block";
  setTimeout(carousel, 3000);
}

if (document.getElementById('slideShow') != null){
var myIndex = 0;
carousel();
}

// Validate contact form
console.log('Try contact form')

function refreshSendButton(){

if (document.getElementById('contact_form') != null){
var fields = [];
var inputsWithValues = 0;

var firstName = document.getElementById('Name');
var email = document.getElementById('email');
var question = document.getElementById('question');
fields.push(firstName, email, question)

console.log(fields)
for (var i=0; i< fields.length;i++){
    // if it has a value, increment the counter
    if (fields[i].value != "") {
      inputsWithValues += 1;
    }
  }
  console.log(inputsWithValues)
  if (inputsWithValues == fields.length) {
    document.getElementById('send_button').disabled = false;
  } else {
    document.getElementById('send_button').disabled = true;
  }
}
}

function validateSendButton(){
    console.log("Validate Send Button")
    var isName = validateName(document.getElementById('Name').value);
    console.log(isName)
    if(!isName){
    alert("Name must be filled out")
    }else{
        var frm = document.getElementsByName('contact-form')[0];
  // frm.submit(); // Submit the form
        frm.reset();  // Reset all form data
        refreshSendButton();
        alert("Message has been sent")

//        document.getElementById('success_message').style.display = "block";
    }
    console.log(validateEmail(document.getElementById('email').value))
}

function isNotEmpty(value) {
    if (value == null || typeof value == 'undefined' || !(/\S/.test(value)) ){
        return false};
    return (value.length > 0);
   }

function isLetter(value) {
    console.log(value)
    if (/^[A-Z]/.test(value) && /^[a-z A-Z]+$/.test(value)) return true;
    return false;
   }

function isEmail(value){
    console.log(value)
    var re = /\S+@\S+\.\S+/;
    return re.test(value.toLowerCase())
}

function validateName(value){
    if( isNotEmpty(value) && isLetter(value)) return true;
    return false;
   }

function validateEmail(value){
    if( isNotEmpty(value) && isEmail(value)) return true;
    return false;
}