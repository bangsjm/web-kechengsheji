<template>
  <div class="fill-page">
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" @selection-change="handleSelectionChange" style="height: 100%;">
        <template slot="header">
             <el-row :gutter="10">
               <el-col :md="3">
               </el-col>
            <el-col :md="4">
              <el-select v-model="selectYear" placeholder="请选择学年" no-data-text="">
                <el-option v-for="(v, k) in years" :key="k" :label="v.label" :value="v.value"></el-option>
              </el-select>
            </el-col>
            <el-col :md="4">
              <el-select v-model="selectTerm" placeholder="请选择学期"  no-data-text="">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
              </el-select>
            </el-col>
            <el-col :md="13" class="btn-group">
              <el-button type="primary" size="normal" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-col>
          </el-row>
       </template>
        <template slot="columns">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column type="index" :index="(pageNum - 1) * pageSize + 1">
          </el-table-column>
          <el-table-column prop="stundentNumber" label="学号">
          </el-table-column>
          <el-table-column prop="studentName" label="学生姓名">
          </el-table-column>
           <el-table-column prop="grade" label="年级">
          </el-table-column>
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
                selectYear:'',
                selectTerm:'',
                tableData:[],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                handlePage: 1,
                selection:[],
                years: [{
                    value: '选项1',
                    label: '2006-2007'
                  }, {
                    value: '选项2',
                    label: '2007-2008'
                  }, {
                    value: '选项3',
                    label: '2008-2009'
                  }, {
                    value: '选项4',
                    label: '2009-2010'
                  }, {
                    value: '选项5',
                    label: '2010-2011'
                  },{
                    value: '选项6',
                    label: '2011-2012'
                  },{
                    value: '选项7',
                    label: '2012-2013'
                  },{
                    value: '选项8',
                    label: '2013-2014'
                  },{
                    value: '选项9',
                    label: '2014-2015'
                  },{
                    value: '选项10',
                    label: '2015-2016'
                  },{
                    value: '选项11',
                    label: '2016-2017'
                  },{
                    value: '选项12',
                    label: '2017-2018'
                  },{
                    value: '选项13',
                    label: '2018-2019'
                  }],
                  value: ''
            };

    },
  
  }
</script>
<style scoped>
</style>