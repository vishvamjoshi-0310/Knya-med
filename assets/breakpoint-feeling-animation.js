(function () {
    'use strict';
  
    if (!window || !window.BreakpointFeelingAssets) {
      return;
    }
  
    var DURATION = 3600; // total animation duration in ms
    var BAR_ROTATION_PORTION = 0.5; // first 40% of timeline
    var PILL_STAGGER = 150; // ms between pill starts
    var PILL_DURATION = 350; // ms per pill drop
    var BAR_OFFSET = 400; // ms before bar starts moving
    var VISIBILITY_THRESHOLD = 0.7; // animation triggers when this fraction of section is visible (0–1, e.g. 0.5 = 50%)
  
    function setTransform(el, x, y, angle) {
      el.style.transform =
        'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg)';
    }
  
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
  
    function createWrapper(className, svg) {
      var wrapper = document.createElement('div');
      wrapper.className = className;
      wrapper.innerHTML = svg;
      wrapper.style.position = 'absolute';
      wrapper.style.willChange = 'transform, opacity';
      return wrapper;
    }
  
    function initSection(section) {
      var parent = section.querySelector('.breakpoint-feeling-parent');
      if (!parent) return;
  
      var visual =
        section.querySelector('.breakpoint-feeling-visual') ||
        (function () {
          var node = document.createElement('div');
          node.className = 'breakpoint-feeling-visual';
          parent.insertBefore(node, parent.firstChild);
          return node;
        })();
  
      var assets = window.BreakpointFeelingAssets || {};
      var manNode = null;
      var barNode = null;
      var pills = [];
  
      // Man (static)
      if (assets.man && assets.man.svg) {
        manNode = createWrapper('breakpoint-feeling-man', assets.man.svg);
        var manPos = assets.man.position || { x: 0, y: 0 };
        setTransform(manNode, manPos.x || 0, manPos.y || 0, assets.man.rotation || 0);
        visual.appendChild(manNode);
      }
  
      // Bar (rotates)
      if (assets.bar && assets.bar.svg) {
        barNode = createWrapper('breakpoint-feeling-bar', assets.bar.svg);
        var barPos = assets.bar.position || { x: 0, y: 0 };
        barNode.dataset.baseX = String(barPos.x || 0);
        barNode.dataset.baseY = String(barPos.y || 0);
        setTransform(
          barNode,
          barPos.x || 0,
          barPos.y || 0,
          assets.bar.startRotation || 0
        );
        visual.appendChild(barNode);
      }
  
      // Pills (fall in sequence)
      if (Array.isArray(assets.pills)) {
        assets.pills.forEach(function (pillAsset, index) {
          if (!pillAsset || !pillAsset.svg) return;
          var node = createWrapper('breakpoint-feeling-pill', pillAsset.svg);
          node.dataset.index = String(index);
          node.dataset.id = pillAsset.id || 'pill_' + index;
  
          var start = pillAsset.startPosition || { x: 0, y: 0 };
          var end = pillAsset.endPosition || { x: 0, y: 0 };
  
          node.dataset.startX = String(start.x || 0);
          node.dataset.startY = String(start.y || 0);
          node.dataset.endX = String(end.x || 0);
          node.dataset.endY = String(end.y || 0);
          node.dataset.endRotation = String(pillAsset.endRotation || 0);
  
          node.style.opacity = '0';
          setTransform(node, start.x || 0, start.y || 0, 0);
  
          visual.appendChild(node);
          pills.push({
            node: node,
            asset: pillAsset,
            index: index,
          });
        });
      }
  
      setupObserver(section, barNode, pills, assets);
    }
  
    function setupObserver(section, barNode, pills, assets) {
      var hasPlayed = false;
  
      function startIfNeeded() {
        if (hasPlayed) return;
        hasPlayed = true;
        runTimeline(barNode, pills, assets);
      }
  
      if (!('IntersectionObserver' in window)) {
        // Fallback: play immediately
        startIfNeeded();
        return;
      }
  
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= VISIBILITY_THRESHOLD &&
              !hasPlayed
            ) {
              observer.disconnect();
              startIfNeeded();
            }
          });
        },
        {
          threshold: [0, VISIBILITY_THRESHOLD, 1],
        }
      );
  
      observer.observe(section);
    }
  
    function runTimeline(barNode, pills, assets) {
      if (!barNode && (!pills || !pills.length)) return;
  
      var startTime = (window.performance && performance.now())
        ? performance.now()
        : Date.now();
  
      var barStartRotation = (assets.bar && assets.bar.startRotation) || 0;
      var barEndRotation = (assets.bar && assets.bar.endRotation) || 0;
      var barBaseX = barNode ? parseFloat(barNode.dataset.baseX || '0') : 0;
      var barBaseY = barNode ? parseFloat(barNode.dataset.baseY || '0') : 0;
  
      function step(now) {
        var currentTime = now || (window.performance && performance.now())
          ? performance.now()
          : Date.now();
        var elapsed = currentTime - startTime;
        var progress = Math.min(Math.max(elapsed / DURATION, 0), 1);
  
        // Bar rotation during first BAR_ROTATION_PORTION of the timeline
        if (barNode) {
          var barProgress = Math.min(progress / BAR_ROTATION_PORTION, 1);
          var easedBar = easeOutCubic(barProgress);
          var angle =
            barStartRotation +
            (barEndRotation - barStartRotation) * easedBar;
          setTransform(barNode, barBaseX, barBaseY, angle);
        }
  
        // Pills: staggered drop
        if (pills && pills.length) {
          pills.forEach(function (pill) {
            var index = pill.index;
            var startOffset = BAR_OFFSET + index * PILL_STAGGER;
            var localElapsed = elapsed - startOffset;
            var localProgress = localElapsed / PILL_DURATION;
            var clamped = Math.min(Math.max(localProgress, 0), 1);
  
            var startX = parseFloat(pill.node.dataset.startX || '0');
            var startY = parseFloat(pill.node.dataset.startY || '0');
            var endX = parseFloat(pill.node.dataset.endX || '0');
            var endY = parseFloat(pill.node.dataset.endY || '0');
            var endRotation = parseFloat(pill.node.dataset.endRotation || '0');
  
            if (clamped <= 0) {
              pill.node.style.opacity = '0';
              setTransform(pill.node, startX, startY, 0);
            } else {
              var easedPill = easeOutCubic(clamped);
              var x = startX + (endX - startX) * easedPill;
              var y = startY + (endY - startY) * easedPill;
              pill.node.style.opacity = String(easedPill);
              setTransform(pill.node, x, y, endRotation);
            }
          });
        }
  
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          // Snap to final state
          if (barNode) {
            setTransform(barNode, barBaseX, barBaseY, barEndRotation);
          }
          if (pills && pills.length) {
            pills.forEach(function (pill) {
              var endX = parseFloat(pill.node.dataset.endX || '0');
              var endY = parseFloat(pill.node.dataset.endY || '0');
              var endRotation = parseFloat(pill.node.dataset.endRotation || '0');
              pill.node.style.opacity = '1';
              setTransform(pill.node, endX, endY, endRotation);
            });
          }
        }
      }
  
      window.requestAnimationFrame(step);
    }
  
    function init() {
      var sections = document.querySelectorAll('.breakpoint-feeling-section');
      if (!sections.length) return;
      sections.forEach(initSection);
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  
  