// Height and Width to be determined upon integration with the rest of the code
var divHeight= 600
var divWidth= 400

var svgHeight= 1200;
var svgWidth= divWidth * .8 + 40;

var chartOffsetX= 40
var chartOffsetY= 40

// Add styles to #report-card
d3.select("#report-card")
    .attr("style",`
        height: ${divHeight}px;
        width: ${divWidth}px;
        margin: 30px;
        overflow:scroll;
        background: #eaeac8;
        border-radius:5em;
    `)
    .attr("onscroll", "getScrollPosition()");

// Function to get scrollTop in order to return to previous position after load
function getScrollPosition() {
    var scrollTarget= document.getElementById("report-card")
    console.log(scrollTarget.scrollTop);
    sessionStorage.setItem("scrollTop",scrollTarget.scrollTop);
}
// Function to return to scroll position on reload
function returnToScrollPosition() {
    var scrollTarget= document.getElementById("report-card")
    scrollTarget.scrollTo(0,sessionStorage.scrollTop);
}


/*
    Define functions for use below
*/

// Get data profile for requested grade
function getGradeData(edData,requestedGrade) {
    var gradeState= [];
    var gradeMeans= [];
    Object.values(edData).forEach(gradeAndState => {
        if (gradeAndState.grade == requestedGrade){
            gradeState.push(gradeAndState.state);
            gradeMeans.push(gradeAndState.mean_score);
        };
    });

    var gradeExtent= d3.extent(gradeMeans);
    console.log(gradeExtent);
    return {
        "state":gradeState,
        "stateCount":gradeState.length,
        "gradeMeans":gradeMeans,
        "meanOfGradeMeans":d3.mean(gradeMeans),
        "stdevOfGradeMeans":d3.deviation(gradeMeans),
        "extent":(gradeExtent)};
};

// Function to assign color to value based on Normalized (0-1) mean value
function colorizer(gradeData,score) {
    // normalize score on 0-1 scale
    var scoreNorm= (score - gradeData["extent"][0])/(gradeData["extent"][1] - gradeData["extent"][0]);
    // return rgb(${r},${g},${b})
    var r= 255 - (scoreNorm * 205)
    var g= 0 + (scoreNorm * 50)
    var b= 0 + (scoreNorm * 255)
    return `rgb(${r},${g},${b})`
};

// Assign block height/width based on div size
function blockDimension(gradeData) {
    var n= gradeData["stateCount"];
    var height= 
        svgHeight/n * .75;
    var width=
        height;
    return {"height":height, "width":width}
};

// This section is the main function which
// gathers d3 data 
// produces the report card from the given data

// Requested grade initially given (this should be removed)
function reportCard(requested_db,requestedGrade) {

    // If there is a Report Card already, remove it and make a new one
    d3.select("#report-card-title").remove();
    d3.select("#report-card-svg").remove();

    returnToScrollPosition();

    d3.json(`/${requested_db}`).then(edData => {
        console.log(edData);
        
        edData= edData.sort(function(x,y) {
            return d3.descending(x.state,y.state)
        })
        console.log(edData);
            
        var gradeData= getGradeData(edData,requestedGrade);
        console.log(gradeData);
        console.log(gradeData["extent"]);

// Assign value to a variable for use below
        var blockDim= blockDimension(gradeData);

/*
    Append items to the div#report-card element
*/

// Append title to <div>

        if (requested_db.slice(0,4) == "math") {
            subjectName= "MATH"
        } else {
            subjectName= "ENGLISH (LANGUAGE ARTS)"
        }

        var $svgTitle= d3.select("#report-card")
            .append("svg")
            .attr("id","report-card-title")
        
        var titleA= $svgTitle
            .append("text")
            .attr("x","0")
            .attr("y","100")
            .text(`${subjectName}`)
            .attr("font-weight","bold")
            .attr("font-size","1.5em")
            .style(`
                font-weight: bold;
                font-size: 5em;
                text-align: center;
            `)
        
        var titleB= $svgTitle
            .append("text")
            .attr("x","0")
            .attr("y","125")
            .text(`REPORT CARD FOR GRADE ${requestedGrade}`)
            .attr("font-weight","bold")
            .attr("font-size","1em")
            .style(`
                font-weight: bold;
                font-size: 5em;
                text-align: center;
            `)
// Append svg element to appropriate <div> and assign to variable for further appendation
        var $svgChart= d3
            .select("#report-card")
            .append("svg")
            .attr("id","report-card-svg")
            .attr("height", `${svgHeight}px`)
            .attr("width", `${svgWidth}px`);

// Append "g" to appropriate <svg> and assign to variable for further appendation
        var $chartGroup= $svgChart.append("g");

// Create Axes
        var $xLinearScale= d3.scaleLinear()
            .domain([
                gradeData["extent"][0] - 5,
                gradeData["extent"][1] + 15
            ])
            .range([0,svgWidth]);
        
        var $yBandScale= d3.scaleBand()
            .domain(['a'].concat(gradeData["state"]))
            .range([svgHeight-50,0])

        var $bottomAxis= d3
            .axisBottom($xLinearScale);
        
        var $leftAxis= d3
            .axisLeft($yBandScale)
            .tickValues(gradeData["state"]);

// Append axes
        $chartGroup.append("g")
            .attr("transform",`translate(${chartOffsetX}, ${svgHeight - 50})`)
            .call($bottomAxis);
        
        $chartGroup.append("g")
            .data(edData)
            .attr("transform", `translate(${chartOffsetX},0)`)
            .attr("fill", d => colorizer(gradeData,d["mean_score"]))
            .call($leftAxis);

// Add guideLines for each state
        var $guideLine= $chartGroup.append("g")
            .selectAll("line")
            .data(edData)
            .enter()
            .append("line")
            .filter(d=> {return d.grade == requestedGrade})
                .attr("x1", chartOffsetX)
                .attr("x2",svgWidth)
                .attr("y1",d => $yBandScale(d["state"])+blockDim["height"]/2)
                .attr("y2",d => $yBandScale(d["state"])+blockDim["height"]/2)
                .attr("stroke","gray")
                .attr("style","opacity:.5;")

// add blocks for each state (needs to happen after guidelines in order to overlay them)
        var $gradeBlocks= $chartGroup.append("g")
            .selectAll("rect")
            .data(edData)
            .enter()
            .append("rect")
            .filter(d=> {return d.grade == requestedGrade})
                .attr("x", d => $xLinearScale(d["mean_score"]) + 30)
                .attr("y", d => $yBandScale(d["state"]))
                .attr("height", blockDim["height"].toString())
                .attr("width", blockDim["width"].toString())
                .attr("fill", d => colorizer(gradeData,d["mean_score"]))
                // Tooltip instruction
                .on("mouseover", d => {
                    $tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    $tooltip.html(`<strong>${d["state"]}</strong><br>${d["mean_score"].toFixed(1)}`)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 25) + "px")
                        .style("text-align","center")
                        .style("background",colorizer(gradeData,d["mean_score"]))
                        .style("color", "white")
                        .style("width","5em")
                        .style("border-radius",".75em")
                })
                .on("mouseout", d => {
                    $tooltip.transition()
                        .duration(500)
                        .style("opacity", 0)
                });

// Define tooltip class
        var $tooltip= d3.select("body").append("div")
            .attr("class", "tooltip")
    });
};