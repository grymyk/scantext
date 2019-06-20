'use strict';

import Filter from "filter";

const {fi} = Filter;

const url = '/text.jpg';
const threshold = 150;
const width = 658;

function loadHandler() {
    fi.loadImage(url)
        //.then(() => fi.showImage('root'))
        .then( () => fi.getPixels() )
        .then(( data) => fi.threshold(data, threshold) )
        // .then(console.log)
        .then( (pixels) => fi.putPixels(pixels) )
        .then( () => fi.showImage('root') )
        .then( () => fi.getPixels() )
        .then( (pixels) => fi.vertScan(pixels, width) )
        .then( () => fi.showImage('root') )
        .catch( (err) => {
            console.log('-- Error --');
            console.log(err);
        });
}

window.addEventListener('load', loadHandler);
