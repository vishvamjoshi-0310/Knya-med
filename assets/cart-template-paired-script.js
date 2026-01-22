// console.log('sdbkcsdbk==============================================');

// // function checkInventoryLimit(line_item_prop,currentInventoryItem){
// //   console.log(1);
// //   // Here we are checking whether the combo items, added into cart, are added according to availability... minimum among the two should be the maximum cart limit for that combo
// //   console.log("comparing inventory");
// //   let inventoryLimitOne = undefined;
// //   let inventoryLimitTwo = undefined;
// //   let maxLImit = 0;
// //   let cartItems = document.querySelectorAll('.Cart__ItemList .CartItem[data-lineitem="'+line_item_prop+'"]');
  
// //   cartItems.forEach(function(element){
// //     let customtype = element.getAttribute('data-customtype');
// //     if(customtype !== 'embroidery'){
// //       if(inventoryLimitOne === undefined){
// //         inventoryLimitOne = element.getAttribute('data-inventoryquantity');
// //       } else {
// //         inventoryLimitTwo = element.getAttribute('data-inventoryquantity');
// //       }
// //     }
// //   });

// //   if(inventoryLimitOne !== undefined && inventoryLimitTwo !== undefined){
// //     maxLImit = (inventoryLimitOne < inventoryLimitTwo) ? inventoryLimitOne : inventoryLimitTwo;
// //     console.log(maxLImit);
// //     return (currentInventoryItem < maxLImit ? true : false);
// //   } else {
// //     return;
// //   }
// // }

// function updateByCartLine(qtylineitem,qty) {
//   console.log(2);
//   fetch(`/cart/change?line=${qtylineitem}&quantity=${qty}`, {
//     method: 'POST'
//   })
//   .then(response => response.json())
//   .then(itemData => {
//     console.log("success and reload");
//     // location.reload();
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
// }

// // function updateCartLineNoReload(qtylineitem,qty) {
// //   console.log(3);


// //   fetch('/api/cart.js', {
// //   method: 'POST',
// //   headers: {
// //     'Content-Type': 'application/json'
// //   },
// //   body: data
// // })
// // .then(response => {
// //   if (response.ok) {
// //      } else {
// //     console.error('Error updating cart:', response.status);
// //   }
// // })
// // .catch(error => {
// //   console.error('Error updating cart:', error);
// // });
// // }
// //   fetch(`/cart/change?line=${qtylineitem}&quantity=${qty}`, {
// //     method: 'POST'
// //   })
// //   .then(response => response.json())
// //   .then(itemData => {
// //     console.log("success and no-reload");
// //   })
// //   .catch(error => {
// //     console.error('Error:', error);
// //   });
// // }

// // }

// function checkEmbroideryAvailable(ElementToRemove) {
//   console.log(4);

//   let elementToRemove = ElementToRemove;
//   let elementCustomType = elementToRemove.closest('.CartItem').getAttribute('data-customtype');
//   elementCustomType = elementCustomType.toLowerCase();

//   if (elementCustomType !== '' && elementCustomType === 'embroidery') {
//     console.log("remove item directly");
//     let itemLineNumber = elementToRemove.dataset.line;
//     console.log(itemLineNumber);

//     let embroideryVid = elementToRemove.dataset.id + '';
//     let elementPairId = elementToRemove.closest('.CartItem').getAttribute('data-lineitem');

//     if (elementPairId.includes(embroideryVid)) {
//       let attachedProduct = document.querySelector('.CartItem[data-lineitem="' + elementPairId + '"][data-customtype!="Embroidery"] .CartItem__Actions .CartItem__QuantitySelector .QuantitySelector input');
//       let line = attachedProduct.dataset.line;
//       let qty = attachedProduct.value;
//       if (attachedProduct !== undefined) {
//         removePairIdWhenEmbroideryIsRemoved(line, qty);
//       }
//     }

//     updateByCartLine(itemLineNumber, 0);
//   } else {
//     console.log("non embro");

