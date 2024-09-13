const response = await fetch(new URL("wasm/demo.wasm", import.meta.url));
const { instance } = await WebAssembly.instantiateStreaming(response, {
    host: {
        print(ptr, len) {
            console.log(getString(ptr, len));
        }
    }
});

function getString(ptr, len) {
    const mem = new Uint8Array(instance.exports.memory.buffer, ptr, len);
    const dec = new TextDecoder();
    return dec.decode(mem);
}

function putString(str, ptr) {
    const mem = new Uint8Array(instance.exports.memory.buffer, ptr);
    const enc = new TextEncoder();
    const len = enc.encodeInto(str, mem).written;
    return [ptr, len];
}

const sum = instance.exports.add(21, 21);
console.log(`21 + 21 = ${sum}`);

const msg = "hello xoxoxo";
const count = instance.exports.count_x(...putString(msg, 100));
console.log(`"${msg}" has ${count} letters "x"`);

const name = "Jorge";
instance.exports.greet(...putString(name, 100));