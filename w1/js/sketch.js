// noise, grayscale, map, text, shape, vertex
// Move the mouse to interact.
// Mouse click to toggle render

let xincr = 0, yincr = 0, xincr2, yincr2, dst = 100, fp, fp2;
let isBlk = false;

function setup() {
    createCanvas(displayWidth, displayHeight, WEBGL);
    background(0);
    noiseSeed(123);
}

function draw() {

    if (isBlk) {
        background(50);
        stroke(200);
        fill(200);
    } else {
        background(200);
        stroke(50);
        fill(50);
    }

    text("X: ", 20, 30);
    text("Y: ", 20, 45);
    text(fp, 40, 30);
    text(fp2, 40, 45);
    noFill();

    // translate(width/2, height/2);

    fp = map(mouseX, 0, width, -.05, .05);
    fp2 = map(mouseY, 0, height, -.05, .05);

    xincr += .001;
    yincr += .001;

    yincr2 = yincr;
    for (let y = -dst; y <= dst; y += 5) {
        yincr2 += fp;
        let first = true;
        xincr2 = xincr;
        for (let x = -dst; x <= dst; x += 5) {
            xincr2 += fp2;
            let x1 = x * noise(xincr2, yincr2) * 10;
            let y1 = y * noise(xincr2, yincr2) * 10;

            if (first) {
                first = false;
            } else {
                line(x0, y0, x1, y1);
            }
            x0 = x1;
            y0 = y1;
        }
    }
}

function mousePressed() {
    isBlk = !isBlk;
}
