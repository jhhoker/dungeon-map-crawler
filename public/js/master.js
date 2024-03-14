import { Tools } from "./Tools.js";

const canvas = document.createElement("canvas");

const tools = new Tools(canvas);

const mapInput = document.querySelector("#map_input");
const mapContainer = document.querySelector(".map-container");

mapInput.addEventListener("input", renderMap);
window.addEventListener("resize", () => {
    tools.fillCanvas()
});

const toolButtons = document.querySelectorAll(".tool-btn");
const toolUnits = document.querySelectorAll(".tool-unit");
const toolConfigSlider = document.querySelectorAll(".tool.slider");
const sliderDisplay = document.querySelectorAll(".slider-value")

let selectedTool = document.querySelector(".selected").id;

const acceptedActions = {
    removeMap: function() {
        mapContainer.innerHTML = "";
    },
    fillScreen: function() {
        tools.fillCanvas();
    },
    erase: function(e) {
        tools.color = "erase";
        tools.draw(e);
    }
};

toolButtons.forEach(button => {
    button.addEventListener("click", e => {
        let action = acceptedActions[button.id];
        action();
    })
})
toolUnits.forEach(unit => {
    unit.addEventListener("click", () => {
        document.querySelector(".selected").classList.remove("selected")
        unit.classList.add("selected")

        selectedTool = unit.id
    })
})

const valueTreatments = {
    size: (value) => {
        value = +value / 2;
        return value .toString() + 'px';
    },
    hardness: (value) => {
        value = +value * 2;
        return value.toString() + '%';
    }
}

toolConfigSlider.forEach(slider => {
    slider.addEventListener('input', e => {
        tools[slider.id] = slider.value;

        const display = document.querySelector(`.${slider.id}`);
        const value = valueTreatments[slider.id](slider.value);
        console.log(value)

        display.innerHTML = value
    })
})

// Drawing events
let isDrawing = false;
canvas.addEventListener("mousedown", ()=> { isDrawing = true })
canvas.addEventListener("mousemove", e => { 
    if(isDrawing) { 
        let action = acceptedActions[selectedTool];
        action(e);
    } 
});
canvas.addEventListener("mouseup", () => { isDrawing = false })
canvas.addEventListener("mouseout", () => { isDrawing = false })

function renderMap(e) {
    const inputTarget = e.target;
    const file = inputTarget.files[0];
    
    if(file) {
        const reader = new FileReader();
        
        reader.addEventListener("load", e => {
            const readerTarget = e.target;
            
            const img = document.createElement("img");
            img.src = readerTarget.result;
            img.draggable = false;
            img.classList.add('map-image');
            
            mapContainer.innerHTML = "";
            mapContainer.appendChild(img); 
            mapContainer.appendChild(canvas);
            
            tools.fillCanvas();
        });

        reader.readAsDataURL(file);
    };

    mapInput.value = null;
}