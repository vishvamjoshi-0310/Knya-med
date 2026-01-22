window.addEventListener('DOMContentLoaded', (event) => { 
  try{

 window.embroideryLineItems='';
  let filled = 0;

document.querySelectorAll('.embroidery-popup .popupbtn').forEach(function(btn) {
  btn.addEventListener("click", function(event) {
    var container = event.target.closest('.pww_subcontainer');
    container.querySelector('.embroidery-popup').style.display = "none"; 
    container.querySelector(".variant_box").setAttribute("data-open", "false");
  });
});


  
// RESET BUTTON CLICK=================================================== 
  document.querySelector('body').addEventListener('click', function(event) {
  if (event.target.matches('.variant_selection_wrap .addition_btns .reset_btn')) {
    let form = event.target.closest('.variant_selection_wrap').querySelector('.form_content');
    
    form.querySelectorAll('input[type="text"]').forEach(function(input) {
      input.value = '';
    });
   if(document.querySelector("#option-iconCustomUpload").value != ""){
     document.querySelectorAll( ".custom-image-value").forEach(eachValue=>{
         eachValue.innerText = "";
     eachValue.removeAttribute("style");
     })
  
      document.querySelector("#option-iconCustomUpload").value= "";
   }

var optionInputs = document.querySelectorAll('.optionbox-color .option_row input');
optionInputs.forEach(function(input) {
  input.checked = false;
}); 
document.querySelector('.colorName').innerHTML = '';
document.querySelector('.bothColorName').innerHTML = '';
  }
});
// =======================================================================================
  
  window.embroidedadded = function(event, filled) {
var embroideryBoxBtnPack = event.target.closest('.pww_main-container_card').querySelector('.embroidery-box .btn_pack');
var embroideryBoxAddedList = event.target.closest('.pww_main-container_card').querySelector('.embroidery-box .added_list');
var embroideryPopup = event.target.closest('.pww_main-container_card').querySelector('.embroidery-popup');
if (filled == 0) {
embroideryBoxBtnPack.style.display = 'flex';
embroideryBoxAddedList.style.display = 'none';
} else {
embroideryBoxAddedList.style.display = 'block';
  // embroideryPopup.style.display = "none";
embroideryBoxBtnPack.style.display = 'none';

if(event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-for="My Name"]').querySelector('[name="namecolor"]:checked')
){
    embroideryPopup.style.display = "none";
}

if (event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-for="Icon/Logo"]').querySelector('[name="icon"]:checked')){
   embroideryPopup.style.display = "none";
}

  if (event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-for="Both"]').querySelector('[name="icon"]:checked')){
   embroideryPopup.style.display = "none";
}
  
}
}

// ADDING EMBROIDERY BUTTON =================================================================================  
document.querySelector('body').addEventListener('click', function(event) {
if(event.target.classList.contains('adtn_btn') && event.target.closest('.addition_btns')) {
    let customUploadRadio = event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open="true"] .customImageUploadDivision.customUploadImageEmbroidery input');
  
    if (customUploadRadio !== null) {
    let logovalue = document.querySelector('#option-iconCustomUpload').value;
      if (customUploadRadio.checked && logovalue === '') {
            event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true] .form_wrapper-icon .swatch .customUploadImageEmbroidery .custom-image-value').style.display="block"
        // document.querySelector('.variant_box[data-open="true"] .custom-image-value').textContent = ' Please Select';
        event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open="true"] .custom-image-value').style.color = 'red';
        return;
      }
    }
