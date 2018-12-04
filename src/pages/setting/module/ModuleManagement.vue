<template>
  <div ref="moduleTem" class="fill-page">
    <el-row :gutter="6" class="fill-page">
      <el-col :md="5" class="fill-page">
        <no-title-page-card style="padding: 6px 6px;">
          <el-input slot="notscoll" style="margin-bottom: 6px;" placeholder="请输入查询内容" v-model="searchInput"></el-input>
          <el-tree slot="scoll" highlight-current :filter-node-method="filterNode" :data="treeData"
                   :props="defaultProps" @node-click="handleTreeNodeClick" default-expand-all ref="tree2"></el-tree>
        </no-title-page-card>
      </el-col>
      <el-col :md="19" class="fill-page">
        <el-card class="fill-card">
          <div slot="header">
          </div>
          <page-card>
            <template slot="body">
              <el-form :model="form" :rules="rules" ref="form" label-width="200px" style="max-width: 700px;">
                <el-form-item label="模块名称" prop="moduleName">
                  <el-input placeholder="请输入模块名称" v-model="form.moduleName"></el-input>
                </el-form-item>
                <el-form-item label="模块图标" prop="icon">
                  <el-input placeholder="请输入模块图标" v-model="form.icon"></el-input>
                </el-form-item>
                <el-form-item label="模块标识" prop="controlId">
                  <el-input placeholder="请输入模块标识" v-model="form.controlId"></el-input>
                </el-form-item>
                <el-form-item label="模块类型" prop="type">
                  <el-select placeholder="请选择模块类型" style="width: 100%;" v-model="form.type" id="selectType">
                    <el-option v-for="(v, k) in dict('moduleType')" :key="k" :label="v.name"
                               :value="v.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属模块" prop="pid">
                  <el-input placeholder="请选择所属模块" v-model="form.pModuleName" @focus="showMenu" readonly
                            id="selectModule"></el-input>
                  <div id="menuContent" class="menuContent" v-show="showMenuContent" ref="tree3"
                       style="position: absolute;background-color: #fff; z-index:10;width: 100%; height: 400px;overflow: auto">
                    <el-tree slot="scoll" highlight-current :filter-node-method="filterNode" :data="selectTreeData"
                             :props="defaultProps" @node-click="handleSelectTreeNodeClick" default-expand-all></el-tree>
                  </div>
                </el-form-item>
                <el-form-item label="优先级" prop="priority">
                  <el-select placeholder="请选择优先级" style="width: 100%;" v-model="form.priority">
                    <el-option v-for="(v, k) in dict('priority')" :key="k" :label="v.name" :value="v.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select placeholder="请选择状态" style="width: 100%;" v-model="form.status">
                    <el-option v-for="(v, k) in  dict('status')" :key="k" :label="v.name" :value="v.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="模块描述" prop="moduleDesc">
                  <el-input type="textarea" placeholder="请输入模块描述" v-model="form.moduleDesc"></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-button type="success" size="small" @click="handleUpdate">保存</el-button>
                  <el-button type="primary" size="small" @click="showAdd">添加</el-button>
                  <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
                </el-form-item>
              </el-form>
            </template>
          </page-card>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="新增"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowAddDialog">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" style="max-width: 700px;">
        <el-form-item label="模块名称" prop="moduleName">
          <el-input placeholder="请输入模块名称" v-model="addForm.moduleName"></el-input>
        </el-form-item>
        <el-form-item label="模块图标" prop="icon">
          <el-input placeholder="请输入模块图标" v-model="addForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="模块标识" prop="addControlId">
          <el-input placeholder="请输入模块标识" v-model="addForm.addControlId"></el-input>
        </el-form-item>
        <el-form-item label="模块类型" prop="type">
          <el-select placeholder="请选择模块类型" style="width: 100%;" v-model="addForm.type" id="selectType">
            <el-option v-for="(v, k) in dict('moduleType')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属模块" prop="moduleName">
          <el-input placeholder="请选择所属模块" v-model="addForm.pModuleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select placeholder="请选择优先级" style="width: 100%;" v-model="addForm.priority">
            <el-option v-for="(v, k) in dict('priority')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select placeholder="请选择状态" style="width: 100%;" v-model="addForm.status">
            <el-option v-for="(v, k) in dict('status')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块描述" prop="moduleDesc">
          <el-input type="textarea" placeholder="请输入模块描述" v-model="addForm.moduleDesc"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleAdd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Table1 from "@/components/table/Table1";
  import TreeSelector from "@/components/selector/TreeSelector";
  import NoTitlePageCard from "@/components/card/NoTitlePageCard";
  import PageCard from "@/components/card/PageCard";


  export default {
    components: {
      NoTitlePageCard,
      PageCard,
      Table1,
      TreeSelector
    },
    data() {
      let controlIdRepeat = (rule, value, callback) => {
        this.$http.get("/module/getControlId", {
          params: {
            moduleId: this.form.moduleId,
            controlId: value
          }
        }).then(resu => {
          if (resu.data.data != null) {
            callback(new Error("该标识已存在"));
          } else {
            callback();
          }
        })
      };
      let updateControlId = (rule, value, callback) => {
        this.$http.get("/module/getControlId", {
          params: {
            moduleId: this.form.moduleId,
            controlId: value
          }
        }).then(resu => {
          if (resu.data.data != null) {
            callback(new Error("该标识已存在"));
          } else {
            callback();
          }
        })
      };
      return {
        dict: this.$dict,

        moduleTem: "",

        searchInput: "",
        treeData: [],
        selectTreeData: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        showMenuContent: false,
        isShowAddDialog: false,

        form: {
          moduleId: "",
          moduleName: "",
          pModuleName: "",
          icon: "",
          controlId: "",
          type: "",
          pid: '',
          priority: '',
          status: '',
          moduleDesc: '',
        },
        addForm: {
          moduleId: "",
          moduleName: "",
          pModuleName: "",
          icon: "",
          addControlId: "",
          type: "",
          pid: '',
          priority: '',
          status: '',
          moduleDesc: '',
        },
        rules: {
          moduleName: [
            {required: true, message: "请输入模块名称", trigger: "blur"},
            {min: 1, max: 50, message: "最大长度为 50 个字符", trigger: "blur"}
          ],
          controlId: [
            {required: true, message: "请输入模块标识", trigger: "blur"},
            {min: 1, max: 50, message: "最大长度为 50 个字符", trigger: "blur"},
            {validator: updateControlId, trigger: "blur"}
          ],
          addControlId: [
            {required: true, message: "请输入模块标识", trigger: "blur"},
            {min: 1, max: 50, message: "最大长度为 50 个字符", trigger: "blur"},
            {validator: controlIdRepeat, trigger: "blur"}
          ],
          type: [
            {required: true, message: "请选择模块类型", trigger: "blur"},
          ],
          pid: [
            {required: true, message: "请选择所属模块", trigger: "blur"},
          ],
          priority: [
            {required: true, message: "请选择优先级", trigger: "blur"},
          ],
          status: [
            {required: true, message: "请选择状态", trigger: "blur"},
          ],
          moduleDesc: [
            {max: 200, message: "最大长度为 200 个字符", trigger: "blur"}
          ],
          icon: [
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"}
          ],
        },
      };
    },
    created() {
      let roleIds=window.sessionStorage.getItem("roleIds");
      let droleIds=window.sessionStorage.getItem("droleIds");
      this.getModuleTree(roleIds,droleIds);
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
        let roleIds=window.sessionStorage.getItem("roleIds");
        let droleIds=window.sessionStorage.getItem("droleIds");
        this.getModuleTree(roleIds,droleIds);
      }
      this.$nextTick(() => {
        let roleIds=window.sessionStorage.getItem("roleIds");
        let droleIds=window.sessionStorage.getItem("droleIds");
        this.getModuleTree(roleIds,droleIds);
        this.$refs["form"].resetFields();
      });
    },
    watch: {
      searchInput(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      showMenu: function () {
        this.showMenuContent = true;
        this.$refs.tree3.addEventListener("mousedown", function (event) {
          event.cancelBubble = true;
          event.stopPropagation();
        });
        document.body.addEventListener("mousedown", this.hideMenu);

      },
      hideMenu: function () {
        this.showMenuContent = false;
        this.$refs.tree3.removeEventListener("mousedown", function (event) {
          event.cancelBubble = true;
          event.stopPropagation();
        });
        document.body.removeEventListener("mousedown", this.hideMenu);

      },

      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getModuleTree(roleIds,droleIds) {
        this.$http
          .get("/module/tree", {
            params: {
              keyword: "",
              roleIds:roleIds,
              droleIds:droleIds
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.treeData=[{"id": "0", "name": "根", "children": []}];
              for(let i in body.data){
                this.treeData[0].children.push(body.data[i]);
              }
             // this.treeData = body.data;
              this.selectTreeData = this.treeData
             /* for (let i in this.treeData) {
                this.selectTreeData[0].children.push(this.treeData[i]);
              }*/
            }

          });
      },
      handleTreeNodeClick(o) {
        this.$set(this.form, "moduleId", parseInt(o.id));
        this.$set(this.form, "moduleName", o.name);
        this.handleSearch();

      },
      handleSelectTreeNodeClick(o) {
        this.$set(this.form, "pid", parseInt(o.id));
        this.$set(this.form, "pModuleName", o.name);
        this.$nextTick(() => {
          this.$refs["form"].validateField("pid");
        });
        this.hideMenu();
      },
      handleSearch() {
        this.$http
          .get("/module/" + this.form.moduleId, {
            params: {
              moduleId: this.form.moduleId
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              if (body.data != null) {
                this.form = {
                  moduleId: body.data.moduleId,
                  moduleName: body.data.moduleName,
                  pModuleName: body.data.pmoduleName == null ? "根" : body.data.pmoduleName,
                  icon: body.data.icon,
                  controlId: body.data.controlId,
                  type: body.data.type + '',
                  pid: body.data.pid,
                  priority: body.data.priority + '',
                  status: body.data.status + '',
                  moduleDesc: body.data.moduleDesc,

                };
                this.$nextTick(() => {
                  this.$refs["form"].validateField("pid");
                  this.$refs["form"].validateField("moduleName");
                  this.$refs["form"].validateField("controlId");
                });
              }
            }
          });
      },
      handleUpdate() {
        this.$refs["form"].validate((pass, o) => {
          if (pass) {
            if (this.form.pid == this.form.moduleId) {
              this.$message.error("请选择正确的父节点");
            } else {
              this.$http.put("/module", this.form).then(res => {
                let body = res.data;
                if (body.code === "200") {
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                  this.form = {
                    moduleId: "",
                    moduleName: "",
                    pmoduleName: "",
                    icon: "",
                    controlId: "",
                    type: "",
                    pid: '',
                    priority: '',
                    status: '',
                    moduleDesc: '',
                  },
                  this.getModuleTree();
                  this.handleSearch();
                } else {
                  this.$message.error(body.msg);
                }
              });
            }
          } else {
            this.$message.error("表单输入不正确");
          }
        })
      },
      handleDelete() {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http
            .delete("/module", {
              params: {
                moduleId: this.form.moduleId
              }
            })
            .then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.form = {
                  moduleId: "",
                  moduleName: "",
                  pmoduleName: "",
                  icon: "",
                  controlId: "",
                  type: "",
                  pid: '',
                  priority: '',
                  status: '',
                  moduleDesc: '',
                },
                this.$refs["form"].resetFields();
                this.handleSearch();
                this.getModuleTree();
              } else {
                this.$message.error(body.msg);
              }
            });
        });
      },

      showAdd() {
        if (this.form.moduleId === "") {
          this.$message.error("请选择父节点");
        } else {
          this.addForm = {
            moduleId: this.form.moduleId,
            moduleName: "",
            pModuleName: this.form.moduleName,
            icon: "",
            addControlId: "",
            type: "",
            pid: '',
            priority: '',
            status: '',
            moduleDesc: '',
          };
          this.isShowAddDialog = true;

          this.$nextTick(() => {
            this.$refs["addForm"].clearValidate();
          });
        }

      },
      handleAdd() {
        this.$refs["addForm"].validate((pass, o) => {
          if (pass) {
            this.$http.post("/module", this.addForm).then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowAddDialog = false;
                this.form = {
                  moduleId: "",
                  moduleName: "",
                  pmoduleName: "",
                  icon: "",
                  controlId: "",
                  type: "",
                  pid: '',
                  priority: '',
                  status: '',
                  moduleDesc: '',
                },
                  this.getModuleTree();
              } else {
                this.$message.error(body.msg);
              }
            });
          } else {
            this.$message.error("表单输入不正确");
          }
        })
      }
      ,
    }
  }
  ;
</script>
