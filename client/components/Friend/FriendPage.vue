<!-- Default page that also displays posts -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2 class="box">
          Make friends, @{{ $store.state.username }}
        </h2>
      </header>
      <div>
        <h3>
          Enter the name of the user you want to befriend.
        </h3>  <small class="left-small">
          Friend requests will periodically refresh (5 seconds)
        </small>
      </div>

    
      <CreateFriendRequestForm />
    </section>

    <section v-else>
      <header>
        <h2 class="box">
          Welcome to Countability!
        </h2>
      </header>
      <article>
        <h3>
          <router-link
            to="/login"
            class="uniform-button"
          >
            Sign in
          </router-link>
          to add or remove friend.
        </h3>
      </article>
    </section>

    <section v-if="$store.state.username">
      <article>
        <h2 class="box">
          Outgoing friend requests
        </h2>
        <section
          v-if="($store.state.outgoingFriendRequests.length && $store.state.outgoingFriendRequests.map(friend => friend.friendRequestSenderName).includes($store.state.username))"
        >
          <FriendRequestOut
            v-for="friend in $store.state.outgoingFriendRequests"
            ref="FriendRequestOut"
            :key="friend.id"
            :friend="friend"
          />
        </section>
        <article
          v-else
        >
          <h3>No outgoing friend request.</h3>
        </article>
      </article>

      <article>
        <h2 class="box">
          Incoming friend requests
        </h2>
        <section
          v-if="($store.state.incomingFriendRequests.length && $store.state.incomingFriendRequests.map(friend => friend.friendRequestReceiverName).includes($store.state.username))"
        >
          <FriendRequestIn
            v-for="friend in $store.state.incomingFriendRequests"
            :key="friend.id"
            :friend="friend"
          />
        </section>
        <article
          v-else
        >
          <h3>No incoming friend request.</h3>
        </article>
      </article>

      <article>
        <h2 class="box">
          Your friend list
        </h2>
      </article>
      <section
        v-if="$store.state.friends && ($store.state.friends.map(friend => friend.userOne).includes($store.state.username) || $store.state.friends.map(friend => friend.userTwo).includes($store.state.username))"
      >
        <FriendsComponent
          v-for="friend in $store.state.friends"
          :key="friend.id"
          :friend="friend"
        />
      </section>
      <article
        v-else
      >
        <h3>No friend found yet, make friends! </h3>
      </article>
    </section>
  </main>
</template>

<script>

// NOTE: Friend page set up has 1) create friendship, 2) friend request outgoing, 2) incoming friend request
import FriendsComponent from '@/components/Friend/FriendsComponent.vue';
import CreateFriendRequestForm from '@/components/Friend/CreateFriendRequestForm.vue';
import FriendRequestIn from  '@/components/Friend/FriendRequestIn.vue';
import FriendRequestOut from  '@/components/Friend/FriendRequestOut.vue';

export default {
  name: 'FriendPage',
  components: {FriendsComponent, CreateFriendRequestForm, FriendRequestIn, FriendRequestOut},
  mounted() {
    const func = () => {this.$store.commit('refreshOutFriendRequest'); this.$store.commit('refreshInFriendRequest'); this.$store.commit('refreshFriends'); setTimeout(func, 5000)};
    setTimeout(func, 5000);
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.box {
  background-color: #c2fbd7;
  border-radius: 5px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  border: 0;
  font-size: 30px;
  margin-bottom: 10px;
}

.uniform-button {
  align-self: center;
  background-color: #fff;
  background-position: 0 90%;
  background-repeat: repeat no-repeat;
  background-size: 4px 3px;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, .2) 15px 28px 25px -18px;
  box-sizing: border-box;
  color: #41403e;
  cursor: pointer;
  display: inline-block;
  font-family: Neucha, sans-serif;
  font-size: 1.5rem;
  line-height: 23px;
  outline: none;
  padding: .75rem;
  text-decoration: none;
  transition: all 235ms ease-in-out;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
}

.uniform-button:hover {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.uniform-button:focus {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 4px -6px;
}
</style>
