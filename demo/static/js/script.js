(function($, window) {
var $ipbutton = $('#ipbutton');
var $mapbutton = $('#mapbutton');

$ipbutton.on('click', function() {
  $.getJSON('https://httpbin.org/ip', function(data, status) {
    $('#ipcontent').text(data.origin);
  });
});

$mapbutton.on('click', function() {
  clearMap();
  showMap();
});

function clearMap() {
  if ($('.ol-viewport')) {
    $('#map').html('');
  }
}

function showMap() {
  var myraster;
  var Lat = parseFloat($('#myLat').val());
  var Lon = parseFloat($('#myLon').val());

  if ($('#mapselector').val() == 'bing') {
    myraster = new ol.layer.Tile({
      source: new ol.source.BingMaps({
         imagerySet: 'AerialWithLabels',
         key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3'
       })
    });
  } else {
    myraster = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
  }

  var projection = ol.proj.get('EPSG:3857');

  var raster = myraster;

  var style = {
    'Point': [new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: 'rgba(255,255,0,0.4)'
        }),
        radius: 5,
        stroke: new ol.style.Stroke({
          color: '#ff0',
          width: 1
        })
      })
    })],
    'LineString': [new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#f00',
        width: 3
      })
    })],
    'MultiLineString': [new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#0f0',
        width: 3
      })
    })]
  };

  // var vector = new ol.layer.Vector({
  //   source: new ol.source.Vector({
  //     url: '{{ myfileurl }}',
  //     format: new ol.format.GPX()
  //   }),
  //   style: function(feature, resolution) {
  //     return style[feature.getGeometry().getType()];
  //   }
  // });

  var map = new ol.Map({
    layers: [raster],
    target: document.getElementById('map'),
    view: new ol.View({
      center: ol.proj.transform([Lon, Lat], 'EPSG:4326', 'EPSG:3857'),
      zoom: 14
    })
  });

  var displayFeatureInfo = function(pixel) {
    var features = [];
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      features.push(feature);
    });

    if (features.length > 0) {
      var info = [];
      var i, ii;
      for (i = 0, ii = features.length; i < ii; ++i) {
        info.push(features[i].get('desc'));
      }

      document.getElementById('info').innerHTML = info.join(', ') || '(no description)';
      map.getTarget().style.cursor = 'pointer';
    } else {
      document.getElementById('info').innerHTML = '&nbsp;';
      map.getTarget().style.cursor = '';
    }
  };

  map.on('pointermove', function(evt) {
    if (evt.dragging) {
      return;
    }

    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
  });

  map.on('click', function(evt) {
    displayFeatureInfo(evt.pixel);
  });
}

}).call(this, jQuery, window);
