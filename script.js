document.addEventListener('DOMContentLoaded', function() {
    emailjs.init('wbHUoeMg_HIiM4tLQ'); // Your public key from EmailJS

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        gsap.fromTo(themeToggle, 
            { rotation: 0 },
            { rotation: 360, duration: 0.5 }
        );
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.carousel-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            const currentActive = document.querySelector('.carousel-section.active');
            const currentLink = document.querySelector('.nav-link.active');
            
            const currentIndex = Array.from(sections).indexOf(currentActive);
            const targetIndex = Array.from(sections).indexOf(targetSection);
            const direction = targetIndex > currentIndex ? 'right' : 'left';
            
            currentLink.classList.remove('active');
            this.classList.add('active');
            
            gsap.to(currentActive, {
                x: direction === 'right' ? '-100%' : '100%',
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    currentActive.classList.remove('active');
                }
            });
            
            gsap.fromTo(targetSection, 
                { x: direction === 'right' ? '100%' : '-100%', opacity: 0 },
                { x: '0%', opacity: 1, duration: 0.6, ease: "power2.inOut" }
            );
            
            targetSection.classList.add('active');
        });
    });
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .achievement-card, .contact-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                gsap.to(element, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    };
    
    gsap.set('.timeline-item, .skill-category, .project-card, .achievement-card, .contact-item', {
        opacity: 0,
        y: 50
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); 
    
    document.getElementById('contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        emailjs.sendForm(
            'service_kjuru3p', // Your service ID
            'template_3nzb54e', // Your template ID
            form
        )
        .then(function(response) {
            gsap.to(submitBtn, {
                backgroundColor: '#2ecc71',
                duration: 0.3
            });
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            
            alert('Thank you! Your message has been sent successfully.');
            form.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 2000);
        }, function(error) {
            console.error('EmailJS Error:', error);
            
            gsap.to(submitBtn, {
                backgroundColor: '#e74c3c',
                duration: 0.3
            });
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
            
            alert('Failed to send message. Please try again later or email me directly at Hrishishahane3000@gmail.com');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 2000);
        });
    });
    
    const downloadBtn = document.querySelector('.btn-download');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-download"></i> Download CV';
                }, 2000);
            }, 1500);
        });
    }
    
    document.querySelector('.carousel-section')?.classList.add('active');
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const x = e.clientX - card.getBoundingClientRect().left;
            const y = e.clientY - card.getBoundingClientRect().top;
            
            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotationX: angleX,
                rotationY: angleY,
                transformPerspective: 1000,
                ease: "power1.out",
                duration: 0.5
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                ease: "power1.out",
                duration: 0.5
            });
        });
    });

    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
