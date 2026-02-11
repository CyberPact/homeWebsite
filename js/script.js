const faqItems = document.querySelectorAll('.faq-item');

// SVGs
const plusSVG = `
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
    <path d="M6.545 15.96V0H10.57V15.96H6.545ZM0 9.94V5.985H17.08V9.94H0Z" fill="black"/>
    </svg>
`;

const minusSVG = `
    <svg width="15" height="4" viewBox="0 0 15 4" fill="none">
    <rect width="15" height="4" fill="black"/>
    </svg>
`;

faqItems.forEach(item => {

    item.addEventListener('click', () => {

    const isActive = item.classList.contains('active');

    // Close all items
    faqItems.forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-toggle').innerHTML = plusSVG;
    });

    // Open clicked one if it wasn't active
    if (!isActive) {
        item.classList.add('active');
        item.querySelector('.faq-toggle').innerHTML = minusSVG;
    }

    });

});


// Testimonials Data
const testimonials = [
    {
        avatar: "assets/male-avatar.svg",
        quote: "Outstanding collaboration and deep technical knowledge. We saw immediate performance improvements.",
        name: "John Mwangi",
        role: "CTO, Fintech Startup"
    },
    {
        avatar: "assets/female-avatar.svg",
        quote: "They understood our business needs perfectly and delivered beyond scope.",
        name: "Sarah Wanjiru",
        role: "Operations Director"
    },
    {
        avatar: "assets/male-avatar.svg",
        quote: "Reliable, secure, and scalable architecture. Highly recommended.",
        name: "David Otieno",
        role: "Head of Engineering"
    },
    {
        avatar: "assets/female-avatar.svg",
        quote: "Professional execution from planning to deployment.",
        name: "Grace Njeri",
        role: "Product Manager"
    }
];

document.addEventListener("DOMContentLoaded", () => {

    let currentIndex = 0;
    let autoSlide;

    const avatar = document.getElementById("testimonial-avatar");
    const quote = document.getElementById("testimonial-quote");
    const name = document.getElementById("testimonial-name");
    const role = document.getElementById("testimonial-role");
    const card = document.getElementById("testimonialCard");

    const dotContainer = document.querySelector(".pagination-dot").parentElement;
    dotContainer.innerHTML = testimonials.map((_, i) =>
    `<div class="pagination-dot ${i === 0 ? 'active' : ''}"></div>`
    ).join('');
    const dots = document.querySelectorAll(".pagination-dot");

    if (!avatar || !quote || !name || !role || !card || dots.length === 0) return console.warn("Testimonial elements missing!");

    function renderTestimonial(index) {
    const data = testimonials[index];

    card.classList.add("fade-out");

    setTimeout(() => {
        avatar.src = data.avatar;
        quote.textContent = "“" + data.quote + "”";
        name.textContent = data.name;
        role.textContent = data.role;

        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");

        card.classList.remove("fade-out");
        card.classList.add("fade-in");
    }, 200);
    }

    function nextSlide() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderTestimonial(currentIndex);
    }

    function prevSlide() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(currentIndex);
    }

    document.getElementById("nextBtn").addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
    });

    dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        currentIndex = index;
        renderTestimonial(currentIndex);
        resetAutoSlide();
    });
    });

    // Auto-slide
    function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 10000);
    }

    function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
    }

    startAutoSlide();

    // Swipe Support
    let startX = 0;

    card.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    });

    card.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if (diff > 50) {
        nextSlide();
    } else if (diff < -50) {
        prevSlide();
    }

    resetAutoSlide();
    });

    renderTestimonial(currentIndex);

});