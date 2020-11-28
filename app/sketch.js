var gridScale = 30;
const P_KEY = 80;
const S_KEY = 83;
const SPACE_BAR = 32;
var shapes = [];
var stableCubes = [];

let appSettings = {
    paused: false
};

function setup() {
    app = new Vue({
        el: '#appDiv',
        data: appSettings
    });
    createCanvas(360, 600);
    angleMode(DEGREES);
    frameRate(5);
    initInterface();
}

// function mouseClicked() {
//     paused = !paused;
//     if (paused) {
//         return noLoop();
//     }
//     loop();
// }

function draw() {
    if (appSettings.paused) {
        return;
    }
    background(51);
    let live = false;
    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        shape.update();
        if (shape.live) {
            shape.show();
            live = true;
        }
    }
    shapes = shapes.filter((shape) => shape.live);
    showStableCubes(stableCubes);
    if (reachedTheCeiling(stableCubes)) {
        stableCubes = turnAllCubesRed(stableCubes);
        showStableCubes(stableCubes);
        noLoop();
    }
    const levelsFilled = getLevelsFilled(stableCubes);
    if (levelsFilled.length > 0) {
        levelsFilled.forEach((level) => {
            stableCubes = clearLevel(level, stableCubes);
            stableCubes = dropDownStableCubes(stableCubes, level);
        });
    }
    if (!live) {
        shapes.push(new Shape());
    }
}

function turnAllCubesRed(stableCubes) {
    return stableCubes.map((c) => ({...c, color: 'red'}));
}

function reachedTheCeiling(stableCubes) {
    return stableCubes.some((c) => c.y <= -gridScale);
}

function dropDownStableCubes(stableCubes, level) {
    const cubesToDropOneLevel = stableCubes.filter((cube) => cube.y < level);
    const cubesToNotChange = stableCubes.filter((cube) => cube.y > level);
    return cubesToNotChange.concat(cubesToDropOneLevel.map((cube) => ({...cube, y: cube.y + gridScale})));
}

function clearLevel(level, stableCubes) {
    return stableCubes.filter((cube) => cube.y !== level);
}

function getLevelsFilled(stableCubes) {
    const levelsFilled = [];
    for (let level = height - gridScale; level >= 0; level = level - gridScale) {
        let filled = true;
        let cubesAtLevel = getAllStableCubesAtLevel(stableCubes, level);
        if (cubesAtLevel.length === 0) {
            return levelsFilled;
        }
        for (let x = 0; x <= width - gridScale; x = x + gridScale) {
            if (cubesAtLevel.filter((cube) => cube.x === x).length === 0) {
                filled = false;
            }
        }
        if (filled) {
            levelsFilled.push(level);
        }
    }
    return levelsFilled;
}

function getAllStableCubesAtLevel(cubes, level) {
    return cubes.filter((cube) => cube.y === level);
}

function showStableCubes(cubes) {
    cubes.forEach((cube) => {
        fill(cube.color);
        square(cube.x, cube.y, gridScale);
    });
}

function someCubeAt(x, y) {
    return this.stableCubes.some((c) => c.x === x && c.y === y);
}

function keyPressed() {
    if (appSettings.paused) {
        return;
    }
    liveShape = this.shapes.find((shape) => shape.live);
    if (keyCode === LEFT_ARROW) {
        liveShape.moveLeft();
    } else if (keyCode === RIGHT_ARROW) {
        liveShape.moveRight();
    } else if (keyCode === DOWN_ARROW) {
        liveShape.moveDown();
        redraw();
    } else if (keyCode === SPACE_BAR) {
        liveShape.rotateShape();
    }
}

