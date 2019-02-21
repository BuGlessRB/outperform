<h1>Outperform</h1>

Outperform is a form generator written in plain Javascript with zero
dependencies.
It supports and augments browser native form validation and offers automatic
persistence of half-filled forms across page reloads while integrating
with any and all web frameworks.

## Requirements

It runs inside any webbrowser environment (starting at IE11 and up).

## Features

- Zero dependencies.
- Less filling (unminified but gzipped: <2KB).
- Native browser form validation support for all HTML5+ input types.
- Custom validation seemlessly integrated.
- Compact form description format.
- Customisable nested HTML templates that allow
  seemless integration with any web framework (e.g. Bootstrap).
- Automatic and consistent persistence of forms across page reloads in
  all browsers.
- Convenience functions to easily retrieve and (pre)set all form data using
  javascript objects (ideal for custom processing of form submissions).
- Does not invade or mess up your `id` DOM-namespace by using form-relative
  `name` references internally exclusively.

## Basic usage

```js
 var fields = [
   [ "houseno", "number", "This is the description", {min:1, max:999}],
   [ "foo", "text", "This is the description",
      {validate:function(flds) {
        if (flds.foo.value != flds.foo2.value)
          return "Mismatch between foo en foo2 fields";
       }],
   [ "foo2", "password", "This is the description"],
   [ "bar", "select", "This is the description",
     {list:
      ["one",
       ["two", {class:"bright"}],
       ["three", "Three choices"],
       "four",
       ["five", "Five", {style:"display:none;"}],
      ]
     }
   ],
   [ "bar2", "checkbox", "This is the description",
     {list:
      ["one",
       ["two", {class:"bright", value:"2"}],
       ["Three choices"],
       "four",
       ["Five", {style:"display:none;", value:"5"}],
      ],
      template:"<fieldset><legend></legend><input /></fieldset>",
      labelsel:"legend",
     }
   ],
 ];
 var form = Outperform.create("form", {id:"hello"}, fields);
 document.body.appendChild(form);

 // on submit:
 if (form.reportValidity()) {
   console.log(JSON.stringify(Outperform.getfields(form)));
   Outperform.clearpersist(form);
 }
```

## Reference documentation

Fielddescriptions are an array of values:
```js
 [ name, type, description, options]
```
- `name`<br />
  Is the name attribute for this input field.
- `type`<br />
  Is the type attribute for this input field.  All browser native types
  are supported.  Special values are `select` or `textarea`, which generate
  corresponding input fields.
- `description`<br />
  Should be the human readable description of this field.
- `options`<br />
  Is an optional field that can contain an object.  All values in this
  object will become attributes on the input field.
  Exception to this rule are a few special attributes:
  - `template`<br />
    Defaults to:
     ```html
      <label><span></span><input /></label>
     ```
     And can be specified per input field if so desired.
  - `labelsel`<br />
    Defaults to: `span`
    And identifies the first element whose content shall be replaced
    by the human readable form of the description of the input field.
  - `persist`<br />
    A boolean which determines if this field's content will persist
    accross browser reloads.  Defaults to `true` for all types except
    `password`.
  - `validate`<br />
    Can be defined to a function which performs custom validation
    checks.  The function receives a single parameter which can be
    indexed by the name of an input element to reference the input element
    nodes.
  - `list`<br />
    An array of values for a `select`, `checkbox` or `radio` element.
    Every entry needs to satisfy the following rules:
    - `select` values should contain one or two strings (separate value
      is optional) followed by an optional option object per row.
    - `checkbox` and `radio` values should contain a single string,
     or a single string followed by an option object, or a full
     fielddescription array (the latter can be used to recursively
     nest arbitrarily complex HTML structures in the form).

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
   (used internally by `Outperform.create()`).  This method can be used
   to construct completely custom form elements, by inserting them
   manually into the form created by `Outperform.create()`.

## References