window.SelectedEbrobj=window.SelectedEbrobj || []
let form = event.target.closest('.variant_selection_wrap').querySelector('.form_content');
let contents = [];
let obj = {};
let val = '';
let key = '';
let text = '';
let operation =0;
let name = event.target.closest('.variant_box').getAttribute('data-for');

  form.querySelectorAll('.form_wrapper').forEach(function(wrap){
  obj = {};
  obj.varname = name;
  wrap.querySelectorAll('.optionbox').forEach(function(row){

    let type = row.querySelector('input').getAttribute('type');
    if(type=='radio'){
      if(row.querySelector('input:checked')){
      val = row.querySelector('input:checked').value;
         key  = row.querySelector('input:checked').getAttribute('data-class');
      valCol = row.querySelector('input:checked').getAttribute("data-textcolor");
      } else{
         val = row.querySelector('input').value;
        key  = row.querySelector('input').getAttribute('data-class');
      valCol = row.querySelector('input').getAttribute("data-textcolor");
      }


      if(val==undefined){
        operation = 1;
      }
      obj[key] = val;
    }
    else if(type=='text'){

      text = '';
      let limit = row.querySelectorAll('input').length -1;
      row.querySelectorAll('input').forEach(function(box,index){
        let val = box.value.trim();
if(box.hasAttribute("required") == true){
          if(val == ''){
            operation = 1;
          }
}

        if(val != ''){
          if(index == limit){
            if(index==0){text = text + val;}
            else{
              text = text+ ',' + val;
            }
          }else{
            text = text + val ;
          }
        }


      });
      obj.text = text; 

    }

  });

     let inputsHTML = "";
    for(let prop in obj ){
      if(prop ==="Type") continue;
      if(prop === "varname"){
        if(obj.icon && obj.varname === "Both" ){
          if(obj.icon==="customupload"){
             let id = event.target.closest('.pww_main-container_card').querySelector(".duplicate_varient_title[data-for='My Name and Custom Logo']").dataset.id;
            event.target.closest('.product__info-container').querySelector(".customEmbro").value = id;
          }
        }
         if(obj.icon && obj.varname === "Icon/Logo" ){
          if(obj.icon==="customupload"){
            let id = event.target.closest('.pww_main-container_card').querySelector(".duplicate_varient_title[data-for='Custom Logo']").dataset.id;
            event.target.closest('.product__info-container').querySelector(".customEmbro").value = id;
          }
        }
        continue;
      }
      if(prop === 'position' && obj.text){
         inputsHTML += `<input class="option-chill" style="visibility:hidden;" type="text" name="properties[${'Text Position'}]" value="Left Chest">`;
      }else if(prop === 'position' && !obj.text){
        continue;
      }else{
         inputsHTML += `<input class="option-chill" style="visibility:hidden;" type="text" name="properties[${prop}]" value="${obj[prop]}">`;
      }
    
    }
   document.querySelector(".customEmbro").outerHTML += inputsHTML;
event.target.closest('.pww_main-container_card').querySelector(".embroidery-box").innerHTML += inputsHTML;
  contents.push(obj);
  SelectedEbrobj.push(obj)
  });

     if(operation == 1){
      return false;
    }

else{
  let id;
    let customLogo;
let selectedField = event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true]').dataset.for.toLowerCase();  // tells which one of three is selected 
let dataPrice = event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true] .variant_selection').dataset.price;  // to show selected variant price
  if(event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true] .customUploadImageEmbroidery input')){
 customLogo = event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true] .customUploadImageEmbroidery input').checked;
  }

  if(event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true] .customUploadImageEmbroidery')){
   customLogo = event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true] .customUploadImageEmbroidery input').checked;
  }
  
switch(selectedField){
  case 'my name':
    id = event.target.closest('.variant_box').getAttribute('data-id');

    break;
  case 'icon/logo':
    if(customLogo){
     id = event.target.closest('.variant_box').getAttribute('data-logo-variant-id');
     dataPrice = event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true]').getAttribute('data-logo-price'); // update price of customlogo
    }else {
     id = event.target.closest('.variant_box').getAttribute('data-id'); 
    }
    break;
  case 'both':
    if(customLogo){
     id = event.target.closest('.variant_box').getAttribute('data-logo-variant-id');
     dataPrice = event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true]').getAttribute('data-logo-price');  // update price of (both = name/logo)           
    }else {
     id = event.target.closest('.variant_box').getAttribute('data-id');
    }
    break;
}
event.target.closest('.pww_main-container_card').querySelector('.embroidery-box .wrapp .added_list .wrap .right .box_price').innerHTML = dataPrice+" "; // display selected variant price
let name = event.target.closest('.variant_box').getAttribute('data-for');
fillembroiderybox(event, id,name,contents);

}
if(event.target.closest('.pww_main-container_card').querySelectorAll('.color_custom_container .HorizontalList li input:checked')[0]){
  var productElement = event.target.closest('.pww_main-container_card').querySelectorAll('.color_custom_container .HorizontalList li input:checked')[0];
}
  else{
 var productElement = event.target.closest('.pww_main-container_card').querySelectorAll('.color_custom_container .HorizontalList li input')[0];
  }

