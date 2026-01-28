document.addEventListener('DOMContentLoaded',(event)=>{

// validation for name section
document.querySelectorAll(".name-class").forEach(function(element) {
    element.addEventListener("click", function(event){
      const container = event.target.closest('.embroidery-popup');
        if(container.querySelector(".firstname1").value.trim() == ''  ){
            container.querySelector(".error_embroideryFieldf").style.display = "block";
        } 

        // var radios = container.querySelectorAll('[name="namecolor"]');
        var formValid = false;


      if (container.querySelector('[name="namecolor"]:checked')){
        formValid = true;
      }

        if (!formValid) {
       
            container.querySelector(".error_embroideryFieldc").style.display = "flex";
          return;
        } else{
            container.querySelector(".error_embroideryFieldc").style.display = "none";
 
        }

        return formValid;
    });
});



document.querySelectorAll(".option_row").forEach(eachh=>{
    eachh.addEventListener("click", function(){
        document.querySelector(".error_embroideryFieldc").style.display = "none"
    })
})
// validation for icon
document.querySelectorAll(".icon-class").forEach(iconElement => {
    iconElement.addEventListener("click", function(event){
      const container = event.target.closest('.embroidery-popup');
        var radios = container.querySelectorAll('.icon-swatches')[0].querySelectorAll('input');
        var formValid = false;

        var i = 0;
        while (!formValid && i < radios.length) {
            if (radios[i].checked) formValid = true;
            i++;        
        }

        if (!formValid) {
            container.querySelector(".error_embroideryFieldi").style.display = "flex";
        } else {
            container.querySelector(".error_embroideryFieldi").style.display = "none";
        }
        return formValid;
    });
});


  document.querySelectorAll(".iconsName").forEach(eachh=>{
    eachh.addEventListener("click", function(){
        document.querySelector(".error_embroideryFieldi").style.display = "none"
    })
})
// validation for both
document.querySelectorAll(".both-class").forEach(function(element) {
    element.addEventListener("click", function(event) {
       const container = event.target.closest('.embroidery-popup');
        if (container.querySelector(".firstnameb").value.trim() == '') {
            container.querySelector(".error_embroideryFieldb").style.display = "block";
        } else {
            container.querySelector(".error_embroideryFieldb").style.display = "none";
        }

        var radiosb = container.querySelectorAll('[name="namecolor_both"]');
        var formValid = false;

        for (var i = 0; i < radiosb.length; i++) {
            if (radiosb[i].checked) {
                formValid = true;
                break;
            }
        }

        if (!formValid) {
            container.querySelector(".error_embroideryFieldcb").style.display = "block";
        } else {
            container.querySelector(".error_embroideryFieldcb").style.display = "none";
        }
        return formValid;
    });
});

document.querySelectorAll(".both-class").forEach(function(element) {
    element.addEventListener("click", function(event) {
      const container = event.target.closest('.embroidery-popup');

        var radiosi = container.querySelectorAll('.icon-swatches')[1].querySelectorAll('input');
        var formValid = false;

        for (var i = 0; i < radiosi.length; i++) {
            if (radiosi[i].checked) {
                formValid = true;
                break;
            }
        }

        if (!formValid) {
            container.querySelector(".error_embroideryFieldib").style.display = "block";
        } else {
            container.querySelector(".error_embroideryFieldib").style.display = "none";
        }
        return formValid;
    });
});



  
   document.querySelectorAll(".embroideryIcon").forEach(eachh=>{
    eachh.addEventListener("click", function(event){
       const container = event.target.closest('.embroidery-popup');
        container.querySelector(".error_embroideryFieldib").style.display = "none"
    })
})

document.querySelectorAll(".option-row-both").forEach(eachh=>{
    eachh.addEventListener("click", function(event){
       const container = event.target.closest('.embroidery-popup');
        container.querySelector(".error_embroideryFieldcb").style.display = "none"
    })
})


  document.querySelectorAll(".iconsName").forEach(eachh=>{
    eachh.addEventListener("click", function(event){
       const container = event.target.closest('.embroidery-popup');
        container.querySelector(".error_embroideryFieldi").style.display = "none"
    })
})
})
function displayb(){
  document.querySelector(".error_embroideryFieldb").style.display = "none";
}
function display(){
  document.querySelector(".error_embroideryFieldf").style.display = "none";
}