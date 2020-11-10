<script>
	export default {
		globalData: {
			token: null,
			plt: ''
		}, 
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("@/style/plant.css");
	.bottom-fill{
		height: constant(safe-area-inset-bottom);
		height: env(safe-area-inset-bottom); 
	}
</style>
