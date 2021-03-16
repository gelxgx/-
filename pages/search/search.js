// pages/search/search.js

import { Api } from '../../utils/api';
const api = new Api();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    markers:[],
    currentLang:'cn',
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.request({
      url: 'https://yitian.zooseefun.net/detail/index',
      success:res=>{
        this.allMarkers = res.data
        this.setData({
          markers:res.data,
        })
      }
    })
    // api.getMarkers(markers=>{
    //   this.allMarkers = markers.filter(item=>item.type === 1);
    //   this.setData({
    //     markers:markers.filter(item=>item.type === 1)
    //   })
    // })
  },
  onSearch(event){
    const {detail:value} = event;
    const {allMarkers} = this;
    const _markers = allMarkers.filter(item=>item.cn.title.includes(value));
    this.setData({
      markers:_markers
    })
  },
})
