# Running Rust in the browser with WebAssembly Components

This guide will show you how to run Rust in de browser using the WebAssembly Component Model.

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
    record stats {
        total: u32,
        count: u32,
    }
    export count-x: func(text: string) -> stats;
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

This generates a `Stats` type and a `Guest` trait for implementing the behaviour of the `demo` world
```rust
use bindings::{ Stats, Guest };
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
    fn count_x(s: String) -> Stats {
        let total = s.len() as _;
        let count = s.as_bytes().iter().filter(|x| **x == b'x').count() as _;
        Stats { total, count }
    }
}
```

## Compiling it

There are a few steps to compile the component:

1. Compile the crate to a core wasm module
```bash
cargo build --target wasm32-unknown-unknown --release
```

2. Convert the core wasm module to a wasm component
```bash
jco new ./target/wasm32-unknown-unknown/release/demo.wasm -o ./demo.wasm
```

3. Finally, we need to generate JS bindings for the component
```bash
jco transpile ./demo.wasm --out-dir ./wasm/ --instantiation
```

## Running it

To run our code we create a `demo.js` file and import the `instantiate` function from the generated bindings
```js
import { instantiate } from "./wasm/demo.js";
```

The `instantiate` function takes a function to fetch and compile the WebAssembly binary, and returns an object for our component
```js
let demo = await instantiate(
    (url) => fetch(new URL(`./wasm/${url}`, import.meta.url)).then(WebAssembly.compileStreaming)
);
```

Now we can execute the function
```js
const msg = "hello xoxoxo";
const stats = demo.countX(msg);
console.log(`"${msg}" has ${stats.count} letters "x" out of ${stats.total} in total`);
```

The generated bindings will take care of handling the input string, as well as the returned stats struct.

We can run this with Deno
```bash
deno -A main.js
```

which prints
```
"hello xoxoxo" has 3 letters "x" out of 12 in total
```

## Interacting with the host

To interact with the host we need to import functionalities.

We add to the `wit` file an imported `host` interface with a `print` function
```wit
    import host: interface {
        print: func(msg: string);
    }
```

now the `generate!` macro will also create a `host` module with a `print` function that we can use
```rust
use bindings::host::print;
```

Lets now add a `greet` function, adding it to the `wit` interface
```wit
    export greet: func(name: string);
```

This will add a new `greet` function to the `Guest` trait, which we need to implement
```rust
    fn greet(name: String) {
        let s = format!("hello {name}, from Rust!");
        print(&s);
    }
```

We can now re-build our component.

To run this code, we need to provide a host implementation fo the `print` function when we instantiate the component
```js
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
```

And we can now call our `greet` function:
```js
demo.greet("Jorge");
```

which when run with Deno prints
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

## Further reading

You can read more about `wit` [here](https://component-model.bytecodealliance.org/design/wit.html).

You can read more about `jco` [here](https://bytecodealliance.github.io/jco/introduction.html).
