import Matter from 'matter-js';

export const createGGEngine = ({
  wWidth,
  wHeight,
  ggPositiveHalosConfig,
  ggNegativeHalosConfig,
  debug,
}) => {
  console.log(debug);
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

  // create an engine
  var engine = Engine.create(),
    world = engine.world;
  engine.gravity.x = 0;
  engine.gravity.y = 0;

  // create a renderer
  var render = Render.create({
    element: debug ? document.querySelector('body') : undefined,
    engine: engine,
    options: {
      width: wWidth,
      height: wHeight,
    },
  });

  // create boxes and bounds
  const positiveBoxes = ggPositiveHalosConfig.map((box) => {
    return Bodies.rectangle(
      box.physic.x,
      box.physic.y,
      box.physic.w,
      box.physic.h,
      {
        density: box.physic.density,
        friction: box.physic.friction,
      }
    );
  });

  const negativeBoxes = ggNegativeHalosConfig.map((box) => {
    return Bodies.rectangle(
      box.physic.x,
      box.physic.y,
      box.physic.w,
      box.physic.h,
      {
        density: box.physic.density,
        friction: box.physic.friction,
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

  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  return { positiveBoxes, negativeBoxes, engine };
};
