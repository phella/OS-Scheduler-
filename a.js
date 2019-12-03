let contextSwitching =0.1;
let quantumTime = 2.4; 
const data = [["x" , "y"]];
class process {
	constructor(number , arrival , excution , priority) {
		this.number = number;
		this.arrival = arrival;
		this.excution = excution ;
		this.priority = priority;
		this.finish = -1;
		this.running = [];
	  }
}

class Time {
	constructor(start , end){
		this.start = arguments[0];
		this.end = arguments[1];
	}
}

function sortGraph(a,b) {
	return compare(a,b,"x");
}

function sortArrival(a,b) {
	return compare(a,b,"arrival");
  }

function sortPriority(a,b) {
	return compare(a,b,"priority");
  }

function compare(a, b , propertyA) {
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
	processes[0].finish =  processes[0].arrival + processes[0].excution;
	let time =new Time(processes[0].arrival , processes[0].finish );
	processes[0].running.push(time);

	for(let i = 1 ; i < processes.length ; i++ ) {
		const start = processes[i-1].finish + contextSwitching;
		processes[i].finish = start + processes[i].excution;
		let rtime = new Time(start , processes[i].finish);
		processes[i].running.push(rtime);
	}
	console.log(processes);
}

function buildGraph(processes) {
	processes.forEach(element => {
		const num = element.number;
		element.running.forEach(run => {
			const temp1 = [run.start - 0.000001  , 0];
			const temp2 = [ run.start , num];
			const temp3 = [ run.end , num];
			const temp4 = [run.end + 0.000001 , 0];
			data.push(temp1,temp2,temp3,temp4);
		})
		
	});
	console.log(data);
	data.sort(sortGraph);
	// drawChart(data);
}
function getarr(){
	return data;
}

(function test(){
let process1 = new process(1,1,3,4);
let process2 = new process(2,2,3,4);
let process3 = new process(3,10,3,4);
let processes = [process1 , process2 , process3];
FCFS(processes);
buildGraph(processes);
})();
