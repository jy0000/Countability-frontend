import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    trustFilter: null, // Condition to filter shown trusts by
    freets: [], // All freets created in the app
    trusts: [], // All trusts created in the app
    username: null, // Username of the logged in user
    level: null, // Level of the logged in user
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
    setLevel(state, level) {
      /**
       * Update the stored level to the specified one.
       * @param username - new level to set
       */
      state.level = level;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateTrusts(state, trusts) {
      /**
       * Update the stored trusts to the provided freets.
       * @param freets - Freets to store
       */
      state.trusts = trusts;
    },
    /** Added this level */
    updateLevel(state, level) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.level = level;
    },
    /** End of Added this level (frontend, call after made post request)*/
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      if (state.filter === 'News' || state.filter === 'Fibe') {
        const feedChannelURL = `/api/feedChannel?freetType=${state.filter}`;
        const res = await fetch(feedChannelURL).then(async r => r.json());
        state.freets = res;
      } else {
        const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
        const res = await fetch(url).then(async r => r.json());
        state.freets = res;
      }
    },
    async refreshTrusts(state) {
      /**
       * Request the server for the currently available trusts.
       */
      const feedChannelURL = `/api/trust?view=${state.trustFilter}`;
      const res = await fetch(feedChannelURL).then(async r => r.json());
      state.freets = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
