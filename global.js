// Global variables to prevent multiple initializations
let isHeroSliderInitialized = false;
let isMobileMenuInitialized = false;
let isThumbnailsInitialized = false;
let productSlider = null;

// Mobile menu functions
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.classList.toggle('active');
    }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    if (isMobileMenuInitialized) return;

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileNav = document.getElementById('mobileNav');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileNav && menuBtn && !mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileNav.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav && window.innerWidth > 768) {
            mobileNav.classList.remove('active');
        }
    });

    isMobileMenuInitialized = true;
}

// Hero Slider Data - Updated with existing images for testing
const sliderData = [
    {
        text1: "はじめてのひなまつり",
        text2: "心をつなぐ",
        buttonText: "雛人形を探す",
        centerImage: "assets/hero12.png",
        rightImage: "assets/hero13.png",
        overlayText: "For your little one.",
        backgroundColor: "#ffffff" // Slide 1 specific background
    },
    {
        text1: "邪を祓う贈りもの。",
        text2: "守りたい想い。",
        buttonText: "破魔弓を探す",
        centerImage: "assets/hero14.png",
        rightImage: "assets/hero15.png",
        overlayText: "Symbol of protection",
        backgroundColor: "#CCE8CD" // Slide 2 specific background
    },
    {
        text1: "華やかな贈りもの。",
        text2: "健やかな成長を願う、",
        buttonText: "羽子板を探す",
        centerImage: "assets/hero16.png",
        rightImage: "assets/hero17.png",
        overlayText: "Celebrate growth",
        backgroundColor: "#FFDCDC" // Slide 3 specific background
    },
    {
        text1: "健やかな未来へ。",
        text2: "強く、やさしく。",
        buttonText: "五月人形を探す",
        centerImage: "assets/hero18.png",
        rightImage: "assets/hero19.png",
        overlayText: "Strong and kind,<br>Samurai heart", // Fixed line break
        backgroundColor: "#ffffff" // Slide 4 specific background
    }
];

let currentSlide = 0;
let isAnimating = false;
let autoSlideInterval;

// Initialize slider when DOM is loaded
function initHeroSlider() {
    if (isHeroSliderInitialized) return;

    // Wait for elements to be available
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) {
        // Retry after a short delay if elements aren't ready
        setTimeout(initHeroSlider, 100);
        return;
    }

    // Set initial slide content
    updateSlideContent(0, false);
    
    // Start auto-slide
    startAutoSlide();
    
    // Add mouse events to pause/resume auto-slide
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);

    isHeroSliderInitialized = true;
}

function updateSlideContent(slideIndex, animate = true) {
    if (isAnimating) return;
    
    const slide = sliderData[slideIndex];
    console.log('Updating to slide:', slideIndex, slide);
    
    // Get elements with better error checking
    const verticalTexts = document.querySelectorAll('.vertical-text');
    const verticalTexts1 = document.querySelectorAll('.vertical-text1');
    const heroButtons = document.querySelectorAll('.hero-button, .button1');
    const centerImage = document.querySelector('.hero-center img');
    const rightImage = document.querySelector('.hero-right img');
    const overlayText = document.querySelector('.hero-overlay-text');
    const heroPattern = document.querySelector('.hero-pattern');
    const heroLeft = document.querySelector('.hero-left');
    
    if (animate && typeof gsap !== 'undefined') {
        isAnimating = true;
        
        // Super fast timeline - total duration under 0.3s
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
            }
        });
        
        // Prepare elements for animation
        const textElements = [...verticalTexts, ...verticalTexts1, ...heroButtons];
        const imageElements = [];
        if (centerImage) imageElements.push(centerImage);
        if (rightImage) imageElements.push(rightImage);
        if (overlayText) imageElements.push(overlayText);
        
        // Lightning fast crossfade - all elements fade simultaneously
        tl.to([...textElements, ...imageElements], {
            opacity: 0,
            duration: 0.05, // Even faster fade out
            ease: "none" // No easing for maximum speed
        })
        // Update content immediately
        .call(() => {
            updateContent();
        }, [], "-=0.02")
        // Instant background change
        .set(heroLeft, {
            backgroundColor: slide.backgroundColor
        })
        // Super quick fade in
        .to([...textElements, ...imageElements], {
            opacity: 1,
            duration: 0.08,
            ease: "none"
        })
        // Minimal pattern rotation
        .to(heroPattern, {
            rotation: "+=45", // Smaller rotation
            duration: 0.1,
            ease: "none"
        }, "-=0.08");
        
    } else {
        // No animation fallback
        updateContent();
        if (heroLeft) {
            heroLeft.style.backgroundColor = slide.backgroundColor;
        }
    }
    
    function updateContent() {
        // Update text content
        if (verticalTexts[0]) verticalTexts[0].textContent = slide.text1;
        if (verticalTexts[1]) verticalTexts[1].textContent = slide.text2;
        if (verticalTexts1[0]) verticalTexts1[0].textContent = slide.text1;
        if (verticalTexts1[1]) verticalTexts1[1].textContent = slide.text2;
        
        // Update button text
        heroButtons.forEach(btn => {
            const span = btn.querySelector('span');
            if (span) span.textContent = slide.buttonText;
        });
        
        // Update images with immediate loading
        if (centerImage) {
            centerImage.src = slide.centerImage;
            centerImage.alt = slide.text1;
        }
        if (rightImage) {
            rightImage.src = slide.rightImage;
            rightImage.alt = slide.text1;
        }
        
        // Update overlay text with HTML support for line breaks
        if (overlayText) {
            overlayText.innerHTML = slide.overlayText;
        }
        
        console.log('Content updated successfully');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % sliderData.length;
    updateSlideContent(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + sliderData.length) % sliderData.length;
    updateSlideContent(currentSlide);
}

