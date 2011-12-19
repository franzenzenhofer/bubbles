(function() {
  var Bullet, CANVAS_HEIGHT, CANVAS_WIDTH, CircleMovingInGameObject, DEFAULT_SPEED, DEFAULT_USER_SPEED, ENEMIES_PROPABILITY, Enemy, InGameObject, MAX_NUMBER_ENEMIES, MovingInGameObject, Player, RectangleMovingInGameObject, bullets, draw, enemies, game, game_canvas, game_canvas_context, game_element, gc, gcc, ge, keyName, player1, rectCollides, runtime, update;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  CANVAS_WIDTH = 800;
  CANVAS_HEIGHT = 600;
  ENEMIES_PROPABILITY = 0.05;
  DEFAULT_SPEED = 0.5;
  DEFAULT_USER_SPEED = 0.1;
  MAX_NUMBER_ENEMIES = 100;
  ge = game_element = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
  gc = game_canvas = game_element.get(0);
  gcc = game_canvas_context = game_canvas.getContext("2d");
  InGameObject = (function() {
    function InGameObject(active, fill_style, stroke_style) {
      this.active = active != null ? active : true;
      this.fill_style = fill_style != null ? fill_style : '#000';
      this.stroke_style = stroke_style != null ? stroke_style : '#000';
    }
    return InGameObject;
  })();
  MovingInGameObject = (function() {
    __extends(MovingInGameObject, InGameObject);
    function MovingInGameObject(x, y, x_velocity, y_velocity, fill_style, stroke_style, active) {
      this.x = x;
      this.y = y;
      this.x_velocity = x_velocity != null ? x_velocity : 0;
      this.y_velocity = y_velocity != null ? y_velocity : 0;
      this.update = __bind(this.update, this);
      MovingInGameObject.__super__.constructor.call(this, active, fill_style, stroke_style);
    }
    MovingInGameObject.prototype.update = function() {
      this.x += this.x_velocity;
      return this.y += this.y_velocity;
    };
    return MovingInGameObject;
  })();
  RectangleMovingInGameObject = (function() {
    __extends(RectangleMovingInGameObject, MovingInGameObject);
    function RectangleMovingInGameObject(x, y, width, height, x_velocity, y_velocity, fill_style, stroke_style, active) {
      this.width = width;
      this.height = height;
      this.draw = __bind(this.draw, this);
      this.update = __bind(this.update, this);
      this.inBounds = __bind(this.inBounds, this);
      RectangleMovingInGameObject.__super__.constructor.call(this, x, y, x_velocity, y_velocity, fill_style, stroke_style, active);
    }
    RectangleMovingInGameObject.prototype.inBounds = function() {
      return this.x >= 0 && this.x <= CANVAS_WIDTH && this.y >= 0 && this.y <= CANVAS_HEIGHT;
    };
    RectangleMovingInGameObject.prototype.update = function() {
      RectangleMovingInGameObject.__super__.update.call(this);
      return this.active = this.active && this.inBounds();
    };
    RectangleMovingInGameObject.prototype.draw = function() {
      gcc.fillStyle = this.fill_style;
      return gcc.fillRect(this.x, this.y, this.width, this.height);
    };
    return RectangleMovingInGameObject;
  })();
  CircleMovingInGameObject = (function() {
    __extends(CircleMovingInGameObject, RectangleMovingInGameObject);
    function CircleMovingInGameObject(cx, cy, radius, x_velocity, y_velocity, fill_style, stroke_style, active) {
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.draw = __bind(this.draw, this);
      this.update = __bind(this.update, this);
      this.setCircleBox = __bind(this.setCircleBox, this);
      this.setCircleBox();
      CircleMovingInGameObject.__super__.constructor.call(this, this.x, this.y, this.width, this.height, x_velocity, y_velocity, fill_style, stroke_style, active);
    }
    CircleMovingInGameObject.prototype.setCircleBox = function() {
      this.width = this.height = this.radius * 2;
      this.x = this.cx - this.radius;
      return this.y = this.cy - this.radius;
    };
    CircleMovingInGameObject.prototype.update = function() {
      this.cx += this.x_velocity;
      this.cy += this.y_velocity;
      this.setCircleBox();
      return CircleMovingInGameObject.__super__.update.call(this);
    };
    CircleMovingInGameObject.prototype.draw = function(fill, stroke, drawbox) {
      if (fill == null) {
        fill = true;
      }
      if (stroke == null) {
        stroke = false;
      }
      if (drawbox == null) {
        drawbox = false;
      }
      if (fill) {
        gcc.fillStyle = this.fill_style;
        gcc.fillCircle(this.cx, this.cy, this.radius);
      }
      if (stroke) {
        gcc.lineWidth = 2;
        gcc.strokeStyle = this.stroke_style;
        gcc.strokeCircle(this.cx, this.cy, this.radius);
      }
      if (drawbox) {
        gcc.stokeStyle = this.stroke_style;
        gcc.lineWidth = 1;
        return gcc.strokeRect(this.x, this.y, this.width, this.height);
      }
    };
    return CircleMovingInGameObject;
  })();
  Player = (function() {
    __extends(Player, CircleMovingInGameObject);
    function Player(x, y, radius) {
      this.explode = __bind(this.explode, this);
      this.draw = __bind(this.draw, this);
      this.update = __bind(this.update, this);
      this.gunpoint = __bind(this.gunpoint, this);
      this.shoot = __bind(this.shoot, this);      Player.__super__.constructor.call(this, x, y, radius, 0, 0, 'red', 'black');
      this.last_bullet_shot = 0;
      this.age = 0;
    }
    Player.prototype.shoot = function() {
      var x, y, _ref;
      _ref = this.gunpoint(), x = _ref[0], y = _ref[1];
      if (this.last_bullet_shot + 10 < this.age) {
        bullets.push(new Bullet(x, y, this.x_velocity * 1.5, this.y_velocity * 1.5));
        this.last_bullet_shot = this.age;
      }
      return this.radius--;
    };
    Player.prototype.gunpoint = function() {
      return [this.x + this.width / 2, this.y + this.height / 2];
    };
    Player.prototype.update = function() {
      this.age++;
      if (keydown.left) {
        this.x_velocity = this.x_velocity - DEFAULT_USER_SPEED;
      }
      if (keydown.right) {
        this.x_velocity = this.x_velocity + DEFAULT_USER_SPEED;
      }
      if (keydown.up) {
        this.y_velocity = this.y_velocity - DEFAULT_USER_SPEED;
      }
      if (keydown.down) {
        this.y_velocity = this.y_velocity + DEFAULT_USER_SPEED;
      }
      this.cx = this.cx.clamp(this.radius, CANVAS_WIDTH - this.radius);
      this.cy = this.cy.clamp(this.radius, CANVAS_HEIGHT - this.radius);
      this.setCircleBox();
      if (keydown.space) {
        this.shoot();
      }
      return Player.__super__.update.call(this);
    };
    Player.prototype.draw = function() {
      return Player.__super__.draw.call(this, true, true);
    };
    Player.prototype.explode = function() {
      return console.log('player explode');
    };
    return Player;
  })();
  Bullet = (function() {
    __extends(Bullet, CircleMovingInGameObject);
    function Bullet(x, y, x_velocity, y_velocity) {
      this.draw = __bind(this.draw, this);      Bullet.__super__.constructor.call(this, x, y, 3, x_velocity, y_velocity, 'yellow', 'black');
    }
    Bullet.prototype.draw = function() {
      return Bullet.__super__.draw.call(this, true, true);
    };
    return Bullet;
  })();
  Enemy = (function() {
    __extends(Enemy, CircleMovingInGameObject);
    function Enemy() {
      this.join = __bind(this.join, this);
      this.draw = __bind(this.draw, this);
      this.explode = __bind(this.explode, this);
      this.inBounds = __bind(this.inBounds, this);
      this.update = __bind(this.update, this);
      var radius, where_to_place_the_bubble, x, x_velocity, y, y_velocity;
      radius = 10 + Math.random() * 10;
      where_to_place_the_bubble = Math.random();
      if (where_to_place_the_bubble < 0.25) {
        y = -radius;
        x = Math.random() * CANVAS_WIDTH;
        y_velocity = DEFAULT_SPEED;
        x_velocity = (DEFAULT_SPEED * -1) + Math.random() * (1 + DEFAULT_SPEED);
      } else if (where_to_place_the_bubble < 0.50) {
        y = CANVAS_HEIGHT + radius;
        x = Math.random() * CANVAS_WIDTH;
        y_velocity = DEFAULT_SPEED * -1;
        x_velocity = (DEFAULT_SPEED * -1) * Math.random() * (1 + DEFAULT_SPEED);
      } else if (where_to_place_the_bubble < 0.75) {
        y = Math.random() * CANVAS_HEIGHT;
        x = -radius;
        x_velocity = 1;
        y_velocity = (DEFAULT_SPEED * -1) * Math.random() * (1 + DEFAULT_SPEED);
      } else {
        y = Math.random() * CANVAS_HEIGHT;
        x = CANVAS_WIDTH + radius;
        x_velocity = DEFAULT_SPEED * -1;
        y_velocity = (DEFAULT_SPEED * -1) * Math.random() * (1 + DEFAULT_SPEED);
      }
      this.age = Math.floor(Math.random() * 128);
      Enemy.__super__.constructor.call(this, x, y, radius, x_velocity, y_velocity, 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',0.7)', 'rgb(0,0,255)');
    }
    Enemy.prototype.update = function() {
      this.cx += this.x_velocity;
      this.cy += this.y_velocity;
      this.setCircleBox();
      this.x += this.x_velocity;
      this.y += this.y_velocity;
      if (this.inBounds() === false) {
        if (this.cx < 0) {
          this.cx = CANVAS_WIDTH + (this.cx * -1);
        } else {
          this.cx = (this.cx - CANVAS_WIDTH) * -1;
        }
        if (this.cy < 0) {
          this.cy = CANVAS_HEIGHT + (this.cy * -1);
        } else {
          this.cy = (this.cy - CANVAS_HEIGHT) * -1;
        }
      }
      if (this.radius > player1.radius) {
        this.stroke_style = 'black';
      }
      if (this.radius >= 100) {
        this.stroke_style = 'red';
      }
      return this.age++;
    };
    Enemy.prototype.inBounds = function() {
      if (this.cx > (this.radius * -1) && this.cx < (CANVAS_WIDTH + this.radius) && this.cy > (this.radius * -1) && this.cy < (CANVAS_HEIGHT + this.radius)) {
        return true;
      } else {
        return false;
      }
    };
    Enemy.prototype.explode = function() {
      console.log('explode');
      return this.active = false;
    };
    Enemy.prototype.draw = function() {
      return Enemy.__super__.draw.call(this, true, true);
    };
    Enemy.prototype.join = function(another) {
      if (this.radius > another.radius) {
        if (this.radius < 100) {
          this.radius = this.radius + 0.5;
        }
        another.radius--;
      } else if (this.radius < another.radius) {
        if (another.radius < 100) {
          another.radius = another.radius + 0.5;
        }
        this.radius--;
      } else {
        console.log('same radius');
        this.x_velocity = this.x_velocity * -1;
        this.y_velocity = this.y_velocity * -1;
      }
      if (this.radius < 4) {
        this.active = false;
      }
      if (another.radius < 4) {
        return another.active = false;
      }
    };
    return Enemy;
  })();
  game = this;
  bullets = [];
  enemies = [];
  runtime = function(time) {
    update();
    draw();
    return window.webkitRequestAnimationFrame(runtime, gc);
  };
  update = function() {
    var bullet, enemy, _fn, _fn2, _i, _j, _k, _len, _len2, _len3;
    player1.update();
    bullets = (function() {
      var bullet, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = bullets.length; _i < _len; _i++) {
        bullet = bullets[_i];
        if (bullet.active) {
          _results.push((bullet.update(), bullet));
        }
      }
      return _results;
    })();
    _fn = function(enemy) {
      var enemy2, _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = enemies.length; _j < _len2; _j++) {
        enemy2 = enemies[_j];
        if ((enemy2 !== enemy) && rectCollides(enemy, enemy2) && (enemy2.active && enemy.active)) {
          _results.push((function(enemy) {
            return enemy.join(enemy2);
          })(enemy));
        }
      }
      return _results;
    };
    for (_i = 0, _len = enemies.length; _i < _len; _i++) {
      enemy = enemies[_i];
      _fn(enemy);
    }
    enemies = (function() {
      var enemy, _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = enemies.length; _j < _len2; _j++) {
        enemy = enemies[_j];
        if (enemy.active) {
          _results.push((enemy.update(), enemy));
        }
      }
      return _results;
    })();
    _fn2 = function(bullet) {
      var enemy, _k, _len3, _results;
      _results = [];
      for (_k = 0, _len3 = enemies.length; _k < _len3; _k++) {
        enemy = enemies[_k];
        if (rectCollides(bullet, enemy)) {
          _results.push((enemy.explode(), bullet.active = false));
        }
      }
      return _results;
    };
    for (_j = 0, _len2 = bullets.length; _j < _len2; _j++) {
      bullet = bullets[_j];
      _fn2(bullet);
    }
    for (_k = 0, _len3 = enemies.length; _k < _len3; _k++) {
      enemy = enemies[_k];
      if (rectCollides(enemy, player1)) {
        (function(enemy) {
          if (enemy.radius > player1.radius) {} else {
            return enemy.explode();
          }
        })(enemy);
      }
    }
    if (enemies.length < MAX_NUMBER_ENEMIES) {
      if (Math.random() < 0.05) {
        enemies.push(new Enemy());
      }
    }
  };
  draw = function() {
    var bullet, enemy, _i, _j, _len, _len2;
    gcc.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (_i = 0, _len = bullets.length; _i < _len; _i++) {
      bullet = bullets[_i];
      bullet.draw();
    }
    for (_j = 0, _len2 = enemies.length; _j < _len2; _j++) {
      enemy = enemies[_j];
      enemy.draw();
    }
    return player1.draw();
  };
  rectCollides = function(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  };
  window.keydown = {};
  keyName = function(event) {
    return $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
  };
  $(document).bind("keydown", (function(event) {
    return keydown[keyName(event)] = true;
  }));
  $(document).bind("keyup", (function(event) {
    return keydown[keyName(event)] = false;
  }));
  Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };
  CanvasRenderingContext2D.prototype.fillCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI);
    return this.fill();
  };
  CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI);
    return this.stroke();
  };
  $('#gamearea').append(game_element);
  player1 = new Player(50, 50, 20);
  console.log(player1);
  runtime();
}).call(this);
