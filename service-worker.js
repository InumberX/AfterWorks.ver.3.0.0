var VERSION = 20180104;
var STATIC_CACHE_NAME = 'cache_aw_' + VERSION;
var ORIGIN = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
var STATIC_FILES = [
  ORIGIN + '/img/ico_css3.png',
  ORIGIN + '/img/ico_facebook1.png',
  ORIGIN + '/img/ico_fireworks.png',
  ORIGIN + '/img/ico_html5.png',
  ORIGIN + '/img/ico_illustrator.png',
  ORIGIN + '/img/ico_java.png',
  ORIGIN + '/img/ico_javascript.png',
  ORIGIN + '/img/ico_jquery.png',
  ORIGIN + '/img/ico_photoshop.png',
  ORIGIN + '/img/ico_php.png',
  ORIGIN + '/img/ico_xd.png',
  ORIGIN + '/img/img_works_aw1.png',
  ORIGIN + '/img/img_works_aw2.png',
  ORIGIN + '/img/img_works_comp1.png',
  ORIGIN + '/img/img_works_insta1.png',
  ORIGIN + '/img/img_works_lms1.png',
  ORIGIN + '/img/img_works_sv2017.png',
  ORIGIN + '/summervacation/2017/img/img_day_01_01_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_01_01_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_01_01_03.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_01_01_04.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_01_02_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_01_02_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_01_02_03.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_01_02_04.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_01_02_05.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_02_01_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_02_02_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_02_03_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_02_03_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_02_04_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_02_04_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_01_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_01_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_02_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_02_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_02_03.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_03_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_03_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_03_03.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_03_04.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_03_03_05.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_04_01_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_04_01_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_04_01_03.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_04_02_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_04_02_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_04_02_03.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_04_03_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_05_01_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_05_01_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_05_02_01.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_05_02_02.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_05_02_03.jpg',
  ORIGIN + '/summervacation/2017/img/img_day_06_01_01.jpg',
];
var STATIC_FILE_URL_HASH = {};
STATIC_FILES.forEach(function(x){ STATIC_FILE_URL_HASH[x] = true; });

self.addEventListener('install', function(evt) {
  evt.waitUntil(caches.open(STATIC_CACHE_NAME).then(function(cache) {
    return Promise.all(STATIC_FILES.map(function(url) {
      return fetch(new Request(url)).then(function(response) {
        if (response.ok)
        return cache.put(response.url, response);
        return Promise.reject('Invalid response.  URL:' + response.url + ' Status: ' + response.status);
      });
    }));
  }));
});

self.addEventListener('fetch', function(evt) {
  if (!STATIC_FILE_URL_HASH[evt.request.url])
  return;
  evt.respondWith(caches.match(evt.request, {cacheName: STATIC_CACHE_NAME}));
});

self.addEventListener('activate', function(evt) {
  evt.waitUntil(caches.keys().then(function(keys) {
    var promises = [];
    keys.forEach(function(cacheName) {
      if (cacheName != STATIC_CACHE_NAME)
      promises.push(caches.delete(cacheName));
    });
    return Promise.all(promises);
  }));
});