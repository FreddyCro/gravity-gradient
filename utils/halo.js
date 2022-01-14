const setStyle = (el, style) => {
  Object.keys(style).forEach((e) => {
    el.style[e] = style[e];
  });
};

const setContainer = (parent, id, style) => {
  const ggContainerEl = document.createElement('div');
  ggContainerEl.id = id;
  setStyle(ggContainerEl, style);
  parent.appendChild(ggContainerEl);

  return document.querySelector(`#${id}`);
};

const setHalos = (config, container, { className, commonStyle }) => {
  return config.map((e, i) => {
    const ggHaloEl = document.createElement('div');
    ggHaloEl.className = `${className} ${className}--${i + 1}`;
    setStyle(ggHaloEl, commonStyle);
    setStyle(ggHaloEl, e.style);
    container.appendChild(ggHaloEl);

    return document.querySelector(`.${className}--${i + 1}`);
  });
};

// {start, lowBound, upBound, step}
const rotateLoop = ({ start, lowBound, upBound, step }) => {
  const newStep = Math.random() * step;

  return start + newStep <= upBound ? start + newStep : lowBound;
};

const swingFlag = {};

const swingLoop = ({ key, start, lowBound, upBound, step }) => {
  if (!Object.prototype.hasOwnProperty.call(swingFlag, key))
    swingFlag[key] = true;

  const newStep = Math.random() * step;

  if (swingFlag[key]) {
    if (start + newStep >= upBound) {
      swingFlag[key] = false;
      return upBound;
    } else {
      return start + newStep;
    }
  } else {
    if (start - newStep <= lowBound) {
      swingFlag[key] = true;
      return lowBound;
    } else {
      return start - newStep;
    }
  }
};

export { setStyle, setContainer, setHalos, rotateLoop, swingLoop };
