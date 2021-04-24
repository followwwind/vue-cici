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
			<el-table-column prop="username" label="账号" width="120" sortable>
			</el-table-column>
			<!-- <el-table-column prop="password" label="密码" width="120" sortable>
			</el-table-column> -->
			<el-table-column prop="sex" label="性别" width="120" sortable :formatter="formatSex">
			</el-table-column>
			<el-table-column prop="nickname" label="昵称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="type" label="用户类型" width="120" sortable :formatter="formatType">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="120" sortable :formatter="formatStatus">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="120" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.type == 1">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" :disabled="scope.row.type == 1">删除</el-button>
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
				<el-form-item label="账号" prop="username">
					<el-input v-model="form.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" auto-complete="off" type="password"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<!-- <el-input v-model="form.sex" auto-complete="off"></el-input> -->
					<el-select v-model="form.sex" placeholder="性别" auto-complete="off">
						<!-- <el-option label="超级管理员" :value="1"></el-option> -->
						<el-option label="男" :value="'1'"></el-option>
						<el-option label="女" :value="'2'"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="form.nickname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户类型" prop="type">
					<!-- <el-input v-model="form.type" auto-complete="off"></el-input> -->
					<el-select v-model="form.type" placeholder="用户类型" auto-complete="off">
						<!-- <el-option label="超级管理员" :value="1"></el-option> -->
						<el-option label="管理员" :value="2"></el-option>
						<el-option label="用户" :value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					 <!-- 0：正常，1：禁止评论，2：禁止发表知识点，3：用户永久封号 -->
					<!-- <el-input v-model="form.status" auto-complete="off"></el-input> -->
					<el-select v-model="form.status" placeholder="状态" auto-complete="off">
						<el-option label="正常" :value="0"></el-option>
						<el-option label="禁止评论" :value="1"></el-option>
						<el-option label="禁止发表知识点" :value="2"></el-option>
						<el-option label="用户永久封号" :value="3"></el-option>
					</el-select>
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
	import {save,update,del,pageList} from '@/api/user';
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
					username: '',
					password: '',
					sex: '',
					nickname: '',
					type: '',
					status: '',
					createTime: '',
				}

			}
		},
		methods: {
			//类型转换
			formatType(row, column) {
				// 1：超级管理员，2:管理员, 3用户
				let arr = ['超级管理员', '管理员', '用户'];
				return  arr[row.type - 1];
			},
			formatSex(row, column) {
				// 1：超级管理员，2:管理员, 3用户
				let arr = ['', '管理员', '用户'];
				return  row.sex == 1 ? '男':(row.sex == 2 ? '女': '未知');
			},
			formatStatus(row, column) {
				// 0：正常，1：禁止评论，2：禁止发表知识点，3：用户永久封号
				let arr = ['正常', '禁止评论', '禁止发表知识点', '用户永久封号'];
				return  arr[row.status];
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