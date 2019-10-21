const { ipcRenderer } = require('electron')
const { $,convertDuration } = require('./helper')

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

//渲染歌曲播放状态
const renderPlayerHTML = (name,duration) =>{
	const player = $('player-status');
	const html = `<div class="col-8 font-weight-bold">
					正在播放：${name}
				</div>
				<div class='col-4'>
					<span id='current-seeker'>00:00 </span><span> / ${convertDuration(duration)}</span>
				</div>`;
	player.innerHTML = html;
}

//时间更新方法
const updateProgress = (currentTime,duration)=>{
	//计算progress
	const progress = Math.floor(currentTime/duration*100);
	const bar = $('player-progress');
	bar.innerHTML = progress + '%';
	bar.style.width = progress + '%';
	const seeker = $('current-seeker');
	seeker.innerHTML = convertDuration(currentTime);
}

//按钮点击事件
$('tracksList').addEventListener('click',(event)=>{
	event.preventDefault();
	const {dataset,classList} =  event.target;
	const id = dataset && dataset.id;
	if(id && classList.contains('fa-play')){
		//播放

		if(currentTrack && currentTrack.id === id){
			//继续播放
			musicAudio.play();
		}else{
			//播放新的音乐

			currentTrack = allTracks.find(track=>track.id === id);
			musicAudio.src = currentTrack.path;
			musicAudio.play();			
			const resetIconEle = document.querySelector('.fa-pause');
			if(resetIconEle){
				resetIconEle.classList.replace('fa-pause','fa-play')
			}
		}

		classList.replace('fa-play','fa-pause')
	}else if(id && classList.contains('fa-pause')){
		//暂停
		musicAudio.pause();
		classList.replace('fa-pause','fa-play')
	}else if(id && classList.contains('fa-trash-alt')){
		//删除
		ipcRenderer.send('delete-track',id)
	}
})

musicAudio.addEventListener('loadedmetadata',()=>{
	//开始渲染播放器状态
	renderPlayerHTML(currentTrack.fileName,musicAudio.duration)
})

musicAudio.addEventListener('timeupdate',()=>{
	//更新播放器状态
	updateProgress(musicAudio.currentTime,musicAudio.duration);
})