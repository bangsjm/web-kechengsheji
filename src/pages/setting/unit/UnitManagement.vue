<template>
  <div class="fill-page">
    <el-card class="fill-card">
      <table1 :data="tableData" style="height: 100%;" @selection-change="handleSelectionChange">
        <template slot="header">
          <el-row :gutter="10">
            <el-col :md="6">
              <el-input placeholder="请输入单位名称" v-model="keyword"></el-input>
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

          <el-table-column prop="unitName" label="名称">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">{{ scope.row.unitName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="unitCode" label="编码">
          </el-table-column>
          <el-table-column prop="orgName" label="所属组织">
          </el-table-column>
          <el-table-column prop="contactOne" label="第一联系人">
          </el-table-column>
          <el-table-column prop="phoneOne" label="联系人电话">
          </el-table-column>
         <!-- <el-table-column prop="contactTwo" label="第二联系人">
          </el-table-column>
          <el-table-column prop="phoneTwo" label="联系人电话">
          </el-table-column>-->
          <el-table-column prop="email" label="邮箱">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
         <!-- <el-table-column prop="remark" label="备注">
          </el-table-column>-->
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
      <el-form :model="form" :rules="rules" ref="addForm" label-width="120px">
        <el-form-item label="编码" prop="unitCode">
          <el-input v-model="form.unitCode" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="所属组织" prop="orgName">
          <el-input placeholder="请选择所属组织" v-model="form.orgName" @focus="showMenu" readonl
                    id="addSelectModule"></el-input>
          <div id="addMenuContent" class="menuContent" v-show="showMenuContent" ref="tree3"
               style="position: absolute;background-color: #fff; z-index:10;width: 100%; height: 200px;">
            <el-tree slot="scoll" highlight-current :filter-node-method="filterNode" :data="selectTreeData"
                     :props="defaultProps" @node-click="handleSelectTreeNodeClick" default-expand-all></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="第一联系人" prop="contactOne">
          <el-input v-model="form.contactOne" placeholder="请输入第一联系人名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="phoneOne">
          <el-input v-model="form.phoneOne" placeholder="请输入第一联系人电话"></el-input>
        </el-form-item>
        <el-form-item label="第二联系人" prop="contactTwo">
          <el-input v-model="form.contactTwo" placeholder="请输入第二联系人名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="phoneTwo">
          <el-input v-model="form.phoneTwo" placeholder="请输入第二联系人电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="handleAdd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="编辑"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowEditDialog">
      <el-form :model="form" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="编码" >
          <el-input v-model="form.unitCode" placeholder="请输入编码" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="所属组织" prop="orgName">
          <el-input placeholder="请选择所属组织" v-model="form.orgName" @focus="showMenu" readonl
                    id="selectModule"></el-input>
          <div id="menuContent" class="menuContent" v-show="showMenuContent" ref="tree3"
               style="position: absolute;background-color: #fff; z-index:10;width: 100%; height: 200px;">
            <el-tree slot="scoll" highlight-current :filter-node-method="filterNode" :data="selectTreeData"
                     :props="defaultProps" @node-click="handleSelectTreeNodeClick" default-expand-all></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="第一联系人" prop="contactOne">
          <el-input v-model="form.contactOne" placeholder="请输入第一联系人名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="phoneOne">
          <el-input v-model="form.phoneOne" placeholder="请输入第一联系人电话"></el-input>
        </el-form-item>
        <el-form-item label="第二联系人" prop="contactTwo">
          <el-input v-model="form.contactTwo" placeholder="请输入第二联系人名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="phoneTwo">
          <el-input v-model="form.phoneTwo" placeholder="请输入第二联系人电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
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
  import {phone,email} from '@/assets/js/common/validate'

  export default {
    components: {
      Table1,
    },
    data() {

      var isExistUnitCode= (rule, value, callback) => {
        this.$http.get("/unit/code", {
          params: {
            code: value
          }
        }).then(resu => {
          if (resu.data.data.length != 0) {
            callback(new Error("该编码已存在"));
          } else {
            callback();
          }
        })
      };

      return {
        keyword: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
        selection: [],
        tableData: [],
        selectTreeData: [],
        defaultProps: {
          children: "children",
          label: "name"
        },

        form: {
          unitId: "",
          unitCode: "",
          unitName: "",
          unitNameAll: "",
          phoneOne: "",
          phoneTwo: "",
          contactOne: "",
          contactTwo: "",
          email: "",
          address: "",
          remark: "",
          orgName: "",
        },

        rules: {
          unitCode: [
            {required: true, message: "请输入编码", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"},
            {validator: isExistUnitCode, trigger: "blur" }
          ],
          unitName: [
            {required: true, message: "请输入单位名称", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"}
          ],
          phoneOne: [
            {required: true, message: "请输入第一联系人电话", trigger: "blur"},
            {max: 15, message: "最大长度为 15 个字符", trigger: "blur"},
            {pattern: phone,message: "手机号码格式不正确",trigger: "blur"}
          ],
          phoneTwo: [
            {max: 15, message: "最大长度为 15 个字符", trigger: "blur"},
          ],
          contactOne: [
            {required: true, message: "请输入第一联系人名称", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"}
          ],
          contactTwo: [
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"}
          ],
          email: [
            {required: true, message: "请输入邮箱", trigger: "blur"},
            {max: 30, message: "最大长度为 30 个字符", trigger: "blur"},
            {pattern: email,message: "邮箱格式不正确",trigger: "blur"}
          ],
          address: [
            {required: true, message: "请输入地址", trigger: "blur"},
            {max: 200, message: "最大长度为 200 个字符", trigger: "blur"}
          ],
          orgName: [
            {required: true, message: "请选择所属组织", trigger: "blur"},
          ],
        },
        isShowAddDialog: false,
        isShowEditDialog: false,
        isShowDetailsDialog: false,
        showMenuContent: false,
      };
    },
    created() {
      this.handleSearch();
      this.getOrgTree();
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
        this.getOrgTree();
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      showMenu() {
        this.showMenuContent = true;
        this.$refs.tree3.addEventListener("mousedown", function (event) {
          event.cancelBubble = true;
          event.stopPropagation();
        });
        document.body.addEventListener("mousedown", this.hideMenu);
      },
      hideMenu() {
        this.showMenuContent = false;
        this.$refs.tree3.removeEventListener("mousedown", function (event) {
          event.cancelBubble = true;
          event.stopPropagation();
        });
        document.body.removeEventListener("mousedown", this.hideMenu);

      },
      handleSelectionChange(selections) {

        this.selection = [];
        selections.forEach(e => {
          this.selection.push(e.unitId);
        });
      },
      showAdd() {
        this.form = {
          unitId: "",
          unitCode: "",
          unitName: "",
          unitNameAll: "",
          phoneOne: "",
          phoneTwo: "",
          contactOne: "",
          contactTwo: "",
          email: "",
          address: "",
          remark: "",
          orgName: "",
          orgId: "",
        };
        this.isShowAddDialog = true;

        this.$nextTick(() => {
          this.$refs["addForm"].clearValidate();
        });
      },
      showDetail(row) {
        this.getInfo(row.orgId, () => {
          this.isShowDetailsDialog = true;
          this.$nextTick(() => {
            this.$refs["detailForm"].clearValidate();
          });
        });
      },
      showEdit(row) {
        this.getInfo(row.unitId, () => {
          this.isShowEditDialog = true;
          this.$nextTick(() => {
            this.$refs["editForm"].clearValidate();
          });
        });
      },
      //查询单位信息
      getInfo(id, cb) {
        this.$http.get("/unit/" + id).then(res => {
          let body = res.data;
          if (body.code === "200") {
            this.form = {
              unitId: body.data.unitId,
              unitCode: body.data.unitCode,
              unitName: body.data.unitName,
              unitNameAll: body.data.unitNameAll,
              phoneOne: body.data.phoneOne,
              phoneTwo: body.data.phoneTwo,
              contactOne: body.data.contactOne,
              contactTwo: body.data.contactTwo,
              email: body.data.email,
              address: body.data.address,
              remark: body.data.remark,
              orgName: body.data.orgName,
              orgId: body.data.orgId,
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
          .get("/unit", {
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
      handleSelectTreeNodeClick(o) {
        this.$set(this.form, "orgId", parseInt(o.id));
        this.$set(this.form, "orgName", o.name);
        this.$nextTick(() => {
          this.$refs["addForm"].validateField("orgName");
        });
        this.hideMenu();
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
            .delete("/unit?", {
              params: {
                unitId: this.selection.join()
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
      handleSave() {
        this.$refs["editForm"].validate((pass, o) => {
          if (pass) {
            console.log(this.form);
            this.$http.put("/unit", this.form).then(res => {
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
      handleAdd() {
        this.$refs["addForm"].validate((pass, o) => {
          if (pass) {
            this.$http.post("/unit", this.form).then(res => {
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
              this.selectTreeData = body.data;
            }

          });
      },
    },
  }
</script>

