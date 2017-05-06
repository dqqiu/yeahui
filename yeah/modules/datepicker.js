yeahui.define("jquery", function(exports) {
	"use strict";

	var $ = yeahui.jquery;
	
	/**
	 * 日历选择器
	 */
	function YeahDatePicker() {
		var _this = this;
		return _this._get();
	};
	
	/**
	 * 日历选择器默认配置参数
	 */
	var defaults = {
		element : "#id",
		trigger : "click",
		minDate : "1900-01-01 00:00:00",
		maxDate : "2100-12-31 23:59:59",
		format : "yyyy-MM-dd hh:mm:ss",
		formatter : function() {
			return "";
		},
		todayShow : true,
		yesShow : true,
		clearShow : true,
		timeShow : false,
		zIndex : 999999999,
		callback : function(date) {
			
		}
	};
	
	/**
	 * 星期显示数组
	 */
	var weeks = [
	    "日",
	    "一",
	    "二",
	    "三",
	    "四",
	    "五",
	    "六"
	];
	
	// 日历显示总天数
	var dayCount = 6 * 7;
	var dpState = "datepicker-state";
	var DEFAULT_ELEMENT_TYPE = "div";
	
	var elements = {
		"wrapper" : "yeah-datepicker-wrapper",
		"header" : "yeah-datepicker-header",
		"prev" : "yeah-datepicker-prev",
		"next" : "yeah-datepicker-next",
		"year" : "yeah-datepicker-year",
		"month" : "yeah-datepicker-month",
		"body" : "yeah-datepicker-body",
		"table" : "yeah-table",
		"footer" : "yeah-datepicker-footer",
		"tools" : "yeah-datepicker-tools",
		"timeSelector" : "yeah-datepicker-time-selector",
		"timeLabel" : "time-label",
		"btnGroup" : "yeah-datepicker-btngroup",
		"current" : "yeah-current",
		"hour" : "yeah-datepicker-hour",
		"minute" : "yeah-datepicker-minute",
		"second" : "yeah-datepicker-second"
	};
	
	YeahDatePicker.fn = YeahDatePicker.prototype = {
		_get : function() {
			return this;
		},
		/**
		 * 日历渲染
		 * @param options {object} 配置参数
		 */
		render : function(options) {
			var _this = this;
			options = $.extend({}, defaults, options);
			_this.create(options);
		},
		/**
		 * 不足补零
		 * @param num {number} 数字
		 */
		digit : function(num) {
			return num < 10 ? ("0" + (num)) : num;
		},

		/**
		 * 创建日历结构
		 * @param options {object} 配置参数
		 */
		create : function(options) {
			var _this = this;
			var $dpElement = $(options.element);
			var trigger = options.trigger || "click";
			
			$dpElement.css({"position" : "relative"});
			
			var $dp = _this._buildElement(DEFAULT_ELEMENT_TYPE, "body", elements.wrapper);
			
			// 构建日历结构体
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();

			_this._buildDatePicker($dp, $dpElement, date, options);
			
			$dpElement.on(trigger, function(e) {
				var $this = $(this);
				var _width = $dpElement.outerWidth();
				var _height = $dpElement.outerHeight();
				var _top = $dpElement.offset().top;
				var _left = $dpElement.offset().left;
				$dp.css({
					left: _left + "px",
					top: _height + _top + "px"
				});
				if($this.attr(dpState) === "show") {
					$dp.fadeOut();
					$this.attr(dpState, "hide");
				} else if(!$this.attr(dpState) || $this.attr(dpState) === "hide") {
					$dp.fadeIn();
					$this.attr(dpState, "show");
				}
			});

			$dpElement.on("blur", function(e) {
				$dp.fadeOut();
				$(this).attr(dpState, "hide");
			});

			$dp.on("click", function(e) {
				var $target = $(e.target);
				if(!$target.hasClass(elements.prev)) {
					return;
				}
				month -= 1;
				month < 1 && (
					month = 12,
					year -= 1
				);
				var newDate = date.setFullYear(year, month - 1, 1);
				_this._buildDatePicker($dp, $dpElement, new Date(newDate), options);
			});

			$dp.on("click", function(e) {
				var $target = $(e.target);
				if(!$target.hasClass(elements.next)) {
					return;
				}
				month += 1;
				month > 12 && (
					month = 1,
					year += 1
				);
				var newDate = date.setFullYear(year, month - 1, 1);
				_this._buildDatePicker($dp, $dpElement, new Date(newDate), options);
			});

			$dp.on("click", function(e) {
				var $target = $(e.target);
				if(!$target.is("td")) {
					return;
				}
				var _year = $target.attr("year");
				var _month = $target.attr("month");
				var _day = $target.attr("day");
				var _selectDate = new Date(_year, _month - 1, _day);
				if(options.timeShow) {
					var $timeSelector = $dp.find("." + elements.timeSelector);
					var _hour = $timeSelector.find("." + elements.hour).val() || 0;
					var _minute = $timeSelector.find("." + elements.minute).val() || 0;
					var _second = $timeSelector.find("." + elements.second).val() || 0;
					_selectDate = new Date(_year, _month - 1, _day, _hour, _minute, _second);
				}
				$dpElement.val(_this.dateFormat(_selectDate, options.format));
				var $current = $dp.find("." + elements.current);
				if($current[0]) {
					$current.removeClass(elements.current);
				}
				$target.addClass(elements.current);
			});

			$dp.on("click", function(e) {
				var $target = $(e.target);
				if(!$target.hasClass("btn")) {
					return;
				}
				if($target.hasClass("btn-clear")) {
					$dpElement.val("");
				}
				if($target.hasClass("btn-today")) {
					var todayTime = _this.dateFormat(new Date(), options.format);
					$dpElement.val(todayTime);
				}
				if($target.hasClass("btn-yes")) {
					$dp.fadeOut();
					$dpElement.attr(dpState, "hide");
				}
			});
		},
		
		_buildDatePicker : function(element, input, date, options) {
			var _this = this;
			var $dp = $(element);
			$dp.html("");
			var $input = $(input);

			var $header = _this._buildElement(DEFAULT_ELEMENT_TYPE, $dp, elements.header);
			var $body = _this._buildElement(DEFAULT_ELEMENT_TYPE, $dp, elements.body);
			
			var $prev = _this._buildElement("a", $header, elements.prev, "<");
			var $next = _this._buildElement("a", $header, elements.next, ">");
			var $yearA = _this._buildElement("a", $header, elements.year);
			var $monthA = _this._buildElement("a", $header, elements.month);
			var $yearInput = _this._buildElement("input", $yearA, "");
			var $monthInput = _this._buildElement("input", $monthA, "");
			$yearInput.attr("readonly", "readonly");
			$monthInput.attr("readonly", "readonly");
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			$yearInput.val(year);
			$monthInput.val(month);
			
			var $table = _this._buildElement("table", $body, elements.table);
			var $weeks = _this._initWeek($table);
			
			var monthData = _this.getMonthData(year, month);
			var $tr;
			var currentDate = new Date();
			var currentYear = currentDate.getFullYear();
			var currentMonth = currentDate.getMonth() + 1;
			var currentDay = currentDate.getDate();
			for(var i = 0, length = monthData.days.length; i < length; i++) {
				var data = monthData.days[i];
				if(i % 7 == 0) {
					$tr = _this._buildElement("tr", $table, "");
				}
				var $td = _this._buildElement("td", $tr, "", data.dayShow);
				$td.attr("year", data.year);
				$td.attr("month", data.month);
				$td.attr("day", data.dayShow);
				if(currentYear == data.year && currentMonth == data.month && currentDay == data.dayShow) {
					$td.addClass(elements.current);
				}
			}

			var $footer;
			if(options.timeShow) {
				if(!$footer || $footer[0]) {
					$footer = _this._buildElement(DEFAULT_ELEMENT_TYPE, $dp, elements.footer);
				}
				var $ul = _this._buildElement("ul", $footer, elements.timeSelector);
				var $timeLabel = _this._buildElement("li", $ul, elements.timeLabel, "时间");
				var $hourLi = _this._buildElement("li", $ul);
				var $hour = _this._buildElement("input", $hourLi, elements.hour);
				$hourLi.append(":");
				$hour.attr("readonly", "readonly");
				$hour.val(_this.digit(hour));
				var $minuteLi = _this._buildElement("li", $ul);
				var $minute = _this._buildElement("input", $minuteLi, elements.minute);
				$minute.attr("readonly", "readonly");
				$minute.val(_this.digit(minute));
				$minuteLi.append(":");
				var $secondLi = _this._buildElement("li", $ul);
				var $second = _this._buildElement("input", $secondLi, elements.second);
				$second.attr("readonly", "readonly");
				$second.val(_this.digit(second));
			}

			if(options.clearShow || options.yesShow || options.todayShow) {
				if(!$footer || !$footer[0]) {
					$footer = _this._buildElement(DEFAULT_ELEMENT_TYPE, $dp, elements.footer);
				}

				var $tools = _this._buildElement(DEFAULT_ELEMENT_TYPE, $footer, elements.tools);
				var $btnGroup = _this._buildElement(DEFAULT_ELEMENT_TYPE, $tools, elements.btnGroup);

				options.clearShow && (
					_this._buildElement("a", $btnGroup, "btn btn-clear", "清空")
				);

				options.todayShow && (
					_this._buildElement("a", $btnGroup, "btn btn-today", "今天")
				);

				options.yesShow && (
					_this._buildElement("a", $btnGroup, "btn btn-yes", "确定")
				);

			}
		},
		_buildElement : function(elementType, parent, classes, text) {
			elementType = elementType ? elementType : DEFAULT_ELEMENT_TYPE;
			classes = classes ? classes : "";
			parent = parent ? parent : "body";
			var clz = classes ? "class='" + classes + "'" : "";
			var elementText = "<" + elementType + " " + clz + ">"
			var $element = $(elementText);
			if(text) {
				$element.text(text);
			}
			$element.appendTo($(parent));
			return $element;
		},
		_getJqElement : function(str, flag) {
			if(!flag) {
				flag = ".";
			}
			return $(flag + str);
		},
		getMonthData : function(year, month) {
			var _this = this;
			var days = [];
			if(!year || !month ) {
				var date = new Date();
				!year && (year = date.getFullYear());
				!month && (month = date.getMonth() + 1);
			}
			
			// 本月第一天及其星期数
			var firstDayOfThisMonth = new Date(year, month - 1, 1);
			var firstWeekDay = firstDayOfThisMonth.getDay();
			year = firstDayOfThisMonth.getFullYear();
			month = firstDayOfThisMonth.getMonth() + 1;
			// 本月最后一天及其日期
			var lastDayOfThisMonth = new Date(year, month, 0);
			var lastDateOfThisMonth = lastDayOfThisMonth.getDate();
			// 上个月最后一天及其日期
			var lastDayOfPrevMonth = new Date(year, month -1, 0);
			var lastDateOfPrevMonth = lastDayOfPrevMonth.getDate();
			// 0,1,2,3,4,5,6
			for (var i = 0; i < dayCount; i++) {
				var day = i + 1 - firstWeekDay;
				var dayShow = day;
				var _month = month;
				if(day <= 0) {
					// 显示上个月数据
					_month = _month - 1;
					dayShow = lastDateOfPrevMonth + day;
				} else if(day >  lastDateOfThisMonth) {
					// 显示下个月数据
					_month = _month + 1;
					dayShow = dayShow - lastDateOfThisMonth;
				}
				
				// 超出月份范围重置月份
				_month < 1 && (_month = 12, year -= 1);
				_month > 12 && (_month = 1, year += 1);
				
				days.push({
					month : _month,
					day : day,
					dayShow : dayShow,
					year : year
				});
			}
			return {
				days: days,
				year: year,
				month: month
			};
		},
		_initWeek : function(tab) {
			var _this = this,
				$tab = $(tab);
			var ths = [];
			var $tr = _this._buildElement("tr", $tab);
			for(var i = 0, length = weeks.length; i < length; i++) {
				var $th = _this._buildElement("th", $tr, "", weeks[i]);
				ths.push($th);
			}
			return ths;
		},
		dateFormat : function(date, format){ 
			var o = { 
				"M+" : date.getMonth()+1, //month 
				"d+" : date.getDate(), //day 
				"h+" : date.getHours(), //hour 
				"m+" : date.getMinutes(), //minute 
				"s+" : date.getSeconds(), //second 
				"q+" : Math.floor((date.getMonth()+3)/3), //quarter 
				"S" : date.getMilliseconds() //millisecond 
			} 

			if(/(y+)/.test(format)) { 
				format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			} 

			for(var k in o) { 
				if(new RegExp("("+ k +")").test(format)) { 
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
				} 
			} 
			return format; 
		} 
	};
	
	exports("datePicker", new YeahDatePicker());
}).link("date-picker");
	