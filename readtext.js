let result;
let noProcesses ;
let lambda , mean1 , sigma1 , mean2 , sigma2;
let proccesses = [];


function preload() {
  result = loadStrings('assets/test.txt');
}

function setup() {
  parseText(result);
  let arrivalRandom = Prob.normal(mean1, sigma1);
  let exeRandom = Prob.normal(mean2, sigma2);
  // let priorityRandom = Prob.poisson(lambda);
  for (let i =0 ;i<noProcesses;i++) {
    proccesses.push(new process(i+1 ,Number( arrivalRandom().toFixed(2) ),Number( exeRandom().toFixed(2)),getRandomInt(3)));
  }
  const strings = proccesToSting(proccesses);
  saveStrings(strings,'out.txt');
  test(proccesses);
}

function parseText(str){
  noProcesses = Number(str[0]);
  let n = str[1].search(" ");
  let temp =  str[1].substring(0,n);
  mean1 = Number(temp);
  temp = str[1].substring(n);
  sigma1 = Number(temp);
  n = str[2].search(" "); 
  temp =  str[2].substring(0,n);
  mean2 = Number(temp);
  temp = str[2].substring(n);
  sigma2 = Number(temp);
  lambda = Number(str[3]);
}

function proccesToSting(proccesses) {
  let arr = [];
  for(let i = 0 ;i<noProcesses;i++){
    let str = proccesses[i].number + ' ' + proccesses[i].arrival + ' ' + proccesses[i].excution + ' ' +proccesses[i].priority;
    arr.push(str);
  }
  return arr;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}