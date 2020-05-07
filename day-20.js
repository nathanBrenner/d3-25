(async function day20() {
  const svgA = d3.select("#day-20-a").attr("width", 300).attr("height", 300);

  // transition a group of elements
  const t = svgA.transition().duration(3000).delay(250);

  svgA
    .append("circle")
    .attr("cx", 50)
    .attr("cy", 20)
    .attr("r", 15)
    .transition(t)
    .attr("cy", 280)
    .style("fill", "grey");

  svgA
    .append("rect")
    .attr("x", 140)
    .attr("y", 5)
    .attr("width", 30)
    .attr("height", 30)
    .transition(t)
    .attr("y", 265)
    .style("fill", "steelblue");

  svgA
    .append("circle")
    .attr("cx", 250)
    .attr("cy", 20)
    .attr("r", 15)
    .transition(t)
    .attr("cy", 280)
    .style("fill", "pink");

  // chain transitions
  d3.select("#day-20-b")
    .attr("width", 300)
    .attr("height", 300)
    .append("circle")
    .attr("cx", 50)
    .attr("cy", 20)
    .attr("r", 15)
    .transition()
    .delay(500)
    .attr("cy", 280)
    .style("fill", "gray")
    .transition()
    .attr("cy", 150)
    .attr("cx", 150)
    .style("fill", "blue")
    .transition()
    .attr("cy", 280)
    .attr("cx", 250)
    .style("fill", "pink")
    .transition()
    .delay(1000)
    .attr("cy", 50)
    .attr("cx", 20)
    .style("fill", "black");

  // easing functions
  const svgC = d3.select("#day-20-c").attr("height", 300).attr("width", 300);

  const intX = d3.interpolateBasis([50, 50, 150, 250, 50]);
  const intY = d3.interpolateBasis([20, 280, 150, 280, 20]);

  svgC
    .append("circle")
    .attr("cx", intX(0))
    .attr("cy", intY(0))
    .attr("r", 15)
    .transition()
    .delay(500)
    .duration(4000)
    .attrTween("cx", () => intX)
    .attrTween("cy", () => intY)
    .styleTween("fill", () => d3.interpolateInferno);

  // transition text values
  d3.select("#day-20-d")
    .attr("height", 300)
    .attr("width", 300)
    .append("text")
    .attr("x", 150)
    .attr("y", 150)
    .attr("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "64")
    .style("font-weight", "bold")
    .text("999")
    .transition()
    .delay(500)
    .duration(10000)
    .textTween(() => d3.interpolateRound("999", "0"));

  const svgE = d3.select("#day-20-e").attr("width", 300).attr("height", 300);

  await svgE
    .append("text")
    .attr("x", 150)
    .attr("y", 150)
    .attr("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "64")
    .style("font-weight", "bold")
    .text("99")
    .transition()
    .delay(500)
    .duration(1000)
    .textTween(() => d3.interpolateRound("99", "0"))
    .end();

  svgE.style("background-color", "black");
})();
