// pages/card/card.js
// import { Api } from '../../utils/api';
import {timeFormat} from '../../utils/utils';
// const api = new Api();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    card:"",
    locationText:'',
    dateString:'',
    canvasWidth:675,
    canvasHeight:889,
    cardBgUrl:'/images/card_content_bg.png',
    cardTitle:'/images/card-title.png',
    cardLogo:'/images/logo.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
    const {id} = options;
    const date = timeFormat(new Date(),'yyyy/mm/dd');
    // api.getMarkerById(id,(detail)=>{
    //     this.setData({
    //         detail,
    //         locationText:`${detail.cn.title}打卡留念`,
    //         dateString:`--${date}`
    //     })
    //     this.getHttpImageUrl(detail.card_img).then((detailImg)=>{
    //       this.drawCard(detailImg);
    //     })
    // })
    wx.request({
      url: 'https://yitian.zooseefun.net/detailid/index',
      data:{
          id:id
      },
      success:res=>{
          console.log(res.data)
          this.setData({
            detail:res.data,
            locationText:`${res.data.cn.title}打卡留念`,
            dateString:`--${date}`
          })
          this.getHttpImageUrl(res.data.cardimg).then((detailImg)=>{
            this.drawCard(detailImg);
          })
      }
    })
  },
  drawCard(detailImg){
    console.log('detailImg',detailImg);
    const ctx = wx.createCanvasContext('mycanvas');
    const {canvasWidth,canvasHeight, cardBgUrl,cardTitle,cardLogo,locationText,dateString} = this.data;
    ctx.rect(0,0,canvasWidth,canvasHeight);
    ctx.drawImage(cardBgUrl,0,0,canvasWidth,canvasHeight);
    ctx.drawImage(cardTitle,70, 134, 536, 42);
    ctx.drawImage(detailImg,47, 208, 582, 428);
    ctx.drawImage(cardLogo,184, canvasHeight - 88, 306, 37);
    ctx.setFontSize(24);
    ctx.setFillStyle('#847973');
    ctx.fillText(locationText,261,canvasHeight-162);
    ctx.setFontSize(24);
    ctx.setFillStyle('#847973');
    ctx.fillText(dateString,395,canvasHeight-128);
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: res => {
          console.log(res)
          this.setData({
              card:res.tempFilePath
          })
        }
      })
    })
  },
  getHttpImageUrl(url) {
      return new Promise((resolve)=> {
        wx.downloadFile({
        url: url,
        success: (res)=> {
          const url = res.tempFilePath
          resolve(url);
          }
        })
    })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  saveCard(){
    wx.saveImageToPhotosAlbum({
      filePath:this.data.card,
      success:res=>{
        wx.showToast({
          title: '保存成功',
        });
      },
      fail:err =>{
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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