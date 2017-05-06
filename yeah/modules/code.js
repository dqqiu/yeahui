yeahui.define("jquery", function(exports) {
	"use strict";

	var $ = yeahui.jquery;

	var about = "https://dqqiu.github.io/yeahui";
	var skinPrefix = "yeah-code-";

	// 默认配置
	var defaults = {
		encode: false,
		title: "yeah-code",
		height: "auto",
		element: ".yeah-code-box",
		skin: "",
		about: "yeahui.code",
		showRowNumber: false,
		editable: false
	};

	/**
	 * 代码修饰器
	 */
	var YeahCode = function() {
		var _this = this;
		return _this;
	}

	YeahCode.fn = YeahCode.prototype;

	/**
	 * 代码修饰器渲染
	 * @param selector {string} 选择器
	 * @param options {obj} 配置参数
	 */
	YeahCode.fn.render = function(selector, options) {
		var _this = this;
		options = $.extend({}, defaults, options);
		var elements = [];
		var selectors = selector ? $(selector) : $(options.element);
		yeahui.foreach(selectors, function(index, item) {
			elements.push(item);
		});

		yeahui.foreach(elements, function(index, item) {
			var cthis = $(item), html = cthis.html();

			if(!cthis.hasClass("yeah-code-box")) {
				cthis.addClass("yeah-code-box");
			}

			// html转义配置
			if(cthis.attr("yeah-code-encode") == "true" || options.encode) {
				// html转义
				html = html.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
	    		.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
			}

			html = html.replace(/[\r\t\n]+/g, "</li><li>");

			var codeHtml = '<ol class="yeah-code-body"><li>' + html + '</li></ol>';
			cthis.html(codeHtml);

			// 若是页面未生成标题，则在此生成
			if(cthis.find("yeah-code-title").length == 0) {

				cthis.prepend('<h5 class="yeah-code-title">' + (cthis.attr('yeah-title') || options.title) + 
				(options.about ? '<a href="' + about + '" target="_blank">' + options.about + '</a>' : '') + '</h5>');
			}

			var codeBody = cthis.find(">.yeah-code-body");
			var skin = cthis.attr("yeah-skin") || options.skin;
			if(skin) {
				cthis.addClass("yeah-code-" + skin);
			}

			if((cthis.attr("yeah-code-editable") == "true") || options.editable) {
				codeBody.attr("contenteditable", true);
			}

			// 代码修饰器左侧行数宽度限制
			var length = codeBody.length;
			if((length/100|0) > 0) {
				codeBody.css("margin-left", (length/100|0) + "px");
			}

			// 是否开启行数显示
			if(cthis.attr("yeah-type") == "row" || options.showRowNumber) {
				cthis.attr("yeah-type", "row");
			}

			// 设置代码修饰器高度
			if(cthis.attr("yeah-code-height") || options.height != "auto") {
				codeBody.css("max-height", (cthis.attr("yeah-code-height") || options.height) + "px");
			}

			codeBody.find('li').eq(0).remove();

			codeBody.find('li').eq(codeBody.find('li').length - 1).remove();
		});

		return _this;
	}

	exports("code", new YeahCode());
}).link("code");