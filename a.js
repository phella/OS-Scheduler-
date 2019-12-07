let contextSwitching = 0.5;
let quantumTime = 1;
const data = [["x", "y"]];
class process {
	constructor(number, arrival, excution, priority) {
		this.number = number;
		this.arrival = arrival;
		this.excution = excution;
		this.remaining = excution;
		this.priority = priority;
		this.finish = -1;
		this.running = [];
		this.end = -1;
		this.done = false;
	}
	getTurnAround(){
		this.turnAround = this.finish - this.arrival;
		return this.turnAround;
	}
	getWeightedTurnAround(){
		return (this.turnAround / this.excution);
	}
	getWaitTime(){
		return this.turnAround - this.excution;
	}
}

class Time {
	constructor(start, end) {
		this.start = arguments[0];
		this.end = arguments[1];
	}
}

function sortGraph(a, b) {
	return compare(a, b, "x");
}

function sortArrival(a, b) {
	return compare(a, b, "arrival");
}

function sortPriority(a, b) {
	return compare(a, b, "priority");
}

function sortExecution(a, b) {
	return compare(a, b, "excution");
}
function compare(a, b, propertyA) {
	let comparison = 0;
	if (a[propertyA] > b[propertyA]) {
		comparison = 1;
	} else if (a[propertyA] < b[propertyA]) {
		comparison = -1;
	}
	return comparison;
}

function FCFS(processes) {
	processes.sort(sortArrival);
	let d = 0;
	for (j = 1; j < 200; j = j + 0.0001) {
		if (processes.length != d) {
			for (i = 0; i < processes.length; i++) {

				if (processes[i].done == false && processes[i].arrival <= j) {
					const start = j;
					j = j + processes[i].excution;
					const end = j;
					let rtime = new Time(start, end);
					processes[i].finish = end;
					processes[i].running.push(rtime);
					processes[i].done = true;
					d++;
					break;
				}
			}
		}
	}
}
function HPF(processes) {
	processes.sort(sortPriority);
	let d = 0;
	for (j = 1; j < 200; j = j + 0.0001) {
		if (processes.length != d) {
			for (i = 0; i < processes.length; i++) {

				if (processes[i].done == false && processes[i].arrival <= j) {
					const start = j;
					j = j + processes[i].excution;
					const end = j;
					let rtime = new Time(start, end);
					processes[i].finish = end;
					processes[i].running.push(rtime);
					processes[i].done = true;
					d++;
					break;
				}
			}
		}
	}
}
function SRTN(processes) {
	let last =-1;
	for (j = 1; j < 200; j += 0.0001) {
		processes.sort(sortExecution);
		for (i = 0; i < processes.length; i++) {
			if (processes[i].done == false && processes[i].arrival <= j) {
				let start = j;
				let temp = processes[i].excution;
				processes[i].excution -= quantumTime;
				if (processes[i].excution <= 0) {
					j += temp;
					processes[i].done = true;
				}
				else {
					j += quantumTime;
				}
				let end = j;
				let rtime = new Time(start, end);
				if(processes[i] == last ){
					let x = processes[i].running.pop();
					rtime.start = x.start;
				} else  {
					rtime.start += contextSwitching;
				}
				processes[i].running.push(rtime);
				last = processes[i];
				break;
			}
		}
	}
}

function roundRobin(processes) {
	let processes2 = processes.slice();
	processes2.sort(sortArrival);
	let timer = 0;
	let queue = [];
	let finished = [];
	let last = -1;
	while(processes2.length != 0 || queue.length != 0){
		let j = 0;
		while(j< processes2.length &&  processes2[j].arrival <= timer){
			queue.push(	processes2.shift());
			j++;
		}
		if(queue.length == 0){
			timer += 0.0001;	
		}
		for(let i = 0 ; i < queue.length ; i++) {
			if(queue[0].number == last){
				timer -= contextSwitching;
			}
			let start = timer;
			let run = queue[0].remaining > quantumTime ? quantumTime : queue[0].remaining;
			queue[0].remaining -= run;
			let end = start + run ;
			if(queue[0].number == last){
				let lrun = queue[0].running.pop();
				start = lrun.start;
			}
			let rtime = new Time(start,end);
			queue[0].running.push(rtime);
			last = queue[0].number;
			let process = queue.shift();
			timer = end + contextSwitching; 
			let j = 0;
			while(j< processes2.length &&  processes2[j].arrival <= timer - contextSwitching) {
				queue.push(	processes2.shift());
				j++;
			} 
			if(process.remaining <= 0) {
				finished.push(process);
				process.finish = end;
			} else {
				queue.push(process);
			}
		}
	}
	processes = finished.slice();
}

function buildGraph(processes) {
	processes.forEach(element => {
		const num = element.number;
		element.running.forEach(run => {
			const temp1 = [run.start - 0.000001, 0];
			const temp2 = [run.start, num];
			const temp3 = [run.end, num];
			const temp4 = [run.end + 0.000001, 0];
			data.push(temp1, temp2, temp3, temp4);
		})

	});
	data.sort(sortGraph);
}
function getarr() {
	return data;
}

function test(proccesses) {
	roundRobin(proccesses);
	buildGraph(proccesses);
	console.log(proccesses);	
	buildTable(proccesses);
	
}

function buildTable(proccesses){
	let table = document.getElementById("myTable");
	let turnAroundSum = 0;
	let WeightedTurnAroundSum = 0;
	for(let i = 1; i <= proccesses.length;i++){
		let row = table.insertRow(i);
		let cell1 = row.insertCell(0);
		let cell2 = row.insertCell(1);
		let cell3 = row.insertCell(2);
		let cell4 = row.insertCell(3);
	turnAroundSum += proccesses[i-1].getTurnAround();
	WeightedTurnAroundSum += proccesses[i-1].getWeightedTurnAround();
	cell1.innerHTML = proccesses[i-1].number;
	cell2.innerHTML = proccesses[i-1].getTurnAround().toFixed(3);
	cell3.innerHTML = proccesses[i-1].getWaitTime().toFixed(3);
	cell4.innerHTML = proccesses[i-1].getWeightedTurnAround().toFixed(3);
	}
	let row = table.insertRow(proccesses.length + 1);
	let cell1 = row.insertCell(0);
	let cell2 = row.insertCell(1);
	let cell3 = row.insertCell(2);
	let cell4 = row.insertCell(3);
	cell2.innerHTML = (turnAroundSum / proccesses.length).toFixed(3) ;
	cell4.innerHTML = (WeightedTurnAroundSum / proccesses.length).toFixed(3);
}