// setup ace
let editor = CodeMirror(document.getElementById('editor'), {
    value: load(),
    mode: 'javascript',
    lineNumbers: true,
    theme: 'darcula',
    extraKeys: {
        'Ctrl-S': () => save(editor.getValue()),
        'Ctrl-L': () => editor.setValue(load()),
        'Ctrl-Enter': () => {
            eval(editor.getValue());
            toggle('output');
        },
    },
    //keyMap: 'vim',
});

// get element array by class name
const byClass = name => Array.from(document.getElementsByClassName(name));

// toggle tab/content for tab with class name `tab`, called on click
function toggle(tab) {
    byClass('tab__item').forEach(el => el.classList.remove('tab__item--active'));
    byClass('content__item').forEach(el => el.classList.remove('content__item--active'));

    byClass(`tab__${tab}`)[0].classList.add('tab__item--active');
    byClass(`content__${tab}`)[0].classList.add('content__item--active');
};


function addLine(content) {
    const stringify = str => typeof str == 'object' ? JSON.stringify(str) : str;

    byClass('output')[0].innerHTML += `<pre>${stringify(content)}</pre>`
}



function load() {
    return localStorage.getItem('saved') || '';
}

function save(str) {
    localStorage.setItem('saved', str);
}

window.console.log = addLine;
