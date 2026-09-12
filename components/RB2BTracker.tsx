"use client";

import Script from "next/script";

export default function RB2BTracker() {
  const rb2bKey = process.env.NEXT_PUBLIC_RB2B_KEY;

  if (!rb2bKey) {
    return null;
  }

  return (
    <Script
      id="rb2b-tracking"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function () {var reb2b = window.reb2b = window.reb2b || [];
          if (reb2b.invoked) return;reb2b.invoked = true;reb2b.methods = ["identify", "collect"];
          reb2b.factory = function (method) {return function () {var args = Array.prototype.slice.call(arguments);
          args.unshift(method);reb2b.push(args);return reb2b;};};
          for (var i = 0; i < reb2b.methods.length; i++) {var key = reb2b.methods[i];reb2b[key] = reb2b.factory(key);}
          reb2b.load = function (key) {var script = document.createElement("script");script.type = "text/javascript";
          script.async = true;script.src = "https://s3-us-west-2.amazonaws.com/b2b-js/" + key + "/reb2b.js";
          var first = document.getElementsByTagName("script")[0];first.parentNode.insertBefore(script, first);};
          reb2b.SNIPPET_VERSION = "1.0.0";
          reb2b.load("${rb2bKey}");}();
        `,
      }}
    />
  );
}
