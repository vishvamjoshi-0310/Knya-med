(function() {
  'use strict';

  function initStickyButton() {
    const bannerSection = document.querySelector('.breakpoint-banner-section');
    const bannerButton = document.querySelector('.breakpoint-banner-mobile-button');
    const feelingSection = document.querySelector('.breakpoint-feeling-section');
    const newStickyCTA = document.getElementById('anonymous-btn');

    if (!bannerSection || !feelingSection || !newStickyCTA) {
      console.warn('Required sections or buttons not found');
      return;
    }

    // Create OLD sticky CTA (clone of banner button) for feeling section only
    const oldStickyCTA = bannerButton ? bannerButton.cloneNode(true) : null;
    if (oldStickyCTA) {
      oldStickyCTA.classList.add('breakpoint-banner-sticky-button');
      document.body.appendChild(oldStickyCTA);
    }

    // Ensure NEW sticky CTA starts under JS/CSS control (no display toggling)
    newStickyCTA.style.display = 'block';

    // Setup NEW sticky CTA positioning
    newStickyCTA.style.position = 'fixed';
    newStickyCTA.style.bottom = window.innerWidth > 768 ? '81px' : '24px';
    newStickyCTA.style.right = window.innerWidth > 768 ? '92px' : '24px';
    newStickyCTA.style.zIndex = '1000';

    // --- Helper functions ---

    function calculateBannerScrollThreshold(sectionEl) {
      const rect = sectionEl.getBoundingClientRect();
      const bannerTop = rect.top + window.scrollY;
      const bannerHeight = rect.height;
      const bannerBottom = bannerTop + bannerHeight;
      // Sticky can appear after banner has scrolled 25% past its bottom
      return bannerBottom + bannerHeight * 0.25;
    }

    function isElementFullyInViewport(element) {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    function getElementDistanceFromBottom(element) {
      if (!element) return Infinity;
      const rect = element.getBoundingClientRect();
      return window.innerHeight - rect.bottom;
    }

    function isElementNearBottom(element, percentage) {
      if (!element) return false;
      const distance = getElementDistanceFromBottom(element);
      const threshold = window.innerHeight * (percentage / 100);
      return distance <= threshold;
    }

    let currentState = 'hidden';

    function setState(nextState) {
      if (nextState === currentState) return;

      const prevState = currentState;
      currentState = nextState;

      // Clear previous state classes
      if (newStickyCTA) {
        newStickyCTA.classList.remove(
          'sticky-btn-drop-in',
          'sticky-btn-original',
          'sticky-btn-merged',
          'sticky-btn-hidden-by-feeling'
        );
      }
      if (oldStickyCTA) {
        oldStickyCTA.classList.remove('sticky-btn-feeling-active');
      }

      switch (nextState) {
        case 'hidden':
          // Base CSS keeps it visually hidden
          break;

        case 'original':
          if (!newStickyCTA) break;
          // First time from hidden → use drop-in animation
          if (prevState === 'hidden') {
            newStickyCTA.classList.add('sticky-btn-drop-in');
          } else {
            newStickyCTA.classList.add('sticky-btn-original');
          }
          break;

        case 'merged':
          if (!newStickyCTA) break;
          newStickyCTA.classList.add('sticky-btn-merged');
          break;

        case 'feeling':
          if (newStickyCTA) {
            newStickyCTA.classList.add('sticky-btn-hidden-by-feeling');
          }
          if (oldStickyCTA) {
            oldStickyCTA.classList.add('sticky-btn-feeling-active');
          }
          break;

        default:
          break;
      }
    }

    // Pre-calculate banner threshold; update on resize
    let bannerScrollThreshold = calculateBannerScrollThreshold(bannerSection);

    function handleScroll() {
      const viewportHeight = window.innerHeight;

      const bannerRect = bannerSection.getBoundingClientRect();
      const feelingRect = feelingSection.getBoundingClientRect();
      const supportButton = document.querySelector('.breakpoint-support-button');

      const scrollY = window.scrollY;

      // Banner threshold: sticky can only appear after this point
      const pastBannerThreshold = (scrollY + viewportHeight) >= bannerScrollThreshold;

      // Support button visibility (fully in viewport)
      const supportFullyVisible = supportButton && isElementFullyInViewport(supportButton);

      // DEBUG: Support button + state info
      if (supportButton) {
        const supportRect = supportButton.getBoundingClientRect();
        // console.log('Support button found:', supportButton);
        // console.log('Support button rect:', supportRect);
        // console.log('Support fully visible:', supportFullyVisible);
        // console.log('Support near 20%:', supportNear20Percent);
      } else {
        // console.log('Support button not found');
      }

      // Feeling section active when CTA vertical band overlaps with feeling section
      const ctaBottomOffset = window.innerWidth > 768 ? 81 : 24;
      const approxButtonHeight = 60; // px
      const ctaCenterY = viewportHeight - ctaBottomOffset - approxButtonHeight / 2;

      const isFeelingActive =
        feelingRect.top <= ctaCenterY && feelingRect.bottom >= ctaCenterY;

      // --- State machine ---
      let nextState = 'hidden';

      if (pastBannerThreshold) {
        if (isFeelingActive) {
          nextState = 'feeling';
        } else if (supportButton && supportFullyVisible) {
          // While the support CTA button is fully visible, fade out the sticky
          nextState = 'merged';
        } else {
          nextState = 'original';
        }
      }

      // console.log('Sticky CTA state ->', nextState);

      setState(nextState);
    }

    // Throttle scroll events for performance
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Handle resize events
    window.addEventListener('resize', function() {
      // Update CTA positioning for breakpoints
      if (newStickyCTA) {
        newStickyCTA.style.bottom = window.innerWidth > 768 ? '81px' : '24px';
        newStickyCTA.style.right = window.innerWidth > 768 ? '92px' : '24px';
      }
      // Recalculate banner threshold
      bannerScrollThreshold = calculateBannerScrollThreshold(bannerSection);
      handleScroll();
    }, { passive: true });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyButton);
  } else {
    initStickyButton();
  }
})();