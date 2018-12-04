<template>
  <el-cascader v-model="selVal" :placeholder="placeholder" @change="handleChange" :options="options" :props="props" :filterable="filterable" :show-all-levels="showAllLevels" style="width: 100%;"></el-cascader>
</template>

<script>
import { findPathInTree } from "@/assets/js/common/tree.js";
export default {
  name: "TreeSelector",
  props: {
    options: Array,
    placeholder: String,
    filterable: Boolean,
    showAllLevels: Boolean,
  },
  data() {
    return {
      selVal: [],
      props: {
        value: "id",
        label: "name",
      },
    };
  },
  methods: {
    handleChange(val) {
      this.$emit("select", val[val.length - 1]);
    },
    setValue(val) {
      let path = findPathInTree(this.options, "id", val, "children");
      if (path.length > 0) {
        path.forEach(e => {
          this.selVal.push(e.value);
        });
      }
    }
  }
};
</script>

