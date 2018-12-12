<template>
  <div class="fill-page">
    <el-card class="fill-card">
      <table1 :data="tableData" style="height: 100%;" @selection-change="handleSelectionChange">
        <template slot="header">
          <el-row :gutter="10">
             <el-col :md="3">
              <el-select v-model="selectcollege" placeholder="请选择学院" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
            </el-col>

            <el-col :md="3">
              <el-select v-model="selectmajor" placeholder="请选择专业" @focus="getMajor()">
                <el-option v-for="(v, k) in majors" :key="k" :label="v.majorName" :value="v.majorNumber"></el-option>
              </el-select>
            </el-col>

            <el-col :md="18" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
              <el-button type="success" size="normal" icon="el-icon-circle-plus" @click="showAdd"></el-button>
              <el-button type="warning" size="normal" icon="el-icon-delete" @click="handleDelete"></el-button>
            </el-col>
          </el-row>
        </template>
        <template slot="columns">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column type="index" :index="(pageNum - 1) * pageSize + 1">
          </el-table-column>
          <el-table-column prop="courseNumber" label="课程号">
          </el-table-column>
          <el-table-column prop="courseName" label="课程名">
          </el-table-column>
           <el-table-column prop="courseNature" label="课程性质">
          </el-table-column>
          <el-table-column prop="courseCredit" label="学分">
          </el-table-column>
          <el-table-column prop="courseHour" label="学时">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </template>
        <template slot="footer">
          <el-pagination layout="pager, sizes, jumper" :total="total" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange" :current-page.sync="handlePage">
          </el-pagination>
        </template>
      </table1>
    </el-card>

    <el-dialog title="添加课程"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowAddDialog">
      <el-form :model="form" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="课程名" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名"></el-input>
        </el-form-item>
        <el-form-item label="课程号" prop="courseNumber">
          <el-input v-model="form.courseNumber" placeholder="请输入课程编号"></el-input>
        </el-form-item>
        <el-form-item label="学分" prop="courseCredit">
          <el-input v-model="form.courseCredit" placeholder="请输入学分"></el-input>
        </el-form-item>
        <el-form-item label="学时" prop="courseHour">
          <el-input v-model="form.courseHour" placeholder="请输入学时"></el-input>
        </el-form-item>
        <el-form-item label="课程性质" prop="courseNature">
          <el-select v-model="selectCourseNature" placeholder="请选择课程性质" >
                <el-option label="必修" value="必修"></el-option>
                <el-option label="选修" value="选修"></el-option>
                <el-option label="实验" value="实验"></el-option>
                <el-option label="实践" value="实践"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeName">
          <el-select v-model="selectcollege" placeholder="请选择学院" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="majorName">
          <el-select v-model="selectmajor" placeholder="请选择专业" @focus="getMajor()">
                <el-option v-for="(v, k) in majors" :key="k" :label="v.majorName" :value="v.majorNumber"></el-option>
              </el-select>
        </el-form-item>
        
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleAdd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="修改专业信息"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowEditDialog">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
       <el-form-item label="课程名" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名"></el-input>
        </el-form-item>
        <el-form-item label="课程号" prop="courseNumbers">
          <el-input v-model="form.courseNumber" placeholder="请输入课程编号"></el-input>
        </el-form-item>
        <el-form-item label="学分" prop="courseCredits">
          <el-input v-model="form.courseCredit" placeholder="请输入学分"></el-input>
        </el-form-item>
        <el-form-item label="学时" prop="courseHours">
          <el-input v-model="form.courseHour" placeholder="请输入学时"></el-input>
        </el-form-item>
        <el-form-item label="课程性质" prop="courseNature">
          <el-select v-model="selectCourseNature" placeholder="请选择课程性质" >
                <el-option label="必修" value="必修"></el-option>
                <el-option label="选修" value="选修"></el-option>
                <el-option label="实验" value="实验"></el-option>
                <el-option label="实践" value="实践"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeName">
          <el-select v-model="selectcollege" disabled placeholder="请选择学院" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="majorName">
          <el-select v-model="selectmajor"  placeholder="请选择专业" @focus="getMajor()">
                <el-option v-for="(v, k) in majors" :key="k" :label="v.majorName" :value="v.majorNumber"></el-option>
              </el-select>
        </el-form-item>
        

        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Table1 from "@/components/table/Table1";
  import {phone, email} from '@/assets/js/common/validate'

  export default {
    components: {
      Table1,
    },
    data() {
      var courseValidate = (rule, value, callback) => {
        let formData = new FormData();
        formData.append('courseNumber',value);
        this.$http.post("/TeacherSecretary/isExistsCourse", formData,{
          hideLoading:true,
        }).then(resu => {
          let body=resu.data;
          if(body.code == "200"){
            if (resu.data.data == 1) {
            callback(new Error("该课程编号已存在！"));
          } else {
            callback();
          }
          }else{
            this.$message.error(body.msg);
          }
        })
      };
      return {
        
        dict: this.$dict,
        keyword: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
        handlePage: 1,
        selection: [],
        tableData: [],
        selectcollege:"",
        college:[],
        majors:[],
        majorNumber:'',
        selectmajor:'',
        selectCourseNature:'',
        form: {
          courseNumber:'',
          courseName:'',
          courseNature:'',
          courseCredit:'',
          courseHour:'',
          majorNumber:'',
          collegeNumber:'',
          oldMajorNumber:'',
          oldCollegeNumber:'',
          oldCourseNumber:''
        },
        rules: {  
          // majorName: [
          //   {required: true, message: "请输入专业名", trigger: "blur"},
          //   {max: 30, message: "最大长度为 30 个字符", trigger: "blur"},
          // ],
          courseNumber: [
            {required: true, message: "请输入课程编号", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"},
            {validator: courseValidate, trigger: "blur" }
          ],
          courseName: [
            {required: true, message: "请输入课程名", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"}
          ],
          courseCredit: [
            {required: true, message: "请输入学分", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"}
          ],
          courseHour: [
            {required: true, message: "请输入学时", trigger: "blur"},
            {max: 30, message: "最大长度为 20 个字符", trigger: "blur"},
          ]
        },

        isShowAddDialog: false,
        isShowInfoDialog: false,
        isShowEditDialog: false,
        isShowPwdDialog: false
      };
    },
    created() {
      this.handleSearch();
      this.getMajor();
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
      }
    },
    methods: {
      getMajorNumber(couNum){
        let formData = new FormData();
        formData.append('courseNumber',couNum);
        this.$http
          .post("/TeacherSecretary/getMajorNumber",formData,
          {
            hideLoading:true,
          }
          )
          .then(res => {
            let body = res.data;
            if(body.code === "200"){
              this.selectmajor = body.data;
            }
          }
          )
      },
       showEdit(row){
        if(this.selectmajor == ""){
          this.getMajorNumber(row.courseNumber);
        }
        
        this.form.courseNumber= row.courseNumber;
        this.form.courseName = row.courseName;
        this.form.majorNumber = row.majorNumber;
        this.form.collegeNumber = row.selectcollege;
        this.selectCourseNature = row.courseNature;
        this.form.courseHour = row.courseHour;
        this.form.courseCredit = row.courseCredit;
        this.form.oldCourseNumber = row.courseNumber;
        this.isShowEditDialog = true;
       },
       handleSelectionChange(selection) {
        this.selection = [];
        selection.forEach(e => {
          this.selection.push(e.courseNumber);
        });
      },
          getParams () {
          this.token = window.sessionStorage.getItem("token");
          this.$nextTick(()=>{
            this.uploadURL = this.$http.defaults.baseURL + "/TeacherSecretary/excelAddStudent?token="+this.token;
          });
        },
          getCollege(){
          this.selectmajor = "";
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

      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.handleSearch();
      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum;
        this.handleSearch();
      },
      handleSearch() {
        var selectcollege = this.selectcollege;
        var selectmajor = this.selectmajor;

        if(selectmajor == ""){
          this.$http
          .get("/TeacherSecretary/selectCourseByCollege",{
            params:{
              collegeNumber:this.selectcollege,
              pageNum:this.pageNum,
              pageSize:this.pageSize
            }
          }
          )
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
        }else{
          this.$http
          .get("/TeacherSecretary/selectCourseByMajorNumber",{
            params:{
              collegeNumber:this.selectcollege,
              majorNumber:this.selectmajor,
              pageNum:this.pageNum,
              pageSize:this.pageSize
            }
          }
          )
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
      showAdd() {
        this.roleIdArr = [];
        this.droleIdArr = [];
        this.form = {
          majorName:'',
          majorNumber:'',
          collegeNumber:'',
          openYear:'',
          collegeName:''
        };
        this.isShowAddDialog = true;

        this.$nextTick(() => {
          this.$refs["addForm"].clearValidate();
        });
      },
      handleSave(){
        this.$refs["form"].validate((pass, o) => {
          if (pass) {
            let formData = new FormData();
            this.form.majorNumber = this.selectmajor;
            this.form.courseNature = this.selectCourseNature;
            this.$http.put("/TeacherSecretary/updateCourse", this.form).then(res => {
              let body = res.data;
              if (body.code === "200") {
                if(body.data >0){
                  this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowEditDialog = false;
                }else if(body.data <0){
                  this.$message({
                  message: "该课程号已存在",
                  type: "warning"
                });
                }

                this.handleSearch();
              } else {
                this.$message.error(body.msg);
              }
            });
          } else {
            this.$message.error("表单输入不正确");
          }
        });
      },

      //  批量删除
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
            .delete("/TeacherSecretary/deleteCourse", {
              params: {
                courseNumbers: this.selection.join()
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
                }else{ 
                  this.$message({
                  message: "已有学生选择该课",
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

      //添加
      handleAdd() {
        this.$refs["addForm"].validate((pass, o) => {
          if (pass) {
            let formData = new FormData();
            this.form.collegeNumber = this.selectcollege;
            this.form.courseNature = this.selectCourseNature;
            this.form.majorNumber = this.selectmajor;
            this.$http.put("/TeacherSecretary/addCourse", this.form).then(res => {
              let body = res.data;
              if (body.code === "200") {
                if(body.data >0){
                  this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowAddDialog = false;
                }else{
                  this.$message({
                  message: "该专业已存在",
                  type: "warning"
                });
                }
                this.handleSearch();
              } else {
                this.$message.error(body.msg);
              }
            });
          } else {
            this.$message.error("表单输入不正确");
          }
        });
      }
    }
  };
</script>
