document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progress-bar');
    const slideNumber = document.getElementById('slide-number');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update progress bar
        const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;

        // Update slide number
        slideNumber.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;

        // Update buttons state
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === totalSlides - 1;
        
        // Dynamic chart animation on Slide 8
        if (currentSlideIndex === 7) { // 0-indexed slide 8
            const bars = document.querySelectorAll('.bar');
            bars.forEach((bar, i) => {
                const targetHeight = bar.getAttribute('style').match(/height:\s*(\d+)%/)[1];
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = `${targetHeight}%`;
                }, 100 * (i + 1));
            });
        }
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateSlides();
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlides();
        }
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'PageDown') {
            nextSlide();
        } else if (e.key === 'PageUp') {
            prevSlide();
        }
    });

    // Mouse Navigation
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Initial load
    updateSlides();
});
