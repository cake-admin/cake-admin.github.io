// Remove .html part of the urls
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
    $("#navbar-placeholder").load("./nav.html", function(response, status, xhr) {
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


$(document).ready(function() {
    const $sidebar = $('#sidebar-wrapper');
    const $toggler = $('.toggler');
    const $icon = $('#menu-toggle i');

    // Set the initial state of the toggler icon based on sidebar state
    if ($sidebar.hasClass('collapsed')) {
        $toggler.css('left', '10px'); // Position toggler for collapsed state
        $icon.text('menu'); // Hamburger icon
    } else {
        $toggler.css('left', '250px'); // Position toggler for expanded state
        $icon.text('close'); // Close icon
    }
});

$(document).on('click', '#menu-toggle', function(e) {
    e.preventDefault();
    const $sidebar = $('#sidebar-wrapper');
    const $toggler = $('.toggler');
    const $icon = $(this).find('i');

    // Toggle the sidebar visibility
    $sidebar.toggleClass('collapsed');

    // Adjust the toggler's position and icon
    if ($sidebar.hasClass('collapsed')) {
        $toggler.css('left', '10px'); // Move to default position
        $icon.text('menu'); // Change to hamburger icon
    } else {
        $toggler.css('left', '250px'); // Align with the sidebar
        $icon.text('close'); // Change to close icon
    }
});