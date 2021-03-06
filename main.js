const { app, BrowserWindow,ipcMain,dialog } = require('electron')

const DataStore = require('./renderer/MusicDataStore');
const myStore = new DataStore({
  'name':'Music Data'
})

// store.set('');

//封装创建窗口方法
class AppWindow extends BrowserWindow{
  constructor(config,fileLocation){
    const basicConfig = {
      width:800,
      height:600,
      webPreferences:{
        nodeIntegration:true
      }
    }
    const finalConfig = {...basicConfig,...config}
    super(finalConfig);
    this.loadFile(fileLocation);

    //优雅的显示窗口
    this.once('ready-to-show',()=>{
      this.show();
    })
  }
}

app.on('ready',()=>{
  const mainWindow = new AppWindow({},'./renderer/index.html')

  mainWindow.webContents.on('did-finish-load',()=>{
    console.log('page did-finish-load')
    mainWindow.send('getTracks',myStore.getTracks())
  })
  let addWindow;
  ipcMain.on('add-music-window',(event,arg)=>{
    addWindow = new AppWindow({
      width:600,
      height:400,
      parent:mainWindow
    },'./renderer/add.html')
  })

  //导入
  ipcMain.on('add-tracks',(event,tracks)=>{
    const updateTracks = myStore.addTracks(tracks).getTracks();
    console.log(updateTracks)
    mainWindow.send('getTracks',updateTracks)
    addWindow.hide()
  })

  ipcMain.on('open-music-file',(event,arg)=>{
    dialog.showOpenDialog({
      properties:['openFile','multiSelections'],
      filters:[
        {name:'Music',extensions:['mp3','mp4']}
      ]
    },(files)=>{
      console.log('files:',files)
      if(files){
        event.sender.send('selected-file',files)
      }
    })
  })

  ipcMain.on('delete-track',(event,id)=>{
    const updateTracks = myStore.deleteTrack(id).getTracks();
    mainWindow.send('getTracks',updateTracks)
  })
  // mainWindow.webContents.openDevTools({mode:'bottom'});//打开调试工具
})