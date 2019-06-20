'use strict';

import './index.scss';

import {Pixman} from './pixman.js';

let pm = null;

const words = [
    {
        x: 0,
        y: 0,
        width: 100,
        height: 16,
        style: '#cfc'
    }, {
        x: 110,
        y: 0,
        width: 45,
        height: 16,
        style: '#ccf'
    }
];

const words1 = [
    {
        x: 0,
        y: 0,
        width: 100,
        height: 16,
        style: '#cfc'
    }, {
        x: 110,
        y: 0,
        width: 45,
        height: 16,
        style: '#ccf'
    }
];

const drawRectangles = (rect, index) => {
    console.log(rect, index);
};

const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return () => Math.floor(Math.random() * (max - min + 1)) + min;
};

const getPixels = () => {
    let props = {
        left: 0,
        top: 0,
        width: 2,
        height: 1
    };

    let {data} = pm.getImageData(props);
};

const bitmap = (image) => {
    Promise.all([
        // Cut out two sprites from the sprite sheet
        createImageBitmap(image, 0, 0, 1, 1),
        // createImageBitmap(image, 32, 0, 32, 32)
    ]).then((sprites) => {
        console.log(sprites);

        // Draw each sprite onto the canvas
        pm.drawImage(sprites[0], 0, 0);
        // pm.drawImage(sprites[1], 32, 32);
    }).catch( (err) => {
        console.log(err);
    });
};

const scan = () => {
    let sumTotal = 0;
    let len = 48;
    let sums = [];
    let counter = 0;
    let sum = 0;

    for (let j = 0; j < len; j += 4) {

        console.log(j);
        //console.log(counter);
        counter += 1;
        sumTotal += j;

        sum += j;

        if (counter % 3 === 0) {
            console.log('-- sum =', sum);
            // sums.push(sumTotal);
            sums.push(sum);
            //sums.push(j);

            sum = 0;
        }

        //console.log('sum: ', sum);

        //sum = 0;
    }

    console.log('sumTotal: ', sumTotal);
    console.log('sums: ', sums);
    console.log('sums all: ', sums.reduce( (acc, cur) => acc + cur) );
};

const getBorders = (data, scanSize) => {
    let borders = [];

    let len = data.length - 1;

    for (let i = 0; i < len; i += 1) {
        let diff = data[i] ^ data[i+1];

        if (diff) {
            borders.push(i);
        }
    }

    if (borders.length % 2) {
        borders.push(scanSize);
    }

    return borders;
};

const setOneZero = (int) => {
    if (int) {
        return 1;
    }

    return 0;
};

const getLetterCoords = (borders, coord, size) => {
    let params = [];

    let len = borders.length;

    for (let even = 0, odd = 1; odd < len; odd += 2, even += 2) {
        let block = {};

        block[coord] = borders[even];
        block[size] = borders[odd] - borders[even];

        params.push(block);
    }

    return params;
};

const getSpaceCoords = (borders, coord, size) => {
    let params = [];

    let len = borders.length;

    // console.log(borders[len-1]);

    for (let even = 2, odd = 1; even < len; odd += 2, even += 2) {
        let block = {};

        block[coord] = borders[odd];
        block[size] = borders[even] - borders[odd];

        params.push(block);
    }

   return params;
};

const getVertCoords = (borders) => getLetterCoords(borders, 'y', 'height');

const getHorLetterCoords = (borders) => getLetterCoords(borders, 'x', 'width');

const getHorSpacesCoords = (borders) => getSpaceCoords(borders, 'x', 'width');

const getVertCoordsFilter = (data) => {
    //console.log(data);

    if (data && data[0]) {
        let lines = [];
        let max = data[0]['height'];
        let sum = 0;
        let len = data.length;

        for (let i = 1; i < len; i += 1) {
            // console.log(data[i]['height']);

            if (data[i]['height'] > max) {
                max = data[i]['height'];
            }

            sum += data[i]['height'];
        }

        let avg = sum / len ^ 0;

        let minLimit = (max - avg) / 2;

        // console.log('avg:', avg);
        // console.log('max:', max);

        for (let i = 1; i < len; i += 1) {
            if (data[i]['height'] > minLimit) {
                data[i]['height'] = max;
                lines.push(data[i]);
            }
        }

        return lines;
    } else {
        console.log('getVertCoordsFilter:' + 'No Data!');
    }
};

