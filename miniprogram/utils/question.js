function formatData(q, qid) {
  let quesArr = wx.getStorageSync(q);
  let ids = wx.getStorageSync(qid);
  console.log(quesArr);
  console.log(ids);
  let obj = {};
  let rightMap = {};
  for ( let i = 0; i < quesArr.length; i++) {
    let ques = quesArr[i];
    ques.index = i;
    if(i==0){
        ques.isFirstPlaceholder = true;
    }
    if(i==quesArr.length-1){
        ques.isLastPlaceholder = true;
    }
    obj[ques.question_id] = ques;
    rightMap[ques.question_id] = -1;
  }
  allQuesObj["question"] = obj;
  allQuesObj["items"] = quesArr;
  allQuesObj["rightMap"] = rightMap;
  
  allQuesIdsObj["questionId"] = ids;
}
var allQuesObj = {
  question: {},
  items: [],
  rightMap: {}
}
var allQuesIdsObj = {
  questionId: []
}
var n = require("./underscore-min.js");
module.exports = {
  initQuestions: formatData,
  questions: allQuesObj,
  questionIds: allQuesIdsObj,
  initAllQuestionFromStorage: function (q, qid) {
    formatData(q, qid);
  },
  getQuestionsByIds: function (ids) {
    let allQuesArr = allQuesObj.question;
    let questions = [];
    let idArr = [];
    idArr = n.isArray(ids) ? ids : ids.split(",");
    for (let i = 0; i < idArr.length; i++) {
      var id = idArr[i];
      allQuesArr[id] && questions.push(n.clone(allQuesArr[id]));
      console.log(allQuesArr)
    }
    return questions;
  },
}