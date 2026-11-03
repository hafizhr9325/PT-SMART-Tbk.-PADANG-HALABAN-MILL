
(() => {
    "use strict";

    // ==================================================
    // 1. ELEMENT
    // ==================================================

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const heroIndex = document.querySelector(".hero-index");

    const navigationLinks = Array.from(
        document.querySelectorAll(".main-nav .nav-link")
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    // ==================================================
    // 2. HEADER SCROLL EFFECT
    // ==================================================

    function updateHeader() {
        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    // ==================================================
    // 3. MOBILE NAVIGATION
    // ==================================================

    function closeMobileMenu() {
        if (!mainNav || !menuToggle) return;

        mainNav.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.className = "bi bi-list";
        }
    }

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.className = isOpen
                    ? "bi bi-x-lg"
                    : "bi bi-list";
            }

        });

        // Tutup menu setelah navigasi dipilih

        navigationLinks.forEach((link) => {

            link.addEventListener("click", () => {
                closeMobileMenu();
            });

        });

        // Tutup menu ketika klik di luar navbar

        document.addEventListener("click", (event) => {

            const clickedInsideNav =
                mainNav.contains(event.target);

            const clickedToggle =
                menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                closeMobileMenu();
            }

        });

    }


    // ==================================================
    // 4. SCROLL REVEAL ANIMATION
    // ==================================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        // Sesuai dengan CSS terbaru: .reveal.show

                        entry.target.classList.add("show");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        // Fallback jika browser tidak mendukung IntersectionObserver

        revealElements.forEach((element) => {
            element.classList.add("show");
        });

    }


    // ==================================================
    // 5. GENERATE HERO PAGE INDEX
    // ==================================================

    const sections = navigationLinks
        .map((link) => {

            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return null;
            }

            return document.querySelector(targetId);

        })
        .filter(Boolean);

    const indexLinks = [];

    if (heroIndex && navigationLinks.length > 0) {

        // Bersihkan angka sebelumnya

        heroIndex.innerHTML = "";

        navigationLinks.forEach((navLink, index) => {

            const targetId = navLink.getAttribute("href");

            if (!targetId || !document.querySelector(targetId)) {
                return;
            }

            const numberLink = document.createElement("a");

            numberLink.href = targetId;
            numberLink.className = "index-number";

            numberLink.textContent = String(
                index + 1
            ).padStart(2, "0");

            numberLink.setAttribute(
                "aria-label",
                navLink.textContent.trim()
            );

            numberLink.setAttribute(
                "title",
                navLink.textContent.trim()
            );

            heroIndex.appendChild(numberLink);

            indexLinks.push(numberLink);

        });

    }


    // ==================================================
    // 6. ACTIVE NAVIGATION
    // ==================================================

    function setActiveNavigation(activeIndex) {

        navigationLinks.forEach((link, index) => {

            link.classList.toggle(
                "active",
                index === activeIndex
            );

        });

        indexLinks.forEach((link, index) => {

            link.classList.toggle(
                "active",
                index === activeIndex
            );

        });

    }


    // ==================================================
    // 7. CLICK HERO INDEX
    // ==================================================

    indexLinks.forEach((link, index) => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

            const target = sections[index];

            if (!target) return;

            target.scrollIntoView({
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            setActiveNavigation(index);

        });

    });


    // ==================================================
    // 8. DETECT ACTIVE SECTION ON SCROLL
    // ==================================================

    function updateActiveNavigation() {

        if (sections.length === 0) return;

        const referencePosition =
            window.scrollY + window.innerHeight * 0.4;

        let activeIndex = 0;

        sections.forEach((section, index) => {

            const sectionTop =
                section.getBoundingClientRect().top +
                window.scrollY;

            if (referencePosition >= sectionTop) {
                activeIndex = index;
            }

        });

        // Aktifkan bagian terakhir ketika halaman mencapai bawah

        const pageBottom =
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight - 5;

        if (pageBottom) {
            activeIndex = sections.length - 1;
        }

        setActiveNavigation(activeIndex);

    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateActiveNavigation
    );

    window.addEventListener(
        "load",
        updateActiveNavigation
    );

    updateActiveNavigation();


    // ==================================================
    // 9. SMOOTH SCROLL FOR INTERNAL LINKS
    // ==================================================

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        // Hindari memasang event ganda pada navigasi utama
        // dan angka indeks halaman

        if (
            link.classList.contains("nav-link") ||
            link.classList.contains("index-number")
        ) {
            return;
        }

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth",
                block: "start"
            });

        });

    });


    // ==================================================
    // 10. INITIALIZATION
    // ==================================================

    console.log(
        "PT SMART Tbk - Padang Halaban Mill website berhasil dimuat."
    );

})();
