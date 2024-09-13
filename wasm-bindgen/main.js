import init, { count_x, greet } from "./wasm/demo.js"

await init({});

const msg = "hello xoxoxo";
const stats = count_x(msg);
console.log(`"${msg}" has ${stats.count} letters "x" out of ${stats.total} in total`);

greet("Jorge");
