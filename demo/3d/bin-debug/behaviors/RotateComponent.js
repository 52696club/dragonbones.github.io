"use strict";
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var behaviors;
(function (behaviors) {
    var RotateComponent = (function (_super) {
        __extends(RotateComponent, _super);
        function RotateComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.rotateSpeed = 1.0;
            _this.lookAtPoint = egret3d.Vector3.create();
            _this.target = null;
            _this._radius = 0.0;
            _this._radian = 0.0;
            return _this;
        }
        RotateComponent.prototype.onAwake = function () {
            console.info("onAwake");
        };
        RotateComponent.prototype.onEnable = function () {
            console.info("onEnable");
        };
        RotateComponent.prototype.onStart = function () {
            console.info("onStart");
        };
        RotateComponent.prototype.onFixedUpdate = function (ct, tt) {
            // console.info("onFixedUpdate", ct, tt);
        };
        RotateComponent.prototype.onUpdate = function (deltaTime) {
            var transform = this.gameObject.transform;
            var position = transform.position;
            var target = this.lookAtPoint;
            if (this.target) {
                target.copy(this.target.transform.position);
            }
            if (this.rotateSpeed !== 0.0) {
                var radius = Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.z - target.z, 2));
                var radian = Math.atan2(position.z - target.z, position.x - target.x);
                if (Math.abs(this._radius - radius) > 0.05) {
                    this._radius = radius;
                }
                if (Math.abs(this._radian - radian) > 0.05) {
                    this._radian = radian;
                }
                this._radian += deltaTime * this.rotateSpeed * 0.5;
                // transform.setPosition(
                //     target.x + Math.cos(this._radian) * this._radius,
                //     position.y,
                //     target.z + Math.sin(this._radian) * this._radius
                // );
                position.set(target.x + Math.cos(this._radian) * this._radius, position.y, target.z + Math.sin(this._radian) * this._radius).update();
            }
            transform.lookAt(target);
        };
        RotateComponent.prototype.onLateUpdate = function (deltaTime) {
            // console.info("onLateUpdate");
        };
        RotateComponent.prototype.onDisable = function () {
            console.info("onDisable");
        };
        RotateComponent.prototype.onDestroy = function () {
            console.info("onDestroy");
        };
        __decorate([
            paper.editor.property("FLOAT" /* FLOAT */, { minimum: -10.0, maximum: 10.0 })
        ], RotateComponent.prototype, "rotateSpeed", void 0);
        __decorate([
            paper.editor.property("VECTOR3" /* VECTOR3 */)
        ], RotateComponent.prototype, "lookAtPoint", void 0);
        return RotateComponent;
    }(paper.Behaviour));
    behaviors.RotateComponent = RotateComponent;
    __reflect(RotateComponent.prototype, "behaviors.RotateComponent");
})(behaviors || (behaviors = {}));
