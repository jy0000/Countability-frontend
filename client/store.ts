import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown posts by (null = show all)
    trustFilter: 'Users you trust', // Condition to filter shown trusts by
    posts: [], // All posts created in the app
    trusts: [], // All trusts created in the app
    username: null, // Username of the logged in user
    point: 0, // Point of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setPoint(state, point) {
      /**
       * Update the stored point to the specified one.
       * @param username - new point to set
       */
      state.point = point;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.filter = filter;
    },
    updateTrustFilter(state, filter) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.trustFilter = filter;
    },
    updatePosts(state, posts) {
      /**
       * Update the stored posts to the provided posts.
       * @param posts - Posts to store
       */
      state.posts = posts;
    },
    // updateTrusts(state, trusts) {
    //   /**
    //    * Update the stored trusts to the provided posts.
    //    * @param posts - Posts to store
    //    */
    //   state.trusts = trusts;
    // },
    /** Added this point */
    updatePoint(state, point) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.point = point;
    },
    /** End of Added this point (frontend, call after made post request)*/
    async refreshPosts(state) {
      /**
       * Request the server for the currently available posts.
       */
      if (state.filter === 'News' || state.filter === 'Fibe') {
        const feedChannelURL = `/api/feedChannel?postType=${state.filter}`;
        const res = await fetch(feedChannelURL).then(async r => r.json());
        state.posts = res;
      } else {
        const url = state.filter ? `/api/users/${state.filter}/posts` : '/api/posts';
        const res = await fetch(url).then(async r => r.json());
        state.posts = res;
      }
    },
    async refreshTrusts(state) {
      /**
       * Request the server for the currently available trusts.
       */
      const url = state.trustFilter ? `/api/trust?view=${state.trustFilter}` : '/api/trust?view=Users you trust';
      const res = await fetch(url).then(async r => r.json());
      console.log('present', res, res.trustedUsers);
      state.trusts = res.trustedUsers;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
