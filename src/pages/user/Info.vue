<template>
	<div>
		<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
			<el-form-item label="酒店封面" prop="type" style="width: 650px;">
				<img style="width:150px;height:150px;" :src="hotel.img"/>
			</el-form-item>
			<el-form-item label="名称">
				<el-input v-model="hotel.name" disabled></el-input>
			</el-form-item>
			<el-form-item label="联系电话">
				<el-input v-model="hotel.phone" disabled></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<el-input v-model="hotel.label" disabled></el-input>
			</el-form-item>
			<!-- <el-form-item>
				<el-button type="primary" @click="submitForm">保存</el-button>
			</el-form-item> -->
		</el-form>
		<el-row style="margin:20px;">
			<el-tabs v-model="activePath" @tab-click="handleClick">
				<el-tab-pane label="房间预定" name="/app/room">
					<el-table :data="roomList" highlight-current-row v-loading="listLoading" style="width: 100%;">
						<!-- <el-table-column type="selection" width="55">
						</el-table-column> -->
						<el-table-column type="id" width="60">
						</el-table-column>
						<el-table-column prop="name" label="名称" width="120" sortable>
						</el-table-column>
						<el-table-column prop="status" label="状态" width="100" :formatter="formatStatus" sortable>
						</el-table-column>
						<el-table-column prop="price" label="价格" width="100" sortable>
						</el-table-column>
						<el-table-column prop="info" label="信息" width="120" sortable>
						</el-table-column>
						<el-table-column prop="createTime" label="时间" min-width="180" :formatter="formatDate" sortable>
						</el-table-column>
						<el-table-column label="操作" width="150">
							<template slot-scope="scope">
								<el-button size="small" @click="roomEdit(scope.$index, scope.row)">详情</el-button>
								<el-button type="danger" size="small" @click="roomDel(scope.$index, scope.row)">预定</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="位置交通" name="/app/position">
					<div class="amap-wrapper">
						<el-amap class="amap-box" :vid="'amap-vue'" :zoom="zoom" :center="center">
							<el-amap-marker vid="component-marker" :position="componentMarker.position" :content-render="componentMarker.contentRender" ></el-amap-marker>
							<el-amap-marker :position="componentMarker.position"  :visible="componentMarker.visible"></el-amap-marker>
						</el-amap>
					</div>
				</el-tab-pane>
				<el-tab-pane label="点评问答" name="/app/comment">
					<!-- <el-form :inline="true" >
						<el-form-item >
							<el-input style="width:700px;" type="textarea" v-model="content" placeholder=""></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="add">评论</el-button>
						</el-form-item>
					</el-form> -->
					<el-table :data="commentList" highlight-current-row v-loading="cListLoading"  style="width: 100%;">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column type="id" width="60">
						</el-table-column>
						<el-table-column prop="userId" label="账号" width="120" sortable>
						</el-table-column>
						<el-table-column prop="content" label="内容" width="120" sortable>
						</el-table-column>
						<el-table-column prop="createTime" label="时间" min-width="180" :formatter="formatDate" sortable>
						</el-table-column>
						<!-- <el-table-column label="操作" width="150">
							<template slot-scope="scope">
								<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column> -->
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-row>

		<!--新增编辑界面-->
		<el-dialog title = "浏览" :visible.sync = "dialogVisible" :close-on-click-modal = "false">
			<el-form :model="form" label-width="80px" ref="form">
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
					:on-remove="imageChange" 
					:auto-upload="false">
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible = false">取消</el-button>
				<!-- <el-button type="primary" @click.native="submitForm" :loading="loading">提交</el-button> -->
			</div>
		</el-dialog>

		<el-dialog title = "预定" :visible.sync = "orderFormVisible" :close-on-click-modal = "false">
			<el-form :model="order" label-width="80px" ref="form">
				<el-form-item label="时间" prop="">
					<el-date-picker
						v-model="orderArr"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						align="right">
						</el-date-picker>
				</el-form-item>
				<div v-for="(item,index) in personList">
					<el-form-item label="姓名" prop="">
						<el-input v-model="item.realName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="身份证" prop="">
						<el-col><el-input v-model="item.cardNum" auto-complete="off"></el-input></el-col>
						<el-col><el-button type="text" @click="deleteItems(item, index)" icon="el-icon-delete" v-show="index>0" >删除</el-button></el-col>
					</el-form-item>
				</div>
				<el-form-item>
          			<el-button type="text" @click="addItem" style="position: relative;"><i class="el-icon-circle-plus"></i>新增</el-button>
        		</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="orderFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="submitForm" :loading="orderLoading">提交</el-button>
			</div>
		</el-dialog>

		<!-- 上传图片预览 -->
		<el-dialog :visible.sync="imgDialogVisible">
		<img width="100%" :src="imgDialogImageUrl" alt>
		</el-dialog>
	</div>
</template>

