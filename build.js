import fs from "fs";
import path from "path";
import { buildSync } from "esbuild";

const patch = (
  /** @type {string} */ filePath,
  /** @type {Record<string, string>} */ replacements = {}
) =>
  new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filePath), "utf8", function (err, data) {
      if (err) return reject(err);

      var result = data;
      for (const key of Object.keys(replacements)) {
        result = result.split(key).join(replacements[key]);
      }

      fs.writeFile(path.resolve(filePath), result, "utf8", function (err) {
        if (err) return reject(err);

        resolve("done");
      });
    });
  });

const patchTS = async () => {
  await patch(
    "./node_modules/@valtown/codemirror-ts/dist/esm/autocomplete/getAutocompletion.js",
    {
      'import ts from "typescript";': "",
      "ts.ScriptElementKind.warning": '"warning"',
    }
  );
  await patch("./node_modules/@valtown/codemirror-ts/dist/esm/lint/utils.js", {
    'import ts from "typescript";': "",
    "ts.DiagnosticCategory.Warning": "0",
    "ts.DiagnosticCategory.Error": "1",
    "ts.DiagnosticCategory.Suggestion": "2",
    "ts.DiagnosticCategory.Message": "3",
  });
};

const patchConsole = (/** @type {string} */ filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filePath), "utf8", function (err, data) {
      if (err) return reject(err);
      const patchedConsole = `const console={log:()=>{},error:()=>{},warn:()=>{},info:()=>{}};`;
      fs.writeFile(
        path.resolve(filePath),
        patchedConsole + data,
        "utf8",
        function (err) {
          if (err) return reject(err);
          resolve("done");
        }
      );
    });
  });

const build = () => {
  const srcDir = "src/";
  const outputDir = "build/";

  /**
   * @param {Record<string,string>} acc
   * @param {string} cur
   */
  function arrToObj(acc, cur) {
    const path = cur.split("/");
    const out = path[path.length - 1].replace(".ts", "");
    return {
      ...acc,
      [out]: cur,
    };
  }

  /** @type {Partial<import("esbuild").BuildOptions>} */
  const baseOptions = {
    bundle: true,
    minify: true,
    target: "es2020",
    sourcemap: false,
    outdir: outputDir,
    format: "esm",
    define: {
      global: "window",
      "process.env.NODE_ENV": '"production"',
    },
  };

  // Codemirror
  buildSync({
    ...baseOptions,
    outdir: outputDir,
    entryPoints: [srcDir + "codemirror-core.ts"],
  });

  // Codemirror-ts worker
  buildSync({
    ...baseOptions,
    entryPoints: [srcDir + "codemirror-ts.worker.ts"],
    outdir: outputDir,
    format: "iife",
    globalName: "CodemirrorTsWorker",
    external: ["typescript"],
  });

  buildSync({
    ...baseOptions,
    outdir: outputDir,
    ignoreAnnotations: true, // required for codemirror-emacs
    entryPoints: [
      "codemirror-ts.ts",
      "codemirror-vim.ts",
      "codemirror-emacs.ts",
      "codemirror-emmet.ts",
      "codemirror-codeium.ts",
      "codemirror-line-numbers-relative.ts",
      "languages/codemirror-lang-markdown.ts",
      "languages/codemirror-lang-python.ts",
      "languages/codemirror-lang-scss.ts",
      "languages/codemirror-lang-coffeescript.ts",
      "languages/codemirror-lang-livescript.ts",
      "languages/codemirror-lang-php.ts",
      "languages/codemirror-lang-clike.ts",
      "languages/codemirror-lang-mllike.ts",
      "languages/codemirror-lang-cpp.ts",
      "languages/codemirror-lang-java.ts",
      "languages/codemirror-lang-sql.ts",
      "languages/codemirror-lang-wast.ts",
      "languages/codemirror-lang-ruby.ts",
      "languages/codemirror-lang-go.ts",
      "languages/codemirror-lang-perl.ts",
      "languages/codemirror-lang-lua.ts",
      "languages/codemirror-lang-r.ts",
      "languages/codemirror-lang-julia.ts",
      "languages/codemirror-lang-scheme.ts",
      "languages/codemirror-lang-clojure.ts",
      "languages/codemirror-lang-tcl.ts",
      "languages/codemirror-lang-less.ts",
      "languages/codemirror-lang-stylus.ts",
      "languages/codemirror-lang-vue.ts",
      "languages/codemirror-lang-rust.ts",
      "languages/codemirror-lang-swift.ts",
      "languages/codemirror-lang-liquid.ts",
      "languages/codemirror-lang-svelte.ts",
      "languages/codemirror-lang-minizinc.ts",
      "languages/codemirror-lang-prolog.ts",
    ]
      .map((x) => srcDir + x)
      .reduce(arrToObj, {}),
    external: [
      // already included in codemirror-core.ts
      "codemirror",
      "@codemirror/autocomplete",
      "@codemirror/commands",
      "@codemirror/language",
      "@codemirror/lint",
      "@codemirror/search",
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/lang-html",
      "@codemirror/lang-css",
      "@codemirror/lang-javascript",
      "@codemirror/lang-json",
      "@codemirror/theme-one-dark",
      "@lezer/common",
      "@lezer/highlight",
      "@lezer/lr",
      "@replit/codemirror-indentation-markers",
      "@replit/codemirror-vscode-keymap",
      "@replit/codemirror-css-color-picker",
      // should be provided separately
      "typescript",
    ],
  });

  patchConsole("./build/codemirror-codeium.js");
};

patchTS().then(build);
