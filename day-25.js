(async function day25() {
  let offset = 0;
  let noiseFactor = 0.05;
  const n = new Noise(Math.random());
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const width = 960;
  const height = 500;
  const gapSize = 20;
  const color = d3.interpolateRainbow;

  function createData() {
    const noiseFactor = 0.4;
    const xCount = Math.floor(width / gapSize);
    const yCount = Math.floor(height / gapSize);
    const numPoints = xCount * yCount;

    const d = d3.range(numPoints).map((i) => {
      const xVal = i % xCount;
      const x = xVal * gapSize;
      const yVal = Math.floor(i / xCount);
      const y = yVal * gapSize;
      const value = n.perlin2(
        x / (width * noiseFactor),
        y / (height * noiseFactor)
      );
      return { x, xVal, y, yVal };
    });

    return d;
  }
  const data = createData();

  const svg = d3
    .select("#day-25")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#1a1a1a");

  svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr(
      "transform",
      (d) => `translate(${margin.left + d.x}, ${margin.top + d.y})`
    )
    .call((g) =>
      g
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .style("stroke", "black")
        .style("stroke-width", 3)
        .style("stroke-linecap", "round")
    );

  const interval = setInterval(drawChart, 1000 / 30);
  let counts = 0;

  function drawChart() {
    svg
      .selectAll("line")
      .attr(
        "x2",
        (d) =>
          gapSize *
          Math.sin(
            2 *
              Math.PI *
              n.perlin2(
                d.xVal * noiseFactor + offset,
                d.yVal * noiseFactor + offset
              )
          )
      )
      .attr(
        "y2",
        (d) =>
          gapSize *
          Math.cos(
            2 *
              Math.PI *
              n.perlin2(
                d.xVal * noiseFactor + offset,
                d.yVal * noiseFactor + offset
              )
          )
      )
      .style("stroke", (d) =>
        color(
          n.perlin2(
            d.xVal * noiseFactor + offset,
            d.yVal * noiseFactor + offset
          )
        )
      );

    offset += 0.01;
    counts++;

    if (counts === 1) {
      clearInterval(interval);
    }
  }
})();
