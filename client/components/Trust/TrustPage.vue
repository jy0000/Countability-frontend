<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Find people you trust @{{ $store.state.username }}</h2>
      </header>
      <CreateTrustForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to add or remove trust.
        </h3>
      </article>
    </section>
    <section>
      <section
        v-if="$store.state.trusts.length"
      >
        <TrustComponent
          v-for="trust in $store.state.trusts"
          :key="trust.id"
          :trust="trust"
        />
      </section>
      <article
        v-else
      >
        <!-- <h3>No trust found.</h3> -->
      </article>
    </section>
  </main>
</template>

<script>
// Components
import TrustComponent from '@/components/Trust/TrustComponent.vue';
import CreateTrustForm from '@/components/Trust/CreateTrustForm.vue';

export default {
  name: 'FreetPage',
  components: {TrustComponent, CreateTrustForm},
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
</style>
