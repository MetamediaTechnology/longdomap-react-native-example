# Longdo Map Example - React Native 

This repository provides several basic examples of using Longdo Map React Native.

![Longdo Map first app](https://github.com/MetamediaTechnology/longdomap-react-native-example/blob/main/screenshot-map-app.png?raw=true)


## Installation

Use the GitHub [Longdo Map React Native](https://github.com/MetamediaTechnology/longdo-map-react-native) to install Longdo Map library.

** If you have an issue `Class private methods are not enabled.`

```
npm install @babel/plugin-proposal-private-methods --save-dev
```

and add this command to `babel.config.js`
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['@babel/plugin-proposal-private-methods', { "loose": true }]],
};
```

## Example
You can see the [App.js](https://github.com/MetamediaTechnology/longdo-map-react-native) source code to run the first app.
Here are sample functions:

### Initial Map

```javascript
<Longdo.MapView
    ref={r => (map = r)}
    layer={Longdo.static('Layers', 'GRAY')}
    zoom={15}
    zoomRange={{min: 8, max: 18}}
    location={{lon: 100.5382, lat: 13.7649}}
    lastView={false}
    // language={'en'}
    onOverlayClick={onOverlayClick}
    onLocation={onLocation}
    onGuideComplete={onGuideComplete}
/>
```
- `layer`, `zoom`, `location`, `zoomRange` is the initial map setting.
- `onOverlayClick`, `onLocation`, `onGuideComplate` is the Map or Overlay Events. see more: [`Longdo.MapView` Component]( https://api.longdo.com/map/doc/react-native.php)

### Add marker
simple marker
```javascript
async function addMarker() {
    let location = await map.call('location');
    let newMarker = Longdo.object('Marker', location, { detail: 'Marker' });
    map.call('Overlays.add', newMarker);
}
```
see more: [Marker option Documentation](https://api.longdo.com/map/doc/ref.php#MarkerOptions)

### Routing
```javascript
function routing() {
    let starterPoint = Longdo.object('Marker', {lon: 100.5, lat: 13.7}, { detail: 'Home' });
    let destinationPoint = Longdo.object('Marker', {lon: 100.5382, lat: 13.7649}, { detail: 'Destination' });
    map.call('Route.add', starterPoint);
    map.call('Route.add', destinationPoint);
    map.call('Route.search');
}
```
see more: [
React Native call function](https://api.longdo.com/map/doc/react-native.php#call), [JavaScript routing option](https://api.longdo.com/map/doc/ref.php#Route)

## Documentation

- [Reference](https://api.longdo.com/map/doc/react-native.php)
- [JavaScript Documentation](https://map.longdo.com/docs/)
- [Geolocation] (https://www.npmjs.com/package/react-native-geolocation-service)
- [Foreground Service] (https://github.com/voximplant/react-native-foreground-service)
