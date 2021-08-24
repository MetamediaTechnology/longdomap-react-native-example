# Longdo Map Example - React Native 

This repository provides several basic examples of using Longdo Map React Native.

![Longdo Map first app](https://github.com/MetamediaTechnology/longdomap-react-native-example/blob/main/screenshot-map-app.png?raw=true)

- [Installation](#installation)
- [Initial Map](#initial-map)
- [Marker](#marker)
- [Search](#search)
- [Routing](#routing)
- [Documentation](#documentation)

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

### Marker
simple marker
```javascript
async function addMarker() {
    let location = await map.call('location');
    let newMarker = Longdo.object('Marker', location, { detail: 'Marker' });
    map.call('Overlays.add', newMarker);
}
```
marker with image
```javascript
async function addMarker() {
    let location = await map.call('location');
    let newMarker = Longdo.object('Marker', location, { title: 'Marker', detail: 'Marker', icon: { url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAVISURBVFiF7ZdbjFVnFcd/a+9vn33OnMOZM/cZhtJCKnUAMwEb52IzlUhATUtJlMZGiMYmhdC0tYZofDBR05TERNLEkPbFYJoYcZDoYONDi71MAwzSArZDbbgOEGbOzJy5nss++/r5MB0Clukwtgk+9P+8Lr9vr/2ttT7RWnMnZdzR7J8D/D8AqPkMRr4u20KXX2NyNGxgaypgRah5GIOvGJrFGi6hOVBtcZBuHS4UQOa6Bdn1slK7/CUsswLATECsCkdMEnPE6tcGz9b8WR/+VAAD6yRuR+yPHDZpjRgKrCow47cZEA6J8HTmoL68YIDsOvlp6PJL7WOLASoNVmom6gKVM4RvZw7q3tsCGHpQugjZH7o0AagkWJUg5oIT36ixmKIl1a1HP8nIeK/TOBk6vBW6NBkxKFfBRSWcmhYuFoQgWnjmY0E9B/zlNSWf5+azlav3owHyAq+HBvkAIuBSWRFqaLIj1tWGtGY05jylmAhNXnJXMl59L77v8d3pN92OymJDVbeemstHAXwgad6nktXGKOfE452S4sh0DJhpFGeKAV2TPl11EctTH781vhYOTWXonqzGicokC5epb2zib95ddlvw4VZg75wAJeBluYdziXr+4Taym9PY8YALZUXWM4iAMyXFxbJJf9FnY53PujqN+qiFHSum2DdeS9a3rgctFvIMXCgQi8XIWurner18UHtYv3ErAGPMlJ6c2Pz4qZ10bfkefzDu4Zt2xPN1DhsyLovMmRM7kfD2dIy9V+P8fWimFi/m6tk93HRT8lndbZX5Rc0FGmJBQznP69mvyZ9uCdDRF21OR05xJDdOw+Jm/mXVAXDIr2NThbCj1uH+lI/1Uf2HPJMDIzYXCkJvYdHHAi4yQnbUjvDCkiusijsYMYhVQlDk0cEuOTfeLumbAAD6o+RP/trTQ27wGtnAJI/Fe1GSg36KKkOxLe2xpdbhC4kAgHOO4siYwZpE6XogAb6RnuKluy7zrfTUTUNGpUBVQORwb1kYHNooX77uN9uIVq3teFHFrB3JsKz38G70O7fBTFBgsRSpE7jPjDgdGgx4Bn35GEvtkC13m/xmrJmWuMP2mlGW2+6tvvKMNJSHIfJBLFxbsay2Vw/d1AlbW1uTYZi0+/uPjh/vlF8NuPbPhgNUCR8TWGVq8houRcKob9BeFRK3k3w1U5g78Q2KfCgOQ66ykWXf38WpPbtWzTmMZnW8U3YXPNl1PhA1oaFa4Ium5kQg+MBiW/OArUmnwbDnhzg7JtQ/9BRLNv2AwcfXvjsvwKz6OmTPhCdPnw/F3GRFOBqOBAZnJUXa8Hkk5lCjwJoPRMNV1YKaniSXz+rbBpjV0XbZm47YntGYA5LkSWMtipANXj+b7TzNgcaMz8wSFOR0NfXmOAChA94k6ADOWAbve7GJBW9EnX36ydX/1OqaKa+epJKW+1awY/sTvF3RyuGSyTUleGU4NSiMrd7K8udeIfKgPAJubib5cdPiheklKEvt/59Xsra+aGNPWP9sRUWCkYLLmrZ2Ro00bznCqBICINW8jNxr3TN/vwvTJvxRp9hXaOSxyuy+Hx3L71xwCW6UiKg1HQ+6z+x8wjhx8jQTvQf4kn8FQ4SuRETG18QNuKIMXnEqOeFlWGqWou9khh9/uFf/Hj5hJbtdrVzbvk1Z1ssiQsKZ8B8xzmqJghhA3IR/BxlOhrW0mJN6fWq8r9EOfrjhDf3h9UN8Fi+jlWvaNoN0ekH02/P9J671PGA8P+Xpx8qRVJdQXrMdHloahM+09enp//b9TAA+je74u+BzgDsO8B/ytjz4VPeucgAAAABJRU5ErkJggg==', offset: { x: 12, y: 45 } }});
    map.call('Overlays.add', newMarker);
}
```
- `url` should be data url.

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

#### Change the color path
```javascript
map.call('Route.line', 'road', { lineColor: '#009910', lineWidth: '1', borderColor: '#000000', borderWidth : '1' });
```
- Call this function before Route.search.

see more: [
React Native call function](https://api.longdo.com/map/doc/react-native.php#call), [JavaScript routing option](https://api.longdo.com/map/doc/ref.php#Route)

## Documentation

- [Reference](https://api.longdo.com/map/doc/react-native.php)
- [JavaScript Documentation](https://map.longdo.com/docs/)
- [Geolocation] (https://www.npmjs.com/package/react-native-geolocation-service)
- [Foreground Service] (https://github.com/voximplant/react-native-foreground-service)
