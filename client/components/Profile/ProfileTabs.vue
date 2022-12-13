<template>
  <div>
    <ul
      class="tabs__header"
      style="list-style: none;"
    >
      <li
        v-for="(tab, index) in tabs"
        :key="tab.title"
        :class="{&quot;tabs__selected&quot;: (index == selectedIndex)}"
        @click="selectTab(index)"
      >
        <button class="box">
          {{ tab.title }}
        </button>
      </li>
    </ul>
    <slot />
  </div>
</template>
  
  <script>
  
    export default {
      data () {
        return {
          selectedIndex: 0, // the index of the selected tab,
          tabs: []         // all of the tabs
        }
      },
      created () {
        this.tabs = this.$children
      },
      mounted () {
      this.selectTab(0)
      },
      methods: {
      selectTab (i) {
        this.selectedIndex = i
        // loop over all the tabs
        this.tabs.forEach((tab, index) => {
          tab.isActive = (index === i)
        })
      }
   }
    }

    
  </script>
  
  <style scoped>
  
  li {
    position: relative;
    display:inline;
    padding: 10px 40px;
}
  .box {
    background-color: #c2fbd7;
    border-radius: 5px;
    box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
    color: rgb(0, 86, 0);
    display: inline-block;
    font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
    padding: 7px 20px;
    text-align: center;
    text-decoration: none;
    border: 0;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .box:hover {
    box-shadow: rgba(0, 255, 42, 0.3) 2px 8px 8px -5px;
    transform: translate3d(0, 2px, 0);
  }
  .box:focus {
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 4px -6px;
  }
</style>
