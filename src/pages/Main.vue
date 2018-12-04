<template>
  <div>
    <el-container class="main-container">
      <transition name="el-fade-in-linear">
        <el-aside class="main-aside" width="auto" v-show="isShowMenu">
          <el-menu style="height: 100%; border: none" class="side-menu" :unique-opened="true" :collapse="isCollapseMenu"
                   background-color="#3c619d" text-color="#C8D5F8" active-text-color="#F2EDE6"
                   :default-active="defaultMenuItem" @select="handleMenuSelect">
            <div style="background: #2f4c7b;">
              <div style="height: 50px; padding: 5px; text-align: center;">
                <img height="44.66" width="100" src="../assets/login_logo.png">
              </div>
            </div>
            <nav-menu-item v-for="(item, i) in menu" :key="i" :menu="item"></nav-menu-item>
          </el-menu>
        </el-aside>
      </transition>
      <el-container>
        <el-header height="50px" class="main-header">
          <div class="header-left">
            <div class="header-btn" @click="handleMenuBtnClick">
              <img style="position: relative; top: 4px;" width="21" height="21"
                   :src="isShowMenu ? menufold : menuunfold" alt="">
            </div>
          </div>
          <div class="header-center">
            <!-- <div v-show="isShowTitle" style="font-size: 20px; height: 20px; padding-top: 16px;">{{title}}</div> -->
          </div>
          <div class="header-right">
            <!-- <div style="display: inline-block;background: #bcd5f9; height: 54px; margin: 3px 0; width: 1px;"></div> -->
            <!-- <el-dropdown>
              <div class="header-btn">
                <el-badge :value="3" :max="99">
                  <i class="fa fa-bell" style="position: relative; top: 2px;"></i>
                </el-badge>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>2018-02-28系统维护通知</el-dropdown-item>
                <el-dropdown-item>2018-02-28系统维护通知</el-dropdown-item>
                <el-dropdown-item>2018-02-28系统维护通知</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <!-- <div style="display: inline-block;background: #bcd5f9; height: 54px; margin: 3px 0; width: 1px;"></div> -->
            <el-dropdown>
              <div class="header-btn">
                <div>
                  <i class="fa fa-user" style="position: relative; top: 5px;font-size: 26px;"></i>&nbsp;
                  <span>{{realName}}</span>
                </div>
              </div>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>系统设置</el-dropdown-item> -->
                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main id="main">
          <keep-alive>
            <router-view v-if="!!$route.meta.keepAlive" class="cache">
              <!-- 这里是会被缓存的视图组件 -->
            </router-view>
          </keep-alive>

          <router-view v-if="!$route.meta.keepAlive" class="nocache">
            <!-- 这里是不被缓存的视图组件 -->
          </router-view>
        </el-main>
      </el-container>
      <transition name="el-fade-in-linear">
        <div class="main-mask" v-if="isShowMenu" @click="handleMaskClick"></div>
      </transition>
    </el-container>
  </div>
</template>

<style>
  .side-menu:not(.el-menu--collapse) {
    width: 185px;
    min-height: 400px;
  }

  .main-container {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .main-header {
    border-bottom: 1px solid #ebeef5;
  }

  .header-left {
    position: absolute;
    margin-left: -20px;
  }

  .header-right {
    position: absolute;
    right: 0;
    top: 0;
  }

  .header-center {
    height: 50px;
    text-align: center;
  }

  .header-btn {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    vertical-align: middle;
    float: left;
    cursor: pointer;
  }

  .header-btn i {
    color: rgb(60, 97, 157);
    font-size: 22px;
  }

  .header-btn .el-badge__content {
    position: absolute !important;
    top: 15px !important;
  }

  .header-btn:hover {
    color: #409eff;
    background-color: #ecf5ff;
  }

  .user-btn:hover {
    color: #409eff;
    background-color: #ecf5ff;
  }

  #main {
    background: #f1f6ff;
    padding: 6px;
    height: 100%;
  }

  @media screen and (max-width: 768px) {
    .main-aside {
      position: fixed;
      z-index: 1000;
      top: 0;
      bottom: 0;
      left: 0;
    }

    .main-mask {
      display: block !important;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 999;
      background: rgba(0, 0, 0, 0.5);
    }

    #main {
      padding: 0 !important;
    }
  }

  .main-mask {
    display: none;
  }
</style>


<script>
  import menuunfold from "@/assets/img/icon/menuunfold.png";
  import menufold from "@/assets/img/icon/menufold.png";
  import NavMenuItem from "@/components/navmenu/NavMenuItem";
  import {findInTree} from "@/assets/js/common/tree";

  export default {
    name: "Main",
    components: {
      NavMenuItem
    },
    data() {
      return {
        token:'',
        menuunfold,
        menufold,
        isCollapseMenu: false,
        isShowMenu: true,
        isShowTitle: true,
        title: "",
        menu: [],
        defaultMenuItem: "",
        realName: '',
      };
    },
    created() {

      let token = window.sessionStorage.getItem("token");
      let roleIds=window.sessionStorage.getItem("roleIds");
      let droleIds=window.sessionStorage.getItem("droleIds");
      this.token=token;
      if (!token) {
        this.$router.push({name: "登录"});
        return;
      }
      this.realName = window.sessionStorage.getItem("realName");
      this.$http.defaults.headers.common["X-Auth-Token"] = token;

      this.isShowMenu = window.innerWidth > 768;
      window.addEventListener("resize", e => {
        this.isShowMenu = window.innerWidth > 768;
      });
      this.getModuleTree(roleIds,droleIds);

    },
    methods: {
      getModuleTree(roleIds,droleIds) {
        this.$allDict();
        this.$http
          .get("/module/moduleTree", {
            params: {
              keyword: "",
              roleIds:roleIds,
              droleIds:droleIds,
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.menu = body.data;
              this.menuShow();
            }
          });
      },
      menuShow() {
        let i = this.$route.matched.length;
        while (i--) {
          let item = findInTree(
            this.menu,
            "name",
            this.$route.matched[i].name,
            "children"
          );
          if (!!item) {
            this.title = item.name;
            this.defaultMenuItem = item.name;
            break;
          }
        }
        if (!this.defaultMenuItem) {
          this.title = "首页";
          this.defaultMenuItem = "首页";
          this.$router.push({name: "首页"});
          return;
        }
      },
      logout() {
        this.$http
          .get("/auth/logout", {
            params: {
              token: this.token
            }
          }).then(res => {

          let body = res.data;
          if (body.code === "200") {
            window.sessionStorage.clear();
            this.$router.push("/login");
          }
        });
      },
      handleMenuSelect(key, keyPath) {
        // let item = findInTree(this.menu, "index", key, "children");

        // console.log(this.$route);
        if (this.$route.name === this.title) {
          this.$route.meta.keepAlive = false;
          this.$router.push({name: key});
          this.$nextTick(() => {
            this.$route.meta.keepAlive = true;
          });
        } else {
          this.$router.push({name: key});
        }

        this.defaultMenuItem = key;
        this.title = key;
      },
      handleMenuBtnClick() {
        // if (window.innerWidth <= 768) {
        //   this.isCollapseMenu = false;
        //   this.isShowMenu = !this.isShowMenu;
        // } else {
        //   this.isShowMenu = true;
        //   this.isCollapseMenu = !this.isCollapseMenu;
        // }
        this.isShowMenu = !this.isShowMenu;
      },
      handleMaskClick() {
        this.isShowMenu = false;
      }
    }
  };
</script>
