(async function collapsableTreeNpm() {
  // http://bl.ocks.org/bhpayne/0a8ef2ae6d79aa185dcf2c3a385daf25
  // const rawData = await d3.json("foo.json");
  const rawData = await d3.json("ckeditor.json");

  document.querySelector("#critical").addEventListener("click", (e) => {
    d3.selectAll("#collapsable-tree-npm > *").remove();
    renderGraph(rawData, "critical");
  });

  document.querySelector("#high").addEventListener("click", (e) => {
    d3.selectAll("#collapsable-tree-npm > *").remove();
    renderGraph(rawData, "high");
  });

  renderGraph(rawData, "high");

  function renderGraph(rawData, vulnerabilityType) {
    let treeData = configureData(rawData, vulnerabilityType);
    const margin = { top: 20, right: 90, bottom: 30, left: 200 };
    let width = 1500 - margin.left - margin.right;
    let height = 800 - margin.top - margin.bottom;

    const svg = d3
      .select("#collapsable-tree-npm")
      .attr(
        "viewBox",
        `0 0 ${width + margin.right + margin.left} ${
          height + margin.top + margin.bottom
        }`
      )
      .style("border", "1px solid red")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .attr("height", "100px")
      .attr("width", "100px");

    const duration = 750;

    // delcares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]);

    // assigns parent, children, height, depth
    let root = d3.hierarchy(treeData, (d) => d.children);
    root.x0 = height / 2;
    root.y0 = 0;

    // start with just the direct dependancies
    // root.children.forEach(collapse);

    update(root, treemap, root, svg, duration, vulnerabilityType);
  }

  // collapse the node and all it's children
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function update(source, treemap, root, svg, duration, vulnerabilityType) {
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
      .selectAll("g.dependancy-node")
      .data(nodes, (d) => `${d.data.name} ${d.data.version}`);

    // enter any new nodes at the parent's previous position
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "dependancy-node")
      .attr("transform", (d) => `translate(${source.y0}, ${source.x0})`)
      .on("click", (d) =>
        click(d, treemap, root, svg, duration, vulnerabilityType)
      );

    nodeEnter.on("mouseenter", (d) => {
      d3.select("#tooltip")
        .style("visibility", "visible")
        .style("top", `${d3.event.pageY - 10}px`)
        .style("left", `${d3.event.pageX + 10}px`)
        .style("background-color", "lightgray")
        .style("padding", "10px")
        .html(() => {
          return `<div>
            <p>${d.data.name} ${d.data.data.version || ""}</p>
            ${
              (d.data.data.vulnerabilities &&
                d.data.data.vulnerabilities.length > 0 &&
                `${vulnerabilityType} vulnerability`) ||
              ""
            }
            ${
              (d.data.data.vulnerabilities &&
                d.data.data.vulnerabilities.reduce(
                  (ag, v) => `${ag}<p>${v.vulnerability}: ${v.external_id}</p>`,
                  ""
                )) ||
              ""
            }
          </div>`;
        });
    });

    nodeEnter.on("mouseleave", () =>
      d3.select("#tooltip").style("visibility", "hidden")
    );

    // add circle for the nodes
    nodeEnter
      .append("circle")
      .attr("class", "dependancy-node")
      .attr("r", 1e-6)
      .style("stroke", (d) =>
        d.data.data.vulnerabilities && d.data.data.vulnerabilities.length > 0
          ? "red"
          : "black"
      )
      .style("fill", (d) =>
        d.data.data.vulnerabilities && d.data.data.vulnerabilities.length > 0
          ? "red"
          : "#fff"
      );

    // add labels for the nodes
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d) => (d.children || d._children ? -13 : 13))
      .attr("y", (d) => (d.children || d._children ? -10 : 0))
      .attr("text-anchor", (d) => (d.children || d._children ? "end" : "start"))
      .attr("stroke", (d) =>
        d.data.data.vulnerabilities && d.data.data.vulnerabilities.length > 0
          ? "red"
          : "black"
      )
      .text((d) =>
        d.data.data.vulnerabilities && d.data.data.vulnerabilities.length > 0
          ? `${d.data.name} ${d.data.data.version}`
          : !d.parent
          ? d.data.name
          : ""
      );

    // update
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

    // update the node attributes and style
    nodeUpdate
      .select("circle.dependancy-node")
      .attr("r", 4)
      .style("fill", (d) =>
        d.data.data.vulnerabilities && d.data.data.vulnerabilities.length > 0
          ? "red"
          : "#fff"
      )
      .attr("cursor", "pointer");

    // remove any exiting nodes
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", `translate(${source.y}, ${source.x})`)
      .remove();

    nodeExit.select("circle").attr("r", 1e-6);

    nodeExit.select("text").style("fill-opacity", 1e-6);

    /************* links section *************/

    // update the links
    var link = svg
      .selectAll("path.dependency-link")
      .data(links, (d) => `${d.data.name} ${d.data.version}`);

    // enter any new links at the parent's previous position
    var linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "dependency-link")
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

  function click(d, treemap, root, svg, duration, vulnerabilityType) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d, treemap, root, svg, duration, vulnerabilityType);
  }

  // creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {
    var path2 = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
          ${(s.y + d.y) / 2} ${d.x},
          ${d.y} ${d.x}`;
    return path2;
  }

  function flattenNodes(package, vulns, packagesWithCriticalDependancies) {
    const hasDeps =
      package.dependencies &&
      Array.isArray(package.dependencies) &&
      package.dependencies.length > 0;
    let children = hasDeps ? package.dependencies : null;
    if (hasDeps) {
      children = children.map((c) =>
        flattenNodes(c, vulns, packagesWithCriticalDependancies)
      );
    }
    const hasVulnerability = vulns.includes(
      `${package.name} ${package.version}`
    );
    package.hasVulnerability = hasVulnerability;
    package.vulnerabilities = hasVulnerability
      ? packagesWithCriticalDependancies.filter(
          (p) => p.name === package.name && p.version === package.version
        )
      : [];

    return {
      name: package.name,
      data: package,
      children,
    };
  }

  function spreadTheVuln(package) {
    if (package.children) {
      package.children.map(spreadTheVuln);
      package.data.hasVulnerability = package.children.some(
        (c) => c.data.hasVulnerability
      );
    }
    return package;
  }

  function removeCleanNodes(package) {
    if (package.children && package.data.hasVulnerability) {
      const children = package.children
        .filter((d) => d.data.hasVulnerability)
        .map(removeCleanNodes);
      package.children = children.length ? children : null;
    }
    return package;
  }

  function configureData(rawData, vulnerabilityType) {
    // critical vulnerabilities digest
    // const criticalDependancies = rawData.data.report.digests.find(
    //   (d) => d.title === `${vulnerabilityType} vulnerabilities`
    // ).source_data.data;

    const packagesWithCriticalDependancies = rawData.data.report.digests
      .find((d) => d.title === `${vulnerabilityType} vulnerabilities`)
      .source_data.data.map((d) =>
        d.dependencies.map((dep) => ({ ...dep, vulnerability: d.external_id }))
      )
      .flat();

    const criticalDependancyList = [
      ...new Set(
        packagesWithCriticalDependancies.map((c) => `${c.name} ${c.version}`)
      ),
    ];
    const children = rawData.data.report.digests
      .find((d) => d.title == "transitive dependencies")
      .source_data.data.map((c) =>
        flattenNodes(
          c,
          criticalDependancyList,
          packagesWithCriticalDependancies
        )
      );

    return {
      name: rawData.data.report.project.name,
      data: {
        ...rawData.data.report.project,
        hasVulnerability: criticalDependancyList.length > 0,
      },
      children: children
        .map(spreadTheVuln)
        .filter((d) => d.data.hasVulnerability)
        .map(removeCleanNodes),
    };
  }
})();
