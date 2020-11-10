<template>
	<view class="content">		
		<view class="tabs">
			<scroll-view ref="tabbar1" id="tab-bar" class="tab-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false"
			 :scroll-into-view="scrollInto">
				<view style="flex-direction: column;">
					<view style="flex-direction: row;">
						<view class="uni-tab-item" v-for="(tab,index) in tabList" :key="tab.id" :id="tab.id" :ref="'tabitem'+index"
						 :data-id="index" :data-current="index" @click="ontabtap">
							<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
						</view>
					</view>
					<view class="scroll-view-indicator">
						<view ref="underline" class="scroll-view-underline" :class="isTap ? 'scroll-view-animation':''" :style="{left: indicatorLineLeft + 'px', width: indicatorLineWidth + 'px'}"></view>
					</view>
				</view>
			</scroll-view>
			<view class="tab-bar-line"></view>
			<swiper class="tab-box" ref="swiper1" :current="tabIndex" :duration="300" @change="onswiperchange" @transition="onswiperscroll"
			 @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(page, index) in tabList" :key="index">
					<p-list class="page-item" :tab="page.tab" :type="2" :nid="page.id" ref="page"></p-list>
				</swiper-item>
			</swiper>
		</view>
		<view class="bottom-fill"></view>
	</view>
</template>

