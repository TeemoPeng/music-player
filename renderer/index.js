const { ipcRenderer } = require('electron')
const { $ } = require('./helper')

$('add-music-btn').addEventListener('click',()=> {
	ipcRenderer.send('add-music-window')
})

ipcRenderer.on('getTracks',(event,tracks)=>{
	console.log('receive tracks:',tracks)
	renderListHTML(tracks);
})

const renderListHTML = (tracks)=>{
	const trackList = $('tracksList');
	const tracksListHTML = tracks.reduce((html,track)=>{
		html += `<li class="music-track list-group-item d-flex align-item-center justify-content-between row">
			<div class="col-10">
				<i class="fa fa-music mr-2 text-secondary"></i>
				<b>${track.fileName}</b>
			</div>
			<div class='col-2'>
				<i class="fa fa-play mr-1"></i>
				<i class="fa fa-trash-alt ml-2"></i>
			</div>
		</li>`;
		return html;
	},'')
	const emptyTrackHTML = '<div class="alert alert-primary">还没有添加音乐文件</div>'
	trackList.innerHTML = tracks.length?`<ul class="list-group">${tracksListHTML}</ul>`:emptyTrackHTML;
}