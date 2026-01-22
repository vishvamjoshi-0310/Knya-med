addEventListener('DOMContentLoaded', (event) => {
  document.querySelector('body').addEventListener('click', function (event) {
    const clickedElement = event.target
    if (event.target.classList.contains('cart-drawer__overlay')) {
      document.querySelector('.drawer__close').click()
    }
  })
})

class CartDrawer extends HTMLElement {
  constructor() {
    super()

    this.addEventListener(
      'keyup',
      (evt) => evt.code === 'Escape' && this.close()
    )
    this.querySelector('#CartDrawer-Overlay').addEventListener(
      'click',
      this.close.bind(this)
    )
    this.setHeaderCartIconAccessibility()
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble')
    cartLink.setAttribute('role', 'button')
    cartLink.setAttribute('aria-haspopup', 'dialog')
    cartLink.addEventListener('click', (event) => {
      event.preventDefault()
      this.open(cartLink)
    })
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault()
        this.open(cartLink)
      }
    })
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy)
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary')
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role'))
      this.setSummaryAccessibility(cartDrawerNote)
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active')
      const rewardBtn = document.querySelector('.nector-btn-container')
      if (rewardBtn) rewardBtn.style.display = 'none'
    })

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer')
        const focusElement =
          this.querySelector('.drawer__inner') ||
          this.querySelector('.drawer__close')
        trapFocus(containerToTrapFocusOn, focusElement)
      },
      { once: true }
    )

    document.body.classList.add('overflow-hiddens');
    document.querySelector('button#pop-club-quick-buy3')?.classList.add('hidden');
  }

  close(e) {
    document.body.classList.remove('overflow-hiddens')
    this.classList.remove('active')
    document.querySelector('body').classList.remove('overflow-hiddens')
    const rewardBtn = document.querySelector('.nector-btn-container')
    if (rewardBtn) rewardBtn.style.display = 'inline-flex'

    removeTrapFocus(this.activeElement)
    document.querySelector('button#pop-club-quick-buy3')?.classList.remove('hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button')
    cartDrawerNote.setAttribute('aria-expanded', 'false')

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute(
        'aria-controls',
        cartDrawerNote.nextElementSibling.id
      )
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute(
        'aria-expanded',
        !event.currentTarget.closest('details').hasAttribute('open')
      )
    })

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape)
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty')
    this.productId = parsedState.id
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section?.id)
      sectionElement.innerHTML = this.getSectionInnerHTML(
        parsedState?.sections[section.id],
        section.selector
      )
    })

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener(
        'click',
        this.close.bind(this)
      )
      this.open()
    })
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ]
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector)
  }

  setActiveElement(element) {
    this.activeElement = element
  }
}

customElements.define('cart-drawer', CartDrawer)

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ]
  }
}

customElements.define('cart-drawer-items', CartDrawerItems)

function cartQuantityUpdate(elem) {
  const pairId = elem.closest('.cart-item').getAttribute('data-lineitems')
  const currentQnty = elem.value

  const uniqueKey = []
  const inventoryQty = []
  document
    .querySelectorAll(`[data-lineitems="${pairId}"]`)
    .forEach((eachKey) => {
      uniqueKey.push(eachKey.getAttribute('data-key'))
      inventoryQty.push(eachKey.getAttribute('data-inventoryquantity'))
    })

  const lessValue = inventoryQty.sort((a, b) => a - b)

  const updatesObj = {}
  uniqueKey.forEach((x) => {
    updatesObj[x] = currentQnty
  })
  let cartQuantities = document.querySelector("#CartDrawer-Checkout");
  let giftItem = document.querySelector('.GiftCard')
  let attri = giftItem?.getAttribute('data-key')
  if(cartQuantities.getAttribute("item-count") == 2 && giftItem ){
    updatesObj[attri] = 0
  }
  
  const data = { updates: updatesObj }
  const options = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }

  scrollCollection()
  fetch('/cart/update.js', options).then((x) => x.json())
}


