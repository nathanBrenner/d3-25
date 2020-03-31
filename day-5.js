(function day5() {
  // bar chart
  // bar for each year on x axis
  // height of bar is based on the amount spent (value)
  const data = [
    { year: 2005, value: 734.69 },
    { year: 2006, value: 750.7 },
    { year: 2007, value: 755.13 },
    { year: 2008, value: 694.19 },
    { year: 2009, value: 681.83 },
    { year: 2010, value: 718.98 },
    { year: 2011, value: 740.57 },
    { year: 2012, value: 752.24 },
    { year: 2013, value: 767.24 },
    { year: 2014, value: 802.45 },
    { year: 2015, value: 805.65 },
    { year: 2016, value: 935.58 },
    { year: 2017, value: 967.13 },
    { year: 2018, value: 1007.24 }
  ];

  const height = 500;
  const width = 900;
  const margin = { top: 10, right: 10, bottom: 20, left: 35 };

  const yMax = d3.max(data, d => d.value);

  // scaleBand: ordinal scale,
  // given an array of values for domain,
  // scale will divide the defined range of pixels into evenly sized segments
  const xDomain = data.map(d => d.year);
  const xScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([margin.left, width - margin.right - margin.left])
    .padding(0.5);
  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([height - margin.bottom, margin.top]);

  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

  const svg = d3
    .select(".day-5a")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid #ccc");

  svg
    .append("g")
    .attr("class", "bars")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(0) - yScale(d.value))
    .style("fill", "#7472c0");

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);
})();
