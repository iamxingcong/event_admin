<template>
  <div class="content">
    <el-row class="pdbtm25">
      <label> 策略名称: </label>
      <el-select v-model="cl_id" placeholder="请选择" size="medium">
        <el-option
          v-for="item in strategylistdt"
          :key="item.id"
          :label="item.cl_name"
          :value="item.id"
        >
        </el-option>
      </el-select>

      <label> 流水线状态: </label>
      <el-select v-model="pipeline_status" placeholder="请选择" size="medium">
        <el-option
          v-for="item in optionsa"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <label> 自动化状态: </label>
      <el-select v-model="auto_status" placeholder="请选择" size="medium">
        <el-option
          v-for="item in optionsb"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <label> 事件时间: </label>

      <el-date-picker
        size="medium"
        v-model="datetime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>

      <el-button
        type="primary"
        @click="btncheck()"
        size="small"
        icon="el-icon-search"
      >
        查询
      </el-button>
      <el-button
        type="info"
        @click="resetbtn()"
        size="small"
        class="el-icon-refresh-left"
      >
        重置
      </el-button>
    </el-row>

    <el-table
      :data="tableData"
      style="width: 100%"
      height="calc(100% - 90px)"
      v-loading="loading"
    >
      <el-table-column label="事件名称">
        <template slot-scope="scope">
          <el-button @click="handleClicke(scope.row)" type="text">
            {{ scope.row.event_name }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="start_time" label="开始时间" align="center">
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.end_time ? scope.row.end_time : "---" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cl_id" label="策略名称" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleStrategy(scope.row)"
            type="primary"
            size="mini"
          >
            {{ scope.row.cl_name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="流水线状态" align="center">
        <template slot-scope="scope">
          <div
            :class="
              scope.row.pipeline_status | filterss(scope.row.pipeline_status)
            "
          >
            {{ scope.row.pipeline_status | filtera(scope.row.pipeline_status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="自动化状态" align="center">
        <template slot-scope="scope">
          <div :class="scope.row.auto_status | filterss(scope.row.auto_status)">
            {{ scope.row.auto_status | filterb(scope.row.auto_status) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="详情" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text">
            自动化详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
      title="策略方案"
      :visible.sync="ddialogVisible"
      class="strategy"
      modal
      :close-on-click-modal="false"
    >
      <el-row>
        <label>策略名称：</label
        ><span class="lb"> {{ strategydetail.cl_name }} </span>
      </el-row>
      <el-row>
        <label>策略负责人：</label
        ><span class="lb"> {{ strategydetail.cl_user }} </span>
      </el-row>
      <el-row>
        <label> 创建时间：</label
        ><span class="lb"> {{ strategydetail.create_time }} </span>
      </el-row>

      <el-row>
        <label> 更新时间：</label
        ><span class="lb"> {{ strategydetail.update_time }} </span>
      </el-row>
      <el-row>
        <label> 策略详情： </label>

        <el-button
          @click="editx_cl_cofdetail(strategydetail.id)"
          type="primary"
          size="small"
        >
          编辑策略
        </el-button>
      </el-row>

      <div class="eventcodemirror">
        <codemirror
          ref="myCm"
          :value="strategydetail.cl_conf"
          :options="cmOptions"
        >
        </codemirror>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="ddialogVisible = false"
          size="small"
          type="primary"
          plain
          >取 消</el-button
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
      <div class="eventeditcodemirror">
        <div class="editor-container">
          <yaml-editor v-model="ecl_con_editcfm" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="editcl_confdialogFormVisiblef()"
          type="primary"
          size="small"
          plain
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
          <span>修改之后</span>

          <span>
            【 create_user： {{ create_user ? create_user : "空" }}
            ， create_time：
            {{ create_time }} 】
          </span>
        </div>
        <div class="clm_right"><span>修改之前</span></div>
      </el-col>
      <div class="rowmerges eventclcompare">
        <codemirror
          :merge="true"
          :options="cmOption"
          @scroll="onCmScroll"
        ></codemirror>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="comparecl_confdialogFormVisible = false"
          type="primary"
          size="small"
          plain
        >
          返回修改
        </el-button>
        <el-button type="primary" size="small" @click="editstrategycreate()">
          确认修改并保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script src="@/assets/js/event.js"></script>
<style scoped>
@media screen and (max-width: 1681px) {
  .pdbtm25 .el-select {
    width: 160px;
  }
}
@media screen and (min-width: 1681px) {
  .pdbtm25 .el-select {
    margin-right: 5px;
  }
}

@media screen and (min-width: 1781px) {
  .pdbtm25 .el-select {
    margin-right: 25px;
  }
}

.c_normal {
  background-color: #e7faf0;
  border-color: #d0f5e0;
  color: #13ce66;
}
.pdbtm25 .el-button {
  margin-left: 15px;
}
.pdbtm25 .el-select {
  float: left;
}
.el-date-editor,
.el-col .el-select {
  float: left;
  margin-left: 5px;
}

.yamledita label {
  display: block;
  margin-right: 35px;
  width: 100px;
  float: left;
  height: 40px;
  line-height: 40px;
  margin-left: 5px;
}
.el-dialog__body label {
  margin-left: 19px;
}
.el-col .el-button {
  float: right;
  margin-left: 5px;
}
.el-table th {
  background-color: #f1f1f1 !important;
}
.el-dialog__body label {
  width: 100px;
  text-align: left;
  float: left;
}
.pdbtm25 {
  padding-bottom: 25px;
}
.pdbtm25 label {
  display: block;
  margin-right: 5px;
  float: left;
  height: 36px;
  line-height: 36px;
  margin-left: 5px;
}

.el-dialog__body .el-row label,
.el-dialog__body .el-row .lb {
  line-height: 35px;
  height: 35px;
  display: block;
}

.editor-container {
  padding-top: 15px;
}
.clm_left,
.clm_right {
  width: calc(50% - 40px);
  padding: 0px 20px;
  display: block;
  float: left;
  text-align: left;
  line-height: 35px;
}
.clm_right span {
  padding-left: 55px;
}
.eventcodemirror {
  height: calc(100% - 165px) !important;
  padding-top: 15px;
  width: calc(100% - 40px) !important;
  margin-left: 20px;
}
.eventcodemirror .vue-codemirror {
  height: 100% !important;
}
.eventeditcodemirror {
  height: 100%;
}
.eventclcompare,
.eventclcompare .vue-codemirror {
  height: 100%;
}
</style>