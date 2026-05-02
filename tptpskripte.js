

//ispod kod je odradjen pomocu AI
// Pronalazimo elemente u HTML-u putem njihovih ID-eva ili klasa
const hamburger = document.getElementById('hamburger'); // pronalazi dugme za mobilni meni
const navMenu = document.querySelector('.nav-menu'); // pronalazi listu sa linkovima

// Dodajemo EventListener koji prati klik miša na hamburger
hamburger.addEventListener('click', () => {
    // Kada kliknemo, dodajemo ili oduzimamo klasu 'active' meniju (otvara/zatvara)
    navMenu.classList.toggle('active');
});

// Zatvaranje menija kada kliknemo na neki od linkova unutar navigacije
document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => {
    navMenu.classList.remove('active'); // uklanja 'active' klasu i skriva meni
}));

// Funkcija koja prati skrolovanje stranice mišem
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar'); // selektujemo navbar
    if (window.scrollY > 50) { // ako smo skrolovali više od 50 piksela
        navbar.style.background = 'rgba(10, 15, 25, 0.98)'; // potamni pozadinu navbara radi čitljivosti
    } else {
        navbar.style.background = 'rgba(18, 24, 38, 0.95)'; // vrati na originalnu boju kada smo na vrhu
    }
});