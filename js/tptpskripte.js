// Glavni event listener koji čeka da se DOM učita prije izvršavanja JavaScript koda.
// Ovo osigurava da su svi HTML elementi dostupni prije nego što pokušamo manipulisati njima.
// Bez ovoga, kod bi mogao pokušati pristupiti elementima koji još nisu učitani.
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. LOGIKA ZA TEMU (LocalStorage + System Preference)
    // ==========================================

    // Ovo dugme omogućava korisniku da ručno mijenja između dark i light mode-a.
    const temaDugme = document.getElementById("tema-toggle");

    // Funkcija koja upravlja promjenom klasa na body elementu i čuvanjem u localStorage.
    // Prima parametar 'tema' koji može biti 'light' ili 'dark'.
    // Ova funkcija centralizuje logiku za promjenu teme kako bi se izbjeglo dupliciranje koda.
    function postaviTemu(tema) {
        // Dodaje ili uklanja 'light-mode' klasu sa body elementa.
        // Ova klasa mijenja CSS varijable i daje light temu.
        if (tema === "light") {
            document.body.classList.add("light-mode");
        } else {
            document.body.classList.remove("light-mode");
        }
        // Čuva odabranu temu u localStorage kako bi se zapamtila između sesija.
        // localStorage traje trajno dok se ne obriše ručno ili programski.
        localStorage.setItem("sajt-tema", tema);
    }

    // Inicijalna provjera prilikom učitavanja stranice - odlučuje koja će tema biti postavljena.
    // Prvo provjerava da li korisnik već ima sačuvanu temu u localStorage.
    const sacuvanaTema = localStorage.getItem("sajt-tema");

    // Provjerava sistemsku preferencu korisnika za temu (ako browser podržava).
    // matchMedia API omogućava pristup medijskim upitima, uključujući sistemsku temu.
    const preferiraLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    // Logika za odabir početne teme:
    // 1. Ako postoji sačuvana tema, koristi se ona (korisnik je već odabrao)
    // 2. Ako ne postoji, koristi se sistemska preferenca
    // 3. Default je dark mode (ako ništa drugo nije dostupno)
    if (sacuvanaTema) {
        // Korisnik je već odabrao temu, poštujemo njegov izbor
        postaviTemu(sacuvanaTema);
    } else if (preferiraLight) {
        // Sistem preferira light mode, postavljamo ga
        postaviTemu("light");
    }
    // Inače ostaje default dark mode

    // Event listener za klik na dugme teme.
    // Provjerava trenutnu temu i mijenja je u suprotnu.
    if (temaDugme) {
        temaDugme.addEventListener("click", () => {
            // Ternarni operator: ako ima light-mode klasu, onda je trenutna tema light, pa mijenjamo u dark
            const trenutnaTema = document.body.classList.contains("light-mode") ? "dark" : "light";
            postaviTemu(trenutnaTema);
        });
    }

    // ==========================================
    // 2. HAMBURGER MENI LOGIKA
    // ==========================================

    // Selektovanje hamburger dugmeta i navigacionog menija iz DOM-a.
    // Hamburger dugme je vidljivo samo na mobilnim uređajima (CSS media query).
    // Nav menu je lista stavki koja se pojavljuje/sakriva.
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Provjera da li elementi postoje prije dodavanja event listener-a.
    // Ovo sprječava greške ako elementi nisu pronađeni (npr. na stranicama bez navigacije).
    if (hamburger && navMenu) {
        // Event listener za klik na hamburger dugme.
        // Toggle-uje 'active' klasu na nav menu, što ga prikazuje/sakriva.
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Za svaku stavku menija dodajemo event listener koji zatvara meni kada se klikne.
        // Ovo omogućava korisniku da ode na drugu stranicu bez da ostane otvoren meni.
        // Koristimo forEach jer querySelectorAll vraća NodeList (sličan array-u).
        document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => {
            navMenu.classList.remove('active');
        }));
    }

    // ==========================================
    // 3. LOGIKA ZA FILTRIRANJE KARTICA
    // ==========================================

    // Selektovanje svih filter dugmadi i svih kartica iz DOM-a.
    // querySelectorAll vraća NodeList sa svim elementima koji odgovaraju selektoru.
    const filterDugmad = document.querySelectorAll(".filter-kategorije .btn");
    const kartice = document.querySelectorAll(".kartica");

    // Funkcija koja primjenjuje filter na kartice na osnovu odabrane kategorije.
    // Prima parametar 'kategorija' koji može biti "sve" ili specifična klasa (npr. "web", "design").
    function primijeniFilter(kategorija) {
        // Prolazimo kroz svaku karticu i provjeravamo da li odgovara filteru.
        kartice.forEach(kartica => {
            // Ako je kategorija "sve" ILI kartica ima klasu koja odgovara kategoriji, prikaži je.
            // classList.contains() provjerava da li element ima određenu CSS klasu.
            if (kategorija === "sve" || kartica.classList.contains(kategorija)) {
                kartica.style.display = "flex"; // Prikazuje karticu
            } else {
                kartica.style.display = "none"; // Sakriva karticu
            }
        });
    }

    // Provjera da li postoje filter dugmad prije dodavanja event listener-a.
    if (filterDugmad.length > 0) {
        // Za svako dugme dodajemo event listener za klik.
        filterDugmad.forEach(dugme => {
            dugme.addEventListener("click", function () {
                // Uklanja 'active' klasu sa svih dugmadi (resetuje vizuelno stanje).
                filterDugmad.forEach(btn => btn.classList.remove("active"));
                // Dodaje 'active' klasu na kliknuto dugme (istakne ga).
                this.classList.add("active");
                // Uzima vrijednost data-filter atributa koji sadrži kategoriju.
                const odabranaKategorija = this.getAttribute("data-filter");
                // Primjenjuje filter na kartice.
                primijeniFilter(odabranaKategorija);
            });
        });
        // Inicijalni prikaz - prikazuje sve kartice kada se stranica učita.
        primijeniFilter("sve");
    }

    // ==========================================
    // 4. INTERAKTIVNA STATISTIKA (Brojač posjeta)
    // ==========================================

    // Selektovanje elementa koji prikazuje broj posjeta.
    // Ovo je span ili div element u kojem se prikazuje broj.
    const brojacElement = document.getElementById("brojac-posjeta");

    // Provjera da li element postoji (možda nije na svim stranicama).
    if (brojacElement) {
        // Uzima trenutni broj posjeta iz localStorage ili postavlja na 0 ako ne postoji.
        // localStorage čuva podatke kao string, pa koristimo || 0 za fallback.
        let brojPosjeta = localStorage.getItem("posjete_ukupno") || 0;

        // Povećava broj posjeta za 1 (trenutna posjeta).
        brojPosjeta++;

        // Čuva novi broj posjeta u localStorage.
        // parseInt() pretvara string u broj, mada JavaScript automatski konvertuje.
        localStorage.setItem("posjete_ukupno", brojPosjeta);

        // Prikazuje broj posjeta u HTML elementu.
        // innerText postavlja tekstualni sadržaj elementa.
        brojacElement.innerText = brojPosjeta;
    }

    // ==========================================
    // 5. KONTAKT FORMA (Validacija & Reset)
    // ==========================================

    // Selektovanje elemenata kontakt forme.
    // kontaktForma je sam forma element, uspjehBox je div koji se prikazuje nakon uspješnog slanja.
    const kontaktForma = document.getElementById("kontaktForma");
    const uspjehBox = document.getElementById("uspjehBox");
    const resetDugme = document.getElementById("resetDugme");

    // Event listener za submit forme.
    // preventDefault() sprječava default ponašanje (refresh stranice).
    if (kontaktForma) {
        kontaktForma.addEventListener("submit", (e) => {
            e.preventDefault(); // Sprječava slanje forme na server (koristimo JavaScript validaciju)

            // Poziva funkciju za validaciju; ako je validno, pokreće animirani loader.
            if (izvrsiValidaciju()) {
                const submitDugme = kontaktForma.querySelector(".btn-posalji");

                // ==========================================
                // ANIMIRANI LOADER - Spinner na dugmetu
                // Prikazuje loading stanje dok se "simulira" slanje poruke.
                // submitDugme.disabled = true sprječava dvostruki klik.
                // innerHTML mijenja tekst dugmeta u spinner + tekst.
                // ==========================================
                const originalniTekst = submitDugme.innerHTML;
                submitDugme.disabled = true;
                submitDugme.classList.add("btn-posalji-loading");
                submitDugme.innerHTML = `<span class="btn-spinner"></span> Slanje...`;

                // setTimeout simulira mrežni zahtjev - čeka 1800ms prije prikaza uspjeha.
                // U pravoj aplikaciji ovdje bi bio fetch() poziv ka serveru.
                setTimeout(() => {
                    // Vraća dugme u originalno stanje (za slučaj da se forma reset-uje).
                    submitDugme.disabled = false;
                    submitDugme.classList.remove("btn-posalji-loading");
                    submitDugme.innerHTML = originalniTekst;

                    // Uzima ime korisnika iz input polja za personalizovanu poruku.
                    const korisnikIme = document.getElementById("ime").value;

                    // Selektovanje elementa gdje se prikazuje uspjeh poruka.
                    const uspjehTekstElement = document.getElementById("uspjehPorukaText");

                    // Postavlja personalizovanu poruku sa imenom korisnika.
                    if (uspjehTekstElement) {
                        uspjehTekstElement.innerHTML = `✅ Hvala Vam, <strong>${korisnikIme}</strong>. Vaša poruka je uspješno procesuirana!`;
                    }

                    // Prikazuje uspjeh box i sakriva formu.
                    if (uspjehBox) uspjehBox.style.display = "block";
                    kontaktForma.style.display = "none";
                }, 1800);
            }
        });
    }

    // Funkcija koja izvršava validaciju svih polja forme.
    // Vraća true ako su sva polja validna, false ako ima grešaka.
    // Koristi regularne izraze za email i telefon.
    function izvrsiValidaciju() {
        let validno = true; // Pretpostavljamo da je validno, mijenjamo ako nađemo grešku

        // Regularni izraz za email validaciju.
        // Provjerava osnovni format: nešto@nešto.nešto
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Regularni izraz za ime/prezime - dozvoljava samo slova (ukljucujuci bosanska).
        const regexIme = /^[a-zA-ZčćšžđČĆŠŽĐ\s]+$/;

        // Regularni izraz za telefon - dozvoljava samo brojeve, razmake i crtice.
        const regexTelefon = /^[0-9]+$/;

        // Array objekata koji definišu sva polja za validaciju.
        // Svaki objekat ima: id (HTML id), msg (poruka za prazno polje), reg (regex), regMsg (poruka za regex grešku).
        const polja = [
            { id: "ime", msg: "Ime je obavezno", reg: regexIme, regMsg: "Ime smije sadrzavati samo slova" },
            { id: "prezime", msg: "Prezime je obavezno", reg: regexIme, regMsg: "Prezime smije sadrzavati samo slova" },
            { id: "email", msg: "Email je obavezan", reg: regexEmail, regMsg: "Format emaila nije ispravan" },
            { id: "telefon", msg: "Telefon je obavezan", reg: regexTelefon, regMsg: "Telefon smije sadrzavati samo brojeve" },
            { id: "tema", msg: "Molimo odaberite temu" },
            { id: "poruka", msg: "Poruka ne može biti prazna" }
        ];

        // Prolazimo kroz svako polje i validiramo ga.
        polja.forEach(polje => {
            // Selektovanje input elementa i span-a za greške.
            const inputElement = document.getElementById(polje.id);
            if (inputElement) {
                const errorSpan = inputElement.nextElementSibling; // Span za greške je odmah nakon input-a
                const vrijednost = inputElement.value.trim(); // trim() uklanja razmake sa početka i kraja

                // Resetujemo vizuelne indikatore greške prije validacije.
                inputElement.classList.remove("kontakt-greska-border");
                if (errorSpan) errorSpan.innerText = "";

                // Provjera da li je polje prazno.
                if (vrijednost === "") {
                    prikaziGresku(inputElement, errorSpan, polje.msg);
                    validno = false; // Označavamo da forma nije validna
                } else if (polje.reg && !polje.reg.test(vrijednost)) {
                    // Ako postoji regex i vrijednost ne odgovara, prikaži regex grešku.
                    prikaziGresku(inputElement, errorSpan, polje.regMsg);
                    validno = false;
                }
            }
        });
        return validno; // Vraćamo rezultat validacije
    }

    // Pomoćna funkcija koja prikazuje grešku na polju.
    // Dodaje CSS klasu za crvenu ivicu i postavlja tekst greške.
    function prikaziGresku(el, span, poruka) {
        el.classList.add("kontakt-greska-border"); // Dodaje crvenu ivicu
        el.classList.remove("kontakt-validno-border"); // Uklanja zelenu ivicu
        if (span) span.innerText = poruka; // Postavlja tekst greške
    }

    // Pomoćna funkcija koja označava polje kao validno (zelena ivica).
    function prikaziValidno(el, span) {
        el.classList.remove("kontakt-greska-border");
        el.classList.add("kontakt-validno-border"); // Zelena ivica
        if (span) span.innerText = "";
    }

    // ==========================================
    // REAL-TIME VALIDACIJA - Validacija dok korisnik tipka
    // ==========================================
    // Definicije polja sa validacionim pravilima - ista lista kao u izvrsiValidaciju.
    // Koristimo iste regex i poruke za konzistentnost između submit i real-time provjere.
    const regularnaPolja = [
        { id: "ime", msg: "Ime je obavezno", reg: /^[a-zA-ZčćšžđČĆŠŽĐ\s]+$/, regMsg: "Ime smije sadrzavati samo slova" },
        { id: "prezime", msg: "Prezime je obavezno", reg: /^[a-zA-ZčćšžđČĆŠŽĐ\s]+$/, regMsg: "Prezime smije sadrzavati samo slova" },
        { id: "email", msg: "Email je obavezan", reg: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, regMsg: "Format emaila nije ispravan" },
        { id: "telefon", msg: "Telefon je obavezan", reg: /^[0-9]+$/, regMsg: "Telefon smije sadrzavati samo brojeve" },
        { id: "tema", msg: "Molimo odaberite temu" },
        { id: "poruka", msg: "Poruka ne može biti prazna" }
    ];

    // Validira jedno polje i prikazuje odgovarajući vizuelni feedback.
    function validirajJednoPolje(inputElement, errorSpan, polje) {
        const vrijednost = inputElement.value.trim();
        if (vrijednost === "") {
            prikaziGresku(inputElement, errorSpan, polje.msg);
            return false;
        } else if (polje.reg && !polje.reg.test(vrijednost)) {
            prikaziGresku(inputElement, errorSpan, polje.regMsg);
            return false;
        } else {
            prikaziValidno(inputElement, errorSpan);
            return true;
        }
    }

    // Za svako polje dodajemo blur i input event listenere.
    // 'blur' - aktivira se kada korisnik napusti polje (odmah provjerava).
    // 'input' - aktivira se dok korisnik tipka, ali SAMO ako je već jednom napustio polje.
    // Ovo sprječava crvene greške koje iskaču dok korisnik još nije završio pisanje.
    regularnaPolja.forEach(polje => {
        const inputElement = document.getElementById(polje.id);
        if (!inputElement) return;
        const errorSpan = inputElement.nextElementSibling;
        let dodirnuto = false; // Prati da li je korisnik bio na ovom polju

        inputElement.addEventListener("blur", () => {
            dodirnuto = true;
            validirajJednoPolje(inputElement, errorSpan, polje);
        });

        inputElement.addEventListener("input", () => {
            if (dodirnuto) {
                validirajJednoPolje(inputElement, errorSpan, polje);
            }
        });
    });

    // --- Resetovanje forme ---
    // Event listener za reset dugme.
    // Čisti formu, uklanja greške i vraća početno stanje.
    if (resetDugme && kontaktForma) {
        resetDugme.addEventListener("click", () => {
            kontaktForma.reset(); // Built-in metoda koja čisti sva polja forme

            // Uklanja crvene i zelene ivice sa svih polja.
            document.querySelectorAll(".kontakt-greska-border").forEach(el => {
                el.classList.remove("kontakt-greska-border");
            });
            document.querySelectorAll(".kontakt-validno-border").forEach(el => {
                el.classList.remove("kontakt-validno-border");
            });

            // Čisti tekst grešaka iz svih span elemenata.
            document.querySelectorAll(".kontakt-greska-poruka").forEach(span => {
                span.innerText = "";
            });

            // Sakriva uspjeh box i prikazuje formu ponovo.
            if (uspjehBox) uspjehBox.style.display = "none";
            kontaktForma.style.display = "block";
        });
    }

    // ==========================================
    // 6. SMOOTH SCROLL
    // ==========================================

    // Selektovanje svih linkova koji počinju sa # (anchor linkovi).
    // href^="#" znači "href atribut počinje sa #".
    // Ovo uključuje linkove ka sekcijama na istoj stranici.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Za svaki anchor link dodajemo event listener za klik.
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Sprječava default ponašanje (skok na sekciju)

            // Uzima href vrijednost (npr. "#kontakt") i pretvara u ID selektor.
            const targetId = this.getAttribute('href');

            // Provjera da li je targetId različit od samo "#" (prazan link).
            if (targetId !== "#") {
                // Selektovanje target elementa koristeći ID.
                const target = document.querySelector(targetId);

                // Provjera da li target element postoji.
                if (target) {
                    // Smooth scroll do target elementa.
                    // scrollIntoView sa behavior: 'smooth' daje animirani scroll.
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});