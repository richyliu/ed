import * as Key from 'src/utils/keylistener';

// react-ace autocomplete doesn't work w/ iPhone userAgent, need to change it
const ua = navigator.userAgent;
Object.defineProperty(navigator, 'userAgent', {
  get() {
    return ua.replace(/iPhone|iPad|iPod/g, 'iNot');
  },
});

// rebind hardware keyboard's arrow keys and escape to correct keyCodes
const keyMaps = [
  { source: 'UIKeyInputDownArrow', to: 40 },
  { source: 'UIKeyInputUpArrow', to: 38 },
  { source: 'UIKeyInputLeftArrow', to: 37 },
  { source: 'UIKeyInputRightArrow', to: 39 },
  { source: 'Escape', to: 27 },
  { source: 'f', to: 37 },
];

setTimeout(() => {
  const aceInput: HTMLElement =
    document.querySelector('.ace_text-input') || (null as any);

  if (aceInput) {
    aceInput.onfocus = () => aceInput.blur();

    keyMaps.forEach((km) =>
      Key.addListener(km.source, (e) => {
        aceInput.dispatchEvent(
          new KeyboardEvent('keydown', {
            keyCode: km.to,
          } as KeyboardEventInit)
        );
        e.preventDefault();
        e.stopPropagation();
      })
    );
  } else {
    alert('unable to set up');
  }
}, 1000);
