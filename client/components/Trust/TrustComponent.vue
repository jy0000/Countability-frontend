<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="trust"
  >
    <header>
      <!-- Header and features (endorse, for example)-->
      <h3 class="author">
        @{{ trust.trustGiverId.username }}
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
    <!-- Added descriptive freet -->
    <p class="info">
      Trusted user: {{ trust.trustReceiverId.username }}
    </p>
    <!-- End of Added descriptive freet -->
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
    // Data from the stored freet
    trust: {
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
    deleteTrust() {
      /**
       * Deletes this trust.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(`/api/trust/${this.trust._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshTrust');

        params.callback();
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
