<template>
    <el-submenu v-if="menu.children && menu.children.length > 0" :index="menu.name">
        <template slot="title">
            <i class="icon" :class="menu.icon"></i>
            <span slot="title">{{menu.name}}</span>
        </template>
        <nav-menu-item v-for="(item, i) in menu.children" :key="i" :menu="item"></nav-menu-item>
    </el-submenu>
    <el-menu-item v-else :index="menu.name">
        <i class="icon" :class="menu.icon"></i>
        <span slot="title">{{menu.name}}</span>
    </el-menu-item>
</template>

<style scoped>
.icon {
    width: 18px;
}
</style>


<script>
export default {
  name: "NavMenuItem",
  props: {
    menu: Object
  }
};
</script>

