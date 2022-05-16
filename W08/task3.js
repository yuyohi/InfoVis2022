class PieChart {
  constructor(config, data) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 256,
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
      .attr(
        "transform",
        `translate(${this.config.margin.left}, ${this.config.margin.top})`,
      );

    this.inner_width =
      this.config.width - this.config.margin.left - this.config.margin.right;
    this.inner_height =
      this.config.height - this.config.margin.top - this.config.margin.bottom;

    this.radius = Math.min(this.inner_width, this.inner_height) / 2;

    this.pie = d3.pie().value((d) => d.value);

    this.arc = d3.arc().innerRadius(0).outerRadius(this.radius);
  }

  update() {
    this.render();
  }

  render() {
    this.chart
      .selectAll("pie")
      .data(this.pie(this.data))
      .enter()
      .append("path")
      .attr("d", this.arc)
      .attr("fill", "green")
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .attr(
        "transform",
        `translate(${this.inner_width / 2}, ${this.inner_height / 2})`,
      );

    this.chart
      .selectAll("pie")
      .data(this.pie(this.data))
      .enter()
      .append("text")
      .text((d) => d.data.label)
      .attr(
        "transform",
        (d) =>
          `translate(${this.arc.centroid(d)[0] + this.inner_width / 2}, ${
            this.arc.centroid(d)[1] + this.inner_height / 2
          })`,
      )
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("stroke", "black")
      .attr("stroke-width", 0.3);
  }
}

d3.csv("./data3.csv")
  .then((data) => {
    data.forEach((d) => {
      d.value = Number(d.value);
    });

    const config = {
      parent: "#drawing_region",
      width: 512,
      height: 512,
      margin: { top: 40, right: 60, bottom: 40, left: 60 },
    };
    const pieChart = new PieChart(config, data);
    pieChart.update();
  })
  .catch((error) => {
    document.write(error);
  });
