import Matter from 'matter-js';
import debounce from 'debounce';
import { animationInterval } from './animation-interval';

export const createGGEngine = ({
  wWidth,
  wHeight,
  config,
  debug,
  useMouse,
}) => {
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Body = Matter.Body;
  const Events = Matter.Events;
  const Bodies = Matter.Bodies;
  const MouseConstraint = useMouse ? Matter.MouseConstraint : undefined;
  const Mouse = useMouse ? Matter.Mouse : undefined;
  const Composite = Matter.Composite;

  const gravityController = new AbortController();

  // create an engine
  const engine = Engine.create();
  const world = engine.world;
  engine.gravity.x = 0;
  engine.gravity.y = 0;

  // create a renderer
  const render = Render.create({
    element: debug ? document.querySelector('body') : undefined,
    engine: engine,
    options: {
      width: wWidth,
      height: wHeight,
      wireframes: false,
      showVelocity: true,
    },
  });

  // create boxes and bounds
  const positiveBoxes = config.ggPositiveHalosConfig.map((box) => {
    return Bodies.rectangle(
      box.physic.x,
      box.physic.y,
      box.physic.w,
      box.physic.h,
      {
        density: box.physic.density,
        friction: box.physic.friction,
        render: {
          fillStyle: '#333333',
        },
      }
    );
  });

  const negativeBoxes = config.ggNegativeHalosConfig.map((box) => {
    return Bodies.rectangle(
      box.physic.x,
      box.physic.y,
      box.physic.w,
      box.physic.h,
      {
        density: box.physic.density,
        friction: box.physic.friction,
        render: {
          fillStyle: '#e6e6e6',
        },
      }
    );
  });

  const bounds = [
    [wWidth * 0.5, 0, wWidth, 1],
    [wWidth * 0.5, wHeight, wWidth, 1],
    [0, wHeight * 0.5, 1, wHeight],
    [wWidth, wHeight * 0.5, 1, wHeight],
  ].map((rect) => Bodies.rectangle(...rect, { isStatic: true }));

  // add all of the bodies to the world
  Composite.add(engine.world, [...positiveBoxes, ...negativeBoxes, ...bounds]);

  let mouseConstraint = undefined;

  if (useMouse) {
    // add mouse control
    const mouse = Mouse.create(render.canvas);
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    mouseConstraint.mouse.element.removeEventListener(
      'mousedown',
      mouseConstraint.mouse.mousedown
    );

    Composite.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;
  }

  // run the renderer
  Render.run(render);

  // create runner
  const runner = Runner.create();

  if (useMouse) {
    // mouve mouse box
    Events.on(
      mouseConstraint,
      'mousemove',
      debounce((event) => {
        const weight = 0.5;
        const newGravity =
          (Math.abs(
            event.mouse.position.x / wWidth + event.mouse.position.y / wHeight
          ) /
            2) *
          weight;
        // quadrant 1
        if (
          event.mouse.position.x > wWidth * 0.5 &&
          event.mouse.position.y < wHeight * 0.5
        ) {
          engine.gravity.x = -newGravity;
          engine.gravity.y = newGravity;
        }

        // quadrant 2
        if (
          event.mouse.position.x < wWidth * 0.5 &&
          event.mouse.position.y < wHeight * 0.5
        ) {
          engine.gravity.x = newGravity;
          engine.gravity.y = newGravity;
        }

        // quadrant 3
        if (
          event.mouse.position.x < wWidth * 0.5 &&
          event.mouse.position.y > wHeight * 0.5
        ) {
          engine.gravity.x = newGravity;
          engine.gravity.y = -newGravity;
        }

        // quadrant 4
        if (
          event.mouse.position.x > wWidth * 0.5 &&
          event.mouse.position.y > wHeight * 0.5
        ) {
          engine.gravity.x = -newGravity;
          engine.gravity.y = -newGravity;
        }
      }),
      500
    );
  }

  Events.on(runner, 'afterTick', (event) => {
    // set angular velocity
    positiveBoxes.forEach((box) => {
      Body.setAngularVelocity(box, -0.01);
    });

    negativeBoxes.forEach((box) => {
      Body.setAngularVelocity(box, 0.03);
    });
  });

  // run the engine
  Runner.run(runner, engine);

  animationInterval(
    config.gravityUpdateRate,
    gravityController.signal,
    (time) => {
      const gravity = engine.gravity;
      gravity.x = (1 - Math.random() * 2) * config.gravityWeight;
      gravity.y = (1 - Math.random() * 2) * config.gravityWeight;

      // apply force
      positiveBoxes.forEach((box) => {
        Body.applyForce(
          box,
          { x: box.position.x, y: box.position.y },
          { x: Math.random() * 0.005, y: Math.random() * 0.005 }
        );
      });
    }
  );

  return { positiveBoxes, negativeBoxes, engine };
};
