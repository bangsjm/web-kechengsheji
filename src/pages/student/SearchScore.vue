<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
        <template slot="header">
            <el-dropdown>
                <span class="el-dropdown-link">
                  成绩查询<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="show">黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
       </template>
     </Table2>
    </el-card>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table2";

  export default {
    name: "SearchScore",
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