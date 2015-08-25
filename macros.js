// ==UserScript==
// @name          TagPro Fluid Chat Macros Userscript
// @namespace     http://www.reddit.com/user/contact_lens_linux/
// @description   Help your team with quick chat macros.
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author        steppin, Watball, Flail
// @version       0.5
// ==/UserScript==

(function() {

  function contentEval(source) {
    // Check for function input.
    if ('function' == typeof source) {
      // Execute this function with no arguments, by adding parentheses.
      // One set around the function, required for valid syntax, and a
      // second empty set calls the surrounded function.
      source = '(' + source + ')();'
    }

    // Create a script node holding this  source code.
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  function actualScript() {

    var TIMEOUT = 1.5 * 1000;
    var
      LEFT          = 83,   // s
      RIGHT         = 70,   // f
      TOP           = 69,   // e
      BOT           = 67,   // c
      MID           = 68,   // d
      POWERUPS      = 87,   // w
      ENEMY         = 82,   // r
      JUKE_JUICE    = 50,   // 2
      ROLLING_BOMB  = 51,   // 3
      TAGPRO        = 52,   // 4
      REGRAB        = 88,   // x
      OUR_FC        = 65,   // a
      ADVICE        = 81,   // q
      GENERAL_CHAT  = 90,   // z
      THANKS        = 65,   // a
      NICE          = 83,   // s
      MB            = 86,   // v
      HEART         = 88,   // x
      ERRANT_MACRO  = 66,   // b
      NP            = 68,   // d
      NEVERMIND     = 70,   // f
      HELP          = 192,  // `
      GATE          = 49,   // 1
      WAITING       = 79,   // o
      OFFENSE       = 81,   // q
      DEFENSE       = 65,   // a
      SWITCH        = 90,   // z
      SWITCH_TEAMS  = 80,   // p
      ZERO          = 48,   // 0
      ONE           = 49,   // 1
      TWO           = 50,   // 2
      THREE         = 51,   // 3
      FOUR          = 52,   // 4
      FIVE          = 53,   // 5
      SIX           = 54,   // 6
      SEVEN         = 55,   // 7
      EIGHT         = 56,   // 8
      NINE          = 57,   // 9
      TIME_TOGGLE   = 86,   // v
      TIME_0        = 32,   // space
      TIME_1        = 88,   // x
      TIME_2        = 67,   // c
      TIME_3        = 86,   // v
      TIME_4        = 83,   // s
      TIME_5        = 68,   // d
      TIME_6        = 70,   // f
      TIME_7        = 87,   // w
      TIME_8        = 69,   // e
      TIME_9        = 82;   // r

    function makeChat(toAll, message) {
      return {'toAll': toAll, 'message': message};
    }

    function makeSimpleFn(toAll, message) {
      return function() {
        return makeChat(toAll, message);
      };
    }

    function makeDirection() {
      var dir1 = state['direction1'];
      var dir2 = state['direction2'];

      if (dir1 == 't') {
        if (dir2 == 't') return 'top';
        if (dir2 == 'l') return 'top-left';
        if (dir2 == 'm') return 'upper-mid';
        if (dir2 == 'r') return 'top-right';
        if (dir2 == 'b') return 'mid';
        return 'top';
      }
      if (dir1 == 'l') {
        if (dir2 == 't') return 'top-left';
        if (dir2 == 'l') return 'left';
        if (dir2 == 'm') return 'left-mid';
        if (dir2 == 'r') return 'mid';
        if (dir2 == 'b') return 'bottom-left';
        return 'left';
      }
      if (dir1 == 'm') {
        if (dir2 == 't') return 'upper-mid';
        if (dir2 == 'l') return 'left-mid';
        if (dir2 == 'm') return 'mid';
        if (dir2 == 'r') return 'right-mid';
        if (dir2 == 'b') return 'lower-mid';
        return 'mid';
      }
      if (dir1 == 'r') {
        if (dir2 == 't') return 'top-right';
        if (dir2 == 'l') return 'mid';
        if (dir2 == 'm') return 'right-mid';
        if (dir2 == 'r') return 'right';
        if (dir2 == 'b') return 'bottom-right';
        return 'right';
      }
      if (dir1 == 'b') {
        if (dir2 == 't') return 'mid';
        if (dir2 == 'l') return 'bottom-left';
        if (dir2 == 'm') return 'lower-mid';
        if (dir2 == 'r') return 'bottom-right';
        if (dir2 == 'b') return 'bottom';
        return 'bot';
      }
      return '';
    }

    function makeTime() {
      var time1 = state['time1'];
      var time2 = state['time2'];

      if (time1 && time2) return time1 + time2;
      if (time1) return '0' + time1;
      return '';
    }

    function powerupFn() {
      var powerupType = state['powerupType']||'powerups';
      var direction = makeDirection();
      var time = makeTime();

      if (direction.length == 0 && time.length == 0) {
        if (powerupType == 'tagpro') {
          return makeChat(false, 'tagpro lead on the way!');
        } else if (powerupType == 'rolling bomb') {
          return makeChat(false, 'rolling bomb on regrab, go for kiss');
        } else if (powerupType == 'juke juice') {
          return makeChat(false, 'juke juice on regrab');
        }
      }

      var message = powerupType;

      if (direction.length > 0) message += ' ' + direction;

      if (time.length > 0) {
        message += ' :' + time;
      }

      return makeChat(false, message);
    }

    function regrabPowerupsFn() {
      var powerupType = state['powerupType']||'powerups';
      return makeChat(false, powerupType + ' on regrab');
    }

    function directionFn() {
      return {'toAll': false, 'message': makeDirection()}
    }

    function ourFcFn() {
      return makeChat(false, 'our FC ' + makeDirection())
    }

    function enemyFcFn() {
      return makeChat(false, 'enemy FC ' + makeDirection())
    }

    function helpFn() {
      return makeChat(false, 'need help ' + makeDirection());
    }

    function makeSimpleNode(key, toAll, message) {
      return {
        inputs: [{key: key}],
        fn: makeSimpleFn(toAll, message)
      }
    }

    function makeDirectionNodePair(outputs, fn) {
      var direction2 = {
        inputs: [
          {key: TOP, mixins: {'direction2':'t'}},
          {key: LEFT, mixins: {'direction2':'l'}},
          {key: MID, mixins: {'direction2':'m'}},
          {key: RIGHT, mixins: {'direction2':'r'}},
          {key: BOT, mixins: {'direction2':'b'}}
        ],
        outputs: outputs,
        fn: fn
      };

      var direction1 = {
        inputs: [
          {key: TOP, mixins: {'direction1':'t'}},
          {key: LEFT, mixins: {'direction1':'l'}},
          {key: MID, mixins: {'direction1':'m'}},
          {key: RIGHT, mixins: {'direction1':'r'}},
          {key: BOT, mixins: {'direction1':'b'}}
        ],
        outputs: [direction2],
        fn: fn
      };

      return [direction1, direction2];
    }
    function makeTimeNodePair(outputs, fn) {
      var time2 = {
        inputs: [
          {key: TIME_0, mixins: {'time2':'0'}},
          {key: TIME_1, mixins: {'time2':'1'}},
          {key: TIME_2, mixins: {'time2':'2'}},
          {key: TIME_3, mixins: {'time2':'3'}},
          {key: TIME_4, mixins: {'time2':'4'}},
          {key: TIME_5, mixins: {'time2':'5'}},
          {key: TIME_6, mixins: {'time2':'6'}},
          {key: TIME_7, mixins: {'time2':'7'}},
          {key: TIME_8, mixins: {'time2':'8'}},
          {key: TIME_9, mixins: {'time2':'9'}},
        ],
        outputs: outputs,
        fn: fn
      };

      var time1 = {
        inputs: [
          {key: TIME_0, mixins: {'time1':'0'}},
          {key: TIME_1, mixins: {'time1':'1'}},
          {key: TIME_2, mixins: {'time1':'2'}},
          {key: TIME_3, mixins: {'time1':'3'}},
          {key: TIME_4, mixins: {'time1':'4'}},
          {key: TIME_5, mixins: {'time1':'5'}},
          {key: TIME_6, mixins: {'time1':'6'}},
          {key: TIME_7, mixins: {'time1':'7'}},
          {key: TIME_8, mixins: {'time1':'8'}},
          {key: TIME_9, mixins: {'time1':'9'}},
        ],
        outputs: [time2],
        fn: fn
      };

      return [time1, time2];
    }

    var powerupsTimeA = makeTimeNodePair([], powerupFn);
    var powerupsTimeToggle = {
      inputs: [{key: TIME_TOGGLE}],
      outputs: [powerupsTimeA[0]]
    }

    var powerupsTimeB = makeTimeNodePair([], powerupFn);
    var powerupsDirection = makeDirectionNodePair([powerupsTimeB[0]], powerupFn);

    var powerupsRegrab = {
      inputs: [{key: REGRAB}],
      fn: regrabPowerupsFn
    }

    var powerupsGeneric = {
      inputs: [{key: POWERUPS}],
      outputs: [
        makeSimpleNode(POWERUPS, false, "powerups"),
        powerupsTimeToggle,
        powerupsDirection[0],
        powerupsRegrab],
      fn: powerupFn
    }

    var powerupsDirectionSpecific = makeDirectionNodePair([], powerupFn);
    var powerupsSpecific = {
      inputs: [
        {key: JUKE_JUICE, mixins: {'powerupType':'juke juice'}},
        {key: ROLLING_BOMB, mixins: {'powerupType':'rolling bomb'}},
        {key: TAGPRO, mixins: {'powerupType':'tagpro'}}
      ],
      outputs: [
        powerupsDirectionSpecific[0],
        powerupsRegrab],
      fn: powerupFn
    }

    var directionPair = makeDirectionNodePair([], directionFn);

    var ourFcDirectionsPair = makeDirectionNodePair([], ourFcFn);
    var ourFc = {
      inputs: [{key: OUR_FC}],
      outputs: [
        ourFcDirectionsPair[0],
        makeSimpleNode(OUR_FC, false, 'our FC away!')
      ],
      fn: makeSimpleFn(false, 'our FC away!')
    }

    var enemyFcDirectionsPair = makeDirectionNodePair([], enemyFcFn);
    var enemyFc = {
      inputs: [{key: ENEMY}],
      outputs: [
        enemyFcDirectionsPair[0],
        makeSimpleNode(ENEMY, false, 'enemy FC away!')
      ],
      fn: makeSimpleFn(false, 'enemy FC away!')
    }

    var regrab = {
      inputs: [{key: REGRAB}],
      outputs: [makeSimpleNode(REGRAB, false, 'we need regrab!')],
      fn: makeSimpleFn(false, 'i\'m on regrab')
    }

    var advice = {
      inputs: [{key: ADVICE}],
      outputs: [
        makeSimpleNode(ONE, false, 'base is clear'),
        makeSimpleNode(TWO, false, 'enemies in base, careful'),
        makeSimpleNode(THREE, false, 'play it safe, FC!'),
        makeSimpleNode(FIVE, false, 'please don\'t guard an empty base'),
        makeSimpleNode(SIX, false, 'please chase the enemy flag carrier'),
        makeSimpleNode(SEVEN, false, 'try not to make risky grabs when they have our flag'),
        makeSimpleNode(EIGHT, false, 'please leave that boost for defense, thanks!'),
        makeSimpleNode(NINE, false, '2 offense, 2 defense works well'),
        makeSimpleNode(POWERUPS, false, 'they\'re killing us on pups, let\'s turn it around!'),
        makeSimpleNode(OFFENSE, false, 'going o'),
        makeSimpleNode(DEFENSE, false, 'staying d'),
        makeSimpleNode(SWITCH, false, 'let me know if you want to switch')
      ]
    }

    var generalChat = {
      inputs: [{key: GENERAL_CHAT}],
      outputs: [
        makeSimpleNode(THANKS, true, 'ty'),
        makeSimpleNode(NICE, true, 'nice!'),
        makeSimpleNode(NP, false, 'np :)'),
        makeSimpleNode(NEVERMIND, false, 'nvm'),
        makeSimpleNode(MB, false, 'mb'),
        makeSimpleNode(HEART, true, '<3'),
        makeSimpleNode(ERRANT_MACRO, false, 'disregard, i suck at macros')
      ]
    }

    var helpDirections = makeDirectionNodePair([], helpFn);

    var help = {
      inputs: [{key: HELP}],
      outputs: [
        makeSimpleNode(HELP, false, 'need help!'),
        makeSimpleNode(GATE, false, 'get gate please!'),
        helpDirections[0]
      ],
      fn: makeSimpleFn(false, 'need help!')
    }

    var waiting2 = {
      inputs: [{key: WAITING}],
      outputs: [makeSimpleNode(WAITING, true, 'ok go, gl hf!')],
      fn: makeSimpleFn(true, 'waiting for 3v3')
    }

    var waiting1 = {
      inputs: [{key: WAITING}],
      outputs: [waiting2],
      fn: makeSimpleFn(true, 'wait for 3v3?')
    }

    var switchTeamsConfirm = {
      inputs: [{key: SWITCH_TEAMS}],
      outputs: [],
      auxFn: function() {
        tagpro.socket.emit('switch');
      }
    }
    var switchTeams = {
      inputs: [{key: SWITCH_TEAMS}],
      outputs: [switchTeamsConfirm]
    }

    var macros = {
      inputs: [],
      outputs: [
        powerupsGeneric,
        powerupsSpecific,
        powerupsTimeToggle,
        directionPair[0],
        ourFc,
        enemyFc,
        regrab,
        advice,
        generalChat,
        help,
        waiting1,
        switchTeams
      ],
    };
    console.log('macros:', macros);

    function addToKeys(node, keys) {
      for (var i = 0; i < (node['inputs']||[]).length; i++) {
        var input = node['inputs'][i];
        if (input['key']) keys[input['key']] = true;
      }
      for (var i = 0; i < (node['outputs']||[]).length; i++) {
        addToKeys(node['outputs'][i], keys);
      }
    }

    var macroKeys = {};
    addToKeys(macros, macroKeys);
    console.log('macroKeys:', macroKeys);

    // Game bindings overriding adapted from JohnnyPopcorn's NeoMacro https://gist.github.com/JohnnyPopcorn/8150909
    var handlerbtn = $('#macrohandlerbutton');
    handlerbtn.keydown(keydownHandler)
      .keyup(keyupHandler);
    handlerbtn.focus();

    $(document).keydown(documentKeydown);
    function documentKeydown(event) {
      if (!tagpro.disableControls) {
        handlerbtn.focus(); // The handler button should be always focused
      }
    }

    var timeoutID;
    var currentNode = macros;
    var state = {};

    function resetChatInputs() {
      currentNode = macros;
      clearTimeout(timeoutID);
      state = {};
      //console.log('RESET:', currentNode);
    }

    function sendChat(node) {
      if (node.fn) {
        var chatMessage = node.fn();
        chat(chatMessage);
      } else if (node.auxFn) {
        node.auxFn();
      }
      resetChatInputs();
    }

    function keydownHandler(event) {
      var key = event.keyCode || event.which;
      if (key in macroKeys && !tagpro.spectator &&!tagpro.disableControls) {
        event.preventDefault();
        event.stopPropagation();

        for (var iParent = 0; iParent < (currentNode['outputs']||[]).length; iParent++) {
          var childNode = currentNode['outputs'][iParent];
          for (var iChild = 0; iChild < (childNode['inputs']||[]).length; iChild++) {
            var input = childNode['inputs'][iChild];
            if (input['key'] == key) {
              for (var attr in (input['mixins'] || {})) {
                state[attr] = input['mixins'][attr];
              }
              if ((childNode['outputs']||[]).length == 0) { // terminal node
                sendChat(childNode)
              } else {
                currentNode = childNode;
                clearTimeout(timeoutID);
                timeoutID = setTimeout(function() {
                  sendChat(childNode);
                }, TIMEOUT);
                //console.log('NEW NODE:', currentNode);
              }
              return;
            }
          }
          // key not found, do nothing
        }
      }

      //console.log('currentNode after', currentNode);
    }

    function keyupHandler(event) {
      if (!tagpro.disableControls && !tagpro.spectator && event.keyCode in macroKeys) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    var lastMessage = 0;
    var active = false;
    function chat(chatMessage) {
      var limit = 500 + 10;
      var now = new Date();
      var timeDiff = now - lastMessage;
      if (timeDiff > limit) {
        tagpro.socket.emit("chat", chatMessage);
        lastMessage = new Date();
      } else if (timeDiff >= 0 && !active) {
        active = true;
        setTimeout(function(chatMessage) { chat(chatMessage); active = false }, limit - timeDiff, chatMessage);
      }
    }
  }

  // This dummy input will handle macro keypresses
  var btn = document.createElement("input");
  btn.style.opacity = 0;
  btn.style.position = "absolute";
  btn.style.top = "-100px";
  btn.style.left = "-100px";
  btn.id = "macrohandlerbutton";
  document.body.appendChild(btn);

  contentEval(actualScript);
})();