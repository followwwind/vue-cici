<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="" style="padding-bottom: 50px;padding-top: 50px;text-algin:center;">
				<el-row type="flex" class="row-bg">
					<el-col :span="6"></el-col>
					<el-col :span="12"><el-input v-model="filters.name" placeholder=""></el-input></el-col>
					<el-col :span="6"><el-button type="primary" v-on:click="list">搜索</el-button></el-col>
				</el-row>
			</el-col>
		</el-row>

		<el-row>
			<div v-for="(item) in tableList" :key="item" style="float: left; margin-left: 60px; margin-top: 10px;">
					<img :src="item.img" style="width: 300px; height: 300px;">
					<div style="margin-top: 10px;">
						<el-row type="flex" class="row-bg">
							<el-col :span="6"><span>酒店: {{item.name}}</span></el-col>
							<el-col :span="6"><span>电话: {{item.phone}}</span></el-col>
							<el-col :span="6"></el-col>
							<el-col :span="6"><el-button type="primary" v-on:click="view(item.id)">view</el-button></el-col>
						</el-row>
					</div>
				</div>
		</el-row>

		<!--工具条-->
		<el-col :span="24">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="lineNumber" :total="totalCount" style="text-align:center">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import {save,update,del,pageList} from '@/api/knowledge';
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				tableList: [],
				totalCount: 0,
				pageNumber: 1,
				lineNumber: 10,
				listLoading: false,
				sels: [],//列表选中列

				isAdd: true,
				formVisible: false,//新增界面是否显示
				loading: false,
				formRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				form: {
					id: 0,
					username: '',
					type: '',
					password: '',
					nickname: '',
					email: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatType(row, column) {
				return row.type == 1 ? '用户' : (row.type == 2 ? '酒店用户' : '管理员');
			},
			formatDate(row, column) {
                let date = new Date(parseInt(row.createTime));
                let Y = date.getFullYear() + '-';
                let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
                let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
                let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m + s;
            },
			handleCurrentChange(val) {
				this.pageNumber = val;
				this.list();
			},
			//获取用户列表
			list() {
				let param = {
					pageNumber: this.pageNumber,
					lineNumber: this.lineNumber,
					name: this.filters.name
				};
				pageList(param).then(res => {
					this.totalCount = res.totalCount
					this.tableList = res.data;
					this.listLoading = false;
				})
			},
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					del(row.id).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.list();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.formVisible = true;
				this.isAdd = false;
				this.form = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd() {
				this.formVisible = true;
				this.isAdd = true;
				this.form = {
					id: 0,
					username: '',
					type: '',
					password: '',
					nickname: '',
					email: ''
				};
			},
			view(id){
				this.$router.push({ path: '/app/hotel/' + id });
			},
			//提交
			submitForm() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.loading = true;
							let param = Object.assign({}, this.form);
							if(this.isAdd){
								save(param).then((res) => {
									this.loading = false;
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									// this.$refs['addForm'].resetFields();
									this.formVisible = false;
									this.list();
								});
							}else{
								update(param).then((res) => {
									this.loading = false;
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									// this.$refs['addForm'].resetFields();
									this.formVisible = false;
									this.list();
								});
							}
							
						});
					}
				});
			},
			selsChange(sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove() {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					// let para = { ids: ids };
					// batchRemoveUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.list();
		}
	}

</script>

<style scoped>

</style>