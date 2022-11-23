let object1 = {
  a: "1",
  b: "2",
  c: "3",
};
console.log(object1.a);

for (let name in object1) {
  console.log(name, object1[name]);
}
