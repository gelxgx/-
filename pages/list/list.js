import { Api } from '../../utils/api';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
const api = new Api();
const app = new getApp();
Page({
    data:{
      list:[],
      currentLang:app.globalData.language,
    },
    onLoad(){
    },
    onReady(){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      wx.request({
        url: 'https://yitian.zooseefun.net/detail/index',
        success:res=>{
          Toast.clear();
          console.log(res.data)
          this.setData({
            list:res.data
          })
        }
      })
    },
    handleDetail(event){
       console.log(event);
       const {id} = event.currentTarget.dataset;
        wx.navigateTo({
            url:`/pages/detail/detail?id=${id}`
        })
    },
    // handleLanguageSelect(event) {
    //   console.log('eventList', event);
    //   const { detail:currentLang } = event;
    //   this.setData({
    //     currentLang
    //   })
    // },
})
