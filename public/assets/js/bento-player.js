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

                    // Auto-scroll to main video on mobile screens
                    if (window.innerWidth <= 991) {
                        bentoStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                overlay.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                overlay.style.webkitClipPath = `inset(0 ${100 - percentage}% 0 0)`;
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

            // VFX/CGI Tab switcher logic
            const vfxTabs = document.querySelectorAll('.vfx-tab');
            const vfxActiveLabel = document.getElementById('vfxActiveProjectLabel');
            const sliderBeforeImg = sliderContainer.querySelector('.slider-image-before img');
            const sliderAfterImg = sliderContainer.querySelector('.slider-image-after img');

            vfxTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    vfxTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    const claySrc = tab.getAttribute('data-clay');
                    const finalSrc = tab.getAttribute('data-final');
                    const titleText = tab.getAttribute('data-title');

                    if (sliderBeforeImg) sliderBeforeImg.src = claySrc;
                    if (sliderAfterImg) sliderAfterImg.src = finalSrc;
                    if (vfxActiveLabel) vfxActiveLabel.textContent = titleText;

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

            let baseRate = 600;
            const lengthMultiplier = length / 30;
            baseRate *= lengthMultiplier;

            if (complexity === 'low') baseRate *= 0.7;
            if (complexity === 'high') baseRate *= 1.5;

            if (audio) baseRate += 150;
            if (source) baseRate *= 1.1;
            if (speed === 'rush') baseRate *= 1.15;

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
            const price = estPriceVal ? estPriceVal.textContent : '$750';

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
            const darkWork = document.querySelector('.layer__dark .work_experience');
            const redWork = document.querySelector('.layer__red .work_experience');
            if (darkWork && redWork) {
                redWork.style.setProperty('margin-top', '0px', 'important');
                const darkRect = darkWork.getBoundingClientRect();
                const redRect = redWork.getBoundingClientRect();
                const darkTop = darkRect.top + window.scrollY;
                const redTop = redRect.top + window.scrollY;
                const diff = darkTop - redTop;
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
