<template>
	<view class="content" @click="onClick(item)">
		<image mode="aspectFill" class="img" :src="getImg"></image>
		<view class="info">
			<text class="name">{{item.name}}</text>
			<text class="intro">{{getIntro}}</text>
		</view>
	</view>
</template>

<script>
	import Config from '@/config/config.js';
	
	export default {
		name: 'list-item',
		props: {
			item: {
				type: Object,
				default: () => {
					return {}
				}
			},
			onClick: {
				type: Function,
				default: ()=>{}
			}
		},
		computed: {
			getImg() {
				return Config.baseUrl + 'img/' + this.item.plantId+'/0.jpg';
			},
			getIntro() {
				let htmlReg = /(<([^>]+)>)/ig;
				// let pReg = /<\/?p.*?(?:>|\/>)/gi;
				return this.item.intro.replace(htmlReg, '');
			}
		}
	}
</script>
	
<style>
	.content {
		display: flex;
		flex-direction: row;
		justify-items: flex-start;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: solid 2rpx #F8F8F8;
	}
	.img {
		width: 188rpx;
		height: 188rpx;
		margin-right: 20rpx;
	}
	.info {
		display: flex;
		flex-direction: column;
		width: calc(100% - 210rpx);
	}
	.name {
		color: #333333;
		height: 56rpx;
		line-height: 56rpx;
		font-size: 32rpx;
	}
	.intro {
		line-height: 40rpx;
		font-size: 24rpx;
		color: #666666;
		width: 100%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
