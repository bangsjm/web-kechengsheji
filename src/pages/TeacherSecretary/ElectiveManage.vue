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
              <el-button type="text" size="small" @click="showTeachers(scope.row)">排课</el-button>
              <el-button type="text" size="small" @click="showDetails(scope.row)">详情</el-button>
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

    <el-dialog title="选择教师"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowTeachers">
               <el-tree highlight-current :filter-node-method="filterNode" :data="treeData" empty-text="暂无教师" show-checkbox
                 node-key="teacherNumber"  :props="defaultProps" @node-click="handleTreeNodeClick" default-expand-all ref="tree2"></el-tree>
              <div style="float:right;padding:5px" > <el-button  style="float:right" type="success" size="small" @click="handleAddTeacher">保存</el-button> </div>
    </el-dialog>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table1";

  export default {
    name: "ElectiveManage",
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
              if(body.data==1){
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowTeachers = false;
              }else{
                this.$message({
                  message: "部分教师已经排课，不能重复排课",
                  type: "warning"
                });
              }
              }
            });
            
          });
        },
        showTeachers(row){
          let formData = new FormData()
          this.selectCourse=row.courseNumber;
          formData.append('collegeNumber', row.collegeNumber)
          formData.append('majorNumber', row.majorNumber) 
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