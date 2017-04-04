;!function(win) {
	"use strict";

	var YeahUI = function() {
		this.version = "1.0";
		this.name = "yeah-ui";
	}

	YeahUI.fn = YeahUI.prototype;

	var doc = document,
		config = YeahUI.fn.cache = {},
		/* 获取当前脚本所在目录 */
		getPath = function(){
			var js = doc.scripts,
				jsPath = js[js.length - 1].src;
			return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
		}(),
		logError = function(msg) {
			win.console && console.error && console.error("error: " + msg);
		},
		throwError = function(msg) {
			throw new Error(msg);
		},
		modules = {
			"jquery" : "jquery",
			"ccode" : "ccode",
			"message" : "message"
		};
		config.modules = {};
		config.status = {};
		config.timeout = 5000;


	YeahUI.fn.define = function(mods, callback) {
		var _this = this,
			isFunction = typeof mods === "function",
			addModule = function() {
				typeof callback === "function" && callback(function(module, exports) {
					yeahui[module] = exports;
					config.status[module] = true;
				});
				return this;
			}
		isFunction && (
			callback = mods,
			mods = []
		);

		_this.require(mods, addModule);
		return _this;
	}

	YeahUI.fn.require = function(mods, callback, exports) {
		var _this = this,
			dir = config.dir = config.dir ? config.dir : getPath,
			head = document.getElementsByTagName("head")[0];
			mods = typeof mods === "string" ? [mods] : mods;		

		if(win.jQuery && jQuery.fn.on) {
			_this.foreach(mods, function(index, item) {
				if(item === "jquery") {
					mods.splice(index, 1);
				}
			});
			yeahui["jquery"] = jQuery;
		}

		if(mods.length == 0 || typeof mods[0] === "undefined") {
			typeof callback === "function" && callback.apply(yeahui, exports);
			return;
		}

		var module = mods[0],
			timeout = 0,
			exports = exports || [];

		config.host = config.host || (dir.match(/\/\/([\s\S]+?)\//)||['//'+ location.host +'/'])[0];

		var script = doc.createElement("script"),
			url = (modules[module] ? (dir + "yeah/modules/") : (config.base || "")) 
				+ (_this.getModules()[module] || module) + ".js";
		script.type = "text/javascript";
		script.async = true;
		script.charset = "utf-8";
		script.src = url + _this.generateVersion();

		function scriptLoaded(url) {
			if (!/*@cc_on!@*/0) { //if not IE
		        //Firefox2、Firefox3、Safari3.1+、Opera9.6+ support js.onload
		        script.onload = function () {
		        	config.modules[module] = url;
		            config.status[module] = true;
		            poll();
		        }
		    } else {
		        //IE6、IE7 support js.onreadystatechange
		        script.onreadystatechange = function () {
		            if (js.readyState == 'loaded' || js.readyState == 'complete') {
		            	config.modules[module] = url;
		                config.status[module] = true;
		                poll();
		            }
		        }
		    }
		}

		function poll() {
			if(++timeout > config.timeout / 100) {
				return logError("Load the module [" + module + "] is timeout");
			}
			if(config.status[module]) {
				executeCallback();
			} else {
				setTimeout(poll, 100);
			}
		}

		if(!config.modules[module]) {
			head.appendChild(script);
			scriptLoaded(url);
		} else {
			(function spoll() {
				if(++timeout > config.timeout / 100) {
					return logError("Load the module [" + module + "] is timeout");
				}
				if(typeof config.modules[module] === "string" && config.status[module]) {
					executeCallback();
				} else {
					setTimeout(spoll, 100);
				}
			}());
		}

		config.modules[module] = url;

		function executeCallback() {
			exports.push(yeahui[module]);
			console.log(exports);
			if(mods.length > 1) {
				_this.require(mods.splice(1), callback, exports);
			} else {
				typeof callback === "function" && callback.apply(yeahui, exports);
			}
		}

		return _this;
	}

	YeahUI.fn.generateVersion = function() {
		// var version = config.version ? config.version : (new Date()).getTime();
		// return version ? ("?v=" + version) : this.version; 
		return "";
	}

	/**
	 * 遍历函数
	 * @param (object| array) data : 需要遍历的对象或数组
	 * @param (function) callback : 回调函数
	 **/
	YeahUI.fn.foreach = function(data, callback) {
		var _this = this;
		if(typeof callback !== "function") {
			return _this;
		}
		var data = data || [];
		if(data.constructor === Object) {
			var index = 0;
			for(var key in data) {
				var result = callback.call(data[key], index++, data[key], key);
				if(typeof result === "boolean" && result == true) {
					return true;
				} else if(typeof result === "boolean" && result == false) {
					return false;
				}
			}
		} else {
			for(var i = 0, length = data.length; i < length; i++) {
				var result = callback.call(data[i], i, data[i]);
				if(typeof result === "boolean" && result == true) {
					return true;
				} else if(typeof result === "boolean" && result == false) {
					return false;
				}
			}
		}
		return _this;
	}

	/**
	 * 生成一个link引入css
	 * @param (string) module : 模块名称
	 * @param (function) callback : 回调函数
	 **/
	YeahUI.fn.link = function(module, callback) {
		var _this = this,
			link = doc.createElement("link"),
			head = doc.getElementsByTagName("head")[0],
			dir = config.dir = config.dir ? config.dir : getPath;
			href = (dir + "css/") + module + ".css",
			id = link.id = "yeah-" + module;

		link.rel = "stylesheet";
		link.type = "text/css";
		link.media = "all";
		link.href = href + generateVersion();

		if(!doc.getElementById(id)) {
			head.appendChild(link);
		}

		if(typeof callback !== "function") {
			return _this;
		}

		_this.linkOnload(link, module, callback);

		return _this;
	}

	/**
	 * 判断link是否加载完成
	 * @param (element) node : link节点
	 * @param (string) module : 模块名称
	 * @param (function) callback : 回调函数
	 **/
	YeahUI.fn.linkOnload = function(node, module, callback) {
	  var t = doc.createStyleSheet,
	  	r = t ? 'rules' : 'cssRules',
	  	s = t ? 'styleSheet' : 'sheet',
	  	l = doc.getElementsByTagName('link');
	  // passed link or last link node
	  node || (node = l[l.length - 1]);
	  function check() {
	    try {
	      return link && link[s] && link[s][r] && link[s][r][0];
	    } catch(e) {
	      return false;
	    }
	  }
	  (function poll() {
	  	if(++timeout > config.timeout / 100) {
	  		return logError("Load the [" + module + ".css] is timeout");
	  	}
	    check() && setTimeout(callback, 0) || setTimeout(poll, 100);
	  })();
	}

	YeahUI.fn.config = function(options) {
		options = options || {};
		for(var key in options) {
			config[key] = options[key];
		}
		return this;
	}

	YeahUI.fn.getModules = function() {
		var mods = {};
		for(var module in modules) {
			mods[module] = modules[module];
		}
		return mods;
	}

	win.yeahui = new YeahUI();
}(window);