import { instantiate } from "./wasm/demo.js";
import wasip2 from "https://cdn.jsdelivr.net/gh/bytecodealliance/jco@a72d4b38/packages/preview2-shim/lib/browser/wasip2.js";

let demo = await instantiate(
    (url) => fetch(new URL(`./wasm/${url}`, import.meta.url)).then(WebAssembly.compileStreaming),
    { ...wasip2 }
);

demo.greet("Jorge");

console.log("listing /");
demo.listDir("/");

console.log("creating /home/web_user/");
const [[root]] = wasip2["wasi:filesystem/preopens"].getDirectories();
root.createDirectoryAt("/home/web_user/");

console.log("writing /foo.bar");
const fd = root.openAt({}, "/foo.bar", { create: true }, { write: true });
fd.write("hello world!", 0);

console.log("listing /");
demo.listDir("/");

console.log("listing /home");
demo.listDir("/home");
