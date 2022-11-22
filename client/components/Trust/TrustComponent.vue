<!-- Reusable component representing a single post and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="trust"
  >
    <header>
      <!-- Header and features (endorse, for example)-->
      <h3 class="author">
        @{{ trust.trustReceiver }}
      </h3>
      <!-- If the user signs in, they get to see this-->
      <div
        v-if="$store.state.username === trust.trustGiver"
        class="actions"
      >
        <button @click="deleteTrust">
          ❌ Remove trust
        </button>
      </div>
      <!-- If the user signs in, they get to see above-->
    </header>
    <!-- Content starts here, if editing, else show content -->
    <!-- Added descriptive post -->
    <p class="info">
      Trusted by you: @{{ trust.trustGiver }}
    </p>
    <!-- End of Added descriptive post -->
    <p class="info">
      Trusted on: {{ trust.dateTrusted }}
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
export default {
  name: 'TrustComponent',
  props: {
    // Data from the stored post
    trust: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // trustReceiver: this.trust.trustReceiver, // Potentially-new content for this post
      alerts: {} // Displays success/error messages encountered during post modification
    };
  },
  methods: {
    async deleteTrust() {
      /**
       * Deletes this trust.
       */
      const options = {
        method: 'DELETE', headers: {'Content-Type': 'application/json'}
      };
      try {
      const r = await fetch(`/api/trust/${this.trust.trustReceiver}`, options);
      if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshTrusts');

        this.$store.commit('alert', {
          message: 'Successfully deleted trust!', status: 'success'
        });
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      } 
    }
}};
</script>

<style scoped>
.trust {
  background-color: #13aa52;
  border: 1px solid #13aa52;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, .1) 0 2px 4px 0;
  box-sizing: border-box;
  color: #fff;
  font-family: "Akzidenz Grotesk BQ Medium", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  font-weight: 400;
  outline: none;
  outline: 0;
  padding: 10px 25px;
}

</style>
