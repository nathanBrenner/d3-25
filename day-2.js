(function day2() {
  // domain: input range
  // range: output value by a predefined range
  // scale: a function that takes domain and returns a range
  // scaleLinear
  const scale = d3.scaleLinear();

  // next: set min and max values of domain, then min and max of range
  // const dMin = 0,
  //   dMax = 10;
  // const rMin = 0,
  //   rMax = 100;

  // scale.domain([dMin, dMax]).range([rMin, rMax]);

  // linear, sequential, diverging, quantize, time, ordinal
  // continous (like linear), returns values along a continous range
  // ordinal: returns discretely defined values

  const xSlider = document.getElementById("x-scale"),
    ySlider = document.getElementById("y-scale"),
    colorSlider = document.getElementById("color-scale");
  let xSliderValue = 0,
    ySliderValue = 0,
    colorSliderValue = 0;

  xSlider.addEventListener(
    "input",
    function () {
      xSliderValue = this.value;
      render();
    },
    false
  );

  ySlider.addEventListener(
    "input",
    function () {
      ySliderValue = this.value;
      render();
    },
    false
  );

  colorSlider.addEventListener(
    "input",
    function () {
      colorSliderValue = this.value;
      render();
    },
    false
  );

  const ySliderScale = d3.scaleLinear().domain([0, 140]).range([0, 130]);

  const xSliderScale = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3, 4])
    .range([10, 40, 70, 100, 130]);

  const colorSliderScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range(["#eee", "steelblue"]);

  function render() {
    d3.select(".day-2a").selectAll("rect").remove();

    d3.select(".day-2a")
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", xSliderScale(xSliderValue))
      .attr("y", ySliderScale(ySliderValue))
      .style("fill", colorSliderScale(colorSliderValue));
  }

  function second() {
    const data = [0, 1, 2, 3, 4];
    const maxHeight = 140;
    const xScale = d3.scaleOrdinal().domain(data).range([10, 40, 70, 100, 130]);
    const yScale = d3.scaleLinear().domain([0, 4]).range([10, maxHeight]);
    const colorScale = d3
      .scaleLinear()
      .domain([0, 4])
      .range(["#eee", "steelblue"]);

    const svg = d3.select(".day-2b");

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", 20)
      .attr("y", 10)
      .attr("x", (d) => xScale(d))
      .attr("height", (d) => yScale(d))
      .style("fill", (d) => colorScale(d));
  }

  second();
})();
