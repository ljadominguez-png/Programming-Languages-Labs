function add(a,b){
    return a + b;
}

for (let i = 0; i < 5000000000000; i++){
    add(i, i+1);
}

console.log(add("Hello",2));
