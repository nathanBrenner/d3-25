(function day19() {
  // interpolator: linear scale with domain of [0, 1] and a range you set
  const svg = d3.select("#day-19").attr("height", 500).attr("width", 900);

  const data = d3.range(10).map(() => ({
    x: Math.random() * 900,
    y: Math.random() * 500,
  }));

  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveBasis);

  const path = svg
    .append("path")
    .datum(data)
    .attr("d", line)
    .style("stroke", "black")
    .style("stroke-width", 2)
    .style("fill", "transparent");

  const interval = setInterval(rollercoaster, 12000);
  let counts = 0;

  function rollercoaster() {
    const t = d3.transition().delay(500).duration(10000);
    const length = path.node().getTotalLength();
    const int = d3.interpolate(0, length);
    const x = (t) => path.node().getPointAtLength(int(t)).x;
    const y = (t) => path.node().getPointAtLength(int(t)).y;

    svg
      .selectAll("circle")
      .data([data[0]])
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .style("fill", d3.interpolateRainbow(0))
      .style("stroke", "black")
      .attr("r", 20)
      .transition(t)
      .attrTween("cx", () => x)
      .attrTween("cy", () => y)
      .styleTween("fill", () => d3.interpolateRainbow);

    counts++;
    if (counts === 1) {
      clearInterval(interval);
    }
  }
})();
