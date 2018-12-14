<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
       <template slot="header">
         <el-row :gutter="10">
            <el-col :md="24" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>  
              <el-button type="warning" size="normal" icon="el-icon-back" @click="goBack"></el-button>           
            </el-col>
          </el-row>
       </template>
          <template slot="columns">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column prop="courseNumber" label="课程号">
          </el-table-column>
          <el-table-column prop="courseName" label="课程名">
          </el-table-column>
          <el-table-column prop="teacherName" label="教师">
          </el-table-column>
          <el-table-column prop="people" label="选课人数">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteElective(scope.row)">删除排课</el-button>
            </template>
          </el-table-column>
        </template>
        <template slot="footer">
          <el-pagination layout="pager, sizes, jumper" :total="total" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
          </el-pagination>
        </template>
     </Table2>
    </el-card>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table1";

  export default {
    name: "ElectiveDetails",
    components: {
      Table2
    },
    data() {
      return {
        courseNumber:"",
        college:[],
        majors:[],
        tableData:[],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        handlePage: 1,
      };

    },
    created(){
      this.getParams();
      this.handleSearch();
    },
    methods:{
      getParams () {
        this.courseNumber = this.$route.params.courseNumber;
      },
        goBack(){
          this.$router.push({name: "选修管理"  });
        },
        handleSizeChange(pageSize) {
          this.pageSize = pageSize;
          this.handleSearch();
        },
        handleCurrentChange(pageNum) {
          this.pageNum = pageNum;
          this.handleSearch();
        },
        showDetails(row){
              this.$router.push({
                name: "选修详情",
                params: {
                courseNumber:row.courseNumber,
                }  
              });
        },
        handleSearch() {
          this.$http
            .get("/ElectiveManage/searchDetails", {
              params: {
                courseNumber:this.courseNumber,
                pageNum:this.pageNum,
                pageSize:this.pageSize
              }
            })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.tableData = body.data;
              this.total = body.page.total;
              this.pageSize = body.page.size;
              this.handlePage = this.pageNum;
              let result = this.total / this.pageSize;
              if (Math.floor(result) != result) {
                result++;
              }
              if (this.pageNum > result) {
                this.pageNum = Math.floor(result);
                if (this.pageNum == 0) {
                  this.pageNum = 1;
                  return
                }
                this.handleSearch();
              }
              }
            });
        },
    }
  }
</script>
<style scoped>
</style>