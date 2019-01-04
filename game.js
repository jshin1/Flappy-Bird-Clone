  const cvs = document.getElementById('canvas')

  const ctx = canvas.getContext('2d')

  let nameForm = document.getElementById('nameForm')
  let playerName = document.getElementById('input')
  let leaderboard = document.getElementById('leaders')

  const bird = new Image();
  const bg = new Image();
  const nPipe = new Image();
  const sPipe = new Image();
  const image = new Image();

  const flySound = new Audio();
  const scoreSound = new Audio();
  flySound.src = 'fly.mp3';
  scoreSound.src = 'score.mp3';

  let score = 0;
  let birdDead = false;
  let gameO = false;
  let speed = 2

  let bX = 10;
  let bY = 150;
  let pX = cvs.width;
  let pY = 240;
  let pipe = []

  pipe[0] = {
    x : pX,
    y : 0
  }

  let gravity = 1;
  let gap = 100;


  bird.src = 'frame-1.png'
  bg.src = 'bg.png'
  bird.id = 'bird'
  nPipe.src = 'pipeNorth.png'
  sPipe.src = 'pipeSouth.png'
  image.src = 'gameover.png'

  // function changeBird() {
  //   ird.src = 'deadBird.png'
  //   gravity = 5
  //   birdDead = true
  // }

  let localData = ""
  let toBeSorted = []

  function getData() {
    fetch('http://localhost:3000/api/v1/players')
    .then(response => response.json())
    .then(data => {
      localData = data

      localData.forEach(d => {
        toBeSorted.push({'name': d.name, 'score': d.score})
      })
      toBeSorted.sort((a, b) =>
        b.score - a.score
      )

      for (let i = 0; i < 5; i++) {
        console.log(toBeSorted);
        leaderboard.innerHTML += `
        <li> ${toBeSorted[i].name}: ${toBeSorted[i].score} </li>
        `
      }
    })
  }

  console.log(toBeSorted);

  function gameOver() {
    if (bY >= 490) {
      gameO = true
      // alert('GAME OVER')
    }
  }


  function draw() {
    ctx.drawImage(bg, 0, 0, 500, 500)
    ctx.drawImage(bird, bX, bY, 50, 50);
    bY += gravity

    for (let i = 0; i < pipe.length; i++) {
      let newSpeed = pipe[i].x - speed
      // console.log(newSpeed)
      pipe[i].x = newSpeed
      ctx.drawImage(nPipe, pipe[i].x, pipe[i].y1);
      ctx.drawImage(sPipe, pipe[i].x, pipe[i].y2);

      // ctx.drawImage(nPipe, pipe[i].x, 0);
      // ctx.drawImage(sPipe, pipe[i].x, 350);
      // pX--

      //

      if (pipe[i].x == -250 && birdDead == false) {
        score++;
        scoreSound.play()
        // console.log("SPEEDING UP")
        // speed = score%3 + 1
        // console.log(bird.x, bX, bY);
      }

      if (gameO == true) {
        ctx.drawImage(image, 170, 170, 150, 150)
      }

      if (((pipe[i].x == 60 && ((bY <= (242 + pipe[i].y1)) || (bY >= pipe[i].y2))) || bY >= 490) && birdDead == false) {
        // console.log('bird dead')
        bird.src = 'deadBird.png'
        gravity = 5
        birdDead = true
        gameO = true

        nameForm.style.display = 'block';


        //
        // if (bY >= 500) {
        //   console.log('GAME OVER');
        // }

        // setInterval(gameOver, 10)

      }

      if (pipe[i].x == 250) {
        let y1 = -(Math.random() * 200)
        let y2 = (Math.random() * (400 - 125) + 125)

        if (Math.abs(y1 - y2) < 350) {
          gap = (350 - Math.abs(y1 - y2))
          y2 = y2 + gap
          // console.log(y2);
        }

        let data = {
          x: pX,
          y1: y1,
          y2: y2
        }

        pipe.push(data)

        // if (i > 4) {
        //   speed = 3
        // }

        // speed = i%3 + 1

        // if (pipe[i].y1 + pipe[i].y2 <= 500) {
        //   pipe[i].y2 + 300
        // }



        //  = {
        //   x: cvs.width,
        //   y: Math.floor(50 + pY)
        // };
        // ctx.drawImage(nPipe, pX, 10 );
        // ctx.drawImage(sPipe, pX, pY + 100);
        // pX--

      }
    }

    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: "+score, 8, 20);

    requestAnimationFrame(draw);


  }

  draw()

  function flap() {
    bird.src = 'frame-1.png'
    flySound.play()
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && birdDead == false) {
      setTimeout(flap, 100)
      bY -= 20;
      bird.src = 'frame-3.png'
    }
  })

  document.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.type == 'button') {
      leaderboard.innerHTML += `
      YOUR SCORE: ${score} <br>
      How does it compare with the best? <br>
      `
      leaderboard.style.display = 'block';
      fetch('http://localhost:3000/api/v1/players', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playerName.value,
          score: score
        })
      })
      .then(getData)
    }
  })

  // bird.onload = () => {
  //   ctx.drawImage(bird, 10, 20)
  //   ctx.drawImage(bg, 10, 20)
  //
  // }
