import React, { Component } from "react";
import Matter from "matter-js";

class MatterJs extends Component {
  componentDidMount() {
    const {
      Engine,
      Render,
      Runner,
      World,
      Bodies,
      MouseConstraint,
      Mouse,
    } = Matter;

    const engine = Engine.create();
    const world = engine.world;

    const width = 800;
    const height = 600;
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
      Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
      //bottom
      Bodies.rectangle(400, 600, 800, 40, {
        isStatic: true,
      }),
      //left
      Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
      //right
      Bodies.rectangle(800, 300, 40, 600, {
        isStatic: true,
      }),
    ];

    //Random Shapes
    for (let i = 0; i < 20; i++) {
      if (Math.random() > 0.5) {
        World.add(
          world,
          Bodies.rectangle(
            Math.random() * width,
            Math.random() * height,
            50,
            50
          )
        );
      } else {
        World.add(
          world,
          Bodies.circle(Math.random() * width, Math.random() * height, 35, {
              render: {
                fillStyle: 'violet'  
              }
          }) 
        );
      }
    }

    World.add(world, walls);
    World.add(
      world,
      MouseConstraint.create(engine, {
        mouse: Mouse.create(render.canvas),
      })
    );

    Render.run(render);
    Runner.run(Runner.create(), engine);
  }

  render() {
    return <div></div>;
  }
}

export default MatterJs;

// our object shape
//from top left at x=0 y=0         X,  Y, wide, tall
// const shape = Bodies.rectangle(200, 200, 50, 50, {
//     isStatic: true
// })
//add object to the world
// World.add(world, shape)
