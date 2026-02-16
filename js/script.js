const CYBPACT_API = 'https://cybpactbackend.vercel.app/api';

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

document.addEventListener("DOMContentLoaded", async () => {

    const API_URL = `${CYBPACT_API}/testimonials`;

    let testimonials = [];
    let currentIndex = 0;
    let autoSlide;

    const avatar = document.getElementById("testimonial-avatar");
    const quote = document.getElementById("testimonial-quote");
    const name = document.getElementById("testimonial-name");
    const role = document.getElementById("testimonial-role");
    const card = document.getElementById("testimonialCard");

    if (!avatar || !quote || !name || !role || !card) {
        return console.warn("Testimonial elements missing!");
    }

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch testimonials");
        }

        testimonials = await response.json();

        if (!Array.isArray(testimonials) || testimonials.length === 0) {
            throw new Error("No testimonials returned from API");
        }

        initSlider();

    } catch (error) {
        console.error("Error loading testimonials:", error);
    }

    function initSlider() {

        const dotContainer = document.querySelector(".pagination-dot").parentElement;

        dotContainer.innerHTML = testimonials.map((_, i) =>
            `<div class="pagination-dot ${i === 0 ? 'active' : ''}"></div>`
        ).join('');

        const dots = document.querySelectorAll(".pagination-dot");

        function renderTestimonial(index) {
            const data = testimonials[index];

            card.classList.add("fade-out");

            setTimeout(() => {
                avatar.src = data.avatar || "assets/pic-profile.svg";
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

        function startAutoSlide() {
            autoSlide = setInterval(nextSlide, 10000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlide);
            startAutoSlide();
        }

        // Swipe Support
        let startX = 0;

        card.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        card.addEventListener("touchend", (e) => {
            let endX = e.changedTouches[0].clientX;
            let diff = startX - endX;

            if (diff > 50) nextSlide();
            else if (diff < -50) prevSlide();

            resetAutoSlide();
        });

        renderTestimonial(currentIndex);
        startAutoSlide();
    }

    // ============================================================================
    // PROJECTS/GALLERY INTEGRATION
    // ============================================================================

    const galleryContainer = document.querySelector('#solutions .row.g-4');

    if (galleryContainer) {
        try {
            const response = await fetch(`${CYBPACT_API}/portfolio`);
            
            if (response.ok) {
                const projects = await response.json();
                
                if (Array.isArray(projects) && projects.length > 0) {
                    // Clear placeholder content
                    galleryContainer.innerHTML = '';
                    
                    // Render projects
                    projects.forEach(project => {
                        const projectCard = `
                            <div class="col-lg-4 col-md-6">
                                <div class="position-relative overflow-hidden rounded gallery-image" style="height: 400px;">
                                    <img src="${project.image_url}" alt="${project.title}" class="w-100 h-100 object-fit-cover">
                                    <div class="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-75 text-white">
                                        <h5 class="mb-1 fw-bold">${project.title}</h5>
                                        ${project.description ? `<p class="mb-1 small">${project.description}</p>`: ''}
                                        <span class="badge bg-primary">${project.app_type}</span>
                                        <br/>
                                        ${project.website_link ? `<a href="${project.website_link}" target="_blank" class="btn btn-sm btn-outline-light mt-2">View Project</a>` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                        galleryContainer.innerHTML += projectCard;
                    });
                }
            } else {
                console.error('Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    // ============================================================================
    // CONTACT FORM INTEGRATION
    // ============================================================================

    const contactForm = document.querySelector('#contact form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: contactForm.elements.name.value,
            phone: contactForm.elements.phone.value,
            email: contactForm.elements.email.value,
            message: contactForm.elements.message.value,
            services: []
        };
        
        // Get selected services
        contactForm.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            formData.services.push(checkbox.nextElementSibling.textContent.trim());
        });
        
        try {
            const response = await fetch(`${CYBPACT_API}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    text: "Thank you! Our Team Will Reach Out within 24hrs.",
                });
                contactForm.reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " Error Occured sending your message. Do Reachout via sammaingi5@gmail.com",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: " Error Occured sending your message. Do Reachout via sammaingi5@gmail.com",
            });
        }
    });

    // ============================================================================
    // NEWSLETTER SUBSCRIPTION (Footer)
    // ============================================================================

    const newsletterForm = document.querySelector('footer .input-group');

    if (!newsletterForm) return;

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const subscribeBtn = newsletterForm.querySelector('button');

    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', async () => {
            const email = emailInput.value;
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            try {
                const response = await fetch(`${CYBPACT_API}/subscribers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });
                
                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        text: "Thank you for subscribing!",
                    });
                    emailInput.value = '';
                } else {
                    const error = await response.json();
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Sorry, there was an error. Please try again.",
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Sorry, there was an error. Please try again.",
                });
            }
        });
    }

});