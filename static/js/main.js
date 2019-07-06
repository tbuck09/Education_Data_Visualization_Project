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

// Requested grade initially given
var requestedGrade= 6

d3.json(`/${requested_db}`).then(edData => {
    console.log(edData);

    var states= edData.state;
    console.log(states)
    
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
            "extent":(gradeExtent)};
    };

    gradeData= getGradeData(requestedGrade)
    console.log(gradeData["extent"])
    
    var $svg= d3
        .select("#report-card")
        .append("svg")
        .attr("id","report-card-svg")
        .attr("height", `${divHeight}px`)
        .attr("width", `${divWidth}px`);
    
    var $chartGroup= $svg.append("g")
    
    var $xLinearScale= d3.scaleLinear()
        .domain([
            gradeData["extent"][0] - 5,
            gradeData["extent"][1] + 5
        ])
        .range([0,divWidth]);
    
    var $yBandScale= d3.scaleBand()
        .domain(['a','b','c'].concat(gradeData["state"]))
        .range([divHeight-50,0])
        // .padding(5);
    
    // for (var i = 0; i <= gradeData["state"].length; i++) {
    //     test= {
    //         "state":gradeData["state"][i],
    //         "scale": $yBandScale(gradeData["state"][i])
    //     };
    //     console.log(test);
    // }

    var $bottomAxis= d3
        .axisBottom($xLinearScale);
    
    var $leftAxis= d3
        .axisLeft($yBandScale)
        .tickValues(gradeData["state"]);

    $chartGroup.append("g")
        .attr("transform",`translate(0, ${divHeight - 50})`)
        .call($bottomAxis);
    
    $chartGroup.append("g")
        .attr("transform", `translate(20,0)`)
        .call($leftAxis);
    
    // function colorizer(score):
    //     // Normalize score on 0 - 1 scale
    
    //     var r= 
    //     var g= 
    //     var b= 
    
    
    // $chartGroup.append("g")
    
    var blockPadding= 100;

    var readLine= $chartGroup.append("g")
        .selectAll("line")
        .data(edData)
        .enter()
        .append("line")
        .filter(d=> {return d.grade == requestedGrade})
            .attr("x1", 20)
            .attr("x2",divWidth - 10)
            .attr("y1",d => $yBandScale(d["state"])+5)
            .attr("y2",d => $yBandScale(d["state"])+5)
            .attr("stroke","gray")
            .attr("style","opacity:.5;")

    var gradeBlocks= $chartGroup.append("g")
        .selectAll("rect")
        .data(edData)
        .enter()
        .append("rect")
        .filter(d=> {return d.grade == requestedGrade})
            .attr("x", d => $xLinearScale(d["mean_score"]))
            .attr("y", d => $yBandScale(d["state"]))
            .attr("height", "10px")
            .attr("width", "10px")
            .attr("style", `padding: ${blockPadding}px`);

});