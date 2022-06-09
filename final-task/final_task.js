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
    this.data = data.filter((v) => {
      v.Year === "2019";
    });

    this.new_data = {};

    this.data.foreach((v) => {
      this.new_data[v.Entity] = Number(v.Deaths);
    });

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
    this.inner_height =
      this.config.height - this.config.margin.top - this.config.margin.bottom;

    const projection = d3
      .geoMercator()
      .center([0, 0]) //緯度経度の中心
      .translate([this.inner_width / 2, this.inner_height / 2]) //svgの中心
      .scale(100); //地図の縮尺

    const path = d3.geoPath().projection(projection);

    maxDeaths = d3.min(this.data, (d) => d.Deaths);
    const color = d3
      .scaleLinear()
      .domain([0, maxDeaths])
      .range(["white", "red"]);

    d3.json("custom.geo.json").then(
      (json) =>
        this.chart
          .selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", (d) => {
            const deaths = this.new_data[d.properties.name];
            return color(deaths);
            //if (d.properties.name === "Japan") {
            //  return "lightgray";
            //} else {
            //  return "666";
            //}
          })
          .attr("stroke", "dimgray")
          .attr("stroke-width", 0.5),
      //.attr("fill", "lightgray"),
    );
  }

  update() {
    this.render();
  }

  render() {}
}

d3.csv("./deaths-conflict-terrorism-per-100000.csv").then((data) => {
  var config = {
    parent: "#drawing_region",
    width: 900,
    height: 600,
    margin: { top: 40, right: 40, bottom: 40, left: 40 },
  };

  const graph = new Chart(config, data);
  graph.update();
});
