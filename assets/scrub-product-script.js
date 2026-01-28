 document.addEventListener("DOMContentLoaded", function(event) {
  if(document.querySelector(".embroidery_filled")) document.querySelector(".embroidery_filled").checked= false;
// =============EMBROIDERY===========
function showColorName() {
  let colorName = document.querySelectorAll('.color_custom_container .HorizontalList .HorizontalList__Item[data-selected=true]')[0];
  if (colorName != undefined) {
    colorName = colorName.dataset.colorvalue;
    let colorTitleElement = document.querySelectorAll('.color_custom_container .varient-title-color')[0];
    colorTitleElement.innerHTML += ` ${colorName}`;
  }
  document.querySelectorAll('input.embroidery_filled').forEach(input => input.checked = false);

}
showColorName();

// makes the custom variants combination sold out ===============================
function makeSoldOut(){
  var addtocartonextrapd = document.querySelector('.Product__InfoWrapper button.addtocartonextrapd');
  addtocartonextrapd.classList.add('changed-jvncjdbvuiwvlsie');
  setTimeout(function(){
       document.querySelector('.changed-jvncjdbvuiwvlsie').setAttribute('data-active','');
       document.querySelector('.changed-jvncjdbvuiwvlsie').setAttribute('data-action','');
       document.querySelector('.changed-jvncjdbvuiwvlsie').setAttribute('disabled','disabled');
     document.querySelector('.addtocartonextrapd').innerHTML = 'Sold out'
       
   }, 200);

}
document.querySelector('.SizeSwatchList').addEventListener('change', function() {
  document.querySelector('.Product__InfoWrapper button.addtocartonextrapd').classList.remove('changed-jvncjdbvuiwvlsie');
  let selectedValue = document.querySelector('.SizeSwatchList li input[type="radio"]:checked').value;
  document.querySelector('.varient-title-SizeSwatchList-selected-value').textContent = selectedValue;
  document.querySelector('.varient-title-SizeSwatchList-selected-value').classList.add('valued');
  let selectedInput = document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentElement.getAttribute('data-combo-vids');
  let secondaryInput = document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').parentElement.getAttribute('data-combo-vids');
  if (secondaryInput != undefined) {
    updatePrice();
    let lineItem = currentLineItemProperty();
     
    if (lineItem != false){ 
      // if(document.querySelector('.defaultProductsLineItemInput'))document.querySelector('.defaultProductsLineItemInput').value = lineItem;
      document.querySelector('.addtocartonextrapd').innerHTML = 'Add to cart'
    } else {
      makeSoldOut();
    }
  }
});

document.querySelector('.SizeSwatchList_custom').addEventListener('change', function() {
  document.querySelectorAll('.Product__InfoWrapper button.addtocartonextrapd').forEach(function(el) {
    el.classList.remove('changed-jvncjdbvuiwvlsie');
  });

  let selectedValue = document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').value;
  document.querySelector('.varient-title-SizeSwatchList_custom-selected-value').textContent = selectedValue;
  document.querySelector('.varient-title-SizeSwatchList_custom-selected-value').classList.add('valued');
  let secondaryInput = document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentNode.dataset.comboVids;
  let selectedInput = document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').parentNode.dataset.comboVids;
  if (secondaryInput !== undefined) {
    updatePrice();
    let lineItem = currentLineItemProperty();
    if (lineItem !== false) {
     // document.querySelector('.defaultProductsLineItemInput').value = lineItem;
       document.querySelector('.addtocartonextrapd').innerHTML = 'Add to cart'
        document.querySelector('.addtocartonextrapd').removeAttribute('disabled');
    } else {
      makeSoldOut();
    }
  }
});

  function checkBothSelected(){
    let defaultInput = document.querySelector('.SizeSwatchList li input:checked');
    let secondInput = document.querySelector('.SizeSwatchList_custom li input:checked');
    if(defaultInput != undefined && secondInput != undefined){
      return true;
    }
    else
    {
      if(defaultInput == undefined){
        
         document.querySelector('.varient-title-SizeSwatchList-selected-value').innerHTML =`<span class="please-select top-select cssanimation" ><b>Please Select </b></span>`;
     if(document.querySelector(".top-select")){
        let topscroll = document.querySelector(".top-select").offsetTop
        window.scrollTo({
  top: topscroll -100,
  behavior: 'smooth',
})
     }
      }
      else {
        
         document.querySelector('.varient-title-SizeSwatchList_custom-selected-value').innerHTML =`<span class="Please-Select bottom-select cssanimation" style="color:red !important"><b>Please Select </b></span>`;
      if(document.querySelector(".bottom-select")){
        let bottomscroll = document.querySelector(".bottom-select").offsetTop
          
          window.scrollTo({
  top: bottomscroll -100,
  behavior: 'smooth',
})
      }
        
      }
     
              return false;
    }
  }

  function currentLineItemProperty(){

 let DefaultProductvarientId = document.querySelector('.product-form__input input:checked').closest('li').dataset.comboVids;
 let SecondProductVarientId =  document.querySelector('.SizeSwatchList_custom li input:checked').closest('li').dataset.comboVids;

    
    let line_item_property = `${DefaultProductvarientId}_${SecondProductVarientId}`;
    let availability =  availabilityCheck();
    if(availability){
      return line_item_property;
    } else { return false; }
  } 

  function availabilityCheck(){
 let defaultVarient = document.querySelector('.product-form__input input:checked').closest('li').dataset.available;
 let secondVarient =  document.querySelector('.SizeSwatchList_custom li input:checked').closest('li').dataset.available;
    if(defaultVarient != "false" && secondVarient != "false" ){ return true;} else { return false;}
   }


// returns embroidery line item properties, or if not found, returns false
   function getEmbroideryData() {
  let lineItemProperty = {};
  let flag_for_position = false;
  if (embroideryLineItems !== '') {
    for (let i = 0; i < embroideryLineItems.length; i++) {
      let details = embroideryLineItems[i];
      for (let data in details) {
        if (data !== 'varname') {
          if (data === 'position' && flag_for_position === false) {
            let dataId = data;
            data = 'Text Position';
            flag_for_position = true;
            lineItemProperty[`${data}`] = details[dataId];
          }
          else if (data === 'position' && flag_for_position === true) {
            let dataId = data;
            data = 'Icon Placement';
            lineItemProperty[`${data}`] = details[dataId];
          }
          else {
            lineItemProperty[`${data}`] = details[data];
          }
        }
      }
    }
    if (lineItemProperty.text !== undefined && lineItemProperty.text.includes(',')) {
      let objectName = lineItemProperty.text;
      objectName = objectName.split(",").join(" , ");
      lineItemProperty.text = objectName;
    }
    return lineItemProperty;
  } else {
    return {};
  }
}

// removeEmbroideryFromCart =====
   function removeEmbroideryFromCart(qtylineitem, qty) {
  fetch(`/cart/change?line=${qtylineitem}&quantity=${qty}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      console.log("success and no-reload");
    } else {
      console.error(`Error ${response.status} (${response.statusText})`);
    }
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });
}

// checkForExistingEmbroideryWithThisLineItem====================
   function checkForExistingEmbroideryWithThisLineItem(currentPairId){
    let embroidery_quantity ;
    let embroidery_line;
    const httpReq = new XMLHttpRequest();
    httpReq.open('GET', "/cart.js",false);
    httpReq.send();
    let mixData = httpReq.responseText;
    let data = JSON.parse(mixData);
    let cartItems = data.items;
    cartItems.forEach((item,index)=>{
      if(item.properties.Embroidery === 'true' && item.properties.PairId === currentPairId){
        embroidery_quantity = item.quantity;
        embroidery_line = index +1;
      }
    }); 
    if(embroidery_line !== undefined){
      removeEmbroideryFromCart(embroidery_line,0);
      return embroidery_quantity;
    }
    else { 
      return;
    }
}

   
//  returns whether the embroidery is selected or not  ==========
function embroideryProductCheck(){
const embroidery_filled = document.querySelector('input.embroidery_filled').checked;
const displayCheck = getComputedStyle(document.querySelector('.embroidery-box .added_list')).display;
if(embroidery_filled && displayCheck != 'none') {
return true;
} else if(embroidery_filled && displayCheck == 'none') {
return false;
} else {
return false;
}
}

//validationForLogo=========
function validationForLogo() {
const embroideryInputSelected = document.querySelector('.variant_box[data-open=true]');
if (embroideryInputSelected !== null) {
const iconic = document.querySelector('.variant_box[data-open=true] .variant_selection_wrap .form_content .form_wrapper-icon .optionbox .customUploadImageEmbroidery input');
if (iconic !== null) {
const customLogoSelected = iconic.checked;
if (customLogoSelected !== true) {
  // document.querySelector('#option-iconCustomUpload').value = '';
}
} else {
// document.querySelector('#option-iconCustomUpload').value = '';
}
} else {
// document.querySelector('#option-iconCustomUpload').value = '';
}
}

// checks the minimum quantity that can be added.
function quantityCheck() {
const defaultInput = parseInt(document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentElement.dataset.qty);
const secondInput = parseInt(document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').parentElement.dataset.qty);
const inputValue = parseInt(document.querySelector('#addToCart_quantity').value);
const minimumValue = defaultInput <= secondInput ? defaultInput : secondInput;


if (inputValue <= minimumValue) {
console.log("and our quantities are ::" + inputValue);
console.log("OKAY TO GO");
return true;
} else {
console.log("and our quantities are ::" + inputValue);
console.log("SORRY INPUT IS ZEYAD");
return false;
}
}


function addtocartTopBottom(variant_id, line_item_property, quantity) {
  let qtyCheck = quantityCheck();
  quantity = Number(quantity);
  if (qtyCheck == false) {
    console.log("create error");
    document.querySelector('.availability-Notice').classList.add('shake');
    setTimeout(function () {
      document.querySelector('.availability-Notice').classList.remove('shake');
    }, 2000);
    throw 'Quantity Limit Exceeded';
  } else {
    console.log("adding bottom with qty = " + quantity);
     let defaultInputwo =document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentNode.dataset.comboVids;
    let DefaultProductvarientId = document.querySelector('.product-form__input input:checked').closest('li').dataset.comboVids;
 let SecondProductVarientId =  document.querySelector('.SizeSwatchList_custom li input:checked').closest('li').dataset.comboVids;
    let uniqueCode = parseInt(Math.random()*1000000)
let pair_IDD;
    if (document.querySelector('input.embroidery_filled').checked) {
  pair_IDD = `${DefaultProductvarientId}_${SecondProductVarientId}_${uniqueCode}`
}else{
  pair_IDD = `${SecondProductVarientId}_${DefaultProductvarientId}`
}
    document.querySelector(".product-form__buttons button[type='button']").setAttribute("disabled", true);
    
    let data ={ items : [{
      "id": variant_id,
      "quantity": quantity,
      properties: {
        'PairId': `${pair_IDD}`,
      }
    },{
      "id": defaultInputwo,
      "quantity": quantity,
      properties: {
        'PairId': `${pair_IDD}`,
      }
    }]
              };
    console.log("data",data)

      //let defaultInputwo =document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentNode.dataset.comboVids;
  let secondInputw = document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').parentNode.dataset.comboVids;
     let defaultInputwoQnty =document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentNode.getAttribute("data-qty");
  let secondInputwQnty = document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').parentNode.getAttribute("data-qty");
    
       fetch('/cart.js', {
        method: 'Get',
        headers: { 'Content-Type': 'application/json' },
        
    }).then(Response => Response.json())
.then(data123 => {
let flag = true;
  data123.items.forEach(cartItem=>{
   
    if (cartItem.id == defaultInputwo || cartItem.id == secondInputw ){
       flag = false
     if (cartItem.quantity == defaultInputwoQnty || cartItem.quantity == secondInputwQnty ){
      flag = false
       }else{
       flag = true
       }
    }else{
      
    }
   
  })
  console.log("flag", data)
  if(flag === true){
        fetch('/cart/add.js', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
    if (document.querySelector('input.embroidery_filled').checked) {
      let sku = document.querySelector('.SizeSwatchList .HorizontalList__Item input:checked').parentElement.dataset.sku

         let abcde = `<input class="option-chill" style="visibility:hidden;" type="text" name="properties[PairId]" value="${line_item_property}_${uniqueCode}"/>`;

      abcde += `<input class="option-chill" style="visibility:hidden;" type="text" name="properties[SKU]" value="${sku}"/>`;
        
       if(document.querySelector(".duplicate_varient_title.is-open").dataset.for !== "My Name"){
      abcde += `<input class="option-chill" style="visibility:hidden;" type="text" name="properties[Icon Placement]" value="Right Chest">`;
    console.log("abcde", abcde)
    }

     
        console.log("embroidery not selected1111");

        validationForLogo();
        let embroidery_variant_id = document.querySelector('.embroidery_filled').value;
console.log("embroidery not selected1111");
          document.querySelector(".customEmbro").outerHTML += abcde;
      document.querySelector(".product-form__buttons button[type='button']").hasAttribute("disabled") ? document.querySelector(".product-form__buttons button[type='button']").removeAttribute("disabled") : "";
        document.querySelector(".original[type=submit]").click();
      } else {
        console.log("embroidery not selected");
        document.querySelector('#option-iconCustomUpload').value = '';
      updateCart();
      
      }
  
    })
    .catch(error => {
      if (error.status == 422) {
        document.querySelector('.availability-Notice').classList.add('shake');
        
        setTimeout(function () {
          document.querySelector('.availability-Notice').classList.remove('shake');
        }, 2000);
      }
      return false;
    });
  }else{
          document.querySelector("p.outofScockMsg").style.display = "block";
     setTimeout(()=>{
       document.querySelector("p.outofScockMsg").style.display = "none";
     },3000)
  }
})
}
  
  
}

document.body.addEventListener('click', function(event) {
  if (event.target.classList.contains('ProductForm__AddToCart') && event.target.getAttribute('type') === 'button') {
    console.log('trying to ATC');
    let checkSelected = checkBothSelected();
    if (checkSelected) {
      let DefaultProductvarientId = document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentNode.dataset.comboVids;
      let SecondProductVarientId = document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').parentNode.dataset.comboVids;
      let pre_pairId = `${DefaultProductvarientId}_${SecondProductVarientId}`;
   
      let quantity = document.querySelector('#addToCart_quantity').value;
      addtocartTopBottom(SecondProductVarientId, pre_pairId, quantity);
     
    } else {
      return;
    }
  }
});



function updatePrice(){
    let FirstSelected = document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentNode.dataset.price;
    let secondSelected =  document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').parentNode.dataset.price;
    let totalPrice = parseFloat(FirstSelected) + parseFloat(secondSelected);
    totalPrice = totalPrice.toString().slice(0,-2);
    if(totalPrice.length > 3) {
        totalPrice = totalPrice.substring(0,1) + ',' + totalPrice.substring(1, totalPrice.length);
    }
    let priceText = document.querySelector('.ProductMeta__PriceList .ProductMeta__Price').innerHTML;
    document.querySelector('.ProductMeta__PriceList .ProductMeta__Price').innerHTML = 'Rs. ' + totalPrice;
    if(priceText === 'Rs. ' + totalPrice + '') {
        let firstAvailability = document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentNode.dataset.qty;
        let secondAvailability =  document.querySelector('.SizeSwatchList_custom li input[type="radio"]:checked').parentNode.dataset.qty;
        let stock = (firstAvailability < secondAvailability) ? firstAvailability : secondAvailability;
    } else {
        setTimeout(updatePrice, 50);
    }
}


   document.querySelectorAll(".size_guide").forEach(eachSize=>{
     eachSize.addEventListener("click", (e)=>{
       e.target.nextElementSibling.style.display="flex";
     })
   })

    document.querySelectorAll(".size_close").forEach(eachClose=>{
     eachClose.addEventListener("click", (e)=>{
       e.target.closest(".sizeGuide").style.display="none";
     })
   })
   
 
   
  });


  


  
