document.addEventListener('DOMContentLoaded', () => {

    // Pronalazimo elemente u HTML-u (uskladili smo ID i klase)
    const hamburger = document.querySelector('.hamburger') || document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Provjeravamo postoji li hamburger na stranici prije nego dodamo event
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // Animira hamburger (ako imaš klase za to) i otvara/zatvara meni
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Zatvaranje menija kada kliknemo na neki od linkova unutar navigacije
        document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Funkcija koja prati skrolovanje stranice mišem radi promjene boje navbara
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 15, 25, 0.98)'; // Potamni pozadinu
            } else {
                navbar.style.background = 'rgba(18, 24, 38, 0.95)'; // Originalna boja
            }
        }
    });

    // Smooth scroll (glatko skrolovanje) za "Skoči na vrh"
    const scrollToTop = document.querySelector('a[href^="#vrh"]');
    if (scrollToTop) {
        scrollToTop.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Brzina animacije brojeva

    // Funkcija za logiku brojanja
    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCount();
        });
    };

    // Animacija naslova (Fade-in) na About Us stranici
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        // Početna podešavanja za animaciju
        heroTitle.style.opacity = 0;
        heroTitle.style.transition = "opacity 2s ease-in-out";
        
        // Pokretanje animacije nakon kratke pauze
        setTimeout(() => {
            heroTitle.style.opacity = 1;
            // Brojači se pokreću tek kad naslov počne da se pojavljuje
            if (counters.length > 0) {
                startCounters();
            }
        }, 500);
    }
});
