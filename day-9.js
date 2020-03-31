/**
 * The data it contains the per capita meat consumption, in kilograms,
 * of 36 countries broken down by type of animal.
 *
 * Meat consumption is an indicator of economic prosperity.
 * It's also interesting to look at how the
 * proportions differ between countries/cultures, even if you're a vegetarian.
 */

(async function day9() {
  const parsed = await d3
    .csv("stacked-chart.csv")
    .then(res =>
      res
        .filter(
          d =>
            d.location !== "BRICS" &&
            d.location !== "EU27" &&
            d.location !== "OECD"
        )
        .map(d3.autoType)
    );

  const categories = Object.keys(parsed[0]).filter(
    k => k !== "total" && k !== "location"
  );
  const data = Object.assign(parsed, { categories });

  /*
  example of data:
  {
    location: "CAN",
    total: 68.1470478204473,
    BEEF: 17.6454236226423,
    PIG: 15.7406044106492,
    POULTRY: 33.8710827065993,
    SHEEP: 0.889937080556491
  }
  */
  const width = 900;
  const height = 500;
  const margin = { top: 10, right: 0, bottom: 30, left: 30 };
  const colors = d3.scaleOrdinal(data.categories, d3.schemeGnBu[9].slice(3));
  const xScale = d3
    .scaleBand(
      data.map(d => d.location),
      [margin.left, width - margin.right]
    )
    .padding(0.2);
  // const yScale = d3.scaleLinear(
  //   [0, d3.max(data, d => d.total)][(height - margin.bottom, margin.top)]
  // );
  const yScale = d3.scaleLinear(
    [0, d3.max(data, d => d.total)],
    [height - margin.bottom, margin.top]
  );
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale);

  const stack = d3.stack().keys(data.categories);

  const svg = d3
    .select("#day-9")
    .attr("height", height)
    .attr("width", width);
  const chartData = stack(data);

  const groups = svg
    .append("g")
    .selectAll("g")
    .data(chartData)
    .join("g")
    .style("fill", (d, i) => colors(d.key));

  groups
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => xScale(d.data.location))
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
    .select("svg.legend")
    .attr("width", 900)
    .attr("height", 25);

  legend
    .selectAll("g")
    .data(data.categories.slice(0).reverse())
    .join("g")
    .attr("transform", (d, i) => `translate(${i * 80},5)`)
    .call(g =>
      g
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", d => colors(d))
    )
    .call(g =>
      g
        .append("text")
        .attr("y", 10)
        .attr("x", 25)
        .attr("dy", "0.35em")
        .style("font-size", 12)
        .style("font-family", "sans-serif")
        .text(d => d[0] + d.slice(1).toLowerCase())
    );

  /*
    1. get data, maybe organize it
    2. define svg width,height, margin
    3. define scales: colors, x and y
    4. create axis
    5. select svg and add height, width, margin to it
    6. add axis as a g to svg
    7. add data to svg
  */
})();
