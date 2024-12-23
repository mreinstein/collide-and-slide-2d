import webInput from '@footgun/input-web'


const bindings = [
    {
        name: 'left',
        event: 'key',
        value: 'KeyS',
    },
    {
        name: 'right',
        event: 'key',
        value: 'KeyF',
    },
    {
        name: 'jump',
        event: 'key',
        value: 'Space',
    }
]

const input = webInput({
    canvas: document.querySelector('canvas'),
    bindings,
})

export default input
