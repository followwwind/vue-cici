<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-date-picker v-model="filters.year" type="year" placeholder="选择年份"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="list">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!-- <el-table-column type="id" width="60">
			</el-table-column> -->
			<el-table-column prop="month" label="月份" width="120" sortable>
			</el-table-column>
			<el-table-column prop="money" label="收入" width="100" sortable>
			</el-table-column>
		</el-table>
		<el-row>
			<span>总计:{{totalCount}}</span>
		</el-row>
	</section>
</template>

<script>
	import {save,update,del,pageList} from '@/api/user';
	import {count} from '@/api/pay_order';
	import {removeUser, getUser, setUser} from '@/utils/store';
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
					year: this.filters.year
				};

				var user = getUser();
				if(user.hotel == null || user.hotel == undefined){
					this.totalCount = 0;
					this.tableList = [];
				}else{
					param.hotelId = user.hotel.id;
					count(param).then(res => {
						this.totalCount = res.total
						this.tableList = res.monthList;
						this.listLoading = false;
					})
				}
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