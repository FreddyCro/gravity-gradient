const wWidth = window.innerWidth;
const wHeight = window.innerHeight;

const config = {
  breakpoint: 1024,
  backgroundColor: '#F5F5F5',
  gravityWeight: 0.05,
  boxesUpdateRate: 50,
  gravityUpdateRate: 3000,
  wWidth,
  wHeight,
  // debug: true,
};

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
      x: wWidth * 0.45,
      y: wHeight * (1 - Math.random()),
      w: wWidth * 0.1,
      h: wWidth * 0.1,
      density: 0.002,
      friction: 0.1,
    },
    style: {
      left: '-75vw',
      top: '-75vh',
      width: '100vw',
      height: '90vw',
      borderRadius: '60% 20%',
      background: `radial-gradient(
        #f1a89c,
        rgba(241, 168, 156, 0.8),
        rgba(241, 168, 156, 0.6),
        rgba(241, 168, 156, 0.4),
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
      x: wWidth * 0.55,
      y: wHeight * (1 - Math.random()),
      w: wWidth * 0.1,
      h: wWidth * 0.1,
      density: 0.002,
      friction: 0.1,
    },
    style: {
      left: '-50vw',
      top: '-100vh',
      width: '120vw',
      height: '180vh',
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
      w: wWidth * 0.1,
      h: wWidth * 0.1,
      density: 0.1,
      friction: 0.1,
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
        rgba(245, 245, 245, 0.7),
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

export {
  config,
  ggHaloCommonStyle,
  ggPositiveHalosConfig,
  ggNegativeHalosConfig,
  ggContainerConfig,
};
