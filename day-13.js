(async function day13() {
  const height = 700;
  const width = 900;
  const csv = await d3.csv("treemap.csv");
  const children = csv.map((country) => ({
    name: country.Country,
    children: Object.entries(country)
      .map((c) => {
        if (c[0] == "" || c[0] == "Country" || c[0] == "Year") {
          return;
        } else {
          return { name: c[0], value: c[1] };
        }
      })
      .filter((d) => d),
  }));
  const data = { children };
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const colorScale = d3.scaleOrdinal(d3.schemeSet2);

  const dataCopy = JSON.parse(JSON.stringify(data));
  const hierarchy = d3
    .hierarchy(dataCopy)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  const treemap = d3
    .treemap()
    .size([width, height])
    .padding(2)
    .paddingTop(10)
    .round(true);
  const root = treemap(hierarchy);

  const svg = d3
    .select("#day-13")
    .attr("height", height)
    .attr("width", width)
    .style("font-family", "sans-serif");

  const g = svg
    .append("g")
    .attr("class", "treemap-container day-13-treemap-container");

  g.selectAll("text.country")
    .data(root.children)
    .join("text")
    .attr("class", "country")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("dy", "0.6em")
    .attr("dx", 3)
    .style("font-size", 12)
    .text((d) => d.data.name);

  const leaf = g
    .selectAll("g.leaf")
    .data(root.leaves())
    .join("g")
    .attr("class", "leaf")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`)
    .style("font-size", 10);

  leaf
    .append("title")
    .text(
      (d) =>
        `${d.parent.data.name}-${d.data.name}\n${d.value.toLocaleString()} GWh`
    );

  leaf
    .append("rect")
    .attr("fill", (d) => colorScale(d.parent.data.name))
    .attr("opacity", 0.7)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("rx", 3)
    .attr("ry", 3);

  leaf.each((d, i, arr) => {
    const current = arr[i];
    const left = d.x0;
    const right = d.x1;
    const width = right - left;
    const top = d.y0;
    const bottom = d.y1;
    const height = bottom - top;

    const tooSmall = width < 34 || height < 25;

    const text = d3
      .select(current)
      .append("text")
      .attr("opacity", tooSmall ? 0 : 0.9)
      .selectAll("tspan")
      .data((d) => [d.data.name, d.value.toLocaleString()])
      .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i) => (i ? "2.5em" : "1.15em"))
      .text((d) => d);
  });
  function revealText() {
    const leaf = d3.select(".day-13-treemap-container").selectAll("g.leaf");
    leaf.each((d, i, arr) => {
      const current = arr[i];
      const left = d.x0;
      const right = d.x1;
      const width = (right - left) * d3.event.transform.k;
      const top = d.y0;
      const bottom = d.y1;
      const height = (d.y1 - d.y0) * d3.event.transform.k;

      const tooSmall = width < 34 || height < 25;
      d3.select(current)
        .select("text")
        .attr("opacity", tooSmall ? 0 : 0.9);
    });
  }
  d3.select(".day-13-treemap-container").call(
    d3
      .zoom()
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([1, 20])
      .on("zoom", (d, i) => {
        d3.select("#day-13")
          .select(".day-13-treemap-container")
          .attr("transform", d3.event.transform);
        revealText();
      })
  );
})();
