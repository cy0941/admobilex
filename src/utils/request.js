import http from "./http.js";

//app应用列表
const getAppInfo = (params) => {
  let options = {
    // url: "/ex/api/AppController/SelectApp",
    url: "/ex/api/ex/getAppList",
    params,
  };
  return http(options);
};

//请求所有的应用app
const appNameList = (params) => {
  let options = {
    url: "/ex/api/ex/appNameList",
    params,
  };
  return http(options);
};
//获取应用类别列表
const appCategoryList = (params) => {
  let options = {
    url: "/ex/api/ex/getCategoryList",
    params,
  };
  return http(options);
};
//设置应用过滤类别
const appFitterCategories = (data) => {
  let options = {
    url: "/ex/api/ex/filterCategory",
    data,
    method: "post",
  };
  return http(options);
};
//广告单元的新增
const Addplacement = (data) => {
  let options = {
    url: "/ex/api/ex/placement",
    method: "post",
    data,
  };
  return http(options);
};
//广告单元的修改
const placement = (data) => {
  let options = {
    url: "/ex/api/ex/placement",
    method: "put",
    data,
  };
  return http(options);
};
//卖量操作中心的列表查询
const PlacementList = (params) => {
  let options = {
    url: "/ex/api/ex/placement",
    params,
  };
  return http(options);
};
const CreateApp = (data) => {
  let options = {
    url: "/ex/api/ex/createApp",
    method: "post",
    data,
  };
  return http(options);
};

//卖量操作中心的广告位删除接口
const Deleteplacement = (params) => {
  let options = {
    url: "/ex/api/ex/delPlacement",
    method: "delete",
    params,
  };
  return http(options);
};
const DeleteApp = (params) => {
  let options = {
    url: "/ex/api/ex/deleteApp",
    method: "delete",
    params,
  };
  return http(options);
};
//卖量操作中心的广告位标编辑接口
const Getplacement = (params) => {
  let options = {
    url: "/ex/api/ex/getPlacement",
    params,
  };
  return http(options);
};

const UpdateApp = (data) => {
  let options = {
    url: "/ex/api/ex/updateApp",
    method: "put",
    data,
  };
  return http(options);
};
//卖量操作中心的广告口新增
const Addadmouth = (data) => {
  let options = {
    url: "/ex/api/ex/admouthadd",
    method: "post",
    data,
  };
  return http(options);
};

const SwitchPlacement = (data) => {
  let options = {
    url: "/ex/api/ex/switchPlacement",
    method: "put",
    data,
  };
  return http(options);
};
//买量操作中心的语言
const Language = (params) => {
  let options = {
    url: "/ex/api/ex/language",
  };
  return http(options);
};
//买量操作中心的运营商
const Carrier = (params) => {
  let options = {
    url: "/ex/api/ex/carrier",
    params,
  };
  return http(options);
};
// 广告位修改接口
const EditPlacement = (data) => {
  let options = {
    url: "/ex/api/ex/editPlacement",
    method: "put",
    data,
  };
  return http(options);
};
// 获取广告位尺寸
const getPlacementSize = (params) => {
  let options = {
    url: "/ex/api/ex/placement_size",
  };
  return http(options);
};
//  获取用户信息
const getUserInfo = (params) => {
  let options = {
    url: "/ex/api/ex/user?current",
  };
  return http(options);
};

