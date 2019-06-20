class Transform {
    constructor(props) {
        this.width = props.widthCanvas;
        this.height = props.heightCanvas;
        this.ctx = props.ctx;

        this.rect = this.rect.bind(this);

        this.cartCoord(this.ctx, this.height)
    }

    cartCoord(context, height) {
        context.translate(0, height);
        context.scale(1,-1);
    }

    rect(x, y, width, height, style) {
        this.ctx.fillStyle = style;

        this.ctx.fillRect(x, y, width, height);
    }

    clear() {
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
        this.translateOrigin(-x/50 , y/70);

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

export {Transform}

