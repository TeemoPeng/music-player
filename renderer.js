const { ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded',()=>{
	ipcRenderer.send('message','hello from renderer')
	ipcRenderer.on('reply',(event,args)=>{
		document.getElementById('message').innerHTML = args;
	})
})