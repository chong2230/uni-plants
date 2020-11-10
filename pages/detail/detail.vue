<template>
	<view class="content">
		<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item v-for="(item, index) in imgs" :key="index">
				<view class="swiper-item">
					<image class="swiper-image" mode="aspectFill" :src="item"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="intro">
			<jyf-parser
				ref="article"
				:html="data.intro" 
				lazy-load 
				show-with-animation 
			></jyf-parser>
		</view>		
		<mix-loading v-if="isLoading" :type="2"></mix-loading>
	</view>
</template>

<script>
	import api from '@/common/api.js';
	import Config from '@/config/config.js';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	export default {
		components: {
			jyfParser
		},
		data() {
			return {
				id: 1,
				data: {},
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				dataSource: null,
				imgs: [],
				from: '',
				isLoading: true
			}
		},
		onLoad(e) {
			this.id = parseInt(e.id);
			this.from = e.from;
			uni.setNavigationBarTitle({
				title: e.name || '详情'
			});
			this.loadData();
		},
		methods: {
			loadData(){
				let params = {
					id: this.id,
					from: this.from,
					userId: 1
				};
				api.getDetail(params).then((result)=>{
					if (result.code == 0) {
						console.log('getDetail ', result.data);
						this.data = result.data;
						for (let i=1; i<=this.data.imgCount; i++) {
							this.imgs.push(Config.baseUrl + 'img/'+this.data.plantId+'/'+i+'.jpg');
						}
						this.isLoading = false;
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		
	}
	.swiper {
		width: 100%;
		height: 560rpx;
		.swiper-item {
			width: 100%;
			height: 560rpx;
			.swiper-image {
				width: 100%;
				height: 560rpx;
			}
		}
	}	
	.intro {
		padding: 30rpx;
		font-size: 30rpx;
		color: #333;
		line-height: 46rpx;
	}	
</style>
