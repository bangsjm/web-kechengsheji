<template>
  <div class="login">
    <el-row class="fill-page">
      <el-col :lg="{ span: 6, push: 14 }" :md="{ span: 6, push: 14 }" :sm="{ span: 10, push: 7 }" :xs="{ span: 16, push: 4 }" style="display: flex; height: 100%;justify-content: center;flex-direction: column;">
        <div class="login-body">
          <div class="logo">
            <!-- <img src="../assets/logo.png" height="80" width="80" /> -->
            <div style="text-align: center">大学生选课系统</div>
          </div>
          <div class="login-item" style="background: #fff; border-radius: 4px; margin-bottom: 15px;">
            <div style="border-bottom: 1px solid #ccc">
              <div style="text-align: center; width: 45px; height: 35px; line-height: 35px; float: left; color: #00a1fd">
                <i class="fa fa-user" style="width: 22px; height: 22px; font-size: 20px; position: relative; top: 2px;"></i>
              </div>
              <div style="padding: 0px 4px 0 45px; width: 100%;">
                <input type="text" v-model="userName" @keyup.enter="focusToPwdInput" placeholder="请输入用户名">
              </div>
            </div>
            <div>
              <div style="text-align: center; width: 45px; height: 35px; line-height: 35px; float: left; color: #00a1fd">
                <i class="fa fa-lock" style="width: 22px; height: 22px; font-size: 20px; position: relative; top: 2px;"></i>
              </div>
              <div style="padding: 0px 4px 0px 45px; width: 100%;">
                <input type="password" ref="pwdinput" v-model="password" @keyup.enter="login" placeholder="请输入密码">
              </div>
            </div>
          </div>
          <div class="selectIdenty">   
            <el-radio-group v-model="identy">
              <el-radio :label="1">教学秘书</el-radio>
              <el-radio :label="2">教师</el-radio>
              <el-radio :label="3">学生</el-radio>
            </el-radio-group>
          </div>
          <div class="login-log">
            <el-checkbox v-model="isAutoLogin" checked="checked"  style="color: #fff; font-weight: 200;">自动登录</el-checkbox>
            <el-button style="float: right; padding: 0; font-size: 14px;" type="text" @click.native="forgot">忘记密码</el-button>         
          </div>
          <div>
            <el-button type="primary" style="width:100%; background-color:rgb(219,143,55);font-size: 14px; height: 35px; line-height: 35px; padding: 0"
                       @click.native="login" v-loading.fullscreen.lock="isLoading">登录
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="注册新用户" custom-class="el-col el-col-xs-20 el-col-xs-offset-2 el-col-sm-20 el-col-sm-offset-2 el-col-md-12 el-col-md-offset-6 el-col-lg-12 el-col-lg-offset-6" :visible.sync="isShowForgotDialog" @close="handleDialogClose">
      <el-form label-width="40px">
        <el-form-item label="邮箱">
          <el-autocomplete style="width: 100%;" placeholder="请输入邮箱地址" v-model="forgotEmail" :fetch-suggestions="emailAutoComplete" :trigger-on-focus="false" @select="handleACSelect"></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowForgotDialog = false">取 消</el-button>
        <el-button type="primary" @click="isShowForgotDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.login-body {
  padding: 25px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.login {
  position: absolute;
  background-image: url(../assets/background.jpg);
  background-size: cover;
  width: 100%;
  height: 100%;
}

.login-item input {
  height: 35px;
  border: none;
  /* line-height: 35px; */
  padding: 0;
  outline: none;
  width: 100%;
  font-size: 12px;
}

.logo {
  width: 100%;
  font-weight: 200;
  font-size: 18px;
  text-align: center;
  margin-bottom: 15px;
  color: #fff;
}

.login-log {
  padding-left: 1px;
  margin-bottom: 15px;
}
.login-log .el-checkbox__label {
  font-size: 12px;
}
.selectIdenty .el-radio__label{
  margin-top: -5px;
  font-size: 12px;
  color: #fff;
}
</style>


<script>

  import {getAllDict} from "@/lib/dict";

  export default {
    name: "Login",
    data() {
      return {

        msg: "登录页面",
        isAutoLogin: false,
        userName: "",
        password: "",
        isLoading: false,
        identy:3,
        forgotEmail: "",
        isShowForgotDialog: false
      };
    },
    created() {
      this.init();
    },
    mounted() {
    },
    methods: {
      focusToPwdInput () {
        this.$refs.pwdinput.focus()
      },
      login() {
        if (!this.userName || !this.password) {
          this.$message({
            showClose: true,
            message: "请输入用户名和密码",
            type: "error"
          });
          return;
        }
        this.isLoading = true;
        let formData = new FormData()
        formData.append('userName', this.userName)
        formData.append('password', this.password)
        this.$http.post("/auth/login", formData, {
          hideLoading: true,
        }).then(res => {
          this.isLoading = false
          let body = res.data;
          if (body.code === "200") {
            this.$message({
              showClose: true,
              message: "登录成功",
              type: "success",
              duration: 600
            });
            if (this.isAutoLogin) {
              //let base64 = new Base64();
              window.localStorage.setItem("isStore", "yes");
              window.localStorage.setItem("userName", this.userName);
              window.localStorage.setItem("password", this.password);
            } else {
              window.localStorage.removeItem("isStore");
              window.localStorage.removeItem("userName");
              window.localStorage.removeItem("password");
            }
            window.sessionStorage.setItem("userName", this.userName);
            window.sessionStorage.setItem("realName", body.data.realName);
            window.sessionStorage.setItem("token", body.data.token);
            window.sessionStorage.setItem("roleIds",body.data.roleIds);
            window.sessionStorage.setItem("droleIds",body.data.droleIds);
            this.$http.defaults.headers.common['X-Auth-Token'] = body.data.token
            this.$router.push('/index');
            // getAllDict();
            //login
          } else {
            this.$message({
              showClose: true,
              message: "用户名或密码错误",
              type: "error"
            });
          }
        });
      },
      init() {
        let isStore = window.localStorage.getItem("isStore");
        console.log(isStore);
        if ("yes" == isStore) {
          this.userName = window.localStorage.getItem("userName");
          this.password = window.localStorage.getItem("password");
          this.isAutoLogin = true
        }
      },
      forgot() {
        this.isShowForgotDialog = true;
      },
      emailAutoComplete(qs, cb) {
        if (qs.indexOf("@") >= 0) {
          cb([]);
          return;
        }
        var result = [];
        var email = [
          "@qq.com",
          "@163.com",
          "@126.com",
          "@outlook.com",
          "@foxmail.com"
        ];
        for (var i in email) {
          result.push({
            value: qs + email[i]
          });
        }
        cb(result);
      },
      handleACSelect(e) {
        this.forgotEmail = e.value;
      },
      handleDialogClose() {
        this.forgotEmail = "";
      }
    }
  };
</script>
