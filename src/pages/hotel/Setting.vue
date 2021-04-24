<template>
	<div>
		<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
			<el-form-item label="酒店图片" prop="type" style="width: 650px;"  v-show="form.img">
				<img :src="form.img" style="width:150px;height:150px;">
			</el-form-item>	
			<el-form-item label="酒店图片" prop="type" style="width: 650px;" v-show="!form.img">
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
			<el-form-item label="名称">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<el-input v-model="form.label"></el-input>
			</el-form-item>
			<el-form-item label="最低价格">
				<el-input v-model="form.price"></el-input>
			</el-form-item>
			<el-form-item label="联系电话">
				<el-input v-model="form.phone"></el-input>
			</el-form-item>
			<el-form-item label="装修时间">
				<el-date-picker v-model="form.wrapperTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
			</el-form-item>
			<el-form-item label="位置">
				<el-input v-model="form.address"></el-input>
			</el-form-item>
			<el-form-item label="定位地址">
				<el-button type="primary" @click="address">定位</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm">保存</el-button>
				<!-- <el-button @click.native.prevent>取消</el-button> -->
			</el-form-item>
		</el-form>

		<!-- <div class="amap-wrapper">
      		<el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
    	</div> -->

		<!-- 上传图片预览 -->
		<el-dialog :visible.sync="dialogVisible">
		<img width="100%" :src="dialogImageUrl" alt>
		</el-dialog>

		<el-dialog :visible.sync="addressVisible">
			<el-row>
				<el-col>
					<!-- <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box> -->
					<div  class="map-container">
						<el-amap class="amap-box"
							:amap-manager="amapManager"
							:vid="'amap-vue'"
							:zoom="zoom"
							:plugin="plugin"
							:center="center"
							:events="events"
						>
						<!-- 标记 -->
						<el-amap-marker v-for="(marker, index) in markers" :position="marker" :key="index"></el-amap-marker>
						</el-amap>
					</div>
				</el-col>
				<el-col>
					lng: {{lng}}, lat: {{lat}}
					<el-button type="primary" @click="ok">确定</el-button>
				</el-col>
			</el-row>

		</el-dialog>
	</div>
</template>

<script>
	import {uploadImg} from '@/api/common'
	import {save, update, info} from '@/api/hotel'
	import {removeUser, getUser, setUser} from '@/utils/store';
	import { VueAMap,AMapManager } from 'vue-amap';
	let amapManager = new AMapManager()
	export default {
		name: 'Setting',
		data() {
			let self = this;
			return {
				form: {
					id: '',
					userId: '',
					log: 0,
					lat: 0
				},
				images: [], // 图片
				imgUrl: '',
				imageLimit: 1, // 图片限制
				dialogImageUrl: '', // 上传预览
				dialogVisible: false, // 上传预览model,
				addressVisible: false,
				amapManager,
				zoom: 12,
				center: [121.59996, 31.197646],
				lng: 121.59996,
				lat: 31.197646,
				searchOption: {
					city: '深圳',
					citylimit: true
				},
				markers: [],
				location:"",
				loaded: false,
				events: {
					// init () {
					// 	lazyAMapApiLoaderInstance.load().then(() => {
					// 		self.initSearch()
					// 	})
					// },
					// 点击获取地址的数据
					click (e) {
						// console.log(e)
						self.markers = []
						let { lng, lat } = e.lnglat
						self.lng = lng
						self.lat = lat
						self.center = [lng, lat]
						self.markers.push([lng, lat])
						// 这里通过高德 SDK 完成。
						let geocoder = new AMap.Geocoder({
							radius: 1000,
							extensions: 'all'
						})
						geocoder.getAddress([lng, lat], function (status, result) {
							console.log(lng + ',' + lat)
							self.lng = lng;
							self.lat = lat;
							if (status === 'complete' && result.info === 'OK') {
							if (result && result.regeocode) {
								console.log(result.regeocode.formattedAddress)
								self.location = result.regeocode.formattedAddress
								self.searchKey = result.regeocode.formattedAddress
								self.$nextTick()
							}
							}
						})
					}
				},
				plugin: [
					{
					// 定位
					pName: 'Geolocation',
					events: {
						init (o) {
						// o是高德地图定位插件实例
						o.getCurrentPosition((status, result) => {
							if (result && result.position) {
							// 设置经度
							self.lng = result.position.lng
							// 设置维度
							self.lat = result.position.lat
							// 设置坐标
							self.center = [self.lng, self.lat]
							// self.markers.push([self.lng, self.lat])
							// load
							self.loaded = true
							// 页面渲染好后
							self.$nextTick()
							}
						})
						}
					}
					},
					{
					// 工具栏
					pName: 'ToolBar',
					events: {
						init (instance) {
						// console.log(instance);
						}
					}
					},
				]
			}
		},
		mounted() {
			this.info();
		},
		methods: {
			commit(){
				
			},
			ok(){
				this.addressVisible = false;
			},
			onSearchResult(pois) {
				let latSum = 0;
				let lngSum = 0;
				if (pois.length > 0) {
					pois.forEach(poi => {
						let {lng, lat} = poi;
						lngSum += lng;
						latSum += lat;
						this.markers.push([poi.lng, poi.lat]);
					});
					let center = {
						lng: lngSum / pois.length,
						lat: latSum / pois.length
					};
					this.center = [center.lng, center.lat];
				}
			},
			info(){
				info(getUser().id).then(res => {
					 this.form = Object.assign({}, res);
					 this.imgUrl = this.form.img;
					 this.lng = res.log;
					 this.lat = res.lat;
				})
			},
			address(){
				this.addressVisible = true;
			},
			submitForm(){
				this.form.img = this.imgUrl;
				this.form.userId = getUser().id;
				this.form.log = this.lng;
				this.form.lat = this.lat;
				console.log(this.form)
				if(this.form.id != '' && this.form.id != undefined){
					update(this.form).then(res => {
						this.$message({message: '上传成功',type: 'success'});
					});
				}else{
					save(this.form).then(res => {
						this.$message({message: '上传成功',type: 'success'});
					});
				}
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
				let param = new FormData();
				for (let j = 0; j < this.images.length; j++) {
					if (this.images[j].raw) {
					param.append('files', this.images[j].raw);
					} else if (this.images[j].url) {
						this.imgUrl += this.images[j].url + ','
					}
				}
                uploadImg(param).then(res => {
                    this.imgUrl = res;
                })
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			}
		}
	}

</script>

<style lang="css">
.map-container {
  width: 700px;
  height: 500px;
}
</style>