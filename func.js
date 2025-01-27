// func.js
function displayBoats() {
    console.log('1. Starting to display boats...');
    
    try {
        // Get the boats grid element
        const boatsGrid = document.getElementById('boats-grid');
        console.log('2. Found boats-grid element:', boatsGrid ? 'Yes' : 'No');
        
        // Clear existing content
        boatsGrid.innerHTML = '';
        console.log('3. Cleared existing content');

        console.log('4. Starting to create boat cards...');
        // Display each boat
        boatsData.forEach((boat, index) => {
            console.log(`5. Creating card for boat ${index + 1}: ${boat.name}`);
            
            const boatCard = document.createElement('div');
            boatCard.className = 'boat-card';
            
            boatCard.innerHTML = `
                <img src="boatImage/${boat.image}" alt="${boat.name}" onerror="this.src='placeholder.jpg'">
                <div class="boat-card-content">
                    <h3>${boat.name}</h3>
                    <p>${boat.model}</p>
                    <div class="boat-info">
                        <div>
                            <span>Capacity</span>
                            <strong>${boat.capacity} persons</strong>
                        </div>
                        <div>
                            <span>Length</span>
                            <strong>${boat.length}m</strong>
                        </div>
                        <div>
                            <span>Price per day</span>
                            <strong>€${boat.pricePerDay}</strong>
                        </div>
                    </div>
                </div>
            `;
            
            boatsGrid.appendChild(boatCard);
            console.log(`6. Card for ${boat.name} added to grid`);
        });

        console.log('7. All boats displayed successfully');

    } catch (error) {
        console.error('ERROR DETAILS:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        document.getElementById('boats-grid').innerHTML = '<p>Error loading boats. Please try again later.</p>';
    }
}

// Log when the script starts loading
console.log('0. Script loaded, waiting for DOMContentLoaded...');

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, starting boat display...');
    displayBoats();
});