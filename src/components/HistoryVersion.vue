<template>
  <div class="history">
    <el-dialog
      title="策略配置历史版本"
      modal
      destroy-on-close
      lock-scroll
      :close-on-click-modal="false"
      :visible.sync="versionlist_dialogFormVisible"
      class="strategy"
    >
      <template>
        <el-row class="topc">
          <el-button
            @click="compare()"
            type="primary"
            size="small"
            v-if="!compareing"
          >
            对比选中版本
          </el-button>
          <el-button type="info" size="small" v-else> 对比选中版本 </el-button>
        </el-row>
        <el-table
          :data="hsdt"
          height="calc(100% - 100px)"
          :select-on-indeterminate="false"
          style="width: 96%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="95" align="center">
          </el-table-column>
          <el-table-column
            prop="version"
            label="版本"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="currentv">
                {{ scope.$index === 0 ? "当前版本" : scope.row.version }}
              </span>
              <span v-else> {{ scope.row.version }} </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="update_user"
            label="更新人"
            width="220"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="currentv">
                {{ scope.row.update_user ? scope.row.update_user : "----" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="update_time"
            label="更新时间"
            width="220"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="cl_name" label="更新说明"> </el-table-column>
          <el-table-column label="操作" width="320" align="center">
            <template slot-scope="scope">
              <el-button
                @click="detail(scope.row)"
                type="primary"
                plain
                size="mini"
              >
                详情
              </el-button>

              <el-button
                v-if="scope.$index !== 0"
                @click="gobackto(scope.row)"
                type="primary"
                size="mini"
              >
                滚回到此版本
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
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="versionlist_dialogFormVisible = false"
          type="primary"
          size="small"
          plain
        >
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="策略版本对比"
      modal
      destroy-on-close
      lock-scroll
      :close-on-click-modal="false"
      :visible.sync="comparecl_confdialogFormVisible"
      class="strategy"
    >
      <el-col :span="24">
        <div class="clm_left">
          <span class="title" v-if="multipleSelection.length === 2">
            版本 {{ multipleSelection[1].version }}
          </span>
        </div>
        <div class="clm_right">
          <span class="title" v-if="multipleSelection.length === 2">
            版本 {{ multipleSelection[0].version }}
          </span>
        </div>
      </el-col>
      <div class="rowmerges">
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
          plain
          size="small"
        >
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="版本回滚对比确认"
      modal
      destroy-on-close
      lock-scroll
      :close-on-click-modal="false"
      :visible.sync="version_confdialogFormVisible"
      class="strategy"
    >
      <el-col :span="24">
        <div class="clm_left">
          <span class="title"> 版本 {{ currentversion }} （当前版本） </span>
        </div>
        <div class="clm_right">
          <span class="title"> 版本 {{ gotoversion }} </span>
        </div>
      </el-col>
      <el-row class="rowmerges">
        <codemirror
          :merge="true"
          :options="ccmOption"
          @scroll="onCmScroll"
        ></codemirror>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="version_confdialogFormVisible = false"
          type="primary"
          plain
          size="small"
        >
          关闭
        </el-button>

        <el-button @click="updatecfm(gotoversion)" type="primary" size="small">
          确认回滚到 版本 {{ gotoversion }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="`策略详情 — 版本【${details.version}】`"
      modal
      destroy-on-close
      lock-scroll
      :close-on-click-modal="false"
      :visible.sync="detail_dialogFormVisible"
      class="strategy"
    >
      <div class="editor-container">
        <yaml-editor v-model="detail_cl_conf" />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="detail_dialogFormVisible = false"
          type="primary"
          plain
          size="small"
        >
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script src="@/assets/js/historyversion.js"></script>
<style scoped>
.topc {
  width: 96%;
  margin: 0px auto;
  padding: 15px 0px;
}
.el-table {
  margin-left: 2%;
}
.clm_right span {
  padding-left: 55px;
}
.clm_left,
.clm_right {
  width: calc(50% - 40px);
  padding: 0px 20px;
  display: block;
  float: left;
  text-align: left;
  color: #ff4949;
  line-height: 35px;
}
.strategy .el-pagination {
  display: block;
  margin-right: 35px;
}
</style>