const drawLetters = (data) => {
    if (data) {
        //console.log(data);

        for (let i = 0, len = data.length; i < len; i += 1) {
            pm.letterRect(data[i]);
        }
    }
};

const drawLines = (data) => {
    if (data) {
        let x = 25;
        let width = 610;
        // console.log(data);

        for (let i = 0, len = data.length; i < len; i += 1) {
            pm.lineRect(data[i], x, width);
        }
    }
};

const binaryscale = (data) => {
    let bits = []; // use Uint8ClampedArray

    for (let i = 0, len = data.length; i < len; i += 4) {
        bits.push( setOneZero(data[i] ^ 255) );
    }

    //console.log(bits);

    return bits;
};

const vertScan = (width, height, fn) => {
    const xCoord = 0;
    const yCoord = 0;
    const scanWidth = width;
    const scanHeight = height;

    let props = {
        left: xCoord,
        top: yCoord,
        width: scanWidth,
        height: scanHeight
    };

    let {data} = pm.getImageData(props);
    let size = data.length;
    // console.log(data);

    let bitArray = binaryscale(data);
    // console.log(bitArray);

    let n = 0;
    let pixelLine = 0;
    let lines = [];
    let max = 0;

    for (let len = bitArray.length; n < len; n += 1) {
        max |= bitArray[n];

        if (n % scanWidth === 0) {

            pixelLine += 1;

            lines.push(max);

            max = 0;
        }
    }

    //console.log('lines: ', lines);
    //console.log('pixelLine: ', pixelLine);

    // vertical scanning
    //console.log('borders Y: ', getBorders(lines, scanHeight) );
    let bordersY = getBorders(lines, scanHeight);

    // console.log('lines Y:', getVertCoords(bordersY) );
    let verCoords = getVertCoords(bordersY);

    //console.log('clean Y:', getVertCoordsFilter(verCoords) );
    //let vertData = getVertCoordsFilter(verCoords);
    //let vertData = verCoords;

    //drawLines(vertData);

    let lineWords = verCoords.map( (verCoord) => {
        return horScan(verCoord, width);
    });

    console.log(lineWords);

    let limit = 2;

    let text = 0;
    text = lineWords.reduce( (acc, cur, i) => {
        return acc.concat(cur);
    });
    console.log('all', text);

    /*text = lineWords[0].concat(lineWords[1]);
    console.log('2', text);*/

    return text;
};

const addVertParams = (letters, line) => {
    for (let i = 0, len = letters.length; i < len; i += 1) {
        Object.assign(letters[i], line)
    }

    return letters;
};

const getWordSpace = (data) => {
    const byFieldDesc = (field) => (a, b) => a[field] < b[field] ? 1 : -1;
    const words = [];

    const moreThan = (a) => (x) => x > a;

    const filter = (array, field, fn) => {
        let len = array.length - 1;

        if (len === 0) {
            return 0;
        }

        for (let i = 0; i < len; i += 1) {
            let diff = array[i][field] - array[i+1][field];

            if ( fn(diff) ) {
                return i;
            }
        }

        return -1;
    };

    // console.log(data);

    data.sort(byFieldDesc('width') );
    data.forEach( (elem) => {
       // console.log(elem['width']);
    });

    let last = filter(data, 'width', moreThan(1));

    for (let i = 0; i <= last;i += 1) {
        words.push(data[i]);
    }

    return words;
};

