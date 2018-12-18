<template>
    <div ref="all" style="height:100%">
        <div ref="header" class="clearfix m1-header">
            <slot name="header"></slot>
        </div>

              <div style="height:100%;margin-left:6px;margin-right:6px;"   :style="{maxHeight: tableMaxHeight + 'px'}">
              <slot name="columns1"></slot>
              </div>

        <div ref="footer" style="padding: 6px; text-align: center;">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "Table3",
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
       // alert(this.tableMaxHeight)
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
