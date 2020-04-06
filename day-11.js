(function day11() {
  const circle = d3
    .select("#day-11")
    .append("circle")
    .attr("r", 15)
    .attr("cx", 20)
    .attr("cy", 20);

  circle
    .transition()
    .delay(1200)
    // try uncommenting the transitions below to see how they effect the animation
    .ease(d3.easeCubicInOut)
    // .ease(d3.easeLinear)
    // .ease(d3.easePoly.exponent(5))
    .duration(1200)
    .attr("cx", 280)
    .attr("cy", 80)
    .transition()
    .delay(1200)
    .attr("cx", 20)
    .attr("cy", 20)
    .end();
})();
