yeahui.define("jquery", function(exports) {

	var $ = yeahui.jquery,
		globalIndex = 0,
		zIndex = 999999;

	var messageOptions = {
		id : "",
		/* 可调整的最小宽度 */
		minWidth : 300,
		/* 可调整的最小高度 */
		minHeight : 260,
		/* 是否可拖拽 */
		draggable : true,
		/* 是否可调整窗口 */
		resizeable : false,
		/* 默认出现位置, leftTop, centerTop, rightTop, leftCenter, center, rightCenter, leftBottom, centerBottom, rightBottom */
		align : "center",
		maxButton : false,
		modal : false,
		modalClose : false,
		width : 300,
		height : 260,
		showTime : 0,
		buttons : [
			{
				text : "确定",
				callback : function(messageElement) {

				}
			}
		]
	};

	function Message(options) {
		return Message.fn._get();
	};

	function append(ele, parent, eleType, classes) {
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
	    _posiTop = (_windowHeight - _popupHeight)/2;
	    _posiLeft = (_windowWidth - _popupWeight)/2;
	    ele.css({"left": _posiLeft + "px","top":_posiTop + "px","display":"block"});
	}


	var MESSAGE_MAIN = "yeah-message",
		MESSAGE_HEADER = "yeah-message-header",
		MESSAGE_CONTENT = "yeah-message-content";
		MESSAGE_TITLE = "yeah-message-title",
		MESSAGE_CONTROL = "yeah-message-control",
		MESSAGE_CONTROL_CLOSE = "yeah-message-close",
		MESSAGE_CONTROL_MAX = "yeah-message-max",
		MESSAGE_CONTROL_RECOVER = "yeah-message-recover",
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
			var _this = this;
			options = $.extend({}, messageOptions, {
				width : 300,
				height : 150,
				minWidth : 300,
				minHeight : 150,
				modal : true,
				buttons : [
					{
						text : "确定",
						close : true,
						callback : function(messageElement) {
							
						}
					}
				]
			}, options);
			_this.open(MessageType.ALERT, msg, options, callbacks);
		},

		confirm : function(msg, options, callbacks) {
			var _this = this;
			options = $.extend(messageOptions, {
				width : 300,
				height : 180,
				minWidth : 300,
				minHeight : 180
			}, options);
		},

		open : function(messageType, content, options, callbacks) {
			var _this = this;
			var $message = $("<div class='" + MESSAGE_MAIN + "'>");

			$message.css({
				width : options.width + "px",
				height: options.height + "px"
			});

			var messageIndex = globalIndex++;
			var messageModalZIndex = zIndex++;
			var messageZIndex = zIndex++;

			var _id = (options && options.id) ? options.id : messageIndex;
			$message.attr("id", "yeah-message" + "-" + _id);
			$message.attr("type", messageType);
			$message.css({"z-index" : messageZIndex});

			var $header = append(MESSAGE_HEADER, $message);
			var $content = append(MESSAGE_CONTENT, $message);
			var $btns = append(MESSAGE_BTNS, $message);

			$("body").append($message);

			var $control = append(MESSAGE_CONTROL, $header);
			if(options && options.maxButton) {
				var $maxButton = append(MESSAGE_CONTROL_MAX, $control, "i", "icon icon-fullscreen");
				var curTop;
				var curLeft;
				var curWidth = $message.width();
				var curHeight = $message.height();

				/* 最大化操作 */
				function toMax() {
					$message.css({
						width : (document.documentElement.clientWidth || document.body.clientWidth) + "px",
						height : (document.documentElement.clientHeight || document.body.clientHeight) + "px",
						left : "0px",
						top : "0px"
					});
					$maxButton.removeClass("icon-fullscreen").addClass("icon-resize-small");
					$maxButton.removeClass(MESSAGE_CONTROL_MAX).addClass(MESSAGE_CONTROL_RECOVER);

					$maxButton.unbind("click");

					$maxButton.on("click", function(e) {
						recover();
					});
				}

				/* 恢复最大化前的位置及宽高 */
				function recover() {
					$message.css({
						width : curWidth + "px",
						height : curHeight + "px",
						left : curLeft + "px",
						top : curTop + "px"
					});
					$maxButton.removeClass("icon-resize-small").addClass("icon-fullscreen");
					$maxButton.removeClass(MESSAGE_CONTROL_RECOVER).addClass(MESSAGE_CONTROL_MAX);
					$maxButton.unbind("click");

					$maxButton.on("click",function(e) {
						toMax();
					});
				}

				$maxButton.on("click", function() {
					curTop = $message.position().top;
					curLeft = $message.position().left;
					toMax();
				});
			}
			var $close = append(MESSAGE_CONTROL_CLOSE, $control, "i", "icon icon-remove");
			

			var $msg = append("", $content);
			$msg.html(content);

			var $title = append(MESSAGE_TITLE, $header, "h3");
			title = (options && options.title) ? options.title : ALERT_DEFAULT_TITLE;
			$title.html(title);

			yeahui.foreach(options.buttons, function(index, button) {
				var $sure = append("btn", $btns, "button", button.class ? button.class : "btn-primary");
				$sure.html(button.text ? button.text : "");
				$sure.on("click", function(e) {
					if(button.close == true || typeof button.close === "undefined") {
						$message.remove();
						$modal && $modal.remove();
					}
					(button.callback && typeof button.callback === "function") && button.callback.call(_this, $message, messageIndex);
				});

			});

			$close.on("click", function() {
				$message.remove();
				$modal && $modal.remove();
			});

			var w = $message.width();
			var h = $message.height();
			var wHalf = w / 2;
			var hHalf = h / 2;

			if(options && options.draggable) {
				$header.css("cursor", "move");
				bindDrag($message);
			}

			if(options && options.resizeable) {
				var $leftTop = append(RESIZE_LEFT_TOP, $message, "span");
				var $rightTop = append(RESIZE_RIGHT_TOP, $message, "span");
				var $rightBottom = append(RESIZE_RIGHT_BOTTOM, $message, "span");
				var $leftBottom = append(RESIZE_LEFT_BOTTOM, $message, "span");
				resize($message[0], $leftTop[0], false, false, true, true, options.minWidth, options.minHeight);
				resize($message[0], $rightTop[0], false, false, false, true, options.minWidth, options.minHeight);
				resize($message[0], $rightBottom[0], false, false, false, false, options.minWidth, options.minHeight);
				resize($message[0], $leftBottom[0], false, false, true, false, options.minWidth, options.minHeight);
				var sourceClientWidth = document.documentElement.clientWidth;
				var sourceClientHeight = document.documentElement.clientHeight;
				window.onresize = function(e) {
					var _clientWidth = document.documentElement.clientWidth;
					var _clientHeight = document.documentElement.clientHeight;
					console.log("source : " + sourceClientWidth + "  _ : " + _clientWidth);
					var setTop = $message[0].offsetTop - ((sourceClientHeight - _clientHeight) / 2);
					var setLeft = $message[0].offsetLeft - ((sourceClientWidth - _clientWidth) / 2);
					setTop = setTop <= 0 ? 0 : setTop;
					setTop = setTop >= _clientHeight ? _clientHeight : setTop;
					setLeft = setLeft <= 0 ? 0 : setLeft;
					setLeft = setLeft >= _clientWidth ? _clientWidth : setLeft;
					$message[0].style.left = setLeft + "px";
					$message[0].style.top = setTop + "px";
					sourceClientWidth = _clientWidth;
					sourceClientHeight = _clientHeight;
					// resize($message[0], $(window)[0], false, false, true, true, options.minWidth, options.minHeight);
					// resize($message[0], $(window)[0], false, false, false, true, options.minWidth, options.minHeight);
					// resize($message[0], $(window)[0], false, false, false, false, options.minWidth, options.minHeight);
					// resize($message[0], $(window)[0], false, false, true, false, options.minWidth, options.minHeight);
					// $message[0].style.left = (document.documentElement.clientWidth - $message[0].offsetWidth) / 2 + "px";
					// $message[0].style.top = (document.documentElement.clientHeight - $message[0].offsetHeight) / 2 + "px";

				}
			}

			var $modal;

			if(options && options.modal) {
				$modal = $("<div class='yeah-message-modal'></div>").appendTo($("body"));
				$modal.attr("id", "yeah-message-modal-" + messageIndex);
				$modal.css({"z-index" : messageModalZIndex});
				if(options && options.modalClose) {
					$modal.on("click", function(e) {
						$message.remove();
						$modal && $modal.remove();
					});
				}
			}

			if(!options || options.align == "center") {
				screenCenter($message);
			}

			if(options && options.showTime) {
				setTimeout(function() {
					$message.remove();
					$modal && $modal.remove();
				}, options.showTime);
			}
		},

		title : function(title, index) {
			var message = $("#yeah-message-" + index);
			if(!message[0]) {
				return;
			}
			var $title = message.find("." + MESSAGE_TITLE);
			if($title[0]) {
				$title.html(title);
			}
		},

		close : function(index) {
			var message = $("#yeah-message-" + index),
				messageModal = $("#yeah-message-modal-" + index);
			if(!message[0]) {
				return;
			}

			message.remove();
			if(messageModal[0]) {
				messageModal.remove();
			}
		},

		closeAll : function() {
			var messages = $("[id^=yeah-message-]");
			if(messages.length > 0) {
				messages.remove();
			}
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
					} else if (yDiff >= (document.documentElement.clientHeight - parent.offsetHeight)){
						yDiff = document.documentElement.clientHeight - parent.offsetHeight;
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



	function resize(parent, target, lockX, lockY, isLeft, isTop, minWidth, minHeight) {
		var isResize = false;
		target.onmousedown = function(e) {
			var event = e || window.event;
			isResize = true;
			var resizeX = event.clientX - parent.offsetLeft;
			var resizeY = event.clientY - parent.offsetTop;
			var sourceLeft = parent.offsetLeft;
			var sourceTop = parent.offsetTop;
			var offsetWidth = parent.offsetWidth;
			var offsetHeight = parent.offsetHeight;
			var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
			var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

			document.onmousemove = function(e) {
				var event = e || window.event;
				// xDiff>0 ? 左 : 右
				var positionX = e.clientX - resizeX;
				// yDiff>0 ? 上 : 下
				var positionY = e.clientY - resizeY;
				positionX = positionX <= 0 ? 0 : positionX;
				positionX = positionX >= clientWidth ? clientWidth : positionX;
				positionY <= 0 && (positionY = 0);
				positionY >= clientHeight && (positionY = clientHeight);

				console.log(positionX);

				var xDiff = sourceLeft - positionX; 
				var yDiff = sourceTop - positionY; 
				if(isResize) {
					if(!lockY) {
						
						if(isTop) {
							var tHeight = (offsetHeight + yDiff);
							if(tHeight >= minHeight) {
								parent.style.top = positionY + "px";
								parent.style.height = tHeight + "px";
							}
						} else {
							var tHeight = (offsetHeight - yDiff);
							if(tHeight >= minHeight) {
								parent.style.top = sourceTop;
								if(parent.offsetTop + tHeight <= clientHeight) {
									parent.style.height = tHeight + "px";
								}
							}
						}
					}

					if(!lockX) {
						if(isLeft) {
							var tWidth = (offsetWidth + xDiff);
							if(tWidth >= minWidth) {
								parent.style.left = positionX + "px";
								parent.style.width = tWidth + "px";
							}
						} else {
							var tWidth = (offsetWidth - xDiff);
							if(tWidth >= minWidth) {
								parent.style.left = sourceLeft;
								if(parent.offsetLeft + tWidth <= clientWidth) {
									parent.style.width = tWidth + "px";
								}
							}
						}
					}
				}
			}

			document.onmouseup = function(e) {
				var event = e || window.event;
				isResize = false;
				document.onmousemove = null;
				document.onmouseup = null;
			}
		}
	}


	// function resize(parent, target, lockX, lockY, isLeft, isTop) {
	// 	var isResize = false;
	// 	target.onmousedown = function(e) {
	// 		var event = e || window.event;
	// 		isResize = true;
	// 		var sourceX = event.clientX;
	// 		var sourceY = event.clientY;
	// 		var sourceTop = parseInt(parent.style.top);
	// 		var sourceLeft = parseInt(parent.style.left);
	// 		var sourceHeight = parseInt(parent.offsetHeight);
	// 		var sourceWidth = parseInt(parent.offsetWidth);

	// 		var windowHeight = document.body.clientHeight;
	// 		var windowWidth = document.body.clientWidth;

	// 		document.onmousemove = function(e) {
	// 			var event = e || window.event;
	// 			var diffX = 0;
	// 			var diffY = 0;
	// 			if(isResize) {
	// 				diffX = event.clientX - sourceX;
	// 				diffY = event.clientY - sourceY;
					
	// 				if(!lockY) {
	// 					if(isTop && diffY < 0) {
	// 						var top = event.clientY <= 0 ? 0 : diffX;
							
	// 						if(event.clientY <= 0) {
	// 							parent.style.top = "0px";
	// 						} else {
	// 							parent.style.top = event.clientY + "px";
	// 							parent.style.height = (sourceHeight - diffY) + "px";
	// 						}

	// 					} else if(!isTop && diffY > 0) {
	// 						if(event.clientY <= windowHeight) {
	// 							parent.style.height = (sourceHeight + diffY) + "px";
	// 						}							
	// 					}
						
	// 				}

	// 				if(!lockX) {
	// 					if(isLeft && diffX < 0) {
	// 						parent.style.left = event.clientX + "px";
	// 						parent.style.width = (sourceWidth - diffX) + "px";
	// 					} else if(!isLeft && diffX > 0){
	// 						parent.style.width = (sourceWidth + diffX) + "px";
	// 					}
						
	// 				}
	// 			}
	// 		}

	// 		document.onmouseup = function(e) {
	// 			var event = e || window.event;
	// 			isResize = false;
	// 			document.onmousemove = null;
	// 			document.onmouseup = null;
	// 		}
	// 	}
	// }

	exports("message", Message);
	
});