// 修改用户信息
const UpdateUser = (data) => {
  let options = {
    url: `/ex/api/ex/updateUser/${data.id}`,
    method: "put",
    data,
  };
  return http(options);
};
// 买量操作中心的设备接口
const Getdevice = (params) => {
  let options = {
    url: "/ex/api/ex/device",
    params,
  };
  return http(options);
};
// 买量操作中心的操作系统
const Getoperating = () => {
  let options = {
    url: "/ex/api/ex/operating",
  };
  return http(options);
};
// 买量操作中心的视频请求
const MediaAsset = (params) => {
  let options = {
    url: "/creative-ui/api/media-asset",
    params,
  };
  return http(options);
};
// APP素材库列表视频
const CreativeSourceList = (params) => {
  let options = {
    url: "/ex/api/ex/getCreativeSourceList",
    params,
  };
  return http(options);
};
// 改变优先级
const EditPriority = (data) => {
  let options = {
    url: "/ex/api/ex/updatePriority",
    method: "post",
    data,
  };
  return http(options);
};
//卖量操作中心视频素材与应用关联接口
const AddSourceRelation = (data) => {
  let options = {
    url: "/ex/api/ex/addSourceRelation",
    method: "post",
    data,
  };
  return http(options);
};
//买量报表接口文档
const GetBuyer = (params) => {
  let options = {
    url: "/ex/api/rx/reportgetBuyer",
    params,
  };
  return http(options);
};
//卖量报表接口文档
const GetSeller = (params) => {
  let options = {
    url: "/ex/api/rx/reportgetSeller",
    params,
  };
  return http(options);
};
//素材报表接口文档
const GetCreative = (params) => {
  let options = {
    url: "/ex/api/rx/reportgetCreative",
    params,
  };
  return http(options);
};
//删除素材库素材接口
const deleteCreativeSource = (params) => {
  let options = {
    url: "/ex/api/ex/deleteCreativeSource",
    method: "delete",
    params,
  };
  return http(options);
};
//获取买量操作中心的列表接口
const SellercampaignList = (params) => {
  let options = {
    url: "/ex/api/ex/getCampaign",
    params,
  };
  return http(options);
};
//获取买量操作中心的换量删除
const DelCampaign = (params) => {
  let options = {
    url: "/ex/api/ex/delCampaign",
    method: "delete",
    params,
  };
  return http(options);
};
//获取买量操作中心的换量活动状态切换
const switchCampaign = (data) => {
  let options = {
    url: "/ex/api/ex/switchCampaign",
    method: "put",
    data,
  };
  return http(options);
};

// 获取APP详情
const GetAppDetail = (params) => {
  let options = {
    url: "/ex/api/ex/getAppDetail",
    params,
  };
  return http(options);
};

// 获取单个APP下的广告单元
const AppPlacement = (params) => {
  let options = {
    url: "/ex/api/ex/appPlacement",
    params,
  };
  return http(options);
};
// 激励视频预览
const PreviewVideoCreative = (params) => {
  let options = {
    url: "/ex/api/ex/creativeOnlinePreview",
    params,
  };
  return http(options);
};
// 视频预览请求
const PreviewCreative = (data) => {
  let options = {
    url: "/ex/api/ex/previewCreative",
    method: "post",
    data,
  };
  return http(options);
};
// 视频制作
const AddcreateCreative = (data) => {
  let options = {
    url: "/ex/api/ex/createCreative",
    method: "post",
    data,
  };
  return http(options);
};

//  获取单个APP下的创意
const GetCreativeList = (params) => {
  let options = {
    url: "/ex/api/ex/getCreativeList",
    params,
  };
  return http(options);
};

//  添加Profile接口
const Addprofile = (data) => {
  let options = {
    url: "/ex/api/ex/profile",
    method: "post",
    data,
  };
  return http(options);
};
// 关联创意接口
const campaignBindCreative = (data) => {
  let options = {
    url: "/ex/api/ex/campaignBindCreative",
    method: "post",
    data,
  };
  return http(options);
};
//  获取单个APP下的换量活动
const AppCampaign = (params) => {
  let options = {
    url: "/ex/api/ex/appCampaign",
    params,
  };
  return http(options);
};
//卖量操作中心的广告单元
const CampaignBindPlacement = (params) => {
  let options = {
    url: "/ex/api/ex/campaignBindPlacement",
    params,
  };
  return http(options);
};
//卖量操作中心的添加
const Addcampaign = (data) => {
  let options = {
    url: "/ex/api/ex/campaign",
    method: "post",
    data,
  };
  return http(options);
};
//获取卖量操作中心的详情
const GetCampaign = (params) => {
  let options = {
    url: "/ex/api/ex/singleCampaign",
    params,
  };
  return http(options);
};
//获取用户信息
const GetMember = (params) => {
  let options = {
    url: "/ex/api/ex/member",
    params,
  };
  return http(options);
};