if (productElement !== undefined) {
  let productColor = window.getComputedStyle(productElement.parentNode).backgroundColor;
  event.target.closest('.pww_main-container_card').querySelectorAll('.added_list_contents .list_row .left')[0].style.backgroundColor = productColor;
}
  let embroideryFontColor = event.target.closest('.pww_main-container_card').querySelector('#embroidery-pop-variant-wrap .variant_box[data-open=true] .variant_selection_wrap .form_content .form_wrapper .optionbox-color .OptionBox-Inner input:checked')?.getAttribute('data-textColor');
  let bgColor = event.target.closest('.pww_main-container_card').querySelector('.ColorSwatch.is-active')?.getAttribute('data-bgColor');
if (embroideryFontColor !== undefined) {
  event.target.closest('.pww_main-container_card').querySelectorAll('.added_list_contents .list_row .left')[0].style.color = embroideryFontColor;
  event.target.closest('.pww_main-container_card').querySelectorAll('.added_list_contents .list_row .left')[0].style.backgroundColor = bgColor;
}


let PersonNames = contents[0].text;
if (PersonNames !== undefined) {
  PersonNames = PersonNames.split(',');
  let firstName = PersonNames[0];
  let lastName = (PersonNames[1] === undefined) ? '' : PersonNames[1];
  event.target.closest('.pww_main-container_card').querySelectorAll('.added_list_contents .list_row .left')[0].innerHTML = '<div class="selected-Name-centered"><p>' + firstName + '</p><p>' + lastName + '</p></div>';
  
          event.target.closest('.pww_main-container_card').querySelector(".selected-Name-centered").style.backgroundColor = valCol;
}

if (contents[0].font !== undefined) {
  let font = contents[0].font.toLowerCase();
  if (font === 'script') {
    event.target.closest('.pww_main-container_card').querySelector('.selected-Name-centered').classList.add('VarsityScriptJF');
  }
  if (contents[1] !== undefined && contents[1].text !== undefined) {
    let embrioinitials = contents[1].text;
    event.target.closest('.pww_main-container_card').querySelectorAll('.added_list_contents .list_row .left')[0].innerHTML = '<div class="selected-Name-centered"><p>' + embrioinitials + '</p></div>';
  }
}

window.embroideryLineItems = contents;

    let img_Url =  event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open=true] .embroideryIconsWrap input:checked')?.getAttribute('data-icon-url');

  let swatchContainer = event.target.closest('.pww_main-container_card').querySelector(".color_custom_container .HorizontalList");

let SelectedInputValue = event.target.closest('.pww_main-container_card').querySelector('#embroidery-pop-variant-wrap .variant_box[data-open=true]').dataset.for;

