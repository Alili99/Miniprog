// pages/listPage/listPage.js
var RSA = require('../../common/wx_rsa.js');
var util = require('../../common/lib/util.js')
var ImagePaths1 = {};
var DESKEY = '';
var CryptoJS = require('../../crypto-js/crypto-js');
var uuidv4 = require('../../uuid/we-uuidv4');
var flag = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backbtnurl: "../../image/backbtn.png",
    background_image:"../../image/meihua.png",
    changeTime: "2018年1月1日",
    ImagePaths: [],
    focus: false,
    array: ['便笺', '日记', '回收站'],
    index: 0,
    state: 0,
    TextMin: "",
    video: '',
    video_id: '',
    user_id: '',
    note_id: '',
    DESKEY: ''
  },


  bindPickerChange: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      state: e.detail.value
    })

    wx.request({
      url: 'https://www.storyeveryday.com/test/notes/updateNoteState?note_id=' + that.data.note_id + "&state=" + that.data.state,
      method: "PUT",
      success: function (res) {
        wx.showToast({
          title: '修改便笺成功',  //标题  
          icon: 'success',  //图标，支持"success"、"loading"  
          //image: '../image/img.png',  //自定义图标的本地路径，image 的优先级高于 icon  
          duration: 1500, //提示的延迟时间，单位毫秒，默认：1500  
          mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
          success: function () { }, //接口调用成功的回调函数  
          fail: function () { },  //接口调用失败的回调函数  
          complete: function () { } //接口调用结束的回调函数  
        })
      }
    })
  },

  //返回更新函数
  toast: function (e) {
    var that = this;

    wx.getStorage({
      key: that.data.note_id + '',
      success: function (res) {
        var pwd = res.data;
        var mi_temp = CryptoJS.DES.encrypt(that.data.TextMin, pwd).toString();//生成加密密文
        var mi = mi_temp.replace(/\s/g, '+');
        that.data.TextMin = mi;
        wx.request({
          url: 'https://www.storyeveryday.com/test/notes/updateNoteTxt' + "?content=" + that.data.TextMin + "&note_id=" + that.data.note_id,
          method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT,
          data: {

          },
          // header: {}, // 设置请求的 header
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {

          }
        })
      }
    })


    wx.navigateBack({})


  },
  tcst: function (e) {
    e.setData({
      backbtnurl: ""
    })
  },

  /*
  * TEXTARE 获取textare的值
  */
  bindTextAreaBlur: function (e) {
    var that = this;
    if (e.detail && e.detail.value.length > 0) {
      this.setData({
        TextMin: e.detail.value
      });



    }
  },



  /**
  * 图片选择函数--从本地选择图片
  */
  chooseimage: function () {

    var that = this;
    var user_id = String(that.data.user_id);
    var note_id = String(that.data.note_id);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {


        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = {}
        tempFilePaths.path = res.tempFilePaths[0]

        var Image = that.data.ImagePaths

        wx.uploadFile({
          url: "https://www.storyeveryday.com/test/fileUplode/picture2",
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'user_id': that.data.user_id,
            'note_id': that.data.note_id,
          },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {

            tempFilePaths.id = res.data.content_id;

            Image.push(tempFilePaths)
            that.setData({
              ImagePaths: Image
            })
          }
        })


      }
    })
  },



  //图片删除函数
  deleteimage: function (e) {
    
    var that = this;

    wx.request({
      url: 'https://www.storyeveryday.com/test/file/deleteNoteFile',
      data: {
        content_id: e.target.id,
        user_id: that.data.user_id
      },
      success: function (res) {
        wx.showToast({
          title: '删除图片成功',  //标题  
          icon: 'success',  //图标，支持"success"、"loading"  
          //image: '../image/img.png',  //自定义图标的本地路径，image 的优先级高于 icon  
          duration: 1500, //提示的延迟时间，单位毫秒，默认：1500  
          mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
          success: function () { }, //接口调用成功的回调函数  
          fail: function () { },  //接口调用失败的回调函数  
          complete: function () { } //接口调用结束的回调函数  
        })
        var temp = [];
        that.setData({
          ImagePaths: temp
        })
        that.onShow();
      }
    });
    
  },

  // 视频上传函数
  choosevideo: function () {
    var that = this

    if (that.data.video != '') {

    }

    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {

        that.setData({
          video: res.tempFilePath,
          size: (res.size / (1024 * 1024)).toFixed(2)
        })
        wx.uploadFile({
          url: "https://www.storyeveryday.com/test/fileUplode/picture2",
          filePath: res.tempFilePath,
          name: 'file',
          formData: {
            'user_id': that.data.user_id,
            'note_id': that.data.note_id,
          },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            that.data.video_id = res.data.content_id;

          }
        })

      }
    })
  },

  onLoad: function (options) {
    console.log(options.id);
    this.data.note_id = options.id;
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        });

      },
    });

  },


  changebackground: function (res) {
    var that=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showToast({
          title: '修改背景图片成功',  //标题  
          icon: 'success',  //图标，支持"success"、"loading"  
          //image: '../image/img.png',  //自定义图标的本地路径，image 的优先级高于 icon  
          duration: 1500, //提示的延迟时间，单位毫秒，默认：1500  
          mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
          success: function () { }, //接口调用成功的回调函数  
          fail: function () { },  //接口调用失败的回调函数  
          complete: function () { } //接口调用结束的回调函数  
        })
        
        wx.setStorage({
          key: 'background_image',
          data: res.tempFilePaths[0]
        })
        that.setData({
          background_image: res.tempFilePaths[0]
        })
        that.onShow();
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    wx.getStorage({
      key: 'background_image',
      success: function (res) {
        that.setData({
          background_image: res.data
        })
      }
    })
    

    that.data.ImagePaths = [];
    wx.getStorage({
      key: this.data.user_id + '',
      success: function (res) {
        that.setData({
          DESKEY: res.data
        })
        DESKEY = res.data
      },
    })
    wx.request({
      url: 'https://www.storyeveryday.com/test/notes/getNote?note_id=' + that.data.note_id,
      method: "GET",
      success: function (res2) {
        that.setData({
          changeTime: res2.header.Date
        })

        console.log(res2);
        wx.getStorage({
          key: that.data.note_id + '',
          success: function (res) {


            var pwd = res.data;
            console.log("getDESKEY=" + res.data)
            var mi_temp = res2.data.content;
            var mi = mi_temp.replace(/\s/g, '+');

            var result = CryptoJS.DES.decrypt(mi, pwd).toString(CryptoJS.enc.Utf8);

            if (result == '') {
              result = '解析错误'
            }

            that.setData({
              TextMin: result,
              DESKEY: res.data
            })
          }
        })

        for (var j in res2.data.filepath) {
          var filetypetemp = res2.data.filepath[j].split('.');
          var filetype = filetypetemp[filetypetemp.length - 1];

          var filenametemp = res2.data.filepath[j].split('/');
          var filename = filenametemp[filenametemp.length - 1];
          var fileid = filenametemp[filenametemp.length - 2];
          if (filetype == "mp4") {
            console.log("https://www.storyeveryday.com/resource/" + fileid + "/" + filename)
            that.setData({
              video: "https://www.storyeveryday.com/resource/" + fileid + "/" + filename,
              video_id: j
            })

          } else {
            if (filetype == "jpg" || filetype == "png") {

              var tempFilePaths = {};
              tempFilePaths.path = "https://www.storyeveryday.com/resource/" + fileid + "/" + filename;
              tempFilePaths.id = j;
              var Image = that.data.ImagePaths
              Image.push(tempFilePaths)
              that.setData({
                ImagePaths: Image
              })
            }
          }
        }



      }
    })
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log("DESKEY==" + that.data.DESKEY)

    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: this.data.TextMin,
      path: '/pages/listPage_share/listPage_share?id=' + this.data.note_id + "&DESKEY=" + that.data.DESKEY + "&uu=000",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
