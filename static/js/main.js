url= "127.0.0.1:5000"
requested_db= "math_demog"

console.log(`${url}/${requested_db}`)

d3.json(`/${requested_db}`).then(function(edData) {
    console.log(edData);
});