#CONSTANTS
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 600
ENEMIES_PROPABILITY = 0.05
DEFAULT_SPEED = 0.5
DEFAULT_USER_SPEED = 0.1
MAX_NUMBER_ENEMIES = 100

#INIT
##defining the game canvas
ge = game_element = $("<canvas width='#{CANVAS_WIDTH}' height='#{CANVAS_HEIGHT}'></canvas>")
gc = game_canvas = game_element.get(0)
gcc = game_canvas_context = game_canvas.getContext("2d")


#GLOBAL CLASSES

#an abstract class for all game objects in the game

class InGameObject
  constructor: (@active=true, @fill_style='#000', @stroke_style='#000') ->

class MovingInGameObject extends InGameObject
  constructor: (@x, @y, @x_velocity = 0, @y_velocity = 0, fill_style, stroke_style, active) ->
    super(active, fill_style, stroke_style)

  update: =>
    @x += @x_velocity
    @y += @y_velocity


# currently supports two shapes, rectangles and circles
#class MovingInGameObject_deprecated
#  constructor: (@x, @y,  rect_circle, @xVelocity=0, @yVelocity=0, @color = '#000', @active = true) ->
#    {@width, @height} = rect_circle
#    {@radius} = rect_circle
#
#    #for some things we need a to simulate a box
#    if @radius
#      @cx = @x+0
#      @cy = @y+0
#      @setCircleBox()
#
#  inBounds: =>
#    @x >= 0 and
#    @x <= CANVAS_WIDTH and
#    @y >= 0 and
#    @y <= CANVAS_HEIGHT
#
#  update: =>
#    if @radius
#      @cx += @xVelocity
#      @cy += @yVelocity
#      @setCircleBox()
#    else
#      @x += @xVelocity
#      @y += @yVelocity
#
#    @active = @active and @inBounds()
#
#  draw: =>
#    #console.log('draw')
#    gcc.fillStyle = @color
#    gcc.lineWidth = 1
#    #gcc.fillRect(@x, @y, @width, @height)
#    if @radius
#      gcc.fillCircle(@cx, @cy, @radius)
#      #gcc.strokeRect(@x, @y, @width, @height)
#    else
#      gcc.fillRect(@x, @y, @width, @height)
#
#  setCircleBox: =>
#    @width = @height = @radius * 2
#    @x = @cx - @radius
#    @y = @cy - @radius

class RectangleMovingInGameObject extends MovingInGameObject
  constructor: (x, y, @width, @height, x_velocity, y_velocity, fill_style, stroke_style, active) ->
    super(x, y, x_velocity, y_velocity, fill_style, stroke_style, active)

  inBounds: =>
    @x >= 0 and
    @x <= CANVAS_WIDTH and
    @y >= 0 and
    @y <= CANVAS_HEIGHT

  update: =>
    super()
    @active = @active and @inBounds()

  draw: =>
    gcc.fillStyle = @fill_style
    gcc.fillRect(@x, @y, @width, @height)

class CircleMovingInGameObject extends RectangleMovingInGameObject
  constructor: (@cx, @cy, @radius, x_velocity, y_velocity, fill_style, stroke_style, active) ->
    #console.log(@cx)
    @setCircleBox()
    super(@x, @y, @width, @height, x_velocity, y_velocity, fill_style, stroke_style, active)

  #we emulate a box around every circle to support some rectangle methods
  setCircleBox: =>
    @width = @height = @radius * 2
    @x = @cx - @radius
    @y = @cy - @radius

  update: =>
    @cx += @x_velocity
    @cy += @y_velocity
    @setCircleBox()
    #console.log(@active)
    super()
    #console.log(@active)


  draw: (fill=true, stroke=false, drawbox=false) =>
    #console.log('circledraw')
    #console.log(@cx+' '+@cy+' '+@radius) if debug
    if fill
      gcc.fillStyle = @fill_style
      gcc.fillCircle(@cx, @cy, @radius)

    if stroke
      gcc.lineWidth = 2
      gcc.strokeStyle = @stroke_style
      gcc.strokeCircle(@cx, @cy, @radius)

    (gcc.stokeStyle = @stroke_style; gcc.lineWidth = 1; gcc.strokeRect(@x, @y, @width, @height)) if drawbox


#player
class Player extends CircleMovingInGameObject
  constructor: (x, y, radius) ->
    #console.log(x)