//     let lineItemProp = elementToRemove.closest('.CartItem').getAttribute('data-lineitem');
//     // console.log(lineItemProp);
//     let cartElements = document.querySelectorAll('.CartItem[data-lineitem="' + lineItemProp + '"]');
//      // console.log(cartElements);
//     let linesOfItems = [];
//     cartElements.forEach(function(cartElement) {
//       let itemLineNumber = cartElement.querySelector('.remove_itemfromcart').dataset.id;
//       linesOfItems.push(itemLineNumber);
//     });
//     let itemsArry =[];
//     for (let i = 0; i<linesOfItems.length; i++) {
//        // console.log(linesOfItems[i]);
//        itemsArry.push({id: linesOfItems[i], quantity: 0});    
//     }  
    
//      fetch('/cart/change.js', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     items:itemsArry
//   })
// })
// .then(response=>response.json()).then(response=>console.log(response))
// .catch(error => {
//   console.error('Error updating cart:', error);
// });

//     // location.reload();
//   }
// }

// // function removePairIdWhenEmbroideryIsRemoved(line, qty) {
// //   console.log(5);
// //   console.log("removing pairid from non embroidery");

// //   fetch('/cart/change.js', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json'
// //     },
// //     body: JSON.stringify({
// //       line: line,
// //       quantity: qty,
// //       properties: { PairId: '' }
// //     })
// //   })
// //   .then(response => {
// //     if (response.ok) {
// //       console.log("line-item-removed");
// //     } else {
// //       throw new Error('Network response was not ok.');
// //     }
// //   })
// //   .catch(error => {
// //     console.error('There was a problem with the fetch operation:', error);
// //   });

// //   console.log("skip");
// // }

// //   //  remove item start

//  document.querySelectorAll('.remove_itemfromcart').forEach(remove_item=>{
// remove_item.addEventListener('click', function(e) {
//   // if (e.target.classList.contains('remove_itemfromcart')) {
//     e.preventDefault();
//     console.log("remove item from cart===============================");
//     let combo_variants = e.target.closest('.CartItem').getAttribute('data-lineitem');
//     console.log(combo_variants);
//     if (combo_variants != '') {
//       console.log("remove combo");
//       checkEmbroideryAvailable(e.target);
//     } else {
//       console.log("remove normal");
//       let qtylineitem = e.target.getAttribute('data-line');
//       updateByCartLine(qtylineitem, 0);
//     }
//   //}
// });
//  });

// // document.querySelectorAll('.qtyplus').forEach(eachPlus=>{
// //   eachPlus.addEventListener('click', function(e) {
// //     e.preventDefault();
// //     let currentInventoryItem = e.target.previousElementSibling.value;
// //     let combo_variantId = e.target.parentNode.getAttribute('data-lineitemprop');
// //     if (combo_variantId != '') {
// //       let inventoryCheck = checkInventoryLimit(combo_variantId, currentInventoryItem);
// //       if (inventoryCheck) {
// //         e.target.previousElementSibling.value = parseInt(e.target.previousElementSibling.value) + 1;
// //         let newQuantity = e.target.previousElementSibling.value;
// //         let array_of_combos = Array.from(document.querySelectorAll('.CartItem[data-lineitem="' + combo_variantId + '"]'));
// //         array_of_combos.forEach(function(comboElement) {
// //           let customtype = comboElement.dataset.customtype;
// //           customtype = customtype.toLowerCase();
// //           let lineNumber = comboElement.querySelector('.QuantitySelector input').getAttribute('data-line');
// //           console.log("update line " + lineNumber);
// //           updateCartLineNoReload(lineNumber, newQuantity);
// //         });
// //         // location.reload();
// //       } else {
// //         console.log("Inventory Limit Exceeded for combo");
// //         return;
// //       }
// //     } else {
// //       let quantityLimit = e.target.closest('.CartItem').getAttribute('data-inventoryquantity');
// //       if (currentInventoryItem < quantityLimit) {
// //         e.target.previousElementSibling.value = parseInt(e.target.previousElementSibling.value) + 1;
// //         let cartLine = e.target.getAttribute('data-line');
// //         let newQuantity = e.target.previousElementSibling.value;
// //         updateByCartLine(cartLine, newQuantity);
// //       } else {
// //         console.log("Inventory Limit Exceeded for regular");
// //         return false;
// //       }
// //     }
  
