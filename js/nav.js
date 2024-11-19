document.addEventListener("DOMContentLoaded", function() {
    // Check if the URL ends with .html
    if (window.location.pathname.endsWith(".html")) {
        // Remove .html from the URL without reloading the page
        const newPath = window.location.pathname.replace(".html", "");
        window.history.replaceState(null, "", newPath);
    }
});

$(document).ready(function() {
    // Load the navigation from nav.html
    $("#navbar-placeholder").load("nav.html", function(response, status, xhr) {
        if (status === "error") {
            console.log("Error loading navigation: " + xhr.status + " " + xhr.statusText);
        } else {
            // After loading, apply the active class to the correct item based on localStorage
            const activePath = localStorage.getItem("activeNavLink");
            if (activePath) {
                $('.sidebar-nav li a').each(function() {
                    if ($(this).attr("href") === activePath) {
                        $(this).addClass("active");
                        $(this).closest("ul.collapse").addClass("show"); // Ensure submenu is expanded
                    }
                });
            }
        }
    });

    // Use event delegation to handle click events for dynamically loaded content
    $(document).on('click', '.sidebar-nav li a', function (e) {
        const href = $(this).attr('href');
        
        // Only set the active class if the link has a valid href and is not a parent menu item
        if (href && href !== "javascript:;") {
            // Store the clicked link's href in localStorage
            localStorage.setItem("activeNavLink", href);
        } else {
            e.preventDefault(); // Prevent navigation for parent items without a valid href
        }
    });
});