async function updateCart(giftCard) {
  let giftItem = document.querySelector('.GiftCard')
  if (giftCard && giftItem) {
    let attri = giftItem.getAttribute('data-key')
    const updatesObj = {}
    updatesObj[attri] = 0
    const data = {
      updates: updatesObj,
    }
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    await fetch('/cart/update.js', options).then((x) => x.json())
  }
  await fetch(`${routes.cart_url}?id=CartDrawer`)
    .then((data) => data.text())
    .then((result) => {
      var parser = new DOMParser()
      var doc3 = parser.parseFromString(result, 'text/html')
      document.querySelector('.drawer__inner').innerHTML =
        doc3.documentElement.querySelector('.drawer__inner').innerHTML

      if (
        !document
          .querySelector('cart-drawer-items')
          .classList.contains('is-empty')
      ) {
        document.querySelector('.drawer__header').style.display = 'block'
        document.querySelector(
          'cart-drawer-items .cart-drawer__form'
        ).style.display = 'flex'
      } else {
        document.querySelector('.drawer__header').style.display = 'none'

        const cartDrawerWarnings = document.querySelector(
          '.cart-drawer__warnings'
        )
        const cartEmptyText = document.querySelector('.cart__empty-text')

        if (cartDrawerWarnings) cartDrawerWarnings.style.display = 'flex'
        if (cartEmptyText) cartEmptyText.style.display = 'block'
      }
    })
    .then(() => {
      if (giftCard) {
        if (document.querySelector('.giftBoxLoader'))
          document.querySelector('.giftBoxLoader').style.display = 'none'
        if (document.querySelector('.giftInput label'))
          document.querySelector('.giftInput label').style.pointerEvents =
            'unset'
      }
      const cartDrawer = document.querySelector('cart-drawer')
      if (cartDrawer.classList.contains('is-empty'))
        cartDrawer.classList.remove('is-empty')
      document.querySelector('.atcLoder')?.classList.add('hidden')

      if (
        document.querySelector(
          '.ProductForm__AddToCart .loading-overlay__spinner'
        ) &&
        !document
          .querySelector('.ProductForm__AddToCart .loading-overlay__spinner')
          .classList.contains('hidden')
      )
        document
          .querySelector('.ProductForm__AddToCart .loading-overlay__spinner')
          .classList.remove('pdpLoader')
      if (
        document.querySelector(
          '.ProductForm__AddToCart .loading-overlay__spinner'
        )
      )
        document.querySelector(
          '.ProductForm__AddToCart .loading-overlay__spinner'
        ).style.display = 'none'
      cartDrawer.classList.add('active')

      const productFormButton = document.querySelector(
        ".product-form__buttons button[type='button']"
      )
      if (productFormButton && productFormButton.hasAttribute('disabled')) {
        productFormButton.removeAttribute('disabled')
      }

      document.querySelector('body').classList.add('overflow-hiddens')
      groupCartItemsByPair();
    })

  await fetch(`${routes.cart_url}?id=cart-icon-bubble`)
    .then((data1) => data1.text())
    .then((result) => {
      var parser = new DOMParser()
      var doc3 = parser.parseFromString(result, 'text/html')
      if (doc3.documentElement.querySelector('#cart-icon-bubble ')) {
        document.querySelector('#cart-icon-bubble ').innerHTML =
          doc3.documentElement.querySelector('#cart-icon-bubble ').innerHTML
      }
    })

  scrollCollection();
  updatedGiftBox()
}
window.updatedGiftBox = async function() {
  if (!document.querySelector('input[data-gift-box-type]')) {
    try {
      // Fetch cart data
      const cartResponse = await fetch('/cart.js');
      const cart = await cartResponse.json();

      let giftBoxItems = [];

      // Find all items with _giftbox property set to 'true'
      cart.items.forEach(item => {
        if (item.properties && item.properties._giftbox === 'true') {
          giftBoxItems.push(item.key);
        }
      });

      // If gift box items found, remove them
      if (giftBoxItems.length > 0) {
        let updates = {};
        giftBoxItems.forEach(key => {
          updates[key] = 0;
        });
        try {
          const updateResponse = await fetch('/cart/update.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updates }),
          });

          await updateResponse.json();

          // Refresh cart after removing gift box items
          if (typeof updateCart === "function") {
            updateCart();
          }
        } catch (error) {
          console.error('Error removing gift box items:', error);
        }
      }
    } catch (error) {
      console.error('Error checking cart for gift box items:', error);
    }
  }
};



function cartDeleteItem(elem) {
  let pairId = elem.closest('.cart-item').getAttribute('data-lineitems')
  let dataKey = []
  dataKey.push(elem.closest('.cart-item').getAttribute('data-key'))
  let GiftCard = document.querySelector('.GiftCard')
  let cartLength = document.querySelectorAll('.cart-item').length
  let pairIdLength = document.querySelectorAll(
    `[data-lineitems="${pairId}"]`
  ).length
  uniqueKey = []
  let lineValuesIndex = []

  document
    .querySelectorAll(`[data-lineitems="${pairId}"]`)
    .forEach((eachKey, index) => {
      uniqueKey.push(eachKey.getAttribute('data-key'))
    })
  if (GiftCard) {
    if (pairIdLength == cartLength - 1 || cartLength == 2) {
      elem.closest('.cart-item').hasAttribute('data-lineitems')
        ? uniqueKey.push(
            document.querySelector('.GiftCard').getAttribute('data-key')
          )
        : dataKey.push(
            document.querySelector('.GiftCard').getAttribute('data-key')
          )
    }
  }

  let updatesObj = {}
  if (elem.closest('.cart-item').hasAttribute('data-lineitems')) {
    uniqueKey.forEach((x) => {
      updatesObj[x] = 0
    })
  } else {
    dataKey.forEach((x) => {
      updatesObj[x] = 0
    })
  }

  const data = {
    updates: updatesObj,
  }
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }

  fetch('/cart/update.js', options)
    .then((x) => x.json())
    .then(() => {
      updateCart()
    })
}
window.addEventListener('DOMContentLoaded', (event) => {
  document.documentElement.addEventListener('cart:refresh', () => {
    updateCart()
  })
})

function addGiftBox() {
  let cart =
    document.querySelector('cart-notification') ||
    document.querySelector('cart-drawer')
  let checkbox = document.querySelector('input#giftBox')
  let variantId = checkbox.value
  
  document.querySelector('.giftBoxLoader').style.display = 'flex'
  document.querySelector('.giftInput label').style.pointerEvents = 'none'
  document.querySelector("input[name='giftBox']").style.visibility = 'hidden'
  let url = '/cart/add.js'
  let quantity = 1
  let updatesObj = {}
  let data = {
    items: [
      {
        id: variantId,
        quantity: quantity,
        properties: {
          "_giftbox": "true"
        }
      },
    ],
  }
  if (!checkbox.checked) {
    if (
      document.querySelector('.cart__note ').classList.contains('ShowCartNote')
    )
      document.querySelector('.cart__note').classList.remove('ShowCartNote')
    url = '/cart/update.js' // Set the URL for updating the cart.
    let DataKey = checkbox.getAttribute('data-key')
    updatesObj[DataKey] = 0
    data = {
      updates: updatesObj,
    }
  } else {
    document.querySelector('.cart__note ').classList.add('ShowCartNote')
  }

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((result) => {
      let giftCard
      updateCart(giftCard)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}


