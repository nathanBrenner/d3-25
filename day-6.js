// path: lines that are not straight
// arcs are subsets of the circumference of a circle
// pie is a bunch of arcs
// size of arc is defined by values in data
(function day6() {
  const USData = [
    { type: "Poultry", value: 48.9954 },
    { type: "Beef", value: 25.9887 },
    { type: "Pig", value: 22.9373 },
    { type: "Sheep", value: 0.4869 }
  ];

  const height = 500;
  const width = 900;

  const colors = ["#976393", "#685489", "#43457f", "#ff9b83"];

  const colorScale = d3.scaleOrdinal(
    USData.map(d => d.type),
    colors
  );

  const arc = d3
    .arc()
    .innerRadius((0.5 * height) / 2)
    .outerRadius((0.85 * height) / 2);

  const pie = d3.pie().value(d => d.value);

  const labelArcs = d3
    .arc()
    .innerRadius((0.95 * height) / 2)
    .outerRadius((0.95 * height) / 2);

  const pieArcs = pie(USData);

  const svg = d3.select("svg#day-6");

  svg.attr("height", height).attr("width", width);

  svg
    .append("g")
    .attr("class", "donut-container")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .selectAll("path")
    .data(pieArcs)
    .join("path")
    .style("stroke", "white")
    .style("stroke-width", 2)
    .style("fill", d => colorScale(d.data.type))
    .attr("d", arc);

  const text = svg
    .append("g")
    .attr("class", "labels-container")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .selectAll("text")
    .data(pieArcs)
    .join("text")
    .attr("transform", d => `translate(${labelArcs.centroid(d)})`) // centroid: center point of a shape
    .attr("text-anchor", "middle");

  text
    .selectAll("tspan") // element used as a child of a text element
    .data(d => [d.data.type, d.data.value.toFixed(1) + " kg"])
    .join("tspan")
    .attr("x", 0)
    .style("font-family", "sans-serif")
    .style("font-size", 12)
    .style("font-weight", (d, i) => (i ? undefined : "bold"))
    .style("fill", "#222")
    .attr("dy", (d, i) => (i ? "1.2em" : 0))
    .text(d => d);
})();
