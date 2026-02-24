/**
 * Robust BGM Auto-Pause/Resume Logic
 */
(function () {
    'use strict';

    let backgroundAudio = null;
    let wasAudioPlaying = false;
    const playingUnmutedVideos = new Set();

    function updateBGMState() {
        if (!backgroundAudio) return;

        // Count how many videos are currently playing AND unmuted
        const activeAudioVideos = Array.from(playingUnmutedVideos).filter(video => {
            return !video.paused && !video.muted && video.volume > 0;
        });

        if (activeAudioVideos.length > 0) {
            // There is at least one video playing with sound
            if (!backgroundAudio.paused) {
                wasAudioPlaying = true;
                backgroundAudio.pause();
                console.log('[BGM] Pausing for active video(s)');
            }
        } else {
            // No videos playing with sound
            if (wasAudioPlaying) {
                backgroundAudio.play().catch(err => {
                    console.warn('[BGM] Auto-resume failed (likely user interaction required):', err);
                });
                wasAudioPlaying = false;
                console.log('[BGM] Resuming');
            }
        }
    }

    function init() {
        backgroundAudio = document.querySelector('.js-web-sound');
        if (!backgroundAudio) return;

        // Function to bind listeners to a video
        function bindVideo(video) {
            if (video.dataset.bgmBound) return;
            video.dataset.bgmBound = 'true';

            const handleStateChange = () => {
                if (!video.paused && !video.muted && video.volume > 0) {
                    playingUnmutedVideos.add(video);
                } else {
                    playingUnmutedVideos.delete(video);
                }
                updateBGMState();
            };

            video.addEventListener('play', handleStateChange);
            video.addEventListener('pause', handleStateChange);
            video.addEventListener('ended', handleStateChange);
            video.addEventListener('volumechange', handleStateChange);
        }

        // Initial scan
        document.querySelectorAll('video').forEach(bindVideo);

        // Watch for dynamically added videos
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'VIDEO') {
                        bindVideo(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(bindVideo);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run on init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
