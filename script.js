let test = document.getElementsByClassName("test")[0];

let h = window.getComputedStyle(test).height;
let w = window.getComputedStyle(test).width;

console.log("height = " + h + " " + "width = " + w);