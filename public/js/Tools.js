export class Tools {
    constructor(canvas) {
        this.canvas = canvas
        this.context = canvas.getContext("2d")

        this.size = 50
        this.hardness = 25
        this.scale = { xScale: 1, yScale: 1 }

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

    draw(x, y) {
        let {size, hardness} = this.setupTools()
        let { xScale, yScale } = this.scale
        this.setHardness(hardness)

        this.context.save()

        this.context.beginPath()
        this.context.arc(x / xScale, y / yScale, size, 0, Math.PI * 2)
        this.context.closePath()
        this.context.fill()
        
        this.context.restore()
    }

    fillCanvas(opacity) {
        let {width, height} = this.canvas

        this.updateDimension()
        this.color = `rgba(0, 0, 0, ${opacity})`
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

    updateDimension() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    redraw(){
        const image = new Image();

        image.onload = () => {
            // catching original sizes before calling updateCanvasDimensions
            const orgWidth = this.canvas.width; 
            const orgHeight = this.canvas.height;

            this.updateDimension();
            const { width, height } = this.canvas;

            this.scale.xScale = width / orgWidth;
            this.scale.yScale = height / orgHeight;

            const { xScale, yScale } = this.scale;

            // draw what was on the canvas before updateCanvasDimension on new scale
            this.context.scale(xScale, yScale);
            this.context.drawImage(image, 0, 0);
        };

        image.src = this.canvas.toDataURL();
    }
}