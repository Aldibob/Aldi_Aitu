/*var num = 5;
num = 7;
console.log("Number: " + num);

const num1 = 10;
console.log("Constant Number: " + num1);

var number;
number = false;

var res = num * num1;

console.log("Result: " + res);

var num2 = 5;
num2 += 7;
console.log("Number 2: " + num2);
*/
const burger = document.getElementById("burger");
const nav = document.getElementById("nav-menu");

burger.addEventListener("click", function () {
    nav.classList.toggle("active");
    });