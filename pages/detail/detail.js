import { Api } from '../../utils/api';
const api = new Api();
const app = new getApp();
Page({
    data:{
        detail:{},
        indicatorDots:true,
        autoPlay:true,
        currentLang:app.globalData.language,
    },
    onLoad(options){
        console.log("OPTIONS",options)
        const {id} = options;
        this.getMarkerById(id)
        // api.getMarkerById(id,(detail)=>{
        //     this.setData({
        //         detail
        //     })
        //     const {currentLang} = this.data;
        //     wx.setNavigationBarTitle({
        //         title: detail[currentLang].title || ''
        //     })
        // })
    },
    onReady(){
       
    },
    audioPlay(event){

    },
    getMarkerById(id){
        wx.request({
          url: 'https://yitian.zooseefun.net/detailid/index',
          data:{
              id:id
          },
          success:res=>{
              console.log(res.data)
              this.setData({
                  detail:res.data
              })
          }
        })
    },
    handleLanguageSelect(event) {
        const { detail:currentLang } = event;
        this.setData({
          currentLang
        })
        const { detail } = this.data;
        wx.setNavigationBarTitle({
            title: detail[currentLang].title || ''
        })
    }
})