#    super(50, 50, { width: 20, height: 20 }, 0, 1, '#0AA')
    super(x, y, radius, 0, 0, 'red', 'black')
    @last_bullet_shot = 0
    @age = 0
  shoot: =>
    [x,y] = @gunpoint()
    (bullets.push(new Bullet(x,y,@x_velocity*1.5, @y_velocity*1.5)); @last_bullet_shot = @age) if @last_bullet_shot + 10 < @age
    @radius--

  gunpoint: =>
    #[@x+@width/2,@y+1]
    [@x+@width/2,@y+@height/2]

  update: =>
    @age++
    #player movements
    #if keydown.left then @cx -= 5
    if keydown.left then @x_velocity = @x_velocity - DEFAULT_USER_SPEED
    #if keydown.right then @cx += 5
    if keydown.right then @x_velocity = @x_velocity + DEFAULT_USER_SPEED
    #if keydown.up then @cy -=5
    if keydown.up then @y_velocity = @y_velocity - DEFAULT_USER_SPEED
    #if keydown.down then @cy += 5
    if keydown.down then @y_velocity = @y_velocity + DEFAULT_USER_SPEED

    #clamp the player
    @cx = @cx.clamp(@radius, CANVAS_WIDTH -  @radius)
    @cy = @cy.clamp(@radius, CANVAS_HEIGHT - @radius)

    @setCircleBox()

    #player special movements
    if keydown.space then @shoot()
    super()

  draw: =>
    super(true,true)

  explode: =>
    console.log('player explode')



class Bullet extends CircleMovingInGameObject
  constructor: (x, y, x_velocity, y_velocity) ->
    #super(@x, @y, { width:3, height:3 }, 0,  @speed)
    super(x, y, 3, x_velocity, y_velocity, 'yellow', 'black')

  draw: =>
    super(true,true)

#the bubbles
class Enemy extends CircleMovingInGameObject
  constructor: () ->

    radius = 10+Math.random()*10
    #where to place the bubble
    where_to_place_the_bubble = Math.random()
    if where_to_place_the_bubble < 0.25
      #top
      y = -radius
      x = Math.random() * CANVAS_WIDTH
      y_velocity = DEFAULT_SPEED
      x_velocity = (DEFAULT_SPEED * -1) + Math.random()*(1+DEFAULT_SPEED)
    else if where_to_place_the_bubble < 0.50
      #bottom
      y = CANVAS_HEIGHT + radius
      x = Math.random() * CANVAS_WIDTH
      y_velocity = (DEFAULT_SPEED * -1)
      x_velocity = (DEFAULT_SPEED * -1) * Math.random()*(1+DEFAULT_SPEED)
    else if where_to_place_the_bubble < 0.75
      #left
      y = Math.random() * CANVAS_HEIGHT
      x = -radius
      x_velocity = 1
      y_velocity = (DEFAULT_SPEED * -1) * Math.random()*(1+DEFAULT_SPEED)
    else
      #right
      y = Math.random() * CANVAS_HEIGHT
      x = CANVAS_WIDTH + radius
      x_velocity = (DEFAULT_SPEED * -1)
      y_velocity = (DEFAULT_SPEED * -1) * Math.random()*(1+DEFAULT_SPEED)
    #x = (radius * 2) + Math.random() * (CANVAS_WIDTH - radius * 2)

    #we deploy the enemis ad y radius as the would be invalidated otherwise by the inBounds method of the Rectangle Object
    #radius = 5+Math.random()*10
    #y = radius
    #super(@cx, @cy, @radius, x_velocity, y_velocity, color, active)
    @age = Math.floor(Math.random()*128)
    super(x, y, radius, x_velocity, y_velocity, 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',0.7)', 'rgb(0,0,255)')

  update: =>
    #we need a new upate method, as we do not set outofbounds object to inactibe, but just swithc their position
    @cx += @x_velocity
    @cy += @y_velocity

    @setCircleBox()
    @x += @x_velocity
    @y += @y_velocity

    if @inBounds() is false
      #console.log('out of bounds '+@x+' '+@y)
      #@x = @x * -1
      if @cx < 0
        @cx = CANVAS_WIDTH + (@cx * -1)
      else #if @cx > CANVAS_WIDTH
        @cx = (@cx - CANVAS_WIDTH) * -1


      if @cy < 0
        @cy = CANVAS_HEIGHT + (@cy * -1)
      else #if @cy > CANVAS_HEIGHT
        @cy = (@cy - CANVAS_HEIGHT) * -1

    #  @x_velocity = 3 * Math.sin(@age * Math.PI / (CANVAS_WIDTH/@radius) );
    @stroke_style = 'black' if @radius > player1.radius

    #TODO make an explosion instead into four enemies
    @stroke_style = 'red' if @radius >= 100
    @age++

  inBounds: =>
    if @cx > (@radius * -1) and
    @cx < (CANVAS_WIDTH + @radius) and
    @cy > (@radius * -1) and
    @cy < (CANVAS_HEIGHT + @radius)
      #console.log('inbounds true')
      return true
    else
      #console.log('inbounds false')
      return false

  explode: =>
    console.log('explode')
    @active=false

  draw: =>
    super(true, true)

  join: (another) =>
    #@radius = 100
    if @radius > another.radius
      #winner = @
      @radius = @radius + 0.5 if @radius < 100
      #@radius = @radius + (another.radius * 1.01)
      another.radius--
    else if @radius < another.radius
      another.radius = another.radius + 0.5  if another.radius < 100
      #another.radius = another.radius + (@radius * 1.01)
      @radius--
    else #bounce
      console.log('same radius')
      @x_velocity = @x_velocity * -1
      @y_velocity = @y_velocity * -1
      #@radius--
      #another.radius--

    @active = false if @radius < 4
    another.active = false if another.radius < 4





