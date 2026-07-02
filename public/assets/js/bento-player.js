/**
 * Professional Bento Box Video Player with Info Bar
 */
(function () {
    'use strict';

    function initBentoPlayer() {
        // --- FILMSTRIP CINEMA CONTROLS ---
        const trackDark = document.querySelector('.layer__dark .filmstrip-track');
        const trackRed = document.querySelector('.layer__red .filmstrip-track');
        
        const cardsDark = document.querySelectorAll('.layer__dark .filmstrip-card');
        const cardsRed = document.querySelectorAll('.layer__red .filmstrip-card');
        
        const prevBtns = document.querySelectorAll('.filmstrip-prev-btn');
        const nextBtns = document.querySelectorAll('.filmstrip-next-btn');
        const countCurrents = document.querySelectorAll('.filmstrip-current-count');

        // Info bar elements
        const infoProjectName = document.getElementById('infoProjectName');
        const infoProjectType = document.getElementById('infoProjectType');
        const infoClient = document.getElementById('infoClient');
        const infoCountry = document.getElementById('infoCountry');
        const infoDuration = document.getElementById('infoDuration');
        const infoBudget = document.getElementById('infoBudget');
        const infoTools = document.getElementById('infoTools');

        if (!trackDark || !trackRed) return;

        // Assign view transition names dynamically to all filmstrip items (for visual excellence)
        cardsDark.forEach((item, index) => {
            item.style.viewTransitionName = `filmstrip-item-${index}`;
        });

        // --- Info Bar Update ---
        function updateInfoBar(item) {
            if (!item || !infoProjectName) return;

            const statValues = document.querySelectorAll('.video_info_stat_value');
            const infoCaseStudy = document.getElementById('infoCaseStudy');

            if (infoCaseStudy) {
                infoCaseStudy.style.transition = 'opacity 0.25s ease';
            }

            // Fade out all values
            statValues.forEach(v => v.classList.add('is-changing'));
            infoProjectName.style.opacity = '0';
            infoProjectType.style.opacity = '0';
            if (infoCaseStudy) infoCaseStudy.style.opacity = '0';

            // Update after fade-out
            setTimeout(() => {
                infoProjectName.textContent = item.getAttribute('data-title') || '—';
                infoProjectType.textContent = item.getAttribute('data-type') || '—';
                infoClient.textContent = item.getAttribute('data-client') || '—';
                infoCountry.textContent = item.getAttribute('data-country') || '—';
                infoDuration.textContent = item.getAttribute('data-duration') || '—';
                infoBudget.textContent = item.getAttribute('data-budget') || '—';
                infoTools.textContent = item.getAttribute('data-tools') || '—';

                if (infoCaseStudy) {
                    const teaser = item.getAttribute('data-teaser') || '—';
                    const slug = item.getAttribute('data-slug') || 'aurelius-fragrance';
                    const quote = item.getAttribute('data-testimonial-quote') || '';
                    const author = item.getAttribute('data-testimonial-author') || '';
                    
                    let testimonialHtml = '';
                    if (quote && author) {
                        testimonialHtml = `
                        <!-- Client Testimonial Card -->
                        <div class="client-testimonial-bento" style="margin: 25px 0; padding: 18px 24px; background: rgba(255, 255, 255, 0.015); border-left: 2px solid var(--accent); border-radius: 0 8px 8px 0; border-top: 1px solid rgba(255, 255, 255, 0.03); border-right: 1px solid rgba(255, 255, 255, 0.03); border-bottom: 1px solid rgba(255, 255, 255, 0.03); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);">
                            <p class="testimonial-quote" style="font-family: 'Outfit', sans-serif; font-style: italic; font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.8); margin: 0 0 10px 0;">"${quote}"</p>
                            <span class="testimonial-author" style="font-family: var(--mono); font-size: 9px; text-transform: uppercase; color: var(--accent); letter-spacing: 1.5px; display: block; font-weight: 600;">— ${author}</span>
                        </div>`;
                    }
                    
                    let htmlContent = `<div class="teaser-wrapper">
                        <span class="teaser-label" style="font-family: var(--mono); font-size: 10px; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 12px;">The Creative Challenge</span>
                        <p class="teaser-text" style="font-family: 'Outfit', sans-serif; font-size: 1.15rem; font-weight: 500; line-height: 1.5; color: #fff; margin: 0 0 20px 0;">${teaser}</p>
                        ${testimonialHtml}
                        <a href="work/${slug}.html" class="btn-teaser-case-study js-cursor-contract" style="display: inline-flex; align-items: center; gap: 8px; font-family: var(--hud-mono, monospace); font-size: 0.85rem; letter-spacing: 0.1em; color: #eb5939; text-decoration: none; font-weight: 700; transition: gap 0.3s ease;">
                            EXPLORE FULL CASE STUDY <span style="font-size: 1.1rem; line-height: 1;">&rarr;</span>
                        </a>
                    </div>`;
                    
                    infoCaseStudy.innerHTML = htmlContent;

                    // Update editorial stats
                    const roiVal = item.getAttribute('data-roi-val') || '4.2%';
                    const roiLbl = item.getAttribute('data-roi-lbl') || 'Click-Through Rate (CTR)<br>on Facebook Video Ads';
                    
                    const hudROI = document.getElementById('hudMetricROI');
                    const hudLabel = document.getElementById('hudMetricLabel');
                    
                    if (hudROI) hudROI.innerHTML = roiVal;
                    if (hudLabel) hudLabel.innerHTML = roiLbl;

                    // Update Case Study link href dynamically
                    const btnViewCaseStudy = document.getElementById('btnViewCaseStudy');
                    if (btnViewCaseStudy) {
                        btnViewCaseStudy.setAttribute('href', `work/${slug}.html`);
                    }
                }

                // Fade in
                statValues.forEach(v => v.classList.remove('is-changing'));
                infoProjectName.style.opacity = '1';
                infoProjectType.style.opacity = '1';
                if (infoCaseStudy) infoCaseStudy.style.opacity = '1';
            }, 250);
        }

        // --- Active Card Calculations ---
        function getActiveCardIndex(track, cards) {
            let closestIndex = 0;
            let closestDiff = Infinity;
            const scrollLeft = track.scrollLeft;
            cards.forEach((card, index) => {
                const diff = Math.abs(card.offsetLeft - scrollLeft);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestIndex = index;
                }
            });
            return closestIndex;
        }

        function highlightCard(index) {
            cardsDark.forEach((c, idx) => {
                if (idx === index) c.classList.add('is-active');
                else c.classList.remove('is-active');
            });
            cardsRed.forEach((c, idx) => {
                if (idx === index) c.classList.add('is-active');
                else c.classList.remove('is-active');
            });
        }

        // Initialize state with first card
        if (cardsDark.length > 0) {
            highlightCard(0);
            updateInfoBar(cardsDark[0]);
        }

        // --- Drag to Scroll (trackDark) ---
        let isDown = false;
        let startX;
        let scrollLeft;

        trackDark.addEventListener('mousedown', (e) => {
            isDown = true;
            trackDark.classList.add('is-dragging');
            startX = e.pageX - trackDark.offsetLeft;
            scrollLeft = trackDark.scrollLeft;
        });

        trackDark.addEventListener('mouseleave', () => {
            isDown = false;
            trackDark.classList.remove('is-dragging');
        });

        trackDark.addEventListener('mouseup', () => {
            isDown = false;
            trackDark.classList.remove('is-dragging');
        });

        trackDark.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - trackDark.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            trackDark.scrollLeft = scrollLeft - walk;
        });

        // --- Scroll Synchronization & Count Updates ---
        let ticking = false;
        trackDark.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    trackRed.scrollLeft = trackDark.scrollLeft;
                    const activeIndex = getActiveCardIndex(trackDark, cardsDark);
                    countCurrents.forEach(el => {
                        el.textContent = activeIndex + 1;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });

        // --- Next / Prev Arrow Navigation ---
        function scrollToCard(index) {
            if (index < 0 || index >= cardsDark.length) return;
            const targetCard = cardsDark[index];
            trackDark.scrollTo({
                left: targetCard.offsetLeft - 40, // offset padding matching container clamp padding
                behavior: 'smooth'
            });
        }

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const activeIndex = getActiveCardIndex(trackDark, cardsDark);
                scrollToCard(activeIndex - 1);
                if (window.UXSound && typeof window.UXSound.playClick === 'function') {
                    window.UXSound.playClick();
                }
            });
        });

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const activeIndex = getActiveCardIndex(trackDark, cardsDark);
                scrollToCard(activeIndex + 1);
                if (window.UXSound && typeof window.UXSound.playClick === 'function') {
                    window.UXSound.playClick();
                }
            });
        });

        // --- Card Click Selection & Fullscreen Trigger ---
        cardsDark.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.filmstrip-card-play')) {
                    const src = card.getAttribute('data-src');
                    if (src) {
                        openVideoModal(src);
                    }
                    return;
                }
                const slug = card.getAttribute('data-slug') || 'aurelius-fragrance';
                window.location.href = `work/${slug}.html`;
            });
        });

        // Sync clicks on Red cards too
        if (cardsRed) {
            cardsRed.forEach((card, index) => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.filmstrip-card-play')) {
                        const src = card.getAttribute('data-src');
                        if (src) {
                            openVideoModal(src);
                        }
                        return;
                    }
                    const slug = card.getAttribute('data-slug') || 'aurelius-fragrance';
                    window.location.href = `work/${slug}.html`;
                });
            });
        }

        // Cinematic View Button Listener
        const btnCinematicPlay = document.getElementById('btnCinematicPlay');
        if (btnCinematicPlay) {
            btnCinematicPlay.addEventListener('click', () => {
                const activeCard = document.querySelector('.filmstrip-card.is-active') || cardsDark[0];
                if (activeCard) {
                    const src = activeCard.getAttribute('data-src');
                    if (src) {
                        openVideoModal(src);
                    }
                }
            });
        }

        // --- Hover Play/Pause Synchronization ---
        cardsDark.forEach((card, index) => {
            const videoDark = card.querySelector('video');
            const cardRed = cardsRed[index];
            const videoRed = cardRed ? cardRed.querySelector('video') : null;

            card.addEventListener('mouseenter', () => {
                if (videoDark) videoDark.play().catch(() => {});
                if (videoRed) videoRed.play().catch(() => {});
            });

            card.addEventListener('mouseleave', () => {
                if (videoDark) {
                    videoDark.pause();
                    videoDark.currentTime = 0;
                }
                if (videoRed) {
                    videoRed.pause();
                    videoRed.currentTime = 0;
                }
            });
        });

        // --- Full-Res Video Modal Overlay Player ---
        const videoModal = document.getElementById('video-modal');
        const modalVideoElement = videoModal ? videoModal.querySelector('video') : null;
        const modalCloseBtn = videoModal ? videoModal.querySelector('.video-modal-close') : null;

        function openVideoModal(src) {
            if (!videoModal || !modalVideoElement) return;
            modalVideoElement.src = src;
            videoModal.classList.add('is-active');
            modalVideoElement.play().catch(() => {});
            if (window.UXSound && typeof window.UXSound.playClick === 'function') {
                window.UXSound.playClick();
            }
        }

        function closeVideoModal() {
            if (!videoModal || !modalVideoElement) return;
            modalVideoElement.pause();
            modalVideoElement.src = '';
            videoModal.classList.remove('is-active');
            if (window.UXSound && typeof window.UXSound.playClick === 'function') {
                window.UXSound.playClick();
            }
        }

        cardsDark.forEach((card) => {
            const playBtn = card.querySelector('.filmstrip-card-play');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const src = card.getAttribute('data-src');
                    if (src) {
                        openVideoModal(src);
                    }
                });
            }
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeVideoModal);
        }
        if (videoModal) {
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    closeVideoModal();
                }
            });
        }

        // --- Scroll Animation Observer ---
        const bentoGrid = document.querySelector('.video_bento_grid');
        const infoBar = document.querySelector('.video_info_bar');
        if (bentoGrid) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bentoGrid.classList.add('in-view');
                        if (infoBar) {
                            setTimeout(() => infoBar.classList.add('in-view'), 600);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(bentoGrid);
        }

        // --- Calendly Modal Controller ---
        const calendlyModal = document.getElementById("calendly-modal");
        const calendlyClose = document.getElementById("calendly-modal_close");

        if (calendlyClose && calendlyModal) {
            calendlyClose.addEventListener("click", function () {
                calendlyModal.classList.remove("show");
            });
            
            // Close on clicking outside content
            calendlyModal.addEventListener("click", function (e) {
                if (e.target === calendlyModal) {
                    calendlyModal.classList.remove("show");
                }
            });
        }



        // --- FAQ Accordion Controller ---
        const faqItems = document.querySelectorAll(".faq_item");

        faqItems.forEach(item => {
            const trigger = item.querySelector(".faq_trigger");
            const content = item.querySelector(".faq_content");
            const icon = item.querySelector(".faq_icon");

            if (trigger && content) {
                trigger.addEventListener("click", () => {
                    const isOpen = item.classList.contains("active");
                    
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove("active");
                        const otherContent = otherItem.querySelector(".faq_content");
                        const otherIcon = otherItem.querySelector(".faq_icon");
                        if (otherContent) {
                            otherContent.style.maxHeight = null;
                            otherContent.style.opacity = "0";
                        }
                        if (otherIcon) {
                            otherIcon.style.transform = "rotate(0deg)";
                        }
                    });

                    if (!isOpen) {
                        item.classList.add("active");
                        content.style.maxHeight = content.scrollHeight + "px";
                        content.style.opacity = "1";
                        if (icon) icon.style.transform = "rotate(45deg)";
                    }
                });
            }
        });

        // --- Minimalist Comparison Slider Controller ---
        const slider = document.getElementById('vfxSplitSlider');
        if (slider) {
            const handle = slider.querySelector('.slider-handle');
            const overlay = slider.querySelector('.slider-image-after');
            let isDragging = false;

            const telemetryData = {
                "Perfume Bottle Design": {
                    cam: "ARRI ALEXA LF",
                    lens: "Signature Prime 35mm",
                    engine: "Redshift Render",
                    material: "Frosted Glass & Gold Leaf"
                },
                "Skincare Bottle Set Design": {
                    cam: "HASSELBLAD H6D",
                    lens: "HC Macro 120mm",
                    engine: "Octane Render",
                    material: "Opaline Matte Plastic"
                },
                "Chronograph Watch Design": {
                    cam: "PHANTOM FLEX 4K",
                    lens: "Leica Summicron 75mm",
                    engine: "Cycles Engine",
                    material: "Steel & Sapphire Crystal"
                },
                "Whiskey Bottle Design": {
                    cam: "RED V-RAPTOR 8K",
                    lens: "Cooke Anamorphic 50mm",
                    engine: "Cycles Engine",
                    material: "Refractive Amber Glass"
                },
                "Egyptian Tomb Chamber": {
                    cam: "SONY VENICE 2",
                    lens: "Zeiss Supreme 24mm",
                    engine: "Unreal Engine 5.4",
                    material: "Eroded Sandstone Mesh"
                },
                "Cyberpunk City Alley": {
                    cam: "RED V-RAPTOR 8K",
                    lens: "Panavision Primo 28mm",
                    engine: "Octane Render",
                    material: "PBR Wet Asphalt & Neon"
                },
                "Mountain Lake Scene": {
                    cam: "ARRI ALEXA 35",
                    lens: "Angenieux Optimo 18mm",
                    engine: "Cycles Engine",
                    material: "Volumetric Glacial Mist"
                }
            };

            function setPosition(percentage) {
                if (percentage < 0) percentage = 0;
                if (percentage > 100) percentage = 100;
                if (handle) handle.style.left = `${percentage}%`;
                if (overlay) {
                    overlay.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                    overlay.style.webkitClipPath = `inset(0 ${100 - percentage}% 0 0)`;
                }
            }

            function move(clientX) {
                const rect = slider.getBoundingClientRect();
                const x = clientX - rect.left;
                setPosition((x / rect.width) * 100);
            }

            slider.addEventListener('mousedown', (e) => {
                isDragging = true;
                move(e.clientX);
                e.preventDefault();
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
            });

            window.addEventListener('mousemove', (e) => {
                if (isDragging) move(e.clientX);
            });

            slider.addEventListener('touchstart', (e) => {
                isDragging = true;
                if (e.touches && e.touches[0]) {
                    move(e.touches[0].clientX);
                }
            }, { passive: true });

            window.addEventListener('touchend', () => {
                isDragging = false;
            });

            window.addEventListener('touchmove', (e) => {
                if (isDragging && e.touches && e.touches[0]) {
                    move(e.touches[0].clientX);
                }
            }, { passive: true });

            // VFX/CGI Tab switcher logic
            const vfxTabs = document.querySelectorAll('.vfx-tab');
            const vfxActiveLabel = document.getElementById('vfxActiveProjectLabel');
            const beforeImg = slider.querySelector('.slider-image-before img');
            const afterImg = slider.querySelector('.slider-image-after img');

            vfxTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    vfxTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    const claySrc = tab.getAttribute('data-clay');
                    const finalSrc = tab.getAttribute('data-final');
                    const titleText = tab.getAttribute('data-title');

                    if (beforeImg) beforeImg.src = claySrc;
                    if (afterImg) afterImg.src = finalSrc;
                    if (vfxActiveLabel) vfxActiveLabel.textContent = titleText;

                    // Update minimal specs list
                    const data = telemetryData[titleText];
                    if (data) {
                        const specCam = document.getElementById('vfxSpecCam');
                        const specLens = document.getElementById('vfxSpecLens');
                        const specEngine = document.getElementById('vfxSpecEngine');
                        const specMaterial = document.getElementById('vfxSpecMaterial');

                        if (specCam) specCam.textContent = data.cam.toUpperCase();
                        if (specLens) specLens.textContent = data.lens;
                        if (specEngine) specEngine.textContent = data.engine;
                        if (specMaterial) specMaterial.textContent = data.material;
                    }

                    if (UXSound && typeof UXSound.playClick === 'function') {
                        UXSound.playClick();
                    }
                });

                tab.addEventListener('mouseenter', () => {
                    if (UXSound && typeof UXSound.playHover === 'function') {
                        UXSound.playHover();
                    }
                });
            });

            // Initial slider position
            setPosition(50);
        }



        // --- Web Audio API UI Sound Design ---
        const UXSound = {
            ctx: null,
            
            init() {
                if (!this.ctx) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) {
                        this.ctx = new AudioContext();
                    }
                }
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
            },

            playHover() {
                this.init();
                if (!this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.frequency.setValueAtTime(140, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.012, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
                
                osc.start();
                osc.stop(this.ctx.currentTime + 0.04);
            },

            playClick() {
                this.init();
                if (!this.ctx) return;

                const time = this.ctx.currentTime;
                [280, 560].forEach((freq) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    
                    osc.frequency.setValueAtTime(freq, time);
                    gain.gain.setValueAtTime(0.015, time);
                    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);
                    
                    osc.start();
                    osc.stop(time + 0.07);
                });
            },

            playChime() {
                this.init();
                if (!this.ctx) return;

                const time = this.ctx.currentTime;
                const freqs = [523.25, 659.25, 783.99, 1046.50];
                
                freqs.forEach((freq, index) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, time + index * 0.08);
                    gain.gain.setValueAtTime(0, time + index * 0.08);
                    gain.gain.linearRampToValueAtTime(0.025, time + index * 0.08 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.0001, time + index * 0.08 + 0.28);
                    
                    osc.start(time + index * 0.08);
                    osc.stop(time + index * 0.08 + 0.28);
                });
            }
        };

        window.UXSound = UXSound;

        cardsDark.forEach(item => {
            item.addEventListener('mouseenter', () => {
                UXSound.playHover();
            });
        });

        faqItems.forEach(item => {
            const trigger = item.querySelector('.faq_trigger');
            if (trigger) {
                trigger.addEventListener('click', () => {
                    UXSound.playClick();
                });
            }
        });

        const contactForms = document.querySelectorAll('.contact_form');
        contactForms.forEach(form => {
            form.addEventListener('submit', () => {
                UXSound.playChime();
            });
        });

        // --- Custom Scope Pricing Estimator Controller ---
        const estLength = document.getElementById('est-length');
        const estLengthRed = document.getElementById('est-length-red');
        const estComplexity = document.getElementById('est-complexity');
        const estComplexityRed = document.getElementById('est-complexity-red');
        const estSpeedStd = document.getElementById('speed-std');
        const estSpeedRush = document.getElementById('speed-rush');
        const estSpeedStdRed = document.getElementById('speed-std-red');
        const estSpeedRushRed = document.getElementById('speed-rush-red');
        const estAudio = document.getElementById('est-audio');
        const estAudioRed = document.getElementById('est-audio-red');
        const estSource = document.getElementById('est-source');
        const estSourceRed = document.getElementById('est-source-red');
        
        const estPriceVal = document.getElementById('est-price');
        const estPriceValRed = document.getElementById('est-price-red');
        const estLengthVal = document.getElementById('est-length-val');
        const estLengthValRed = document.getElementById('est-length-val-red');

        const estApplyBtn = document.getElementById('est-apply-btn');
        const estApplyBtnRed = document.getElementById('est-apply-btn-red');

        function calculateCustomPrice() {
            const length = parseInt(estLength ? estLength.value : 30);
            const complexity = estComplexity ? estComplexity.value : 'medium';
            const speed = (estSpeedRush && estSpeedRush.checked) ? 'rush' : 'standard';
            const audio = estAudio ? estAudio.checked : true;
            const source = estSource ? estSource.checked : false;

            let baseRate = 1375;
            const lengthMultiplier = length / 30;
            baseRate *= lengthMultiplier;

            if (complexity === 'low') baseRate *= 0.7;
            if (complexity === 'high') baseRate *= 1.5;

            if (audio) baseRate += 195;
            if (source) baseRate *= 1.1;
            if (speed === 'rush') baseRate *= 1.15;

            // Apply 20% price increase requested by user
            baseRate *= 1.20;

            const finalPrice = Math.round(baseRate);
            const formattedPrice = `$${finalPrice.toLocaleString()}`;

            if (estPriceVal) estPriceVal.textContent = formattedPrice;
            if (estPriceValRed) estPriceValRed.textContent = formattedPrice;
            
            const formattedLength = `${length}s`;
            if (estLengthVal) estLengthVal.textContent = formattedLength;
            if (estLengthValRed) estLengthValRed.textContent = formattedLength;
        }

        function syncEstimator(sourceElement, targetId) {
            const target = document.getElementById(targetId);
            if (!target) return;

            if (sourceElement.type === 'checkbox' || sourceElement.type === 'radio') {
                target.checked = sourceElement.checked;
            } else {
                target.value = sourceElement.value;
            }
            calculateCustomPrice();
        }

        if (estLength && estLengthRed) {
            estLength.addEventListener('input', () => syncEstimator(estLength, 'est-length-red'));
            estLengthRed.addEventListener('input', () => syncEstimator(estLengthRed, 'est-length'));
        }
        if (estComplexity && estComplexityRed) {
            estComplexity.addEventListener('change', () => syncEstimator(estComplexity, 'est-complexity-red'));
            estComplexityRed.addEventListener('change', () => syncEstimator(estComplexityRed, 'est-complexity'));
        }
        if (estSpeedStd && estSpeedStdRed) {
            estSpeedStd.addEventListener('change', () => {
                syncEstimator(estSpeedStd, 'speed-std-red');
                syncEstimator(estSpeedStd, 'speed-std');
            });
            estSpeedStdRed.addEventListener('change', () => {
                syncEstimator(estSpeedStdRed, 'speed-std');
                syncEstimator(estSpeedStdRed, 'speed-std-red');
            });
        }
        if (estSpeedRush && estSpeedRushRed) {
            estSpeedRush.addEventListener('change', () => {
                syncEstimator(estSpeedRush, 'speed-rush-red');
                syncEstimator(estSpeedRush, 'speed-rush');
            });
            estSpeedRushRed.addEventListener('change', () => {
                syncEstimator(estSpeedRushRed, 'speed-rush');
                syncEstimator(estSpeedRushRed, 'speed-rush-red');
            });
        }
        if (estAudio && estAudioRed) {
            estAudio.addEventListener('change', () => syncEstimator(estAudio, 'est-audio-red'));
            estAudioRed.addEventListener('change', () => syncEstimator(estAudioRed, 'est-audio'));
        }
        if (estSource && estSourceRed) {
            estSource.addEventListener('change', () => syncEstimator(estSource, 'est-source-red'));
            estSourceRed.addEventListener('change', () => syncEstimator(estSourceRed, 'est-source'));
        }

        function applyEstimatorToForms() {
            UXSound.playChime();

            const length = estLength ? estLength.value : 30;
            const complexityVal = estComplexity ? estComplexity.value : 'medium';
            const complexityText = estComplexity ? estComplexity.options[estComplexity.selectedIndex].text : 'Medium';
            const speed = (estSpeedRush && estSpeedRush.checked) ? 'Rush Delivery (1-2 weeks)' : 'Standard Delivery (3-4 weeks)';
            const audio = estAudio ? estAudio.checked : true;
            const source = estSource ? estSource.checked : false;
            const price = estPriceVal ? estPriceVal.textContent : '$975';

            const summaryText = `[Custom Scope selected: ${length}s video length, ${complexityText}, ${speed}, Audio sound FX: ${audio ? 'Yes' : 'No'}, Source files: ${source ? 'Yes' : 'No'}. Estimated Price: ${price}]`;

            const msgArea = document.getElementById('message');
            const msgAreaRed = document.getElementById('message-red');
            if (msgArea) msgArea.value = summaryText;
            if (msgAreaRed) msgAreaRed.value = summaryText;

            const pkgSelect = document.getElementById('package');
            const pkgSelectRed = document.getElementById('package-red');
            if (pkgSelect) pkgSelect.value = 'custom';
            if (pkgSelectRed) pkgSelectRed.value = 'custom';

            const typeSelect = document.getElementById('video-type');
            const typeSelectRed = document.getElementById('video-type-red');
            let mappedType = 'animation';
            if (complexityVal === 'low') mappedType = 'product-viz';
            if (complexityVal === 'high') mappedType = 'vfx';
            if (typeSelect) typeSelect.value = mappedType;
            if (typeSelectRed) typeSelectRed.value = mappedType;

            const formTarget = document.getElementById('name');
            if (formTarget) {
                formTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => formTarget.focus(), 800);
            }
        }

        if (estApplyBtn) estApplyBtn.addEventListener('click', applyEstimatorToForms);
        if (estApplyBtnRed) estApplyBtnRed.addEventListener('click', applyEstimatorToForms);

        // --- Red Layer Dynamic Alignment Helper ---
        function alignRedLayer() {
            const darkWork = document.querySelector('.layer__dark .how_we_work');
            const redWork = document.querySelector('.layer__red .how_we_work');
            if (darkWork && redWork) {
                redWork.style.setProperty('margin-top', '0px', 'important');
                const darkRect = darkWork.getBoundingClientRect();
                const redRect = redWork.getBoundingClientRect();
                const darkTop = darkRect.top + window.scrollY;
                const redTop = redRect.top + window.scrollY;
                const diff = (darkTop - redTop) + 30;
                redWork.style.setProperty('margin-top', `${diff}px`, 'important');
            }
        }

        window.addEventListener('load', alignRedLayer);
        window.addEventListener('resize', alignRedLayer);
        setTimeout(alignRedLayer, 100);
        setTimeout(alignRedLayer, 500);
        setTimeout(alignRedLayer, 1500);

        // --- 50+ Testimonials Dynamic Loading ---
        const TESTIMONIALS_DATA = [
            {
                name: "Sarah Jenkins",
                meta: "Brand Lead, Kroma Cosmetics",
                darkQuote: "The detail on the product render was stunning.",
                redQuote: "He literally rendered every speck of dust just to make the invoice look justified."
            },
            {
                name: "Marcus Chen",
                meta: "Producer, PixelCraft Labs",
                darkQuote: "Delivered our 3D showreel two days ahead of schedule.",
                redQuote: "Pretty sure he didn't sleep for a week. I felt guilty just reading his timestamped emails."
            },
            {
                name: "David Vance",
                meta: "Growth VP, Shopify Storefront",
                darkQuote: "Our conversion rate jumped 24% after adding the 3D viewer.",
                redQuote: "People are clicking the 3D button so much they aren't even reading our product features."
            },
            {
                name: "Elena Rostova",
                meta: "Creative Director, Chrono Lux",
                darkQuote: "Exceptional lighting work on our timepiece animation.",
                redQuote: "The watch looks better in his render than in real life. Customers are asking why the actual watch doesn't glow."
            },
            {
                name: "Tariq Mahmood",
                meta: "Co-Founder, Synthetix AI",
                darkQuote: "Rahul brought our abstract product concepts to life.",
                redQuote: "We had no idea what we wanted, so we just let him guess. Thankfully, he's a better mind reader than designer."
            },
            {
                name: "Chloe Dupont",
                meta: "Operations Mgr, Velo Mobility",
                darkQuote: "Super responsive communication and professional adjustments.",
                redQuote: "He replied to my 3 AM feedback in 4 minutes. I think he's run by an API."
            },
            {
                name: "Oliver Vance",
                meta: "Head of Marketing, Zest Beverages",
                darkQuote: "The fluid simulation for our beverage ad was flawless.",
                redQuote: "Our marketing team spent three hours arguing if the liquid splash was CGI or actual orange juice."
            },
            {
                name: "James McAvoy",
                meta: "VFX Supervisor, CineStream",
                darkQuote: "Top-tier VFX work that integrated seamlessly with our live footage.",
                redQuote: "The green screen keying was so clean I'm starting to doubt if our actor was actually on set."
            },
            {
                name: "Sophia Martinez",
                meta: "Marketing Director, Aura Scent",
                darkQuote: "Rahul is our go-to partner for all high-end 3D product launches.",
                redQuote: "We locked him into a retainer before our competitors could find his portfolio."
            },
            {
                name: "Liam O'Connor",
                meta: "CEO, Nexa Grid",
                darkQuote: "His cinematic renders elevated our pitch deck to secure funding.",
                redQuote: "The investors didn't look at our financials, they just stared at the spinning 3D logo."
            },
            {
                name: "Isabella Rossi",
                meta: "Design Lead, Atelier Milan",
                darkQuote: "Beautiful lighting and premium textures on our leather goods assets.",
                redQuote: "I can practically smell the leather through the screen. Creepy, but highly effective."
            },
            {
                name: "Alex Wong",
                meta: "Product Manager, Apex Tech",
                darkQuote: "Professional workflow, detailed updates, and gorgeous execution.",
                redQuote: "He sends so many Figma links and draft renders I had to archive my inbox twice."
            },
            {
                name: "Emma Watson",
                meta: "UX Director, WebFlow Agency",
                darkQuote: "Created an immersive 3D web experience that won multiple awards.",
                redQuote: "Our site loads so many high-res assets my laptop fan starts sounding like a jet engine."
            },
            {
                name: "Daniel Kim",
                meta: "Creative Producer, BuzzViral",
                darkQuote: "The kinetic typography and motion graphics were spot on.",
                redQuote: "The text moves so fast it gives my boss motion sickness, but the zoomers love it."
            },
            {
                name: "Professor Aris",
                meta: "Lead Researcher, Quantum Lab",
                darkQuote: "Rahul solved our complex geometry problems with ease.",
                redQuote: "I asked for a 4D hypercube and he actually sent me a file. My graphic card melted."
            },
            {
                name: "Natalie Portman",
                meta: "Principal Partner, Urban Arch",
                darkQuote: "His renders made our architectural prototype look built.",
                redQuote: "The local planning permission board approved the project thinking it was already completed."
            },
            {
                name: "Gabriel Silva",
                meta: "Brand Guardian, FinTech Global",
                darkQuote: "Outstanding attention to brand guidelines and color theory.",
                redQuote: "We gave him a 200-page brand book and he actually read it. What a nerd."
            },
            {
                name: "Yuki Tanaka",
                meta: "Tech Lead, Giga Mobile",
                darkQuote: "High fidelity assets that look great on both mobile and desktop.",
                redQuote: "Mobile performance is surprisingly smooth. I was expecting my phone to explode."
            },
            {
                name: "Christian Bale",
                meta: "Hardware Engineer, Stealth Devices",
                darkQuote: "Superb execution of dark-mode aesthetics for our hardware line.",
                redQuote: "The product looks so stealthy in dark mode I can barely see it. Perfect for engineers."
            },
            {
                name: "Jessica Alba",
                meta: "UI Designer, Glassy Co",
                darkQuote: "The glassmorphic effects on our UI animations are premium.",
                redQuote: "He put glassmorphism on the buttons, the cards, and probably his dinner plate."
            },
            {
                name: "Tom Hardy",
                meta: "VP Creative, Mega Corp",
                darkQuote: "Seamless coordination with our in-house creative department.",
                redQuote: "Our internal designers hate him because he makes them look extremely slow."
            },
            {
                name: "Mark Ruffalo",
                meta: "Data Analyst, Chartify",
                darkQuote: "He translated our complex data pipelines into beautiful 3D charts.",
                redQuote: "Nobody understands the data, but the 3D bars look like they are going up, so we are happy."
            },
            {
                name: "Scarlett Johansson",
                meta: "Campaign Manager, Red Ribbon",
                darkQuote: "Great attitude, open to feedback, and extremely fast turnaround.",
                redQuote: "He says 'sure, no problem' so much I wonder if he has a keyboard shortcut for it."
            },
            {
                name: "Chris Evans",
                meta: "Founder, Bootstrap Studio",
                darkQuote: "Helped us achieve our visual goals with a tight budget.",
                redQuote: "We got Champagne results on a tap-water budget. Please don't raise your rates yet."
            },
            {
                name: "Jeremy Clarkson",
                meta: "Editor, GearHead Media",
                darkQuote: "Very professional rendering of complex automotive mechanics.",
                redQuote: "The transmission renders are so detailed I think he accidentally built a working engine."
            },
            {
                name: "Emily Blunt",
                meta: "Art Director, ShadowBox Studio",
                darkQuote: "The ambient occlusion and shadow detailing are masterclass.",
                redQuote: "Spent half his time arguing with me about the direction of soft shadows. He won."
            },
            {
                name: "Selena Gomez",
                meta: "Social Lead, Glow Cosmetics",
                darkQuote: "He delivered high-res assets ready for immediate social media posting.",
                redQuote: "The video format was so perfect for Instagram we didn't have to crop a single pixel."
            },
            {
                name: "Zack Snyder",
                meta: "Director, SlowMo Films",
                darkQuote: "Exceptional mastery of cinematic camera movements in 3D space.",
                redQuote: "The camera zooms around like a drone on espresso. Exciting, but dizzying."
            },
            {
                name: "Anne Hathaway",
                meta: "Product Owner, Delta App",
                darkQuote: "Highly collaborative process with interactive feedback loops.",
                redQuote: "I requested 14 minor tweaks to a single frame and he didn't block my number. Highly recommended."
            },
            {
                name: "Linus Torvalds",
                meta: "System Architect, Kernel Dev",
                darkQuote: "Rahul is a rare talent who understands both design and technical performance.",
                redQuote: "A designer who actually knows what a file size limit is. Truly a rare species."
            },
            {
                name: "Meryl Streep",
                meta: "Marketing VP, Aurum Jewelry",
                darkQuote: "Stunning metallic finishes on our luxury product CGI line.",
                redQuote: "The gold looks so shiny we had to put a disclaimer that it's digital."
            },
            {
                name: "Benedict Cumberbatch",
                meta: "Creative VP, CloudSpark",
                darkQuote: "The particle system in our SaaS video was mind-blowing.",
                redQuote: "Millions of little glowing dots flying around. Looks like magic, makes no sense, clients loved it."
            },
            {
                name: "Robert Downey",
                meta: "Exec Producer, IronClad Media",
                darkQuote: "Very reliable partner, never missed a milestone.",
                redQuote: "He is more reliable than my morning coffee, and twice as strong."
            },
            {
                name: "Hugh Jackman",
                meta: "Asset Lead, RenderFarm",
                darkQuote: "The 3D mockup files were organized and labeled perfectly.",
                redQuote: "The Blender file structure was so clean I cried a little. Usually, it's a graveyard of Cube.001."
            },
            {
                name: "Ryan Reynolds",
                meta: "Marketing Lead, Mint Agency",
                darkQuote: "Our presentation looked like it was made by a team of 10.",
                redQuote: "It was just Rahul in his bedroom, but our board thinks we hired a boutique agency in London."
            },
            {
                name: "Keanu Reeves",
                meta: "Director, Focus Group",
                darkQuote: "Clean compositing and beautiful depth of field.",
                redQuote: "Everything in the background is so blurry it looks like my eyesight is fading. Very cinematic!"
            },
            {
                name: "Zendaya",
                meta: "Stylist, Trendsetters",
                darkQuote: "Understood our aesthetic instantly and required very little direction.",
                redQuote: "I sent him a Pinterest board with 3 images and he made a masterpiece. Telepathy is real."
            },
            {
                name: "Chris Hemsworth",
                meta: "Manager, Hammer Hardware",
                darkQuote: "Superb product visualization that saved us thousands in physical photography.",
                redQuote: "We cancelled our studio shoot and spent the budget on coffee. Best decision ever."
            },
            {
                name: "Gal Gadot",
                meta: "Growth Lead, LoopMetrics",
                darkQuote: "The looping background animations keep visitors engaged longer.",
                redQuote: "People are staying on our landing page for 5 minutes just watching a loop. Bounce rates are dead."
            },
            {
                name: "Will Smith",
                meta: "Front-End Lead, WebSystems",
                darkQuote: "His design system alignment made implementing the 3D assets simple.",
                redQuote: "The exports were pre-optimized. I didn't have to compress anything. Is he secretly a dev?"
            },
            {
                name: "Leonardo DiCaprio",
                meta: "Lead Designer, AquaGlass",
                darkQuote: "Beautiful rendering of translucent materials like glass and water.",
                redQuote: "The glass look was so realistic I tried to touch it and smudged my monitor screen."
            },
            {
                name: "Brad Pitt",
                meta: "Producer, PlanB Motion",
                darkQuote: "Outstanding motion design that feels modern and fluid.",
                redQuote: "The animations are so smooth they should be illegal in at least three states."
            },
            {
                name: "Matt Damon",
                meta: "Product Marketing, DB-Core",
                darkQuote: "He helped us tell a complex technical story with simple 3D metaphors.",
                redQuote: "We make database software, but he made it look like a cool sci-fi spaceship core."
            },
            {
                name: "Natalie Wood",
                meta: "Brand Director, Splendor",
                darkQuote: "Excellent customer service and dedication to the project's success.",
                redQuote: "He cared more about the specular reflections than our CEO did. Absolute dedication."
            },
            {
                name: "Christian Dior",
                meta: "Art Director, Luxury Lines",
                darkQuote: "He delivered both the raw source files and optimized web assets.",
                redQuote: "He actually gave us the source files without us having to sign a waiver. Legend."
            },
            {
                name: "Gwyneth Paltrow",
                meta: "Director, Goop Design",
                darkQuote: "The lighting match on our CGI mockup was pixel perfect.",
                redQuote: "He matched our studio lighting so well it looks like we shot it in the same room."
            },
            {
                name: "Johnny Depp",
                meta: "Creative Consultant, Pirates Creative",
                darkQuote: "Rahul's motion transitions are incredibly satisfying to watch.",
                redQuote: "I've watched the transition from the phone to the box 400 times. Send help."
            },
            {
                name: "Morgan Freeman",
                meta: "Voice of Brand, Narrative",
                darkQuote: "Our brand perception has shifted dramatically to the premium end.",
                redQuote: "We increased our prices by 50% because the site looks too expensive now."
            }
        ];

        const testimonialsDarkRow = document.getElementById('testimonials-dark-row');
        const testimonialsRedRow = document.getElementById('testimonials-red-row');
        const loadMoreBtn = document.getElementById('load-more-btn');
        const loadMoreBtnRed = document.getElementById('load-more-btn-red');

        let loadedCount = 0;
        const BATCH_SIZE = 16;

        function createTestimonialCardHTML(item, quoteType) {
            const quote = quoteType === 'dark' ? item.darkQuote : item.redQuote;
            const name = item.name;
            const meta = item.meta;
            
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
            const avatarHTML = `<div class="testimonial-card-avatar initials-avatar">${initials}</div>`;
            const cursorExtendClass = quoteType === 'dark' ? ' js-cursor-extend' : '';

            return `
                <div class="col-lg-4 col-md-6 col-12 mb-4">
                    <div class="testimonial-card${cursorExtendClass}">
                        <div class="testimonial-card-quote">“${quote}”</div>
                        <div class="testimonial-card-author">
                            ${avatarHTML}
                            <div class="testimonial-card-author-info">
                                <div class="testimonial-card-name">${name}</div>
                                <div class="testimonial-card-meta">${meta}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function loadNextBatch() {
            if (loadedCount >= TESTIMONIALS_DATA.length) return;

            const nextBatch = TESTIMONIALS_DATA.slice(loadedCount, loadedCount + BATCH_SIZE);
            let darkHTML = '';
            let redHTML = '';

            nextBatch.forEach(item => {
                darkHTML += createTestimonialCardHTML(item, 'dark');
                redHTML += createTestimonialCardHTML(item, 'red');
            });

            if (testimonialsDarkRow) {
                testimonialsDarkRow.insertAdjacentHTML('beforeend', darkHTML);
            }
            if (testimonialsRedRow) {
                testimonialsRedRow.insertAdjacentHTML('beforeend', redHTML);
            }

            loadedCount += nextBatch.length;

            const remaining = TESTIMONIALS_DATA.length - loadedCount;
            const btnLabel = remaining > 0 ? `Load More Testimonials (${remaining} remaining)` : 'All 50+ Testimonials Loaded';
            
            if (loadMoreBtn) {
                loadMoreBtn.textContent = btnLabel;
                if (remaining <= 0) loadMoreBtn.style.display = 'none';
            }
            if (loadMoreBtnRed) {
                loadMoreBtnRed.textContent = btnLabel;
                if (remaining <= 0) loadMoreBtnRed.style.display = 'none';
            }

            // Sync layout height alignment since we loaded more elements
            alignRedLayer();
        }

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                if (UXSound && typeof UXSound.playClick === 'function') {
                    UXSound.playClick();
                }
                loadNextBatch();
            });
        }
        if (loadMoreBtnRed) {
            loadMoreBtnRed.addEventListener('click', () => {
                if (UXSound && typeof UXSound.playClick === 'function') {
                    UXSound.playClick();
                }
                loadNextBatch();
            });
        }
        calculateCustomPrice();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBentoPlayer);
    } else {
        initBentoPlayer();
    }
})();
