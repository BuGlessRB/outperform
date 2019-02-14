   // Remixml-forms v1.0: Form generator in Remixml.
  // Copyright (c) 2019 by Stephen R. van den Berg <srb@cuci.nl>
 // License: ISC OR GPL-3.0
// Sponsored by: Cubic Circle, The Netherlands

!function(W, D, O)
{ "use strict";

  function isstring(s)
  { return O.prototype.toString.call(s) === "[object String]"; }

  function replelm(n, o) { return o.parentNode.replaceChild(n, o); }
  function gattr(n, k) { return n.getAttribute(k); }
  function sattr(n, k, v) { n.setAttribute(k, v); }
  function newel(n) { return D.createElement(n); }
  function rattr(n, k) { n.removeAttribute(k); }
  function isa(s) { return Array.isArray(s); }

  if (!O.assign)
    O.defineProperty(O, "assign",
    { value: function(d, s, i) { for (i in s) d[i] = s[i]; return d; } });

  var g =
  { parse: function(tpl, $)
      { if (tpl)
	  tpl = txt2node(tpl), parse(tpl, initctx($));
	return tpl;
      },
    path_encode: encpath
  };

  if (typeof define == "function" && define.amd)
    define("remixml-forms", [], g);
  else if (W.exports)
    W.exports.Remixmlforms = g, W.exports.document = D;
  else
    W.Remixml = g;
}(typeof window == "object" ? window : global,
  typeof document == "object" ? document : require("minidom")(''), Object);
