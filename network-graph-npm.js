(async function networkGraphNPM() {
  const rawData = await d3.json("foo.json");

  const usefulData = {
    nodes: [],
    links: [],
  };
  const root = {
    id: rawData.data.report.project.name,
    data: rawData.data.report.project,
    depth: 0,
  };
  const dependancies = rawData.data.report.digests.find(
    (d) => d.title == "transitive dependencies"
  ).source_data.data;

  usefulData.nodes.push(root);
  const directDeps = dependancies.map((d) => d.name);
  dependancies.forEach((d) => flattenNodes(d, 1));
  dependancies.forEach((d) => addLink(d, root.id));

  function flattenNodes(package, depth) {
    let currentNodes = usefulData.nodes.map(({ id }) => id);

    if (!currentNodes.includes(package.name)) {
      usefulData.nodes.push({
        id: package.name,
        ...package,
        depth: directDeps.includes(package.name) ? 1 : 2,
      });
      currentNodes.push(package.name);
    }

    if (
      package.dependencies &&
      Array.isArray(package.dependencies) &&
      package.dependencies.length > 0
    ) {
      package.dependencies.forEach((d) => flattenNodes(d));
    }
  }

  function addLink(package, source) {
    usefulData.links.push({ source, target: package.name });

    if (
      package.dependencies &&
      Array.isArray(package.dependencies) &&
      package.dependencies.length > 0
    ) {
      package.dependencies.forEach((d) => addLink(d, package.name));
    }
  }

  draw();

  function draw() {
    const margin = { top: 30, right: 80, bottom: 30, left: 30 };
    // const width = 3312;
    // const height = 3472;
    const width = 1050;
    const height = 1050;

    const zoom = d3
      .zoom()
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([1, 20])
      .on("zoom", (_) =>
        d3
          .select(".network-graph-container")
          .attr("transform", d3.event.transform)
      );

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-20))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const colorScale = d3.scaleOrdinal([0, 1, 2, 3], ["black", "green", "red"]);

    const svg = d3
      .select("#network-graph-npm")
      .style("border", "1px solid red")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    const g = svg.append("g").attr("class", "network-graph-container");

    svg.call(zoom);

    const link = g
      .append("g")
      .attr("class", "network-graph-links")
      .selectAll("line")
      .data(usefulData.links)
      .enter()
      .append("line")
      .style("stroke", "black");

    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(usefulData.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .style("fill", (d) => colorScale(d.depth))
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node.on("mouseenter", (d) => {
      tooltip
        .style("visibility", "visible")
        .style("top", `${d3.event.pageY - 10}px`)
        .style("left", `${d3.event.pageX + 10}px`)
        .style("color", "red")
        .style("background-color", "lightgray")
        .style("padding", "10px")
        .text(`package: ${d.id}`);
    });

    node.on("mouseleave", () => tooltip.style("visibility", "hidden"));

    // const text = g
    //   .append("g")
    //   .attr("class", "text")
    //   .selectAll("text")
    //   .data(usefulData.nodes)
    //   .enter()
    //   .append("text")
    //   .style("font-size", "12px")
    //   .attr("transform", `translate(10, 10)`)
    //   .attr("color", "red")
    //   .style("background-color", "lightgray")
    //   .style("padding", "10px")
    //   .text((d) => d.id);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .attr("height", "100px")
      .attr("width", "100px");

    simulation.nodes(usefulData.nodes).on("tick", ticked);
    simulation.force("link").links(usefulData.links);

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      // text.attr("x", (d) => d.x - 5).attr("y", (d) => d.y + 5);
    }

    function dragStarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart(); //sets the current target alpha to the specified number in the range [0,1].
      d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
      d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
    }

    //When the drag gesture starts, the targeted node is fixed to the pointer
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    //the targeted node is released when the gesture ends
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
})();
