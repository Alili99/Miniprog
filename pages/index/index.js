//index.js
var util = require('../../common/lib/util.js')
var API_URL = "https://www.storyeveryday.com/test/Login/AuthLogin";
var API_URL_GETNOTELDS = "https://www.storyeveryday.com/test/notes/getNoteIds?user_id="
var user_id;
var CryptoJS = require('../../crypto-js/crypto-js');
var uuidv4 = require('../../uuid/we-uuidv4');



Page({
  data: {
    TopTittle: '便笺',
    array: ['便笺', '日记', '回收站','删除全部便笺'],
    MsgArray: [],
    index: 0,
    user_id: '',
    noteid: '',
    DESKEY: '',
    state: 0
  },

  //*************************************************************
  //                   首页选择项选择函数
  //*************************************************************
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    if (e.detail.value==3){
      var that = this;
      wx.login({
        success: function (res) {
          var code = res.code;
          if (code) {
            wx.request({
              url: API_URL,
              data: { code: res.code },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              success: function (result) {
                wx.request({
                  url: "https://www.storyeveryday.com/test/notes/getNoteIds?user_id=" + result.data.user_id,//获取所有便笺ID
                  success: function (res1) {
                    for (var j in res1.data.noteIds) {
                      var noteid = res1.data.noteIds[j];
                      wx.request({
                        url: 'https://www.storyeveryday.com/test/notes/getNote?note_id=' + noteid,//获取用户便笺内容
                        success: function (res2) {
                          //删除全部便笺
                          wx.getStorage({
                            //获取数据的key
                            key: 'user_id',
                            success: function (res) {
                              that.setData({
                                user_id: res.data
                              })
                            }
                          });
                          wx.request({
                            url: 'https://www.storyeveryday.com/test/notes/deleteNote2',
                            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT,
                            data: {
                              note_id: res2.data.note_id,
                              user_id: that.data.user_id

                            },
                            // header: {}, // 设置请求的 header
                            success: function (res) {
                              console.log(res);
                              that.onShow();
                            },
                            fail: function (res) {
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
            })
            // ------------------------------------

          } else {
            console.log('获取用户登录态失败：' + res.errMsg);
          }
        }
      });
      wx.showToast({
        title: '删除所有便笺成功',  //标题  
        icon: 'success',  //图标，支持"success"、"loading"  
        //image: '../image/img.png',  //自定义图标的本地路径，image 的优先级高于 icon  
        duration: 1500, //提示的延迟时间，单位毫秒，默认：1500  
        mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
        success: function () { }, //接口调用成功的回调函数  
        fail: function () { },  //接口调用失败的回调函数  
        complete: function () { } //接口调用结束的回调函数  
      })  
    }
    var temp = [];
    this.setData({
      state: e.detail.value,
      MsgArray: temp,
      index: e.detail.value
    });
    this.onShow();
  },


  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  //*************************************************************
  //                   点击跳转编辑函数
  //************************************************************* 
  bindTap: function (e) {

    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../listPage_exit/listPage_exit?id=' + id
    })

  },

  //
  bingLongTap: function (e) {

    var that = this;
    var viewId = e.target.id;
    wx.getStorage({
      //获取数据的key
      key: 'user_id',
      success: function (res) {

        that.setData({
          user_id: res.data
        })
      }
    });
    wx.request({
      url: 'https://www.storyeveryday.com/test/notes/deleteNote2',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT,
      data: {
        note_id: viewId,
        user_id: that.data.user_id

      },
      // header: {}, // 设置请求的 header
      success: function (res) {
        wx.showToast({
          title: '删除便笺成功',  //标题  
          icon: 'success',  //图标，支持"success"、"loading"  
          //image: '../image/img.png',  //自定义图标的本地路径，image 的优先级高于 icon  
          duration: 1500, //提示的延迟时间，单位毫秒，默认：1500  
          mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
          success: function () { }, //接口调用成功的回调函数  
          fail: function () { },  //接口调用失败的回调函数  
          complete: function () { } //接口调用结束的回调函数  
        })
        var temp=[];
        that.setData({
          MsgArray:temp
        })
        console.log(res);
        that.onShow();
      },
      fail: function (res) {
      }
    })
  },



  Add: function () {
    wx.navigateTo({
      url: '../listPage/listPage?id='
    })
  },



  onShow: function () {
    console.log("pingker refresh")
    this.data.MsgArray = [];
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          // --------- 发送凭证 ------------------
          wx.request({
            url: API_URL,
            data: { code: res.code },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success: function (result) {
              console.log("登陆成功");

              wx.setStorage({
                key: 'user_id',
                data: result.data.user_id,
                success: function (res) {
                }
              });

              wx.request({
                url: "https://www.storyeveryday.com/test/notes/getNoteIds?user_id=" + result.data.user_id,//获取所有便笺ID
                success: function (res1) {
                  for (var j in res1.data.noteIds) {
                    var noteid = res1.data.noteIds[j];
                    wx.request({
                      url: 'https://www.storyeveryday.com/test/notes/getNote?note_id=' + noteid,//获取用户便笺内容
                      success: function (res2) {
                        //console.log('res2.data.state=' + res2.data.state + ";that.data.state=" + that.data.state)
                        if (res2.data.state == that.data.state) {//判断是否为正确的便笺类型
                          console.log(res2);
                          wx.getStorage({
                            key: res2.data.note_id + '',
                            success: function (res) {
                              var pwd = res.data;
                              var mi_temp = res2.data.content;
                              var mi = mi_temp.replace(/\s/g, '+');
                              var result = CryptoJS.DES.decrypt(mi, pwd).toString(CryptoJS.enc.Utf8);
                              if (result == '') {
                                result = '解析错误'
                              }
                              var newarray = [{
                                message: result,
                                id: res2.data.note_id
                              }];
                              //使用concat()来把两个数组合拼起来
                              that.data.MsgArray = newarray.concat(that.data.MsgArray);
                              //将合拼之后的数据，发送到视图层，即渲染页面
                              //大伙请记录，修改了数据后，一定要再次执行`this.setData()`，页面才会渲染数据的。
                              that.setData({
                                'MsgArray': that.data.MsgArray,
                              });
                            },
                          });
                        }



                      }
                    })

                  }

                }

              })
            }
          })
          // ------------------------------------

        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    });


    // console.log(CryptoJS.MD5('Wechat').toString()); // 输出：98ffdc1f1a326c9f73bbe0b78e1d180e
    // console.log(CryptoJS.SHA1('Wechat').toString()); // 输出：42989457d716a8b89f99c687a41779d4102b5491
    // console.log(CryptoJS.SHA256('Wechat').toString()); // 输出： 885e2deda21a6c752f05e9c3ac95c90de31bce4b25ce38c330feee389906c83f


  },

  onLoad: function (e) {
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {

        that.setData({
          user_id: res.data
        });

      },
    })
  }

})