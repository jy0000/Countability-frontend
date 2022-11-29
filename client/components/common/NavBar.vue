<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->
<template>
  <nav>
    <div class="left">
      <img src="../../public/stopwatch.png"> <!--Logo credit: https://emojiterra.com/beaver/ -->
      
      
      <router-link to="/">
        <span class="title">
        countAbility
        </span>
      </router-link>
    </div>
    <div class="right">
      <router-link 
        v-if="$store.state.username"
        to="/session"> <!-- TODO session-->
        <span class="subbar">
          Session
        </span>
      </router-link>
      <router-link 
        v-if="$store.state.username"
        to="/draw"> <!-- TODO link-->
        <span class="subbar">
          Draw!
        </span>
      </router-link>
      <router-link 
        v-if="$store.state.username"
        to="/friend"> <!-- TODO link-->
        <span class="subbar">
          Friend
        </span>
      </router-link>
      <router-link 
        v-if="$store.state.username"
        to="/profile"> <!-- TODO link-->
        <span class="subbar">
          Profile
        </span>
      </router-link>
      <button
        class="button-55"
      >
        <router-link
          v-if="$store.state.username"
          to="/account"
        >
          Account
        </router-link>
        <router-link
          v-else
          to="/login"
        >
          Login
        </router-link>
      </button>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    padding: 1vw 2vw;

    background-image: radial-gradient(100% 100% at 100% 0, #00c8ff 0, #288352 100%);
    border: 0;
    box-shadow: rgba(45, 35, 66, .4) 0 2px 4px,rgba(45, 35, 66, .3) 0 7px 13px -3px,rgba(58, 65, 111, .5) 0 -3px 0 inset;
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

a { text-decoration: none; }
a:visited { color: #6c6a6a; }
/*
a:visited {color:#eceef6;}  Visited link   
a:hover {color:#5564b9;}    Mouse over link 
*/

.title {
    color:#ffffff;
    font-size: 40px;
    margin: 0 20px;
    font: Akshar;
    font-weight: 400;
}

img {
    height: 75px;
}

.left {
	display: flex;
	align-items: center;
  margin: 0 20px;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
/* CSS 
Code reference: https://getcssscan.com/css-buttons-examples
*/
.button-55 {
  align-self: center;
  background-color: #fff;
  background-image: none;
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
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}
.subbar {
  align-self: center;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-family: Neucha, sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 23px;
  padding: .75rem;
  text-shadow: 0px 1.5px #c0c0c0;
}

.button-55:hover {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.button-55:focus {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 4px -6px;
}

</style>
