import { load } from "@amap/amap-jsapi-loader";



const amap =  {
    getAmap(): Promise<typeof AMap> {
      window._AMapSecurityConfig = {
        securityJsCode: "87d3a0c6620d7bbb775f7dde55094679",
      };
      if (window.AMap) return Promise.resolve(AMap);
      return load({
        key: "87d3a0c6620d7bbb775f7dde55094679",
        version: "2.0", // 指定要加载的 JS API 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Geocoder", "AMap.PlaceSearch"],
      }).catch((err) => {
        console.log(err);
        return Promise.reject(err);
      });
    },
    getPlaceSearch() {
      return amap.getAmap().then((amp) => amp.PlaceSearch);
    },
  };

export default amap;
