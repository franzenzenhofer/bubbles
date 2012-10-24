#! /bin/bash
#cd ~/dev/games/bubbles/
open . 
sh build.sh
open index.html
open -a /Applications/Aquamacs.app src/*.coffee build.sh
open -a /Applications/TextWrangler.app bubbles.js
#coffee --join bubbles.js -c src/constants.coffee src/init.coffee src/globals.coffee src/main.coffee 