if (SelectedInputValue != undefined && SelectedInputValue == 'Icon/Logo') {
  if (img_Url != undefined) {
    if (swatchContainer.classList.contains("shall-appear")) {
      let imGE = event.target.closest('.pww_main-container_card').querySelector(".color_custom_container .HorizontalList li .is-active");
      let imgurl = getComputedStyle(imGE.querySelector(".imaged-swatch .Replace-Image")).getPropertyValue('background-color');
      event.target.closest('.pww_main-container_card').querySelectorAll('.embroidery-box .wrapp .added_list_contents .list_row .left')[0].innerHTML += `<span class="showIcon" style="background:${imgurl}" ><img src="${img_Url}" height="50px" /></span>`;
      event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open="true"] .custom-image-value').style.color = '#5c5c5c';
    } else {
      event.target.closest('.pww_main-container_card').querySelectorAll('.embroidery-box .wrapp .added_list_contents .list_row .left')[0].innerHTML += `<span class="showIcon" style="background:${imgurl}"><img src="${img_Url}"  height="50px" /></span>`;
      event.target.closest('.pww_main-container_card').querySelector('.variant_box[data-open="true"] .custom-image-value').style.color = '#5c5c5c';
    }
  } else { 
 let bgColor = event.target.closest('.pww_main-container_card').querySelector('.ColorSwatch.is-active')?.getAttribute('data-bgColor');
    event.target.closest('.pww_main-container_card').querySelectorAll('.embroidery-box .wrapp .added_list_contents .list_row .left')[0].innerHTML += `<span class="showIcon" style="background:${bgColor}">Custom Logo</span>`;
  }
}
else if (SelectedInputValue != undefined && SelectedInputValue == 'Both') {
  let imGE = event.target.closest('.pww_main-container_card').querySelector(".color_custom_container .HorizontalList li .is-active");
  let imgurl = getComputedStyle(imGE.querySelector(".imaged-swatch .Replace-Image")).getPropertyValue('background-color');
  if (img_Url != undefined) {
    event.target.closest('.pww_main-container_card').querySelectorAll('.embroidery-box .wrapp .added_list_contents .list_row')[0].innerHTML += `<div class="left" ><span class="showIcon" style="margin: auto;background:${imgurl}" ><img src="${img_Url}" height="80px" width="80px"/></span></div><div class="right"><div>`;
  } else {
     let bgColor = event.target.closest('.pww_main-container_card').querySelector('.ColorSwatch.is-active')?.getAttribute('data-bgColor');

    event.target.closest('.pww_main-container_card').querySelectorAll('.embroidery-box .wrapp .added_list_contents .list_row .left')[0].innerHTML += `<div class="left" ><span class="showIcon icon-backk" style="background:${imgurl}">Custom Logos</span></div><div class="right"><div>`;
  }
}


}
});


 // When changing icon, update name of icon ====================================================== 
document.querySelectorAll('.embroideryIconsWrap').forEach(eachVarient=>{
  eachVarient.addEventListener('change', function(event) {
    let val = this.querySelector('input:checked').value;
    
    
  
    event.target.closest('.pww_main-container_card').querySelector('.iconPlacement .choosedIconPlacement').innerHTML = ": " + val;
    event.target.closest('.pww_main-container_card').querySelectorAll('.variant_box[data-open=true] .customUploadImageEmbroidery .custom-image-value')[0].innerHTML = '';
    event.target.closest('.pww_main-container_card').querySelectorAll('.variant_box[data-open=false] .customUploadImageEmbroidery .custom-image-value')[0].innerHTML = '';
    document.querySelector('#option-iconCustomUpload').value = '';
});
})
  

//   custom logo on change=========================================================  
  document.querySelector('#option-iconCustomUpload').addEventListener('change', () => {
  let validation = validateFileType();
  if (validation) {
    let selectedValue = document.querySelector('#option-iconCustomUpload').value;
    let start = selectedValue.lastIndexOf('\\');
    let imageName = selectedValue.slice(start + 1);
    document.querySelector('.variant_box[data-open=true] .form_wrapper-icon .swatch .customUploadImageEmbroidery .custom-image-value').style.display="block"
    document.querySelector('.variant_box[data-open=true] .form_wrapper-icon .swatch .customUploadImageEmbroidery .custom-image-value').innerHTML = imageName;
    document.querySelector('.variant_box[data-open=false] .form_wrapper-icon .swatch .customUploadImageEmbroidery .custom-image-value').innerHTML = imageName;
  }
});
// validation ============================================================
  function validateFileType() {
  var fileName = document.getElementById("option-iconCustomUpload").value;
  var idxDot = fileName.lastIndexOf(".") + 1;
  var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
  if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
    return true;
  } else {
    alert("Only jpg/jpeg and png images are allowed!");
    $('#option-iconCustomUpload').val('');
    return false;
  }
}

