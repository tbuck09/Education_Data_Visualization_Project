url= "127.0.0.1:5000"
requested_db= "ela_2013_agg"

console.log(`${url}/${requested_db}`)

var height= 500;
var width= 500;

d3.json(`/${requested_db}`).then(edData => {
    console.log(edData);

    var states= edData.state;
    console.log(states)
    
    var grade3MeanScores= [];
    
    edData.forEach(gradeAndState => {
        if (gradeAndState.grade == 3) {
            {
                grade3MeanScores.push(gradeAndState.mean_score)
            }
        };
    });

    console.log(grade3MeanScores);
    var grade3Min= d3.min(grade3MeanScores)
    var grade3Max= d3.max(grade3MeanScores)
    
    var $xLinearScale= d3.scaleLinear()
        .domain([grade3Min,grade3Max])
        // .domain(
        //     d3.extent(edData,
        //         d=> {if (d.grade == 3) {
        //             return d.mean_score
        //             };
        //         })
        // )
        .range([width,0]);
    
    var $yBandScale= d3.scaleBand()
        .domain(edData.map(d => d.state))
        .range([height,0])
        .padding(0.1);
    

    var $svg= d3
        .select("#report-card")
        .append("svg")
        .attr("id","report-card-svg")
        .attr("height", `${height}px`)
        .attr("width", `${width}px`)
        .attr("padding","200px");

    var $chartGroup= $svg.append("g")

    $chartGroup.append("g")

    function colorizer()

    var blockPadding= 5;

    var gradeBlocks= $chartGroup.selectAll("rect")
        .data(edData)
        .enter()
        .append("rect")
        .filter(d=> {return d.grade == 3})
            .attr("x", d => $xLinearScale(d["mean_score"]))
            .attr("y", d => $yBandScale(d["state"]))
            .attr("height", `${(height/51) - blockPadding}px`)
            .attr("width", `${width/51}px`)
            .attr("padding-top", `${blockPadding}px`);
});