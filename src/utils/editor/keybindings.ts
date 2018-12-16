// remaps vim keys with ctrl because some don't work by default
document.onkeyup = e => {
  // ctrl-c and ctrl-h are sent as "enter" and "backspace" but with meta key
  if (
    e.code == 'Unidentified' &&
    e.metaKey &&
    (e.key == 'Enter' || e.key == 'Backspace')
  ) {
    console.log('sending');
    // send just escape for ctrl-c
    vimKey('Escape');
    if (e.key == 'Backspace') {
      // add "x" and "a" to simulate a backspace
      vimKey('x');
      vimKey('a');
    }
    // do not propagate event
    return false;
  }
  return;
};

// show hover "exploit"
// document.querySelector('.monaco-editor').dispatchEvent(new MouseEvent('mousemove', { clientX: 196, clientY: 12 }));
// WORKS WITHOUT ANY HACKS!!! YAY!!!
// document.querySelector('.mtk1').dispatchEvent(new MouseEvent('mousemove', { clientX: 196, clientY: 12, bubbles: true}));
// ^^ notice selector is .mtk1, which is a span and bubbles is true

// map alt-hjkl keys and custom vim bindings
document.addEventListener('onkeydown', ((e: KeyboardEvent) => {
  // if key is alt-hjkl (weird chars get created by alt key)
  if (e.key.match(/^(˙|∆|˚|¬)$/)) {
    vimKey('Escape');
    // h key
    if (e.key == '˙') {
      vimKey('i');
      // j
    } else if (e.key == '∆') {
      vimKey('j');
      vimKey('a');
      // k
    } else if (e.key == '˚') {
      vimKey('k');
      vimKey('a');
      // has to be l
    } else {
      vimKey('l');
      vimKey('a');
    }
    // prevent event propagation
    return false;
  }

  return;
}) as EventListener);

/**
 * Passes a key to Monaco Vim
 * @param key   Single char key to pass
 */
function vimKey(key: string) {
  const input = document.querySelector('.inputarea');
  const keyCode = key == 'Escape' ? 27 : 0;

  if (input) {
    const keyEv = { key, keyCode } as KeyboardEventInit;
    // dispatch event to vim input
    input.dispatchEvent(new KeyboardEvent('keydown', keyEv));
  }
}
