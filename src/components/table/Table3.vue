<template>
    <div ref="all">
        <div ref="header" class="clearfix m1-header">
            <slot name="header"></slot>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="m1-table" handleSelectionChange stripe height="100%" show-overflow-tooltip :style="{maxHeight: tableMaxHeight + 'px'}" style="width: 100%;">
          <el-tab-pane :label="label1" name="first">
          <el-table class="m1-table" @selection-change="handleSelectionChange" :data="data1" stripe height="100%" show-overflow-tooltip :style="{maxHeight: tableMaxHeight + 'px'}" style="width: 100%;">
              <slot name="columns1"></slot>
          </el-table>
          </el-tab-pane>

          <el-tab-pane :label="label2" name="second">
          <el-table class="m1-table" @selection-change="handleSelectionChange" :data="data2" stripe height="100%" show-overflow-tooltip :style="{maxHeight: tableMaxHeight + 'px'}" style="width: 100%;">
              <slot name="columns2"></slot>
          </el-table>
          </el-tab-pane>
        </el-tabs>
        <div ref="footer" style="padding: 6px; text-align: center;">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "Table1",
  props: {
    data1: Array,
    data2:Array,
    label1:String,
    label2:String
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
