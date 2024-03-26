import { Tools } from "./Tools.js";

const socket = io();

const canvas = document.createElement("canvas");
const tools = new Tools(canvas);

const mapInput = document.querySelector("#map_input");
const mapContainer = document.querySelector(".map-container");

mapInput.addEventListener("input", renderMap);
window.addEventListener("resize", () => {
    tools.redraw();
});

const toolButtons = document.querySelectorAll(".tool-btn");
const toolUnits = document.querySelectorAll(".tool-unit");
const toolConfigSlider = document.querySelectorAll(".tool.slider");
const sliderDisplay = document.querySelectorAll(".slider-value");

let selectedTool = document.querySelector(".selected").id;

const acceptedActions = {
    removeMap: function() {
        mapContainer.innerHTML = "";
        mapContainer.style.background = 'white';
    },
    fillScreen: function() {
        tools.fillCanvas(0.65);
    },
    erase: function(e) {
        let {x, y} = tools.getMousePosition(e);
        let {width, height} = canvas;
        let state = {
            w: width,
            h: height,
            size: tools.size,
            hard: tools.hardness
        };

        socket.emit("drawing", x, y, state);

        tools.color = "erase";
        tools.draw(x, y);
    }
};

toolButtons.forEach(button => {
    button.addEventListener("click", e => {
        let action = acceptedActions[button.id];
        action();
    });
});
toolUnits.forEach(unit => {
    unit.addEventListener("click", () => {
        document.querySelector(".selected").classList.remove("selected");
        unit.classList.add("selected");

        selectedTool = unit.id;
    });
});

const valueTreatments = {
    size: (value) => {
        value = +value;
        return value .toString() + 'px';
    },
    hardness: (value) => {
        value = +value * 2;
        return value.toString() + '%';
    }
};

toolConfigSlider.forEach(slider => {
    slider.addEventListener('input', e => {
        tools[slider.id] = slider.value / 2;

        const display = document.querySelector(`.${slider.id}`);
        const value = valueTreatments[slider.id](slider.value);

        display.innerHTML = value;
    });
});

// Drawing events
let isDrawing = false;
canvas.addEventListener("mousedown", ()=> { isDrawing = true });
canvas.addEventListener("mousemove", e => { 
    if(isDrawing) { 
        let action = acceptedActions[selectedTool];
        action(e);
    };
});
canvas.addEventListener("mouseup", () => { isDrawing = false });
canvas.addEventListener("mouseout", () => { isDrawing = false });

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
            
            tools.updateDimension();
            tools.fillCanvas(0.65);
            mapContainer.style.background = 'black';
        });

        reader.readAsDataURL(file);
    };

    mapInput.value = null;
};