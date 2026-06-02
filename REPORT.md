# Project Report: Snake Game

## Project Description

The Snake Game project is a lightweight interactive web game implemented with core web technologies: HTML, CSS, and JavaScript. The objective is to move the snake around the grid, collect food, and avoid collisions.

## Objectives

- Create a playable game using only basic front-end code
- Implement responsive canvas rendering and user input handling
- Provide game state feedback through score and messages

## Implementation Details

- `index.html`: sets up the page structure, canvas, score display, and control buttons.
- `styles.css`: defines a dark-themed interface, responsive canvas styling, and button aesthetics.
- `script.js`: contains the main game engine:
  - Snake is represented as an array of grid segments.
  - Movement direction is updated from keyboard events.
  - Food is randomly placed on empty cells.
  - Collision checks handle wall hits and self-intersections.
  - Score increases when food is eaten and speed gradually increases.

## User Experience

- Users start the game with the **Start Game** button.
- The score updates instantly on food pickup.
- A message panel provides status updates and game over messages.
- The **Restart** button resets the game state cleanly.

## Future Improvements

- Add sound effects for eating food and game over
- Implement touch controls for mobile devices
- Add levels or difficulty modes
- Store high scores in local storage
- Add a countdown or timer

## Conclusion

This simple Snake game is an effective demonstration of canvas-based rendering and event-driven JavaScript. It can be extended further into a richer browser game with animations, mobile support, and persistent scoring.
