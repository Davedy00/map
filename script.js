// Initialize the map
const map = L.map('map').setView([3.8792, 11.5021], 12); // Cameroon coordinates
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
}).addTo(map);

// Create an empty polygon layer
const polygonLayer = L.layerGroup().addTo(map);

// Create a draw control
const drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
    },
    edit: false,
});

// Add the draw control to the map
map.addControl(drawControl);

// Listen for the draw:created event
map.on('draw:created', (e) => {
    const polygon = e.layer;
    polygonLayer.addLayer(polygon);
});

// Get the calculate area button
const calculateAreaButton = document.getElementById('calculate-area');

// Listen for the button click
calculateAreaButton.addEventListener('click', () => {
    // Get the polygon layer
    const layers = polygonLayer.getLayers();

    // Verify that a polygon exists
    if (layers.length === 0) {
        document.getElementById('area-result').innerText = 'No polygon drawn.';
        return;
    }

    // Get the first polygon drawn
    const polygon = layers[0];

    // Get the coordinates and ensure the polygon is closed
    const latlngs = polygon.getLatLngs()[0];
    const coords = latlngs.map(latlng => [latlng.lng, latlng.lat]);

    // Ensure the first and last coordinates are the same
    if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
        coords.push(coords[0]);
    }

    // Convert the polygon to a Turf.js polygon
    const turfPolygon = turf.polygon([coords]);
    
    const area = turf.area(turfPolygon);
    const areaInSquareKm = area / 1000000;
    document.getElementById('area-result').innerText = `Area: ${areaInSquareKm.toFixed(2)} square kilometers`;
});