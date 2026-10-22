/**
 * VMDP Main JavaScript
 * Handles smooth scrolling, mobile drawer navigation, and slider interaction.
 */

document.addEventListener('DOMContentLoaded', function () {
    // -------------------------------------------------------------------------
    // Smooth Scroll for Back to Top and internal anchor links
    // -------------------------------------------------------------------------
    const pageTopLinks = document.querySelectorAll('a[href^="#"]');
    pageTopLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#allContents') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    targetElem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // -------------------------------------------------------------------------
    // Mobile Drawer Navigation (Matching SP PSD メニューOPEN)
    // -------------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');

    function openDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('open');
        drawerBackdrop.classList.add('active');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    }

    function closeDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeDrawer);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
            closeDrawer();
        }
    });

    // Close drawer when any internal navigation link inside drawer is clicked
    const drawerLinks = document.querySelectorAll('.mobile-drawer a');
    drawerLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeDrawer();
        });
    });

    // -------------------------------------------------------------------------
    // Mobile Floating Back to Top Button Visibility
    // -------------------------------------------------------------------------
    const spTotop = document.getElementById('spTotop');
    if (spTotop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                spTotop.style.opacity = '1';
                spTotop.style.pointerEvents = 'auto';
            } else {
                spTotop.style.opacity = '0';
                spTotop.style.pointerEvents = 'none';
            }
        }, { passive: true });
    }

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // Hero 3D Product Card Slider (Entire Card Transitions)
    // -------------------------------------------------------------------------
    const heroSliderWrap = document.getElementById('heroSliderWrap');
    const heroSliderStage = document.getElementById('heroSliderStage');
    const sliderPrevBtn = document.getElementById('sliderPrevBtn');
    const sliderNextBtn = document.getElementById('sliderNextBtn');

    if (heroSliderStage && sliderPrevBtn && sliderNextBtn) {
        const slides = Array.from(heroSliderStage.querySelectorAll('.hero-slider-card'));
        const totalSlides = slides.length;

        if (totalSlides > 0) {
            let currentIndex = 0;
            let isAnimating = false;
            let autoplayTimer = null;

            function updateCardPositions(newIndex) {
                if (isAnimating) return;
                isAnimating = true;

                currentIndex = (newIndex + totalSlides) % totalSlides;

                slides.forEach(function (slide, i) {
                    // Modular distance from currentIndex in range [-floor(N/2), floor((N-1)/2)]
                    let diff = i - currentIndex;
                    while (diff > totalSlides / 2) diff -= totalSlides;
                    while (diff < -totalSlides / 2) diff += totalSlides;

                    const wasHiddenLeft = slide.classList.contains('card-hidden-left');
                    const wasHiddenRight = slide.classList.contains('card-hidden-right');

                    let targetClass = '';
                    if (diff === 0) {
                        targetClass = 'card-center';
                    } else if (diff === 1) {
                        targetClass = 'card-next';
                    } else if (diff === -1) {
                        targetClass = 'card-prev';
                    } else if (diff < -1) {
                        targetClass = 'card-hidden-left';
                    } else {
                        targetClass = 'card-hidden-right';
                    }

                    // Prevent offscreen cards from animating across screen when flipping boundaries
                    const isFlippingSides = (wasHiddenLeft && targetClass === 'card-hidden-right') ||
                                            (wasHiddenRight && targetClass === 'card-hidden-left');

                    if (isFlippingSides) {
                        slide.classList.add('no-transition');
                    }

                    slide.classList.remove(
                        'card-center',
                        'card-next',
                        'card-prev',
                        'card-hidden-left',
                        'card-hidden-right',
                        'is-active'
                    );

                    slide.classList.add(targetClass);

                    if (targetClass === 'card-center') {
                        slide.classList.add('is-active');
                        slide.setAttribute('aria-hidden', 'false');
                        slide.setAttribute('tabindex', '0');
                    } else {
                        slide.setAttribute('aria-hidden', 'true');
                        slide.setAttribute('tabindex', '-1');
                    }

                    if (isFlippingSides) {
                        void slide.offsetWidth; // Force layout reflow
                        requestAnimationFrame(function () {
                            slide.classList.remove('no-transition');
                        });
                    }
                });

                setTimeout(function () {
                    isAnimating = false;
                }, 660);
            }

            function handleNext() {
                if (isAnimating) return;
                updateCardPositions(currentIndex + 1);
            }

            function handlePrev() {
                if (isAnimating) return;
                updateCardPositions(currentIndex - 1);
            }

            sliderNextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                handleNext();
                resetAutoplay();
            });

            sliderPrevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                handlePrev();
                resetAutoplay();
            });

            // Clicking on a side card slides it into center
            slides.forEach(function (slide) {
                slide.addEventListener('click', function (e) {
                    if (this.classList.contains('card-next')) {
                        e.preventDefault();
                        handleNext();
                        resetAutoplay();
                    } else if (this.classList.contains('card-prev')) {
                        e.preventDefault();
                        handlePrev();
                        resetAutoplay();
                    }
                });
            });

            // Touch Swipe Gestures
            let touchStartX = 0;
            let touchStartY = 0;
            let touchStartTime = 0;
            const touchArea = heroSliderWrap || heroSliderStage;

            touchArea.addEventListener('touchstart', function (e) {
                if (e.touches && e.touches.length > 0) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    touchStartTime = Date.now();
                }
            }, { passive: true });

            touchArea.addEventListener('touchend', function (e) {
                if (e.changedTouches && e.changedTouches.length > 0) {
                    const diffX = e.changedTouches[0].clientX - touchStartX;
                    const diffY = e.changedTouches[0].clientY - touchStartY;
                    const duration = Date.now() - touchStartTime;

                    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35 && duration < 800) {
                        if (diffX < 0) {
                            handleNext();
                        } else {
                            handlePrev();
                        }
                        resetAutoplay();
                    }
                }
            }, { passive: true });

            // Keyboard navigation
            window.addEventListener('keydown', function (e) {
                const rect = heroSliderStage.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                if (!inView) return;

                if (e.key === 'ArrowLeft') {
                    handlePrev();
                    resetAutoplay();
                } else if (e.key === 'ArrowRight') {
                    handleNext();
                    resetAutoplay();
                }
            });

            // Autoplay with Pause on Hover
            function startAutoplay() {
                stopAutoplay();
                autoplayTimer = setInterval(handleNext, 5000);
            }

            function stopAutoplay() {
                if (autoplayTimer) {
                    clearInterval(autoplayTimer);
                    autoplayTimer = null;
                }
            }

            function resetAutoplay() {
                stopAutoplay();
                startAutoplay();
            }

            const hoverTarget = heroSliderWrap || heroSliderStage;
            hoverTarget.addEventListener('mouseenter', stopAutoplay);
            hoverTarget.addEventListener('mouseleave', startAutoplay);
            sliderPrevBtn.addEventListener('mouseenter', stopAutoplay);
            sliderPrevBtn.addEventListener('mouseleave', startAutoplay);
            sliderNextBtn.addEventListener('mouseenter', stopAutoplay);
            sliderNextBtn.addEventListener('mouseleave', startAutoplay);

            // Initial positioning
            updateCardPositions(0);
            isAnimating = false;

            startAutoplay();
        }
    }
});
