<template>
  <article class="friend">
    <header>
      <!-- If the user signs in, they get to see this-->
      <h3 class="author">
        @{{ $store.state.username }}
      </h3>
      <div
        v-if="$store.state.username === friend.friendGiver"
        class="actions"
      >
        <button @click="deleteFriend">
          ❌ Remove friend
        </button>
      </div>
      <!-- If the user signs in, they get to see above-->
    </header>
    <!-- Content starts here, if editing, else show content -->
    <!-- Added descriptive post -->
    <p class="info">
      Friended by you: @{{ friend.friendGiver }}
    </p>
    <!-- End of Added descriptive post -->
    <p class="info">
      Friended on: {{ friend.dateFriended }}
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
  name: 'FriendListComponent',
  props: {
    // Data from the stored post
    friend: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // friendReceiver: this.friend.friendReceiver, // Potentially-new content for this post
      alerts: {} // Displays success/error messages encountered during post modification
    };
  },
  methods: {
    async deleteFriend() {
      /**
       * Deletes this friend.
       */
      const options = {
        method: 'DELETE', headers: {'Content-Type': 'application/json'}
      };
      try {
      const r = await fetch(`/api/friend/${this.friend.friendReceiver}`, options);
      if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshFriends');

        this.$store.commit('alert', {
          message: 'Successfully deleted friend!', status: 'success'
        });
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      } 
    }
}};
</script>

<style scoped>
.friend {
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
