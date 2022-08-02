// Importing Sound Effects
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

introMusic.play();

// setting canvas , basics
const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas)
canvas.width = innerWidth;//setting window width as canvas width
canvas.height = innerHeight;

// weapons category
const lightDamageWeapon = 10
const heavyDamageWeapon = 20


const context = canvas.getContext('2d');//to tell we're gonna use 2D shapes
// fixing player position as center
const playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}
// setting difficulty 
let difficulty = 2;
const scoreBoard = document.querySelector(".scoreBoard")
let playerScore = 0;
const form = document.querySelector("form")
document.querySelector("#difficultyInput").addEventListener("click", (e) => {
    e.preventDefault();

    introMusic.pause();//pause intro music

    // removing Initial options, start playing the game
    form.style.display = "none";
    scoreBoard.style.display = "block";
    // getting option chosed
    let userValue = document.querySelector("#difficulty").value;
    if (userValue === "Easy") {
        setInterval(spawnEnemy, 2000);
        difficulty = 5;
        return
    }
    else if (userValue === "Medium") {
        setInterval(spawnEnemy, 1400);
        difficulty = 8;
        return
    }
    else if (userValue === "Hard") {
        setInterval(spawnEnemy, 1000);
        difficulty = 10;
        return
    }
    else {
        setInterval(spawnEnemy, 700);
        difficulty = 12;
        return
    }
})