// // });
// // })

// // document.addEventListener('click', function(e) {
// //   if (e.target.matches('.qtyminus')) {
// //     e.preventDefault();
// //     if (e.target.nextElementSibling.value > 1) {
// //       e.target.nextElementSibling.value = +e.target.nextElementSibling.value - 1;
// //     }
// //     let combo_variantId = e.target.parentNode.dataset.lineitemprop;
// //     let newQuantity = e.target.nextElementSibling.value;
// //     if (combo_variantId) {
// //       console.log("for combo");
// //       let array_of_combos = [...document.querySelectorAll(`.CartItem[data-lineitem="${combo_variantId}"]`)];
// //       array_of_combos.forEach(function(comboElement){
// //         let embroideryCheck = comboElement.dataset.customtype.toLowerCase();
// //         let lineNumber = comboElement.querySelector('.QuantitySelector input').dataset.line;
// //         // updateCartLineNoReload(lineNumber, newQuantity);
// //       });
// //       //location.reload();
// //     } else {
// //       console.log("not combo"); 
// //       let qtylineitem = e.target.dataset.line; 
// //       updateByCartLine(qtylineitem, newQuantity);
// //     }
// //   }
// // });

// // function customUploadCheck(){
// //   console.log(6);

// //   let reloadFlag = false;
// //   const cartItems = document.querySelectorAll('.CartItem');
// //   cartItems.forEach((item)=>{
// //     let img = item.querySelector('.CartItem__Info .CartItem__Meta .CartItem__PropertyList li img');
// //     if(img !== undefined){
// //       console.log(img);
// //       let src = img.src;
// //       console.log(src);
// //       let pairId = item.dataset.lineitem;
// //       console.log(pairId);
// //       let relatedEmbroidery = document.querySelector(`.CartItem[data-lineitem='${pairId}'][data-customtype='Embroidery']`);
// //       if(relatedEmbroidery !== undefined){
// //         let hasCustomUpload = relatedEmbroidery.dataset.customUpload;
// //         console.log("$$$$$$$$$$$");
// //         console.log(hasCustomUpload);
// //         let embroideryDataSrc = document.querySelector(`.CartItem[data-lineitem='${pairId}'][data-customtype='Embroidery']`).dataset.customlogo;
// //         if(hasCustomUpload !== 'true' || embroideryDataSrc !== src){
// //           console.log("not true");
// //           let cartLine = relatedEmbroidery.dataset.cartline;
// //           let qty = document.querySelector(`.CartItem[data-lineitem='${pairId}'][data-customtype='Embroidery'] .CartItem__Info .CartItem__Actions .CartItem__QuantitySelector input`).value;
// //           console.log(`embroidery is customLogo Type and Logo is not visible`);
// //           console.log(`===========on line${cartLine}`);
// //           console.log(`=========== with quantity${qty}`);
// //           let line = cartLine -1 ;
// //           let ItemProperties ={};

// //           fetch('/cart.js')
// //             .then(response => response.json())
// //             .then(data => {
// //               ItemProperties = data.items[line].properties;
// //               ItemProperties.customUpload = src;
// //               addLineItemToEmbroidery(cartLine, ItemProperties, qty);
// //               removeLineItemsFrom_nonEmbroidery();
// //               reloadFlag = true; 
// //             })
// //             .catch(error => {
// //               console.error('Error:', error);
// //             });
// //         } else {
// //           reloadFlag = false;
// //         }
// //       }
// //     }
// //   });

// //   if(reloadFlag === true) {
// //     console.log("reloading");
// //     //location.reload();
// //   }
// // }

