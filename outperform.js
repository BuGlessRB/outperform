   /** @license
   ** outperform v1.1.3: Form generator in plain javascript.
  ** Copyright (c) 2019 by Stephen R. van den Berg <srb@cuci.nl>
 ** License: ISC OR GPL-3.0
** Sponsored by: Cubic Circle, The Netherlands
*/

/** @define {number} */ var DEBUG = 0;
/** @define {number} */ var RUNTIMEDEBUG = 0;
/** @define {number} */ var ALERTS = 0;

(function(W, D, O)
{ "use strict";
  var diva = newel("div"), labelsel = "span",
   template = txt2node("<label><span></span><input /></label>"),
   inputs = "input,select,textarea";

  function /** !boolean */ isstring(/** * */ s)
  { return O.prototype.toString.call(s) === "[object String]"; }

  function /** !boolean */ isa(/** * */ s) { return Array.isArray(s); }

  function sattr(/** !Node */ n, /** !string */ k, /** string */ v)
  { n.setAttribute(k, v);
  }

  function addattr(/** !Node */ el, /** Object|undefined */ a)
  { for (var i in a)
      sattr(el, i, a[i]);
  }

  function /** !Node */ replelm(/** !Node */ n, /** !Node */ o)
  { return o.parentNode.replaceChild(n, o);
  }

  function /** !Node */ newel(/** !string */ n, /** Object= */ a)
  { var /** !Node */ node;
    addattr(node = D.createElement(n), a); return node;
  }

  function /** !Node */ txt2node(/** string|!Node */ t)
  { var /** !Range */ range;
    return t.nodeType ? /** @type {!Node} */ (t) :
     (diva.innerHTML = t, (range = D.createRange()).selectNodeContents(diva),
      range.extractContents());
  }

  function storeform(/** !Object */ form)
  { form = form.currentTarget;
    try
    { sessionStorage.setItem("form#" + form.id,
       JSON.stringify(g["getvalues"](form, 1)));
    } catch(e) {}
  }

  if (!O.assign)
    O.defineProperty(O, "assign",
    { "value": function(d, s, i)
      { if (s)
	  for (i in s)
	    d[i] = s[i];
	return d;
      }
    });

  const /** !Object */ g =
  { "create": function(form, attr, fields)
      { form = newel(form, attr);
	for (attr = 0; attr < fields.length; attr++)
	  form.appendChild(g["field"](form, fields[attr]));
	form.addEventListener("change", storeform);
	try
	{ if (fields = sessionStorage.getItem("form#" + form.id))
	    g["setvalues"](form, JSON.parse(fields), 1);
	} catch(e) {}
	return form;
      },
    "clearpersist": function(form)
      { try { sessionStorage.removeItem("form#" + form.id); } catch(e) {}
      },
    "getvalues": function(form, persist)
      { var i, el, nm, t, els = form.elements, res = {};
	function storeit()
	{ if ((t = res[nm]) === undefined)
	    res[nm] = el.value;
	  else
	  { if (!isa(t))
	      res[nm] = [t];
	    res[nm].push(el.value);
	  }
	}
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
	      { if (el.value === undefined)
		  el.value = "on";
		storeit();
	      }
	      break;
	    default:
	      storeit();
	  }
	}
	return res;
      },
    "setvalues": function(form, t, persist)
      { var i, el, vals, nm, els = form.elements;
	vals = {};
	for (i in t)
	  vals[i] = isa(nm = t[i]) ? nm.slice() : [nm];
	for (i = 0; i < els.length;)
	{ switch((el = els[i++]).tagName)
	  { default: continue;
	    case "INPUT": case "SELECT": case "TEXTAREA":;
	  }
	  nm = el.name;
	  if (persist && !el.opfpersist)
	    continue;
	  t = vals[nm] || [];
	  switch(el.type)
	  { case "checkbox":
	    case "radio":
	      if (el.checked = t[0] === el.value)
		t.shift();
	      break;
	    default: el.value = t.shift() || "";
	  }
	}
      },
    "obj2formdata": function(vals)
      { var i, j, k, fd = new FormData();
	for (i in vals)
          if (isa(j = vals[i]))
            for (k = 0; k < j.length; fd.append(i, j[k++])) {}
          else
            fd.set(i, j);
        return fd;
      },
    "field": function(form, fld)
      { var opt = fld[3] = fld[3] || {}, k, i, j, m, t, r, li, le, iel,
	 v = { "name":fld[0], "type":fld[1] };
	function reportvalidity(el)
	{ el = el.currentTarget;
	  if (opt["validate"])
	    el.setCustomValidity(opt["validate"](form.elements) || "");
	  el.reportValidity();
	}
	O.assign(v, opt);
	k = (opt["template"] = txt2node(v["template"] || template))
	 .cloneNode(true);
	k.querySelector(v["labelsel"] || labelsel).textContent = fld[2];
	delete v["labelsel"];delete v["list"]; delete v["node"];
	delete v["validate"]; delete v["persist"]; delete v["template"];
	switch (v["type"])
	{ case "checkbox": case "radio":
	    if (v["value"] === undefined)
	      v["value"] = fld[2];
	}
	for (t = k.querySelectorAll(inputs), i = 0; i < t.length;)
	{ iel = t[i++];
	  switch (v["type"])
	  { case "checkbox": case "radio":
	      if (li = opt["list"])
	      { le = iel.parentNode;
		for (j = 0; j < li.length;)
		{ if (!isa(m = li[j++]))
		    m = [m];
		  if (m.length < 3)
		    (m = m.slice()).unshift(fld[0], fld[1]);
		  le.insertBefore(g["field"](form, m), iel);
		}
		le.removeChild(iel);
		continue;
	      }
	      break;
	    case "select": case "textarea":
	      replelm(m = newel(v["type"]), iel); iel = m;
	  }
	  addattr(iel, v);
	  iel.addEventListener("change", reportvalidity);
	  iel.addEventListener("input", reportvalidity);
	  iel.opfpersist = opt["persist"] !== undefined ? opt["persist"] :
	   v["type"] == "password" ? 0 : 1;
	  if (v["type"] == "select")
	  { li = opt["list"] || [];
	    for (j = 0; j < li.length;)
	    { if (!isa(r = li[j++]))
		r = [r];
	      if (isstring(r[1]))
		(m = r[2] || {}).value = r[0];
	      else
		m = r[1] || {};
	      le = newel("option", m);
	      le.textContent = isstring(r[1]) ? r[1] : r[0];
	      iel.appendChild(le);
	    }
	  }
	  if (opt["node"])
	    opt["node"](iel, k);
	}
	if (!i && opt["node"])
	  opt["node"](0, k);
	return k;
      }
  };

  if (typeof define == "function" && define["amd"])
    define("outperform", [], g);
  else if (typeof exports == "object")
    O.assign(/** @type{!Object} */(exports), g);
  else
    W["Outperform"] = g;
})(window, document, Object);
