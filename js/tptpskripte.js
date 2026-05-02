// pronalazimo elemente u HTML-u putem njihovih ID-eva ili klasa
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

// Dodajemo "EventListener" koji prati klik miša
hamburger.addEventListener('click', () => {
    // Kada kliknemo, dodajemo ili oduzimamo klasu 'active' meniju
    navMenu.classList.toggle('active');
});

// zatvaranje menija kada kliknemo na neki link (radi lakšeg snalaženja)
document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => {
    navMenu.classList.remove('active');
}));

//iznad kod je odradjen pomocu AI