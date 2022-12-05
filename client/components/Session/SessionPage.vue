<!-- Default page that also displays sessions -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2 class="box">
          Let's get to work, @{{ $store.state.username }}!
        </h2>
      </header>
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
            class="button-sign-in"
            to="/login"
          >
            Sign in
          </router-link>
          to create, edit, and delete sessions.
        </h3>
      </article>
    </section>
    <section v-if="$store.state.username">
      <article v-if="!$store.state.inSession">
        <button @click='startSession'> Start Session </button>
      </article>
      <article v-else>
        <h4>Time Elapsed: {{timeElapsed}}</h4>
        <div v-if="showUpload">
          <img :src="previewImage" class="uploading-image" />
          <input type="file" accept="image/jpeg" @change=uploadImage>
          <div>
            <button @click='submitImage'>Submit Image</button>
            <button @click='skipCheck'>Skip Check</button>
          </div>
        </div>
        <h4 v-else>Checking user every 5 seconds (beta only)</h4>
        <button @click='endSession'> End Session </button>
      </article>
    </section>
  </main>
</template>

<script>

export default {
  name: 'SessionPage',
  mounted() {
    // Primitive fix
    this.$store.commit('refreshInSession');
    if (this.$store.inSession) {
      this.runTimer();
      this.waitForCheck();
    }
  },
  data() {
    return {
      startTime: "",
      timeElapsed: "00:00:00",
      timerIntervalId: "",
      checkIntervalId: "",
      showUpload: false,
      previewImage:null,
    }
  },
  mounted() {
    // Primitive fix
    this.runTimer();
  },
  methods: {
    async submitRequest() {
      const url = `/api/sessions/check`;
      const params = {
          method: 'PATCH',
          message: 'Success!',
          callback: () => {
          // this.$set(this.alerts, params.message, 'success');
          // setTimeout(() => this.$delete(this.alerts, params.message), 3000);

          }
      };
      const options = {
          method: params.method, 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
            {
              check:'test',
              numChecks: 0
            }
          )
      };
      try {
          const r = await fetch(url, options);
          if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
          }
          console.log(await r.json());
          // params.callback();
      } catch (e) {
        console.log(e);
          // this.$set(this.alerts, e, 'error');
          // setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    runTimer() {
      let page = this;
      this.startTime = new Date();
      let startTime = new Date()
      this.timerIntervalId = setInterval(() => {
        let time = new Date() - startTime;
        function pad(n) {
          return ('00' + n).slice(-2);
        }
        const ms = time % 1000;
        time = (time-ms)/1000;
        const s = time % 60;
        time = (time-s)/60;
        const m = time % 60;
        time = (time-m)/60;
        const hr = time;
        page.timeElapsed = pad(hr) + ":" + pad(m) + ":" + pad(s);
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerIntervalId);
    },
    async startSession() {
      const url = `/api/sessions`;
      const params = {
          method: 'POST',
          message: 'Success!',
          callback: () => {
          // this.$set(this.alerts, params.message, 'success');
          // setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            this.$store.commit('refreshInSession');
            this.runTimer();
            this.waitForCheck();
          }
      };
      const options = {
          method: params.method, 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
            {
              numChecks: 0
            }
          )
      };
      try {
          const r = await fetch(url, options);
          if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
          }
          console.log(await r.json());
          params.callback();
      } catch (e) {
        console.log(e);
          // this.$set(this.alerts, e, 'error');
          // setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async endSession() {
      const url = `/api/sessions/end`;
      const params = {
          method: 'POST',
          message: 'Success!',
          callback: () => {
          // this.$set(this.alerts, params.message, 'success');
          // setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            this.$store.commit('refreshInSession');
            this.stopTimer();
          }
      };
      const options = {
          method: params.method, 
          headers: {'Content-Type': 'application/json'}
      };
      try {
          const r = await fetch(url, options);
          if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
          }
          console.log(await r.json());
          params.callback();
      } catch (e) {
        console.log(e);
          // this.$set(this.alerts, e, 'error');
          // setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    waitForCheck() {
      const page = this;
      this.checkIntervalId = setInterval(() => {
        page.showUpload = true;
      }, 5000)
    },
    uploadImage(e){
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        console.log(image);
        reader.onload = e =>{
            this.previewImage = e.target.result;
            console.log(this.previewImage);
        };
    },
    async submitImage() {
      if (!this.previewImage) {
        return;
      }
      const url = `/api/sessions/check`;
      const params = {
          method: 'PATCH',
          message: 'Success!',
          callback: () => {
          // this.$set(this.alerts, params.message, 'success');
          // setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.showUpload = false;
          this.previewImage = null;
          }
      };
      const options = {
          method: params.method, 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
            {
              check:this.previewImage
            }
          )
      };
      try {
          const r = await fetch(url, options);
          if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
          }
          console.log(await r.json());
          params.callback();
      } catch (e) {
        console.log(e);
          // this.$set(this.alerts, e, 'error');
          // setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    skipCheck() {
      this.showUpload = false;
      this.previewImage = null;
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
.input-form-box {
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
.uniform-button {
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
