<!-- Default page that also displays posts -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2 class="box">
          Your profile
        </h2>
      </header>
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
          to check out your profile and create art!
        </h3>
      </article>
    </section>

    <section v-if="$store.state.username">
      <header>
        <div class="center">
          <h2>
            3 Friends 
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <h2>
            4 Points 
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <!-- Added post feed channel selection-->

        <!-- End of Added post feed channel selection-->
      </header>
      <header>
        <div>
          <tabs>
            <tab title="Sessions">
              <section
                v-if="$store.state.posts.length && $store.state.username">
                <PostComponent
                  v-for="post in $store.state.posts"
                  v-if="$store.state.username === post.author"
                  :key="post.id"
                  :post="post"
                />
              </section>
              <article
                v-else>
                <h3>No posts found.</h3>
              </article></tab>
            <tab title="Drawings">Fill with drawings</tab>
            <tab title="Friends">Show Friends</tab>
          </tabs>
        </div>
      </header>
    </section>
  </main>
</template>

<script>
// Components
import PostComponent from '@/components/Post/PostComponent.vue';
import GetPostsForm from '@/components/Profile/GetPostsForm.vue';
import Tab from './ProfileTab.vue'
import Tabs from './ProfileTabs.vue'
export default {
  name: 'PostPage',
  components: {PostComponent, GetPostsForm, Tab, Tabs},
  mounted() {
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
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.uniform-button:hover {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.uniform-button:focus {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 4px -6px;
}
</style>
