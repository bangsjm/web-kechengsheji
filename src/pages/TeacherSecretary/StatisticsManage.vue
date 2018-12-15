<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
        <template slot="header">
            统计功能
       </template>
     </Table2>
    </el-card>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table1";

  export default {
    name: "StatisticsManage",
    components: {
      Table2
    },
    data() {
      return {

            };

    },
  
  }
</script>
<style scoped>
</style>