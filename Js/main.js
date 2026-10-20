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


var number = 15;

if(number != 15) {
    console.log("ok");
} else if(number == 15) {
    console.log("Ok!");
} else {
    console.log("not ok");
}

var arr = [1, 2, 3, true, "string", -100, 4, 5];
console.log(arr);


for(var i = 1; i <= 10; i++) {
    console.log(i);
}
var j = 0;

while(j < 10) {
    console.log(j);
    j++;
}
*/

// alert("Hello, welcome to my website");
// var data = confirm("Вы сейчас дома?");
// console.log(data);

// var data = prompt("Введите ваш возраст: ");
// console.log(data);

// var person = null;

// if(confirm("Вы хотите ввести данные?")) {
//     person = prompt("Введите ваше имя: ");
//     alert("Привет, " + person + "!");
// } else {
//     alert("Вы отказались от ввода данных.");
// }

// function info(word) {
//     console.log(word + "!");   
// }

// function summa(a, b) {
//     var res = a + b;
//     info(res);
// }

// var sum1 = 0;

// function sum(arr) {
//     for(var i = 0; i < arr.length; i++) {
//         sum1 += arr[i];
//     }
//     return sum1;
// }

// var array = [1, 2, 3, 4, 5];
// var res1 = sum(array);
// console.log("Sum: " + res1);

const burger = document.getElementById("burger");
const nav_Menu = document.getElementById("nav-menu");

burger.addEventListener("click", function () {
    nav_Menu.classList.toggle("active");
    });

function notifyUser() {
    var userDecision = confirm("Do you want to receive notifications?");
    if(userDecision) {
        alert("You have successfully subscribed to notifications!");
    } else {
        alert("You pressed <Отмена>")
    }
}

function background_Color() {
    if (document.body.style.backgroundColor === "white") {
        document.body.style.backgroundColor = "#1a1a1a";
    } else {
        document.body.style.backgroundColor = "white";
    }
}

document.getElementById("color-button").addEventListener("click", background_Color);


function showDateTime() {
    const now = new Date();

    const formattedDate = now.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    document.getElementById("datetime").textContent = formattedDate;
}

showDateTime();
setInterval(showDateTime, 1000);