// classes and objects
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        context.beginPath()
        //to draw new canvas/shape , so each shape is not connected to each other
        context.arc(this.x, this.y, this.radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
        //context.stroke()stroke is for outline or border
        context.fillStyle = this.color;
        context.fill()
    }
    update() {
        this.x += Math.random() * 10;
        this.y += Math.random() * 10;
    }
}
// weapons
class Weapons {
    constructor(x, y, radius, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage
    }
    draw() {
        context.beginPath()
        //to draw new canvas/shape , so each shape is not connected to each other
        context.arc(this.x, this.y, this.radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
        //context.stroke()stroke is for outline or border
        context.fillStyle = this.color;
        context.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
// special weapon class( a rectangle)
class SpecialWeapon {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    draw() {
        context.beginPath()
        //to draw new rectangle 
        context.rect(this.x, this.y, 200, canvas.height)
        context.fillStyle = this.color;
        context.fill()
    }
    update() {
        this.draw()
        this.x += 20;
    }
}
// enemy
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        context.beginPath()
        //to draw new canvas/shape , so each shape is not connected to each other
        context.arc(this.x, this.y, this.radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
        //context.stroke()stroke is for outline or border
        context.fillStyle = this.color;
        context.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
// Particles
const friction = 0.99;//for  decreasing particle'S speed after blowning it 
class Particles {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;//similar to opacity
    }
    draw() {
        context.save()
        context.globalAlpha = this.alpha;
        context.beginPath()
        //to draw new canvas/shape , so each shape is not connected to each other
        context.arc(this.x, this.y, this.radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
        //context.stroke()stroke is for outline or border
        context.fillStyle = this.color;
        context.fill()
        context.restore()
    }
    update() {
        this.draw()
        // decreasing velocity by 1% in each frame
        this.velocity.x *= friction
        this.velocity.y *= friction

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;//to decrease opacity gradually
    }
}

// here my name is 'syed' , so chosen player name to be same 
const syed = new Player(playerPosition.x, playerPosition.y, 20, 'red')
const weapons = []
const enemies = []
const particles = []
const specialWeapons = []
// `rgb(${Math.random()*250},${Math.random()*250},${Math.random()*250})`

function spawnEnemy() {
    // for creating an enemy
    const enemySize = Math.random() * (40 - 5) + 5;
    // only want light colors on dark background
    const enemyColor = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`;//hue, saturation,light, similar to rgb

    let random;//for position
    if (Math.random() < 0.5) {
        // for enemy to come from left /right
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize
            , y: Math.random() * canvas.height
        }
    } else {
        random = {
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
            x: Math.random() * canvas.width
        }
    }
    const myAngle = Math.atan2(canvas.height / 2 - random.y, canvas.width / 2 - random.x)
    const velocity = { x: Math.cos(myAngle) * difficulty, y: Math.sin(myAngle) * difficulty };

    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity))
}

function gameOverLoader() {
    const gameoverBanner=document.createElement("div")
    const gameoverBtn=document.createElement("button")
    const highScore=document.createElement("div")

    gameoverBtn.innerHTML="Play Again";
    // Set high score from local storage if it is there
    highScore.innerHTML=`High Score : ${localStorage.getItem("highScore")?localStorage.getItem("highScore"):playerScore}`;

    const oldHighScore=localStorage.getItem("highScore")&&localStorage.getItem("highScore");
    if (oldHighScore<playerScore) {
        localStorage.setItem("highScore",playerScore)
        highScore.innerHTML=`High Score :${playerScore}`
    }

    gameoverBanner.appendChild(highScore)
    gameoverBanner.appendChild(gameoverBtn)
    // to give  option to play game again
    gameoverBtn.addEventListener("click",()=>{
        window.location.reload()
    })

    gameoverBanner.classList.add("gameOver")

    document.querySelector("body").appendChild(gameoverBanner)
}



let animationId;//to end the animation of frames after game over
function animation() {
    animationId = requestAnimationFrame(animation)

    // instead of clearing old frames, fade them a lit bit
    context.fillStyle = `rgba(49,49,49,0.2)`
    context.fillRect(0, 0, canvas.width, canvas.height)
    // context.clearRect(0, 0, canvas.width, canvas.height)//Erase all canvasses in each frame except middle one

    syed.draw();
    // generating bullets 
    weapons.forEach((weapon, weaponIndex) => {
        weapon.update()
        // removing unused weapons that go out of the frame from weapons array
        if (weapon.x + weapon.radius < 1 || weapon.y + weapon.radius < 1 || weapon.x - canvas.width > 1 || weapon.y - canvas.height > 1) {
            weapons.splice(weaponIndex, 1)
        }

    });
    // generating huge weapon
    specialWeapons.forEach((specialWeapon, specialWeaponIndex) => {

        // removing unused weapons that go out of the frame from weapons array
        if (specialWeapon.x > canvas.width) {
            specialWeapons.splice(specialWeaponIndex, 1)
        } else {

            specialWeapon.update()
        }
        console.log(specialWeapons)
    })

    //generating particles 
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1)
        }
        else {
            particle.update()
        }
    })


    // creating enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update()
        // player and enemy touched each other, gameOver!!
        const distanceBetweenEnemyAndPlayer = Math.hypot(syed.x - enemy.x, syed.y - enemy.y);
        if (distanceBetweenEnemyAndPlayer - enemy.radius - syed.radius < 1) {
            cancelAnimationFrame(animationId)
            // clear all sounds, except gameOver sound
            gameOverSound.play();
            hugeWeaponSound.pause();
            shootingSound.pause();
            heavyWeaponSound.pause();
            killEnemySound.pause();
            return gameOverLoader()
        }

        // weapon and enemy touched each other
        weapons.forEach((weapon, weaponIndex) => {
            const distanceBetweenEnemyAndWeapon = Math.hypot(weapon.x - enemy.x, weapon.y - enemy.y);

            if (distanceBetweenEnemyAndWeapon - enemy.radius - weapon.radius < 1) {
                killEnemySound.play();
                // Reducing enemy size on single hit if size is too much
                if (enemy.radius >= weapon.damage) {
                    // for smooth transitioning of enemy radius
                    gsap.to(enemy, {
                        radius: enemy.radius - weapon.damage
                    })
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1)
                    }, 0);
                } else {
                    for (let i = 0; i < enemy.radius * 3; i++) {
                        particles.push(new Particles(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                            x: (Math.random() - 0.5) * (Math.random() * 5),
                            y: (Math.random() - 0.5) * (Math.random() * 5)
                        }))
                    }
                    // for faster rendering 
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1)
                        enemies.splice(enemyIndex, 1)
                    }, 0);
                    // increasing score after killing enemy
                    playerScore += 10
                    scoreBoard.innerHTML = `Score Board : ${playerScore}`;
                }

            }
        })

        // for special weapon to all erase enemies
        specialWeapons.forEach((specialWeapon) => {
            const specialWeaponDistanceFromEnemy = specialWeapon.x - enemy.x;
            if (specialWeaponDistanceFromEnemy <= 200 && specialWeaponDistanceFromEnemy >= -200) {
                killEnemySound.play();

                setTimeout(() => {
                    enemies.splice(enemyIndex, 1)
                }, 0);
                // increasing score after killing enemy
                playerScore += 10
                scoreBoard.innerHTML = `Score Board : ${playerScore}`;
            }
        })
    });
}

// for light weapon aka left click
canvas.addEventListener("click", (e) => {

    shootingSound.play();

    const myAngle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2)
    const velocity = { x: Math.cos(myAngle) * 5, y: Math.sin(myAngle) * 5 };
    weapons.push(new Weapons(canvas.width / 2, canvas.height / 2, 6, "white", velocity, lightDamageWeapon))
    // console.log(weapons)
})
// for heavy weapon aka right click
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    if (playerScore < 2) return;// to use heavy weapon player score should be minimum 2
    heavyWeaponSound.play();

    playerScore -= 2;
    scoreBoard.innerHTML = `Score Board : ${playerScore}`;
    const myAngle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2)
    const velocity = { x: Math.cos(myAngle) * 3, y: Math.sin(myAngle) * 3 };
    weapons.push(new Weapons(canvas.width / 2, canvas.height / 2, heavyDamageWeapon, "cyan", velocity, heavyDamageWeapon))
    // console.log(weapons)
})
// for Special Weapon aka spacebar 
addEventListener("keypress", (e) => {
    if (e.key === " ") {
        if (playerScore < 20) return;// to use heavy weapon player score should be minimum 2
        hugeWeaponSound.play();

        playerScore -= 20;
        scoreBoard.innerHTML = `Score Board : ${playerScore}`;
        specialWeapons.push(new SpecialWeapon(0, 0, "green"))
    }
})
// so that right click is not allowed on  screen after gameOver
addEventListener("contextmenu", (e) => {
    e.preventDefault()
})
// so that on resize canvas also changes its frame size
addEventListener("resize", (e) => {
    // canvas.width=innerWidth;
    // canvas.height=innerHeight
    // above method is not much effective here 
    window.location.reload()
})
animation();