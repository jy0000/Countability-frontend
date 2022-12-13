<!-- Reusable component representing a single drawing and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="drawing"
  >
    <header>
      <!-- Header and features (endorse, for example)-->
      <h3 class="author">
        @{{ drawing.author }}
      </h3>
      <canvas
        :id="drawing._id"
        width="360"
        height="360"
        @mousedown="drawDot"
      />
      <img
        v-if="!editing"
        :src="drawing.imageURL"
        style="width:10%;height:10%;"
      >
      <!-- If the user signs in, they get to see this-->
      <div
        v-if="$store.state.username === drawing.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <router-link :to="`/draw/${drawing._id}`">
          <button
            v-if="!editing"
            @click="startEditing"
          >
            ✏️ Edit
          </button> 
        </router-link>
        <button @click="deleteDrawing">
          🗑️ Delete
        </button>
      </div>
      <!-- If the user signs in, they get to see above-->
    </header>
    
    <p 
      v-if="(drawing.dateCreated!==drawing.dateModified)"
      class="info"
    >
      Edited on {{ drawing.dateModified }}
    </p> 
    <p 
      v-else
      class="info"
    >
      Drawn on {{ drawing.dateCreated }}
    </p>
    
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import router from '../../router';

export default {
  name: 'DrawingComponent',
  components: 'router',
  props: {
    // Data from the stored drawing
    drawing: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this drawing is in edit mode
      // draft: this.drawing.photo, // Potentially-new photo for this drawing
      tempPoints: this.$store.state.point,
      pixels: Object.assign([], this.drawing.pixels),
      alerts: {} // Displays success/error messages encountered during drawing modification
    };
  },
  mounted() {
    this.$store.commit('refreshDrawings'); 
    this.c = document.getElementById(this.drawing._id);
    this.c.setAttribute("hidden", "hidden");
    this.context = this.c.getContext('2d');
    this.NUMBER_OF_POINTS = 10;
    this.CANVAS_SIZE = 360;
    this.BOX_SIZE = this.CANVAS_SIZE / this.NUMBER_OF_POINTS;
    // var target = new Image();
    // target.src = this.drawing.imageURL;
  },
  methods: {
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
        context.fillStyle = `white`;
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
        console.log('here')
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
    },
    startEditing() {
      /**
       * Enables edit mode on this drawing.
       */
      
      this.c = document.getElementById(this.drawing._id);
      this.context = this.c.getContext('2d');
      this.editing = true; // Keeps track of if a drawing is being edited
      this.drawGreyLines();
      this.drawPixels();
      this.c.removeAttribute("hidden");
      // this.draft = this.drawing.photo; // The photo of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this drawing.
       */
      this.editing = false;
      this.c.setAttribute("hidden", "hidden");
    },
    deleteDrawing() {
      /**
       * Deletes this drawing.
       */
      this.$store.commit("updatePoint", this.drawing.pixels.length);
      this.$store.commit('refreshUserDrawings');
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted drawing!', status: 'success'
          });
        }
      };
      this.request(params);
      this.$store.commit("refreshPoint");
      this.c.setAttribute("hidden", "hidden");
    },
    submitEdit() {
      /**
       * Updates drawing to have the submitted draft photo.
       */
      if (this.drawing.pixels === this.pixels) {
        const error = 'Error: Edited drawing should be different than current drawing.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 1000);
        return;
      }

      // this.$store.commit('updateDrawings', res);
      this.$store.commit('updatePoint', this.tempPoints - this.$store.state.point); //TODO
      // this.$store.commit('refreshPoint');//TODO WHY THIS THROWS ERROR
      this.$store.commit('refreshDrawings'); 
      this.editing = false;
      this.c.setAttribute("hidden", "hidden");
    },
    async request(params) {
      /**
       * Submits a request to the drawing's endpoint
       * @param params - Options for the requxest
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        let r = await fetch(`/api/drawings/${this.drawing._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        // this.editing = false;
        options.method = 'GET';
        options.body = null; // GET request MUST not have body, so muyst clear
        r = await fetch('/api/point/', options); // secondary call, don't change this.url
        const res = await r.json();
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          throw new Error(res.error);
        } else {
          this.$store.commit('setPoint', res.requestResponse.currentPoint); // frontend update 
        }
        this.$store.commit('refreshDrawings');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 1000);
      }
    }
  }
};
</script>

<style scoped>
/* CSS */
.drawing {
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  color: #000;
  box-shadow: rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px;
  padding: 0.25em 0.5em;
  margin-bottom: 5px;
  margin-top: 15px;
  background-color: rgb(199, 193, 193, 0.35)
}

canvas {
  border: 1px solid grey;
}

</style>

