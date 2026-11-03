"use strict";


const welcomeMessage =
    document.getElementById(
        "welcome-message"
    );

const logoutButton =
    document.getElementById(
        "logout-btn"
    );


// ================================
// Load Logged-in User
// ================================

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


        welcomeMessage.textContent =
            `Welcome, ${result.user.name}. You are logged in as ${result.user.email}.`;


    } catch (error) {

        console.error(
            "Session check error:",
            error
        );


        window.location.href =
            "/login";

    }

}


// ================================
// Logout
// ================================

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

                alert(
                    result.message ||
                    "Logout failed."
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


            alert(
                "Unable to logout. Please try again."
            );


        } finally {

            logoutButton.disabled = false;

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


// ================================
// Start
// ================================

loadCurrentUser();