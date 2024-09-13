#[no_mangle]
fn add(a: u32, b: u32) -> u32 {
    a + b
}

#[no_mangle]
fn count_x(s: &str) -> u32 {
    let count = s.as_bytes().iter().filter(|x| **x == b'x').count() as _;
    count
}

#[link(wasm_import_module = "host")]
extern {
    #[allow(improper_ctypes)]
    fn print(s: &str);
}

#[no_mangle]
pub fn greet(name: &str) {
    let s = format!("hello {name}, from Rust!");
    unsafe { print(&s); }
}