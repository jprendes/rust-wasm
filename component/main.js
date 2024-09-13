import { instantiate } from "./wasm/demo.js";

let demo = await instantiate(
    (url) => fetch(new URL(`./wasm/${url}`, import.meta.url)).then(WebAssembly.compileStreaming),
    {
        host: {
            print(s) {
                console.log(s);
            }
        }
    }
);

const msg = "hello xoxoxo";
const stats = demo.countX(msg);
console.log(`"${msg}" has ${stats.count} letters "x" out of ${stats.total} in total`);

demo.greet("Jorge");