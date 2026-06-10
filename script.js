/* ==========================================================================
   DESA WONOANTI PORTAL LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. STICKY NAVBAR & NAVIGATION HIGHLIGHTING
       ========================================================================== */
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header transition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Highlight Active Link on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially to set starting state

    /* ==========================================================================
       2. MOBILE MENU INTERACTION
       ========================================================================== */
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = menuToggleBtn.querySelector('.icon-open');
    const iconClose = menuToggleBtn.querySelector('.icon-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        
        if (isOpen) {
            iconOpen.style.display = 'none';
            iconClose.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Stop scrolling behind menu
        } else {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    };

    menuToggleBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    /* ==========================================================================
       3. COUNT-UP ANIMATION FOR STATISTICS
       ========================================================================== */
    const statsSection = document.querySelector('.statistics-floating-panel');
    const counters = document.querySelectorAll('.counter');
    let hasAnimatedStats = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const countTo = target;
            let start = 0;
            const duration = 2000; // 2 seconds
            const increment = countTo / (duration / 16); // ~60fps
            
            const updateCount = () => {
                start += increment;
                if (start < countTo) {
                    counter.innerText = Math.floor(start);
                    setTimeout(updateCount, 16);
                } else {
                    counter.innerText = countTo;
                }
            };
            updateCount();
        });
    };

    // Use Intersection Observer for trigger
    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    animateCounters();
                    hasAnimatedStats = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       4. SCROLL REVEAL TRIGGERS
       ========================================================================== */
    const revealElements = document.querySelectorAll(
        '.reveal-fade-in, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       5. GALLERY FILTER SYSTEM
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from other buttons
            filterButtons.forEach(button => button.classList.remove('active'));
            // Add to current button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    // Retrigger light scale animation
                    item.style.animation = 'fadeIn 0.4s ease';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ==========================================================================
       6. LIGHTBOX MODAL SYSTEM
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Track visible items for navigation
    let visibleGalleryItems = [];
    let currentImageIndex = 0;

    // Open Lightbox
    window.openLightbox = (clickedItem) => {
        // Collect currently filtered/visible items
        visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        currentImageIndex = visibleGalleryItems.indexOf(clickedItem);
        
        updateLightboxContent();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    // Close Lightbox
    window.closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Next/Prev Image Navigation
    window.changeImage = (direction) => {
        currentImageIndex += direction;
        
        // Loop back logic
        if (currentImageIndex >= visibleGalleryItems.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = visibleGalleryItems.length - 1;
        }
        
        updateLightboxContent();
    };

    // Update Lightbox image and details
    const updateLightboxContent = () => {
        const activeItem = visibleGalleryItems[currentImageIndex];
        const img = activeItem.querySelector('.gallery-img');
        const captionText = activeItem.querySelector('.gallery-overlay h4').innerText;
        const tagText = activeItem.querySelector('.gallery-tag').innerText;

        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = `<strong>${tagText}</strong> — ${captionText}`;
    };

    // Close Lightbox on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation inside lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        }
    });
});
