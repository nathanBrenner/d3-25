(function day21() {
  // object constancy: how we keep track of svg graphics based on the data behind them in d3
  const data = {
    name: "root",
    children: d3.range(50).map((d, i) => ({
      name: `thing-${i}`,
      group: Math.floor(Math.random() * 6),
      value: Math.floor(Math.random() * 100),
    })),
  };

  const svg = d3.select("#day-21").attr("width", 500).attr("height", 500);

  const hierarchy = d3.hierarchy(data).sum((d) => d.value);

  const pack = d3.pack().size([500, 500]).padding(3);

  const nodeData = pack(hierarchy).leaves();

  const color = d3.scaleOrdinal().range(d3.schemeSet2);

  showAll();

  function showAll() {
    const t = d3.transition().duration(1000);

    svg
      .selectAll("g")
      .data(nodeData, (d) => d.data.name)
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("class", (d) => `depth-${d.depth}`)
            .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
            .style("opacity", 0)
            .call((g) =>
              g
                .append("circle")
                .attr("r", (d) => d.r)
                .style("fill", (d) => color(d.data.group))
            )
            .call((g) =>
              g
                .append("text")
                .style("font-family", "sans-serif")
                .style("font-size", 10)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text((d) => d.data.name)
            )
            .call((g) => g.transition(t).style("opacity", 1)),
        (update) =>
          update
            .call((g) =>
              g
                .transition(t)
                .attr("transition", (d) => `translate(${d.x}, ${d.y})`)
            )
            .call((g) =>
              g
                .select("circle")
                .transition(t)
                .attr("r", (d) => d.r)
            )
            .call((g) => g.select("text").transition(t).attr("x", 0)),
        (exit) => exit.remove()
      )
      .on("click", showSelected);
  }

  function showSelected(d, i, arr) {
    const filteredData = nodeData.filter(
      (node) => node.data.group === d.data.group
    );

    const t = svg.transition().duration(1000);

    d3.selectAll(arr)
      .data(filteredData, (d) => d.data.name)
      .join(
        (enter) => enter,
        (update) =>
          update
            .call((g) =>
              g
                .transition(t)
                .attr("transform", (d, i) => `translate(${20},${20 + i * 50})`)
            )
            .call((g) => g.select("circle").transition(t).attr("r", 15))
            .call((g) => g.select("text").transition(t).attr("x", 50))
            .on("click", showAll),
        (exit) => exit.transition().style("opacity", 0).remove()
      );
  }
})();
