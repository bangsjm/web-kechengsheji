<template>
    <div ref="all">
        <div ref="header" class="clearfix m1-header">
            <slot name="header"></slot>
        </div>
        <el-table class="m1-table" @selection-change="handleSelectionChange" :data="data" stripe height="100%" show-overflow-tooltip :style="{maxHeight: tableMaxHeight + 'px'}" style="width: 100%;">
            <slot name="columns"></slot>
        </el-table>
        <div ref="footer" style="padding: 6px; text-align: center;">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "Table1",
  props: {
    data: Array
  },
  data() {
    return {
      tableMaxHeight: 0   
    };
  },
  mounted() {
    this.resizeTable();
    window.addEventListener("resize", this.resizeTable);
  },
  activated () {
    this.resizeTable()
  },
  methods: {
    resizeTable() {
      this.tableMaxHeight =
        this.$refs["all"].offsetHeight -
        this.$refs["header"].offsetHeight -
        this.$refs["footer"].offsetHeight;
        // console.log(this.tableMaxHeight)
    },
    handleSelectionChange (selection) {
      this.$emit("selection-change", selection)
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTable);
  }
};
</script>
