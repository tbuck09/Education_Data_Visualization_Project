// Height and Width to be determined upon integration with the rest of the code
var divHeight= "800"
var divWidth= "800"

// Add styles to #report-card
d3.select("#report-card")
    .attr("style",`
        height: ${divHeight}px;
        width: ${divWidth}px;
        margin: 30px;
        overflow:scroll;
    `)

url= "127.0.0.1:5000"
requested_db= "ela_2013_agg"

console.log(`${url}/${requested_db}`)

// This section gathers d3 data and 
// produces the report card from the given data

// Requested grade initially given (this should be removed)
var requestedGrade= 8

d3.json(`/${requested_db}`).then(edData => {
    console.log(edData);
    
    edData= edData.sort(function(x,y) {
        return d3.descending(x.state,y.state)
    })
    console.log(edData);

    var states= edData.state;
    console.log(states)

// Get data profile for requested grade
    function getGradeData(requestedGrade) {
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
        
        var gradeData= getGradeData(requestedGrade);
        console.log(gradeData);
        console.log(gradeData["extent"]);
        
// Function to assign color to value based on Normalized (0-1) mean value
    function colorizer(score) {
        // normalize score on 0-1 scale
        var scoreNorm= (score - gradeData["meanOfGradeMeans"])/gradeData["stdevOfGradeMeans"];
        // return rgb(${r},${g},${b})
        var r= 255 - (scoreNorm * 205)
        var g= 0 + (scoreNorm * 50)
        var b= 0 + (scoreNorm * 255)
        return `rgb(${r},${g},${b})`
    };

// Assign block height/width based on div size
    function blockDimension() {
        var n= gradeData["stateCount"];
        var height= 
            divHeight/n * .75;
        var width=
            divWidth/n * .75;
        return {"height":height, "width":width}
    }
// Assign value to a variable for use below
    var blockDim= blockDimension();
        
// Append svg element to appropriate <div> and assign to variable for further appendation
    var $svg= d3
        .select("#report-card")
        .append("svg")
        .attr("id","report-card-svg")
        .attr("height", `${divHeight}px`)
        .attr("width", `${divWidth}px`);

// Append "g" to appropriate <svg> and assign to variable for further appendation
    var $chartGroup= $svg.append("g");

// Create Axes
    var $xLinearScale= d3.scaleLinear()
        .domain([
            gradeData["extent"][0] - 5,
            gradeData["extent"][1] + 5
        ])
        .range([0,divWidth]);
    
    var $yBandScale= d3.scaleBand()
        .domain(['a'].concat(gradeData["state"]))
        .range([divHeight-50,0])

    var $bottomAxis= d3
        .axisBottom($xLinearScale);
    
    var $leftAxis= d3
        .axisLeft($yBandScale)
        .tickValues(gradeData["state"]);

// Append axes
    
    var chartOffset= "40"
    $chartGroup.append("g")
        .attr("transform",`translate(${chartOffset}, ${divHeight - 50})`)
        .call($bottomAxis);
    
    $chartGroup.append("g")
        .data(edData)
        .attr("transform", `translate(${chartOffset},0)`)
        .attr("fill", d => colorizer(d["mean_score"]))
        .call($leftAxis);
    
    var $guideLine= $chartGroup.append("g")
        .selectAll("line")
        .data(edData)
        .enter()
        .append("line")
        .filter(d=> {return d.grade == requestedGrade})
            .attr("x1", chartOffset)
            .attr("x2",divWidth)
            .attr("y1",d => $yBandScale(d["state"])+blockDim["height"]/2)
            .attr("y2",d => $yBandScale(d["state"])+blockDim["height"]/2)
            .attr("stroke","gray")
            .attr("style","opacity:.5;")

    var $gradeBlocks= $chartGroup.append("g")
        .selectAll("rect")
        .data(edData)
        .enter()
        .append("rect")
        .filter(d=> {return d.grade == requestedGrade})
            .attr("x", d => $xLinearScale(d["mean_score"]))
            .attr("y", d => $yBandScale(d["state"]))
            .attr("height", blockDim["height"].toString())
            .attr("width", blockDim["width"].toString())
            .attr("fill", d => colorizer(d["mean_score"]))
            .on("mouseover", d => {
                $tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                $tooltip.html(`<strong>${d["state"]}</strong><br>${d["mean_score"].toFixed(1)}`)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 25) + "px")
                    .style("text-align","center")
                    .style("background",colorizer(d["mean_score"]))
                    .style("color", "white")
                    .style("width","5em")
                    .style("border-radius","10px")
            })
            .on("mouseout", d => {
                $tooltip.transition()
                    .duration(500)
                    .style("opacity", 0)
            });

    var $tooltip= d3.select("body").append("div")
        .attr("class", "tooltip")

});