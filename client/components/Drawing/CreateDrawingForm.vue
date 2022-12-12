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
      width="350"
      height="350"
      @mousedown="drawDot"
    />
    <button @click="submit">
      Submit
    </button>
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

// import { callbackify } from 'util';

export default {
  name: 'DrawingForm',
  data() {
    return {
      method: 'POST',
      height: 10, //TODO to be adjustable
      width: 10,
      tempPoints: this.$store.state.point,
      pixels: [],
      hasBody: true,
      callback:null,
      // callback: () => {
      //   const message = 'Successfully created a post!';
      //   this.$set(this.alerts, message, 'success');
      //   // Delete this success message after 3 seconds
      //   setTimeout(() => this.$delete(this.alerts, message), 3000);
      // },
      alerts: {}, // Displays success/error messages encountered during form submission
    };
  },
  // watch:{
  //   '$route'(to, from): {
  //     if(to !== from ) {
  //       this.$forceUpdate();
  //     }
  //   }
  // }
  async mounted() {
    this.c = document.getElementById("myCanvas");
    this.context = this.c.getContext('2d');
    this.NUMBER_OF_POINTS = 10;
    this.CANVAS_SIZE = 350;
    this.BOX_SIZE = this.CANVAS_SIZE / this.NUMBER_OF_POINTS;
    this.drawGreyLines(this.c);
    this.pixels = (this.$route.params.drawingId)? (await fetch(`/api/drawings/${this.$route.params.drawingId}?author=${this.$store.state.username}`, {
       method: 'GET',
       headers: {
         'Content-type': 'application/json; charset=UTF-8',
       }}).then(async r => r.json())).pixels: [];
    this.$store.commit('refreshPoint');
    // this.tempPoints = this.$store.state.point;
    this.$store.commit('refreshDrawings'); 
    // if (this.$route.params.drawingId){
    //   const url = `/api/drawings/${this.$route.params.drawingId}?author=${this.$store.state.username}`;
    //   const res = await fetch(url, {
    //    method: 'GET',
    //    headers: {
    //      'Content-type': 'application/json; charset=UTF-8',
    //    }}).then(async r => r.json());
    //    console.log("RES", res);
    //   this.pixels = res.pixels;
    this.drawPixels();
    // }
  },
  methods: {
    // submit: function (e){
    //   this.onSubmit();
    // },
    drawPixels() {
      for (const i of this.pixels) {
        const context = this.context;
        context.save();
        const r = Math.floor(i/this.NUMBER_OF_POINTS);
        const c = i - this.NUMBER_OF_POINTS*r;
        const x = c*this.BOX_SIZE + this.BOX_SIZE/2
        const y = r*this.BOX_SIZE + this.BOX_SIZE/2
        context.lineWidth = 2;
        context.moveTo(x, y);
        // context.strokeRect(this.x-this.BOX_SIZE/2,this.y-this.BOX_SIZE/2, this.BOX_SIZE, this.BOX_SIZE);
        context.fillRect(x-this.BOX_SIZE/2+1,y-this.BOX_SIZE/2+1, this.BOX_SIZE-2, this.BOX_SIZE-2);
        context.save();
      }
    },
    async submit() {
      if (this.pixels.length != 0)
      {
      this.$store.commit('updatePoint', this.tempPoints - this.$store.state.point); //TODO
      this.$store.commit('refreshPoint');
      
      const url = `/api/drawings`;
      if (this.$route.params.drawingId){
        await fetch(url+`/${this.$route.params.drawingId}`, {
            method: 'PATCH',
            body: JSON.stringify({
              pixels: this.pixels,
              imageURL: this.c.toDataURL(),
              height: this.height,
              width: this.width
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            }})
            .then(async r => r.json());
      }
      else{
        if (this.method == 'POST')
        {
          await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              pixels: this.pixels,
              imageURL: this.c.toDataURL(),
              height: this.height,
              width: this.width
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            }})
            .then(async r => r.json());
        }
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
      
      this.context.clearRect(0, 0, this.c.width, this.c.height);
      this.drawGreyLines(this.c);
      // if (this.callback)
      // {
      //   this.callback();
      // }
      // const message = 'Successfully created a post!';
      // this.$set(this.alerts, message, 'success');
      // // Delete this success message after 3 seconds
      // setTimeout(() => this.$delete(this.alerts, message), 3000);
    }
    else{
        const e = 'Cannot submit a drawing with no pixels colored in';
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 800);
      }
    },
    drawGreyLines() {
      const context = this.context;
      context.fillStyle = "white";
      context.fillRect(0, 0, this.c.width, this.c.height);
      context.fillStyle = 'black';
      for (let r = 0.5; r < this.NUMBER_OF_POINTS; r++) { // draw grey lines
          for (let c = 0.5; c < this.NUMBER_OF_POINTS; c++) {
              context.save();
              context.translate(this.BOX_SIZE * c, this.BOX_SIZE * r);
              context.strokeStyle = 'grey';
              context.lineWidth = 1;
              context.strokeRect(-this.BOX_SIZE/2, -this.BOX_SIZE/2, this.BOX_SIZE, this.BOX_SIZE);
              context.restore();
          }
      }
      context.strokeRect(0, 0, this.c.width, this.c.height);
    },
    async drawDot(e) {
      // this.$store.commit('updatePoint', 30);
      this.$store.commit('refreshPoint');
      this.x = this.getCoord(e.offsetX);
      this.y = this.getCoord(e.offsetY);
      this.isDrawing = true;
      const context = this.context;
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
        context.fillStyle = 'white';
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
        context.strokeStyle = 'black';
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
    getCoord(coordinate) {
      const points = [];
      for (let i = 0.5; i < this.NUMBER_OF_POINTS; i++) {
          points.push(this.BOX_SIZE * i);
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

