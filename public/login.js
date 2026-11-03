"use strict";

const loginForm =
    document.getElementById("login-form");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("login-btn");

const alertMessage =
    document.getElementById("alert-message");

const emailError =
    document.getElementById("email-error");

const passwordError =
    document.getElementById("password-error");

const passwordToggle =
    document.getElementById("password-toggle");


// ================================
// Alert
// ================================

function showAlert(message, type) {

    alertMessage.textContent = message;

    alertMessage.className =
        `alert show ${type}`;

}


function hideAlert() {

    alertMessage.textContent = "";

    alertMessage.className =
        "alert";

}


// ================================
// Clear Errors
// ================================

function clearErrors() {

    emailError.textContent = "";

    passwordError.textContent = "";

}


// ================================
// Email Validation
// ================================

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


// ================================
// Form Validation
// ================================

function validateForm() {

    clearErrors();

    hideAlert();

    let isValid = true;


    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;


    if (!email) {

        emailError.textContent =
            "Email address is required.";

        isValid = false;

    } else if (!isValidEmail(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        isValid = false;

    }


    if (!password) {

        passwordError.textContent =
            "Password is required.";

        isValid = false;

    }


    return isValid;

}


// ================================
// Login
// ================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        loginButton.disabled = true;

        loginButton.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true">
            </i>

            Logging In...
        `;


        const loginData = {

            email:
                emailInput.value
                    .trim()
                    .toLowerCase(),

            password:
                passwordInput.value

        };


        try {

            const response =
                await fetch(
                    "/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                loginData
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                showAlert(
                    result.message ||
                    "Login failed.",
                    "error"
                );

                return;
            }


            showAlert(
                result.message,
                "success"
            );


            loginForm.reset();


            // Phase 05:
            // This will redirect to
            // protected resume builder.

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showAlert(
                "Unable to connect to the server. Please try again.",
                "error"
            );

        } finally {

            loginButton.disabled = false;

            loginButton.innerHTML = `
                <span>
                    Login
                </span>

                <i
                    class="fa-solid fa-arrow-right-to-bracket"
                    aria-hidden="true">
                </i>
            `;

        }

    }
);


// ================================
// Show / Hide Password
// ================================

passwordToggle.addEventListener(
    "click",
    function () {

        const isPassword =
            passwordInput.type ===
            "password";


        passwordInput.type =
            isPassword
                ? "text"
                : "password";


        const icon =
            passwordToggle.querySelector("i");


        icon.className =
            isPassword
                ? "fa-solid fa-eye-slash"
                : "fa-solid fa-eye";


        passwordToggle.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );

    }
);