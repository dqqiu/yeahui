;(function(window, $, undefined) {
;(function(window, $, undefined) {
	"use strict";

	var about = "https://dqqiu.github.io/yeahui";
	var skinPrefix = "yeah-code-";

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

	function Code(options) {
		this.options = $.extend({}, defaults, options);
		this.elements = [];
		this._init();
	}


	Code.prototype._init = function() {
		var _this = this;
		_this.options.element = $(_this.options.element);
		// 存储所有代码修改器元素
		_this.options.element.each(function(i, e) {
			_this.elements.push(this);
		});

		// 进行页面渲染
		_this._render();
	}

	/**
	 * 代码修饰器页面渲染
	 */
	Code.prototype._render = function() {
		var _this = this;
		$.each(_this.elements, function(index, item) {
			var cthis = $(item), html = cthis.html();

			// html转义配置
			if(cthis.attr("yeah-code-encode") == "true" || _this.options.encode) {
				// html转义
				html = html.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
        		.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
			}

			html = html.replace(/[\r\t\n]+/g, "</li><li>");

			var codeHtml = '<ol class="yeah-code-body"><li>' + html + '</li></ol>';
			cthis.html(codeHtml);

			// 若是页面未生成标题，则在此生成
			if(cthis.find("yeah-code-title").length == 0) {

				cthis.prepend('<h5 class="yeah-code-title">' + (cthis.attr('yeah-title') || _this.options.title) + 
				(_this.options.about ? '<a href="' + about + '" target="_blank">' + _this.options.about + '</a>' : '') + '</h5>');
			}

			var codeBody = cthis.find(">.yeah-code-body");
			var skin = cthis.attr("yeah-skin") || _this.options.skin;
			if(skin) {
				cthis.addClass("yeah-code-" + skin);
			}

			if((cthis.attr("yeah-code-editable") == "true") || _this.options.editable) {
				codeBody.attr("contenteditable", true);
			}

			// 代码修饰器左侧行数宽度限制
			var length = codeBody.length;
			if((length/100|0) > 0) {
				codeBody.css("margin-left", (length/100|0) + "px");
			}

			// 是否开启行数显示
			if(cthis.attr("yeah-type") == "row" || _this.options.showRowNumber) {
				cthis.attr("yeah-type", "row");
			}

			// 设置代码修饰器高度
			if(cthis.attr("yeah-code-height") || _this.options.height != "auto") {
				codeBody.css("max-height", (cthis.attr("yeah-code-height") || _this.options.height) + "px");
			}

			codeBody.find('li').eq(0).remove();

			codeBody.find('li').eq(codeBody.find('li').length - 1).remove();

		});
	}

	$.fn.code = function ( options ) {
        var args = arguments;
        var instance;

        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'yeah-code')) {
                    $.data(this, 'yeah-code', new Code( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            instance = $.data(this[0], 'yeah-code');

            // Allow instances to be destroyed via the 'destroy' method
            if (options === 'destroy') {
                // TODO: destroy instance classes, etc
                $.data(this, 'yeah-code', null);
            }

            if (instance instanceof Code && typeof instance[options] === 'function') {
                return instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
            } else {
                return this;
            }
        }
    };

})(window, jQuery);