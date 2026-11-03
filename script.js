// =========================================
// Md. Ezaz Mahmud Portfolio
// Phase 09 — JavaScript Interactions
// =========================================

"use strict";


// =========================================
// ELEMENTS
// =========================================

const menuToggle =
    document.getElementById("menu-toggle");

const navLinks =
    document.getElementById("nav-links");

const navigationLinks =
    document.querySelectorAll(".nav-link");

const sections =
    document.querySelectorAll("main section[id]");

const siteHeader =
    document.getElementById("site-header");

const scrollTopButton =
    document.getElementById("scroll-top");

const revealElements =
    document.querySelectorAll(".reveal");


// =========================================
// MOBILE NAVIGATION
// =========================================

function openMobileMenu() {

    navLinks.classList.add("show");

    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

    menuToggle.innerHTML =
        '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';

}


function closeMobileMenu() {

    navLinks.classList.remove("show");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    menuToggle.innerHTML =
        '<i class="fa-solid fa-bars" aria-hidden="true"></i>';

}


menuToggle.addEventListener(
    "click",
    function () {

        const isOpen =
            navLinks.classList.contains("show");

        if (isOpen) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }
);


// =========================================
// CLOSE MENU AFTER NAV LINK CLICK
// =========================================

navigationLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                closeMobileMenu();

            }
        );

    }
);


// =========================================
// CLOSE MENU WHEN WINDOW BECOMES DESKTOP
// =========================================

window.addEventListener(
    "resize",
    function () {

        if (window.innerWidth > 768) {

            closeMobileMenu();

        }

    }
);


// =========================================
// ACTIVE NAVIGATION LINK
// =========================================

function updateActiveNavigation() {

    const scrollPosition =
        window.scrollY + 160;

    sections.forEach(
        function (section) {

            const sectionTop =
                section.offsetTop;

            const sectionHeight =
                section.offsetHeight;

            const sectionId =
                section.getAttribute("id");

            if (
                scrollPosition >= sectionTop &&
                scrollPosition <
                sectionTop + sectionHeight
            ) {

                navigationLinks.forEach(
                    function (link) {

                        link.classList.remove(
                            "active"
                        );

                    }
                );


                const currentLink =
                    document.querySelector(
                        '.nav-link[href="#' +
                        sectionId +
                        '"]'
                    );


                if (currentLink) {

                    currentLink.classList.add(
                        "active"
                    );

                }

            }

        }
    );

}


// =========================================
// HEADER SCROLL EFFECT
// =========================================

function updateHeader() {

    if (window.scrollY > 20) {

        siteHeader.classList.add(
            "scrolled"
        );

    } else {

        siteHeader.classList.remove(
            "scrolled"
        );

    }

}


// =========================================
// SCROLL TO TOP BUTTON
// =========================================

function updateScrollTopButton() {

    if (window.scrollY > 500) {

        scrollTopButton.classList.add(
            "show"
        );

    } else {

        scrollTopButton.classList.remove(
            "show"
        );

    }

}


scrollTopButton.addEventListener(
    "click",
    function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// =========================================
// SCROLL REVEAL ANIMATION
// =========================================

const revealObserver =
    new IntersectionObserver(

        function (entries, observer) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach(
    function (element) {

        revealObserver.observe(
            element
        );

    }
);


// =========================================
// GLOBAL SCROLL EVENT
// =========================================

window.addEventListener(
    "scroll",
    function () {

        updateActiveNavigation();

        updateHeader();

        updateScrollTopButton();

    }
);


// =========================================
// INITIAL PAGE LOAD
// =========================================

updateActiveNavigation();

updateHeader();

updateScrollTopButton();


console.log(
    "Ezaz Portfolio Phase 10 loaded successfully."
);