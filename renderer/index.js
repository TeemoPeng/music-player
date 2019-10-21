const { ipcRenderer } = require('electron')
const { $ } = require('./helper')

let musicAudio = new Audio();
let allTracks,currentTrack;

$('add-music-btn').addEventListener('click',()=> {
	ipcRenderer.send('add-music-window')
})

ipcRenderer.on('getTracks',(event,tracks)=>{
	console.log('receive tracks:',tracks)
	allTracks = tracks;
	renderListHTML(tracks);
})

//列表渲染方法
const renderListHTML = (tracks)=>{
	const trackList = $('tracksList');
	const tracksListHTML = tracks.reduce((html,track)=>{
		html += `<li class="music-track list-group-item mb-2 d-flex align-item-center justify-content-between row">
			<div class="col-10">
				<i class="fa fa-music mr-2 text-secondary"></i>
				<b>${track.fileName}</b>
			</div>
			<div class='col-2'>
				<i class="fa fa-play mr-1" data-id='${track.id}'></i>
				<i class="fa fa-trash-alt ml-2" data-id='${track.id}'></i>
			</div>
		</li>`;
		return html;
	},'')
	const emptyTrackHTML = '<div class="alert alert-primary">还没有添加音乐文件</div>'
	trackList.innerHTML = tracks.length?`<ul class="list-group">${tracksListHTML}</ul>`:emptyTrackHTML;
}

//按钮点击事件
$('tracksList').addEventListener('click',(event)=>{
	event.preventDefault();
	const {dataset,classList} =  event.target;
	const id = dataset && dataset.id;
	if(id && classList.contains('fa-play')){
		//播放、暂停音乐
		currentTrack = allTracks.find(track=>track.id === id);
		musicAudio.src = currentTrack.path;
		musicAudio.play();

		classList.replace('fa-play','fa-pause')
	}
})