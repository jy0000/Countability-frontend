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
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteDrawing">
          🗑️ Delete
        </button>
      </div>
      <!-- If the user signs in, they get to see above-->
    </header>
    <!-- Content starts here, if editing, else show photo -->
    <textarea
      v-if="editing"
      class="photo"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="photo"
    >
      {{ drawing.photo }}
    </p>
    <!-- Added descriptive drawing -->
    <p class="info">
      <i
        v-if="drawing.caption == 'News'"
        class="newsDrawing"
      > Source: {{ drawing.focusReflection }}</i>
      <i
        v-else-if="drawing.caption == 'Fibe'"
        class="fibeDrawing"
      >  @{{ drawing.author }} is feeling {{ drawing.progressReflection }}</i>
    </p>
    <p class="info">
      <b>Drawing type: A {{ drawing.caption }} drawing.</b>
    </p>
    <!-- End of Added descriptive drawing -->
    <p class="info">
      Drawinged at {{ drawing.dateModified }}
      <i v-if="drawing.edited">(edited)</i>
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
  name: 'DrawingComponent',
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
      draft: this.drawing.photo, // Potentially-new photo for this drawing
      alerts: {} // Displays success/error messages encountered during drawing modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this drawing.
       */
      this.editing = true; // Keeps track of if a drawing is being edited
      this.draft = this.drawing.photo; // The photo of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this drawing.
       */
      this.editing = false;
      this.draft = this.drawing.photo;
    },
    deleteDrawing() {
      /**
       * Deletes this drawing.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted drawing!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates drawing to have the submitted draft photo.
       */
      if (this.drawing.photo === this.draft) {
        const error = 'Error: Edited drawing photo should be different than current drawing photo.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited drawing!',
        body: JSON.stringify({photo: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
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

        this.editing = false;
        options.method = 'GET';
        options.body = null; // GET request MUST not have body, so muyst clear
        r = await fetch('/api/point/', options); // secondary call, don't change this.url
        const res = await r.json();
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          throw new Error(res.error);
        } else {
          console.log(res, res.requestResponse.currentPoint)
          this.$store.commit('setPoint', res.requestResponse.currentPoint); // frontend update 
        }
        this.$store.commit('refreshDrawings');

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

.newsDrawing{
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

.fibeDrawing{
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
