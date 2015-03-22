var playlist_id = 'PLRFEu3LplhHhl72SHSxtz7QiXpEUUi5_e';

function xmlToJson(xml) {
  var obj = {};
  if (xml.nodeType == 1) { 
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    obj = xml.nodeValue;
  }
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

function switchVideo(id) {
  var iframe = '<iframe style="width:100%;border:0;" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';

  if ($('#YoutubeFrame iframe').length > 0) {
    $('#YoutubeFrame iframe').replaceWith(iframe);
  } else {
    $('#YoutubeFrame').prepend(iframe);
  }

  return true;
}

$(document).ready(function() {
  $.ajax({
    url: 'https://gdata.youtube.com/feeds/api/playlists/' + playlist_id + '?v=2',
    type: 'GET',
    dataType: 'XML',
    success: function(d) {
      var t = xmlToJson(d),
          v = {},
          h = '<ul>';

      for (i in t['feed']['entry']) { v[t['feed']['entry'][i]['link'][0]['@attributes']['href'].split('https://www.youtube.com/watch?v=')[1].split('&feature=youtube_gdata')[0]] = t['feed']['entry'][i]['title']['#text']; }

      for (i in v) {
        h += '<li><a href="https://www.youtube.com/watch?v=' + i + '" data-id="' + i + '">' + v[i] + '</a></li>';
      }

      $('#YoutubeFrame').append(h + '</ul>')

      $('#YoutubeFrame ul li a').click(function(e){
        if (e.metaKey) { return true; }
        if ($(this).parent().hasClass('active')) { return false; }
        e.preventDefault();
        switchVideo($(this).attr('data-id'));
        $('#YoutubeFrame ul li').removeClass('active');
        $(this).parent().addClass('active');
        return false;
      });

      $('#YoutubeFrame ul li:first-child a').click();
    }
  })
});