<!-- from https://codepen.io/reiallenramos/pen/MWaEmpw -->

<template>
  <div id="app">
    <h1>Drawing with mousemove event</h1>
    <canvas id="myCanvas" width="560" height="360" @mousedown="beginDrawing" @mousemove="keepDrawing" @mouseup="stopDrawing" />
  </div>
</template>

<script lang="ts">
//import type { Canvas, CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from 'canvas';

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
    var c = document.getElementById("myCanvas");
    this.canvas = c.getContext('2d');
  },
  methods: {
    drawLine(x1, y1, x2, y2) {
      let ctx = this.canvas;
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    },
    beginDrawing(e) {
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.isDrawing = true;
    },
    keepDrawing(e) {
      if (this.isDrawing === true) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = e.offsetX;
        this.y = e.offsetY;
      }
    },
    stopDrawing(e) {
      if (this.isDrawing === true) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = 0;
        this.y = 0;
        this.isDrawing = false;
      }
    }
  }
};
</script>

<style scoped>
  #myCanvas {
  border: 1px solid grey;
}
</style>