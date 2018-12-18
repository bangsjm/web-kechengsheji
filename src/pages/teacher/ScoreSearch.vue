<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
        <template slot="header">
           <el-row :gutter="10">
            <el-col :md="3">
              <el-select v-model="selectYear" placeholder="请选择年份">
                <el-option v-for="(v, k) in years" :key="k" :label="v.label" :value="v.value"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectCourse" placeholder="请选择课程" @focus="getCourse()" no-data-text="暂无课程">
                <el-option v-for="(v, k) in course" :key="k" :label="v.coursename" :value="v.courseNumber"></el-option>
              </el-select>
            </el-col>

            <el-col :md="18" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
              
            </el-col>
          </el-row>
       </template>
       <template slot="columns">
          
          <el-table-column type="index" :index="(pageNum - 1) * pageSize + 1">
          </el-table-column>
          <el-table-column prop="studentNumber" label="学号">
          </el-table-column>
          <el-table-column prop="studentName" label="姓名">
          </el-table-column>
          <el-table-column prop="score" label="成绩">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </template>
        <template slot="footer">
          <el-pagination layout="pager, sizes, jumper" :total="total" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange" :current-page.sync="handlePage">
          </el-pagination>
        </template>
      

     </Table2>
    </el-card>

    <el-dialog title="修改"
              custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
              :visible.sync="isShowEditDialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px">
          <el-form-item prop="studentNumber" label="学号">
             <el-input type="studentNumber" v-model="form.studentNumber" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="studentName" label="姓名">
             <el-input type="studentName" v-model="form.studentName" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="成绩" prop="score">
            <el-input type="score" v-model="form.score" placeholder=""></el-input>
        </el-form-item>
          <el-form-item label="" label-width="0" class="dialog-btn-group">
            <el-button type="success" size="small" @click="handleSave">保存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>

    
  </div>
</template>



<script>
  import Table2 from "@/components/table/Table1";

  export default {
    name: "ScoreSearch",
    components: {
      Table2
    },
    data() {
      // 分数验证
       var passscore = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入分数"));
        } else if (value < 0 || value > 100 ) {
          callback(new Error("输入分数不正确"));
        } else {
          callback();
        }
      };

      return {
        selectYear:'',
        selectCourse:'',
        course:[],
        courseName:'',
        courseNumber:'',
        tableData:[],
        pageNum: 1,
        pageSize: 10,
        isShowEditDialog:false,
        rules:{
          score: [
            {validator:passscore ,trigger: "blur"},
            {pattern: "^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$", message: "分数格式不正确", trigger: "blur"}
          ],
        },
        form:{
          studentNumber:"",
          studentName:"",
          score:"",
        },
         years: [{
                    value: '2018',
                    label: '2018-2019'
                  }, {
                    value: '2017',
                    label: '2017-2018'
                  }, {
                    value: '2016',
                    label: '2016-2017'
                  }, {
                    value: '2015',
                    label: '2015-2016'
                  }, {
                    value: '2014',
                    label: '2014-2015'
                  },{
                    value: '2013',
                    label: '2013-2014'
                  },{
                    value: '2012',
                    label: '2012-2013'
                  },{
                    value: '2011',
                    label: '2011-2012'
                  },{
                    value: '2010',
                    label: '2010-2011'
                  },{
                    value: '2009',
                    label: '2009-2010'
                  },{
                    value: '2008',
                    label: '2008-2009'
                  },{
                    value: '2007',
                    label: '2007-2008'
                  },{
                    value: '2006',
                    label: '2006-2007'
                  }],
                  value:''

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
    methods:{

      handleSizeChange(pageSize) {
          this.pageSize = pageSize;
          this.handleSearch();
        },
        handleCurrentChange(pageNum) {
          this.pageNum = pageNum;
          this.handleSearch();
        },
      getParams(){
     
      },
     getCourse(){
       
          let formData = new FormData()
          
          formData.append('year', this.selectYear)
          formData.append('teacherNumber',window.localStorage.getItem("userName"))
      
          this.$http
          .post("/TeacherSelect/getCourseByyear",formData,{
          hideLoading: true,
        }
          )
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.course=body.data;
            }

          });
        },

        handleSearch() {
                  
        if (this.selectYear == "" ){
         this.$message.error("请选择查询年份");}
        else if (this.selectCourse == "" ){
         this.$message.error("请选择查询课程");}
         else{
        this.$http
          .get("/TeacherSelect/getScore",{
            params:{
              year:this.selectYear,
              courseNumber:this.selectCourse,
              teacherNumber:window.sessionStorage.getItem("userName"),
              pageNum:this.pageNum,
              pageSize:this.pageSize
            }
          }
          )
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.tableData = body.data;
              this.total = body.page.total;
              this.pageSize = body.page.size;
              this.handlePage = this.pageNum;
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
      },

      handleSave() {
          this.$refs["form"].validate((pass, o) => {
            if (pass) {
              this.isLoading = true;
              let formData = new FormData()
              formData.append('studentNumber', this.form.studentNumber)
              formData.append('courseNumber', this.selectCourse)
              formData.append('score', this.form.score)
              
              this.$http.post("/TeacherSelect/updateScore", formData, {
                hideLoading: true,
              }).then(res => {
                this.isLoading = false
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
        showEdit(row) {
          this.form.studentNumber = row.studentNumber;
          this.form.studentName = row.studentName;
          this.form.score=row.score;
          this.isShowEditDialog = true;
          this.$nextTick(() => {
            this.$refs["form"].clearValidate();
          });
        },





    }
  }
</script>
<style scoped>
</style>