<h1>Outperform</h1>

Outperform is a form generator written in plain Javascript.

## Requirements

It runs inside any webbrowser environment (starting at IE11 and up).

## Basic usage

```js
 var fields = [
   [ "houseno", "number", "This is the description", {min:1, max:999}],
   [ "foo", "text", "This is the description"],
   [ "foo2", "password", "This is the description"],
 ];
 var form = forms.create("form", {id:"hello"}, fields);
 document.body.appendChild(form);
```

## Reference documentation

### API

## References
