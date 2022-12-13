<!-- Reusable component representing a single post and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="post" 
  >
    <header>
      <!-- Header and features (endorse, for example)-->
      <h3 class="author">
        @{{ post.author }}
      </h3>
      <h3 class="sessionTitle">
        Session: {{ post.caption }}
      </h3>
      <li
        v-for="photo in post.photo"
      >
        <img
          v-if="photo != 'blank'"
          id="base64image"
          class="photo"
          :src="photo"
          width="200"
          height="200"
        >
        <h3
          v-else
        >
          No picture was taken in this work session
        </h3>
      </li>
      <h3 class="reflection">
        Reflection: {{ post.progressReflection }} 
        <br>
        Focus: {{ post.focusReflection }}
      </h3>
      <!-- If the user signs in, they get to see this-->
      <div
        v-if="$store.state.username === post.author"
        class="actions"
      >
        <button @click="deletePost">
          🗑️ Delete
        </button>
      </div>
      <!-- If the user signs in, they get to see above-->
    </header>
    <!-- End of Added descriptive post -->
    <p class="info">
      Posted on {{ post.dateModified }}
      <!-- <i v-if="post.edited">(edited)</i> -->
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
  name: 'PostComponent',
  props: {
    // Data from the stored post
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this post is in edit mode
      draft: this.post.photo, // Potentially-new photo for this post
      alerts: {} // Displays success/error messages encountered during post modification
    };
  },
  methods: {
    // startEditing() {
    //   /**
    //    * Enables edit mode on this post.
    //    */
    //   this.editing = true; // Keeps track of if a post is being edited
    //   this.draft = this.post.photo; // The photo of our current "draft" while being edited
    // },
    // stopEditing() {
    //   /**
    //    * Disables edit mode on this post.
    //    */
    //   this.editing = false;
    //   this.draft = this.post.photo;
    // },
    deletePost() {
      /**
       * Deletes this post.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted post!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    // submitEdit() {
    //   /**
    //    * Updates post to have the submitted draft photo.
    //    */
    //   if (this.post.photo === this.draft) {
    //     const error = 'Error: Edited post photo should be different than current post photo.';
    //     this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
    //     setTimeout(() => this.$delete(this.alerts, error), 1000);
    //     return;
    //   }

    //   const params = {
    //     method: 'PATCH',
    //     message: 'Successfully edited post!',
    //     body: JSON.stringify({photo: this.draft}),
    //     callback: () => {
    //       this.$set(this.alerts, params.message, 'success');
    //       setTimeout(() => this.$delete(this.alerts, params.message), 1000);
    //     }
    //   };
    //   this.request(params);
    // },
    async request(params) {
      /**
       * Submits a request to the post's endpoint
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
        let r = await fetch(`/api/posts/${this.post._id}`, options);
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
        this.$store.commit('refreshPosts');

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
.post {
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

.sessionTitle{
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  color: #000;
  cursor: pointer;
  background-color: #ddf1ae;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  padding: 0.25em 0.5em;
  margin-bottom: 15px;
}

.reflection{
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  color: #000;
  cursor: pointer;
  background-color:  #f1fff1;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  padding: 0.25em 0.5em;
  margin-bottom: 15px;
}

</style>