//  Function to fill embroidery box 6============================================================
function fillembroiderybox(event, id, name, contents) {
  event.target.closest('.pww_main-container_card').querySelector('.embroidery-box .added_list').setAttribute('data-added', 'true');
  event.target.closest('.pww_main-container_card').querySelector('.embroidery-box .added_list').setAttribute('data-for', name);
  event.target.closest('.pww_main-container_card').querySelectorAll('input.embroidery_filled').forEach(function(input) {
    input.checked = true;
    input.value = id;
  });
  createFields(event, contents);
  
  var filled = 1;
  embroidedadded(event, filled);
}

// ye rah gya ha(ho gya h but doubt hai)=========
  function createFields(event, contents) {
  let len = contents.length;
  let row = '';
  let html = '';
  for (let i = 0; i < len; i++) {

    let right = '';
    let props = '';

    let line = '';
    row = contents[i];

    let text = '';

    for (let x in row) {

      let val = '';
      text = '';

      if (x == 'text') {

        if (row[x].includes(',')) {

          text = row[x].split(',');

          if (text[1] != '') {
            text = text[0] + ' , ' + text[1];
          } else {
            text = text[0];
          }

          val = text;

        } else {
          val = row[x];
        }

      } else {
        val = row[x];
      }

      if (x != 'varname') {
        if (val != '') {
          props += `<div class='property_line'> <span> ${x} </span>  :  <span> ${val} </span> </div>`;
        }
      }
    }

    line = `<div class='list_row'> <div class='left'> ${text} <div> </div> </div> <div class='right'> <h4>${row.varname}</h4> ${props} </div> </div><div class="added_list custom-edit-placement" data-added="false"><label class="edit_box"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.06 3.59L20.41 4.94C21.2 5.72 21.2 6.99 20.41 7.77L7.18 21H3V16.82L13.4 6.41L16.23 3.59C17.01 2.81 18.28 2.81 19.06 3.59ZM5 19L6.41 19.06L16.23 9.23L14.82 7.82L5 17.64V19Z" fill="#462D8C"/>
</svg></label></div>`;

    html += line;
  }

  let list = `<div class="added_list_contents gg">${html}</div>`;

    event.target.closest('.pww_main-container_card').querySelector('.added_list .added_list_contents').outerHTML = list;

}

//========================
  
// //   function to edit 7
document.querySelector('body').addEventListener('click', function(event) {
  if (event.target.closest('.added_list .edit_box')) {
     event.target.closest('.pww_main-container_card').querySelector('.embroidery-popup').style.display = 'flex';
     event.target.closest('.product__info-container').querySelectorAll(".option-chill").forEach(x=>x.remove());
  }
});





//   function for unchecking box 9
document.querySelector('body').addEventListener('change', function(event) {
  if (event.target.closest('.pww_main-container_card').querySelector('input.embroidery_filled').classList.contains('embroidery_filled') && event.target.closest('.pww_main-container_card').querySelector('input.embroidery_filled').tagName.toLowerCase() === 'input') {
    let check = event.target.closest('.pww_main-container_card').querySelector('input.embroidery_filled').checked;
    
    if (check) {
      event.target.closest('.pww_main-container_card').querySelector('.embroidery-box .added_list').setAttribute('data-added', 'true');
    } else {
      event.target.closest('.pww_main-container_card').querySelector('.embroidery-box .added_list').setAttribute('data-added', 'false');
    }
  }
});

  //   function for selecting labels 10
