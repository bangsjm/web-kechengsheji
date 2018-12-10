<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" style="height: 100%;">
       <template slot="header">
         <el-row :gutter="10">
            <el-col :md="3">
              <el-select v-model="selectcollege" placeholder="请选择学院" @focus="getCollege()">
                <el-option v-for="(v, k) in college" :key="k" :label="v.collegeName" :value="v.collegeNumber"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectmajor" placeholder="请选择专业" @focus="getMajor()">
                <el-option v-for="(v, k) in majors" :key="k" :label="v.majorName" :value="v.majorName"></el-option>
              </el-select>
            </el-col>

            <el-col :md="3">
              <el-select v-model="selectclass" placeholder="请选择班级" @focus="getClass()">
                <el-option v-for="(v, k) in classes" :key="k" :label="v.className" :value="v.classId"></el-option>
              </el-select>
            </el-col>

            <el-col :md="15" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
              <el-button type="success" size="normal" icon="el-icon-circle-plus" @click="showAdd"></el-button>
              <el-button type="warning" size="normal" icon="el-icon-delete" @click="handleDelete"></el-button>
              <el-upload ref="upload"
                style="float: right;padding-left: 5px"
                :action="uploadURL"
                multiple
                :limit="1"
                :show-file-list="false"
                accept=".xls,.xlsx"
                :before-upload="beforeUpload"
                :on-error="handleError"
                :on-success="handleSuccess">
                  <el-button type="primary"  size="normal" icon="fa fa-cloud-upload	"></el-button>
              </el-upload>
            </el-col>
          </el-row>
       </template>

       <template slot="columns">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column type="index" :index="(pageNum - 1) * pageSize + 1">
          </el-table-column>
          <el-table-column prop="droleName" label="学生姓名">
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
     </Table2>
    </el-card>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table1";

  export default {
    name: "studentManage",
    components: {
      Table2
    },
    data() {
      return {
        selectcollege:"",
        selectmajor:"",
        selectclass:"",
        college:[],
        majors:[],
        classes:[],
        uploadURL:"",
      };
    },
    created() {
      this.getParams();
    },
    activated() {
      if (!!this.$route.params.refresh) {
      }
      this.$nextTick(() => {
        this.getParams();
      });
    },
    methods: {
        getParams () {
          this.token = window.sessionStorage.getItem("token");
          this.$nextTick(()=>{
            this.uploadURL = this.$http.defaults.baseURL + "/TeacherSecretary/excelAddStudent?token="+this.token;
          });
        },
        getCollege(){
          this.college=[];
          this.$http
          .post("/TeacherSecretary/getCollege","",{
          hideLoading: true,
        }
          )
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.college=body.data;
            }

          });
        },
        getMajor(){
          this.majors = [];
          let formData = new FormData()
          formData.append('collegeNumber', this.selectcollege)
          this.$http
          .post("/TeacherSecretary/getMajor",formData,
          {
            hideLoading:true,
          }
          )
          .then(res => {
            let body = res.data;
            if(body.code === "200"){
              this.majors = body.data;
            }
          }

          )
        },
        getClass(){
          this.classes = [];
          let formData = new FormData()
          formData.append('majorName',this.selectmajor)
          this.$http
          .post("/TeacherSecretary/getClass",formData,{
            hideLoading:true,
          }
          )
          .then(res => {
            let body = res.data;
            if(body.code == "200"){
              this.classes = body.data;
            }
          }
          )
        },
        beforeUpload(file) {
          const isLt5M = file.size / 1024 / 1024 < 5;
          if (!isLt5M) {
            this.$message.warning('上传文件大小不能超过 5MB!');
            return false;
          }
        },
        handleError() {
        this.$message.warning(`上传失败`);
        },     
        handleSuccess(){
          this.$message.success(`上传成功`);
          this.$refs.upload.clearFiles();
        },
      }
  }
</script>
<style scoped>
</style>