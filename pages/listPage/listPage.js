// pages/listPage/listPage.js
var RSA = require('../../common/wx_rsa.js');
var CryptoJS = require('../../crypto-js/crypto-js');
var uuidv4 = require('../../uuid/we-uuidv4');
var Sig = ""
var encStr = ""
var ImagePaths1 = [];
var flag = 0;
var DESKEY = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backbtnurl: "../../image/backbtn.png",
    background_image: "../../image/meihua.png",
    changeTime: "2018年1月1日",
    ImagePaths: [],
    focus: false,
    array: ['便笺', '日记', '回收站'],
    index: 0,
    state: 0,
    TextMin: "",
    video: '',
    user_id: '',
    note_id: ''
  },

  constorge: function (e) {

    wx.getStorage({
      key: this.data.note_id + '',
      success: function (res) {
        console.log(res.data)
      },
    })
  },

  bindPickerChange: function (e) {
    var that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      state: e.detail.value
    })

    wx.request({
      url: 'https://www.storyeveryday.com/test/notes/updateNoteState?note_id='+that.data.note_id+"&state="+that.data.state,
      method:"PUT",
      success:function(res){
        
      }
    })
  },

  //返回更新函数
  toast: function (e) {
    var that = this;
    DESKEY = CryptoJS.SHA256(uuidv4).toString();
    console.log("!!noteid=" + that.data.note_id);

    //将生成的DES密钥保存在本地
    wx.setStorage({
      key: that.data.note_id + '',
      data: DESKEY,
      success: function (res) {
        console.log(res);
      }
    });
    var pwd = DESKEY;
    var mi_temp = CryptoJS.DES.encrypt(that.data.TextMin, pwd).toString();//生成加密密文
    var mi = mi_temp.replace(/\s/g, '+');

    that.data.TextMin = mi;
    console.log('新建pwd=' + pwd);
    console.log('新建mi=' + mi)




    wx.request({
      url: 'https://www.storyeveryday.com/test/notes/updateNoteTxt' + "?content=" + that.data.TextMin + "&note_id=" + that.data.note_id,
      method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT,
      data: {

      },
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log("修改便笺完成")
      },
      fail: function (res) {

      }
    })
    wx.navigateBack({});

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
    if (e.detail && e.detail.value.length > 0 && flag == 0) {
      this.setData({
        TextMin: e.detail.value
      });
      if (flag == 0) {
        var that = this;
        wx.request({
          url: 'https://www.storyeveryday.com/test/notes/addNote',//增加便笺
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: {
            user_id: that.data.user_id,
            content: that.data.TextMin,
            state: that.data.state,
            title: that.data.TextMin
          },
          success: function (res) {
            console.log(res);
            flag = 1;
            that.setData({
              note_id: res.data.note_id
            })
          }
        })
      }

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
        var tempFilePaths = res.tempFilePaths

        var Image = that.data.ImagePaths
        console.log(that.data.note_id);
        wx.uploadFile({
          url: "https://www.storyeveryday.com/test/fileUplode/picture2",
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user_id': that.data.user_id,
            'note_id': that.data.note_id,
          },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            console.log(res);
          }
        })
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
            console.log(res);
          }
        })

        that.setData({
          video: res.tempFilePath,
          size: (res.size / (1024 * 1024)).toFixed(2)
        })
      }
    })
  },

  onLoad: function (options) {


    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {

        that.setData({
          user_id: res.data
        });

      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  changebackground: function (res) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("修改背景图片成功")
        that.setData({
          background_image: res.tempFilePaths[0]
        })
        wx.setStorage({
          key: 'background_image',
          data: res.tempFilePaths[0]
        })
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
  onShareAppMessage: function () {
  }
})
var privateKey = '-----BEGIN RSA PRIVATE KEY-----MIICWwIBAAKBgGnyktNFsGYYAhj / hOBDZt1f38MVg8a / Oeohi4OLohM4I1K + qaJYrWeJRDxVef4R + 5bRxISNSxewfawtOF6w4xv8BXxdcmw+ Y1tpFbRyfK45Ezd2dJHb08YIaO4wKld+ x + n6ev3GCikfOLmfilbNj + pk24jZwia3k / vhvzg92OLHAgMBAAECgYAV4 / XsSzjgT1OXoKvuvl5xnQ6Zu0dH + FjaBGZUHrS1LeM2hIh + L75cZyM / KBYVpdeK2Pq2vI7obSH6Qjmkbv3tlO0TpCv2j9iuAUF4iifjpzmdDrdWtDsirUy9hfi2O5haDnIq / S2HdYTRrwJlfDJxuiRbSvTEjvy1W2tAsMMQAQJBALVOtxPC2V + VzHqzw8B4La7qAepbnbfjhmVhbI6C5L6BrCBP3xrEV6AKMgd9zfiOeVKOLIJhaXoF4lBSwxQMmscCQQCVmCbfohleM + 9Gaq2uqccrLKnd6cbBnR9lB7e5xeuNPL0b+ XJbe0VsuYT4JPN8ZYxIzift4kBa5DVH + 6VtyXgBAkBpW+ i / rwcqqJ4 + 35 / thOjnME0Up1Crv6gl2ct / tUi//BLOZBu+LkLNWZ9hAxZiTkjqVHxA9+KXajvteWqrh/eZAkBP1gPpFfmz7MOmMQjATpuczxlY9Yq9ib1XjebfnmE331KNu3Lsn71NaTUtuYq4uPlFYcCtlDIEUAafhA2lqgABAkEAlfqBG3ijRsgHxS + nUWgGRwAeQUSRg5Gr + B4rzydHv2ApDUtfOtTi3uQdfKImV0HibWJeYLEY + RA80KEw2Mp4Iw ==  -----END RSA PRIVATE KEY-----';
var publicKey = '-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGnyktNFsGYYAhj / hOBDZt1f38MVg8a / Oeohi4OLohM4I1K + qaJYrWeJRDxVef4R + 5bRxISNSxewfawtOF6w4xv8BXxdcmw + Y1tpFbRyfK45Ezd2dJHb08YIaO4wKld + x + n6ev3GCikfOLmfilbNj + pk24jZwia3k / vhvzg92OLHAgMBAAE=-----END PUBLIC KEY-----'