<template>
  <!-- 泄漏点管理-->
  <div class="fill-page">
  <!-- <div style="position:absolute;z-index:999;margin-top:20%;width:15px">
    <el-button circle size="normal" @click="isShow=!isShow" icon="el-icon-arrow-right"></el-button>
  </div> -->
    <el-card class="fill-card">
     <Table2 :data="tableData" :checkData="checkTableData" :isShow="isShow" style="height: 100%;">
       <template slot="header">
       </template>
       <template slot="columnsLeft">
         <el-table-column type="index" width="200px" :index="(pageNum - 1) * pageSize + 1" label="待处理的泄漏点">
         </el-table-column>
          <el-table-column prop="deviceName" label="管线号">
          </el-table-column>
          <el-table-column prop="leakNo" label="编号">
          </el-table-column>
          <el-table-column prop="leakDegree" label="泄漏程度">
          </el-table-column>
          <el-table-column prop="planExeTime" label="计划处理时间" min-width="100px">
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope" >
              <el-button v-if="scope.row.status=='1'" type="text" size="small" @click="changeStatus(scope.row)">{{dict('leak_status',scope.row.status)}}</el-button>
              <span v-if="scope.row.status=='2'">{{dict('leak_status',scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showDeatail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
       </template>
       <template slot="columnsRight">
         <el-table-column type="index" width="200px" :index="(pageNum - 1) * pageSize + 1" label="待处理的检验计划">
         </el-table-column>
          <el-table-column prop="deviceName" label="管线号">
          </el-table-column>
          <el-table-column prop="deviceType" label="管道等级">
            <template slot-scope="scope">
              <span>{{dict('deviceType',scope.row.deviceType)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceEquip" label="所属装置">
            <template slot-scope="scope">
              <span>{{dict('device_equip',scope.row.deviceEquip)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="planExeTime" label="下次检验时间" min-width="100px">
          </el-table-column>
          <el-table-column prop="checkOrganize" label="检验机构">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showManagement(scope.row)">操作</el-button>
            </template>
          </el-table-column>
       </template>
     </Table2>
    </el-card>

    <el-dialog title="详情"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowDeatail">
      <el-form :model="form" ref="addForm" label-width="110px">
        <el-form-item label="处理方案" prop="handleMethod">
          <el-input type="textarea" disabled="" v-model="form.handleMethod" placeholder="请输入解决方案"></el-input>
        </el-form-item>
      </el-form>
      <div style="position: relative" v-for="(v,k) in imageUrlData">
        <img :id="v.fileId" @load="getImageWidthHeight" :src="v.filePath"  style="width: 100%" />
        <div style="position: absolute" v-for="(vi,ki) in imgMarks[k].marks" class="father"
             :style="{'top':vi.axisY*imagesHeight[k]-12+'px','left':vi.axisX*imagesWidth[k]-6+'px' }">
          <i class="	fa fa-circle" style="font-size:12px;color: red;opacity: 0.5"></i>
          <textarea type="textarea" style="background-color: #f2f7d2" disabled="disabled"
                    class="elem el-textarea__inner" v-bind:value="vi.remark"></textarea>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="操作"
               custom-class="m1-dialog el-col-md-10 el-col-md-push-7 el-col-sm-14 el-col-sm-push-5 el-col-xs-22 el-col-xs-push-1"
               :visible.sync="isShowManagementDialog">
      <el-form :model="manageForm" :rules="rules" ref="manageForm" label-width="80px">
        <el-form-item label="完成时间" prop="delayTime">
          <el-date-picker style="width:100%" v-model="manageForm.delayTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="延期原因" prop="delayReason">
          <el-input v-model="manageForm.delayReason" placeholder="请输入延期原因"></el-input>
        </el-form-item>
        <el-form-item label="检验结果" prop="checkResult">
          <el-select placeholder="请选择检验结果" style="width: 100%;" v-model="manageForm.checkResult">
            <el-option v-for="(v, k) in  dict('check_result')" :key="k" :label="v.name" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检验报告" prop="checkReport">
          <el-input type="textarea" v-model="manageForm.checkReport" placeholder="请输入检验报告"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0" class="dialog-btn-group">
          <el-button type="success" size="small" @click="managementSave">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Table2 from "@/components/table/Table2";

  export default {
    name: "PipelineMaintain",
    components: {
      Table2
    },
    data() {
      return {
        dict:this.$dict,
        isShow:true,
        keyword: "",
        devName:"",
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userId: '',
        imagePathData:[],
        imageUrlData:[],
        imageIds:[],
        imageMarkList:[],
        imagesHeight:[],
        imgMarks:[],
        imagesWidth:[],
        tableData: [],
        checkTableData:[],
        selection: [],
        devList:[],
        isShowDeatail:false,
        isShowManagementDialog:false,
        form:{
          id: "",
          leakNo: "",
          devId: "",
          leakDegree: "",
          occurTime: "",
          status:"",
          planExeTime:"",
          handleMethod:"",
          remark:"",
        },
        manageForm:{
          id:'',
          delayTime:"",
          delayReason:"",
          checkResult:"",
          lastExeTime:"",
          planExeTime:"",
          checkReport:"",
          exeCycle:'',
        },
        rules: {
          planExeTime: [
            { required: true, message: "请选择执行时间", trigger: "blur"},
          ],
          checkReport:[
            { required: true, message: "请输入检验报告", trigger: "blur"},
            {max: 500, message: "最大长度为 500个字符", trigger: "blur"}
          ],
          checkResult:[
            {required:true,message:"请选择检验报告",trigger:"blur"},
          ],
          delayTime:[
            { required: true, message: "请选择完成时间", trigger: "blur"},
          ],
        },
      };

    },
    created() {
      this.token = window.sessionStorage.getItem("token")
      this.handleSearch();
      this.checkHandleSearch();
    },
    activated() {
      if (!!this.$route.params.refresh) {
        this.handleSearch();
        this.checkHandleSearch();
      }
      this.$nextTick(() => {
        this.handleSearch();
        this.checkHandleSearch();
      });
    },
    mounted(){
      window.addEventListener("resize",() =>{
        this.getImageWidthHeight();
      });
    },
    methods: {
      changeStatus(e){
        this.$confirm("是否确认已处理","提示",{
          confirmButtonText:"确认",
          cancelButtonText:"取消",
          type:"warning",
        }).then(()=>{
          this.$http.get("/leakManager/changeStatus/"+e.id).then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.handleSearch();
            } else {
              this.$message.error(body.msg);
            }
          })
        });
      },
      showDeatail(row){
       this.getInfo(row.id, () => {
          this.isShowDeatail= true;
         this.getImgPaths(row.devId);
          this.$nextTick(() => {
            this.$refs["addForm"].clearValidate();
          });

        });
      },


      managementSave(){
        let time = this.manageForm.delayTime;
        let date = new Date(time);
        let lastTime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        this.$set(this.manageForm,"lastExeTime",lastTime);
        let planTime = new Date(date.getFullYear(),date.getMonth(),date.getDate()+this.manageForm.exeCycle);
        let planTimeStr =planTime.getFullYear()+'-'+(planTime.getMonth()+1)+'-'+planTime.getDate();
        this.$set(this.manageForm,"planExeTime",planTimeStr);
        this.$refs["manageForm"].validate((pass, o) => {
          if(pass){
            this.$http.put("/check/submitInfo", this.manageForm).then(res => {
              let body = res.data;
              if (body.code === "200") {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.isShowManagementDialog = false;
                this.checkHandleSearch();
              } else {
                this.$message.error(body.msg);
              }
            });
          }else {
            this.$message.error("表单输入不正确");
          }
        });
      },
      getInfo(id, cb) {
        this.$http.get("/leakManager/" + id).then(res => {
          let body = res.data;
          if (body.code === "200") {
            this.form = {
              id: id,
              leakNo:  body.data.leakNo,
              devId:  body.data.devId,
              leakDegree:  body.data.leakDegree,
              occurTime:  body.data.occurTime,
              status:body.data.status,
              planExeTime: body.data.planExeTime,
              handleMethod: body.data.handleMethod,
              remark: body.data.remark,
            };
            cb();
          }
        });
      },
      handleSearch() {
        this.$http
          .get("/leakManager/getUnhandle", {
            params: {
              keyWord: this.keyword,
              devName:this.devName,
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
      checkHandleSearch() {
        this.$http
          .get("/check/getNeedList", {
            params: {
              keyWord: this.keyword,
              devName:this.devName,
              pageNum: this.pageNum,
              pageSize: this.pageSize
            }
          })
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.checkTableData = body.data;
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
                this.checkHandleSearch();
              }
            }
          });
      },
      showManagement(row){
        this.manageForm={
            id:'',
            delayTime:"",
            delayReason:"",
            lastExeTime:"",
            planExeTime:"",
            checkReport:"",
            exeCycle:'',
        },
        this.isShowManagementDialog=true;
        this.$nextTick(() => {
          this.$refs["manageForm"].clearValidate();
        });
        this.$set(this.manageForm, "id", row.id);
        this.$set(this.manageForm, "planExeTime", row.planExeTime);
        this.$set(this.manageForm, "exeCycle", row.exeCycle);
      },
      getImgPaths(id){
        this.$http.get("/file/getImgPath",{
          params:{
            devId:id
          }
        }).then(res=>{
          let body = res.data;
          this.imagePathData=[];
          if(body.code === "200"){
            this.imageIds=[];
            this.imagePathData=[];
            this.imagePathData=body.data;
              this.getImg();
          }
        });
      },
      getImg(){
        this.imageUrlData=this.imagePathData;
        for(let i =0;i<this.imagePathData.length;i++){
          this.imageIds.push(this.imagePathData[i].fileId)
          this.imageUrlData[i].filePath=
            this.$http.defaults.baseURL + "/file/downloadImg?token=" + this.token + "&fileName=" +
            encodeURIComponent(this.imagePathData[i].fileName) + "&filePath=" + encodeURIComponent(this.imagePathData[i].filePath);
        }
        this.isShowImgDialog=true;
        this.handGetList();
      },
      handGetList(){
        this.imageMarkList=[];
        this.$http
          .get("/image/getImageMarkList",{
            params: {
              imageIds: this.imageIds.join()
            }})
          .then(res => {
            let body = res.data;
            if (body.code === "200") {
              this.imageMarkList = body.data;

              this.handleMarkList();

            }
          });
      },
      handleMarkList(){
        this.imgMarks=[];
        let arrStr = "[";
        for(let j =0;j<this.imageIds.length;j++){
          arrStr+='{"imgId":'+this.imageIds[j]+',"marks":[ ';
          for(let i =0;i<this.imageMarkList.length;i++){
            if(this.imageMarkList[i].imageId == this.imageIds[j]){
              arrStr+='{"axisX":'+this.imageMarkList[i].axisX+',"axisY":'
                +this.imageMarkList[i].axisY+',"remark":"'
                +this.imageMarkList[i].remark+'"},'
            }
          }
          if(arrStr.endsWith(',')) {
            arrStr = arrStr.substr(0, arrStr.length - 1);
          }
          arrStr+=']},'
        }
        arrStr=arrStr.substr(0,arrStr.length-1);
        arrStr+=']'
        arrStr.replace(/[ ]/g, "");
        console.log(arrStr);
        this.imgMarks=eval(arrStr);
      },
      getImageWidthHeight(){
        this.imagesHeight=[];
        this.imagesWidth=[];
        for(let i=0;i<this.imageIds.length;i++){
          this.imagesHeight.push(document.getElementById(this.imageIds[i]).scrollHeight);
          this.imagesWidth.push(document.getElementById(this.imageIds[i]).scrollWidth);
        }
        console.log("height===="+this.imagesHeight+"width===="+this.imagesWidth)

      },
    },

  }
</script>
<style scoped>
  .elem{
    display:none;
  }

  /*当鼠标经过父级father的时候。父级获得hover状态，在父级hover的基础上写elem的样式：*/
  .father:hover .elem{
    display:block ;
  }
  /*textarea显示覆盖标注圈*/
  .father:hover {
    z-index: 999;
  }
</style>
