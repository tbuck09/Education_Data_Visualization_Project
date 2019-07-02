
var selectedX
var selectedY
var url = `/${selectedSubject}`

d3.json(url).then(function(response){
    console.log(response);
    var x =response.selectedX
    var y =response.selectedY
})




var chart = c3.generate({
    bindto: '#chart',
    size: {
        height: 500,
        width: 1000
    },
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ],
      types: {
          data1: "bar",
          data2: "bar"
      }
    }
});