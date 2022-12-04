<template>
  <div id="app">
    <h1>Drawing with mousemove event</h1>
    <canvas id="myCanvas" width="360" height="360" @mousedown="drawDot" />
    <form
      class="button-89"
      @submit.prevent="submit"
    >
      <h3>{{ title }}</h3>
      <article
        v-if="fields.length"
      >
        <div
          v-for="field in fields"
          :key="field.id"
        >
          <label :for="field.id">{{ field.label }}:</label>
          <!-- Input type (text box, input) -->
          <textarea
            v-if="field.id === 'content'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value"
          />
          <input
            v-else
            :type="field.id === 'password' ? 'password' : 'text'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value"
          >
        </div>
      </article>
      <article v-else>
        <p>{{ content }}</p>
      </article>
      <button
        type="submit"
      >
        {{ title }}
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
    </form>
  </div>
</template><!-- from https://codepen.io/reiallenramos/pen/MWaEmpw -->



<script lang="ts">
export default {
  el: '#app',
  
  data() {
    return {
    };
  },
  mounted() {
    const c = document.getElementById("myCanvas");
    this.canvas = c.getContext('2d');
    this.NUMBER_OF_POINTS = 10;
    this.CANVAS_SIZE = 360;
    this.BOX_SIZE = this.CANVAS_SIZE / this.NUMBER_OF_POINTS;
    this.drawGreyLines(c);
    this.pixels = [];
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
    // keepDrawing(e) {
    //   if (this.isDrawing === true) {
    //     this.drawDot(e)
    //   }
    // },
    // stopDrawing(e) {
    //   if (this.isDrawing === true) {
    //     this.x = 0;
    //     this.y = 0;
    //     this.isDrawing = false;
    //   }
    // },
    drawDot(e) {
      this.x = this.getCoord(e.offsetX, this.BOX_SIZE);
      this.y = this.getCoord(e.offsetY, this.BOX_SIZE);
      this.isDrawing = true;
      const context = this.canvas;
      // save original context settings before we translate and change colors
      context.save();
      
      // // get row, column
      const r = Math.round((this.y - this.BOX_SIZE/2)/this.BOX_SIZE); // 0-indexed
      const c = Math.round((this.x - this.BOX_SIZE/2)/this.BOX_SIZE); // 0-indexed
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
  },
  async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          // Go over each field, checkbox value is not extracted
          this.fields.map(field => {
            let {id, value} = field;
            // Return which is selected and return that value 
            if (field.type === 'radio') {
              for (const c of field.choices) {
                if (c.isSelected) {
                  value = c.value;
                  field.value = '';
                }
              }
            }
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          // Different response totally
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('refreshFriends');
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('setPoint', 0);
          // }
        }

        if (this.setPoint) {
          // Also update the point (backend fetch)
          options.method = 'GET';
          options.body = null; // GET request MUST not have body, so muyst clear
          const r = await fetch('/api/point', options); // secondary call, don't change this.url
          const res = await r.json();
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            throw new Error(res.error);
          } else {
            this.$store.commit('setPoint', res.requestResponse.currentPoint); // frontend update 
          }
        }

        if (this.refreshPosts) {
          // Also update the point (backend fetch)
          options.method = 'GET';
          options.body = null; // GET request MUST not have body, so muyst clear
          const r = await fetch('/api/point/', options); // secondary call, don't change this.url
          const res = await r.json();
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            throw new Error(res.error);
          } else {
            this.$store.commit('setPoint', res.requestResponse.currentPoint); // frontend update 
          }
          this.$store.commit('refreshPosts'); // frontend update
        }

        if (this.refreshFriend) {
          // Also update the point (backend fetch)
          this.$store.commit('refreshFriends'); // frontend update
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>


<style scoped>
  #myCanvas {
  border: 1px solid grey;
}

form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}

/* CSS */
.button-89 {
  --b: 3px;   /* border thickness */
  --s: .45em; /* size of the corner */
  --color: #373B44;
  
  padding: calc(.5em + var(--s)) calc(.9em + var(--s));
  color: var(--color);
  --_p: var(--s);
  background:
    conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--color) 0)
    var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
  transition: .3s linear, color 0s, background-color 0s;
  outline: var(--b) solid #0000;
  outline-offset: .6em;
  font-size: 16px;

  border: 0;
  background-color: rgb(199, 193, 193, 0.45)
}
</style>