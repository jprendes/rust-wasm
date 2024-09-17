# Running Rust in the browser with WASI preview 2

This guide will show you how to run Rust with POSIX emulation in de browser with WASI preview 2.

## Setup

Right now `rustup` doesn't provide the `std` crate for `wasm32-wasip2` in the _stable_ channel, but it does provide it in the _beta_ channel, so we need to install _beta_ rust and the `wasm32-wasip2` target.

```bash
rustup install beta
rustup +beta target add wasm32-wasip2
```

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

Then we need to define its interface in `./wit/demo.wit`
```wit
package local:demo;
world demo {
    export greet: func(name: string);
    export list-dir: func(name: string);
}
```

To consume this interface from our Rust code, we will use the `wit-bindgen` crate
```bash
cargo add wit-bindgen
```

This crate provides a `generate!` macro to generate the Rust traits from the `wit` file
```rust
mod bindings {
    wit_bindgen::generate!({
        world: "demo",
    });
}
```

This generates a `Guest` trait for implementing the behaviour of the `demo` world
```rust
use bindings::Guest;
```

Now we just need to create a new type to represent our component, and let `wit-bindgen` know about it
```rust
struct Component;
bindings::export!(Component with_types_in bindings);
```

We can use an empty struct since we don't need to preserve any state.

Finally we need to implement the `Guest` trait for our component
```rust
impl Guest for Component {
    fn greet(name: String) {
        let s = format!("hello {name}, from Rust!");
        println!("{s}");
    }

    fn list_dir(path: String) {
        let Ok(dir) = std::fs::read_dir(&path) else {
            println!("  < Error opening directory {path:?} >");
            return;
        };
        
        let dir: Vec<_> = dir.collect();
        if dir.is_empty() {
            println!("  < Empty >");
            return;
        }
        
        for entry in dir {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_dir() {
                    println!("  {}/", path.display());
                } else {
                    println!("  {}", path.display());
                }
            }
        }
    }
}
```

Note how we are using `println!` and `std::fs`, which rely on the conceps of a _standard output_ and a _filesystem_ respectively.

## Compiling it

There are a two steps to compile the component:

1. Compile the crate to a core wasm module
```bash
cargo +beta build --release --target wasm32-wasip2
```

2. Generate JS bindings for the component
```bash
jco transpile ./target/wasm32-wasip2/release/demo.wasm --out-dir ./wasm/ --instantiation
```

## Running it

To run our code we create a `main.js` file and import the `instantiate` function from the generated bindings
```js
import { instantiate } from "./wasm/demo.js";
```

The instantiate function will require imports implementing for the _WASI preview 2_ world.
We can obtain a _shim_ for the browser importing it from the `jco` repo
```js
import wasip2 from "https://cdn.jsdelivr.net/gh/bytecodealliance/jco@a72d4b38/packages/preview2-shim/lib/browser/wasip2.js";
```

We can now call the `instantiate` function, which takes a function to fetch and compile the WebAssembly binary, an object with the required imports, and returns an object for our component
```js
let demo = await instantiate(
    (url) => fetch(new URL(`./wasm/${url}`, import.meta.url)).then(WebAssembly.compileStreaming),
    { ...wasip2 }
);
```

And we can now call the `greet` function
```js
demo.greet("Jorge");
```

We can run this with Deno
```bash
deno -A main.js
```

which prints
```
hello Jorge, from Rust!
```

Note how we didn't specify an import for printing to the console, our Rust code simple used `println!`, and the WASI shim translated that to a `console.log` call.

## Posix emulation

We also implemented a `list-dir` function that interacts with the filesystem.
The WASI shim provides an emulated filesystem for our program to interact with.
Lets try it out
```js
console.log("listing /");
demo.listDir("/");
```

which prints
```
listing /
  < Empty >
```

The root of the emulated filesystem is empty.
Lets populate it.

```js
console.log("creating /home/web_user/");
const [[root]] = wasip2["wasi:filesystem/preopens"].getDirectories();
root.createDirectoryAt("/home/web_user/");

console.log("writing /foo.bar");
const fd = root.openAt({}, "/foo.bar", { create: true }, { write: true });
fd.write("hello world!", 0);
```

Now we can try calling `list-dir` again
```js
console.log("listing /");
demo.listDir("/");

console.log("listing /home");
demo.listDir("/home");
```

which prints
```
creating /home/web_user/
writing /foo.bar
listing /
  /foo.bar
  /home/
listing /home
  /home/web_user/
```

## Running in the browser

To run the script in the browser we need an `index.html` file
```html
<!doctype html>
<script type="module" src="./main.js"></script>
```

and now we can run `serve` and direct our browser to http://localhost:8000.

## Further reading

Check out `jco`'s WASI preview2 shim [repo](https://github.com/bytecodealliance/jco/tree/main/packages/preview2-shim).

Also check out the full WIT definition for `wasi:cli` in its [repo](https://github.com/WebAssembly/wasi-cli/blob/main/command.md)