d3.csv("./data.csv")
  .then((data) => {
    data.forEach((d) => {
      d.x = Number(d.x);
      d.y = Number(d.y);
    });

    var config = {
      parent: "#drawing_region",
      width: 256,
      height: 256,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
    };

    const scatter_plot = new ScatterPlot(config, data);
    scatter_plot.update();
  })
  .catch((error) => {
    console.log(error);
  });

class ScatterPlot {
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
    let self = this;

    self.svg = d3
      .select(self.config.parent)
      .attr("width", self.config.width)
      .attr("height", self.config.height);

    self.chart = self.svg
      .append("g")
      .attr(
        "transform",
        `translate(${self.config.margin.left}, ${self.config.margin.top})`,
      );

    self.inner_width =
      self.config.width - self.config.margin.left - self.config.margin.right;
    self.inner_height =
      self.config.height - self.config.margin.top - self.config.margin.bottom;

    self.xscale = d3.scaleLinear().range([0, self.inner_width]);

    self.yscale = d3.scaleLinear().range([self.inner_height, 0]);

    self.xaxis = d3.axisBottom(self.xscale).ticks(6);

    self.xaxis_group = self.chart
      .append("g")
      .attr("transform", `translate(0, ${self.inner_height})`);

    self.yaxis = d3.axisLeft(self.yscale).ticks(6);

    self.yaxis_group = self.chart
      .append("g")
      .attr("transform", `translate(0, 0)`);

    // 軸ラベルをつける
    self.chart
      .append("text")
      .attr("x", self.inner_width / 2)
      .attr("y", self.inner_height + 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "12pt")
      .attr("font-weight", "middle")
      .text("x-label");

    self.chart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", -self.inner_width / 2)
      .attr("y", -30)
      .attr("transform", "rotate(-90)")
      .attr("font-weight", "middle")
      .attr("font-size", "12pt")
      .text("y-label");
  }

  update() {
    let self = this;

    const xmin = d3.min(self.data, (d) => d.x);
    const xmax = d3.max(self.data, (d) => d.x);
    const xMargin = (xmax - xmin) / 5;
    self.xscale.domain([xmin - xMargin, xmax + xMargin]);

    const ymin = d3.min(self.data, (d) => d.y);
    const ymax = d3.max(self.data, (d) => d.y);
    const yMargin = (ymax - ymin) / 5;
    self.yscale.domain([ymin - yMargin, ymax + yMargin]);

    self.render();
  }

  render() {
    let self = this;

    self.chart
      .selectAll("circle")
      .data(self.data)
      .enter()
      .append("circle")
      .attr("cx", (d) => self.xscale(d.x))
      .attr("cy", (d) => self.yscale(d.y))
      .attr("r", (d) => d.r);

    self.xaxis_group.call(self.xaxis);
    self.yaxis_group.call(self.yaxis);
  }
}
