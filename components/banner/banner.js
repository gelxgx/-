import { Api } from '../../utils/api';
const api = new Api();
Component({
  data: {
     indicatorDots: true,
     autoPlay:true,
     banners:[]
  },
  properties: {
    // showModal: {
    //   type: Boolean,
    //   value: false
    // },
    // modalInfo: {
    //   type: Object,
    //   value: {}
    // }
  },
  methods: {
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // api.getBanner((banners)=>{
      //   this.setData({
      //       banners
      //   })
      // })
      wx.request({
        url: 'https://yitian.zooseefun.net/zhuye/firstpage',
        success:res=>{
          this.setData({
            banners:res.data[1].pic
          })
        }
      })
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  }

})
