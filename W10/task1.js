class BarChart {
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

    this.yscale = d3
      .scaleBand()
      .range([0, this.inner_height])
      .paddingInner(0.1);

    // Initialize axes
    this.xaxis = d3.axisBottom(this.xscale).ticks(5).tickSizeOuter(0);

    this.yaxis = d3.axisLeft(this.yscale).tickSizeOuter(0);

    this.xaxis_group = this.chart
      .append("g")
      .attr("transform", `translate(0, ${this.inner_height})`);

    this.yaxis_group = this.chart.append("g");
  }

  update() {
    this.xscale.domain([0, d3.max(this.data, (d) => d.value)]);
    this.yscale.domain(this.data.map((d) => d.label));

    this.render();
  }

  render() {
    this.chart
      .selectAll("rect")
      .data(this.data)
      .join("rect")
      .transition()
      .duration(1000)
      .attr("x", 0)
      .attr("y", (d) => this.yscale(d.label))
      .attr("width", (d) => this.xscale(d.value))
      .attr("height", this.yscale.bandwidth());

    this.xaxis_group.call(this.xaxis);
    this.yaxis_group.call(this.yaxis);
  }
}

d3.csv("./data1.csv")
  .then((data) => {
    data.forEach((d) => {
      d.value = Number(d.value);
    });

    const config = {
      parent: "#drawing_region",
      width: 256,
      height: 256,
      margin: { top: 40, right: 60, bottom: 40, left: 60 },
    };
    const barChart = new BarChart(config, data);
    barChart.update();

    d3.select("#reverse").on("click", () => {
      barChart.data.reverse();
      barChart.update();
    });

    d3.select("#Ascend").on("click", () => {
      barChart.data.sort((a, b) => {
        if (a.value < b.value) {
          return -1;
        }
        if (a.value > b.value) {
          return 1;
        }
        return 0;
      });
      barChart.update();
    });

    d3.select("#Descend").on("click", () => {
      barChart.data.sort((a, b) => {
        if (a.value > b.value) {
          return -1;
        }
        if (a.value < b.value) {
          return 1;
        }
        return 0;
      });
      barChart.update();
    });
  })
  .catch((error) => {
    document.write(error);
  });
