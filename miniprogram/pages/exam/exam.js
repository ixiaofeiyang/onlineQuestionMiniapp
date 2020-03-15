let q = require("../../utils/question.js");
let n = "random";
let r = "exam";
let s = 1;
let app = getApp();
let md5 = require('../../utils/md5.js').md5;
var util = require('../../utils/util.js');
Page({

  data: {
    md5: '',
    idx: 0,
    indexInd: 0,
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    orderPX: {},
    idarr: [],
    textTab: "答题模式",
    selectInd: !0,
   
    iconInd: false,
    iconcircle: [],
    recmend: !1,
    iconIndtwo: false,
    youind: 0,
    outside: !0,
    current: 0,
    questions: [],
    timeshow: !0,
    times: 20,
    ytimes: "",
    allfen: 0,
    passf: 0,
    interval: 300,
    videoctrl: !0,
    videoMedia: "",
    startTime: 0,
    startTimeind: !1,
    nums: 0,
    testMode: !1
  },

  _updown: function () {
    console.log(this.data.iconInd);
    this.setData({
      iconInd: !this.data.iconInd,
      iconIndtwo: !this.data.iconIndtwo,
    });
  },

  onLoad: function (options) {
      let that = this;
      console.log(options);
      this.setData({
        times: "20:00"
      })
      this.onQuery();
      this.timeServal(20);

      let ordernum = this.generate();
      this.setData({
        ordernum
      })

  },
  generate: function(){
    return util.formatTime(new Date());
  },
  timeServal: function (t) {
    console.log(t)
    if (0 != t) {
      var e = t,
        a = 59,
        n = this;
      setInterval(function () {
        a < 10 ? n.setData({
          times: e + ":0" + a,
          ytimes: t - e + ":" + (59 - a)
        }) : n.setData({
          times: e + ":" + a,
          ytimes: t - e + ":" + (59 - a)
        }), --a < 0 && (e > 0 ? (a = 59, e--) : (a = 0, e = 0, n.setData({
          startTimeind: !0
        })));
      }, 1e3);
    } else this.setData({
      times: 0,
      startTimeind: !0
    });
  },
  onQuery: function(){
    console.log('开始查询题库');
    let that = this;
    const db = wx.cloud.database();

    db.collection('questions')
    .aggregate()
    .sample({
      size: 20
    })
    .end()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.list;
      let arr = [];
      let questions = [];
      items.map((item,idx)=>{
        console.log(idx);
        console.log(item);
        arr.push(item._id);
        
        let options = item.options;
        options.forEach((o)=>{
          o.selected = false;
        })
        item.index = idx;
        item.status = false;
        item.options = options;
        questions.push(item);
      })
      that.setData({
        questions,
        arr: arr,
        md5: md5(arr.join()),
        nums: arr.length
      },()=>{
        console.log('已赋值完成')
      })
      
    })

  },

  onReady: function () {

  },

  onShow: function () {

  },

  

  jumpToQuestion: function (e) {
    console.log(e.currentTarget.dataset);
    let index = e.currentTarget.dataset.index;
    this.setData({
      iconInd: false,
      iconIndtwo: false,
      current: index,
      indexInd: index,
      videoctrl: true
    },()=>{
      this.autoPlay();
    });
  },

  selectAnswer: function (t) {
    console.log('selectAnswer');
    console.log(this.data.questions);
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let code = t.currentTarget.dataset.code;
    let answer = t.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    item.right = 0;
    options.map(o => {
      if(o.code == code){
        o.selected = true;
      }
      if((o.code == code)&&(o.value == 1)){
        o.val = 1;
        greenNum++;
        item.right = 1;
      }
      if((o.code == code)&&(o.value == 0)){
        o.val = 0;
        redNum++;
        this.addNote();
      }
    })
    console.log(item);
    item.options = options;
    let questions = this.data.questions;
    questions[this.data.indexInd] = item;
    this.setData({
      greenNum: greenNum,
      redNum: redNum,
      questions
    })
    if(this.data.indexInd == questions.length - 1){
      console.log(this.data.indexInd,questions.length)
      this.result();
    }else{
      this.autoPlay();
    }
    
  },

  selectAnswerMore: function (t) {
    console.log('多选选第二个选项')
    console.log('selectAnswerMore');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let code = t.currentTarget.dataset.code;
    let answer = t.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    item.right = 0;
    console.log(options)
    options.map(o => {
      if(o.code == code){
        o.selected = !o.selected;
      }
    })
    console.log(options);
    console.log(item);
    item.options = options;
    let questions = this.data.questions;
    questions[this.data.indexInd] = item;
    this.setData({
      questions
    })
  },
  newMoreSelectSub: function(t){
    setTimeout(()=>{
      this.moreSelectSub(t);
    },1000)
  },
  moreSelectSub: function (t) {
    console.log('多选');
    console.log('moreSelectSub');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let options = item.options;

    let answer;
    let nums = 0;

    let redNum = this.data.redNum;
    let greenNum = this.data.greenNum;

    let typecode = item.typecode;

    let arr1 = [];
    let arr2 = [];
    options.forEach(o => {
      if(o.selected){
        arr1.push(o.code);
      }
      if(o.value = 1){
        arr2.push(o.code);
      }
    })
    if(arr1.join() == arr2.join()){
      greenNum++;
    }else{
      redNum++;
      this.addNote();
    }

    


    this.setData({
      redNum,
      greenNum
    })
    console.log('item');
    console.log(item);
    let questions = this.data.questions;
    questions[this.data.indexInd] = item;
    this.setData({
      questions
    })
    if(this.data.indexInd == questions.length - 1){
      console.log(this.data.indexInd,questions.length)
      this.result();
    }else{
      this.autoPlay();
    }
  },

  autoPlay: function () {
    console.log('autoplay');
    this.setData({
      autoplay: true
    });

  },

  pageChange: function (e) {
    console.log('pageChange');
    
    console.log(e.detail);
    let current = e.detail.current;
    
    let indexInd = current;
    console.log(this.data.questions);
    console.log(indexInd)
    console.log(this.data.questions[indexInd]);
    this.setData({
      me: [],
      autoplay: false,
      indexInd,
      xiejie: true
    });
  },

  newUp_exam: function () {
    this.result();
  },

  changeTab: function () {
    var e = this,
      a = e.data.questions;
    e.setData({
      questions: a,
      textTab: "背题模式",
      selectInd: !1
    })
  },
 

  timeServal: function (t) {
    console.log(t)
    if (0 != t) {
      var e = t,
        a = 59,
        n = this;
      setInterval(function () {
        a < 10 ? n.setData({
          times: e + ":0" + a,
          ytimes: t - e + ":" + (59 - a)
        }) : n.setData({
          times: e + ":" + a,
          ytimes: t - e + ":" + (59 - a)
        }), --a < 0 && (e > 0 ? (a = 59, e--) : (a = 0, e = 0, n.setData({
          startTimeind: !0
        })));
      }, 1e3);
    } else this.setData({
      times: 0,
      startTimeind: !0
    });
  },

  status_choose_btn: function (t) {
    console.log(t.detail.msg), this.setData({
      showStatus: !1
    }), "up" == t.detail.msg ? this.result() : "again" == t.detail.msg && a._repeat_examGo(this);
  },

  result: function () {
    this.addHistory();
    let questions = this.data.questions;
    let allNum = 0;
    wx.setStorage({
      key: "questionArr",
      data: this.data.questions
    });
    wx.navigateTo({
      url: "../examresult/examresult?ordernum="+this.data.ordernum+"&times="+ this.data.times  +"&greenNum=" + this.data.greenNum + "&redNum=" + this.data.redNum + "&allNum=" + allNum + "&ytimes=" + this.data.ytimes + "&allfen=" + this.data.allfen  + "&allQuestionCount=" + this.data.nums,
    })
  },

  onUnload: function () {
    
  },

  onHide: function () {
    
  },
  addHistory: function(){
    let that = this;
    let ordernum = this.data.ordernum;
    let questions = this.data.questions;
    const db = wx.cloud.database()
    db.collection('historys').add({
      data: {
        _id: ordernum,
        time: this.data.ytimes,
        md5,
        questions,
        nums: this.data.greenNum*2,
        userInfo: app.globalData.userInfo
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id
        // wx.showToast({
        //   title: '新增记录成功',
        // })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  addNote: function(){
    let that = this;
    let ordernum = this.data.ordernum;
    let questions = this.data.questions;
    let indexInd = this.data.indexInd;
    const db = wx.cloud.database()
    db.collection('notes').add({
      data: {
        ordernum: ordernum,
        question: questions[indexInd]
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id
        // wx.showToast({
        //   title: '新增记录成功',
        // })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  }

})