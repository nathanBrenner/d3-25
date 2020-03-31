(function day3() {
  // accessor functions: funcitons that are used to access some piece of data
  // 3 args: datum, index, array of all elements, like array.prototype functions
  const foo = d3.select(".day-3a");

  const data = [
    { name: "a", value: 1 },
    { name: "b", value: 2 },
    { name: "c", value: 3 },
    { name: "d", value: 5 },
    { name: "e", value: 8 }
  ];

  const circles = foo.selectAll("circle").data(data);

  circles
    .enter()
    .append("circle")
    .attr("r", d => d.value * 10)
    .attr("cx", d => d.value * 10)
    .attr("cy", 80)
    .attr("fill", "transparent")
    .attr("stroke", "steelblue");

  const text = foo.selectAll("text").data(data);

  text
    .enter()
    .append("text")
    .attr("x", d => d.value * 10 * 2)
    .attr("y", 80)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text(d => d.name);
})();
