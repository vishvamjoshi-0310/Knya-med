(function () {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        ropeColor: '#DCF343',
        desktopRopeWidth: 14,
        mobileRopeWidth: 6,
        hoverImpactZone: 300,      // For hover effect (push away)
        dragDetectionZone: 80,     // Zone to detect if click is near rope
        dragInfluenceZone: 150,    // How far drag affects neighboring points
        maxDragDistance: 250,      // Maximum distance a point can be dragged from original position
        pushForce: 2,              // Hover push effect
        dragForce: 0.3,            // How strongly dragged point follows cursor
        elasticity: 0.24,          // Spring back force
        damping: 0.8,              // Velocity damping
        rippleSpeed: 0.7,          // Ripple propagation speed
        rippleDamping: 0.8,        // Ripple damping
        // Higher subdivision count + centripetal Catmull–Rom below
        // gives a much smoother, more “rope-like” curve.
        normalSubdivisions: 32,
        interactiveSubdivisions: 16,
        mobileBreakpoint: 768,     // Breakpoint for mobile layout
    };

    // --- DESKTOP CONTROL POINTS ---
    const DESKTOP_CONTROL_POINTS = [
        { x: 1025, y: 540 },
        { x: 980, y: 470 },
        { x: 1000, y: 400 },
        { x: 1100, y: 320 },
        { x: 1205, y: 330 },
        { x: 1215, y: 385 },
        { x: 1125, y: 465 },
        { x: 985, y: 480 },
        { x: 850, y: 410 },
        { x: 820, y: 230 },
        { x: 980, y: 50 },
        { x: 1215, y: -150 },
        { x: 1375, y: 50 },
        { x: 1270, y: 210 },
        { x: 1095, y: 305 },
        { x: 820, y: 240 },
        { x: 810, y: 50 },
        { x: 890, y: -75 },
        { x: 980, y: -75 },
        { x: 1010, y: 50 },
        { x: 1010, y: 235 },
        { x: 1045, y: 265 },
        { x: 1080, y: 245 },
        { x: 1145, y: 140 },
        { x: 1270, y: 110 },
        { x: 1470, y: 215 },
        { x: 1500, y: 315 },
        { x: 1470, y: 385 },
        { x: 1380, y: 435 },
        { x: 1330, y: 420 },
        { x: 1280, y: 320 },
        { x: 1250, y: 50 },
        { x: 1070, y: -150 },
        { x: 935, y: 50 },
        { x: 1010, y: 100 },
        { x: 1130, y: 50 },
        { x: 1335, y: -100 },
        { x: 1480, y: 50 },
        { x: 1470, y: 165 },
        { x: 1380, y: 265 },
        { x: 1285, y: 355 },
        { x: 1230, y: 475 },
        { x: 1150, y: 545 },
        { x: 1025, y: 540 },
        { x: 870, y: 550 },
        { x: 810, y: 650 },
        { x: 815, y: 900 },
        { x: 815, y: 1400 },
    ];

    // --- MOBILE CONTROL POINTS (Based on Figma design) ---
    const MOBILE_CONTROL_POINTS = [
        { x: 170, y: 385 },
        { x: 220, y: 420 },
        { x: 275, y: 380 },
        { x: 295, y: 330 },
        { x: 330, y: 285 },
        { x: 365, y: 250 },
        { x: 375, y: 190 },
        { x: 330, y: 145 },
        { x: 270, y: 160 },
        { x: 225, y: 190 },
        { x: 180, y: 210 },
        { x: 145, y: 175 },
        { x: 190, y: 115 },
        { x: 225, y: 120 },
        { x: 265, y: 155 },
        { x: 285, y: 220 },
        { x: 293, y: 320 },
        { x: 320, y: 365 },
        { x: 360, y: 355 },
        { x: 385, y: 290 },
        { x: 340, y: 235 },
        { x: 280, y: 215 },
        { x: 225, y: 240 },
        { x: 210, y: 280 },
        { x: 180, y: 275 },
        { x: 180, y: 230 },
        { x: 175, y: 170 },
        { x: 145, y: 150 },
        { x: 100, y: 185 },
        { x: 110, y: 285 },
        { x: 215, y: 305 },
        { x: 285, y: 265 },
        { x: 320, y: 220 },
        { x: 320, y: 140 },
        { x: 280, y: 110 },
        { x: 230, y: 120 },
        { x: 180, y: 170 },
        { x: 130, y: 225 },
        { x: 100, y: 280 },
        { x: 110, y: 350 },
        { x: 170, y: 385 },
        { x: 210, y: 385 },
        { x: 260, y: 350 },
        { x: 260, y: 315 },
        { x: 230, y: 310 },
        { x: 175, y: 352 },
        { x: 170, y: 385 },
        { x: 165, y: 400 },
        { x: 110, y: 450 },
        { x: 85, y: 555 },
        { x: 80, y: 580 },
    ];

    // --- PHYSICS POINT CLASS ---
    class PhysicsPoint {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.originalX = x;
            this.originalY = y;
            this.vx = 0;
            this.vy = 0;
            this.ripple = 0;
            this.rippleVelocity = 0;
            this.isDragging = false;
        }

        applyForce(fx, fy) {
            this.vx += fx;
            this.vy += fy;
        }

        update() {
            // Skip physics update if being dragged
            if (this.isDragging) {
                return;
            }

            // Spring force (pulling back to original position)
            const springX = (this.originalX - this.x) * CONFIG.elasticity;
            const springY = (this.originalY - this.y) * CONFIG.elasticity;

            this.vx += springX;
            this.vy += springY;

            // Apply damping
            this.vx *= CONFIG.damping;
            this.vy *= CONFIG.damping;

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Update ripple
            this.ripple += this.rippleVelocity;
            this.rippleVelocity *= CONFIG.rippleDamping;
            this.ripple *= CONFIG.rippleDamping;
        }

        addRipple(amount) {
            this.rippleVelocity += amount;
        }

        setDragPosition(x, y) {
            // Calculate desired position
            let targetX = x;
            let targetY = y;

            // Clamp to maximum drag distance from original position
            const dx = targetX - this.originalX;
            const dy = targetY - this.originalY;
            const distanceFromOriginal = Math.sqrt(dx * dx + dy * dy);

            if (distanceFromOriginal > CONFIG.maxDragDistance) {
                // Limit to max drag distance
                const ratio = CONFIG.maxDragDistance / distanceFromOriginal;
                targetX = this.originalX + dx * ratio;
                targetY = this.originalY + dy * ratio;
            }

            // Smoothly move towards clamped drag position
            const moveX = targetX - this.x;
            const moveY = targetY - this.y;
            this.vx = moveX * CONFIG.dragForce;
            this.vy = moveY * CONFIG.dragForce;
            this.x += this.vx;
            this.y += this.vy;
        }
    }

    // --- ROPE ANIMATION CLASS ---
    class RopeAnimation {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.physicsPoints = [];
            this.mouseX = -1000;
            this.mouseY = -1000;
            this.isInteracting = false;
            this.scale = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            this.isDragging = false;
            this.draggedPointIndex = -1;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.animationFrameId = null;
            this.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;
            this.currentControlPoints = this.isMobile ? MOBILE_CONTROL_POINTS : DESKTOP_CONTROL_POINTS;

            this.initPhysicsPoints();
            this.bindEvents();
            this.resize();
            this.animate();
        }

        initPhysicsPoints() {
            this.physicsPoints = this.currentControlPoints.map(p => new PhysicsPoint(p.x, p.y));
        }

        getPoint(controlPoints, index) {
            const len = controlPoints.length;

            // Check instance variable for loop state
            if (this.isClosedLoop) {
                if (index < 0) return controlPoints[len + index];
                if (index >= len) return controlPoints[index - len];
                return controlPoints[index];
            }

            // Open loop behavior: clamp to edges
            if (index < 0) return controlPoints[0];
            if (index >= len) return controlPoints[len - 1];
            return controlPoints[index];
        }

        /**
         * Centripetal Catmull–Rom interpolation
         *
         * Compared to the “uniform” variant, this reduces overshoot
         * around tighter corners and produces a more natural looking
         * rope that better matches the Figma reference.
         */
        catmullRomInterpolate(p0, p1, p2, p3, t) {
            const alpha = 0.5; // 0.5 = centripetal, good for avoiding loops
            const EPS = 1e-4;

            const tj = (ti, pa, pb) => {
                const dx = pb.x - pa.x;
                const dy = pb.y - pa.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                return ti + Math.pow(Math.max(dist, EPS), alpha);
            };

            const t0 = 0;
            const t1 = tj(t0, p0, p1);
            const t2 = tj(t1, p1, p2);
            const t3 = tj(t2, p2, p3);

            // Re-parameterise t in [t1, t2]
            const tt = t1 + t * (t2 - t1);

            const lerpPoint = (a, b, ta, tb) => {
                const denom = (tb - ta) || EPS;
                const wa = (tb - tt) / denom;
                const wb = (tt - ta) / denom;
                return {
                    x: wa * a.x + wb * b.x,
                    y: wa * a.y + wb * b.y,
                };
            };

            const A1 = lerpPoint(p0, p1, t0, t1);
            const A2 = lerpPoint(p1, p2, t1, t2);
            const A3 = lerpPoint(p2, p3, t2, t3);

            const B1 = lerpPoint(A1, A2, t0, t2);
            const B2 = lerpPoint(A2, A3, t1, t3);

            const C = lerpPoint(B1, B2, t1, t2);
            return C;
        }

        generateSmoothedPoints(controlPoints, subdivisions) {
            const smoothedPoints = [];

            // Determine if closed loop based on proximity of start/end
            const first = controlPoints[0];
            const last = controlPoints[controlPoints.length - 1];
            // Tolerance for "same point" - using a generous 20px
            this.isClosedLoop = Math.hypot(first.x - last.x, first.y - last.y) < 20;

            for (let i = 0; i < controlPoints.length; i++) {
                const p0 = this.getPoint(controlPoints, i - 1);
                const p1 = controlPoints[i];
                const p2 = this.getPoint(controlPoints, i + 1);
                const p3 = this.getPoint(controlPoints, i + 2);

                smoothedPoints.push({ x: p1.x, y: p1.y + p1.ripple });

                // If NOT closed loop, we stop at the last point and do NOT interpolate back to start
                // The loop condition is i < controlPoints.length, so we process all points.
                // But for open loop, we skip the segment starting at the last point.
                if (!this.isClosedLoop && i === controlPoints.length - 1) {
                    continue;
                }

                for (let j = 1; j < subdivisions; j++) {
                    const t = j / subdivisions;
                    const interpolated = this.catmullRomInterpolate(p0, p1, p2, p3, t);
                    const ripple = p1.ripple * (1 - t) + p2.ripple * t;
                    smoothedPoints.push({ x: interpolated.x, y: interpolated.y + ripple });
                }
            }

            return smoothedPoints;
        }

        drawSmoothCurve(ctx, points) {
            if (points.length < 2) return;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            // Use simple lines to connect the high-res points
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.stroke();
        }

        screenToCanvas(screenX, screenY) {
            return {
                x: (screenX - this.offsetX) / this.scale,
                y: (screenY - this.offsetY) / this.scale
            };
        }

        findNearestPoint(canvasX, canvasY, maxDistance) {
            let nearestIndex = -1;
            let nearestDistance = maxDistance;

            for (let i = 0; i < this.physicsPoints.length; i++) {
                const point = this.physicsPoints[i];
                const dx = canvasX - point.x;
                const dy = canvasY - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = i;
                }
            }

            return nearestIndex;
        }

        updatePhysics() {
            const canvasMouse = this.screenToCanvas(this.mouseX, this.mouseY);
            let anyPointAffected = false;

            if (this.isDragging && this.draggedPointIndex !== -1) {
                const draggedPoint = this.physicsPoints[this.draggedPointIndex];
                draggedPoint.setDragPosition(canvasMouse.x, canvasMouse.y);

                for (let i = 0; i < this.physicsPoints.length; i++) {
                    if (i === this.draggedPointIndex) continue;

                    const point = this.physicsPoints[i];
                    const dx = draggedPoint.x - point.x;
                    const dy = draggedPoint.y - point.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONFIG.dragInfluenceZone && distance > 0) {
                        const influence = (CONFIG.dragInfluenceZone - distance) / CONFIG.dragInfluenceZone;
                        const pullX = (dx / distance) * influence * 0.5;
                        const pullY = (dy / distance) * influence * 0.5;
                        point.applyForce(pullX, pullY);
                    }
                }

                anyPointAffected = true;
            } else {
                for (let i = 0; i < this.physicsPoints.length; i++) {
                    const point = this.physicsPoints[i];
                    const dx = canvasMouse.x - point.x;
                    const dy = canvasMouse.y - point.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONFIG.hoverImpactZone && distance > 0) {
                        anyPointAffected = true;
                        const force = (CONFIG.hoverImpactZone - distance) / CONFIG.hoverImpactZone;
                        const pushX = (dx / distance) * force * CONFIG.pushForce;
                        const pushY = (dy / distance) * force * CONFIG.pushForce;

                        point.applyForce(-pushX, -pushY);
                        point.addRipple(force * CONFIG.rippleSpeed);

                        if (i > 0) {
                            this.physicsPoints[i - 1].addRipple(force * CONFIG.rippleSpeed * 0.5);
                        }
                        if (i < this.physicsPoints.length - 1) {
                            this.physicsPoints[i + 1].addRipple(force * CONFIG.rippleSpeed * 0.5);
                        }
                    }
                }
            }

            for (let i = 0; i < this.physicsPoints.length; i++) {
                this.physicsPoints[i].update();
            }

            // Synchronize loop closure points
            for (let i = 0; i < this.physicsPoints.length; i++) {
                for (let j = i + 1; j < this.physicsPoints.length; j++) {
                    const p1 = this.physicsPoints[i];
                    const p2 = this.physicsPoints[j];

                    if (p1.originalX === p2.originalX && p1.originalY === p2.originalY) {
                        const avgX = (p1.x + p2.x) / 2;
                        const avgY = (p1.y + p2.y) / 2;
                        const avgVx = (p1.vx + p2.vx) / 2;
                        const avgVy = (p1.vy + p2.vy) / 2;
                        const avgRipple = (p1.ripple + p2.ripple) / 2;
                        const avgRippleVelocity = (p1.rippleVelocity + p2.rippleVelocity) / 2;

                        p1.x = p2.x = avgX;
                        p1.y = p2.y = avgY;
                        p1.vx = p2.vx = avgVx;
                        p1.vy = p2.vy = avgVy;
                        p1.ripple = p2.ripple = avgRipple;
                        p1.rippleVelocity = p2.rippleVelocity = avgRippleVelocity;
                    }
                }
            }

            // Propagate ripples
            for (let i = 1; i < this.physicsPoints.length - 1; i++) {
                const prev = this.physicsPoints[i - 1];
                const current = this.physicsPoints[i];
                const next = this.physicsPoints[i + 1];

                const rippleDiff = (prev.ripple + next.ripple) / 2 - current.ripple;
                current.rippleVelocity += rippleDiff * 0.1;
            }

            this.isInteracting = anyPointAffected;
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.lineWidth = this.isMobile ? CONFIG.mobileRopeWidth : CONFIG.desktopRopeWidth;
            this.ctx.strokeStyle = CONFIG.ropeColor;

            this.ctx.save();
            this.ctx.translate(this.offsetX, this.offsetY);
            this.ctx.scale(this.scale, this.scale);

            const subdivisions = this.isInteracting ? CONFIG.interactiveSubdivisions : CONFIG.normalSubdivisions;
            const smoothedPoints = this.generateSmoothedPoints(this.physicsPoints, subdivisions);

            this.drawSmoothCurve(this.ctx, smoothedPoints);

            this.ctx.restore();
        }

        animate() {
            this.updatePhysics();
            this.draw();
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }

        calculateRopeBounds() {
            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;

            this.currentControlPoints.forEach(point => {
                minX = Math.min(minX, point.x);
                maxX = Math.max(maxX, point.x);
                minY = Math.min(minY, point.y);
                maxY = Math.max(maxY, point.y);
            });

            return { minX, maxX, minY, maxY };
        }

        resize() {
            // Check if we've crossed the mobile/desktop breakpoint
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;

            // If breakpoint changed, switch control points and reinitialize
            if (wasMobile !== this.isMobile) {
                this.currentControlPoints = this.isMobile ? MOBILE_CONTROL_POINTS : DESKTOP_CONTROL_POINTS;
                this.initPhysicsPoints();
            }

            const ropeBounds = this.calculateRopeBounds();

            if (this.isMobile) {
                // MOBILE LAYOUT: Center the rope horizontally
                const mobileBaseWidth = 375; // Standard mobile width
                // Clamp scale to avoid excessive height growth on wider mobile screens
                this.scale = Math.min(window.innerWidth / mobileBaseWidth, 1.15);

                // Center horizontally
                const ropeWidth = (ropeBounds.maxX - ropeBounds.minX) * this.scale;
                this.offsetX = (window.innerWidth - ropeWidth) / 2 - (ropeBounds.minX * this.scale);

                // Position vertically (top offset)
                this.offsetY = 82 * this.scale;
            } else {
                // DESKTOP LAYOUT: Position on right side
                const baseWidth = 1440;
                this.scale = Math.max(window.innerWidth / baseWidth, 0.6);

                this.offsetY = 50;

                if (window.innerWidth > baseWidth) {
                    this.offsetX = window.innerWidth - (baseWidth * this.scale);
                } else {
                    this.offsetX = window.innerWidth - (baseWidth * this.scale);
                }
            }

            const padding = 500;
            const ropeLeft = ropeBounds.minX * this.scale + this.offsetX;
            const ropeRight = ropeBounds.maxX * this.scale + this.offsetX;
            const ropeTop = ropeBounds.minY * this.scale + this.offsetY;
            const ropeBottom = ropeBounds.maxY * this.scale + this.offsetY;

            const canvasLeft = ropeLeft - padding;
            const canvasRight = Math.max(ropeRight + padding, window.innerWidth);
            const canvasTop = Math.min(ropeTop - padding, 0);
            const canvasBottom = Math.max(ropeBottom + padding, window.innerHeight);

            this.canvas.width = canvasRight - canvasLeft;
            this.canvas.height = canvasBottom - canvasTop;

            this.canvas.style.left = canvasLeft + 'px';
            this.canvas.style.top = canvasTop + 'px';

            this.offsetX = this.offsetX - canvasLeft;
            this.offsetY = this.offsetY - canvasTop;
        }

        bindEvents() {
            // Mouse events (Desktop - unchanged logic)
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.mouseX = -1000;
                this.mouseY = -1000;
                this.stopDragging();
            });

            this.canvas.addEventListener('mousedown', (e) => {
                this.handleStart(e.clientX, e.clientY);
            });

            this.canvas.addEventListener('mouseup', () => {
                this.stopDragging();
            });

            // --- MOBILE TOUCH EVENTS (FIXED FOR SCROLLING) ---

            this.canvas.addEventListener('touchstart', (e) => {
                // REMOVED: e.preventDefault();  <-- This was killing the scroll!

                const touch = e.touches[0];
                // Store start position to detect scroll vs drag direction later
                this.touchStartX = touch.clientX;
                this.touchStartY = touch.clientY;
                this.isScrollDecisionMade = false; // Reset decision flag

                this.handleStart(touch.clientX, touch.clientY);
            }, { passive: false });

            this.canvas.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                this.mouseX = touch.clientX - this.canvas.getBoundingClientRect().left;
                this.mouseY = touch.clientY - this.canvas.getBoundingClientRect().top;

                // If we are not interacting with the rope, let the scroll happen naturally
                if (!this.isDragging) {
                    return;
                }

                // If we haven't decided yet whether to Scroll or Drag...
                if (!this.isScrollDecisionMade) {
                    const dx = Math.abs(touch.clientX - this.touchStartX);
                    const dy = Math.abs(touch.clientY - this.touchStartY);

                    // THRESHOLD: If moved 5px... check direction
                    if (dx > 5 || dy > 5) {
                        this.isScrollDecisionMade = true;

                        // If vertical movement is greater -> It's a SCROLL
                        if (dy > dx) {
                            this.stopDragging(); // Release the rope
                            return; // Let browser handle scrolling
                        }
                        // If horizontal movement is greater -> It's a DRAG
                        else {
                            // It's a rope interaction, so NOW we block scrolling
                            e.preventDefault();
                        }
                    }
                } else {
                    // Decision already made: we are dragging, so keep blocking scroll
                    if (this.isDragging) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });

            this.canvas.addEventListener('touchend', () => {
                this.stopDragging();
                this.mouseX = -1000;
                this.mouseY = -1000;
            });

            this.canvas.addEventListener('touchcancel', () => {
                this.stopDragging();
                this.mouseX = -1000;
                this.mouseY = -1000;
            });

            window.addEventListener('resize', () => this.resize());
        }

        // Helper to avoid duplicate code between mouse/touch
        handleStart(clientX, clientY) {
            const rect = this.canvas.getBoundingClientRect();
            const screenX = clientX - rect.left;
            const screenY = clientY - rect.top;
            const canvasPos = this.screenToCanvas(screenX, screenY);

            // --- FIX START: Update global mouse position immediately ---
            // This prevents the rope from jumping to -1000 (off-screen) 
            // on the first frame of a touch interaction.
            this.mouseX = screenX;
            this.mouseY = screenY;
            // --- FIX END ---

            // On mobile, reduce the grab zone so users can touch NEAR the rope to scroll
            // Desktop = 80px (CONFIG.dragDetectionZone), Mobile = 30px
            const hitZone = this.isMobile ? 30 : CONFIG.dragDetectionZone;

            const nearestIndex = this.findNearestPoint(canvasPos.x, canvasPos.y, hitZone);

            if (nearestIndex !== -1) {
                this.isDragging = true;
                this.draggedPointIndex = nearestIndex;
                this.physicsPoints[nearestIndex].isDragging = true;
                this.canvas.classList.add('dragging');

                this.dragStartX = canvasPos.x;
                this.dragStartY = canvasPos.y;
            }
        }

        stopDragging() {
            if (this.isDragging && this.draggedPointIndex !== -1) {
                this.physicsPoints[this.draggedPointIndex].isDragging = false;
                this.isDragging = false;
                this.draggedPointIndex = -1;
                this.canvas.classList.remove('dragging');
            }
        }

        destroy() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
        }
    }

    // --- INITIALIZE ---
    function initRopeAnimation() {
        const canvas = document.getElementById('ropeCanvas');
        if (!canvas) {
            console.warn('Rope canvas not found');
            return;
        }

        new RopeAnimation(canvas);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRopeAnimation);
    } else {
        initRopeAnimation();
    }
})();
