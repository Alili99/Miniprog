// pages/listPage/listPage.js
var RSA = require('../../common/wx_rsa.js');
var CryptoJS = require('../../crypto-js/crypto-js');
var uuidv4 = require('../../uuid/we-uuidv4');
var ImagePaths1 = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backbtnurl: "../../image/backbtn.png",
    changeTime: "2018年1月1日",
    ImagePaths: [],
    focus: false,
    array: ['中国', '美国', '巴西', '日本'],
    index: 0,
    TextMin: "",
    video: '',
    user_id: '',
    note_id: '',
    DESKEY: ''
  },


  bindPickerChange: function (e) {

    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  //返回更新函数
  toast: function (e) {
    var that = this;
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
      wx.request({
        url: 'https://www.storyeveryday.com/test/notes/updateNoteTxt',
        method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT,
        data: {
          note_id: that.data.note_id,
          content: that.data.TextMin

        },
        // header: {}, // 设置请求的 header
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {

        }
      })
    }
  },



  /**
  * 图片选择函数--从本地选择图片
  */
  chooseimage: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var Image = that.data.ImagePaths
        Image.push(tempFilePaths)
        that.setData({
          ImagePaths: Image
        })
      }
    })
  },


  // 视频上传函数
  choosevideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          video: res.tempFilePath,
          size: (res.size / (1024 * 1024)).toFixed(2)
        })
      }
    })
  },

  onLoad: function (options) {
    console.log(options);

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
    //从链接中获取DES密钥
    this.data.DESKEY = options.DESKEY;
    console.log(this.data.DESKEY)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    wx.request({
      url: 'https://www.storyeveryday.com/test/notes/getNote?note_id=' + that.data.note_id,
      method: "GET",
      success: function (res2) {
        that.setData({
          changeTime: res2.header.Date
        })
        console.log(res2);
        var pwd = that.data.DESKEY;
        
        var mi_temp = res2.data.content;
        var mi = mi_temp.replace(/\s/g, '+');
        var result = CryptoJS.DES.decrypt(mi, pwd).toString(CryptoJS.enc.Utf8);
        if (result == '') {
          result = '解析错误'
        }
        that.setData({
          TextMin: result,

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
              video: "https://www.storyeveryday.com/resource/" + fileid + "/" + filename
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
        wx.hideToast();
      }
    })
  },


})

