(function () {
    'use strict';
  
    if (!window || !window.BreakpointFeelingAssets) {
      return;
    }
  
    var PILL_STAGGER = 150; // ms between pill starts
    var PILL_DURATION = 350; // ms per pill drop
    var BAR_OFFSET = 400; // ms before first pill starts
    var BAR_ROTATION_DURATION = 500; // ms for bar+pills tilt after pills land
    var ENABLE_BAR_ROTATION = true; // set true when pill positions are final
    var VISIBILITY_THRESHOLD = 0.7; // animation triggers when this fraction of section is visible (0–1)
  
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
  
      var barPos = (assets.bar && assets.bar.position)
        ? { x: assets.bar.position.x || 0, y: assets.bar.position.y || 0 }
        : { x: 0, y: 0 };
      var barAndPillsContainer = null;

      // Bar + Pills container (tilt together after pills land)
      if (assets.bar && assets.bar.svg) {
        barAndPillsContainer = document.createElement('div');
        barAndPillsContainer.className = 'breakpoint-feeling-bar-pills-container';
        barAndPillsContainer.style.position = 'absolute';
        barAndPillsContainer.style.left = '0';
        barAndPillsContainer.style.top = '0';
        barAndPillsContainer.style.transformOrigin = '466px 8px';
        barAndPillsContainer.style.willChange = 'transform';

        barNode = createWrapper('breakpoint-feeling-bar', assets.bar.svg);
        barNode.style.left = '0';
        barNode.style.top = '0';
        setTransform(barNode, 0, 0, 0);
        barAndPillsContainer.appendChild(barNode);

        barAndPillsContainer.dataset.barX = String(barPos.x);
        barAndPillsContainer.dataset.barY = String(barPos.y);
        setTransform(barAndPillsContainer, barPos.x, barPos.y, 0);
        visual.appendChild(barAndPillsContainer);
      }

      // Pills (fall in sequence, inside container - use container-relative coords)
      if (Array.isArray(assets.pills) && barAndPillsContainer) {
        var barX = barPos.x;
        var barY = barPos.y;
        assets.pills.forEach(function (pillAsset, index) {
          if (!pillAsset || !pillAsset.svg) return;
          var node = createWrapper('breakpoint-feeling-pill', pillAsset.svg);
          node.dataset.index = String(index);
          node.dataset.id = pillAsset.id || 'pill_' + index;

          var start = pillAsset.startPosition || { x: 0, y: 0 };
          var end = pillAsset.endPosition || { x: 0, y: 0 };

          var startRelX = (start.x || 0) - barX;
          var startRelY = (start.y || 0) - barY;
          var endRelX = (end.x || 0) - barX;
          var endRelY = (end.y || 0) - barY;

          node.dataset.startX = String(startRelX);
          node.dataset.startY = String(startRelY);
          node.dataset.endX = String(endRelX);
          node.dataset.endY = String(endRelY);
          node.dataset.endRotation = String(pillAsset.endRotation || 0);

          node.style.opacity = '0';
          setTransform(node, startRelX, startRelY, 0);

          barAndPillsContainer.appendChild(node);
          pills.push({
            node: node,
            asset: pillAsset,
            index: index,
          });
        });
      }

      setupObserver(section, barAndPillsContainer, pills, assets);
    }
  
    function setupObserver(section, barAndPillsContainer, pills, assets) {
      var hasPlayed = false;

      function startIfNeeded() {
        if (hasPlayed) return;
        hasPlayed = true;
        runTimeline(barAndPillsContainer, pills, assets);
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
  
    function runTimeline(barAndPillsContainer, pills, assets) {
      if (!barAndPillsContainer && (!pills || !pills.length)) return;

      var pillCount = pills ? pills.length : 0;
      var barRotationStart =
        BAR_OFFSET + (pillCount > 0 ? pillCount - 1 : 0) * PILL_STAGGER + PILL_DURATION;
      var duration = barRotationStart + BAR_ROTATION_DURATION;

      var startTime = (window.performance && performance.now())
        ? performance.now()
        : Date.now();

      var barStartRotation = (assets.bar && assets.bar.startRotation) || 0;
      var barEndRotation = (assets.bar && assets.bar.endRotation) || 0;
      var barBaseX = barAndPillsContainer
        ? parseFloat(barAndPillsContainer.dataset.barX || '0')
        : 0;
      var barBaseY = barAndPillsContainer
        ? parseFloat(barAndPillsContainer.dataset.barY || '0')
        : 0;

      function step(now) {
        var currentTime = now || (window.performance && performance.now())
          ? performance.now()
          : Date.now();
        var elapsed = currentTime - startTime;
        var progress = Math.min(Math.max(elapsed / duration, 0), 1);

        // Phase 1: Pills drop (container stays at 0 rotation)
        // Phase 2: Container rotates (pills already at final position)
        var containerAngle = barStartRotation;
        if (ENABLE_BAR_ROTATION && elapsed > barRotationStart && barAndPillsContainer) {
          var tiltElapsed = elapsed - barRotationStart;
          var tiltProgress = Math.min(tiltElapsed / BAR_ROTATION_DURATION, 1);
          var easedTilt = easeOutCubic(tiltProgress);
          containerAngle =
            barStartRotation +
            (barEndRotation - barStartRotation) * easedTilt;
        }
        if (barAndPillsContainer) {
          setTransform(barAndPillsContainer, barBaseX, barBaseY, containerAngle);
        }

        // Pills: staggered drop (container-relative coords)
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
          if (barAndPillsContainer) {
            var finalAngle = ENABLE_BAR_ROTATION ? barEndRotation : barStartRotation;
            setTransform(barAndPillsContainer, barBaseX, barBaseY, finalAngle);
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
  
  