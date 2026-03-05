let noiseTime = 0;
let rainLength = 10;
let rainGrowth = 0.5;
let creatureSize = 30;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent('canvas-container'); // Attached to the container
    frameRate(60);
    noCursor();
}

function draw() {
    // Atmosphere & Lighting
    if (random(1) < 0.02) {
        background(255, 255, 255);
        stroke(0);

        let lightningX = random(100, 700);
        strokeWeight(4);
        line(lightningX, 0, lightningX + 100, 120);
        line(lightningX + 100, 120, lightningX - 20, 250);
        line(lightningX - 20, 250, lightningX + 100, 380);
        line(lightningX + 100, 380, lightningX - 20, 500);

        // Creature absorbs energy
        creatureSize += 2;
        if (creatureSize > 120) {
            creatureSize = 30;
        }

    } else {
        background(20, 20, 30, 30);
        stroke(138, 43, 226, 200);
    }

    // Rain
    rainLength = rainLength + rainGrowth;
    if (rainLength > 50 || rainLength < 10) {
        rainGrowth = rainGrowth * -1;
    }

    let rainX = random(width);
    let rainY = random(height);

    strokeWeight(2);
    line(rainX, rainY, rainX, rainY + rainLength);

    // Creature Movement
    let creatureX;
    let creatureY;
    let interactionPadding = 50;

    if (mouseX > interactionPadding && mouseX < width - interactionPadding && mouseY > interactionPadding && mouseY < height - interactionPadding) {
        creatureX = mouseX + random(-5, 5);
        creatureY = mouseY + random(-5, 5);
    } else {
        creatureX = noise(noiseTime) * width + random(-2, 2);
        creatureY = noise(noiseTime + 1000) * height + random(-2, 2);
        noiseTime = noiseTime + 0.01;
    }

    // Draw Creature
    push();
    translate(creatureX, creatureY);
    drawCreature(creatureSize);
    pop();
}


// User-Defined Functions

function drawCreature(currentSize) {
    // Body
    drawBody(currentSize);

    // Limbs
    let totalLimbs = 6;
    for (let limbIndex = 0; limbIndex < totalLimbs; limbIndex++) {
        push();
        let rotationAngle = (TWO_PI / totalLimbs) * limbIndex + (frameCount * 0.02);
        rotate(rotationAngle);
        drawLimb(currentSize);
        pop();
    }
}

function drawBody(currentSize) {
    if (random(1) < 0.1) {
        stroke(255);
        strokeWeight(random(1, 3));
    } else {
        stroke(100, 200, 255, 200);
        strokeWeight(1.5);
    }

    noFill();
    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += 0.2) {
        let breathingOffset = sin(frameCount * 0.1) * 10;
        let bodyRadius = currentSize + breathingOffset + random(-15, 25);
        let offsetX = cos(angle) * bodyRadius;
        let offsetY = sin(angle) * bodyRadius;

        vertex(offsetX, offsetY);
    }
    endShape(CLOSE);

    // Core
    stroke(255, 255, 255, 150);
    strokeWeight(random(2, 5));
    point(random(-5, 5), random(-5, 5));
}

function drawLimb(currentSize) {
    stroke(138, 43, 226, 180);
    strokeWeight(1.5);
    noFill();

    beginShape();
    let startX = currentSize + 5;
    let startY = 0;
    vertex(startX, startY);

    let limbSegmentX = startX;
    let limbSegmentY = startY;
    let totalSegments = 4;

    for (let segmentIndex = 0; segmentIndex < totalSegments; segmentIndex++) {
        limbSegmentX += random(5, 15);
        limbSegmentY = sin(frameCount * 0.2 + segmentIndex) * 10 + random(-5, 5);
        vertex(limbSegmentX, limbSegmentY);
    }
    endShape();

    // Spark
    fill(255, 255, 255, 200);
    noStroke();
    circle(limbSegmentX, limbSegmentY, random(2, 4));
}
