export default {
    mounted(el) {
        let startDist = 0;
        let startScale = 1;
        let currentScale = 1;

        const getDistance = (touches) => {
            const [touch1, touch2] = touches;
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        const handleTouchStart = (event) => {
            if (event.touches.length === 2) {
                startDist = getDistance(event.touches);
                startScale = currentScale;
            }
        };

        const handleTouchMove = (event) => {
            if (event.touches.length === 2) {
                const currentDist = getDistance(event.touches);
                currentScale = startScale * (currentDist / startDist);
                el.style.transform = `scale(${currentScale})`;
            }
        };

        el.addEventListener('touchstart', handleTouchStart);
        el.addEventListener('touchmove', handleTouchMove);

        // Cleanup on unmounted
        el._cleanup = () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
        };
    },
    unmounted(el) {
        el._cleanup();
    },
};
