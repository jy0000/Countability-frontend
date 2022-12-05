<!-- from https://codepen.io/reiallenramos/pen/MWaEmpw -->

<template>
  <div id="app">
    <h3 class="uniform-button">
      Your temporary points left: {{ tempPoints }}
      These will not be spent until you save your drawing
    </h3>
    <h1>Drawing</h1>
    <canvas
      id="myCanvas"
      width="360"
      height="360"
      @mousedown="drawDot"
    />
    <button v-on:click="submit">Submit</button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
// import DrawingForm from '@/Drawing/DrawingForm.vue';

export default {
  name: 'DrawingForm',
  data() {
    return {
      method: 'POST',
      height: 10, //TODO to be adjustable
      width: 10,
      pixels: [],
      hasBody: true,
      tempPoints: this.$store.state.point,
      alerts: {}, // Displays success/error messages encountered during form submission

    };
  },
  mounted() {
    this.c = document.getElementById("myCanvas");
    this.canvas = this.c.getContext('2d');
    this.NUMBER_OF_POINTS = 10;
    this.CANVAS_SIZE = 360;
    this.BOX_SIZE = this.CANVAS_SIZE / this.NUMBER_OF_POINTS;
    this.drawGreyLines(this.c);
    this.pixels = [];
    this.$store.commit('refreshPoint');
    this.tempPoints = this.$store.state.point;
    this.$store.commit('refreshDrawings'); 
  },
  methods: {
    // submit: function (e){
    //   this.onSubmit();
    // },
    async submit() {
      if (this.pixels.length != 0)
      {
      this.$store.commit('updatePoint', this.tempPoints - this.$store.state.point); //TODO
      this.$store.commit('refreshPoint');
      
      const url = `/api/drawings`;
      if (this.method == 'POST')
      {
        await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            pixels: this.pixels,
            height: this.height,
            width: this.width
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }})
          .then(async r => r.json());
      }
      
          const r = await fetch('/api/drawings', {
            method: 'GET',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            }});
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          } 
          console.log('inside drawing submit', res)
          this.$store.commit('updateDrawings', res);
          this.$store.commit('refreshDrawings'); 
      this.pixels = [];
      this.canvas.clearRect(0, 0, this.c.width, this.c.height);
      this.drawGreyLines(this.c);
    }
    else{
        const e = 'Cannot submit a drawing with no pixels colored in';
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 800);
      }
    console.log('REFRESH SHOULD REACH HERE');
    this.$store.commit('refreshDrawings');
    },
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
    async drawDot(e) {
      
      // this.$store.commit('updatePoint', 30);
      this.$store.commit('refreshPoint');
      this.x = this.getCoord(e.offsetX, this.BOX_SIZE);
      this.y = this.getCoord(e.offsetY, this.BOX_SIZE);
      this.isDrawing = true;
      const context = this.canvas;
      // save original context settings before we translate and change colors
      context.save();
      
      // // get row, column
      const row = Math.round((this.y - this.BOX_SIZE/2)/this.BOX_SIZE); // 0-indexed
      const col = Math.round((this.x - this.BOX_SIZE/2)/this.BOX_SIZE); // 0-indexed
      const i = row*10 + col
      const delta = this.pixels.includes(i)? 1: -1
      
      if (this.pixels.includes(i)){
        this.tempPoints += 1;
        this.pixels.splice(this.pixels.indexOf(i), 1);
        context.fillStyle = `rgba(232, 246, 232)`;
        // context.strokeStyle = 'grey';
        context.lineWidth = 2;
        context.moveTo(this.x, this.y);
        // context.strokeRect(this.x-this.BOX_SIZE/2,this.y-this.BOX_SIZE/2, this.BOX_SIZE, this.BOX_SIZE);
        context.fillRect(this.x-this.BOX_SIZE/2+1,this.y-this.BOX_SIZE/2+1, this.BOX_SIZE-2, this.BOX_SIZE-2);
        context.fillStyle = 'black';
      }
      else if (this.tempPoints + delta >= 0){
        this.tempPoints -= 1;
        this.pixels.push(i);
        // context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.moveTo(this.x, this.y);
        // context.strokeRect(this.x-this.BOX_SIZE/2,this.y-this.BOX_SIZE/2, this.BOX_SIZE, this.BOX_SIZE);
        context.fillRect(this.x-this.BOX_SIZE/2+1,this.y-this.BOX_SIZE/2+1, this.BOX_SIZE-2, this.BOX_SIZE-2);
      }
      else {
        e = 'Not Enough Points';
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 800);
      }
        
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

