import { animationInterval } from './utils/animation-interval';
import { createGGEngine } from './utils/gg-engine';
import { setContainer, setHalos, rotateLoop, swingLoop } from './utils/halo';

// config
const config = {
  breakpoint: 1024,
  backgroundColor: '#F5F5F5',
  gravityWeight: 0.15,
  boxesUpdateRate: 50,
  gravityUpdateRate: 3000,
};

const wWidth = window.innerWidth;
const wHeight = window.innerHeight;

const ggHaloCommonStyle = {
  position: 'absolute',
  willChange: 'transform',
  transformStyle: 'preserve-3d',
  boxSizing: 'border-box',
  opacity: 0.8,
};

const ggPositiveHalosConfig = [
  {
    physic: {
      x: wWidth * 0.1,
      y: wHeight * (1 - Math.random()),
      w: wWidth * 0.2,
      h: wWidth * 0.2,
      density: 0.002,
      friction: 0.5,
    },
    style: {
      left: '-75vw',
      top: '-75vh',
      width: '150vw',
      height: '150vh',
      borderRadius: '80% 20% 60%',
      background: `radial-gradient(
        #f1a89c,
        rgba(241, 168, 156, 0.6),
        rgba(241, 168, 156, 0.5),
        rgba(241, 168, 156, 0),
        rgba(241, 168, 156, 0),
        rgba(241, 168, 156, 0),
        rgba(241, 168, 156, 0)
      )`,
      filter: 'none',
    },
    var: {
      rotate: 0,
      scale: 1,
      opacity: 0.8,
    },
  },
  {
    physic: {
      x: wWidth * 0.9,
      y: wHeight * (1 - Math.random()),
      w: wWidth * 0.2,
      h: wWidth * 0.2,
      density: 0.1,
      friction: 0.2,
    },
    style: {
      left: '-50vw',
      top: '-100vh',
      width: '100vw',
      height: '200vh',
      borderRadius: '20% 100% 40%',
      background: `radial-gradient(
        rgba(254, 209, 53, 0.72),
        rgba(254, 209, 53, 0.6),
        rgba(254, 209, 53, 0.5),
        rgba(254, 209, 53, 0),
        rgba(254, 209, 53, 0),
        rgba(254, 209, 53, 0),
        rgba(254, 209, 53, 0)
      )`,
      filter: 'none',
    },
    var: {
      rotate: 0,
      scale: 1,
      opacity: 0.6,
    },
  },
];

const ggNegativeHalosConfig = [
  {
    physic: {
      x: wWidth * 0.5,
      y: wHeight * (1 - Math.random()),
      w: wWidth * 0.4,
      h: wWidth * 0.4,
      density: 0.01,
      friction: 0,
    },
    style: {
      zIndex: 2,
      left: '-50vw',
      top: '-50vh',
      width: '100vw',
      height: '100vh',
      borderRadius: '50% 70% 90% 10%',
      background: `radial-gradient(
        ${config.backgroundColor},
        rgba(245, 245, 245, 0.6),
        rgba(245, 245, 245, 0),
        rgba(245, 245, 245, 0)
      )`,
    },
    var: {
      rotate: 0,
      scale: 1,
      opacity: 0.7,
    },
  },
];

const ggContainerConfig = {
  style: {
    position: 'fixed',
    left: 0,
    right: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: config.backgroundColor,
    overflow: 'hidden',
  },
};

// main
const main = () => {
  window.addEventListener(
    'load',
    () => {
      const root = document.querySelector('#gg-halo');
      const ggContainer = setContainer(
        root,
        'gg-container',
        ggContainerConfig.style
      );

      const positiveHalos = setHalos(ggPositiveHalosConfig, ggContainer, {
        className: 'gg-positive-halo',
        commonStyle: ggHaloCommonStyle,
      });
      const negativeHalos = setHalos(ggNegativeHalosConfig, ggContainer, {
        className: 'gg-negative-halo',
        commonStyle: ggHaloCommonStyle,
      });

      const { positiveBoxes, negativeBoxes, engine } = createGGEngine({
        wWidth,
        wHeight,
        ggPositiveHalosConfig,
        ggNegativeHalosConfig,
      });

      const boxesController = new AbortController();
      const gravityController = new AbortController();

      animationInterval(
        config.boxesUpdateRate,
        boxesController.signal,
        (time) => {
          [
            {
              config: ggPositiveHalosConfig,
              halos: positiveHalos,
              boxes: positiveBoxes,
            },
            {
              config: ggNegativeHalosConfig,
              halos: negativeHalos,
              boxes: negativeBoxes,
            },
          ].forEach((item, boxesIndex) => {
            item.config.forEach((e, i) => {
              const halo = item.halos[i];
              const x = item.boxes[i].position.x;
              const y = item.boxes[i].position.y;

              e.var.rotate = rotateLoop({
                start: e.var.rotate,
                lowBound: 0,
                upBound: 360,
                step: 1,
              });

              e.var.scale = swingLoop({
                key: `${boxesIndex}-${i}`,
                start: e.var.scale,
                lowBound: 0.6,
                upBound: 1,
                step: 0.001,
              });

              e.var.opacity = swingLoop({
                key: `${boxesIndex}-${i}`,
                start: e.var.opacity,
                lowBound: 0.5,
                upBound: 0.8,
                step: 0.001,
              });

              halo.style.transform = `translate(${x}px, ${y}px) rotate(${e.var.rotate}deg) scale(${e.var.scale})`;

              halo.style.opacity = e.var.opacity
            });
          });
        }
      );

      animationInterval(
        config.gravityUpdateRate,
        gravityController.signal,
        (time) => {
          const gravity = engine.gravity;
          gravity.x = (1 - Math.random() * 2) * config.gravityWeight;
          gravity.y = (1 - Math.random() * 2) * config.gravityWeight;
        }
      );
    },
    false
  );
};

main();
