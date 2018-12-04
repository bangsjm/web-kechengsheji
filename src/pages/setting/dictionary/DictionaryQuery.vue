<template>
  <div class="fill-page">
    <el-card class="fill-card">
      <table1 :data="tableData" style="height: 100%;" @selection-change="handleSelectionChange">
        <template slot="header">
          <el-row :gutter="10">
            <el-col :md="6">
              <el-input placeholder="请输入字典名称" v-model="keyword"></el-input>
            </el-col>
            <el-col :md="18" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
              <el-button type="success" size="normal" icon="el-icon-circle-plus" @click="showAdd"></el-button>
              <!--<el-button type="warning" size="normal" icon="el-icon-delete" @click="handleDelete"></el-button>-->
            </el-col>
          </el-row>
        </template>
        <template slot="columns">
          <!--<el-table-column type="selection" width="45">-->
          <!--</el-table-column>-->
          <el-table-column type="index" :index="(pageNum - 1) * pageSize + 1">
          </el-table-column>
          <el-table-column prop="dictName" label="字典名称">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">{{ scope.row.dictName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="dictValue" label="标识">
          </el-table-column>
          <el-table-column prop="remark" label="描述">
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
        <el-form-item label="标识" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入标识"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%;">
            <el-option :value="1" label="启用"></el-option>
            <el-option :value="2" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入描述"></el-input>
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
        <el-form-item label="标识" >
          <el-input v-model="form.dictValue" placeholder="请输入标识" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%;">
            <el-option :value="1" label="启用"></el-option>
            <el-option :value="2" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入描述"></el-input>
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

  export default {
    name: "DictionaryQuery",
    components: {
      Table1
    },
    data() {
      var dictValueRepeat = (rule, value, callback) => {
        this.$http.get("/dict/getByValue", {
          params: {
            value: value
          }
        }).then(resu => {
          if (resu.data.data.length != 0) {
            callback(new Error("该标识已存在"));
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
        userId: '',
        tableData: [],
        selection: [],
        form: {
          id: "",
          dictName: "",
          dictValue: "",
          remark: "",
          status: "",
        },
        rules: {
          dictName: [
            {required: true, message: "请输入字典名称", trigger: "blur"},
            {max: 50, message: "最大长度为 50 个字符", trigger: "blur"}
          ],
          dictValue: [
            {required: true, message: "请输入标识", trigger: "blur"},
            {max: 20, message: "最大长度为 20 个字符", trigger: "blur"},
            {validator: dictValueRepeat, trigger: "blur" }
          ],
          status: [
            { required: true, message: "请选择状态", trigger: "blur"},
          ],
          remark: [
            {max: 200, message: "最大长度为 200 个字符", trigger: "blur"}
          ],
        },
        isShowAddDialog: false,
        isShowEditDialog: false,
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
            this.$http.post("/dict/postDict", this.form).then(res => {
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
        })
        ;
      },
      showAdd() {
        this.form = {
          id: "",
          dictName: "",
          dictValue: "",
          remark: "",
          status: "",
        };
        this.isShowAddDialog = true;

        this.$nextTick(() => {
          this.$refs["addForm"].clearValidate();
        });
      }
      ,
      showEdit(row) {
        this.getInfo(row.id, () => {
          this.isShowEditDialog = true;
          this.$nextTick(() => {
            this.$refs["addForm"].clearValidate();
          });
        });
      }
      ,
      showControl(row) {
        this.$router.push({
          name: "字典编辑",
          params: {
            name: row.dictValue,
          }
        });
      }
      ,
      getInfo(id, cb) {
        this.$http.get("/dict/" + id).then(res => {
          let body = res.data;
          if (body.code === "200") {
            this.form = {
              id: id,
              dictName: body.data.dictName,
              dictValue: body.data.dictValue,
              remark: body.data.remark,
              status: body.data.status,
            };
            cb();
          }
        });
      }
      ,
      handleSelectionChange(selection) {
        this.selection = [];
        selection.forEach(e => {
          this.selection.push(e.id);
        });
      }
      ,
      handleSearch() {
        this.$allDict();
        this.$http
          .get("/dict/get", {
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
      }
      ,
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.handleSearch();
      }
      ,
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum;
        this.handleSearch();
      }
      ,
      // handleDelete(){
      //   if(this.selection.length===0)
      //   {
      //     this.$message.warning("请选中要删除的数据");
      //     return;
      //   }
      //   this.$confirm("此操作将永久删除，是否继续？","提示",{
      //     confirmButtonText:"确认",
      //     cancelButtonText:"取消",
      //     type:"warning",
      //   }).then(()=>{
      //     this.$http.delete("/dict/deleteDict",{
      //       params: {
      //         idList: this.selection.join()
      //       }
      //     }).then(res => {
      //       let body = res.data;
      //       if (body.code === "200") {
      //         this.$message({
      //           message: "删除成功",
      //           type: "success"
      //         });
      //         this.handleSearch();
      //       } else {
      //         this.$message.error(body.msg);
      //       }
      //     })
      //
      //   });
      // },
      handleSave() {
        this.$refs["addForm"].validate((pass, o) => {
          if (pass) {
            this.$http.put("/dict/putDict", this.form).then(res => {
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
      }
      ,
    },

  }
</script>
