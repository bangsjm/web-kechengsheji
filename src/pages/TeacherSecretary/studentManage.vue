<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" style="height: 100%;" @selection-change="handleSelectionChange">
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
              <el-select v-model="selectclass" placeholder="请选择班级" @focus="getClass()" no-data-text="暂无班级">
                <el-option v-for="(v, k) in classes" :key="k" :label="v.className" :value="v.className"></el-option>
              </el-select>
            </el-col>

            <el-col :md="15" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
              <el-button type="success" size="normal" icon="el-icon-circle-plus" @click="showAdd"></el-button>
              <el-button type="warning" size="normal" icon="el-icon-delete" @click="handleDelete"></el-button>
              <el-upload ref="upload"
                style="float: right;padding-left: 5px"
                :action="uploadURL"
                multiple
                :limit="1"
                :show-file-list="false"
                accept=".xls,.xlsx"
                :before-upload="beforeUpload"
                :on-error="handleError"
                :on-success="handleSuccess">
                  <el-button type="primary"  size="normal" icon="fa fa-cloud-upload	"></el-button>
              </el-upload>
            </el-col>
          </el-row>
       </template>

       <template slot="columns">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column prop="studentNumber" label="学号">
          </el-table-column>
          <el-table-column prop="studentName" label="学生姓名">
          </el-table-column>
          <el-table-column prop="sex" label="性别">
          </el-table-column>
          <el-table-column prop="email" label="邮箱">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="showEditPwd(scope.row)">修改密码</el-button>
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

    <el-dialog title="修改密码"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowPwdDialog">
      <el-form :model="form" :rules="rules" ref="pwdForm" label-width="80px">
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleEditPwd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

