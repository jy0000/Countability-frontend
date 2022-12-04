<!-- Reusable component representing a single post and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="point"
  >
    <section>
      <!-- Header and features -->
      <!-- If the user signs in, they get to see this -->
      <header>
        <h2 class="box">
          Points
        </h2>
      </header>
      <div
        v-if="$store.state.username"
      >
        <h3 class="button-55">
          Your points: {{ $store.state.point }}
        </h3>
      </div>
      <!-- If the user signs in, they get to see above-->
    </section>
  </article>
</template>

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'PointComponent',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/point',
      method: 'GET',
      hasBody: false,
      refreshPosts: true,
    };
  }
};

</script>

<style scoped>
/* CSS */
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
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  margin-bottom: 20px;
}


</style>
