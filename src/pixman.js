class Pixman {
    constructor(props) {
        this.width = props.widthCanvas;
        this.height = props.heightCanvas;
        this.ctx = props.ctx;

        this.rect = this.rect.bind(this);
        this.clearRect = this.clearRect.bind(this);
        this.drawImage = this.drawImage.bind(this);
        this.getImageData = this.getImageData.bind(this);
    }

    getCanvas(width, height) {
        let parent = document.getElementById('root');
        let canvas = document.getElementById('canvas');
        let newCanvas = document.createElement('canvas');

        newCanvas.width = width;
        newCanvas.height = height;

        parent.replaceChild(newCanvas, canvas);

        return newCanvas;
    }

    drawImage(props) {
        let {image, destX, destY, fn} = props;

        let canvas = this.getCanvas(image.width, image.height);

        this.ctx = canvas.getContext('2d');

        this.ctx.drawImage(image, destX, destY);

        return canvas;

        //fn()
    }

    putImageData(props) {
        let {image, destX, destY, fn} = props;

        this.ctx.putImageData(image, destX, destY);
    }

    getImageData(props) {
        let {left, top, width, height} = props;

        return this.ctx.getImageData(left, top, width, height);
    }

    createImageData(props) {
        let {width, height} = props;

        return this.ctx.createImageData(width, height);
    }

    putImageData(props) {
        let {imageData, width, height} = props;

        this.ctx.putImageData(imageData, width, height);
    }

    rect(props) {
        let {x, y, width, height, style} = props;

        this.ctx.fillStyle = style;

        this.ctx.save();
        this.ctx.fillRect(x, y, width, height);
        this.ctx.restore();
    }

    lineRect(props, x, width) {
        props.x = x;
        props.width = width;
        props.style = 'rgba(0, 0, 125, 0.5)';

        this.rect(props);
    }

    letterRect(props) {
        props.style = 'rgba(0, 125, 0, 0.1)';

        this.rect(props);
    }

    clearRect(props) {
        console.log('clearRect');
        console.log(this.ctx.clear);

        let {x, y, width, height} = props;

        this.ctx.clearRect(x, y, width, height);
    }

    clearAll() {
        this.ctx.clear(0, 0, this.width, this.height);
    }

    saveRestoreState(fn) {
        return (...args) => {
            this.ctx.save();

            fn(...args);

            this.ctx.restore();
        }
    }

    rectSavedState(...args) {
        this.saveRestoreState(this.rect)(...args);
    }

    translateOrigin(x, y) {
        //y = this.height - y;
        //this.ctx.translate(x, -y);
        this.ctx.transform(0, 0, 0, 0, x, y)
    }

    rotateAt(x, y, angle) {
        this.translateOrigin(-x / 50, y / 70);

        this.ctx.rotate(-angle);
    }

    rotateOrigin(angle) {
        //this.ctx.save();
        console.log('rotateOrigin');

        this.ctx.rotate(angle);
        //this.ctx.restore()
    }

    rotateOriginT(angle) {
        console.log('rotateOrigin Transform');

        let sin = Math.sin(-angle);
        let cos = Math.cos(angle);

        this.ctx.transform(cos, sin, -sin, cos, 0, 0);
    }
}

export {Pixman}
