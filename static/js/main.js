// var unzip = require('unzip-array');

function buildChart(subjectSelection, gradeSelection) {
  var baseUrl = "http://127.0.0.1:5000"
  var requestUrl = `/${subjectSelection}/${gradeSelection}`
  var url = baseUrl + requestUrl
  d3.json(url).then(function (response) {
    // console.log(response);
    var all = ["All"]
    var asian = ["Asian"]
    var black = ["Black"]
    var female = ["Female"]
    var hispanic = ["Hispanic"]
    var m_f_gap = []
    var male = ["Male"]
    var w_a_gap = []
    var w_b_gap = []
    var w_h_gap = []
    var white = ["White"]
    var state = ["State"]
    var grade = ["Grade"]
    Object.values(response).forEach((datum) => {
      all.push(datum.mean_score)
      // console.log(all)
      asian.push(datum.mean_asian)
      black.push(datum.mean_black)
      female.push(datum.mean_female)
      hispanic.push(datum.mean_hispanic)
      m_f_gap.push(datum.mean_m_f_gap)
      male.push(datum.mean_female)
      w_a_gap.push(datum.mean_w_a_gap)
      w_b_gap.push(datum.mean_w_b_gap)
      w_h_gap.push(datum.mean_w_h_gap)
      white.push(datum.mean_white)
      state.push(datum.state)
      grade.push(datum.grade)
    })
    // console.log(state)
    // console.log(asian)
    var demographics = [
      state,
      white,
      black,
      hispanic,
      asian
    ]

    var demoColors = {
      White: "#003f5c",
      Black: "#7a5195",
      Hispanic: "#ef5675",
      Asian: "#ffa600"
    }

    var chart = c3.generate({
      bindto: '#chart',
      size: {
        height: 500,
        width: 1000
      },
      data: {
        x: "State",
        columns: demographics,
        type: "bar",
        colors: demoColors,

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
  })

}


function init() {

  var subSelector = d3.select("#selSubject")
  var subjects = {
    "Math": "math_2013_agg",
    "ELA": "ela_2013_agg"
  }
  var gradeSelector = d3.select("#selGrade")
  var grades = ["3", "4", "5", "6", "7", "8"]
  var sex = ["All", "Male"]

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
const firstSubject = subjects[Object.keys(subjects)[0]];
const firstGrade = grades[0];
// console.log(firstSubject)
buildChart(firstSubject, firstGrade);


};

// whiteList = ["white"]
// stateList = ["state"]
// for (i in response) {
//   stateList.append(state)
// }





function subOptionChanged(newSelection) {
  var staticGradeSelection = document.getElementById("selGrade").value
  console.log(staticGradeSelection)
  buildChart(newSelection, staticGradeSelection);
}

function gradeOptionChanged(newSelection) {
  var staticSubSelection = document.getElementById("selSubject").value
  console.log(staticSubSelection)
  buildChart(staticSubSelection, newSelection);
}

// function sexOptionChanged(newSelection) {

// }

init();