//卖量操作中心的编辑
const EditCampaign = (data) => {
  let options = {
    url: "/ex/api/ex/editCampaign",
    method: "put",
    data,
  };
  return http(options);
};
//  添加Profile接口编辑
const Putprofile = (data) => {
  let options = {
    url: "/ex/api/ex/profile",
    method: "put",
    data,
  };
  return http(options);
};

// 获取单个APP下的广告口
const AdmouthGetAll = (params) => {
  let options = {
    url: "/ex/api/ex/admouthgetAll",
    params,
  };
  return http(options);
};

//  删除创意接口
const DeleteCreative = (params) => {
  let options = {
    url: "/ex/api/ex/deleteCreative",
    method: "delete",
    params,
  };
  return http(options);
};
//  获取创意详情接口
const GetCreativeDetail = (params) => {
  let options = {
    url: "/ex/api/ex/getCreativeDetail",
    params,
  };
  return http(options);
};
//  广告口删除
const Admouthdeleted = (params) => {
  let options = {
    url: "/ex/api/ex/admouthdeleted",
    params,
  };
  return http(options);
};
//  获取广告口详情
const AdmouthgetInfo = (params) => {
  let options = {
    url: "/ex/api/ex/admouthgetInfo",
    params,
  };
  return http(options);
};
// 修改广告口
const Admouthedit = (data) => {
  let options = {
    url: "/ex/api/ex/admouthedit",
    method: "post",
    data,
  };
  return http(options);
};
// 创意修改
const updateCreative = (data) => {
  let options = {
    url: "/ex/api/ex/updateCreative",
    method: "put",
    data,
  };
  return http(options);
};
// 创意删除
const deleteCreative = (params) => {
  let options = {
    url: "/ex/api/ex/deleteCreative",
    method: "delete",
    params,
  };
  return http(options);
};
// 插页，banner创意制作
const BannerCreative = (data) => {
  let options = {
    url: "/ex/api/ex/createBannerCreative",
    method: "post",
    data,
  };
  return http(options);
};

// Banner创意修改
const PutBannerCreative = (data) => {
  let options = {
    url: "/ex/api/ex/updateCreative",
    method: "put",
    data,
  };
  return http(options);
};

