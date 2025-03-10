// Smooth scrolling script with immediate section positioning
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're coming from another page with a hash
    const scrollTarget = sessionStorage.getItem('scrollTarget');
    
    if (scrollTarget) {
        // Keep body hidden until properly positioned
        document.body.style.opacity = '0';
        
        // Find the target element
        const element = document.getElementById(scrollTarget);
        if (element) {
            // IMMEDIATELY scroll to element before any rendering
            element.scrollIntoView();
            
            // Delay just enough to ensure the browser has positioned correctly
            setTimeout(function() {
                document.body.style.opacity = '1';
                document.body.style.transition = 'opacity 0.3s ease';
            }, 50);
        } else {
            // If element not found, still show the page
            document.body.style.opacity = '1';
        }
        
        // Clear the stored target
        sessionStorage.removeItem('scrollTarget');
    }
    
    // Intercept clicks on links that point to sections on other pages
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only process links that go to another page with a hash
            const href = this.getAttribute('href');
            if (href.includes('#') && !href.startsWith('#')) {
                e.preventDefault();
                
                const targetPage = href.split('#')[0];
                const targetSection = href.split('#')[1];
                
                // Store target section in sessionStorage
                sessionStorage.setItem('scrollTarget', targetSection);
                
                // Brief fade out, then navigate
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.2s ease';
                
                // Navigate to the page immediately after the fade starts
                setTimeout(function() {
                    window.location.href = targetPage;
                }, 150);
            }
        });
    });
});