// Set initial value for chart view
var zoomRange = [-1.0, 5.0]

// Function to build charts showing race and grade
function buildChart(subjectSelection, gradeSelection, zoom) {
  zoom = zoomRange
  var baseUrl = "http://127.0.0.1:5000"
  var requestUrl = `/${subjectSelection}/${gradeSelection}`
  var url = baseUrl + requestUrl
  d3.json(url).then(function (response) {
    
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
// Generate chart with C3
    var chart = c3.generate({
      bindto: '#chart',
      size: {
        height: 500,
        width: 800
      },
      data: {
        x: "State",
        columns: demographics,
        type: "bar",
        colors: demoColors,

      },
      axis: {
        x:{ 
          type: "category",
        label: {
          text: "State",
          position: "outer-center"
        }
      },
      y:{ 
        label: {
          text: "Mean NAEP Score",
          position: "outer-middle"
        }
      }
      },
      subchart: {
        show: true,
        onbrush: function(domain) {
          
          zoomRange = domain
          
          
        }
      },
      width: {
        ratio: 0.8
      },
      zoom: {
        enabled: true,
        initialRange: zoomRange 
      }
    
      
    });
    
  })
  
  
}
// Function to build chart comparing sex and grade by state
function buildMFChart(subjectSelection, gradeSelection, zoom) {
  zoom = zoomRange
  var baseUrl = "http://127.0.0.1:5000"
  var requestUrl = `/${subjectSelection}/${gradeSelection}`
  var url = baseUrl + requestUrl
  
  d3.json(url).then(function (response) {
    
    var all = ["All"]
    var female = ["Female"]
    var male = ["Male"]
    var state = ["State"]
    var grade = ["Grade"]
    Object.values(response).forEach((datum) => {
      all.push(datum.mean_score)
     
      female.push(datum.mean_female)
      male.push(datum.mean_male)
      state.push(datum.state)
      grade.push(datum.grade)
    })
   
    var sex = [
      state,
      male,
      female
    ]

    var sexColors = {
      Female: "#FF8C00",
      Male: "#808080",

    }
// Build chart with C3
    var chart = c3.generate({
      bindto: '#chart',
      size: {
        height: 500,
        width: 800
      },
      data: {
        x: "State",
        columns: sex,
        type: "bar",
        colors: sexColors,

      },
      axis: {
        x:{ 
          type: "category",
        label: {
          text: "State",
          position: "outer-center"
        }
      },
      y:{ 
        label: {
          text: "Mean NAEP Score",
          position: "outer-middle"
        }
      }
      },
      zoom: {
        enabled: true,
        initialRange: zoomRange
      },
      subchart: {
        show: true,
        onbrush: function(domain) {
         
          zoomRange = domain
         
        }
      }
   
    });
   
  })
 
};

// Initialize the JS
function init() {

  var subSelector = d3.select("#selSubject");
  var subjects = {
    "Math": "math_2013_agg",
    "ELA": "ela_2013_agg"
  };
  var gradeSelector = d3.select("#selGrade");
  var grades = ["3", "4", "5", "6", "7", "8"];
  var sex = [
    "All",
    "Male/Female"
  ];

  var sexSelector = d3.select("#selSex")
  sex.forEach(sex => {
    sexSelector
      .append("option")
      .text(sex)
      .property("value", sex)

  });

  Object.entries(subjects).forEach(([subject, value]) => {
    subSelector
      .append("option")
      .text(subject)
      .property("value", value)
  }
  );
  grades.forEach(grade => {
    gradeSelector
      .append("option")
      .text(grade)
      .property("value", grade)
  });
  
  const firstSubject = subjects[Object.keys(subjects)[0]];
  const firstGrade = grades[0];

  buildChart(firstSubject, firstGrade, zoomRange);
  reportCard(firstSubject,firstGrade);
};





// Functions to change chart views based on user inputs

function subOptionChanged(newSelection, zoom) {
  var staticGradeSelection = document.getElementById("selGrade").value;
  var staticSexSelection = document.getElementById("selSex").value;
  
 
  zoom = zoomRange;
  if (document.getElementById("selSex").value == "All") {
    buildChart(newSelection, staticGradeSelection, zoom);
    reportCard(newSelection,staticGradeSelection);
  }
  else {
    buildMFChart(newSelection, staticGradeSelection, staticSexSelection, zoom);
    reportCard(newSelection,staticGradeSelection);
  }
}

function gradeOptionChanged(newSelection, zoom) {
  var staticSubSelection = document.getElementById("selSubject").value;
  
  var staticSexSelection = document.getElementById("selSex").value;

  zoom = zoomRange;

  if (document.getElementById("selSex").value == "All") {
    buildChart(staticSubSelection, newSelection, zoom);
    reportCard(staticSubSelection,newSelection);
  }
  else {
    buildMFChart(staticSubSelection, newSelection, staticSexSelection, zoom);
    reportCard(staticSubSelection,newSelection);
  }
};

function sexOptionChanged(newSelection, zoom) {
  var staticSubSelection = document.getElementById("selSubject").value;
  var staticGradeSelection = document.getElementById("selGrade").value;
  zoom = zoomRange;
  if (document.getElementById("selSex").value == "All") {
    buildChart(staticSubSelection, staticGradeSelection, zoom)
    reportCard(staticSubSelection,staticGradeSelection)
  }
  else {
    buildMFChart(staticSubSelection, staticGradeSelection, newSelection, zoom)
    reportCard(staticSubSelection,staticGradeSelection)
  }
};

init();

