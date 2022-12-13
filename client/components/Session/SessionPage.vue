<!-- Default page that also displays sessions -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2 class="box">
          Let's get to work, @{{ $store.state.username }}
        </h2>
      </header>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
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
            class="uniform-button"
            to="/login"
          >
            Sign in
          </router-link>
          to create, edit, and delete sessions.
        </h3>
      </article>
    </section>
    <section v-if="$store.state.username">
      <article v-if="(!inSession && !closingSession)">
        <div>
          <h3>Track your productivity in a work session!</h3>
          <small class="info">
            After starting a session, every so often, you'll be prompted to take a picture of your workspace as a productivity check.
            <br>
            Complete these checks to earn points toward your drawings, and show your friends just how productive you can be.
          </small>
        </div>
        <button
          class="button-8"
          :disabled="disableStart"
          @click="startSession"
        >
          Start Session
        </button>

        <p v-if="(disableStart && !closingSession)">
          Loading...
        </p>
        <div class="slider">
          How often to check in (seconds)?
          <input
            type="range"
            min="5"
            max="60"
            value="15"
            oninput="checkFreqMinutes.innerText = this.value"
            @change="setFreq"
          >
          <p id="checkFreqMinutes">
            15
          </p>
        </div>
      </article>
      <article v-else>
        <h4 v-if="!closingSession">
          Time Elapsed: {{ timeElapsed }}
        </h4>
        <div v-if="(showUpload && !closingSession)">
          <div>
            <img
              :src="previewImage"
              class="uploading-image"
            >
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/heic"
            class="button-8"
            @change="uploadImage"
          >
          <div>
            <button
              class="button-8"
              @click="submitImage"
            >
              Submit Image
            </button>
            <button
              class="button-8"
              @click="skipCheck"
            >
              Skip Check
            </button>
          </div>
        </div>
        <!-- <h4 v-if="!closingSession">
          Checking user every 5 seconds (beta only)
        </h4> -->
        <button
          v-if="!closingSession"
          :disabled="disableEnd"
          class="button-8"
          @click="closeSession"
        >
          End Session
        </button>
        <p v-if="disableEnd">
          Loading...
        </p>
      </article>
      <article v-if="closingSession">
        <form
          class="input-form-box"
          @submit.prevent="submit"
        >
          <h3>{{ title }}</h3>
          <article>
            <div
              v-for="field in fields"
              :key="field.id"
            >
              <label :for="field.id">{{ field.label }}:</label>
            
              <div 
                v-if="field.id === 'focusReflection'"
              >
                <input
                  type="range"
                  min="0"
                  max="10"
                  value="5"
                  oninput="rangeValue.innerText = this.value"
                  @input="field.value = $event.target.value"
                >
                <p id="rangeValue">
                  5
                </p>
              </div>
              <input
                v-else 
                :type="text"
                :name="field.id"
                :value="field.value"
                @input="field.value = $event.target.value"
              >
            </div>
          </article>
        </form>
        <button
          :disabled="!closingSession"
          type="submit"
          class="button-8"
          @click="endSession"
        >
          Finish work!
        </button>
      </article>
    </section>
  </main>
</template>

<script>
import moment from 'moment';
import CreatePostForm from '../Post/CreatePostForm.vue';