const getWords = (wordSpace, begin, end) => {
    // console.log(wordSpace, begin, end)
    const byFieldInc = (field) => (a, b) => a[field] > b[field] ? 1 : -1;

    let words = [];
    let len = wordSpace.length;
    // console.log('len: ',len)

    // console.log(begin);
    // console.log(end);
    // console.log(wordSpace);
    wordSpace.sort( byFieldInc('x') );

    //wordSpace.pop(begin);
    //wordSpace.push(end);

    // console.log(wordSpace);
    // let xl = begin;

    let first = {};

    first.x = begin;
    first.width = wordSpace[0]['x'] - begin;

    words.push(first);

    if (len) {
        for (let i = 0; i < len-1; i += 1) {
            // console.log(wordSpace[i]['x']);

            let word = {};

            word.x = wordSpace[i]['x'] + wordSpace[i]['width'];
            word.width = wordSpace[i+1]['x'] - word.x;

            words.push(word);
        }
    }

    let last = {};
    last.x = wordSpace[len-1]['x'] + wordSpace[len-1]['width'];
    last.width = end - last.x;

    words.push(last);

    // console.log(words);

    return words;
};

const getLastLetterPixel = (data) => {
    let last = data.length - 1;

    return data[last]['x'] + data[last]['width'];
};

const getFirstLetterPixel = (data) => {
    return data[0]['x'];
};

const horScan = (nLine, width) => {
    const xCoord = 0;
    const scanWidth = width;

    let {y: yCoord, height: scanHeight} = nLine;

    let props = {
        left: xCoord,
        top: yCoord,
        width: scanWidth,
        height: scanHeight
    };

    let {data} = pm.getImageData(props);
    let size = data.length;
    // console.log(data);

    let bitArray = binaryscale(data);
    // console.log('bq', bitArray);

    let columns = [];
    let pixelLine = 0;

//    const getRedIndexForCoord = (x, y, width) =>  x * 4 + y * (width * 4);
    const getIndexForCoord = (x, y, width) => x + y * width;

    let letters = [];

    // console.log(yCoord, scanHeight, scanWidth);

    for (let x = 0;  x < scanWidth; x += 1) {
        let max = 0;

        for (let y = 0; y < scanHeight; y += 1) {
            const index = getIndexForCoord(x, y, scanWidth);

            max |= bitArray[index];
         }

        letters.push(max);

        max = 0;
    }

    // console.log(letters);

    //console.log('borders X: ', getBorders(letters, scanWidth) );
    let bordersX = getBorders(letters, scanWidth);

    //console.log('letters X:', getHorLetterCoords(bordersX, scanWidth) );
    let horLetterCoords = getHorLetterCoords(bordersX, scanWidth);

    //console.log('spaces X:', getHorSpacesCoords(bordersX, scanWidth) );
    let horSpaceCoords = getHorSpacesCoords(bordersX, scanWidth);

    //console.log( getWordSpace(horSpaceCoords) );
    let wordSpace = getWordSpace(horSpaceCoords);

    //console.log('clean Y:', getVertCoordsFilter(verCoords) );
    //let vertData = getVertCoordsFilter(verCoords);
    //let horData = horCoords;

    addVertParams(horSpaceCoords, nLine);

    let beginLetter = getFirstLetterPixel(horLetterCoords);
    let endLetter = getLastLetterPixel(horLetterCoords);

    let lineWords = getWords(wordSpace, beginLetter, endLetter);

    //drawLetters(horSpaceCoords);
    // drawLetters(wordSpace);

    addVertParams(lineWords, nLine);
    drawLetters(lineWords);

    return lineWords;
};

function makeImage(fn) {
    let img = new Image();

    img.onload = () => {
        let props = {
            image: img,
            destX: 0,
            destY: 0,
            fn: getPixels
        };

        let canvas = pm.drawImage(props);
        canvas.addEventListener('mousemove', pick);

        let width = +canvas.getAttribute('width');
        let height = +canvas.getAttribute('height');
        // console.log(width, height)

        //bitmap(img)
        // grayscale();
        bwthreshold(width, height);

        let text = vertScan(width, height);

        fn(img, text)
    };

    // img.src = '/year.jpg';
    // img.src = '/rainbow.jpg';

    // img.src = '/block.png';
    // img.src = '/blocks.png';
    // img.src = '/odd.png';
    // img.src = '/even.png';
    img.src = '/text.jpg';
}

