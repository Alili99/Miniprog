//index.js

Page({
  data: {
    open: false,
    TopTittle: '便笺',
    CardMsg: '你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊'
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