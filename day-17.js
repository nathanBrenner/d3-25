(async function day17() {
  // cyclical patterns
  // temperature range for each day of 2018 in Stockholm, Sweden
  const data = await d3.csv("sweden_temp.csv").then((rows) =>
    rows.map(d3.autoType).map((d) => {
      const max = ((d.TMAX - 32) * 5) / 9;
      const min = ((d.TMIN - 32) * 5) / 9;
      return {
        date: d.DATE.toLocaleString(),
        max,
        min,
        avg: d3.mean([max, min]),
      };
    })
  );
  const width = 900;
  const height = 900;
  const innerRadius = (0.35 * width) / 2;
  const outerRadius = (0.9 * width) / 2;

  const extent = d3.extent(data, (d) => d.avg);
  const interpolated = d3.interpolate(...extent);
  const colorDomain = d3.quantize(interpolated, 7);

  const color = d3.scaleLinear(
    colorDomain,
    d3.quantize(d3.interpolateSpectral, 7).reverse()
  );

  const xScale = d3.scaleBand(
    data.map((d) => d.date),
    [0, 2 * Math.PI]
  );

  const xAxis = (g) =>
    g.attr("text-anchor", "middle").call((g) =>
      g
        .selectAll("g")
        .data([
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
          "January",
          "February",
          "March",
        ])
        .join("g")
        .attr(
          "transform",
          (d, i, arr) => `
        rotate(${(i * 360) / arr.length})
        translate(${innerRadius}, 0)
      `
        )
        .call((g) =>
          g
            .append("line")
            .attr("x1", -5)
            .attr("x2", outerRadius - innerRadius + 10)
            .style("stroke", "#aaa")
        )
        .call((g) =>
          g
            .append("text")
            .attr("transform", (d, i, arr) =>
              ((i * 360) / arr.length) % 360 > 180
                ? "rotate(90)translate(0,16)"
                : "rotate(-90)translate(0, -9)"
            )
            .style("font-family", "sans-serif")
            .style("font-size", 10)
            .text((d) => d)
        )
    );

  const yDomain = [d3.min(data, (d) => d.min), d3.max(data, (d) => d.max)];
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(yDomain))
    .range([innerRadius, outerRadius]);

  const yAxis = (g) =>
    g
      .attr("text-anchor", "middle")
      .call((g) =>
        g
          .append("text")
          .attr("text-anchor", "end")
          .attr("x", "-0.5em")
          .attr("y", (d) => -yScale(yScale.ticks(5).pop()) - 10)
          .attr("dy", "-1em")
          .style("fill", "#1a1a1a")
          .text("Temperature C")
      )
      .call((g) =>
        g
          .selectAll("g")
          .data(yScale.ticks(5))
          .join("g")
          .attr("fill", "none")
          .call((g) =>
            g
              .append("circle")
              .style("stroke", "#aaa")
              .style("stroke-opacity", 0.5)
              .attr("r", yScale)
          )
          .call((g) =>
            g
              .append("text")
              .attr("y", (d) => -yScale(d))
              .attr("dy", "0.35em")
              .style("stroke", "#fff")
              .style("stroke-width", 5)
              .style("fill", "#1a1a1a")
              .text(yScale.tickFormat(6, "s"))
              .clone(true)
              .style("stroke", "none")
          )
      );

  const arc = d3
    .arc()
    .innerRadius((d) => yScale(d.min))
    .outerRadius((d) => yScale(d.max))
    .startAngle((d) => xScale(d.date))
    .endAngle((d) => xScale(d.date) + xScale.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius);

  const svg = d3.select("#day-17").attr("width", width).attr("height", height);

  const container = svg
    .append("g")
    .attr("class", "container")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .style("font-size", 10)
    .style("font-family", "sans-serif");

  container
    .selectAll("path")
    .data(data)
    .join("path")
    .style("fill", (d) => color(d.avg))
    .style("stroke", (d) => color(d.avg))
    .attr("d", arc);

  container.append("g").call(xAxis);
  container.append("g").call(yAxis);
})();
