<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
       <template slot="header">
         <el-row :gutter="10">
            <el-col :md="3">
              <el-select v-model="selectclass" placeholder="请选择班级" @focus="getClass()" no-data-text="暂无班级">
                <el-option v-for="(v, k) in classes" :key="k" :label="v.className" :value="v.classId"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectteacher" placeholder="请选择教师" @focus="getTeacher()" no-data-text="暂无教师">
                <el-option v-for="(v, k) in teachers" :key="k" :label="v.teacherName" :value="v.teacherNumber"></el-option>
              </el-select>
            </el-col>
            <el-col :md="18" class="btn-group">
              <el-button type="success" size="normal" icon="el-icon-circle-plus" @click="handleSort"></el-button>
              <el-button type="warning" size="normal" icon="el-icon-delete" @click="handleDelete"></el-button>
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
          <el-table-column prop="className" label="班级">
          </el-table-column>
          <el-table-column prop="teacherName" label="教师">
          </el-table-column>
          <el-table-column prop="year" label="学年">
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
        collegeNumber:'',
        majorNumber:'',
        selectclass:'',
        classes:[],
        classId:'',
        className:'',
        selectteacher:'',
        teachers:[],
        obligatoryId:'',
        teacherName:'',
        teacherNumbwe:'',
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
      this.getParams();
      this.handleSearch();
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
      }
    },
    methods:{
      goBack(){
        this.$router.push({name: "必修管理"  });
          },
      getParams () {
        this.collegeNumber = this.$route.params.selectcollege;
        this.majorNumber=this.$route.params.selectmajor;
        this.courseNumber = this.$route.params.courseNumber;
      },
      getClass(){
          this.selectclass="";
          this.classes = [];
          let formData = new FormData()
          formData.append('collegeNumber', this.collegeNumber)
          formData.append('majorName',this.majorNumber)
          this.$http
          .post("/TeacherSecretary/getClass",formData,{
            hideLoading:true,
          }
          )
          .then(res => {
            let body = res.data;
            if(body.code == "200"){
              this.classes = body.data;
            }
          }
          )
        },
      
        getTeacher(){
          this.selectteacher = "";
          this.teachers = [];
          let formData = new FormData();
          formData.append('collegeNumber', this.collegeNumber)
          formData.append('majorNumber',this.majorNumber)
          this.$http
          .post("/TeachingPlan/getTeacher",formData,{
            hideLoading:true,
          }
          )
          .then(res => {
            let body = res.data;
            if(body.code == "200"){
              this.teachers = body.data;
            }
          }
          )

        },
        handleSelectionChange(selection) {
          this.selection = [];
          selection.forEach(e => {
            this.selection.push(e.obligatoryId);
          });
        },
        showEdit(){
           this.$router.push({
                name: "进行排课",
                params: {
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
        //添加排课
        handleSort(){
          if(this.selectclass == "" || this.selectteacher ==""){
            this.$message({
                  message: "请先选择班级或教师",
                  type: "warning"
                });
                return;
          }
          
            let formData = new FormData();
            var date=new Date;
            var year=date.getFullYear(); 
            formData.append('courseNumber',this.courseNumber);
            formData.append('classId',this.selectclass);
            formData.append('teacherNumber',this.selectteacher);
            formData.append('year',year);
            this.$http.post("/TeachingPlan/addObligatory",formData).then(res => {
              let body = res.data;
              if (body.code === "200") {
                if(body.data >0){
                  this.$message({
                  message: "添加成功",
                  type: "success"
                });
                }else{
                  this.$message({
                  message: "该排课已存在",
                  type: "warning"
                });
                }
                this.handleSearch();
              } else {
                this.$message.error(body.msg);
              }
            });
        },
        handleSearch() {
          alert
          this.$http
            .get("/TeachingPlan/selectInfo", {
              params: {
                classes:this.classes,
                collegeNumber:this.collegeNumber,
                majorNumber: this.majorNumber,
                courseNumber:this.courseNumber,
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
        },
        handleDelete() {
        if (this.selection.length === 0) {
          this.$message({
            message: "请选中要删除的数据",
            type: "warning"
          });
          return;
        }
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http
            .delete("/TeachingPlan/deleteObligatory?", {
              params: {
                obligatoryIds: this.selection.join()
              }
            })
            .then(res => {
              let body = res.data;
              if (body.code === "200") {
                if(body.data > 0){
                  this.$message({
                  message: "删除成功",
                  type: "success"
                });
                }else if(body.data == 0){
                  this.$message({
                  message: "该专业已有学生",
                  type: "warning"
                });
                }else if(body.data == -1){
                  this.$message({
                  message: "该专业已开设课程",
                  type: "warning"
                });
                }else if(body.data == -2){
                  this.$message({
                  message: "该专业已有老师",
                  type: "warning"
                });
                }
                this.handleSearch();
              } else {
                this.$message.error(body.msg);
              }
            });
        });
      },
    }
  }
</script>
<style scoped>
</style>