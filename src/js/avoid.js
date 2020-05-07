function sketch (p) {
  // Array String, Example: "X:Y"
  let traversedPositions = []

  const canvasSize = {
    width: p.windowWidth,
    height: p.windowHeight - 10
  }
  
  const pixelSteps = 10
  
  const maxTraversedPositions = Math.floor((canvasSize.height/pixelSteps) * (canvasSize.width/pixelSteps))

  const roundToNearest = (n) => Math.round(n / pixelSteps) * pixelSteps

  const getRandomNonTraversedPosition = () => {
    let randomX = roundToNearest(p.int(p.random(0, canvasSize.width)))
    let randomY = roundToNearest(p.int(p.random(0, canvasSize.height)))

    while (traversedPositions.includes(`${randomX}:${randomY}`)) {
      randomX = roundToNearest(p.int(p.random(0, canvasSize.width)))
      randomY = roundToNearest(p.int(p.random(0, canvasSize.height)))
    }

    return { x: randomX, y: randomY }
  }

  const calculateNextPosition = ({ previousX, previousY }) => {
    let found
    let x = previousX
    let y = previousY

    const randomOrder = [0, 1, 2, 3].sort(() => Math.random() - 0.5)

    for (let i = 0; i < randomOrder.length; i++) {
      x = previousX
      y = previousY

      let randomNumber = randomOrder[i]

      if (randomNumber === 0) x = previousX + pixelSteps
      else if (randomNumber === 1) x = previousX - pixelSteps
      else if (randomNumber === 2) y = previousY + pixelSteps
      else if (randomNumber === 3) y = previousY - pixelSteps

      let xc = roundToNearest(p.constrain(x, 0, canvasSize.width))
      let yc = roundToNearest(p.constrain(y, 0, canvasSize.height))

      if (!traversedPositions.includes(`${xc}:${yc}`)) {
        found = true
        break
      }
    }

    return found ? { x, y } : false
  }

  p.setup = () => {
    p.createCanvas(canvasSize.width, canvasSize.height)
    p.background(256)
    p.frameRate(60)

    // Randomize starter positions.
    let randomX = roundToNearest(p.int(p.random(0, canvasSize.width)))
    let randomY = roundToNearest(p.int(p.random(0, canvasSize.height)))

    traversedPositions.push(`${randomX}:${randomY}`)
  }
  
  p.draw = () => {
    if (traversedPositions.length < maxTraversedPositions) {
      const [ previousX, previousY ] = traversedPositions[traversedPositions.length - 1].split(':').map(i => Number(i))
      let nextPosition = calculateNextPosition({ previousX, previousY })
      
      if (typeof nextPosition === 'boolean') {
        let randomNextPosition = getRandomNonTraversedPosition()
        if (typeof randomNextPosition === 'boolean') {
  
        }
        else {
          let { x: randomStartingPositionX, y: randomStartingPositionY } = randomNextPosition
          traversedPositions.push(`${randomStartingPositionX}:${randomStartingPositionY}`)
        }
      } else {
        let { x: nextX, y: nextY } = nextPosition
  
        traversedPositions.push(`${nextX}:${nextY}`)
  
        p.stroke(0)
        p.strokeWeight(3)
        p.point(previousX, previousY)
        p.line(previousX, previousY, nextX, nextY)
      }
    } else {
      p.noLoop()
    }
  }
}

let processing = new p5(sketch)
