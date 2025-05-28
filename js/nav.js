// Remove .html part of the urls
document.addEventListener("DOMContentLoaded", function() {
    // Check if the URL ends with .html
    if (window.location.pathname.endsWith(".html")) {
        // Remove .html from the URL without reloading the page
        const newPath = window.location.pathname.replace(".html", "");
        window.history.replaceState(null, "", newPath);
    }
});

// Function to handle sidebar state
function initializeSidebarState() {
    const $sidebar = $('#sidebar-wrapper');
    const $wrapper = $('#wrapper');
    const $toggler = $('.toggler');
    const $icon = $('#menu-toggle i');
    
    // Check localStorage for saved sidebar state
    const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    
    // Set the initial state based on localStorage
    if (isCollapsed) {
        $sidebar.addClass('collapsed');
        $wrapper.addClass('collapsed');
        $toggler.css('left', '10px');
        $icon.text('menu');
    } else {
        $wrapper.removeClass('collapsed');
        $toggler.css('left', '250px');
        $icon.text('close');
    }
}

$(document).ready(function() {
    // Initialize sidebar state on page load
    initializeSidebarState();

    function setActiveLink() {
        // Get current path and strip .html if present
        let currentPath = window.location.pathname;
        // Remove leading slash and handle root path
        currentPath = currentPath.replace(/^\//, '');
        if (currentPath === '' || currentPath === '/') {
            currentPath = '/';  // Changed this to match the home link href
        }
        
        // Remove active class from all links
        $('.nav-link, .submenu li a').removeClass('active');
        
        // Find and activate the correct link
        $('.submenu li a, .nav-link').each(function() {
            let href = $(this).attr('href');
            if (!href) return;
            
            // Special handling for home page
            if (href === '/' && (currentPath === '/' || currentPath === '' || currentPath === 'index.html')) {
                $(this).addClass('active');
                return;
            }
            
            // Clean up href for comparison
            href = href.replace(/^\//, '');
            if (href === '/') href = '';
            
            // Compare paths with and without .html
            const hrefWithoutHtml = href.replace('.html', '');
            const currentPathWithoutHtml = currentPath.replace('.html', '');
            
            if (href === currentPath || 
                hrefWithoutHtml === currentPathWithoutHtml ||
                href === currentPathWithoutHtml ||
                hrefWithoutHtml === currentPath) {
                $(this).addClass('active');
            }
        });
    }

    // Load the navigation from nav.html
    $("#navbar-placeholder").load("./nav.html", function(response, status, xhr) {
        if (status === "error") {
            console.log("Error loading navigation: " + xhr.status + " " + xhr.statusText);
        } else {
            // Initialize submenu states
            $('.has-submenu').each(function() {
                const $submenu = $(this).find('.submenu');
                const $toggle = $(this).find('.submenu-toggle');
                const submenuId = $submenu.attr('id');
                
                // Check localStorage for saved state
                const isExpanded = localStorage.getItem('submenu_' + submenuId) !== 'collapsed';
                
                // Set initial state based on localStorage
                if (!isExpanded) {
                    $submenu.removeClass('expanded');
                    $toggle.removeClass('expanded');
                    $toggle.find('.chevron').css('transform', 'rotate(0deg)');
                } else {
                    $submenu.addClass('expanded');
                    $toggle.addClass('expanded');
                    $toggle.find('.chevron').css('transform', 'rotate(180deg)');
                }
            });

            // Set active link based on current URL
            setActiveLink();

            // Set the version number dynamically
            var version = window.CAKE_VERSION || "4.0.1";
            $("#cake-version").text("Version " + version);
        }
    });

    // Handle submenu toggles
    $(document).on('click', '.submenu-toggle', function(e) {
        e.preventDefault();
        const $submenu = $(this).next('.submenu');
        const $toggle = $(this);
        const submenuId = $submenu.attr('id');
        
        // Toggle the expanded state
        $toggle.toggleClass('expanded');
        $submenu.toggleClass('expanded');
        
        // Update chevron rotation
        const isExpanded = $submenu.hasClass('expanded');
        $toggle.find('.chevron').css('transform', isExpanded ? 'rotate(180deg)' : 'rotate(0deg)');
        
        // Save the state to localStorage
        localStorage.setItem('submenu_' + submenuId, 
            isExpanded ? 'expanded' : 'collapsed'
        );
    });

    // Handle navigation link clicks
    $(document).on('click', '.submenu li a, .nav-link', function(e) {
        const href = $(this).attr('href');
        if (!href || href === '#' || href === 'javascript:;') return;
        
        // Remove active class from all links
        $('.submenu li a, .nav-link').removeClass('active');
        // Add active class to clicked link
        $(this).addClass('active');
    });
});

// Handle sidebar toggle
$(document).on('click', '#menu-toggle', function(e) {
    e.preventDefault();
    const $sidebar = $('#sidebar-wrapper');
    const $toggler = $('.toggler');
    const $icon = $(this).find('i');

    // Toggle the sidebar visibility
    $sidebar.toggleClass('collapsed');

    // Save the state to localStorage
    localStorage.setItem('sidebar_collapsed', $sidebar.hasClass('collapsed'));

    // Adjust the toggler's position and icon
    if ($sidebar.hasClass('collapsed')) {
        $toggler.css('left', '10px');
        $icon.text('menu');
    } else {
        $toggler.css('left', '250px');
        $icon.text('close');
    }
});

// Handle chevron rotation based on collapse state
$(document).on('click', '.sidebar-nav > li > a[data-bs-toggle="collapse"]', function () {
    var $chevron = $(this).find('i.material-icons');
    var $target = $($(this).attr('data-bs-target'));
    
    // Remove any existing rotation classes
    $chevron.removeClass('chevron-rotate chevron-up chevron-down');
    
    // Add the base rotation class
    $chevron.addClass('chevron-rotate');
    
    // Set the direction based on the target's current state
    if ($target.hasClass('show')) {
        // Currently expanded, will collapse
        $chevron.addClass('chevron-down');
    } else {
        // Currently collapsed, will expand
        $chevron.addClass('chevron-up');
    }
});

// Ensure chevron state matches collapse state after animation
$(document).on('shown.bs.collapse', '.collapse', function () {
    var $trigger = $('a[data-bs-target="#' + this.id + '"]');
    var $chevron = $trigger.find('i.material-icons');
    $chevron.removeClass('chevron-down').addClass('chevron-up');
});

$(document).on('hidden.bs.collapse', '.collapse', function () {
    var $trigger = $('a[data-bs-target="#' + this.id + '"]');
    var $chevron = $trigger.find('i.material-icons');
    $chevron.removeClass('chevron-up').addClass('chevron-down');
});