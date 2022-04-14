"use strict";
function asteroids() {
    const svg = document.getElementById("canvas");
    const limitRange = (pendingNum) => (min) => (max) => (pendingNum < min ? (pendingNum + max) : (pendingNum % max));
    const createVector = (magnitude) => (angle) => ({ x: Math.round(magnitude * Math.sin(angle * Math.PI / 180)),
        y: -Math.round(magnitude * Math.cos(angle * Math.PI / 180)) });
    const getRandomArbitrary = (min) => (max) => (Math.round(Math.random() * (max - min) + min));
    const chooseBetween = (first) => (second) => (Math.random() > 0.5 ? first : second);
    function getTransformInfo(target) {
        const regex = /[0-9]+/g;
        const pos = target.attr("transform")
            .match(regex)
            .map(Number);
        return { x: pos[0], y: pos[1], angle: pos[2] };
    }
    function isInRange(pendingNum, lower, upper) {
        return (pendingNum <= upper) && (pendingNum >= lower);
    }
    function isCollision(x1, y1, x2, y2, span, tolerance) {
        const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        return distance < (span + tolerance);
    }
    function isoffScreen(xCoordinate, yCoordinate, background) {
        return !isInRange(xCoordinate, 0, Number(background.getAttribute("width"))) ||
            !isInRange(yCoordinate, 0, Number(background.getAttribute("height")));
    }
    const createParticle = (element) => (orientation) => (velocity) => ({
        orien: orientation,
        vel: velocity,
        elem: element,
        x: () => Number(element.attr("cx")),
        y: () => Number(element.attr("cy"))
    });
    const BULLET_SPEED = 8, SHIP_MAX_SPEED = 4, DAMPING_RATIO = 0.98;
    let velocity = 0, rotation = 0, life = 5, score = 0, level = 0, invincible = false, asteroids = [], bullets = [], enemies = [];
    const sysClock = Observable.interval(20);
    const sysTimer = sysClock.takeUntil(sysClock.filter(_ => (life === 0)));
    const cyDelay = (mSecond) => {
        const internalTimer = Observable.interval(mSecond);
        return internalTimer.takeUntil(internalTimer.filter(i => i > mSecond));
    };
    const repeatExecute = (n) => {
        const internalTimer = Observable.interval(1);
        return internalTimer.takeUntil(internalTimer.filter(i => i === n));
    };
    function calcOrientation(x, y) {
        return Math.atan2(y, x) * 180 / Math.PI;
    }
    const shootBullet = (svg, bulletArray, bulleSpeed, ship) => {
        return function () {
            bulletArray.push(createParticle(new Elem(svg, "circle")
                .attr("cx", getTransformInfo(ship).x)
                .attr("cy", getTransformInfo(ship).y)
                .attr("r", 1)
                .attr("style", "fill:gray;stroke:white;stroke-width:2"))(getTransformInfo(ship).angle)(bulleSpeed));
        };
    };
    let g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300) rotate(0)");
    let ship = new Elem(svg, 'polygon', g.elem)
        .attr("points", "-10,15 10,15 0,-15")
        .attr("style", "fill:lime;stroke:purple;stroke-width:1; fill-opacity:1.0");
    const keyPress = Observable.fromEvent(document, "keydown"), keyRelease = Observable.fromEvent(document, "keyup");
    const asteroidsObservable = Observable.fromArray(asteroids);
    const bulletsObservable = Observable.fromArray(bullets);
    const enemiesObservable = Observable.fromArray(enemies);
    sysClock.subscribe(() => {
        level = Math.floor(score / 10) + 1;
        updatePage(life, score, level);
    });
    const shipUpdate = sysTimer.map(_ => getTransformInfo(g))
        .map(({ x, y, angle }) => ({
        x: x + createVector(velocity)(angle).x,
        y: y + createVector(velocity)(angle).y,
        angle: rotation
    }))
        .map(({ x, y, angle }) => ({
        x: limitRange(x)(0)(Number(svg.getAttribute("width"))),
        y: limitRange(y)(0)(Number(svg.getAttribute("height"))),
        angle: limitRange(angle)(0)(360)
    }));
    shipUpdate.subscribe(({ x, y, angle }) => {
        g.attr("transform", "translate(" + x + " " + y + ") rotate(" + angle + ")");
        velocity *= DAMPING_RATIO;
        rotation = angle;
    });
    shipUpdate.subscribe(() => {
        const x = getTransformInfo(g).x;
        const y = getTransformInfo(g).y;
        enemies.forEach(e => {
            const enemyPos = getTransformInfo(e.elem);
            asteroids.forEach(a => {
                if (invincible === false &&
                    (isCollision(a.x(), a.y(), x, y, Number(a.elem.attr('r')), 0.05) ||
                        isCollision(enemyPos.x, enemyPos.y, x, y, 20, 0.05))) {
                    invincible = true;
                    ship.attr("style", "fill:lime;stroke:purple;stroke-width:1; fill-opacity:0.5");
                    cyDelay(5000).subscribe(() => {
                        invincible = false;
                        ship.attr("style", "fill:lime;stroke:purple;stroke-width:1; fill-opacity:1");
                    });
                    g.attr("transform", "translate(300 300) rotate(0)");
                    life -= 1;
                }
            });
        });
    });
    sysTimer.filter(i => i % (5000 / level) === 0)
        .subscribe(() => {
        asteroids.push(createParticle(new Elem(svg, "circle")
            .attr("cx", chooseBetween(0)(600))
            .attr("cy", chooseBetween(0)(600))
            .attr("r", getRandomArbitrary(10)(50))
            .attr("style", "fill:gray;fill-opacity:0.5;stroke:white;stroke-width:1"))(getRandomArbitrary(0)(360))(getRandomArbitrary(0)(1)));
    });
    sysTimer.filter(_ => enemies.length < 1)
        .subscribe(() => {
        const x = chooseBetween(0)(600);
        const y = chooseBetween(0)(600);
        const enemy = new Elem(svg, 'g').attr("transform", "translate(" + x + " " + y + ") rotate(0)");
        enemies.push(createParticle(enemy)(0)(1));
        new Elem(svg, 'rect', enemy.elem)
            .attr("width", 40)
            .attr("height", 40)
            .attr("style", "fill:rgb(245,66,149)");
    });
    sysTimer.flatMap(() => asteroidsObservable)
        .subscribe(a => {
        const x = limitRange(0.5 + a.x() + createVector(a.vel)(a.orien).x)(0)(Number(svg.getAttribute("width")));
        const y = limitRange(0.5 + a.y() + createVector(a.vel)(a.orien).y)(0)(Number(svg.getAttribute("height")));
        a.elem.attr("cx", x);
        a.elem.attr("cy", y);
    });
    sysTimer.filter(i => i % 50 === 0)
        .flatMap(() => enemiesObservable)
        .subscribe(e => {
        const enemyPos = getTransformInfo(e.elem);
        const shipPos = getTransformInfo(g);
        const disX = shipPos.x - enemyPos.x;
        const dixY = -(shipPos.y - enemyPos.y);
        const orien = (disX < 0 && dixY > 0) ?
            360 + 90 - calcOrientation(disX, dixY) :
            90 - calcOrientation(disX, dixY);
        const x = limitRange(enemyPos.x + createVector(2)(orien).x)(0)(600);
        const y = limitRange(enemyPos.y + createVector(2)(orien).y)(0)(600);
        e.elem.attr("transform", "translate(" + x + " " + y + ") rotate(" + orien + ")");
    });
    sysTimer.flatMap(() => bulletsObservable)
        .subscribe(b => {
        if (isoffScreen(b.x(), b.y(), svg)) {
            b.elem.elem.remove();
            deleteElementInArray(bullets, b);
        }
        else {
            const x = b.x() + createVector(b.vel)(b.orien).x;
            const y = b.y() + createVector(b.vel)(b.orien).y;
            b.elem.attr("cx", x);
            b.elem.attr("cy", y);
            enemies.forEach(e => {
                if (isCollision(getTransformInfo(e.elem).x, getTransformInfo(e.elem).y, b.x(), b.y(), 30, 0.05)) {
                    score += 5;
                    b.elem.elem.remove();
                    e.elem.elem.remove();
                    deleteElementInArray(enemies, e);
                    deleteElementInArray(bullets, b);
                }
            });
            asteroids.forEach(a => {
                if (isCollision(a.x(), a.y(), b.x(), b.y(), Number(a.elem.attr("r")), 0.05)) {
                    const asteroidRadius = Number(a.elem.attr('r'));
                    if (asteroidRadius > 12) {
                        repeatExecute(getRandomArbitrary(2)(4))
                            .subscribe(() => asteroids.push(createParticle(new Elem(svg, "circle")
                            .attr("cx", a.x())
                            .attr("cy", a.y())
                            .attr("r", getRandomArbitrary(10)(Math.round(asteroidRadius / 2)))
                            .attr("style", "fill:gray;fill-opacity:0.5;stroke:white;stroke-width:1"))(getRandomArbitrary(0)(360))(getRandomArbitrary(1)(2))));
                    }
                    score += 1;
                    b.elem.elem.remove();
                    a.elem.elem.remove();
                    deleteElementInArray(asteroids, a);
                    deleteElementInArray(bullets, b);
                }
            });
        }
    });
    keyPress.map(e => ({ key: e.key, repeat: e.repeat }))
        .filter(({ key, repeat }) => (key == "w" && !repeat))
        .flatMap(() => sysTimer.takeUntil(keyRelease.filter(e => e.key == "w")))
        .subscribe(() => {
        velocity = velocity < SHIP_MAX_SPEED ? velocity + 0.5 : velocity;
    });
    keyPress.map(e => ({ key: e.key, repeat: e.repeat }))
        .filter(({ key, repeat }) => (key == "a" && !repeat))
        .flatMap(() => sysTimer.takeUntil(keyRelease.filter(e => e.key == "a")))
        .subscribe(() => {
        rotation -= 5;
    });
    keyPress.map(e => ({ key: e.key, repeat: e.repeat }))
        .filter(({ key, repeat }) => (key == "d" && !repeat))
        .flatMap(() => sysTimer.takeUntil(keyRelease.filter(e => e.key == "d")))
        .subscribe(() => {
        rotation += 5;
    });
    keyPress.map(e => ({ key: e.key, repeat: e.repeat }))
        .filter(({ key, repeat }) => (key == " " && !repeat))
        .flatMap(() => sysTimer.filter(i => i % 500 === 0)
        .takeUntil(keyRelease.filter(e => e.key == " ")))
        .subscribe(() => {
        shootBullet(svg, bullets, BULLET_SPEED, g)();
    });
    keyPress.map(e => ({ key: e.key, repeat: e.repeat }))
        .filter(({ key, repeat }) => key == " " && !repeat)
        .subscribe(() => {
        shootBullet(svg, bullets, BULLET_SPEED, g)();
    });
}
function updatePage(life, score, level) {
    const lifeNode = document.getElementById("life");
    const scoreNode = document.getElementById("score");
    const levelNode = document.getElementById("level");
    lifeNode.innerHTML = String(life);
    scoreNode.innerHTML = String(score);
    levelNode.innerHTML = String(level);
}
function deleteElementInArray(array, element) {
    const index = array.indexOf(element);
    if (index > -1) {
        delete array[index];
        array.splice(index, 1);
    }
}
if (typeof window != 'undefined')
    window.onload = () => {
        asteroids();
    };
//# sourceMappingURL=asteroids.js.map