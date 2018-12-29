  const cvs = document.getElementById('canvas')

  const ctx = canvas.getContext('2d')

  const bird = new Image();
  const bg = new Image();
  const nPipe = new Image();
  const sPipe = new Image();

  let bX = 10;
  let bY = 150;
  let pX = cvs.width;
  let pY = 240;
  let pipe = []

  pipe[0] = {
    x : pX,
    y : 0
  }

  const gravity = 1;
  let gap = 100;


  bird.src = 'frame-1.png'
  bg.src = 'bg.png'
  bird.id = 'bird'
  nPipe.src = 'pipeNorth.png'
  sPipe.src = 'pipeSouth.png'

  function draw() {
    ctx.drawImage(bg, 0, 0, 500, 500)
    ctx.drawImage(bird, bX, bY, 50, 50);
    bY += gravity
    for (let i = 0; i < pipe.length; i++) {
      ctx.drawImage(nPipe, pipe[i].x, pipe[i].y1);
      ctx.drawImage(sPipe, pipe[i].x, pipe[i].y2);

      // ctx.drawImage(nPipe, pipe[i].x, 0);
      // ctx.drawImage(sPipe, pipe[i].x, 350);
      // pX--
      pipe[i].x--

      //
      if (pipe[i].x == 250) {
        let y1 = -(Math.random() * 200)
        let y2 = (Math.random() * (400 - 125) + 125)

        if (Math.abs(y1 - y2) < 350) {
          gap = (350 - Math.abs(y1 - y2))
          y2 = y2 + gap
          console.log(y2);
        }

        pipe.push({
          x: pX,
          y1: y1,
          y2: y2
        })

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

    requestAnimationFrame(draw);


  }

  draw()

  function flap() {
    bird.src = 'frame-1.png'
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      setTimeout(flap, 100)
      bY -= 20;
      bird.src = 'frame-3.png'
    }
  })

  // bird.onload = () => {
  //   ctx.drawImage(bird, 10, 20)
  //   ctx.drawImage(bg, 10, 20)
  //
  // }
