(function vul() {
  const parsed = [
    {
      type: "cvssv2",
      total: 10,
      low: 4,
      medium: 3,
      high: 3,
      critical: 0
    },
    {
      type: "cvssv3",
      total: 10,
      low: 4,
      medium: 3,
      high: 2,
      critical: 1
    },
    {
      type: "npm",
      total: 10,
      low: 1,
      medium: 4,
      high: 2,
      critical: 3
    }
  ];
  const categories = ["low", "medium", "high", "critical"];
  const data = Object.assign(parsed, { categories });

  // const width = 900;
  // const height = 1000;
  const margin = { top: 10, right: 0, bottom: 30, left: 30 };
  const width = 300 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const CRITICAL_SCORE = "#E54304";
  const HIGH_SCORE = "#FF9E22";
  const MEDIUM_SCORE = "#F8EB00";
  const LOW_SCORE = "#78909C";
  const NO_SCORE = "#8d8d8d";

  const colors = d3.scaleOrdinal(data.categories, [
    LOW_SCORE,
    MEDIUM_SCORE,
    HIGH_SCORE,
    CRITICAL_SCORE
  ]);

  const xScale = d3
    .scaleBand(
      data.map(d => d.type),
      [margin.left, width - margin.right]
    )
    .padding(0.2);

  const yScale = d3.scaleLinear(
    [0, d3.max(data, d => d.total)],
    [height - margin.bottom, margin.top]
  );

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const stack = d3.stack().keys(data.categories);

  const svg = d3
    .select("#vul")
    .attr("height", height)
    .attr("width", width);

  const chartData = stack(data);

  const groups = svg
    .append("g")
    .selectAll("g")
    .data(chartData)
    .join("g")
    .style("fill", d => colors(d.key));

  groups
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => xScale(d.data.type))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth());

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis)
    .select(".domain")
    .remove();

  const legend = d3
    .select("#vulLegend")
    .attr("width", 80)
    .attr("height", 120);

  legend
    .selectAll("g")
    .data([...data.categories.slice(0).reverse(), "no score"])
    .join("g")
    .attr("transform", (d, i) => `translate(5, ${i * 30})`)
    .call(g =>
      g
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", d => (d === "no score" ? NO_SCORE : colors(d)))
    )
    .call(g =>
      g
        .append("text")
        .attr("y", 10)
        .attr("x", 25)
        .attr("dy", "0.35em")
        .style("font-size", 12)
        .style("font-family", "sans-serif")
        .text(d => (d === "low" ? "low or no score" : d))
    );
})();
