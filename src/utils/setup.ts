// react-ace autocomplete doesn't work w/ iPhone userAgent, need to change it
const ua = navigator.userAgent;
Object.defineProperty(navigator, 'userAgent', {
  get() {
    return ua.replace(/iPhone|iPad|iPod/g, 'iNot');
  },
});
