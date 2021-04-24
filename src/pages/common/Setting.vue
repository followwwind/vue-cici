<template>
	<div>
		<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
			<el-form-item label="个人头像" prop="type" style="width: 650px;">
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
			<i class="el-icon-plus"></i>
			</el-upload>
			<i class="tips">图片大小限制在3M以内</i>
			</el-form-item>
			<el-form-item label="用户名">
				<el-input v-model="form.username" disabled></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input type="password" v-model="form.password"></el-input>
			</el-form-item>
			<el-form-item label="个人介绍">
				<el-input type="textarea" v-model="form.info"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm">保存</el-button>
				<!-- <el-button @click.native.prevent>取消</el-button> -->
			</el-form-item>
		</el-form>

		<!-- 上传图片预览 -->
		<el-dialog :visible.sync="dialogVisible">
		<img width="100%" :src="dialogImageUrl" alt>
		</el-dialog>
	</div>
</template>

<script>
	import {uploadImg} from '@/api/common'
	import {removeUser, getUser} from '@/utils/store';
	export default {
		name: 'Setting',
		data() {
			return {
				form: getUser(),
				images: [], // 图片
				imgUrl: '',
				imageLimit: 1, // 图片限制
				dialogImageUrl: '', // 上传预览
				dialogVisible: false, // 上传预览model
			}
		},
		methods: {
			submitForm(){
				// let param = new FormData();
				// for (let j = 0; j < this.images.length; j++) {
				// 	if (this.images[j].raw) {
				// 	param.append('files', this.images[j].raw);
				// 	} else if (this.images[j].url) {
				// 	this.imgUrl += this.images[j].url + ','
				// 	}
				// }
                // uploadHead(param).then(res => {
                    
                // })
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
				const uploadPlus = document.getElementById('img-upload').lastChild;
				uploadPlus.style.display = (fileList.length >= this.imageLimit) ? 'none' : 'inline-block';
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			}
		}
	}

</script>