// // function removeLineItemsFrom_nonEmbroidery() {
// //   console.log(7);
// //   console.log("Remove line item from embroidery");
// //   let non_embroidery = [...document.querySelectorAll('.CartItem[data-customtype!=Embroidery]')];
// //   non_embroidery.reverse();
// //   non_embroidery.map(item => { 
// //     let item_line = item.dataset.cartline;
// //     console.log("removing on line");
// //     let pairId = item.dataset.lineitem;
// //     let item_qty = item.querySelector('input.QuantitySelector__CurrentQuantity_custom').value;
// //     console.log("line= "+item_line);
// //     console.log("qty = "+ item_qty);
// //     let hasLogo = item.dataset.customUpload;
// //     if (hasLogo == 'true') {
// //       fetch('/cart/change.js', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //           line: item_line,
// //           quantity: item_qty,
// //           properties: {
// //             PairId: pairId
// //           }
// //         })
// //       })
// //       .then(response => response.json())
// //       .then(data => {
// //         console.log("line-item-removed");
// //       })
// //       .catch(error => {
// //         console.error('Error:', error);
// //       });
// //     }
// //   });
// // }

// // function addLineItemToEmbroidery(cartLine, ItemProperties, qty) {
// //   console.log(8);

// //   console.log(ItemProperties);

// //   fetch('/cart/change.js', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json'
// //     },
// //     body: JSON.stringify({
// //       line: cartLine,
// //       quantity: qty,
// //       properties: ItemProperties
// //     })
// //   })
// //   .then(response => response.json())
// //   .then(data => {
// //     console.log("line-item-added");
// //   })
// //   .catch(error => console.error(error));
// // }

// //  // check cart items are less or equal to the inventoryQuantity and set them to minimum
// // function inventoryQuantityCheck() {
// //   console.log(10);

// //   let reloadFlag = false;
// //   let testedPairIds = {};
// //   console.log("Inventory Quantity Check for pairIds");

// //   let pairedItems = [...document.querySelectorAll('.Cart__ItemList .CartItem[data-lineitem]')];
// //   pairedItems.forEach((item, index) => {
// //     console.log("LOOP =" + index);
// //     let inventory = item.dataset.inventoryquantity;
// //     inventory = parseInt(inventory);
// //     let inputQuantity = item.dataset.inputvalue;
// //     inputQuantity = parseInt(inputQuantity);

// //     console.log("input = " + inputQuantity + " and inventory = " + inventory);

// //     if (!(inputQuantity <= inventory)) {
// //       console.log("item failed test");
// //       let lineNumber = item.dataset.cartline;
// //       console.log("setting minimum =" + inventory);
// //       updateCartLineNoReload(lineNumber, inventory);
// //       reloadFlag = true;
// //     } else {
// //       console.log("Item passed test");
// //     }
// //   });

// //   if (reloadFlag) {
// //     console.log("quantities were updated so reloading");
// //     // location.reload();
// //   } else {
// //     console.log("quantities are added right into cart");
// //   }
// // }

// //   // validation when quantity is 0 or quantities of pair items doesn't match.
// // function matchQuantity() {
// //   console.log(11);

