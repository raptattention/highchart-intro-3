$(document).ready(function(){
	var Chart = function(){
    this.rawData = [];
    this.chartData = [];
	};

  var simpleMovingAverage = function (data, division){
    var avData = [];
    for (var i = division; i <= data.length; i++) {
      var sum = 0;
      for (var j = i - 1; j > i - 1 - division; j--) {
        sum += data[j].y
      }
      var average = sum/division;
      avData.push({
        x: data[i - 1].x,
        y: average
      })
    }
    return avData;
  }

  Chart.prototype.getData = function(){
    $.ajax({
      context: this,
      type: 'GET',
      url: 'https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB',
      success: function(response){
        var items = response.data.reverse();
        for (i=0; i<items.length; i++){
          this.rawData.push({
            x: new Date(items[i][0]),
            y: items[i][1]
          });
        }
        var weekAverage = simpleMovingAverage(this.rawData, 1);
        var monthAverage = simpleMovingAverage(this.rawData, 4);
        var quarterAverage = simpleMovingAverage(this.rawData, 13);
        var yearAverage = simpleMovingAverage(this.rawData, 52);
        this.chartData.push({
          name: "Weekly",
          data: weekAverage
        },{
          name: "Monthly",
          data: monthAverage
        },{
          name: "Quarterly",
          data: quarterAverage
        },{
          name: "Yearly",
          data: yearAverage
        });
        this.graph();
      }
    });   
  };

  Chart.prototype.graph = function(){
    $('#chart').highcharts({
      title: {
        text: "Historical Gasoline Prices",
        x: -20
      },
      subtitle: {
        text: "quandl"
      },
      xAxis: {
        type: "datetime"
      },
      yAxis: {
        title: "Price"
      },
      legend: {
        align: "right",
        layout: "vertical",
        verticalAlign: "top",
        y: 160
      },
      series: this.chartData
    });
  };

  var sampleGraph = new Chart();
  sampleGraph.getData();
});