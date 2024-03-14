export class Tools {
    constructor(canvas) {
        this.canvas = canvas
        this.context = canvas.getContext("2d")
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
                    this.context.globalCompositeOperation = "source-over";
                    this.context.fillStyle = color 
                    this.colorHolder = color;
                } else {
                    this.context.globalCompositeOperation = "destination-out";
                    this.context.fillStyle = 'black';
                    this.colorHolder = 'black';
                }
            }
        });
    }

    draw(e) {
        let {size, hardness} = this.setupTools()
        let {x, y} = this.getMousePosition(e)
        this.setHardness(hardness)

        this.context.save()

        this.context.beginPath()
        this.context.arc(x, y, size, 0, Math.PI * 2)
        this.context.closePath()
        this.context.fill()
        
        this.context.restore()

        console.log('helo')
    }

    fillCanvas() {
        this.setCanvasDimensions()

        let {width, height} = this.canvas

        this.context.clearRect(0, 0, width, height)
        this.color = "rgba(0, 0, 0, 0.5)"
        this.context.fillRect(0, 0, width, height)

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
        this.context.shadowColor = this.color
        this.context.shadowBlur = hardness
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