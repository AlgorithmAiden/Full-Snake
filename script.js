//setup the canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

//for this code (as in code before this line), I almost always use the same stuff, so its going to stay here

//define the grid size


let gx, gy, bx, by

let targetBlockSize = 25

//fix the grid
function resizeGrid() {
    gx = Math.floor(canvas.width / targetBlockSize)
    gy = Math.floor(canvas.height / targetBlockSize)
    bx = canvas.width / gx
    by = canvas.height / gy
}

/**make the canvas always fill the screen**/;
(function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    resizeGrid()
    window.onresize = resize
})()

//and call it to setup
resizeGrid()

//create the apple
let apple = []

function resetApple() {
    apple[0] = Math.floor(Math.random() * gx)
    apple[1] = Math.floor(Math.random() * gy)
    apple[2] = (Math.random() < .1 ? 1 : 0)
}
//and reset it
resetApple()


//resets the whole game
function fullReset() {
    snake = [[Math.round(gx / 2), Math.round(gy / 2)]]
    direction = Math.floor(Math.random() * 4)
    score = 0
    resetApple()
    apple[3] = 0
    ups = 10
}

//create the snake
let snake = [[Math.round(gx / 2), Math.round(gy / 2)]]

//0=up,1=right,2=down,3=left
let direction = Math.floor(Math.random() * 4)

//set the score
let score = 0

//and get the highscore
let highscore = localStorage.getItem('highscore') ?? 0

//listen for keys
document.addEventListener('keydown', e => {
    const key = e.key
    if (key == 'ArrowUp' && direction != 2) direction = 0
    if (key == 'ArrowRight' && direction != 3) direction = 1
    if (key == 'ArrowDown' && direction != 0) direction = 2
    if (key == 'ArrowLeft' && direction != 1) direction = 3
})

//the logic loop
let ups = 10
    ;
(function logic() {

    //move sometimes
    let move = true
    let cooldown = false


    //check for apple eating
    let hit = false
    if (apple[3] > 0) {
        cooldown = true
        apple[3]--
    } else
        for (let block of snake)
            if (block[0] == apple[0] && block[1] == apple[1])
                hit = true

    //this will be changed to run if it would hit an apple next run
    if (hit || cooldown) {
        score++
        if (score > highscore) {
            localStorage.setItem('highscore', score)
            highscore = score
        }
        move = false
        ups++
        snake.unshift([...snake[0]])
        if (direction == 0) snake[0][1]--
        if (direction == 1) snake[0][0]++
        if (direction == 2) snake[0][1]++
        if (direction == 3) snake[0][0]--
        if (hit) {
            if (apple[2] == 1) apple[3] = 8
            resetApple()
        }
        else apple[3]--
    }

    if (move) {
        //now to move the snake
        let last = [...snake[0]]
        if (direction == 0) snake[0][1]--
        if (direction == 1) snake[0][0]++
        if (direction == 2) snake[0][1]++
        if (direction == 3) snake[0][0]--
        for (let index = 1; index < snake.length; index++) {
            ;
            [snake[index], last] = [last, [...snake[index]]]
        }

    }

    //check for self hits
    hit = false
    for (let index = 0; index < snake.length - 1; index++) {
        for (let subIndex = index + 1; subIndex < snake.length; subIndex++) {
            const a = snake[index]
            const b = snake[subIndex]
            if (a[0] == b[0] && a[1] == b[1]) hit = true
        }
    }
    if (hit) fullReset()

    //now to check if the snake goes off the screen
    for (let block of snake)
        if (block[0] < 0 || block[1] < 0 || block[0] >= gx || block[1] >= gy)
            fullReset()

    setTimeout(logic, 1000 / ups)
})()
    ;
(function render() {

    //setup the glow
    ctx.shadowBlur = targetBlockSize * 2

    //clear the screen
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, gx * bx, gy * by)

    //draw the snake
    ctx.fillStyle = 'rgb(0,255,0)'
    ctx.shadowColor = ctx.fillStyle
    for (let block of snake) {
        ctx.fillRect(block[0] * bx, block[1] * by, bx, by)
    }

    //draw the apple
    ctx.fillStyle = (apple[2] == 0 ? 'rgb(255,0,0)' : 'rgb(0,0,255)')
    ctx.shadowColor = ctx.fillStyle
    ctx.fillRect(apple[0] * bx, apple[1] * by, bx, by)

    //draw the score
    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.shadowColor = 'rgb(0,0,0,0)'
    ctx.font = '25px arial'
    ctx.fillText(`Current score: ${score}`, 0, 25)
    ctx.fillText(`Highscore: ${highscore}`, 0, 50)

    requestAnimationFrame(render)
})()