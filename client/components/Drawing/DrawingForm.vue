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
      refreshPoints: false,
      refreshDrawings: false,
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

        if (this.refreshDrawings) {
          this.$store.commit('refreshDrawings'); // frontend update
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
