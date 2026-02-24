/**
 * Professional Bento Box Video Player Logic
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

        if (!mainVideo) return;

        // --- Playback Logic ---
        function togglePlay() {
            if (mainVideo.paused) {
                // Auto-unmute when clicking play to ensure BGM pauses correctly
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

        // Initialize
        updateActiveState(mainVideo.getAttribute('src'));

        // --- Scroll Animation Observer ---
        const bentoGrid = document.querySelector('.video_bento_grid');
        if (bentoGrid) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bentoGrid.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(bentoGrid);
        }
    }

    // Run on init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBentoPlayer);
    } else {
        initBentoPlayer();
    }
})();
