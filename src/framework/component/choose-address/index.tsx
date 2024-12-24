import { Cascader, Modal, Select, Space, Tooltip } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { useTheme } from "styled-components";
import { useCascaderAreaData } from "@vant/area-data";

import * as AmapComponent from "src/util/amap/component";
import useWather from "src/hooks/use-wather";
import intervalQuery from "src/util/interval-query";
import getAmap from "src/util/amap";

const area = useCascaderAreaData();

type Area = (typeof area)[number];

type Value = {
  province: string;
  city: string;
  county: string;
  provinceCode: string;
  cityCode: string;
  countyCode: string;
  latitude: number;
  longitude: number;
  address: string;
};

type Ref = {
  choose: (
    value?: Pick<
      Value,
      "address" | "city" | "county" | "province" | "latitude" | "longitude"
    >
  ) => Promise<Value>;
};

type AddressListItem = {
  lat: number;
  lng: number;
  name: string;
  address: string;
  id: string;
};

export function createRef() {
  return useRef<Ref>(null);
}

const ChooseAddress = forwardRef<Ref, StyledWrapComponents>(function (
  props,
  ref
) {
  const { className } = props;
  const theme = useTheme();
  const mapCom = AmapComponent.createRef();
  const promiseResolver = useRef<{
    resolve: (value: Value | PromiseLike<Value>) => void;
    reject: (reason?: unknown) => void;
  }>({ resolve() {}, reject() {} });

  const [open] = useWather();
  const [district, setDistrict] = useState<Area[]>();
  const [map, setMap] = useState<AMap.Map>();
  const [placeSearch, setPlaceSearch] = useState<AMap.PlaceSearch>();
  const timer = useRef<NodeJS.Timeout>();
  const [addressList, setAddressList] = useState<AddressListItem[]>([]);
  const [currentAddress, setCurrentAddress] = useState<AddressListItem>();

  useImperativeHandle(ref, () => ({
    choose(inputAddress) {
      return new Promise((resolve, reject) => {
        promiseResolver.current = { reject, resolve };
        open.setTrue();

        intervalQuery({
          condition() {
            return Boolean(mapCom.current);
          },
          onSuccess() {
            mapCom.current?.getMap().then((map) => {
              setMap(map);
              if (inputAddress) {
                const addressItem: AddressListItem = {
                  id: "1",
                  lat: inputAddress.latitude,
                  lng: inputAddress.longitude,
                  name: inputAddress.address,
                  address: inputAddress.address,
                };
                const lnglat = new AMap.LngLat(
                  inputAddress.longitude,
                  inputAddress.latitude
                );
                const marker = new AMap.Marker({ position: lnglat });
                map.add(marker);
                map.setCenter(lnglat);
                map.setZoom(14);
                setCurrentAddress(addressItem);
                setAddressList([addressItem]);
                setDistrict(
                  [
                    inputAddress.province,
                    inputAddress.city,
                    inputAddress.county,
                  ].map((item) => ({ text: item, value: item }))
                );
              }
            });
          },
        });
      });
    },
  }));

  useEffect(() => {
    if (map) {
      getAmap().then((Amap) => {
        const geocoder = new Amap.Geocoder({ extensions: "base" });
        map.on("click", async (event) => {
          const lnglat = new AMap.LngLat(event.lnglat.lng, event.lnglat.lat);
          geocoder.getAddress(lnglat, (result, data) => {
            if (result === "complete" && typeof data !== "string") {
              const {
                regeocode: { addressComponent, formattedAddress },
              } = data;
              const { adcode } = addressComponent;
              const provinceCode = `${adcode.slice(0, 2)}0000`;
              const cityCode = `${adcode.slice(0, 4)}00`;
              const areaCode = adcode;
              const province = area.find((i) => i.value === provinceCode);
              const city = province?.children?.find(
                (i) => i.value === cityCode
              );
              const areaData = city?.children?.find(
                (i) => i.value === areaCode
              );
              if (province && city && areaData) {
                setDistrict([province, city, areaData]);
                const address: AddressListItem = {
                  address: formattedAddress,
                  id: formattedAddress,
                  name: formattedAddress,
                  lat: event.lnglat.lat,
                  lng: event.lnglat.lng,
                };
                setCurrentAddress(address);
                setAddressList([address]);
                map.clearMap();
                const marker = new AMap.Marker({ position: lnglat });
                map.add(marker);
                map.setCenter(lnglat);
                map.setZoom(14);
              }
            }
          });
        });
      });
    }
  }, [map]);

  function onOk() {
    promiseResolver.current.resolve({
      province: district![0].text,
      city: district![1].text,
      county: district![2].text,
      provinceCode: district![0].value,
      cityCode: district![1].value,
      countyCode: district![2].value,
      latitude: currentAddress!.lat,
      longitude: currentAddress!.lng,
      address: currentAddress!.address,
    });
    open.setFalse();
  }

  return (
    <Modal
      open={open.whether}
      title="搜索地址"
      width="90%"
      styles={{ body: { height: "70vh", position: "relative" } }}
      className={className}
      centered
      okButtonProps={{ disabled: !district || !currentAddress }}
      onCancel={() => {
        promiseResolver.current.reject();
        open.setFalse();
      }}
      onOk={onOk}
    >
      <AmapComponent.default ref={mapCom} className="map" />
      {map && (
        <Space className="search">
          <Cascader<Area>
            value={district?.map((i) => i.text)}
            options={area}
            fieldNames={{ label: "text", value: "text" }}
            showSearch
            allowClear={false}
            placeholder="请先选择省市区"
            style={{ width: 300 }}
            onChange={async (_, option) => {
              setDistrict(option);
              setCurrentAddress(undefined);
              const Amap = await getAmap();
              const geocoder = new Amap.Geocoder({ extensions: "base" });
              setPlaceSearch(
                new Amap.PlaceSearch({
                  city: option[option.length - 1].value,
                  pageSize: 20,
                  /** @ts-ignore */
                  citylimit: true,
                })
              );
              geocoder.getLocation(
                `${option[0].text}${option[1].text}${option[2].text}`,
                function (result, data) {
                  if (
                    result === "complete" &&
                    typeof data !== "string" &&
                    data.geocodes[0]
                  ) {
                    const ln = new AMap.LngLat(
                      data.geocodes[0].location.getLng(),
                      data.geocodes[0].location.getLat()
                    );
                    const marker = new AMap.Marker({ position: ln });
                    map.clearMap();
                    map.add(marker);
                    map.setCenter(ln);
                    map.setZoom(14);
                  }
                }
              );
            }}
          />

          {district && (
            <Tooltip title="您也可以点击地图尝试自动获取地址">
              <Select
                showSearch
                filterOption={false}
                style={{ width: 300 }}
                placeholder="请搜索地址后选择"
                options={addressList}
                value={currentAddress?.id}
                fieldNames={{ label: "address", value: "id" }}
                optionRender={(option) => {
                  return (
                    <div>
                      <div
                        style={{
                          fontSize: theme.fontSizeHeading5,
                        }}
                      >
                        {option.data.address}
                      </div>
                      <div
                        style={{
                          color: theme.colorTextPlaceholder,
                          fontWeight: "normal",
                        }}
                      >
                        {option.data.name}
                      </div>
                    </div>
                  );
                }}
                onSearch={(value) => {
                  if (timer.current) clearTimeout(timer.current);
                  timer.current = setTimeout(() => {
                    placeSearch?.search(value, (result, data) => {
                      if (
                        result === "complete" &&
                        typeof data !== "string" &&
                        data !== 0 &&
                        data.poiList
                      ) {
                        setAddressList(
                          data.poiList.pois.map((poi: any) => ({
                            lat: poi.location.lat,
                            lng: poi.location.lng,
                            name: poi.name,
                            address: poi.address,
                            id: poi.id,
                          }))
                        );
                      }
                    });
                  }, 300);
                }}
                onChange={function (_, option) {
                  if (!(option instanceof Array)) {
                    setCurrentAddress(option);
                    if (option) {
                      const ln = new AMap.LngLat(
                        Number(option.lng),
                        Number(option.lat)
                      );
                      const marker = new AMap.Marker({ position: ln });
                      map.clearMap();
                      map.add(marker);
                      map.setCenter(ln);
                      map.setZoom(14);
                    }
                  }
                }}
              />
            </Tooltip>
          )}
        </Space>
      )}
    </Modal>
  );
});

export default styled(ChooseAddress)`
  .map {
    height: 100%;
  }

  .search {
    position: absolute;
    top: ${(props) => props.theme.padding}px;
    left: ${(props) => props.theme.padding}px;
  }
`;