<el-dialog title="新增"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowAddDialog">
      <el-form :model="form" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="姓名" prop="studentName">
          <el-input v-model="form.studentName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="studentNumber">
          <el-input v-model="form.studentNumber" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select placeholder="请选择性别" style="width: 100%;" v-model="form.sex">
            <el-option  label="男" value="男"></el-option>
            <el-option  label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入学年" prop="entranceYear">
          <el-input v-model="form.entranceYear" placeholder="请输入入学年"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="form.grade" placeholder="请输入年级"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleAdd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

      <el-dialog title="编辑"
              custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
              :visible.sync="isShowEditDialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px">
          <el-form-item label="学号" prop="studentNumber">
            <el-input v-model="form.studentNumber" placeholder="请输入学号"></el-input>
          </el-form-item>
          <el-form-item label="学生姓名" prop="studentName">
            <el-input v-model="form.studentName" disabled="disabled" placeholder="请输入学生姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别 " prop="sex">
            <el-input v-model="form.sex" disabled="disabled" placeholder="请选择学生性别"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="0" class="dialog-btn-group">
            <el-button type="success" size="small" @click="handleSave">保存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table1";
  import {email} from '@/assets/js/common/validate'

  export default {
    name: "studentManage",
    components: {
      Table2
    },
    data() {
      
      var passwordValidate = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.form.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      };
      var isStudentNumberExists=(rule, value, callback) => {
        let formData = new FormData()
        formData.append('studentNumber',value)
        this.$http.post("/TeacherSecretary/isStudentNumberExists",formData,{
                hideLoading:true,
              }).then(res => {
          let body = res.data;
          if (body.code === "200") {
            if(body.data==1){
              callback(new Error("该学号已存在"));
            }else{
              callback();
            }
          } else {
            this.$message.error(body.msg);
          }
        });
      };
      return {
        selectcollege:"",
        selectmajor:"",
        selectclass:"",
        college:[],
        majors:[],
        classes:[],
        uploadURL:"",
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        handlePage: 1,
        searchNumber:"",
        isShowPwdDialog:false,
        isShowEditDialog:false,
        isShowAddDialog: false,
        selection:[],
        form: {
          studentName: "",
          studentNumber: "",
          oldstudentNumber:"",
          sex: "",
          email: "",
          password:"",
          grade:"",
          entranceYear:"",
          confirmPassword:"",
        },
        rules: {
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"}
          ],
          studentName: [
            {required: true, message: "请输入姓名", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"}
          ],
          studentNumber: [
            {required: true, message: "请输入学号", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"},
            {validator: isStudentNumberExists, trigger: "blur"}
          ],
          sex: [
            {required: true, message: "请选择性别", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"}
          ],
          entranceYear: [
            {required: true, message: "请输入入学年份", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"},
          ],
          grade: [
            {required: true, message: "请输入年级", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"},
            {pattern: "[1-4]", message: "请输入正确年级", trigger: "blur"}
          ],
          confirmPassword: [
            {required: true, message: "请再次输入密码", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"},
            {validator: passwordValidate, trigger: "blur"}
          ],
          email:[
            {required: true, message: "请输入邮箱", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"},
            {pattern: email, message: "邮箱格式不正确", trigger: "blur"}
          ],
        },
      };
    },
    created() {
      this.getParams();
    },
    activated() {
      if (!!this.$route.params.refresh) {
      }
      this.$nextTick(() => {
        this.getParams();
      });
    },
    methods: {
        handleSelectionChange(selection) {
          this.selection = [];
          selection.forEach(e => {
            this.selection.push(e.studentNumber);
          });
        },
        handleSizeChange(pageSize) {
          this.pageSize = pageSize;
          this.handleSearch();
        },
        handleCurrentChange(pageNum) {
          this.pageNum = pageNum;
          this.handleSearch();
        },
        getParams () {
          this.token = window.sessionStorage.getItem("token");
          this.$nextTick(()=>{
            this.uploadURL = this.$http.defaults.baseURL + "/TeacherSecretary/excelAddStudent?token="+this.token;
          });
        },
        
      showAdd() {
        this.form = {
          studentName: "",
          studentNumber: "",
          oldstudentNumber:"",
          sex: "",
          email: "",
          password:"",
          grade:"",
          entranceYear:"",
          confirmPassword:"",
        };
        this.isShowAddDialog = true;
        this.$nextTick(() => {
          this.$refs["addForm"].clearValidate();
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
              .delete("/TeacherSecretary/deleteStudent", {
                params: {
                  deleteStudentNumbers: this.selection.join()
                }
              })
              .then(res => {
                let body = res.data;
                if (body.code === "200") {
                  if(body.data==1){
                  this.$message({
                    message: "删除成功",
                    type: "success"
                  });
                  this.handleSearch();
                  }else{
                    this.$message({
                    message: "该学生已选课，不能删除！",
                    type: "warning"
                  });
                  }
                } else {
                  this.$message.error(body.msg);
                }
              });
          });
        },
        showEdit(row) {
            this.form.studentName=row.studentName;
            this.form.oldStudentNumber=row.studentNumber;
            this.form.studentNumber=row.studentNumber;
            this.form.sex=row.sex;
            this.form.email=row.email;
            this.$nextTick(() => {
            this.$refs["form"].clearValidate();
          });
            this.isShowEditDialog = true;
        },
            
          handleAdd() {
            this.$refs["addForm"].validate((pass, o) => {
              if (pass) {
                this.$http.post("/TeacherSecretary/addStudentSingal", this.form).then(res => {
                  let body = res.data;
                  if (body.code === "200") {
                    this.$message({
                      message: "保存成功",
                      type: "success"
                    });
                    this.isShowAddDialog = false;
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
        handleEditPwd() {
          this.$refs["pwdForm"].validate((pass, o) => {
            if (pass) {
              this.isLoading = true;
              let formData = new FormData()
              formData.append('studentNumber', this.form.studentNumber)
              formData.append('password', this.form.password)
              this.$http.post("/TeacherSecretary/resetPassword", formData, {
                hideLoading: true,
              }).then(res => {
                this.isLoading = false
                let body = res.data;
                if (body.code === "200") {
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                  this.isShowPwdDialog = false;
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
        showEditPwd(row) {
          this.form.studentNumber = row.studentNumber;
          this.isShowPwdDialog = true;
          this.$nextTick(() => {
            this.$refs["pwdForm"].clearValidate();
          });
        },
        
        handleSave() {
          this.$refs["form"].validate((pass, o) => {
            if (pass) {
              this.$http.put("/TeacherSecretary/resetInformation", this.form).then(res => {
                let body = res.data;
                if (body.code === "200") {
                    if(body.data==1){
                      this.$message({
                        message: "保存成功",
                        type: "success"
                      });
                      this.isShowEditDialog = false;
                    }else if(body.data==0){
                        this.$message({
                        message: "该学号已存在",
                        type: "warning"
                      });
                    }else{
                        this.$message({
                        message: "该学生已经选课，不能更改学号",
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
        getClass(){
          this.selectclass="";
          this.classes = [];
          let formData = new FormData()
          formData.append('collegeNumber', this.selectcollege)
          formData.append('majorName',this.selectmajor)
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
        beforeUpload(file) {
          const isLt5M = file.size / 1024 / 1024 < 5;
          if (!isLt5M) {
            this.$message.warning('上传文件大小不能超过 5MB!');
            return false;
          }
        },
        handleError() {
        this.$message.warning(`上传失败`);
        },     
        handleSuccess(){
          this.$message.success(`上传成功`);
          this.$refs.upload.clearFiles();
        },
        
        handleSearch() {
          var selectclass=this.selectclass;
          if(selectclass!=""){
          var year=selectclass.substring(selectclass.length-3,selectclass.length-1);
          var classNumber='0'+selectclass.charAt(selectclass.length-1);
          this.searchNumber=year+this.selectcollege+this.selectmajor+classNumber;
          }else{
            this.searchNumber=this.selectcollege+this.selectmajor;
          }
          this.$http
            .get("/TeacherSecretary/search", {
              params: {
                searchNumber:this.searchNumber,
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
      }
  }
</script>
<style scoped>
</style>