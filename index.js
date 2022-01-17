import { animationInterval } from './src/animation-interval';
import { createGGEngine } from './src/gg-engine';
import { setContainer, setHalos, rotateLoop, swingLoop } from './src/halo';
import {
  config,
  ggHaloCommonStyle,
  ggPositiveHalosConfig,
  ggNegativeHalosConfig,
  ggContainerConfig,
} from './src/config';

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
        wWidth: config.wWidth,
        wHeight: config.wHeight,
        ggPositiveHalosConfig,
        ggNegativeHalosConfig,
        debug: config.debug,
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
              halo.style.opacity = e.var.opacity;
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
