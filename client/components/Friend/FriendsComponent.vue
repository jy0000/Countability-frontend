<template>
  <article class="friend">
    <header>
      <!-- If the user signs in, they get to see this-->
      <h3 class="friend-font">
        Friendship between @{{ friend.userOne }} and @{{ friend.userTwo }}
      </h3>
      <div
        v-if="$store.state.username"
        class="actions"
      >
        <button @click="deleteFriend">
          ❌ Remove friend
        </button>
      </div>
      <!-- If the user signs in, they get to see above-->
    </header>
    <!-- Content starts here, if editing, else show content -->
    <p class="info">
      Your friend since: {{ friend.dateCreated }}
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
  name: 'FriendsComponent',
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
      const r = await fetch(`/api/friendship/${this.friend._id}`, options);
      if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        console.log('Call refreshFriend from friends component');
        this.$store.commit('refreshFriends');

        this.$store.commit('alert', {
          message: 'Successfully deleted friend!', status: 'success'
        });
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 1000);
      } 
    }
}};
</script>

<style scoped>
.friend-font {
  color: #fff;
}
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
