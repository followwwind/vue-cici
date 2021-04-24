<template>
	<div>
		<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
			<el-form-item label="活动名称">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="活动区域">
				<el-select v-model="form.region" placeholder="请选择活动区域">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="活动时间">
				<el-col :span="11">
					<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
				</el-col>
				<el-col class="line" :span="2">-</el-col>
				<el-col :span="11">
					<el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="即时配送">
				<el-switch active-text="" inactive-text="" v-model="form.delivery"></el-switch>
			</el-form-item>
			<el-form-item label="活动性质">
				<el-checkbox-group v-model="form.type">
					<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
					<el-checkbox label="地推活动" name="type"></el-checkbox>
					<el-checkbox label="线下主题活动" name="type"></el-checkbox>
					<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="特殊资源">
				<el-radio-group v-model="form.resource">
					<el-radio label="线上品牌商赞助"></el-radio>
					<el-radio label="线下场地免费"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="活动形式">
				<el-input type="textarea" v-model="form.desc"></el-input>
			</el-form-item>
			<el-form-item label="图片介绍" prop="type" style="width: 650px;">
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
			<i class="tips">图片大小限制在3M以内，最多上传9张</i>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm">立即创建</el-button>
				<el-button @click.native.prevent>取消</el-button>
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
	export default {
		name: 'Form',
		data() {
			return {
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				images: [], // 图片
				imgUrl: '',
				imageLimit: 9, // 图片限制
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