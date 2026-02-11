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

let currentIndex = 0;

const avatar = document.getElementById("testimonial-avatar");
const quote = document.getElementById("testimonial-quote");
const name = document.getElementById("testimonial-name");
const role = document.getElementById("testimonial-role");
const dots = document.querySelectorAll(".pagination-dot");

function renderTestimonial(index) {
const data = testimonials[index];

avatar.src = data.avatar;
quote.textContent = "“" + data.quote + "”";
name.textContent = data.name;
role.textContent = data.role;

// Update dots
dots.forEach(dot => dot.classList.remove("active"));
dots[index].classList.add("active");
}

// Next
document.getElementById("nextBtn").addEventListener("click", () => {
currentIndex = (currentIndex + 1) % testimonials.length;
renderTestimonial(currentIndex);
});

// Previous
document.getElementById("prevBtn").addEventListener("click", () => {
currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
renderTestimonial(currentIndex);
});

// Dot Click
dots.forEach((dot, index) => {
dot.addEventListener("click", () => {
    currentIndex = index;
    renderTestimonial(currentIndex);
});
});

// Initial Load
renderTestimonial(currentIndex);