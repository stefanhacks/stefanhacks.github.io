'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "c1e9759708d4bb3f2c91f3f8d33570fb",
"assets/assets/images/C00.png": "88b4117a20c63de700493e4e3b02b644",
"assets/assets/images/C01.png": "8adc5427844d3625fa11fb63f5fdb990",
"assets/assets/images/C02.png": "86c0c0ed1edb4e2080d6f69f8cdfb5dd",
"assets/assets/images/C03.png": "94acd85c00ddb18e1853c2485b4e955c",
"assets/assets/images/C04.png": "a01cc63891aeb38ef81b1f8bc5f28b74",
"assets/assets/images/C05.png": "dbf1b8eeebbcfa8bf88fc18608e9f7dc",
"assets/assets/images/C06.png": "39b5bc57ca506252712f24dca756303c",
"assets/assets/images/C07.png": "bb05307eb796a5737ad69c7ae30bb1f2",
"assets/assets/images/C08.png": "75d4a4e9fc23dc5a80281018d81ff56b",
"assets/assets/images/C09.png": "1967304b5434a69a70e49bdc2a960c10",
"assets/assets/images/C10.png": "5a4b558ead84cd822b1dbf41e8bcff28",
"assets/assets/images/C11.png": "de5f15e20ac9c86e8eb7e6626c5b8443",
"assets/assets/images/C12.png": "508f25abc6ac0deb7a470f9b997ef2a5",
"assets/assets/images/C13.png": "08457bfabf1e9364474764953f11384e",
"assets/assets/images/C14.png": "66527e3f32444750b98105070231b182",
"assets/assets/images/C15.png": "83b116f9719dbf644c6cbbd6209b5ce9",
"assets/assets/images/C16.png": "726b9da938ccd8d2dff1e30ca3c05655",
"assets/assets/images/C17.png": "9ad377eb60aa75a3c95e1a64762dc666",
"assets/assets/images/C18.png": "91eaefefa84546525f20239a11b65077",
"assets/assets/images/C19.png": "b68eaa181b1d01cabae8780e4015f4fa",
"assets/assets/images/C20.png": "587c5ed2f9b5b8f0b1fa7ec77e42e341",
"assets/assets/images/C21.png": "7233410da87635fb9f452a5a08ce2792",
"assets/assets/images/C22.png": "0cb021c130be4a2a8d4b633481399819",
"assets/assets/images/C23.png": "e37434c1f5c209922b5fffa02e8888e5",
"assets/assets/images/C24.png": "b0b1ce59b71bcdbf65af32d26bb41a83",
"assets/assets/images/C25.png": "02c31c098200dbad94c1240eda0ec299",
"assets/assets/images/C26.png": "7e305632dc35de8290b589f2a3fff4b8",
"assets/assets/images/C27.png": "a919be468677f219f34fd8276d07144f",
"assets/assets/images/C28.png": "a1265f7622d70e72a26390454e4940cf",
"assets/assets/images/C29.png": "0cc0e9825ce0c179a83d861c0814491a",
"assets/assets/images/C30.png": "04567bbd782e2fd03ccf6e62bae89d6f",
"assets/assets/images/C31.png": "954b5767d3bc5ccbfc18a0f65aebc61c",
"assets/assets/images/C32.png": "47499f285dfa8a139ee69d6aef4c35a6",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "bbe49830d0a983ac5d23adf3b24e91b3",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "b1173f600889945aec4304d344519992",
"/": "b1173f600889945aec4304d344519992",
"main.dart.js": "2cfeb578c61d50ded2b06a0e68d56732",
"manifest.json": "0c09c664b9136e382328fe4041e57849",
"version.json": "1011ac4cd6ae65c8eca54826729a2d04"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
