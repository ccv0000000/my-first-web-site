// let i = if(true) {console.log(1)} //error
// let w = while(true) {console.log{1}} //error

let f = function () {
  console.log(1 + 1);
  console.log(2 + 2);
};

let arr = [f];
arr[0]();

let obj = {
  func: f,
};
obj.func();
