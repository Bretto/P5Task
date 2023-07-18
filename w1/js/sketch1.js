let numBalls;
let manager;

function setup() {
    createCanvas(displayWidth, displayHeight);
    //colorMode(HSB, 360, 100, 100, 100);
    numBalls = 20;
    manager = new Manager(numBalls);
}

function draw() {
    background(0);
    manager.run();
}

class Ball {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-.2, .2), random(-.2, .2));
        this.rad = random(5,70);
        this.conPt1 = createVector();
        this.conPt2 = createVector();
        this.ang1 = random(0, 359);
        this.ang2 = random(0, 359);
        this.incr1 = random(-1, 1);
        this.incr2 = random(-1, 1);
        this.ease = .001;
    }

    update() {
        this.pos.add(this.vel);
        this.conPt1.x = this.pos.x + cos(radians(this.ang1))*this.rad;
        this.conPt1.y = this.pos.y + sin(radians(this.ang1))*this.rad;
        this.ang1 += this.incr1;

        this.conPt2.x = this.pos.x + cos(radians(this.ang2))*this.rad;
        this.conPt2.y = this.pos.y + sin(radians(this.ang2))*this.rad;
        this.ang2 += this.incr2;
    }

    display() {
        stroke(360, 100, 100, 50);
        strokeWeight(.5);
        fill(255, 255, 255, 20);
        ellipseMode(RADIUS);
        if (mouseIsPressed) ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
    }

    boundsCheck() {
        if (this.pos.x > width-this.rad) this.vel.x -= this.ease;
        else if (this.pos.x < this.rad) this.vel.x += this.ease;
        if (this.pos.y > height-this.rad) this.vel.y -= this.ease;
        else if (this.pos.y < this.rad) this.vel.y += this.ease;
    }

    run() {
        this.update();
        this.boundsCheck();
        this.display();
    }
}

class Manager {
    constructor(n) {
        this.balls = [];
        this.angle = 0;
        this.rad = 100;
        for (let i = 0; i< numBalls; i++) {
            let x = width/2 +cos(radians(this.angle))*this.rad;
            let y = height/2 +sin(radians(this.angle))*this.rad;
            this.angle += 360/(numBalls-3);
            this.balls[i] = new Ball(x, y);
        }
    }

    run() {
        this.collisionCheck();
        this.connect();
    }

    collisionCheck() {
        for (let outer = 0; outer < this.balls.length; outer++) {
            this.balls[outer].run();
            for (let inner = outer + 1; inner < this.balls.length; inner++) {
                let inContact = this.checkThese2(this.balls[outer], this.balls[inner]);
                if (inContact) {
                    let hold = this.balls[outer].vel;
                    this.balls[outer].vel = this.balls[inner].vel;
                    this.balls[inner].vel = hold;
                }
            }
        }
    }

    checkThese2(b1, b2) {
        let howFar = p5.Vector.sub(b1.pos, b2.pos);
        let howFarSquared =  howFar.x * howFar.x + howFar.y * howFar.y;
        return howFarSquared < (b1.rad + b2.rad)*(b1.rad + b2.rad);
    }

    connect() {
        for (let outer = 0; outer < this.balls.length; outer++) {
            for (let inner = outer + 1; inner < this.balls.length; inner++) {
                let dist = p5.Vector.dist(this.balls[outer].conPt1, this.balls[inner].conPt1);
                let max = 350;
                let alpha =  max * (pow(1/(dist/(2 * max)+1), 6));
                stroke(255, 255, 255, alpha);
                strokeWeight(2);
                bezier(this.balls[inner].conPt1.x, this.balls[inner].conPt1.y,
                    this.balls[inner].conPt2.x, this.balls[inner].conPt2.y,
                    this.balls[outer].conPt2.x, this.balls[outer].conPt2.y,
                    this.balls[outer].conPt1.x, this.balls[outer].conPt1.y);
            }
        }
    }
}
