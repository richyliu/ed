interface Listener {
  callback(e: KeyboardEvent): void;
  key: string;
  once: boolean;
}
let _callbacks: Listener[] = [];

document.onkeydown = (e) => {
  console.log(e);
  _callbacks.forEach((lis) => {
    if (e.key == lis.key) {
      lis.callback(e);
      if (lis.once) removeListener(lis.callback);
    }
  });
};

/**
 * Listens to a key down event on the document
 * @param key To listen to or multiple keys to listen to
 * @param callback To be executed when key is pressed
 * @param once Whether callback is called once or many times
 * @returns Function to remove listener
 */
export function addListener(
  key: string | string[],
  callback: (e: KeyboardEvent) => void,
  once = false
): () => void {
  console.log('adding listener...', _callbacks);
  if (typeof key == 'string') {
    _callbacks.push({ key, callback, once });
  } else {
    _callbacks = _callbacks.concat(key.map(k => ({ key: k, callback, once})));
  }
  return () => removeListener(callback);
}

export function removeListener(callback: (e: KeyboardEvent) => void) {
  _callbacks = _callbacks.filter((lis) => lis.callback != callback);
}