<script>
	import {uploadImg} from '@/api/common'
	import {get} from '@/api/hotel'
	import {save} from '@/api/pay_order'
	import {list, pageList} from '@/api/room'
	import {commentList} from '@/api/comment'
	import {removeUser, getFrontUser} from '@/utils/store';
	const exampleComponents = {
      props: ['text'],
      template: `<div>here{{text}}</div>`
    }
	export default {
		name: 'Setting',
		data() {
			return {
				form: getFrontUser(),
				images: [], // 图片
				personList: [
					{
						realName: '',
						cardNum: ''
					}
				],
				imgUrl: '',
				imageLimit: 1, // 图片限制
				dialogImageUrl: '', // 上传预览
				dialogVisible: false, // 上传预览model
				imgDialogImageUrl: '', // 上传预览
				imgDialogVisible: false, // 上传预览model
				formVisible: false,
				hotel: {},
				room: {},
				activePath: "/app/room",
				roomList: [],
				commentList: [],
				pageNumber: 1,
				lineNumber: 10,
				listLoading: true,
				cListLoading: true,
				orderFormVisible: false,
				orderLoading: false,
				order: {
					realName: '',
					cardNum: ''
				},
				orderArr: [],
				zoom: 14,
				center: [121.5273285, 31.21515044],
				componentMarker: {
					position: [121.5273285, 31.21515044],
					visible: true,
					contentRender: (h, instance) => h(exampleComponents,{style: {backgroundColor: '#fff'}, props: {text: ''}}, ['xxxxxxx'])
				},
				content: ""
			}
		},
		mounted() {
			this.info();
		},
		methods: {
			addItem(){
				this.personList.push({
					realName: '',
					cardNum: ''
				})
			},
			deleteItems(item, index) {
				this.index = this.personList.indexOf(item);
				if (index !== -1) {
					this.personList.splice(index, 1)
				}
			},
			submitForm(){
				if(this.orderArr.length != 2){
					this.$message.error('请选择时间范围');
					return;
				}

				// let list = [];
				// list.push({"realName": this.order.realName, "cardNum": this.order.cardNum})
				let param = {
					list: this.personList,
					hotelId: this.hotel.id,
					userId: getFrontUser().id,
					roomId: this.room.id,
					price: this.room.price,
					startTime: this.orderArr[0],
					endTime: this.orderArr[1],
				}
				save(param).then(res => {
					this.$message({
							message: '预定成功',
							type: 'success'
					});
					this.listRoom();
					this.orderFormVisible = false;
				});
			},
			add(){

			},
			handleClick(){

			},
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
			info(){
				get(this.$route.params.id).then(res => {
					this.hotel = res;
					var arr = [];
					arr.push(res.log)
					arr.push(res.lat)
					this.center = arr;
					this.position = arr;
				})

				let param = {
					pageNumber: this.pageNumber,
					lineNumber: this.lineNumber,
					hotelId: this.$route.params.id,
					status: 0
				};
				this.listRoom();
				commentList(param).then(res => {
					this.commentList = res;
					this.cListLoading = false;
				})
			},
			listRoom(){
				let param = {
					pageNumber: this.pageNumber,
					lineNumber: this.lineNumber,
					status: 0,
					hotelId: this.$route.params.id
				};
				pageList(param).then(res => {
					this.totalCount = res.totalCount;
					this.roomList = res.data;
					this.listLoading = false;
				});
			},
			//删除
			roomDel(index, row) {
				if(getFrontUser() == undefined || getFrontUser == null){
					this.$message.error('请您先登录再预定');
					return;
				}
				this.orderFormVisible = true;
				this.room = row;
			},
			//显示编辑界面
			roomEdit(index, row) {
				this.dialogVisible = true;
				let urlStr = row.img.split(",");
				this.images = [];
				urlStr.forEach(item => {
					if(item != ""){
						let obj = new Object();
						obj.url = item;
						this.images.push(obj);
					}
				});
				this.imageLimit = this.images.length - 1
			},
			handlePictureCardPreview(file) {
				this.imgDialogImageUrl = file.url;
				this.imgDialogVisible = true;
			},
			imgchage(){

			},
			imageSizeLimt(size) {
				if (size > 1024 * 1024 * 3) {
					this.$message.error('图片大小限制在3M内');
					return false
				} else {
					return true
				}
			},
			imageChange(file, fileList) {
				if (this.imageSizeLimt(file.size)) {
				this.images = fileList
				} else {
					fileList.pop();
				}
				// 隐藏添加按钮处理
				// const uploadPlus = document.getElementById('img-upload').lastChild;
				// uploadPlus.style.display = (fileList.length >= this.imageLimit) ? 'none' : 'inline-block';
			},
			handlePictureCardPreview(file) {
				this.imgDialogImageUrl = file.url;
				this.imgDialogVisible = true;
			}
		}
	}

</script>

<style>
.amap-wrapper {
  width: 800px;
  height: 500px;
}
</style>