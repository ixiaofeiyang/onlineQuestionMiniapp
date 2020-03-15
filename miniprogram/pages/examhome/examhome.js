// pages/examhome/examhome.js
var app = getApp();
Page({

  data: {
    passf: 0,
    time: 0,
    num: 0,
    everyf: 1,
    use_title: "",
    training_qids: ""
  },

  onLoad: function (options) {
    console.log(options);
    let id = options.id;
    this.setData({
      id
    })
    this.onQuery(id);
  },
  onQuery: function(id){
    let that = this;
    const db = wx.cloud.database();

    db.collection('exam')
    .doc(id)
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      that.setData({
        exam: res.data
      },()=>{
        console.log('已赋值完成')
      })
      
    })
  },
  onReady: function () {

  },

  onShow: function () {

  },
  examGoNew: function(){
      let time = this.data.time;
      wx.redirectTo({
        url: "../exam/exam?time=20&training_qids=0&nums=50"
      });  
  },
  examGo:function (e) {
   
  },

  change_continue:function(e){
    
  }
})