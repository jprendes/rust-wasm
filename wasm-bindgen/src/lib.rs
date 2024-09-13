use wasm_bindgen::prelude::*;

#[wasm_bindgen(raw_module="../host.js")]
extern {
    fn print(s: &str);
}

#[wasm_bindgen]
pub struct Stats {
    pub total: u32,
    pub count: u32,
}

#[wasm_bindgen]
pub fn count_x(s: &str) -> Stats {
    let total = s.len() as _;
    let count = s.as_bytes().iter().filter(|x| **x == b'x').count() as _;
    //print(&format!("\"{s}\" has ${count} letters \"x\""));
    Stats { total, count }
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    let s = format!("hello {name}, from Rust!");
    print(&s);
}