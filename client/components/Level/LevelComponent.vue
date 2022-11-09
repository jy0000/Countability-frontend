<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="level"
  >
    <section>
      <!-- Header and features (endorse, for example)-->
      <!-- If the user signs in, they get to see this-->
      <h1>Wtf</h1>
      <div
        v-if="$store.state.username"
      >
        <h3 class="info">
          Your Fritter level: {{ 5 }}
        </h3>
        <p class="info">
          <i
            v-if="5== 1"
          > Source: LEVEL 1</i>
          <i
            v-else-if="5 == 2"
          >  Level 2 </i>
        </p>
      </div>
      <!-- If the user signs in, they get to see above-->
    </section>
  </article>
</template>

<script>
export default {
  name: 'LevelComponent',
  props: {
    // Data from the stored level
    level: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    getLevelAndPriviledge() {
      this.request();
    },

    async request() {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const url = '/api/level';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateLevel', this.value);
        // this.$store.commit('updateFreets', res);
        } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
/* CSS */
.freet {
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  color: #000;
  cursor: pointer;
  box-shadow: rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px;
  padding: 0.25em 0.5em;
  margin-bottom: 15px;
}

.newsFreet{
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  color: #000;
  cursor: pointer;
  background-color: #3c97f8;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  padding: 0.25em 0.5em;
  margin-bottom: 15px;
}

.fibeFreet{
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  color: #000;
  cursor: pointer;
  background-color:  #FFDD00;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  padding: 0.25em 0.5em;
  margin-bottom: 15px;
}

</style>
