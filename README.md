# Running Rust in the browser

This guide will show you how to run Rust in the browser and in Node.js using WebAssembly.
We will cover 3 main approaches:
1. [from scratch](./scratch.md)
2. [with `wasm-bindgen`](./wasm-bindgen.md)
3. [with _WebAssembly Components_](./component.md)

Then we will also explore options for posix emulation:
1. [with `emscripten`](./emscripten.md)
2. [with _WASI preview 2_](./wasip2.md)

## Setup

First we need Rust and Deno
```bash
curl -sSfL https://sh.rustup.rs | bash
curl -sSfL https://deno.land/install.sh | bash
echo -e '\nexport PATH="~/.deno/bin:$PATH"' >> ~/.bashrc
. ~/.bashrc
```

We will use two tools, `jco` and `wasm-bindgen`, and we also need and http server to show the result in a browser
```bash
cargo install wasm-bindgen-cli
deno install --global --allow-all --name jco npm:@bytecodealliance/jco
deno install --global --allow-all --name serve jsr:@std/http/file-server
```

Finally, we need to install the `wasm32-unknown-unknown` rust target
```bash
rustup target add wasm32-unknown-unknown
```