// 创意开关
const changeCreativeStatus = (data) => {
  let options = {
    url: "/ex/api/ex/changeCreativeStatus",
    method: "put",
    data,
  };
  return http(options);
};
// 素材搜索
const mediaSearch = (params) => {
  let options = {
    url: "/ex/api/rx/mediaSearch",
    params,
  };
  return http(options);
};
//  图表报表
const chartReport = (params) => {
  let options = {
    url: "/ex/api/rx/chartReport",
    params,
  };
  return http(options);
};
//通知获取
const getNotificationList = (params) => {
  let options = {
    url: "/ex/api/notification/notice/queryNotice",
    params,
  };
  return http(options);
};
// 标记已读
const editNotificationList = (data) => {
  let options = {
    url: "/ex/api/notification/notice/readNotice",
    method: "post",
    data,
  };
  return http(options);
};
// 一键已读
const readNotificationList = (data) => {
  let options = {
    url: "/ex/api/notification/notice/readAllNotice",
    method: "post",
    data,
  };
  return http(options);
};
//模板列表获取
const getTemplateList = (params) => {
  let options = {
    url: "/ex/api/ex/creative_template",
    params,
  };
  return http(options);
};
// 添加、编辑template
const saveTemplate = (data) => {
  let options = {
    url: "/ex/api/ex/saveTemplate",
    method: "post",
    data,
  };
  return http(options);
};
// 更改template状态、删除、复制接口
const bulkTemplate = (data) => {
  let options = {
    url: "/ex/api/ex/bulkTemplate",
    method: "post",
    data,
  };
  return http(options);
};
// 获取模板的数据
const getTemplate = (current,pageSize) => {
  let options = {
    url: "/ex/api/ex/getTemplate?page="+current+"&element_num="+pageSize,
    method: "get",
  };
  return http(options);
};
// creativeFormat接口
const creativeFormat = (data) => {
  let options = {
    url: "/ex/api/ex/creativeFormat",
    method: "get",
    data,
  };
  return http(options);
};
// mediaSubtype接口
const mediaSubtype = (data) => {
  let options = {
    url: "/ex/api/ex/mediaSubtype",
    method: "get",
    data,
  };
  return http(options);
};
// vast_extension列表接口
const vastExtension = (current,pageSize) => {
  let options = {
    url: "/ex/api/ex/vast_extension_template?page="+current+"&element_num="+pageSize,
    method: "get",
  };
  return http(options);
};
// vast_extension_template列表接口
const operationVastExtension = (data) => {
  let options = {
    url: "/ex/api/ex/vast_extension_template",
    method: "post",
    data
  };
  return http(options);
};
// 添加广告平台
const addPlatform = (params) => {
  let options = {
    url: "/ex/api/ex/mediation_network",
    method: "post",
    params
  };
  return http(options);
};
// 获取广告平台列表
const getPlatformList = (params) => {
  let options = {
    url: "/ex/api/ex/mediation_network",
    params
  };
  return http(options);
};
// network列表接口
const getNetwork = (params) => {
  let options = {
    url: "/ex/api/ex/getPartner",
    params,
  };
  return http(options);
};
// 切换广告平台状态
const switchNetworkActive = (data) => {
  let options = {
    url: "/ex/api/ex/switch_mediation_network",
    method: "post",
    data
  };
  return http(options);
};
// 删除广告平台列表
const delNetworkItem = (data) => {
  let options = {
    url: "/ex/api/ex/del_mediation_network",
    method: "delete",
    data
  };
  return http(options);
};
// 创建广告源
const addMediation = (data) => {
  let options = {
    url: "/ex/api/ex/mediation_bids",
    method: "post",
    data
  };
  return http(options);
};
//  获取广告源瀑布流列表
const getMediationBidsList = (params) => {
  let options = {
      url: "/ex/api/ex/mediation_bids",
      params
  }
  return http(options)
}
// 删除广告源瀑布流
const delMediationBid = (data) => {
  let options = {
    url: "/ex/api/ex/del_mediation_bid",
    method: "delete",
    data
  };
  return http(options);
};
// 修改广告源瀑布流价格
const editMediationBidPrice = (data) => {
  let options = {
    url: "/ex/api/ex/edit_revenue_value",
    method: "put",
    data
  };
  return http(options);
};
// 切换广告源瀑布流状态
const switchMediationBidActive = (data) => {
  let options = {
    url: "/ex/api/ex/switch_mediation_bid",
    method: "put",
    data
  };
  return http(options);
};
//  获取广告关联换量活动列表
const getPlacementCampaign = (params) => {
  let options = {
      url: "/ex/api/ex/placement_campaign",
      params
  }
  return http(options)
}
// 切换广告关联换量活动状态
const switchPlacementCampaignActive = (data) => {
  let options = {
    url: "/ex/api/ex/placement_filter_campaign",
    method: "put",
    data
  };
  return http(options);
};
//  获取标签列表
const getBidLabel = (params) => {
  let options = {
      url: "/ex/api/ex/bids_label",
  }
  return http(options)
}
//  获取货币列表
const getCurrency = (params) => {
  let options = {
      url: "/ex/api/ex/getCurrency",
  }
  return http(options)
}
 //  获取管理广告源列表
const getPlacementAdSources = (params) => {
  let options = {
      url: "/ex/api/ex/manage_mediation_bids",
      params
  }
  return http(options)
}
// 用户引导状态更改
const editLeadActive = (data) => {
  let options = {
    url: "/ex/api/ex/user_guid",
    method: "post",
    data
  };
  return http(options);
};
// 首页报表
const indexReport = (params) => {
  let options = {
    url: "/ex/api/rx/indexReport",
    method: "get",
    params
  };
  return http(options);
};
/* --------------------直客组------------------------ */
// 获取直客组列表
const getDirect = (params) => {
  let options = {
    url: "/ex/api/ex/getDirect",
    params
  };
  return http(options);
};
//获取费用类型列表
const getRevenueType = (params) => {
  let options = {
    url: "/ex/api/ex/revenue-Type",
    params
  };
  return http(options);
}
//新增直客组
const addDirect = (data) => {
  let options = {
    url: "/ex/api/ex/addDirect",
    method: "post",
    data
  };
  return http(options);
};
//修改直客组状态
const switchDirect = (data) => {
  let options = {
    url: "/ex/api/ex/switchDirect",
    method: "put",
    data
  };
  return http(options);
};
//删除直客组
const deleteDirect = (data) => {
  let options = {
    url: "/ex/api/ex/deleteDirect",
    method: "delete",
    data
  };
  return http(options);
};
//获取直客组信息
const getSingleDirect = (params) => {
  let options = {
    url: "/ex/api/ex/getSingleDirect",
    params
  };
  return http(options);
};
//编辑直客组信息
const updateDirect = (data) => {
  let options = {
    url: "/ex/api/ex/updateDirect",
    method: "put",
    data
  };
  return http(options);
};
//获取直客组名称列表
const directNameList = (params) => {
  let options = {
    url: "/ex/api/ex/directNameList",
    params
  };
  return http(options);
};
/* ---------------------end------------------------- */

