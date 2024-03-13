class Tools {
    constructor(canvas) {
        this.canvas = canvas
        this.drawCtx = canvas.getContext("2d")
        this.size = 50
        this.hardness = 25

        Object.defineProperty(this, 'colorHolder', {
            writable: true,
            configurable: false,
            enumerable: false
        })
        
        Object.defineProperty(this, 'color', {
            configurable: false,

            get: () => {
                return this.colorHolder;
            },
            set: (color) => {
                if(typeof color !== 'string') throw new TypeError("Bad value");
                
                if(color !== 'erase') {
                    this.drawCtx.globalCompositeOperation = "source-over";
                    this.drawCtx.fillStyle = color 
                    this.colorHolder = color;
                } else {
                    this.drawCtx.globalCompositeOperation = "destination-out";
                    this.drawCtx.fillStyle = 'black';
                    this.colorHolder = 'black';
                }
            }
        });
    }

    draw(e) {
        let {size, hardness} = this.setupTools()
        let {x, y} = this.getMousePosition(e)
        this.setHardness(hardness)

        this.drawCtx.save()

        this.drawCtx.beginPath()
        this.drawCtx.arc(x, y, size, 0, Math.PI * 2)
        this.drawCtx.closePath()
        this.drawCtx.fill()
        
        this.drawCtx.restore()
    }

    fillCanvas() {
        let {width, height} = this.canvas

        this.drawCtx.clearRect(0, 0, width, height)
        this.color = "rgba(0,0,0,0.7)"
        this.drawCtx.fillRect(0, 0, width, height)

        this.color = this.colorHolder
    }

    setupTools() {
        let { size, hardness } = this
        hardness /= 100

        hardness = size * hardness 
        size = size - hardness
        
        return { size, hardness }
    }

    setHardness(hardness) {
        this.drawCtx.shadowColor = this.color
        this.drawCtx.shadowBlur = hardness
    }

    getMousePosition(e) {
        return {
            x: e.offsetX,
            y: e.offsetY
        }
    }

    setCanvasDimensions() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const tools = new Tools(canvas);

const mapInput = document.querySelector("#map_input");
const mapContainer = document.querySelector(".map-container");

mapInput.addEventListener("input", renderMap);
window.addEventListener("resize", () => {
    tools.setCanvasDimensions();
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
            
            tools.setCanvasDimensions();
            tools.fillCanvas();
        });

        reader.readAsDataURL(file);
    };

    mapInput.value = null;
}