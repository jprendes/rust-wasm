import Demo from "./wasm/demo.js"

const demo = await Demo();

const add = demo.cwrap("add", 'number', ['number', 'number']);
const sum = add(21, 21);
console.log(`21 + 21 = ${sum}`);

const list_dir = demo.cwrap("list_dir", null, ['string']); // This assumes C style strings

console.log("listing /");
list_dir("/");

console.log("listing /home/web_user");
list_dir("/home/web_user");

console.log("writing /home/web_user/foo.txt");
demo.FS.writeFile("/home/web_user/foo", "bar");

console.log("listing /home/web_user");
list_dir("/home/web_user");

const greet = demo.cwrap("greet", null, ['string']);
greet("Jorge");
