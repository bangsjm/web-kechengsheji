<template>
    <div ref="all"  class="m-table">
        <div ref="header" class="clearfix m1-header">
            <slot name="header"></slot>
        </div>
        <el-row style="height:100%" :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"  style="height:50%" >
            <div style="height:100%" >
              <el-table class="m1-table" @selection-change="handleSelectionChange" :data="data" stripe height="100%" show-overflow-tooltip :style="{maxHeight: tableMaxHeight + 'px'}" style="width: 100%">
                  <slot name="columnsLeft"></slot>
              </el-table>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="height:50%" >
            <div style="height:100%" >
              <el-table class="m1-table" @selection-change="handleSelectionChange" :data="checkData" stripe height="100%"  show-overflow-tooltip :style="{maxHeight: tableMaxHeight + 'px'}" style="width: 100%;">
                  <slot name="columnsRight"></slot>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <div ref="footer" style="padding: 6px; text-align: center;">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "Table1",
  props: {
    data: Array,
    checkData:Array,
    isShow:true,
  },
  data() {
    return {
      tableMaxHeight: 0,
      computeShow:true,
    };
  },
  mounted() {
    this.resizeTable();
    this.computeIsShow();
    window.addEventListener("resize", this.resizeTable);
    window.addEventListener("resize",this.computeIsShow);
  },
  activated () {
    this.resizeTable();
    this.computeIsShow();
  },
  methods: {
    resizeTable() {
      this.tableMaxHeight =
        this.$refs["all"].offsetHeight -
        this.$refs["header"].offsetHeight -
        this.$refs["footer"].offsetHeight;
        // console.log(this.tableMaxHeight)
    },
    computeIsShow(){
      if(this.$refs["all"].offsetWidth<768){
           this.computeShow=false;
      }
      else{
      this.computeShow=true;
      }
    },
    handleSelectionChange (selection) {
      this.$emit("selection-change", selection)
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTable);
    window.removeEventListener("resize",this.computeIsShow);
  }
};
</script>
