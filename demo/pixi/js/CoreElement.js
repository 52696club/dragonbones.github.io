var demosPixi;
(function (demosPixi) {
    var coreElement;
    (function (coreElement) {
        var Game = (function () {
            function Game() {
                this.renderer = new PIXI.WebGLRenderer(800, 600, { backgroundColor: 0x666666 });
                this.stage = new PIXI.Container();
                this.factory = new dragonBones.PixiFactory();
                this._backgroud = new PIXI.Sprite(PIXI.Texture.EMPTY);
                this._left = false;
                this._right = false;
                this._player = null;
                this._bullets = [];
                Game.instance = this;
                this._init();
            }
            var d = __define,c=Game,p=c.prototype;
            p._init = function () {
                Game.STAGE_WIDTH = this.renderer.width;
                Game.STAGE_HEIGHT = this.renderer.height;
                Game.GROUND = Game.STAGE_HEIGHT - 100;
                document.body.appendChild(this.renderer.view);
                PIXI.ticker.shared.add(this._renderHandler, this);
                PIXI.loader
                    .add("dragonBonesData", "./resource/assets/CoreElement/CoreElement.json")
                    .add("textureDataA", "./resource/assets/CoreElement/CoreElement_texture_1.json")
                    .add("textureA", "./resource/assets/CoreElement/CoreElement_texture_1.png");
                PIXI.loader.once("complete", this._loadComplateHandler, this);
                PIXI.loader.load();
            };
            p._loadComplateHandler = function (loader, object) {
                this.factory.parseDragonBonesData(object["dragonBonesData"].data);
                this.factory.parseTextureAtlasData(object["textureDataA"].data, object["textureA"].texture);
                this.stage.interactive = true;
                this.stage.on('touchstart', this._touchHandler, this);
                this.stage.on('touchend', this._touchHandler, this);
                this.stage.on('touchmove', this._touchHandler, this);
                this.stage.on('mousedown', this._touchHandler, this);
                this.stage.on('mouseup', this._touchHandler, this);
                this.stage.on('mousemove', this._touchHandler, this);
                this.stage.addChild(this._backgroud);
                this._backgroud.width = Game.STAGE_WIDTH;
                this._backgroud.height = Game.STAGE_HEIGHT;
                document.addEventListener("keydown", this._keyHandler);
                document.addEventListener("keyup", this._keyHandler);
                this._player = new Mecha();
                var text = new PIXI.Text("", { align: "center" });
                text.x = 0;
                text.y = Game.STAGE_HEIGHT - 60;
                text.scale.x = 0.8;
                text.scale.y = 0.8;
                text.text = "Press W/A/S/D to move. Press Q/E/SPACE to switch weapons.\nMouse Move to aim. Click to fire.";
                this.stage.addChild(text);
            };
            p.addBullet = function (bullet) {
                this._bullets.push(bullet);
            };
            p._touchHandler = function (event) {
                this._player.aim(event.data.global.x, event.data.global.y);
                if (event.type == 'touchstart' || event.type == 'mousedown') {
                    this._player.attack(true);
                }
                else if (event.type == 'touchend' || event.type == 'mouseup') {
                    this._player.attack(false);
                }
            };
            p._keyHandler = function (event) {
                var isDown = event.type == "keydown";
                switch (event.keyCode) {
                    case 37:
                    case 65:
                        Game.instance._left = isDown;
                        Game.instance._updateMove(-1);
                        break;
                    case 39:
                    case 68:
                        Game.instance._right = isDown;
                        Game.instance._updateMove(1);
                        break;
                    case 38:
                    case 87:
                        if (isDown) {
                            Game.instance._player.jump();
                        }
                        break;
                    case 83:
                    case 40:
                        Game.instance._player.squat(isDown);
                        break;
                    case 81:
                        if (isDown) {
                            Game.instance._player.switchWeaponR();
                        }
                        break;
                    case 69:
                        if (isDown) {
                            Game.instance._player.switchWeaponL();
                        }
                        break;
                    case 32:
                        if (isDown) {
                            Game.instance._player.switchWeaponR();
                            Game.instance._player.switchWeaponL();
                        }
                        break;
                }
            };
            p._renderHandler = function (deltaTime) {
                if (this._player) {
                    this._player.update();
                }
                var i = this._bullets.length;
                while (i--) {
                    var bullet = this._bullets[i];
                    if (bullet.update()) {
                        this._bullets.splice(i, 1);
                    }
                }
                dragonBones.WorldClock.clock.advanceTime(-1);
                this.renderer.render(this.stage);
            };
            p._updateMove = function (dir) {
                if (this._left && this._right) {
                    this._player.move(dir);
                }
                else if (this._left) {
                    this._player.move(-1);
                }
                else if (this._right) {
                    this._player.move(1);
                }
                else {
                    this._player.move(0);
                }
            };
            Game.STAGE_WIDTH = 0;
            Game.STAGE_HEIGHT = 0;
            Game.GROUND = 300;
            Game.G = 0.6;
            Game.instance = null;
            return Game;
        }());
        coreElement.Game = Game;
        egret.registerClass(Game,'demosPixi.coreElement.Game');
        var Mecha = (function () {
            function Mecha() {
                this._isJumpingA = false;
                this._isJumpingB = false;
                this._isSquating = false;
                this._isAttackingA = false;
                this._isAttackingB = false;
                this._weaponRIndex = 0;
                this._weaponLIndex = 0;
                this._faceDir = 1;
                this._aimDir = 0;
                this._moveDir = 0;
                this._aimRadian = 0;
                this._speedX = 0;
                this._speedY = 0;
                this._armature = null;
                this._armatureDisplay = null;
                this._weaponR = null;
                this._weaponL = null;
                this._aimState = null;
                this._walkState = null;
                this._attackState = null;
                this._target = new PIXI.Point();
                this._armature = Game.instance.factory.buildArmature("mecha_1502b");
                this._armatureDisplay = this._armature.display;
                this._armatureDisplay.x = Game.STAGE_WIDTH * 0.5;
                this._armatureDisplay.y = Game.GROUND;
                this._armatureDisplay.scale.set(1, 1);
                this._armature.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
                this._armature.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
                // Mecha effects only controled by normalAnimation.
                this._armature.getSlot("effects_1").displayController = Mecha.NORMAL_ANIMATION_GROUP;
                this._armature.getSlot("effects_2").displayController = Mecha.NORMAL_ANIMATION_GROUP;
                // Get weapon childArmature.
                this._weaponR = this._armature.getSlot("weapon_r").childArmature;
                this._weaponL = this._armature.getSlot("weapon_l").childArmature;
                this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
                this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
                this._updateAnimation();
                Game.instance.stage.addChild(this._armatureDisplay);
                dragonBones.WorldClock.clock.add(this._armature);
            }
            var d = __define,c=Mecha,p=c.prototype;
            p.move = function (dir) {
                if (this._moveDir == dir) {
                    return;
                }
                this._moveDir = dir;
                this._updateAnimation();
            };
            p.jump = function () {
                if (this._isJumpingA) {
                    return;
                }
                this._isJumpingA = true;
                this._armature.animation.fadeIn("jump_1", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                this._walkState = null;
            };
            p.squat = function (isSquating) {
                if (this._isSquating == isSquating) {
                    return;
                }
                this._isSquating = isSquating;
                this._updateAnimation();
            };
            p.attack = function (isAttacking) {
                if (this._isAttackingA == isAttacking) {
                    return;
                }
                this._isAttackingA = isAttacking;
            };
            p.switchWeaponR = function () {
                this._weaponRIndex++;
                if (this._weaponRIndex >= Mecha.WEAPON_R_LIST.length) {
                    this._weaponRIndex = 0;
                }
                this._weaponR.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
                var weaponName = Mecha.WEAPON_R_LIST[this._weaponRIndex];
                this._weaponR = Game.instance.factory.buildArmature(weaponName);
                this._armature.getSlot("weapon_r").childArmature = this._weaponR;
                this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            };
            p.switchWeaponL = function () {
                this._weaponLIndex++;
                if (this._weaponLIndex >= Mecha.WEAPON_L_LIST.length) {
                    this._weaponLIndex = 0;
                }
                this._weaponL.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
                var weaponName = Mecha.WEAPON_L_LIST[this._weaponLIndex];
                this._weaponL = Game.instance.factory.buildArmature(weaponName);
                this._armature.getSlot("weapon_l").childArmature = this._weaponL;
                this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            };
            p.aim = function (x, y) {
                if (this._aimDir == 0) {
                    this._aimDir = 10;
                }
                this._target.x = x;
                this._target.y = y;
            };
            p.update = function () {
                this._updatePosition();
                this._updateAim();
                this._updateAttack();
            };
            p._animationEventHandler = function (event) {
                switch (event.type) {
                    case dragonBones.EventObject.FADE_IN_COMPLETE:
                        if (event.animationState.name == "jump_1") {
                            this._isJumpingB = true;
                            this._speedY = -Mecha.JUMP_SPEED;
                            this._armature.animation.fadeIn("jump_2", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                        }
                        else if (event.animationState.name == "jump_4") {
                            this._updateAnimation();
                        }
                        break;
                    case dragonBones.EventObject.FADE_OUT_COMPLETE:
                        if (event.animationState.name == "attack_01") {
                            this._isAttackingB = false;
                            this._attackState = null;
                        }
                        break;
                }
            };
            p._frameEventHandler = function (event) {
                if (event.name == "onFire") {
                    var firePointBone = event.armature.getBone("firePoint");
                    Mecha._globalPoint.x = firePointBone.global.x;
                    Mecha._globalPoint.y = firePointBone.global.y;
                    Mecha._globalPoint = event.armature.display.toGlobal(Mecha._globalPoint);
                    this._fire(Mecha._globalPoint);
                }
            };
            p._fire = function (firePoint) {
                firePoint.x += Math.random() * 2 - 1;
                firePoint.y += Math.random() * 2 - 1;
                var radian = this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian;
                var bullet = new Bullet("bullet_01", "fireEffect_01", radian + Math.random() * 0.02 - 0.01, 40, firePoint);
                Game.instance.addBullet(bullet);
            };
            p._updateAnimation = function () {
                if (this._isJumpingA) {
                    return;
                }
                if (this._isSquating) {
                    this._speedX = 0;
                    this._armature.animation.fadeIn("squat", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    this._walkState = null;
                    return;
                }
                if (this._moveDir == 0) {
                    this._speedX = 0;
                    this._armature.animation.fadeIn("idle", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    this._walkState = null;
                }
                else {
                    if (!this._walkState) {
                        this._walkState = this._armature.animation.fadeIn("walk", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    }
                    if (this._moveDir * this._faceDir > 0) {
                        this._walkState.timeScale = Mecha.MAX_MOVE_SPEED_FRONT / Mecha.NORMALIZE_MOVE_SPEED;
                    }
                    else {
                        this._walkState.timeScale = -Mecha.MAX_MOVE_SPEED_BACK / Mecha.NORMALIZE_MOVE_SPEED;
                    }
                    if (this._moveDir * this._faceDir > 0) {
                        this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                    }
                    else {
                        this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                    }
                }
            };
            p._updatePosition = function () {
                if (this._speedX != 0) {
                    this._armatureDisplay.x += this._speedX;
                    if (this._armatureDisplay.x < 0) {
                        this._armatureDisplay.x = 0;
                    }
                    else if (this._armatureDisplay.x > Game.STAGE_WIDTH) {
                        this._armatureDisplay.x = Game.STAGE_WIDTH;
                    }
                }
                if (this._speedY != 0) {
                    if (this._speedY < 5 && this._speedY + Game.G >= 5) {
                        this._armature.animation.fadeIn("jump_3", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    }
                    this._speedY += Game.G;
                    this._armatureDisplay.y += this._speedY;
                    if (this._armatureDisplay.y > Game.GROUND) {
                        this._armatureDisplay.y = Game.GROUND;
                        this._isJumpingA = false;
                        this._isJumpingB = false;
                        this._speedY = 0;
                        this._speedX = 0;
                        this._armature.animation.fadeIn("jump_4", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                        if (this._isSquating || this._moveDir) {
                            this._updateAnimation();
                        }
                    }
                }
            };
            p._updateAim = function () {
                if (this._aimDir == 0) {
                    return;
                }
                this._faceDir = this._target.x > this._armatureDisplay.x ? 1 : -1;
                if (this._armatureDisplay.scale.x * this._faceDir < 0) {
                    this._armatureDisplay.scale.x *= -1;
                    if (this._moveDir) {
                        this._updateAnimation();
                    }
                }
                var aimOffsetY = this._armature.getBone("chest").global.y * this._armatureDisplay.scale.y;
                if (this._faceDir > 0) {
                    this._aimRadian = Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                }
                else {
                    this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                    if (this._aimRadian > Math.PI) {
                        this._aimRadian -= Math.PI * 2;
                    }
                }
                var aimDir = 0;
                if (this._aimRadian > 0) {
                    aimDir = -1;
                }
                else {
                    aimDir = 1;
                }
                if (this._aimDir != aimDir) {
                    this._aimDir = aimDir;
                    // Animation mixing.
                    if (this._aimDir >= 0) {
                        this._aimState = this._armature.animation.fadeIn("aimUp", 0, 1, 0, Mecha.AIM_ANIMATION_GROUP, 2 /* SameGroup */);
                    }
                    else {
                        this._aimState = this._armature.animation.fadeIn("aimDown", 0, 1, 0, Mecha.AIM_ANIMATION_GROUP, 2 /* SameGroup */);
                    }
                }
                this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2);
                //_armature.invalidUpdate("pelvis"); // Only update bone mask.
                this._armature.invalidUpdate();
            };
            p._updateAttack = function () {
                if (!this._isAttackingA || this._isAttackingB) {
                    return;
                }
                this._isAttackingB = true;
                // Animation mixing.
                this._attackState = this._armature.animation.fadeIn("attack_01", -1, -1, 0, Mecha.ATTACK_ANIMATION_GROUP, 2 /* SameGroup */);
                this._attackState.autoFadeOutTime = this._attackState.fadeTotalTime;
                this._attackState.addBoneMask("pelvis");
            };
            Mecha.NORMAL_ANIMATION_GROUP = "normal";
            Mecha.AIM_ANIMATION_GROUP = "aim";
            Mecha.ATTACK_ANIMATION_GROUP = "attack";
            Mecha.JUMP_SPEED = 20;
            Mecha.NORMALIZE_MOVE_SPEED = 3.6;
            Mecha.MAX_MOVE_SPEED_FRONT = Mecha.NORMALIZE_MOVE_SPEED * 1.4;
            Mecha.MAX_MOVE_SPEED_BACK = Mecha.NORMALIZE_MOVE_SPEED * 1.0;
            Mecha.WEAPON_R_LIST = ["weapon_1502b_r", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", "weapon_1005e"];
            Mecha.WEAPON_L_LIST = ["weapon_1502b_l", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d"];
            Mecha._globalPoint = new PIXI.Point();
            return Mecha;
        }());
        egret.registerClass(Mecha,'Mecha');
        var Bullet = (function () {
            function Bullet(armatureName, effectArmatureName, radian, speed, position) {
                this._speedX = 0;
                this._speedY = 0;
                this._armature = null;
                this._armatureDisplay = null;
                this._effect = null;
                this._speedX = Math.cos(radian) * speed;
                this._speedY = Math.sin(radian) * speed;
                this._armature = Game.instance.factory.buildArmature(armatureName);
                this._armatureDisplay = this._armature.display;
                this._armatureDisplay.x = position.x;
                this._armatureDisplay.y = position.y;
                this._armatureDisplay.rotation = radian;
                this._armature.animation.play("idle");
                if (effectArmatureName) {
                    this._effect = Game.instance.factory.buildArmature(effectArmatureName);
                    var effectDisplay = this._effect.display;
                    effectDisplay.rotation = radian;
                    effectDisplay.x = position.x;
                    effectDisplay.y = position.y;
                    effectDisplay.scale.set(1 + Math.random() * 1, 1 + Math.random() * 0.5);
                    if (Math.random() < 0.5) {
                        effectDisplay.scale.y *= -1;
                    }
                    this._effect.animation.play("idle");
                    dragonBones.WorldClock.clock.add(this._effect);
                    Game.instance.stage.addChild(effectDisplay);
                }
                dragonBones.WorldClock.clock.add(this._armature);
                Game.instance.stage.addChild(this._armatureDisplay);
            }
            var d = __define,c=Bullet,p=c.prototype;
            p.update = function () {
                this._armatureDisplay.x += this._speedX;
                this._armatureDisplay.y += this._speedY;
                if (this._armatureDisplay.x < -100 || this._armatureDisplay.x >= Game.STAGE_WIDTH + 100 ||
                    this._armatureDisplay.y < -100 || this._armatureDisplay.y >= Game.STAGE_HEIGHT + 100) {
                    dragonBones.WorldClock.clock.remove(this._armature);
                    Game.instance.stage.removeChild(this._armatureDisplay);
                    this._armature.dispose();
                    if (this._effect) {
                        dragonBones.WorldClock.clock.remove(this._effect);
                        Game.instance.stage.removeChild(this._effect.display);
                        this._effect.dispose();
                    }
                    return true;
                }
                return false;
            };
            return Bullet;
        }());
        egret.registerClass(Bullet,'Bullet');
    })(coreElement = demosPixi.coreElement || (demosPixi.coreElement = {}));
})(demosPixi || (demosPixi = {}));
//# sourceMappingURL=CoreElement.js.map