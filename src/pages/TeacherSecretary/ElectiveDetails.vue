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
          <el-table-column prop="teacherNumber" label="教师">
          </el-table-column>
          <el-table-column prop="people" label="人数">
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
        selectcollege:"",
        selectmajor:"",
        selectgrade:"",
        selectterm:"",
        college:[],
        majors:[],
        tableData:[],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        handlePage: 1,
        isShowTeachers:false,
        defaultProps: {
          children: "children",
          label: "teacherName"
        },
        treeData:[],
      };

    },
    methods:{
      
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
        handleAddTeacher(){
          var selectTeachers=this.$refs["tree2"].getCheckedKeys();
          if (selectTeachers.length === 0) {
            this.$message({
              message: "请选中要添加的数据",
              type: "warning"
            });
            return;
          }
          
          this.$confirm("是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
          this.$http
            .get("/ElectiveManage/addTeacher", {
              params: {
                selectTeachers:selectTeachers.join(),
                courseNumber:this.selectCourse,
              }
            })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowTeachers = false;
              }
            });
            
          });
        },
        showTeachers(row){
          let formData = new FormData()
          this.selectCourse=row.courseNumber;
          formData.append('collegeNumber', this.selectcollege)
          formData.append('majorNumber', this.selectmajor) 
          this.$http
            .post("/ElectiveManage/getTeacher",formData,{
            hideLoading: true,
          }
            )
            .then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.treeData=body.data;
              }else {
                this.$message.error(body.msg);
              }

            });
          this.isShowTeachers = true;
        },
        getCollege(){
            this.selectcollege="";
            this.selectmajor="";
            this.selectclass="";
            this.selectgrade="",
            this.selectterm="",
            this.college=[];
            this.$http
            .post("/TeacherSecretary/getCollege","",{
            hideLoading: true,
          }
            )
            .then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.college=body.data;
              }

            });
          },
          getMajor(){
            this.selectmajor="";
            this.selectclass="";
            this.selectgrade="",
            this.selectterm="",
            this.majors = [];
            let formData = new FormData()
            formData.append('collegeNumber', this.selectcollege)
            this.$http
            .post("/TeacherSecretary/getMajor",formData,
            {
              hideLoading:true,
            }
            )
            .then(res => {
              let body = res.data;
              if(body.code === "200"){
                this.majors = body.data;
              }else {
                this.$message.error(body.msg);
              }
            }
            )
          },
          getGrade(){
            this.selectgrade="",
            this.selectterm="";
          },
          getTerm(){
            this.selectterm="";
          },
        handleSearch() {
          this.$http
            .get("/ElectiveManage/search", {
              params: {
                collegeNumber:this.selectcollege,
                majorNumber: this.selectmajor,
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