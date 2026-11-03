"use strict";


// ====================================
// Elements
// ====================================

const resumeForm =
    document.getElementById(
        "resume-form"
    );

const userName =
    document.getElementById(
        "user-name"
    );

const logoutButton =
    document.getElementById(
        "logout-btn"
    );

const saveButton =
    document.getElementById(
        "save-btn"
    );

const generateButton =
    document.getElementById(
        "generate-btn"
    );

const builderAlert =
    document.getElementById(
        "builder-alert"
    );

const fullNameInput =
    document.getElementById(
        "full-name"
    );

const emailInput =
    document.getElementById(
        "resume-email"
    );


// ====================================
// Alert Functions
// ====================================

function showAlert(
    message,
    type
) {

    builderAlert.textContent =
        message;

    builderAlert.className =
        `builder-alert show ${type}`;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function hideAlert() {

    builderAlert.textContent = "";

    builderAlert.className =
        "builder-alert";

}


// ====================================
// Load Logged-In User
// ====================================

async function loadCurrentUser() {

    try {

        const response =
            await fetch(
                "/api/session"
            );


        const result =
            await response.json();


        if (!response.ok) {

            window.location.href =
                "/login";

            return;

        }


        userName.textContent =
            result.user.name;


        // Pre-fill basic information
        // from authenticated account.

        if (!fullNameInput.value) {

            fullNameInput.value =
                result.user.name;

        }


        if (!emailInput.value) {

            emailInput.value =
                result.user.email;

        }


    } catch (error) {

        console.error(
            "Session loading error:",
            error
        );


        window.location.href =
            "/login";

    }

}


// ====================================
// Basic Form Validation
// ====================================

function validateResumeForm() {

    hideAlert();


    const fullName =
        fullNameInput.value.trim();

    const email =
        emailInput.value.trim();


    if (!fullName) {

        showAlert(
            "Please enter your full name.",
            "error"
        );


        fullNameInput.focus();

        return false;

    }


    if (!email) {

        showAlert(
            "Please enter your email address.",
            "error"
        );


        emailInput.focus();

        return false;

    }


    if (!emailInput.checkValidity()) {

        showAlert(
            "Please enter a valid email address.",
            "error"
        );


        emailInput.focus();

        return false;

    }


    return true;

}


// ====================================
// Save Progress
// Phase 07 will connect database.
// ====================================

saveButton.addEventListener(
    "click",
    function () {

        if (!validateResumeForm()) {
            return;
        }


        showAlert(
            "The resume form is ready. Database saving will be connected in Phase 07.",
            "warning"
        );

    }
);


// ====================================
// Generate Resume
// Phase 09 will create preview.
// ====================================

resumeForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (!validateResumeForm()) {
            return;
        }


        showAlert(
            "Your resume information is valid. Resume preview and PDF generation will be added in the upcoming phases.",
            "success"
        );

    }
);


// ====================================
// Logout
// ====================================

logoutButton.addEventListener(
    "click",
    async function () {

        logoutButton.disabled = true;


        logoutButton.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true">
            </i>

            Logging Out...
        `;


        try {

            const response =
                await fetch(
                    "/api/logout",
                    {
                        method: "POST"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                showAlert(
                    result.message ||
                    "Logout failed.",
                    "error"
                );

                return;

            }


            window.location.href =
                "/login";


        } catch (error) {

            console.error(
                "Logout error:",
                error
            );


            showAlert(
                "Unable to logout. Please try again.",
                "error"
            );


        } finally {

            logoutButton.disabled =
                false;


            logoutButton.innerHTML = `
                <i
                    class="fa-solid fa-right-from-bracket"
                    aria-hidden="true">
                </i>

                Logout
            `;

        }

    }
);


// ====================================
// Start Page
// ====================================

loadCurrentUser();