document.querySelector('body').addEventListener('click', function(event) {
if (event.target.tagName.toLowerCase() === 'label' && event.target.parentNode.classList.contains('option_row')) {
event.target.parentNode.querySelector('input').click();
}
});


  document.querySelectorAll(".duplicate_varient_title").forEach(dupli_title=>{
    
    dupli_title.addEventListener("click",(event)=>{
       
      document.querySelector(".customEmbro").value = dupli_title.getAttribute("data-id");
        document.querySelectorAll(".duplicate_varient_title").forEach(dupli_title_remove=>{
        dupli_title_remove.classList.remove("is-open")
        })
        dupli_title.classList.add("is-open")  
         event.target.closest('.pww_main-container_card').querySelectorAll(".btn_row").forEach(EachRadio_btn=>{
        EachRadio_btn.nextElementSibling.style.maxHeight="0";
           EachRadio_btn.closest(".variant_box").setAttribute("data-open", "false")
        let DataName = dupli_title.getAttribute("data-for");
        let DataName1 = EachRadio_btn.parentElement.getAttribute("data-for"); 
           EachRadio_btn.closest('.popup-wrap').querySelectorAll("input").forEach(x => {
  if (x.checked) {
    x.checked = false;
  }
});

        if(DataName == DataName1){
           EachRadio_btn.click(); 
          EachRadio_btn.nextElementSibling.style.maxHeight="100%";
          EachRadio_btn.closest(".variant_box").setAttribute("data-open", "true")
         }
          if( DataName == "Both" ){
            // document.querySelector(".changeStep").innerText = "STEP 5"
          }

         
        })
 
    })
});

  document.querySelectorAll(".font_wrapper input").forEach(eachRadio=>{
 
    eachRadio.addEventListener("change", function(event){
        event.target.closest(".embroidery-popup").querySelectorAll(".font_wrapper").forEach(remove_class=>{
        remove_class.classList.remove("icon_change");
    })
        eachRadio.parentElement.classList.add("icon_change");
      let radioTest = eachRadio.nextElementSibling.innerText;
      event.target.closest(".embroidery-popup").querySelector(".font_name").innerText = radioTest
    })
})

    document.querySelectorAll(".colorBox .option_row input").forEach(eachRadio=>{
    eachRadio.addEventListener("change", function(event){
      let radioTest = eachRadio.value
      event.target.closest(".embroidery-popup").querySelector(".colorName").innerText = radioTest
    })
});

      document.querySelectorAll(".jhgjhgj .option_row input").forEach(eachRadio=>{
    eachRadio.addEventListener("change", function(event){
      let radioTest = eachRadio.value
       event.target.closest(".embroidery-popup").querySelector(".bothColorName").innerText = radioTest
      
    })
});

  
    document.querySelectorAll(".font_wrapper1 input").forEach(eachRadio=>{
 
    eachRadio.addEventListener("change", function(event){
        document.querySelectorAll(".font_wrapper1").forEach(remove_class=>{
        remove_class.classList.remove("icon_change");
    })
        eachRadio.parentElement.classList.add("icon_change");
      let radioTest = eachRadio.nextElementSibling.innerText;
      document.querySelector(".bothFont").innerText = radioTest
    })
})

}
  catch(error){
    console.error("error:", error);
  }
});

   function openEmbroidery (event) {
     event.closest('.pww_subcontainer').querySelector(".variant_box").setAttribute("data-open", "true");
      event.closest('.pww_subcontainer').querySelector('.embroidery-popup').style.display = "flex"; 
        event.closest('.pww_subcontainer').querySelector(".duplicate_varient_title").click();
   }
   function deletEmbroidery(){
      let target = event.target;
        target.closest('.pww_main-container_card').querySelector('.embroidery-box .added_list').setAttribute('data-added', 'false');
        let form = target.closest('.pww_main-container_card').querySelector('.variants_wrap .variant_box[data-open="true"]');
        form?.querySelector('.variant_selection_wrap .addition_btns .reset_btn').click();
        form?.querySelector('.btn_row').click();
        let filled = 0;
        embroidedadded(event, filled);
        target.closest('.product__info-container').querySelectorAll(".option-chill").forEach(x => x.remove());
        target.closest('.pww_main-container_card').querySelectorAll(".embroidery_filled:checked").forEach(x => x.checked = false);
   }