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
        <div> ${toBeSorted[i].name}: ${toBeSorted[i].score} </div>
        `
      }
    })
  }

  console.log(toBeSorted);

  function gameOver() {
    if (bY >= 490) {
      gameO = true
    }
  }


  function draw() {
    ctx.drawImage(bg, 0, 0, 500, 500)
    ctx.drawImage(bird, bX, bY, 50, 50);
    bY += gravity

    for (let i = 0; i < pipe.length; i++) {
      let newSpeed = pipe[i].x - speed
      pipe[i].x = newSpeed
      ctx.drawImage(nPipe, pipe[i].x, pipe[i].y1);
      ctx.drawImage(sPipe, pipe[i].x, pipe[i].y2);

      if (pipe[i].x == -250 && birdDead == false) {
        score++;
        scoreSound.play()
      }

      if (gameO == true) {
        ctx.drawImage(image, 170, 170, 150, 150)
      }

      if (((pipe[i].x == 60 && ((bY <= (242 + pipe[i].y1)) || (bY >= pipe[i].y2))) || bY >= 490) && birdDead == false) {
        bird.src = 'deadBird.png'
        gravity = 5
        birdDead = true
        gameO = true

        nameForm.style.display = 'block';
      }

      if (pipe[i].x == 250) {
        let y1 = -(Math.random() * 200)
        let y2 = (Math.random() * (400 - 125) + 125)

        if (Math.abs(y1 - y2) < 350) {
          gap = (350 - Math.abs(y1 - y2))
          y2 = y2 + gap
        }

        let data = {
          x: pX,
          y1: y1,
          y2: y2
        }

        pipe.push(data)
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
      YOUR SCORE: ${score} <br><br>
      Scores cannot be fetched or saved as the backend has not been deployed. <br><br>

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
