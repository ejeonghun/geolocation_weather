// 페이지 로딩이 완료되면 날씨 데이터를 가져옵니다.

window.onload = getLocation

let globalLatitude = null;  // 경도 글로벌 변수 지정
let globalLongitude = null; // 위도 글로벌 변수 지정
let address = null; // 주소값 저장 글로벌 변수 지정

let defaultPosition = { // 디폴트 위치값
      coords: {
        latitude: 37.5665,
        longitude: 126.9780
      }
    };

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else { 
    alert("위치값을 알수 없습니다. ");
  }
}

function showError(error) { // 위치 오류 발생시 서울특별시가 디폴트값으로 되게 설정
  switch(error.code) {
    case error.PERMISSION_DENIED:
       alert("사용자가 위치 접근을 거부했습니다.");
       showPosition(defaultPosition);
       break;
     case error.POSITION_UNAVAILABLE:
       alert("위치 정보를 가져올 수 없습니다.");
       showPosition(defaultPosition);
       break;
     case error.TIMEOUT:
       alert("요청 시간이 초과되었습니다.");
       showPosition(defaultPosition);
       break;
     case error.UNKNOWN_ERROR:
       alert("알 수 없는 오류가 발생했습니다.");
       showPosition(defaultPosition);
       break;
  }
}


function showPosition(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;
    globalLatitude = position.coords.latitude; // 글로벌 변수에 저장
    globalLongitude = position.coords.longitude;
    
    let gridResult = gridXY(position.coords.latitude, position.coords.longitude);
    console.log(gridResult.x, gridResult.y);

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    var callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {

            console.log('지역 명칭 : ' + result[0].address_name);
            console.log('행정구역 코드 : ' + result[0].code);
            address = result[0].address_name;
            var x = document.getElementById('text')
            x.innerHTML = `${address}`;
        }
    };
    geocoder.coord2RegionCode(position.coords.longitude, position.coords.latitude, callback);
    }



function gridXY(v1, v2) {  // 기상청 GridXY(격자값) 계산 수식
    const RE = 6371.00877; // 지구 반경(km)
    const GRID = 5.0;      // 격자 간격(km)
    const SLAT1 = 30.0;    // 투영 위도1(degree)
    const SLAT2 = 60.0;    // 투영 위도2(degree)
    const OLON = 126.0;    // 기준점 경도(degree)
    const OLAT = 38.0;     // 기준점 위도(degree)
    const XO = 43;         // 기준점 X좌표(GRID)
    const YO = 136;        // 기1준점 Y좌표(GRID)

    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);

    const rs = {};

    let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = re * sf / Math.pow(ra, sn);

    let theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) {
        theta -= 2.0 * Math.PI;
    }
    if (theta < -Math.PI) {
        theta += 2.0 * Math.PI;
    }
    theta *= sn;
    rs.x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs.y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    fetchWeatherData(rs.x, rs.y);
    return rs;
}

// 카카오맵 호출 
function kakaomap(lat,lon) {
  var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(lat, lon), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };
    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption); 
  }


