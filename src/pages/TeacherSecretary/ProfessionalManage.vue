<template>
  <div class="fill-page">
    <el-card class="fill-card">
      <table1 :data="tableData" style="height: 100%;" @selection-change="handleSelectionChange">
        <template slot="header">
          <el-row :gutter="10">
             <el-col :md="6">
              <el-select v-model="selectcollege" placeholder="请选择学院" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
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
          <el-table-column prop="majorNumber" label="专业编号">
          </el-table-column>
          <el-table-column prop="majorName" label="专业名称">
          </el-table-column>
           <el-table-column prop="collegeName" label="所属学院">
          </el-table-column>
          <el-table-column prop="openYear" label="开设年份">
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

    <el-dialog title="添加专业"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowAddDialog">
      <el-form :model="form" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="专业名" prop="majorName">
          <el-input v-model="form.majorName" placeholder="请输入专业名"></el-input>
        </el-form-item>
        <el-form-item label="专业编号" prop="majorNumber">
          <el-input v-model="form.majorNumber" placeholder="请输入专业编号"></el-input>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeName">
          <el-select v-model="selectcollege" placeholder="请选择学院" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="开设年份" prop="openYear">
          <el-input v-model="form.openYear" placeholder="请输入入学年份"></el-input>
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
        <el-form-item label="专业名" prop="majorName">
          <el-input v-model="form.majorName" placeholder="请输入专业名"></el-input>
        </el-form-item>
        <el-form-item label="专业编号" prop="majorNumber">
          <el-input v-model="form.majorNumber" placeholder="请输入专业编号"></el-input>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeName">
          <el-select v-model="selectcollege" disabled placeholder="请选择学院" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="开设年份" prop="openYear">
          <el-input v-model="form.openYear" placeholder="请输入入学年份"></el-input>
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
        form: {
          oldMajorNumber:'',
          majorName:'',
          majorNumber:'',
          collegeNumber:'',
          openYear:'',
          collegeName:''
        },
        rules: {  
          majorName: [
            {required: true, message: "请输入专业名", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"},
          ],
          majorNumber: [
            {required: true, message: "请输入专业编号", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"}
          ],
          openYear: [
            {required: true, message: "请输入开设年份", trigger: "blur"},
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
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
      }
    },
    methods: {
       showEdit(row){
        this.isShowEditDialog = true;
        this.form.majorName = row.majorName;
        this.form.oldMajorNumber = row.majorNumber;
        this.form.majorNumber = row.majorNumber;
        this.form.collegeNumber = row.selectcollege;
        this.form.openYear = row.openYear;
       },
       handleSelectionChange(selection) {
        this.selection = [];
        selection.forEach(e => {
          this.selection.push(e.majorNumber);
        });
      },
          getParams () {
          this.token = window.sessionStorage.getItem("token");
          this.$nextTick(()=>{
            this.uploadURL = this.$http.defaults.baseURL + "/TeacherSecretary/excelAddStudent?token="+this.token;
          });
        },
          getCollege(){
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
        this.$http
          .get("/TeacherSecretary/ProfessionalManage",{
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
            this.form.collegeNumber = this.selectcollege;
            this.$http.put("/TeacherSecretary/updateMajor", this.form).then(res => {
              let body = res.data;
              if (body.code === "200") {
                if(body.data ==2){
                  this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowEditDialog = false;
                }else if(body.data == 0){
                  this.$message({
                  message: "该专业编号已存在",
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
            .delete("/TeacherSecretary/deleteMajor?", {
              params: {
                collegeNumber:this.selectcollege,
                majorNumbers: this.selection.join()
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

      //添加
      handleAdd() {
        this.$refs["addForm"].validate((pass, o) => {
          if (pass) {
            let formData = new FormData();
            this.form.collegeNumber = this.selectcollege;
            this.$http.put("/TeacherSecretary/addMajor", this.form).then(res => {
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
