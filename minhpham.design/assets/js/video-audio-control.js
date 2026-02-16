// Auto-pause BGM when videos play
(function () {
    'use strict';

    let backgroundAudio = null;
    let wasAudioPlaying = false;

    function init() {
        // Get the background audio element
        backgroundAudio = document.querySelector('.js-web-sound');
        if (!backgroundAudio) return;

        // Find all video elements
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            // When a video starts playing
            video.addEventListener('play', function () {
                if (backgroundAudio && !backgroundAudio.paused) {
                    wasAudioPlaying = true;
                    backgroundAudio.pause();
                }
            });

            // When a video is paused or ends
            video.addEventListener('pause', function () {
                if (backgroundAudio && wasAudioPlaying) {
                    backgroundAudio.play();
                    wasAudioPlaying = false;
                }
            });

            video.addEventListener('ended', function () {
                if (backgroundAudio && wasAudioPlaying) {
                    backgroundAudio.play();
                    wasAudioPlaying = false;
                }
            });
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
