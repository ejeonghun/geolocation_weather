# geolocation_weather

### [Go Site](http://main.lunaweb.dev/geolocation_weather).

## 사용된 기술 및 설명

이 웹 애플리케이션은 사용자의 현재 위치를 바탕으로 날씨 정보를 제공합니다. 주요 기능은 다음과 같습니다:

1. **위치 정보 가져오기:** HTML5 Geolocation API를 이용하여 사용자의 현재 위치(위도와 경도)를 가져옵니다.
2. **날씨 정보 가져오기:** 위도와 경도 값을 이용하여, 한국 기상청에서 제공하는 날씨 예보 API로부터 최신 날씨 데이터를 가져옵니다.
3. **지역 이름 가져오기:** Kakao Map API의 `coord2RegionCode` 함수를 이용하여 위도와 경도에 해당하는 지역 이름을 가져옵니다.
4. **지도 표시하기:** Kakao Map API를 이용하여 사용자의 현재 위치에 대한 지도를 표시합니다.

사용된 기술(API)
- 공공데이터 기상청 API: 사용자의 위치의 현재 시간의 날씨 정보 접근 및 표시 
- HTML5 Geolocation API: 사용자의 현재 위치 정보 접근
- Kakao Map API: 지역 이름 조회 및 지도 표시

## 작동 방식

1. 페이지가 로드되면, 브라우저는 사용자에게 위치 정보 접근 권한을 요청합니다.
2. 권한이 허용되면, 애플리케이션은 HTML5 Geolocation API로부터 위도와 경도 값을 받아옵니다.
3. 받아온 위경도 값으로 기상청 날씨 예보 데이터와 카카오맵에서 해당 위치의 주소명을 받아 옵니다.
4. 받아온 데이터는 화면에 각각 출력됩니다.

---

## Technologies Used and Description

This web application provides weather information based on the user's current location. The main features are as follows:

1. **Getting Location Information:** Uses the HTML5 Geolocation API to get the user's current location (latitude and longitude).
2. **Fetching Weather Information:** Uses latitude and longitude values to fetch the latest weather data from a weather forecast API provided by the Korea Meteorological Administration.
3. **Fetching Region Name:** Uses `coord2RegionCode` function of Kakao Map API to get the region name corresponding to latitude and longitude values.
4. **Displaying a map:** Uses Kakao Map API to display a map of user's current location.

Technology used (API)
- Public Data Meteorological Administration API: Accessing and displaying weather information at the current time of the user's location
- HTML5 Geolocation API: Accessing user's current location information
- Kakao Map API: Region name lookup and map display

## Operation

1. When the page loads, the browser requests access to location information from the user.
2. If permission is granted, the application obtains latitude and longitude values from HTML5 Geolocation API.
3. The obtained latitude and longitude values are used to fetch weather forecast data from Korea Meteorological Administration and region name from Kakao Map.
4. The fetched data is displayed on screen respectively.
