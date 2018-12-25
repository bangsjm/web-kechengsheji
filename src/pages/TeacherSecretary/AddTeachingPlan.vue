<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
       <template slot="header">
         <el-row :gutter="10">
            <el-col :md="3">
              <el-select v-model="thisselectcollege" placeholder="请选择学院" @focus="getCollege()" no-data-text="暂无学院">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="thisselectmajor" placeholder="请选择专业" @focus="getMajor()" no-data-text="暂无专业">
                <el-option v-for="(v, k) in majors" :key="k" :label="v.majorName" :value="v.majorNumber"></el-option>
              </el-select>
            </el-col>
            <el-col :md="18" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
              <el-button type="success" size="normal" icon="el-icon-circle-plus" @click="handleAdd"></el-button>
              <el-button type="warning" size="normal" icon="el-icon-back" @click="goBack"></el-button>           
            </el-col>
          </el-row>
       </template><template slot="columns">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column prop="courseNumber" label="课程号">
          </el-table-column>
          <el-table-column prop="courseName" label="课程名">
          </el-table-column>
          <el-table-column prop="courseCredit" label="学分">
          </el-table-column>
          <el-table-column prop="courseHour" label="学时">
          </el-table-column>
          <el-table-column prop="courseNature" label="课程性质">
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
    name: "AddTeachingPlan",
    components: {
      Table2
    },
    data() {
      return {
        selectcollege:"",
        selectmajor:"",
        thisselectcollege:"",
        thisselectmajor:"",
        selectgrade:"",
        selectterm:"",
        majors:[],
        college:[],
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        handlePage: 1,
        selection:[],
      };

    },
    created() {
      this.getParams();
    },
    methods:{
          goBack(){
        this.$router.push({name: "教学计划管理"  });
          },
          handleSelectionChange(selection) {
            this.selection = [];
            selection.forEach(e => {
              this.selection.push(e.courseNumber);
            });
          },
          handleAdd() {
            
            if (this.selection.length === 0) {
              this.$message({
                message: "请选中要添加的课程",
                type: "warning"
              });
              return;
            }
            this.$confirm("是否确认添加?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
            this.$http.get("/TeachingPlan/addCourse",{
              params:{
                addCourseIds:this.selection.join(),
                collegeNumber:this.selectcollege,
                majorNumber:this.selectmajor,
                grade:this.selectgrade,
                term:this.selectterm
              }
            }).then(res => {
              let body = res.data;
              if (body.code === "200") {

                if(body.data==1){
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                this.$router.push({
                  name: "教学计划管理"
                });
                }else{
                  this.$message({
                    message: "部分课程已选！",
                    type: "warning"
                  });
                }
              } else {
                this.$message.error(body.msg);
              }
            });
          });
        },
          handleSearch() {
          this.$http
            .get("/TeachingPlan/searchCourse", {
              params: {
                collegeNumber:this.thisselectcollege,
                majorNumber:this.thisselectmajor,
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
      getParams () {
        this.selectcollege = this.$route.params.selectcollege;
        this.selectmajor=this.$route.params.selectmajor;
        this.selectgrade=this.$route.params.selectgrade;
        this.selectterm=this.$route.params.selectterm;
      },
      getCollege(){
            this.thisselectcollege="";
            this.thisselectmajor="";
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
            this.thisselectmajor="";
            this.thisselectclass="";
            this.majors = [];
            let formData = new FormData()
            formData.append('collegeNumber', this.thisselectcollege)
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
              }
            }
            )
          },
          handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.handleSearch();
          },
          handleCurrentChange(pageNum) {
            this.pageNum = pageNum;
            this.handleSearch();
          },
    }
  }
</script>
<style scoped>
</style>