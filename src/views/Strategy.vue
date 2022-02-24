<template>
  <div class="content">
    <el-row class="pdbtm25">
      <el-button
        type="primary"
        size="small"
        class="left el-icon-edit"
        @click="createStrategy()"
      >
        创建策略
      </el-button>
    </el-row>

    <el-row>
      <el-table
        v-loading="loading"
        :data="strategylistdt"
        style="width: 100%"
        show-header
        header-row-class-name="xtableRowClassName"
        row-class-name="Strategytablecells"
      >
        <el-table-column prop="cl_name" label="策略名称"> </el-table-column>
        <el-table-column prop="cl_user" label="负责人" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="700">
          <template slot-scope="scope">
            <el-button
              @click="edit_open(scope.row)"
              type="primary"
              plain
              size="mini"
            >
              分享链接
            </el-button>
            <el-button @click="edit(scope.row)" type="primary" size="mini">
              编辑
            </el-button>

            <el-button @click="gotoblue(scope.row)" type="text">
              查看流水线
            </el-button>
            <el-button
              @click="history(scope.row)"
              type="primary"
              plain
              size="mini"
            >
              历史版本
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100]"
        :page-size="page_data.num"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_data.total"
      >
      </el-pagination>
    </el-row>

    <el-dialog
      title="创建策略"
      class="strategy"
      modal
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <el-row>
        <label> 策略名称： </label>
        <el-input
          v-model="cl_name"
          placeholder="策略名称"
          size="medium"
        ></el-input>
      </el-row>
      <el-row>
        <label> 负责人： </label>
        <el-input
          v-model="cl_user"
          placeholder="负责人"
          size="medium"
        ></el-input>
      </el-row>

      <el-row>
        <label> 关联流水线： </label>

        <el-select v-model="pipeline_id" placeholder="关联流水线" size="medium">
          <el-option
            v-for="item in ppdt"
            :key="item.pipeline_id"
            :label="item.pipeline_name"
            :value="item.pipeline_id"
          >
          </el-option>
        </el-select>
      </el-row>

      <div class="yamledita">
        <label> 策略配置：</label>

        <div class="editor-container">
          <yaml-editor v-model="cl_conf" />
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogFormVisible = false"
          size="small"
          type="primary"
          plain
          >取 消</el-button
        >
        <el-button type="primary" @click="strategycreate()" size="small">
          创建策略
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑策略"
      modal
      lock-scroll
      destroy-on-close
      :close-on-click-modal="false"
      :visible.sync="editdialogFormVisible"
      :show-close="false"
      class="strategy"
    >
      <el-row>
        <label> 策略名称： </label>
        <el-input
          v-model="ecl_name"
          placeholder="请输入内容"
          size="medium"
        ></el-input>
      </el-row>
      <el-row>
        <label> 负责人： </label>
        <el-input
          v-model="ecl_user"
          placeholder="请输入内容"
          size="medium"
        ></el-input>
      </el-row>

      <el-row>
        <label> 关联流水线： </label>

        <el-select v-model="epipeline_id" placeholder="请选择" size="medium">
          <el-option
            v-for="item in ppdt"
            :key="item.pipeline_id"
            :label="item.pipeline_name"
            :value="item.pipeline_id"
          >
          </el-option>
        </el-select>
      </el-row>
      <el-row>
        <label> 策略配置：</label>
        <span>
          <el-button type="primary" @click="editstrategycl_conf()" size="small">
            编辑策略配置
          </el-button>
        </span>
      </el-row>

      <div class="codmirrorstragety">
        <codemirror ref="myCm" :value="ecl_confo" :options="cmOptions">
        </codemirror>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="editdialogFormVisiblef()"
          type="primary"
          size="small"
          plain
          >取 消</el-button
        >
        <el-button
          @click="editdialogFormVisible_clconf()"
          type="primary"
          size="small"
        >
          保存策略选项（配置除外）</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="编辑当前策略配置项"
      destroy-on-close
      modal
      :show-close="false"
      lock-scroll
      :close-on-click-modal="false"
      :visible.sync="editcl_confdialogFormVisible"
      class="strategy"
    >
      <div class="strategy_editcodemirror">
        <div class="editor-container">
          <yaml-editor v-model="ecl_con_editcfm" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="editcl_confdialogFormVisiblef()"
          plain
          type="primary"
          size="small"
          >取 消</el-button
        >
        <el-button type="primary" size="small" @click="comparestrategy()">
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
      class="strategy"
    >
      <el-col :span="24">
        <div class="clm_left">
          <span>修改之后: 【 </span>

          <span v-if="ecreate_user"> create_user: {{ ecreate_user }} ，</span>
          <span v-if="ecreate_time"> create_time: {{ ecreate_time }} 】</span>
        </div>
        <div class="clm_right"><span>修改之前</span></div>
      </el-col>
      <div class="rowmerges strategymergemir">
        <codemirror
          :merge="true"
          :options="cmOption"
          @scroll="onCmScroll"
        ></codemirror>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="comparecl_confdialogFormVisible = false"
          size="small"
          type="primary"
          plain
        >
          返回修改
        </el-button>
        <el-button type="primary" @click="editstrategycreate()" size="small">
          确认修改并保存</el-button
        >
      </div>
    </el-dialog>

    <HistoryVersion :historycl_id="hiscl_id" ref="historyv"></HistoryVersion>
  </div>
</template>
<script src="@/assets/js/strategy.js"></script>

<style scoped>
.yamledita label {
  display: block;

  width: 100px;
  float: left;
  height: 40px;
  line-height: 40px;
  margin-left: 29px;
}
.el-dialog label {
  display: block;

  width: 100px;
  float: left;
  height: 36px;
  line-height: 36px;
  margin-left: 29px;
}
.el-row .el-select,
.el-row .el-input {
  float: left;
  width: 450px !important;
}
.strategy .el-dialog .el-dialog__body {
  position: relative;
  height: calc(100% - 160px) !important;
  display: block;
  overflow: hidden;
}

.yamledita::after,
.el-dialog__body .el-row::after {
  content: "*";
  width: 15px;
  height: 18px;
  display: block;
  color: red;
  position: absolute;
  left: 19px;
  top: 9px;
  font-size: 22px;
}
.el-dialog__body {
  padding: 40px !important;
}
.cell button {
  margin-right: 45px;
}
.el-dialog__body .el-row {
  margin-bottom: 10px;
}
.clm_left,
.clm_right {
  width: calc(50% - 40px);
  padding: 0px 20px;
  display: block;
  float: left;
}
.clm_right span {
  padding-left: 50px;
}
.clm_left h4,
.clm_left span {
  display: block;
  float: left;
  line-height: 25px;
  height: 25px;
}
.pdbtm25 {
  padding-bottom: 25px;
}
.codmirrorstragety {
  display: block;
  clear: both;
  width: calc(100% - 40px);
  margin-left: 20px;
  height: calc(100% - 190px);
}
.codmirrorstragety .vue-codemirror {
  height: 100% !important;
  display: block;
  line-height: 2em;
}
</style>