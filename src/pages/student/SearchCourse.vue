<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
        <template slot="header">
            选课管理
       </template>
     </Table2>
    </el-card>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table1";

  export default {
    name: "SearchCourse",
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