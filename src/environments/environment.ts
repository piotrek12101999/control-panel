// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  weatherApi: 'https://api.openweathermap.org/data/2.5/forecast?q=' ,
  weatherApiAppID: '&units=metric&appid=75f6265524afb5924f461a95e75b1489',
  firebaseConfig: {
    apiKey: 'AIzaSyD-7maK5buBw4Go7ovDZLt3Ql3Hsjg3fb8',
    authDomain: 'piotr-control-panel.firebaseapp.com',
    databaseURL: 'https://piotr-control-panel.firebaseio.com',
    projectId: 'piotr-control-panel',
    storageBucket: 'piotr-control-panel.appspot.com',
    messagingSenderId: '488334381326'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