function goToSlide(index) {
    if (index !== currentSlide && !isAnimating) {
        currentSlide = index;
        updateSlideContent(currentSlide);
    }
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 3500); // Slightly shorter interval since animations are faster
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Manual navigation functions
window.heroSlider = {
    next: nextSlide,
    prev: prevSlide,
    goTo: goToSlide,
    start: startAutoSlide,
    stop: stopAutoSlide
};

// Preload images for instant switching
function preloadImages() {
    sliderData.forEach(slide => {
        const img1 = new Image();
        const img2 = new Image();
        img1.src = slide.centerImage;
        img2.src = slide.rightImage;
        
        // Force images to load immediately
        img1.onload = () => console.log('Preloaded:', slide.centerImage);
        img2.onload = () => console.log('Preloaded:', slide.rightImage);
    });
}

// Initialize thumbnail and tab functionality
function initializeThumbnails() {
    if (isThumbnailsInitialized) return;

    const thumbnails = document.querySelectorAll('.mokab-thumbnail');
    const mainImage = document.querySelector('.mokab-main-image img');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                this.classList.add('active');
                // Update main image source
                mainImage.src = this.src.replace('98x98', '560x560');
            });
        });
    }

    // Tab functionality
    const tabs = document.querySelectorAll('.mokab-tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    isThumbnailsInitialized = true;
}
  const heartBtns = document.querySelectorAll('.heart-btn');

  heartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });


// Mobile Nav Accordion (JS only)
function initializeMobileNavAccordion() {
  const titles = document.querySelectorAll(".mobile-nav-title");

  // hide all nav lists initially
  document.querySelectorAll(".mobile-nav-list").forEach(list => {
    list.style.display = "none";
  });

  titles.forEach((title, index) => {
    // ❌ Skip last one
    if (index === titles.length - 1) return;

    title.addEventListener("click", () => {
      const section = title.parentElement;
      const list = section.querySelector(".mobile-nav-list");
      const arrow = title.querySelector("svg");

      if (!list) return;

      // toggle open/close
      if (list.style.display === "block") {
        list.style.display = "none";
        if (arrow) arrow.style.transform = "rotate(180deg)";
      } else {
        list.style.display = "block";
        if (arrow) arrow.style.transform = "rotate(0deg)";
      }
    });
  });
}



// Mobile Product Slider Implementation for Multiple Sections
class MobileProductSlider {
    constructor() {
        this.sliders = [];
        this.reviewSliders = [];
        this.isInitialized = false;
        // Don't auto-initialize in constructor, wait for DOM
    }

    // Review Slider Methods
    setupReviewSliders() {
        const reviewsSections = document.querySelectorAll('.reviews-section');
        
        reviewsSections.forEach((section, sectionIndex) => {
            this.setupSingleReviewSlider(section, sectionIndex);
        });
    }