/* -------------------直客活动----------------------- */
//获取直客模块下的活动信息
const getDirectCampaign = (params) => {
  let options = {
    url: "/ex/api/ex/getDirectCampaign",
    params
  };
  return http(options);
};
//创建直客活动
const createDirectCampaign = (data) => {
  let options = {
    url: "/ex/api/ex/createDirectCampaign",
    method: "post",
    data
  };
  return http(options);
};
//获取指定直客组下的直客活动
const directCampaignList = (params) => {
  let options = {
    url: "/ex/api/ex/directCampaignList",
    params
  };
  return http(options);
};
//获取直客活动下活动的详情
const getSingleDirectCampaign = (params) => {
  let options = {
    url: "/ex/api/ex/getSingleDirectCampaign",
    params
  };
  return http(options);
};
//修改直客活动信息
const updateDirectCampaign = (data) => {
  let options = {
    url: "/ex/api/ex/updateDirectCampaign",
    method: "put",
    data
  };
  return http(options);
};
//保存创意与活动的关联
const directCampaignBindCreative = (data) => {
  let options = {
    url: "/ex/api/ex/directCampaignBindCreative",
    method: "post",
    data
  };
  return http(options);
};
//获取素材标签列表
const getSourceTag = (params) => {
  let options = {
    url: "/ex/api/ex/getSourceTag",
    params
  };
  return http(options);
};
//修改素材标签
const updateSourceTag = (data) => {
  let options = {
    url: "/ex/api/ex/updateSourceTag",
    method: "put",
    data
  };
  return http(options);
};
//修改素材标签
const getDirectInfo = (params) => {
  let options = {
    url: "/ex/api/ex/getDirectInfo",
    params
  };
  return http(options);
};
//获取素材详情
const getSingleSource = (params) => {
  let options = {
    url: "/ex/api/ex/getSingleSource",
    params
  };
  return http(options);
};
//直客报表
const getDirectReport=(params)=>{
    let options = {
      url: "/ex/api/rx/directReport",
      params
    };
    return http(options);
}

/* -----------------end------------------ */

//添加流量分组
const addGrouping = (data) => {
  let options = {
    url: "/ex/api/ex/add_mediation_group",
    method:'post',
    data
  };
  return http(options);
};
//获取流量分组列表
const getGroupingList = (params) => {
  let options = {
    url: "/ex/api/ex/mediation_group_list",
    params
  };
  return http(options);
};
//删除流量分组
const delGrouping = (data) => {
  let options = {
    url: "/ex/api/ex/del_mediation_group",
    method:'delete',
    data
  };
  return http(options);
};
//复制流量分组sort_mediation_group
const copyGrouping = (data) => {
  let options = {
    url: "/ex/api/ex/copy_mediation_group",
    method:'post',
    data
  };
  return http(options);
};
//流量分组排序edit_mediation_group
const sortGrouping = (data) => {
  let options = {
    url: "/ex/api/ex/sort_mediation_group",
    method:'post',
    data
  };
  return http(options);
};
//编辑流量分组
const editGrouping = (data) => {
  let options = {
    url: "/ex/api/ex/edit_mediation_group",
    method:'put',
    data
  };
  return http(options);
};
//根据平台获取所有app
const getPlatformApp = (params) => {
  let options = {
    url: "/ex/api/ex/syntheticalReportCondition",
    params
  };
  return http(options);
};

