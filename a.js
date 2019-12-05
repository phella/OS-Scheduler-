let contextSwitching = 0.5;
let quantumTime = 0.5;
const data = [["x", "y"]];
class process {
	constructor(number, arrival, excution, priority) {
		this.number = number;
		this.arrival = arrival;
		this.excution = excution;
		this.priority = priority;
		this.finish = -1;
		this.running = [];
		this.done = false;
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
					processes[i].running.push(rtime);
					processes[i].done = true;
					d++;
					j = j + contextSwitching
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
					processes[i].running.push(rtime);
					processes[i].done = true;
					d++;
					j = j + contextSwitching
					break;
				}
			}
		}
	}
}
function SRTN(processes) {
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
				processes[i].running.push(rtime);
				j = j + contextSwitching;
				break;
			}
		}
	}
}

function RR(processes) {
	let ready = [];
	let last = -1;
	for (j = 0; j < 200; j += 0.0001) {
		for (k = 0; k < processes.length; k++) {
			if (processes[k].done == false && processes[k].arrival <= j) {
				ready.push(processes[k].number);
			}
		}
		for (i = 0; i < ready.length; i++) {
			let start = j;
			let temp = processes[ready[i] - 1].excution;
			processes[ready[i] - 1].excution -= quantumTime;
			if (processes[ready[i] - 1].excution <= 0) {
				j += temp;
				processes[ready[i] - 1].done = true;
			} else {
				j += quantumTime;
			}
			let end = j;
			if (last != ready[i]) {
				j += contextSwitching;
			} else {
				let x = processes[ready[i] - 1].running.pop();
				start = x.start;
			}
			let rtime = new Time(start, end);
			last = ready[i];
			processes[ready[i] - 1].running.push(rtime);
		}
		ready = [];
	}
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
	HPF(proccesses);
	console.log(proccesses);
	buildGraph(proccesses);
}
