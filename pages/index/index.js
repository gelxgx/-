// pages/index/index.js
import { Api } from '../../utils/api';
const api = new Api();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    autoPlay:true,
    indicatorDots: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopBanner()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  jumpMap(){
    wx.navigateTo({
      url: '../home/home',
    })
  },
  jumpList(){
    wx.navigateTo({
      url: '../list/list',
    })
  },

  getTopBanner(){
   wx.request({
     url: 'https://yitian.zooseefun.net/zhuye/firstpage',
     success:res=>{
       this.setData({
        banners:res.data[0].pic
       })
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