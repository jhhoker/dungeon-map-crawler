const mapInput = document.querySelector("#map_input");
const mapContainer = document.querySelector(".map-container");

mapInput.addEventListener("change", renderMap);

function renderMap(e) {
    const inputTarget = e.target;
    const file = inputTarget.files[0];

    if(file) {
        const reader = new FileReader();

        reader.addEventListener("load", e => {
            mapContainer.innerHTML = "";
            mapContainer.appendChild( createMap(e) ); 
        });

        reader.readAsDataURL(file);
    }; 
}

function createMap(e) {
    const readerTarget = e.target;
            
    const img = document.createElement("img");
    img.src = readerTarget.result;
    img.draggable = false;
    img.classList.add('map-image');

    return img;  
}