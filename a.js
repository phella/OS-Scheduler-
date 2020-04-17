let contextSwitching = 0.5;
let quantumTime = 1;
const data = [["x", "y"]];
number = 0;
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
	return compare(a, b, "remaining");
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
	let processes2 = processes.slice();
	processes2.sort(sortArrival);
	let timer = 0;
	let queue = [];
	let finished = [];
	let last = -1;
	// sortExecution
	while(processes2.length != 0 || queue.length != 0){
		let j = 0;
		processes2.sort(sortArrival);
		while(j< processes2.length &&  processes2[j].arrival <= timer){
			queue.push(	processes2.shift());
			j++;
		}
		if(queue.length == 0){
			timer += 0.0001;
		}

		if(0 < queue.length) {
			// console.log(queue);
			queue.sort(sortExecution);
			// console.log(queue);
			if(queue[0].number == last){
				timer -= contextSwitching;
			}
			let start = timer;
			let run = queue[0].remaining > 0.0001 ? 0.0001 : queue[0].remaining;
			queue[0].remaining -= run;
			let end = start + run ;
			if(queue[0].number == last)
			{
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
	arr = []
	modified_rr(proccesses , arr);
	//buildGraph(proccesses);
	console.log(arr);
	console.log(number);
	buildTable(arr);

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

function modified_rr(processes , finished_array){
	processes.sort(sortExecution);
	queue = [];
	let t = 0;
	while(processes.length != 0 ){
		if(queue.length == 0){
			t += 0.1;
		}
		let counter = 0;
		if(processes[counter].arrival < t){
			insert_process(queue , processes[0]);
			processes.shift()
		}
		let quantum;
		//console.log(queue)
		if(queue != false)
			quantum = queue[Math.floor(queue.length/2)].remaining;
		counter = 0 ;
		finished = 0;
		queue.sort(sortExecution);


		while(counter < queue.length){
			const next_pos = counter - finished;
			const next_len = queue.length - finished;
			const scale_factor = get_factor( quantum , queue[counter].remaining , queue[counter].priority , next_pos/next_len );
		
			if(quantum * scale_factor >= queue[counter].remaining){
				finished += 1;
				t += queue[counter].remaining;
				queue[counter].finish = t;
				finished_array.push(queue[counter]);
				// console.log(queue[counter])
				queue.splice(counter , 1);
			} else {
				queue[counter].remaining -= quantum * scale_factor;
				t += quantum * scale_factor;
			}
			t += contextSwitching;
			number++;
			counter++;
		}
	}
}

function insert_process(arr , el){
	let i = 0;
	if(arr.length == 0){
		arr.splice(i,0,el);
		return ;
	}
	for(  ; i < arr.length ; i++){
		if(el.remaining < arr[i].remaining){
			arr.splice(i, 0, el);
			return;
		}
	}
	arr.splice(i + 1,0,el);
}

function get_factor(quantum ,remaining , priority , next_pos){
	if(remaining < 2 * quantum ){
		return 1.2;
	} else if (remaining < 5 * quantum && next_pos <= 0.5){
		return 1;
	} else if ( remaining < 5 * quantum && next_pos > 0.5){
		return 1;
	} 

	if(priority == 0){
		return 1.4;
	} else if ( priority == 1){
		return 1;
	}else {
		return 0.7;
	}
}