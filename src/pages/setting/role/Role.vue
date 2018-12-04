<template>
  <div class="fill-page">
    <el-card class="fill-card">
      <table1 :data="tableData" style="height: 100%;" @selection-change="handleSelectionChange">
        <template slot="header">
          <el-row :gutter="10">
            <el-col :md="6">
              <el-input placeholder="请输入权限名称" v-model="keyword"></el-input>
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
          <el-table-column prop="roleName" label="权限名称">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">{{ scope.row.roleName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="roleDesc" label="描述">
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span>{{dict('status',scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showControl(scope.row)">操作</el-button>
            </template>
          </el-table-column>
        </template>
        <template slot="footer">
          <el-pagination layout="pager, sizes, jumper" :total="total" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
          </el-pagination>
        </template>
      </table1>
    </el-card>

    <el-dialog title="新增"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowAddDialog">
      <el-form :model="form" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="权限名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入权限名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select placeholder="请选择状态" style="width: 100%;" v-model="form.status">
            <el-option v-for="(v, k) in  dict('status')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input type="textarea" v-model="form.roleDesc" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleAdd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="编辑"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowEditDialog">
      <el-form :model="form" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="权限名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入权限名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select placeholder="请选择状态" style="width: 100%;" v-model="form.status">
            <el-option v-for="(v, k) in  dict('status')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input type="textarea" v-model="form.roleDesc" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="编辑权限"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowEditRoleDialog">
      <el-form ref="roleForm" label-width="80px">
        <el-form-item label="权限名称">
          <el-input v-model="roleForm.roleName" placeholder="请输入权限名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限编辑">
          <div id="menuContent" class="menuContent" ref="treeDiv"
               style="background-color: #fff; z-index:10;width: 100%; max-height: 500px; overflow: auto;padding-top: 8px">
            <el-tree ref="tree3" highlight-current :data="treeData" default-expand-all
                     :props="defaultProps" show-checkbox node-key="id"></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="saveCheckedKeys">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Table1 from "@/components/table/Table1";

  export default {
    name: "Role",
    components: {
      Table1
    },
    data() {
      return {
        dict: this.$dict,
        keyword: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userId: '',
        tableData: [],
        selection: [],
        treeData: [],
        checkArr: [],
        RoleId: "",
        defaultProps: {
          children: "children",
          label: "name"
        },
        moduleIdArr: [],
        form: {
          roleId: "",
          roleName: "",
          roleDesc: "",
          status: "",
        },
        roleForm: {
          roleName: '',
        },
        rules: {
          roleName: [
            {required: true, message: "请输入角色名称", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"}
          ],
          status: [
            {required: true, message: "请选择状态", trigger: "blur"},
          ],
          roleDesc: [
            {max: 200, message: "最大长度为 200 个字符", trigger: "blur"}
          ],
        },
        isShowAddDialog: false,
        isShowEditDialog: false,
        isShowEditRoleDialog: false
      };

    },
    created() {
      this.handleSearch();
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
      }
      this.$nextTick(() => {
        this.handleSearch();
      });
    },
    methods: {
      handleAdd() {
        this.$refs["addForm"].validate((pass, o) => {
          let aaa = this;
          if (pass) {
            this.$http.post("/role/post", this.form).then(res => {
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
      showAdd() {
        this.form = {
          roleId: "",
          roleName: "",
          roleDesc: "",
          status: "",
        };
        this.isShowAddDialog = true;

        this.$nextTick(() => {
          this.$refs["addForm"].clearValidate();
        });
      },
      showEdit(row) {
        this.getInfo(row.roleId, () => {
          this.isShowEditDialog = true;
          this.$nextTick(() => {
            this.$refs["addForm"].clearValidate();
          });
        });
      },
      showControl(row) {
        this.getTree(row.roleId);
        this.RoleId = row.roleId;
        this.isShowEditRoleDialog = true;
        this.roleForm = {
          roleName: row.roleName,
        }
      },
      getTree(id) {
        this.$http
          .get("/role/getTree/" + id, {
            params: {
              roleId: id
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.treeData = body.data;
              this.checkArr = [];
              this.build(body.data);
              this.$nextTick(() => {
                this.$refs["tree3"].setCheckedNodes(this.checkArr);
              })
            }
          });
      },
      build(arr) {
        for (let i in arr) {
          if (arr[i].children.length>0) {
            this.build(arr[i].children);
          }
          else if (arr[i].children.length===0&&arr[i].checked == "1") {
            this.checkArr.push(arr[i]);
          }
        }
      },
      saveCheckedKeys() {
        this.moduleIdArr = [];
        let checkNodes = this.$refs["tree3"].getCheckedNodes(false,true);
        for (let i = 0; i < checkNodes.length; i++) {
          this.moduleIdArr.push(checkNodes[i].id);
        }
        let moduleIdStr = this.moduleIdArr.join(",");
        this.$http.put("/role/putRoleModule/" + this.RoleId + "/" + moduleIdStr,
          {
            params: {
              roleId: this.RoleId,
              moduleIds: moduleIdStr
            }
          }
        ).then(res => {
          let body = res.data;
          if (body.code === "200") {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.isShowEditRoleDialog = false;
          } else {
            this.$message.error(body.msg);
          }
        })
      },
      getInfo(id, cb) {
        this.$http.get("/role/getInfo/" + id).then(res => {
          let body = res.data;
          if (body.code === "200") {
            this.form = {
              roleId: id,
              roleName: body.data.roleName,
              roleDesc: body.data.roleDesc,
              status: body.data.status + "",
            };
            cb();
          }
        });
      },
      handleSelectionChange(selection) {
        this.selection = [];
        selection.forEach(e => {
          this.selection.push(e.roleId);
        });
      },
      handleSearch() {
        this.$http
          .get("/role/getList", {
            params: {
              keyWord: this.keyword,
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
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.handleSearch();
      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum;
        this.handleSearch();
      },
      handleDelete() {
        if (this.selection.length === 0) {
          this.$message.warning("请选中要删除的数据");
          return;
        }
        this.$confirm("此操作将永久删除，是否继续？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$http.delete("/role/del", {
            params: {
              idList: this.selection.join()
            }
          }).then(res => {
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
          })

        });
      },
      handleSave() {
        this.$refs["addForm"].validate((pass, o) => {
          if (pass) {
            this.$http.put("/role/put", this.form).then(res => {
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
    },
  }
</script>

<style scoped>

</style>
