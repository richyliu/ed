/**
 * Run typescript code and display the output
 */

// @ts-ignore
window.__consolelog = (...params) => {
  console.log.apply(null, ['OUT: ', ...params]);
};

export default function(code: string) {
  const modified = ts.transpile(code).replace('console.log', '__consolelog');

  (() => {
    try {
      eval.call(window, modified)
    } catch (e) {
      console.error(e);
    }
  })();
}
