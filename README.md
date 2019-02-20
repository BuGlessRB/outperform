<h1>Outperform</h1>

Outperform is a form generator written in plain Javascript with zero
dependencies.
It supports and augments browser native form validation and offers automatic
persistence of half-filled forms across page reloads.

## Requirements

It runs inside any webbrowser environment (starting at IE11 and up).

## Features

- Zero dependencies.
- Less filling (unminified but gzipped: <2KB).
- Native browser form validation support.
- Custom validation seemlessly integrated.
- Compact form description format.
- Automatic and consistent persistence of forms across page reloads in
  all browsers.
- Convenience functions to easily retrieve and (pre)set all form data using
  javascript objects (ideal for custom processing of form submissions).

## Basic usage

```js
 var fields = [
   [ "houseno", "number", "This is the description", {min:1, max:999}],
   [ "foo", "text", "This is the description"],
   [ "foo2", "password", "This is the description"],
   [ "bar", "select", "This is the description",
     {list:
      ["one",
       ["two", {class:"bright"}],
       ["three", "Three choices"],
       "four",
       ["five", "Five", {style:"display:none;"}]
      ]
     }
   ],
   [ "bar2", "checkbox", "This is the description",
     {list:
      ["one",
      ["two", {class:"bright", value:"2"}],
      ["Three choices"],
      "four",
      ["Five", {style:"display:none;", value:"5"}]]
     }
   ],
 ];
 var form = Outperform.create("form", {id:"hello"}, fields);
 document.body.appendChild(form);
 console.log(JSON.stringify(Outperform.getfields(form)));
```

## Reference documentation

### API

Specified parameters:
- `form`<br />
  A reference to the current form node.
- `fielddescription`<br />
  The description of an input field.
- `fields`<br />
  An array of `fielddescription` fields.

Exposed API-list:
- `Outperform.create(formtag, attributes, fields)`<br />
  Creates an HTML element using the tag in the string `formtag`
  (usually `"form"`, unless you deviate from HTML5) adorned by the
  attributes listed in the `attributes` object.  The form is filled
  using the fielddescriptions in the `fields` array.  It returns
  a reference to the form node which should normally be inserted into
  the DOM.
- `Outperform.clearpersist(form)`<br />
  Clears the persistent storage used to store half-filled form data.
  Intended to be used right after submitting the form successfully.
- `Outperform.getvalues(form)`<br />
  Returns an object containing all entered values in the form.
- `Outperform.setvalues(form, values)`<br />
  (Pre)sets all values in the form using the object in `values`.
- `Outperform.field(form, fielddescription)`<br />
   Return a single node that is equivalent to the provided `fielddescription`
   (used internally by `Outperform.create()`).

## References
