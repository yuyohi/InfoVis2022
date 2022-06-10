class Chart {
  constructor(config, data) {
    this.config = {
      parent: config.parent,
      width: config.width || 900,
      height: config.height || 600,
      margin: config.margin || { top: 20, right: 20, bottom: 20, left: 20 },
    };
    this.data = data;
    this.init();
  }

  init() {
    this.newData = {};
    this.barData = {};
    for (let year = 1990; year <= 2019; year++) {
      const yearData = this.data.filter((v) => v.Year === String(year));
      const newYearData = {};
      const newBarData = [];
      yearData.forEach((v) => {
        newYearData[v.Entity] = Number(v.Deaths);
        newBarData.push({ Entity: v.Entity, Deaths: Number(v.Deaths) });
      });

      this.newData[year] = newYearData;
      this.barData[year] = newBarData;
    }

    this.svg = d3
      .select(this.config.parent)
      .attr("width", this.config.width)
      .attr("height", this.config.height);

    this.chart = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.config.margin.left}, ${this.config.margin.top})`,
      );

    this.inner_width =
      this.config.width - this.config.margin.left - this.config.margin.right;
    this.map_inner_height =
      (this.config.height -
        this.config.margin.top -
        this.config.margin.bottom) /
      2;

    const projection = d3
      .geoMercator()
      .center([0, 0]) //緯度経度の中心
      .translate([this.inner_width / 2, this.map_inner_height / 2]) //svgの中心
      .scale(100); //地図の縮尺

    this.path = d3.geoPath().projection(projection);

    const sliderBar = document.getElementById("slideBar");
    sliderBar.addEventListener("change", () => {
      const year = sliderBar.value;
      d3.selectAll("path").remove();
      d3.selectAll("text").remove();
      d3.selectAll(".x").remove();
      d3.selectAll(".y").remove();
      let displayYear = document.getElementById("year");
      displayYear.innerHTML = "<h2>" + String(year) + "年" + "</h2>";
      this.update(year);
    });

    // barChartの設定
    this.bar_inner_height =
      (this.config.height -
        this.config.margin.top -
        this.config.margin.bottom) /
      4;

    this.barChart = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.config.margin.left + 100}, ${
          this.config.margin.top + this.map_inner_height - 180
        })`,
      );

    this.xscale = d3.scaleBand().range([0, this.inner_width]);

    this.yscale = d3
      .scaleLinear()
      .range([
        this.bar_inner_height - this.config.margin.bottom,
        this.config.margin.top,
      ]);

    //Initialize axes
    this.xaxis = d3
      .axisBottom(this.xscale)
      .ticks(47)
      .tickSize(4)
      .tickPadding(8)
      .tickSizeOuter(0);

    this.yaxis = d3
      .axisLeft(this.yscale)
      .ticks(5)
      .tickSize(4)
      .tickPadding(8)
      .tickSizeOuter(0);
  }

  update(year) {
    this.barData[year].sort((a, b) => -1 * (a.Deaths - b.Deaths));
    const ymax = d3.max(this.barData[year], (d) => d.Deaths);
    const ymin = d3.min(this.barData[year], (d) => d.Deaths);
    this.barData[year] = this.barData[year].slice(0, 45);

    this.xscale
      .domain(this.barData[year].map((d) => d.Entity))
      .paddingInner(0.1);

    this.yscale.domain([ymin, ymax]);

    this.render(year);
  }

  render(year) {
    // map
    const maxDeaths = d3.max(Object.values(this.newData[year]));

    const color = d3
      .scaleLinear()
      .domain([0, maxDeaths])
      .range(["white", "red"]);

    d3.json("custom.geo.json").then((json) =>
      this.chart
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", this.path)
        .attr("fill", (d) => {
          const deaths = this.newData[year][d.properties.name];
          if (typeof deaths === "undefined") {
            return "grey";
          }
          return color(deaths);
        })
        .attr("stroke", "dimgray")
        .attr("stroke-width", 0.5),
    );

    // barChart
    this.xaxis_group = this.barChart
      .append("g")
      .attr("class", "x axis")
      .attr(
        "transform",
        `translate(0, ${this.bar_inner_height - this.config.margin.bottom})`,
      )
      .call(this.xaxis)
      .selectAll("text")
      .attr("font-weight", "bold")
      .attr("transform", "rotate(-90)")
      .attr("dy", "-1em")
      .attr("dx", "-5.5em");

    this.yaxis_group = this.barChart
      .append("g")
      .attr("class", "y axis")
      .call(this.yaxis)
      .selectAll("text")
      .attr("font-weight", "bold");

    this.yaxis_group = this.barChart
      .append("g")
      .append("text")
      .text("Deaths")
      .attr("font-weight", "bold")
      .attr("x", this.bar_inner_height / 2 - 300)
      .attr("y", -70)
      .attr("font-size", "23px")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("stroke-width", 1);

    // Draw bars
    this.barChart
      .selectAll("rect")
      .data(this.barData[year])
      .enter()
      .append("rect")
      .attr("x", (d) => this.xscale(d.Entity))
      .attr("y", (d) => this.yscale(d.Deaths))
      .attr("fill", "black")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("width", this.xscale.bandwidth())
      .attr("height", (d) => {
        console.log(this.xscale(d.Entity));
        //console.log(d.Deaths, this.yscale(-d.Deaths));
        return (
          this.bar_inner_height -
          this.config.margin.bottom -
          this.yscale(d.Deaths)
        );
      })
      .transition();
  }
}

d3.csv("./deaths-from-conflict-and-terrorism.csv").then((data) => {
  const config = {
    parent: "#drawing_region",
    width: 900,
    height: 1200,
    margin: { top: 40, right: 40, bottom: 0, left: 40 },
  };

  const graph = new Chart(config, data);
  graph.update(2019);
});
