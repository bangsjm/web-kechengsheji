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
            <el-col :md="3">
              <el-select v-model="selectgrade" placeholder="请选择年级" @focus="getGrade()" no-data-text="暂无年级">
                <el-option label="大一" value="1"></el-option>
                <el-option label="大二" value="2"></el-option>
                <el-option label="大三" value="3"></el-option>
                <el-option label="大四" value="4"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectterm" @focus="getTerm()" placeholder="请选择学期"  no-data-text="暂无学期">
                <el-option label="一学期" value="1"></el-option>
                <el-option label="二学期" value="2"></el-option>
              </el-select>
            </el-col>
            <el-col :md="12" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
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
          <el-table-column prop="courseCredit" label="学分">
          </el-table-column>
          <el-table-column prop="courseHour" label="学时">
          </el-table-column>
          <el-table-column prop="courseNature" label="课程性质">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
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
    name: "teachingPlanManage",
    components: {
      Table2
    },
    data() {
      return {
        selectcollege:"",
        selectmajor:"",
        selectgrade:"",
        majorName:'',
        selectterm:"",
        college:[],
        majors:[],
        tableData:[],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        handlePage: 1,
        selection:[],

      };

    },
    created() {
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
      }
    },
    methods:{
      
        handleSelectionChange(selection) {
          this.selection = [];
          selection.forEach(e => {
            this.selection.push(e.studentNumber);
          });
        },
        showEdit(row){
           this.$router.push({
                name: "进行排课",
                params: {
                courseNumber:row.courseNumber,
                selectcollege:this.selectcollege,
                selectmajor:this.selectmajor,
                selectgrade:this.selectgrade,
                selectterm:this.selectterm
                }  
              });
        },
        handleAdd(){
            if(this.selectcollege==""){
              this.$message({
              message: "请选择学院",
              type: "warning"
            });
            }else if(this.selectmajor==""){
              this.$message({
              message: "请选择专业",
              type: "warning"
            });
            }else if(this.selectgrade==""){
              this.$message({
              message: "请选择年级",
              type: "warning"
            });
            }else if(this.selectterm==""){
              this.$message({
              message: "请选择学期",
              type: "warning"
            });
            }else{
              this.$router.push({
                name: "添加教学计划",
                params: {
                selectcollege:this.selectcollege,
                selectmajor:this.selectmajor,
                selectgrade:this.selectgrade,
                selectterm:this.selectterm
                }  
              });
            }

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
          if(this.selectcollege==""){
              this.$message({
              message: "请选择学院",
              type: "warning"
            });
            }else if(this.selectmajor==""){
              this.$message({
              message: "请选择专业",
              type: "warning"
            });
            }else if(this.selectgrade==""){
              this.$message({
              message: "请选择年级",
              type: "warning"
            });
            }else if(this.selectterm==""){
              this.$message({
              message: "请选择学期",
              type: "warning"
            });
            }else{
              this.$http
            .get("/TeachingPlan/search", {
              params: {
                collegeNumber:this.selectcollege,
                majorNumber: this.selectmajor,
                grade: this.selectgrade,
                term:this.selectterm,
                pageNum:this.pageNum,
                pageSize:this.pageSize,
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
            }
          
        },
    }
  }
</script>
<style scoped>
</style>