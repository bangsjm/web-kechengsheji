<template>
  <div class="fill-page">
    <el-card class="fill-card">
      <table1 :data="tableData" style="height: 100%;" @selection-change="handleSelectionChange">
        <template slot="header">
          <el-row :gutter="10">
            <el-col :md="6">
              <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
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
          <el-table-column prop="droleName" label="角色名称">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">{{ scope.row.droleName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="droleDesc" label="描述">
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span>{{dict('status',scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showUpdate(scope.row.droleId,scope.row.droleName)">权限
              </el-button>
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
        <el-form-item label="角色名称" prop="droleName">
          <el-input v-model="form.droleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select placeholder="请选择状态" style="width: 100%;" v-model="form.status">
            <el-option v-for="(v, k) in  dict('status')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="droleDesc">
          <el-input type="textarea" v-model="form.droleDesc" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleAdd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="编辑"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowEditDialog">
      <el-form :model="form" :rules="rules" ref="editForm" label-width="80px">
        <el-form-item label="角色名称" prop="droleName">
          <el-input v-model="form.droleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select placeholder="请选择状态" style="width: 100%;" v-model="form.status">
            <el-option v-for="(v, k) in  dict('status')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="droleDesc">
          <el-input type="textarea" v-model="form.droleDesc" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="权限"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowUpdateDialog">
      <el-form label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="droleName" placeholder="请输入角色名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <div id="menuContent" class="menuContent"
               style="background-color: #fff; z-index:10;width: 100%; max-height: 500px; overflow: auto;padding-top: 8px">
            <el-tree ref="orgUnitTree" highlight-current :data="selectTreeData"
                     :props="defaultProps" show-checkbox node-key="id" :default-checked-keys="unitIdArr"
                     default-expand-all></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleUpdate">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Table1 from "@/components/table/Table1";

  export default {
    name: "DataRole",
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

        selectTreeData: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        droleName: "",

        unitIdArr: [],
        droleId: "",

        form: {
          droleId: "",
          droleName: "",
          droleDesc: "",
          status: "",
          unitId: ""
        },
        rules: {
          droleName: [
            {required: true, message: "请输入角色名称", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"}
          ],
          status: [
            {required: true, message: "请选择状态", trigger: "blur"},
          ],
          droleDesc: [
            {max: 200, message: "最大长度为 200 个字符", trigger: "blur"}
          ],
        },
        isShowAddDialog: false,
        isShowEditDialog: false,
        isShowUpdateDialog: false,
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
          if (pass) {
            this.$http.post("/dataRole/post", this.form).then(res => {
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
          droleId: "",
          droleName: "",
          droleDesc: "",
          status: "",
        };
        this.isShowAddDialog = true;

        this.$nextTick(() => {
          this.$refs["addForm"].clearValidate();
        });
      },
      showEdit(row) {
        this.getInfo(row.droleId, () => {
          this.isShowEditDialog = true;
          this.$nextTick(() => {
            this.$refs["editForm"].clearValidate();
          });
        });
      },

      getInfo(id, cb) {
        this.$http.get("/dataRole/getInfo/" + id).then(res => {
          let body = res.data;
          if (body.code === "200") {
            this.form = {
              droleId: id,
              droleName: body.data.droleName,
              droleDesc: body.data.droleDesc,
              status: body.data.status + "",
            };
            cb();
          }
        });
      },
      handleSelectionChange(selection) {
        this.selection = [];
        selection.forEach(e => {
          this.selection.push(e.droleId);
        });
      },
      handleSearch() {
        this.$http
          .get("/dataRole/getList", {
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
          this.$http.delete("/dataRole/del", {
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
        this.$refs["editForm"].validate((pass, o) => {
          if (pass) {
            this.$http.put("/dataRole/put", this.form).then(res => {
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
      getTree(droleId) {
        this.$http
          .get("/dataRole/orgUnitTree", {
            params: {
              keyword: ""
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              let treeData = body.data;
              this.selectTreeData = [{"id": "0", "name": "根", "children": []}];
              for (let i in treeData) {
                this.selectTreeData[0].children.push(treeData[i]);
              }
              this.getCheckedUnitId(droleId);
            }

          });
      },
      showUpdate(droleId, droleName) {
        this.isShowUpdateDialog = true;
        this.getTree(droleId);

        this.droleName = droleName;
      },
      getCheckedUnitId(droleId) {
        this.droleId = droleId;
        this.$http
          .get("/dataRole/DataUnit", {
            params: {
              droleId: this.droleId
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.unitIdArr = [];
              let ID = body.data;
              for (let i in ID) {
                this.unitIdArr.push({"id": ID[i].unitId});
              }
              this.$nextTick(() => {
                this.$refs["orgUnitTree"].setCheckedNodes(this.unitIdArr);
              })
            }

          });
      },

      handleUpdate() {
        let selUnitId = [];
        let UnitIds = [];
        let idForm = {
          UnitIds: "",
          droleId: ""
        };
        selUnitId = this.$refs["orgUnitTree"].getCheckedNodes();
        for (let i in selUnitId) {
          if (selUnitId[i].id.indexOf("org") == -1) {
            UnitIds.push(selUnitId[i].id);
          }
        }
        if (UnitIds.length > 0) {
          let UnitId = UnitIds.join(",");
          idForm = {
            unitId: UnitId,
            droleId: this.droleId
          }
          this.$http.put("/dataRole/putDataUnit", idForm).then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.isShowUpdateDialog = false;
              } else {
                this.$message.error(body.msg);
              }
            }
          );
        } else {
          this.$message.error("请选择单位");
        }
      },
    },

  }
</script>

<style scoped>

</style>
