yeahui.define("jquery", function(exports) {

	var $ = yeahui.jquery;


	function Message(options) {
		return Message.fn._get();
	};

	function appendDiv(ele, parent, eleType, classes) {
		
		eleType = eleType ? eleType : "div"

		
		classes = classes ? classes : ""

		var $ele = $("<" + eleType + " class='" + ele + " " + classes +"'></" + eleType + ">");
		$ele.appendTo($(parent));
		return $ele;
	}

	function MessageType() {
		throw new Error("Can't initialize this class.");
	}

	MessageType.ALERT = "alert";
	MessageType.CONFIRM = "confirm";
	MessageType.POP = "pop";
	MessageType.PAGE = "page";
	MessageType.LOADING = "loading";
	MessageType.TIP = "TIP";

	function screenCenter(ele) {
		ele = $(ele);
		var _scrollHeight = $(document).scrollTop(),//获取当前窗口距离页面顶部高度
	    _windowHeight = $(window).height(),//获取当前窗口高度
	    _windowWidth = $(window).width(),//获取当前窗口宽度
	    _popupHeight = ele.height(),//获取弹出层高度
	    _popupWeight = ele.width();//获取弹出层宽度
	    _posiTop = (_windowHeight - _popupHeight)/2 + _scrollHeight;
	    _posiLeft = (_windowWidth - _popupWeight)/2;
	    ele.css({"left": _posiLeft + "px","top":_posiTop + "px","display":"block"});
	}


	var MESSAGE_MAIN = "yeah-message",
		MESSAGE_HEADER = "yeah-message-header",
		MESSAGE_CONTENT = "yeah-message-content";
		MESSAGE_TITLE = "yeah-message-title",
		MESSAGE_CONTROL = "yeah-message-control",
		MESSAGE_CONTROL_CLOSE = "yeah-message-close",
		MESSAGE_BTNS = "yeah-message-btns",
		MESSAGE_BTN_FULL_SCREEN = "yeah-message-fullscreen",
		MESSAGE_BTN_SMALL = "yeah-message-small",
		RESIZE_LEFT_TOP = "yeah-resize-left-top",
		RESIZE_RIGHT_TOP = "yeah-resize-right-top",
		RESIZE_RIGHT_BOTTOM = "yeah-resize-right-bottom",
		RESIZE_LEFT_BOTTOM = "yeah-resize-left-bottom",
		RESIZE_TOP = "yeah-resize-top",
		RESIZE_RIGHT = "yeah-resize-right",
		RESIZE_BOTTOM = "yeah-resize-bottom",
		RESIZE_LEFT = "yeah-resize-left",
		ALERT_DEFAULT_TITLE = "提示";

	Message.fn = Message.prototype = {
		_get : function() {
			return this;
		},
		alert : function(msg, options, callbacks) {
			// var _this = this;
			// if(typeof options === "function") {
			// 	callback = options;
			// 	options = callback;
			// }


			// var $message = $("<div class='" + MESSAGE_MAIN + "'>");
			// var $header = appendDiv(MESSAGE_HEADER, $message);
			// var $content = appendDiv(MESSAGE_CONTENT, $message);
			// var $btns = appendDiv(MESSAGE_BTNS, $message);

			// var $title = appendDiv(MESSAGE_TITLE, $header, "h3");
			// title = (options && options.title) ? options.title : ALERT_DEFAULT_TITLE;
			// $title.html(title);

			// var $control = appendDiv(MESSAGE_CONTROL, $header);
			// var $close = appendDiv(MESSAGE_CONTROL_CLOSE, $control, "i", "icon icon-remove");

			// var $msg = appendDiv("", $content);
			// $msg.html(msg);

			// var $sure = appendDiv("btn", $btns, "button", "btn-primary");
			// if(options && options.btnText) {
			// 	if(typeof options.btnText === "string") {
			// 		btnText = options.btnText ? [options.btnText] : [确定];
			// 	} else {
			// 		btnText = (options.btnText && options.btnText.length > 0) ? options.btnText : ["确定"];
			// 	}
			// }
			// $sure.html(btnText[0]);

			// $sure.on("click", function(e) {
			// 	$message.remove();
			// 	$mode.remove();
			// 	callback.call(_this, $message);
			// });

			// $message.find("." + MESSAGE_CONTROL_CLOSE).on("click", function() {
			// 	$message.remove();
			// 	$mode.remove();
			// 	callback.call(_this, $message);
			// });

			// $("body").append($message);

			// var $mode = $("<div class='yeah-message-mode'></div>").appendTo($("body"));
			// screenCenter($message);

			var _this = this;
			_this.open(MessageType.ALERT, msg, options, callbacks);
		},

		confirm : function(msg) {

		},

		open : function(type, content, options, callbacks) {
			var _this = this;
			var $message = $("<div class='" + MESSAGE_MAIN + "'>");
			var $header = appendDiv(MESSAGE_HEADER, $message);
			var $content = appendDiv(MESSAGE_CONTENT, $message);
			var $btns = appendDiv(MESSAGE_BTNS, $message);
			var $leftTop = appendDiv(RESIZE_LEFT_TOP, $message, "span");
			var $rightTop = appendDiv(RESIZE_RIGHT_TOP, $message, "span");
			var $rightBottom = appendDiv(RESIZE_RIGHT_BOTTOM, $message, "span");
			var $leftBottom = appendDiv(RESIZE_LEFT_BOTTOM, $message, "span");



			var $top = appendDiv(RESIZE_TOP, $message, "span");
			var $right = appendDiv(RESIZE_RIGHT, $message, "span");
			var $bottom = appendDiv(RESIZE_BOTTOM, $message, "span");
			var $left = appendDiv(RESIZE_LEFT, $message, "span");

			var $title = appendDiv(MESSAGE_TITLE, $header, "h3");
			title = (options && options.title) ? options.title : ALERT_DEFAULT_TITLE;
			$title.html(title);

			var $control = appendDiv(MESSAGE_CONTROL, $header);
			var $close = appendDiv(MESSAGE_CONTROL_CLOSE, $control, "i", "icon icon-remove");

			var $msg = appendDiv("", $content);
			$msg.html(content);


			if(options && options.btnText) {
				if(typeof options.btnText === "string") {
					btnText = options.btnText ? [options.btnText] : ["确定"];
				} else {
					btnText = (options.btnText && options.btnText.length > 0) ? options.btnText : ["确定"];
				}
			} else {
				btnText = ["确定"];
			}

			yeahui.foreach(btnText, function(index, text) {
				var $sure = appendDiv("btn", $btns, "button", "btn-primary");
				$sure.html(text);
				$sure.on("click", function(e) {
					$message.remove();
					$mode.remove();
					(callbacks && callbacks.length > 0 && typeof callbacks[index] === "function") && callbacks[index].call(_this, $message);
				});

				$message.find("." + MESSAGE_CONTROL_CLOSE).on("click", function() {
					$message.remove();
					$mode.remove();
				});
			});

			$("body").append($message);

			var w = $message.width();
			var h = $message.height();
			var wHalf = w / 2;
			var hHalf = h / 2;

			$top.css({"left" : 15, "width" : (w - 30) + "px"});
			$right.css({"top" : 15, "height" : (h - 30) + "px"});
			$bottom.css({"left" : 15, "width" : (w - 30) + "px"});
			$left.css({"top" : 15, "height" : (h - 30) + "px"});

			if(options && options.draggable) {
				bindDrag($message);
			}

			var $mode = $("<div class='yeah-message-mode'></div>").appendTo($("body"));
			if(!options || options.align == "center") {
				screenCenter($message);
			}
		},

		close : function() {
			
		}
	};

	function bindDrag(obj){
		// jquery object convert to dom object
		var parent = $(obj)[0];
		var _dom = $(obj).find("." + MESSAGE_HEADER)[0];
		_dom.onmousedown = function(e){
			var e = e || window.event;
			dragX = e.clientX - parent.offsetLeft;
			dragY = e.clientY - parent.offsetTop;
			/*console.log(dragX, dragY);*/
			isDrag = true;
			document.onmousemove = function(e){
				var e = e || window.event;
				// xDiff>0 ? 左 : 右
				var xDiff = e.clientX - dragX;
				// yDiff>0 ? 上 : 下
				var yDiff = e.clientY - dragY;
				
				if(isDrag){
					if(xDiff <=0){
						xDiff = 0;
					} else if(xDiff >= (document.body.clientWidth - parent.offsetWidth)){
						xDiff = document.body.clientWidth - parent.offsetWidth;
					}
					
					if(yDiff <= 0){
						yDiff = 0;
					} else if (yDiff >= (document.body.scrollHeight - parent.offsetHeight)){
						yDiff = document.body.scrollHeight - parent.offsetHeight;
					}
					parent.style.left = xDiff + "px";
					parent.style.top = yDiff + "px";
				}
			};
			
			document.onmouseup = function(e){
				var e = e || window.event;
				document.onmousemove = null;
			  	document.onmouseup = null;
				isDrag = false;
			};
		};
	}

	exports("message", Message);
	
});