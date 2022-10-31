<template>
  <div>
    <Toggle v-model="value" />
  </div>
</template>

<script>
  import Toggle from '@vueform/toggle/dist/toggle.vue2.js'

  export default {
    components: {
      Toggle,
    },
    data() {
      return {
        value: 'News'
      }
    }
  }
</script>

<style src="@vueform/toggle/themes/default.css"></style>