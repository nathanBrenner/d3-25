(function day12() {
  const svg = d3.select("#day-12").attr("width", 300).attr("height", 300);
  const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
  ]);
  svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d, i) => `translate(0,${30 * i})`)
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("x", (d, i) => 30 * i)
    .attr("height", 30)
    .attr("width", 30)
    .style("fill", "#4dbeff")
    .on("mouseover", (d, i, arr) => {
      d3.select(arr[i]).transition().duration(100).style("fill", "white");
    })
    .on("mouseout", (d, i, arr) => {
      d3.select(arr[i]).transition().duration(2000).style("fill", "#4dbeff");
    });
})();

(function day12a() {
  const svg = d3.select("#day-12-a").attr("height", 300).attr("width", 300);
  const data = d3.range(0, 100);
  svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d, i) => 15 + 30 * (i % 10))
    .attr("cy", (d, i) => 15 + Math.floor(i / 10) * 30)
    .attr("r", 10)
    .style("fill", "#ff5900")
    .on("click", (d, i, arr) => {
      const clickX = i % 10;
      const clickY = Math.floor(i / 10);
      arr.forEach((el, j) => {
        const currX = j % 10;
        const currY = Math.floor(j / 10);

        if (i == j) {
          return;
        } else if (currX == clickX || currY == clickY) {
          d3.select(el)
            .transition()
            .duration(100)
            .style("fill", "#4dbeff")
            .transition()
            .duration(1000)
            .style("fill", "#ff5900");
        }
      });
    });
})();
