// comparison of the profits vs. revenue of 36 businesses in the 2017 Fortune 500 companies list.

(async function day8() {
  const data = await d3.csv("scatter.csv").then(rows => rows.map(d3.autoType));
  const width = 900,
    height = 500,
    margin = { top: 10, right: 100, bottom: 30, left: 50 };

  const xScale = d3.scaleLinear(
    d3.extent(data, d => d.revenues_mm),
    [margin.left, width - margin.right]
  );

  const yScale = d3.scaleLinear(
    d3.extent(data, d => d.profit_mm),
    [height - margin.bottom, margin.top]
  );

  const colors = d3.scaleOrdinal().range(d3.schemeCategory10);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3.select("svg#day-8");

  svg.attr("height", height).attr("width", width);

  const g = svg
    .append("g")
    .style("font-family", "sans-serif")
    .style("font-size", 10);

  g.selectAll("g")
    .data(data)
    .join("g")
    .attr("class", "scatter-point")
    .attr(
      "transform",
      d => `translate(${xScale(d.revenues_mm)}, ${yScale(d.profit_mm)})`
    )
    .call(g =>
      g
        .append("circle")
        .attr("r", 5)
        .style("stroke", d => colors(d.category))
        .style("stroke-width", 2)
        .style("fill", "transparent")
    )
    .call(g =>
      g
        .append("text")
        .attr("x", 8)
        .attr("dy", "0.35em")
        .text(d => (d.revenues_mm < 10000 ? "" : d.company))
    );

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis)
    .select(".domain")
    .remove();

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .select(".domain")
    .remove();

  g.append("g")
    .attr("transform", `translate(${margin.left + 6}, ${margin.top + 4})`)
    .append("text")
    .attr("transform", "rotate(90)")
    .text("Profits ($MM)");

  g.append("text")
    .attr("x", width - margin.right - 6)
    .attr("y", height - margin.bottom - 5)
    .attr("text-anchor", "end")
    .text("Revenue ($MM)");
})();
