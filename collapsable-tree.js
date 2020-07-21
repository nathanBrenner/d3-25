(async function collapsableTree() {
  // https://bl.ocks.org/d3noob/1a96af738c89b88723eb63456beb6510
  // https://observablehq.com/@d3/tidy-tree
  //observablehq.com/@kkulshreshtha/conceptual-model-collapsible-tree

  /*
  If your nested data uses a different property name for its array of children, you can specify a children accessor function as the second argument to d3.hierarchy
  */
  const treeData = [
    {
      name: "Broadband CFS",
      type: "CFS",
      children: [
        {
          name: "Service Actions",
          children: [
            {
              name: "Add",
              type: "SA",
            },
            {
              name: "Delete",
              type: "SA",
            },
          ],
        },
        {
          name: "RFSes",
          children: [
            {
              name: "DSL RFS",
              type: "RFS",
              children: [
                {
                  name: "DSLAM",
                  type: "Resource",
                },
                {
                  name: "ADSL Port",
                  type: "Resource",
                  children: [
                    {
                      name: "Technical Actions",
                      children: [
                        {
                          name: "Create",
                          type: "TA",
                        },
                        {
                          name: "Delete",
                          type: "TA",
                        },
                        {
                          name: "Modify",
                          type: "TA",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Docsis RFS",
              type: "RFS",
              children: [
                {
                  name: "Docsis Modem",
                  type: "Resource",
                },
                {
                  name: "Docsis Port",
                  type: "Resource",
                },
              ],
            },
            {
              name: "Fiber RFS",
              type: "RFS",
              children: [
                {
                  name: "OLT",
                  type: "Resource",
                },
                {
                  name: "GPON Port",
                  type: "Resource",
                },
                {
                  name: "ONU",
                  type: "Resource",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // set the dimensions and margins of the diagram
  const margin = { top: 20, right: 90, bottom: 30, left: 150 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select("#collapsable-tree")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .style("border", "1px solid red")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .style("border", "1px solid green");

  var i = 0;
  const duration = 750;

  // delcares a tree layout and assigns the size
  const treemap = d3.tree().size([height, width]);

  // assigns parent, children, height, depth
  let root = d3.hierarchy(treeData[0], (d) => d.children);
  root.x0 = height / 2;
  root.y0 = 0;

  // collapse after the second level
  root.children.forEach(collapse);

  update(root);

  // collapse the node and all it's children
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function update(source) {
    // assigns the x and y position for the nodes
    var treeData = treemap(root);

    // compute the new tree layout
    var nodes = treeData.descendants();
    var links = treeData.descendants().slice(1);

    // normalize for fixed-depth
    nodes.forEach((d) => {
      d.y = d.depth * 130;
    });

    /************* nodes section *************/

    // update the nodes
    var node = svg
      .selectAll("g.collapsable-tree-node")
      .data(nodes, (d) => d.id || (d.id = ++i));

    // enter any new nodes at the parent's previous position
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "collapsable-tree-node")
      // .attr("transform", (d) => `translate(${source.y0}, ${source.x0})`)
      .attr("transform", (d) => `translate(${source.x0}, ${source.y0})`) //c
      .on("click", click);

    // add circle for the nodes
    nodeEnter
      .append("circle")
      .attr("class", "collapsable-tree-node")
      .attr("r", 1e-6)
      .style("fill", (d) => (d._children ? "lightsteelblue" : "#fff"));

    // // add labels for the nodes
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d) => (d.children || d._children ? -13 : 13))
      .attr("text-anchor", (d) => (d.children || d._children ? "end" : "start"))
      .text((d) => d.data.name);

    // update
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(duration)
      // .attr("transform", (d) => `translate(${d.y}, ${d.x})`);
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`); //c

    // update the node attributes and style
    nodeUpdate
      .select("circle.collapsable-tree-node")
      .attr("r", 10)
      .style("fill", (d) => (d._children ? "lightsteelblue" : "#fff"))
      .attr("cursor", "pointer");

    // remove any exiting nodes
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      // .attr("transform", `translate(${source.y}, ${source.x})`)
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`) //c
      .remove();

    nodeExit.select("circle").attr("r", 1e-6);

    nodeExit.select("text").style("fill-opacity", 1e-6);

    /************* links section *************/

    // update the links
    var link = svg
      .selectAll("path.collapsable-tree-link")
      .data(links, (d) => d.id);

    // enter any new links at the parent's previous position
    var linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "collapsable-tree-link")
      .attr("d", (d) => {
        var o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    // update
    var linkUpdate = linkEnter.merge(link);

    // transition back to the parent element position
    linkUpdate
      .transition()
      .duration(duration)
      .attr("d", (d) => diagonal(d, d.parent));

    // remove any exiting links
    var linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", (d) => {
        var o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    // store the old positions for transition
    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }

  // creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {
    // var path2 = `M ${s.y} ${s.x}
    //   C ${(s.y + d.y) / 2} ${s.x},
    //     ${(s.y + d.y) / 2} ${d.x},
    //     ${d.y} ${d.x}`;
    // return path2;
    return `M ${s.x} ${s.y}
    C ${(s.x + d.x) / 2} ${s.y},
      ${(s.x + d.x) / 2} ${d.y},
      ${d.x} ${d.y}`;
  }
})();

/*
required styles
	.node {
		cursor: pointer;
	}

	.node circle {
	  fill: #fff;
	  stroke: steelblue;
	  stroke-width: 3px;
	}

	.node text {
	  font: 12px sans-serif;
	}

	.link {
	  fill: none;
	  stroke: #ccc;
	  stroke-width: 2px;
	}
*/
