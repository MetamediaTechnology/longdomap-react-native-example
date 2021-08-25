/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useCallback, useEffect, useRef, useState }  from 'react';
 import type {Node} from 'react';

 import {
   SafeAreaView,
   TextInput,
   PermissionsAndroid,
   Platform,
   StatusBar,
   StyleSheet,
   Switch,
   Text,
   useColorScheme,
   View,
   Button,
 } from 'react-native';
 
 import {
   Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
 
 import Longdo from 'longdo-map-react-native'
 import Geolocation from 'react-native-geolocation-service';
 import VIForegroundService from '@voximplant/react-native-foreground-service';

 let map;

 const App: () => Node = () => {

  Longdo.apiKey = '[YOUR-Key-API]';
  // https://map.longdo.com/console
  let loc = { lon: 100.5, lat: 13.7 };
  let home = Longdo.object('Marker', loc, { detail: 'Home' });
  const [myText, setMyText] = useState("Move location");
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [trackLocation, setLocation] = useState(null);
  const [text, onChangeText] = React.useState("");
  const watchId = useRef(null);

  useEffect(() => {
    return () => {
      removeLocationUpdates();
    };
  }, [removeLocationUpdates]);
  
  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const startForegroundService = async () => {
    if (Platform.Version >= 26) {
      await VIForegroundService.createNotificationChannel({
        id: 'locationChannel',
        name: 'Location Tracking Channel',
        description: 'Tracks location of user',
        enableVibration: false,
      });
    }

    return VIForegroundService.startService({
      channelId: 'locationChannel',
      id: 420,
      title: appConfig.displayName,
      text: 'Tracking location updates',
      icon: 'ic_launcher',
    });
  };

  const stopForegroundService = useCallback(() => {
    VIForegroundService.stopService().catch((err) => err);
  }, []);


  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    if (Platform.OS === 'android' && foregroundService) {
      await startForegroundService();
    }

    setObserving(true);

    watchId.current = Geolocation.watchPosition(
      (position) => {
        setLocation(position);
        updateLocation(position)
      },
      (error) => {
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };

  const removeLocationUpdates = useCallback(() => {
    if (watchId.current !== null) {
      stopForegroundService();
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setObserving(false);
      clearOverlays();
    }
  }, [stopForegroundService]);
  
  function getCurrentLocation() {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
          (position) => {
            updateLocation(position)
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
   }

  // End of Geolocation Session

  // Longdo Map Session
  function mapOnReady() {
    addPolygon();
  }
 
  function onOverlayClick(data) {
    if (Longdo.isSameObject(data, home)) {
      console.log('At Home');
    }
    map.call('Overlays.list').then((e) => {
      console.log(JSON.stringify(e));
    });
  }

  function onGuideComplete(data) {
    alert('ระยะทาง: ' + data[0].distance + ' m. ' + 'ระยะเวลา: ' + data[0].interval + ' วินาที' ); // ระยะทาง (เมตร)
  }

  async function onLocation() {
    let location = await map.call('location');
    setMyText(location.lat +',' + location.lon)
  }

  async function addMarker() {
    let location = await map.call('location');
    let newMarker = Longdo.object('Marker', location, { title: 'Marker', detail: 'Marker', icon: { url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAVISURBVFiF7ZdbjFVnFcd/a+9vn33OnMOZM/cZhtJCKnUAMwEb52IzlUhATUtJlMZGiMYmhdC0tYZofDBR05TERNLEkPbFYJoYcZDoYONDi71MAwzSArZDbbgOEGbOzJy5nss++/r5MB0Clukwtgk+9P+8Lr9vr/2ttT7RWnMnZdzR7J8D/D8AqPkMRr4u20KXX2NyNGxgaypgRah5GIOvGJrFGi6hOVBtcZBuHS4UQOa6Bdn1slK7/CUsswLATECsCkdMEnPE6tcGz9b8WR/+VAAD6yRuR+yPHDZpjRgKrCow47cZEA6J8HTmoL68YIDsOvlp6PJL7WOLASoNVmom6gKVM4RvZw7q3tsCGHpQugjZH7o0AagkWJUg5oIT36ixmKIl1a1HP8nIeK/TOBk6vBW6NBkxKFfBRSWcmhYuFoQgWnjmY0E9B/zlNSWf5+azlav3owHyAq+HBvkAIuBSWRFqaLIj1tWGtGY05jylmAhNXnJXMl59L77v8d3pN92OymJDVbeemstHAXwgad6nktXGKOfE452S4sh0DJhpFGeKAV2TPl11EctTH781vhYOTWXonqzGicokC5epb2zib95ddlvw4VZg75wAJeBluYdziXr+4Taym9PY8YALZUXWM4iAMyXFxbJJf9FnY53PujqN+qiFHSum2DdeS9a3rgctFvIMXCgQi8XIWurner18UHtYv3ErAGPMlJ6c2Pz4qZ10bfkefzDu4Zt2xPN1DhsyLovMmRM7kfD2dIy9V+P8fWimFi/m6tk93HRT8lndbZX5Rc0FGmJBQznP69mvyZ9uCdDRF21OR05xJDdOw+Jm/mXVAXDIr2NThbCj1uH+lI/1Uf2HPJMDIzYXCkJvYdHHAi4yQnbUjvDCkiusijsYMYhVQlDk0cEuOTfeLumbAAD6o+RP/trTQ27wGtnAJI/Fe1GSg36KKkOxLe2xpdbhC4kAgHOO4siYwZpE6XogAb6RnuKluy7zrfTUTUNGpUBVQORwb1kYHNooX77uN9uIVq3teFHFrB3JsKz38G70O7fBTFBgsRSpE7jPjDgdGgx4Bn35GEvtkC13m/xmrJmWuMP2mlGW2+6tvvKMNJSHIfJBLFxbsay2Vw/d1AlbW1uTYZi0+/uPjh/vlF8NuPbPhgNUCR8TWGVq8houRcKob9BeFRK3k3w1U5g78Q2KfCgOQ66ykWXf38WpPbtWzTmMZnW8U3YXPNl1PhA1oaFa4Ium5kQg+MBiW/OArUmnwbDnhzg7JtQ/9BRLNv2AwcfXvjsvwKz6OmTPhCdPnw/F3GRFOBqOBAZnJUXa8Hkk5lCjwJoPRMNV1YKaniSXz+rbBpjV0XbZm47YntGYA5LkSWMtipANXj+b7TzNgcaMz8wSFOR0NfXmOAChA94k6ADOWAbve7GJBW9EnX36ydX/1OqaKa+epJKW+1awY/sTvF3RyuGSyTUleGU4NSiMrd7K8udeIfKgPAJubib5cdPiheklKEvt/59Xsra+aGNPWP9sRUWCkYLLmrZ2Ro00bznCqBICINW8jNxr3TN/vwvTJvxRp9hXaOSxyuy+Hx3L71xwCW6UiKg1HQ+6z+x8wjhx8jQTvQf4kn8FQ4SuRETG18QNuKIMXnEqOeFlWGqWou9khh9/uFf/Hj5hJbtdrVzbvk1Z1ssiQsKZ8B8xzmqJghhA3IR/BxlOhrW0mJN6fWq8r9EOfrjhDf3h9UN8Fi+jlWvaNoN0ekH02/P9J671PGA8P+Xpx8qRVJdQXrMdHloahM+09enp//b9TAA+je74u+BzgDsO8B/ytjz4VPeucgAAAABJRU5ErkJggg==', offset: { x: 16, y: 16 }}
    });
    map.call('Overlays.add', newMarker);
  }

  async function draggableMarker() {
    let location = await map.call('location');
    let newMarker = Longdo.object('Marker', location, { detail: 'Marker', draggable: true });
    map.call('Overlays.add', newMarker);
  }

  function addPolygon() {
    let geomLocation = [
      { lon: 99, lat: 14 },
      { lon: 100, lat: 13 },
      { lon: 102, lat: 13 },
      { lon: 103, lat: 14 }
    ];
    let newGeom = Longdo.object('Polygon', geomLocation, { detail: 'Polygon' });
    map.call('Overlays.add', newGeom);
  }

  async function clearOverlays() {
    map.call('Overlays.clear');
  }
  
  async function routing() {
    map.call('Route.clear');
    // https://api.longdo.com/map/doc/ref.php#Route.line
    map.call('Route.line', 'road', { lineColor: '#009910', lineWidth: '2', borderColor: '#000000', borderWidth : '1' });
    let location = {lon: 100.5, lat: 13.7};
    let starterPoint = Longdo.object('Marker', location, { detail: 'Home' });
    let destinationPoint = Longdo.object('Marker', {lon: 100.6926224, lat: 13.769601}, { detail: 'Destination' });
    map.call('location', location );
    map.call('zoom', 14 );
    map.call('Route.add', starterPoint);
    map.call('Route.add', destinationPoint);
    map.call('Route.search');
    getMoviesFromApi();
  }

  async function updateLocation(position) {
    map.call('Overlays.clear');
    let location = { lat: position.coords.latitude ,lon: position.coords.longitude }
    let home = Longdo.object('Marker', location, { detail: 'Im here' });

    map.call('location', location );
    map.call('Overlays.add', home);
  }

  // try search function api

  function onPressSearch() {
    map.call('Search.search', 'วัด');
  }
  function onSearch(data) {
    console.log(data)
  }

  // try search web service
  function fetchData(keyword) {
    this.setState({ text });
    const url = 'https://search.longdo.com/mapsearch/json/suggest?limit=20&key='+ Longdo.apiKey +'&keyword=';

    fetch(url + keyword)
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          text: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
   return (
     <SafeAreaView style={styles.container}>
       {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
       <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        // onChangeText={(text) => {
        //   this.fetchData(text);
        // }}
        value={text}
        placeholder="ใส่คำค้นหา"
       />
       <Longdo.MapView
         ref={r => (map = r)}
         layer={Longdo.static('Layers', 'GRAY')}
         zoom={15}
         zoomRange={{min: 5, max: 18}}
         location={{lon: 100.5382, lat: 13.7649}}
         onSearch={onSearch}

         lastView={false}
         // language={'en'}
         onOverlayClick={onOverlayClick}
         onLocation={onLocation}
         onGuideComplete={onGuideComplete}
         onReady={mapOnReady}
       />
       <Text>crosshair: {myText}</Text>
       <Text>current location: { trackLocation?.coords?.latitude }, { trackLocation?.coords?.longitude }</Text>
        <View style={styles.fixToText}>
          <Button
            title="Add Marker"
            onPress={addMarker}
          />
          <Button
            title="Draggable Marker"
            onPress={draggableMarker}
          />
          <Button
            title="Add Polygon"
            onPress={addPolygon}
          />
          <Button
            title="Clear Overlays"
            onPress={clearOverlays}
          />
          <Button
            title="Routing"
            onPress={routing}
          />
          <Button
            title="Current Location"
            onPress={getCurrentLocation}
          />
          <Button
            title="Start Observing"
            onPress={getLocationUpdates}
            disabled={observing}
          />
          <Button
            title="Stop Observing"
            onPress={removeLocationUpdates}
            disabled={!observing}
          />
          <Switch
            onValueChange={setForegroundService}
            value={foregroundService}
          />
        </View>
       <StatusBar style="auto" />
     </SafeAreaView>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     justifyContent: 'center',
   },
   input: {
     height: 40,
     margin: 12,
     borderWidth: 1,
     padding: 10,
     backgroundColor: '#fff',
     zIndex: 10
   },
   fixToText: {
     position: 'absolute',
     bottom: 30,
     right:5,
     flexDirection: 'column',
     zIndex: 2
   },
 });
 
 export default App;