function fetchWeatherData(nx, ny) {
    // 현재 날짜와 시간을 가져옵니다.
    let now = new Date();
    let skyIcon = document.getElementById('sky-icon');
    skyIcon.style.opacity = 0;
    // 한시간 전의 날짜와 시간을 가져오기 위해 현재 시간에서 1시간을 빼줍니다.
    now.setTime(now.getTime() - 3600000);

     // YYYYMMDD 형식으로 날짜를 구성합니다.
     let base_date = now.getFullYear().toString() + 
                     ("0" + (now.getMonth() + 1)).slice(-2) +
                     ("0" + now.getDate()).slice(-2);

     // HHMM 형식으로 시간을 구성합니다. 
     let base_time = ("0" + now.getHours()).slice(-2) +
                     "00";


   // API URL과 파라미터를 설정합니다.
   let url = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
   
   let params = {
       serviceKey: '7BIm4TSfmVaCP5o6rBTCBk9V98up3uLnkugC7ePeZBUtLQ5frrZOjh9U2s/5utbR+MTfuZJGCLnswbs7wt+u0A==',
       pageNo: 1,
       numOfRows: 60,
       dataType: 'XML',
       base_date: base_date,
       base_time: base_time,
       nx: nx,
       ny: ny
   };

   // Fetch API를 사용하여 요청을 보냅니다.
   fetch(url + '?' + new URLSearchParams(params))
   .then(response => response.text())
   .then(data => {
            // XML 파서를 생성합니다.
            let parser = new DOMParser();
            
            // XML 데이터를 파싱하여 DOM 객체로 변환합니다.
            let xmlDoc = parser.parseFromString(data, "text/xml");
            // document.getElementById('weather_box').style.opacity = 1;
            // 각 항목을 찾아서 값을 가져옵니다.
            let items = xmlDoc.getElementsByTagName('item');
            skyIcon.style.opacity = 0;
            // 현재 시간의 정각으로 변경 
            let hour = String(Math.floor((Number(base_time) + 100) / 100));
            let minute = String((Number(base_time) + 100) % 100);

            hour = hour.padStart(2, '0');
            minute = minute.padStart(2, '0');

            let time = hour + ":" + minute;
            document.getElementById('fcstTime').innerHTML = time + '시 예보';

            for(let i = 0; i < items.length; i++) {
                let fcstTime = items[i].getElementsByTagName('fcstTime')[0].childNodes[0].nodeValue;
            
                if(fcstTime == (Number(base_time) + 100)){
                    let category = items[i].getElementsByTagName('category')[0].childNodes[0].nodeValue;
                    let fcstValue = items[i].getElementsByTagName('fcstValue')[0].childNodes[0].nodeValue;
                
                switch(category) {
                    case 'T1H':
                        document.getElementById('temperature').innerText = fcstValue + '℃';
                        break;
                    case 'SKY':
                    let skyStatus;
                    switch(fcstValue) {
                        case '1':
                            skyStatus = '맑음';
                            skyIcon.src = './animated/day.svg';
                            skyIcon.style.opacity = 0;
                            skyIcon.style.opacity = 1;
                            break;
                        case '3':
                            skyStatus ='구름많음';
                            skyIcon.src = './animated/cloudy.svg';
                            skyIcon.style.opacity = 0;
                            skyIcon.style.opacity = 1;
                            break;
                        case '4':
                            skyStatus ='흐림';
                            skyIcon.src = './animated/cloudy-day-1.svg';
                            skyIcon.style.opacity = 1;
                            break;
                        default:
                            skyStatus ='정보 없음';   
                        }
                        
                        
                        document.getElementById('sky').innerText = skyStatus;
                        break;
                    case 'REH':
                        document.getElementById('humidity').innerText = fcstValue + '%';
                        break;
                    case 'PTY':
                        if (fcstValue == '0' | 'null') {
                            fcstValue = '0mm';
                        }
                        else if (fcstValue < 1.0) {
                            fcstValue = '1.0mm미만'
                        }
                        else if (fcstValue >= 1.0 && fcstValue < 30.0) {
                            fcstValue = '1.0 ~ 29.0mm'
                        }
                        else if (fcstValue >= 30.0 && fcstValue < 50.0) {
                            fcstValue = '30.0 ~ 50.0mm'
                        }
                        else {
                            fcstValue = '50.0mm 이상'
                        }
                        document.getElementById('precipitation_type').innerText = fcstValue;
                        break;
                    case 'WSD':
                        document.getElementById('wind_speed').innerText =fcstValue + 'm/s'; 
                }
            }
        }})
        .catch(error => console.error('Error:', error));
    }

    // 모달창
    document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('location_more').addEventListener('click', function() {
        document.getElementById('location').style.display = 'block';
        kakaomap(globalLatitude, globalLongitude);
    });

    document.getElementById('closeBtn').addEventListener('click', function() {
        document.getElementById('location').style.display = 'none';
    });
});