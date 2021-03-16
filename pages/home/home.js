import { IsPtInPoly, ytPonits } from '../../utils/utils';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

const QQMapWX = require('../../lib/qqmap-wx-jssdk');

const MapKey = 'MPGBZ-RCT3D-AAQ4N-PBRKA-SVM7J-OBBBJ'

const qqmapsdk = new QQMapWX({
  key: MapKey // 必填
});



const userNotYTMsg = '您当前的所在位置未在景区!';

const polylineStyle = {
  color: "#FFFFFF",
  width: 4,
  borderColor: "#1296DB",
  borderWidth: 1
};

const callout = {
  bgColor: "#ffffff",
  borderRadius: 3,
  color:'#4d4d4d',
  content: "铜像",
  display: "ALWAYS",
  fontSize: 9,
  padding: 4
}

Page({
  /**   * 页面的初始数据   */
  data: {
    type:1,
    latitude: 24.774812,
    longitude: 110.492977,
    subkey:MapKey,
    markers:[],
    shopMarkers:[],
    showMarkers:[],
    showModal:false,
    isShowSearch:false,
    modalInfo:{},
    toggleRoutes: false,
    userLatitude:'',
    userLongitude:'',
    scale:20,
    markerId: 1,
    popupShow:false,
    route: [
      Object.assign({ points: [] }, polylineStyle)
    ],
    locationTypeList:[],
    activeTypeList:[1]
  },
  default_markers:[],
  all_markers:[],
  type_markers:[],

  onLoad(options) {
    this.mapCtx = wx.createMapContext('mapId');
    const {id} = options;
    console.log(id)
    if(id){
      this.getNewMarkers(()=>{this.autoOpenModal(id),this.getType()});
    }
    else{
      this.getNewMarkers(()=>{this.getType()});
    }
    this.getMarkersType();
  },
  getType(){
    const {type_markers,all_markers} = this
    wx.request({
      url: 'https://yitian.zooseefun.net/detailid/classfindbyid',
      success:res=>{
        const _shopMarkers = res.data.map((item,index)=>{
          return {
            ...item,
            id:index+9,
            items:[item.icon],
            width:20,
            height:20,
            label:{
              content:item.name,
              color:'#4d4d4d',
              fontSize:10,
              anchorX: -(0.5 * item.name.length * 10)
            } 
          }
        })
        this.shop_markers = this.copyArr([..._shopMarkers,...type_markers])
        let all = [...this.data.showMarkers,...this.shop_markers]
        this.all_markers=this.copyArr([...all,...all_markers])
        console.log(all)
        this.setData({
          markers:all
        })
        console.log(this.data.markers)
      }
    })
  },
  // getMarkers(callBack){
  //   const {default_markers} = this;
  //   api.getMarkers((data)=>{
  //     const _markers = data.map(item=>{
  //       if(item.type === 1){
  //         return {
  //           ...item,
  //           width:40,
  //           height:40,
  //           callout:{
  //             ...callout,
  //             content:item.cn.title 
  //           }
  //         }
  //       }
  //       else{
  //         return{
  //           ...item,
  //           width:20,
  //           height:20,
  //           label:{
  //             content:item.cn.title,
  //             color:'#4d4d4d',
  //             // textAlign:'center',
  //             fontSize:10,
  //             anchorX: -(0.5 * item.cn.title.length * 10)
  //           } 
  //         }
  //       }
  //   })
  //     // this.default_markers = this.copyArr([..._markers,...default_markers]);
  //     // this.setData({
  //     //   markers: this.default_markers
  //     // })
  //     callBack && callBack();
  //   })
  // },
  getNewMarkers(callBack){
    const {default_markers} = this
    wx.request({
      url: 'https://yitian.zooseefun.net/detail/index',
      success:res=>{
        const _markers = res.data.map(item=>{
          return {
            ...item,
            width:40,
            height:40,
            callout:{
              ...callout,
              content:item.cn.title 
            }
          }
        })
        this.default_markers = this.copyArr([..._markers,...default_markers])
        this.setData({
          showMarkers:this.default_markers
        })
        callBack && callBack();
      }
    })
  },
  toggleSearch(){
    const {isShowSearch} = this.data;
    this.setData({
      isShowSearch:!isShowSearch
    })
  },
  onCancel(){
    this.setData({
      showModal:false
    })
  },
  jumpList(){
    wx.navigateTo({
      url:'/pages/list/list'
    })
  },
  goBack(){
    wx.navigateTo({
      url:'/pages/index/index'
    })
  },

  getMarkersType(){
    wx.request({
      url: "https://yitian.zooseefun.net/servericon/index",
      success:res=>{
        this.setData({
          locationTypeList:res.data
        })
      }
    })
    // api.getMarkersType((locationTypeList)=>{
    //   // console.log('list',list);
    //   // 过滤掉景区
    //   this.setData({
    //     locationTypeList:locationTypeList.filter(item=>item.id !== 1)
    //   })
    // })
  },

  handleTypeList(event){
    const {type} = event.currentTarget.dataset;
    const {all_markers} = this;
    const {locationTypeList,activeTypeList} = this.data;
    if(activeTypeList.includes(type)){
      const index = activeTypeList.findIndex(t=>t===type);
      console.log('index',index);
      activeTypeList.splice(index,1);
    }
    else{
      activeTypeList.push(type);
    }
    console.log('activeTypeList',activeTypeList);
    const markers = this.copyArr(all_markers);
    const _markers = markers.filter(item => activeTypeList.includes(item.type)) || [];
    this.setData({
      markers:_markers,
      locationTypeList,
      activeTypeList
    })
    this.includePoints(100);
  },

  includePoints(padding) {
    const {markers} = this.data;
    this.mapCtx.includePoints({
      padding: [padding, padding, padding, padding],
      points: markers
    });
  },
  handleDetail(event){
    const {detail} = event;
    wx.navigateTo({
      url:`/pages/detail/detail?id=${detail}`
    })
  },
  goHere(event){
    const {detail:id} = event;
    const currentMarker = this.all_markers.find(item=>item.id === id);
    const {latitude,longitude} = currentMarker;
    const {userLongitude,userLatitude} = this.data;
    if(userLongitude && userLatitude){
      this.drawPolyline(userLatitude,userLongitude,latitude, longitude);
    }
    else{
        this.getUserLocation(({userLatitude,userLongitude})=>{
          this.drawPolyline(userLatitude,userLongitude,latitude, longitude);
        })
    }
  },
  drawPolyline(userLatitude,userLongitude,latitude, longitude){
    const _isPtInPoly = IsPtInPoly(userLatitude, userLongitude, ytPonits);
    qqmapsdk.direction({
      mode:'walking',
      from:{
        latitude:userLatitude,
        longitude: userLongitude
        // latitude: '24.775864',
        // longitude:'110.493000'
      },
      to:{
        latitude, 
        longitude
      },
      success:(res)=>{
          console.log('res',res);
          const {status,result, message} = res;
          if(status === 0){
            const {routes} = result;
            const {polyline} = routes[0];
            const polylines = this.decompressionPolyline(polyline);
            console.log(polylines);
            this.setData({
              toggleRoutes:true,
              scale:_isPtInPoly ? 20 : 13,
              "route[0].points":[
                 ...polylines
              ]
            })
          }
          else{
            Notify({ type: 'danger', text: message});
          }
      },
      fail(errorRes){
        Notify({ type: 'danger', text: errorRes.message});
      }
    })
   
  },
  decompressionPolyline(coors){
      const pl = [];
      //坐标解压（返回的点串坐标，通过前向差分进行压缩）
      const kr = 1000000;
      for (let i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
      }
      //将解压后的坐标放入点串数组pl中
      for (let i = 0; i < coors.length; i += 2) {
        pl.push({ latitude: coors[i], longitude: coors[i + 1] })
      }
      return pl;
  },
  copyArr(arr){
    return JSON.parse(JSON.stringify(arr));
  },
  getUserLocation(callBack){
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy:true,
      success:(res)=> {
        // const speed = res.speed
        // const accuracy = res.accuracy
        const userLatitude = res.latitude;
        const userLongitude = res.longitude
        this.setData({
          userLatitude,
          userLongitude
        })
        callBack && callBack({userLatitude,userLongitude});
      },
      fail:()=>{
        this.wxGetSetting((wxSetting) => {
          const { authSetting } = wxSetting;
          console.log('authSetting', authSetting);
          if (authSetting["scope.userLocation"] === false) {
            console.log('用户未授权定位');
            this.setData({
              popupShow:true
            })
          }
        });
      }
     })
  },
  handleOpensetting(event) {
    this.onPopupClose();
  },
  onPopupClose() {
    this.setData({
      popupShow:false
    })
  },

  autoOpenModal(markerId){
      const {markers} = this.data;
      const {default_markers} = this
      const modalInfo = default_markers.find(item=>item.id == markerId);
      console.log("TEST",modalInfo)
      const {type} = modalInfo;
      this.setData({
        showModal:true,
        modalInfo,
        markerId,
        type
      })
  },
  onMarkerTap(event){
    console.log(event)
    const {markerId} = event.detail;
    const {markers} = this.data;
    console.log(markers)
    const modalInfo =  markers.find(item=>item.id === markerId) || {};
    const {id,type} = modalInfo;
    this.setData({
      showModal:true,
      modalInfo,
      markerId:id,
      type
    })
    console.log('MODAL',modalInfo)
  },
  moveToLocation(){
    const { userLongitude, userLatitude } = this.data;
      this.getUserLocation(({ userLatitude, userLongitude }) => {
        const _isPtInPoly = IsPtInPoly(userLatitude, userLongitude, ytPonits);
        if (!_isPtInPoly) {
          Notify({ type: 'danger', text: userNotYTMsg});
          return false;
        }
        this.mapCtx.moveToLocation();
      });

  },
  onBindregionchange(event){
    const {scale} = event.detail;
    const {markers} = this.data;
    const _markers = markers.map(item=>{
        if(item.type !=1){
          if(scale < 18){
            item.label.content = '';
          }
          else{
            item.label.content = item.name;
          }
        }
        return {
          ...item
        }
    });
    this.setData({
      markers:[..._markers]
    }) 
  },

  wxOpenSetting(){
    //console.log('wxOpenSetting');
    wx.openSetting({ success: res => {
      console.log(res);
    } });
  },

  wxGetSetting(callBack) {
    wx.getSetting({
      success:res=> {
        console.log('wxGetSetting', res);
        callBack(res);
      }
    })
  },
  jumpSearch(){
    wx.navigateTo({
      url:`/pages/search/search`
    })
  },
  onShow() {
    const { toggleRoutes } = this.data;
    if (toggleRoutes) {
      this.setData({
        toggleRoutes: false
      })
    }

  },
  // 分享效果
  onShareAppMessage () {
  return {
    title: `益田文创`,
    path: `pages/home/home`
  }
  }
})
