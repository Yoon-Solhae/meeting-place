var mapCount = 1;

async function getHistoryDb() {
  const res = await fetch("list", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json();
  return data;
}

async function load() {
  const db = await getHistoryDb();
  for (var i = 0; i < db.length; i++) {
    $('#appointment_list').append(`<li id="list${i + 1}">약속${i + 1} - ${db[i].place_name}, ${db[i].addr}
    <input type="button" value="상세 정보" onclick="popUpDetail(list${i+1});" /><div id="detail${i + 1}"></div></li><br>`);
  }
}

async function popUpDetail(list) {
  const db = await getHistoryDb();

  list.innerHTML += '<div id="' + list.id + '_map" style="width:300px; height:300px; position:relative; overflow:hidden; display:inline-block;"></div>';
  var mapContainer = document.getElementById(list.id + '_map'), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(db[parseInt(list.id.substring(4)-1)].lat, db[parseInt(list.id.substring(4)-1)].lng), // 지도의 중심좌표
      draggable: false,
      level: 3 // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);
  var iwContent = '<div style="padding:5px; text-align:center;">' + db[parseInt(list.id.substring(4)-1)].place_name + '</div>';

  var markerPosition = new kakao.maps.LatLng(db[parseInt(list.id.substring(4)-1)].lat, db[parseInt(list.id.substring(4)-1)].lng);
  var marker = new kakao.maps.Marker({
    position: markerPosition
  }),
    infowindow = new kakao.maps.InfoWindow({
      position: markerPosition,
      content: iwContent,
      zIndex: 1,
      disableAutoPan: true
    });

  marker.setMap(map);
  infowindow.open(map, marker);

  var addr = document.createElement('div');

  addr.setAttribute("id", "addr");
  addr.innerHTML = db[parseInt(list.id.substring(4)-1)].addr;

  document.getElementById(list.id).appendChild(addr);

  var users = document.createElement('div');

  users.setAttribute("id", "users");

  for(var i = 1; i <= (((db[parseInt(list.id.substring(4)-1)].starting_position).split(",")).length)/2; i++) {
    users.innerHTML += "user" + i + "&nbsp; <input type='button' value='경로 안내' onclick='location.href=nav' /><br>";
  }

  document.getElementById(list.id).appendChild(users);
}
