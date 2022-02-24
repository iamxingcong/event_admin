<template>
  <div class="conatainer openpage">
    <el-row>
      <label> 策略配置：</label>
      <el-button
        type="primary"
        size="small"
        @click="editcl_confdialogFormVisiblef"
      >
        编辑策略
      </el-button>
    </el-row>
    <codemirror ref="myCm" :value="code" :options="cmOptions"> </codemirror>
    
    <el-dialog
      title="编辑当前策略配置项"
      destroy-on-close
      modal
      :show-close="false"
      lock-scroll
      :close-on-click-modal="false"
      :visible.sync="editcl_confdialogFormVisible"
      class="strategy_editdia"
    >
       
        
        <div class="editor-container">
          <yaml-editor v-model="ecl_con_editcfm" />
        </div>
     
      <div slot="footer" class="dialog-footer">
        <el-button @click="editcl_confdialogFormVisible = false" size='small' type="primary" plain
          >取 消</el-button
        >
        <el-button type="primary" @click="comparestrategy()" size='small'>
          对比预览并确认修改
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="策略编辑对比"
      modal
      destroy-on-close
      lock-scroll
      :close-on-click-modal="false"
      :visible.sync="comparecl_confdialogFormVisible"
      class="strategy_editdia"
    >
      <el-col :span="24">
        <div class="clm_left">
          <div>修改之后</div>

          <div>
            <span>【 </span>
            <span v-if="create_user"> create_user: {{ create_user }} ，</span>
            <span>
            create_time:
            {{ create_time }}

            】
            </span>
          </div>
        </div>
        <div class="clm_right"><span>修改之前</span></div>
      </el-col>
      <el-row class="rowmerges">
        <codemirror
          :merge="true"
          :options="cmOption"
          @scroll="onCmScroll"
        ></codemirror>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="comparecl_confdialogFormVisible = false" type="primary" plain size='small'>
          返回修改
        </el-button>
        <el-button type="primary" @click="editstrategycreate()" size='small'>
          确认修改并保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import YamlEditor from "@/components/YamlEditor/index.vue";


const yamlData = "";
export default {
  name: "StrategyEdit",
  components: { YamlEditor },
  data() {
    return {
      comparecl_confdialogFormVisible: false,
      editcl_confdialogFormVisible: false,
      cl_name: "",
      cl_user: "",
      pipeline_id: "",
      cfid: "",
      cl_conf: yamlData,
      cl_confo: "",
      ecl_con_editcfm: "",
      create_time: "",
      create_user: "",
      code: "",
      cmOptions: {
        readOnly: true,
        tabSize: 4,
      
        collapseIdentical: false,
        highlightDifferences: true,
        lineNumbers: true,
        line: true,
        flattenSpans: false,
        //scrollbarStyle: null, //隐藏滚动条
      },
      cmOption: {
        value: "<p>hello</p>",
        origLeft: null,
        orig: "<p>hello world</p>",
        connect: "align",
        lineNumbers: true,
        collapseIdentical: false,
        highlightDifferences: true,
        readOnly: true,
        autoRefresh: true,
        flattenSpans: false,
        //scrollbarStyle: null, //隐藏滚动条

      },
    };
  },
  created() {
    this.details();
  },
  methods: {
    onCmScroll() {
      console.log("onCmScroll");
    },
    comparestrategy() {
      this.cmOption.value = this.ecl_con_editcfm;
      this.comparecl_confdialogFormVisible = true;
    },
    editcl_confdialogFormVisiblef() {
      this.editcl_confdialogFormVisible = true;
    },
    async details() {
      try {
        var url = this.$store.state.domain + "clmange/detail";
        const response = await this.axios.get(url, {
          params: {
            id: this.$route.query.id,
          },
        });

        if (response.data.code === 0) {
          this.editdialogFormVisible = true;

          this.detail = response.data.data;
          this.cfid = this.detail.id;
          this.cl_name = this.detail.cl_name;
          this.cl_user = this.detail.cl_user;
          this.pipeline_id = this.detail.pipeline_id;
          this.cl_conf = this.detail.cl_conf;
          this.cl_confo = this.detail.cl_conf;
          this.create_time = this.detail.create_time;
          this.create_user = this.detail.create_user;
          this.code = this.detail.cl_conf;
          this.ecl_con_editcfm = this.detail.cl_conf;
          this.cmOption.orig = this.detail.cl_conf;
        } else {
          this.$message({
            message: response.data.msg,
            type: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async editstrategycreate() {
      var bodyFormData = new FormData();
      bodyFormData.append("cl_id", this.cfid);
      bodyFormData.append("cl_name", this.cl_name);
      bodyFormData.append("cl_user", this.cl_user);
      bodyFormData.append("pipeline_id", this.pipeline_id);
      bodyFormData.append("cl_conf", this.ecl_con_editcfm);

      try {
        var urls = this.$store.state.domain + "clmange/update";

        const response = await this.axios({
          url: urls,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: bodyFormData,
        });

        if (response.data.code === 0) {
          this.editdialogFormVisible = false;
          this.editcl_confdialogFormVisible = false;
          this.comparecl_confdialogFormVisible = false;
          this.$message({
            message: response.data.msg,
            type: "success",
          });
          location.reload();
          //this.strategylist()
        } else {
          this.$message({
            message: response.data.msg,
            type: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    },
  },
  mounted() {
    console.log("this is current codemirror object", this.codemirror);
  },
};
</script>
<style scoped>
.html,
body,
.conatainer {

  height: 100% !important;
  display: block;
}
.conatainer {
  padding: 0px 15px;
}
.openpage .vue-codemirror{
  height: calc(100% - 120px);
}
.el-row {
  padding-bottom: 15px;
  padding-top: 15px;
}
.clm_left, .clm_right{
  display: inline-block;
  width: calc(50% - 40px);
  padding: 0px 20px;
}
.clm_right span,
.clm_left div, .clm_left span{
  display: block;
  float: left;
}
.clm_right span{
  padding-left: 55px;
}


</style>