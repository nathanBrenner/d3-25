(async function day16() {
  /**
   *  uses scales and brushes to create a zoom effect as the
   *  user selects a section of the chart to zoom in on
   * 1871
   */
  const data = await d3.csv("co2Concentration.csv").then((rows) =>
    rows.map(d3.autoType).map((d) => {
      const o = {};
      const newKeys = Object.entries(d).map(([key, value]) => {
        const ks = key.split(" ");
        const k = ks.length > 1 ? ks[1].toLowerCase() : ks[0].toLowerCase();
        o[k] = value;
      });
      return o;
    })
  );
  const margin = { top: 10, right: 10, bottom: 35, left: 30 };
  const width = 900;
  const height = 550;
  const height1 = 400;
  const height2 = 150;

  const svg = d3.select("#day-16").attr("width", width).attr("height", height);
  // context chart: bottom, shorter, ui control element
  // focus view: area chart, bigger

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map((d) => d.year)))
    .range([0, width - margin.right - margin.left]);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => (d < 0 ? `${Math.abs(d).toLocaleString()} BCE` : d));
  const yScale = d3
    .scaleLinear()
    .domain(
      [
        d3.min(data.map((d) => d.concentration)),
        d3.max(data.map((d) => d.concentration)),
      ],
      [0]
    )
    .range([height1, margin.top]);
  const yAxis = d3.axisLeft(yScale);

  const area = d3
    .area()
    .curve(d3.curveMonotoneX)
    .x((d) => xScale(d.year))
    .y0(height1)
    .y1((d) => yScale(d.concentration));

  // focus view
  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height1);

  const focus = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  focus
    .append("path")
    .datum(data)
    .attr("class", "area")
    .attr("clip-path", "url(#clip)")
    .style("fill", "#cf5454")
    .style("stroke", "#cf5454")
    .style("stroke-width", 3)
    .attr("d", area);

  focus
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height1})`)
    .call(xAxis)
    .select(".domain")
    .remove();

  focus
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis)
    .select(".domain")
    .remove();

  // context view
  const xScale2 = d3
    .scaleLinear()
    .domain(xScale.domain())
    .range([0, width - margin.right - margin.left]);

  const xAxis2 = d3
    .axisBottom(xScale2)
    .tickFormat((d) => (d < 0 ? `${Math.abs(d).toLocaleString()} BCE` : d));

  const yScale2 = d3
    .scaleLinear()
    .domain(yScale.domain())
    .range([height2 - margin.bottom, 0]);

  const area2 = d3
    .area()
    .curve(d3.curveMonotoneX)
    .x((d) => xScale2(d.year))
    .y0(height2 - margin.bottom)
    .y1((d) => yScale2(d.concentration));

  const context = svg
    .append("g")
    .attr("class", "context")
    .attr("transform", `translate(${margin.left}, ${margin.top + height1})`);

  context
    .append("path")
    .datum(data)
    .attr("class", "area")
    .style("fill", "#cf5454")
    .attr("d", area2);

  context
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height2 - margin.bottom})`)
    .call(xAxis2);

  context.append("g").attr("class", "x-brush");

  // brush
  function brushed() {
    const selection = d3.event.selection;
    let extent = selection.map((d) => xScale2.invert(d));
    xScale.domain(extent);

    svg.select(".area").attr("d", area);
    svg.select(".x-axis").call(xAxis);
  }
  const brush = d3
    .brushX(xScale2)
    .extent([
      [0, 20],
      [width - margin.right - margin.left, height2 - margin.bottom],
    ])
    .on("brush", brushed);

  d3.select(".context").select("g.x-brush").call(brush);
})();
