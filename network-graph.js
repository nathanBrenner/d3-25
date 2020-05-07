(function networkGraph() {
  // https://observablehq.com/@xianwu/simple-force-directed-graph-network-graph

  const margin = { top: 30, right: 80, bottom: 30, left: 30 };
  const width = 590;
  const height = 340;

  const simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3
    .select("#network-graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xdataset = {
    nodes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
    links: [
      { source: 1, target: 5 },
      { source: 4, target: 5 },
      { source: 4, target: 6 },
      { source: 3, target: 2 },
      { source: 5, target: 2 },
      { source: 1, target: 2 },
      { source: 3, target: 4 },
    ],
  };

  const dataset = {
    nodes: [
      { id: "a" },
      { id: "b" },
      { id: "c" },
      { id: "d" },
      { id: "e" },
      { id: "f" },
      { id: "g" },
      { id: "h" },
      { id: "i" },
    ],
    links: [
      { source: "a", target: "b" },
      { source: "b", target: "e" },
      { source: "b", target: "f" },
      { source: "a", target: "c" },
      { source: "c", target: "g" },
      { source: "c", target: "h" },
      { source: "a", target: "d" },
      { source: "d", target: "e" },
      { source: "d", target: "i" },
      { source: "d", target: "g" },
    ],
  };

  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(dataset.links)
    .enter()
    .append("line");

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr("r", 20);
  // .call(
  //   d3
  //     .drag()
  //     .on("start", dragStarted)
  //     .on("drag", dragged)
  //     .on("end", dragended)
  // );

  const text = svg
    .append("g")
    .attr("class", "text")
    .selectAll("text")
    .data(dataset.nodes)
    .enter()
    .append("text")
    .text((d) => d.id);

  simulation.nodes(dataset.nodes).on("tick", ticked);
  simulation.force("link").links(dataset.links);

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

    console.log("dataset after dragged is ...", dataset);
  }
  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    text.attr("x", (d) => d.x - 5).attr("y", (d) => d.y + 5);
  }
})();
