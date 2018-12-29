<template>
  <div class="login">
    <el-row class="fill-page">
      <el-col :lg="{ span: 6, push: 14 }" :md="{ span: 6, push: 14 }" :sm="{ span: 10, push: 7 }" :xs="{ span: 16, push: 4 }" style="display: flex; height: 100%;justify-content: center;flex-direction: column;">
        <div class="login-body">
          <div class="logo">
            <!-- <img src="../assets/logo.png" height="80" width="80" /> -->
            <div style="text-align: center">学了么选课系统</div>
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
          <div class="login-log" >
            <el-checkbox v-model="isAutoLogin" checked="checked" style="color: #fff; font-weight: 200;">自动登录</el-checkbox>
           <el-button style="float: right; padding: 0; font-size: 14px;" type="text" @click.native="forgot">忘记密码</el-button>
          </div>
          <div class="selectRadio" style="float:right ">
            <el-radio-group v-model="identity" >
              <el-radio :label="1"><span class="word">学生</span></el-radio>
              <el-radio :label="2"><span class="word">教师</span></el-radio>
              <el-radio :label="3"><span class="word">教学秘书</span></el-radio>
             

            </el-radio-group>
          </div>
          <div>
            <el-button class = "loginButton" type="primary" style=" width:100%; outline:none; background-color: rgb(219, 143, 55)  font-size: 14px; height: 35px; line-height: 35px; padding: 0"
                       @click.native="login" v-loading.fullscreen.lock="isLoading">登录
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="忘记密码" custom-class="el-col el-col-xs-20 el-col-xs-offset-2 el-col-sm-20 el-col-sm-offset-2 el-col-md-12 el-col-md-offset-6 el-col-lg-12 el-col-lg-offset-6" :visible.sync="isShowForgotDialog" @close="handleDialogClose">
      <el-form :model="forgetform" :rules="forgetrules" ref="forgetFrom" label-width="100px">
        <el-form-item label="邮箱" prop="email">
          <el-col  :lg="{ span: 18 }" :md="{ span: 18 }" :sm="{ span: 18 }" :xs="{ span: 18 }">
          <el-autocomplete @select="handleSelect"
           style="width: 100%;" placeholder="请输入邮箱地址" v-model="forgetform.email" :fetch-suggestions="emailAutoComplete" :trigger-on-focus="false"></el-autocomplete>
          </el-col>
           <el-col  :lg="{ span: 2 }" :md="{ span: 2 }" :sm="{ span: 2}" :xs="{ span: 2 }">
          <input size="mini"  type="button" id="btn" class="button blue medium" value="免费获取验证码" @click="sendemail" >
          </el-col>
          </el-form-item>
        <el-form-item label="验证码" prop="word">
          <el-input  v-model="forgetform.word"  placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input type="password" v-model="forgetform.newpassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newconfirmPassword">
          <el-input type="Password" v-model="forgetform.newconfirmPassword" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="forgetall">取 消</el-button>
        <el-button type="primary" @click="checkemail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.word{
  color: #fff;
  font-color: #fff;
}
.loginButton{
  background-color:#CD835F
}
.login-body {
  padding: 25px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.3);
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
.selectRadio{
  padding-right: 1px;
  font-color:#00ffff;
}
.autoLogin{
  padding-top:0px;
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
.button {
	display: inline-block;
	outline: none;
	cursor: pointer;
	text-align: center;
	text-decoration: none;
	font: 16px/100% 'Microsoft yahei',Arial, Helvetica, sans-serif;
	padding: .5em 2em .55em;
	text-shadow: 0 1px 1px rgba(0,0,0,.3);
	-webkit-border-radius: .5em; 
	-moz-border-radius: .5em;
	border-radius: .5em;
	-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
	-moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);
	box-shadow: 0 1px 2px rgba(0,0,0,.2);
}
.medium {
	font-size: 12px;
	padding: .4em 1.5em .42em;
}
.button:hover {
	text-decoration: none;
}
.button:active {
	position: relative;
	top: 1px;
}
.blue {
	color: #d9eef7;
	border: solid 1px #0076a3;
	background: #409EFF;
	background: -webkit-gradient(linear, left top, left bottom, from(#00adee), to(#0078a5));
	background: -moz-linear-gradient(top,  #00adee,  #0078a5);
	filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#00adee', endColorstr='#0078a5');
}
.blue:hover {
	background: #007ead;
	background: -webkit-gradient(linear, left top, left bottom, from(#0095cc), to(#00678e));
	background: -moz-linear-gradient(top,  #0095cc,  #00678e);
	filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#0095cc', endColorstr='#00678e');
}
.blue:active {
	color: #80bed6;
	background: -webkit-gradient(linear, left top, left bottom, from(#0078a5), to(#00adee));
	background: -moz-linear-gradient(top,  #0078a5,  #00adee);
	filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#0078a5', endColorstr='#00adee');
}


</style>


<script>
  import {getAllDict} from "@/lib/dict";
  import {email} from '@/assets/js/common/validate'
  export default {
    name: "Login",
    data() {
      var passwordValidate = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.forgetform.newpassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      }
      return {

        msg: "登录页面",
        isAutoLogin: false,
        userName: "",
        password: "",
        isLoading: false,
        identity:1,
        forgetform:{
         email: "",
         word:"",
         newpassword:"",
         newconfirmPassword:"",
        },
        forgetrules:{
          newpassword: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"}
          ],
          newconfirmPassword: [
            {required: true, message: "请再次输入密码", trigger: "blur"},
            {max: 100, message: "最大长度为 100 个字符", trigger: "blur"},
            {validator: passwordValidate, trigger: "blur"}
          ],
          email:[
            {required: true, message: "请输入邮箱", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"},
            {pattern: email, message: "邮箱格式不正确", trigger: "blur"}
          ],
          word:[
            {required: true, message: "请输入验证码", trigger: "blur"},
            {min:6, max: 6, message: "长度为 6 个字符", trigger: "blur"},
           
          ],
        },
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
      handleSelect(){
        this.$refs["forgetFrom"].clearValidate();
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
        formData.append('identity', this.identity)
        formData.append('token', this.token)
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
            window.sessionStorage.setItem("identity",body.data.identity);
            window.sessionStorage.setItem("roleIds",body.data.roleIds);
            window.sessionStorage.setItem("droleIds",body.data.identity);
            this.$http.defaults.headers.common['X-Auth-Token'] = body.data.token
            if(body.data.roleIds==1){
               this.$router.push('/student/SearchScore');
            }else if(body.data.roleIds==2){
               this.$router.push('/teacher/TimeTableSearch');
            }else{
              this.$router.push('/TeacherSecretary/ProfessionalManage');
            }
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

      sendemail() {
        let formData = new FormData();
        formData.append('email', this.forgetform.email);
        formData.append('change',this.identity);
        this.$http.post("/update/sendemail", formData, {hideLoading: true,})
        .then(res => {

          let body = res.data;
          if (body.data < 0) {
                  this.$message.error("该用户不存在，请查实");
                  this.isShowPwdDialog = false;} 
          if (body.data > 0) {
          this.$message({
                    message: "发送成功",
                    type: "success"
                     });
          }
        });


        var wait=60; 
        function time(o) { 
         if (wait == 0) { 
            o.removeAttribute("disabled");           
            o.value="免费获取验证码"; 
            wait = 60; 
        } else { 
            o.setAttribute("disabled", true); 
            o.value=wait+"秒后可以重新发送"; 
            wait--; 
            setTimeout(function() { 
                time(o) 
            }, 
            1000) 
          } 
        }
       document.getElementById("btn").onclick=function(){
         time( document.getElementById("btn"));
         } 
        time( document.getElementById("btn"));
      },

      checkemail(){
        let formData = new FormData();
        formData.append('word', this.forgetform.word);
        formData.append('email', this.forgetform.email);
        this.$http.post("/update/chackemail", formData, {hideLoading: true,})
        .then(res => {
              let body = res.data;
              if (body.data === 7)
              {
               this.$message.error("验证码错误");    
              }else{
              this.$refs["forgetFrom"].validate((pass, o) => {
              if (pass) {
              let formData = new FormData();
              formData.append('email', this.forgetform.email);
              formData.append('newpassword', this.forgetform.newpassword);
              formData.append('change',this.identity);
              formData.append('word', this.forgetform.word);
              this.$http.post("/update/updateteacherpassword", formData, {hideLoading: true,})
            .then(res => {
                let body = res.data;
                  if (body.code === "200") {
                    this.$message({
                    message: "修改成功",
                    type: "success"
                     });
                  this.isShowPwdDialog = false;} 
                  
                  else {
                  this.$message.error(body.msg);}
             });
             
            } 
            else {this.$message.error("表单输入不正确");}
          });
              }  
               });
               

      },

      
      forgot() {
       if(this.identity==3){
         this.isShowForgotDialog = false,
         this.$message.error("教学秘书无法进行该操作");}
        else this.isShowForgotDialog = true;
      },

      forgetall() {
        
         this.forgetform.email="",
         this.forgetform.word="",
         this.forgetform.newpassword="",
         this.forgetform.newconfirmPassword="",
         this.isShowForgotDialog = false;
         this.$refs["forgetFrom"].clearValidate();
      },
      forgethandleEditforget() {
          this.$refs["forgetFrom"].validate((pass, o) => {
            if (pass) {
              let formData = new FormData();
              formData.append('email', this.forgetform.email);
              formData.append('newpassword', this.forgetform.newpassword);
              formData.append('change',this.identity);
              formData.append('word', this.forgetform.word);
              this.$http.post("/update/updateteacherpassword", formData, {hideLoading: true,})
            .then(res => {
                let body = res.data;
                  if (body.code === "200") {
                    this.$message({
                    message: "修改成功",
                    type: "success"
                     });
                  this.isShowPwdDialog = false;} 
                  if (body.code === "10001") {
                  this.$message.error("该用户不存在，请查实");
                  this.isShowPwdDialog = false;} 
                  else {
                  this.$message.error(body.msg);}
             });
             
            } 
            else {this.$message.error("表单输入不正确");}
          });
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
      
      handleDialogClose() {
        
         this.forgetform.email="",
         this.forgetform.word="",
         this.forgetform.newpassword="",
         this.forgetform.newconfirmPassword="",
         this.isShowForgotDialog = false;
         this.$refs["forgetFrom"].clearValidate();
      }
    }
  };
</script>

