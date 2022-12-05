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
  el: '#app',
  data() {
    return {
      // x: 0,
      // y: 0,
      // isDrawing: false,
      // canvas: null
      method: 'POST',
      height: 10, //TODO to be adjustable
      width: 10,
      pixels: [],
      hasBody: true,
      tempPoints: this.$store.state.point,
      alerts: {}, // Displays success/error messages encountered during form submission
      // url: '/api/drawings',
      // method: 'POST',
      // hasBody: true,
      // fields: [
      //   // {id: 'content', label: 'Content', value: ''},
      //   // {id: 'postType', label: 'Which type of post are you making?', value:'', placeholder: "Enter 'News' or 'Fibe' for News or Fibe post"},
      //   // {id: 'sourceLink', label: "Enter a news source", value: ''},
      //   // {id: 'emoji', label: "Enter an emoji (any one-word descriptive term you want, for now)", value: ''}
      //   {id: 'photo', label: 'Photo', value: ''},
      //   {id: 'caption', label: 'Post Caption', value:'', placeholder: ""},
      //   {id: 'focusReflection', label: "How focused were you?", value: ''},
      //   {id: 'progressReflection', label: "How much progress did you make", value: ''}
      // ],
      // title: 'Create a drawing',
      // refreshDrawings: true,
      // callback: () => {
      //   const message = 'Successfully created a post!';
      //   this.$set(this.alerts, message, 'success');
      //   // Delete this success message after 3 seconds
      //   setTimeout(() => this.$delete(this.alerts, message), 3000);
      // },
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
    this.tempPoints = this.$store.state.point;
  },
  methods: {
    // submit: function (e){
    //   this.onSubmit();
    // },
    async submit() {
      // this.$store.commit('updatePoint', -30); //TODO
      this.$store.commit('refreshPoint');
      this.$store.commit('updatePoint', this.tempPoints - this.$store.state.point); //TODO
      this.$store.commit('refreshPoint');
      
      const url = `/api/drawings`;
      // /:{delta}`
      if (this.method == 'POST')
      {
        const res = await fetch(url, {
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
          console.log('updatePoint', res);
    }

      this.$store.commit('refreshDrawings'); 

      //reset variables
      this.pixels = [];
      
      // this.$store.commit('setPoints', );

      // this.$store.commit('refreshPoint');
      // this.$store.commit('refreshPoint');
      // this.tempPoints = this.$store.state.point;
      // this.$store.commit('refreshPoint');
      // this.tempPoints = this.tempPoints;
      // const c = document.getElementById("myCanvas");
      
      this.canvas.clearRect(0, 0, this.c.width, this.c.height);
      this.drawGreyLines(this.c);
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

      // this.$store.commit('updatePoint', 30); //TODO
      this.x = this.getCoord(e.offsetX, this.BOX_SIZE);
      this.y = this.getCoord(e.offsetY, this.BOX_SIZE);
      this.isDrawing = true;
      const context = this.canvas;
      // save original context settings before we translate and change colors
      context.save();
      
      // // get row, column
      const row = Math.round((this.y - this.BOX_SIZE/2)/this.BOX_SIZE); // 0-indexed
      const col = Math.round((this.x - this.BOX_SIZE/2)/this.BOX_SIZE); // 0-indexed
      // Next Steps: check if already drawn to => make white, then return a point
      //              keep track of what boxes are drawn too, connect with points
      //              store drawing to mongoDB with connection to user
      // this.$store.commit('refreshPoint');
      // this.$store.commit('updatePoint', 1);
      // this.$store.commit('refreshPoint');
      this.$store.commit('refreshPoint');
      console.log('Pixels', this.pixels);
      console.log('Point', this.$store.point);
      console.log('TempPoint', this.tempPoints);

      const i = row*this.width + col
      // try {
      const delta = this.pixels.includes(i)? 1: -1
      console.log(this.$store.point, delta)
      // this.$store.commit('updatePoint', this.$store.point, delta); 
      // this.$store.commit('refreshPoint');
      
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
        

      // } catch (e) {
      //   this.$set(this.alerts, e, 'error');
      //   setTimeout(() => this.$delete(this.alerts, e), 3000);
      // }
        
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

