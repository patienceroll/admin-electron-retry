import { load } from "@amap/amap-jsapi-loader";

export default function getAmap(): Promise<typeof AMap> {
  window._AMapSecurityConfig = {
    securityJsCode: "c3794c90148bdeed21532ec1bb6ce41d",
  };
  if (window.AMap) return Promise.resolve(AMap);
  return load({
    key: "feffae38407aba4311972f3a540c280c",
    version: "2.0", // 指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Geocoder", "AMap.PlaceSearch"],
  }).catch((err) => {
    console.log(err);
    return Promise.reject(err);
  });
}
