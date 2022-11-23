// let v1 = "v1";
// // 10000 code
// v1 = "a";
// let v2 = "v2";

let o = {
  v1: "v1",
  v2: "v2",
};
function f1() {
  console.log(o.v1);
}
function f2() {
  console.log(o.v2);
}
f1();
f2();

let opp = {
  v1: "v1",
  v2: "v2",
  f1: function () {
    console.log(this.v1);
  },
  f2: function () {
    console.log(this.v2);
  },
};
opp.f1();
opp.f2();
