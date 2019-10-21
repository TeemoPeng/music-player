const { ipcRenderer } = require('electron')
const { $ } = require('./helper')
const path = require('path');

$('select-music').addEventListener('click',()=> {
	ipcRenderer.send('open-music-file')
})

const renderListHTML = (pathes) =>{
	const musicList = $('musicList');
	const musicItemsHTML = pathes.reduce((html,music)=>{
		html += `<li class="list-group-item">${path.basename(music)}</li>`;
		return html;
	},'')

	musicList.innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`
}

ipcRenderer.on('selected-file',(event,path)=>{
	if(Array.isArray(path)){
		renderListHTML(path);
	}
})
