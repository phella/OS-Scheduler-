google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = new google.visualization.arrayToDataTable(getarr());

  var options = {
	title: 'proccess number',
	hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
	vAxis: {minValue: 0}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
