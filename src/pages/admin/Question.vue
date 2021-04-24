<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="list">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="id" width="60">
			</el-table-column>
			<el-table-column prop="id" label="id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="title" label="标题" width="120" sortable>
			</el-table-column>
			<el-table-column prop="userId" label="用户id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="content" label="问题内容" width="120" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="120" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="lineNumber" :total="totalCount" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增编辑界面-->
		<el-dialog :title = "isAdd?'新增':'修改'" :visible.sync = "formVisible" :close-on-click-modal = "false">
			<el-form :model="form" label-width="80px" :rules="formRules" ref="form">
				<el-form-item label="标题" prop="title">
					<el-input v-model="form.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户id" prop="userId">
					<el-input v-model="form.userId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="问题内容" prop="content">
					<el-input v-model="form.content" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="formVisible = false">取消</el-button>
				<el-button type="primary" @click.native="submitForm" :loading="loading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import {save,update,del,pageList} from '@/api/question';
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
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				form: {
					id: '',
					title: '',
					userId: '',
					content: '',
					createTime: '',
				}

			}
		},
		methods: {
			//类型转换
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