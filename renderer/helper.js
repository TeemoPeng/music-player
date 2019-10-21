exports.$ = (id) =>{ //nodejs 的导出用exports
	return document.getElementById(id)
}
exports.convertDuration = (time)=>{
	//计算分钟 
	const munutes = "0" + Math.floor(time / 60);
	const second = "0" + Math.floor(time - munutes * 60);
	return munutes.substr(-2) + ':' + second.substr(-2);
}