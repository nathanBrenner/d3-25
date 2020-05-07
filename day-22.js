(function day22() {
  const width = 900;
  const height = 500;
  const color = d3.scaleLinear().domain([-1, 1]).range(["#309", "#ff630f"]);

  const n = new Noise(Math.random());

  const noiseFactor = 0.4;

  const data = d3.range(200).map(() => {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const value = n.perlin2(
      x / (width * noiseFactor),
      y / (height * noiseFactor)
    );
    return { x, y, value };
  });

  const svg = d3
    .select("#day-22")
    .attr("height", height)
    .attr("width", width)
    .style("background-color", "#1a1a1a");

  function chart() {
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => Math.max(Math.abs(20 * d.value), 3))
      .style("fill", (d) => color(d.value))
      .style("fill-opacity", 0.85)
      .on("mouseenter", function (d) {
        d3.select(this)
          .transition()
          .style("stroke", color(d.value))
          .attr("stroke-width", 20)
          .attr("stroke-opacity", 0.7);
      })
      .on("mouseleave", function (d) {
        d3.select(this).transition().attr("stroke-width", 0);
      });
  }

  // chart();

  function voronoi() {
    const delaunay = d3.Delaunay.from(
      data,
      (d) => d.x,
      (d) => d.y
    );
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    svg
      .selectAll("path")
      .data(data.map((d, i) => voronoi.renderCell(i)))
      .join("path")
      .attr("d", (d) => d)
      .style("fill", (d, i) => color(data[i].value))
      .style("opacity", 0.8)
      .style("stroke", "white")
      .style("stroke-opacity", 0.2);

    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 1.5)
      .style("fill", "white");
  }

  // voronoi();

  function hoverChart() {
    const delaunay = d3.Delaunay.from(
      data,
      (d) => d.x,
      (d) => d.y
    );

    // Place our points as normal
    const points = svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => Math.max(Math.abs(20 * d.value), 3))
      .style("stroke-width", 0)
      .style("stroke-opacity", 0.7)
      .style("stroke", (d, i) => color(d.value))
      .style("fill", (d) => color(d.value))
      .style("fill-opacity", 0.85);

    // put a mousemove event on the svg (not the circles)
    svg
      .on("mousemove", function () {
        // get our mouse positions in the svg element
        const [mouseX, mouseY] = d3.mouse(this);

        // find the index of the nearest point to the mouse position
        const pointIndex = delaunay.find(mouseX, mouseY);

        // Iterate through all points and set stroke-width based on whether
        // or not it's our selected point
        points
          .transition()
          .style("stroke-width", (d, i) => (i == pointIndex ? 20 : 0));
      })
      // When the mouse leaves the svg, set all stroke-widths to zero
      .on("mouseleave", function () {
        points.transition().style("stroke-width", 0);
      });
  }

  hoverChart();
})();
