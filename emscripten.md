# Running Rust in the browser with `emscripten`

This guide will show you how to run Rust with POSIX emulation in de browser with emscripten.

## Setup

To compile using emscripten we need to install the rustup target
```bash
rustup target add wasm32-unknown-emscripten
```

and the emscripten toolchain
```bash
git clone https://github.com/emscripten-core/emsdk.git
./emsdk/emsdk install latest
./emsdk/emsdk activate latest
. ./emsdk/emsdk_env.sh
```

## Writing the module

Let's create our own `demo` component, we need a crate for it
```bash
cargo init --bin --name demo
```

Note that this is a `bin` crate (and not a `lib`). This means that our module could have a `fn main()` that starts executing when the module loads. As we don't need that we are going to add to `src/main.rs`
```rust
#![no_main]
```

We can now implement our `add` function
```rust
#[no_mangle]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}
```

## Compiling it

Before compiling the module, we need to add some linker flags to make emscripten generate code modern ES6 code and to also include the `cwrap` utility. We do that in the `.cargo/config.toml` file
```toml
[target.wasm32-unknown-emscripten]
rustflags = [
    "-Clink-args=-sEXPORT_ES6",
    "-Clink-args=-sENVIRONMENT=web",
    "-Clink-args=-sEXPORTED_RUNTIME_METHODS=cwrap",
]
```

Compiling the WebAssembly module is straight forward, simply run
```bash
cargo build --release --target=wasm32-unknown-emscripten
```

We can now make a copy of the files for easier access
```bash
mkdir -p wasm
cp ./target/wasm32-unknown-emscripten/release/demo.{js,wasm} ./wasm/
```

## Running it

To run our code we create a `main.js` file. Running an emscripten module in JavaScript is straight forward

1. import the generated module
```js
import Demo from "./wasm/demo.js"
```

2. This exports an async factory function
```js
const demo = await Demo();
```

In order to call the `add` function we need to ask empscripten to wrap it, for that we use the `cwrap` method that we mentioned earlier, which needs the function signature
```js
const add = demo.cwrap("add", 'number', ['number', 'number']);
const sum = add(21, 21);
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

## Posix emulation

Lets now add a function to show the content of a directory
```rust
#[no_mangle]
pub fn list_dir(path: *const i8) {
    let path = unsafe { std::ffi::CStr::from_ptr(path) }.to_str().unwrap();
    
    let Ok(dir) = std::fs::read_dir(path) else {
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
            if std::fs::read_dir(&path).is_ok() {
                println!("  {}/", path.display());
            } else {
                println!("  {}", path.display());
            }
        }
    }
}
```

Emscripten targets C and C++, as such we should expose a C ABI in our exported function to take full advantage of its tooling.

We also edit `.cargo/config.toml` so that we export the emscripte's `FS` module
```
    "-Clink-args=-sEXPORTED_RUNTIME_METHODS=cwrap,FS",
```

We now recompile, and call it from JavaScript
```js
const list_dir = demo.cwrap("list_dir", null, ['string']); // This assumes C style strings

console.log("listing /");
list_dir("/");
```

With the exported `FS` module we can interact with emscripten's file system from JavaScript
```js
console.log("listing /home/web_user");
list_dir("/home/web_user");

console.log("writing /home/web_user/foo.txt");
demo.FS.writeFile("/home/web_user/foo", "bar");

console.log("listing /home/web_user");
list_dir("/home/web_user");
```

We can now run it with Deno, and we get
```
listing /
  /tmp/
  /home/
  /dev/
  /proc/
listing /home/web_user
  < Empty >
writing /home/web_user/foo.txt
listing /home/web_user
  /home/web_user/foo
```

## Interacting with the host

Being a C/C++ toolchain, emscripten provides lots of features for those languages.
Third party crates bring *some* of those featues to Rust, let's add one of those crates
```bash
cargo add emscripten-functions
```

We can now write a print function that shells out to JavaScript
```rust
fn print(s: &str) {
    emscripten_functions::emscripten::run_script(format!("console.log({s:?})"));
}
```

And we can use it from out `greet` function
```rust
#[no_mangle]
pub fn greet(name: *const i8) {
    let name = unsafe { std::ffi::CStr::from_ptr(name) }.to_str().unwrap();
    let s = format!("hello {name}, from Rust!");
    print(&s);
}
```

After compiling, we can call `greet` in `main.js`
```js
const greet = demo.cwrap("greet", null, ['string']);
greet("Jorge");
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

## Further reading

Check out the emscripten [website](https://emscripten.org), in particular the documentation about [interacting with code](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html).
