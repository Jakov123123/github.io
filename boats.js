$(function() {
    // Initialize date range picker
    $('#date-range-filter').daterangepicker({
        opens: 'left',
        autoApply: true,
        minDate: moment(),
        locale: {
            format: 'DD/MM/YYYY'
        }
    });

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const peopleParam = urlParams.get('people');
    const citiesParam = urlParams.get('cities'); // Changed from cityParam to citiesParam
    const dateRangeParam = urlParams.get('date-range');

    // Set filter values based on URL parameters
    if (peopleParam) {
        $('#people-filter').val(peopleParam);
    }
    
    // Always create the multiselect UI regardless of URL parameters
    createMultiSelectCity();
    
    // Then handle multiple cities from URL parameter if present
    if (citiesParam) {
        const selectedCities = citiesParam.split(',');
        
        // If "All" is among the selected cities, just select All
        if (selectedCities.includes('All')) {
            $('#city-all').prop('checked', true);
            $('.city-checkbox').not('#city-all').prop('checked', false);
        } else {
            // Check the appropriate city checkboxes
            $('#city-all').prop('checked', false);
            selectedCities.forEach(city => {
                $(`.city-checkbox[value="${city}"]`).prop('checked', true);
            });
        }
        
        // Update the placeholder text
        updateCityPlaceholder();
    }
    
    if (dateRangeParam) {
        $('#date-range-filter').val(dateRangeParam);
    }

    // Initially render boats with any URL filters applied
    renderBoats();

    // Event listeners for filters
    $('#people-filter, #date-range-filter').on('change', function() {
        renderBoats();
    });
    
    // For the multiselect city filter, we need a different event listener
    $(document).on('change', '.city-checkbox', function() {
        renderBoats();
        updateURLWithFilters();
    });

    // Function to create a multi-select dropdown for cities
    function createMultiSelectCity(selectedCities = []) {
        // Get the filter group container
        const locationFilterGroup = $('#location-filter').closest('.filter-group');
        
        // Remove the original select element
        $('#location-filter').remove();
        
        // Create a new custom dropdown HTML
        const dropdownHTML = `
            <div class="custom-city-dropdown">
                <div class="dropdown-toggle">
                    <span class="placeholder">Select Cities</span>
                </div>
                <div class="dropdown-menu">
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-all" name="city" value="All" class="city-checkbox">
                        <label for="city-all">All</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-dubrovnik" name="city" value="Dubrovnik" class="city-checkbox">
                        <label for="city-dubrovnik">Dubrovnik</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-split" name="city" value="Split" class="city-checkbox">
                        <label for="city-split">Split</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-zadar" name="city" value="Zadar" class="city-checkbox">
                        <label for="city-zadar">Zadar</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-sibenik" name="city" value="Šibenik" class="city-checkbox">
                        <label for="city-sibenik">Šibenik</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-pula" name="city" value="Pula" class="city-checkbox">
                        <label for="city-pula">Pula</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-rijeka" name="city" value="Rijeka" class="city-checkbox">
                        <label for="city-rijeka">Rijeka</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-trogir" name="city" value="Trogir" class="city-checkbox">
                        <label for="city-trogir">Trogir</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="city-primosten" name="city" value="Primošten" class="city-checkbox">
                        <label for="city-primosten">Primošten</label>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles to ensure the dropdown is active and visible
        $('<style>')
            .prop('type', 'text/css')
            .html(`
                .filter-group .custom-city-dropdown .dropdown-toggle,
                .filter-group .custom-city-dropdown .placeholder {
                    opacity: 1 !important;
                    color: #333 !important;
                    background-color: #fff !important;
                    pointer-events: auto !important;
                }
            `)
            .appendTo('head');
        
        // Insert after the label
        locationFilterGroup.find('label').after(dropdownHTML);
        
        // Check the appropriate checkboxes based on selected cities
        if (selectedCities.length > 0) {
            selectedCities.forEach(city => {
                $(`.city-checkbox[value="${city}"]`).prop('checked', true);
            });
        } else {
            // By default, check "All"
            $('#city-all').prop('checked', true);
        }
        
        // Update the dropdown placeholder text with selected cities
        updateCityPlaceholder();
        
        // Add event listeners for the custom dropdown
        
        // Toggle dropdown on click
        $('.dropdown-toggle').on('click', function() {
            $('.custom-city-dropdown').toggleClass('open');
        });
        
        // Close dropdown when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.custom-city-dropdown').length) {
                $('.custom-city-dropdown').removeClass('open');
            }
        });
        
        // Prevent dropdown from closing when clicking on checkboxes
        $('.dropdown-menu').on('click', function(e) {
            e.stopPropagation();
        });
        
        // City checkbox functionality - similar to func.js
        $('#city-all').on('change', function() {
            if($(this).is(':checked')) {
                // If "All" is checked, uncheck all other city checkboxes
                $('.city-checkbox').not(this).prop('checked', false);
            }
            updateCityPlaceholder();
            renderBoats();
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
    }
    
    // Update placeholder text based on selected cities
    function updateCityPlaceholder() {
        let selectedCities = [];
        $('.city-checkbox:checked').each(function() {
            if ($(this).val() !== 'All') {
                selectedCities.push($(this).val());
            }
        });
        
        // Get the original placeholder from HTML
        const originalPlaceholder = "Select Cities";
        
        if ($('#city-all').is(':checked') || selectedCities.length === 0) {
            // If "All" is checked or nothing selected, show "All Cities"
            $('.dropdown-toggle .placeholder').text("All Cities");
        } else {
            // Show the selected marina names with commas between them
            let displayText = selectedCities.join(', ');
            
            // If the text gets too long, truncate it and add ellipsis
            if (displayText.length > 30) {
                displayText = selectedCities.slice(0, 2).join(', ') + '...';
            }
            
            // Update the placeholder with the selected cities
            $('.dropdown-toggle .placeholder').text(displayText);
        }
    }

    // Function to render boat cards based on filters
    function renderBoats() {
        const peopleFilter = $('#people-filter').val();
        
        // Process people filter range
        let minPeople = 0;
        let maxPeople = Infinity;
        
        if (peopleFilter !== 'all') {
            const parts = peopleFilter.split('-');
            minPeople = parseInt(parts[0]);
            maxPeople = parts.length > 1 ? parseInt(parts[1]) : Infinity;
        }
        
        // Get selected cities
        let selectedCities = [];
        $('.city-checkbox:checked').each(function() {
            selectedCities.push($(this).val());
        });
        
        // Default to "All" if none selected
        if (selectedCities.length === 0) {
            selectedCities = ['All'];
        }

        // Filter boats
        const filteredBoats = boatsData.filter(boat => {
            // Filter by capacity
            const capacityMatch = boat.capacity >= minPeople && boat.capacity <= maxPeople;
            
            // Filter by location - match if "All" is selected or the boat's location is in the selectedCities array
            const locationMatch = selectedCities.includes('All') || selectedCities.includes(boat.location);
            
            return capacityMatch && locationMatch;
        });

        // Render boats
        const boatsList = $('#boats-list');
        boatsList.empty();

        if (filteredBoats.length === 0) {
            // Display empty state
            boatsList.html(`
                <div class="empty-state">
                    <h2>No boats match your criteria</h2>
                    <p>Try adjusting your filters or browse all available boats.</p>
                    <a href="boats.html" class="reset-filters">Reset Filters</a>
                </div>
            `);
        } else {
            // Render each boat card
            filteredBoats.forEach(boat => {
                const hasCaptain = boat.captain === 'y';
                const captainBadge = hasCaptain ? '<span class="captain-badge">With Captain</span>' : '';
                
                const boatCard = `
                    <div class="boat-card">
                        <img src="boatImage/${boat.image}" alt="${boat.name}" class="boat-image">
                        <div class="boat-details">
                            <div class="boat-name">${boat.name} ${captainBadge}</div>
                            <div class="boat-model">${boat.model}</div>
                            <div class="boat-specs">
                                <div class="boat-spec">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    ${boat.capacity} people
                                </div>
                                <div class="boat-spec">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    ${boat.location}
                                </div>
                                <div class="boat-spec">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2z"/>
                                    </svg>
                                    ${boat.year}
                                </div>
                                <div class="boat-spec">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
                                    </svg>
                                    ${boat.length}m
                                </div>
                            </div>
                            <div class="boat-price">€${boat.pricePerDay} per day</div>
                            <a href="#" class="boat-button">Book Now</a>
                        </div>
                    </div>
                `;
                
                boatsList.append(boatCard);
            });
        }
    }

    // Update URL with current filters
    function updateURLWithFilters() {
        const peopleFilter = $('#people-filter').val();
        const dateRangeFilter = $('#date-range-filter').val();
        
        // Get selected cities
        const selectedCities = [];
        $('.city-checkbox:checked').each(function() {
            selectedCities.push($(this).val());
        });
        
        const url = new URL(window.location);
        
        if (peopleFilter !== 'all') {
            url.searchParams.set('people', peopleFilter);
        } else {
            url.searchParams.delete('people');
        }
        
        // Handle multiple cities in URL
        if (selectedCities.length > 0 && !selectedCities.includes('All')) {
            url.searchParams.set('cities', selectedCities.join(','));
        } else {
            url.searchParams.delete('cities');
        }
        
        if (dateRangeFilter) {
            url.searchParams.set('date-range', dateRangeFilter);
        } else {
            url.searchParams.delete('date-range');
        }
        
        window.history.replaceState({}, '', url);
    }
    
    // This is now handled at the beginning of the script
    
    // Update URL when filters change
    $('#people-filter, #date-range-filter').on('change', function() {
        updateURLWithFilters();
    });
});