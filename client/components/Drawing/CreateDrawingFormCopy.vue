<!-- This is just an example; feel free to define any reusable components you want! -->

<script>

export default {
  name: 'DrawingForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      height: 10,
      weight: 10,
      points: [],
      setUsername: false, // Whether or not stored username should be updated after form submission
      setPoint: false,
      refreshFriend: false,
      refreshDrawings: true,
      refreshPosts: false, // Whether or not stored posts should be updated after form submission
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
