/**
 * WebGL Interactive Hero Background - Liquid Metallic Fluid
 * Uses Three.js for rendering an organic mercury-like blob with mouse reaction.
 */
(function () {
    'use strict';

    if (typeof THREE === 'undefined') {
        console.warn('Three.js is not loaded. Fallback video remains active.');
        return;
    }

    function initHeroWebGL() {
        const canvas = document.getElementById('hero-webgl-canvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        let width = container.clientWidth;
        let height = container.clientHeight;

        // Scene, Camera, Renderer setup
        const scene = new THREE.Scene();
        
        // Perspective camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 5;

        // WebGL Renderer with alpha channel and antialiasing
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
                powerPreference: "high-performance"
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        } catch (e) {
            console.error('WebGL is not supported by this browser. Falling back to video background.', e);
            return;
        }

        // Mouse coordinates tracking
        const mouse = new THREE.Vector2(0, 0);
        const mouseTarget = new THREE.Vector2(0, 0);
        
        window.addEventListener('mousemove', (e) => {
            // Normalize mouse coords (-1 to +1)
            mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Touch support
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouseTarget.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
                mouseTarget.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        }, { passive: true });

        // Geometry: detailed sphere for smooth shader wave displacements
        const geometry = new THREE.SphereGeometry(1.4, 80, 80);

        // Custom Shader Material for Liquid Metal look
        const uniforms = {
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2(0, 0) }
        };

        const vertexShader = `
            uniform float uTime;
            uniform vec2 uMouse;
            varying vec3 vNormal;
            varying vec3 vViewPosition;

            // Simple 3D sine-based waves for displacement
            float getDisplacement(vec3 p) {
                float timeScale = uTime * 0.9;
                
                // Primary waves
                float wave = sin(p.x * 2.2 + timeScale) * cos(p.y * 2.0 + timeScale * 0.8) * sin(p.z * 2.5 + timeScale * 1.1);
                
                // Secondary smaller ripples
                wave += sin(p.x * 5.0 - timeScale * 1.5) * cos(p.y * 4.8 + timeScale * 1.3) * 0.12;
                
                // Mouse influence pushes and deforms the shape
                float mouseDist = length(uMouse);
                wave *= (1.0 + mouseDist * 0.4);
                
                return wave * 0.25;
            }

            void main() {
                vNormal = normalize(normalMatrix * normal);
                
                // Compute displacement along normal direction
                vec3 displacedPosition = position + normal * getDisplacement(position);
                
                vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
                vViewPosition = -mvPosition.xyz;
                
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const fragmentShader = `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            uniform vec2 uMouse;
            uniform float uTime;

            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                vec3 reflectDir = reflect(-viewDir, normal);

                // Specular light sources (studio panel simulation)
                vec3 lightDir1 = normalize(vec3(1.0, 1.2, 1.0));
                vec3 halfDir1 = normalize(lightDir1 + viewDir);
                float spec1 = pow(max(dot(normal, halfDir1), 0.0), 128.0);

                vec3 lightDir2 = normalize(vec3(-1.2, -1.0, 0.8));
                vec3 halfDir2 = normalize(lightDir2 + viewDir);
                float spec2 = pow(max(dot(normal, halfDir2), 0.0), 64.0) * 0.35;

                // Fresnel effect for rim lighting glow
                float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);

                // Sky reflection map approximation
                float horizonReflection = reflectDir.y * 0.5 + 0.5;
                
                // Liquid ripple metallic sheen
                float ripple = sin(reflectDir.y * 10.0 + reflectDir.z * 5.0 + uTime * 0.4) * 0.5 + 0.5;

                // Liquid Platinum / Mercury base shading
                vec3 baseColor = mix(vec3(0.04, 0.04, 0.05), vec3(0.88, 0.89, 0.94), pow(horizonReflection, 4.0));
                baseColor += vec3(ripple * 0.1);

                // Composite metal highlights
                vec3 finalColor = baseColor + vec3(spec1 * 0.7) + vec3(spec2) + vec3(fresnel * 0.3);

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms,
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const clock = new THREE.Clock();

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();
            uniforms.uTime.value = elapsedTime;

            // Interpolate mouse movement for smooth acceleration/damping
            mouse.lerp(mouseTarget, 0.08);
            uniforms.uMouse.value.copy(mouse);

            // Tilt & Rotate mesh based on time and mouse tracking
            mesh.rotation.y = elapsedTime * 0.12 + mouse.x * 0.5;
            mesh.rotation.x = elapsedTime * 0.05 + mouse.y * 0.5;

            renderer.render(scene, camera);
        }

        // Resize handler
        function handleResize() {
            width = container.clientWidth;
            height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
        }

        window.addEventListener('resize', handleResize);

        // Start render loop
        animate();

        // Fade in canvas smoothly once render starts, hiding video behind
        setTimeout(() => {
            canvas.style.opacity = '1';
            // Optionally pause video behind to save CPU usage
            const fallbackVideo = document.getElementById('hero-bg-video');
            if (fallbackVideo) {
                fallbackVideo.style.transition = 'opacity 1.2s ease';
                fallbackVideo.style.opacity = '0.3'; // Keep at low opacity for overlay depth
            }
        }, 150);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroWebGL);
    } else {
        initHeroWebGL();
    }
})();
