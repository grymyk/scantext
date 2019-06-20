'use strict';

const Filters = {
    canvas: null,
    ctx: null
};

const self = Filters;

Filters.filterImageUrl = function(url, filter, args) {
    this.loadImage(url, filter, this.filterImage, args);
};

Filters.loadImage = function(url, filter, fn, args) {
    // console.log('loadImage');

    let img = new Image();

    img.onload = () => {
        // console.log(this);

        // fn.call(this, img, filter, args);
        fn.apply(this, [img, filter, args]);
    };

    img.src = url;
};

Filters.filterImage = function(image, filter, var_args) {
    var args = [self.getPixels(image)];

    for (var i = 2, len = arguments.length; i < len; i++) {
        args.push(arguments[i]);
    }

    let filtered = filter.apply(null, args);

    self.putPixels(filtered);

    return self;


    filters.forEach((filter) => {
        filter.apply(null, args);

        self.putPixels(filtered);
    });
};

Filters.putPixels = function(imageData) {
    this.ctx.putImageData(imageData, 0, 0);
};

Filters.getPixels = function(img) {
    if (this.ctx) {

    } else {
        this.canvas = this.getCanvas(img.width, img.height);
        this.ctx = this.canvas.getContext('2d');
    }

    this.ctx.drawImage(img, 0, 0);

    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
};

Filters.appendCanvas = function(canvas, root) {
    document.getElementById(root).append(canvas);
};

Filters.getCanvas = function(width, height) {
    // console.log(width, height)

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    this.appendCanvas(canvas, 'root');

    return canvas;
};

Filters.grayscale = function(pixels, args) {
    console.log('grayscale');

    let {data} = pixels;

    for (var i = 0, len = data.length; i < len; i += 4) {
        var red = data[i];
        var green = data[i+1];
        var blue = data[i+2];

        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126*red + 0.7152*green + 0.0722*blue;

        data[i] = data[i+1] = data[i+2] = v
    }

    return pixels;
};

Filters.threshold = function(pixels, threshold) {
    let width = 658;
    let {data} = pixels;

    let len = data.length;

    console.log('threshold;', threshold);
    // console.log(this);

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

Filters.vertScan = function(pixels, width) {
    let {data} = pixels;
    console.log('data: ', data);

    // let len = data.length;
    let len = width;
    console.log('len: ', len);
    console.log('width: ', width);

    for (let i = 0; i < len; i += 4) {
        //let red = data[i];
        //let green = data[i+1];
        //let blue = data[i+2];

        //let value = 100;

        //data[i] = data[i+1] = data[i+2] = value;
        //console.log(data[i]);
    }

    return pixels;
};

const grayscale = Filters.grayscale;
const threshold = Filters.threshold;
const vertScan = Filters.vertScan;

const url = '/text.jpg';
const porog = 150;
const width = 658;


Filters.filterImageUrl(url, threshold, porog, width);
// Filters.filterImageUrl(url, vertScan, width);
// Filters.filterImageUrl(url, horScan, args);


let fns = [readConfig, selectFromDb, getHttpPage, readFile];

//sequentialAsync(fns, () => { console.log('Done'); });

function sequentialAsync(fns, done) {
    // TODO: implement sequential execution
};