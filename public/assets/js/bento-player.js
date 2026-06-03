/**
 * Professional Bento Box Video Player with Info Bar
 */
(function () {
    'use strict';

    function initBentoPlayer() {
        const mainVideo = document.getElementById('mainVideo');
        const bentoStage = document.querySelector('.bento_main_stage');
        const overlay = document.querySelector('.bento_player_overlay');
        const playBtn = document.querySelector('.bento_play_center_btn');
        const playIcon = playBtn.querySelector('.icon-play');
        const pauseIcon = playBtn.querySelector('.icon-pause');

        const progressBar = document.querySelector('.bento_progress_bar');
        const progressContainer = document.querySelector('.bento_progress_container');

        const muteBtn = document.querySelector('.bento_mute_btn');
        const unmuteIcon = muteBtn.querySelector('.icon-unmuted');
        const mutedIcon = muteBtn.querySelector('.icon-muted');

        const fullscreenBtn = document.querySelector('.bento_fullscreen_btn');
        const bentoItems = document.querySelectorAll('.bento_item');

        // Info bar elements
        const infoProjectName = document.getElementById('infoProjectName');
        const infoProjectType = document.getElementById('infoProjectType');
        const infoClient = document.getElementById('infoClient');
        const infoCountry = document.getElementById('infoCountry');
        const infoDuration = document.getElementById('infoDuration');
        const infoBudget = document.getElementById('infoBudget');
        const infoTools = document.getElementById('infoTools');

        if (!mainVideo) return;

        // Assign view transition names dynamically to all bento items
        bentoItems.forEach((item, index) => {
            item.style.viewTransitionName = `bento-item-${index}`;
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
                    const problem = item.getAttribute('data-problem') || '—';
                    const solution = item.getAttribute('data-solution') || '—';
                    const result = item.getAttribute('data-result') || '—';
                    infoCaseStudy.innerHTML = `<strong>Problem:</strong> ${problem}<br><strong>Solution:</strong> ${solution}<br><strong>Result:</strong> ${result}`;
                }

                // Fade in
                statValues.forEach(v => v.classList.remove('is-changing'));
                infoProjectName.style.opacity = '1';
                infoProjectType.style.opacity = '1';
                if (infoCaseStudy) infoCaseStudy.style.opacity = '1';
            }, 250);
        }

        // --- Playback Logic ---
        function togglePlay() {
            if (mainVideo.paused) {
                mainVideo.muted = false;
                updateMuteUI();
                mainVideo.play();
                bentoStage.classList.add('is-playing');
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                mainVideo.pause();
                bentoStage.classList.remove('is-playing');
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        }

        function updateMuteUI() {
            if (mainVideo.muted) {
                unmuteIcon.style.display = 'none';
                mutedIcon.style.display = 'block';
            } else {
                unmuteIcon.style.display = 'block';
                mutedIcon.style.display = 'none';
            }
        }

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });

        bentoStage.addEventListener('click', togglePlay);

        // --- Progress Bar ---
        mainVideo.addEventListener('timeupdate', () => {
            const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
            progressBar.style.width = `${progress}%`;
        });

        progressContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            mainVideo.currentTime = pos * mainVideo.duration;
        });

        // --- Mute/Unmute ---
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainVideo.muted = !mainVideo.muted;
            updateMuteUI();
        });

        // --- Fullscreen ---
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainVideo.requestFullscreen) {
                mainVideo.requestFullscreen();
            } else if (mainVideo.webkitRequestFullscreen) {
                mainVideo.webkitRequestFullscreen();
            } else if (mainVideo.msRequestFullscreen) {
                mainVideo.msRequestFullscreen();
            }
        });

        // --- Sidebar Interactions ---
        function updateActiveState(src) {
            bentoItems.forEach(item => {
                const itemSrc = item.getAttribute('data-src');
                if (itemSrc === src) {
                    item.classList.add('is-active');
                } else {
                    item.classList.remove('is-active');
                }
            });
        }

        bentoItems.forEach(item => {
            item.addEventListener('click', function () {
                const newSrc = this.getAttribute('data-src');
                if (newSrc && mainVideo.getAttribute('src') !== newSrc) {
                    mainVideo.src = newSrc;
                    mainVideo.play();
                    bentoStage.classList.add('is-playing');
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                    updateActiveState(newSrc);
                    updateInfoBar(this);

                    // Sync the red layer main video
                    const mainVideoRed = document.getElementById('mainVideo_red');
                    if (mainVideoRed) {
                        mainVideoRed.src = newSrc;
                    }
                }
            });

            // Hover preview & Custom Cursor Interaction
            const smallVideo = item.querySelector('video');
            const cursorEl = document.querySelector('.js-vj-cursor');

            item.addEventListener('mouseenter', () => {
                if (smallVideo) {
                    smallVideo.play().catch(() => { });
                    // Sync the play on the red layer version too since it ignores pointer events
                    const itemSrc = item.getAttribute('data-src');
                    const redVideos = document.querySelectorAll(`#bento_sidebar_red .bento_item[data-src="${itemSrc}"] video`);
                    redVideos.forEach(v => v.play().catch(() => { }));
                }

                // Show & style custom cursor inside bento area
                if (cursorEl) {
                    cursorEl.classList.add('is-hovering-bento');
                    if (!cursorEl.hasAttribute('data-original-html')) {
                        cursorEl.setAttribute('data-original-html', cursorEl.innerHTML);
                    }
                    const text = item.getAttribute('data-category') === 'motion' ? 'PLAY' : 'VIEW';
                    cursorEl.innerHTML = `<span><span class="d-block">${text}</span></span>`;
                }
            });

            item.addEventListener('mouseleave', () => {
                if (smallVideo) {
                    smallVideo.pause();
                    smallVideo.currentTime = 0;
                    smallVideo.load();
                    // Sync the pause on the red layer version too
                    const itemSrc = item.getAttribute('data-src');
                    const redVideos = document.querySelectorAll(`#bento_sidebar_red .bento_item[data-src="${itemSrc}"] video`);
                    redVideos.forEach(v => {
                        v.pause();
                        v.currentTime = 0;
                        v.load();
                    });
                }

                // Reset custom cursor
                if (cursorEl) {
                    cursorEl.classList.remove('is-hovering-bento');
                    const originalHtml = cursorEl.getAttribute('data-original-html');
                    if (originalHtml) {
                        cursorEl.innerHTML = originalHtml;
                    }
                }

                // Reset 3D tilt smooth transitions
                item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                item.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s';
            });

            // 3D Parallax Tilt Effect
            item.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                this.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale3d(1.02, 1.02, 1.02)`;
                this.style.transition = 'transform 0.1s ease-out, border-color 0.4s, box-shadow 0.4s';
            });
        });
        // --- Portfolio Category Filtering ---
        const filterTabs = document.querySelectorAll('.portfolio-tab');
        const bentoSidebar = document.querySelector('.bento_sidebar');
        const bentoSidebarRed = document.getElementById('bento_sidebar_red');

        // Only get the base bentoItems to track filtering
        const baseBentoItems = Array.from(document.querySelectorAll('.bento_sidebar .bento_item'));

        if (filterTabs.length > 0 && bentoSidebar) {
            filterTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const filterValue = tab.getAttribute('data-filter');

                    // Core filtering state logic
                    const applyFilter = () => {
                        // Update active tab state (for both layers of tabs)
                        filterTabs.forEach(t => {
                            if (t.getAttribute('data-filter') === filterValue) t.classList.add('active');
                            else t.classList.remove('active');
                        });

                        // Use class-based grid positioning instead of removing DOM nodes (avoids video blackouts)
                        let firstVisibleItem = null;

                        function updateGridPositions(sidebarContainer) {
                            if (!sidebarContainer) return null;
                            let pos = 1;
                            let first = null;
                            const items = sidebarContainer.querySelectorAll('.bento_item');
                            items.forEach(item => {
                                // remove all old pos- classes
                                for (let i = 1; i <= 10; i++) item.classList.remove('pos-' + i);

                                const itemCategory = item.getAttribute('data-category');
                                const hideInAll = item.classList.contains('hide-in-all');
                                
                                if ((filterValue === 'all' && !hideInAll) || itemCategory === filterValue) {
                                    item.style.display = '';
                                    item.classList.add('pos-' + pos);
                                    if (!first) first = item;
                                    pos++;
                                    item.style.opacity = '';
                                    item.style.transform = '';
                                } else {
                                    item.style.display = 'none';
                                }
                            });
                            return first;
                        }

                        firstVisibleItem = updateGridPositions(bentoSidebar);
                        updateGridPositions(bentoSidebarRed);

                        // Automatically snap the main stage to the first item of the newly selected category
                        const mainVideoRed = document.getElementById('mainVideo_red');
                        if (firstVisibleItem) {
                            const newSrc = firstVisibleItem.getAttribute('data-src');
                            if (newSrc && mainVideo.getAttribute('src') !== newSrc) {
                                mainVideo.src = newSrc;
                                if (mainVideoRed) mainVideoRed.src = newSrc;

                                mainVideo.play();
                                bentoStage.classList.add('is-playing');
                                playIcon.style.display = 'none';
                                pauseIcon.style.display = 'block';
                                updateInfoBar(firstVisibleItem);

                                document.querySelectorAll('.bento_item').forEach(i => i.classList.remove('is-active'));
                                // Add active to the matched items in both bases
                                document.querySelectorAll(`.bento_item[data-src="${newSrc}"]`).forEach(i => i.classList.add('is-active'));

                            } else if (newSrc === mainVideo.getAttribute('src')) {
                                document.querySelectorAll('.bento_item').forEach(i => i.classList.remove('is-active'));
                                document.querySelectorAll(`.bento_item[data-src="${newSrc}"]`).forEach(i => i.classList.add('is-active'));
                                updateInfoBar(firstVisibleItem);
                            }
                        }
                    };

                    // Run view transitions if supported
                    if (document.startViewTransition) {
                        document.startViewTransition(() => {
                            applyFilter();
                        });
                    } else {
                        // Fallback transition for older browsers
                        const allItems = Array.from(document.querySelectorAll('.bento_item'));
                        allItems.forEach(item => {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.95)';
                        });
                        setTimeout(() => {
                            applyFilter();
                        }, 300);
                    }
                });
            });
        }

        // Initialize by applying the active tab's filter directly
        const activeTab = document.querySelector('.portfolio-tab.active[data-filter]');
        if (activeTab) {
            const filterValue = activeTab.getAttribute('data-filter');

            function initGridPositions(sidebarContainer) {
                if (!sidebarContainer) return;
                let pos = 1;
                sidebarContainer.querySelectorAll('.bento_item').forEach(item => {
                    for (let i = 1; i <= 10; i++) item.classList.remove('pos-' + i);
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === filterValue) {
                        item.style.display = '';
                        item.classList.add('pos-' + pos++);
                    } else {
                        item.style.display = 'none';
                    }
                });
            }

            initGridPositions(bentoSidebar);
            initGridPositions(bentoSidebarRed);
            updateActiveState(mainVideo.getAttribute('src'));
            const activeItem = document.querySelector('.bento_sidebar .bento_item[data-category="' + filterValue + '"][data-src="' + mainVideo.getAttribute('src') + '"]')
                || document.querySelector('.bento_sidebar .bento_item[data-category="' + filterValue + '"]');
            if (activeItem) updateInfoBar(activeItem);
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
        const strategyBtn = document.getElementById("btn-strategy-call");
        const calendlyModal = document.getElementById("calendly-modal");
        const calendlyClose = document.getElementById("calendly-modal_close");

        if (strategyBtn && calendlyModal) {
            strategyBtn.addEventListener("click", function (e) {
                e.preventDefault();
                calendlyModal.classList.add("show");
            });
        }

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

        // --- ROI Calculator Controller ---
        const trafficSlider = document.getElementById("calc-traffic");
        const priceSlider = document.getElementById("calc-price");
        const trafficValEl = document.getElementById("calc-traffic-val");
        const priceValEl = document.getElementById("calc-price-val");
        const roiLiftEl = document.getElementById("calc-roi-lift");

        function calculateROI() {
            if (!trafficSlider || !priceSlider || !roiLiftEl) return;
            const traffic = parseInt(trafficSlider.value);
            const price = parseInt(priceSlider.value);
            
            // Assume 20% relative conversion lift on a baseline 1% CR (0.2% absolute CR lift)
            const conversionLift = 0.002; 
            const monthlyUnitsLift = Math.round(traffic * conversionLift);
            const revenueLift = monthlyUnitsLift * price;
            
            if (trafficValEl) trafficValEl.textContent = traffic.toLocaleString();
            if (priceValEl) priceValEl.textContent = "$" + price.toLocaleString();
            if (roiLiftEl) roiLiftEl.textContent = "$" + revenueLift.toLocaleString();
        }

        if (trafficSlider && priceSlider) {
            trafficSlider.addEventListener("input", calculateROI);
            priceSlider.addEventListener("input", calculateROI);
            calculateROI(); // Initial run
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

        // --- Before/After VFX Split Slider Controller ---
        const sliderContainer = document.getElementById('vfxSplitSlider');
        if (sliderContainer) {
            const handle = sliderContainer.querySelector('.slider-handle');
            const overlay = sliderContainer.querySelector('.slider-image-after');
            let isDragging = false;

            function moveSlider(clientX) {
                const rect = sliderContainer.getBoundingClientRect();
                const x = clientX - rect.left;
                let percentage = (x / rect.width) * 100;
                
                if (percentage < 0) percentage = 0;
                if (percentage > 100) percentage = 100;

                handle.style.left = `${percentage}%`;
                overlay.style.width = `${percentage}%`;
            }

            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                moveSlider(e.clientX);
            });

            handle.addEventListener('touchstart', () => {
                isDragging = true;
            }, { passive: true });

            window.addEventListener('touchend', () => {
                isDragging = false;
            });

            window.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                if (e.touches && e.touches[0]) {
                    moveSlider(e.touches[0].clientX);
                }
            }, { passive: true });

            sliderContainer.addEventListener('click', (e) => {
                if (e.target.closest('.slider-handle-button')) return;
                moveSlider(e.clientX);
            });
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

        bentoItems.forEach(item => {
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

            let baseRate = 1200;
            const lengthMultiplier = length / 30;
            baseRate *= lengthMultiplier;

            if (complexity === 'low') baseRate *= 0.7;
            if (complexity === 'high') baseRate *= 1.5;

            if (audio) baseRate += 400;
            if (source) baseRate *= 1.2;
            if (speed === 'rush') baseRate *= 1.3;

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
            const price = estPriceVal ? estPriceVal.textContent : '$2,400';

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

        calculateCustomPrice();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBentoPlayer);
    } else {
        initBentoPlayer();
    }
})();
