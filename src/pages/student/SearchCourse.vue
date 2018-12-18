<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
        <template slot="header">
          <el-row :gutter="10">
             <el-col :md="3">
              <el-select v-model="selectYear" placeholder="请选择年份">
                <el-option v-for="(v, k) in years" :key="k" :label="v.label" :value="v.value"></el-option>
              </el-select>
            </el-col>
            <el-col :md="21" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
              <el-button type="success" size="normal" icon="el-icon-circle-plus" @click="showAdd"></el-button>
              </el-col>
          </el-row>
       </template>
       <template slot="columns">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column prop="courseName" label="课程">
          </el-table-column>
          <el-table-column prop="teacherName" label="教师">
          </el-table-column>
          <el-table-column prop="courseNature" label="性质">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" >
              <el-button type="text" size="small" @click="showEdit(scope.row)">退课</el-button>
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
    name: "SearchCourse",
    components: {
      Table2
    },
    data() {
      return {
        selectYear:"",  
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        handlePage: 1,
        studentNumber:"",
        years:[
          {label:'2014',value:'2014'},
          {label:'2015',value:'2015'},
          {label:'2016',value:'2016'},
          {label:'2017',value:'2017'},
          {label:'2018',value:'2018'},
          {label:'2019',value:'2019'},
          {label:'2020',value:'2020'},

        ],
      };

    },
  
  
    created(){
      this.getParams();
      this.handleSearch();
    },
    methods:{
        getParams(){
          this.studentNumber=window.localStorage.getItem("userName");
          var date=new Date;
          this.selectYear=date.getFullYear();
        },
        showAdd(){
          this.$router.push({
            name: "学生选课",
            params: {
            studentNumber:this.studentNumber,
            }  
          });
        },
        showEdit(row){
            if(row.courseNature=="必修"){
              this.$message({
                showClose: true,
                message: "必修课不能退课",
                type: "warning"
              });
            }else{
            this.$http
            .get("/StudentCourse/deleteCourse", {
              params: {
                courseNumber:row.courseNumber,
                studentNumber:this.studentNumber,
                teacherNumber:row.teacherNumber,
                year:this.selectYear,
              }
            })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
                  if(body.data==1){
                    this.$message({
                      showClose: true,
                      message: "该课属于公选，不能退课!",
                      type: "warning"
                    });
                  }else{
                    this.$message({
                      showClose: true,
                      message: "退课成功！",
                      type: "success"
                    });
                    this.handleSearch();
                  }
              }else {
                this.$message.error(body.msg);
              }
            });
            }
        },
        handleSearch() {
          this.$http
            .get("/StudentCourse/search", {
              params: {
                year:this.selectYear,
                studentNumber:this.studentNumber,
                pageNum: this.pageNum,
                pageSize: this.pageSize
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
    },
  }
</script>
<style scoped>
</style>