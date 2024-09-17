#![no_main]

#[no_mangle]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}

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

fn print(s: &str) {
    emscripten_functions::emscripten::run_script(format!("console.log({s:?})"));
}

#[no_mangle]
pub fn greet(name: *const i8) {
    let name = unsafe { std::ffi::CStr::from_ptr(name) }.to_str().unwrap();
    let s = format!("hello {name}, from Rust!");
    print(&s);
}