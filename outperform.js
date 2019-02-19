   // outperform v1.0: Form generator in plain javascript.
  // Copyright (c) 2019 by Stephen R. van den Berg <srb@cuci.nl>
 // License: ISC OR GPL-3.0
// Sponsored by: Cubic Circle, The Netherlands

!function(W, D, O)
{ "use strict";
  var diva = newel("div"), labelsel = ".label", errsel = ".error",
   template = txt2node("<label><span class=\"label\"></span>"
    + "<input/><span class=\"error\"></span></label>"),
   inputs = "input,select,textarea";
  function isstring(s)
  { return O.prototype.toString.call(s) === "[object String]"; }

  function isa(s) { return Array.isArray(s); }
  function sattr(n, k, v) { n.setAttribute(k, v); }
  function addattr(el, a) { for (var i in a) sattr(el, i, a[i]); }
  function newel(n, a) { addattr(n = D.createElement(n), a); return n; }

  function txt2node(t)
  { return t.nodeType ? t :
     (diva.innerHTML = t, (t = D.createRange()).selectNodeContents(diva),
      t.extractContents());
  }

  function storeform(form)
  { form = form.currentTarget;
    try
    { sessionStorage.setItem("form#" + form.id,
       JSON.stringify(g.getvalues(form, 1)));
    } catch(e) {}
  }

  if (!O.assign)
    O.defineProperty(O, "assign",
    { value: function(d, s, i) { for (i in s) d[i] = s[i]; return d; } });

  var g =
  { create: function(form, attr, fields)
      { form = newel(form, attr);
        for (attr = 0; attr < fields.length; attr++)
          form.appendChild(g.field(form, fields[attr]));
        form.addEventListener("change", storeform);
        try
        { if (fields = sessionStorage.getItem("form#" + form.id))
            g.setvalues(form, JSON.parse(fields), 1);
        } catch(e) {}
        return form;
      },
    getvalues: function(form, persist)
      { var i, el, nm, t, els = form.elements, res = {};
        for (i = 0; i < els.length;)
        { switch((el = els[i++]).tagName)
          { default: continue;
            case "INPUT": case "SELECT": case "TEXTAREA":;
          }
          nm = el.name;
          if (persist && !el.opfpersist)
            continue;
          switch(el.type)
          { case "checkbox":
            case "radio":
              if (el.checked)
                if ((t = res[nm]) === undefined)
                  res[nm] = el.value;
                else
                { if (!isa(t))
                    res[nm] = [t];
                  res[nm].push(el.value);
                }
              break;
            default: res[nm] = el.value;
          }
        }
        return res;
      },
    setvalues: function(form, vals, persist)
      { var i, el, nm, t, els = form.elements;
        for (i = 0; i < els.length;)
        { switch((el = els[i++]).tagName)
          { default: continue;
            case "INPUT": case "SELECT": case "TEXTAREA":;
          }
          nm = el.name;
          if (persist && !el.opfpersist)
            continue;
          switch(el.type)
          { case "checkbox":
            case "radio":
              el.checked = isa(t = vals[nm]) && t.indexOf(el.value) >= 0
               || t === el.value;
              break;
            default: el.value = vals[nm];
          }
        }
      },
    field: function(form, fld)
      { var opt = fld[3] = fld[3] || {}, k, i, t, iel,
         v = { name:fld[0], type:fld[1] };
        function reportvalidity(el)
        { el = el.currentTarget;
          if (opt.validate)
            el.setCustomValidity(opt.validate(form.elements) || "");
          el.reportValidity();
        }
        O.assign(v, opt);
        k = (opt.template = txt2node(opt.template || template)).cloneNode(1);
        k.querySelector(opt.labelsel || labelsel).textContent = fld[2];
        delete v.errsel; delete v.labelsel;
        delete v.validate; delete v.persist; delete v.template;
        for (t = k.querySelectorAll(inputs), i = 0; i < t.length; i++)
        { addattr(iel = t[i], v);
          iel.addEventListener("change", reportvalidity);
          iel.addEventListener("input", reportvalidity);
          iel.opfpersist = opt.persist !== undefined ? opt.persist :
           v.type == "password" ? 0 : 1;
          iel.opferror = k.querySelector(opt.errsel || errsel);
        }
        return k;
      }
  };

  if (typeof define == "function" && define.amd)
    define("outperform", [], g);
  else if (W.exports)
    W.exports.outperform = g, W.exports.document = D;
  else
    W.Outperform = g;
}(typeof window == "object" ? window : global,
  typeof document == "object" ? document : require("minidom")(''), Object);
