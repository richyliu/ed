// only works with vim codes

let ctrlMod = false;

document.onkeydown = (e) => {
  const input = document.querySelector('.inputarea');
  if (!input) return;

  //  TODO: Fire ctrl + key once ctrl is pressed <12-12-18, Richard> // 

  const key = 'a';
  const keyCode = 65;

  input.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      keyCode,
    } as KeyboardEventInit)
  );
};

const mappings = [['z', 'a'], ['b', 'f']];

// WORKS!!! only on inputarea itself
/*setTimeout(() => {
  const ia = document.querySelector('.inputarea');
  const letter = 'a';
  ia.value = ia.value.length > 0 ? ia.value + letter : letter;
  ia.dispatchEvent(new Event('input', { data: letter }));
}, 1000);

document.onkeydown = e => {
  if (e.key != 'z') return;

  console.log('running');
  const ia = document.querySelector('.inputarea');
  const letter = 'a';
  ia.value = ia.value.length > 0 ? ia.value + letter : letter;
  ia.dispatchEvent(new Event('input', { data: letter }));
  e.stopPropagation();
  return false;
};*/
