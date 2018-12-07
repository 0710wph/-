//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    wechat: "/asset/images/wx.jpg",//微信图标
    quan: "/asset/images/hb.jpg",//海报图标
    title: "五粮液参加博鳌亚洲论坛首尔会议，加速开放创新助力亚洲互利合作",
    des: '11月20日，以“开放创新的亚洲”为主题的博鳌亚洲论坛首尔会议在韩国举行。五粮液作为会议赞助合作伙伴和中方企业代表积极参会...',
    maskHidden: false,//控制分享背景是否显示
    yoururl:'https://xxx.com'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.downloadFile({
      url: that.data.yoururl, //你的域名
    })

  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function (title, des) {
    // this对象在程序中随时会改变，而var that=this之后，that不会改变，仍然指向之前this的对象。将当前初始化所指的对象赋值给that。
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff");
    context.fillRect(0, 0, 375, 667);

    var path = "/asset/images/top.jpg";
    context.drawImage(path, 0, 0, 375, 220);//drawImage(dx, dy, dWidth, dHeight)

    var path2 = "/asset/images/ewm.jpg";
    context.drawImage(path2, 20, 500, 120, 121);//绘制出海报中的二维码
    // 绘制标题、描述
    that.drawText(context, title, 260, 50, 335, 'left', 20, '20', '#333');
    that.drawText(context, des, 350, 100, 335, 'left', 20, '14', '#333');
    context.stroke();
    //绘制日期
    context.setFontSize(14);
    context.setFillStyle('#666');
    context.setTextAlign('left');
    context.fillText('2018-12-06', 20, 320);
    context.stroke();
    //绘制描述下发的横线
    context.strokeStyle = "#eee";
    context.moveTo(0, 460);
    context.lineTo(375, 460);
    context.stroke();
    //绘制右下角扫码提示语
    context.setFontSize(16);
    context.setFillStyle('#666');
    context.setTextAlign('left');
    context.fillText('长按识别小程序码', 140, 540);
    context.fillText('进入', 140, 570);
    context.setFillStyle('#f00');
    context.fillText('xx网', 180, 570);
    context.setFillStyle('#666');
    context.fillText('阅读全文', 236, 570);
    context.stroke();

    context.draw();
    //将生成好的图片保存到本地
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        x: 0,
        y: 0,
        quality: 1,
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },

  /**
* 绘制多行文本
* @param str 文本内容
*/
  drawText: function (ctx, str, initHeight, titleHeight, canvasWidth, align, posLeft, size, color) {
    ctx.setFontSize(size);
    ctx.setFillStyle(color);
    ctx.setTextAlign(align);
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), posLeft, initHeight);//绘制截取部分
        initHeight += 25;//20为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 25;
      }
      if (i == str.length - 1) {//绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), posLeft, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },

  //点击保存到相册
  baocun: function (str, canvas, initX, initY, lineHeight) {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log('11111')
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    console.log(e.currentTarget.dataset.titleType);
    console.log(e.currentTarget.dataset.desType);
    var that = this;
    this.setData({
      maskHidden: false
    });

    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg(e.currentTarget.dataset.titleType, e.currentTarget.dataset.desType);
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.yoururl, //仅为示例，并非真实的资源
      success: function (res) {
        if (res.statusCode === 200) {
          console.log("下载成功了 onShow")
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
    return {
      title: "我的分享：",
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  }
})
