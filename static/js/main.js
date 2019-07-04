function buildChart(subject_agg) {
  var baseUrl = "http://127.0.0.1:5000"
  var requestUrl = `/${subject_agg}`
  var url = baseUrl + requestUrl
  d3.json(url).then(function (response) {
    console.log(response);
    // var all = response.mean_score
    // console.log(all)
    // var asian = response.mean_asian
    // var black = response.mean_black
    // var female = response.mean_female
    // var hispanic = response.mean_hispanic
    // var m_f_gap = response.mean_m_f_gap
    // var male = response.mean_female
    // var w_a_gap = response.mean_w_a_gap
    // var w_b_gap = response.mean_w_b_gap
    // var w_h_gap = response.mean_w_h_gap
    // var white = response.mean_white
    // var state = response.state
  })

}


function init() {

  var subSelector = d3.select("#selSubject")
  var subjects = {"Math": "math_2013_agg", 
    "ELA": "ela_2013_agg"}
  var gradeSelector = d3.select("#selGrade")
  var grades = ["3","4","5","6","7","8"]

  Object.entries(subjects).forEach(([subject, value]) => {
    subSelector
      .append("option")
      .text(subject)
      .property("value", value)
  }
  )
  grades.forEach(grade => {
    gradeSelector
      .append("option")
      .text(grade)
      .property("value", grade)
  })

   

};

  // whiteList = ["white"]
  // stateList = ["state"]
  // for (i in response) {
  //   stateList.append(state)
  // }
var full = [
  ["state", "AL", "AK", "NY", "WY", "MA", "HI", "CA", "OR", "WA", "IN", "BcA", "cNonsense", "Bclah", "Whece"],
  ["white", 20, 10, 55, 66, 66, 67, 68, 69, 55, 66, 66, 67, 68, 69],
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
  data: {
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


function optionChanged(newSelection) {
  buildChart(newSelection);
}

init();

