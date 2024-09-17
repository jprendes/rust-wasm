mod bindings {
    wit_bindgen::generate!({
        world: "demo",
    });
}

use bindings::Guest;

struct Component;
bindings::export!(Component with_types_in bindings);

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