<script>	
	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	const TAB_PRELOAD_OFFSET = 1;
	
	export default {
		data() {
			return {
				tabList: [{
					id: 'tab01',
					name: '花坛',
					tab: 'parterre'
				}, {
					id: 'tab02',
					name: '盆栽',
					tab: 'potted'
				},{
					id: 'tab03',
					name: '室内',
					tab: 'indoor'
				}, {
					id: 'tab04',
					name: '切花',
					tab: 'cutflower'
				}, {
					id: 'tab05',
					name: '荫棚',
					tab: 'shade'
				}],
				tabIndex: 0,
				cacheTab: [],
				scrollInto: "",
				navigateFlag: false,
				indicatorLineLeft: 0,
				indicatorLineWidth: 0,
				isTap: false
			}
		},
		onReady() {
			this._lastTabIndex = 0;
			this.swiperWidth = 0;
			this.tabbarWidth = 0;
			this.tabListSize = {};
			this._touchTabIndex = 0;
			this.isIos = uni.getSystemInfoSync().platform.toLowerCase() === 'ios';
		
			// #ifndef MP-ALIPAY
			this.pageList = this.$refs.page;
			// #endif
			// #ifdef MP-ALIPAY
			this.pageList = [];
			for (var i = 0; i < this.tabList.length; i++) {
				this.pageList.push(this.$refs['page' + i][0]);
			}
			// #endif
			this.switchTab(this.tabIndex);
		
			this.getTabbarItemsSize();
		},
		onLoad(e) {
			this.load();
		},
		onShareAppMessage() {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			return {
			  title: '走进植物',
			  path: '/pages/index/index'
			}
		},
		methods: {
			load() {
				
			},
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				//let offsetIndex = this._touchTabIndex = Math.abs(index - this._lastTabIndex) > 1;
			
				// #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
				this.isTap = true;
				var currentSize = this.tabListSize[index];
				// this.updateIndicator(currentSize.left, currentSize.width);
				this._touchTabIndex = index;
				// #endif
			
				this.switchTab(index);
			},
			onswiperchange(e) {
				// 注意：百度小程序会触发2次
			
				// #ifndef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
				let index = e.target.current || e.detail.current;
				this.switchTab(index);
				// #endif
			},
			onswiperscroll(e) {
				if (this.isTap) {
					return;
				}
			
				var offsetX = e.detail.dx;
				var preloadIndex = this._lastTabIndex;
				if (offsetX > TAB_PRELOAD_OFFSET) {
					preloadIndex++;
				} else if (offsetX < -TAB_PRELOAD_OFFSET) {
					preloadIndex--;
				}
				if (preloadIndex === this._lastTabIndex || preloadIndex < 0 || preloadIndex > this.pageList.length - 1) {
					return;
				}
				if (this.pageList[preloadIndex].dataList.length === 0) {
					this.loadTabData(preloadIndex);
				}
			
				// #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
				var percentage = Math.abs(this.swiperWidth / offsetX);
				var currentSize = this.tabListSize[this._lastTabIndex];
				var preloadSize = this.tabListSize[preloadIndex];
				// var lineL = currentSize.left + (preloadSize.left - currentSize.left) / percentage;
				// var lineW = currentSize.width + (preloadSize.width - currentSize.width) / percentage;
				// this.updateIndicator(lineL, lineW);
				// #endif
			},
			animationfinish(e) {
				// #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
				let index = e.detail.current;
				if (this._touchTabIndex === index) {
					this.isTap = false;
				}
				this._lastTabIndex = index;
				this.switchTab(index);
				// this.updateIndicator(this.tabListSize[index].left, this.tabListSize[index].width);
				// #endif
			},
			doTabAnimation() {},
			getTabbarItemsSize() {
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs.tabbar1, res => {
					this.tabbarWidth = res.size.width;
				});
				dom.getComponentRect(this.$refs['swiper1'], res => {
					this.swiperWidth = res.size.width;
				});
				for (var i = 0; i < this.tabList.length; i++) {
					this.getElementSize(dom, this.$refs['tabitem' + i][0], i);
				}
				// #endif
			
				// #ifdef MP-WEIXIN || H5 || MP-QQ
				uni.createSelectorQuery().in(this).select('.tab-box').fields({
					dataset: true,
					size: true,
				}, (res) => {
					this.swiperWidth = res.width;
				}).exec();
				uni.createSelectorQuery().in(this).selectAll('.uni-tab-item').boundingClientRect((rects) => {
					rects.forEach((rect) => {
						this.tabListSize[rect.dataset.id] = rect;
					})
				}).exec();
				// #endif
			
				// #ifdef APP-NVUE || H5 || MP-WEIXIN || MP-QQ
				// setTimeout(() => {
				// 	this.updateIndicator(this.tabListSize[this.tabIndex].left, this.tabListSize[this.tabIndex].width);
				// }, 100)
				// #endif
			},
			getElementSize(dom, ref, id) {
				dom.getComponentRect(ref, res => {
					this.tabListSize[id] = res.size;
				});
			},
			updateIndicator(left, width) {
				this.indicatorLineLeft = left;
				this.indicatorLineWidth = width;
			},
			switchTab(index) {
				if (this.pageList[index].dataList.length === 0) {
					this.loadTabData(index);
				}
			
				if (this.tabIndex === index) {
					return;
				}
			
				// 缓存 tabId
				if (this.pageList[this.tabIndex].dataList.length > MAX_CACHE_DATA) {
					let isExist = this.cacheTab.indexOf(this.tabIndex);
					if (isExist < 0) {
						this.cacheTab.push(this.tabIndex);
					}
				}
			
				this.tabIndex = index;
			
				// #ifdef APP-NVUE
				this.scrollTabTo(index);
				// #endif
				// #ifndef APP-NVUE
				this.scrollInto = this.tabList[index].id;
				// #endif
			
				// 释放 tabId
				if (this.cacheTab.length > MAX_CACHE_PAGE) {
					let cacheIndex = this.cacheTab[0];
					this.clearTabData(cacheIndex);
					this.cacheTab.splice(0, 1);
				}
			},
			scrollTabTo(index) {
				const el = this.$refs['tabitem' + index][0];
				let offset = 0;
				// TODO fix ios offset
				if (index > 0) {
					offset = this.tabbarWidth / 2 - this.tabListSize[index].width / 2;
					if (this.tabListSize[index].right < this.tabbarWidth / 2) {
						offset = this.tabListSize[0].width;
					}
				}
				dom.scrollToElement(el, {
					offset: -offset
				});
			},
			loadTabData(index) {
				this.pageList[index].loadData();
			},
			clearTabData(index) {
				this.pageList[index].clear();
			}
		}
	}
</script>

<style>
	
</style>
