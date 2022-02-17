<template>
    <div class="manageAdFeeds" ref="manageAdFeeds">
        <h1>{{$t('adPlatform.adSourecesManager')}}&nbsp;&nbsp;&nbsp;&nbsp;{{name}}&nbsp;({{partner_name}})</h1>
        <div class="adFeeds">
            <div class="adSources">
                <div class="adHeads">{{$t('adPlatform.appList')}}</div>
                <div class="adSourcesItem" v-for="(item,index) in adSourcesList" :key="item.id" @click="openAdList([item.app_id,index])">
                    <div style="width='100%';">
                        <a-image
                        class="shisu_table_image"
                        :src="item.appInfo.app_icon_url"
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                        />
                        <AppleFilled style="margin-right:5px;" v-if="item.appInfo.platform==1" />
                        <AndroidFilled style="margin-right:5px;" v-else />
                        <!-- <AppleOutlined style="margin-right:5px;" v-if="item.appInfo.platform==1"/>
                        <AndroidOutlined style="margin-right:5px;" v-else/> -->
                        <!-- <el-tooltip  effect="dark" :content="item.appInfo.app_official_name" placement="top"> -->
                            <span class="appNames">{{item.appInfo.app_official_name}}</span>
                        <!-- </el-tooltip> -->
                    </div>
                    <div style="width='20px'" v-if="item.bids_count!=0">
                        <span class="point"></span>
                    </div>
                </div>
            </div>
            <div class="rights">
                <div class="rightHaeds" v-if="adUnitShow">
                    <a-image
                        class="shisu_table_image"
                        :src="slelctAppName.appInfo.app_icon_url"
                        fallback="data:image/png;base64,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"
                    />
                    <AppleFilled style="margin-right:5px;" v-if="slelctAppName.platform==1"/>
                    <AndroidFilled style="margin-right:5px;" v-else/>
                    <span>{{slelctAppName.appInfo.app_official_name}}</span>
                </div>
                <div class="footers">
                    <div class="adUnitList" v-show="adUnitShow">
                        <div class="adUnitListItem" v-for="(val,i) in adList" :key="val.name" @click="expandList([val.placement_id,i])">
                            <p>{{val.placement_name}}</p>
                            <p>{{val.media_Type=="other"?$t('adPlatform.vastVideo'):val.media_Type=="banner"?$t('adPlatform.banner'):val.media_Type=="interstitial"?$t('adPlatform.insertion'):$t('adPlatform.motivationalVideos')}}</p>
                            <div class="points" style="width='20px'" v-if="val.bids_count!=0">
                                <span class="point"></span>
                            </div>
                        </div>
                        <div v-if="adList.length==0">
                            <a-empty  style="margin-top:10px;"/>
                            <div class="text-empty shisu_fontSize-small">{{$t('adPlatform.click')}}
                                <a-button type="link" class="shisu_btn--notPadding" @click="adshow=true">+{{$t('adPlatform.adUnit')}}</a-button>
                            </div>
                        </div>
                    </div>
                    <div class="sourcesList" v-if="showList">
                        <div>
                            <a-button type="primary" class="create_Sources" @click="addSources">{{$t('adPlatform.addAdSoureces')}}</a-button>
                        </div>
                        <el-table  :data="list" ref="waterfall" style="width: 100%;min-height:5rem; margin-bottom:.2rem;">
                            <el-table-column :label="$t('adPlatform.adSourecesID')" prop="id" ></el-table-column>
                            <el-table-column :label="$t('adPlatform.network')" prop="name" show-overflow-tooltip>
                                <template #default="scope">
                                    <el-tooltip  effect="dark" :content="scope.row.name" placement="top" :open-delay="200" :enterable="false">
                                        <span class="mins">{{scope.row.name}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('adPlatform.networkName')" prop="name">
                                <template #default="scope">
                                    <el-tooltip  effect="dark" :content="scope.row.name" placement="top" :open-delay="200" :enterable="false">
                                        <span class="mins">{{scope.row.name}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('adPlatform.AdUnitID')" prop="placement_id" ></el-table-column>
                            <el-table-column prop :label="$t('adPlatform.actions')">
                            <template #default="scope">
                                <a-button type="link" size="small" class="shisu_text_btn" @click="goEditBids(scope.row.id)">{{$t('adPlatform.edit')}}</a-button>
                                <a-popconfirm
                                    :title="$t('adPlatform.deleteAdUnitContent')"
                                    :ok-text="$t('adPlatform.enter')"
                                    :cancel-text="$t('adPlatform.cancel')"
                                    @confirm="delMediationBids(scope.row.id)"
                                >
                                    <a-button type="link" size="small" class="shisu_text_btn purple" danger>{{$t('adPlatform.delete')}}</a-button>
                                </a-popconfirm>
                            </template>
                            </el-table-column>
                            <template v-slot:empty >
                                <a-empty :image="imageUrl" style="margin-top:10px;" :image-style="{height: '250px'}"/>
                                <div class="text-empty shisu_fontSize-small">
                                    {{$t('adPlatform.click')}}
                                    <a-button type="link" class="shisu_btn--notPadding" @click="addSources">+{{$t('adPlatform.addAdSoureces')}}</a-button>
                                </div>
                            </template>
                        </el-table>
                    </div>
                    <div class="sourcesList" v-else>
                        <a-empty :image="imageUrl" style="margin-top:10px;" :image-style="{height: '430px'}"/>
                        <!-- <img src="../../assets/undraw_Empty_re_opql.svg"/> -->
                        <!-- <div class="div-empty">
                            <i class="iconfont icon">&#xe746;</i>
                            <svg t="1634733711763" class="icon" viewBox="0 0 1950 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2614" width="430" height="430"><path d="M1945.976471 746.410667c-10.214902 64.928627-41.863529 127.949804-94.092549 167.830588-51.400784 39.278431-117.258039 53.232941-180.831373 65.229804a7190.166588 7190.166588 0 0 1-229.37098 39.504314c-10.867451 1.731765-21.742431 3.405804-32.627451 5.019607H962.509804c-0.451765-0.602353-0.928627-1.229804-1.380392-1.857255-0.727843-1.054118-1.455686-2.108235-2.158432-3.162352-0.401569-0.602353-0.803137-1.229804-1.204705-1.857255h280.094117c16.547137-0.012549 29.964549-13.417412 29.992157-29.967059v-373.860392c1.807059-5.672157 3.488627-11.369412 5.019608-17.141961a451.895216 451.895216 0 0 0 13.879216-82.095686c1.505882-19.32549 1.957647-38.65098 1.631372-58.001569-0.928627-53.182745-7.880784-106.36549-15.435294-159.171765-0.552157-3.890196-1.129412-7.80549-1.681569-11.695686-5.320784-36.693333-10.164706-76.624314 8.332549-108.774902 21.157647-36.793725 68.116078-52.128627 110.406275-48.363922 76.072157 6.801569 140.147451 65.054118 173.452549 133.797648 33.28 68.718431 40.734118 146.873725 43.77098 223.171764 1.606275 40.458039 1.430588 82.723137-4.21647 123.306667 19.07451-43.620392 38.164078-87.240784 57.273725-130.861177 10.189804-23.265882 20.906667-47.284706 39.780392-64.301176 39.454118-35.614118 104.70902-28.436078 146.848628 3.990588 42.11451 32.451765 65.204706 83.727059 80.564706 134.600785 19.024314 62.920784 28.737255 129.731765 18.497255 194.660392z" fill="#F2F2F2" p-id="2615"></path><path d="M1777.689098 393.753098c27.587765 48.860863 40.247216 104.889725 39.943529 160.803137a389.237961 389.237961 0 0 1-35.968 160.451765 403.092078 403.092078 0 0 1-86.505411 121.21851 367.264627 367.264627 0 0 1-124.315608 79.410196 324.86149 324.86149 0 0 1-168.683922 16.030118 326.568157 326.568157 0 0 1-23.439059-4.919216c-4.703373-1.159529-6.711216 6.098824-2.002823 7.260863a333.244235 333.244235 0 0 0 178.803451-5.145098 368.371451 368.371451 0 0 0 130.969098-74.50604 408.867137 408.867137 0 0 0 93.931922-119.747764 400.301176 400.301176 0 0 0 44.109803-160.283608c3.287843-56.751686-6.224314-114.512314-30.767686-165.993412a293.290667 293.290667 0 0 0-9.572392-18.379294 3.767216 3.767216 0 0 0-6.500392 3.799843z" fill="#FFFFFF" p-id="2616"></path><path d="M1378.105725 127.051294a816.549647 816.549647 0 0 1 71.019922 178.150902 860.446118 860.446118 0 0 1 14.639686 380.385882 813.462588 813.462588 0 0 1-57.198431 183.17804c-26.147137 58.094431-63.796706 119.306039-128.102902 139.64549a134.106353 134.106353 0 0 1-22.236863 4.971921c-4.778667 0.655059-2.745725 7.910902 2.002824 7.260863 66.519843-9.130667 112.742902-64.396549 141.733647-120.731608 29.992157-58.290196 51.350588-121.587451 65.556078-185.497098a867.20251 867.20251 0 0 0-2.961568-386.81349 829.279373 829.279373 0 0 0-66.585098-182.706196 793.833412 793.833412 0 0 0-11.366902-21.644549c-2.316549-4.259137-8.819451-0.461804-6.500393 3.799843z" fill="#FFFFFF" p-id="2617"></path><path d="M1063.253333 116.09851h-450.760784c-19.049412 0.025098-34.484706 15.460392-34.509804 34.509804v225.857255h69.37098a29.813961 29.813961 0 0 1 25.374118 14.029804l24.043922 38.274509 22.989804 36.567843 4.316862 6.876863 26.302745 41.838432 0.301177 0.476862h347.080784v-363.921568c-0.025098-19.049412-15.460392-34.484706-34.509804-34.509804z" fill="#CCCCCC" p-id="2618"></path><path d="M884.580392 185.143216h-223.347451a22.324706 22.324706 0 1 0 0 44.649411h223.347451a22.324706 22.324706 0 1 0 0-44.649411zM1008.439216 294.771451H663.265882c-13.460078 0-24.370196 10.912627-24.370196 24.370196 0 13.460078 10.910118 24.370196 24.370196 24.370196H1008.439216c13.457569 0 24.370196-10.910118 24.370196-24.370196 0-13.457569-10.912627-24.370196-24.370196-24.370196zM1030.475294 394.084392a24.355137 24.355137 0 0 0-22.036078-14.029804H663.265882c-0.527059 0-1.02902 0.025098-1.556078 0.050196a29.901804 29.901804 0 0 1 11.018039 10.390589l24.043922 38.274509H1008.439216a24.337569 24.337569 0 0 0 22.036078-34.68549zM1032.558431 486.420078a24.370196 24.370196 0 0 0-24.119215-21.082353H719.761569l4.316862 6.876863 26.302745 41.838432H1008.439216a24.094118 24.094118 0 0 0 14.130196-4.542745 24.345098 24.345098 0 0 0 9.989019-23.090197z" fill="#FFFFFF" p-id="2619"></path><path d="M1308.084706 310.608314l-35.137255-13.728628-175.184314-68.367059-209.593725-81.794509c-17.761882-6.891922-37.75498 1.884863-44.699608 19.626666l-7.328628 18.798432-17.443137 44.649411-25.349019 64.978824-19.024314 48.740392-14.255686 36.542745-19.024314 48.715294-14.280784 36.567843-0.401569 1.054118-2.283922 5.822745 26.302745 41.838432 0.301177 0.476862h487.178039a29.906824 29.906824 0 0 1 23.316079 11.14353l2.058039-5.220392 25.148235-64.401569 39.30353-100.718431c6.90949-17.761882-1.857255-37.76502-19.601569-44.724706z" fill="#4664FF" p-id="2620"></path><path d="M1116.536471 309.955765l-18.773334-7.328628-189.289412-73.863529a22.412549 22.412549 0 0 0-28.938039 12.67451 22.39749 22.39749 0 0 0 12.699608 28.938039l62.519216 24.395294 77.327059 30.167843 65.681568 25.650196 2.534902 0.978824a22.334745 22.334745 0 0 0 16.238432-41.612549zM1192.031373 457.130667l-94.268236-36.793726-67.287843-26.252549-35.940392-14.029804-93.615686-36.542745-30.418824-11.871372a24.370196 24.370196 0 0 0-30.694902 11.871372c-0.301176 0.627451-0.602353 1.28-0.853333 1.957647a24.355137 24.355137 0 0 0 13.829019 31.548235l7.780393 3.036863 124.787451 48.715294 112.414117 43.871373 76.54902 29.891765a24.166902 24.166902 0 0 0 8.83451 1.65647 24.360157 24.360157 0 0 0 8.884706-47.058823zM1097.763137 511.86949l-6.048627-2.359215-59.156079-23.090197-54.036078-21.082353-93.716078-36.567843-45.327059-17.694117a24.365176 24.365176 0 1 0-17.694118 45.402353l22.688627 8.859607 113.192157 44.17255 11.645491 4.542745 1.204705 0.476862h134.048628l-6.801569-2.660392zM868.793725 514.05302l-11.64549-4.542745-48.665098-18.999216a24.332549 24.332549 0 0 0-32.928627 18.999216 23.090196 23.090196 0 0 0-0.276079 4.542745 2.81098 2.81098 0 0 0 0.025098 0.476862h94.72l-1.229804-0.476862z" fill="#FFFFFF" p-id="2621"></path><path d="M969.311373 514.05302l-11.645491-4.542745h-182.111372a23.090196 23.090196 0 0 0-0.276079 4.542745h-24.897255l0.301177 0.476862h219.833725l-1.204705-0.476862z m0 0h-218.930197l0.301177 0.476862h219.833725l-1.204705-0.476862z m0 0h-218.930197l0.301177 0.476862h219.833725l-1.204705-0.476862z m1.204705 0.476862l-1.204705-0.476862h-218.930197l0.301177 0.476862h219.833725z m-439.240784 502.588236c-16.539608-0.025098-29.941961-13.427451-29.967059-29.967059v-580.693334c0.015059-16.547137 13.419922-29.962039 29.967059-29.992156h46.707451v-5.019608h-46.707451c-19.317961 0.037647-34.961569 15.696314-34.986667 35.011764v580.693334a35.011765 35.011765 0 0 0 20.505098 31.824314h442.177255c-0.401569-0.602353-0.803137-1.229804-1.204705-1.857255H531.275294z m731.959216-496.665098a34.831059 34.831059 0 0 0-25.374118-10.942745h-484.392157l-27.105882-43.118432-0.652549-1.054118-22.989804-36.567843-25.750588-40.96a35.07702 35.07702 0 0 0-29.615687-16.363921h-116.078431c-19.317961 0.037647-34.961569 15.696314-34.986667 35.011764v580.693334a35.011765 35.011765 0 0 0 20.505098 31.824314 34.509804 34.509804 0 0 0 14.481569 3.162352h706.585098a34.630275 34.630275 0 0 0 14.506667-3.162352 35.014275 35.014275 0 0 0 20.505098-31.824314v-442.62902c0-8.96251-3.445961-17.586196-9.637647-24.069019z m4.618039 466.698039c-0.027608 16.549647-13.44251 29.95451-29.992157 29.967059H531.275294c-16.539608-0.025098-29.941961-13.427451-29.967059-29.967059v-580.693334c0.015059-16.547137 13.419922-29.962039 29.967059-29.992156h116.078431a29.813961 29.813961 0 0 1 25.374118 14.029804l24.043922 38.274509 22.989804 36.567843 4.316862 6.876863 26.302745 41.838432 0.301177 0.476862h487.178039c16.557176 0.015059 29.977098 13.43498 29.992157 29.992157v442.62902z m-298.541176-473.098039h-218.930197l0.301177 0.476862h219.833725l-1.204705-0.476862z m0 0h-218.930197l0.301177 0.476862h219.833725l-1.204705-0.476862z m0 0h-218.930197l0.301177 0.476862h219.833725l-1.204705-0.476862z m0 0l-11.645491-4.542745h-204.197647l-27.105882-43.118432-2.283922 5.822745 26.302745 41.838432 0.301177 0.476862h219.833725l-1.204705-0.476862z" fill="#3F3D56" p-id="2622"></path><path d="M393.85851 722.246275l-14.376157 30.057411-122.772078-41.145725 21.215372-44.360785z" fill="#FFB8B8" p-id="2623"></path><path d="M359.29098 772.454902l29.06102-60.754824 36.495059 17.455687-45.178981 94.46149-2.790902-1.335216c-18.615216-8.902275-26.488471-31.211922-17.586196-49.827137z" fill="#2F2E41" p-id="2624"></path><path d="M422.799059 990.657255l-33.297569-1.124392-1.40298-129.616314 39.03498 2.304z" fill="#FFB8B8" p-id="2625"></path><path d="M362.945255 979.112157l67.310431 2.271372-1.365333 40.432942-104.651294-3.531295 0.102902-3.092078c0.697725-20.623059 17.980235-36.776157 38.603294-36.080941zM476.42102 448.198275s-101.910588-25.818353-148.108549 12.227764l-25.818353 74.734432L199.228235 681.913725l149.468863 89.682824 27.176157-67.940392-65.222275-32.612392 78.807844-67.940392-13.585569 358.726274 51.634196 8.151843s114.140863-442.970353 48.916078-521.780706z" fill="#2F2E41" p-id="2626"></path><path d="M321.807059 471.479216l1.244863-2.208628c13.093647-23.275922 10.970353-61.18149 6.886902-88.879686-3.420863-23.200627-3.320471-64.087843-2.630275-94.303373a44.902902 44.902902 0 0 1 35.792314-43.218823c31.003608-6.452706 69.064784-7.820549 88.992627-8.06149l0.015059 1.357804-0.015059-1.357804a20.693333 20.693333 0 0 1 20.768628 20.183843c0.607373 32.537098 0.419137 91.871373-7.654902 123.705725-11.984314 47.247059 6.753882 79.35498 6.944627 79.673726l1.129412 1.889882-151.471686 11.218824z" fill="#4664FF" p-id="2627"></path><path d="M269.387294 601.783216a25.160784 25.160784 0 0 0 9.562353-37.376l57.514667-248.013804h-43.482353l-50.758275 243.124706a25.298824 25.298824 0 0 0 27.163608 42.265098zM619.095843 357.652078l-95.979921-90.794666-25.941334 36.316863 64.853334 57.072941-85.049726 67.538823c-0.614902-0.042667-1.227294-0.092863-1.852235-0.092863a27.238902 27.238902 0 1 0 26.967843 30.860549l0.268549 0.26855 116.73349-101.170197z" fill="#FFB8B8" p-id="2628"></path><path d="M356.99451 246.053647s-59.934118-9.830902-65.370353 36.369569c-5.436235 46.200471-8.151843 46.200471-8.151843 46.20047s43.479843-8.154353 54.352313 2.715608c10.867451 10.872471 19.172392-85.283137 19.172393-85.283137zM446.529255 238.940863s48.916078-8.151843 70.656 13.588078c21.742431 21.742431 32.612392 27.176157 32.612392 27.176157s-48.916078 27.176157-29.891765 51.634196c0 0-51.636706-24.458039-59.788549-16.303686-8.154353 8.151843-13.588078-76.094745-13.588078-76.094745z" fill="#4664FF" p-id="2629"></path><path d="M403.624157 81.162039c-15.430275-12.323137-19.486118-36.106039-10.533647-53.707294C402.04549 9.85349 422.284549-0.750431 442.016627 0.042667c19.729569 0.790588 38.324706 12.119843 49.754353 28.220235 16.057725 22.620863 19.425882 54.058667 40.779295 71.765333 19.285333 15.99498 46.910745 15.535686 71.93349 14.265726 8.435451-0.429176 17.141961-0.928627 24.711529-4.675765 7.569569-3.747137 13.753725-11.65051 12.774902-20.040784 6.287059 9.951373 2.640314 23.903373-5.792627 32.115451-8.432941 8.209569-20.442353 11.65051-32.13302 13.020862a119.388863 119.388863 0 0 1-108.300549-47.518117c-8.70902-12.011922-15.425255-25.996549-27.371922-34.790902-11.946667-8.791843-31.86698-9.404235-39.203137 3.488627-3.624157 6.377412-3.270275 14.376157-6.605804 20.911687-3.335529 6.535529-14.167843 10.059294-17.377882 3.463529" fill="#2F2E41" p-id="2630"></path><path d="M401.264941 136.924863m-75.294117 0a75.294118 75.294118 0 1 0 150.588235 0 75.294118 75.294118 0 1 0-150.588235 0Z" fill="#2F2E41" p-id="2631"></path><path d="M400.810667 156.468706m-61.643294 0a61.643294 61.643294 0 1 0 123.286588 0 61.643294 61.643294 0 1 0-123.286588 0Z" fill="#FFB8B8" p-id="2632"></path><path d="M344.603608 111.194353c8.377725 1.832157 5.63451 15.887059 12.255372 21.338353 5.973333 4.919216 14.571922-0.140549 22.086275-1.970196 9.492078-2.30902 19.423373 1.074196 28.185098 5.391059 8.759216 4.316863 17.207216 9.672784 26.764549 11.683137 9.557333 2.012863 20.886588-0.25349 26.24502-8.420392 5.12251-7.80549 3.237647-18.336627-0.77051-26.772079a62.167843 62.167843 0 0 0-111.540706-1.546039" fill="#2F2E41" p-id="2633"></path><path d="M1797.019608 1021.485176c0 1.385412-1.124392 2.507294-2.509804 2.509804H2.509804a2.509804 2.509804 0 1 1 0-5.019607h1792c1.385412 0.00502 2.509804 1.126902 2.509804 2.509803z" fill="#3F3D56" p-id="2634"></path></svg>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <a-modal
            v-model:visible="adshow"
            :getContainer="()=>$refs.manageAdFeeds"
            class="adunits"
            :width="750"
            :title="$t('myApp.addAdUnit')"
            @ok="adUnit"
            >
            <adUnitSetting v-if="adshow" ref="adunits" @advertisingUnit="advertisingUnit" :compile="compile"></adUnitSetting>
        </a-modal>
    </div>
</template>
<style scoped>
    @import "../../assets/css/index.css";
</style>
<script>
import store from '@/store';
import { useI18n } from 'vue-i18n';
import { message} from 'ant-design-vue';
import {AppleOutlined,AndroidOutlined,ExclamationCircleOutlined,AppleFilled,AndroidFilled} from "@ant-design/icons-vue";
import adUnitSetting from "@/components/APP/adUnitSetting";
import Config from "@/utils/globalConfig";
let previousRouterName;
let selectUser;
export default {
    components: {
        AndroidOutlined,
        AppleOutlined,
        adUnitSetting,
        ExclamationCircleOutlined,
        AppleFilled,
        AndroidFilled
    },
    data(){
        return{
            list:[],
            adSourcesList:[],
            slelctAppName:{},
            adList:[],
            showList:false,
            adId:"",
            network_id:"",
            advertiser_id:"",
            adUnitShow:false,
            placement_id:"",
            name:"",
            partner_name:"",
            isEdit:false,
            adshow:false,
            compile:false,
            appId:'',
            index:'',
            imageUrl:'',
            features:{},
        }
    },
    beforeRouteEnter(to, from, next) {
        previousRouterName = from.name;
        console.log(previousRouterName);
        if (from.name === "home.newAdSoureces"||from.name === "home.editAdSoureces") {
        selectUser = from.params;
        console.log(selectUser,"sdrgwe");
        
        }
        next();
    },
    created(){

        store.dispatch("Util/Loading", true);
        this.$req.getUserInfo().then(res=>{
        
            if(res.data.code==200){
                res.data.data.feature_sets.map((_)=>{
                    _.features.map((item)=>{
                        this.features[item.name] = item.value
                    })
                });
                res.data.data.features.map((item) => {
                    this.features[item.name] = item.value
                });
            
                if (this.features.ALLOW_ACCESS_TO_MEDIATION) {
                
                    if(previousRouterName=="home.newAdSoureces"||previousRouterName=="home.editAdSoureces"){
                        console.log(selectUser);
                        this.app_id=selectUser.app_id;
                        this.placement_id=selectUser.placement_id;
                        this.isEdit=true;
                        this.network_id=selectUser.network_id;
                    }
                    this.imageUrl=Config.BASE_URL+'undraw_Empty_re_opql.svg';
                    this.index=0;
                    if(this.$route.query.network_id){
                        this.network_id=this.$route.query.network_id;
                        this.name=this.$route.query.name;
                        this.partner_name=this.$route.query.partner_name;
                    }
                    store.dispatch("Util/Loading", false);
                    this.getAppList();
                
                } else {
                    store.dispatch("Util/Loading", false);
                    this.$router.push("/getlogin/login")
                
                }
            }else {
                store.dispatch("Util/Loading", false);
            }
        })

        // if (store.state.User.userAccessControl.ALLOW_ACCESS_TO_MEDIATION) {
            
        //     if(previousRouterName=="home.newAdSoureces"){
        //         console.log(selectUser);
        //         this.app_id=selectUser.app_id;
        //         this.placement_id=selectUser.placement_id;
        //         this.isEdit=true;
        //         this.network_id=selectUser.network_id;
        //     }
        // } else {
        //     this.$router.push("/getlogin/login")
        // }
    
    },

    methods:{
        adUnit(){
            this.$refs.adunits.advertisingUnit();
        },
          // 获取所有APP
        getAppList(){
            store.dispatch("Util/Loading", true);
            this.$req.appNameList({network_id:this.network_id}).then(res=>{
                if(res.data.code === 200){
                    if(res.data.data.length){
                        this.adSourcesList= res.data.data;
                        this.adSourcesList.forEach(value => {
                            this.advertiser_id = value.advertiser_id;
                        });
                        this.appId=this.adSourcesList[0].app_id;
                        console.log(res.data.data);
                        console.log(this.appId);
                        this.SelectedDefault()
                        
                    } else{
                        this.adSourcesList = []
                    }
                    store.dispatch("Util/Loading", false);
                }else{
                    store.dispatch("Util/Loading", false);
                    message.error("获取app列表失败");
                }
            })
        },
        //第一次进入页面默认选中广告单元
        SelectedDefault(){
            if(this.isEdit){
                let indexs;
                console.log(this.adSourcesList);
                
                this.adSourcesList.forEach((val,index)=>{
                    if(val.app_id==this.app_id){
                        indexs=index;
                    }
                })
                this.$nextTick(()=>{
                    var one=document.querySelector(".adSources").children[indexs+1];
                    console.log(one,this.app_id);
                    
                    one.click();
                })
            }else{
                this.$nextTick(()=>{
                    console.log("23");
                    var demos=document.querySelector(".adSources").children[1];
                    // demos.classList.add("selectStyle");
                    demos.click();
                })
                
                
            }
        },
        //自已选择应用时默认选中广告单元
        defaultSelectAd(){
            if(this.isEdit){
                if(this.adList.length){
                    let i;
                    this.adList.forEach((val,index)=>{
                        if(val.placement_id==this.placement_id){
                            i=index;
                        }
                    });
                    this.$nextTick(()=>{
                        var adPlacement=document.querySelector(".adUnitList").children[i];
                        console.log(adPlacement);
                        adPlacement.click();
                    });
                }
                
            }else{
                if(this.adList.length){
                    this.$nextTick(()=>{
                        var adPlacement=document.querySelector(".adUnitList").children[0];
                        console.log(adPlacement);
                        adPlacement.click();
                    })
                }
            }
        },
        //选中应用
        openAdList(e){
            this.appId=e[0];
            this.index=e[1];
            var a=e[1]+1;
            var parents=document.querySelector(".adSources").children;
            for(var i=0;i<parents.length;i++){
                parents[i].classList.remove("selectStyle")
            }
            var parent=document.querySelector(".adSources").children[a];
            console.log(parent);
            parent.classList.add("selectStyle");
            var parents=document.querySelector(".adUnitList").children;
            for(var i=0;i<parents.length;i++){
                parents[i].classList.remove("selectStyle")
            }
            if(e[0]!=this.adId){
                this.adId=e[0];
                this.showList=false;
            }
            let arr =this.adSourcesList.filter(
                (item)=>{
                    return item.app_id==e[0]
                }
            )
            console.log(arr);
            
            this.slelctAppName=arr[0];
            // console.log(arr);
            // this.adList=arr[0].children;
            // console.log(this.adList);
            store.dispatch("Util/Loading", true);
            this.$req.AppPlacement({network_id:this.network_id,app_id:e[0],page:1,num_elements:10,no_paginate:1}).then(res => {
                if (res.data.code == 200) {
                    store.dispatch("Util/Loading", false);
                    this.adList = res.data.data.placement_list.length
                    ? res.data.data.placement_list
                    : [];
                    this.adUnitShow=true;
                    // this.placementTotal = res.data.data.total;
                    this.defaultSelectAd();
                    console.log(this.adList);
                } else {
                    store.dispatch("Util/Loading", false);
                }
            })
        },
        //选中广告单元并获取广告单元下的广告源列表
        expandList(e){
            this.showList=true;
            this.placement_id=e[0];
            var a=e[1]+1;
            var parents=document.querySelector(".adUnitList").children;
            for(var i=0;i<parents.length;i++){
                parents[i].classList.remove("selectStyle")
            }
            var parent=document.querySelector(`.adUnitListItem:nth-child(${a})`);
            parent.classList.add("selectStyle");
            store.dispatch("Util/Loading", true);
            let opt={
                placement_id:e[0],
                network_id:this.network_id
            }
            this.$req.getPlacementAdSources(opt).then(res=>{
                console.log(res);
                if(res.data.code==200){
                    if(res.data.data.length){
                        this.list=res.data.data;
                    }else{
                        this.list=[];
                    }
                    
                    store.dispatch("Util/Loading", false);
                }else {
                    message.error("获取数据失败");
                    store.dispatch("Util/Loading", false);
                }
            })
        },
        //删除广告源
        delMediationBids(e){
            store.dispatch("Util/Loading", true);
            this.$req.delMediationBid({mediation_bid_id:e}).then(res=>{
                if(res.data.code==200){
                    store.dispatch("Util/Loading", false);
                    message.success(this.$t('adPlatform.deleteSuccessful'));
                    let opt={
                            placement_id:this.placement_id,
                            network_id:this.network_id
                        }
                        this.getAppList();
                        this.$req
                        .AppPlacement({network_id:this.network_id,app_id:this.adId,page:1,num_elements:10,no_paginate:1})
                        .then(res => {
                            if (res.data.code == 200) {
                                store.dispatch("Util/Loading", false);
                                this.adList = res.data.data.placement_list.length
                                ? res.data.data.placement_list
                                : [];
                                console.log(this.adList);
                            } else {
                                store.dispatch("Util/Loading", false);
                            }
                        })
                        this.$req.getPlacementAdSources(opt).then(res=>{
                            console.log(res);
                            if(res.data.code==200){
                                if(res.data.data.length){
                                    this.list=res.data.data;
                                }else{
                                    this.list=[];
                                }
                                store.dispatch("Util/Loading", false);
                            }else {
                                message.error(this.$t('adPlatform.unknownError'));
                                store.dispatch("Util/Loading", false);
                            }
                    })
                }else{
                    message.error(this.$t('adPlatform.unknownError'));
                    store.dispatch("Util/Loading", false);
                }
            })
            /* this.$confirm({
                title: this.$t('adPlatform.deleteAdSoureces'),
                content: this.$t('adPlatform.deleteAdUnitContent'),
                cancelText:this.$t('adPlatform.cancel'),
                okText:this.$t('adPlatform.enter'),
                icon: <ExclamationCircleOutlined  />,
                onOk:()=> {
                    
                },
                onCancel:()=> {
                    
                },
            }); */
        },
        //跳转到编辑广告源
        goEditBids(e){
            this.$router.push({path:"/hl/EidtAdSource",query:{
                close:3,
                placement_id:this.placement_id,
                app_id:this.adId,
                adSource_id:e,
                network_id:this.network_id,
                newAdSource:0,
                isManAd:1,
            }})
        },
        //跳转到新建广告源
        addSources(){
            this.$router.push({path:"/hl/newAdSource",query:{
                close:3,
                placement_id:this.placement_id,
                app_id:this.adId,
                network_id:this.network_id,
                isSources:true,
                newAdSource:1,
                isManAd:1,
            }})
        },
        //添加广告单元
        advertisingUnit(e) {
            store.dispatch("Util/Loading", true);
            
            console.log(e);
            let opt = {
                app_id: this.appId,
                media_type: e.adTypen == 1 ? "banner" :e.adTypen==2?"other":e.adTypen==3?"interstitial":"stimulate",
                name: e.adName.trim(),
                width:e.adTypen == 1?e.placementWidth:"",
                height:e.adTypen == 1?e.placementHeight:"",
                add_size:e.addSizeList?1:0,
                state: e.active == 1 ? "active" : "inactive",
                placement_imps: e.count_radio == 1 ? 0 : e.count.trim(),
                placement_usage: e.count_radio == 2 && e.constant ? 1 : 0,
                language_ids: e.language_id.join(","),
                premium_user_type: e.paid == "全部" ? 2 : e.paid == "付费" ? 1 : 0
            };
            this.$req.Addplacement(opt).then(res => {
                if (res.data.code == 200) {
                message.success(this.$t("myApp.addSuccessful"));
                this.adshow = false;
                store.dispatch("Util/Loading", false);
            
                this.openAdList([this.appId,this.index]);

                } else {
                    message.success(this.$t("myApp.addFailed"));
                    store.dispatch("Util/Loading", false);
                }
            })
            .catch(err => {
                store.dispatch("Util/Loading", false);
            });
        }
    }
}
</script>
<style>
    .manageAdFeeds .div-empty{
        width: 430px;
        margin: 0 auto;
    }
    .manageAdFeeds .text-empty{
        height: 30px;
        line-height: 30px;
        text-align: center;
    }

    /* .manageAdFeeds .sourcesList p{
        margin: 0 !important;
    } */

    .manageAdFeeds .ant-empty-description{
        margin: 0 !important;
    }

</style>
<style lang="less" scoped>
    .manageAdFeeds{
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        .adFeeds{
            display: flex;
            border: 1px solid #ccc;
            border-radius: 10px;
            max-height: 700px;
            .adSources{
                width: 250px;
                min-height: 400px;
                border-right: 1px solid #ccc;
                max-height: 700px;
                overflow-y: auto;
                overflow-x: hidden;
                &::-webkit-scrollbar-thumb{
                    border-radius: 5px;
                }
                .adHeads{
                    height: 40px;
                    display: flex;
                    // justify-content: center;
                    padding: 10px;
                    font-size: 18px;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                }
                .adSourcesItem{
                    display: flex;
                    padding: 10px;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 16px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    /deep/.ant-image{
                        margin-right: 10px;
                        border-radius: 5px;
                        overflow: hidden;
                    }
                    .appNames{
                        display: inline-block;
                        width: 150px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    div{
                        display: flex;
                        align-items: center;
                        .point{
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            background: #70b603;
                        }
                    }
                    
                }
                
            }
            .rights{
                flex: 1;
                .rightHaeds{
                    display: flex;
                    padding: 10px;
                    align-items: center;
                    font-size: 16px;
                    border-bottom: 1px solid #eee;
                    /deep/.ant-image{
                        margin-right: 10px;
                        border-radius: 5px;
                        overflow: hidden;
                    }
                }
                .mins{
                    overflow:hidden; //超出的隐藏
                    text-overflow:ellipsis;//省略号
                    white-space:nowrap;//强制一行显示
                }
                .footers{
                    display: flex;
                    min-height: 397px;
                    height: 647px;
                    // .adUnitList::-webkit-scrollbar{
                    //     width: 10px;
                    // }
                    .adUnitList{
                        border-right: 1px solid #ccc;
                        width: 250px;
                        height: 647px;
                        overflow-y: auto;
                        overflow-x: hidden;
                        max-width: 250px;
                        .adUnitListItem{
                            display: flex;
                            position: relative;
                            flex-direction: column;
                            width: 100%;
                            justify-content: space-around;
                            height: 51px;
                            padding: 0 10px;
                            border-bottom: 1px solid #eee;
                            cursor: pointer;
                            p{
                                margin-bottom: 0;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .points{
                                position: absolute;
                                right: 5px;
                                top: 20;
                                display: flex;
                                align-items: center;
                                .point{
                                    display: inline-block;
                                    width: 10px;
                                    height: 10px;
                                    border-radius: 50%;
                                    background: #70b603;
                                }
                            }
                        }
                    }
                    .sourcesList{
                        padding: 10px;
                        flex: 1;
                        max-height: 647px;
                        overflow-y: auto;
                        overflow-x: hidden;
                        max-width: 1048px;
                        .create_Sources{
                            margin-bottom: 16px;
                        }
                        /deep/.el-table {
                            
                            margin-bottom: 0!important;
                            .purple{
                                margin-right: 0;
                            }
                        
                        }
                    }
                }
                
            }
            .selectStyle{
                background-color: #eee;
            }
            
        }
        .adunits {
            .ant-modal-content {
                border-radius: 10px !important;
                .ant-modal-header {
                    border-top-left-radius: 10px !important;
                    border-top-right-radius: 10px !important;
                }
            }
        }
    }
</style>