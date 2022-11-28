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
    friendFilter: 'Users you friend', // Condition to filter shown friends by
    posts: [], // All posts created in the app
    sessions: [], // All sessions created in the app
    friends: [], // All friends created in the app
    username: null, // Username of the logged in user
    point: 0, // Point of the logged in user
    drawings: [],
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
    updateFriendFilter(state, filter) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.friendFilter = filter;
    },
    updatePosts(state, posts) {
      /**
       * Update the stored posts to the provided posts.
       * @param posts - Posts to store
       */
      state.posts = posts;
    },
    updateDrawings(state, drawings) {//TODO Where use??
      /**
       * Update the stored drawings to the provided drawings.
       * @param drawings - Posts to store
       */
      state.drawings = drawings;
    },
    updateSessions(state, sessions) {
      /**
       * Update the stored sessions to the provided sessions.
       * @param sessions - Sessions to store
       */
      state.sessions = sessions;
    },
    // updateFriends(state, friends) {
    //   /**
    //    * Update the stored friends to the provided posts.
    //    * @param posts - Posts to store
    //    */
    //   state.friends = friends;
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
    async refreshFriends(state) {
      /**
       * Request the server for the currently available friends.
       */
      const url = state.friendFilter ? `/api/friend?view=${state.friendFilter}` : '/api/friend?view=Users you friend';
      const res = await fetch(url).then(async r => r.json());
      console.log('present', res, res.friendedUsers);
      state.friends = res.friendedUsers;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
