<template>
  <div>
    <nav-menu-item v-for="(item, i) in menu" :key="i" :menu="item"></nav-menu-item>
  </div>
</template>


<script>
import NavMenuItem from "./NavMenuItem";
export default {
  name: "NavMenu",
  props: {
    menu: Array
  },
  components: {
    NavMenuItem
  }
};
</script>

