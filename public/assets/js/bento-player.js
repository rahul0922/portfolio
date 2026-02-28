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

        // --- Info Bar Update ---
        function updateInfoBar(item) {
            if (!item || !infoProjectName) return;

            const statValues = document.querySelectorAll('.video_info_stat_value');

            // Fade out all values
            statValues.forEach(v => v.classList.add('is-changing'));
            infoProjectName.style.opacity = '0';
            infoProjectType.style.opacity = '0';

            // Update after fade-out
            setTimeout(() => {
                infoProjectName.textContent = item.getAttribute('data-title') || '—';
                infoProjectType.textContent = item.getAttribute('data-type') || '—';
                infoClient.textContent = item.getAttribute('data-client') || '—';
                infoCountry.textContent = item.getAttribute('data-country') || '—';
                infoDuration.textContent = item.getAttribute('data-duration') || '—';
                infoBudget.textContent = item.getAttribute('data-budget') || '—';
                infoTools.textContent = item.getAttribute('data-tools') || '—';

                // Fade in
                statValues.forEach(v => v.classList.remove('is-changing'));
                infoProjectName.style.opacity = '1';
                infoProjectType.style.opacity = '1';
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
                }
            });

            // Hover preview
            const smallVideo = item.querySelector('video');
            if (smallVideo) {
                item.addEventListener('mouseenter', () => {
                    smallVideo.play().catch(() => { });
                });
                item.addEventListener('mouseleave', () => {
                    smallVideo.pause();
                    smallVideo.currentTime = 0;
                });
            }
        });

        // Initialize with first sidebar item's info
        const firstItem = document.querySelector('.bento_item');
        if (firstItem) {
            updateActiveState(mainVideo.getAttribute('src'));
            // Set initial info bar from first active item or first item
            const activeItem = document.querySelector('.bento_item.is-active') || firstItem;
            updateInfoBar(activeItem);
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBentoPlayer);
    } else {
        initBentoPlayer();
    }
})();
