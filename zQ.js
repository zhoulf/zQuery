/*
* zQ Javascript 
*/
(function(window) {
	var zQ = (function() {

		var zQ = function(selector) {
				return new zQ.fn.init(selector);
			},

			_zQ = window.zQ,
			_$ = window.$,
			trimLeft = /^\s+/,
			trimRight = /\s+$/,
			// The deferred used on DOM ready
			readyList,
			// The ready event handler
			DOMContentLoaded,
			// Save a reference to some core methods
			toString = Object.prototype.toString,
			hasOwn = Object.prototype.hasOwnProperty,
			push = Array.prototype.push,
			slice = Array.prototype.slice,
			trim = String.prototype.trim,
			indexOf = Array.prototype.indexOf,
			class2type = {'object Boolean' : 'boolean', 'object Number': 'number', 'object String': 'string', 'object Function': 'function', 'object Array': 'array', 'object Date': 'date', 'object RegExp': 'regexp', 'object Object': 'object'};


		zQ.fn = zQ.prototype = {

			constructor: zQ,
			selector: "",
			length: 0,

			init: function(selector) {

				//做selector筛选:null, 
				if (!selector) return this;

				if ( selector.nodeType ) {
					this.context = this[0] = selector;
					this.length = 1;
					return this;
				}

				if ( selector === "body" && document.body ) {
					this.context = document;
					this[0] = document.body;
					this.selector = selector;
					this.length = 1;
					return this;
				}

				//zQ('#id')
				if (selector.indexOf('#') === 0) {
					var oid = selector.substr(1);
					this[0] = document.getElementById(oid);
					this.length = 1;
					return this;
				}

				//zQ('.class')
				if (selector.indexOf('.') === 0) {
					var aclass = [],
						regClass = new RegExp("(\\s|^)" + selector.substr(1) + "($|\\s)"),
						doms = document.getElementsByTagName('*');
						for(var i =0, l = doms.length; i < l; i++) {
							regClass.test(doms[i].className) && aclass.push(doms[i]);
						}
						[].push.apply(this, aclass);
						return this;
				}

				//zQ('doms')
				if (/[a-zA-Z]+/.test(selector)) {
					var arr = [], elems = document.getElementsByTagName(selector);
					for (var i = 0, l = elems.length; i < l; i++) {
						arr[i] = elems [i];
					}
					[].push.apply(this, arr);
					return this;
				}
			},

			toArray: function() {
				return slice.call(this, 0);
			},

			each: function(callback, args) {
				return zQ.each(this, callback, args);
			},

			ready: function(fn) {
				zQ.bindReady();
				fn();
				return this;
			},

			end: function() {
				return this.prevObject || this.constructor(null);
			}

		}

		//++++++++++++++++++++++++方法扩展的处理+++++++++++++++++++++++++++
		zQ.extend = zQ.fn.extend = function(obj) {
				for (var a in obj) {
					this[a] = obj[a];
				}
		}

		zQ.fn.init.prototype = zQ.fn;
		//静态方法
		zQ.extend({
			noConflict: function( deep ) {
				if ( window.$ === zQ ) {
					window.$ = _$;
				}

				if ( deep && window.zQ === zQ ) {
					window.zQ = _zQ;
				}

				return zQ;
			},

			trim: function( text ) {
				return text == null ? "" : text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
			},

			inArray: function( elem, array, i ) {
				var len;

				if ( array ) {
					if ( indexOf ) {
						return indexOf.call( array, elem, i );
					}

					len = array.length;
					i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

					for ( ; i < len; i++ ) {
						// Skip accessing in sparse arrays
						if ( i in array && array[ i ] === elem ) {
							return i;
						}
					}
				}

				return -1;
			},

			isReady: false,
			readyWait: 1,

			ready: function( wait ) {
				if ( (wait === true && !--zQ.readyWait) || (wait !== true && !zQ.isReady) ) {
					if ( !document.body ) {
						return setTimeout( zQ.ready, 1 );
					}

					zQ.isReady = true;

					if ( wait !== true && --zQ.readyWait > 0 ) {
						return;
					}
				}
			},

			bindReady: function() {
				if ( readyList ) {
					return;
				}
				
				if ( document.readyState === "complete" ) {
					// Handle it asynchronously to allow scripts the opportunity to delay ready
					return setTimeout( zQ.ready, 1 );
				}

				// Mozilla, Opera and webkit nightlies currently support this event
				if ( document.addEventListener ) {
					// Use the handy event callback
					document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

					// A fallback to window.onload, that will always work
					window.addEventListener( "load", zQ.ready, false );

				// If IE event model is used
				} else if ( document.attachEvent ) {
					// ensure firing before onload,
					// maybe late but safe also for iframes
					//document.attachEvent( "onreadystatechange", DOMContentLoaded );

					// A fallback to window.onload, that will always work
					window.attachEvent( "onload", zQ.ready );

					// If IE and not a frame
					// continually check to see if the document is ready
					var toplevel = false;

					try {
						toplevel = window.frameElement == null;
					} catch(e) {}

					if ( document.documentElement.doScroll && toplevel ) {
						doScrollCheck();
					}
				}
			},

			//{url: 'some.php', type: 'get', async: true, data: {}, header: {}, success: callback(txt), error: callback()}
			ajax: function(options) {
				var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
			     	data = null,
			    	url = options.url;
			    if( !options.data ) options.data = {};
			    options.data['NoCache'] = Math.random();

			    var temp= [];
			    for(var i in options.data) temp.push(i+"="+options.data[i]);
			    data = temp.join("&");

			    if( !options.type ) options.type = 'get';
			    if( options.type == "get" && data!= null ){
			        url = url+( /\?/.test(url) ? '&' : '?' ) + data;
			        data = null
			    }

			    xhr.open( options.type, url, options.async||true, options.user||'', options.pwd||'' );
			    if(options.header){
			        for(var type in options.header){
			            xhr.setRequestHeader( type, options.header[type] );
			        }
			    }
			    if(!options.header || !options.header['Content-Type']) xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

			    xhr.onreadystatechange = function(){
			        if(xhr.readyState == 4){
			            if(xhr.status == 200 || xhr.status == 206){
			                if(options.success){ options.success.apply(xhr,[xhr.responseText]); }
			            }else{
			                if(options.error){ options.error.apply(xhr); }
			            }
			        }
			    }

			    xhr.send(data);

			},

			//name读取，value设置(为空或null时为清除,expires为时间)
			cookie: function(name, value, expires) {
				if (value === undefined) {
					var dc="; "+document.cookie+"; ",
						n = name || 'ck',
						coo=dc.indexOf("; "+n+"=");
					if(coo!=-1){
						var s=dc.substring(coo+n.length+3,dc.length);
						return unescape(s.substring(0,s.indexOf("; ")));

					}else{
						return null;
					}
				}  else if (value == '' || value === null) {
					var exp=new Date();
					exp.setTime(exp.getTime()-10000);
					document.cookie=name+"=null;expires="+exp.toGMTString()+"; path=/";
				} else if (value) {
					var expires = expires || 30,
						expDays=expires*24*60*60*1000,
						expDate=new Date();
					expDate.setTime(expDate.getTime()+expDays);
					var expString=expires?"; expires="+expDate.toGMTString():"";
					document.cookie=name+"="+escape(value)+expString+";path=/";

				}
			},

			each: function(object, callback, args) {
				if (typeof callback === 'function') {
					for (var i = 0, l = object.length; i < l; i++) {
						if (callback.apply(object[i], args) === false) {
							break;
						}
					}
				}
				return object;
			},

			type: function(obj) {
				return obj == null ? String( obj ) : class2type[ toString.call(obj) ] || "object";
			}

		})

		//zQ对象方法
		zQ.fn.extend({
			html: function(value) {
				var elem = this[0];
				if (value) {
					elem.innerHTML = value;
				} else {
					return this[0].innerHTML;
				}
			},

			show: function() {
				var elem, display;
				for (var i = 0, j = this.length; i < j; i++) {
					elem = this[i];
					if (elem.style) {
						display = elem.style.display;
						if (display === "none") {
							display = elem.style.display = "";
						}
					}
				}
				return this;
			},

			hide: function(){
				var elem, display,
				i = 0,
				j = this.length;

				for ( ; i < j; i++ ) {
					elem = this[i];
					if ( elem.style ) {
						display = elem.style.display;

						if ( display !== "none" ) {
							display = elem.style.display = "none";
						}
					}
				}

				return this;
			}

		})

		//++++++++++++++++其它方法++++++++++++
		// The DOM ready check for Internet Explorer
		function doScrollCheck() {
			if ( zQ.isReady ) {
				return;
			}

			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch(e) {
				setTimeout( doScrollCheck, 1 );
				return;
			}

			// and execute any waiting functions
			zQ.ready();
		}

		return zQ;
	})()

	window.zQ =window.$ = zQ;

})(window)