(async function day18() {
  /*
  join: we update our data
  enter selection: d3 adds elements based on that data
  update selection: re-orders elements to that data
  exit: removes elements that aren't in the data
*/

  const players = generatePlayers();

  const intA = setInterval(firstInt, 2000);
  let secondsA = 0;
  function firstInt() {
    const svg = d3.select("#day-18-a").attr("height", 300).attr("width", 300);
    svg
      .selectAll("text")
      .data(players.slice(0, 10))
      .join("text")
      .attr("transform", (d, i) => `translate(10, ${i * 30})`)
      .attr("x", 5)
      .attr("dy", "1.25em")
      .attr("font-size", 14)
      .style("font-family", "sans-serif")
      .text((d) => `${d.name}: score: ${d.score}`);

    randomizeScores(players);
    secondsA++;
    if (secondsA === 5) {
      clearInterval(intA);
    }
  }

  const intB = setInterval(highlightNewPlayers, 2000);
  let secondsB = 0;
  function highlightNewPlayers() {
    const svg = d3.select("#day-18-b").attr("height", 300).attr("width", 300);
    svg
      .selectAll("text")
      .data(players.slice(0, 10), (player) => player.name)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("transform", (d, i) => `translate(10, ${i * 30})`)
            .attr("x", 5)
            .attr("dy", "1.25em")
            .attr("font-size", 14)
            .style("font-family", "sans-serif")
            .style("fill", "blue"),
        (update) =>
          update
            .attr("transform", (d, i) => `translate(10, ${i * 30})`)
            .style("fill", "black")
      )
      .text((d) => `${d.name}: score: ${d.score}`);

    randomizeScores(players, 50);

    secondsB++;
    if (secondsB === 5) {
      clearInterval(intB);
    }
  }

  const intC = setInterval(exit, 2000);
  let secondsC = 0;
  function exit() {
    const svg = d3.select("#day-18-c").attr("height", 300).attr("width", 300);

    const t = d3.transition().duration(1000);

    svg
      .selectAll("text")
      .data(players.slice(0, 10), (player) => player.name)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("transform", (d, i) => `translate(10, ${i * 30})`)
            .attr("x", 5)
            .attr("dy", "1.25em")
            .attr("font-size", 14)
            .style("font-family", "sans-serif")
            .style("fill", "blue")
            .style("opacity", 0)
            .text((d) => d.name)
            .call((text) => text.transition(t).style("opacity", 1)),
        (update) =>
          update
            .transition(t)
            .attr("transform", (d, i) => `translate(10, ${i * 30})`)
            .style("fill", "black"),
        (exit) =>
          exit
            .style("fill", "red")
            .transition(t)
            .attr("transform", (d, i) => `translate(${100}, ${i * 30})`)
            .remove()
      );

    randomizeScores(players, 50);

    secondsC++;
    if (secondsC === 5) {
      clearInterval(intC);
    }
  }

  const intervalLeaderboard = setInterval(leaderboard, 3000);
  let leaderboardSeconds = 0;
  function leaderboard() {
    const colors = color(players);

    const svg = d3
      .select("#day-18-leaderboard")
      .attr("height", 300)
      .attr("width", 300);

    const t = d3.transition().duration(1000);

    svg
      .selectAll("g")
      .data(players.slice(0, 11), (d) => d.name)
      .join(
        (enter) => enterRects(enter, t),
        (update) => updateRects(update, t),
        (exit) => exitRects(exit, t)
      );

    updateScores(players);

    leaderboardSeconds++;
    if (leaderboardSeconds === 5) {
      clearInterval(intervalLeaderboard);
    }

    function color(players) {
      return d3.scaleOrdinal(
        players.map((player) => player.name),
        d3.quantize(d3.interpolateRdYlGn, players.length)
      );
    }

    function updateScores(players, stdDev) {
      players.forEach(
        (d) =>
          (d.score += Math.floor(d3.randomNormal(100, stdDev || 10)() / 10))
      );
      players.sort((a, b) => b.score - a.score);
    }

    function enterRects(enter, t) {
      return enter
        .append("g")
        .attr("transform", (d, i) => `translate(10, 350)`)
        .style("opacity", 0)
        .call((g) =>
          g
            .transition(t)
            .attr("transform", (d, i) => `translate(10, ${10 + i * 30})`)
            .style("opacity", 1)
        )
        .call((g) =>
          g
            .append("rect")
            .attr("width", 280)
            .attr("height", 25)
            .style("fill", (d, i) => {
              if (i === 0) return "gold";
              else if (i == 1) return "silver";
              else if (i == 2) return "#cd7f32";
              else return colors(d.name);
            })
            .style("opacity", "0.8")
            .attr("rx", 3)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", 5)
            .attr("dy", "1.2em")
            .style("font-size", 14)
            .style("font-family", "sans-serif")
            .text((d) => `${d.name} - ${d.score}`)
            .raise()
        );
    }
    function updateRects(update, t) {
      return update
        .call((g) =>
          g
            .transition(t)
            .attr("transform", (d, i) => `translate(10, ${10 + i * 30})`)
        )
        .call((g) => g.select("text").text((d) => `${d.name} - ${d.score}`))
        .call((g) =>
          g
            .select("rect")
            .transition(t)
            .style("fill", (d, i) => {
              if (i == 0) return "gold";
              else if (i == 1) return "silver";
              else if (i == 2) return "#cd7f32";
              else return colors(d.name);
            })
        );
    }
    function exitRects(exit, t) {
      return exit.call((g) =>
        g
          .transition(t)
          .attr("transform", (d, i) => `translate(10, 350)`)
          .style("opacity", 0)
          .remove()
      );
    }
  }

  function generatePlayers() {
    return d3.range(30).map((d) => ({
      name: `Player ${d}`,
      score: 0,
    }));
  }

  function randomizeScores(players, stdDev) {
    players.forEach(
      (d) => (d.score = Math.floor(d3.randomNormal(100, stdDev || 10)() / 10))
    );
    players.sort((a, b) => b.score - a.score);
  }
})();
