class LineChart {
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

    // Initialize axis scales
    this.xscale = d3.scaleLinear().range([0, this.inner_width]);

    this.yscale = d3.scaleLinear().range([this.inner_height, 0]);

    // Initialize axes
    this.xaxis = d3
      .axisBottom(this.xscale)
      .ticks(5)
      .tickSize(4)
      .tickPadding(8)
      .tickSizeOuter(0);

    this.yaxis = d3
      .axisLeft(this.yscale)
      .ticks(5)
      .tickSize(4)
      .tickPadding(8)
      .tickSizeOuter(0);

    this.line = d3
      .line()
      .x((d) => this.xscale(d.x))
      .y((d) => this.yscale(d.y));

    this.area = d3
      .area()
      .x((d) => this.xscale(d.x))
      .y1((d) => this.yscale(d.y))
      .y0(this.yscale(0));

    this.xaxis_group = this.chart
      .append("g")
      .attr("transform", `translate(0, ${this.inner_height})`);

    this.yaxis_group = this.chart.append("g");
  }

  update() {
    this.xscale.domain([0, d3.max(this.data, (d) => d.x)]);
    this.yscale.domain([0, d3.max(this.data, (d) => d.y)]);

    this.render();
  }

  render() {
    this.chart
      .append("path")
      .attr("d", this.line(this.data))
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    this.chart
      .append("path")
      .attr("d", this.area(this.data))
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "blue");

    this.xaxis_group.call(this.xaxis);
    this.yaxis_group.call(this.yaxis);
  }
}

d3.csv("./data2.csv")
  .then((data) => {
    data.forEach((d) => {
      d.x = Number(d.x);
      d.y = Number(d.y);
    });

    const config = {
      parent: "#drawing_region",
      width: 256,
      height: 256,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
    };
    const lineChart = new LineChart(config, data);
    lineChart.update();
  })
  .catch((error) => {
    document.write(error);
  });