    setupSingleReviewSlider(section, sectionIndex) {
        const reviewsContainer = section.querySelector('.reviews-container');
        const reviewCards = section.querySelectorAll('.review-card');
        
        if (!reviewsContainer || reviewCards.length === 0) return;

        // Store slider data
        const reviewSliderData = {
            currentSlide: 0,
            reviews: Array.from(reviewCards),
            section: section,
            reviewsContainer: reviewsContainer
        };

        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.className = `mobile-review-slider-container review-slider-${sectionIndex}`;
        sliderContainer.style.cssText = `
            display: none;
            position: relative;
            width: 100%;
            overflow: hidden;
            padding: 10px 0;
        `;

        // Create slider wrapper
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'mobile-review-slider-wrapper';
        sliderWrapper.style.cssText = `
            display: flex;
            transition: transform 0.3s ease;
            width: ${reviewSliderData.reviews.length * 100}%;
        `;

        // Create slides (no flower)
        reviewSliderData.reviews.forEach((review) => {
            const slide = document.createElement('div');
            slide.className = 'mobile-review-slide';
            slide.style.cssText = `
                width: ${100 / reviewSliderData.reviews.length}%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0 20px;
                box-sizing: border-box;
            `;

            // Clone the review card
            const clonedReview = review.cloneNode(true);
            clonedReview.style.cssText = `
                width: 100%;
                max-width: 350px;
                background: #f8f6f2;
                padding: 28px 24px;
                text-align: left;
                position: relative;
                border-radius: 4px;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
                margin: 0 auto;
            `;

            slide.appendChild(clonedReview);
            sliderWrapper.appendChild(slide);
        });

        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'review-slider-nav prev';
        prevButton.innerHTML = '‹';
        prevButton.style.cssText = `
            position: absolute;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            background: black;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const nextButton = document.createElement('button');
        nextButton.className = 'review-slider-nav next';
        nextButton.innerHTML = '›';
        nextButton.style.cssText = `
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
            background: black;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create dots indicator
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'review-slider-dots';
        dotsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
        `;

        reviewSliderData.reviews.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'review-slider-dot';
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: ${index === 0 ? '#050505' : 'rgba(5, 5, 5, 0.3)'};
                cursor: pointer;
                transition: background 0.3s ease;
            `;
            dot.addEventListener('click', () => this.goToReviewSlide(sectionIndex, index));
            dotsContainer.appendChild(dot);
        });

        // Assemble slider
        sliderContainer.appendChild(sliderWrapper);
        sliderContainer.appendChild(prevButton);
        sliderContainer.appendChild(nextButton);
        sliderContainer.appendChild(dotsContainer);

        // Insert after reviews container
        reviewsContainer.parentNode.insertBefore(sliderContainer, reviewsContainer.nextSibling);

        // Store references
        reviewSliderData.sliderContainer = sliderContainer;
        reviewSliderData.sliderWrapper = sliderWrapper;
        reviewSliderData.dots = dotsContainer.querySelectorAll('.review-slider-dot');

        // Add navigation event listeners
        prevButton.addEventListener('click', () => this.prevReviewSlide(sectionIndex));
        nextButton.addEventListener('click', () => this.nextReviewSlide(sectionIndex));

        // Add touch/swipe support
        this.addReviewTouchSupport(sliderWrapper, sectionIndex);

        // Store this slider
        this.reviewSliders[sectionIndex] = reviewSliderData;

        // Show appropriate view based on screen size
        this.updateView();
    }

    addReviewTouchSupport(element, sectionIndex) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        element.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        element.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextReviewSlide(sectionIndex);
                } else {
                    this.prevReviewSlide(sectionIndex);
                }
            }
        });
    }

    goToReviewSlide(sectionIndex, slideIndex) {
        const reviewSliderData = this.reviewSliders[sectionIndex];
        if (!reviewSliderData) return;

        reviewSliderData.currentSlide = slideIndex;
        this.updateReviewSliderPosition(sectionIndex);
        this.updateReviewDots(sectionIndex);
    }

    nextReviewSlide(sectionIndex) {
        const reviewSliderData = this.reviewSliders[sectionIndex];
        if (!reviewSliderData) return;

        reviewSliderData.currentSlide = (reviewSliderData.currentSlide + 1) % reviewSliderData.reviews.length;
        this.updateReviewSliderPosition(sectionIndex);
        this.updateReviewDots(sectionIndex);
    }

    prevReviewSlide(sectionIndex) {
        const reviewSliderData = this.reviewSliders[sectionIndex];
        if (!reviewSliderData) return;

        reviewSliderData.currentSlide = (reviewSliderData.currentSlide - 1 + reviewSliderData.reviews.length) % reviewSliderData.reviews.length;
        this.updateReviewSliderPosition(sectionIndex);
        this.updateReviewDots(sectionIndex);
    }

    updateReviewSliderPosition(sectionIndex) {
        const reviewSliderData = this.reviewSliders[sectionIndex];
        if (!reviewSliderData || !reviewSliderData.sliderWrapper) return;
        
        const translateX = -reviewSliderData.currentSlide * (100 / reviewSliderData.reviews.length);
        reviewSliderData.sliderWrapper.style.transform = `translateX(${translateX}%)`;
    }

    updateReviewDots(sectionIndex) {
        const reviewSliderData = this.reviewSliders[sectionIndex];
        if (!reviewSliderData || !reviewSliderData.dots) return;
        
        reviewSliderData.dots.forEach((dot, index) => {
            dot.style.background = index === reviewSliderData.currentSlide ? '#050505' : 'rgba(5, 5, 5, 0.3)';
        });
    }

    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        if (this.isInitialized) return;
        
        this.setupAllSliders();
        this.setupReviewSliders();
        this.addEventListeners();
        this.isInitialized = true;
    }

    setupAllSliders() {
        // Find all product showcase sections
        const showcaseSections = document.querySelectorAll('.product-showcase-section');
        
        showcaseSections.forEach((section, sectionIndex) => {
            this.setupSingleSlider(section, sectionIndex);
        });
    }

    setupSingleSlider(section, sectionIndex) {
        const productGrid = section.querySelector('.product-grid');
        const productCards = section.querySelectorAll('.product-card');
        
        if (!productGrid || productCards.length === 0) return;

        // Store slider data
        const sliderData = {
            currentSlide: 0,
            products: Array.from(productCards),
            section: section,
            productGrid: productGrid
        };

        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.className = `mobile-slider-container slider-${sectionIndex}`;
        sliderContainer.style.cssText = `
            display: none;
            position: relative;
            width: 100%;
            overflow: hidden;
            background: #F5F2EC;
            padding: 20px 0;
        `;

        // Create slider wrapper
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'mobile-slider-wrapper';
        sliderWrapper.style.cssText = `
            display: flex;
            transition: transform 0.3s ease;
            width: ${sliderData.products.length * 100}%;
        `;

        // Create slides
        sliderData.products.forEach((product, index) => {
            const slide = document.createElement('div');
            slide.className = 'mobile-slide';
            slide.style.cssText = `
                width: ${100 / sliderData.products.length}%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
            `;

            // Clone the product card
            const clonedProduct = product.cloneNode(true);
            clonedProduct.style.cssText = `
                width: 100%;
                max-width: 350px;
                flex-direction: column;
                text-align: center;
            `;

            // Adjust product image and info for mobile
            const productImage = clonedProduct.querySelector('.product-image');
            const productInfo = clonedProduct.querySelector('.product-info');
            
            if (productImage) {
                productImage.style.cssText = `
                    width: 100%;
                    height: 250px;
                    background: #F5F2EC;
                    padding: 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    margin-bottom: 10px;
                `;
            }

            if (productInfo) {
                productInfo.style.cssText = `
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                `;
            }

            slide.appendChild(clonedProduct);
            sliderWrapper.appendChild(slide);
        });

        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'slider-nav prev';
        prevButton.innerHTML = '‹';
        prevButton.style.cssText = `
            position: absolute;
            left: 10px;
            top: 33%;
            transform: translateY(-50%);
            background: black;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const nextButton = document.createElement('button');
        nextButton.className = 'slider-nav next';
        nextButton.innerHTML = '›';
        nextButton.style.cssText = `
            position: absolute;
            right: 10px;
            top: 33%;
            transform: translateY(-50%);
            background: black;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create dots indicator
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        dotsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
        `;

        sliderData.products.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: ${index === 0 ? '#050505' : 'rgba(5, 5, 5, 0.3)'};
                cursor: pointer;
                transition: background 0.3s ease;
            `;
            dot.addEventListener('click', () => this.goToSlide(sectionIndex, index));
            dotsContainer.appendChild(dot);
        });

        // Assemble slider
        sliderContainer.appendChild(sliderWrapper);
        sliderContainer.appendChild(prevButton);
        sliderContainer.appendChild(nextButton);
        sliderContainer.appendChild(dotsContainer);

        // Insert after product grid
        productGrid.parentNode.insertBefore(sliderContainer, productGrid.nextSibling);

        // Store references
        sliderData.sliderContainer = sliderContainer;
        sliderData.sliderWrapper = sliderWrapper;
        sliderData.dots = dotsContainer.querySelectorAll('.slider-dot');

        // Add navigation event listeners
        prevButton.addEventListener('click', () => this.prevSlide(sectionIndex));
        nextButton.addEventListener('click', () => this.nextSlide(sectionIndex));

        // Add touch/swipe support
        this.addTouchSupport(sliderWrapper, sectionIndex);

        // Store this slider
        this.sliders[sectionIndex] = sliderData;

        // Show appropriate view based on screen size
        this.updateView();
    }

    addTouchSupport(element, sectionIndex) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        element.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        element.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide(sectionIndex);
                } else {
                    this.prevSlide(sectionIndex);
                }
            }
        });
    }

    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.updateView());
    }

    updateView() {
        if (!this.isInitialized) return;

        const isMobile = window.innerWidth <= 768;
        
        this.sliders.forEach((sliderData) => {
            if (!sliderData) return;
            
            if (isMobile) {
                sliderData.productGrid.style.display = 'none';
                sliderData.sliderContainer.style.display = 'block';
            } else {
                sliderData.productGrid.style.display = 'flex';
                sliderData.sliderContainer.style.display = 'none';
            }
        });

        // Handle review sliders
        this.reviewSliders.forEach((reviewSliderData) => {
            if (!reviewSliderData) return;
            
            if (isMobile) {
                reviewSliderData.reviewsContainer.style.display = 'none';
                reviewSliderData.sliderContainer.style.display = 'block';
            } else {
                reviewSliderData.reviewsContainer.style.display = 'grid';
                reviewSliderData.sliderContainer.style.display = 'none';
            }
        });
    }

    goToSlide(sectionIndex, slideIndex) {
        const sliderData = this.sliders[sectionIndex];
        if (!sliderData) return;

        sliderData.currentSlide = slideIndex;
        this.updateSliderPosition(sectionIndex);
        this.updateDots(sectionIndex);
    }

    nextSlide(sectionIndex) {
        const sliderData = this.sliders[sectionIndex];
        if (!sliderData) return;

        sliderData.currentSlide = (sliderData.currentSlide + 1) % sliderData.products.length;
        this.updateSliderPosition(sectionIndex);
        this.updateDots(sectionIndex);
    }

    prevSlide(sectionIndex) {
        const sliderData = this.sliders[sectionIndex];
        if (!sliderData) return;

        sliderData.currentSlide = (sliderData.currentSlide - 1 + sliderData.products.length) % sliderData.products.length;
        this.updateSliderPosition(sectionIndex);
        this.updateDots(sectionIndex);
    }

    updateSliderPosition(sectionIndex) {
        const sliderData = this.sliders[sectionIndex];
        if (!sliderData || !sliderData.sliderWrapper) return;
        
        const translateX = -sliderData.currentSlide * (100 / sliderData.products.length);
        sliderData.sliderWrapper.style.transform = `translateX(${translateX}%)`;
    }

    updateDots(sectionIndex) {
        const sliderData = this.sliders[sectionIndex];
        if (!sliderData || !sliderData.dots) return;
        
        sliderData.dots.forEach((dot, index) => {
            dot.style.background = index === sliderData.currentSlide ? '#050505' : 'rgba(5, 5, 5, 0.3)';
        });
    }
}

