mod bindings {
    wit_bindgen::generate!({
        world: "demo",
    });
}

use bindings::{ Stats, Guest };
use bindings::host::print;

struct Component;
bindings::export!(Component with_types_in bindings);

impl Guest for Component {
    fn count_x(s: String) -> Stats {
        let total = s.len() as _;
        let count = s.as_bytes().iter().filter(|x| **x == b'x').count() as _;
        Stats { total, count }
    }
    fn greet(name: String) {
        let s = format!("hello {name}, from Rust!");
        print(&s);
    }
}
