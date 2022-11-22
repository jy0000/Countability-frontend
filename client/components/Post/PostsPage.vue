<!-- Default page that also displays posts -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2 class="box">
          Welcome @{{ $store.state.username }}
        </h2>
      </header>
      <CreatePostForm />
    </section>
    <section v-else>
      <header>
        <h2 class="box">
          Welcome to Fritter!
        </h2>
      </header>
      <article>
        <h3>
          <router-link
            class="button-sign-in"
            to="/login"
          >
            Sign in
          </router-link>
          to create, edit, and delete posts.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2 class="box">
            📙 My feeds
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <!-- Added post feed channel selection-->
        <div
          class="right"
        >
          <SelectFeedChannel
            ref="selectFeedChannel"
            class="button-55"
            value="postType"
            placeholder="🔍 Type 'News' / 'Fibe' for selected feed channel posts (optional)"
            button="🔄 Get posts"
          />
        </div>
        <!-- End of Added post feed channel selection-->
        <div class="right">
          <GetPostsForm
            ref="getPostsForm"
            class="button-55"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get posts"
          />
        </div>
      </header>
      <section
        v-if="$store.state.posts.length"
      >
        <PostComponent
          v-for="post in $store.state.posts"
          :key="post.id"
          :post="post"
        />
      </section>
      <article
        v-else
      >
        <h3>No posts found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
// Components
import PostComponent from '@/components/Post/PostComponent.vue';
import CreatePostForm from '@/components/Post/CreatePostForm.vue';
import GetPostsForm from '@/components/Post/GetPostsForm.vue';
import SelectFeedChannel from '@/components/FeedChannel/SelectFeedChannel.vue';

export default {
  name: 'PostPage',
  components: {PostComponent, GetPostsForm, CreatePostForm, SelectFeedChannel},
  mounted() {
    // Primitive fix
    if (this.$refs.selectFeedChannel) {
      this.$refs.selectFeedChannel.submit(); // Added this for feed channel filtering
    } else {
      this.$refs.getPostsForm.submit();
    }
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

/** Cross box */
.button-89 {
  --b: 3px;   /* border thickness */
  --s: .45em; /* size of the corner */
  --color: #373B44;
  
  padding: calc(.5em + var(--s)) calc(.9em + var(--s));
  color: var(--color);
  --_p: var(--s);
  background:
    conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--color) 0)
    var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
  transition: .3s linear, color 0s, background-color 0s;
  outline: var(--b) solid #0000;
  outline-offset: .6em;
  font-size: 16px;

  border: 0;
  background-color: rgb(199, 193, 193, 0.45)
}
.button-sign-in {
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
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
}
.button-55 {
  align-self: center;
  background-color: rgb(199, 193, 193, 0.45);
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
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
}
</style>
