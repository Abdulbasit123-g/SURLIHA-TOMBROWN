/* -------------------------------------------------------------
   SURHLIHA TOMBROWN - INTERACTIVE LOGIC
   Features: Sticky Navigation, Theme Toggle, ScrollSpy, Back to Top, 
             Scroll Progress, Portion Calculator, Checklist, Discounts, Carousels, Toasts
   Author: Antigravity AI
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // --- DARK MODE THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }

    // --- STICKY HEADER & SCROLL LOGIC ---
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollBar = document.getElementById('scroll-bar');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollBar) {
            scrollBar.style.width = scrollPercent + '%';
        }

        // Back to Top Button visibility
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // ScrollSpy (Highlight active link in navbar)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // adjust offset for sticky header
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
    });

    // Back to Top Click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- MOBILE MENU TOGGLE ---
    const mobileMenuBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 3D TILT HOVER EFFECT ---
    const tiltCards = document.querySelectorAll('.benefit-card, .recipe-card, .testimonial-card, .service-box');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            const xc = cardRect.width / 2;
            const yc = cardRect.height / 2;
            const angleX = (yc - y) / 20; // Sensitivity parameter
            const angleY = (x - xc) / 20;
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4.2;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
    };

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);


    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // --- DYNAMIC NUTRITION FACTS CALCULATOR ---
    function animateValue(obj, start, end, duration, decimals = 0) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = progress * (end - start) + start;
            obj.innerHTML = currentVal.toFixed(decimals);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toFixed(decimals);
            }
        };
        window.requestAnimationFrame(step);
    }

    const nutriToggles = document.querySelectorAll('.btn-nutri-toggle');
    const servText = document.getElementById('nutri-serv-text');
    const packsText = document.getElementById('nutri-packs-text');
    
    nutriToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            nutriToggles.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const multiplier = parseFloat(btn.getAttribute('data-multiplier'));
            const label = btn.getAttribute('data-label');
            const servings = btn.getAttribute('data-servings');
            
            if (servText) servText.textContent = `Serving Size: ${label}`;
            if (packsText) packsText.textContent = `Servings Per Pack: ~${servings}`;
            
            // Update values
            const nutrients = [
                { id: 'nutri-calories', decimals: 0 },
                { id: 'nutri-fat', decimals: 0 },
                { id: 'nutri-fat-dv', decimals: 0 },
                { id: 'nutri-satfat', decimals: 1 },
                { id: 'nutri-satfat-dv', decimals: 0 },
                { id: 'nutri-sodium', decimals: 0 },
                { id: 'nutri-sodium-dv', decimals: 0 },
                { id: 'nutri-carb', decimals: 0 },
                { id: 'nutri-carb-dv', decimals: 0 },
                { id: 'nutri-fiber', decimals: 0 },
                { id: 'nutri-fiber-dv', decimals: 0 },
                { id: 'nutri-protein', decimals: 1 },
                { id: 'nutri-protein-dv', decimals: 0 },
                { id: 'nutri-iron', decimals: 0 },
                { id: 'nutri-calcium', decimals: 0 },
                { id: 'nutri-vitb6', decimals: 0 }
            ];
            
            nutrients.forEach(n => {
                const el = document.getElementById(n.id);
                if (el) {
                    const baseVal = parseFloat(el.getAttribute('data-base'));
                    const currentVal = parseFloat(el.textContent) || 0;
                    const targetVal = baseVal * multiplier;
                    
                    // Add visual pop class
                    el.classList.remove('pop-nutrient');
                    void el.offsetWidth; // Trigger reflow
                    el.classList.add('pop-nutrient');
                    
                    animateValue(el, currentVal, targetVal, 300, n.decimals);
                }
            });
        });
    });

    // --- INTERACTIVE COOKING TIMELINE CHECKLIST ---
    const steps = document.querySelectorAll('.timeline-step');
    const loadTimelineProgress = () => {
        const progress = JSON.parse(localStorage.getItem('prepareProgress') || '[]');
        steps.forEach((step, idx) => {
            if (progress.includes(idx)) {
                step.classList.add('completed');
            }
        });
    };
    
    const saveTimelineProgress = () => {
        const progress = [];
        steps.forEach((step, idx) => {
            if (step.classList.contains('completed')) {
                progress.push(idx);
            }
        });
        localStorage.setItem('prepareProgress', JSON.stringify(progress));
    };
    
    steps.forEach((step, idx) => {
        step.addEventListener('click', () => {
            step.classList.toggle('completed');
            saveTimelineProgress();
        });
    });
    
    loadTimelineProgress();

    // --- WHATSAPP ORDER CALCULATOR ---
    const selectPackage = document.getElementById('order-package');
    const inputQuantity = document.getElementById('order-quantity');
    const selectShipping = document.getElementById('order-shipping');
    const btnMinus = document.getElementById('qty-minus');
    const btnPlus = document.getElementById('qty-plus');
    const labelUnitPrice = document.getElementById('price-unit');
    const labelSubtotal = document.getElementById('price-subtotal');
    const labelShipping = document.getElementById('price-shipping');
    const labelTotalPrice = document.getElementById('price-total');
    const textNotes = document.getElementById('order-notes');
    const orderForm = document.getElementById('whatsapp-order-form');

    // Prices and formatted currency helper
    const formatCurrency = (val) => {
        return '₦' + val.toLocaleString('en-US');
    };

    const updateCalculations = () => {
        if (!selectPackage || !inputQuantity) return;
        
        // Get unit price from selected option attribute
        const selectedOption = selectPackage.options[selectPackage.selectedIndex];
        const unitPrice = parseInt(selectedOption.getAttribute('data-price')) || 0;
        
        // Get quantity
        let qty = parseInt(inputQuantity.value) || 1;
        if (qty < 1) {
            qty = 1;
            inputQuantity.value = 1;
        }

        // Compute subtotal
        const subtotal = unitPrice * qty;

        // Compute discount (bulk tiers)
        let discount = 0;
        let discountPercent = 0;
        if (qty >= 5) {
            discountPercent = 10;
            discount = Math.round(subtotal * 0.1);
        } else if (qty >= 3) {
            discountPercent = 5;
            discount = Math.round(subtotal * 0.05);
        }

        // Get shipping cost (Free for qty >= 5 with shipping promo)
        let shippingCost = 0;
        let isFreeShipping = false;
        if (selectShipping) {
            const selectedShippingOption = selectShipping.options[selectShipping.selectedIndex];
            const baseShipping = parseInt(selectedShippingOption.getAttribute('data-price')) || 0;
            
            if (qty >= 5 && baseShipping > 0) {
                shippingCost = 0;
                isFreeShipping = true;
            } else {
                shippingCost = baseShipping;
            }
        }

        // Compute final total
        const finalTotal = subtotal - discount + shippingCost;

        // Render to UI
        if (labelUnitPrice) labelUnitPrice.textContent = formatCurrency(unitPrice);
        if (labelSubtotal) labelSubtotal.textContent = formatCurrency(subtotal);
        
        // Handle Discount Row Visibility
        const discountRow = document.getElementById('discount-row-display');
        const labelDiscount = document.getElementById('price-discount');
        if (discount > 0) {
            if (discountRow) discountRow.style.display = 'flex';
            if (labelDiscount) labelDiscount.textContent = `-₦${discount.toLocaleString()}`;
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }

        // Handle Shipping Row display
        if (labelShipping) {
            if (isFreeShipping) {
                labelShipping.textContent = 'FREE Promo';
                labelShipping.classList.add('discount-text');
            } else {
                labelShipping.textContent = formatCurrency(shippingCost);
                labelShipping.classList.remove('discount-text');
            }
        }
        
        if (labelTotalPrice) labelTotalPrice.textContent = formatCurrency(finalTotal);

        // Update Promo Banner Alerts
        const promoBanner = document.getElementById('promo-banner');
        if (promoBanner) {
            if (qty >= 5) {
                promoBanner.className = 'promo-banner success';
                const originalShipping = selectShipping ? parseInt(selectShipping.options[selectShipping.selectedIndex].getAttribute('data-price')) : 0;
                let savings = discount + (originalShipping > 0 ? originalShipping : 0);
                promoBanner.innerHTML = `<span>🎉 <strong>10% Discount + FREE Shipping</strong> unlocked! You saved <strong>₦${savings.toLocaleString()}</strong>!</span>`;
            } else if (qty >= 3) {
                promoBanner.className = 'promo-banner info';
                const originalShipping = selectShipping ? parseInt(selectShipping.options[selectShipping.selectedIndex].getAttribute('data-price')) : 0;
                let extraText = originalShipping > 0 ? ' & FREE Shipping' : '';
                promoBanner.innerHTML = `<span>💡 <strong>5% Discount</strong> unlocked! Add <strong>${5 - qty}</strong> more pack(s) to get <strong>10% off${extraText}</strong>!</span>`;
            } else {
                promoBanner.className = 'promo-banner info';
                promoBanner.innerHTML = `<span>💡 Add <strong>${3 - qty}</strong> more pack(s) to get <strong>5% off</strong>! Add 5 packs for <strong>10% off & FREE Shipping</strong>!</span>`;
            }
        }
    };

    // Event listeners for quantity changes
    if (btnMinus && btnPlus && inputQuantity) {
        btnMinus.addEventListener('click', () => {
            let val = parseInt(inputQuantity.value) || 1;
            if (val > 1) {
                inputQuantity.value = val - 1;
                updateCalculations();
            }
        });

        btnPlus.addEventListener('click', () => {
            let val = parseInt(inputQuantity.value) || 1;
            inputQuantity.value = val + 1;
            updateCalculations();
        });

        inputQuantity.addEventListener('input', () => {
            let val = parseInt(inputQuantity.value);
            if (isNaN(val) || val < 1) {
                // don't force reset instantly while typing
            } else {
                updateCalculations();
            }
        });

        inputQuantity.addEventListener('blur', () => {
            let val = parseInt(inputQuantity.value);
            if (isNaN(val) || val < 1) {
                inputQuantity.value = 1;
            }
            updateCalculations();
        });
    }

    if (selectPackage) {
        selectPackage.addEventListener('change', updateCalculations);
    }
    
    if (selectShipping) {
        selectShipping.addEventListener('change', updateCalculations);
    }

    // Trigger initial calculation
    updateCalculations();

    // --- FORM SUBMISSION (WHATSAPP REDIRECT) ---
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const selectedOption = selectPackage.options[selectPackage.selectedIndex];
            const packageName = selectedOption.value;
            const unitPrice = parseInt(selectedOption.getAttribute('data-price')) || 0;
            
            const quantity = parseInt(inputQuantity.value) || 1;
            const subtotal = unitPrice * quantity;
            
            // Compute discount (bulk tiers)
            const discount = quantity >= 5 ? Math.round(subtotal * 0.1) : (quantity >= 3 ? Math.round(subtotal * 0.05) : 0);
            const discountPercent = quantity >= 5 ? 10 : (quantity >= 3 ? 5 : 0);

            const selectedShippingOption = selectShipping.options[selectShipping.selectedIndex];
            const shippingZone = selectedShippingOption.value;
            const originalShipping = parseInt(selectedShippingOption.getAttribute('data-price')) || 0;
            
            let shippingCost = originalShipping;
            let shippingMessage = `₦${originalShipping.toLocaleString()}`;
            if (quantity >= 5 && originalShipping > 0) {
                shippingCost = 0;
                shippingMessage = `FREE Shipping Promo! (Saved ₦${originalShipping.toLocaleString()})`;
            }
            
            const totalPrice = subtotal - discount + shippingCost;
            const notes = textNotes.value.trim();

            // WhatsApp details
            const phoneNumber = '2349045308990'; 

            // Construct Message with universal & polite greeting
            let msg = `Greetings! I would like to place an order for Surliha Tombrown:\n\n`;
            msg += `🛒 *Product:* ${packageName}\n`;
            msg += `🔢 *Quantity:* ${quantity} pack(s)\n`;
            msg += `💰 *Subtotal:* ₦${subtotal.toLocaleString()}\n`;
            
            if (discount > 0) {
                msg += `🎉 *Bulk Discount:* -₦${discount.toLocaleString()} (${discountPercent}% off)\n`;
            }
            
            msg += `📍 *Delivery Zone:* ${shippingZone} (${shippingMessage})\n`;
            msg += `💵 *Final Total:* ₦${totalPrice.toLocaleString()}\n`;
            
            if (notes) {
                msg += `📝 *Delivery Address / Customization:* ${notes}\n`;
            }

            msg += `\nThank you! (Muslimah till jannah)`;

            // Encode message text
            const encodedMsg = encodeURIComponent(msg);

            // WhatsApp Web or Native App URL
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMsg}`;

            // Open in new tab
            window.open(whatsappUrl, '_blank');
        });
    }

    // --- TESTIMONIALS CAROUSEL SLIDER ---
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track ? track.children : []);
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-indicators');
    const dots = Array.from(dotsContainer ? dotsContainer.children : []);
    
    let currentSlideIndex = 0;
    let slideInterval = null;
    
    const updateCarousel = () => {
        if (!track) return;
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlideIndex);
        });
    };
    
    const nextSlide = () => {
        if (slides.length === 0) return;
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateCarousel();
    };
    
    const prevSlide = () => {
        if (slides.length === 0) return;
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    };
    
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }
    
    if (dots) {
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                currentSlideIndex = idx;
                updateCarousel();
                resetInterval();
            });
        });
    }
    
    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 6000);
    };
    
    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };
    
    // Touch / Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    const viewport = document.getElementById('carousel-viewport');
    if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        viewport.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
            resetInterval();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
            resetInterval();
        }
    };
    
    if (track && slides.length > 0) {
        startInterval();
    }

    // --- LIVE ORDER SIMULATED SOCIAL PROOF TOASTS ---
    const toastContainer = document.getElementById('toast-container');
    const customerNotesInput = document.getElementById('order-notes');
    let isUserTypingNotes = false;
    
    if (customerNotesInput) {
        customerNotesInput.addEventListener('focus', () => isUserTypingNotes = true);
        customerNotesInput.addEventListener('blur', () => isUserTypingNotes = false);
    }
    
    const names = ['Aisha', 'Fatima', 'Deji', 'Nneka', 'Zainab', 'Yusuf', 'Chidi', 'Aminu', 'Halima', 'Tunde', 'Kamilah', 'Bello', 'Emeka'];
    const locations = ['Lagos Mainland', 'Abuja Garki', 'Kano City', 'Port Harcourt', 'Ibadan Bodija', 'Kaduna Bypass', 'Enugu Layout', 'Benin City', 'Uyo', 'Ilorin Gaa', 'Abeokuta', 'Jos Rayfield', 'Minna'];
    const sizesList = ['Size 1 (Small - 250g)', 'Size 2 (Medium - 500g)', 'Size 3 (Large - 1kg)', 'Size 4 (Family - 2kg)'];
    
    const showOrderToast = () => {
        // Don't show toast if user is typing to avoid annoyance
        if (isUserTypingNotes || !toastContainer) return;
        
        const name = names[Math.floor(Math.random() * names.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const size = sizesList[Math.floor(Math.random() * sizesList.length)];
        const qty = Math.floor(Math.random() * 3) + 1; // 1-3 packs
        
        const toast = document.createElement('div');
        toast.className = 'order-toast';
        
        toast.innerHTML = `
            <div class="toast-avatar">${name[0]}</div>
            <div class="toast-body">
                <div class="toast-title">New Order Placed!</div>
                <div class="toast-desc"><strong>${name}</strong> from ${location} just ordered ${qty}x ${size.split(' ')[0] + ' ' + size.split(' ')[1]} pack!</div>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove after animation completes (6.5s total)
        setTimeout(() => {
            toast.remove();
        }, 6500);
    };
    
    // Show first toast after 10 seconds, then every 20-30 seconds
    setTimeout(() => {
        showOrderToast();
        setInterval(showOrderToast, Math.floor(Math.random() * 10000) + 20000);
    }, 10000);

    // --- FLOATING WHATSAPP WIDGET ATTENTION-GRABBER ---
    const floatWa = document.getElementById('whatsapp-float');
    if (floatWa) {
        setInterval(() => {
            floatWa.classList.add('widget-shake');
            setTimeout(() => {
                floatWa.classList.remove('widget-shake');
            }, 800);
        }, 12000);
    }

    // --- COOKING PORTION CALCULATOR LOGIC ---
    const prepQtyMinus = document.getElementById('prep-qty-minus');
    const prepQtyPlus = document.getElementById('prep-qty-plus');
    const prepServingsInput = document.getElementById('prep-servings');
    
    const prepTbsp = document.getElementById('prep-tbsp');
    const prepTbspMax = document.getElementById('prep-tbsp-max');
    const prepCups = document.getElementById('prep-cups');
    const prepCupsMax = document.getElementById('prep-cups-max');

    const updatePrepMeasurements = () => {
        if (!prepServingsInput) return;
        const portions = parseInt(prepServingsInput.value) || 1;

        const targets = [
            { el: prepTbsp, base: 3, decimals: 0 },
            { el: prepTbspMax, base: 4, decimals: 0 },
            { el: prepCups, base: 1.5, decimals: 1 },
            { el: prepCupsMax, base: 2, decimals: 0 }
        ];

        targets.forEach(t => {
            if (t.el) {
                const currentVal = parseFloat(t.el.textContent) || 0;
                const targetVal = t.base * portions;
                
                t.el.classList.remove('pop-val');
                void t.el.offsetWidth; // Trigger reflow
                t.el.classList.add('pop-val');
                
                animateValue(t.el, currentVal, targetVal, 250, t.decimals);
            }
        });
    };

    if (prepQtyMinus && prepQtyPlus && prepServingsInput) {
        prepQtyMinus.addEventListener('click', () => {
            let val = parseInt(prepServingsInput.value) || 1;
            if (val > 1) {
                prepServingsInput.value = val - 1;
                updatePrepMeasurements();
            }
        });

        prepQtyPlus.addEventListener('click', () => {
            let val = parseInt(prepServingsInput.value) || 1;
            if (val < 50) {
                prepServingsInput.value = val + 1;
                updatePrepMeasurements();
            }
        });
    }

    // --- BRAND FLYERS GALLERY LIGHTBOX ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (galleryItems && lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    if (lightboxCaption) {
                        lightboxCaption.textContent = img.alt;
                    }
                    lightbox.classList.add('active');
                    lightbox.setAttribute('aria-hidden', 'false');
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) {
                closeLightbox();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // --- PREPARE VIDEO PLAYER ---
    const prepVideo = document.getElementById('prep-video');
    const videoOverlay = document.getElementById('video-overlay');
    const playBtn = document.getElementById('video-play-btn');

    if (prepVideo && videoOverlay) {
        const playVideo = () => {
            prepVideo.play().then(() => {
                videoOverlay.classList.add('hidden');
                prepVideo.controls = true;
            }).catch(err => {
                console.error("Video play failed: ", err);
            });
        };

        const pauseVideo = () => {
            videoOverlay.classList.remove('hidden');
            prepVideo.controls = false;
        };

        if (playBtn) {
            playBtn.addEventListener('click', playVideo);
        }
        videoOverlay.addEventListener('click', playVideo);

        prepVideo.addEventListener('pause', pauseVideo);
        prepVideo.addEventListener('ended', () => {
            pauseVideo();
            prepVideo.load(); // reload to reset poster
        });
    }
});
