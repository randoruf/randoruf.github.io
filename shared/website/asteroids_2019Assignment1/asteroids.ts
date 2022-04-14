// FIT2102 2019 Assignment 1
// https://docs.google.com/document/d/1Gr-M6LTU-tfm4yabqZWJYg-zTjEVqHKKTCvePGCYsUA/edit?usp=sharing

function asteroids() {
  // You will be marked on your functional programming style as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to create reusable, generic functions.

  const svg:HTMLElement = document.getElementById("canvas")!;

  /**
   * Ensures a given number is in a specified range. 
   * similar to a ring, the head is attached to the tail. 
   * This function is used to wrap around the edges as the map is a torus topology. 
   * @param min the lowest number
   * @param max the highest number
   * @returns a number 
   */
  const limitRange = 
    (pendingNum: number) => (min: number) => (max: number) => 
    (pendingNum < min ? (pendingNum + max) : (pendingNum % max)); 

  /**
   * Decompose a vector passed into this function to correspond x and y coordinate. 
   * Two characteristics of a vector are magnitude and angle.
   * These two parameters can represent a particular direction with speed. 
   * This function is used while moving an object. 
   * @param magnitude the magnitude the given vector. 
   * @param angle the orientation of a given vector.
   * @returns an object {x,y}  
   */
  const createVector = 
    (magnitude: number) => 
    (angle: number) => 
    ({x:   Math.round(magnitude*Math.sin(angle*Math.PI/180)), 
      y: - Math.round(magnitude*Math.cos(angle*Math.PI/180))}); 

  /**
   * Generates a random number between min and max (both inclusive). 
   * It is widely used and inspired by MDN. 
   * The original URL is https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   * @param min the lowest number
   * @param max the highest number
   * @returns a random real number 
   */
  const getRandomArbitrary =
   (min:number) => (max:number) => 
   (Math.round(Math.random() * (max - min) + min)); 

  /**
   * Choose from two numbers. 
   * When generating enemies and asteroids, the initial locations are 
   * determined by the function. For example, an asteroid can appear on (0,0), (0,600), (600,0), (600,600) four corners. 
   * @param first the first number
   * @param second the second number
   * @returns first number or second number.
   */
  const chooseBetween = (first:number) => (second:number) => 
    (Math.random() > 0.5 ? first : second);  

  /**
   * Obtain the information of a transform's attribute. 
   * This function is used to improve the code reusability. 
   * It is a shorthand of getting information from a transform element(in HTML). 
   * @param target the desired transform. 
   * @param second the second number
   * @returns a object {x, y, angle}, x any y are coordinates, and angle is the oritentation. 
   */
  function getTransformInfo(target:Elem) : ({x:number, y: number, angle: number}){
    const regex = /[0-9]+/g;
    const pos = target.attr("transform")
                 .match(regex)!
                 .map(Number); 
    return {x: pos[0], y: pos[1], angle: pos[2]} ;
  } 

  /**
   * Determine a given number is in a range. 
   * This function is used to improve the code reusability. 
   * @param pendingNum the number will be determined 
   * @param lower the lower bound 
   * @param upper the upper bound 
   * @returns a boolean value 
   */
  function isInRange(pendingNum: number, lower: number, upper: number): boolean{
    return (pendingNum <= upper) && (pendingNum >= lower); 
  }

  /**
   * Determine whether two points have collisions. 
   * Given the coordinates of point 1 and point 2, a distance can be calculated. 
   * If this distance is less than the given span, two objects are close enough. 
   * Otherwise, there is no collision. 
   * @param pendingNum the number will be determined 
   * @param lower the lower bound 
   * @param upper the upper bound 
   * @param tolerance the error can be accepted  
   * @returns a boolean value 
   */
  function isCollision(x1: number, y1: number, x2: number, y2: number, span: number, tolerance: number): boolean {
    const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)); 
    // negative tolerance means a more strict condition. 
    return distance < (span + tolerance)
  }

  /**
   * Determine whether an object is out of screen. 
   * Especially shooting a bullet, this bullet must be removed when it is out of screen. 
   * Otherwise, the array/list that manages bullet objects grows larger and larger. 
   * Eventually, the memory leak problem becomes significant. 
   * @param xCoordinate the number will be determined 
   * @param yCoordinate the lower bound 
   * @param background the upper bound 
   * @returns a boolean value 
   */
  function isoffScreen(xCoordinate:number, yCoordinate:number, background: HTMLElement): boolean{
    return !isInRange(xCoordinate, 0, Number(background.getAttribute("width"))) ||
           !isInRange(yCoordinate, 0, Number(background.getAttribute("height"))) 
  }


  /* 
    Custom type that represents entities in the map. 
    For example, enemy ships or asteroids can be Particles in this game. 
    It can be extended to many different implementations. 
    a Particle usually has an initial velocity and orientation, and
    it will move towards to the orientation in that velocity. 
    the x and y is higher-order function, since the position of a Particle is always changing. 
    x() and y() can returns the current position instead of the initial position. 
  */
  type Particle<T, V> = ({
    orien: T;
    vel: T;
    elem: V;
    x: () => T;
    y: () => T;
  })

  /**
   * Create a new Particle in the map. 
   * This function is based on concepts from Object-oriented design. 
   * It is similar to "class" keyword but implemented in curried functions.  
   * @param element the svg element (a graphical shape)
   * @param orientation the orientation of the particle
   * @param velocity the velocity of the particle 
   * @returns a Particle type 
   */
  const createParticle = (element: Elem) => (orientation: number) => (velocity: number): Particle<number, Elem> => 
            ({
              orien: orientation,
              vel: velocity, 
              elem: element, 
              x: () => Number(element.attr("cx")), 
              y: () => Number(element.attr("cy"))
            }); 

  /* 
    Some hardcode constants, these values can optimize the gaming experience. 
  */
  const BULLET_SPEED = 8, 
        SHIP_MAX_SPEED = 4, 
        DAMPING_RATIO = 0.98;

  /* 
    The following variables are not pure and mutable, 
    The reason of using the variables is that this game needs 
    at least some states to keep track of the player. 
    Thus, the follwing variables are determined by the the player. 
    They also can be changed by the player. 

    velocity : the velocity of the ship, by doing this, the ship can move smoothly.. 
    rotation : the orientation of the ship, same as above. 
    life : how many lives(playing chance) left 
    score : the sore that the player achieves.  
    level : the game level. 
    invincible : indicate whether the ship can be destroyed. 
    asteroids : a list/array that manages all asteroids in the map. 
    bullets : a list/array that manages all bullets in the map. 
    enemies : a list/array that manages all enemies in the map. 
  */
  let velocity:number = 0, 
      rotation:number = 0, 
      life:number = 5, 
      score:number = 0, 
      level:number = 0, 
      invincible:boolean = false, 
      asteroids: Particle<number, Elem>[] = [], 
      bullets: Particle<number, Elem>[] = [], 
      enemies: Particle<number, Elem>[] = [];
  
  /*  the idea here is similar to LED display, 
      this game can refresh the display and update the game..
      sysClock is the main observable stream in the whole game. */
  const sysClock = Observable.interval(20); 
  /* an interval stops when there is no life left. */
  const sysTimer = sysClock.takeUntil(sysClock.filter(_ => (life === 0)));   
   /**
   * a delay function implemented by Observables. 
   * this timer first has an interval, 
   * and the takeUntil ensures this interval only execute once. 
   * @param mSecond time to delay 
   * @returns a interval observable 
   */
  const cyDelay = (mSecond:number) => {
    const internalTimer = Observable.interval(mSecond); 
    return internalTimer.takeUntil(internalTimer.filter(i => i > mSecond)); 
  }

  /**
   * a repeat function implemented by Observables. 
   * same as cyDelay, but it execute more times. 
   * @param n the number of time to execute 
   * @returns a interval observable 
   */
  const repeatExecute = (n: number) => {
    const internalTimer = Observable.interval(1); 
    return internalTimer.takeUntil(internalTimer.filter(i => i === n)); 
  }

  /**
   * Convert the distances to Orientation. 
   * given x and y coordinate, it returns the orientation towards to that point 
   * @param x the x coordinate of a point 
   * @param y the y coordinate of a point 
   * @returns the orientation in degress 
   */
  function calcOrientation(x:number, y:number) : number{
    return Math.atan2(y, x) * 180 / Math.PI;
  }

  /**
   * Create bullets.  
   * If this function returns higher order functions, the function can be pure. 
   * The part has side-effects only can happen when after calling it. 
   * So calling this function is pure. 
   * @param svg the parent node 
   * @param bulletArray the bullet array that bullets go to 
   * @param bulleSpeed the speed of this bullet
   * @param ship the ship that shooting bullets 
   * @returns a higher-order function which can be executed to create bullets. 
   */
  const shootBullet = (svg: HTMLElement, 
                       bulletArray: Particle<number, Elem>[], bulleSpeed: number, 
                       ship: Elem) => {
    return function (){
      bulletArray.push(
        createParticle(new Elem(svg, "circle")
            .attr("cx", getTransformInfo(ship).x) 
            .attr("cy", getTransformInfo(ship).y)
            .attr("r", 1)
            .attr("style","fill:gray;stroke:white;stroke-width:2")) 
            (getTransformInfo(ship).angle)
            (bulleSpeed)
      );
    }
  }

  // make a group for the spaceship and a transform to move it and rotate it
  // to animate the spaceship you will update the transform property
  let g = new Elem(svg,'g')
    .attr("transform","translate(300 300) rotate(0)")    
  
  // create a polygon shape for the space ship as a child of the transform group
  let ship = new Elem(svg, 'polygon', g.elem) 
    .attr("points","-10,15 10,15 0,-15")
    .attr("style","fill:lime;stroke:purple;stroke-width:1; fill-opacity:1.0")
  
  // declare some keyboard events and Observables. 
  const keyPress = Observable.fromEvent<KeyboardEvent>(document, "keydown"),
        keyRelease = Observable.fromEvent<KeyboardEvent>(document, "keyup"); 

  // Observables to loop lists. 
  const asteroidsObservable = Observable.fromArray(asteroids); 
  const bulletsObservable = Observable.fromArray(bullets);
  const enemiesObservable = Observable.fromArray(enemies); 
  
  // Monitoring the state of game, and ready to upate the HTML page.
  // results are shown to the player in fly. 
  sysClock.subscribe( () => {
    level = Math.floor(score/10) + 1;
    updatePage(life, score, level);
  });

  // the Observable stream that has the ship position. 
  // this stream can be divied into multiple stream and then 
  // has multiple subscription. 
  const shipUpdate = 
        sysTimer.map(_ => getTransformInfo(g))
                .map(({x, y, angle}) => ({
                    x: x + createVector(velocity)(angle).x, 
                    y: y + createVector(velocity)(angle).y, 
                    angle: rotation
                }))
                .map(({x, y, angle}) => ({
                    x: limitRange(x)(0)(Number(svg.getAttribute("width"))), 
                    y: limitRange(y)(0)(Number(svg.getAttribute("height"))), 
                    angle : limitRange(angle)(0)(360)
                }));

  // the first subscription to the Ship Observable stream. 
  // this will update the ship position and reduce speed. 
  shipUpdate.subscribe(({x, y, angle}) => { 
    g.attr("transform", "translate("+ x + " " + y + ") rotate("+ angle + ")");
    // damping ratio
    velocity *= DAMPING_RATIO; 
    rotation = angle;
  });

  // the second subscription to the Ship Observable stream. 
  // this will perform collision detection constantly.  
  shipUpdate.subscribe(() => {
                const x = getTransformInfo(g).x;
                const y = getTransformInfo(g).y;  
                // iterate all enemies in the enemies array. 
                enemies.forEach(e => {
                  const enemyPos = getTransformInfo(e.elem); 
                  // iterate all enemies in the asteroids array. 
                  asteroids.forEach(a => {
                    // only conduct if collision and invincible is false 
                    if (invincible === false && 
                       (isCollision(a.x(), a.y(), x, y, Number(a.elem.attr('r')), 0.05) || 
                        isCollision(enemyPos.x, enemyPos.y, x, y, 20, 0.05))){
                      invincible = true; 
                      // set the ship to be destoried later. 
                      ship.attr("style", "fill:lime;stroke:purple;stroke-width:1; fill-opacity:0.5"); 
                      cyDelay(5000).subscribe(() => {
                        invincible = false;
                        ship.attr("style", "fill:lime;stroke:purple;stroke-width:1; fill-opacity:1"); 
                      });
                      // move the ship to the centre. 
                      // and reduce the number of lifes 
                      g.attr("transform", "translate(300 300) rotate(0)");
                      life -= 1;
                  }
                  });
                })
            });
  
  // this will insert asteroid to the map every 5/level seconds. 
  // with higher level, there will be more asteroid. 
  // and the game becoms harder. 
  sysTimer.filter(i => i%(5000/level) === 0)
    .subscribe(() => {
      asteroids.push(
        createParticle(new Elem(svg, "circle")
                            .attr("cx", chooseBetween(0)(600))
                            .attr("cy", chooseBetween(0)(600))
                            .attr("r", getRandomArbitrary(10)(50))
                            .attr("style", "fill:gray;fill-opacity:0.5;stroke:white;stroke-width:1"))
        (getRandomArbitrary(0)(360))(getRandomArbitrary(0)(1)))
  });
   
  // insert a new enemy in the enemies list. 
  // this ensure there is only one enemy can exist in the map simutaneously. 
  sysTimer.filter( _ => enemies.length < 1)
          .subscribe(() => {
              const x = chooseBetween(0)(600); 
              const y = chooseBetween(0)(600); 
              const enemy = new Elem(svg,'g').attr("transform","translate("+ x + " " + y + ") rotate(0)"); 
              enemies.push(
                createParticle(enemy)(0)(1)
              )
              new Elem(svg, 'rect', enemy.elem) 
              .attr("width", 40)
              .attr("height", 40)
              .attr("style","fill:rgb(245,66,149)")
          })

  // iteration all asteroids and update their position. 
  sysTimer.flatMap(() => asteroidsObservable)
          .subscribe(a => {
              const x = limitRange(0.5 + a.x() + createVector(a.vel)(a.orien).x)
                                  (0)(Number(svg.getAttribute("width"))); 
              const y = limitRange(0.5 + a.y() + createVector(a.vel)(a.orien).y)
                                  (0)(Number(svg.getAttribute("height")));
              a.elem.attr("cx", x);
              a.elem.attr("cy", y) 
          });
  // update the postion of enemy. 
  // and enemy will always move towrads to the player. 
  // it can be demostrated by math. 
  sysTimer.filter(i => i%50 === 0)
          .flatMap(() => enemiesObservable)
          .subscribe(e => {
            const enemyPos = getTransformInfo(e.elem);
            const shipPos = getTransformInfo(g);
            const disX =    shipPos.x - enemyPos.x ; 
            const dixY = - (shipPos.y - enemyPos.y); 
            const orien = (disX < 0 && dixY > 0) ? 
                          360 + 90 - calcOrientation(disX, dixY) : 
                          90 - calcOrientation(disX, dixY); 
            const x = limitRange(enemyPos.x + createVector(2)(orien).x)(0)(600); 
            const y = limitRange(enemyPos.y + createVector(2)(orien).y)(0)(600); 
            e.elem.attr("transform", "translate(" + x + " " + y + ") rotate(" + orien + ")");
          })
  ;

  // iterate all bullets in the bulletsObservable
  // also perform some collision detection. 
  // such that enemy and asteroid can be destroied. 
  sysTimer.flatMap(() => bulletsObservable)
          .subscribe(b => {
            if (isoffScreen(b.x(), b.y(), svg)){
              b.elem.elem.remove();
              deleteElementInArray(bullets, b);
            }else{
              const x = b.x() + createVector(b.vel)(b.orien).x;
              const y = b.y() + createVector(b.vel)(b.orien).y; 
              b.elem.attr("cx", x);
              b.elem.attr("cy", y);
              // iterate all enermy 
              enemies.forEach(e => {
                if (isCollision(getTransformInfo(e.elem).x, getTransformInfo(e.elem).y, 
                                b.x(), b.y(),
                                30, 0.05)){
                      score += 5; 
                      b.elem.elem.remove(); 
                      e.elem.elem.remove();
                      deleteElementInArray(enemies, e);
                      deleteElementInArray(bullets, b); 
                  }
              }); 
              // iterate all asteroids
              asteroids.forEach(a => {
              if (isCollision(a.x(), a.y(), 
                              b.x(), b.y(), 
                              Number(a.elem.attr("r")), 0.05)) {

                const asteroidRadius = Number(a.elem.attr('r')); 
                if (asteroidRadius > 12){
                  repeatExecute(getRandomArbitrary(2)(4))
                          .subscribe(() =>
                              asteroids.push(createParticle( 
                                new Elem(svg, "circle")
                                      .attr("cx", a.x())
                                      .attr("cy", a.y())
                                      .attr("r", getRandomArbitrary(10)(Math.round(asteroidRadius/2)))
                                      .attr("style","fill:gray;fill-opacity:0.5;stroke:white;stroke-width:1")) 
                                (getRandomArbitrary(0)(360))
                                (getRandomArbitrary(1)(2)))
                              )
                }
                
                score += 1; 

                b.elem.elem.remove(); 
                a.elem.elem.remove();
                deleteElementInArray(asteroids, a);
                deleteElementInArray(bullets, b); 
              }
            })
            }
          });

  // monitor forward 
  keyPress.map(e => ({key: e.key, repeat: e.repeat}))
          .filter(({key, repeat}) => (key == "w" && !repeat))
          // inspired by the tutorial "observableexamples.ts" (Rectangle animation, moving forward smoothly for 1 second). 
          .flatMap(() => 
              sysTimer.takeUntil(keyRelease.filter(e => e.key == "w")))
          .subscribe(() => {
              velocity = velocity < SHIP_MAX_SPEED ? velocity + 0.5 : velocity; 
          });
  // monitor left 
  keyPress.map(e => ({key: e.key, repeat: e.repeat}))
          // with object destructuring
          .filter(({key, repeat}) => (key == "a" && !repeat))
          // inspired by the tutorial "observableexamples.ts" (Rectangle animation, moving forward smoothly for 1 second). 
          .flatMap(() => 
              sysTimer.takeUntil(keyRelease.filter(e => e.key == "a")))
          .subscribe(() => {
              rotation -= 5;
          });
  // monitor right 
  keyPress.map(e => ({key: e.key, repeat: e.repeat}))
          .filter(({key, repeat}) => (key == "d" && !repeat))
          // inspired by the tutorial "observableexamples.ts" (Rectangle animation, moving forward smoothly for 1 second). 
          .flatMap(() => 
              sysTimer.takeUntil(keyRelease.filter(e => e.key == "d")))
          .subscribe(() => {
              rotation += 5;
          });
  // monitor shooting (long press space )
  keyPress.map(e => ({key: e.key, repeat: e.repeat}))
          .filter(({key, repeat}) => (key == " " && !repeat))
          .flatMap(() => 
              sysTimer.filter(i => i%500===0)
                      .takeUntil(keyRelease.filter(e => e.key == " ")))
          .subscribe(() => {
              shootBullet(svg, bullets, BULLET_SPEED, g)(); 
          });
  // monitor shooting (short press spance )
  keyPress.map(e => ({key: e.key, repeat: e.repeat}))
          .filter(({key, repeat}) => key == " " && !repeat)
          .subscribe(() => {
              shootBullet(svg, bullets, BULLET_SPEED, g)(); 
          })
}

 /**
   * update HTML page. 
   * @param life the life of ship 
   * @param score the score play get 
   * @param level the current lelve 
   * @returns 
   */
function updatePage(life: number, score: number, level: number):void {
  const lifeNode: HTMLElement = document.getElementById("life")!; 
  const scoreNode: HTMLElement = document.getElementById("score")!;
  const levelNode: HTMLElement = document.getElementById("level")!;
  lifeNode.innerHTML = String(life);
  scoreNode.innerHTML = String(score);
  levelNode.innerHTML = String(level); 
}
 /**
   * delete and free elements in array.  
   * @param array the given array. 
   * @param element the element is going be deleted. 
   * @returns 
   */
function deleteElementInArray<T>(array:T[], element: T):void {
  const index = array.indexOf(element);
  if (index > -1) {
    delete array[index];
    array.splice(index, 1); 
  }
}

// the following simply runs your asteroids function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    asteroids();
  }