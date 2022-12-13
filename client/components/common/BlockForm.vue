<!-- Blockform -->
<template>
  <form
    class="input-form-box"
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
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else-if="field.id === 'postType'"
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
      url: '',
      method: 'GET', // Default method
      hasBody: false, // Default GET has no body

      setUsername: false,
      setPoint: false,
      refreshPoint: false,
      refreshFriend: false,
      refreshPosts: false, // Whether or not stored posts should be updated after form submission

      refreshOutFriendRequest: false,
      refreshInFriendRequest: false,
      refreshFriends: false,
      
      alerts: {}, // No change needed
      callback: null // No change needed
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
          this.fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        // Any post request lands here
        console.log('post req', this.url, options);
        const r = await fetch(this.url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        // USER
        // Refresh stale state at setUsername (new login session)
        if (this.setUsername) {
          console.log('1')
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          if (res.user) {
            this.$store.commit('refreshOutFriendRequest');
            this.$store.commit('refreshInFriendRequest');
            this.$store.commit('refreshFriends');
            this.$store.commit('refreshPoint');
          }
        }

        if (this.setPoint) {
          console.log('2')
          options.method = 'GET';
          options.body = null; // GET request should not have body
          const r = await fetch('/api/point', options);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          } else {
            this.$store.commit('setPoint', res.requestResponse.currentPoint); // frontend update 
          }
        }
        if (this.refreshPoint) {
          this.$store.commit('refreshPoint'); // frontend update 
        }
  
        // FRIENDS AND FRIEND REQUESTS
        // (Done) Update OUT friend requests shown on screen by GET
        if (this.refreshOutFriendRequest) {
          this.$store.commit('refreshOutFriendRequest');
        }

        // (Done) Update IN friend requests shown on screen by GET
        if (this.refreshInFriendRequest) {
          this.$store.commit('refreshInFriendRequest');
        }

        // (Done) Update currently displayed friend list
        if (this.refreshFriends) {
          this.$store.commit('refreshFriends');
        }

        if (this.refreshPosts) {
          options.method = 'GET';
          options.body = null;
          const r = await fetch('/api/point/', options);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          } else {
            this.$store.commit('setPoint', res.requestResponse.currentPoint); // frontend update 
          }
          this.$store.commit('refreshPosts'); // frontend update
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 1000);
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
.input-form-box {
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
  font-size: 20px;

  border: 0;
  background-color: rgb(199, 193, 193, 0.45);
  width: 90%;
}
</style>