export default {
  name: 'SessionPage',
  components: {},
  data() {
    return {
      startTime: "",
      timeElapsed: "Loading start time...",
      timerIntervalId: "",
      checkIntervalId: "",
      flashIntervalId: "",
      showUpload: false,
      previewImage:null,
      numChecks: 0,
      inSession: false,
      currentSession: null,
      checkFreq: 900000,
      disableStart: true,
      disableEnd: true,
      closingSession: false,
      alerts: {},
      fields: [
      {id: 'caption', label: 'Your work in one sentence', value:'', placeholder: ""},
        {id: 'progressReflection', label: 'Reflection', value: ''},
        {id: 'focusReflection', label: 'Focus', value: ''},
      ],
    }
  },
  async mounted() {
    const url = `/api/sessions/${this.$store.state.username}`;
    const promise = fetch(url).then(async (r) => {
      const res = await r.json();
      this.currentSession = null;
      this.inSession = false;
      for (let i = 0; i < res.length; i++) {
        if (!res[i].endDate) {
          this.currentSession = res[i];
          this.checkFreq = res[i].checkFreq;
          this.inSession = true;
        }
      }
      if (this.inSession) {
        this.disableStart = true;
        this.disableEnd = false;
        let page = this;
        let startTime = moment(this.currentSession.startDate).utc();
        this.timerIntervalId = setInterval(() => {
          let time = moment.utc(new Date()) - startTime;
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
        this.waitForCheck();
      }
      else {
        this.disableStart = false;
        this.disableEnd = true;
      }
    });
    await promise;
  },
  destroyed() {
      if (this.checkIntervalId) {
        clearInterval(this.checkIntervalId);
        this.stopFlash();
      }
    },
  methods: {
    runTimer() {
      let page = this;
      this.startTime = new Date();
      let startTime = new Date()
      if (this.timerIntervalId) {
        this.stopTimer();
      }
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
      this.disableStart = true;
      this.disableEnd = false;
      const url = `/api/sessions`;
      const params = {
          method: 'POST',
          message: 'Successfully started a work session!',
          callback: () => {
          this.timeElapsed = "00:00:00";
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 1000);
          this.inSession = true;
          this.runTimer();
          this.waitForCheck();
          }
      };
      const options = {
          method: params.method, 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
            {
              numChecks: 0,
              checkFreq: this.checkFreq
            }
          )
      };
      try {
          const r = await fetch(url, options);
          if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
          }
          params.callback();
          this.currentSession = await r.json();
          console.log(this.currentSession);
      } catch (e) {
        console.log(e);
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 1000);
      }
    },
    closeSession() {
      this.closingSession = true;
    },
    async endSession() {
      this.disableStart = false;
      this.disableEnd = true;
      const url = `/api/sessions/end`;
      const params = {
          method: 'POST',
          message: 'Successfully finished a work session!',
          callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 1000);
            this.inSession = false;
            this.closingSession = false;
            this.stopTimer();
            this.stopChecks();
            this.$store.commit('updatePoint', this.numChecks);
            this.numChecks = 0;
            this.$store.commit('refreshPoint');
          }
      };
      const options = {
          method: params.method, 
          body: JSON.stringify({
            "caption": this.fields[0].value,
            "progressReflection": this.fields[0].value,
            "focusReflection": this.fields[0].value
          }),
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
          this.currentSession = null;
      } catch (e) {
        console.log(e);
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 1000);
      }
    },
    waitForCheck() {
      const page = this;
      if (this.checkIntervalId) {
        clearInterval(this.checkIntervalId);
      }
      this.checkIntervalId = setInterval(() => {
        page.showUpload = true;
        if (!this.closingSession) {
          let audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
          // audio.play();
          this.flashIcon();
          alert("Productivity check! Upload a photo of your workspace.");
        }
      }, this.checkFreq);
    },
    stopChecks() {
      clearInterval(this.checkIntervalId);
      this.stopFlash();
    },
    flashIcon() {
      if (this.flashIntervalId) {
        clearInterval(this.flashIntervalId);
      }
      let icons = ['/blackicon.png', '/redicon.png']
      let link = document.querySelector("link[rel~='icon']");
      let index = 1;
      this.flashIntervalId = setInterval(() => {
        link.href = icons[1-index];
        index = 1-index;
      }, 500);
    },
    stopFlash() {
      clearInterval(this.flashIntervalId);
      let link = document.querySelector("link[rel~='icon']");
      link.href = '/favicon.ico';
    },
    uploadImage(e){
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        if (image.length > 100000000) {
          console.log("TODO add an alert here")
        }
        console.log('HERE', image);

        reader.onload = e =>{
            this.previewImage = e.target.result;
            console.log(this.previewImage);
        };
    },
    async submitImage() {
      if (!this.previewImage) {
        const imageError = new Error('No image uploaded!');
        this.$set(this.alerts, imageError, 'error');
        setTimeout(() => this.$delete(this.alerts, imageError), 1000);
        return;
      }
      this.numChecks += 1;
      const url = `/api/sessions/check`;
      const params = {
          method: 'PATCH',
          message: 'Success!',
          callback: () => {
          this.stopFlash();
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 1000);
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
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 1000);
      }
    },
    skipCheck() {
      this.showUpload = false;
      this.previewImage = null;
      this.stopFlash();
    },
    setFreq(e) {
      this.checkFreq = e.target.value * 1000; // debugging using seconds instead of minutes
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

body {
  background: linear-gradient(to right, red, yellow);
  }
  
  
  .slider {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 500px;
  height: 60px;
  padding: 30px;
  padding-left: 40px;
  background: #fcfcfc;
  border-radius: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0px 15px 40px #7E6D5766;
  }
  .slider p {
  font-size: 26px;
  font-weight: 600;
  font-family: Open Sans;
  padding-left: 30px;
  color: black;
  }
  .slider input[type="range"] {
  -webkit-appearance:none !important;
  width: 420px;
  height: 2px;
  background: black;
  border: none;
  outline: none;
  }
  .slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  width: 30px;
  height:30px;
  background: black;
  border: 2px solid black;
  border-radius: 50%;
  cursor: pointer;
  }
  .slider input[type="range"]::-webkit-slider-thumb:hover {
  background: black;
  }

  .button-8 {
  background-color: #e1ecf4;
  border-radius: 3px;
  border: 1px solid #7aa7c7;
  box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;
  box-sizing: border-box;
  color: #39739d;
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.15385;
  outline: none;
  padding: 10px .8em;
  margin-top: 15px;
  position: relative;
  text-align: center;
}

form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}
article > div {
  display: flex;
  flex-direction: column;
}
form > article p {
  margin: 0;
}
form h3,
form > * {
  margin: 0.3em 0;
}
form h3 {
  margin-top: 0;
}
textarea {
   font-family: inherit;
   font-size: inherit;
}
/* CSS */

.uniform-button {
  text-decoration: none;
  align-self: center;
  border-style: solid;
  background-color: white;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, .2) 15px 28px 25px -18px;
  box-sizing: border-box;
  color:#41403e;
  cursor: pointer;
  display: inline-block;
  font-family: Neucha, sans-serif;
  font-size: 1.5rem;
  line-height: 23px;
  padding: .75rem;
  margin-right: 0.35rem;
}

.uniform-button:hover {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.uniform-button:focus {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 4px -6px;
}
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
  font-size: 20px;
  border: 0;
  background-color: rgb(199, 193, 193, 0.45);
  width: 90%;
}
</style>
