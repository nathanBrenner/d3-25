(function day14() {
  // drag and drop
  const height = 480;
  const width = 900;
  const rectWidth = 30;
  const svg = d3.select("#day-14").attr("height", height).attr("width", width);

  const rects = d3.range(
    Math.ceil(height / rectWidth) * Math.ceil(width / rectWidth)
  );

  svg
    .selectAll("rect")
    .data(rects)
    .join("rect")
    .attr("class", (d) => `rect-${d} day-14-rect`)
    .attr("width", rectWidth)
    .attr("height", rectWidth)
    .attr("x", (d, i) => rectWidth * (i % (width / rectWidth)))
    .attr("y", (d, i) => Math.floor(i / (width / rectWidth)) * rectWidth)
    .style("stroke", "white")
    .style("cursor", "pointer")
    .style("fill", (d, i) => {
      const x = rectWidth * (i % (width / rectWidth));
      const y = Math.floor(i / (width / rectWidth)) * rectWidth;
      const dist = Math.hypot(x, y);
      return d3.interpolateSpectral(dist / Math.hypot(width, height));
    });

  const randomRectNumber = Math.floor(
    Math.random() * Math.ceil(height / rectWidth) * Math.ceil(width / rectWidth)
  );

  d3.select(`.rect-${randomRectNumber}`)
    .raise()
    .attr("x", Math.random() * (width - 30))
    .attr("y", Math.random() * (height - 30))
    .style("stroke", "black");

  function dragStart(d) {
    d3.select(this).raise().style("stroke", "black");
  }

  function dragging(d) {
    d3.select(this)
      .attr("x", d3.event.x - rectWidth / 2)
      .attr("y", d3.event.y - rectWidth / 2);
  }

  function dragEnd(d) {
    d3.select(this).style("stroke", "white");
  }
  d3.selectAll(".day-14-rect").call(
    d3.drag().on("start", dragStart).on("drag", dragging).on("end", dragEnd)
  );
})();