#game globals
game = @
bullets = []
enemies = []




#RUNTIME
runtime = (time) ->
  update()
  draw()
  #TODO: make a pollyfill for crossbrowser support
  window.webkitRequestAnimationFrame(runtime, gc)

 #the update methode, executed before every draw
update = ->

  #player
  player1.update()
  #player2.update()
  #we update all bullets and create a new bullets array
  bullets = ( do -> (bullet.update(); bullet) for bullet in bullets when bullet.active)

  #check to join enemies
  for enemy in enemies
    do (enemy) ->
      for enemy2 in enemies when ((enemy2 isnt enemy) and rectCollides(enemy, enemy2) and (enemy2.active and enemy.active))
        do (enemy) ->
          #console.log('enemy join')
          enemy.join(enemy2)

  #we update all enemies and create a new enemies array
  #console.log(enemies)
  enemies =  ( do -> (enemy.update(); enemy) for enemy in enemies when enemy.active)

  #we test for bullet / enemy collision
  for bullet in bullets
    do (bullet) ->
     (enemy.explode(); bullet.active=false) for enemy in enemies when rectCollides(bullet, enemy)


  for enemy in enemies when rectCollides(enemy, player1)
   do (enemy) ->
     if enemy.radius > player1.radius
      #player1.catchedBy(enemy)
     else
      enemy.explode()

  #now is a good time to -maybe- create a new enemy
  # TODO: add one to the number of enemies for every bullet fired
  if enemies.length < MAX_NUMBER_ENEMIES
    enemies.push(new Enemy()) if Math.random() < 0.05


  #doesn't make sanes to return anything right now
  return

#the main draw method, exectued after every update
draw = ->
  #console.log 'draw'
  gcc.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT)


  #player2.draw()
  do bullet.draw for bullet in bullets
  #console.log(enemies)
  do enemy.draw for enemy in enemies

  player1.draw()




#collision

rectCollides = (a,b) ->
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y

#circleCollides





#helpers
#keydown helper
window.keydown = {}

keyName = (event) ->
  $.hotkeys.specialKeys[event.which] or String.fromCharCode(event.which).toLowerCase();

$(document).bind("keydown", ((event) ->
#  console.log 'keydown: "' + keyName(event)+'"'
  keydown[keyName(event)] = true;
  ))

$(document).bind("keyup", ((event) ->
#  console.log 'keyup: "' + keyName(event)+'"'
  keydown[keyName(event)] = false;
  ))

#extending root objects
#clamp (return min number is number is not within a certain range)
Number::clamp = (min, max) -> Math.min(Math.max(this, min), max)

#drawing helpers

# a canvas full circle
CanvasRenderingContext2D::fillCircle = (x,y,radius) ->
  #console.log(@)
  @beginPath()
  @arc(x,y,radius,0,2*Math.PI)
  @fill()

CanvasRenderingContext2D::strokeCircle = (x,y,radius) ->
  #console.log(@)
  @beginPath()
  @arc(x,y,radius,0,2*Math.PI)
  @stroke()

#animator frame helper
#window.requestAnimFrame = ((callback) ->
#    return window.requestAnimationFrame ||
#    window.webkitRequestAnimationFrame ||
#    window.mozRequestAnimationFrame ||
#    window.oRequestAnimationFrame ||
#    window.msRequestAnimationFrame ||
#    (callback) ->
#        window.setTimeout(callback, 1000 / 60)
#)()

#START
#adding the game canvas to the game
$('#gamearea').append(game_element)
player1 = new Player(50,50,20)

#player2 = new Player(75,75,12)

console.log(player1)
runtime()