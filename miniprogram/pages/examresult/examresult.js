Page({

  data: {

  },

  onLoad: function (options) {
    //  根据 sitemap 的规则[0]，当前页面 [pages/examresult/examresult?greenNum=1&redNum=12&allNum=0&ytimes=2%3A51&allfen=0&passf=95&allQuestionCount=0] 将被索引
    let ordernum = options.ordernum;
    var ytimesf = options.ytimes.split(":")[0]
    var ytimesm = options.ytimes.split(":")[1]
    let allQuestionCount = options.allQuestionCount;
    let unAnswerNum = allQuestionCount - options.greenNum - options.redNum;
    this.setData({
      ordernum,
      options: options,
      times: options.ytimes,
      rightNum: options.greenNum,
      errNum: options.redNum,
      unAnswerNum: unAnswerNum,
      ytimesf: ytimesf,
      ytimesm: ytimesm
    })

  },

  onReady: function () {

  },

  onShow: function () {

  },

  goRank: function () {
    let url = '/pages/rank/rank';
    wx.navigateTo({
      url: url
    })
  },
  goReview: function () {
    let url = '/pages/review/review?ordernum='+this.data.ordernum;
    wx.navigateTo({
      url: url
    })
  },

  exam_repeat: function () {
    let url = '/pages/exam/exam';
    wx.reLaunch({
      url: url
    })
  },

  _repeat_examGo: function (e) {
   
  }
})