function createImageData(pm) {
    let props = {
        width: 100,
        height: 100
    };

    console.log( pm.createImageData(props).width );
    console.log( pm.createImageData(props).height );
    console.log( pm.createImageData(props).length );

    const imageData = pm.createImageData(props);

    for (let i = 0, step = 4, len = imageData.data.length; i < len; i += step) {
        // Modify pixel data
        imageData.data[i + 0] = 190;  // R value
        imageData.data[i + 1] = 0;    // G value
        imageData.data[i + 2] = 210;  // B value
        imageData.data[i + 3] = 255;  // A value
    }

    let putProps = {
        imageData,
        width: 0,
        height: 0
    };

    pm.putImageData(putProps);

    console.log( pm.createImageData(props).data );

    let i = 50; // row
    let j = 200; // column

    let blueComponent = imageData.data[
        ( ( i * (imageData.width * 4) ) + (j * 4) ) + 2
    ];
}

function getWidth(len) {
    let widths = [];
    const random1to20 = randomInt(1, 20);

    for (let i = 0; i < len; i += 1) {
        let width = random1to20();

        widths.push(width);
    }

    return widths;
}

function getText() {
    let words = [];

    const lenWord = 120;
    const spaceWord = 7;
    const widthLetter = 5;
    const fontSize = 10;

    const widthScreen = 400;
    const heightScreen = 500;
    const leftPad = 20;
    const rightPad = 20;
    const topPad = 20;
    const bottomPad = 10;

    let lineHeight = fontSize * 1.6;
    let mdlWordWdth = 10 * widthLetter;

    let widthTextSpace = widthScreen - spaceWord - leftPad - rightPad - mdlWordWdth;
    let heightTextSpace = heightScreen - topPad - bottomPad;

    let cursor = leftPad;

    let widths = getWidth(lenWord);
    let line = topPad;
    let bg = '';

    for (let i = 0; i < lenWord; i += 1) {

        let width = widths[i] * widthLetter;

        if (cursor >= widthTextSpace) {
            console.log(cursor, ' : ', widthTextSpace);

            line += lineHeight;
            cursor = leftPad;
            // bg = '#cfc';
        }
        
        if (line >= heightTextSpace) {
            return words;
        }

        let obj = {
            x: cursor,
            y: line,
            width,
            height: lineHeight,
            style: bg
        };

        words.push(obj);

        cursor += spaceWord + width;
    }

    return words;
}

const getXY = (index, width) => {
    let x = 0;
    let y = 0;

    console.log()

    //return [x, y];
};

const bwthreshold = (width, height) => {
    let threshold = 200; // --> to getThreshold('gray distribution')

    let propsGet = {
        left: 0,
        top: 0,
        width,
        height
    };

    let imageData = pm.getImageData(propsGet);
    let {data} = imageData;


    for (let i = 0, len = data.length; i < len; i += 4) {
        let value = 0;
        let gray = (data[i] + data[i + 1] + data[i + 2]) / 3; // Average Brightness
        //console.log(gray);

        if (gray >= threshold) {
            value = 255;
        }

        data[i]     = value; // red
        data[i + 1] = value; // green
        data[i + 2] = value; // blue
    }

    let propsPut = {
        imageData,
        destX: 0,
        destY: 0
    };

    pm.putImageData(propsPut);
};

const grayscale = () => {
    //console.log('grayscale');

    let propsGet = {
        left: 0,
        top: 0,
        width: 400,
        height: 500
    };

    let imageData = pm.getImageData(propsGet);
    let {data} = imageData;


    for (let i = 0, len = data.length; i < len; i += 4) {

        // let gray = 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2]; // Luminosity
        let gray = (data[i] + data[i + 1] + data[i + 2]) / 3; // Average Brightness
        // let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]; // rec601 standard
        // let gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]; // ITU-R BT.709 standard
        // let gray = 0.2627 * data[i] + 0.6780 * data[i + 1] + 0.0593 * data[i + 2]; // ITU-R BT.2100 standard

        data[i]     = gray; // red
        data[i + 1] = gray; // green
        data[i + 2] = gray; // blue
    }

    let propsPut = {
        imageData,
        destX: 0,
        destY: 0
    };

    pm.putImageData(propsPut);
};

