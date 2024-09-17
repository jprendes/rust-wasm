# Running Rust in the browser with WebAssembly from scratch

This guide will show you how to run Rust in de browser from scratch.

## Writing the module

Let's create our own `demo` component, we need a crate for it
```bash
cargo init --lib --name demo
```

We need to specify the crate type by adding to `./Cargo.toml`
```toml
[lib]
crate-type = ["cdylib"]
```

Now we can implement our `add` function in `src/lib.rs`
```rust
#[no_mangle]
fn add(a: u32, b: u32) -> u32 {
    a + b
}
```

## Compiling it

Compiling the WebAssembly module is straight forward, simply run
```bash
cargo build --release --target=wasm32-unknown-unknown
```

We can now make a copy of the file for easier access
```bash
mkdir -p wasm
cp ./target/wasm32-unknown-unknown/release/demo.wasm ./wasm/
```

## Running it

To run our code we create a `main.js` file. Running a WebAssembly module in JavaScript involves 2 steps:

1. `fetch`ing it, i.e., getting the binary
```js
const response = await fetch(new URL("wasm/demo.wasm", import.meta.url));
```

2. Instantiating it. This takes the binary, and gives us an object we can interact with.
```js
const { instance } = await WebAssembly.instantiateStreaming(response);
```

Now we can execute our Rust code
```js
const sum = instance.exports.add(21, 21);
console.log(`21 + 21 = ${sum}`);
```

We can now run the script with
```bash
deno -A main.js
```

which prints
```
21 + 21 = 42
```

## Using string

Lets now add a function to count the number of `x` characters in a string
```rust
#[no_mangle]
fn count_x(s: &str) -> u32 {
    let count = s.as_bytes().iter().filter(|x| **x == b'x').count() as _;
    count
}
```

We now recompile, and call it from JavaScript
```js
const msg = "hello xoxoxo";
const count = instance.exports.count_x(msg);
console.log(`"${msg}" has ${count} letters "x"`);
```

We can now run it with Deno, and we get
```
"hello xoxoxo" has 0 letters "x"
```

Something is very wrong!

Lets inspect the generated webassembly binary
```bash
jco print target/wasm32-unknown-unknown/release/demo.wasm | grep -m1 count_x
```

which shows the declaration of `count_x`
```wat
  (func $count_x (;1;) (type 0) (param i32 i32) (result i32)
```

We expected `count_x` to take a string, but `(param i32 i32)` tells us that it takes two `i32` instead!

WebAssembly only understands numbers, in particualr `i32`, `i64`, `f32`, and `f64`. What these two numbers represent in rust, are a pointer to the starting memory address of the string, and its length in bytes.

To pass a string to WebAssembly, we first need to copy it into the module's memory. We create a function to do this
```js
function putString(str, ptr) {
    const mem = new Uint8Array(instance.exports.memory.buffer, ptr);
    const enc = new TextEncoder();
    const len = enc.encodeInto(str, mem).written;
    return [ptr, len];
}
```

and now we can call `count_x`
```js
const count = instance.exports.count_x(...putString(msg, 100));
console.log(`"${msg}" has ${count} letters "x"`);
```

which now results in
```
"hello xoxoxo" has 3 letters "x"
```

## Interacting with the host

So far we have an expensive calculator. If we want to empower our code to do more, the host needs to provide extra functionalities. We do this with _imports_.

We now edit `src/lib.rs` to allow the module to import from the host a function to print strings. As we saw before, the string is a pointer and a length.
```rust
#[link(wasm_import_module = "host")]
extern {
    #[allow(improper_ctypes)]
    fn print(s: &str);
}
```

WebAssembly imports consist of a _module_ and a _name_, in this case the module is `host` and the name is `print`.

We also need to provide a JavaScript `print` implementation to the module when we instantiate it. As before, the `&str` is converted into a pointer and length pair that we need to read from the memory
```
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
```

Lets now add a `greet` function
```rust
#[no_mangle]
pub fn greet(name: &str) {
    let s = format!("hello {name}, from Rust!");
    unsafe { print(&s); }
}
```

We now recompile, and call it from JavaScript
```js
const name = "Jorge";
instance.exports.greet(...putString(name, 100));
```

We can now run it with Deno, and we get
```
hello Jorge, from Rust!
```

## Running in the browser

To run the script in the browser we need an `index.html` file
```html
<!doctype html>
<script type="module" src="./main.js"></script>
```

and now we can run `serve` and direct our browser to http://localhost:8000.
