<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" style="height: 100%;">
     </Table2>
    </el-card>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table2";

  export default {
    name: "courseManage",
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