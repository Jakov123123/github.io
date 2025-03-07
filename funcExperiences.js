$(function() {
    // Initialize date range picker
    $('#date-range').daterangepicker({
        opens: 'left',
        drops: 'up',
        autoApply: true,
        minDate: moment(),
        autoUpdateInput: false, // This prevents the input from being updated automatically
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Clear'
        }
    });
    $('#date-range').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        $(this).addClass('active');
    });
    
    // When the date is cleared, restore the placeholder
    $('#date-range').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
        $(this).removeClass('active');
    });
    
    // Custom dropdown functionality
    $('.dropdown-toggle').on('click', function() {
        $('.custom-dropdown').toggleClass('open');
    });

    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.custom-dropdown').length) {
            $('.custom-dropdown').removeClass('open');
        }
    });

    // Prevent dropdown from closing when clicking on checkboxes
    $('.dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });

    // Update placeholder text based on selected cities
    function updateCityPlaceholder() {
        let selectedCities = [];
        $('.city-checkbox:checked').each(function() {
            if ($(this).val() !== 'All') {
                selectedCities.push($(this).val());
            }
        });
        
        // Get the original placeholder from HTML
        const originalPlaceholder = "Which marinas are you heading to?";
        
        if (selectedCities.length === 0) {
            // If nothing selected, use the original placeholder
            $('.dropdown-toggle .placeholder').text(originalPlaceholder);
        } else {
            // Show the selected marina names with commas between them
            let displayText = selectedCities.join(', ');
            
            // If the text gets too long, truncate it and add ellipsis
            if (displayText.length > 60) {
                displayText = selectedCities.slice(0, 2).join(', ') + '...';
            }
            
            // Update the placeholder with the selected cities
            $('.dropdown-toggle .placeholder').text(displayText);
        }
    }

    // City checkbox functionality
    $('#city-all').on('change', function() {
        if($(this).is(':checked')) {
            // If "All" is checked, uncheck all other city checkboxes
            $('.city-checkbox').not(this).prop('checked', false);
        }
        updateCityPlaceholder();
    });

    // If any specific city is checked, uncheck "All"
    $('.city-checkbox').not('#city-all').on('change', function() {
        if($(this).is(':checked')) {
            $('#city-all').prop('checked', false);
        }
        
        // If no city is selected, check "All" by default
        if($('.city-checkbox:checked').length === 0) {
            $('#city-all').prop('checked', true);
        }
        
        updateCityPlaceholder();
    });
    
    // Set sail button click handler
    $('.set-sail-btn').on('click', function() {
        const peopleVal = $('#people').val();
        const dateRangeVal = $('#date-range').val();
        
        // Get selected cities
        const selectedCities = [];
        $('.city-checkbox:checked').each(function() {
            selectedCities.push($(this).val());
        });
        
        // Build URL with parameters
        let url = 'boats.html?';
        const params = [];
        
        if (peopleVal) {
            params.push(`people=${encodeURIComponent(peopleVal)}`);
        }
        
        if (selectedCities.length > 0) {
            params.push(`cities=${encodeURIComponent(selectedCities.join(','))}`);
        }
        
        if (dateRangeVal) {
            params.push(`date-range=${encodeURIComponent(dateRangeVal)}`);
        }
        
        url += params.join('&');
        
        // Navigate to the boats page
        window.location.href = url;
    });
    
    // Check "All" by default
    $('#city-all').prop('checked', true);
    updateCityPlaceholder();
    
    // Smooth scroll for navigation links - simplified for performance
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        const target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 300); // Fast animation
        }
    });
    
    // Scroll indicator click handler - simplified
    $('.scroll-indicator').on('click', function() {
        const currentSection = $(this).closest('section');
        const nextSection = currentSection.next('section');
        
        if (nextSection.length) {
            $('html, body').animate({
                scrollTop: nextSection.offset().top
            }, 300); // Fast animation
        }
    });
    
    // Add IDs to sections for navigation
    $('.about-us-section').attr('id', 'about-us-section');
    $('.contact-section').attr('id', 'contact-section');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle animation of visible elements
    function handleScrollAnimations() {
        $('.fade-in-up, .fade-in-left, .fade-in-right').each(function() {
            if (isInViewport(this)) {
                $(this).addClass('visible');
            }
        });
    }
    
    // Make section containers visible when they come into view
    function handleSectionVisibility() {
        $('.section-container').each(function() {
            if (isInViewport(this)) {
                $(this).addClass('visible');
            }
        });
    }
    
    // Initialize scroll animations
    handleScrollAnimations();
    handleSectionVisibility();
    
    // Let browser handle native scrolling, just apply animations after scroll
    $(window).on('scroll', function() {
        handleScrollAnimations();
        handleSectionVisibility();
    });
    
    // Adjust scroll position when clicking footer links
    $('.footer-link').on('click', function(e) {
        if (this.hash) {
            const $target = $(this.hash);
            if ($target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: $target.offset().top
                }, 300);
            }
        }
    });
    
    // Optional: Handle footer visibility based on scroll position
    $(window).on('scroll', function() {
        const scrollHeight = $(document).height();
        const scrollPosition = $(window).height() + $(window).scrollTop();
        
        // If we're at the very bottom of the page content
        if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
            // Uncomment to hide footer at bottom if desired:
            // $('.site-footer').addClass('at-bottom');
        } else {
            // $('.site-footer').removeClass('at-bottom');
        }
    });
    
    // Ensure the page is properly sized on load and resize
    $(window).on('load resize', function() {
        // Recalculate section heights if needed
        handleScrollAnimations();
        handleSectionVisibility();
    });
});

