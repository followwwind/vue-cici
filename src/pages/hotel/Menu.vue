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
			<el-table-column prop="name" label="名称" width="120" sortable>
			</el-table-column>
			<!-- <el-table-column prop="status" label="状态" width="100" :formatter="formatStatus" sortable>
			</el-table-column> -->
			<el-table-column prop="price" label="价格" width="100" sortable>
			</el-table-column>
			<!-- <el-table-column prop="info" label="信息" width="120" sortable>
			</el-table-column> -->
			<el-table-column prop="createTime" label="时间" min-width="180" :formatter="formatDate" sortable>
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
				<el-form-item label="名称" prop="name">
					<el-input v-model="form.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="price">
					<el-input v-model="form.price" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="信息">
					<el-input type="textarea" v-model="form.info"></el-input>
				</el-form-item>
				<el-form-item label="图片" prop="type" style="width: 650px;">
					<el-upload 
					id="img-upload"
					action="localhost" 
					list-type="picture-card" 
					accept=".jpg, .png"
					:multiple="true"
					:limit="imageLimit"
					:file-list="images" 
					:on-preview="handlePictureCardPreview"
					:on-change="imageChange" 
					:on-remove="imageRemove" 
					:auto-upload="false">
					<i class="el-icon-plus"></i>
					</el-upload>
					<i class="tips">图片大小限制在3M以内</i>
				</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="formVisible = false">取消</el-button>
				<el-button type="primary" @click.native="submitForm" :loading="loading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import {save,update,del,pageList} from '@/api/menu';
	import {removeUser, getUser, setUser} from '@/utils/store';
	import {uploadImg} from '@/api/common'
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
				images: [], // 图片
				urlArr: [],
				imgUrl: '',
				imageLimit: 6, // 图片限制
				dialogImageUrl: '', // 上传预览
				dialogVisible: false, // 上传预览model,
				//新增界面数据
				form: {
					id: 0,
					name: '',
					price: '',
					info: '',
					img: '',
				}

			}
		},
		methods: {
			//性别显示转换
			formatStatus(row, column) {
				return row.status == 0 ? '空闲' : '占用';
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

				var user = getUser();
				// console.log(user.hotel);
				if(user.hotel == null || user.hotel == undefined){
					this.totalCount = 0;
					this.tableList = [];
				}else{
					// console.log(user.hotel);
					param.hotelId = user.hotel.id;
					pageList(param).then(res => {
						this.totalCount = res.totalCount
						this.tableList = res.data;
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
				let urlStr = row.img.split(",");
				this.images = [];
				this.urlArr = [];
				urlStr.forEach(item => {
					if(item != ""){
						let obj = new Object();
						obj.url = item;
						this.images.push(obj);
						this.urlArr.push(item);
					}
				});
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
				this.images = [];
				this.urlArr = [];
			},
			//提交
			submitForm() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.loading = true;
							let param = Object.assign({}, this.form);
							if(this.isAdd){
								var user = getUser()
								param.userId = user.id;
								// console.log(this.urlArr);
								if(user.hotel == null || user.hotel == undefined){
									this.$message({
										message: '请先完成酒店认证',
										type: 'warn'
									});
									return;
								}
								param.hotelId = user.hotel.id;
								param.img = "";
								this.urlArr.forEach(item => {
									param.img += item + ","
								});
								// console.log(param.img);
								param.img = param.img.substring(0, param.img.length - 1);
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
								param.userId = getUser().id;
								param.img = "";
								this.urlArr.forEach(item => {
									param.img += item + ","
								});
								// console.log(param.img);
								param.img = param.img.substring(0, param.img.length - 1);

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
			},
			imageChange(file, fileList) {
				if (this.imageSizeLimt(file.size)) {
					this.images = fileList
				} else {
					fileList.pop();
				}
				// console.log(flag);
				// 隐藏添加按钮处理
				const uploadPlus = document.getElementById('img-upload').lastChild;
				uploadPlus.style.display = (fileList.length >= this.imageLimit) ? 'none' : 'inline-block';
				let param = new FormData();
				this.urlArr = [];
				for (let j = 0; j < this.images.length; j++) {
					if (this.images[j].raw) {
					param.append('files', this.images[j].raw);
					} else if (this.images[j].url) {
						this.imgUrl += this.images[j].url + ','
						this.urlArr.push(this.images[j].url);
					}
				}
                uploadImg(param).then(res => {
					this.urlArr.push(res);
				})
			},
			imageRemove(file, fileList) {
				if (this.imageSizeLimt(file.size)) {
					this.images = fileList
				} else {
					fileList.pop();
				}
				// 隐藏添加按钮处理
				const uploadPlus = document.getElementById('img-upload').lastChild;
				uploadPlus.style.display = (fileList.length >= this.imageLimit) ? 'none' : 'inline-block';
				let param = new FormData();
				this.urlArr = [];
				for (let j = 0; j < this.images.length; j++) {
					if (this.images[j].raw) {
					param.append('files', this.images[j].raw);
					} else if (this.images[j].url) {
						this.imgUrl += this.images[j].url + ','
						this.urlArr.push(this.images[j].url);
					}
				}
				console.log(this.images);
				console.log(this.urlArr);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			imageSizeLimt(size) {
				if (size > 1024 * 1024 * 3) {
					this.$message.error('图片大小限制在3M内');
					return false
				} else {
					return true
				}
			},
		},
		mounted() {
			this.list();
		}
	}

</script>

<style scoped>

</style>