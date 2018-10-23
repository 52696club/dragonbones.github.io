"use strict";
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (false) {
                RES.processor.map("json", new JSONProcessor());
            }
            exampleStart();
            return [2 /*return*/];
        });
    });
}
var JSONProcessor = (function () {
    function JSONProcessor() {
    }
    JSONProcessor.prototype.onLoadStart = function (host, resource) {
        return __awaiter(this, void 0, void 0, function () {
            var type, data, r, data, uint8, result_1, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = resource.type;
                        if (!(type === 'legacyResourceConfig')) return [3 /*break*/, 1];
                        data = host.load(resource, RES.processor.JsonProcessor);
                        return [2 /*return*/, data];
                    case 1:
                        if (!!this._mergedCache) return [3 /*break*/, 3];
                        r = host.resourceConfig['getResource']("1.jsonbin");
                        return [4 /*yield*/, host.load(r, "bin")];
                    case 2:
                        data = _a.sent();
                        if (!this._mergedCache) {
                            uint8 = new Uint8Array(data);
                            result_1 = pako.inflate(uint8, { to: 'string' });
                            this._mergedCache = JSON.parse(result_1);
                        }
                        _a.label = 3;
                    case 3:
                        result = this._mergedCache[resource.name];
                        if (!result) {
                            throw "missing resource " + resource.name;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JSONProcessor.prototype.onRemoveStart = function (host, resource) {
    };
    JSONProcessor.prototype.getData = function (host, resource, key, subkey) {
        throw new Error("Method not implemented.");
    };
    return JSONProcessor;
}());
__reflect(JSONProcessor.prototype, "JSONProcessor", ["RES.processor.Processor"]);
function exampleStart() {
    var exampleString = getCurrentExampleString();
    var exampleClass;
    if (exampleString.indexOf(".") > 0) {
        var params = exampleString.split(".");
        exampleClass = window.examples[params[0]][params[1]];
    }
    else {
        exampleClass = window.examples[exampleString];
    }
    createGUI(exampleString);
    var exampleObj = new exampleClass();
    exampleObj.start();
    function createGUI(exampleString) {
        var namespaceExamples = window.examples;
        var examples = [];
        for (var k in namespaceExamples) {
            var element = namespaceExamples[k];
            if (element.constructor === Object) {
                for (var kB in element) {
                    examples.push([k, kB].join("."));
                }
            }
            else {
                examples.push(k);
            }
        }
        var guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(paper.editor.GUIComponent);
        var gui = guiComponent.hierarchy.addFolder("Examples");
        var options = {
            example: exampleString
        };
        gui.add(options, "example", examples).onChange(function (example) {
            location.href = getNewUrl(example);
        });
        gui.open();
    }
    function getNewUrl(exampleString) {
        var url = location.href;
        var index = url.indexOf("?");
        if (index !== -1) {
            url = url.slice(0, index);
        }
        if (url.indexOf(".html") === -1) {
            url += "index.html";
        }
        url += "?example=" + exampleString;
        return url;
    }
    function getCurrentExampleString() {
        var appFile = "Test";
        var str = location.search;
        str = str.slice(1, str.length);
        var totalArray = str.split("&");
        for (var i = 0; i < totalArray.length; i++) {
            var itemArray = totalArray[i].split("=");
            if (itemArray.length === 2) {
                var key = itemArray[0];
                var value = itemArray[1];
                if (key === "example") {
                    appFile = value;
                    break;
                }
            }
        }
        return appFile;
    }
}
