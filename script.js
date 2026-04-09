document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('[data-reveal]');
    /**
     * Scroll Reveal Animation
     */
    const handleReveal = () => {
        const revealPoint = 150;
        const windowHeight = window.innerHeight;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                if (!el.classList.contains('active')) {
                    el.classList.add('active');
                    
                    // Trigger progress bars animation
                    const progressBars = el.querySelectorAll('.progress-bar-fill');
                    progressBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.width = bar.getAttribute('data-width');
                        }, 400);
                    });
                }
            } else {
                // Optionally remove active class if you want repeat animations
                // el.classList.remove('active');
            }
        });
    };

    // Initialize
    window.addEventListener('scroll', () => {
        handleReveal();
    });

    // Run once on load
    handleReveal();
    
    // Initial animation for hero elements
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero [data-reveal]');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 200);
        });
    }, 100);

    /**
     * Keyboard Navigation for Presentation-style Sections
     */
    const sections = Array.from(document.querySelectorAll('section'));
    let currentFocusIndex = 0;
    let isKeyScrolling = false;

    // Determine currently active section if user manually scrolls
    window.addEventListener('scroll', () => {
        if (!isKeyScrolling) {
            let minDistance = Infinity;
            sections.forEach((sec, index) => {
                const distance = Math.abs(sec.getBoundingClientRect().top);
                // The section nearest to the Top of the window is active
                if (distance < minDistance) {
                    minDistance = distance;
                    currentFocusIndex = index;
                }
            });
        }
    });

    window.addEventListener('keydown', (e) => {
        const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
        
        if (isArrowKey) {
            e.preventDefault(); // Prevent standard jerky scroll
            
            if (isKeyScrolling) return;

            // Calculate next section index
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                currentFocusIndex = Math.min(currentFocusIndex + 1, sections.length - 1);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                currentFocusIndex = Math.max(currentFocusIndex - 1, 0);
            }

            // Scroll to the targeted section
            isKeyScrolling = true;
            sections[currentFocusIndex].scrollIntoView({ behavior: 'smooth' });
            
            // Prevent another keypress from jarring the scroll until animation ends
            setTimeout(() => {
                isKeyScrolling = false;
            }, 600);
        }
    });
});