const getRGBA = (xCoord, yCoord, canvasWidth) => {
    const getColorIndicesForCoord = (x, y, width) => {
        const red = y * (width * 4) + x * 4;

        return [red, red + 1, red + 2, red + 3];
    };

    const colorIndices = getColorIndicesForCoord(xCoord, yCoord, canvasWidth);

    const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
};

const getInverseRGBAColor = (pixel) => {
    pixel[0] = pixel[0] ^ 255;
    pixel[1] = pixel[1] ^ 255;
    pixel[2] = pixel[2] ^ 255;

    return 'rgba(' +
        pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', ' + (pixel[3] / 255)
        + ')';
};

const getRGBAColor = (pixel) => {
    return 'rgba(' +
        pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', ' + (pixel[3] / 255)
        + ')';
};

const showColors = (pixel, holder) => {
    let bgColor = getRGBAColor(pixel);

    const color = document.getElementById(holder);

    color.style.background = bgColor;
    color.textContent = bgColor;
    //color.style.color = getInverseRGBAColor(pixel);
};

const showCoords = (x, y, holder) => {
    const coords = document.getElementById(holder);

    coords.textContent = `(x, y) => (${x}, ${y})`;
};

const pick = (event) => {
    let props = {
        left: event.layerX,
        top: event.layerY,
        width: 1,
        height: 1
    };

    let {data: pixel} = pm.getImageData(props);

    showColors(pixel, 'color');

    let {layerX: x, layerY: y} = event;

    showCoords(x, y, 'coords');
};

function draw(fn) {
    canvas.removeEventListener('mousemove', pick);

    makeImage(fn);
}

function loadHandler() {
    const canvas = document.getElementById('canvas');
    const grayscalebtn = document.getElementById('grayscale');

    canvas.addEventListener('mousemove', pick);
    //grayscalebtn.addEventListener('click', grayscale);

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const widthCanvas = canvas.width;
        const heightCanvas = canvas.height;

        const params =  {
            widthCanvas,
            heightCanvas,
            ctx
        };

        pm = new Pixman(params);

        draw(drawNewText);
    } else {
        console.log('Canvas Do Not Support')
    }
}

window.addEventListener('load', loadHandler);

let canvas = document.getElementById('canvasOut');
let ctx = canvas.getContext('2d');
let image = new Image();

const getBitMaps = (image, indexes) => {
    let bitmaps = [];

    indexes.forEach( (elem) => {
        let {x, y, width, height} = elem;

        bitmaps.push( createImageBitmap(image, x, y, width, height) );
    });

    /*var width = indexes.reduce(
        (acc, cur) => acc + cur.width
    , 0);

    console.log(width);*/

    return bitmaps;
};

const drawNewText = (image, indexes) => {
    let bitmaps = getBitMaps(image, indexes);

    Promise
        .all(bitmaps)
        .then((words) => {
            let lenWords = words.length;
            // console.log('words: ', words);

            let SCREEN_WIDTH = 50;
            
            let matrix = [];
            let spaceWord = 10;
            let lineWidth = 0;
            let line = [];
            let lineSize = 0;

            indexes.map( (elem, i) => {
                lineSize += 1;
                line.push( words[i] );

                lineWidth += elem.width + spaceWord;

                if (lineWidth >= SCREEN_WIDTH) {
                    // matrix.push(lineSize);
                    matrix.push(line);

                    lineWidth = 0;
                    lineSize = 0;

                    line = [];
                }
            });

            console.log(matrix);

            let topPad = 10;
            let leftPad = 15;

            let lineHeigth = 40;
            let space = 15;

            matrix.forEach( (line, i) => {
                let allWidth = leftPad;

                for (let word = 0, len = line.length; word < len; word += 1) {
                    let x = allWidth;
                    let y = i * lineHeigth + topPad;
                    let width = line[word].width;

                    ctx.drawImage(line[word], x, y, width, line[word].height);

                    allWidth += width + space;
                }
            });
        });
};


// image.onload = drawNewText();

image.src = '/rainbow.jpg';
// image.src = '/text.jpg';