// Main initialization function
function initializeAllFunctions() {
    console.log('Initializing all functions...');
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize hero slider
    initHeroSlider();
    
    // Preload images
    preloadImages();
    
    // Initialize thumbnails and tabs
    initializeThumbnails();

    initializeMobileNavAccordion();
    
    // Initialize mobile product slider
    if (!productSlider) {
        productSlider = new MobileProductSlider();
        productSlider.init();
    }
    
    console.log('All functions initialized successfully');
}

// Multiple initialization strategies to ensure reliability
document.addEventListener('DOMContentLoaded', initializeAllFunctions);

// Backup initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM is still loading, DOMContentLoaded will fire
    console.log('DOM is loading, waiting for DOMContentLoaded');
} else {
    // DOM is already loaded, initialize immediately
    console.log('DOM already loaded, initializing immediately');
    initializeAllFunctions();
}

// Additional backup with a small delay for edge cases
setTimeout(() => {
    if (!isHeroSliderInitialized || !isMobileMenuInitialized || !isThumbnailsInitialized || !productSlider?.isInitialized) {
        console.log('Some functions not initialized, retrying...');
        initializeAllFunctions();
    }
}, 500);

// Handle page show event (for back/forward navigation)
window.addEventListener('pageshow', function(event) {
    console.log('Page show event fired');
    // Reinitialize if coming from cache
    if (event.persisted) {
        console.log('Page loaded from cache, reinitializing...');
        initializeAllFunctions();
    }
});

// Handle visibility change (when tab becomes visible again)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Ensure sliders are still working when page becomes visible
        if (productSlider && productSlider.isInitialized) {
            productSlider.updateView();
        }
    }
});

// Optional: Auto-play functionality for all sliders (uncomment if needed)
/*
setInterval(() => {
    if (window.innerWidth <= 768 && productSlider && productSlider.isInitialized) {
        productSlider.sliders.forEach((_, index) => {
            productSlider.nextSlide(index);
        });
    }
}, 5000); // Auto-advance every 5 seconds on mobile
*/