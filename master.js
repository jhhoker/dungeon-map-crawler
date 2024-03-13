class Tools {
    constructor(canvas) {
        this.canvas = canvas
        this.drawCtx = canvas.getContext("2d");
        
        Object.defineProperty(this, 'size', {
            configurable: false,
            value: 10,     
        });

        Object.defineProperty(this, 'hardness', {
            configurable: false,
            value: 20,
        });

        Object.defineProperty(this, 'colorHolder', {
            writable: true,
            value: "erase",
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
                } else {
                    this.drawCtx.globalCompositeOperation = "destination-out";
                    this.drawCtx.fillStyle = 'rgba(0, 0, 0)';
                }

                this.colorHolder = color;
            }
        });
    }

    draw(e) {
        let {x, y} = this.getMousePosition(e)

        this.drawCtx.save()

        this.drawCtx.beginPath()
        this.drawCtx.arc(x, y, this.size, 0, Math.PI * 2)
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

    getMousePosition(e) {
        return {
            x: e.offsetX,
            y: e.offsetY
        }
    }
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const tools = new Tools(canvas);

const mapInput = document.querySelector("#map_input");
const mapContainer = document.querySelector(".map-container");

mapInput.addEventListener("input", renderMap);
window.addEventListener("resize", setCanvasDimensions);

const toolButtons = document.querySelectorAll(".tool-btn");
const acceptedActions = {
    removeMap: function() {
        mapContainer.innerHTML = "";
    },
    fillScreen: function() {
        tools.fillCanvas()
    }
};

toolButtons.forEach(button => {
    button.addEventListener("click", e => {
        let action = acceptedActions[button.id];
        action();
    })
})

// Drawing events
let isDrawing = false;
canvas.addEventListener("mousedown", ()=> { isDrawing = true })
canvas.addEventListener("mousemove", e => { 
    if(isDrawing) { 
        tools.draw(e);
    } 
});
canvas.addEventListener("mouseup", () => { isDrawing = false })
canvas.addEventListener("mouseout", () => { isDrawing = false })


function setCanvasDimensions() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    tools.fillCanvas()
}

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
            
            setCanvasDimensions();
        });

        reader.readAsDataURL(file);
    };

    this.value = null;
}