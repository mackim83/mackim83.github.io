/* global TrelloPowerUp */

var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

var parkMap = {
  acad: 'Acadia National Park',
  arch: 'Arches National Park',
  badl: 'Badlands National Park',
  brca: 'Bryce Canyon National Park',
  crla: 'Crater Lake National Park',
  dena: 'Denali National Park',
  glac: 'Glacier National Park',
  grca: 'Grand Canyon National Park',
  grte: 'Grand Teton National Park',
  olym: 'Olympic National Park',
  yell: 'Yellowstone National Park',
  yose: 'Yosemite National Park',
  zion: 'Zion National Park'
};

var funcMap = {
  sndSlkDm: 'Send DM to assignee through Slack.'
}

var reqMap = {
  sndSlkDm: 'dm'
}

var currentCard = ''
var currentBoard = ''
var currentUrl = ''

var getBadges = function(t){
  return t.card('name')
  .get('name')
  .then(function(cardName){
    var badgeColor;
    var icon = GRAY_ICON;
    var lowercaseName = cardName.toLowerCase();
    if(lowercaseName.indexOf('green') > -1){
      badgeColor = 'green';
      icon = WHITE_ICON;
    } else if(lowercaseName.indexOf('yellow') > -1){
      badgeColor = 'yellow';
      icon = WHITE_ICON;
    } else if(lowercaseName.indexOf('red') > -1){
      badgeColor = 'red';
      icon = WHITE_ICON;
    }

    if(lowercaseName.indexOf('dynamic') > -1){
      // dynamic badges can have their function rerun after a set number
      // of seconds defined by refresh. Minimum of 10 seconds.
      return [{
        dynamic: function(){
          return {
            title: 'Detail Badge', // for detail badges only
            text: 'Dynamic ' + (Math.random() * 100).toFixed(0).toString(),
            icon: icon, // for card front badges only
            color: badgeColor,
            refresh: 10
          }
        }
      }]
    }

    if(lowercaseName.indexOf('static') > -1){
      // return an array of badge objects
      return [{
        title: 'Detail Badge', // for detail badges only
        text: 'Static',
        icon: icon, // for card front badges only
        color: badgeColor
      }];
    } else {
      return [];
    }
  })
};

var formatNPSUrl = function(t, url){
  if(!/^https?:\/\/www\.nps\.gov\/[a-z]{4}\//.test(url)){
    return null;
  }
  var parkShort = /^https?:\/\/www\.nps\.gov\/([a-z]{4})\//.exec(url)[1];
  if(parkShort && parkMap[parkShort]){
    return parkMap[parkShort];
  } else{
    return null;
  }
};

var boardButtonCallback = function(t){
  return t.popup({
    title: 'Popup List Example',
    items: [
      {
        text: 'Open Overlay',
        callback: function(t){
          return t.overlay({
            url: './overlay.html',
            args: { rand: (Math.random() * 100).toFixed(0) }
          })
          .then(function(){
            return t.closePopup();
          });
        }
      },
      {
        text: 'Open Board Bar',
        callback: function(t){
          return t.boardBar({
            url: './board-bar.html',
            height: 200
          })
          .then(function(){
            return t.closePopup();
          });
        }
      }
    ]
  });
};

var cardButtonCallback = function(t, options){
  var items = Object.keys(funcMap).map(function(funcCode){
    // var urlForCode = 'https://widealab.iptime.org:14019/dm/';
    var urlForCode = 'https://widealab.iptime.org:14019/dm/';
    currentUrl = urlForCode;
    return {
      text: funcMap[funcCode],
      url: urlForCode,
      callback: function (t) {
          method = "get"; // Set method to post by default if not specified.
      
          // The rest of this code assumes you are not using a library.
          // It can be made less wordy if you use one.
          var form = document.createElement("form");
          form.setAttribute("method", method);
          form.setAttribute("action", currentUrl + currentCard);
          document.body.appendChild(form);
          form.submit();
          t.closePopup();
      }
    };
  });

  return t.popup({
    title: 'Functions',
    items: items,
    search: {
      count: 2,
      placeholder: 'Select function...',
      empty: 'No function found'
    }
  });
};

TrelloPowerUp.initialize({
  'attachment-sections': null,
  'attachment-thumbnail': null,
  'board-buttons': null,
  'card-badges': null,
  'card-buttons': function(t, options) {
    currentCard = options["context"]["card"];
    currentBoard = options["context"]["board"];
    return [{
      icon: GRAY_ICON,
      text: 'Aurender',
      callback: cardButtonCallback
    }];
  },
  'card-detail-badges': null,
  'card-from-url': null,
  'format-url': null,
  'show-settings': null
});
