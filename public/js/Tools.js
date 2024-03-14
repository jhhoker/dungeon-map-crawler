export class Tools {
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
        this.setCanvasDimensions()

        let {width, height} = this.canvas

        this.drawCtx.clearRect(0, 0, width, height)
        this.color = "rgba(0, 0, 0, 0.5)"
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