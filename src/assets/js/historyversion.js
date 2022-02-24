
import YamlEditor from '@/components/YamlEditor/index.vue';


const yamlData = "";
export default {
    name: "HistoryVersion",
    components: { YamlEditor },
    data() {
        return {
            domain: this.$store.state.domain,
            versionlist_dialogFormVisible: false,
            comparecl_confdialogFormVisible: false,
            detail_dialogFormVisible: false,
            version_confdialogFormVisible: false,
            hsdt: {},
            multipleSelection: [],
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
              //  scrollbarStyle: null, //隐藏滚动条

            },
            ccmOption: {
                value: "<p>hello</p>",
                origLeft: null,
                orig: "<p>hello world</p>",
                connect: "align",
                lineNumbers: true,
                collapseIdentical: false,
                highlightDifferences: true,
                readOnly: true,
                autoRefresh: true,
             //   scrollbarStyle: null, //隐藏滚动条

            },
            compareing: false,
            detail_cl_conf: yamlData,
            details: {
                version: ''
            },
            currentPage: 0,
            page_data: {
                total: 1,
                now_page: 0,
                num: 20,
                total_page: 1
            },
            currentversion: '',
            gotoversion: '',
            currentv: true,
            cl_id: ''
        };
    },
    props: {
        historycl_id: Number,
    },
    methods: {
        async version(v) {
            this.cl_id = v
            try {
                var url = this.domain + "clmange/getHistoryClList";

                const response = await this.axios.get(url, {
                    params: {
                        cl_id: v,
                        page: this.page_data.now_page,
                        num: this.page_data.num
                    },
                });

                if (response.data.code === 0) {
                    if (response.data.list_data.length >= 1) {
                        this.hsdt = response.data.list_data;
                        this.versionlist_dialogFormVisible = true;
                        this.page_data = response.data.page_data
                        this.currentversion = response.data.list_data[0].version
                        console.log('currentversion is:' + this.currentversion)
                        this.currentv = true
                    } else {
                        this.$message.error("当前策略历史版本为空！");
                    }

                }
            } catch (error) {
                console.log(error);
            }
        },
        async pversion() {

            try {
                var url = this.domain + "clmange/getHistoryClList";

                const response = await this.axios.get(url, {
                    params: {
                        cl_id: this.cl_id,
                        page: this.page_data.now_page,
                        num: this.page_data.num
                    },
                });

                if (response.data.code === 0) {
                    if (response.data.list_data.length >= 1) {

                        this.hsdt = response.data.list_data;
                        this.versionlist_dialogFormVisible = true;
                        this.page_data = response.data.page_data
                        if (response.data.page_data.now_page === 0) {
                            this.currentv = true
                        } else {
                            this.currentv = false
                        }
                    } else {
                        this.$message.error("当前策略历史版本为空！");
                    }

                }
            } catch (error) {
                console.log(error);
            }
        },
        toggleSelection(rows) {
            console.log(rows);
            if (rows) {
                rows.forEach((row) => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val);

            if (val.length > 2) {
                this.$message.error("请选择 2 个版本进行对比！");
                this.compareing = true

            } else {
                this.compareing = false
            }
        },
        async detail(v) {


            var url = this.domain + "clmange/getHistoryClDetail";
            try {
                const response = await this.axios.get(url, {
                    params: {
                        cl_id: v.cl_id,
                        version: v.version,
                    },
                });

                if (response.data.code === 0) {
                    this.detail_dialogFormVisible = true
                    this.detail_cl_conf = response.data.data.cl_conf
                    this.details = response.data.data
                    console.log(' details ')
                }
            } catch (error) {
                console.log(error);
            }
        },

        async updatecl_conf(v) {

            var bodyFormData = new FormData();
            bodyFormData.append('cl_id', v.cl_id);
            bodyFormData.append('cl_name', v.cl_name);
            bodyFormData.append('cl_user', v.cl_user);
            bodyFormData.append('pipeline_id', v.pipeline_id);
            bodyFormData.append('cl_conf', v.cl_conf);

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

                    this.$message({
                        type: 'success',
                        message: '回滚成功!'
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
        async updatecfm(v) {

            var updetails = {}
            var url = this.domain + "clmange/getHistoryClDetail";
            try {
                const response = await this.axios.get(url, {
                    params: {
                        cl_id: this.cl_id,
                        version: v,
                    },
                });

                if (response.data.code === 0) {

                    updetails = response.data.data
                    console.log(' details ')
                    this.updatecl_conf(updetails)
                }
            } catch (error) {
                console.log(error);

            }




        },
        async gobackto(v) {

            console.log(v)
            this.gotoversion = v.version
            var successcount = 0



            var url = this.domain + "clmange/getHistoryClDetail";
            try {
                const response = await this.axios.get(url, {
                    params: {
                        cl_id: v.cl_id,
                        version: v.version,
                    },
                });

                if (response.data.code === 0) {
                    successcount++

                    this.ccmOption.orig = response.data.data.cl_conf
                    console.log("i am " + v.version);
                }
            } catch (error) {
                console.log(error);
            }

            try {
                const response = await this.axios.get(url, {
                    params: {
                        cl_id: v.cl_id,
                        version: this.currentversion,
                    },
                });

                if (response.data.code === 0) {
                    successcount++

                    this.ccmOption.value = response.data.data.cl_conf
                    console.log("i am " + this.currentversion);
                }
            } catch (error) {
                console.log(error);
            }


            if (successcount == 2) {
                successcount = 0
                this.version_confdialogFormVisible = true

            }

        },
        async compare() {

            var successcount = 0
            console.log(this.multipleSelection);
            if (this.multipleSelection.length !== 2) {
                this.$message.error("请选择 2 个版本进行对比！");
                return false;
            } else {

                this.compareing = true
                var url = this.domain + "clmange/getHistoryClDetail";
                try {
                    const response = await this.axios.get(url, {
                        params: {
                            cl_id: this.multipleSelection[0].cl_id,
                            version: this.multipleSelection[0].version,
                        },
                    });

                    if (response.data.code === 0) {
                        successcount++

                        this.cmOption.orig = response.data.data.cl_conf
                        console.log("i am 1");
                    }
                } catch (error) {
                    console.log(error);
                }

                try {
                    const response = await this.axios.get(url, {
                        params: {
                            cl_id: this.multipleSelection[1].cl_id,
                            version: this.multipleSelection[1].version,
                        },
                    });

                    if (response.data.code === 0) {
                        successcount++

                        this.cmOption.value = response.data.data.cl_conf
                        console.log("i am 2");
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            if (successcount == 2) {
                successcount = 0
                this.comparecl_confdialogFormVisible = true
                this.compareing = false

            }
        },
        onCmScroll() {
            console.log("onCmScroll");
        },
        handleSizeChange(val) {

            this.page_data.num = val
            this.pversion()
            
        },
        handleCurrentChange(val) {

            this.page_data.now_page = val - 1
            this.pversion()
        },
    },
};