

const businessAddress = document.querySelector('#businessAddress').textContent;

console.log(businessAddress);

axios.get(`https://nominatim.openstreetmap.org/search?q=${businessAddress}&format=json`)
    .then(function(responseObj) {
        const lat = responseObj.data[0].lat;
        const lon = responseObj.data[0].lon;
        try{
            var map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGFzc2FuLXNhYmVoIiwiYSI6ImNreGppZHB3ZDB4MzkycXViY3p4ZzR0ZGcifQ.8mUUjW7z1vPqbLTnNPWIpQ', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);
        var marker = L.marker([lat, lon]).addTo(map);
        }catch (error){
            console.log('####error ====>', error);
        }
    })
    .catch(error => console.log(error))