

var lastMonthToday = new Date(
    new Date().getTime() - 30 * 24 * 60 * 60 * 1000
);
var lastMonthYear = lastMonthToday.getFullYear();
var lastMonth = lastMonthToday.getMonth() + 1;
var lastMonthDay =
    lastMonthToday.getDate < 10
        ? "0" + lastMonthToday.getDate
        : lastMonthToday.getDate();
var lastMonthKsrq = lastMonthYear + "-" + lastMonth + "-" + lastMonthDay;

var nextMonthToday = new Date(
    new Date().getTime() + 30 * 24 * 60 * 60 * 1000
);
var nextMonthYear = nextMonthToday.getFullYear();
var nextMonth = nextMonthToday.getMonth() + 1;
var nextMonthDay =
    nextMonthToday.getDate < 10
        ? "0" + nextMonthToday.getDate
        : nextMonthToday.getDate();
var nextMonthJsrq = nextMonthYear + "-" + nextMonth + "-" + nextMonthDay;


import YamlEditor from '@/components/YamlEditor/index.vue';

var yamlData = "";

export default {
    name: "Event",
    components: { YamlEditor },
    data() {
        return {
            domain: this.$store.state.domain,
            cl_id: null,
            optionsa: [
                {
                    value: null,
                    label: "全部",
                },
                {
                    value: -1,
                    label: "构建失败",
                },
                {
                    value: 1,
                    label: "执行中",
                },
                {
                    value: 2,
                    label: "执行失败",
                },
                {
                    value: 3,
                    label: "已结束",
                },
            ],
            pipeline_status: null,

            optionsb: [
                {
                    value: null,
                    label: "全部",
                },
                {
                    value: 1,
                    label: "执行中",
                },
                {
                    value: 2,
                    label: "执行失败",
                },
                {
                    value: 3,
                    label: "已结束",
                },
            ],
            auto_status: null,
            datetime: [lastMonthKsrq, nextMonthJsrq],
            tableData: [],
            currentPage: 0,
            page_data: {
                total: 1,
                now_page: 0,
                num: 20,
                total_page: 1
            },
            now_page: 0,
            ddialogVisible: false,
           
            editcl_confdialogFormVisible: false,
            comparecl_confdialogFormVisible: false,
            strategydetail: {
                cl_user: '',
                cl_conf: yamlData,
                id: 0
            },
            originalcl_conf: '',
            ecl_con_editcfm: '',
            strategylistdt: [],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            cmOption: {
                value: '<p>hello</p>',
                origLeft: null,
                orig: '<p>hello world</p>',
                connect: 'align',
                lineNumbers: true,
                collapseIdentical: false,
                highlightDifferences: true,
                readOnly: true,
                autoRefresh: true,
               // scrollbarStyle: null, //隐藏滚动条
            },
            cmOptions: {
                readOnly: true,
                lineNumbers: true,
                line: true,
                collapseIdentical: false,
                autoRefresh: true,
               // scrollbarStyle: null, //隐藏滚动条

            },
            create_user: '',
            create_time: '',
            edcl_id: '',
            edpipeline_id: '',
            edcl_name: '',
            edcl_user: '',
            loading: true

        }
    },
    filters: {
        filterss(v){
            if(!v){
                return '';
            }
            let content = "";
            switch(v) {
                case -1: content = "fail"; break;
                case 1: content = "doing"; break;
                case 2: content = "fail"; break;
                case 3: content = "over"; break;
                default: content = "";

            }
            return content;
        },
        filtera(v) {

            if (!v) return '';
            let content = "";
            switch (v) {
                case -1: content = "构建失败"; break;
                case 1: content = "执行中"; break;
                case 2: content = "执行失败"; break;
                case 3: content = "已结束"; break;
                default: content = "不在范围内";
            }
            return content;

        },
        filterb(v) {

            if (!v) return '';
            let content = "";
            switch (v) {
                case 1: content = "执行中"; break;
                case 2: content = "执行失败"; break;
                case 3: content = "已结束"; break;
                default: content = "不在范围内";
            }
            return content;

        }
    },
    created() {
        this.strategylist()
        this.check()
    },
    computed: {
        codemirror() {
            return this.$refs.myCm.codemirror;
        },
    },
    methods: {
        async strategylist() {

            try {
                var url = this.domain + "clmange/list";
                const response = await this.axios.get(url, {
                    params: { num: 50, page: 0 }
                });


                if (response.data.code === 0) {
                    this.strategylistdt = response.data.list_data

                } else {
                    this.$message({
                        message: response.data.msg,
                        type: 'error'
                    });
                }
            } catch (error) {
                console.log(error);
                this.$message({
                    message: error.message,
                    type: 'error'
                });
            }
        },
        async btncheck() {
            if (!this.datetime) {
                this.$message({
                    showClose: true,
                    message: "日期不能为空！！",
                    type: "error",
                });
                return;
            }
            try {
                var url = this.domain + "event/list";
                const response = await this.axios.get(url, {
                    params: {
                        start_time: this.datetime[0],
                        end_time: this.datetime[1],
                        auto_status: this.auto_status,
                        pipeline_status: this.pipeline_status,
                        page: this.now_page,
                        num: this.page_data.num,
                        cl_id: this.cl_id
                    },
                });


                if (response.data.code === 0) {
                    this.tableData = response.data.list_data;
                    this.page_data = response.data.page_data;
                    this.loading = false
                } else {
                    this.$message({
                        message: response.data.msg,
                        type: 'error'
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
        async check() {
            if (!this.datetime) {
                this.$message({
                    showClose: true,
                    message: "日期不能为空！！",
                    type: "error",
                });
                return;
            }
            try {
                var url = this.domain + "event/list";
                const response = await this.axios.get(url, {
                    params: {
                        start_time: this.datetime[0],
                        end_time: this.datetime[1],
                        auto_status: this.auto_status,
                        pipeline_status: this.pipeline_status,
                        page: this.page_data.now_page,
                        num: this.page_data.num,
                        cl_id: this.cl_id
                    },
                });


                if (response.data.code === 0) {
                    this.tableData = response.data.list_data;
                    this.page_data = response.data.page_data;
                    this.loading = false
                } else {
                    this.$message({
                        message: response.data.msg,
                        type: 'error'
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
        handleSizeChange(val) {

            this.page_data.num = val
            this.check()
        },
        handleCurrentChange(val) {

            this.page_data.now_page = val - 1
            this.check()
        },
        handleClick(row) {


            window.open(row.pipeline_url, '_blank');
        },
        handleClicke(row) {


            window.open(row.oncall_url, '_blank');
        },
        async handleStrategy(row) {

            // it seems cl_id is wront, mixed with cl_id , id
            try {
                var url = this.domain + "clmange/detail";
                const response = await this.axios.get(url, {
                    params: {
                        id: row.cl_id
                    },
                });


                if (response.data.code === 0) {
                    yamlData = response.data.data.cl_conf

                    this.strategydetail = response.data.data
                    this.ddialogVisible = true
                }
            } catch (error) {
                console.log(error);
            }
        },
        resetbtn() {
            this.auto_status = null
            this.pipeline_status = null
            this.cl_id = null
            this.datetime = [lastMonthKsrq, nextMonthJsrq]
            this.check()
        },
         
         
        async editx_cl_cofdetail(id) {
            console.log(id)

            try {
                var url = this.domain + "clmange/detail";
                const response = await this.axios.get(url, {
                    params: {
                        id: id
                    },
                });


                if (response.data.code === 0) {

                    this.ecl_con_editcfm = response.data.data.cl_conf
                    this.cmOption.orig = response.data.data.cl_conf
                    this.edcl_id = response.data.data.id
                    this.edpipeline_id = response.data.data.pipeline_id
                    this.edcl_name = response.data.data.cl_name

                    this.edcl_user = response.data.data.cl_user
                    this.edcl_conf = response.data.data.cl_conf

                    this.create_user = response.data.data.create_user
                    this.create_time = response.data.data.create_time

                    this.editcl_confdialogFormVisible = true

                }
            } catch (error) {
                console.log(error);
            }

        },
        editcl_confdialogFormVisiblef() {
            this.editcl_confdialogFormVisible = false
        },
        comparestrategy() {
            this.cmOption.value = this.ecl_con_editcfm
            this.comparecl_confdialogFormVisible = true
        },
        onCmScroll() {
            console.log('onCmScroll')
        },
        async editstrategycreate() {

            var bodyFormData = new FormData();
            bodyFormData.append('cl_id', this.edcl_id);
            bodyFormData.append('cl_name', this.edcl_name);
            bodyFormData.append('cl_user', this.edcl_user);
            bodyFormData.append('pipeline_id', this.edpipeline_id);
            bodyFormData.append('cl_conf', this.ecl_con_editcfm);

            try {
                var urls = this.domain + "clmange/update";

                const response = await this.axios({
                    url: urls,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: bodyFormData
                });


                if (response.data.code === 0) {
                    this.editdialogFormVisible = false
                    this.editcl_confdialogFormVisible = false
                    this.comparecl_confdialogFormVisible = false
                    this.$message({
                        message: response.data.msg,
                        type: 'success'
                    });
                    location.reload()

                } else {
                    this.$message({
                        message: response.data.msg,
                        type: 'error'
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};