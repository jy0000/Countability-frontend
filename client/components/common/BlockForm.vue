<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
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
          v-else-if="field.id === 'freetType'"
          :name="field.id"
          :value="field.value"
          :placeholder="field.placeholder"
          @input="field.value = $event.target.value"
        >
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
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      setLevel: false,
      refreshTrust: false,
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null // Function to run after successful form submission
    };
  },
  methods: {
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
              console.log('isradio')
              for (const c of field.choices) {
                if (c.isSelected) {
                  console.log('c', c.value, c.isSelected)
                  value = c.value;
                  field.value = '';
                }
              }
            }
            console.log('What', id, value)
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          console.log('here')
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          // Different response totally
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          // if (this.setLevel) {
            // construct a call url
            options.method = 'GET';
            this.$store.commit('setLevel', res.currentLevel);
          // }
        }

        if (this.setLevel) {
          console.log('set level');
          // Also update the level (backend fetch)
          options.method = 'GET';
          options.body = null; // GET request MUST not have body, so muyst clear
          const r = await fetch('/api/level', options); // secondary call, don't change this.url
          const res = await r.json();
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            throw new Error(res.error);
          } else {
            this.$store.commit('setLevel', res.requestResponse.currentLevel); // frontend update 
          }
        }

        if (this.refreshFreets) {
          console.log('refresh');
          // Also update the level (backend fetch)
          options.method = 'GET';
          options.body = null; // GET request MUST not have body, so muyst clear
          const r = await fetch('/api/level/', options); // secondary call, don't change this.url
          const res = await r.json();
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            throw new Error(res.error);
          } else {
            console.log(res, res.requestResponse.currentLevel)
            this.$store.commit('setLevel', res.requestResponse.currentLevel); // frontend update 
          }
          this.$store.commit('refreshFreets'); // frontend update
        }

        if (this.refreshTrust) {
          console.log('trust refresh');
          // Also update the level (backend fetch)
          options.method = 'GET';
          options.query.view
          options.body = null; // GET request MUST not have body, so muyst clear
          const r = await fetch('/api/trust/?view', options); // secondary call, don't change this.url
          const res = await r.json();
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            console.log('HI');
            throw new Error(res.error);
          } else {
            console.log('HI', res, res.requestResponse)
            this.$store.commit('setTrust', res.requestResponse); // frontend update 
          }
          this.$store.commit('refreshTrust'); // frontend update
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
}
</style>
