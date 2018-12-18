<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
       <template slot="header">
         <el-row :gutter="10">
           
            <el-col :md="3">
              <el-select v-model="selectcollege" placeholder="请选择学院" @focus="getCollege()" no-data-text="暂无学院">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectmajor" placeholder="请选择专业" @focus="getMajor()" no-data-text="暂无专业">
                <el-option v-for="(v, k) in majors" :key="k" :label="v.majorName" :value="v.majorNumber"></el-option>
              </el-select>
            </el-col>
            <el-col :md="18" class="btn-group">
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
              <el-button type="text" size="small" @click="selectElective(scope.row)">选课</el-button>
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
    name: "StudentSelectCourse",
    components: {
      Table2
    },
    data() {
      return {
        selectcollege:"",
        selectmajor:"",
        studentNumber:"",
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
        this.studentNumber = this.$route.params.studentNumber;
      },
      selectElective(row){
            this.$http
            .get("/StudentCourse/addCourse", {
              params: {
                courseNumber:row.courseNumber,
                studentNumber:this.studentNumber,
                teacherNumber:row.teacherNumber,
              }
            })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              if(body.data==1){
                    this.$message({
                      showClose: true,
                      message: "选课成功！",
                      type: "success"
                    });
                    this.handleSearch();
              }else if(body.data==0){
                this.$message({
                      showClose: true,
                      message: "当前选课人数已满，选课失败！",
                      type: "warning"
                    });
              }else{
                this.$message({
                      showClose: true,
                      message: "该课已选！",
                      type: "warning"
                    });
              }
              }else {
                this.$message.error(body.msg);
              }
            });
      },
        goBack(){
          this.$router.push({name: "选课管理"  });
        },
        handleSizeChange(pageSize) {
          this.pageSize = pageSize;
          this.handleSearch();
        },
        handleCurrentChange(pageNum) {
          this.pageNum = pageNum;
          this.handleSearch();
        },
        getCollege(){
          this.selectcollege="";
          this.selectmajor="";
          this.selectclass="";
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
            }
          }

          )
        },
        handleSearch() {
          this.$http
            .get("/StudentCourse/selectCourse", {
              params: {
                collegeNumber:this.selectcollege,
                majorNumber:this.selectmajor,
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