<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
        <template slot="header">
             <el-row :gutter="10">
            <el-col :md="3">
              <el-select v-model="selectYear" placeholder="请选择学年" no-data-text="">
                <el-option v-for="(v, k) in years" :key="k" :label="v.label" :value="v.value"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectNature" placeholder="请选择课程性质"  no-data-text="">
                <el-option label="必修" value="必修"></el-option>
                <el-option label="选修" value="选修"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectCourse" placeholder="请选择课程" @focus="getCourse()" no-data-text="">
                <el-option v-for="(v, k) in courses" :key="k" :label="v.courseName" :value="v.courseNumber"></el-option>
              </el-select>
            </el-col>
            <el-col :md="15" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
              <el-button type="success" size="normal" icon="fa fa-file-excel-o" @click="Download"></el-button>
            </el-col>
          </el-row>
       </template>
        <template slot="columns">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column type="index" :index="(pageNum - 1) * pageSize + 1">
          </el-table-column>
          <el-table-column prop="studentNumber" label="学号">
          </el-table-column>
          <el-table-column prop="studentName" label="学生姓名">
          </el-table-column>
           <el-table-column prop="grade" label="年级">
          </el-table-column>
        </template>
        <template slot="footer">
          <el-pagination layout="pager, sizes, jumper" :total="total" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange" :current-page.sync="handlePage">
          </el-pagination>
        </template>
     </Table2>
    </el-card>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table1";

  export default {
    name: "SelectStudentSearch",
    components: {
      Table2
    },
    data() {
      return {
                collegeNumber:'',
                majorNumber:'',
                selectCourse:'',
                selectNature:'',
                selectYear:'',
                selectTerm:'',
                studentNumber:'',
                studentName:'',
                grade:'',
                tableData:[],
                courses:[],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                handlePage: 1,
                selection:[],
                years: [{
                    value: '2006',
                    label: '2006-2007'
                  }, {
                    value: '2007',
                    label: '2007-2008'
                  }, {
                    value: '2008',
                    label: '2008-2009'
                  }, {
                    value: '2009',
                    label: '2009-2010'
                  }, {
                    value: '2010',
                    label: '2010-2011'
                  },{
                    value: '2011',
                    label: '2011-2012'
                  },{
                    value: '2012',
                    label: '2012-2013'
                  },{
                    value: '2013',
                    label: '2013-2014'
                  },{
                    value: '2014',
                    label: '2014-2015'
                  },{
                    value: '2015',
                    label: '2015-2016'
                  },{
                    value: '2016',
                    label: '2016-2017'
                  },{
                    value: '2017',
                    label: '2017-2018'
                  },{
                    value: '2018',
                    label: '2018-2019'
                  },{
                    value: '2019',
                    label: '2019-2020'
                  }],
                  value: ''
            };

    },

    methods:{
      Download(){

        var teacherNumber = window.sessionStorage.getItem("userName");
        var year = this.selectYear;
        this.$http
          .get("/Teacher/DownLoadExcel",{
            params:{
              teacherNumber:teacherNumber,
              year:year,
              courseNumber:this.selectCourse
            }
          }
          )
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.$message({
                  message: "导出成功",
                  type: "success"
                });
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
      handleSearch(){
        var nature = this.selectNature;
        if(nature == "必修"){
          var teacherNumber = window.sessionStorage.getItem("userName");
        var year = this.selectYear;
        this.$http
          .get("/Teacher/SelectStudentSearch",{
            params:{
              teacherNumber:teacherNumber,
              year:year,
              courseNumber:this.selectCourse,
              pageNum: this.pageNum,
              pageSize: this.pageSize
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
        }else if(nature == "选修"){
        var teacherNumber = window.sessionStorage.getItem("userName");
        var year = this.selectYear;
        this.$http
          .get("/Teacher/ElectiveSearch",{
            params:{
              teacherNumber:teacherNumber,
              year:year,
              courseNumber:this.selectCourse,
              pageNum: this.pageNum,
              pageSize: this.pageSize
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
          getCourse(){
          this.selectCourse = "";
          this.courses = [];
          var teacherNumber = window.sessionStorage.getItem("userName");
          var year = this.selectYear;
          let formData = new FormData()
          formData.append('teacherNumber', teacherNumber);
          formData.append('year', year);
          var nature = this.selectNature;

          if(nature == "必修"){
            this.$http
          .post("/Teacher/getCourse",formData,
          {
            hideLoading:true,
          }
          )
          .then(res => {
            let body = res.data;
            if(body.code === "200"){
              this.courses = body.data;
            }
          }

          )
          }else if(nature == "选修"){
            this.$http
          .post("/Teacher/getCourseElective",formData,
          {
            hideLoading:true,
          }
          )
          .then(res => {
            let body = res.data;
            if(body.code === "200"){
              this.courses = body.data;
            }
          }

          )
          }
          

        },
    }
  
  }
</script>
<style scoped>
</style>