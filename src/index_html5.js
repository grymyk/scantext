'use strict';

import Filter from 'filter.js';

const {fi} = Filter;

const getImage = (url, fn) => {
    console.log('get Image');

    console.log(this);

    let img = new Image();

    img.onload = (event) => {
        console.log('Image is Load');

        return fn(img);
    };

    img.src = url;
};

//console.log(fi);

/*function loadHandler() {
    console.log('loadHandler');

    console.log(this);
    const url = '/rainbow.jpg';

    const img = fi.getImage(url);
    console.log(img);

    /!*let canvas = fi.getCanvas(400, 500);
    console.log(canvas);*!/
}

window.addEventListener('load', loadHandler);*/
