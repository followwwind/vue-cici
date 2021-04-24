<template>
	<section>
		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.username" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="list">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->

		<!--列表-->
		<el-table :data="tableList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="id" width="60">
			</el-table-column>
			<!-- <el-table-column prop="username" label="账号" width="120" sortable>
			</el-table-column> -->
			<el-table-column prop="roomId" label="房间号" width="100" sortable>
			</el-table-column>
			<el-table-column prop="startTime" label="开始时间" width="100" :formatter="formatDate" sortable>
			</el-table-column>
			<el-table-column prop="endTime" label="结束时间" width="120" :formatter="formatDate" sortable>
			</el-table-column>
			<!-- <el-table-column prop="realName" label="真实姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="cardNum" label="身份证" width="120" sortable>
			</el-table-column> -->
			<el-table-column prop="createTime" label="时间" min-width="150" :formatter="formatDate" sortable>
			</el-table-column>
			<el-table-column label="操作" width="350">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">二维码</el-button>
					<el-button type="danger" size="small" @click="handleMenu(scope.$index, scope.row)">点餐</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">评论</el-button>
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
		<el-dialog title = "评论" :visible.sync = "formVisible" :close-on-click-modal = "false">
			<el-form :model="form" label-width="80px" :rules="formRules" ref="form">
				<el-form-item label="内容" prop="content">
					<el-input v-model="form.content" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="formVisible = false">取消</el-button>
				<el-button type="primary" @click.native="submitForm" :loading="loading">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title = "信息" :visible.sync = "codeVisible" :close-on-click-modal = "false">
			<vue-qrcode :value="codeVal" />
		</el-dialog>
	</section>
</template>

<script>
	import {pageList} from '@/api/pay_order';
	import {save} from '@/api/comment';
	import {removeUser, getFrontUser} from '@/utils/store';
	import VueQrcode from 'vue-qrcode'
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
				codeVisible: false,
				payOrder: {},
				codeVal: {},
				isAdd: true,
				formVisible: false,//新增界面是否显示
				loading: false,
				formRules: {
					content: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					]
				},
				//新增界面数据
				form: {
					content: '',
				},
				

			}
		},
		components: {
			VueQrcode,
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
					userId: getFrontUser().id
				};
				pageList(param).then(res => {
					this.totalCount = res.totalCount
					this.tableList = res.data;
					this.listLoading = false;
				})
			},
			//删除
			handleDel(index, row) {
				this.form.content = "";
				this.formVisible = true;
				this.payOrder = row;
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.codeVal = JSON.stringify(row);
				this.codeVisible = true;

			},
			handleMenu(index, row) {
				this.$router.push('/app/menu/' + row.hotelId);
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
							param.hotelId = this.payOrder.hotelId;
							param.userId = getUser().id;
							param.parentId = 0,
							save(param).then((res) => {
								this.loading = false;
								//NProgress.done();
								this.$message({
									message: '评论成功',
									type: 'success'
								});
								// this.$refs['addForm'].resetFields();
								this.formVisible = false;
							});
							
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