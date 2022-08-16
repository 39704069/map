import "./App.css";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker, Popup, useMapEvents, Polygon, Rectangle } from "react-leaflet";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { setOptions } from "leaflet";
import { marker } from "leaflet";
import L from "leaflet";

function App() {
  const [position, setPosition] = useState();
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState([]);
  const [btn, setbtn] = useState("add");
  const [edit, setEdit] = useState();
  const [edit2, setEdit2] = useState();
  const purpleOptions = { color: "purple" };

  const center = {
    lat: 51.505,
    lng: -0.09,
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(i) {
        map.locate();
        setPosition(() => i.latlng);
        markers.push(i.latlng);
        function compare(a, b) {
          if (a.lng > b.lng) {
            if (a.lat < b.lat) {
              return -1;
            }
            if (a.lat > b.lat) {
              return 1;
            }
          }
          if (a.lat > b.lat) {
            if (a.lng < b.lng) {
              return -1;
            }
          }
          return 0;
        }
        markers.sort(compare);

        console.log(markers);
      },

      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          let marker = markerRef.current;
          if (marker != null) {
            setPosition(() => marker.getLatLng());
            console.log(edit2);
            markers[edit2] = marker.getLatLng();
          }
        },
      }),
      []
    );

    return position === null
      ? null
      : markers.map((i, index) => {
          return btn === "add" ? (
            <Marker position={i}>
              <Popup>You are here</Popup>
            </Marker>
          ) : (
            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={i}
              ref={markerRef}
              dragend={setEdit2(index)}
            ></Marker>
          );
        });
  }

  const Add = async () => {
    setRegion([...region, markers]);
    setMarkers([]);
  };

  const Edit = (e) => {
    setMarkers(...markers, (markers[edit2] = position));
    region[e] = markers;
    setRegion(region);
    setMarkers([]);
    setbtn("add");
  };
  const Delete = (e) => {
    region[e] = "";
    setRegion(...region, region);
    setMarkers([]);
  };

  return (
    <div className="main">
      <div className="map">
        <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />

          <Polygon
            key={Math.random()}
            pathOptions={purpleOptions}
            positions={markers}
          />
        </MapContainer>
      </div>
      <div className="actor">
        {btn === "add" ? (
          <button className="add" onClick={() => Add()}>
            add Region
          </button>
        ) : btn === "edit" ? (
          <button className="add" onClick={() => Edit(edit)}>
            edit Region
          </button>
        ) : (
          ""
        )}
      </div>

      <table>
        <tr>
          <th>location</th>
          <th>Edit</th>
          <th>delete</th>
        </tr>
        {region.length !== 0
          ? region.map((i, index) => {
              return (
                <tr key={index}>
                  <td id="loc">
                    <p>Region{index + 1} </p>
                  </td>
                  <td id="Edit">
                    <button
                      className="Edit"
                      onClick={() => {
                        setMarkers(i);
                        setbtn("edit");
                        setEdit(index);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td id="Delete">
                    <button className="Delete" onClick={() => Delete(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          : ""}
      </table>
    </div>
  );
}

export default App;
