//js let, const
// let ex. int age = 21 of for(int i = 0; i < n; i++)
// meaning let can change, how about const?
// const final int age = 21 meaning hindi siya na papalitan

//age = 23//error
let age = 21;
age = 23; // accepted reason: needs to be initialized first
console.log("The age : ", age); //output 23

//const
//const age = 24// error kase age has already been declared
const agecon = 24;
//agecon = 25//error ulit = const are immutable, not all the time, but it
//also means you cannot reassign the variable into a different value
console.log("The age : ", agecon); //output 25

//when to use const
// - when you do not intend to reassign it

// when to use let
// - when the value will change

// primitive types
// java     js
// int      number
// double   number
// String   string
// boolean  boolean
// null     null
// -        undefined

const number = "Twelve",
  ageer = 12,
  nigga = 0;
console.log(number, ageer, nigga);

// if else (similar sa java)

let x = 11;
if (x <= 10) {
  console.log("true");
} else {
  console.log("false");
}

// switch (similar sa java)
let y = 2;
switch (
  true //use true
) {
  case y <= 10:
    console.log("you are minor");
    break;
  case y >= 21 && y <= 30:
    console.log("you are not a minor");
    break;
}

// loops in js
// for
console.log("for loop");
for (let i = 0; i < age; i++) {
  console.log("minor[", i, "]");
}

//while loop
console.log("while");
let omg = 0;
while (omg != age) {
  console.log("While{", omg, "}");
  omg++;
}

//arrays
let arr1 = [1, 2, 2, 4, 5, 6, 7, 8, 9, 10, "nigga"];
arr1.pop(); //removes the racist word
//printing it all
/*for(let i = 0; i < arr1.length; i++){
    console.log(arr1[i])
}*/
//for of better
for (const items of arr1) {
  console.log(arr1[items]);
}

//functions
// these are reusable methods or reusable blocks of codes to perform a specific function
//simple function

function add(a, b) {
  return a * b;
}

//recursive function
function recursive(a) {
  if (a === 0) {
    console.log("exit");
    return 0;
  }
  return a + recursive(a - 1);
}
console.log(recursive(10));

/*The 4 Main Types of Scope
Global Scope: Variables declared outside any function 
or block. They are accessible from absolutely anywhere 
in your script.

Block Scope: Variables declared inside curly braces {} 
(like if statements or loops). Only accessible inside 
that specific block. Only applies to let and const.

Function Scope: Variables declared inside a function. 
They cannot be accessed outside of it. Applies to var, 
let, and const.

Module Scope: Variables declared inside a JavaScript 
Module. They are isolated to that file unless explicitly 
exported. */
