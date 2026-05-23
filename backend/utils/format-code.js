import prettier from "prettier";
import beautify from "js-beautify";

const prettierOpts = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
};

const jsBeautifyOpts = {
  indent_size: 2,
  end_with_newline: true,
  preserve_newlines: true,
  e4x: true,
  brace_style: "collapse",
};

const cssBeautifyOpts = {
  indent_size: 2,
  end_with_newline: true,
  preserve_newlines: true,
  newline_between_rules: true,
};

const htmlBeautifyOpts = {
  indent_size: 2,
  end_with_newline: true,
  preserve_newlines: true,
  wrap_line_length: 100,
  indent_inner_html: true,
};

const PARSERS = {
  js: "babel",
  jsx: "babel",
  mjs: "babel",
  cjs: "babel",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  css: "css",
  scss: "scss",
  less: "less",
  html: "html",
  htm: "html",
  vue: "vue",
  md: "markdown",
  yaml: "yaml",
  yml: "yaml",
};

const extOf = (filename) => {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i + 1).toLowerCase() : "";
};

// The AI occasionally emits malformed CSS like `.@keyframes`, `.@media`,
// or `/.App-logo`. Strip these specific artifacts before formatting so the
// CSS becomes parseable again.
const sanitizeCss = (code) => {
  return code
    .replace(
      /\.@(media|keyframes|supports|import|charset|font-face|page|namespace|layer|container|property)\b/g,
      "@$1"
    )
    .replace(/([{};\s])\/(\.[A-Za-z_-])/g, "$1$2");
};

const fallbackBeautify = (ext, code) => {
  try {
    switch (ext) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "mjs":
      case "cjs":
        return beautify.js(code, jsBeautifyOpts);
      case "css":
      case "scss":
      case "less":
        return beautify.css(code, cssBeautifyOpts);
      case "html":
      case "htm":
      case "xml":
      case "svg":
        return beautify.html(code, htmlBeautifyOpts);
      case "json":
        try {
          return JSON.stringify(JSON.parse(code), null, 2) + "\n";
        } catch {
          return beautify.js(code, jsBeautifyOpts);
        }
      default:
        return code;
    }
  } catch {
    return code;
  }
};

const formatByExt = async (filename, code) => {
  if (typeof code !== "string" || code.length === 0) return code;
  const ext = extOf(filename);
  const parser = PARSERS[ext];

  let input = code;
  if (ext === "css" || ext === "scss" || ext === "less") {
    input = sanitizeCss(input);
  }

  if (parser) {
    try {
      return await prettier.format(input, { ...prettierOpts, parser });
    } catch {
      // fall through to js-beautify
    }
  }

  return fallbackBeautify(ext, input);
};

export const formatFileTree = async (fileTree) => {
  if (!fileTree || typeof fileTree !== "object") return fileTree;
  const entries = await Promise.all(
    Object.entries(fileTree).map(async ([name, node]) => {
      const contents = node?.file?.contents;
      const formatted = await formatByExt(name, contents);
      return [
        name,
        { ...node, file: { ...(node?.file || {}), contents: formatted } },
      ];
    })
  );
  return Object.fromEntries(entries);
};
