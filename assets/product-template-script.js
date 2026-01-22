(function runCommonOnLoad() {
  // reset embroidery checked
  document.querySelectorAll('input.embroidery_filled').forEach(function(el) {
    el.checked = false;
  });
  document.querySelector('#option-iconCustomUpload').value = '';
})();
// ========================================================================================
function isEmbroiderySelected() {
  let embroideryShown = document.querySelector('.embroidery-box .wrapp .added_list .wrap .left input');
  if (embroideryShown !== null) {
    let embroideryChecked = embroideryShown.checked;
    if (embroideryChecked) {
      return true;
    } else {
      document.querySelector('#option-iconCustomUpload').value = '';
      return false;
    }
  } else {
    return false;
  }
}
// =========================================================================================
function combo_line_item_creator(embroideryVariantId) {
  let DefaultProductvarientId = document.querySelector('.SizeSwatchList li input[type="radio"]:checked').parentNode.dataset.variantid;
  let line_item_property = `${DefaultProductvarientId}_${embroideryVariantId}`;
  return line_item_property;
}
// =================================================================================================
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
            lineItemProperty[data] = details[dataId];
          } else if (data === 'position' && flag_for_position === true) {
            let dataId = data;
            data = 'Icon Placement';
            lineItemProperty[data] = details[dataId];
          } else {
            lineItemProperty[data] = details[data];
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
    return false;
  }
}
// =========================================================================================
function addEmbroideryIntoCart(variant_id, line_item_property, quantity) {
  let pairId = line_item_property.PairId;
  quantity = Number(quantity);
  let response = checkForExistingEmbroideryWithThisLineItem(pairId);
  if (response) {
    quantity += response;
  }

  let data = {
    "id": variant_id,
    "quantity": quantity,
    properties: line_item_property
  };

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    //add pairId into default form here 
    runDefaultProductCode(line_item_property.PairId);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    if (error.status == 422) {
      document.querySelector('.availability-Notice').classList.add('shake');
      setTimeout(function() { document.querySelector('.availability-Notice').classList.remove('shake'); }, 2000);
    }
    return false;
  });
}
// =========================================================================================
function runDefaultProductCode(){
  document.querySelector('.addtocartForEmbroidery').setAttribute('type', 'submit');
  document.querySelector('.addtocartForEmbroidery').click();
}
// ==============================================================================================
function validationForLogo() {
  let embroideryInputSelected = document.querySelector('.variant_box[data-open=true]');
  if (embroideryInputSelected !== undefined) {
    let iconic = document.querySelector('.variant_box[data-open=true] .variant_selection_wrap .form_content .form_wrapper-icon .optionbox .customUploadImageEmbroidery input');
    if (iconic !== undefined) {
      let customLogoSelected = document.querySelector('.variant_box[data-open=true] .variant_selection_wrap .form_content .form_wrapper-icon .optionbox .customUploadImageEmbroidery input').checked;
      if (customLogoSelected !== true) {
        document.querySelector('#option-iconCustomUpload').value = '';
      }
    } else {
      document.querySelector('#option-iconCustomUpload').value = '';
    }
  } else {
    document.querySelector('#option-iconCustomUpload').value = '';
  }
}
// ========================================================================================
function checkForExistingEmbroideryWithThisLineItem(currentPairId) {
  let embroidery_quantity;
  let embroidery_line;
  fetch('/cart.js')
    .then(response => response.json())
    .then(data => {
      let cartItems = data.items;
      cartItems.forEach((item, index) => {
        if (item.properties.Embroidery === 'true' && item.properties.PairId === currentPairId) {
          embroidery_quantity = item.quantity;
          embroidery_line = index + 1;
        } else {
        }
      }); 
      if (embroidery_line !== undefined) {
        removeEmbroideryFromCart(embroidery_line, 0);
        return embroidery_quantity;
      } else {
        return;
      }
    })
    .catch(error => console.error('Error fetching data: ', error));
}
// ===============================================================================================
function removeEmbroideryFromCart(qtylineitem, qty) {
  fetch(`/cart/change?line=${qtylineitem}&quantity=${qty}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({}),
    dataType: 'json',
  })
    .then(response => response.json())
    .then(itemData => {
      console.log("success and no-reload");	
    })
    .catch(error => console.error('Error removing embroidery from cart: ', error));
}
// =====================================================================================
document.querySelector("body").addEventListener("click", function(event) {
  if (event.target.matches(".addtocartForEmbroidery[type='button']")) {
    console.log("trying to ATC");
    let checkSelected = isEmbroiderySelected();
    console.log(checkSelected);
    if (checkSelected) {
      console.log("embroidery is selected");
      validationForLogo();
      let embroideryVariantId = document.querySelector(".embroidery-box .wrapp .added_list .wrap .left input:checked").value;
      let combo_pairId = combo_line_item_creator(embroideryVariantId);
      document.querySelector(".defaultProductsLineItemInput").value = combo_pairId;
      // additional line_item_properties for embroidery;
      let lineItemProperties = getEmbroideryData();
      if (lineItemProperties !== false) {
        let sku = document.querySelector(".SizeSwatchList .HorizontalList__Item input:checked").parentElement.dataset.sku;         
        lineItemProperties['PairId'] = `${combo_pairId}`;
        lineItemProperties['Embroidery'] = true;  
        lineItemProperties['SKU']=sku;
        //  return;
        let quantity = document.querySelector(".QuantitySelector__CurrentQuantity").value;
        addEmbroideryIntoCart(embroideryVariantId, lineItemProperties, quantity);
      }
    } else {
      runDefaultProductCode();    
    }
  }
});


