'use strict';

const Filter = {
    ctx: null,
    isDrawn: false,
    canvas: {
        width: null,
        height: null
    }
};

Filter.showImage = function(parent) {
    document.getElementById(parent).append(this.canvas);
};

Filter.loadImage = function(url) {
    return new Promise( (resolve, reject) => {
        let img = new Image();

        img.onload = () => {
            let canvas = this.getCanvas(img.width, img.height);

            this.ctx = canvas.getContext('2d');

            this.drawImage(img);

            resolve(img);
        };

        img.src = url;
    });
};

Filter.getCanvas = function(width, height) {
    this.canvas = document.createElement('canvas');

    this.canvas.width = width;
    this.canvas.height = height;

    return this.canvas;
};

Filter.drawImage = function(img) {
    if (this.ctx) {
        this.ctx.drawImage(img, 0, 0);
    } else {
        console.log('No Context')
    }
};

Filter.getPixels = function() {
    //console.log(this.canvas.width);
    //console.log(this.canvas.height);

    let canvas = this.canvas;

    if (this.ctx) {
        return this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
        console.log('No Context')
    }

    console.log('Canvas Not Support');
};

Filter.filterImage = function(filter, image, var_args) {
    let args = [this.getPixels(image)];

    for (let i = 2, len = arguments.length; i < len; i++) {
        args.push(arguments[i]);
    }

    return filter.apply(null, args);
};

Filter.putPixels = function(imageData) {
    this.ctx.putImageData(imageData, 0, 0);
};

Filter.vertScan = function(pixels, width) {
    console.log('vertScan');

    // console.log('pixels: ', pixels);
    let {data} = pixels;
    // console.log('data: ', data);

    let len = data.length;
    // let len = width;
    console.log('len: ', len);
    console.log('width: ', width);

    for (let i = 0; i < len; i += 4) {
        //let red = data[i];
        //let green = data[i+1];
        //let blue = data[i+2];

        //let value = 100;

        //data[i] = data[i+1] = data[i+2] = value;

        if (data[i] !== 255) {
            console.log(i);
            console.log(data[i]);
            return
        }
    }

    return pixels;
};

Filter.horScan = function(pixels, height) {
    console.log('horScan');
};


Filter.threshold = function(pixels, threshold) {
    let {data} = pixels;

    let len = data.length;

    for (let i = 0; i < len; i += 4) {
        let red = data[i];
        let green = data[i+1];
        let blue = data[i+2];

        let value = (0.2126 * red + 0.7152 * green + 0.0722 * blue >= threshold) ? 255 : 0;

        data[i] = data[i+1] = data[i+2] = value;

        // console.log(data[i])
    }

    return pixels;
};

Filter.grayscale = function(pixels, args) {
    let {data} = pixels;
  
    for (let i = 0, len = data.length; i < len; i += 4) {
        let red = data[i];
        let green = data[i+1];
        let blue = data[i+2];

        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        let value = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

        data[i] = data[i+1] = data[i+2] = value;
    }

    return pixels;
};



export default {fi: Filter}
