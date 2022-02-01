// const stores = require("../../models/stores");

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: store.geometry.coordinates,
    zoom: 12 // starting zoom 
});

new mapboxgl.Marker()
    .setLngLat(store.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${store.title}</h4><p>${store.location}</p>`
            )
    )
    .addTo(map);
