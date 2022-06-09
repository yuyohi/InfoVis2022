
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
    this.svg = d3
      .select(this.config.parent)
      .attr("width", this.config.width)
      .attr("height", this.config.height);

    this.chart = this.svg
      .append("g")
      //.attr(
      //  "transform",
      //  `translate(${this.config.margin.left}, ${this.config.margin.top})`,
      //);

    this.inner_width =
      this.config.width - this.config.margin.left - this.config.margin.right;
    this.inner_height =
      this.config.height - this.config.margin.top - this.config.margin.bottom;

    const projection = d3
      .geoMercator()
      .center([0, 0]) //緯度経度の中心
      .translate([this.inner_width / 2, this.inner_height / 2]) //svgの中心
      .scale(130); //地図の縮尺

    const path = d3.geoPath().projection(projection);

    d3.json("countries_geo.json").then((json) =>
      chart
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "dimgray")
        .attr("stroke-width", 0.5)
        .attr("fill", "lightgray"),
    );
  }

  update() {
    this.render();
  }

  render() {}
}

var config = {
  parent: "#drawing_region",
  width: 900,
  height: 600,
  margin: { top: 40, right: 40, bottom: 40, left: 40 },
};

const graph = new Chart(config, "test");
graph.update();