$(function() {
    // Initialize dot navigation
    $('.dot').on('click', function() {
        const targetSection = $(this).data('section');
        const $target = $('.' + targetSection);
        
        if ($target.length) {
            // Set active state on the clicked dot
            $('.dot').removeClass('active');
            $(this).addClass('active');
            
            // Smooth scroll to the target section
            $('html, body').animate({
                scrollTop: $target.offset().top
            }, 800, 'swing');
        }
    });
    
    // Update active dot based on scroll position
    function updateActiveDot() {
        const scrollPosition = $(window).scrollTop() + ($(window).height() / 2);
        
        $('section').each(function() {
            const sectionTop = $(this).offset().top;
            const sectionBottom = sectionTop + $(this).outerHeight();
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionClass = $(this).attr('class').split(' ')[0];
                $('.dot').removeClass('active');
                $('.dot[data-section="' + sectionClass + '"]').addClass('active');
            }
        });
    }
    
    // Call on scroll and page load
    $(window).on('scroll', updateActiveDot);
    $(window).on('load', updateActiveDot);
    
    // Fix for transitions.css - Uncomment the CSS in transitions.css
    // This enables the animations that were commented out
    function enableTransitions() {
        const styleSheet = document.styleSheets;
        for (let i = 0; i < styleSheet.length; i++) {
            if (styleSheet[i].href && styleSheet[i].href.includes('transitions.css')) {
                // The transitions.css file is loaded but commented out
                // We'll handle the animations with our JavaScript instead
            }
        }
    }
    enableTransitions();
    
    // Enhanced smooth scrolling for all section navigation
    function smoothScrollTo(target) {
        $('html, body').animate({
            scrollTop: target.offset().top
        }, 800, 'swing');
    }
    
    // Override the existing scroll handlers to use our enhanced smooth scrolling
    $('.scroll-indicator').off('click').on('click', function() {
        const currentSection = $(this).closest('section');
        const nextSection = currentSection.next('section');
        
        if (nextSection.length) {
            smoothScrollTo(nextSection);
        }
    });
    
    // Improve the footer link navigation as well
    $('.footer-link').off('click').on('click', function(e) {
        if (this.hash) {
            const $target = $(this.hash);
            if ($target.length) {
                e.preventDefault();
                smoothScrollTo($target);
            }
        }
    });
    
    // New custom wheel event handler for consistent scrolling
    let isScrolling = false;
    
    // Handle keyboard arrow keys
    $(document).on('keydown', function(e) {
        if (!isScrolling && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            
            const scrollPosition = $(window).scrollTop();
            let targetSection;
            
            if (e.key === 'ArrowDown') {
                // Scrolling down with down arrow
                targetSection = $('section').filter(function() {
                    return $(this).offset().top > scrollPosition + 10;
                }).first();
            } else if (e.key === 'ArrowUp') {
                // Scrolling up with up arrow
                targetSection = $($('section').get().reverse()).filter(function() {
                    return $(this).offset().top < scrollPosition - 10;
                }).first();
            }
            
            if (targetSection.length) {
                isScrolling = true;
                smoothScrollTo(targetSection);
                
                // Update active dot
                setTimeout(function() {
                    const sectionClass = targetSection.attr('class').split(' ')[0];
                    $('.dot').removeClass('active');
                    $('.dot[data-section="' + sectionClass + '"]').addClass('active');
                }, 100);
                
                // Reset the scrolling flag after animation completes
                setTimeout(function() {
                    isScrolling = false;
                }, 800); // Same as the animation duration
            }
        }
    });
    
    $(window).on('wheel', function(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        isScrolling = true;
        
        const delta = e.originalEvent.deltaY;
        const scrollPosition = $(window).scrollTop();
        let targetSection;
        
        if (delta > 0) {
            // Scrolling down
            targetSection = $('section').filter(function() {
                return $(this).offset().top > scrollPosition + 10;
            }).first();
        } else {
            // Scrolling up
            targetSection = $($('section').get().reverse()).filter(function() {
                return $(this).offset().top < scrollPosition - 10;
            }).first();
        }
        
        if (targetSection.length) {
            smoothScrollTo(targetSection);
            
            // Update active dot
            setTimeout(function() {
                const sectionClass = targetSection.attr('class').split(' ')[0];
                $('.dot').removeClass('active');
                $('.dot[data-section="' + sectionClass + '"]').addClass('active');
            }, 100);
        }
        
        // Reset the scrolling flag after animation completes
        setTimeout(function() {
            isScrolling = false;
        }, 800); // Same as the animation duration
    });
});