import * as Key from 'src/utils/keylistener';

// react-ace autocomplete doesn't work w/ iPhone userAgent, need to change it
const ua = navigator.userAgent;
Object.defineProperty(navigator, 'userAgent', {
  get() {
    return ua.replace(/iPhone|iPad|iPod/g, 'iNot');
  },
});

// rebind weird keys after a delay so ace is loaded
setTimeout(() => {
  // rebind hardware keyboard's Alt-[ (“) to escape
  Key.addListener('“', e => {
    const escapeEvt = new KeyboardEvent('keydown', {
      keyCode: 27,
    } as KeyboardEventInit)

    const aceInput = document.querySelector('.ace_text-input');
    const cmdInput = document.querySelector('.ace_dialog-bottom > input');
    if (aceInput) aceInput.dispatchEvent(escapeEvt);
    if (cmdInput) cmdInput.dispatchEvent(escapeEvt);

    e.preventDefault();
    e.stopPropagation();
  });
  // TODO: finish this feature: Alt-w deletes back a word in insert mode
  /*Key.addListener('∑', e => {
    const escapeEvt = new KeyboardEvent('keydown', {
      keyCode: 27,
    } as KeyboardEventInit)

    const aceInput = document.querySelector('.ace_text-input');
    const cmdInput = document.querySelector('.ace_dialog-bottom > input');
    if (aceInput) aceInput.dispatchEvent(escapeEvt);
    if (cmdInput) cmdInput.dispatchEvent(escapeEvt);

    e.preventDefault();
    e.stopPropagation();
  });*/

  // TODO: rebind fancy quotes
  //Key.addListener("
}, 1000);
