<template>
  <div class="fill-page">
    <el-card class="fill-card">
            <table3  :data1="tableData1" :data2="tableData2" :label1="label1" :label2="label2" style="height:100%" @selection-change="handleSelectionChange">
              <template slot="header">
              </template>
              <template slot="columns1" height="100%">
                
               <el-tabs v-model="activeName" @tab-click="search"  style="height:100%" >
                  <el-tab-pane :label="label1" name="first" style="height:100%" :style="{maxHeight: tableMaxHeight + 'px'}">
                      <el-table class="m1-table"  @selection-change="handleSelectionChange" :data="tableData1"  show-overflow-tooltip :style="{maxHeight: tableMaxHeight + 'px'}" style="width: 100%;">
                      <el-table-column type="index" :index="(pageNum - 1) * pageSize + 1">
                      </el-table-column>
                      <el-table-column prop="courseNumber" label="课程号">
                      </el-table-column>
                      <el-table-column prop="courseName" label="课程名">
                      </el-table-column>
                      <el-table-column prop="score" label="成绩">
                      </el-table-column>
                      </el-table>
                  </el-tab-pane>
                  <el-tab-pane :label="label2" name="second"    style="height:100%" :style="{maxHeight: tableMaxHeight + 'px'}">
                    <el-table class="m1-table" @selection-change="handleSelectionChange" :data="tableData2"  show-overflow-tooltip :style="{maxHeight: tableMaxHeight + 'px'}" style="width: 100%;">
                    <el-table-column type="index" :index="(pageNum - 1) * pageSize + 1">
                    </el-table-column>
                    <el-table-column prop="courseNumber" label="课程号">
                    </el-table-column>
                    <el-table-column prop="courseName" label="课程名">
                    </el-table-column>
                    <el-table-column prop="avgScore" label="平均成绩">
                    </el-table-column>
                    </el-table>
                  </el-tab-pane>
               </el-tabs>
                
              </template>
              <template slot="footer">
                <el-pagination layout="pager, sizes, jumper" :total="total" @size-change="handleSizeChange"
                              @current-change="handleCurrentChange" :current-page.sync="handlePage">
                </el-pagination>
              </template>
            </table3>
    </el-card>
  </div>
</template>

<script>
  import Table3 from "@/components/table/Table3";

  export default {
    name: "SearchScore",
    components: {
      Table3
    },
    data() {
      return {
            tableData1:[],
            tableData2:[],
            label1:"个人成绩",
            label2:"课程平均成绩",
            pageNum: 1,
            pageSize: 10,
            };
    },
    mounted() {
    this.resizeTable();
    window.addEventListener("resize", this.resizeTable);
  },
  activated () {
    this.resizeTable()
  },
    methods:{
      search(o){
        if(o.label==="个人成绩"){
         this.searchSelfScore();
        }
        else if(o.label==="课程平均成绩")
        {
          this.searchCourseScore();
        }
      },
    showscore(){

    },
     resizeTable() {
      this.tableMaxHeight =
        this.$refs["all"].offsetHeight -
        this.$refs["header"].offsetHeight -
        this.$refs["footer"].offsetHeight;
        // console.log(this.tableMaxHeight)
    },
    handleSelectionChange (selection) {
      this.$emit("selection-change", selection)
    },
    searchSelfScore(){
      let formData = new FormData();
      formData.append('pageNum',this.pageNum);
      formData.append('pageSize',this.pageSize);
      formData.append('studentNumber',window.sessionStorage.getItem("userName"));
      this.$http.post("/Student/SearchSelfScore", formData).then(res => {
              let body = res.data;
              if (body.code === "200") {
              this.tableData1=body.data;
              this.total = body.page.total;
              this.pageSize = body.page.size;
              this.handlePage = 1;
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
    searchCourseScore(){
      let formData = new FormData();
      formData.append('pageNum',this.pageNum);
      formData.append('pageSize',this.pageSize);
      formData.append('studentNumber',window.sessionStorage.getItem("userName"));
      this.$http.post("/Student/SearchCourseScore", formData).then(res => {
              let body = res.data;
              if (body.code === "200") {
              this.tableData2=body.data;
              this.total = body.page.total;
              this.pageSize = body.page.size;
              this.handlePage = 1;
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
    }
  }
</script>
<style scoped>
</style>