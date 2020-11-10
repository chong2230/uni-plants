<template>
	<view class="page-list">
		<scroll-view class="listview" :enableBackToTop="true" :scroll-y="true" @scrolltolower="loadMore()">
            <uni-refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
                <div class="refresh-view">
                    <image class="refresh-icon" :src="refreshIcon" :style="{width: (refreshing || pulling) ? 0: '32px'}"
                        :class="{'refresh-icon-active': refreshFlag}"></image>
                    <uni-load-more v-if="refreshing" class="loading-icon" status="loading" :contentText="loadingMoreText"></uni-load-more>
                    <text class="loading-text">{{refreshText}}</text>
                </div>
            </uni-refresh>
            <uni-cell v-for="(item, index) in dataList" :key="item.id">
                <p-list-item :item="item" :onClick="goDetail"></p-list-item>
            </uni-cell>
            <uni-cell v-if="isLoading">
                <view class="loading-more">
                    <text class="loading-more-text">{{loadingText}}</text>
                </view>
            </uni-cell>
        </scroll-view>
	</view>
</template>

<script>
	import api from '@/common/api.js';
	import {
		friendlyDate
	} from '@/common/util.js';
	
	export default {
		props: {
			nid: {
				type: [Number, String],
				default: ''
			},
			type: {
				type: String,
				default: 1
			},
			tab: {
				type: String,
				default: 'all'
			}
		},
		data() {
			return {
				dataList: [],
				page: 1,
				limit: 10,
				navigateFlag: false,
				pulling: false,
				refreshing: false,
				refreshFlag: false,
				refreshText: "",
				isLoading: false,
				loadingText: '加载中...',
				isNoData: false,
				pulling: false,
				angle: 0,
				loadingMoreText: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg=="
			}
		},
		created() {
			this.pullTimer = null;			
		},
		methods: {
			loadData(refresh) {
				if (this.isLoading) {
					return;
				}

				this.isLoading = true;
				this.getList();
			},
			getList() {
				let params = {
					type: this.type,
					tab: this.tab,
					page: this.page,
					limit: this.limit
				};
				api.getList(params).then((result)=>{
					console.log('getList ', result);
					if (result.code == 0) {
						let data = result.data || [];
						if (data.length < this.limit) this.isNoData = true;
						// 过滤没有图片的植物
						let tmp = [];
						for (let i=0; i<data.length; i++) {
							if (data[i].imgCount > 0) {
								tmp.push(data[i]);
							} else {
								this.isNoData = true;
								break;
							}
						}
						this.dataList = this.dataList.concat(tmp);
						this.isLoading = false;
					}
				})
			},
			loadMore(e) {
				if (this.isNoData) return;
				this.page++;
				this.loadData();
			},
			clear() {
				this.dataList.length = 0;
				this.requestParams.page = 1;
			},
			goDetail(detail) {
				if (this.navigateFlag) {
					return;
				}
				this.navigateFlag = true;
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + detail.plantId + '&from=list&name=' + detail.name
				});
				setTimeout(() => {
					this.navigateFlag = false;
				}, 200)
			},
			refreshData() {
				if (this.isLoading) {
					return;
				}
				this.pulling = true;
				this.refreshing = true;
				this.refreshText = "正在刷新...";
				this.loadData(true);
			},
			onrefresh(e) {
				this.refreshData();
			},
			onpullingdown(e) {
				if (this.refreshing) {
					return;
				}

				this.pulling = false;
				if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
					this.refreshFlag = true;
					this.refreshText = "释放立即刷新";
				} else {
					this.refreshFlag = false;
					this.refreshText = "下拉可以刷新";
				}
			}
		}
	}
</script>

<style scoped>
	.no-data {
		flex: 1;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}

	.page-list {
		flex: 1;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}

	.listview {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
	}

	.refresh {
		justify-content: center;
	}

	.refresh-view {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 750rpx;
		height: 64px;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.refresh-icon {
		width: 32px;
		height: 32px;
		transition-duration: .5s;
		transition-property: transform;
		transform: rotate(0deg);
		transform-origin: 15px 15px;
	}

	.refresh-icon-active {
		transform: rotate(180deg);
	}

	.loading-icon {
		width: 28px;
		height: 28px;
		margin-right: 5px;
		color: gray;
	}

	.loading-text {
		margin-left: 2px;
		font-size: 16px;
		color: #999999;
	}

	.loading-more {
		align-items: center;
		justify-content: center;
		padding-top: 14px;
		padding-bottom: 14px;
		text-align: center;
	}

	.loading-more-text {
		font-size: 28upx;
		color: #999;
	}
</style>
