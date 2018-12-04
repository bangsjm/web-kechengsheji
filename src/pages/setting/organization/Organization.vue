<template>
  <div ref="moduleTem" class="fill-page">
    <el-row :gutter="6" class="fill-page">
      <el-col :md="5" class="fill-page">
        <no-title-page-card style="padding: 6px 6px;">
          <el-input slot="notscoll" style="margin-bottom: 6px;" placeholder="请输入查询内容" v-model="searchInput"></el-input>
          <el-tree slot="scoll" highlight-current :filter-node-method="filterNode" :data="selectTreeData"
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
                <el-form-item label="组织编号" prop="orgCode">
                  <el-input placeholder="请输入组织编号" v-model="form.orgCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="组织名称" prop="orgName">
                  <el-input placeholder="请输入组织名称" v-model="form.orgName"></el-input>
                </el-form-item>
                <el-form-item label="所属组织" prop="pid">
                  <el-input placeholder="请选择所属组织" v-model="form.pOrgName" @focus="showMenu" readonly
                            id="selectModule"></el-input>
                  <div id="menuContent" class="menuContent" v-show="showMenuContent" ref="tree3"
                       style="position: absolute;background-color: #fff; z-index:10;width: 100%; height: 400px;overflow: auto">
                    <el-tree slot="scoll" highlight-current :filter-node-method="filterNode" :data="selectTreeData"
                             :props="defaultProps" @node-click="handleSelectTreeNodeClick" default-expand-all></el-tree>
                  </div>
                </el-form-item>
                <el-form-item label="组织描述" prop="orgDesc">
                  <el-input type="textarea" placeholder="请输入组织描述" v-model="form.orgDesc"></el-input>
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
        <el-form-item label="组织编号" prop="addOrgCode">
          <el-input placeholder="请输入组织编号" v-model="addForm.addOrgCode"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="orgName">
          <el-input placeholder="请输入组织名称" v-model="addForm.orgName"></el-input>
        </el-form-item>
        <el-form-item label="所属组织">
          <el-input placeholder="请输入组织名称" v-model="addForm.pOrgName" disabled></el-input>
        </el-form-item>
        <el-form-item label="组织描述" prop="orgDesc">
          <el-input type="textarea" placeholder="请输入组织描述" v-model="addForm.orgDesc"></el-input>
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
      var orgCodeRepeat = (rule, value, callback) => {
        this.$http.get("/organization/getOrgCode", {
          params: {
            orgCode: value
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
          orgId: "",
          orgName: "",
          orgCode: "",
          pOrgName: "",
          pid: '',
          orgDesc: '',
        },
        addForm: {
          orgId: "",
          orgName: "",
          addOrgCode: "",
          pOrgName: "",
          pid: '',
          orgDesc: '',
        },
        rules: {
          orgName: [
            {required: true, message: "请输入组织名称", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"}
          ],
          orgCode: [
            {required: true, message: "请输入组织编号", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"}
          ],
          addOrgCode: [
            {required: true, message: "请输入组织编号", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"},
            {validator: orgCodeRepeat, trigger: "blur"}
          ],
          pid: [
            {required: true, message: "请选择所属组织", trigger: "blur"},
          ],
          orgDesc: [
            {max: 200, message: "最大长度为 200 个字符", trigger: "blur"}
          ],
        },
      };
    },
    created() {
      this.getOrgTree();
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
        this.getOrgTree();
      }
      this.$nextTick(() => {
        this.getOrgTree();
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
      getOrgTree() {
        this.$http
          .get("/organization/tree", {
            params: {
              keyword: ""
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.treeData = body.data;
              this.selectTreeData = [{"id": "0", "name": "根", "children": []}];
              for (let i in this.treeData) {
                this.selectTreeData[0].children.push(this.treeData[i]);
              }
            }

          });
      },
      handleTreeNodeClick(o) {
        this.$set(this.form, "orgId", parseInt(o.id));
        this.handleSearch();
      },
      handleSelectTreeNodeClick(o) {
        this.$set(this.form, "pid", parseInt(o.id));
        this.$set(this.form, "pOrgName", o.name);
        this.hideMenu();
        this.$nextTick(() => {
          this.$refs["form"].validateField("pid");
        });
      },
      handleSearch() {
        this.$http
          .get("/organization/" + this.form.orgId, {
            params: {
              moduleId: this.form.moduleId
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              if (body.data == null) {
                this.form = {
                  orgId: "0",
                  orgName: "根节点",
                  orgCode: "根",
                  pOrgName: "无",
                  pid: "0",
                  orgDesc: "根节点",
                };
              } else {
                this.form = {
                  orgId: body.data.orgId,
                  orgName: body.data.orgName,
                  orgCode: body.data.orgCode,
                  pOrgName: body.data.porgName == null ? "根" : body.data.porgName,
                  pid: body.data.pid,
                  orgDesc: body.data.orgDesc,
                };
                this.$nextTick(() => {
                  this.$refs["form"].validateField("pid");
                  this.$refs["form"].validateField("orgName");
                  this.$refs["form"].validateField("orgCode");
                });
              }
            }
          });
      },
      handleUpdate() {
        this.$refs["form"].validate((pass, o) => {
          if (pass) {
            if (this.form.pid == this.form.orgId) {
              this.$message.error("请选择正确的父节点");
            } else {
              this.$http.put("/organization", this.form).then(res => {
                let body = res.data;
                if (body.code === "200") {
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                  this.getOrgTree();
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
            .delete("/organization", {
              params: {
                orgId: this.form.orgId
              }
            })
            .then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$refs["form"].resetFields();
                this.handleSearch();
                this.getOrgTree();
              } else {
                this.$message.error(body.msg);
              }
            });
        });
      },

      showAdd() {
        if (this.form.orgId == "") {
          this.$message.error("请选择父节点");
        } else {
          this.addForm = {
            orgId: this.form.orgId,
            orgName: "",
            addOrgCode: "",
            pOrgName:this.form.orgName,
            pid: '',
            orgDesc: '',
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
            this.$http.post("/organization", this.addForm).then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowAddDialog = false;
                this.form = {
                  orgId: "",
                  orgName: "",
                  orgCode: "",
                  pOrgName: "",
                  pid: '',
                  orgDesc: '',
                },
                  this.getOrgTree();
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
