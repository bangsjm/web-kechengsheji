<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <!-- <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" style="height: 100%; "> -->
      <table2 :data="tableData" style="height: 100%;" @selection-change="handleSelectionChange">
       <template slot="header">
         <el-row :gutter="10">
            <el-col :md="3">
              <el-select v-model="selectcollege" placeholder="请选择学院" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectmajor" placeholder="请选择专业" @focus="getMajor()">
                <el-option v-for="(v, k) in majors" :key="k" :label="v.majorName" :value=v.majorNumber></el-option>
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
          <el-table-column prop="teacherNumber" label="教工号">
          </el-table-column>
          <el-table-column prop="teacherName" label="姓名">
          </el-table-column>
          <el-table-column prop="hiredate" label="入职时间">
          </el-table-column>
          <el-table-column prop="prof" label="职称">
          </el-table-column>
          <el-table-column prop="email" label="邮箱">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="resetPwd(scope.row)">重置密码</el-button>
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

    <el-dialog title="新增"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowAddDialog">
      <el-form :model="form" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="教工号" prop="teacherNumber">
          <el-input v-model="form.teacherNumber" placeholder="请输入教工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="collegeNumber">
          <el-select v-model="selectcollege" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="majorNumber">
          <el-select v-model="selectmajor" @focus="getMajor()">
                <el-option v-for="(v, k) in majors" :key="k" :label="v.majorName" :value="v.majorNumber"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="sure_password">
          <el-input type="password" v-model="form.sure_password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="hiredate">
          <el-input v-model="form.hiredate" placeholder="请输入入职时间 例如2018-05-17"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="prof">
        <el-select v-model="form.prof" placeholder="请选择职称">
                <el-option label="讲师" value="讲师"></el-option>
                <el-option label="教师" value="教师"></el-option>
                <el-option label="教授" value="教授"></el-option>
                <el-option label="副教授" value="副教授"></el-option>
        </el-select>
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
      <el-form :model="form" :rules="rules1" ref="form" label-width="80px">
        <el-form-item label="教工号" prop="otherteacherNumber">
          <el-input v-model="form.otherteacherNumber" disabled="disabled" placeholder="请输入教工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="collegeNumber">
          <el-select v-model="selectcollege" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value=v.collegeNumber></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="majorNumber">
          <el-select v-model="selectmajor" @focus="getMajor()" >
                <el-option v-for="v in majors" :key="v.majorNumber" :label="v.majorName" :value="v.majorNumber+''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" prop="hiredate">
          <el-input v-model="form.hiredate" placeholder="请输入入职时间 例如****-**-**"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="prof">
        <el-select v-model="form.prof" placeholder="请选择职称">
                <el-option label="讲师" value="讲师"></el-option>
                <el-option label="教师" value="教师"></el-option>
                <el-option label="教授" value="教授"></el-option>
                <el-option label="副教授" value="副教授"></el-option>
        </el-select>
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
  import {phone, email} from '@/assets/js/common/validate'
  export default {
    name: "teacherManage",
    components: {
      Table2
    },
    data() {
      // 用户名查重验证
      var userValidate = (rule, value, callback) => {
        let formData = new FormData();
        formData.append('teacherNumber',value);
        this.$http.post("/TeacherSecretary/Teacherinfo", formData,{
          hideLoading: true,
        }).then(resu => {
          if (resu.data.data!= null) {
            callback(new Error("该教工号已存在！"));
          } else {
            callback();
          }
        })
      };
      // 确认密码验证
      var passwordValidate = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.form.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      };
      // 邮箱唯一验证
      var emailValidate = (rule, value, callback) => {
        let formData = new FormData();
        formData.append('email',value);
        this.$http.post("/TeacherSecretary/Emailinfo", formData,{
          hideLoading: true,
        }).then(res => {
          if (res.data.data===null||res.data.data==="") {
                        callback();

          } else {
                        callback(new Error("该邮箱已存在！"));
          }
        })
      };
      var emailValidateTeacherNumber = (rule, value, callback) => {
        let formData = new FormData();
        formData.append('email',value);
        this.$http.post("/TeacherSecretary/emailValidateTeacherNumber", formData,{
          hideLoading: true,
        }).then(res => {
          if (res.data.data===this.form.otherteacherNumber||res.data.data===null) {
                        callback();

          } else {
                        callback(new Error("该邮箱已存在！"));
          }
        })
      };
      // 日期格式验证
      var hiredateValidate = (rule, value, callback) => {
         if (value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/) === null) {
          callback(new Error("日期格式错误"));
        }else {
          callback();
        }
      };
      return {
        pageNum: 1,
        pageSize: 10,
        selectcollege:"",
        selectmajor:"",
        tableData:[],
        selection:[],
        college:[],
        majors:[],
        form:{
          selectcollege:"",
          selectmajor:"",
          teacherNumber: "",
          otherteacherNumber:"",
          teacherName:"",
          password:"",
          sure_password:"",
          hiredate:"",
          prof:"",
          email:"",
        },
        rules: {
          teacherNumber: [
            {required: true, message: "请输入教工号", trigger: "blur"},
            {max: 10, message: "最大长度为 10 个字符", trigger: "blur"},
            {validator: userValidate, trigger: "blur" }
          ],
          teacherName: [
            {required: true, message: "请输入姓名", trigger: "blur"},
            {max: 20, message: "最大长度为 20 个字符", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {max: 20, message: "最大长度为 20 个字符", trigger: "blur"}
          ],
          sure_password: [
            {required: true,message:"请再次输入密码",trigger:"blur"},
            {max: 20, message: "最大长度为 20 个字符", trigger: "blur"},
            {validator: passwordValidate, trigger: "blur"}
          ],
          hiredate: [
            {required: true, message: "请输入入职时间", trigger: "blur"},
            {max: 100, message: "最大长度为 8 个字符", trigger: "blur"},
            {validator: hiredateValidate, trigger: "blur"}
          ],
          email: [
            {required: true, message:"请输入邮箱", trigger:"blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"},
            {pattern: email, message: "邮箱格式不正确", trigger: "blur"},
            {validator: emailValidate, trigger: "blur"},
          ],
        },
        
        rules1: {
          teacherName: [
            {required: true, message: "请输入姓名", trigger: "blur"},
            {max: 20, message: "最大长度为 20 个字符", trigger: "blur"}
          ],
          hiredate: [
            {required: true, message: "请输入入职时间", trigger: "blur"},
            {max: 100, message: "最大长度为 8 个字符", trigger: "blur"},
            {validator: hiredateValidate, trigger: "blur"}
          ],
          email: [
            {required: true, message:"请输入邮箱", trigger:"blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"},
            {pattern: email, message: "邮箱格式不正确", trigger: "blur"},
            {validator: emailValidateTeacherNumber, trigger: "blur"},
          ],
        },
        isShowAddDialog:false,
        isShowEditDialog:false,
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
        getCollege(){
          this.selectcollege="",
          this.selectmajor="",
          this.college=[];
          this.majors = "";
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
        // 显示添加表单
        showAdd() {
        this.form = {
          selectcollege:this.selectcollege,
          selectmajor:this.selectmajor,
          teacherNumber: "",
          teacherName:"",
          password:"",
          sure_password:"",
          hiredate:"",
          prof:"",
          email:"",
        };
        this.isShowAddDialog = true;

        this.$nextTick(() => {
          this.$refs["addForm"].clearValidate();
        });
      },
      // 显示编辑菜单
      showEdit(row) {
        this.getMajor();
        this.isShowEditDialog=true;
        this.form={
              otherteacherNumber: row.teacherNumber,
              teacherName: row.teacherName,
              hiredate:row.hiredate,
              email:row.email,
              prof:row.prof,
              selectcollege:this.selectcollege,
        };
        let formData=new FormData();
        formData.append('otherTeacherNumber',row.teacherNumber);
        formData.append('collegeNumber',this.selectcollege);
        this.$http.post("/TeacherSecretary/Teacherupdatecheck", formData).then(res => {
              let body = res.data;
              if (body.code === "200") {
              this.selectmajor=body.data.majorNumber;
              } 
            });
         this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      },
      // 重置密码
      resetPwd(row) {
        let formData=new FormData();
        formData.append('teacherNumber',row.teacherNumber);
        
            this.$confirm("此操作将重置密码, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.post("/TeacherSecretary/resetpassword",formData
        ).then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.$message({
                  message: "密码重置成功",
                  type: "success"
                });
              } else {
                this.$message.error(body.msg);
              }
            });
        });
      },
      // 查询教师信息
      handleSearch() {
        this.$http
          .get("/TeacherSecretary/Teacher", {
            params: {
              selectmajor:this.selectmajor,
              selectcollege:this.selectcollege,
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
              this.handlePage = 1;
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
      // 添加保存
      handleAdd() {
        this.$refs["addForm"].validate((pass, o) => {
          if (pass) {
            let formData = new FormData();
            this.form.selectcollege=this.selectcollege;
            this.form.selectmajor=this.selectmajor;
            console.log(this.form);

            this.$http.post("/TeacherSecretary/TeacherAdd", this.form).then(res => {
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
      // 编辑保存
      handleSave() {
        
        this.$refs["form"].validate((pass, o) => {
          if (pass) {
            this.form.selectmajor = this.selectmajor;
            this.form.selectcollege = this.selectcollege;
            this.$http.put("/TeacherSecretary/Teacherupdate", this.form).then(res => {
              let body = res.data;
              if (body.code === "200"&&body.data===1) {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowEditDialog = false;
                this.handleSearch();
              }else if(body.data===2){
               this.$message.error("该老师已有教学课程");
              } 
              else {
                this.$message.error(body.msg);
              }
            });
          } else {
            this.$message.error("表单输入不正确");
          }
        });
      },
      handleSelectionChange(selection) {

        this.selection = [];
        selection.forEach(e => {
          this.selection.push(e.teacherNumber);
        });
      },
      // 删除教师
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
            .delete("/TeacherSecretary/Teacherdelete", {
              params: {
                teacherNumbers: this.selection.join()
              }
            })
            .then(res => {
              let body = res.data;
              if (body.code==="200"&&body.data===0) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.handleSearch();
              }
              else if(body.data===1){
                this.$message.error("无法删除老师");
              }
              else{
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