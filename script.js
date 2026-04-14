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

    /**
     * Image Modal Logic
     */
    const modalOverlay = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const viewImageBtns = document.querySelectorAll('.btn-view-image');
    let scale = 1;
    let isDragging = false;
    let startX, startY;
    let translateX = 0, translateY = 0;

    viewImageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const imgSrc = btn.getAttribute('data-img');
            modalImage.src = imgSrc;
            modalOverlay.style.display = 'flex';
            
            // Reset state
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();

            setTimeout(() => {
                modalOverlay.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden'; 
        });
    });

    const updateImageTransform = () => {
        // Remove transition during manual transform for "snappy" feel
        modalImage.style.transition = 'none';
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    /**
     * Mouse Wheel Zoom (Toward Cursor)
     */
    modalOverlay.addEventListener('wheel', (e) => {
        if (!modalOverlay.classList.contains('active')) return;
        e.preventDefault();
        
        const zoomStep = 0.1;
        const delta = e.deltaY < 0 ? 1 : -1;
        const oldScale = scale;
        const newScale = Math.min(Math.max(scale + delta * zoomStep * scale, 0.5), 8); // Scale between 0.5x and 8x
        
        // Calculate point under mouse to keep it stable
        const rect = modalImage.getBoundingClientRect();
        const mouseX = e.clientX - (rect.left + rect.width / 2);
        const mouseY = e.clientY - (rect.top + rect.height / 2);

        // Adjust translation to keep the mouse point stable
        translateX -= (mouseX / oldScale) * (newScale - oldScale);
        translateY -= (mouseY / oldScale) * (newScale - oldScale);

        scale = newScale;
        updateImageTransform();
    }, { passive: false });

    /**
     * Drag to Pan
     */
    modalImage.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalImage.style.cursor = 'grabbing';
        modalImage.style.transition = 'none'; // Ensure no delay
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImageTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        if (modalImage) modalImage.style.cursor = scale > 1 ? 'grab' : 'default';
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 300);
        document.body.style.overflow = ''; 
    };

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});
