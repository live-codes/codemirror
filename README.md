# @live-codes/codemirror

This is a custom build of CodeMirror6.

This was built for use in [LiveCodes](https://livecodes.io/).

## Usage

The editor is bundled as ESM. It can be used like this:

```html
<div id="container"></div>

<script type="module">
  import { basicSetup, lineNumbers, EditorView, javascript } from 'https://cdn.jsdelivr.net/npm/@live-codes/codemirror';

  let view = new EditorView({
    doc: "console.log('hello world');",
    extensions: [
      basicSetup, 
      lineNumbers(),
      javascript(),
    ],
    parent: document.querySelector('#container'),
  })
</script>
```

## Build

```bash
npm run build
```

## License

MIT