// //   let testedPairIds = {};
// //   let reloadFlag = false;
// //   const allCartElements = [...document.querySelectorAll('.CartItem[data-lineitem]')];
// //   allCartElements.map((cartItem) => {
// //     let pairId = cartItem.dataset.lineitem;
// //     if (testedPairIds[`${pairId}`] == undefined && pairId != '') {
// //       testedPairIds[`${pairId}`] = pairId;
// //       console.log(testedPairIds);
// //       let pairItems = [...document.querySelectorAll(`.CartItem[data-lineitem='${pairId}']`)];
// //       console.log(pairItems);
// //       let qty_1, qty_2, qty_3 = undefined;
// //       if (pairItems.length > 1) {
// //         pairItems.forEach((item, index) => {
// //           if (index == 0) {
// //             qty_1 = item.dataset.inputvalue;
// //             qty_1 = parseInt(qty_1);
// //           }
// //           if (index == 1) {
// //             qty_2 = item.dataset.inputvalue;
// //             qty_2 = parseInt(qty_2);
// //           }
// //           if (index == 2) {
// //             qty_3 = item.dataset.inputvalue;
// //             qty_3 = parseInt(qty_3);
// //           }
// //         });
// //         console.log(qty_1, qty_2, qty_3);
// //         let comparedResult = compareQuantity(qty_1, qty_2, qty_3);
// //         console.log(comparedResult);
// //         if (!comparedResult) {
// //           console.log("Quantity is not equal");
// //           let newQuantity = getminimumInputValue(qty_1, qty_2, qty_3);
// //           console.log("setting new Quantity =" + newQuantity);
// //           pairItems.forEach((item, index) => {
// //             let lineNumber = item.dataset.cartline;
// //             updateCartLineNoReload(lineNumber, newQuantity);
// //             reloadFlag = true;
// //           });
// //         }
// //       } else {
// //         console.log("Pair is incomplete, remove item from cart");
// //         let lineNumber = pairItems[0].dataset.cartline;
// //         updateCartLineNoReload(lineNumber, 0);
// //         reloadFlag = true;
// //       }
// //     } else {
// //       console.log("Already tested");
// //     }
// //   });

// //   if (reloadFlag == true) {
// //     console.log("Reload");
// //     //location.reload();
// //   } else {
// //     checkoutProcessing();
// //   }
// // }

// //   // returns true if quantity match else  returns false
// // function compareQuantity(qty_1, qty_2, qty_3) {
// //   console.log(12);
// //   console.log("comparing quantity");
  
// //   if (qty_3 !== undefined) {
// //     if (qty_2 !== undefined && qty_1 !== undefined) {
// //       if (qty_1 === qty_2 && qty_2 === qty_3) {
// //         return true;
// //       } else {
// //         return false;
// //       } 
// //     } else {
// //       console.log("remove pair from cart");
// //       //updateCartLineNoReload(lineNumber,newQuantity);
// //     }
// //   } else {
// //     if (qty_2 !== undefined && qty_1 !== undefined) {
// //       if (qty_1 === qty_2) {
// //         return true;
// //       } else {
// //         return false;
// //       }
// //     } else {
// //       console.log("remove pair from cart");
// //     }
// //   }
// // }

// //   // returns minimum among three or two quantites.
// // function getminimumInputValue(qty_1, qty_2, qty_3) {
// //   console.log(13);
// //   console.log("get minimum");

// //   if (qty_3 !== undefined) {
// //     if (qty_2 !== undefined) {
// //       let min1 = qty_1 > qty_2 ? qty_2 : qty_1;
// //       let min2 = min1 < qty_3 ? min1 : qty_3;
// //       return min1 < min2 ? min1 : min2;
// //     }      
// //   } else {
// //     return qty_1 > qty_2 ? qty_2 : qty_1;
// //   } 
// // }

// //   customUploadCheck();
// //   inventoryQuantityCheck();
// //   matchQuantity();

// // function checkoutProcessing() {
// //   console.log("CHECKOUT PROCESSING FUNCTION");
// //   document.addEventListener("DOMContentLoaded", function() {
// //     document.querySelector('body').addEventListener('click', function(e) {
// //       if (e.target.matches('button.Checkout-quantityLimitCheck[type=button]')) {
// //         console.log("CHECKOUT CLICKED");
// //         localStorage.setItem("cartReload", "true");
// //         //location.reload();
// //         // soldOut_Validation();
// //       }
// //     });

// //     let reloadStatus = localStorage.getItem("cartReload");
// //     // console.log(reloadStatus);

// //     if (reloadStatus != null && reloadStatus == "true") {
// //       localStorage.setItem("cartReload", "false");
// //       console.log("set back false and going checkout");
// //       document.querySelector('button.Checkout-quantityLimitCheck[type=button]').setAttribute('type', 'submit');
// //       document.querySelector('button.Checkout-quantityLimitCheck[type=button]').click();
// //     }
// //   });
// // }

