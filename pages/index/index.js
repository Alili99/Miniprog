//index.js

Page({
  data: {
    open: false,
    TopTittle: '便笺',
    CardMsg: '你猜我对',
    array: ['便笺', '日记', '猫', '已归档','回收站'],
    index: 0
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  toast: function () {
    wx.navigateTo({
      url: '../listPage/listPage'
    })
  },
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  } 
})