//综合报表
const getSyntheticalReport = (params) => {
  let options = {
    url: "/ex/api/rx/syntheticalReport",
    params
  };
  return http(options);
};
//用户行为报表
const getUserBehaviorReport = (params) => {
  let options = {
    url: "/ex/api/rx/userBehaviorReport",
    params
  };
  return http(options);
};
//留存价值预估LTV报表
const getUserRetentionValue = (params) => {
  let options = {
    url: "/ex/api/rx/userRetentionValue",
    params
  };
  return http(options);
};
//mediaBid下流量分组出价列表
const getMediationBidGroupList = (params) => {
  let options = {
    url: "/ex/api/ex/mediation_bid_group_list",
    params
  };
  return http(options);
};
//查询APP应用商城信息接口（新增）
const getAppStoreInfo = (params) => {
  let options = {
    url: "/ex/api/ex/getAppStoreInfo",
    params
  };
  return http(options);
};
//App修改接口（新增）
const updateApp = (data) => {
  let options = {
    url: "/ex/api/ex/updateApp",
    method:'put',
    data
  };
  return http(options);
};
/* ---------------------end------------------------- */
export default {
  updateApp,
  getAppStoreInfo,
  getMediationBidGroupList,
  getSingleSource,
  getDirectInfo,
  updateSourceTag,
  getSourceTag,
  directCampaignBindCreative,
  updateDirectCampaign,
  getSingleDirectCampaign,
  directCampaignList,
  createDirectCampaign,
  directNameList,
  getDirectCampaign,
  updateDirect,
  getSingleDirect,
  deleteDirect,
  switchDirect,
  addDirect,
  getRevenueType,
  getDirect,
  chartReport,
  getAppInfo,
  SellercampaignList,
  CreateApp,
  appNameList,
  Addplacement,
  PlacementList,
  Deleteplacement,
  DeleteApp,
  UpdateApp,
  Getplacement,
  SwitchPlacement,
  Addadmouth,
  Language,
  EditPlacement,
  getUserInfo,
  Carrier,
  UpdateUser,
  Getdevice,
  Getoperating,
  MediaAsset,
  CreativeSourceList,
  AddSourceRelation,
  GetBuyer,
  GetSeller,
  GetCreative,
  deleteCreativeSource,
  DelCampaign,
  switchCampaign,
  GetAppDetail,
  AppPlacement,
  PreviewCreative,
  AddcreateCreative,
  GetCreativeList,
  Addprofile,
  AppCampaign,
  CampaignBindPlacement,
  Addcampaign,
  GetCampaign,
  EditCampaign,
  Putprofile,
  AdmouthGetAll,
  DeleteCreative,
  GetCreativeDetail,
  Admouthdeleted,
  AdmouthgetInfo,
  Admouthedit,
  updateCreative,
  deleteCreative,
  BannerCreative,
  PutBannerCreative,
  changeCreativeStatus,
  campaignBindCreative,
  placement,
  GetMember,
  mediaSearch,
  EditPriority,
  appCategoryList,
  appFitterCategories,
  getNotificationList,
  editNotificationList,
  getTemplate,
  creativeFormat,
  mediaSubtype,
  vastExtension,
  operationVastExtension,
  readNotificationList,
  getNetwork,
  getCurrency,
  addPlatform,
  getPlatformList,
  switchNetworkActive,
  addMediation,
  getMediationBidsList,
  getPlacementCampaign,
  getPlacementAdSources,
  delMediationBid,
  editMediationBidPrice,
  switchMediationBidActive,
  switchPlacementCampaignActive,
  getBidLabel,
  delNetworkItem,
  saveTemplate,
  bulkTemplate,
  getPlacementSize,
  editLeadActive,
  getTemplateList,
  indexReport,
  PreviewVideoCreative,
  getDirectReport,
  addGrouping,
  getGroupingList,
  delGrouping,
  copyGrouping,
  sortGrouping,
  editGrouping,
  getPlatformApp,
  getSyntheticalReport,
  getUserBehaviorReport,
  getUserRetentionValue

};
