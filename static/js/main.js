function buildChart(subject_agg) {

var url = `/${subject_agg}`

d3.json(url).then(function (response) {
  console.log(response);
  var all = response.mean_score
  console.log(all)
  var asian = response.mean_asian
  var black = response.mean_black
  var female = response.mean_female
  var hispanic = response.mean_hispanic
  var m_f_gap = response.mean_m_f_gap
  var male = response.mean_female
  var w_a_gap = response.mean_w_a_gap
  var w_b_gap = response.mean_w_b_gap
  var w_h_gap = response.mean_w_h_gap
  var white = response.mean_white
  var state = response.state
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
}