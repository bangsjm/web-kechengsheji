<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
        <template slot="header">
            <el-row :gutter="10">
            <el-col :md="3">
              <el-select v-model="selectYear" placeholder="请选择年份" >
                <el-option v-for="(v, k) in years" :key="k" :label="v.label" :value="v.value"></el-option>
              </el-select>
            </el-col>
            <el-col :md="3">
              <el-select v-model="selectcourseNature" placeholder="请选择课程种类"  no-data-text="暂无课程">
                <el-option v-for="(v, k) in courseNature" :key="k" :label="v.label" :value="v.value"></el-option>
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
          <el-table-column prop="courseNumber" label="课程号">
          </el-table-column>
          <el-table-column prop="courseName" label="课程名">
          </el-table-column>
          <el-table-column prop="className" label="班级">
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
    name: "TimeTableSearch",
    components: {
      Table2
    },
    data() {
      return {
        selectYear:"",
        selectcourseNature:"",
        tableData:[],
        pageNum: 1,
        pageSize: 10,


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
                  value:'',


              courseNature: [{
                    value: '必修',
                    label: '必修'
                  }, {
                    value: '选修',
                    label: '选修'
              
              }],

            };

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

      handleSearch() {
                  
        if (this.selectYear == "" ){
         this.$message.error("请选择查询年份");}
        else if (this.selectcourseNature == "" ){
         this.$message.error("请选择查询课程种类");}
         else{
        this.$http
          .get("/TeacherSelect/getCoursebyNature",{
            params:{
              year:this.selectYear,
              courseNature:this.selectcourseNature,
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

     }
    
  
  }
  
</script>
<style scoped>
</style>