let mean1 , mean2 ,sigma1 , sigma2 ,lambda ;

let arrivalRandom = Prob.normal(mean1, sigma1); // function to be called latter
let exeRandom = Prob.normal(mean2, sigma2);
let priorityRandom = Prob.poission(lambda);

function generateProcess(n){
	// for i -> generate process(arrivalRandom() , ..)
}