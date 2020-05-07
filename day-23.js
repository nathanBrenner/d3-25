(async function day23() {
  const data = await d3.csv("electionsData.csv").then((rows) =>
    rows.map(d3.autoType).map((d) => ({
      state: d.State,
      electoralVotes: d.electoralvotes,
      rep: d.votes16_trumpd,
      dem: d.votes16_clintonh,
      total: d.votes,
    }))
  );

  const margin = {
    top: 10,
    right: 50,
    bottom: 10,
    left: 50,
  };

  const maxRadius = 40;
  const width = 900;
  const height = 500;

  const color = d3.scaleLinear([0, 1], ["#e91d0e", "#3E36F8"]);
  const rScale = d3
    .scaleSqrt()
    .domain([0, d3.max(data, (d) => d.electoralVotes)])
    .range([0, maxRadius]);

  const xScale = d3.scaleLinear().range([margin.left, width - margin.right]);
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues([0, 0.5, 1])
    .tickFormat(
      d3.scaleOrdinal(
        [0, 0.5, 1],
        ["100% Republican", "Split", "100% Democrat"]
      )
    );
  data.forEach((d) => (d.r = rScale(d.electoralVotes)));
  const simulation = d3
    .forceSimulation(data)
    .force(
      "x",
      d3
        .forceX()
        .strength(0.2)
        .x((d) => xScale(d.dem / d.total))
    )
    .force(
      "y",
      d3
        .forceY()
        .strength(0.05)
        .y(margin.top + height / 2)
    )
    .force(
      "collide",
      d3
        .forceCollide()
        .radius((d) => d.r + 1)
        .strength(1)
    );

  const svg = d3.select("#day-23").attr("height", height).attr("width", width);

  const g = svg
    .selectAll("g.node")
    .data(simulation.nodes())
    .join("g")
    .attr("class", "node")
    .call((g) =>
      g
        .append("circle")
        .attr("r", (d) => d.r)
        .style("fill", (d) => color(Math.round(d.dem / d.total)))
        .style("opacity", 0.9)
    )
    .call((g) =>
      g
        .append("title")
        .text(
          (d) =>
            `${
              d.state
            }\nDem: ${d.dem.toLocaleString()}\nRep: ${d.rep.toLocaleString()}\nTotal: ${d.total.toLocaleString()}\nElectoral votes: ${
              d.electoralVotes
            }\n`
        )
    );

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height / 2})`)
    .call(xAxis);

  simulation.on("tick", () =>
    g.attr("transform", (d) => `translate(${d.x}, ${d.y})`)
  );
})();
