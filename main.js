const { app, BrowserWindow,ipcMain,dialog } = require('electron')

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

  ipcMain.on('add-music-window',(event,arg)=>{
    const addWindow = new AppWindow({
      width:600,
      height:400,
      parent:mainWindow
    },'./renderer/add.html')
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
  // mainWindow.webContents.openDevTools({mode:'bottom'});//打开调试工具
})