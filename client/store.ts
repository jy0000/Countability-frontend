import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components
 * 
 * States:
 *  filter
 *  posts
 *  workSessions
 *  outgoingFriendRequests
 *  incomingFriendRequests
 *  friends
 *  username
 *  point
 *  alerts
 */
const store = new Vuex.Store({
  state: {
    filter: null,
    posts: [], // Frontend: (PostComponent -> PostPage) 
    inSession: false, // if user is in a session

    // Work session
    workSessions: [], // Frontend: (SessionComponent -> SessionPage)
    currentSession: null,

    // Friend and friend requests
    outgoingFriendRequests: [], // Frontend: (FriendRequestOutComponent -> FriendPage)
    incomingFriendRequests: [], // Frontend: (FriendRequestInComponent -> FriendPage)
    friends: [],             // Frontend: (FriendsComponent -> FriendPage)

    // User and user session (not work session, this is cookie!)
    username: null,
    point: 0,
    alerts: {},
    drawings: [],
    userDrawings: [],
  },
  mutations: {
    /** SET (for refresh persist @blockform) */
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 1000);
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
    setInSession(state, inSession) {
      state.inSession = inSession;
    },
    setSession(state, session) {
      state.currentSession = session;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.filter = filter;
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
    updateSessions(state, workSessions) {
      /**
       * Update the stored workSessions to the provided workSessions.
       * @param workSessions - workSessions to store
       */
      state.workSessions = workSessions;
    },
    async updatePoint(state, delta) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.point = state.point + delta
      const url = `/api/point`;
      const res = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({
          delta: delta
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          // 'Accept': 'application/json'
        }})
        .then(async r => r.json());
      state.point = res.requestResponse.point;
    },
    async refreshPoint(state) {
      /**
       * Update the points
       * @param filter - Username of the user to fitler posts by
       */
       const url = '/api/point';
       const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }}).then(async r => r.json());
       state.point = res.requestResponse.point;
    },

    /** REFRESH **/
    async refreshPosts(state) {
      /**
       * Request the server for the currently available posts.
       */
      const url = state.filter ? `/api/users/${state.filter}/posts` : '/api/posts';
      const res = await fetch(url).then(async r => r.json());
      state.posts = res;
    },
    // Friend and friend requests
    async refreshOutFriendRequest(state) {
      /**
       * Get all currently outgoing friend requests.
       */
      const url = `/api/friendRequest?requestDirection=Out`;
      const res = await fetch(url).then(async r => r.json());
      state.outgoingFriendRequests = res.requests;
    },
    async refreshInFriendRequest(state) {
      /**
       * Get all currently incoming friend requests.
       */
      const url = `/api/friendRequest?requestDirection=In`;
      const res = await fetch(url).then(async r => r.json());
      state.incomingFriendRequests = res.requests;
    },
    /** End of Added this point (frontend, call after made post request)*/ //TODO only refresh drawings of session user
    async refreshDrawings(state) {
      /**
       * Request the server for the currently available posts.
       */
      const url = '/api/drawings';
      const res = await fetch(url, {
       method: 'GET',
       headers: {
         'Content-type': 'application/json; charset=UTF-8',
       }}).then(async r => r.json());
      // console.log('refresh drawings', res);
      state.drawings = res;
    },
    /** End of Added this point (frontend, call after made post request)*/ //TODO only refresh drawings of session user
    async refreshUserDrawings(state) {
      /**
       * Request the server for the currently available posts.
       */
      const url = `/api/drawings?author=${state.username}`;
      const res = await fetch(url, {
       method: 'GET',
       headers: {
         'Content-type': 'application/json; charset=UTF-8',
       }}).then(async r => r.json());
      // console.log('refresh drawings', res);
      state.userDrawings = res;
    },
    async refreshFriends(state) {
      /**
       * Get all currently made friends (users in a friendship with the current user)
       */
      console.log('can I see store? YES')
      const url = `/api/friendship`;
      const res = await fetch(url).then(async r => r.json());
      state.friends = res.friendships; // From router response
    },
    async refreshInSession(state) {
      const url = `/api/sessions/${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      for (let i = 0; i < res.length; i++) {
        if (!res[i].endDate) {
          state.inSession = true;
          return;
        }
      }
      state.inSession = false;
    },
    async refreshSession(state) {
      const url = `/api/sessions/${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      for (let i = 0; i < res.length; i++) {
        if (!res[i].endDate) {
          state.currentSession = res[i];
          return;
        }
      }
      state.currentSession = null;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
