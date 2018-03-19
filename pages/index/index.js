//index.js

Page({
  data: {
    open: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    touchOrnot: 0,
    translate: '',
    TopTittle: '便笺',
    card: {
      top: "阿里",
      time: "2017"
    },
    Text: {
      "TextMsg": "fjdklsajfkdlsajjfjdjksal;f"
    },
    CardMsg: '你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊你猜我对不对啊啊啊啊啊啊啊啊啊啊'
  },
  //点击触发侧滑栏
  tap_ch: function (e) {
    if (this.data.staus) {
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      this.data.staus = 0;
    } else {
      this.setData({
        translate: 'transform: translateX(' + this.data.windowWidth * 0.60 + 'px)'
      })
      this.data.staus = 1;
    }
  },


  tap_start: function (e) {
    this.data.mark = e.touches[0].pageX;

    if (this.data.staus == 1) {
      // staus = 1指默认状态既关闭状态
      this.data.mark = e.touches[0].pageX;
    } else {
      // staus = 2指屏幕滑动到右边的状态
      this.data.mark = e.touches[0].pageX;
    }
  },


  tap_drag: function (e) {
    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;

    if ((this.data.mark < this.data.newmark) && (this.data.mark < (this.data.windowWidth * 0.1))) {
      if (this.data.staus == 1) {
        if (this.data.windowWidth * 0.60 > Math.abs(this.data.newmark - this.data.mark)) {
          this.setData({
            translate: 'transform: translateX(' + (this.data.newmark - this.data.mark) + 'px)' //手指的横向位移量设置为窗口的偏移
          })
        }
      }
    }


    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      if (this.data.staus == 1 && (this.data.newmark - this.data.mark) > 0) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark - this.data.mark) + 'px)'
        })
      } else if (this.data.staus == 2 && this.data.mark - this.data.newmark < this.data.windowWidth * 0.60) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark + this.data.windowWidth * 0.60 - this.data.mark) + 'px)'
        })
      }
    }


    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {

    if (this.data.staus == 1 && this.data.mark < this.data.newmark ) 
      {if (Math.abs(this.data.newmark - this.data.mark) < (this.data.windowWidth * 0.2)) {
        this.setData({translate: 'transform: translateX(0px)'})
        this.data.staus = 1;
        } else {this.setData({translate: 'transform: translateX(' + this.data.windowWidth * 0.60 + 'px)'})
                this.data.staus = 2;}
    } 
    else {
        if (Math.abs(this.data.newmark - this.data.mark) < (this.data.windowWidth * 0.2)) {
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.60 + 'px)'
        })
        this.data.staus = 2;
        } 
        else {this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      }
    }

    this.data.mark = 0;
    this.data.newmark = 0;
  }
})


// Page({
//   data: {
//     lastX: 0,
//     lastY: 0,
//     text: "没有滑动",
//     currentGesture: 0,
//   },
//   handletouchmove: function (event) {
//     console.log(event)
//     if (this.data.currentGesture != 0) {
//       return
//     }
//     let currentX = event.touches[0].pageX
//     let currentY = event.touches[0].pageY
//     let tx = currentX - this.data.lastX
//     let ty = currentY - this.data.lastY
//     let text = ""
//     //左右方向滑动
//     if (Math.abs(tx) > Math.abs(ty)) {
//       if (tx < 0) {
//         text = "向左滑动"
//         this.data.currentGesture = 1
//       }
//       else if (tx > 0) {
//         text = "向右滑动"
//         this.data.currentGesture = 2
//       }

//     }
//     //上下方向滑动
//     else {
//       if (ty < 0) {
//         text = "向上滑动"
//         this.data.currentGesture = 3

//       }
//       else if (ty > 0) {
//         text = "向下滑动"
//         this.data.currentGesture = 4
//       }

//     }

//     //将当前坐标进行保存以进行下一次计算
//     this.data.lastX = currentX
//     this.data.lastY = currentY
//     this.setData({
//       text: text,
//     });
//   },

//   handletouchtart: function (event) {
//     console.log(event)
//     this.data.lastX = event.touches[0].pageX
//     this.data.lastY = event.touches[0].pageY
//   },
//   handletouchend: function (event) {
//     console.log(event)
//     this.data.currentGesture = 0
//     this.setData({
//       text: "没有滑动",
//     });
//   },
// })