<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" style="height: 100%;">
       <template slot="header">
         demo
       </template>
       <template slot="columnsLeft">
       </template>
     </Table2>
    </el-card>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table2";

  export default {
    name: "PipelineMaintain",
    components: {
      Table2
    },
    data() {
      return {
      };

    },
    created() {
      this.token = window.sessionStorage.getItem("token")
    },
    activated() {
      if (!!this.$route.params.refresh) {
      }
      this.$nextTick(() => {
      });
    },
    mounted(){
    },
    methods: {
    },

  }
</script>
<style scoped>
  .elem{
    display:none;
  }

  /*当鼠标经过父级father的时候。父级获得hover状态，在父级hover的基础上写elem的样式：*/
  .father:hover .elem{
    display:block ;
  }
  /*textarea显示覆盖标注圈*/
  .father:hover {
    z-index: 999;
  }
</style>
