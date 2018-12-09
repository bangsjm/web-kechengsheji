<!--<style>-->
<!--.mul_select input {-->
<!--height: auto !important;-->
<!--}-->
<!--</style>-->
<template>
  <div class="fill-page">
    <el-card class="fill-card">
      <table1 :data="tableData" style="height: 100%;" @selection-change="handleSelectionChange">
        <template slot="header">
          <el-row :gutter="10">
            <el-col :md="6">
              <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
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
          <el-table-column prop="userName" label="用户名">
          </el-table-column>
          <el-table-column prop="realName" label="真实姓名">
          </el-table-column>
          <el-table-column prop="userSex" label="性别">
            <template slot-scope="scope">
              <span>{{dict('sex',scope.row.userSex)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="所属单位">
          </el-table-column>
          <el-table-column prop="userPhone" label="联系电话">
          </el-table-column>
          <el-table-column prop="userEmail" label="邮箱">
          </el-table-column>
          <el-table-column prop="userAddress" label="地址">
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
                         @current-change="handleCurrentChange" :current-page.sync="handlePage">
          </el-pagination>
        </template>
      </table1>
    </el-card>

    <el-dialog title="新增"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowAddDialog">
      <el-form :model="form" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实名称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="关联单位" prop="unit">
          <el-select filterable v-model="form.unitId" placeholder="请选择关联单位" style="width: 100%;">
            <el-option v-for="item in unitList" :key="item.unitId" :label="item.unitName" :value="item.unitId">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="数据角色" prop="dataRole">
          <el-select style="width: 100%;" placeholder="请选择数据角色（可多选）" multiple v-model="droleIdArr">
            <el-option v-for="item in dataRoleList" :key="item.droleId" :label="item.droleName" :value="item.droleId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="权限" prop="role">
          <el-select style="width: 100%;" multiple v-model="roleIdArr" placeholder="请选择权限（可多选）">
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-select placeholder="请选择性别" style="width: 100%;" v-model="form.userSex">
            <el-option v-for="(v, k) in dict('sex')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="userPhone">
          <el-input v-model="form.userPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="userAddress">
          <el-input v-model="form.userAddress" placeholder="请输入地址"></el-input>
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
        <el-form-item label="用户名" prop="">
          <el-input v-model="form.userName" disabled="disabled" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实名称"></el-input>
        </el-form-item>
        <el-form-item label="关联单位" prop="unit">
          <el-select filterable v-model="form.unitId" placeholder="请选择关联单位" style="width: 100%;">
            <el-option v-for="(item,key) in unitList" :key="key" :label="item.unitName" :value="item.unitId">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="数据角色" prop="dataRole">
          <el-select style="width: 100%;" class="mul_select" placeholder="请选择数据角色（可多选）" multiple v-model="droleIdArr">
            <el-option v-for="(item,key) in dataRoleList" :key="key" :label="item.droleName" :value="item.droleId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="权限" prop="role">
          <el-select style="width: 100%;" class="mul_select" multiple v-model="roleIdArr" placeholder="请选择权限（可多选）">
            <el-option v-for="(item,key) in roleList" :key="key" :label="item.roleName" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-select placeholder="请选择性别" style="width: 100%;" v-model="form.userSex">
            <el-option v-for="(v, k) in dict('sex')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="userPhone">
          <el-input v-model="form.userPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="userAddress">
          <el-input v-model="form.userAddress" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
      var passwordValidate = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.form.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      };
      var userValidate = (rule, value, callback) => {
        this.$http.get("/user/userName", {
          params: {
            userName: value
          }
        }).then(resu => {
          if (resu.data.data.length != 0) {
            callback(new Error("该用户名已存在！"));
          } else {
            callback();
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
        unitList: [],
        roleList: [],
        dataRoleList: [],
        droleIdArr: [],
        roleIdArr: [],
        form: {
          roleIds: "",
          droleIds: "",
          userId: "",
          userName: "",
          realName: "",
          password: "",
          confirmPassword: "",
          userSex: null,
          userPhone: '',
          userBirth: '',
          userEmail: '',
          userAddress: '',
          unitId: '',
        },
        rules: {
          userName: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"},
            {validator: userValidate, trigger: "blur" }
          ],
          realName: [
            {required: true, message: "请输入真实姓名", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"}
          ],
          confirmPassword: [
            {required: true, message: "请再次输入密码", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"},
            {validator: passwordValidate, trigger: "blur"}
          ],
          userSex: [
            {required: true, message: "请选择性别", trigger: "blur"},
          ],
          userPhone: [
            {required: true, message: "请输入联系电话", trigger: "blur"},
            {max: 12, message: "最大长度为 12 个字符", trigger: "blur"},
            {pattern: phone, message: "手机号码格式不正确", trigger: "blur"}
          ],
          userEmail: [
            {required: true, message: "请输入邮箱", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"},
            {pattern: email, message: "邮箱格式不正确", trigger: "blur"}
          ],
        },

        isShowAddDialog: false,
        isShowInfoDialog: false,
        isShowEditDialog: false,
        isShowPwdDialog: false
      };
    },
    created() {
      this.handleSearch();
      this.getUnitList();
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
        this.getUnitList();
      }
    },
    methods: {
      handleSelectionChange(selection) {
        this.selection = [];
        selection.forEach(e => {
          this.selection.push(e.userId);
        });
      },
      showInfo(row) {
        this.getInfo(row.id, () => {
          this.isShowInfoDialog = true;
        });
      },
      showAdd() {
        this.roleIdArr = [];
        this.droleIdArr = [];
        this.form = {
          roleIds: "",
          droleIds: "",
          userId: "",
          userName: "",
          realName: "",
          password: "",
          confirmPassword: "",
          userSex: null,
          userPhone: '',
          userEmail: '',
          userAddress: '',
          unitId: '',
        };
        this.isShowAddDialog = true;

        this.$nextTick(() => {
          this.$refs["addForm"].clearValidate();
        });
      },
      getUnitList() {
        this.$http.get("/user/getUnitList").then(res => {
          let body = res.data;
          if (body.code === "200") {
            this.unitList = body.data;
          }
        })
        this.getRoleList();
      },
      getRoleList() {
        this.$http
          .get("/user/getRoleList")
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.roleList = body.data;
            }
          });
        this.getDataRoleList();
      },
      getDataRoleList() {
        this.$http
          .get("/user/getDataRoleList")
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.dataRoleList = body.data;
            }
          });
      },
      showEdit(row) {
        this.getInfo(row.userId, () => {
          this.isShowEditDialog = true;
          this.$nextTick(() => {
            this.$refs["form"].clearValidate();
          });
        });
      },
      showEditPwd(row) {
        this.form.userId = row.userId;
        this.isShowPwdDialog = true;
        this.$nextTick(() => {
          this.$refs["pwdForm"].clearValidate();
        });
      },
      handleEditPwd() {
        this.$refs["pwdForm"].validate((pass, o) => {
          if (pass) {
            this.isLoading = true;
            let formData = new FormData()
            formData.append('userId', this.form.userId)
            formData.append('password', this.form["password"])
            this.$http.post("/user/" + this.form.userId + "/password", formData, {
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
      //查询用户信息
      getInfo(id, cb) {
        this.$http.get("/user/" + id).then(res => {
          let body = res.data;
          if (body.code === "200") {
            let roleArr = [];
            let dataRoleArr = [];
            if (body.data.roleIds != null) {
              let userRoleArr = body.data.roleIds.split(',');
              for (let i in userRoleArr) {
                roleArr.push(parseInt(userRoleArr[i]));
              }
            }
            if (body.data.droleIds != null) {
              let userDataRoleArr = body.data.droleIds.split(',');
              for (let i in userDataRoleArr) {
                dataRoleArr.push(parseInt(userDataRoleArr[i]));
              }
            }
            this.droleIdArr = dataRoleArr;
            this.roleIdArr = roleArr;
            this.form = {
              userId: body.data.userId,
              userName: body.data.userName,
              realName: body.data.realName,
              userSex: body.data.userSex + "",
              userPhone: body.data.userPhone,
              userEmail: body.data.userEmail,
              userAddress: body.data.userAddress,
              unitId: body.data.unitId,
            };
            cb();
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
        this.$http
          .get("/user", {
            params: {
              keyword: this.keyword,
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
            .delete("/user?", {
              params: {
                deleteIds: this.selection.join()
              }
            })
            .then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.handleSearch();
              } else {
                this.$message.error(body.msg);
              }
            });
        });
      },
      //编辑
      handleSave() {
        this.$refs["form"].validate((pass, o) => {
          if (pass) {
            let roleIds = this.roleIdArr.join(",");
            let droleIds = this.droleIdArr.join(",");
            this.form.roleIds = roleIds;
            this.form.droleIds = droleIds;
            this.$http.put("/user", this.form).then(res => {
              let body = res.data;

              if (body.code === "200") {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowEditDialog = false;
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
      //添加
      handleAdd() {
        this.$refs["addForm"].validate((pass, o) => {
          if (pass) {
            let formData = new FormData();
            let roleIds = this.roleIdArr.join(",");
            let droleIds = this.droleIdArr.join(",");
            this.form.roleIds = roleIds;
            this.form.droleIds = droleIds;
            console.log(this.form);

            this.$http.post("/user", this.form).then(res => {
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
      }
    }
  };
</script>
