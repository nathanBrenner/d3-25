(function day15() {
  // brushing: dragging a selection area with the mouse
  // useful for creating exploratory visualization
  const width = 500;
  const height = 500;
  const svg = d3.select("#day-15").attr("height", height).attr("width", width);

  const randomGenerator = d3.randomNormal(0, width / 8);
  const data = d3.range(0, 500).map((d) => ({
    x: randomGenerator(),
    y: randomGenerator(),
  }));

  const xScale = d3.scaleLinear(
    [-width / 2, width / 2],
    [-width / 2, width / 2]
  );
  const yScale = d3.scaleLinear(
    [-height / 2, height / 2],
    [-height / 2, height / 2]
  );

  const color = (d) =>
    d3.interpolateViridis(
      Math.hypot(d.x, d.y) / Math.hypot(width / 4, width / 4)
    );

  const container = svg
    .append("g")
    .attr("class", "container")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const points = container
    .selectAll("circle.point")
    .data(data)
    .join("circle")
    .attr("class", "point day-15-point")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", 8)
    .style("fill", color)
    .style("opacity", 0.8);

  const xAxis = d3.axisBottom(xScale);
  container.append("g").call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  container.append("g").call(yAxis);

  const brush = d3
    .brush()
    .extent([
      [-width / 2, -width / 2],
      [width / 2, width / 2],
    ])
    .on("start", brushStart)
    .on("brush", brushing);

  function brushStart() {
    const selection = d3.event.selection;
    const sameX = selection[0][0] === selection[1][0];
    const sameY = selection[0][1] === selection[1][1];

    if (sameX && sameY) {
      const points = d3.selectAll("day-15-point");
      points.style("fill", color);
    }
  }

  function brushing() {
    const selection = d3.event.selection;
    const points = svg.selectAll("circle.point"); // might need to change this

    if (selection === null) {
      points.style("fill", color);
    } else {
      const sx = [selection[0][0], selection[1][0]];
      const sy = [selection[0][1], selection[1][1]];

      points.style("fill", (d) => {
        const inRangeX = d.x >= sx[0] && d.x < sx[1];
        const inRangeY = d.y >= sy[0] && d.y < sy[1];

        if (inRangeX && inRangeY) {
          return color(d);
        } else {
          return "#ccc";
        }
      });
    }
  }
  svg.select("g.container").call(brush);
})();
