if(typeof jQuery!="undefined") {
  jQuery(document).ready(
    function() {
      jQuery('textarea#content').keyup(function() {
        calcKWA(jQuery('textarea#content').val());
      });
      if(typeof tinyMCE!="undefined") initTinyMCE();
      jQuery('#title').keyup(function() {
        if(typeof tinyMCE!="undefined") {
          if(!tinyMCE.activeEditor.isHidden()) calcKWA(tinyMCE.get('content').getContent());
        } else calcKWA(jQuery('textarea#content').val());
      });
    }
  );
}

function initTinyMCE() {
  if(!document.getElementById('content_ifr')) {
    setTimeout("initTinyMCE()",1000);
    return false;
  } else {
    jQuery('#content_ifr').contents().find("html").keyup(function() {
      calcKWA(tinyMCE.get('content').getContent());
    });
    return true;
  }
}

function handleTitleKeyUp() {

}

// calculate keyword ratios
function calcKWA(content) {
  var tags = kwa_tags;
  
  content = strip_tags(jQuery('#title').val()+' '+content);
  words = content.trim().split(/[\s,\.\?\!\:\/]+/);
  words = cleanArray(words); // remove empty array entries (especially last one when text ends e.g. with a dot)
  cnt_words = words.length;
  
  for(var i in tags) {
    ratio = Math.round(countWordInWordArray(tags[i][0],words)/cnt_words*10000)/100;
    jQuery('#kwa-'+tags[i][1]).html(ratio+' %'); // auf 2 nachkommastellen runden
  }
}

// count how often word appears in wordArr
function countWordInWordArray(word,wordArr) {
  return substr_count(wordArr.join(" ").toLowerCase(),word.toLowerCase());
}

function cleanArray(actual){
  var newArray = new Array();
  for(var i = 0; i<actual.length; i++){
      if (actual[i]){
        newArray.push(actual[i]);
    }
  }
  return newArray;
}


function strip_tags (input, allowed) {
  // Strips HTML and PHP tags from a string  
  // 
  // version: 1009.820
  // discuss at: http://phpjs.org/functions/strip_tags    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Luke Godfrey
  // +      input by: Pul
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman    // +      input by: Alex
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Marc Palau
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Brett Zamir (http://brett-zamir.me)    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Eric Nagel
  // +      input by: Bobby Drake
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Tomasz Wesolowski    // +      input by: Evertjan Garretsen
  // +    revised by: Rafa? Kukawski (http://blog.kukawski.pl/)
  allowed = (((allowed || "") + "")
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)           
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1){
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });        
}

function substr_count (haystack, needle, offset, length) {
  // Returns the number of times a substring occurs in the string  
  // 
  // version: 1008.1718
  // discuss at: http://phpjs.org/functions/substr_count    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  var pos = 0, cnt = 0;
  haystack += '';
  needle += '';
  if (isNaN(offset)) {offset = 0;}
  if (isNaN(length)) {length = 0;}
  offset--; 
  while ((offset = haystack.indexOf(needle, offset+1)) != -1){
      if (length > 0 && (offset+needle.length) > length){
          return false;
      } else{            cnt++;
      }
  }

  return cnt;
}