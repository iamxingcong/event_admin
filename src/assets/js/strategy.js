
import YamlEditor from '@/components/YamlEditor/index.vue';
import HistoryVersion from '@/components/HistoryVersion.vue'

const yamlData = "";

export default {
    name: "Strategy",
    components: { YamlEditor, HistoryVersion },
    data() {
        return {
            domain: this.$store.state.domain,
            cl_conf: yamlData,
            dialogFormVisible: false,
            cl_name: '',
            cl_user: '',
            pipeline_id: '',
            ecl_name: '',
            ecl_user: '',
            epipeline_id: '',
            ecl_conf: '',
            ecl_confo: '',
            ecl_confa: '',
            ecl_con_editcfm: '',
            ecreate_user: '',
            ecreate_time: '',
            ppdt: [],
            strategylistdt: [],

            editdialogFormVisible: false,
            editcl_confdialogFormVisible: false,
            comparecl_confdialogFormVisible: false,
            currentPage: 0,
            page_data: {
                "total": 1,
                "now_page": 0,
                "num": 20,
                "total_page": 1
            },
            detail: {},
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
              //  scrollbarStyle: null, //隐藏滚动条

            },
            cmOptions: {
                readOnly: true,
                lineNumbers: true,
                line: true,
               // scrollbarStyle: null, //隐藏滚动条
            },
            hiscl_id: 0,
            loading: true
        }
    },
    created() {
        console.log(this.domain)
        this.pipelinelist()
        this.strategylist()
    },
    methods: {

        createStrategy() {
            this.dialogFormVisible = true
        },
        async strategylist() {


            try {
                var url = this.domain + "clmange/list"
                const response = await this.axios.get(url, {
                    params: {

                        numb: this.page_data.num,
                        page: this.page_data.now_page

                    },
                });

                if (response.data.code === 0) {
                    this.strategylistdt = response.data.list_data
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
        async pipelinelist() {

            try {
                var url = this.domain + "clmange/pipelinelist"
                const response = await this.axios.get(url);


                if (response.data.code === 0) {
                    this.ppdt = response.data.data


                }
            } catch (error) {
                console.log(error);
            }
        },
        async strategycreate() {

            if (!this.cl_conf || !this.pipeline_id || !this.cl_name || !this.cl_user) {
                this.$message({
                    message: "内容不完整！！",
                    type: 'error'
                });
                return
            }
            var bodyFormData = new FormData();
            bodyFormData.append('cl_name', this.cl_name);
            bodyFormData.append('cl_user', this.cl_user);
            bodyFormData.append('pipeline_id', this.pipeline_id);
            bodyFormData.append('cl_conf', this.cl_conf);

            try {
                var urls = this.domain + "clmange/create";

                const response = await this.axios({
                    url: urls,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: bodyFormData
                });


                if (response.data.code === 0) {
                    this.dialogFormVisible = false

                    this.$message({
                        message: response.data.msg,
                        type: 'success'
                    });


                    this.cl_name = ''
                    this.cl_user = ''
                    this.pipeline_id = ''
                    this.cl_conf = ''


                    this.strategylist()
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
        async edit(row) {



            try {
                var url = this.domain + "clmange/detail"
                const response = await this.axios.get(url, {
                    params: {

                        id: row.id
                    }
                });


                if (response.data.code === 0) {
                    this.editdialogFormVisible = true

                    this.detail = response.data.data

                    this.ecl_name = this.detail.cl_name
                    this.ecl_user = this.detail.cl_user
                    this.epipeline_id = this.detail.pipeline_id
                    this.ecl_conf = this.detail.cl_conf
                    this.ecl_confo = this.detail.cl_conf
                    this.ecreate_time = this.detail.create_time
                    this.cmOption.orig = this.detail.cl_conf
                    this.ecreate_user = this.detail.create_user

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
        gotoblue(row) {
            window.open(row.pipeline_url, '_blank');
        },
        async editstrategycreate() {

            var bodyFormData = new FormData();
            bodyFormData.append('cl_id', this.detail.id);
            bodyFormData.append('cl_name', this.ecl_name);
            bodyFormData.append('cl_user', this.ecl_user);
            bodyFormData.append('pipeline_id', this.epipeline_id);
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
                    //this.strategylist()
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
            this.strategylist()
        },
        handleCurrentChange(val) {

            this.page_data.now_page = val
            this.strategylist()
        },


        editstrategycl_conf() {
            this.ecl_confa = this.ecl_conf
            this.ecl_con_editcfm = this.ecl_conf

            this.editcl_confdialogFormVisible = true
        },
        comparestrategy() {


            this.cmOption.value = this.ecl_con_editcfm
            this.comparecl_confdialogFormVisible = true
        },
        onCmScroll() {
            console.log('onCmScroll')
        },
        editcl_confdialogFormVisiblef() {
            this.editcl_confdialogFormVisible = false

        },
        editdialogFormVisiblef() {
            this.editdialogFormVisible = false
            location.reload()
        },
        edit_open(v) {
            console.log(v)
            let routeData = this.$router.resolve({ path: 'Strategy_Edit', query: { 'id': v.id } })
            console.log(routeData)
            window.open(routeData.href, '_blank')
        },
        history(v){
            console.log(v)
            this.hiscl_id = v.id
            this.$refs.historyv.version(v.id);
        },
        async editdialogFormVisible_clconf(){
           
         
                var bodyFormData = new FormData();
                bodyFormData.append('cl_id', this.detail.id);
                bodyFormData.append('cl_name', this.ecl_name);
                bodyFormData.append('cl_user', this.ecl_user);
                bodyFormData.append('pipeline_id', this.epipeline_id);
                bodyFormData.append('cl_conf', this.ecl_conf);
    
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
     
        }
    }
}