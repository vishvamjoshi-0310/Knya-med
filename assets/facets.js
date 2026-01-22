class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);

    }, 500);

    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);

    }
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const countContainer = document.getElementById('ProductCount');
    const countContainerDesktop = document.getElementById('ProductCountDesktop');
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
    if (countContainer) {
      countContainer.classList.add('loading');
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add('loading');
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl) ?
        FacetFiltersForm.renderSectionFromCache(filterDataUrl, event) :
        FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html, event.srcElement);
        FacetFiltersForm.renderProductCount(html);
        // Logic for infinite scroll on Collection Page.
        infinteScroll();

        document.querySelectorAll(".HorizontalList").forEach(each => {

          each.querySelectorAll(".HorizontalList__Item").forEach((each1, eachIndex) => {

            if (eachIndex > 4) {
              each1.style.display = "none"
              each1.closest(".HorizontalList").querySelector(".plus-swatch").style.display = "block"
              // document.querySelectorAll(".plus-swatch").forEach(eache=>{
              // eache.style.display = "block"
              // }) 
            }
          })

        })

        // document.querySelectorAll(".mobile-facets__checkbox").forEach(eachCheck => {
        //   if (eachCheck.checked) {
        //     eachCheck.closest(".mobile-facets__item").classList.add("high-left")
        //   } else {
        //     eachCheck.closest(".mobile-facets__item").classList.remove("high-left")
        //   }
        // })
      });

  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html, event.srcElement);
    FacetFiltersForm.renderProductCount(html);
  }

  static renderProductGridContainer(html, element) {
  if(document.querySelector('#ProductGridContainer')?.getAttribute('quick-filter') == 'true'){
    const { name, defaultValue } = element;
    if(!sessionStorage.getItem('flag-filter_check')) sessionStorage.setItem('flag-filter_check', `${defaultValue}`);
    const filterCategory = name.split('.').pop();
    let checkedFiltersList = screen.width > 600 ? document.querySelectorAll('ul.list-unstyled[category-label]:not([category-label="gender"]) input[type="checkbox"]:checked') : document.querySelectorAll('.filter_content_div[category-label]:not([category-label="gender"]) input[type="checkbox"]:checked');
    checkedFiltersList?.forEach(input=>{
      let thirdLevelList = document.querySelectorAll(`.inner-third-level[for-label='${input.getAttribute('filter-label')}'][for-value='${input.value.toLowerCase()}']`);
      thirdLevelList?.forEach(list=> list.classList.add('active'));
    })
    let filterCheck = sessionStorage.getItem('flag-filter_check')
    let categoryCheckedList = screen.width > 600 ? document.querySelectorAll('.list-unstyled[category-label=category] li input[type="checkbox"]:checked') : document.querySelectorAll('.filter_content_div[category-label=category] li input[type="checkbox"]:checked');
    if(filterCategory == 'product_type' && filterCheck != defaultValue){
      sessionStorage.setItem('flag-filter_check', `${defaultValue}`)
      categoryCheckedList?.forEach(item=> item.checked = false);
      document.querySelectorAll('.inner-second-level.active')?.forEach(item=> item.classList.remove('active'))
      categoryCheckedList?.forEach(item=>{
        if(item.value == defaultValue){
          item.checked = true;
          const inputEvent = new Event('input', { bubbles: true });
          item.dispatchEvent(inputEvent);
          sessionStorage.setItem('filter-clicked', 'true')
          document.querySelector(`.inner-second-level[filter-value='${defaultValue.toLowerCase()}']`)?.classList.add('active');
          document.querySelectorAll('.inner-third-level')?.forEach(el => el.style.display = el.getAttribute('category-value') === defaultValue.toLowerCase() ? 'block' : 'none');
          return;
        }
      });
    }else{
      if(categoryCheckedList.length === 0){
        if(sessionStorage.getItem('disabled_clicked') != 'true'){
          document.querySelectorAll('.inner-second-level.active')?.forEach(item=>item.classList.remove('active'))
          document.querySelector('.inner-second-level')?.classList.add('active')
          document.querySelectorAll('.inner-third-level')?.forEach(el => el.style.display = el.getAttribute('category-value') === 'all' ? 'block' : 'none');
        }
      }else if(categoryCheckedList.length === 1){
        document.querySelectorAll('.inner-second-level.active')?.forEach(item=> item.classList.remove('active'));
        let secondFilterChecked = document.querySelector(`.inner-second-level[filter-value='${defaultValue?.toLowerCase()}']`);
        let categoryChecked = screen.width > 600 ? document.querySelector('.list-unstyled[category-label=category] input[type="checkbox"]:checked') : document.querySelector('.filter_content_div[category-label=category] input[type="checkbox"]:checked');
        if(categoryChecked){
          document.querySelector(`.inner-second-level[filter-value='${categoryChecked.value.toLowerCase()}']`)?.classList.add('active');
          document.querySelectorAll('.inner-third-level')?.forEach(el => el.style.display = el.getAttribute('category-value') === categoryChecked.value.toLowerCase() ? 'block' : 'none');
        }else{}
        
        if(secondFilterChecked) secondFilterChecked.classList.add('active');
      }
    }
  }
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer').innerHTML;
    var event = new CustomEvent('filter-changed', {
      detail: {
        message: 'Filter-Changed'
      }
    });
    document.dispatchEvent(event);
    if(screen.width <= 600) dispatchDisabledInput();
    if(document.querySelector('#ProductGridContainer')?.getAttribute('quick-filter') == 'true'){
      sessionStorage.removeItem('disabled_clicked');
      handleDisabledFilter();
      handleThirdLevelDisabledFilter();
      infinteScroll();
    }    
  }

  static renderProductCount(html) {
    const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    container.classList.remove('loading');
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      containerDesktop.classList.remove('loading');
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements =
      parsedHTML.querySelectorAll('#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter');


    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    }
    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);


    // debugger;

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    })

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    const targetElementAccessibility = target.querySelector('.facets__summary');
    const sourceElementAccessibility = source.querySelector('.facets__summary');

    if (sourceElement && targetElement) {
      target.querySelector('.facets__selected').outerHTML = source.querySelector('.facets__selected').outerHTML;
    }

    if (targetElementAccessibility && sourceElementAccessibility) {
      target.querySelector('.facets__summary').outerHTML = source.querySelector('.facets__summary').outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    // Preserve existing URL structure and ALL existing parameters
    const currentUrl = new URL(window.location);
    const newUrl = new URL(window.location);
    
    // Store existing parameters that should be preserved
    const existingParams = new URLSearchParams(currentUrl.search);
    const filterParams = new URLSearchParams(searchParams || '');
    
    // Clear search parameters to rebuild them
    newUrl.search = '';
    
    // First, add all existing non-filter parameters (preserve advertising/tracking params)
    for (const [key, value] of existingParams.entries()) {
      // Skip filter-related parameters as they will be handled separately
      if (!key.startsWith('filter.') && key !== 'sort_by' && key !== 'q' && key !== 'options[prefix]') {
        if (value && value.trim() !== '') {
          newUrl.searchParams.append(key, value);
        }
      }
    }
    
    // Then add the new filter parameters
    if (searchParams) {
      for (const [key, value] of filterParams.entries()) {
        if (value && value.trim() !== '') {
          newUrl.searchParams.append(key, value);
        }
      }
    }
    
    // Only update the URL if it has actually changed
    if (currentUrl.toString() !== newUrl.toString()) {
      history.pushState({ searchParams }, '', newUrl.toString());
    }
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      }
    ]
  }

  createSearchParams(form) {
    const formData = new FormData(form);
    const searchParams = new URLSearchParams();
    
    // Preserve all form data including text content
    for (const [key, value] of formData.entries()) {
      // Ensure text content is preserved by encoding properly
      if (value && value.trim() !== '') {
        searchParams.append(key, value);
      }
    }
    
    return searchParams.toString();
  }



  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onSubmitHandler(event) {

    event.preventDefault();
    const sortFilterForms = document.querySelectorAll('facet-filters-form form');
    if (event.srcElement.className == 'mobile-facets__checkbox') {
      const searchParams = this.createSearchParams(event.target.closest('form'))
      this.onSubmitForm(searchParams, event)

    } else {
      const forms = [];
      const isMobile = event.target.closest('form').id === 'FacetFiltersFormMobile';

      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm' || form.id === 'FacetSortDrawerForm') {
            const noJsElements = document.querySelectorAll('.no-js-list');
            noJsElements.forEach((el) => el.remove());
            forms.push(this.createSearchParams(form));
          }
        } else if (form.id === 'FacetFiltersFormMobile') {
          forms.push(this.createSearchParams(form));
        }
      });
      this.onSubmitForm(forms.join('&'), event)
    }
    let currentFilterCheck = event.target?.checked;
    let currentFilterValue = event.target?.value;
    document.querySelectorAll('.quickfilter-container .quick-filter-item')?.forEach(item => {
      const filterValue = item.getAttribute('filter-value').trim();
      if (currentFilterValue==filterValue && currentFilterCheck) {
        item.classList.add('active-filter');
        return; 
      }else if(currentFilterValue==filterValue && !currentFilterCheck){
        item.classList.remove('active-filter');
      }else{}
    });
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    
    // Extract search parameters while preserving ALL existing parameters
    const url = event.currentTarget.href;
    const currentUrl = new URL(window.location);
    let searchParams = '';
    
    if (url.indexOf('?') !== -1) {
      searchParams = url.slice(url.indexOf('?') + 1);
      
      // Ensure search parameters are properly encoded to preserve text content
      const params = new URLSearchParams(searchParams);
      const preservedParams = new URLSearchParams();
      
      // Preserve existing non-filter parameters from current URL
      const existingParams = new URLSearchParams(currentUrl.search);
      for (const [key, value] of existingParams.entries()) {
        // Skip filter-related parameters as they will be handled separately
        if (!key.startsWith('filter.') && key !== 'sort_by' && key !== 'q' && key !== 'options[prefix]') {
          if (value && value.trim() !== '') {
            preservedParams.append(key, value);
          }
        }
      }
      
      // Add the new parameters from the filter removal URL
      for (const [key, value] of params.entries()) {
        if (value && value.trim() !== '') {
          preservedParams.append(key, value);
        }
      }
      
      searchParams = preservedParams.toString();
    } else {
      // If no parameters in the removal URL, preserve existing non-filter parameters
      const existingParams = new URLSearchParams(currentUrl.search);
      const preservedParams = new URLSearchParams();
      
      for (const [key, value] of existingParams.entries()) {
        // Skip filter-related parameters as they will be handled separately
        if (!key.startsWith('filter.') && key !== 'sort_by' && key !== 'q' && key !== 'options[prefix]') {
          if (value && value.trim() !== '') {
            preservedParams.append(key, value);
          }
        }
      }
      
      searchParams = preservedParams.toString();
    }
    
    FacetFiltersForm.renderPage(searchParams);
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);

// Preserve any existing filter parameters with text content on page load
FacetFiltersForm.preserveExistingFilters = function() {
  const currentParams = new URLSearchParams(window.location.search);
  const preservedParams = new URLSearchParams();
  
  // Preserve ALL existing parameters including advertising/tracking parameters
  for (const [key, value] of currentParams.entries()) {
    if (value && value.trim() !== '') {
      preservedParams.append(key, value);
    }
  }
  
  // Update the initial search params to include preserved text content and advertising params
  FacetFiltersForm.searchParamsInitial = preservedParams.toString();
  FacetFiltersForm.searchParamsPrev = preservedParams.toString();
};

// Initialize filter preservation on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', FacetFiltersForm.preserveExistingFilters);
} else {
  FacetFiltersForm.preserveExistingFilters();
}
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input')
      .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));
    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector('a');
    facetLink.setAttribute('role', 'button');
    facetLink.addEventListener('click', this.closeFilter.bind(this));
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
    });
  }

  closeFilter(event) {
    event.preventDefault();
    const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
    form.onActiveFilterClick(event);
  }
}

customElements.define('facet-remove', FacetRemove);
