document.addEventListener('DOMContentLoaded',(event)=>{

// validation for name section
document.querySelector(".name-class").addEventListener("click", function(){
    if(document.querySelector(".firstname1").value.trim() == ''  ){
    document.querySelector(".error_embroideryFieldf").style.display = "block";
    } 
 
    var radios = document.getElementsByName("namecolor");
    var formValid = false;

    var i = 0;
    while (!formValid && i < radios.length) {
        if (radios[i].checked) formValid = true;
        i++;        
    }

    if (!formValid) {
      document.querySelector(".error_embroideryFieldc").style.display = "flex";
    } else{
      document.querySelector(".error_embroideryFieldc").style.display = "none";
    }
    return formValid;
  })


document.querySelectorAll(".option_row").forEach(eachh=>{
    eachh.addEventListener("click", function(){
        document.querySelector(".error_embroideryFieldc").style.display = "none"
    })
})
// validation for icon
document.querySelector(".icon-class").addEventListener("click", function(){
     
    var radios = document.querySelectorAll('.icon-swatches')[0].querySelectorAll('input');
    var formValid = false;

    var i = 0;
    while (!formValid && i < radios.length) {
        if (radios[i].checked) formValid = true;
        i++;        
    }

    if (!formValid) {
      document.querySelector(".error_embroideryFieldi").style.display = "flex";
    } else{
      document.querySelector(".error_embroideryFieldi").style.display = "none";
    }
    return formValid;
  })
  document.querySelectorAll(".iconsName").forEach(eachh=>{
    eachh.addEventListener("click", function(){
        document.querySelector(".error_embroideryFieldi").style.display = "none"
    })
})
// validation for both
document.querySelector(".both-class").addEventListener("click", function(){
    if(document.querySelector(".firstnameb").value.trim() == ''  ){
    document.querySelector(".error_embroideryFieldb").style.display = "block";
    } 
 
    var radiosb = document.getElementsByName("namecolor_both");
    var formValid = false;

    var i = 0;
    while (!formValid && i < radiosb.length) {
        if (radiosb[i].checked) formValid = true;
        i++;        
    }

    if (!formValid) {
      document.querySelector(".error_embroideryFieldcb").style.display = "block";
    } else{
      document.querySelector(".error_embroideryFieldcb").style.display = "none";
    }
    return formValid;

  })
      document.querySelector(".both-class").addEventListener("click", function(){
  var radiosi = document.querySelectorAll('.icon-swatches')[1].querySelectorAll('input');
    var formValid = false;

    var i = 0;
    while (!formValid && i < radiosi.length) {
        if (radiosi[i].checked) formValid = true;
        i++;        
    }

    if (!formValid) {
      document.querySelector(".error_embroideryFieldib").style.display = "block";
    } else{
      document.querySelector(".error_embroideryFieldib").style.display = "none";
    }
    return formValid;
  })
   document.querySelectorAll(".embroideryIcon").forEach(eachh=>{
    eachh.addEventListener("click", function(){
        document.querySelector(".error_embroideryFieldib").style.display = "none"
    })
})

document.querySelectorAll(".option-row-both").forEach(eachh=>{
    eachh.addEventListener("click", function(){
        document.querySelector(".error_embroideryFieldcb").style.display = "none"
    })
})


  document.querySelectorAll(".iconsName").forEach(eachh=>{
    eachh.addEventListener("click", function(){
        document.querySelector(".error_embroideryFieldi").style.display = "none"
    })
})
})
function displayb(){
  document.querySelector(".error_embroideryFieldb").style.display = "none";
}
function display(){
  document.querySelector(".error_embroideryFieldf").style.display = "none";
}
