(async function derpTree() {
  const data = await d3.json("bluebird.json").then((res) => ({
    ...res.data.report.project,
    children: res.data.report.digests
      .find((d) => d.title == "transitive dependencies")
      .source_data.data.map(recurseDependancies),
  }));

  function recurseDependancies(package) {
    if (
      Array.isArray(package.dependencies) &&
      package.dependencies.length > 0
    ) {
      const children = package.dependencies.map(recurseDependancies);
      delete package.dependencies;
      return {
        ...package,
        children,
      };
    }
    delete package.dependencies;
    return package;
  }

  chart(data);
})();

function tree(data, width) {
  const root = d3.hierarchy(data);
  root.dx = 10;
  root.dy = width / (root.height + 1);
  return d3.tree().nodeSize([root.dx, root.dy])(root);
}

function chart(data) {
  const width = 2000;
  const root = tree(data, width);
  let x0 = Infinity;
  let x1 = -x0;
  root.each((d) => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const svg = d3
    .select("#tidy-tree")
    .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);

  const g = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

  const link = g
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr(
      "d",
      d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x)
    );

  const node = g
    .append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node
    .append("circle")
    .attr("fill", (d) =>
      ["shell-quote", "lodash"].includes(d.data.name)
        ? "red"
        : d.children
        ? "#555"
        : "#999"
    )
    .attr("r", (d) =>
      ["shell-quote", "lodash"].includes(d.data.name) ? 5 : 2.5
    );

  node
    .append("text")
    .attr("dy", "0.31em")
    .attr("x", (d) => (d.children ? -6 : 6))
    .attr("text-anchor", (d) => (d.children ? "end" : "start"))
    .text((d) => `${d.data.name} ${d.data.version || ""}`)
    .clone(true)
    .lower()
    .attr("stroke", "white");
}

function sim() {
  const width = 300;
  const height = 300;
  const nodes = [{}, {}, {}, {}, {}];

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  function ticked() {
    var u = d3
      .select("#derp-tree")
      .attr("height", height)
      .attr("width", width)
      .selectAll("circle")
      .data(nodes);

    u.enter()
      .append("circle")
      .attr("r", 5)
      .merge(u)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    u.exit().remove();
  }
}
