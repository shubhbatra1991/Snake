/* eslint-disable react-hooks/rules-of-hooks */
import { Fragment, useEffect, useRef, useState } from 'react'

import Apple from '../Assets/apple.jpg'
import useInterval from './useInterval'

//creating constants for our use
const canvasX = 1000
const canvasY = 1000
const initialSnake = [ [ 2, 10 ], [ 2, 10 ] ]
const initialApple = [ 16, 10 ]
const scale = 50
const timeDelay = 100


export default function MainFile() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [ snake, setSnake ] = useState(initialSnake);
	const [ apple, setApple ] = useState(initialApple);
	const [ direction, setDirection ] = useState([ 0, -1 ]);
	const [ delay, setDelay ] = useState<number | null>(null);
	const [ gameOver, setGameOver ] = useState(false);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [ score, setScore ] = useState(0);
    
    useInterval(() => runGame(), delay)
    useEffect(
		() => {
			let fruit = document.getElementById("fruit") as HTMLCanvasElement
			if (canvasRef.current) {
				const canvas = canvasRef.current
				const ctx = canvas.getContext("2d")
				if (ctx) {
					ctx.setTransform(scale, 0, 0, scale, 0, 0)
					ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
					ctx.fillStyle = "#a3d001"
					snake.forEach(([ x, y ]) => ctx.fillRect(x, y, 1, 1))
					ctx.drawImage(fruit, apple[0], apple[1], 1, 1)
				}
			}
		},
		[ snake, apple, gameOver ]
	)

	function handleSetScore() {
		if (score > Number(localStorage.getItem("snakeScore"))) {
			localStorage.setItem("snakeScore", JSON.stringify(score))
		}
	}

	function play() {
		setSnake(initialSnake)
		setApple(initialApple)
		setDirection([ 1, 0 ])
		setDelay(timeDelay)
		setScore(0)
		setGameOver(false)
	}

	function checkCollision(head: number[]) {
		for (let i = 0; i < head.length; i++) {
			if (head[i] < 0 || head[i] * scale >= canvasX) return true
		}
		for (const s of snake) {
			if (head[0] === s[0] && head[1] === s[1]) return true
		}
		return false
	}

	function appleAte(newSnake: number[][]) {
		let coord = apple.map(() => Math.floor(Math.random() * canvasX / scale))
		if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
			let newApple = coord
			setScore(score + 1)
			setApple(newApple)
			return true
		}
		return false
	}

	function runGame() {
		const newSnake = [ ...snake ]
		const newSnakeHead = [ newSnake[0][0] + direction[0], newSnake[0][1] + direction[1] ]
		newSnake.unshift(newSnakeHead)
		if (checkCollision(newSnakeHead)) {
			setDelay(null)
			setGameOver(true)
			handleSetScore()
		}
		if (!appleAte(newSnake)) {
			newSnake.pop()
		}
		setSnake(newSnake)
	}

	function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
		switch (e.key) {
			case "ArrowLeft":
				setDirection([ -1, 0 ])
				break
			case "ArrowUp":
				setDirection([ 0, -1 ])
				break
			case "ArrowRight":
				setDirection([ 1, 0 ])
				break
			case "ArrowDown":
				setDirection([ 0, 1 ])
				break
		}
	}
    
  return (
    <Fragment>
		<h1>The game we love, Snake !!</h1>
        <div onKeyDown={(e) => changeDirection(e)}>
			<img id="fruit" src={Apple} alt="fruit" />
			<canvas className="playArea" ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />
			{gameOver && <div className="gameOver">Game Over</div>}
			<button onClick={play} className="playButton">
				Play
			</button>
			<div className="scoreBox">
				<h2>Score: {score}</h2>
				<h2>High Score: {localStorage.getItem("snakeScore")}</h2>
			</div>
		</div>

    </Fragment>
  )
}
