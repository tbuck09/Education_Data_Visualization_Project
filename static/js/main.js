// function buildChart(subject_agg) {

//   var url = `/${subject_agg}`

//   d3.json(url).then(function (response) {
//     console.log(response);
//     var all = response.mean_score
//     console.log(all)
//     var asian = response.mean_asian
//     var black = response.mean_black
//     var female = response.mean_female
//     var hispanic = response.mean_hispanic
//     var m_f_gap = response.mean_m_f_gap
//     var male = response.mean_female
//     var w_a_gap = response.mean_w_a_gap
//     var w_b_gap = response.mean_w_b_gap
//     var w_h_gap = response.mean_w_h_gap
//     var white = response.mean_white
//     var state = response.state
//   })



//   var chart = c3.generate({
//     bindto: '#chart',
//     size: {
//       height: 500,
//       width: 1000
//     },
//     data: {
//       type: 'bar',
//       json: [
//         {"key": , "value": },
//         {"key": , "value": }
//       ],
//       keys: {

//       }
//     },
//     axis: {
//       x: {
//         type: 'category'
//       }
//     },
//     bar: {
//       width: {
//         ratio: 0.5
//       }
//     }
//   });
// }
// function init() {

//   var selector = de.select("#selDataset")

//   d3.json().then((entries) => {
//     entries.forEach((entry) =>{
//       selector
//       .append("option")
//       .text(entry)
//     }
//     )
//   })
// }

// whiteList = ["white"]
// stateList = ["state"]
// for (i in response) {
// stateList.append(state)
// }
var full = [
  ["state", "AL", "AK", "NY", "BB", "BA", "Nonsense", "Blah", "Whee", "NcY", "BBc", "BcA", "cNonsense", "Bclah", "Whece"],
  ["white", 30, 45, 55, 66, 66, 67, 68, 69, 55, 66, 66, 67, 68, 69],
  ["black", 31, 44, 55, 66, 66, 67, 68, 69, 55, 66, 66, 67, 68, 69],
  ["hispanic", 31, 44, 55, 66, 66, 67, 68, 69, 55, 66, 66, 67, 68, 69],
  ["asian", 31, 44, 55, 66, 66, 67, 68, 69, 55, 66, 66, 67, 68, 69]
]

var chart = c3.generate({
  bindto: '#chart',
    size: {
      height: 500,
      width: 1000
    },
    data:{
      x: "state",
      columns: full,
      type: "bar"
  
},
subchart: {
  show: true
},
width: {
  ratio: 0.8
},
axis: {
  x: {
    type: "category",
    
  }
},
zoom: {
  enabled: true,
  initialRange: [-1, 5]
}
  // bar: {
  //     width: {
  //         ratio: 0.5
  //     }
  // }
});