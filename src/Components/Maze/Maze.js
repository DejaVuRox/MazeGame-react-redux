import React, { Component } from "react";
import Matter from "matter-js";

class Maze extends Component {
  componentDidMount() {
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const engine = Engine.create();
    engine.world.gravity.y = 0;
    const world = engine.world;

    const cells = 10;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const unitLength = width / cells;

    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        wireframes: false,
        width,
        height,
      },
    });

    //Walls
    const walls = [
      //top
      Bodies.rectangle(width / 2, 0, width, 2, {
        isStatic: true,
      }),
      //bottom
      Bodies.rectangle(width / 2, height, width, 2, {
        isStatic: true,
      }),
      //left
      Bodies.rectangle(0, height / 2, 2, height, {
        isStatic: true,
      }),
      //right
      Bodies.rectangle(width, height / 2, 2, height, {
        isStatic: true,
      }),
    ];

    World.add(world, walls);

    //Mage generation:

    //Shuffle Maze
    const shuffle = (arr) => {
      let counter = arr.length;

      while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
      }
      return arr;
    };

    //create a 3 empty array 'Array'.
    //then use 'fill' to insert initial value.
    //then use 'map' to replace null with new array and value 'false' this will prevent adding new array
    const grid = Array(cells)
      .fill(null)
      .map(() => Array(cells).fill(false));

    const verticals = Array(cells) // <- outer array
      .fill(null)
      .map(() => Array(cells - 1).fill(false));

    const horizontals = Array(cells - 1) // <-outer array
      .fill(null)
      .map(() => Array(cells).fill(false));

    const startRow = Math.floor(Math.random() * cells);
    const startColumn = Math.floor(Math.random() * cells);

    const stepThroughCell = (row, column) => {
      //if cell is visited [row,column], then return
      if (grid[row][column]) {
        // boolean statement
        return;
      }

      // mark cell as visited
      grid[row][column] = true;

      // assemble randomly-ordered list of neighbors
      const neighbors = shuffle([
        [row - 1, column, "up"],
        [row, column + 1, "right"],
        [row + 1, column, "down"],
        [row, column - 1, "left"],
      ]);

      //For each neighbor
      for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;
        //check if neighbor is out of bounds (going out side the maze)
        if (
          nextRow < 0 ||
          nextRow >= cells ||
          nextColumn < 0 ||
          nextColumn >= cells
        ) {
          continue;
        }
        //check if we visited the neighbor,continue to next neighbor
        if (grid[nextRow][nextColumn]) {
          continue;
        }
        // remove wall either horizontals or verticals
        //Verticals:
        if (direction === "left") {
          verticals[row][column - 1] = true;
        } else if (direction === "right") {
          verticals[row][column] = true;
        }
        //Horizontals:
        else if (direction === "up") {
          horizontals[row - 1][column] = true;
        } else if (direction === "down") {
          horizontals[row][column] = true;
        }
        stepThroughCell(nextRow, nextColumn);
      }
    };

    stepThroughCell(startRow, startColumn);

    horizontals.forEach((row, rowIndex) => {
      row.forEach((open, columnIndex) => {
        if (open) {
          return;
        }
        const wall = Bodies.rectangle(
          columnIndex * unitLength + unitLength / 2,
          rowIndex * unitLength + unitLength,
          unitLength,
          5,
          {
            label: 'wall',
            isStatic: true,
          }
        );
        World.add(world, wall);
      });
    });

    verticals.forEach((row, rowIndex) => {
      row.forEach((open, columnIndex) => {
        if (open) {
          return;
        }
        const wall = Bodies.rectangle(
          columnIndex * unitLength + unitLength,
          rowIndex * unitLength + unitLength / 2,
          5,
          unitLength,
          {
            label: 'wall',
            isStatic: true,
          }
        );
        World.add(world, wall);
      });
    });

    //Goal
    const goal = Bodies.rectangle(
      width - unitLength / 2,
      height - unitLength / 2,
      unitLength * 0.7, // to adjust to different maze sizes
      unitLength * 0.7,
      {
        label: "goal",
        isStatic: true,
      }
    );
    World.add(world, goal);

    //Ball
    const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength / 4, {
      label: "ball",
    });
    World.add(world, ball);
    document.addEventListener("keydown", (e) => {
      const { x, y } = ball.velocity;
      if (e.keyCode === 87) {
        //Negative Velocity to move up
        Body.setVelocity(ball, { x, y: -5 });
      }
      //right
      if (e.keyCode === 68) {
        Body.setVelocity(ball, { x: +5, y });
      }
      //down
      if (e.keyCode === 83) {
        Body.setVelocity(ball, { x, y: +5 });
      }
      //left
      if (e.keyCode === 65) {
        Body.setVelocity(ball, { x: -5, y });
      }
    });

    //Win
    Events.on(engine, "collisionStart", (e) => {
      e.pairs.forEach((collision) => {
        const labels = ["ball", "goal"];
        if (
          labels.includes(collision.bodyA.label) &&
          labels.includes(collision.bodyB.label)
        ) {
          world.gravity.y = 1
          world.bodies.forEach(body => {
            if (body.label === 'wall') {
              Body.setStatic(body, false)
            }
          })
        }
      });
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);
  }

  render() {
    return <div></div>;
  }
}

export default Maze;
