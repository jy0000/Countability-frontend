<!-- from https://codepen.io/reiallenramos/pen/MWaEmpw -->

<template>
  <div id="app">
    <h1>Drawing with mousemove event</h1>
    <canvas id="myCanvas" width="360" height="360" @mousedown="drawDot" @mousemove="keepDrawing" @mouseup="stopDrawing" />
  </div>
</template>

<script lang="ts">
export default {
  el: '#app',
  data() {
    return {
    x: 0,
    y: 0,
    isDrawing: false,
    canvas: null
    }
  },
  mounted() {
    const c = document.getElementById("myCanvas");
    this.canvas = c.getContext('2d');
    this.NUMBER_OF_POINTS = 10;
    this.CANVAS_SIZE = 360;
    this.BOX_SIZE = this.CANVAS_SIZE / this.NUMBER_OF_POINTS;
    this.drawGreyLines(c);
  },
  methods: {
    drawGreyLines() {
      for (let r = 0.5; r < this.NUMBER_OF_POINTS; r++) { // draw grey lines
          for (let c = 0.5; c < this.NUMBER_OF_POINTS; c++) {
              const context = this.canvas;
              context.save();
              context.translate(this.BOX_SIZE * c, this.BOX_SIZE * r);
              context.strokeStyle = 'grey';
              context.lineWidth = 1;
              context.strokeRect(-this.BOX_SIZE/2, -this.BOX_SIZE/2, this.BOX_SIZE, this.BOX_SIZE);
              context.restore();
          }
      }
    },
    keepDrawing(e) {
      if (this.isDrawing === true) {
        this.drawDot(e)
      }
    },
    stopDrawing(e) {
      if (this.isDrawing === true) {
        this.x = 0;
        this.y = 0;
        this.isDrawing = false;
      }
    },
    drawDot(e) {
      this.x = this.getCoord(e.offsetX, this.BOX_SIZE);
      this.y = this.getCoord(e.offsetY, this.BOX_SIZE);
      this.isDrawing = true;
      const context = this.canvas;

      // save original context settings before we translate and change colors
      context.save();
      
      // // get row, column
      // const r = Math.round((y - BOX_SIZE/2)/BOX_SIZE); // 0-indexed
      // const c = Math.round((x - BOX_SIZE/2)/BOX_SIZE); // 0-indexed
      // Next Steps: check if already drawn to => make white, then return a point
      //              keep track of what boxes are drawn too, connect with points
      //              store drawing to mongoDB with connection to user
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.moveTo(this.x, this.y);
      context.strokeRect(this.x-this.BOX_SIZE/2,this.y-this.BOX_SIZE/2, this.BOX_SIZE, this.BOX_SIZE);
      context.fillRect(this.x-this.BOX_SIZE/2,this.y-this.BOX_SIZE/2, this.BOX_SIZE, this.BOX_SIZE);
      
      context.restore();
    },
    getCoord(coordinate, boxSize) {
      const points = [];
      for (let i = 0.5; i < this.NUMBER_OF_POINTS; i++) {
          points.push(boxSize * i);
      }

      // https://stackoverflow.com/questions/8584902/get-the-closest-number-out-of-an-array
      const coord = points.reduce(function(prev, curr) {
          return (Math.abs(curr - coordinate) < Math.abs(prev - coordinate) ? curr : prev);
      });

      return coord;
  }
  }
};
</script>

<style scoped>
  #myCanvas {
  border: 1px solid grey;
}
</style>