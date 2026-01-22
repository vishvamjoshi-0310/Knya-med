
class CartItems extends HTMLElement {
  constructor() {
    super();

    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);
    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index,event.target, event.target.value, document.activeElement.getAttribute('name'));
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
      }
    ];
  }

   updateQuantity(line,elem, quantity, name) {
     document.querySelector("#CartDrawer-Checkout").classList.add("disabled");
    this.enableLoading(line);
     let cartQuantities = document.querySelector("#CartDrawer-Checkout");
  let giftItem = document.querySelector('.GiftCard')
  if(cartQuantities.getAttribute("item-count") == 2 && giftItem ){ 
document.querySelector("#CartDrawer-Checkout").setAttribute("disabled","true")
  }

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then(async (state) => {
let currVariantTitle = elem.closest('.cart-item').querySelector("dd.product-option__Pack")?.innerText;
const shopifyBundle__true = elem.closest('.cart-item').querySelector(".cart-size.product-option.shopifyBundle dd")?.innerText.replace(/\s/g, "");
        if(shopifyBundle__true == "true"){
    let currVariantNumber1 = currVariantTitle.match(/\d+/g)?.map(Number) || [];
    const updatedVaritentQtys = currVariantNumber1.reduce((acc, num) => acc * num, quantity);
    quantity = updatedVaritentQtys.toString();
        }

        // Get fresh cart data
        let cartRes = await fetch('/cart.js');
        if (!cartRes.ok) {
            throw new Error('Failed to fetch cart data');
        }
        let cartData = await cartRes.json();
        
        // Find all items with the same pair ID - check both data-lineitems and data-lineitem attributes
        let pairId = elem.closest('[data-lineitems]')?.getAttribute('data-lineitems') || 
                     elem.closest('[data-lineitem]')?.getAttribute('data-lineitem');
        
        if (!pairId) {
            console.warn('No pair ID found for item');
            this.handleUpdateComplete(state, line, elem, name);
            return;
        }
        
        let itemsWithSamePairId = cartData.items.filter(item => 
            item.properties && item.properties['_PairId'] == pairId
        );
        
        if (itemsWithSamePairId.length === 0) {
            console.warn('No items found with matching pair ID:', pairId);
            this.handleUpdateComplete(state, line, elem, name);
            return;
        }
        
        // Find the embroidery/engraving item (optional)
        let embroideryItem = itemsWithSamePairId.find(item => 
            (item.properties['_Embroidery'] == 'true' || item.properties['_Engraving'] == 'true')
        );
        
        // Find all main products (excluding embroidery/engraving)
        let mainProducts = itemsWithSamePairId.filter(item => 
            item.properties['_Embroidery'] != 'true' && item.properties['_Engraving'] != 'true'
        );
        
        console.log('Updating quantity to:', quantity, 'for pair ID:', pairId);
        console.log('Main products found:', mainProducts.length, 'Embroidery item:', !!embroideryItem);
        
        // Update all items with the same pair ID
        if (itemsWithSamePairId.length > 0) {
            try {
                // Create a single update object for all items
                let updatesObj = {};
                itemsWithSamePairId.forEach(item => {
                    updatesObj[item.key] = parseInt(quantity);
                });
                
                // Send single batch update request
                let cartUpdateRes = await fetch('/cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        updates: updatesObj
                    })
                });
                
                if (!cartUpdateRes.ok) {
                    throw new Error('Failed to update cart quantities');
                }
                
                let cartUpdateData = await cartUpdateRes.json();
                console.log('Cart update successful:', cartUpdateData);
                
                // Refresh the cart display
                updateCart();
                
            } catch (error) {
                console.error("Error updating cart quantities:", error);
                // Show error message to user
                this.showError('Failed to update quantities. Please try again.');
                document.querySelector("#CartDrawer-Checkout").classList.remove("disabled");
                this.disableLoading();
                return;
            }
        }
        
        // Complete the update process
        this.handleUpdateComplete(state, line, elem, name, quantity);
      }).catch((error) => {
        console.error("Error in updateQuantity:", error);
        this.showError('Failed to update quantity. Please try again.');
        this.disableLoading();
        document.querySelector("#CartDrawer-Checkout").classList.remove("disabled");
      });
  }

  handleUpdateComplete(state, line, elem, name, quantity = null) {
    let cartQuantities = document.querySelector("#CartDrawer-Checkout");
    let giftItem = document.querySelector('.GiftCard')
    if(cartQuantities.getAttribute("item-count") == 2 && giftItem ){  
      let giftCardDisabled = true;
      updateCart(giftCardDisabled);
      
       document.querySelector("#CartDrawer-Checkout").setAttribute("disabled","false")
    }   
    scrollCollection()
    const parsedState = JSON.parse(state);
    this.classList.toggle('is-empty', parsedState.item_count === 0);
    const cartDrawerWrapper = document.querySelector('cart-drawer');
    const cartFooter = document.getElementById('main-cart-footer');

    if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
    if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);
    parsedState.items.forEach(item=>{
    })
    this.getSectionsToRender().forEach((section => {
      const elementToReplace =
        document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
      elementToReplace.innerHTML =
        this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
    }));

    this.updateLiveRegions(line, parsedState.item_count);
    const lineItem = document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
    if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
      cartDrawerWrapper ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`)) : lineItem.querySelector(`[name="${name}"]`).focus();
    } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
      trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'))
    } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
      trapFocus(cartDrawerWrapper, document.querySelector('.cart-item__name'))
    }
    this.disableLoading();
    updateMaxValue();
    
    // Update max values for quantity inputs
    if(elem.closest(".CartItem")){
      let pairId = elem.closest(".CartItem").getAttribute("data-lineitem");
      let lessValue = []
      document.querySelectorAll(`[data-lineitem="${pairId}"]`).forEach(eachKey=>{
        lessValue.push(eachKey.getAttribute("data-inventoryquantity"));
      });
      let minValue = lessValue.sort(function(a, b){return a-b});
      if(quantity == minValue[0] ){
             document.querySelectorAll(`[data-lineitem="${pairId}"]`).forEach(eachKey=>{
         eachKey.querySelector(".QuantitySelector__CurrentQuantity_custom").max =minValue[0]
           })
          }
    }else{
      let cartPairId = elem.closest(".cart-item").getAttribute("data-lineitems");
      let cartlessValue = []
      document.querySelectorAll(`[data-lineitems="${cartPairId}"]`).forEach(eachKey=>{
        cartlessValue.push(eachKey.getAttribute("data-inventoryquantity"));
      });
      let CartminValue = cartlessValue.sort(function(a, b){return a-b});
      if(quantity == CartminValue[0] ){
             document.querySelectorAll(`[data-lineitems="${cartPairId}"]`).forEach(eachKey=>{
         eachKey.querySelector(".cart-item__quantity-wrapper .quantity__input").max =CartminValue[0]
           })
          }
    }
  }

  showError(message) {
    // Show error message to user
    const errorElement = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      
      // Hide error after 5 seconds
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 5000);
    }
  }

  updateLiveRegions(line, itemCount) {

    if (this.currentItemCount === itemCount) {
      const lineItemError = document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
      const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
      lineItemError
        .querySelector('.cart-item__error-text')
        .innerHTML = window.cartStrings.quantityError.replace(
          '[quantity]',
          quantityElement.value
        );
    }

    this.currentItemCount = itemCount;
    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus = document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.add('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading() {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.remove('cart__items--disabled');
  }
}

customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
  customElements.define('cart-note', class CartNote extends HTMLElement {
    constructor() {
      super();

      this.addEventListener('change', debounce((event) => {
        
        const body = JSON.stringify({ note: event.target.value });
        fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
      }, 300))
    }
  });
};

function updateMaxValue(){
let pairIdArr = []
document.querySelectorAll(".cart-item").forEach(cartItem=>{
    let pairId = cartItem.getAttribute("data-lineitems") ;
    if(pairId)   pairIdArr.push(pairId) 
})
uniq = [...new Set(pairIdArr)];
    let itemQty = [];
  let itemValue = [];
let UniKey = []
uniq.forEach(eachUniqueId=>{
  document.querySelectorAll(`[data-lineitems="${eachUniqueId}"]`).forEach(lineItem=>{
    itemQty.push(parseInt(lineItem.getAttribute("data-inventoryquantity")))
  })

let lessValue = Math.min(...itemQty)
  if(document.querySelector(`[data-lineitem="${eachUniqueId}"]`)){
          document.querySelectorAll(`[data-lineitem="${eachUniqueId}"]`).forEach(lineItems=>{
        lineItems.querySelector(".quantity .QuantitySelector__CurrentQuantity_custom").max = lessValue;

  })
  }
        document.querySelectorAll(`[data-lineitems="${eachUniqueId}"]`).forEach(lineItem=>{
        lineItem.querySelector(".quantity .quantity__input").max = lessValue;
  })
})
}



window.addEventListener("load", (event) => {
  updateMaxValue();
});