<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';

export default {
  name: 'App',
  components: {NavBar},
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUsername', user ? user.username : null);
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  zoom: 100%;
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  font-family: Neucha, sans-serif;
  background-color: rgb(232, 246, 232);
}

main {
  padding: 0 5em 5em;
}

.alerts {
    position: fixed;
    font-size: 1.2em;
    z-index: 99;
    left: 50%;
    top: 0;
    /* bottom: 0; */
    transform: translate(-50%, 0%);
    width: 30%;
    text-align: center;
} */

.alerts article {
    border-radius: 5px;
    padding: 20px 20px;
    color: #fff;
}

.alerts p {
    margin: 0;
}

.alerts .error {
  color: #fff;
  background-color: rgb(166, 23, 33);
  padding: 20px 20px;
}

.alerts .success {
  color: #fff;
  background-color: rgb(45, 135, 87);
  padding: 20px 20px;
}

h3 {
  color: #41403e;
}

h2 {
  color: #41403e;
}

h1 {
  color: #41403e;
}
</style>
