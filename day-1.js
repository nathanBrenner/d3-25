(function day1() {
  const svg = d3.select(".day-1a");
  const rect = svg.append("rect");

  rect
    .style("fill", "black")
    .attr("height", 20)
    .attr("width", 20)
    .attr("x", 10)
    .attr("y", 10);

  const svg2 = d3.select(".day-1b");

  const rects = svg2.selectAll("rect");

  const data = [0, 1, 2, 3, 4];
  rects
    .data(data) // data join
    .join("rect")
    .style("fill", "black")
    .attr("height", 20)
    .attr("width", 20)
    .attr("y", 10)
    .attr("x", (d, i) => 10 + i * 30);
})();
