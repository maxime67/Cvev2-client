/* App.vue */
<script>
export default {
  data() {
    return {
      chart: null,
      options: {
        animationEnabled: true,
        title:{
          text: "CVE publiées par mois"
        },
        data: [{
          type: "column",
          dataPoints: [
            { label: "Janvier",  y: 10 },
            { label: "Février", y: 11 },
            { label: "Mars", y: 12 },
            { label: "Avril",  y: 9 },
            { label: "Mai",  y: 16 },
            { label: "Juin",  y: 21 },
            { label: "Juillet",  y: 8 },
            { label: "Aout",  y: 21 },
            { label: "Septembre",  y: 15 },
            { label: "Octobre",  y: 12 },
            { label: "Novembre",  y: 11 },
            { label: "Décembre",  y: 13 },
          ]
        }]
      }
    }
  }
}
</script>
<template>
  <CanvasJSChart :options="options"/>
</template>                              