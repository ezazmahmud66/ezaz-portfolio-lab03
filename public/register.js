"use strict";

const registerForm =
    document.getElementById("register-form");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirm-password");

const registerButton =
    document.getElementById("register-btn");

const alertMessage =
    document.getElementById("alert-message");


const nameError =
    document.getElementById("name-error");

const emailError =
    document.getElementById("email-error");

const passwordError =
    document.getElementById("password-error");

const confirmPasswordError =
    document.getElementById(
        "confirm-password-error"
    );


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
// Error Reset
// ================================

function clearErrors() {

    nameError.textContent = "";

    emailError.textContent = "";

    passwordError.textContent = "";

    confirmPasswordError.textContent = "";

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


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    // Name

    if (!name) {

        nameError.textContent =
            "Full name is required.";

        isValid = false;

    } else if (name.length < 2) {

        nameError.textContent =
            "Please enter a valid name.";

        isValid = false;

    }


    // Email

    if (!email) {

        emailError.textContent =
            "Email address is required.";

        isValid = false;

    } else if (!isValidEmail(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        isValid = false;

    }


    // Password

    if (!password) {

        passwordError.textContent =
            "Password is required.";

        isValid = false;

    } else if (password.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        isValid = false;

    }


    // Confirm Password

    if (!confirmPassword) {

        confirmPasswordError.textContent =
            "Please confirm your password.";

        isValid = false;

    } else if (
        password !== confirmPassword
    ) {

        confirmPasswordError.textContent =
            "Passwords do not match.";

        isValid = false;

    }


    return isValid;

}


// ================================
// Register User
// ================================

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        registerButton.disabled = true;

        registerButton.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true">
            </i>

            Creating Account...
        `;


        const registrationData = {

            name:
                nameInput.value.trim(),

            email:
                emailInput.value
                    .trim()
                    .toLowerCase(),

            password:
                passwordInput.value,

            confirmPassword:
                confirmPasswordInput.value

        };


        try {

            const response =
                await fetch(
                    "/api/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                registrationData
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                showAlert(
                    result.message ||
                    "Registration failed.",
                    "error"
                );

                return;
            }


            showAlert(
                result.message,
                "success"
            );


            registerForm.reset();


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showAlert(
                "Unable to connect to the server. Please try again.",
                "error"
            );

        } finally {

            registerButton.disabled = false;

            registerButton.innerHTML = `
                <span>
                    Create Account
                </span>

                <i
                    class="fa-solid fa-arrow-right"
                    aria-hidden="true">
                </i>
            `;

        }

    }
);


// ================================
// Password Show / Hide
// ================================

const passwordToggleButtons =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordToggleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.dataset.target;

                const targetInput =
                    document.getElementById(
                        targetId
                    );

                const icon =
                    button.querySelector("i");


                const isPassword =
                    targetInput.type ===
                    "password";


                targetInput.type =
                    isPassword
                        ? "text"
                        : "password";


                icon.className =
                    isPassword
                        ? "fa-solid fa-eye-slash"
                        : "fa-solid fa-eye";


                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            }
        );

    }
);