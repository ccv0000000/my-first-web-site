// function a() {
//   console.log("a");
// }
// a();

let a = function () {
  console.log("a");
};
// a();

function slowFunction(callback) {
  callback();
}

slowFunction(a);