function Shape() {
    this.bottomRight = function () {
        return [{x: 0, y: 0}];
    };
    this.bottomLeft = function () {
        return [{x: -gridScale, y: 0}];
    };
    this.upperRight = function () {
        return [{x: 0, y: -gridScale}];
    };
    this.upperLeft = function () {
        return [{x: -gridScale, y: -gridScale}];
    };
    this.createCube = function () {
        return [
            {x: -gridScale, y: -gridScale},
            {x: -gridScale, y: 0},
            {x: 0, y: 0},
            {x: 0, y: -gridScale}
        ];
    };

    this.createLine = function () {
        return [
            {x: 0, y: 0},
            {x: 0, y: gridScale},
            {x: 0, y: -gridScale * 2},
            {x: 0, y: -gridScale}
        ];
    };

    this.createL = function () {
        return [
            {x: 0, y: -gridScale},
            {x: 0, y: 0},
            {x: 0, y: gridScale},
            {x: gridScale, y: gridScale}
        ];
    };

    this.createReverseL = function () {
        return [
            {x: 0, y: -gridScale},
            {x: 0, y: 0},
            {x: 0, y: gridScale},
            {x: -gridScale, y: gridScale}
        ];
    };

    this.createT = function () {
        return [
            {x: 0, y: -gridScale},
            {x: 0, y: 0},
            {x: 0, y: gridScale},
            {x: 0 + gridScale, y: 0}
        ];
    };

    this.createS = function () {
        return [
            {x: 0, y: -gridScale},
            {x: 0 + gridScale, y: -gridScale},
            {x: 0, y: 0},
            {x: 0 - gridScale, y: 0}
        ];
    };

    this.createReverseS = function () {
        return [
            {x: 0, y: -gridScale},
            {x: 0 - gridScale, y: -gridScale},
            {x: 0, y: 0},
            {x: 0 + gridScale, y: 0}
        ];
    };

    this.shapeCreators = [
        this.createCube,
        this.createL,
        this.createLine,
        this.createS,
        this.createT,
        this.createReverseL,
        this.createReverseS
    ];
    const colors = ['purple', 'blue', 'yellow', 'orange', 'green', 'pink', 'turquoise'];
    this.live = true;
    this.color = 'purple';
    const choice = Math.floor(Math.random() * this.shapeCreators.length);
    this.cubes = this.shapeCreators[choice]();
    this.color = colors[choice];
    this.rotationAngle = 0;
    this.translateX = gridScale * (width / gridScale / 2);
    this.translateY = -gridScale * 2;

    this.update = function () {
        if (this.reachedBottom()) {
            this.live = false;
            stableCubes = stableCubes.concat(this.convertCubesToStaticLocation());
            return;
        }
        this.translateY += gridScale;
    };

    this.convertCubesToStaticLocation = function () {
        let newCubes = [];
        this.cubes.forEach((cube) => {
            newCubes.push({
                x: this.getRotatedCubeXValue(cube) + this.translateX,
                y: this.getRotatedCubeYValue(cube) + this.translateY,
                color: this.color
            });
        });
        return newCubes;
    };

    this.getRealCubeXValue = function (cube) {
        return this.getRotatedCubeXValue(cube) + this.translateX;
    };

    this.getRealCubeYValue = function (cube) {
        return this.getRotatedCubeYValue(cube) + this.translateY;
    };

    this.getRotatedCubeXValue = function (cube) {
        if (this.rotationAngle === 90) {
            return cube.y * -1 - gridScale;
        }
        if (this.rotationAngle === 180) {
            return cube.x * -1 - gridScale;
        }
        if (this.rotationAngle === 270) {
            return cube.y;
        }
        return cube.x;
    };

    this.getRotatedCubeYValue = function (cube) {
        if (this.rotationAngle === 90) {
            return cube.x;
        } else if (this.rotationAngle === 180) {
            return cube.y * -1 - gridScale;
        } else if (this.rotationAngle === 270) {
            return cube.x * -1 - gridScale;
        }
        return cube.y;
    };

    this.removeCubesAtLevel = function (level) {
        this.cubes = this.cubes.filter((cube) => cube.y + this.translateY !== level);
    };

    this.bottomCubes = function () {
        let lowest = -100;
        let yVal = null;
        this.cubes.forEach((cube) => {
            yVal = this.getRotatedCubeYValue(cube) + this.translateY;
            if (yVal > lowest) {
                lowest = yVal;
            }
        });
        const botCubes = this.cubes.filter((cube) => this.getRotatedCubeYValue(cube) + this.translateY === lowest);
        return botCubes;
    };

    this.reachedBottom = function () {
        const bottomCubes = this.bottomCubes();
        if (this.getRotatedCubeYValue(bottomCubes[0]) + this.translateY === height - gridScale) {
            return true;
        }
        // find if any bottom cubes on the live shape are blocked from going an further down
        for (let i = 0; i < this.cubes.length; i++) {
            const movingCube = this.cubes[i];
            const stableCubesBelowMovingShape = stableCubes
                .filter((stableCube) => stableCube.x === this.getRotatedCubeXValue(movingCube) + this.translateX)
                .filter(
                    (stableCube) => stableCube.y === this.getRotatedCubeYValue(movingCube) + this.translateY + gridScale
                );
            if (stableCubesBelowMovingShape.length > 0) {
                return true;
            }
        }
        return false;
    };

    this.getCubesAtLevel = function (level) {
        this.cubes
            .filter((cube) => cube.y + shape.translateY === level)
            .map((cube) => ({x: cube.x + shape.translateX, y: cube.y}));
    };

    this.show = function () {
        push();
        fill(this.color);
        translate(this.translateX, this.translateY);
        rotate(this.rotationAngle);
        for (let i = 0; i < this.cubes.length; i++) {
            cube = this.cubes[i];
            square(cube.x, cube.y, gridScale);
        }
        pop();
    };

    this.rotateShape = function () {
        this.rotationAngle += 90;
    };

    this.moveRight = function () {
        const limitLeft = Math.min(...this.cubes.map((c) => this.getRotatedCubeXValue(c))) * -1;
        const limitRight = width - gridScale - Math.max(...this.cubes.map((c) => this.getRotatedCubeXValue(c)));
        let c = null;
        for (let i = 0; i < this.cubes.length; i++) {
            c = this.cubes[i];
            if (someCubeAt(this.getRealCubeXValue(c) + gridScale, this.getRealCubeYValue(c))) {
                return;
            }
        }
        this.translateX = constrain(this.translateX + gridScale, limitLeft, limitRight);
    };

    this.moveLeft = function () {
        const limitLeft = Math.min(...this.cubes.map((c) => this.getRotatedCubeXValue(c))) * -1;
        const limitRight = width - gridScale - Math.max(...this.cubes.map((c) => this.getRotatedCubeXValue(c)));
        for (let i = 0; i < this.cubes.length; i++) {
            c = this.cubes[i];
            if (someCubeAt(this.getRealCubeXValue(c) - gridScale, this.getRealCubeYValue(c))) {
                return;
            }
        }
        this.translateX = constrain(this.translateX - gridScale, limitLeft, limitRight);
    };

    this.moveDown = function () {
        if (this.reachedBottom()) {
            return;
        }
        this.translateY += gridScale;
    };
}
