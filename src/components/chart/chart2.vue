/* App.vue */
<script>
export default {
  data() {
    return {
      chart: null,
      showBackButton: false,
      buttonStyle: {
        "backgroundColor": "#F25F5C"
      },
      visitorsDrilldownedChartOptions: {
        animationEnabled: true,
        theme: "light2",
        axisY: {
          gridThickness: 0,
          lineThickness: 1
        },
        data: []
      },
      newVSReturningVisitorsOptions: {
        animationEnabled: true,
        theme: "light2",
        title: {
          text: "Critical and High CVE last 12 months"
        },
        subtitles: [{
          text: "Click on Any Segment to Drilldown",
          backgroundColor: "#EA5C59",
          fontSize: 16,
          fontColor: "white",
          padding: 5
        }],
        data: []
      },
      options: {
        "Critical and High CVE last 12 months": [{
          type: "pie",
          name: "Critical",
          startAngle: 90,
          cursor: "pointer",
          explodeOnClick: false,
          showInLegend: true,
          legendMarkerType: "square",
          click: this.visitorsChartDrilldownHandler,
          indexLabelPlacement: "inside",
          indexLabelFontColor: "white",
          dataPoints: [
            { y: 551160, name: "Critical", color: "#F25F5C", indexLabel: "62.56%" },
            { y: 329840, name: "High", color: "#FFE066", indexLabel: "37.44%" }
          ]
        }],
        "New Visitors": [{
          color: "#F25F5C",
          name: "New Visitors",
          type: "column",
          dataPoints: [
            { label: "Jan", y: 42600 },
            { label: "Feb", y: 44960 },
            { label: "Mar", y: 46160 },
            { label: "Apr", y: 48240 },
            { label: "May", y: 48200 },
            { label: "Jun", y: 49600 },
            { label: "Jul", y: 51560 },
            { label: "Aug", y: 49280 },
            { label: "Sep", y: 46800 },
            { label: "Oct", y: 57720 },
            { label: "Nov", y: 59840 },
            { label: "Dec", y: 54400 }
          ]
        }],
        "Returning Visitors": [{
          color: "#FFE066",
          name: "Returning Visitors",
          type: "column",
          dataPoints: [
            { label: "Jan", y: 21800 },
            { label: "Feb", y: 25040 },
            { label: "Mar", y: 23840 },
            { label: "Apr", y: 24760 },
            { label: "May", y: 25800 },
            { label: "Jun", y: 26400 },
            { label: "Jul", y: 27440 },
            { label: "Aug", y: 29720 },
            { label: "Sep", y: 29200 },
            { label: "Oct", y: 31280 },
            { label: "Nov", y: 33160 },
            { label: "Dec", y: 31400 }
          ]
        }]
      },
      styleOptions: {
        width: "100%",
        height: "360px"
      }
    }
  },
  methods: {
    visitorsChartDrilldownHandler(e) {
      this.chart.options = this.visitorsDrilldownedChartOptions;
      this.chart.options.data = this.options[e.dataPoint.name];
      this.buttonStyle["backgroundColor"] = this.options[e.dataPoint.name][0].color;
      this.chart.options.title = { text: e.dataPoint.name };
      this.chart.render();
      this.showBackButton = true;
    },
    handleClick(e) {
      this.chart.options = this.newVSReturningVisitorsOptions;
      this.chart.options.data = this.options["Critical and High CVE last 12 months"];
      this.chart.render();
      this.showBackButton = false;
    },
    chartRef(chartInstance) {
      this.chart = chartInstance;
      this.chart.options = this.newVSReturningVisitorsOptions;
      this.chart.options.data = this.options["Critical and High CVE last 12 months"];
      this.chart.render();
    }
  }
}
</script>
<style scoped>
.container {
  position: relative;
}
.back-button {
  border-radius: 4px;
  padding: 8px;
  border: none;
  font-size: 16px;
  background-color: #F25F5C;
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
<template>
  <div class="container">
    <CanvasJSChart :options="newVSReturningVisitorsOptions" @chart-ref="chartRef" :styles="styleOptions"/>
    <button class="back-button" v-if="showBackButton" v-on:click="handleClick" :style="buttonStyle">&lt; Back</button>
  </div>
</template>                              