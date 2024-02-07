
<script>
    $(document).ready(function () {
        // Configuração do carrossel
        $('#hero-products-carousel').carousel({
            interval: 5000 // Troca de slide a cada 5 segundos
        })

        // Trocar de slide automaticamente
      }setInterval(function () {
            $('#hero-products-carousel').carousel('next')
        }, 5000); // Troca de slide a cada 5 segundos 
    );
</script>
// Definição do objeto Prototype
var Prototype = {

    Version: '1.7',
// Detecção do tipo de navegador  
    Browser: (function(){
      var ua = navigator.userAgent;
      var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
      return {
        IE:             !!window.attachEvent && !isOpera,
        Opera:          isOpera,
        WebKit:         ua.indexOf('AppleWebKit/') > -1,
        Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
        MobileSafari:   /Apple.*Mobile/.test(ua)
      }
    })(),
  // Características do navegador
    BrowserFeatures: {
      XPath: !!document.evaluate,
  
      SelectorsAPI: !!document.querySelector,
  
      ElementExtensions: (function() {
        var constructor = window.Element || window.HTMLElement;
        return !!(constructor && constructor.prototype);
      })(),
      SpecificElementExtensions: (function() {
        if (typeof window.HTMLDivElement !== 'undefined')
          return true;
  
        var div = document.createElement('div'),
            form = document.createElement('form'),
            isSupported = false;
  
        if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
          isSupported = true;
        }
  
        div = form = null;
  
        return isSupported;
      })()
    },
  
    ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
  
    emptyFunction: function() { },
  
    K: function(x) { return x }
  };
  
  if (Prototype.Browser.MobileSafari)
    Prototype.BrowserFeatures.SpecificElementExtensions = false;
  
  
  var Abstract = { };
  
  // Objeto Try com uma função para tentar várias operações
  var Try = {
    these: function() {
      var returnValue;
  
      for (var i = 0, length = arguments.length; i < length; i++) {
        var lambda = arguments[i];
        try {
          returnValue = lambda();  // Tenta executar a função
          break;  // Se bem-sucedido, interrompe o loop
        } catch (e) { }
      }
  
      return returnValue;  // Retorna o valor da primeira função bem-sucedida ou undefined
    }
  };
  
  
  
  var Class = (function() {
  
    var IS_DONTENUM_BUGGY = (function(){
      for (var p in { toString: 1 }) {
        if (p === 'toString') return false;
      }
      return true;
    })();
  
    function subclass() {}; // Função auxiliar para criar classes vazias
    function create() {     // Função para criar uma classe
      var parent = null, properties = $A(arguments);
      if (Object.isFunction(properties[0]))
        parent = properties.shift();
  
      function klass() {
        this.initialize.apply(this, arguments);
      }
  
      Object.extend(klass, Class.Methods); // Adiciona métodos ao objeto classe
      klass.superclass = parent;
      klass.subclasses = [];
  
      if (parent) {
        subclass.prototype = parent.prototype;
        klass.prototype = new subclass;
        parent.subclasses.push(klass);
      }
  
      for (var i = 0, length = properties.length; i < length; i++)   // Adiciona métodos especificados na criação da classe
        klass.addMethods(properties[i]);
  
      if (!klass.prototype.initialize)   // Define um método de inicialização padrão se não especificado
        klass.prototype.initialize = Prototype.emptyFunction;
  
      klass.prototype.constructor = klass; // Configura o construtor da classe
      return klass;
    }

  // Adiciona métodos à classe

    function addMethods(source) {
      var ancestor   = this.superclass && this.superclass.prototype,
          properties = Object.keys(source);
  
      if (IS_DONTENUM_BUGGY) {            // Trata o bug de enumeração em alguns navegadores
        if (source.toString != Object.prototype.toString)
          properties.push("toString");
        if (source.valueOf != Object.prototype.valueOf)
          properties.push("valueOf");
      }
  
      for (var i = 0, length = properties.length; i < length; i++) {  // Itera sobre as propriedades do objeto e as adiciona à classe
        var property = properties[i], value = source[property];
        if (ancestor && Object.isFunction(value) &&
            value.argumentNames()[0] == "$super") {
          var method = value;
          value = (function(m) {
            return function() { return ancestor[m].apply(this, arguments); };
          })(property).wrap(method);
  
          value.valueOf = method.valueOf.bind(method);
          value.toString = method.toString.bind(method);
        }
        this.prototype[property] = value;
      }
  
      return this;
    }
  
    return {   // Retorna um objeto contendo métodos da classe
      create: create,
      Methods: {
        addMethods: addMethods
      }
    };
  })();
  (function() {
  
    var _toString = Object.prototype.toString,
        NULL_TYPE = 'Null',
        UNDEFINED_TYPE = 'Undefined',
        BOOLEAN_TYPE = 'Boolean',
        NUMBER_TYPE = 'Number',
        STRING_TYPE = 'String',
        OBJECT_TYPE = 'Object',
        FUNCTION_CLASS = '[object Function]',
        BOOLEAN_CLASS = '[object Boolean]',
        NUMBER_CLASS = '[object Number]',
        STRING_CLASS = '[object String]',
        ARRAY_CLASS = '[object Array]',
        DATE_CLASS = '[object Date]',
        NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON &&
          typeof JSON.stringify === 'function' &&
          JSON.stringify(0) === '0' &&
          typeof JSON.stringify(Prototype.K) === 'undefined';
  
    function Type(o) {
      switch(o) {
        case null: return NULL_TYPE;
        case (void 0): return UNDEFINED_TYPE;
      }
      var type = typeof o;
      switch(type) {
        case 'boolean': return BOOLEAN_TYPE;
        case 'number':  return NUMBER_TYPE;
        case 'string':  return STRING_TYPE;
      }
      return OBJECT_TYPE;
    }
  
    function extend(destination, source) {
      for (var property in source)
        destination[property] = source[property];
      return destination;
    }
  
    function inspect(object) {
      try {
        if (isUndefined(object)) return 'undefined';
        if (object === null) return 'null';
        return object.inspect ? object.inspect() : String(object);
      } catch (e) {
        if (e instanceof RangeError) return '...';
        throw e;
      }
    }
  
    function toJSON(value) {
      return Str('', { '': value }, []);
    }
  
    function Str(key, holder, stack) {
      var value = holder[key],
          type = typeof value;
  
      if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
        value = value.toJSON(key);
      }
  
      var _class = _toString.call(value);
  
      switch (_class) {
        case NUMBER_CLASS:
        case BOOLEAN_CLASS:
        case STRING_CLASS:
          value = value.valueOf();
      }
  
      switch (value) {
        case null: return 'null';
        case true: return 'true';
        case false: return 'false';
      }
  
      type = typeof value;
      switch (type) {
        case 'string':
          return value.inspect(true);
        case 'number':
          return isFinite(value) ? String(value) : 'null';
        case 'object':
  
          for (var i = 0, length = stack.length; i < length; i++) {
            if (stack[i] === value) { throw new TypeError(); }
          }
          stack.push(value);
  
          var partial = [];
          if (_class === ARRAY_CLASS) {
            for (var i = 0, length = value.length; i < length; i++) {
              var str = Str(i, value, stack);
              partial.push(typeof str === 'undefined' ? 'null' : str);
            }
            partial = '[' + partial.join(',') + ']';
          } else {
            var keys = Object.keys(value);
            for (var i = 0, length = keys.length; i < length; i++) {
              var key = keys[i], str = Str(key, value, stack);
              if (typeof str !== "undefined") {
                 partial.push(key.inspect(true)+ ':' + str);
               }
            }
            partial = '{' + partial.join(',') + '}';
          }
          stack.pop();
          return partial;
      }
    }
  
    function stringify(object) {
      return JSON.stringify(object);
    }
  
    function toQueryString(object) {
      return $H(object).toQueryString();
    }
  
    function toHTML(object) {
      return object && object.toHTML ? object.toHTML() : String.interpret(object);
    }
  
    function keys(object) {
      if (Type(object) !== OBJECT_TYPE) { throw new TypeError(); }
      var results = [];
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          results.push(property);
        }
      }
      return results;
    }
  
    function values(object) {
      var results = [];
      for (var property in object)
        results.push(object[property]);
      return results;
    }
  
    function clone(object) {
      return extend({ }, object);
    }
  
    function isElement(object) {
      return !!(object && object.nodeType == 1);
    }
  
    function isArray(object) {
      return _toString.call(object) === ARRAY_CLASS;
    }
  
    var hasNativeIsArray = (typeof Array.isArray == 'function')
      && Array.isArray([]) && !Array.isArray({});
  
    if (hasNativeIsArray) {
      isArray = Array.isArray;
    }
  
    function isHash(object) {
      return object instanceof Hash;
    }
  
    function isFunction(object) {
      return _toString.call(object) === FUNCTION_CLASS;
    }
  
    function isString(object) {
      return _toString.call(object) === STRING_CLASS;
    }
  
    function isNumber(object) {
      return _toString.call(object) === NUMBER_CLASS;
    }
  
    function isDate(object) {
      return _toString.call(object) === DATE_CLASS;
    }
  
    function isUndefined(object) {
      return typeof object === "undefined";
    }
  
    extend(Object, {
      extend:        extend,
      inspect:       inspect,
      toJSON:        NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,
      toQueryString: toQueryString,
      toHTML:        toHTML,
      keys:          Object.keys || keys,
      values:        values,
      clone:         clone,
      isElement:     isElement,
      isArray:       isArray,
      isHash:        isHash,
      isFunction:    isFunction,
      isString:      isString,
      isNumber:      isNumber,
      isDate:        isDate,
      isUndefined:   isUndefined
    });
  })();
  Object.extend(Function.prototype, (function() {
    var slice = Array.prototype.slice;
  
    function update(array, args) {
      var arrayLength = array.length, length = args.length;
      while (length--) array[arrayLength + length] = args[length];
      return array;
    }
  
    function merge(array, args) {
      array = slice.call(array, 0);
      return update(array, args);
    }
  
    function argumentNames() {
      var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
      return names.length == 1 && !names[0] ? [] : names;
    }
  
    function bind(context) {
      if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
      var __method = this, args = slice.call(arguments, 1);
      return function() {
        var a = merge(args, arguments);
        return __method.apply(context, a);
      }
    }
  
    function bindAsEventListener(context) {
      var __method = this, args = slice.call(arguments, 1);
      return function(event) {
        var a = update([event || window.event], args);
        return __method.apply(context, a);
      }
    }
  
    function curry() {
      if (!arguments.length) return this;
      var __method = this, args = slice.call(arguments, 0);
      return function() {
        var a = merge(args, arguments);
        return __method.apply(this, a);
      }
    }
  
    function delay(timeout) {
      var __method = this, args = slice.call(arguments, 1);
      timeout = timeout * 1000;
      return window.setTimeout(function() {
        return __method.apply(__method, args);
      }, timeout);
    }
  
    function defer() {
      var args = update([0.01], arguments);
      return this.delay.apply(this, args);
    }
  
    function wrap(wrapper) {
      var __method = this;
      return function() {
        var a = update([__method.bind(this)], arguments);
        return wrapper.apply(this, a);
      }
    }
  
    function methodize() {
      if (this._methodized) return this._methodized;
      var __method = this;
      return this._methodized = function() {
        var a = update([this], arguments);
        return __method.apply(null, a);
      };
    }
  
    return {
      argumentNames:       argumentNames,
      bind:                bind,
      bindAsEventListener: bindAsEventListener,
      curry:               curry,
      delay:               delay,
      defer:               defer,
      wrap:                wrap,
      methodize:           methodize
    }
  })());
  
  
  
  (function(proto) {
  
  
    function toISOString() {
      return this.getUTCFullYear() + '-' +
        (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
        this.getUTCDate().toPaddedString(2) + 'T' +
        this.getUTCHours().toPaddedString(2) + ':' +
        this.getUTCMinutes().toPaddedString(2) + ':' +
        this.getUTCSeconds().toPaddedString(2) + 'Z';
    }
  
  
    function toJSON() {
      return this.toISOString();
    }
  
    if (!proto.toISOString) proto.toISOString = toISOString;
    if (!proto.toJSON) proto.toJSON = toJSON;
  
  })(Date.prototype);
  
  
  RegExp.prototype.match = RegExp.prototype.test;
  
  RegExp.escape = function(str) {
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  };
  var PeriodicalExecuter = Class.create({
    initialize: function(callback, frequency) {
      this.callback = callback;
      this.frequency = frequency;
      this.currentlyExecuting = false;
  
      this.registerCallback();
    },
  
    registerCallback: function() {
      this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
    },
  
    execute: function() {
      this.callback(this);
    },
  
    stop: function() {
      if (!this.timer) return;
      clearInterval(this.timer);
      this.timer = null;
    },
  
    onTimerEvent: function() {
      if (!this.currentlyExecuting) {
        try {
          this.currentlyExecuting = true;
          this.execute();
          this.currentlyExecuting = false;
        } catch(e) {
          this.currentlyExecuting = false;
          throw e;
        }
      }
    }
  });
  Object.extend(String, {
    interpret: function(value) {
      return value == null ? '' : String(value);
    },
    specialChar: {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '\\': '\\\\'
    }
  });
  
  Object.extend(String.prototype, (function() {
    var NATIVE_JSON_PARSE_SUPPORT = window.JSON &&
      typeof JSON.parse === 'function' &&
      JSON.parse('{"test": true}').test;
  
    function prepareReplacement(replacement) {
      if (Object.isFunction(replacement)) return replacement;
      var template = new Template(replacement);
      return function(match) { return template.evaluate(match) };
    }
  
    function gsub(pattern, replacement) {
      var result = '', source = this, match;
      replacement = prepareReplacement(replacement);
  
      if (Object.isString(pattern))
        pattern = RegExp.escape(pattern);
  
      if (!(pattern.length || pattern.source)) {
        replacement = replacement('');
        return replacement + source.split('').join(replacement) + replacement;
      }
  
      while (source.length > 0) {
        if (match = source.match(pattern)) {
          result += source.slice(0, match.index);
          result += String.interpret(replacement(match));
          source  = source.slice(match.index + match[0].length);
        } else {
          result += source, source = '';
        }
      }
      return result;
    }
  
    function sub(pattern, replacement, count) {
      replacement = prepareReplacement(replacement);
      count = Object.isUndefined(count) ? 1 : count;
  
      return this.gsub(pattern, function(match) {
        if (--count < 0) return match[0];
        return replacement(match);
      });
    }
  
    function scan(pattern, iterator) {
      this.gsub(pattern, iterator);
      return String(this);
    }
  
    function truncate(length, truncation) {
      length = length || 30;
      truncation = Object.isUndefined(truncation) ? '...' : truncation;
      return this.length > length ?
        this.slice(0, length - truncation.length) + truncation : String(this);
    }
  
    function strip() {
      return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }
  
    function stripTags() {
      return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }
  
    function stripScripts() {
      return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
    }
  
    function extractScripts() {
      var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
          matchOne = new RegExp(Prototype.ScriptFragment, 'im');
      return (this.match(matchAll) || []).map(function(scriptTag) {
        return (scriptTag.match(matchOne) || ['', ''])[1];
      });
    }
  
    function evalScripts() {
      return this.extractScripts().map(function(script) { return eval(script) });
    }
  
    function escapeHTML() {
      return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
  
    function unescapeHTML() {
      return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
    }
  
  
    function toQueryParams(separator) {
      var match = this.strip().match(/([^?#]*)(#.*)?$/);
      if (!match) return { };
  
      return match[1].split(separator || '&').inject({ }, function(hash, pair) {
        if ((pair = pair.split('='))[0]) {
          var key = decodeURIComponent(pair.shift()),
              value = pair.length > 1 ? pair.join('=') : pair[0];
  
          if (value != undefined) value = decodeURIComponent(value);
  
          if (key in hash) {
            if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
            hash[key].push(value);
          }
          else hash[key] = value;
        }
        return hash;
      });
    }
  
    function toArray() {
      return this.split('');
    }
  
    function succ() {
      return this.slice(0, this.length - 1) +
        String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
    }
  
    function times(count) {
      return count < 1 ? '' : new Array(count + 1).join(this);
    }
  
    function camelize() {
      return this.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    }
  
    function capitalize() {
      return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }
  
    function underscore() {
      return this.replace(/::/g, '/')
                 .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
                 .replace(/([a-z\d])([A-Z])/g, '$1_$2')
                 .replace(/-/g, '_')
                 .toLowerCase();
    }
  
    function dasherize() {
      return this.replace(/_/g, '-');
    }
  
    function inspect(useDoubleQuotes) {
      var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
        if (character in String.specialChar) {
          return String.specialChar[character];
        }
        return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
      });
      if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
      return "'" + escapedString.replace(/'/g, '\\\'') + "'";
    }
  
    function unfilterJSON(filter) {
      return this.replace(filter || Prototype.JSONFilter, '$1');
    }
  
    function isJSON() {
      var str = this;
      if (str.blank()) return false;
      str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
      str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
      str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
      return (/^[\],:{}\s]*$/).test(str);
    }
  
    function evalJSON(sanitize) {
      var json = this.unfilterJSON(),
          cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      if (cx.test(json)) {
        json = json.replace(cx, function (a) {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }
      try {
        if (!sanitize || json.isJSON()) return eval('(' + json + ')');
      } catch (e) { }
      throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
    }
  
    function parseJSON() {
      var json = this.unfilterJSON();
      return JSON.parse(json);
    }
  
    function include(pattern) {
      return this.indexOf(pattern) > -1;
    }
  
    function startsWith(pattern) {
      return this.lastIndexOf(pattern, 0) === 0;
    }
  
    function endsWith(pattern) {
      var d = this.length - pattern.length;
      return d >= 0 && this.indexOf(pattern, d) === d;
    }
  
    function empty() {
      return this == '';
    }
  
    function blank() {
      return /^\s*$/.test(this);
    }
  
    function interpolate(object, pattern) {
      return new Template(this, pattern).evaluate(object);
    }
  
    return {
      gsub:           gsub,
      sub:            sub,
      scan:           scan,
      truncate:       truncate,
      strip:          String.prototype.trim || strip,
      stripTags:      stripTags,
      stripScripts:   stripScripts,
      extractScripts: extractScripts,
      evalScripts:    evalScripts,
      escapeHTML:     escapeHTML,
      unescapeHTML:   unescapeHTML,
      toQueryParams:  toQueryParams,
      parseQuery:     toQueryParams,
      toArray:        toArray,
      succ:           succ,
      times:          times,
      camelize:       camelize,
      capitalize:     capitalize,
      underscore:     underscore,
      dasherize:      dasherize,
      inspect:        inspect,
      unfilterJSON:   unfilterJSON,
      isJSON:         isJSON,
      evalJSON:       NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
      include:        include,
      startsWith:     startsWith,
      endsWith:       endsWith,
      empty:          empty,
      blank:          blank,
      interpolate:    interpolate
    };
  })());
  
  var Template = Class.create({
    initialize: function(template, pattern) {
      this.template = template.toString();
      this.pattern = pattern || Template.Pattern;
    },
  
    evaluate: function(object) {
      if (object && Object.isFunction(object.toTemplateReplacements))
        object = object.toTemplateReplacements();
  
      return this.template.gsub(this.pattern, function(match) {
        if (object == null) return (match[1] + '');
  
        var before = match[1] || '';
        if (before == '\\') return match[2];
  
        var ctx = object, expr = match[3],
            pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
  
        match = pattern.exec(expr);
        if (match == null) return before;
  
        while (match != null) {
          var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
          ctx = ctx[comp];
          if (null == ctx || '' == match[3]) break;
          expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
          match = pattern.exec(expr);
        }
  
        return before + String.interpret(ctx);
      });
    }
  });
  Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
  
  var $break = { };
  
  var Enumerable = (function() {
    function each(iterator, context) {
      var index = 0;
      try {
        this._each(function(value) {
          iterator.call(context, value, index++);
        });
      } catch (e) {
        if (e != $break) throw e;
      }
      return this;
    }
  
    function eachSlice(number, iterator, context) {
      var index = -number, slices = [], array = this.toArray();
      if (number < 1) return array;
      while ((index += number) < array.length)
        slices.push(array.slice(index, index+number));
      return slices.collect(iterator, context);
    }
  
    function all(iterator, context) {
      iterator = iterator || Prototype.K;
      var result = true;
      this.each(function(value, index) {
        result = result && !!iterator.call(context, value, index);
        if (!result) throw $break;
      });
      return result;
    }
  
    function any(iterator, context) {
      iterator = iterator || Prototype.K;
      var result = false;
      this.each(function(value, index) {
        if (result = !!iterator.call(context, value, index))
          throw $break;
      });
      return result;
    }
  
    function collect(iterator, context) {
      iterator = iterator || Prototype.K;
      var results = [];
      this.each(function(value, index) {
        results.push(iterator.call(context, value, index));
      });
      return results;
    }
  
    function detect(iterator, context) {
      var result;
      this.each(function(value, index) {
        if (iterator.call(context, value, index)) {
          result = value;
          throw $break;
        }
      });
      return result;
    }
  
    function findAll(iterator, context) {
      var results = [];
      this.each(function(value, index) {
        if (iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    }
  
    function grep(filter, iterator, context) {
      iterator = iterator || Prototype.K;
      var results = [];
  
      if (Object.isString(filter))
        filter = new RegExp(RegExp.escape(filter));
  
      this.each(function(value, index) {
        if (filter.match(value))
          results.push(iterator.call(context, value, index));
      });
      return results;
    }
  
    function include(object) {
      if (Object.isFunction(this.indexOf))
        if (this.indexOf(object) != -1) return true;
  
      var found = false;
      this.each(function(value) {
        if (value == object) {
          found = true;
          throw $break;
        }
      });
      return found;
    }
  
    function inGroupsOf(number, fillWith) {
      fillWith = Object.isUndefined(fillWith) ? null : fillWith;
      return this.eachSlice(number, function(slice) {
        while(slice.length < number) slice.push(fillWith);
        return slice;
      });
    }
  
    function inject(memo, iterator, context) {
      this.each(function(value, index) {
        memo = iterator.call(context, memo, value, index);
      });
      return memo;
    }
  
    function invoke(method) {
      var args = $A(arguments).slice(1);
      return this.map(function(value) {
        return value[method].apply(value, args);
      });
    }
  
    function max(iterator, context) {
      iterator = iterator || Prototype.K;
      var result;
      this.each(function(value, index) {
        value = iterator.call(context, value, index);
        if (result == null || value >= result)
          result = value;
      });
      return result;
    }
  
    function min(iterator, context) {
      iterator = iterator || Prototype.K;
      var result;
      this.each(function(value, index) {
        value = iterator.call(context, value, index);
        if (result == null || value < result)
          result = value;
      });
      return result;
    }
  
    function partition(iterator, context) {
      iterator = iterator || Prototype.K;
      var trues = [], falses = [];
      this.each(function(value, index) {
        (iterator.call(context, value, index) ?
          trues : falses).push(value);
      });
      return [trues, falses];
    }
  
    function pluck(property) {
      var results = [];
      this.each(function(value) {
        results.push(value[property]);
      });
      return results;
    }
  
    function reject(iterator, context) {
      var results = [];
      this.each(function(value, index) {
        if (!iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    }
  
    function sortBy(iterator, context) {
      return this.map(function(value, index) {
        return {
          value: value,
          criteria: iterator.call(context, value, index)
        };
      }).sort(function(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
      }).pluck('value');
    }
  
    function toArray() {
      return this.map();
    }
  
    function zip() {
      var iterator = Prototype.K, args = $A(arguments);
      if (Object.isFunction(args.last()))
        iterator = args.pop();
  
      var collections = [this].concat(args).map($A);
      return this.map(function(value, index) {
        return iterator(collections.pluck(index));
      });
    }
  
    function size() {
      return this.toArray().length;
    }
  
    function inspect() {
      return '#<Enumerable:' + this.toArray().inspect() + '>';
    }
  
  
  
  
  
  
  
  
  
    return {
      each:       each,
      eachSlice:  eachSlice,
      all:        all,
      every:      all,
      any:        any,
      some:       any,
      collect:    collect,
      map:        collect,
      detect:     detect,
      findAll:    findAll,
      select:     findAll,
      filter:     findAll,
      grep:       grep,
      include:    include,
      member:     include,
      inGroupsOf: inGroupsOf,
      inject:     inject,
      invoke:     invoke,
      max:        max,
      min:        min,
      partition:  partition,
      pluck:      pluck,
      reject:     reject,
      sortBy:     sortBy,
      toArray:    toArray,
      entries:    toArray,
      zip:        zip,
      size:       size,
      inspect:    inspect,
      find:       detect
    };
  })();
  
  function $A(iterable) {
    if (!iterable) return [];
    if ('toArray' in Object(iterable)) return iterable.toArray();
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
  }
  
  
  function $w(string) {
    if (!Object.isString(string)) return [];
    string = string.strip();
    return string ? string.split(/\s+/) : [];
  }
  
  Array.from = $A;
  
  
  (function() {
    var arrayProto = Array.prototype,
        slice = arrayProto.slice,
        _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available
  
    function each(iterator, context) {
      for (var i = 0, length = this.length >>> 0; i < length; i++) {
        if (i in this) iterator.call(context, this[i], i, this);
      }
    }
    if (!_each) _each = each;
  
    function clear() {
      this.length = 0;
      return this;
    }
  
    function first() {
      return this[0];
    }
  
    function last() {
      return this[this.length - 1];
    }
  
    function compact() {
      return this.select(function(value) {
        return value != null;
      });
    }
  
    function flatten() {
      return this.inject([], function(array, value) {
        if (Object.isArray(value))
          return array.concat(value.flatten());
        array.push(value);
        return array;
      });
    }
  
    function without() {
      var values = slice.call(arguments, 0);
      return this.select(function(value) {
        return !values.include(value);
      });
    }
  
    function reverse(inline) {
      return (inline === false ? this.toArray() : this)._reverse();
    }
  
    function uniq(sorted) {
      return this.inject([], function(array, value, index) {
        if (0 == index || (sorted ? array.last() != value : !array.include(value)))
          array.push(value);
        return array;
      });
    }
  
    function intersect(array) {
      return this.uniq().findAll(function(item) {
        return array.detect(function(value) { return item === value });
      });
    }
  
  
    function clone() {
      return slice.call(this, 0);
    }
  
    function size() {
      return this.length;
    }
  
    function inspect() {
      return '[' + this.map(Object.inspect).join(', ') + ']';
    }
  
    function indexOf(item, i) {
      i || (i = 0);
      var length = this.length;
      if (i < 0) i = length + i;
      for (; i < length; i++)
        if (this[i] === item) return i;
      return -1;
    }
  
    function lastIndexOf(item, i) {
      i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
      var n = this.slice(0, i).reverse().indexOf(item);
      return (n < 0) ? n : i - n - 1;
    }
  
    function concat() {
      var array = slice.call(this, 0), item;
      for (var i = 0, length = arguments.length; i < length; i++) {
        item = arguments[i];
        if (Object.isArray(item) && !('callee' in item)) {
          for (var j = 0, arrayLength = item.length; j < arrayLength; j++)
            array.push(item[j]);
        } else {
          array.push(item);
        }
      }
      return array;
    }
  
    Object.extend(arrayProto, Enumerable);
  
    if (!arrayProto._reverse)
      arrayProto._reverse = arrayProto.reverse;
  
    Object.extend(arrayProto, {
      _each:     _each,
      clear:     clear,
      first:     first,
      last:      last,
      compact:   compact,
      flatten:   flatten,
      without:   without,
      reverse:   reverse,
      uniq:      uniq,
      intersect: intersect,
      clone:     clone,
      toArray:   clone,
      size:      size,
      inspect:   inspect
    });
  
    var CONCAT_ARGUMENTS_BUGGY = (function() {
      return [].concat(arguments)[0][0] !== 1;
    })(1,2)
  
    if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;
  
    if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
    if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
  })();
  function $H(object) {
    return new Hash(object);
  };
  
  var Hash = Class.create(Enumerable, (function() {
    function initialize(object) {
      this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
    }
  
  
    function _each(iterator) {
      for (var key in this._object) {
        var value = this._object[key], pair = [key, value];
        pair.key = key;
        pair.value = value;
        iterator(pair);
      }
    }
  
    function set(key, value) {
      return this._object[key] = value;
    }
  
    function get(key) {
      if (this._object[key] !== Object.prototype[key])
        return this._object[key];
    }
  
    function unset(key) {
      var value = this._object[key];
      delete this._object[key];
      return value;
    }
  
    function toObject() {
      return Object.clone(this._object);
    }
  
  
  
    function keys() {
      return this.pluck('key');
    }
  
    function values() {
      return this.pluck('value');
    }
  
    function index(value) {
      var match = this.detect(function(pair) {
        return pair.value === value;
      });
      return match && match.key;
    }
  
    function merge(object) {
      return this.clone().update(object);
    }
  
    function update(object) {
      return new Hash(object).inject(this, function(result, pair) {
        result.set(pair.key, pair.value);
        return result;
      });
    }
  
    function toQueryPair(key, value) {
      if (Object.isUndefined(value)) return key;
      return key + '=' + encodeURIComponent(String.interpret(value));
    }
  
    function toQueryString() {
      return this.inject([], function(results, pair) {
        var key = encodeURIComponent(pair.key), values = pair.value;
  
        if (values && typeof values == 'object') {
          if (Object.isArray(values)) {
            var queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
              value = values[i];
              queryValues.push(toQueryPair(key, value));
            }
            return results.concat(queryValues);
          }
        } else results.push(toQueryPair(key, values));
        return results;
      }).join('&');
    }
  
    function inspect() {
      return '#<Hash:{' + this.map(function(pair) {
        return pair.map(Object.inspect).join(': ');
      }).join(', ') + '}>';
    }
  
    function clone() {
      return new Hash(this);
    }
  
    return {
      initialize:             initialize,
      _each:                  _each,
      set:                    set,
      get:                    get,
      unset:                  unset,
      toObject:               toObject,
      toTemplateReplacements: toObject,
      keys:                   keys,
      values:                 values,
      index:                  index,
      merge:                  merge,
      update:                 update,
      toQueryString:          toQueryString,
      inspect:                inspect,
      toJSON:                 toObject,
      clone:                  clone
    };
  })());
  
  Hash.from = $H;
  Object.extend(Number.prototype, (function() {
    function toColorPart() {
      return this.toPaddedString(2, 16);
    }
  
    function succ() {
      return this + 1;
    }
  
    function times(iterator, context) {
      $R(0, this, true).each(iterator, context);
      return this;
    }
  
    function toPaddedString(length, radix) {
      var string = this.toString(radix || 10);
      return '0'.times(length - string.length) + string;
    }
  
    function abs() {
      return Math.abs(this);
    }
  
    function round() {
      return Math.round(this);
    }
  
    function ceil() {
      return Math.ceil(this);
    }
  
    function floor() {
      return Math.floor(this);
    }
  
    return {
      toColorPart:    toColorPart,
      succ:           succ,
      times:          times,
      toPaddedString: toPaddedString,
      abs:            abs,
      round:          round,
      ceil:           ceil,
      floor:          floor
    };
  })());
  
  function $R(start, end, exclusive) {
    return new ObjectRange(start, end, exclusive);
  }
  
  var ObjectRange = Class.create(Enumerable, (function() {
    function initialize(start, end, exclusive) {
      this.start = start;
      this.end = end;
      this.exclusive = exclusive;
    }
  
    function _each(iterator) {
      var value = this.start;
      while (this.include(value)) {
        iterator(value);
        value = value.succ();
      }
    }
  
    function include(value) {
      if (value < this.start)
        return false;
      if (this.exclusive)
        return value < this.end;
      return value <= this.end;
    }
  
    return {
      initialize: initialize,
      _each:      _each,
      include:    include
    };
  })());
  
  
  
  var Ajax = {
    getTransport: function() {
      return Try.these(
        function() {return new XMLHttpRequest()},
        function() {return new ActiveXObject('Msxml2.XMLHTTP')},
        function() {return new ActiveXObject('Microsoft.XMLHTTP')}
      ) || false;
    },
  
    activeRequestCount: 0
  };
  
  Ajax.Responders = {
    responders: [],
  
    _each: function(iterator) {
      this.responders._each(iterator);
    },
  
    register: function(responder) {
      if (!this.include(responder))
        this.responders.push(responder);
    },
  
    unregister: function(responder) {
      this.responders = this.responders.without(responder);
    },
  
    dispatch: function(callback, request, transport, json) {
      this.each(function(responder) {
        if (Object.isFunction(responder[callback])) {
          try {
            responder[callback].apply(responder, [request, transport, json]);
          } catch (e) { }
        }
      });
    }
  };
  
  Object.extend(Ajax.Responders, Enumerable);
  
  Ajax.Responders.register({
    onCreate:   function() { Ajax.activeRequestCount++ },
    onComplete: function() { Ajax.activeRequestCount-- }
  });
  Ajax.Base = Class.create({
    initialize: function(options) {
      this.options = {
        method:       'post',
        asynchronous: true,
        contentType:  'application/x-www-form-urlencoded',
        encoding:     'UTF-8',
        parameters:   '',
        evalJSON:     true,
        evalJS:       true
      };
      Object.extend(this.options, options || { });
  
      this.options.method = this.options.method.toLowerCase();
  
      if (Object.isHash(this.options.parameters))
        this.options.parameters = this.options.parameters.toObject();
    }
  });
  Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
  
    initialize: function($super, url, options) {
      $super(options);
      this.transport = Ajax.getTransport();
      this.request(url);
    },
  
    request: function(url) {
      this.url = url;
      this.method = this.options.method;
      var params = Object.isString(this.options.parameters) ?
            this.options.parameters :
            Object.toQueryString(this.options.parameters);
  
      if (!['get', 'post'].include(this.method)) {
        params += (params ? '&' : '') + "_method=" + this.method;
        this.method = 'post';
      }
  
      if (params && this.method === 'get') {
        this.url += (this.url.include('?') ? '&' : '?') + params;
      }
  
      this.parameters = params.toQueryParams();
  
      try {
        var response = new Ajax.Response(this);
        if (this.options.onCreate) this.options.onCreate(response);
        Ajax.Responders.dispatch('onCreate', this, response);
  
        this.transport.open(this.method.toUpperCase(), this.url,
          this.options.asynchronous);
  
        if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);
  
        this.transport.onreadystatechange = this.onStateChange.bind(this);
        this.setRequestHeaders();
  
        this.body = this.method == 'post' ? (this.options.postBody || params) : null;
        this.transport.send(this.body);
  
        /* Force Firefox to handle ready state 4 for synchronous requests */
        if (!this.options.asynchronous && this.transport.overrideMimeType)
          this.onStateChange();
  
      }
      catch (e) {
        this.dispatchException(e);
      }
    },
  
    onStateChange: function() {
      var readyState = this.transport.readyState;
      if (readyState > 1 && !((readyState == 4) && this._complete))
        this.respondToReadyState(this.transport.readyState);
    },
  
    setRequestHeaders: function() {
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Prototype-Version': Prototype.Version,
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      };
  
      if (this.method == 'post') {
        headers['Content-type'] = this.options.contentType +
          (this.options.encoding ? '; charset=' + this.options.encoding : '');
  
        
        if (this.transport.overrideMimeType &&
            (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
              headers['Connection'] = 'close';
      }
  
      if (typeof this.options.requestHeaders == 'object') {
        var extras = this.options.requestHeaders;
  
        if (Object.isFunction(extras.push))
          for (var i = 0, length = extras.length; i < length; i += 2)
            headers[extras[i]] = extras[i+1];
        else
          $H(extras).each(function(pair) { headers[pair.key] = pair.value });
      }
  
      for (var name in headers)
        this.transport.setRequestHeader(name, headers[name]);
    },
  
    success: function() {
      var status = this.getStatus();
      return !status || (status >= 200 && status < 300) || status == 304;
    },
  
    getStatus: function() {
      try {
        if (this.transport.status === 1223) return 204;
        return this.transport.status || 0;
      } catch (e) { return 0 }
    },
  
    respondToReadyState: function(readyState) {
      var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);
  
      if (state == 'Complete') {
        try {
          this._complete = true;
          (this.options['on' + response.status]
           || this.options['on' + (this.success() ? 'Success' : 'Failure')]
           || Prototype.emptyFunction)(response, response.headerJSON);
        } catch (e) {
          this.dispatchException(e);
        }
  
        var contentType = response.getHeader('Content-type');
        if (this.options.evalJS == 'force'
            || (this.options.evalJS && this.isSameOrigin() && contentType
            && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
          this.evalResponse();
      }
  
      try {
        (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
        Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }
  
      if (state == 'Complete') {
        this.transport.onreadystatechange = Prototype.emptyFunction;
      }
    },
  
    isSameOrigin: function() {
      var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
      return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
        protocol: location.protocol,
        domain: document.domain,
        port: location.port ? ':' + location.port : ''
      }));
    },
  
    getHeader: function(name) {
      try {
        return this.transport.getResponseHeader(name) || null;
      } catch (e) { return null; }
    },
  
    evalResponse: function() {
      try {
        return eval((this.transport.responseText || '').unfilterJSON());
      } catch (e) {
        this.dispatchException(e);
      }
    },
  
    dispatchException: function(exception) {
      (this.options.onException || Prototype.emptyFunction)(this, exception);
      Ajax.Responders.dispatch('onException', this, exception);
    }
  });
  
  Ajax.Request.Events =
    ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
  
  
  Ajax.Response = Class.create({
    initialize: function(request){
      this.request = request;
      var transport  = this.transport  = request.transport,
          readyState = this.readyState = transport.readyState;
  
      if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
        this.status       = this.getStatus();
        this.statusText   = this.getStatusText();
        this.responseText = String.interpret(transport.responseText);
        this.headerJSON   = this._getHeaderJSON();
      }
  
      if (readyState == 4) {
        var xml = transport.responseXML;
        this.responseXML  = Object.isUndefined(xml) ? null : xml;
        this.responseJSON = this._getResponseJSON();
      }
    },
  
    status:      0,
  
    statusText: '',
  
    getStatus: Ajax.Request.prototype.getStatus,
  
    getStatusText: function() {
      try {
        return this.transport.statusText || '';
      } catch (e) { return '' }
    },
  
    getHeader: Ajax.Request.prototype.getHeader,
  
    getAllHeaders: function() {
      try {
        return this.getAllResponseHeaders();
      } catch (e) { return null }
    },
  
    getResponseHeader: function(name) {
      return this.transport.getResponseHeader(name);
    },
  
    getAllResponseHeaders: function() {
      return this.transport.getAllResponseHeaders();
    },
  
    _getHeaderJSON: function() {
      var json = this.getHeader('X-JSON');
      if (!json) return null;
      json = decodeURIComponent(escape(json));
      try {
        return json.evalJSON(this.request.options.sanitizeJSON ||
          !this.request.isSameOrigin());
      } catch (e) {
        this.request.dispatchException(e);
      }
    },
  
    _getResponseJSON: function() {
      var options = this.request.options;
      if (!options.evalJSON || (options.evalJSON != 'force' &&
        !(this.getHeader('Content-type') || '').include('application/json')) ||
          this.responseText.blank())
            return null;
      try {
        return this.responseText.evalJSON(options.sanitizeJSON ||
          !this.request.isSameOrigin());
      } catch (e) {
        this.request.dispatchException(e);
      }
    }
  });
  
  Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function($super, container, url, options) {
      this.container = {
        success: (container.success || container),
        failure: (container.failure || (container.success ? null : container))
      };
  
      options = Object.clone(options);
      var onComplete = options.onComplete;
      options.onComplete = (function(response, json) {
        this.updateContent(response.responseText);
        if (Object.isFunction(onComplete)) onComplete(response, json);
      }).bind(this);
  
      $super(url, options);
    },
  
    updateContent: function(responseText) {
      var receiver = this.container[this.success() ? 'success' : 'failure'],
          options = this.options;
  
      if (!options.evalScripts) responseText = responseText.stripScripts();
  
      if (receiver = $(receiver)) {
        if (options.insertion) {
          if (Object.isString(options.insertion)) {
            var insertion = { }; insertion[options.insertion] = responseText;
            receiver.insert(insertion);
          }
          else options.insertion(receiver, responseText);
        }
        else receiver.update(responseText);
      }
    }
  });
  
  Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function($super, container, url, options) {
      $super(options);
      this.onComplete = this.options.onComplete;
  
      this.frequency = (this.options.frequency || 2);
      this.decay = (this.options.decay || 1);
  
      this.updater = { };
      this.container = container;
      this.url = url;
  
      this.start();
    },
  
    start: function() {
      this.options.onComplete = this.updateComplete.bind(this);
      this.onTimerEvent();
    },
  
    stop: function() {
      this.updater.options.onComplete = undefined;
      clearTimeout(this.timer);
      (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
    },
  
    updateComplete: function(response) {
      if (this.options.decay) {
        this.decay = (response.responseText == this.lastText ?
          this.decay * this.options.decay : 1);
  
        this.lastText = response.responseText;
      }
      this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
    },
  
    onTimerEvent: function() {
      this.updater = new Ajax.Updater(this.container, this.url, this.options);
    }
  });
  
  
  function $(element) {
    if (arguments.length > 1) {
      for (var i = 0, elements = [], length = arguments.length; i < length; i++)
        elements.push($(arguments[i]));
      return elements;
    }
    if (Object.isString(element))
      element = document.getElementById(element);
    return Element.extend(element);
  }
  
  if (Prototype.BrowserFeatures.XPath) {
    document._getElementsByXPath = function(expression, parentElement) {
      var results = [];
      var query = document.evaluate(expression, $(parentElement) || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var i = 0, length = query.snapshotLength; i < length; i++)
        results.push(Element.extend(query.snapshotItem(i)));
      return results;
    };
  }
  
  /*--------------------------------------------------------------------------*/
  
  if (!Node) var Node = { };
  
  if (!Node.ELEMENT_NODE) {
    Object.extend(Node, {
      ELEMENT_NODE: 1,
      ATTRIBUTE_NODE: 2,
      TEXT_NODE: 3,
      CDATA_SECTION_NODE: 4,
      ENTITY_REFERENCE_NODE: 5,
      ENTITY_NODE: 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE: 8,
      DOCUMENT_NODE: 9,
      DOCUMENT_TYPE_NODE: 10,
      DOCUMENT_FRAGMENT_NODE: 11,
      NOTATION_NODE: 12
    });
  }
  
  
  
  (function(global) {
    function shouldUseCache(tagName, attributes) {
      if (tagName === 'select') return false;
      if ('type' in attributes) return false;
      return true;
    }
  
    var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function(){
      try {
        var el = document.createElement('<input name="x">');
        return el.tagName.toLowerCase() === 'input' && el.name === 'x';
      }
      catch(err) {
        return false;
      }
    })();
  
    var element = global.Element;
  
    global.Element = function(tagName, attributes) {
      attributes = attributes || { };
      tagName = tagName.toLowerCase();
      var cache = Element.cache;
  
      if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
        tagName = '<' + tagName + ' name="' + attributes.name + '">';
        delete attributes.name;
        return Element.writeAttribute(document.createElement(tagName), attributes);
      }
  
      if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
  
      var node = shouldUseCache(tagName, attributes) ?
       cache[tagName].cloneNode(false) : document.createElement(tagName);
  
      return Element.writeAttribute(node, attributes);
    };
  
    Object.extend(global.Element, element || { });
    if (element) global.Element.prototype = element.prototype;
  
  })(this);
  
  Element.idCounter = 1;
  Element.cache = { };
  
  Element._purgeElement = function(element) {
    var uid = element._prototypeUID;
    if (uid) {
      Element.stopObserving(element);
      element._prototypeUID = void 0;
      delete Element.Storage[uid];
    }
  }
  
  Element.Methods = {
    visible: function(element) {
      return $(element).style.display != 'none';
    },
  
    toggle: function(element) {
      element = $(element);
      Element[Element.visible(element) ? 'hide' : 'show'](element);
      return element;
    },
  
    hide: function(element) {
      element = $(element);
      element.style.display = 'none';
      return element;
    },
  
    show: function(element) {
      element = $(element);
      element.style.display = '';
      return element;
    },
  
    remove: function(element) {
      element = $(element);
      element.parentNode.removeChild(element);
      return element;
    },
  
    update: (function(){
  
      var SELECT_ELEMENT_INNERHTML_BUGGY = (function(){
        var el = document.createElement("select"),
            isBuggy = true;
        el.innerHTML = "<option value=\"test\">test</option>";
        if (el.options && el.options[0]) {
          isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
        }
        el = null;
        return isBuggy;
      })();
  
      var TABLE_ELEMENT_INNERHTML_BUGGY = (function(){
        try {
          var el = document.createElement("table");
          if (el && el.tBodies) {
            el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
            var isBuggy = typeof el.tBodies[0] == "undefined";
            el = null;
            return isBuggy;
          }
        } catch (e) {
          return true;
        }
      })();
  
      var LINK_ELEMENT_INNERHTML_BUGGY = (function() {
        try {
          var el = document.createElement('div');
          el.innerHTML = "<link>";
          var isBuggy = (el.childNodes.length === 0);
          el = null;
          return isBuggy;
        } catch(e) {
          return true;
        }
      })();
  
      var ANY_INNERHTML_BUGGY = SELECT_ELEMENT_INNERHTML_BUGGY ||
       TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;
  
      var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
        var s = document.createElement("script"),
            isBuggy = false;
        try {
          s.appendChild(document.createTextNode(""));
          isBuggy = !s.firstChild ||
            s.firstChild && s.firstChild.nodeType !== 3;
        } catch (e) {
          isBuggy = true;
        }
        s = null;
        return isBuggy;
      })();
  
  
      function update(element, content) {
        element = $(element);
        var purgeElement = Element._purgeElement;
  
        var descendants = element.getElementsByTagName('*'),
         i = descendants.length;
        while (i--) purgeElement(descendants[i]);
  
        if (content && content.toElement)
          content = content.toElement();
  
        if (Object.isElement(content))
          return element.update().insert(content);
  
        content = Object.toHTML(content);
  
        var tagName = element.tagName.toUpperCase();
  
        if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
          element.text = content;
          return element;
        }
  
        if (ANY_INNERHTML_BUGGY) {
          if (tagName in Element._insertionTranslations.tags) {
            while (element.firstChild) {
              element.removeChild(element.firstChild);
            }
            Element._getContentFromAnonymousElement(tagName, content.stripScripts())
              .each(function(node) {
                element.appendChild(node)
              });
          } else if (LINK_ELEMENT_INNERHTML_BUGGY && Object.isString(content) && content.indexOf('<link') > -1) {
            while (element.firstChild) {
              element.removeChild(element.firstChild);
            }
            var nodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts(), true);
            nodes.each(function(node) { element.appendChild(node) });
          }
          else {
            element.innerHTML = content.stripScripts();
          }
        }
        else {
          element.innerHTML = content.stripScripts();
        }
  
        content.evalScripts.bind(content).defer();
        return element;
      }
  
      return update;
    })(),
  
    replace: function(element, content) {
      element = $(element);
      if (content && content.toElement) content = content.toElement();
      else if (!Object.isElement(content)) {
        content = Object.toHTML(content);
        var range = element.ownerDocument.createRange();
        range.selectNode(element);
        content.evalScripts.bind(content).defer();
        content = range.createContextualFragment(content.stripScripts());
      }
      element.parentNode.replaceChild(content, element);
      return element;
    },
  
    insert: function(element, insertions) {
      element = $(element);
  
      if (Object.isString(insertions) || Object.isNumber(insertions) ||
          Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
            insertions = {bottom:insertions};
  
      var content, insert, tagName, childNodes;
  
      for (var position in insertions) {
        content  = insertions[position];
        position = position.toLowerCase();
        insert = Element._insertionTranslations[position];
  
        if (content && content.toElement) content = content.toElement();
        if (Object.isElement(content)) {
          insert(element, content);
          continue;
        }
  
        content = Object.toHTML(content);
  
        tagName = ((position == 'before' || position == 'after')
          ? element.parentNode : element).tagName.toUpperCase();
  
        childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
  
        if (position == 'top' || position == 'after') childNodes.reverse();
        childNodes.each(insert.curry(element));
  
        content.evalScripts.bind(content).defer();
      }
  
      return element;
    },
  
    wrap: function(element, wrapper, attributes) {
      element = $(element);
      if (Object.isElement(wrapper))
        $(wrapper).writeAttribute(attributes || { });
      else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
      else wrapper = new Element('div', wrapper);
      if (element.parentNode)
        element.parentNode.replaceChild(wrapper, element);
      wrapper.appendChild(element);
      return wrapper;
    },
  
    inspect: function(element) {
      element = $(element);
      var result = '<' + element.tagName.toLowerCase();
      $H({'id': 'id', 'className': 'class'}).each(function(pair) {
        var property = pair.first(),
            attribute = pair.last(),
            value = (element[property] || '').toString();
        if (value) result += ' ' + attribute + '=' + value.inspect(true);
      });
      return result + '>';
    },
  
    recursivelyCollect: function(element, property, maximumLength) {
      element = $(element);
      maximumLength = maximumLength || -1;
      var elements = [];
  
      while (element = element[property]) {
        if (element.nodeType == 1)
          elements.push(Element.extend(element));
        if (elements.length == maximumLength)
          break;
      }
  
      return elements;
    },
  
    ancestors: function(element) {
      return Element.recursivelyCollect(element, 'parentNode');
    },
  
    descendants: function(element) {
      return Element.select(element, "*");
    },
  
    firstDescendant: function(element) {
      element = $(element).firstChild;
      while (element && element.nodeType != 1) element = element.nextSibling;
      return $(element);
    },
  
    immediateDescendants: function(element) {
      var results = [], child = $(element).firstChild;
      while (child) {
        if (child.nodeType === 1) {
          results.push(Element.extend(child));
        }
        child = child.nextSibling;
      }
      return results;
    },
  
    previousSiblings: function(element, maximumLength) {
      return Element.recursivelyCollect(element, 'previousSibling');
    },
  
    nextSiblings: function(element) {
      return Element.recursivelyCollect(element, 'nextSibling');
    },
  
    siblings: function(element) {
      element = $(element);
      return Element.previousSiblings(element).reverse()
        .concat(Element.nextSiblings(element));
    },
  
    match: function(element, selector) {
      element = $(element);
      if (Object.isString(selector))
        return Prototype.Selector.match(element, selector);
      return selector.match(element);
    },
  
    up: function(element, expression, index) {
      element = $(element);
      if (arguments.length == 1) return $(element.parentNode);
      var ancestors = Element.ancestors(element);
      return Object.isNumber(expression) ? ancestors[expression] :
        Prototype.Selector.find(ancestors, expression, index);
    },
  
    down: function(element, expression, index) {
      element = $(element);
      if (arguments.length == 1) return Element.firstDescendant(element);
      return Object.isNumber(expression) ? Element.descendants(element)[expression] :
        Element.select(element, expression)[index || 0];
    },
  
    previous: function(element, expression, index) {
      element = $(element);
      if (Object.isNumber(expression)) index = expression, expression = false;
      if (!Object.isNumber(index)) index = 0;
  
      if (expression) {
        return Prototype.Selector.find(element.previousSiblings(), expression, index);
      } else {
        return element.recursivelyCollect("previousSibling", index + 1)[index];
      }
    },
  
    next: function(element, expression, index) {
      element = $(element);
      if (Object.isNumber(expression)) index = expression, expression = false;
      if (!Object.isNumber(index)) index = 0;
  
      if (expression) {
        return Prototype.Selector.find(element.nextSiblings(), expression, index);
      } else {
        var maximumLength = Object.isNumber(index) ? index + 1 : 1;
        return element.recursivelyCollect("nextSibling", index + 1)[index];
      }
    },
  
  
    select: function(element) {
      element = $(element);
      var expressions = Array.prototype.slice.call(arguments, 1).join(', ');
      return Prototype.Selector.select(expressions, element);
    },
  
    adjacent: function(element) {
      element = $(element);
      var expressions = Array.prototype.slice.call(arguments, 1).join(', ');
      return Prototype.Selector.select(expressions, element.parentNode).without(element);
    },
  
    identify: function(element) {
      element = $(element);
      var id = Element.readAttribute(element, 'id');
      if (id) return id;
      do { id = 'anonymous_element_' + Element.idCounter++ } while ($(id));
      Element.writeAttribute(element, 'id', id);
      return id;
    },
  
    readAttribute: function(element, name) {
      element = $(element);
      if (Prototype.Browser.IE) {
        var t = Element._attributeTranslations.read;
        if (t.values[name]) return t.values[name](element, name);
        if (t.names[name]) name = t.names[name];
        if (name.include(':')) {
          return (!element.attributes || !element.attributes[name]) ? null :
           element.attributes[name].value;
        }
      }
      return element.getAttribute(name);
    },
  
    writeAttribute: function(element, name, value) {
      element = $(element);
      var attributes = { }, t = Element._attributeTranslations.write;
  
      if (typeof name == 'object') attributes = name;
      else attributes[name] = Object.isUndefined(value) ? true : value;
  
      for (var attr in attributes) {
        name = t.names[attr] || attr;
        value = attributes[attr];
        if (t.values[attr]) name = t.values[attr](element, value);
        if (value === false || value === null)
          element.removeAttribute(name);
        else if (value === true)
          element.setAttribute(name, name);
        else element.setAttribute(name, value);
      }
      return element;
    },
  
    getHeight: function(element) {
      return Element.getDimensions(element).height;
    },
  
    getWidth: function(element) {
      return Element.getDimensions(element).width;
    },
  
    classNames: function(element) {
      return new Element.ClassNames(element);
    },
  
    hasClassName: function(element, className) {
      if (!(element = $(element))) return;
      var elementClassName = element.className;
      return (elementClassName.length > 0 && (elementClassName == className ||
        new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
    },
  
    addClassName: function(element, className) {
      if (!(element = $(element))) return;
      if (!Element.hasClassName(element, className))
        element.className += (element.className ? ' ' : '') + className;
      return element;
    },
  
    removeClassName: function(element, className) {
      if (!(element = $(element))) return;
      element.className = element.className.replace(
        new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
      return element;
    },
  
    toggleClassName: function(element, className) {
      if (!(element = $(element))) return;
      return Element[Element.hasClassName(element, className) ?
        'removeClassName' : 'addClassName'](element, className);
    },
  
    cleanWhitespace: function(element) {
      element = $(element);
      var node = element.firstChild;
      while (node) {
        var nextNode = node.nextSibling;
        if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
          element.removeChild(node);
        node = nextNode;
      }
      return element;
    },
  
    empty: function(element) {
      return $(element).innerHTML.blank();
    },
  
    descendantOf: function(element, ancestor) {
      element = $(element), ancestor = $(ancestor);
  
      if (element.compareDocumentPosition)
        return (element.compareDocumentPosition(ancestor) & 8) === 8;
  
      if (ancestor.contains)
        return ancestor.contains(element) && ancestor !== element;
  
      while (element = element.parentNode)
        if (element == ancestor) return true;
  
      return false;
    },
  
    scrollTo: function(element) {
      element = $(element);
      var pos = Element.cumulativeOffset(element);
      window.scrollTo(pos[0], pos[1]);
      return element;
    },
  
    getStyle: function(element, style) {
      element = $(element);
      style = style == 'float' ? 'cssFloat' : style.camelize();
      var value = element.style[style];
      if (!value || value == 'auto') {
        var css = document.defaultView.getComputedStyle(element, null);
        value = css ? css[style] : null;
      }
      if (style == 'opacity') return value ? parseFloat(value) : 1.0;
      return value == 'auto' ? null : value;
    },
  
    getOpacity: function(element) {
      return $(element).getStyle('opacity');
    },
  
    setStyle: function(element, styles) {
      element = $(element);
      var elementStyle = element.style, match;
      if (Object.isString(styles)) {
        element.style.cssText += ';' + styles;
        return styles.include('opacity') ?
          element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
      }
      for (var property in styles)
        if (property == 'opacity') element.setOpacity(styles[property]);
        else
          elementStyle[(property == 'float' || property == 'cssFloat') ?
            (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
              property] = styles[property];
  
      return element;
    },
  
    setOpacity: function(element, value) {
      element = $(element);
      element.style.opacity = (value == 1 || value === '') ? '' :
        (value < 0.00001) ? 0 : value;
      return element;
    },
  
    makePositioned: function(element) {
      element = $(element);
      var pos = Element.getStyle(element, 'position');
      if (pos == 'static' || !pos) {
        element._madePositioned = true;
        element.style.position = 'relative';
        if (Prototype.Browser.Opera) {
          element.style.top = 0;
          element.style.left = 0;
        }
      }
      return element;
    },
  
    undoPositioned: function(element) {
      element = $(element);
      if (element._madePositioned) {
        element._madePositioned = undefined;
        element.style.position =
          element.style.top =
          element.style.left =
          element.style.bottom =
          element.style.right = '';
      }
      return element;
    },
  
    makeClipping: function(element) {
      element = $(element);
      if (element._overflow) return element;
      element._overflow = Element.getStyle(element, 'overflow') || 'auto';
      if (element._overflow !== 'hidden')
        element.style.overflow = 'hidden';
      return element;
    },
  
    undoClipping: function(element) {
      element = $(element);
      if (!element._overflow) return element;
      element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
      element._overflow = null;
      return element;
    },
  
    clonePosition: function(element, source) {
      var options = Object.extend({
        setLeft:    true,
        setTop:     true,
        setWidth:   true,
        setHeight:  true,
        offsetTop:  0,
        offsetLeft: 0
      }, arguments[2] || { });
  
      source = $(source);
      var p = Element.viewportOffset(source), delta = [0, 0], parent = null;
  
      element = $(element);
  
      if (Element.getStyle(element, 'position') == 'absolute') {
        parent = Element.getOffsetParent(element);
        delta = Element.viewportOffset(parent);
      }
  
      if (parent == document.body) {
        delta[0] -= document.body.offsetLeft;
        delta[1] -= document.body.offsetTop;
      }
  
      if (options.setLeft)   element.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
      if (options.setTop)    element.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
      if (options.setWidth)  element.style.width = source.offsetWidth + 'px';
      if (options.setHeight) element.style.height = source.offsetHeight + 'px';
      return element;
    }
  };
  
  Object.extend(Element.Methods, {
    getElementsBySelector: Element.Methods.select,
  
    childElements: Element.Methods.immediateDescendants
  });
  
  Element._attributeTranslations = {
    write: {
      names: {
        className: 'class',
        htmlFor:   'for'
      },
      values: { }
    }
  };
  
  if (Prototype.Browser.Opera) {
    Element.Methods.getStyle = Element.Methods.getStyle.wrap(
      function(proceed, element, style) {
        switch (style) {
          case 'height': case 'width':
            if (!Element.visible(element)) return null;
  
            var dim = parseInt(proceed(element, style), 10);
  
            if (dim !== element['offset' + style.capitalize()])
              return dim + 'px';
  
            var properties;
            if (style === 'height') {
              properties = ['border-top-width', 'padding-top',
               'padding-bottom', 'border-bottom-width'];
            }
            else {
              properties = ['border-left-width', 'padding-left',
               'padding-right', 'border-right-width'];
            }
            return properties.inject(dim, function(memo, property) {
              var val = proceed(element, property);
              return val === null ? memo : memo - parseInt(val, 10);
            }) + 'px';
          default: return proceed(element, style);
        }
      }
    );
  
    Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(
      function(proceed, element, attribute) {
        if (attribute === 'title') return element.title;
        return proceed(element, attribute);
      }
    );
  }
  
  else if (Prototype.Browser.IE) {
    Element.Methods.getStyle = function(element, style) {
      element = $(element);
      style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
      var value = element.style[style];
      if (!value && element.currentStyle) value = element.currentStyle[style];
  
      if (style == 'opacity') {
        if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
          if (value[1]) return parseFloat(value[1]) / 100;
        return 1.0;
      }
  
      if (value == 'auto') {
        if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
          return element['offset' + style.capitalize()] + 'px';
        return null;
      }
      return value;
    };
  
    Element.Methods.setOpacity = function(element, value) {
      function stripAlpha(filter){
        return filter.replace(/alpha\([^\)]*\)/gi,'');
      }
      element = $(element);
      var currentStyle = element.currentStyle;
      if ((currentStyle && !currentStyle.hasLayout) ||
        (!currentStyle && element.style.zoom == 'normal'))
          element.style.zoom = 1;
  
      var filter = element.getStyle('filter'), style = element.style;
      if (value == 1 || value === '') {
        (filter = stripAlpha(filter)) ?
          style.filter = filter : style.removeAttribute('filter');
        return element;
      } else if (value < 0.00001) value = 0;
      style.filter = stripAlpha(filter) +
        'alpha(opacity=' + (value * 100) + ')';
      return element;
    };
  
    Element._attributeTranslations = (function(){
  
      var classProp = 'className',
          forProp = 'for',
          el = document.createElement('div');
  
      el.setAttribute(classProp, 'x');
  
      if (el.className !== 'x') {
        el.setAttribute('class', 'x');
        if (el.className === 'x') {
          classProp = 'class';
        }
      }
      el = null;
  
      el = document.createElement('label');
      el.setAttribute(forProp, 'x');
      if (el.htmlFor !== 'x') {
        el.setAttribute('htmlFor', 'x');
        if (el.htmlFor === 'x') {
          forProp = 'htmlFor';
        }
      }
      el = null;
  
      return {
        read: {
          names: {
            'class':      classProp,
            'className':  classProp,
            'for':        forProp,
            'htmlFor':    forProp
          },
          values: {
            _getAttr: function(element, attribute) {
              return element.getAttribute(attribute);
            },
            _getAttr2: function(element, attribute) {
              return element.getAttribute(attribute, 2);
            },
            _getAttrNode: function(element, attribute) {
              var node = element.getAttributeNode(attribute);
              return node ? node.value : "";
            },
            _getEv: (function(){
  
              var el = document.createElement('div'), f;
              el.onclick = Prototype.emptyFunction;
              var value = el.getAttribute('onclick');
  
              if (String(value).indexOf('{') > -1) {
                f = function(element, attribute) {
                  attribute = element.getAttribute(attribute);
                  if (!attribute) return null;
                  attribute = attribute.toString();
                  attribute = attribute.split('{')[1];
                  attribute = attribute.split('}')[0];
                  return attribute.strip();
                };
              }
              else if (value === '') {
                f = function(element, attribute) {
                  attribute = element.getAttribute(attribute);
                  if (!attribute) return null;
                  return attribute.strip();
                };
              }
              el = null;
              return f;
            })(),
            _flag: function(element, attribute) {
              return $(element).hasAttribute(attribute) ? attribute : null;
            },
            style: function(element) {
              return element.style.cssText.toLowerCase();
            },
            title: function(element) {
              return element.title;
            }
          }
        }
      }
    })();
  
    Element._attributeTranslations.write = {
      names: Object.extend({
        cellpadding: 'cellPadding',
        cellspacing: 'cellSpacing'
      }, Element._attributeTranslations.read.names),
      values: {
        checked: function(element, value) {
          element.checked = !!value;
        },
  
        style: function(element, value) {
          element.style.cssText = value ? value : '';
        }
      }
    };
  
    Element._attributeTranslations.has = {};
  
    $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' +
        'encType maxLength readOnly longDesc frameBorder').each(function(attr) {
      Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
      Element._attributeTranslations.has[attr.toLowerCase()] = attr;
    });
  
    (function(v) {
      Object.extend(v, {
        href:        v._getAttr2,
        src:         v._getAttr2,
        type:        v._getAttr,
        action:      v._getAttrNode,
        disabled:    v._flag,
        checked:     v._flag,
        readonly:    v._flag,
        multiple:    v._flag,
        onload:      v._getEv,
        onunload:    v._getEv,
        onclick:     v._getEv,
        ondblclick:  v._getEv,
        onmousedown: v._getEv,
        onmouseup:   v._getEv,
        onmouseover: v._getEv,
        onmousemove: v._getEv,
        onmouseout:  v._getEv,
        onfocus:     v._getEv,
        onblur:      v._getEv,
        onkeypress:  v._getEv,
        onkeydown:   v._getEv,
        onkeyup:     v._getEv,
        onsubmit:    v._getEv,
        onreset:     v._getEv,
        onselect:    v._getEv,
        onchange:    v._getEv
      });
    })(Element._attributeTranslations.read.values);
  
    if (Prototype.BrowserFeatures.ElementExtensions) {
      (function() {
        function _descendants(element) {
          var nodes = element.getElementsByTagName('*'), results = [];
          for (var i = 0, node; node = nodes[i]; i++)
            if (node.tagName !== "!") // Filter out comment nodes.
              results.push(node);
          return results;
        }
  
        Element.Methods.down = function(element, expression, index) {
          element = $(element);
          if (arguments.length == 1) return element.firstDescendant();
          return Object.isNumber(expression) ? _descendants(element)[expression] :
            Element.select(element, expression)[index || 0];
        }
      })();
    }
  
  }
  
  else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
    Element.Methods.setOpacity = function(element, value) {
      element = $(element);
      element.style.opacity = (value == 1) ? 0.999999 :
        (value === '') ? '' : (value < 0.00001) ? 0 : value;
      return element;
    };
  }
  
  else if (Prototype.Browser.WebKit) {
    Element.Methods.setOpacity = function(element, value) {
      element = $(element);
      element.style.opacity = (value == 1 || value === '') ? '' :
        (value < 0.00001) ? 0 : value;
  
      if (value == 1)
        if (element.tagName.toUpperCase() == 'IMG' && element.width) {
          element.width++; element.width--;
        } else try {
          var n = document.createTextNode(' ');
          element.appendChild(n);
          element.removeChild(n);
        } catch (e) { }
  
      return element;
    };
  }
  
  if ('outerHTML' in document.documentElement) {
    Element.Methods.replace = function(element, content) {
      element = $(element);
  
      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        element.parentNode.replaceChild(content, element);
        return element;
      }
  
      content = Object.toHTML(content);
      var parent = element.parentNode, tagName = parent.tagName.toUpperCase();
  
      if (Element._insertionTranslations.tags[tagName]) {
        var nextSibling = element.next(),
            fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
        parent.removeChild(element);
        if (nextSibling)
          fragments.each(function(node) { parent.insertBefore(node, nextSibling) });
        else
          fragments.each(function(node) { parent.appendChild(node) });
      }
      else element.outerHTML = content.stripScripts();
  
      content.evalScripts.bind(content).defer();
      return element;
    };
  }
  
  Element._returnOffset = function(l, t) {
    var result = [l, t];
    result.left = l;
    result.top = t;
    return result;
  };
  
  Element._getContentFromAnonymousElement = function(tagName, html, force) {
    var div = new Element('div'),
        t = Element._insertionTranslations.tags[tagName];
  
    var workaround = false;
    if (t) workaround = true;
    else if (force) {
      workaround = true;
      t = ['', '', 0];
    }
  
    if (workaround) {
      div.innerHTML = '&nbsp;' + t[0] + html + t[1];
      div.removeChild(div.firstChild);
      for (var i = t[2]; i--; ) {
        div = div.firstChild;
      }
    }
    else {
      div.innerHTML = html;
    }
    return $A(div.childNodes);
  };
  
  Element._insertionTranslations = {
    before: function(element, node) {
      element.parentNode.insertBefore(node, element);
    },
    top: function(element, node) {
      element.insertBefore(node, element.firstChild);
    },
    bottom: function(element, node) {
      element.appendChild(node);
    },
    after: function(element, node) {
      element.parentNode.insertBefore(node, element.nextSibling);
    },
    tags: {
      TABLE:  ['<table>',                '</table>',                   1],
      TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
      TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
      TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
      SELECT: ['<select>',               '</select>',                  1]
    }
  };
  
  (function() {
    var tags = Element._insertionTranslations.tags;
    Object.extend(tags, {
      THEAD: tags.TBODY,
      TFOOT: tags.TBODY,
      TH:    tags.TD
    });
  })();
  
  Element.Methods.Simulated = {
    hasAttribute: function(element, attribute) {
      attribute = Element._attributeTranslations.has[attribute] || attribute;
      var node = $(element).getAttributeNode(attribute);
      return !!(node && node.specified);
    }
  };
  
  Element.Methods.ByTag = { };
  
  Object.extend(Element, Element.Methods);
  
  (function(div) {
  
    if (!Prototype.BrowserFeatures.ElementExtensions && div['__proto__']) {
      window.HTMLElement = { };
      window.HTMLElement.prototype = div['__proto__'];
      Prototype.BrowserFeatures.ElementExtensions = true;
    }
  
    div = null;
  
  })(document.createElement('div'));
  
  Element.extend = (function() {
  
    function checkDeficiency(tagName) {
      if (typeof window.Element != 'undefined') {
        var proto = window.Element.prototype;
        if (proto) {
          var id = '_' + (Math.random()+'').slice(2),
              el = document.createElement(tagName);
          proto[id] = 'x';
          var isBuggy = (el[id] !== 'x');
          delete proto[id];
          el = null;
          return isBuggy;
        }
      }
      return false;
    }
  
    function extendElementWith(element, methods) {
      for (var property in methods) {
        var value = methods[property];
        if (Object.isFunction(value) && !(property in element))
          element[property] = value.methodize();
      }
    }
  
    var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = checkDeficiency('object');
  
    if (Prototype.BrowserFeatures.SpecificElementExtensions) {
      if (HTMLOBJECTELEMENT_PROTOTYPE_BUGGY) {
        return function(element) {
          if (element && typeof element._extendedByPrototype == 'undefined') {
            var t = element.tagName;
            if (t && (/^(?:object|applet|embed)$/i.test(t))) {
              extendElementWith(element, Element.Methods);
              extendElementWith(element, Element.Methods.Simulated);
              extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
            }
          }
          return element;
        }
      }
      return Prototype.K;
    }
  
    var Methods = { }, ByTag = Element.Methods.ByTag;
  
    var extend = Object.extend(function(element) {
      if (!element || typeof element._extendedByPrototype != 'undefined' ||
          element.nodeType != 1 || element == window) return element;
  
      var methods = Object.clone(Methods),
          tagName = element.tagName.toUpperCase();
  
      if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);
  
      extendElementWith(element, methods);
  
      element._extendedByPrototype = Prototype.emptyFunction;
      return element;
  
    }, {
      refresh: function() {
        if (!Prototype.BrowserFeatures.ElementExtensions) {
          Object.extend(Methods, Element.Methods);
          Object.extend(Methods, Element.Methods.Simulated);
        }
      }
    });
  
    extend.refresh();
    return extend;
  })();
  
  if (document.documentElement.hasAttribute) {
    Element.hasAttribute = function(element, attribute) {
      return element.hasAttribute(attribute);
    };
  }
  else {
    Element.hasAttribute = Element.Methods.Simulated.hasAttribute;
  }
  
  Element.addMethods = function(methods) {
    var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;
  
    if (!methods) {
      Object.extend(Form, Form.Methods);
      Object.extend(Form.Element, Form.Element.Methods);
      Object.extend(Element.Methods.ByTag, {
        "FORM":     Object.clone(Form.Methods),
        "INPUT":    Object.clone(Form.Element.Methods),
        "SELECT":   Object.clone(Form.Element.Methods),
        "TEXTAREA": Object.clone(Form.Element.Methods),
        "BUTTON":   Object.clone(Form.Element.Methods)
      });
    }
  
    if (arguments.length == 2) {
      var tagName = methods;
      methods = arguments[1];
    }
  
    if (!tagName) Object.extend(Element.Methods, methods || { });
    else {
      if (Object.isArray(tagName)) tagName.each(extend);
      else extend(tagName);
    }
  
    function extend(tagName) {
      tagName = tagName.toUpperCase();
      if (!Element.Methods.ByTag[tagName])
        Element.Methods.ByTag[tagName] = { };
      Object.extend(Element.Methods.ByTag[tagName], methods);
    }
  
    function copy(methods, destination, onlyIfAbsent) {
      onlyIfAbsent = onlyIfAbsent || false;
      for (var property in methods) {
        var value = methods[property];
        if (!Object.isFunction(value)) continue;
        if (!onlyIfAbsent || !(property in destination))
          destination[property] = value.methodize();
      }
    }
  
    function findDOMClass(tagName) {
      var klass;
      var trans = {
        "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
        "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
        "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
        "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
        "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
        "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
        "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
        "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
        "FrameSet", "IFRAME": "IFrame"
      };
      if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
      if (window[klass]) return window[klass];
      klass = 'HTML' + tagName + 'Element';
      if (window[klass]) return window[klass];
      klass = 'HTML' + tagName.capitalize() + 'Element';
      if (window[klass]) return window[klass];
  
      var element = document.createElement(tagName),
          proto = element['__proto__'] || element.constructor.prototype;
  
      element = null;
      return proto;
    }
  
    var elementPrototype = window.HTMLElement ? HTMLElement.prototype :
     Element.prototype;
  
    if (F.ElementExtensions) {
      copy(Element.Methods, elementPrototype);
      copy(Element.Methods.Simulated, elementPrototype, true);
    }
  
    if (F.SpecificElementExtensions) {
      for (var tag in Element.Methods.ByTag) {
        var klass = findDOMClass(tag);
        if (Object.isUndefined(klass)) continue;
        copy(T[tag], klass.prototype);
      }
    }
  
    Object.extend(Element, Element.Methods);
    delete Element.ByTag;
  
    if (Element.extend.refresh) Element.extend.refresh();
    Element.cache = { };
  };
  
  
  document.viewport = {
  
    getDimensions: function() {
      return { width: this.getWidth(), height: this.getHeight() };
    },
  
    getScrollOffsets: function() {
      return Element._returnOffset(
        window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop);
    }
  };
  
  (function(viewport) {
    var B = Prototype.Browser, doc = document, element, property = {};
  
    function getRootElement() {
      if (B.WebKit && !doc.evaluate)
        return document;
  
      if (B.Opera && window.parseFloat(window.opera.version()) < 9.5)
        return document.body;
  
      return document.documentElement;
    }
  
    function define(D) {
      if (!element) element = getRootElement();
  
      property[D] = 'client' + D;
  
      viewport['get' + D] = function() { return element[property[D]] };
      return viewport['get' + D]();
    }
  
    viewport.getWidth  = define.curry('Width');
  
    viewport.getHeight = define.curry('Height');
  })(document.viewport);
  
  
  Element.Storage = {
    UID: 1
  };
  
  Element.addMethods({
    getStorage: function(element) {
      if (!(element = $(element))) return;
  
      var uid;
      if (element === window) {
        uid = 0;
      } else {
        if (typeof element._prototypeUID === "undefined")
          element._prototypeUID = Element.Storage.UID++;
        uid = element._prototypeUID;
      }
  
      if (!Element.Storage[uid])
        Element.Storage[uid] = $H();
  
      return Element.Storage[uid];
    },
  
    store: function(element, key, value) {
      if (!(element = $(element))) return;
  
      if (arguments.length === 2) {
        Element.getStorage(element).update(key);
      } else {
        Element.getStorage(element).set(key, value);
      }
  
      return element;
    },
  
    retrieve: function(element, key, defaultValue) {
      if (!(element = $(element))) return;
      var hash = Element.getStorage(element), value = hash.get(key);
  
      if (Object.isUndefined(value)) {
        hash.set(key, defaultValue);
        value = defaultValue;
      }
  
      return value;
    },
  
    clone: function(element, deep) {
      if (!(element = $(element))) return;
      var clone = element.cloneNode(deep);
      clone._prototypeUID = void 0;
      if (deep) {
        var descendants = Element.select(clone, '*'),
            i = descendants.length;
        while (i--) {
          descendants[i]._prototypeUID = void 0;
        }
      }
      return Element.extend(clone);
    },
  
    purge: function(element) {
      if (!(element = $(element))) return;
      var purgeElement = Element._purgeElement;
  
      purgeElement(element);
  
      var descendants = element.getElementsByTagName('*'),
       i = descendants.length;
  
      while (i--) purgeElement(descendants[i]);
  
      return null;
    }
  });
  
  (function() {
  
    function toDecimal(pctString) {
      var match = pctString.match(/^(\d+)%?$/i);
      if (!match) return null;
      return (Number(match[1]) / 100);
    }
  
    function getPixelValue(value, property, context) {
      var element = null;
      if (Object.isElement(value)) {
        element = value;
        value = element.getStyle(property);
      }
  
      if (value === null) {
        return null;
      }
  
      if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(value)) {
        return window.parseFloat(value);
      }
  
      var isPercentage = value.include('%'), isViewport = (context === document.viewport);
  
      if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
        var style = element.style.left, rStyle = element.runtimeStyle.left;
        element.runtimeStyle.left = element.currentStyle.left;
        element.style.left = value || 0;
        value = element.style.pixelLeft;
        element.style.left = style;
        element.runtimeStyle.left = rStyle;
  
        return value;
      }
  
      if (element && isPercentage) {
        context = context || element.parentNode;
        var decimal = toDecimal(value);
        var whole = null;
        var position = element.getStyle('position');
  
        var isHorizontal = property.include('left') || property.include('right') ||
         property.include('width');
  
        var isVertical =  property.include('top') || property.include('bottom') ||
          property.include('height');
  
        if (context === document.viewport) {
          if (isHorizontal) {
            whole = document.viewport.getWidth();
          } else if (isVertical) {
            whole = document.viewport.getHeight();
          }
        } else {
          if (isHorizontal) {
            whole = $(context).measure('width');
          } else if (isVertical) {
            whole = $(context).measure('height');
          }
        }
  
        return (whole === null) ? 0 : whole * decimal;
      }
  
      return 0;
    }
  
    function toCSSPixels(number) {
      if (Object.isString(number) && number.endsWith('px')) {
        return number;
      }
      return number + 'px';
    }
  
    function isDisplayed(element) {
      var originalElement = element;
      while (element && element.parentNode) {
        var display = element.getStyle('display');
        if (display === 'none') {
          return false;
        }
        element = $(element.parentNode);
      }
      return true;
    }
  
    var hasLayout = Prototype.K;
    if ('currentStyle' in document.documentElement) {
      hasLayout = function(element) {
        if (!element.currentStyle.hasLayout) {
          element.style.zoom = 1;
        }
        return element;
      };
    }
  
    function cssNameFor(key) {
      if (key.include('border')) key = key + '-width';
      return key.camelize();
    }
  
    Element.Layout = Class.create(Hash, {
      initialize: function($super, element, preCompute) {
        $super();
        this.element = $(element);
  
        Element.Layout.PROPERTIES.each( function(property) {
          this._set(property, null);
        }, this);
  
        if (preCompute) {
          this._preComputing = true;
          this._begin();
          Element.Layout.PROPERTIES.each( this._compute, this );
          this._end();
          this._preComputing = false;
        }
      },
  
      _set: function(property, value) {
        return Hash.prototype.set.call(this, property, value);
      },
  
      set: function(property, value) {
        throw "Properties of Element.Layout are read-only.";
      },
  
      get: function($super, property) {
        var value = $super(property);
        return value === null ? this._compute(property) : value;
      },
  
      _begin: function() {
        if (this._prepared) return;
  
        var element = this.element;
        if (isDisplayed(element)) {
          this._prepared = true;
          return;
        }
  
        var originalStyles = {
          position:   element.style.position   || '',
          width:      element.style.width      || '',
          visibility: element.style.visibility || '',
          display:    element.style.display    || ''
        };
  
        element.store('prototype_original_styles', originalStyles);
  
        var position = element.getStyle('position'),
         width = element.getStyle('width');
  
        if (width === "0px" || width === null) {
          element.style.display = 'block';
          width = element.getStyle('width');
        }
  
        var context = (position === 'fixed') ? document.viewport :
         element.parentNode;
  
        element.setStyle({
          position:   'absolute',
          visibility: 'hidden',
          display:    'block'
        });
  
        var positionedWidth = element.getStyle('width');
  
        var newWidth;
        if (width && (positionedWidth === width)) {
          newWidth = getPixelValue(element, 'width', context);
        } else if (position === 'absolute' || position === 'fixed') {
          newWidth = getPixelValue(element, 'width', context);
        } else {
          var parent = element.parentNode, pLayout = $(parent).getLayout();
  
          newWidth = pLayout.get('width') -
           this.get('margin-left') -
           this.get('border-left') -
           this.get('padding-left') -
           this.get('padding-right') -
           this.get('border-right') -
           this.get('margin-right');
        }
  
        element.setStyle({ width: newWidth + 'px' });
  
        this._prepared = true;
      },
  
      _end: function() {
        var element = this.element;
        var originalStyles = element.retrieve('prototype_original_styles');
        element.store('prototype_original_styles', null);
        element.setStyle(originalStyles);
        this._prepared = false;
      },
  
      _compute: function(property) {
        var COMPUTATIONS = Element.Layout.COMPUTATIONS;
        if (!(property in COMPUTATIONS)) {
          throw "Property not found.";
        }
  
        return this._set(property, COMPUTATIONS[property].call(this, this.element));
      },
  
      toObject: function() {
        var args = $A(arguments);
        var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
         args.join(' ').split(' ');
        var obj = {};
        keys.each( function(key) {
          if (!Element.Layout.PROPERTIES.include(key)) return;
          var value = this.get(key);
          if (value != null) obj[key] = value;
        }, this);
        return obj;
      },
  
      toHash: function() {
        var obj = this.toObject.apply(this, arguments);
        return new Hash(obj);
      },
  
      toCSS: function() {
        var args = $A(arguments);
        var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
         args.join(' ').split(' ');
        var css = {};
  
        keys.each( function(key) {
          if (!Element.Layout.PROPERTIES.include(key)) return;
          if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;
  
          var value = this.get(key);
          if (value != null) css[cssNameFor(key)] = value + 'px';
        }, this);
        return css;
      },
  
      inspect: function() {
        return "#<Element.Layout>";
      }
    });
  
    Object.extend(Element.Layout, {
      PROPERTIES: $w('height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'),
  
      COMPOSITE_PROPERTIES: $w('padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'),
  
      COMPUTATIONS: {
        'height': function(element) {
          if (!this._preComputing) this._begin();
  
          var bHeight = this.get('border-box-height');
          if (bHeight <= 0) {
            if (!this._preComputing) this._end();
            return 0;
          }
  
          var bTop = this.get('border-top'),
           bBottom = this.get('border-bottom');
  
          var pTop = this.get('padding-top'),
           pBottom = this.get('padding-bottom');
  
          if (!this._preComputing) this._end();
  
          return bHeight - bTop - bBottom - pTop - pBottom;
        },
  
        'width': function(element) {
          if (!this._preComputing) this._begin();
  
          var bWidth = this.get('border-box-width');
          if (bWidth <= 0) {
            if (!this._preComputing) this._end();
            return 0;
          }
  
          var bLeft = this.get('border-left'),
           bRight = this.get('border-right');
  
          var pLeft = this.get('padding-left'),
           pRight = this.get('padding-right');
  
          if (!this._preComputing) this._end();
  
          return bWidth - bLeft - bRight - pLeft - pRight;
        },
  
        'padding-box-height': function(element) {
          var height = this.get('height'),
           pTop = this.get('padding-top'),
           pBottom = this.get('padding-bottom');
  
          return height + pTop + pBottom;
        },
  
        'padding-box-width': function(element) {
          var width = this.get('width'),
           pLeft = this.get('padding-left'),
           pRight = this.get('padding-right');
  
          return width + pLeft + pRight;
        },
  
        'border-box-height': function(element) {
          if (!this._preComputing) this._begin();
          var height = element.offsetHeight;
          if (!this._preComputing) this._end();
          return height;
        },
  
        'border-box-width': function(element) {
          if (!this._preComputing) this._begin();
          var width = element.offsetWidth;
          if (!this._preComputing) this._end();
          return width;
        },
  
        'margin-box-height': function(element) {
          var bHeight = this.get('border-box-height'),
           mTop = this.get('margin-top'),
           mBottom = this.get('margin-bottom');
  
          if (bHeight <= 0) return 0;
  
          return bHeight + mTop + mBottom;
        },
  
        'margin-box-width': function(element) {
          var bWidth = this.get('border-box-width'),
           mLeft = this.get('margin-left'),
           mRight = this.get('margin-right');
  
          if (bWidth <= 0) return 0;
  
          return bWidth + mLeft + mRight;
        },
  
        'top': function(element) {
          var offset = element.positionedOffset();
          return offset.top;
        },
  
        'bottom': function(element) {
          var offset = element.positionedOffset(),
           parent = element.getOffsetParent(),
           pHeight = parent.measure('height');
  
          var mHeight = this.get('border-box-height');
  
          return pHeight - mHeight - offset.top;
        },
  
        'left': function(element) {
          var offset = element.positionedOffset();
          return offset.left;
        },
  
        'right': function(element) {
          var offset = element.positionedOffset(),
           parent = element.getOffsetParent(),
           pWidth = parent.measure('width');
  
          var mWidth = this.get('border-box-width');
  
          return pWidth - mWidth - offset.left;
        },
  
        'padding-top': function(element) {
          return getPixelValue(element, 'paddingTop');
        },
  
        'padding-bottom': function(element) {
          return getPixelValue(element, 'paddingBottom');
        },
  
        'padding-left': function(element) {
          return getPixelValue(element, 'paddingLeft');
        },
  
        'padding-right': function(element) {
          return getPixelValue(element, 'paddingRight');
        },
  
        'border-top': function(element) {
          return getPixelValue(element, 'borderTopWidth');
        },
  
        'border-bottom': function(element) {
          return getPixelValue(element, 'borderBottomWidth');
        },
  
        'border-left': function(element) {
          return getPixelValue(element, 'borderLeftWidth');
        },
  
        'border-right': function(element) {
          return getPixelValue(element, 'borderRightWidth');
        },
  
        'margin-top': function(element) {
          return getPixelValue(element, 'marginTop');
        },
  
        'margin-bottom': function(element) {
          return getPixelValue(element, 'marginBottom');
        },
  
        'margin-left': function(element) {
          return getPixelValue(element, 'marginLeft');
        },
  
        'margin-right': function(element) {
          return getPixelValue(element, 'marginRight');
        }
      }
    });
  
    if ('getBoundingClientRect' in document.documentElement) {
      Object.extend(Element.Layout.COMPUTATIONS, {
        'right': function(element) {
          var parent = hasLayout(element.getOffsetParent());
          var rect = element.getBoundingClientRect(),
           pRect = parent.getBoundingClientRect();
  
          return (pRect.right - rect.right).round();
        },
  
        'bottom': function(element) {
          var parent = hasLayout(element.getOffsetParent());
          var rect = element.getBoundingClientRect(),
           pRect = parent.getBoundingClientRect();
  
          return (pRect.bottom - rect.bottom).round();
        }
      });
    }
  
    Element.Offset = Class.create({
      initialize: function(left, top) {
        this.left = left.round();
        this.top  = top.round();
  
        this[0] = this.left;
        this[1] = this.top;
      },
  
      relativeTo: function(offset) {
        return new Element.Offset(
          this.left - offset.left,
          this.top  - offset.top
        );
      },
  
      inspect: function() {
        return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this);
      },
  
      toString: function() {
        return "[#{left}, #{top}]".interpolate(this);
      },
  
      toArray: function() {
        return [this.left, this.top];
      }
    });
  
    function getLayout(element, preCompute) {
      return new Element.Layout(element, preCompute);
    }
  
    function measure(element, property) {
      return $(element).getLayout().get(property);
    }
  
    function getDimensions(element) {
      element = $(element);
      var display = Element.getStyle(element, 'display');
  
      if (display && display !== 'none') {
        return { width: element.offsetWidth, height: element.offsetHeight };
      }
  
      var style = element.style;
      var originalStyles = {
        visibility: style.visibility,
        position:   style.position,
        display:    style.display
      };
  
      var newStyles = {
        visibility: 'hidden',
        display:    'block'
      };
  
      if (originalStyles.position !== 'fixed')
        newStyles.position = 'absolute';
  
      Element.setStyle(element, newStyles);
  
      var dimensions = {
        width:  element.offsetWidth,
        height: element.offsetHeight
      };
  
      Element.setStyle(element, originalStyles);
  
      return dimensions;
    }
  
    function getOffsetParent(element) {
      element = $(element);
  
      if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
        return $(document.body);
  
      var isInline = (Element.getStyle(element, 'display') === 'inline');
      if (!isInline && element.offsetParent) return $(element.offsetParent);
  
      while ((element = element.parentNode) && element !== document.body) {
        if (Element.getStyle(element, 'position') !== 'static') {
          return isHtml(element) ? $(document.body) : $(element);
        }
      }
  
      return $(document.body);
    }
  
  
    function cumulativeOffset(element) {
      element = $(element);
      var valueT = 0, valueL = 0;
      if (element.parentNode) {
        do {
          valueT += element.offsetTop  || 0;
          valueL += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);
      }
      return new Element.Offset(valueL, valueT);
    }
  
    function positionedOffset(element) {
      element = $(element);
  
      var layout = element.getLayout();
  
      var valueT = 0, valueL = 0;
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
        if (element) {
          if (isBody(element)) break;
          var p = Element.getStyle(element, 'position');
          if (p !== 'static') break;
        }
      } while (element);
  
      valueL -= layout.get('margin-top');
      valueT -= layout.get('margin-left');
  
      return new Element.Offset(valueL, valueT);
    }
  
    function cumulativeScrollOffset(element) {
      var valueT = 0, valueL = 0;
      do {
        valueT += element.scrollTop  || 0;
        valueL += element.scrollLeft || 0;
        element = element.parentNode;
      } while (element);
      return new Element.Offset(valueL, valueT);
    }
  
    function viewportOffset(forElement) {
      element = $(element);
      var valueT = 0, valueL = 0, docBody = document.body;
  
      var element = forElement;
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        if (element.offsetParent == docBody &&
          Element.getStyle(element, 'position') == 'absolute') break;
      } while (element = element.offsetParent);
  
      element = forElement;
      do {
        if (element != docBody) {
          valueT -= element.scrollTop  || 0;
          valueL -= element.scrollLeft || 0;
        }
      } while (element = element.parentNode);
      return new Element.Offset(valueL, valueT);
    }
  
    function absolutize(element) {
      element = $(element);
  
      if (Element.getStyle(element, 'position') === 'absolute') {
        return element;
      }
  
      var offsetParent = getOffsetParent(element);
      var eOffset = element.viewportOffset(),
       pOffset = offsetParent.viewportOffset();
  
      var offset = eOffset.relativeTo(pOffset);
      var layout = element.getLayout();
  
      element.store('prototype_absolutize_original_styles', {
        left:   element.getStyle('left'),
        top:    element.getStyle('top'),
        width:  element.getStyle('width'),
        height: element.getStyle('height')
      });
  
      element.setStyle({
        position: 'absolute',
        top:    offset.top + 'px',
        left:   offset.left + 'px',
        width:  layout.get('width') + 'px',
        height: layout.get('height') + 'px'
      });
  
      return element;
    }
  
    function relativize(element) {
      element = $(element);
      if (Element.getStyle(element, 'position') === 'relative') {
        return element;
      }
  
      var originalStyles =
       element.retrieve('prototype_absolutize_original_styles');
  
      if (originalStyles) element.setStyle(originalStyles);
      return element;
    }
  
    if (Prototype.Browser.IE) {
      getOffsetParent = getOffsetParent.wrap(
        function(proceed, element) {
          element = $(element);
  
          if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
            return $(document.body);
  
          var position = element.getStyle('position');
          if (position !== 'static') return proceed(element);
  
          element.setStyle({ position: 'relative' });
          var value = proceed(element);
          element.setStyle({ position: position });
          return value;
        }
      );
  
      positionedOffset = positionedOffset.wrap(function(proceed, element) {
        element = $(element);
        if (!element.parentNode) return new Element.Offset(0, 0);
        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);
  
        var offsetParent = element.getOffsetParent();
        if (offsetParent && offsetParent.getStyle('position') === 'fixed')
          hasLayout(offsetParent);
  
        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      });
    } else if (Prototype.Browser.Webkit) {
      cumulativeOffset = function(element) {
        element = $(element);
        var valueT = 0, valueL = 0;
        do {
          valueT += element.offsetTop  || 0;
          valueL += element.offsetLeft || 0;
          if (element.offsetParent == document.body)
            if (Element.getStyle(element, 'position') == 'absolute') break;
  
          element = element.offsetParent;
        } while (element);
  
        return new Element.Offset(valueL, valueT);
      };
    }
  
  
    Element.addMethods({
      getLayout:              getLayout,
      measure:                measure,
      getDimensions:          getDimensions,
      getOffsetParent:        getOffsetParent,
      cumulativeOffset:       cumulativeOffset,
      positionedOffset:       positionedOffset,
      cumulativeScrollOffset: cumulativeScrollOffset,
      viewportOffset:         viewportOffset,
      absolutize:             absolutize,
      relativize:             relativize
    });
  
    function isBody(element) {
      return element.nodeName.toUpperCase() === 'BODY';
    }
  
    function isHtml(element) {
      return element.nodeName.toUpperCase() === 'HTML';
    }
  
    function isDocument(element) {
      return element.nodeType === Node.DOCUMENT_NODE;
    }
  
    function isDetached(element) {
      return element !== document.body &&
       !Element.descendantOf(element, document.body);
    }
  
    if ('getBoundingClientRect' in document.documentElement) {
      Element.addMethods({
        viewportOffset: function(element) {
          element = $(element);
          if (isDetached(element)) return new Element.Offset(0, 0);
  
          var rect = element.getBoundingClientRect(),
           docEl = document.documentElement;
          return new Element.Offset(rect.left - docEl.clientLeft,
           rect.top - docEl.clientTop);
        }
      });
    }
  })();
  window.$$ = function() {
    var expression = $A(arguments).join(', ');
    return Prototype.Selector.select(expression, document);
  };
  
  Prototype.Selector = (function() {
  
    function select() {
      throw new Error('Method "Prototype.Selector.select" must be defined.');
    }
  
    function match() {
      throw new Error('Method "Prototype.Selector.match" must be defined.');
    }
  
    function find(elements, expression, index) {
      index = index || 0;
      var match = Prototype.Selector.match, length = elements.length, matchIndex = 0, i;
  
      for (i = 0; i < length; i++) {
        if (match(elements[i], expression) && index == matchIndex++) {
          return Element.extend(elements[i]);
        }
      }
    }
  
    function extendElements(elements) {
      for (var i = 0, length = elements.length; i < length; i++) {
        Element.extend(elements[i]);
      }
      return elements;
    }
  
  
    var K = Prototype.K;
  
    return {
      select: select,
      match: match,
      find: find,
      extendElements: (Element.extend === K) ? K : extendElements,
      extendElement: Element.extend
    };
  })();
  Prototype._original_property = window.Sizzle;
  
  (function(){
  
  var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
      done = 0,
      toString = Object.prototype.toString,
      hasDuplicate = false,
      baseHasDuplicate = true;
  
  [0, 0].sort(function(){
      baseHasDuplicate = false;
      return 0;
  });
  
  var Sizzle = function(selector, context, results, seed) {
      results = results || [];
      var origContext = context = context || document;
  
      if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
          return [];
      }
  
      if ( !selector || typeof selector !== "string" ) {
          return results;
      }
  
      var parts = [], m, set, checkSet, check, mode, extra, prune = true, contextXML = isXML(context),
          soFar = selector;
  
      while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
          soFar = m[3];
  
          parts.push( m[1] );
  
          if ( m[2] ) {
              extra = m[3];
              break;
          }
      }
  
      if ( parts.length > 1 && origPOS.exec( selector ) ) {
          if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
              set = posProcess( parts[0] + parts[1], context );
          } else {
              set = Expr.relative[ parts[0] ] ?
                  [ context ] :
                  Sizzle( parts.shift(), context );
  
              while ( parts.length ) {
                  selector = parts.shift();
  
                  if ( Expr.relative[ selector ] )
                      selector += parts.shift();
  
                  set = posProcess( selector, set );
              }
          }
      } else {
          if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                  Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
              var ret = Sizzle.find( parts.shift(), context, contextXML );
              context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
          }
  
          if ( context ) {
              var ret = seed ?
                  { expr: parts.pop(), set: makeArray(seed) } :
                  Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
              set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;
  
              if ( parts.length > 0 ) {
                  checkSet = makeArray(set);
              } else {
                  prune = false;
              }
  
              while ( parts.length ) {
                  var cur = parts.pop(), pop = cur;
  
                  if ( !Expr.relative[ cur ] ) {
                      cur = "";
                  } else {
                      pop = parts.pop();
                  }
  
                  if ( pop == null ) {
                      pop = context;
                  }
  
                  Expr.relative[ cur ]( checkSet, pop, contextXML );
              }
          } else {
              checkSet = parts = [];
          }
      }
  
      if ( !checkSet ) {
          checkSet = set;
      }
  
      if ( !checkSet ) {
          throw "Syntax error, unrecognized expression: " + (cur || selector);
      }
  
      if ( toString.call(checkSet) === "[object Array]" ) {
          if ( !prune ) {
              results.push.apply( results, checkSet );
          } else if ( context && context.nodeType === 1 ) {
              for ( var i = 0; checkSet[i] != null; i++ ) {
                  if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
                      results.push( set[i] );
                  }
              }
          } else {
              for ( var i = 0; checkSet[i] != null; i++ ) {
                  if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                      results.push( set[i] );
                  }
              }
          }
      } else {
          makeArray( checkSet, results );
      }
  
      if ( extra ) {
          Sizzle( extra, origContext, results, seed );
          Sizzle.uniqueSort( results );
      }
  
      return results;
  };
  
  Sizzle.uniqueSort = function(results){
      if ( sortOrder ) {
          hasDuplicate = baseHasDuplicate;
          results.sort(sortOrder);
  
          if ( hasDuplicate ) {
              for ( var i = 1; i < results.length; i++ ) {
                  if ( results[i] === results[i-1] ) {
                      results.splice(i--, 1);
                  }
              }
          }
      }
  
      return results;
  };
  
  Sizzle.matches = function(expr, set){
      return Sizzle(expr, null, null, set);
  };
  
  Sizzle.find = function(expr, context, isXML){
      var set, match;
  
      if ( !expr ) {
          return [];
      }
  
      for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
          var type = Expr.order[i], match;
  
          if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
              var left = match[1];
              match.splice(1,1);
  
              if ( left.substr( left.length - 1 ) !== "\\" ) {
                  match[1] = (match[1] || "").replace(/\\/g, "");
                  set = Expr.find[ type ]( match, context, isXML );
                  if ( set != null ) {
                      expr = expr.replace( Expr.match[ type ], "" );
                      break;
                  }
              }
          }
      }
  
      if ( !set ) {
          set = context.getElementsByTagName("*");
      }
  
      return {set: set, expr: expr};
  };
  
  Sizzle.filter = function(expr, set, inplace, not){
      var old = expr, result = [], curLoop = set, match, anyFound,
          isXMLFilter = set && set[0] && isXML(set[0]);
  
      while ( expr && set.length ) {
          for ( var type in Expr.filter ) {
              if ( (match = Expr.match[ type ].exec( expr )) != null ) {
                  var filter = Expr.filter[ type ], found, item;
                  anyFound = false;
  
                  if ( curLoop == result ) {
                      result = [];
                  }
  
                  if ( Expr.preFilter[ type ] ) {
                      match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );
  
                      if ( !match ) {
                          anyFound = found = true;
                      } else if ( match === true ) {
                          continue;
                      }
                  }
  
                  if ( match ) {
                      for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
                          if ( item ) {
                              found = filter( item, match, i, curLoop );
                              var pass = not ^ !!found;
  
                              if ( inplace && found != null ) {
                                  if ( pass ) {
                                      anyFound = true;
                                  } else {
                                      curLoop[i] = false;
                                  }
                              } else if ( pass ) {
                                  result.push( item );
                                  anyFound = true;
                              }
                          }
                      }
                  }
  
                  if ( found !== undefined ) {
                      if ( !inplace ) {
                          curLoop = result;
                      }
  
                      expr = expr.replace( Expr.match[ type ], "" );
  
                      if ( !anyFound ) {
                          return [];
                      }
  
                      break;
                  }
              }
          }
  
          if ( expr == old ) {
              if ( anyFound == null ) {
                  throw "Syntax error, unrecognized expression: " + expr;
              } else {
                  break;
              }
          }
  
          old = expr;
      }
  
      return curLoop;
  };
  
  var Expr = Sizzle.selectors = {
      order: [ "ID", "NAME", "TAG" ],
      match: {
          ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
          CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
          NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
          ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
          TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
          CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
          POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
          PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
      },
      leftMatch: {},
      attrMap: {
          "class": "className",
          "for": "htmlFor"
      },
      attrHandle: {
          href: function(elem){
              return elem.getAttribute("href");
          }
      },
      relative: {
          "+": function(checkSet, part, isXML){
              var isPartStr = typeof part === "string",
                  isTag = isPartStr && !/\W/.test(part),
                  isPartStrNotTag = isPartStr && !isTag;
  
              if ( isTag && !isXML ) {
                  part = part.toUpperCase();
              }
  
              for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                  if ( (elem = checkSet[i]) ) {
                      while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}
  
                      checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ?
                          elem || false :
                          elem === part;
                  }
              }
  
              if ( isPartStrNotTag ) {
                  Sizzle.filter( part, checkSet, true );
              }
          },
          ">": function(checkSet, part, isXML){
              var isPartStr = typeof part === "string";
  
              if ( isPartStr && !/\W/.test(part) ) {
                  part = isXML ? part : part.toUpperCase();
  
                  for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                      var elem = checkSet[i];
                      if ( elem ) {
                          var parent = elem.parentNode;
                          checkSet[i] = parent.nodeName === part ? parent : false;
                      }
                  }
              } else {
                  for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                      var elem = checkSet[i];
                      if ( elem ) {
                          checkSet[i] = isPartStr ?
                              elem.parentNode :
                              elem.parentNode === part;
                      }
                  }
  
                  if ( isPartStr ) {
                      Sizzle.filter( part, checkSet, true );
                  }
              }
          },
          "": function(checkSet, part, isXML){
              var doneName = done++, checkFn = dirCheck;
  
              if ( !/\W/.test(part) ) {
                  var nodeCheck = part = isXML ? part : part.toUpperCase();
                  checkFn = dirNodeCheck;
              }
  
              checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
          },
          "~": function(checkSet, part, isXML){
              var doneName = done++, checkFn = dirCheck;
  
              if ( typeof part === "string" && !/\W/.test(part) ) {
                  var nodeCheck = part = isXML ? part : part.toUpperCase();
                  checkFn = dirNodeCheck;
              }
  
              checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
          }
      },
      find: {
          ID: function(match, context, isXML){
              if ( typeof context.getElementById !== "undefined" && !isXML ) {
                  var m = context.getElementById(match[1]);
                  return m ? [m] : [];
              }
          },
          NAME: function(match, context, isXML){
              if ( typeof context.getElementsByName !== "undefined" ) {
                  var ret = [], results = context.getElementsByName(match[1]);
  
                  for ( var i = 0, l = results.length; i < l; i++ ) {
                      if ( results[i].getAttribute("name") === match[1] ) {
                          ret.push( results[i] );
                      }
                  }
  
                  return ret.length === 0 ? null : ret;
              }
          },
          TAG: function(match, context){
              return context.getElementsByTagName(match[1]);
          }
      },
      preFilter: {
          CLASS: function(match, curLoop, inplace, result, not, isXML){
              match = " " + match[1].replace(/\\/g, "") + " ";
  
              if ( isXML ) {
                  return match;
              }
  
              for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                  if ( elem ) {
                      if ( not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0) ) {
                          if ( !inplace )
                              result.push( elem );
                      } else if ( inplace ) {
                          curLoop[i] = false;
                      }
                  }
              }
  
              return false;
          },
          ID: function(match){
              return match[1].replace(/\\/g, "");
          },
          TAG: function(match, curLoop){
              for ( var i = 0; curLoop[i] === false; i++ ){}
              return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
          },
          CHILD: function(match){
              if ( match[1] == "nth" ) {
                  var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
                      match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
                      !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);
  
                  match[2] = (test[1] + (test[2] || 1)) - 0;
                  match[3] = test[3] - 0;
              }
  
              match[0] = done++;
  
              return match;
          },
          ATTR: function(match, curLoop, inplace, result, not, isXML){
              var name = match[1].replace(/\\/g, "");
  
              if ( !isXML && Expr.attrMap[name] ) {
                  match[1] = Expr.attrMap[name];
              }
  
              if ( match[2] === "~=" ) {
                  match[4] = " " + match[4] + " ";
              }
  
              return match;
          },
          PSEUDO: function(match, curLoop, inplace, result, not){
              if ( match[1] === "not" ) {
                  if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                      match[3] = Sizzle(match[3], null, null, curLoop);
                  } else {
                      var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                      if ( !inplace ) {
                          result.push.apply( result, ret );
                      }
                      return false;
                  }
              } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                  return true;
              }
  
              return match;
          },
          POS: function(match){
              match.unshift( true );
              return match;
          }
      },
      filters: {
          enabled: function(elem){
              return elem.disabled === false && elem.type !== "hidden";
          },
          disabled: function(elem){
              return elem.disabled === true;
          },
          checked: function(elem){
              return elem.checked === true;
          },
          selected: function(elem){
              elem.parentNode.selectedIndex;
              return elem.selected === true;
          },
          parent: function(elem){
              return !!elem.firstChild;
          },
          empty: function(elem){
              return !elem.firstChild;
          },
          has: function(elem, i, match){
              return !!Sizzle( match[3], elem ).length;
          },
          header: function(elem){
              return /h\d/i.test( elem.nodeName );
          },
          text: function(elem){
              return "text" === elem.type;
          },
          radio: function(elem){
              return "radio" === elem.type;
          },
          checkbox: function(elem){
              return "checkbox" === elem.type;
          },
          file: function(elem){
              return "file" === elem.type;
          },
          password: function(elem){
              return "password" === elem.type;
          },
          submit: function(elem){
              return "submit" === elem.type;
          },
          image: function(elem){
              return "image" === elem.type;
          },
          reset: function(elem){
              return "reset" === elem.type;
          },
          button: function(elem){
              return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
          },
          input: function(elem){
              return /input|select|textarea|button/i.test(elem.nodeName);
          }
      },
      setFilters: {
          first: function(elem, i){
              return i === 0;
          },
          last: function(elem, i, match, array){
              return i === array.length - 1;
          },
          even: function(elem, i){
              return i % 2 === 0;
          },
          odd: function(elem, i){
              return i % 2 === 1;
          },
          lt: function(elem, i, match){
              return i < match[3] - 0;
          },
          gt: function(elem, i, match){
              return i > match[3] - 0;
          },
          nth: function(elem, i, match){
              return match[3] - 0 == i;
          },
          eq: function(elem, i, match){
              return match[3] - 0 == i;
          }
      },
      filter: {
          PSEUDO: function(elem, match, i, array){
              var name = match[1], filter = Expr.filters[ name ];
  
              if ( filter ) {
                  return filter( elem, i, match, array );
              } else if ( name === "contains" ) {
                  return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
              } else if ( name === "not" ) {
                  var not = match[3];
  
                  for ( var i = 0, l = not.length; i < l; i++ ) {
                      if ( not[i] === elem ) {
                          return false;
                      }
                  }
  
                  return true;
              }
          },
          CHILD: function(elem, match){
              var type = match[1], node = elem;
              switch (type) {
                  case 'only':
                  case 'first':
                      while ( (node = node.previousSibling) )  {
                          if ( node.nodeType === 1 ) return false;
                      }
                      if ( type == 'first') return true;
                      node = elem;
                  case 'last':
                      while ( (node = node.nextSibling) )  {
                          if ( node.nodeType === 1 ) return false;
                      }
                      return true;
                  case 'nth':
                      var first = match[2], last = match[3];
  
                      if ( first == 1 && last == 0 ) {
                          return true;
                      }
  
                      var doneName = match[0],
                          parent = elem.parentNode;
  
                      if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
                          var count = 0;
                          for ( node = parent.firstChild; node; node = node.nextSibling ) {
                              if ( node.nodeType === 1 ) {
                                  node.nodeIndex = ++count;
                              }
                          }
                          parent.sizcache = doneName;
                      }
  
                      var diff = elem.nodeIndex - last;
                      if ( first == 0 ) {
                          return diff == 0;
                      } else {
                          return ( diff % first == 0 && diff / first >= 0 );
                      }
              }
          },
          ID: function(elem, match){
              return elem.nodeType === 1 && elem.getAttribute("id") === match;
          },
          TAG: function(elem, match){
              return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
          },
          CLASS: function(elem, match){
              return (" " + (elem.className || elem.getAttribute("class")) + " ")
                  .indexOf( match ) > -1;
          },
          ATTR: function(elem, match){
              var name = match[1],
                  result = Expr.attrHandle[ name ] ?
                      Expr.attrHandle[ name ]( elem ) :
                      elem[ name ] != null ?
                          elem[ name ] :
                          elem.getAttribute( name ),
                  value = result + "",
                  type = match[2],
                  check = match[4];
  
              return result == null ?
                  type === "!=" :
                  type === "=" ?
                  value === check :
                  type === "*=" ?
                  value.indexOf(check) >= 0 :
                  type === "~=" ?
                  (" " + value + " ").indexOf(check) >= 0 :
                  !check ?
                  value && result !== false :
                  type === "!=" ?
                  value != check :
                  type === "^=" ?
                  value.indexOf(check) === 0 :
                  type === "$=" ?
                  value.substr(value.length - check.length) === check :
                  type === "|=" ?
                  value === check || value.substr(0, check.length + 1) === check + "-" :
                  false;
          },
          POS: function(elem, match, i, array){
              var name = match[2], filter = Expr.setFilters[ name ];
  
              if ( filter ) {
                  return filter( elem, i, match, array );
              }
          }
      }
  };
  
  var origPOS = Expr.match.POS;
  
  for ( var type in Expr.match ) {
      Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
      Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source );
  }
  
  var makeArray = function(array, results) {
      array = Array.prototype.slice.call( array, 0 );
  
      if ( results ) {
          results.push.apply( results, array );
          return results;
      }
  
      return array;
  };
  
  try {
      Array.prototype.slice.call( document.documentElement.childNodes, 0 );
  
  } catch(e){
      makeArray = function(array, results) {
          var ret = results || [];
  
          if ( toString.call(array) === "[object Array]" ) {
              Array.prototype.push.apply( ret, array );
          } else {
              if ( typeof array.length === "number" ) {
                  for ( var i = 0, l = array.length; i < l; i++ ) {
                      ret.push( array[i] );
                  }
              } else {
                  for ( var i = 0; array[i]; i++ ) {
                      ret.push( array[i] );
                  }
              }
          }
  
          return ret;
      };
  }
  
  var sortOrder;
  
  if ( document.documentElement.compareDocumentPosition ) {
      sortOrder = function( a, b ) {
          if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
              if ( a == b ) {
                  hasDuplicate = true;
              }
              return 0;
          }
  
          var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
          if ( ret === 0 ) {
              hasDuplicate = true;
          }
          return ret;
      };
  } else if ( "sourceIndex" in document.documentElement ) {
      sortOrder = function( a, b ) {
          if ( !a.sourceIndex || !b.sourceIndex ) {
              if ( a == b ) {
                  hasDuplicate = true;
              }
              return 0;
          }
  
          var ret = a.sourceIndex - b.sourceIndex;
          if ( ret === 0 ) {
              hasDuplicate = true;
          }
          return ret;
      };
  } else if ( document.createRange ) {
      sortOrder = function( a, b ) {
          if ( !a.ownerDocument || !b.ownerDocument ) {
              if ( a == b ) {
                  hasDuplicate = true;
              }
              return 0;
          }
  
          var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
          aRange.setStart(a, 0);
          aRange.setEnd(a, 0);
          bRange.setStart(b, 0);
          bRange.setEnd(b, 0);
          var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
          if ( ret === 0 ) {
              hasDuplicate = true;
          }
          return ret;
      };
  }
  
  (function(){
      var form = document.createElement("div"),
          id = "script" + (new Date).getTime();
      form.innerHTML = "<a name='" + id + "'/>";
  
      var root = document.documentElement;
      root.insertBefore( form, root.firstChild );
  
      if ( !!document.getElementById( id ) ) {
          Expr.find.ID = function(match, context, isXML){
              if ( typeof context.getElementById !== "undefined" && !isXML ) {
                  var m = context.getElementById(match[1]);
                  return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
              }
          };
  
          Expr.filter.ID = function(elem, match){
              var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
              return elem.nodeType === 1 && node && node.nodeValue === match;
          };
      }
  
      root.removeChild( form );
      root = form = null; // release memory in IE
  })();
  
  (function(){
  
      var div = document.createElement("div");
      div.appendChild( document.createComment("") );
  
      if ( div.getElementsByTagName("*").length > 0 ) {
          Expr.find.TAG = function(match, context){
              var results = context.getElementsByTagName(match[1]);
  
              if ( match[1] === "*" ) {
                  var tmp = [];
  
                  for ( var i = 0; results[i]; i++ ) {
                      if ( results[i].nodeType === 1 ) {
                          tmp.push( results[i] );
                      }
                  }
  
                  results = tmp;
              }
  
              return results;
          };
      }
  
      div.innerHTML = "<a href='#'></a>";
      if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
              div.firstChild.getAttribute("href") !== "#" ) {
          Expr.attrHandle.href = function(elem){
              return elem.getAttribute("href", 2);
          };
      }
  
      div = null; // release memory in IE
  })();
  
  if ( document.querySelectorAll ) (function(){
      var oldSizzle = Sizzle, div = document.createElement("div");
      div.innerHTML = "<p class='TEST'></p>";
  
      if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
          return;
      }
  
      Sizzle = function(query, context, extra, seed){
          context = context || document;
  
          if ( !seed && context.nodeType === 9 && !isXML(context) ) {
              try {
                  return makeArray( context.querySelectorAll(query), extra );
              } catch(e){}
          }
  
          return oldSizzle(query, context, extra, seed);
      };
  
      for ( var prop in oldSizzle ) {
          Sizzle[ prop ] = oldSizzle[ prop ];
      }
  
      div = null; // release memory in IE
  })();
  
  if ( document.getElementsByClassName && document.documentElement.getElementsByClassName ) (function(){
      var div = document.createElement("div");
      div.innerHTML = "<div class='test e'></div><div class='test'></div>";
  
      if ( div.getElementsByClassName("e").length === 0 )
          return;
  
      div.lastChild.className = "e";
  
      if ( div.getElementsByClassName("e").length === 1 )
          return;
  
      Expr.order.splice(1, 0, "CLASS");
      Expr.find.CLASS = function(match, context, isXML) {
          if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
              return context.getElementsByClassName(match[1]);
          }
      };
  
      div = null; // release memory in IE
  })();
  
  function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
      var sibDir = dir == "previousSibling" && !isXML;
      for ( var i = 0, l = checkSet.length; i < l; i++ ) {
          var elem = checkSet[i];
          if ( elem ) {
              if ( sibDir && elem.nodeType === 1 ){
                  elem.sizcache = doneName;
                  elem.sizset = i;
              }
              elem = elem[dir];
              var match = false;
  
              while ( elem ) {
                  if ( elem.sizcache === doneName ) {
                      match = checkSet[elem.sizset];
                      break;
                  }
  
                  if ( elem.nodeType === 1 && !isXML ){
                      elem.sizcache = doneName;
                      elem.sizset = i;
                  }
  
                  if ( elem.nodeName === cur ) {
                      match = elem;
                      break;
                  }
  
                  elem = elem[dir];
              }
  
              checkSet[i] = match;
          }
      }
  }
  
  function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
      var sibDir = dir == "previousSibling" && !isXML;
      for ( var i = 0, l = checkSet.length; i < l; i++ ) {
          var elem = checkSet[i];
          if ( elem ) {
              if ( sibDir && elem.nodeType === 1 ) {
                  elem.sizcache = doneName;
                  elem.sizset = i;
              }
              elem = elem[dir];
              var match = false;
  
              while ( elem ) {
                  if ( elem.sizcache === doneName ) {
                      match = checkSet[elem.sizset];
                      break;
                  }
  
                  if ( elem.nodeType === 1 ) {
                      if ( !isXML ) {
                          elem.sizcache = doneName;
                          elem.sizset = i;
                      }
                      if ( typeof cur !== "string" ) {
                          if ( elem === cur ) {
                              match = true;
                              break;
                          }
  
                      } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                          match = elem;
                          break;
                      }
                  }
  
                  elem = elem[dir];
              }
  
              checkSet[i] = match;
          }
      }
  }
  
  var contains = document.compareDocumentPosition ?  function(a, b){
      return a.compareDocumentPosition(b) & 16;
  } : function(a, b){
      return a !== b && (a.contains ? a.contains(b) : true);
  };
  
  var isXML = function(elem){
      return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
          !!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
  };
  
  var posProcess = function(selector, context){
      var tmpSet = [], later = "", match,
          root = context.nodeType ? [context] : context;
  
      while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
          later += match[0];
          selector = selector.replace( Expr.match.PSEUDO, "" );
      }
  
      selector = Expr.relative[selector] ? selector + "*" : selector;
  
      for ( var i = 0, l = root.length; i < l; i++ ) {
          Sizzle( selector, root[i], tmpSet );
      }
  
      return Sizzle.filter( later, tmpSet );
  };
  
  
  window.Sizzle = Sizzle;
  
  })();
  
  ;(function(engine) {
    var extendElements = Prototype.Selector.extendElements;
  
    function select(selector, scope) {
      return extendElements(engine(selector, scope || document));
    }
  
    function match(element, selector) {
      return engine.matches(selector, [element]).length == 1;
    }
  
    Prototype.Selector.engine = engine;
    Prototype.Selector.select = select;
    Prototype.Selector.match = match;
  })(Sizzle);
  
  window.Sizzle = Prototype._original_property;
  delete Prototype._original_property;
  
  var Form = {
    reset: function(form) {
      form = $(form);
      form.reset();
      return form;
    },
  
    serializeElements: function(elements, options) {
      if (typeof options != 'object') options = { hash: !!options };
      else if (Object.isUndefined(options.hash)) options.hash = true;
      var key, value, submitted = false, submit = options.submit, accumulator, initial;
  
      if (options.hash) {
        initial = {};
        accumulator = function(result, key, value) {
          if (key in result) {
            if (!Object.isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
          } else result[key] = value;
          return result;
        };
      } else {
        initial = '';
        accumulator = function(result, key, value) {
          return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
      }
  
      return elements.inject(initial, function(result, element) {
        if (!element.disabled && element.name) {
          key = element.name; value = $(element).getValue();
          if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
              submit !== false && (!submit || key == submit) && (submitted = true)))) {
            result = accumulator(result, key, value);
          }
        }
        return result;
      });
    }
  };
  
  Form.Methods = {
    serialize: function(form, options) {
      return Form.serializeElements(Form.getElements(form), options);
    },
  
    getElements: function(form) {
      var elements = $(form).getElementsByTagName('*'),
          element,
          arr = [ ],
          serializers = Form.Element.Serializers;
      for (var i = 0; element = elements[i]; i++) {
        arr.push(element);
      }
      return arr.inject([], function(elements, child) {
        if (serializers[child.tagName.toLowerCase()])
          elements.push(Element.extend(child));
        return elements;
      })
    },
  
    getInputs: function(form, typeName, name) {
      form = $(form);
      var inputs = form.getElementsByTagName('input');
  
      if (!typeName && !name) return $A(inputs).map(Element.extend);
  
      for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
        var input = inputs[i];
        if ((typeName && input.type != typeName) || (name && input.name != name))
          continue;
        matchingInputs.push(Element.extend(input));
      }
  
      return matchingInputs;
    },
  
    disable: function(form) {
      form = $(form);
      Form.getElements(form).invoke('disable');
      return form;
    },
  
    enable: function(form) {
      form = $(form);
      Form.getElements(form).invoke('enable');
      return form;
    },
  
    findFirstElement: function(form) {
      var elements = $(form).getElements().findAll(function(element) {
        return 'hidden' != element.type && !element.disabled;
      });
      var firstByIndex = elements.findAll(function(element) {
        return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
      }).sortBy(function(element) { return element.tabIndex }).first();
  
      return firstByIndex ? firstByIndex : elements.find(function(element) {
        return /^(?:input|select|textarea)$/i.test(element.tagName);
      });
    },
  
    focusFirstElement: function(form) {
      form = $(form);
      var element = form.findFirstElement();
      if (element) element.activate();
      return form;
    },
  
    request: function(form, options) {
      form = $(form), options = Object.clone(options || { });
  
      var params = options.parameters, action = form.readAttribute('action') || '';
      if (action.blank()) action = window.location.href;
      options.parameters = form.serialize(true);
  
      if (params) {
        if (Object.isString(params)) params = params.toQueryParams();
        Object.extend(options.parameters, params);
      }
  
      if (form.hasAttribute('method') && !options.method)
        options.method = form.method;
  
      return new Ajax.Request(action, options);
    }
  };
  
  /*--------------------------------------------------------------------------*/
  
  
  Form.Element = {
    focus: function(element) {
      $(element).focus();
      return element;
    },
  
    select: function(element) {
      $(element).select();
      return element;
    }
  };
  
  Form.Element.Methods = {
  
    serialize: function(element) {
      element = $(element);
      if (!element.disabled && element.name) {
        var value = element.getValue();
        if (value != undefined) {
          var pair = { };
          pair[element.name] = value;
          return Object.toQueryString(pair);
        }
      }
      return '';
    },
  
    getValue: function(element) {
      element = $(element);
      var method = element.tagName.toLowerCase();
      return Form.Element.Serializers[method](element);
    },
  
    setValue: function(element, value) {
      element = $(element);
      var method = element.tagName.toLowerCase();
      Form.Element.Serializers[method](element, value);
      return element;
    },
  
    clear: function(element) {
      $(element).value = '';
      return element;
    },
  
    present: function(element) {
      return $(element).value != '';
    },
  
    activate: function(element) {
      element = $(element);
      try {
        element.focus();
        if (element.select && (element.tagName.toLowerCase() != 'input' ||
            !(/^(?:button|reset|submit)$/i.test(element.type))))
          element.select();
      } catch (e) { }
      return element;
    },
  
    disable: function(element) {
      element = $(element);
      element.disabled = true;
      return element;
    },
  
    enable: function(element) {
      element = $(element);
      element.disabled = false;
      return element;
    }
  };
  
  /*--------------------------------------------------------------------------*/
  
  var Field = Form.Element;
  
  var $F = Form.Element.Methods.getValue;
  
  /*--------------------------------------------------------------------------*/
  
  Form.Element.Serializers = (function() {
    function input(element, value) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          return inputSelector(element, value);
        default:
          return valueSelector(element, value);
      }
    }
  
    function inputSelector(element, value) {
      if (Object.isUndefined(value))
        return element.checked ? element.value : null;
      else element.checked = !!value;
    }
  
    function valueSelector(element, value) {
      if (Object.isUndefined(value)) return element.value;
      else element.value = value;
    }
  
    function select(element, value) {
      if (Object.isUndefined(value))
        return (element.type === 'select-one' ? selectOne : selectMany)(element);
  
      var opt, currentValue, single = !Object.isArray(value);
      for (var i = 0, length = element.length; i < length; i++) {
        opt = element.options[i];
        currentValue = this.optionValue(opt);
        if (single) {
          if (currentValue == value) {
            opt.selected = true;
            return;
          }
        }
        else opt.selected = value.include(currentValue);
      }
    }
  
    function selectOne(element) {
      var index = element.selectedIndex;
      return index >= 0 ? optionValue(element.options[index]) : null;
    }
  
    function selectMany(element) {
      var values, length = element.length;
      if (!length) return null;
  
      for (var i = 0, values = []; i < length; i++) {
        var opt = element.options[i];
        if (opt.selected) values.push(optionValue(opt));
      }
      return values;
    }
  
    function optionValue(opt) {
      return Element.hasAttribute(opt, 'value') ? opt.value : opt.text;
    }
  
    return {
      input:         input,
      inputSelector: inputSelector,
      textarea:      valueSelector,
      select:        select,
      selectOne:     selectOne,
      selectMany:    selectMany,
      optionValue:   optionValue,
      button:        valueSelector
    };
  })();
  
  /*--------------------------------------------------------------------------*/
  
  
  Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function($super, element, frequency, callback) {
      $super(callback, frequency);
      this.element   = $(element);
      this.lastValue = this.getValue();
    },
  
    execute: function() {
      var value = this.getValue();
      if (Object.isString(this.lastValue) && Object.isString(value) ?
          this.lastValue != value : String(this.lastValue) != String(value)) {
        this.callback(this.element, value);
        this.lastValue = value;
      }
    }
  });
  
  Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
      return Form.Element.getValue(this.element);
    }
  });
  
  Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
      return Form.serialize(this.element);
    }
  });
  
  /*--------------------------------------------------------------------------*/
  
  Abstract.EventObserver = Class.create({
    initialize: function(element, callback) {
      this.element  = $(element);
      this.callback = callback;
  
      this.lastValue = this.getValue();
      if (this.element.tagName.toLowerCase() == 'form')
        this.registerFormCallbacks();
      else
        this.registerCallback(this.element);
    },
  
    onElementEvent: function() {
      var value = this.getValue();
      if (this.lastValue != value) {
        this.callback(this.element, value);
        this.lastValue = value;
      }
    },
  
    registerFormCallbacks: function() {
      Form.getElements(this.element).each(this.registerCallback, this);
    },
  
    registerCallback: function(element) {
      if (element.type) {
        switch (element.type.toLowerCase()) {
          case 'checkbox':
          case 'radio':
            Event.observe(element, 'click', this.onElementEvent.bind(this));
            break;
          default:
            Event.observe(element, 'change', this.onElementEvent.bind(this));
            break;
        }
      }
    }
  });
  
  Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
      return Form.Element.getValue(this.element);
    }
  });
  
  Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
      return Form.serialize(this.element);
    }
  });
  (function() {
  
    var Event = {
      KEY_BACKSPACE: 8,
      KEY_TAB:       9,
      KEY_RETURN:   13,
      KEY_ESC:      27,
      KEY_LEFT:     37,
      KEY_UP:       38,
      KEY_RIGHT:    39,
      KEY_DOWN:     40,
      KEY_DELETE:   46,
      KEY_HOME:     36,
      KEY_END:      35,
      KEY_PAGEUP:   33,
      KEY_PAGEDOWN: 34,
      KEY_INSERT:   45,
  
      cache: {}
    };
  
    var docEl = document.documentElement;
    var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
      && 'onmouseleave' in docEl;
  
  
  
    var isIELegacyEvent = function(event) { return false; };
  
    if (window.attachEvent) {
      if (window.addEventListener) {
        isIELegacyEvent = function(event) {
          return !(event instanceof window.Event);
        };
      } else {
        isIELegacyEvent = function(event) { return true; };
      }
    }
  
    var _isButton;
  
    function _isButtonForDOMEvents(event, code) {
      return event.which ? (event.which === code + 1) : (event.button === code);
    }
  
    var legacyButtonMap = { 0: 1, 1: 4, 2: 2 };
    function _isButtonForLegacyEvents(event, code) {
      return event.button === legacyButtonMap[code];
    }
  
    function _isButtonForWebKit(event, code) {
      switch (code) {
        case 0: return event.which == 1 && !event.metaKey;
        case 1: return event.which == 2 || (event.which == 1 && event.metaKey);
        case 2: return event.which == 3;
        default: return false;
      }
    }
  
    if (window.attachEvent) {
      if (!window.addEventListener) {
        _isButton = _isButtonForLegacyEvents;
      } else {
        _isButton = function(event, code) {
          return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) :
           _isButtonForDOMEvents(event, code);
        }
      }
    } else if (Prototype.Browser.WebKit) {
      _isButton = _isButtonForWebKit;
    } else {
      _isButton = _isButtonForDOMEvents;
    }
  
    function isLeftClick(event)   { return _isButton(event, 0) }
  
    function isMiddleClick(event) { return _isButton(event, 1) }
  
    function isRightClick(event)  { return _isButton(event, 2) }
  
    function element(event) {
      event = Event.extend(event);
  
      var node = event.target, type = event.type,
       currentTarget = event.currentTarget;
  
      if (currentTarget && currentTarget.tagName) {
        if (type === 'load' || type === 'error' ||
          (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
            && currentTarget.type === 'radio'))
              node = currentTarget;
      }
  
      if (node.nodeType == Node.TEXT_NODE)
        node = node.parentNode;
  
      return Element.extend(node);
    }
  
    function findElement(event, expression) {
      var element = Event.element(event);
  
      if (!expression) return element;
      while (element) {
        if (Object.isElement(element) && Prototype.Selector.match(element, expression)) {
          return Element.extend(element);
        }
        element = element.parentNode;
      }
    }
  
    function pointer(event) {
      return { x: pointerX(event), y: pointerY(event) };
    }
  
    function pointerX(event) {
      var docElement = document.documentElement,
       body = document.body || { scrollLeft: 0 };
  
      return event.pageX || (event.clientX +
        (docElement.scrollLeft || body.scrollLeft) -
        (docElement.clientLeft || 0));
    }
  
    function pointerY(event) {
      var docElement = document.documentElement,
       body = document.body || { scrollTop: 0 };
  
      return  event.pageY || (event.clientY +
         (docElement.scrollTop || body.scrollTop) -
         (docElement.clientTop || 0));
    }
  
  
    function stop(event) {
      Event.extend(event);
      event.preventDefault();
      event.stopPropagation();
  
      event.stopped = true;
    }
  
  
    Event.Methods = {
      isLeftClick:   isLeftClick,
      isMiddleClick: isMiddleClick,
      isRightClick:  isRightClick,
  
      element:     element,
      findElement: findElement,
  
      pointer:  pointer,
      pointerX: pointerX,
      pointerY: pointerY,
  
      stop: stop
    };
  
    var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
      m[name] = Event.Methods[name].methodize();
      return m;
    });
  
    if (window.attachEvent) {
      function _relatedTarget(event) {
        var element;
        switch (event.type) {
          case 'mouseover':
          case 'mouseenter':
            element = event.fromElement;
            break;
          case 'mouseout':
          case 'mouseleave':
            element = event.toElement;
            break;
          default:
            return null;
        }
        return Element.extend(element);
      }
  
      var additionalMethods = {
        stopPropagation: function() { this.cancelBubble = true },
        preventDefault:  function() { this.returnValue = false },
        inspect: function() { return '[object Event]' }
      };
  
      Event.extend = function(event, element) {
        if (!event) return false;
  
        if (!isIELegacyEvent(event)) return event;
  
        if (event._extendedByPrototype) return event;
        event._extendedByPrototype = Prototype.emptyFunction;
  
        var pointer = Event.pointer(event);
  
        Object.extend(event, {
          target: event.srcElement || element,
          relatedTarget: _relatedTarget(event),
          pageX:  pointer.x,
          pageY:  pointer.y
        });
  
        Object.extend(event, methods);
        Object.extend(event, additionalMethods);
  
        return event;
      };
    } else {
      Event.extend = Prototype.K;
    }
  
    if (window.addEventListener) {
      Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
      Object.extend(Event.prototype, methods);
    }
  
    function _createResponder(element, eventName, handler) {
      var registry = Element.retrieve(element, 'prototype_event_registry');
  
      if (Object.isUndefined(registry)) {
        CACHE.push(element);
        registry = Element.retrieve(element, 'prototype_event_registry', $H());
      }
  
      var respondersForEvent = registry.get(eventName);
      if (Object.isUndefined(respondersForEvent)) {
        respondersForEvent = [];
        registry.set(eventName, respondersForEvent);
      }
  
      if (respondersForEvent.pluck('handler').include(handler)) return false;
  
      var responder;
      if (eventName.include(":")) {
        responder = function(event) {
          if (Object.isUndefined(event.eventName))
            return false;
  
          if (event.eventName !== eventName)
            return false;
  
          Event.extend(event, element);
          handler.call(element, event);
        };
      } else {
        if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
         (eventName === "mouseenter" || eventName === "mouseleave")) {
          if (eventName === "mouseenter" || eventName === "mouseleave") {
            responder = function(event) {
              Event.extend(event, element);
  
              var parent = event.relatedTarget;
              while (parent && parent !== element) {
                try { parent = parent.parentNode; }
                catch(e) { parent = element; }
              }
  
              if (parent === element) return;
  
              handler.call(element, event);
            };
          }
        } else {
          responder = function(event) {
            Event.extend(event, element);
            handler.call(element, event);
          };
        }
      }
  
      responder.handler = handler;
      respondersForEvent.push(responder);
      return responder;
    }
  
    function _destroyCache() {
      for (var i = 0, length = CACHE.length; i < length; i++) {
        Event.stopObserving(CACHE[i]);
        CACHE[i] = null;
      }
    }
  
    var CACHE = [];
  
    if (Prototype.Browser.IE)
      window.attachEvent('onunload', _destroyCache);
  
    if (Prototype.Browser.WebKit)
      window.addEventListener('unload', Prototype.emptyFunction, false);
  
  
    var _getDOMEventName = Prototype.K,
        translations = { mouseenter: "mouseover", mouseleave: "mouseout" };
  
    if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED) {
      _getDOMEventName = function(eventName) {
        return (translations[eventName] || eventName);
      };
    }
  
    function observe(element, eventName, handler) {
      element = $(element);
  
      var responder = _createResponder(element, eventName, handler);
  
      if (!responder) return element;
  
      if (eventName.include(':')) {
        if (element.addEventListener)
          element.addEventListener("dataavailable", responder, false);
        else {
          element.attachEvent("ondataavailable", responder);
          element.attachEvent("onlosecapture", responder);
        }
      } else {
        var actualEventName = _getDOMEventName(eventName);
  
        if (element.addEventListener)
          element.addEventListener(actualEventName, responder, false);
        else
          element.attachEvent("on" + actualEventName, responder);
      }
  
      return element;
    }
  
    function stopObserving(element, eventName, handler) {
      element = $(element);
  
      var registry = Element.retrieve(element, 'prototype_event_registry');
      if (!registry) return element;
  
      if (!eventName) {
        registry.each( function(pair) {
          var eventName = pair.key;
          stopObserving(element, eventName);
        });
        return element;
      }
  
      var responders = registry.get(eventName);
      if (!responders) return element;
  
      if (!handler) {
        responders.each(function(r) {
          stopObserving(element, eventName, r.handler);
        });
        return element;
      }
  
      var i = responders.length, responder;
      while (i--) {
        if (responders[i].handler === handler) {
          responder = responders[i];
          break;
        }
      }
      if (!responder) return element;
  
      if (eventName.include(':')) {
        if (element.removeEventListener)
          element.removeEventListener("dataavailable", responder, false);
        else {
          element.detachEvent("ondataavailable", responder);
          element.detachEvent("onlosecapture", responder);
        }
      } else {
        var actualEventName = _getDOMEventName(eventName);
        if (element.removeEventListener)
          element.removeEventListener(actualEventName, responder, false);
        else
          element.detachEvent('on' + actualEventName, responder);
      }
  
      registry.set(eventName, responders.without(responder));
  
      return element;
    }
  
    function fire(element, eventName, memo, bubble) {
      element = $(element);
  
      if (Object.isUndefined(bubble))
        bubble = true;
  
      if (element == document && document.createEvent && !element.dispatchEvent)
        element = document.documentElement;
  
      var event;
      if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent('dataavailable', bubble, true);
      } else {
        event = document.createEventObject();
        event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';
      }
  
      event.eventName = eventName;
      event.memo = memo || { };
  
      if (document.createEvent)
        element.dispatchEvent(event);
      else
        element.fireEvent(event.eventType, event);
  
      return Event.extend(event);
    }
  
    Event.Handler = Class.create({
      initialize: function(element, eventName, selector, callback) {
        this.element   = $(element);
        this.eventName = eventName;
        this.selector  = selector;
        this.callback  = callback;
        this.handler   = this.handleEvent.bind(this);
      },
  
      start: function() {
        Event.observe(this.element, this.eventName, this.handler);
        return this;
      },
  
      stop: function() {
        Event.stopObserving(this.element, this.eventName, this.handler);
        return this;
      },
  
      handleEvent: function(event) {
        var element = Event.findElement(event, this.selector);
        if (element) this.callback.call(this.element, event, element);
      }
    });
  
    function on(element, eventName, selector, callback) {
      element = $(element);
      if (Object.isFunction(selector) && Object.isUndefined(callback)) {
        callback = selector, selector = null;
      }
  
      return new Event.Handler(element, eventName, selector, callback).start();
    }
  
    Object.extend(Event, Event.Methods);
  
    Object.extend(Event, {
      fire:          fire,
      observe:       observe,
      stopObserving: stopObserving,
      on:            on
    });
  
    Element.addMethods({
      fire:          fire,
  
      observe:       observe,
  
      stopObserving: stopObserving,
  
      on:            on
    });
  
    Object.extend(document, {
      fire:          fire.methodize(),
  
      observe:       observe.methodize(),
  
      stopObserving: stopObserving.methodize(),
  
      on:            on.methodize(),
  
      loaded:        false
    });
  
    if (window.Event) Object.extend(window.Event, Event);
    else window.Event = Event;
  })();
  
  (function() {

  
    var timer;
  
    function fireContentLoadedEvent() {
      if (document.loaded) return;
      if (timer) window.clearTimeout(timer);
      document.loaded = true;
      document.fire('dom:loaded');
    }
  
    function checkReadyState() {
      if (document.readyState === 'complete') {
        document.stopObserving('readystatechange', checkReadyState);
        fireContentLoadedEvent();
      }
    }
  
    function pollDoScroll() {
      try { document.documentElement.doScroll('left'); }
      catch(e) {
        timer = pollDoScroll.defer();
        return;
      }
      fireContentLoadedEvent();
    }
  
    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
    } else {
      document.observe('readystatechange', checkReadyState);
      if (window == top)
        timer = pollDoScroll.defer();
    }
  
    Event.observe(window, 'load', fireContentLoadedEvent);
  })();
  
  Element.addMethods();
  
  /*------------------------------- DEPRECATED -------------------------------*/
  
  Hash.toQueryString = Object.toQueryString;
  
  var Toggle = { display: Element.toggle };
  
  Element.Methods.childOf = Element.Methods.descendantOf;
  
  var Insertion = {
    Before: function(element, content) {
      return Element.insert(element, {before:content});
    },
  
    Top: function(element, content) {
      return Element.insert(element, {top:content});
    },
  
    Bottom: function(element, content) {
      return Element.insert(element, {bottom:content});
    },
  
    After: function(element, content) {
      return Element.insert(element, {after:content});
    }
  };
  
  var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
  
  var Position = {
    includeScrollOffsets: false,
  
    prepare: function() {
      this.deltaX =  window.pageXOffset
                  || document.documentElement.scrollLeft
                  || document.body.scrollLeft
                  || 0;
      this.deltaY =  window.pageYOffset
                  || document.documentElement.scrollTop
                  || document.body.scrollTop
                  || 0;
    },
  
    within: function(element, x, y) {
      if (this.includeScrollOffsets)
        return this.withinIncludingScrolloffsets(element, x, y);
      this.xcomp = x;
      this.ycomp = y;
      this.offset = Element.cumulativeOffset(element);
  
      return (y >= this.offset[1] &&
              y <  this.offset[1] + element.offsetHeight &&
              x >= this.offset[0] &&
              x <  this.offset[0] + element.offsetWidth);
    },
  
    withinIncludingScrolloffsets: function(element, x, y) {
      var offsetcache = Element.cumulativeScrollOffset(element);
  
      this.xcomp = x + offsetcache[0] - this.deltaX;
      this.ycomp = y + offsetcache[1] - this.deltaY;
      this.offset = Element.cumulativeOffset(element);
  
      return (this.ycomp >= this.offset[1] &&
              this.ycomp <  this.offset[1] + element.offsetHeight &&
              this.xcomp >= this.offset[0] &&
              this.xcomp <  this.offset[0] + element.offsetWidth);
    },
  
    overlap: function(mode, element) {
      if (!mode) return 0;
      if (mode == 'vertical')
        return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
          element.offsetHeight;
      if (mode == 'horizontal')
        return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
          element.offsetWidth;
    },
  
  
    cumulativeOffset: Element.Methods.cumulativeOffset,
  
    positionedOffset: Element.Methods.positionedOffset,
  
    absolutize: function(element) {
      Position.prepare();
      return Element.absolutize(element);
    },
  
    relativize: function(element) {
      Position.prepare();
      return Element.relativize(element);
    },
  
    realOffset: Element.Methods.cumulativeScrollOffset,
  
    offsetParent: Element.Methods.getOffsetParent,
  
    page: Element.Methods.viewportOffset,
  
    clone: function(source, target, options) {
      options = options || { };
      return Element.clonePosition(target, source, options);
    }
  };
  
  /*--------------------------------------------------------------------------*/
  
  if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
    function iter(name) {
      return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
    }
  
    instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
    function(element, className) {
      className = className.toString().strip();
      var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
      return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
    } : function(element, className) {
      className = className.toString().strip();
      var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
      if (!classNames && !className) return elements;
  
      var nodes = $(element).getElementsByTagName('*');
      className = ' ' + className + ' ';
  
      for (var i = 0, child, cn; child = nodes[i]; i++) {
        if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
            (classNames && classNames.all(function(name) {
              return !name.toString().blank() && cn.include(' ' + name + ' ');
            }))))
          elements.push(Element.extend(child));
      }
      return elements;
    };
  
    return function(className, parentElement) {
      return $(parentElement || document.body).getElementsByClassName(className);
    };
  }(Element.Methods);
  
  /*--------------------------------------------------------------------------*/
  
  Element.ClassNames = Class.create();
  Element.ClassNames.prototype = {
    initialize: function(element) {
      this.element = $(element);
    },
  
    _each: function(iterator) {
      this.element.className.split(/\s+/).select(function(name) {
        return name.length > 0;
      })._each(iterator);
    },
  
    set: function(className) {
      this.element.className = className;
    },
  
    add: function(classNameToAdd) {
      if (this.include(classNameToAdd)) return;
      this.set($A(this).concat(classNameToAdd).join(' '));
    },
  
    remove: function(classNameToRemove) {
      if (!this.include(classNameToRemove)) return;
      this.set($A(this).without(classNameToRemove).join(' '));
    },
  
    toString: function() {
      return $A(this).join(' ');
    }
  };
  
  Object.extend(Element.ClassNames.prototype, Enumerable);
  
  /*--------------------------------------------------------------------------*/
  
  (function() {
    window.Selector = Class.create({
      initialize: function(expression) {
        this.expression = expression.strip();
      },
  
      findElements: function(rootElement) {
        return Prototype.Selector.select(this.expression, rootElement);
      },
  
      match: function(element) {
        return Prototype.Selector.match(element, this.expression);
      },
  
      toString: function() {
        return this.expression;
      },
  
      inspect: function() {
        return "#<Selector: " + this.expression + ">";
      }
    });
  
    Object.extend(Selector, {
      matchElements: function(elements, expression) {
        var match = Prototype.Selector.match,
            results = [];
  
        for (var i = 0, length = elements.length; i < length; i++) {
          var element = elements[i];
          if (match(element, expression)) {
            results.push(Element.extend(element));
          }
        }
        return results;
      },
  
      findElement: function(elements, expression, index) {
        index = index || 0;
        var matchIndex = 0, element;
        for (var i = 0, length = elements.length; i < length; i++) {
          element = elements[i];
          if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
            return Element.extend(element);
          }
        }
      },
  
      findChildElements: function(element, expressions) {
        var selector = expressions.toArray().join(', ');
        return Prototype.Selector.select(selector, element || document);
      }
    });
  })();
  

  // validações
  
  function validateCreditCard(s) {
      // remove non-numerics
      var v = "0123456789";
      var w = "";
      for (i=0; i < s.length; i++) {
          x = s.charAt(i);
          if (v.indexOf(x,0) != -1)
          w += x;
      }
      // validate number
      j = w.length / 2;
      k = Math.floor(j);
      m = Math.ceil(j) - k;
      c = 0;
      for (i=0; i<k; i++) {
          a = w.charAt(i*2+m) * 2;
          c += a > 9 ? Math.floor(a/10 + a%10) : a;
      }
      for (i=0; i<k+m; i++) c += w.charAt(i*2+1-m) * 1;
      return (c%10 == 0);
  }
  
  
  var Validator = Class.create();
  
  Validator.prototype = {
      initialize : function(className, error, test, options) {
          if(typeof test == 'function'){
              this.options = $H(options);
              this._test = test;
          } else {
              this.options = $H(test);
              this._test = function(){return true};
          }
          this.error = error || 'Validation failed.';
          this.className = className;
      },
      test : function(v, elm) {
          return (this._test(v,elm) && this.options.all(function(p){
              return Validator.methods[p.key] ? Validator.methods[p.key](v,elm,p.value) : true;
          }));
      }
  }
  Validator.methods = {
      pattern : function(v,elm,opt) {return Validation.get('IsEmpty').test(v) || opt.test(v)},
      minLength : function(v,elm,opt) {return v.length >= opt},
      maxLength : function(v,elm,opt) {return v.length <= opt},
      min : function(v,elm,opt) {return v >= parseFloat(opt)},
      max : function(v,elm,opt) {return v <= parseFloat(opt)},
      notOneOf : function(v,elm,opt) {return $A(opt).all(function(value) {
          return v != value;
      })},
      oneOf : function(v,elm,opt) {return $A(opt).any(function(value) {
          return v == value;
      })},
      is : function(v,elm,opt) {return v == opt},
      isNot : function(v,elm,opt) {return v != opt},
      equalToField : function(v,elm,opt) {return v == $F(opt)},
      notEqualToField : function(v,elm,opt) {return v != $F(opt)},
      include : function(v,elm,opt) {return $A(opt).all(function(value) {
          return Validation.get(value).test(v,elm);
      })}
  }
  
  var Validation = Class.create();
  Validation.defaultOptions = {
      onSubmit : true,
      stopOnFirst : false,
      immediate : false,
      focusOnError : true,
      useTitles : false,
      addClassNameToContainer: false,
      containerClassName: '.input-box',
      onFormValidate : function(result, form) {},
      onElementValidate : function(result, elm) {}
  };
  
  Validation.prototype = {
      initialize : function(form, options){
          this.form = $(form);
          if (!this.form) {
              return;
          }
          this.options = Object.extend({
              onSubmit : Validation.defaultOptions.onSubmit,
              stopOnFirst : Validation.defaultOptions.stopOnFirst,
              immediate : Validation.defaultOptions.immediate,
              focusOnError : Validation.defaultOptions.focusOnError,
              useTitles : Validation.defaultOptions.useTitles,
              onFormValidate : Validation.defaultOptions.onFormValidate,
              onElementValidate : Validation.defaultOptions.onElementValidate
          }, options || {});
          if(this.options.onSubmit) Event.observe(this.form,'submit',this.onSubmit.bind(this),false);
          if(this.options.immediate) {
              Form.getElements(this.form).each(function(input) { // Thanks Mike!
                  if (input.tagName.toLowerCase() == 'select') {
                      Event.observe(input, 'blur', this.onChange.bindAsEventListener(this));
                  }
                  if (input.type.toLowerCase() == 'radio' || input.type.toLowerCase() == 'checkbox') {
                      Event.observe(input, 'click', this.onChange.bindAsEventListener(this));
                  } else {
                      Event.observe(input, 'change', this.onChange.bindAsEventListener(this));
                  }
              }, this);
          }
      },
      onChange : function (ev) {
          Validation.isOnChange = true;
          Validation.validate(Event.element(ev),{
                  useTitle : this.options.useTitles,
                  onElementValidate : this.options.onElementValidate
          });
          Validation.isOnChange = false;
      },
      onSubmit :  function(ev){
          if(!this.validate()) Event.stop(ev);
      },
      validate : function() {
          var result = false;
          var useTitles = this.options.useTitles;
          var callback = this.options.onElementValidate;
          try {
              if(this.options.stopOnFirst) {
                  result = Form.getElements(this.form).all(function(elm) {
                      if (elm.hasClassName('local-validation') && !this.isElementInForm(elm, this.form)) {
                          return true;
                      }
                      return Validation.validate(elm,{useTitle : useTitles, onElementValidate : callback});
                  }, this);
              } else {
                  result = Form.getElements(this.form).collect(function(elm) {
                      if (elm.hasClassName('local-validation') && !this.isElementInForm(elm, this.form)) {
                          return true;
                      }
                      return Validation.validate(elm,{useTitle : useTitles, onElementValidate : callback});
                  }, this).all();
              }
          } catch (e) {
          }
          if(!result && this.options.focusOnError) {
              try{
                  Form.getElements(this.form).findAll(function(elm){return $(elm).hasClassName('validation-failed')}).first().focus()
              }
              catch(e){
              }
          }
          this.options.onFormValidate(result, this.form);
          return result;
      },
      reset : function() {
          Form.getElements(this.form).each(Validation.reset);
      },
      isElementInForm : function(elm, form) {
          var domForm = elm.up('form');
          if (domForm == form) {
              return true;
          }
          return false;
      }
  }
  
  Object.extend(Validation, {
      validate : function(elm, options){
          options = Object.extend({
              useTitle : false,
              onElementValidate : function(result, elm) {}
          }, options || {});
          elm = $(elm);
  
          var cn = $w(elm.className);
          return result = cn.all(function(value) {
              var test = Validation.test(value,elm,options.useTitle);
              options.onElementValidate(test, elm);
              return test;
          });
      },
      insertAdvice : function(elm, advice){
          var container = $(elm).up('.field-row');
          if(container){
              Element.insert(container, {after: advice});
          } else if (elm.up('td.value')) {
              elm.up('td.value').insert({bottom: advice});
          } else if (elm.advaiceContainer && $(elm.advaiceContainer)) {
              $(elm.advaiceContainer).update(advice);
          }
          else {
              switch (elm.type.toLowerCase()) {
                  case 'checkbox':
                  case 'radio':
                      var p = elm.parentNode;
                      if(p) {
                          Element.insert(p, {'bottom': advice});
                      } else {
                          Element.insert(elm, {'after': advice});
                      }
                      break;
                  default:
                      Element.insert(elm, {'after': advice});
              }
          }
      },
      showAdvice : function(elm, advice, adviceName){
          if(!elm.advices){
              elm.advices = new Hash();
          }
          else{
              elm.advices.each(function(pair){
                  if (!advice || pair.value.id != advice.id) {
                      // hide non-current advice after delay
                      this.hideAdvice(elm, pair.value);
                  }
              }.bind(this));
          }
          elm.advices.set(adviceName, advice);
          if(typeof Effect == 'undefined') {
              advice.style.display = 'block';
          } else {
              if(!advice._adviceAbsolutize) {
                  new Effect.Appear(advice, {duration : 1 });
              } else {
                  Position.absolutize(advice);
                  advice.show();
                  advice.setStyle({
                      'top':advice._adviceTop,
                      'left': advice._adviceLeft,
                      'width': advice._adviceWidth,
                      'z-index': 1000
                  });
                  advice.addClassName('advice-absolute');
              }
          }
      },
      hideAdvice : function(elm, advice){
          if (advice != null) {
              new Effect.Fade(advice, {duration : 1, afterFinishInternal : function() {advice.hide();}});
          }
      },
      updateCallback : function(elm, status) {
          if (typeof elm.callbackFunction != 'undefined') {
              eval(elm.callbackFunction+'(\''+elm.id+'\',\''+status+'\')');
          }
      },
      ajaxError : function(elm, errorMsg) {
          var name = 'validate-ajax';
          var advice = Validation.getAdvice(name, elm);
          if (advice == null) {
              advice = this.createAdvice(name, elm, false, errorMsg);
          }
          this.showAdvice(elm, advice, 'validate-ajax');
          this.updateCallback(elm, 'failed');
  
          elm.addClassName('validation-failed');
          elm.addClassName('validate-ajax');
          if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
              var container = elm.up(Validation.defaultOptions.containerClassName);
              if (container && this.allowContainerClassName(elm)) {
                  container.removeClassName('validation-passed');
                  container.addClassName('validation-error');
              }
          }
      },
      allowContainerClassName: function (elm) {
          if (elm.type == 'radio' || elm.type == 'checkbox') {
              return elm.hasClassName('change-container-classname');
          }
  
          return true;
      },
      test : function(name, elm, useTitle) {
          var v = Validation.get(name);
          var prop = '__advice'+name.camelize();
          try {
          if(Validation.isVisible(elm) && !v.test($F(elm), elm)) {
              //if(!elm[prop]) {
                  var advice = Validation.getAdvice(name, elm);
                  if (advice == null) {
                      advice = this.createAdvice(name, elm, useTitle);
                  }
                  this.showAdvice(elm, advice, name);
                  this.updateCallback(elm, 'failed');
              //}
              elm[prop] = 1;
              if (!elm.advaiceContainer) {
                  elm.removeClassName('validation-passed');
                  elm.addClassName('validation-failed');
              }
  
             if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
                  var container = elm.up(Validation.defaultOptions.containerClassName);
                  if (container && this.allowContainerClassName(elm)) {
                      container.removeClassName('validation-passed');
                      container.addClassName('validation-error');
                  }
              }
              return false;
          } else {
              var advice = Validation.getAdvice(name, elm);
              this.hideAdvice(elm, advice);
              this.updateCallback(elm, 'passed');
              elm[prop] = '';
              elm.removeClassName('validation-failed');
              elm.addClassName('validation-passed');
              if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
                  var container = elm.up(Validation.defaultOptions.containerClassName);
                  if (container && !container.down('.validation-failed') && this.allowContainerClassName(elm)) {
                      if (!Validation.get('IsEmpty').test(elm.value) || !this.isVisible(elm)) {
                          container.addClassName('validation-passed');
                      } else {
                          container.removeClassName('validation-passed');
                      }
                      container.removeClassName('validation-error');
                  }
              }
              return true;
          }
          } catch(e) {
              throw(e)
          }
      },
      isVisible : function(elm) {
          while(elm.tagName != 'BODY') {
              if(!$(elm).visible()) return false;
              elm = elm.parentNode;
          }
          return true;
      },
      getAdvice : function(name, elm) {
          return $('advice-' + name + '-' + Validation.getElmID(elm)) || $('advice-' + Validation.getElmID(elm));
      },
      createAdvice : function(name, elm, useTitle, customError) {
          var v = Validation.get(name);
          var errorMsg = useTitle ? ((elm && elm.title) ? elm.title : v.error) : v.error;
          if (customError) {
              errorMsg = customError;
          }
          try {
              if (Translator){
                  errorMsg = Translator.translate(errorMsg);
              }
          }
          catch(e){}
  
          advice = '<div class="validation-advice" id="advice-' + name + '-' + Validation.getElmID(elm) +'" style="display:none">' + errorMsg + '</div>'
  
  
          Validation.insertAdvice(elm, advice);
          advice = Validation.getAdvice(name, elm);
          if($(elm).hasClassName('absolute-advice')) {
              var dimensions = $(elm).getDimensions();
              var originalPosition = Position.cumulativeOffset(elm);
  
              advice._adviceTop = (originalPosition[1] + dimensions.height) + 'px';
              advice._adviceLeft = (originalPosition[0])  + 'px';
              advice._adviceWidth = (dimensions.width)  + 'px';
              advice._adviceAbsolutize = true;
          }
          return advice;
      },
      getElmID : function(elm) {
          return elm.id ? elm.id : elm.name;
      },
      reset : function(elm) {
          elm = $(elm);
          var cn = $w(elm.className);
          cn.each(function(value) {
              var prop = '__advice'+value.camelize();
              if(elm[prop]) {
                  var advice = Validation.getAdvice(value, elm);
                  if (advice) {
                      advice.hide();
                  }
                  elm[prop] = '';
              }
              elm.removeClassName('validation-failed');
              elm.removeClassName('validation-passed');
              if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
                  var container = elm.up(Validation.defaultOptions.containerClassName);
                  if (container) {
                      container.removeClassName('validation-passed');
                      container.removeClassName('validation-error');
                  }
              }
          });
      },
      add : function(className, error, test, options) {
          var nv = {};
          nv[className] = new Validator(className, error, test, options);
          Object.extend(Validation.methods, nv);
      },
      addAllThese : function(validators) {
          var nv = {};
          $A(validators).each(function(value) {
                  nv[value[0]] = new Validator(value[0], value[1], value[2], (value.length > 3 ? value[3] : {}));
              });
          Object.extend(Validation.methods, nv);
      },
      get : function(name) {
          return  Validation.methods[name] ? Validation.methods[name] : Validation.methods['_LikeNoIDIEverSaw_'];
      },
      methods : {
          '_LikeNoIDIEverSaw_' : new Validator('_LikeNoIDIEverSaw_','',{})
      }
  });
  
  Validation.add('IsEmpty', '', function(v) {
      return  (v == '' || (v == null) || (v.length == 0) || /^\s+$/.test(v));
  });
  
  Validation.addAllThese([
      ['validate-no-html-tags', 'HTML tags are not allowed', function(v) {
                  return !/<(\/)?\w+/.test(v);
              }],
      ['validate-select', 'Please select an option.', function(v) {
                  return ((v != "none") && (v != null) && (v.length != 0));
              }],
      ['required-entry', 'This is a required field.', function(v) {
                  return !Validation.get('IsEmpty').test(v);
              }],
      ['validate-number', 'Please enter a valid number in this field.', function(v) {
                  return Validation.get('IsEmpty').test(v)
                      || (!isNaN(parseNumber(v)) && /^\s*-?\d*(\.\d*)?\s*$/.test(v));
              }],
      ['validate-number-range', 'The value is not within the specified range.', function(v, elm) {
                  if (Validation.get('IsEmpty').test(v)) {
                      return true;
                  }
  
                  var numValue = parseNumber(v);
                  if (isNaN(numValue)) {
                      return false;
                  }
  
                  var reRange = /^number-range-(-?[\d.,]+)?-(-?[\d.,]+)?$/,
                      result = true;
  
                  $w(elm.className).each(function(name) {
                      var m = reRange.exec(name);
                      if (m) {
                          result = result
                              && (m[1] == null || m[1] == '' || numValue >= parseNumber(m[1]))
                              && (m[2] == null || m[2] == '' || numValue <= parseNumber(m[2]));
                      }
                  });
  
                  return result;
              }],
      ['validate-digits', 'Please use numbers only in this field. Please avoid spaces or other characters such as dots or commas.', function(v) {
                  return Validation.get('IsEmpty').test(v) ||  !/[^\d]/.test(v);
              }],
      ['validate-digits-range', 'The value is not within the specified range.', function(v, elm) {
                  if (Validation.get('IsEmpty').test(v)) {
                      return true;
                  }
  
                  var numValue = parseNumber(v);
                  if (isNaN(numValue)) {
                      return false;
                  }
  
                  var reRange = /^digits-range-(-?\d+)?-(-?\d+)?$/,
                      result = true;
  
                  $w(elm.className).each(function(name) {
                      var m = reRange.exec(name);
                      if (m) {
                          result = result
                              && (m[1] == null || m[1] == '' || numValue >= parseNumber(m[1]))
                              && (m[2] == null || m[2] == '' || numValue <= parseNumber(m[2]));
                      }
                  });
  
                  return result;
              }],
      ['validate-alpha', 'Please use letters only (a-z or A-Z) in this field.', function (v) {
                  return Validation.get('IsEmpty').test(v) ||  /^[a-zA-Z]+$/.test(v)
              }],
      ['validate-code', 'Please use only letters (a-z), numbers (0-9) or underscore(_) in this field, first character should be a letter.', function (v) {
                  return Validation.get('IsEmpty').test(v) ||  /^[a-z]+[a-z0-9_]+$/.test(v)
              }],
      ['validate-code-event', 'Please do not use "event" for an attribute code.', function (v) {
          return Validation.get('IsEmpty').test(v) || !/^(event)$/.test(v)
              }],
      ['validate-alphanum', 'Please use only letters (a-z or A-Z) or numbers (0-9) only in this field. No spaces or other characters are allowed.', function(v) {
                  return Validation.get('IsEmpty').test(v) || /^[a-zA-Z0-9]+$/.test(v)
              }],
      ['validate-alphanum-with-spaces', 'Please use only letters (a-z or A-Z), numbers (0-9) or spaces only in this field.', function(v) {
                      return Validation.get('IsEmpty').test(v) || /^[a-zA-Z0-9 ]+$/.test(v)
              }],
      ['validate-street', 'Please use only letters (a-z or A-Z) or numbers (0-9) or spaces and # only in this field.', function(v) {
                  return Validation.get('IsEmpty').test(v) ||  /^[ \w]{3,}([A-Za-z]\.)?([ \w]*\#\d+)?(\r\n| )[ \w]{3,}/.test(v)
              }],
      ['validate-phoneStrict', 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
                  return Validation.get('IsEmpty').test(v) || /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(v);
              }],
      ['validate-phoneLax', 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
                  return Validation.get('IsEmpty').test(v) || /^((\d[-. ]?)?((\(\d{3}\))|\d{3}))?[-. ]?\d{3}[-. ]?\d{4}$/.test(v);
              }],
      ['validate-fax', 'Please enter a valid fax number. For example (123) 456-7890 or 123-456-7890.', function(v) {
                  return Validation.get('IsEmpty').test(v) || /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(v);
              }],
      ['validate-date', 'Please enter a valid date.', function(v) {
                  var test = new Date(v);
                  return Validation.get('IsEmpty').test(v) || !isNaN(test);
              }],
      ['validate-date-range', 'The From Date value should be less than or equal to the To Date value.', function(v, elm) {
              var m = /\bdate-range-(\w+)-(\w+)\b/.exec(elm.className);
              if (!m || m[2] == 'to' || Validation.get('IsEmpty').test(v)) {
                  return true;
              }
  
              var currentYear = new Date().getFullYear() + '';
              var normalizedTime = function(v) {
                  v = v.split(/[.\/]/);
                  if (v[2] && v[2].length < 4) {
                      v[2] = currentYear.substr(0, v[2].length) + v[2];
                  }
                  return new Date(v.join('/')).getTime();
              };
  
              var dependentElements = Element.select(elm.form, '.validate-date-range.date-range-' + m[1] + '-to');
              return !dependentElements.length || Validation.get('IsEmpty').test(dependentElements[0].value)
                  || normalizedTime(v) <= normalizedTime(dependentElements[0].value);
          }],
      ['validate-email', 'Please enter a valid email address. For example johndoe@domain.com.', function (v) {
                  //return Validation.get('IsEmpty').test(v) || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v)
                  //return Validation.get('IsEmpty').test(v) || /^[\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9][\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9\.]{1,30}[\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9]@([a-z0-9_-]{1,30}\.){1,5}[a-z]{2,4}$/i.test(v)
                  return Validation.get('IsEmpty').test(v) || /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i.test(v)
              }],
      ['validate-emailSender', 'Please use only visible characters and spaces.', function (v) {
                  return Validation.get('IsEmpty').test(v) ||  /^[\S ]+$/.test(v)
                      }],
      ['validate-password', 'Please enter more characters or clean leading or trailing spaces.', function(v, elm) {
                  var pass=v.strip(); /*strip leading and trailing spaces*/
                  var reMin = new RegExp(/^min-pass-length-[0-9]+$/);
                  var minLength = 7;
                  $w(elm.className).each(function(name, index) {
                      if (name.match(reMin)) {
                          minLength = name.split('-')[3];
                      }
                  });
                  return (!(v.length > 0 && v.length < minLength) && v.length == pass.length);
              }],
      ['validate-admin-password', 'Please enter more characters. Password should contain both numeric and alphabetic characters.', function(v, elm) {
                  var pass=v.strip();
                  if (0 == pass.length) {
                      return true;
                  }
                  if (!(/[a-z]/i.test(v)) || !(/[0-9]/.test(v))) {
                      return false;
                  }
                  var reMin = new RegExp(/^min-admin-pass-length-[0-9]+$/);
                  var minLength = 7;
                  $w(elm.className).each(function(name, index) {
                      if (name.match(reMin)) {
                          minLength = name.split('-')[4];
                      }
                  });
                  return !(pass.length < minLength);
              }],
      ['validate-cpassword', 'Please make sure your passwords match.', function(v) {
                  var conf = $('confirmation') ? $('confirmation') : $$('.validate-cpassword')[0];
                  var pass = false;
                  if ($('password')) {
                      pass = $('password');
                  }
                  var passwordElements = $$('.validate-password');
                  for (var i = 0; i < passwordElements.size(); i++) {
                      var passwordElement = passwordElements[i];
                      if (passwordElement.up('form').id == conf.up('form').id) {
                          pass = passwordElement;
                      }
                  }
                  if ($$('.validate-admin-password').size()) {
                      pass = $$('.validate-admin-password')[0];
                  }
                  return (pass.value == conf.value);
              }],
      ['validate-both-passwords', 'Please make sure your passwords match.', function(v, input) {
                  var dependentInput = $(input.form[input.name == 'password' ? 'confirmation' : 'password']),
                      isEqualValues  = input.value == dependentInput.value;
  
                  if (isEqualValues && dependentInput.hasClassName('validation-failed')) {
                      Validation.test(this.className, dependentInput);
                  }
  
                  return dependentInput.value == '' || isEqualValues;
              }],
      ['validate-url', 'Please enter a valid URL. Protocol is required (http://, https:// or ftp://)', function (v) {
                  v = (v || '').replace(/^\s+/, '').replace(/\s+$/, '');
                  return Validation.get('IsEmpty').test(v) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(v)
              }],
      ['validate-clean-url', 'Please enter a valid URL. For example http://www.example.com or www.example.com', function (v) {
                  return Validation.get('IsEmpty').test(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i.test(v) || /^(www)((\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i.test(v)
              }],
      ['validate-identifier', 'Please enter a valid URL Key. For example "example-page", "example-page.html" or "anotherlevel/example-page".', function (v) {
                  return Validation.get('IsEmpty').test(v) || /^[a-z0-9][a-z0-9_\/-]+(\.[a-z0-9_-]+)?$/.test(v)
              }],
      ['validate-xml-identifier', 'Please enter a valid XML-identifier. For example something_1, block5, id-4.', function (v) {
                  return Validation.get('IsEmpty').test(v) || /^[A-Z][A-Z0-9_\/-]*$/i.test(v)
              }],
      ['validate-ssn', 'Please enter a valid social security number. For example 123-45-6789.', function(v) {
              return Validation.get('IsEmpty').test(v) || /^\d{3}-?\d{2}-?\d{4}$/.test(v);
              }],
      ['validate-zip', 'Please enter a valid zip code. For example 90602 or 90602-1234.', function(v) {
              return Validation.get('IsEmpty').test(v) || /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(v);
              }],
      ['validate-zip-international', 'Please enter a valid zip code.', function(v) {
              //return Validation.get('IsEmpty').test(v) || /(^[A-z0-9]{2,10}([\s]{0,1}|[\-]{0,1})[A-z0-9]{2,10}$)/.test(v);
              return true;
              }],
      ['validate-date-au', 'Please use this date format: dd/mm/yyyy. For example 17/03/2006 for the 17th of March, 2006.', function(v) {
                  if(Validation.get('IsEmpty').test(v)) return true;
                  var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                  if(!regex.test(v)) return false;
                  var d = new Date(v.replace(regex, '$2/$1/$3'));
                  return ( parseInt(RegExp.$2, 10) == (1+d.getMonth()) ) &&
                              (parseInt(RegExp.$1, 10) == d.getDate()) &&
                              (parseInt(RegExp.$3, 10) == d.getFullYear() );
              }],
      ['validate-currency-dollar', 'Please enter a valid $ amount. For example $100.00.', function(v) {
                  // [$]1[##][,###]+[.##]
                  // [$]1###+[.##]
                  // [$]0.##
                  // [$].##
                  return Validation.get('IsEmpty').test(v) ||  /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(v)
              }],
      ['validate-one-required', 'Please select one of the above options.', function (v,elm) {
                  var p = elm.parentNode;
                  var options = p.getElementsByTagName('INPUT');
                  return $A(options).any(function(elm) {
                      return $F(elm);
                  });
              }],
      ['validate-one-required-by-name', 'Please select one of the options.', function (v,elm) {
                  var inputs = $$('input[name="' + elm.name.replace(/([\\"])/g, '\\$1') + '"]');
  
                  var error = 1;
                  for(var i=0;i<inputs.length;i++) {
                      if((inputs[i].type == 'checkbox' || inputs[i].type == 'radio') && inputs[i].checked == true) {
                          error = 0;
                      }
  
                      if(Validation.isOnChange && (inputs[i].type == 'checkbox' || inputs[i].type == 'radio')) {
                          Validation.reset(inputs[i]);
                      }
                  }
  
                  if( error == 0 ) {
                      return true;
                  } else {
                      return false;
                  }
              }],
      ['validate-not-negative-number', 'Please enter a number 0 or greater in this field.', function(v) {
                  if (Validation.get('IsEmpty').test(v)) {
                      return true;
                  }
                  v = parseNumber(v);
                  return !isNaN(v) && v >= 0;
              }],
      ['validate-zero-or-greater', 'Please enter a number 0 or greater in this field.', function(v) {
              return Validation.get('validate-not-negative-number').test(v);
          }],
      ['validate-greater-than-zero', 'Please enter a number greater than 0 in this field.', function(v) {
              if (Validation.get('IsEmpty').test(v)) {
                  return true;
              }
              v = parseNumber(v);
              return !isNaN(v) && v > 0;
          }],
  
      ['validate-special-price', 'The Special Price is active only when lower than the Actual Price.', function(v) {
          var priceInput = $('price');
          var priceType = $('price_type');
          var priceValue = parseFloat(v);
  
          // Passed on non-related validators conditions (to not change order of validation)
          if(
              !priceInput
              || Validation.get('IsEmpty').test(v)
              || !Validation.get('validate-number').test(v)
          ) {
              return true;
          }
          if(priceType) {
              return (priceType && priceValue <= 99.99);
          }
          return priceValue < parseFloat($F(priceInput));
      }],
      ['validate-state', 'Please select State/Province.', function(v) {
                  return (v!=0 || v == '');
              }],
      ['validate-new-password', 'Please enter more characters or clean leading or trailing spaces.', function(v, elm) {
                  if (!Validation.get('validate-password').test(v, elm)) return false;
                  if (Validation.get('IsEmpty').test(v) && v != '') return false;
                  return true;
              }],
      ['validate-cc-number', 'Please enter a valid credit card number.', function(v, elm) {
                  // remove non-numerics
                  var ccTypeContainer = $(elm.id.substr(0,elm.id.indexOf('_cc_number')) + '_cc_type');
                  if (ccTypeContainer && typeof Validation.creditCartTypes.get(ccTypeContainer.value) != 'undefined'
                          && Validation.creditCartTypes.get(ccTypeContainer.value)[2] == false) {
                      if (!Validation.get('IsEmpty').test(v) && Validation.get('validate-digits').test(v)) {
                          return true;
                      } else {
                          return false;
                      }
                  }
                  return validateCreditCard(v);
              }],
      ['validate-cc-type', 'Credit card number does not match credit card type.', function(v, elm) {
                  // remove credit card number delimiters such as "-" and space
                  elm.value = removeDelimiters(elm.value);
                  v         = removeDelimiters(v);
  
                  var ccTypeContainer = $(elm.id.substr(0,elm.id.indexOf('_cc_number')) + '_cc_type');
                  if (!ccTypeContainer) {
                      return true;
                  }
                  var ccType = ccTypeContainer.value;
  
                  if (typeof Validation.creditCartTypes.get(ccType) == 'undefined') {
                      return false;
                  }
  
                  // Other card type or switch or solo card
                  if (Validation.creditCartTypes.get(ccType)[0]==false) {
                      return true;
                  }
  
                  var validationFailure = false;
                  Validation.creditCartTypes.each(function (pair) {
                      if (pair.key == ccType) {
                          if (pair.value[0] && !v.match(pair.value[0])) {
                              validationFailure = true;
                          }
                          throw $break;
                      }
                  });
  
                  if (validationFailure) {
                      return false;
                  }
  
                  if (ccTypeContainer.hasClassName('validation-failed') && Validation.isOnChange) {
                      Validation.validate(ccTypeContainer);
                  }
  
                  return true;
              }],
       ['validate-cc-type-select', 'Card type does not match credit card number.', function(v, elm) {
                  var ccNumberContainer = $(elm.id.substr(0,elm.id.indexOf('_cc_type')) + '_cc_number');
                  if (Validation.isOnChange && Validation.get('IsEmpty').test(ccNumberContainer.value)) {
                      return true;
                  }
                  if (Validation.get('validate-cc-type').test(ccNumberContainer.value, ccNumberContainer)) {
                      Validation.validate(ccNumberContainer);
                  }
                  return Validation.get('validate-cc-type').test(ccNumberContainer.value, ccNumberContainer);
              }],
       ['validate-cc-exp', 'Incorrect credit card expiration date.', function(v, elm) {
                  var ccExpMonth   = v;
                  var ccExpYear    = $(elm.id.substr(0,elm.id.indexOf('_expiration')) + '_expiration_yr').value;
                  var currentTime  = new Date();
                  var currentMonth = currentTime.getMonth() + 1;
                  var currentYear  = currentTime.getFullYear();
                  if (ccExpMonth < currentMonth && ccExpYear == currentYear) {
                      return false;
                  }
                  return true;
              }],
       ['validate-cc-cvn', 'Please enter a valid credit card verification number.', function(v, elm) {
                  var ccTypeContainer = $(elm.id.substr(0,elm.id.indexOf('_cc_cid')) + '_cc_type');
                  if (!ccTypeContainer) {
                      return true;
                  }
                  var ccType = ccTypeContainer.value;
  
                  if (typeof Validation.creditCartTypes.get(ccType) == 'undefined') {
                      return false;
                  }
  
                  var re = Validation.creditCartTypes.get(ccType)[1];
  
                  if (v.match(re)) {
                      return true;
                  }
  
                  return false;
              }],
       ['validate-ajax', '', function(v, elm) { return true; }],
       ['validate-data', 'Please use only letters (a-z or A-Z), numbers (0-9) or underscore(_) in this field, first character should be a letter.', function (v) {
                  if(v != '' && v) {
                      return /^[A-Za-z]+[A-Za-z0-9_]+$/.test(v);
                  }
                  return true;
              }],
       ['validate-css-length', 'Please input a valid CSS-length. For example 100px or 77pt or 20em or .5ex or 50%.', function (v) {
                  if (v != '' && v) {
                      return /^[0-9\.]+(px|pt|em|ex|%)?$/.test(v) && (!(/\..*\./.test(v))) && !(/\.$/.test(v));
                  }
                  return true;
              }],
       ['validate-length', 'Text length does not satisfy specified text range.', function (v, elm) {
                  var reMax = new RegExp(/^maximum-length-[0-9]+$/);
                  var reMin = new RegExp(/^minimum-length-[0-9]+$/);
                  var result = true;
                  $w(elm.className).each(function(name, index) {
                      if (name.match(reMax) && result) {
                         var length = name.split('-')[2];
                         result = (v.length <= length);
                      }
                      if (name.match(reMin) && result && !Validation.get('IsEmpty').test(v)) {
                          var length = name.split('-')[2];
                          result = (v.length >= length);
                      }
                  });
                  return result;
              }],
       ['validate-percents', 'Please enter a number lower than 100.', {max:100}],
       ['required-file', 'Please select a file', function(v, elm) {
           var result = !Validation.get('IsEmpty').test(v);
           if (result === false) {
               ovId = elm.id + '_value';
               if ($(ovId)) {
                   result = !Validation.get('IsEmpty').test($(ovId).value);
               }
           }
           return result;
       }],
       ['validate-cc-ukss', 'Please enter issue number or start date for switch/solo card type.', function(v,elm) {
           var endposition;
  
           if (elm.id.match(/(.)+_cc_issue$/)) {
               endposition = elm.id.indexOf('_cc_issue');
           } else if (elm.id.match(/(.)+_start_month$/)) {
               endposition = elm.id.indexOf('_start_month');
           } else {
               endposition = elm.id.indexOf('_start_year');
           }
  
           var prefix = elm.id.substr(0,endposition);
  
           var ccTypeContainer = $(prefix + '_cc_type');
  
           if (!ccTypeContainer) {
                 return true;
           }
           var ccType = ccTypeContainer.value;
  
           if(['SS','SM','SO'].indexOf(ccType) == -1){
               return true;
           }
  
           $(prefix + '_cc_issue').advaiceContainer
             = $(prefix + '_start_month').advaiceContainer
             = $(prefix + '_start_year').advaiceContainer
             = $(prefix + '_cc_type_ss_div').down('ul li.adv-container');
  
           var ccIssue   =  $(prefix + '_cc_issue').value;
           var ccSMonth  =  $(prefix + '_start_month').value;
           var ccSYear   =  $(prefix + '_start_year').value;
  
           var ccStartDatePresent = (ccSMonth && ccSYear) ? true : false;
  
           if (!ccStartDatePresent && !ccIssue){
               return false;
           }
           return true;
       }]
  ]);
  
  function removeDelimiters (v) {
      v = v.replace(/\s/g, '');
      v = v.replace(/\-/g, '');
      return v;
  }
  
  function parseNumber(v)
  {
      if (typeof v != 'string') {
          return parseFloat(v);
      }
  
      var isDot  = v.indexOf('.');
      var isComa = v.indexOf(',');
  
      if (isDot != -1 && isComa != -1) {
          if (isComa > isDot) {
              v = v.replace('.', '').replace(',', '.');
          }
          else {
              v = v.replace(',', '');
          }
      }
      else if (isComa != -1) {
          v = v.replace(',', '.');
      }
  
      return parseFloat(v);
  }
  
  /**
   * Hash with credit card types which can be simply extended in payment modules
   * 0 - regexp for card number
   * 1 - regexp for cvn
   * 2 - check or not credit card number trough Luhn algorithm by
   *     function validateCreditCard which you can find above in this file
   */
  Validation.creditCartTypes = $H({
  //    'SS': [new RegExp('^((6759[0-9]{12})|(5018|5020|5038|6304|6759|6761|6763[0-9]{12,19})|(49[013][1356][0-9]{12})|(6333[0-9]{12})|(6334[0-4]\d{11})|(633110[0-9]{10})|(564182[0-9]{10}))([0-9]{2,3})?$'), new RegExp('^([0-9]{3}|[0-9]{4})?$'), true],
      'SO': [new RegExp('^(6334[5-9]([0-9]{11}|[0-9]{13,14}))|(6767([0-9]{12}|[0-9]{14,15}))$'), new RegExp('^([0-9]{3}|[0-9]{4})?$'), true],
      'VI': [new RegExp('^4[0-9]{12}([0-9]{3})?$'), new RegExp('^[0-9]{3}$'), true],
      'MC': [new RegExp('^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$'), new RegExp('^[0-9]{3}$'), true],
      'AE': [new RegExp('^3[47][0-9]{13}$'), new RegExp('^[0-9]{4}$'), true],
      'DI': [new RegExp('^(30[0-5][0-9]{13}|3095[0-9]{12}|35(2[8-9][0-9]{12}|[3-8][0-9]{13})|36[0-9]{12}|3[8-9][0-9]{14}|6011(0[0-9]{11}|[2-4][0-9]{11}|74[0-9]{10}|7[7-9][0-9]{10}|8[6-9][0-9]{10}|9[0-9]{11})|62(2(12[6-9][0-9]{10}|1[3-9][0-9]{11}|[2-8][0-9]{12}|9[0-1][0-9]{11}|92[0-5][0-9]{10})|[4-6][0-9]{13}|8[2-8][0-9]{12})|6(4[4-9][0-9]{13}|5[0-9]{14}))$'), new RegExp('^[0-9]{3}$'), true],
      'JCB': [new RegExp('^(30[0-5][0-9]{13}|3095[0-9]{12}|35(2[8-9][0-9]{12}|[3-8][0-9]{13})|36[0-9]{12}|3[8-9][0-9]{14}|6011(0[0-9]{11}|[2-4][0-9]{11}|74[0-9]{10}|7[7-9][0-9]{10}|8[6-9][0-9]{10}|9[0-9]{11})|62(2(12[6-9][0-9]{10}|1[3-9][0-9]{11}|[2-8][0-9]{12}|9[0-1][0-9]{11}|92[0-5][0-9]{10})|[4-6][0-9]{13}|8[2-8][0-9]{12})|6(4[4-9][0-9]{13}|5[0-9]{14}))$'), new RegExp('^[0-9]{3,4}$'), true],
      'DICL': [new RegExp('^(30[0-5][0-9]{13}|3095[0-9]{12}|35(2[8-9][0-9]{12}|[3-8][0-9]{13})|36[0-9]{12}|3[8-9][0-9]{14}|6011(0[0-9]{11}|[2-4][0-9]{11}|74[0-9]{10}|7[7-9][0-9]{10}|8[6-9][0-9]{10}|9[0-9]{11})|62(2(12[6-9][0-9]{10}|1[3-9][0-9]{11}|[2-8][0-9]{12}|9[0-1][0-9]{11}|92[0-5][0-9]{10})|[4-6][0-9]{13}|8[2-8][0-9]{12})|6(4[4-9][0-9]{13}|5[0-9]{14}))$'), new RegExp('^[0-9]{3}$'), true],
      'SM': [new RegExp('(^(5[0678])[0-9]{11,18}$)|(^(6[^05])[0-9]{11,18}$)|(^(601)[^1][0-9]{9,16}$)|(^(6011)[0-9]{9,11}$)|(^(6011)[0-9]{13,16}$)|(^(65)[0-9]{11,13}$)|(^(65)[0-9]{15,18}$)|(^(49030)[2-9]([0-9]{10}$|[0-9]{12,13}$))|(^(49033)[5-9]([0-9]{10}$|[0-9]{12,13}$))|(^(49110)[1-2]([0-9]{10}$|[0-9]{12,13}$))|(^(49117)[4-9]([0-9]{10}$|[0-9]{12,13}$))|(^(49118)[0-2]([0-9]{10}$|[0-9]{12,13}$))|(^(4936)([0-9]{12}$|[0-9]{14,15}$))'), new RegExp('^([0-9]{3}|[0-9]{4})?$'), true],
      'OT': [false, new RegExp('^([0-9]{3}|[0-9]{4})?$'), false]
  });
  
  
  function popWin(url,win,para) {
      var win = window.open(url,win,para);
      win.focus();
  }
  
  function setLocation(url){
      window.location.href = encodeURI(url);
  }
  
  function setPLocation(url, setFocus){
      if( setFocus ) {
          window.opener.focus();
      }
      window.opener.location.href = encodeURI(url);
  }
  
  /**
   * @deprecated
   */
  function setLanguageCode(code, fromCode){
      //TODO: javascript cookies have different domain and path than php cookies
      var href = window.location.href;
      var after = '', dash;
      if (dash = href.match(/\#(.*)$/)) {
          href = href.replace(/\#(.*)$/, '');
          after = dash[0];
      }
  
      if (href.match(/[?]/)) {
          var re = /([?&]store=)[a-z0-9_]*/;
          if (href.match(re)) {
              href = href.replace(re, '$1'+code);
          } else {
              href += '&store='+code;
          }
  
          var re = /([?&]from_store=)[a-z0-9_]*/;
          if (href.match(re)) {
              href = href.replace(re, '');
          }
      } else {
          href += '?store='+code;
      }
      if (typeof(fromCode) != 'undefined') {
          href += '&from_store='+fromCode;
      }
      href += after;
  
      setLocation(href);
  }
  
  
  function decorateGeneric(elements, decorateParams)
  {
      var allSupportedParams = ['odd', 'even', 'first', 'last'];
      var _decorateParams = {};
      var total = elements.length;
  
      if (total) {
          // determine params called
          if (typeof(decorateParams) == 'undefined') {
              decorateParams = allSupportedParams;
          }
          if (!decorateParams.length) {
              return;
          }
          for (var k in allSupportedParams) {
              _decorateParams[allSupportedParams[k]] = false;
          }
          for (var k in decorateParams) {
              _decorateParams[decorateParams[k]] = true;
          }
  
          // decorate elements
          // elements[0].addClassName('first'); // will cause bug in IE (#5587)
          if (_decorateParams.first) {
              Element.addClassName(elements[0], 'first');
          }
          if (_decorateParams.last) {
              Element.addClassName(elements[total-1], 'last');
          }
          for (var i = 0; i < total; i++) {
              if ((i + 1) % 2 == 0) {
                  if (_decorateParams.even) {
                      Element.addClassName(elements[i], 'even');
                  }
              }
              else {
                  if (_decorateParams.odd) {
                      Element.addClassName(elements[i], 'odd');
                  }
              }
          }
      }
  }
  
  
  function decorateTable(table, options) {
      var table = $(table);
      if (table) {
          // set default options
          var _options = {
              'tbody'    : false,
              'tbody tr' : ['odd', 'even', 'first', 'last'],
              'thead tr' : ['first', 'last'],
              'tfoot tr' : ['first', 'last'],
              'tr td'    : ['last']
          };
          // overload options
          if (typeof(options) != 'undefined') {
              for (var k in options) {
                  _options[k] = options[k];
              }
          }
          // decorate
          if (_options['tbody']) {
              decorateGeneric(table.select('tbody'), _options['tbody']);
          }
          if (_options['tbody tr']) {
              decorateGeneric(table.select('tbody tr'), _options['tbody tr']);
          }
          if (_options['thead tr']) {
              decorateGeneric(table.select('thead tr'), _options['thead tr']);
          }
          if (_options['tfoot tr']) {
              decorateGeneric(table.select('tfoot tr'), _options['tfoot tr']);
          }
          if (_options['tr td']) {
              var allRows = table.select('tr');
              if (allRows.length) {
                  for (var i = 0; i < allRows.length; i++) {
                      decorateGeneric(allRows[i].getElementsByTagName('TD'), _options['tr td']);
                  }
              }
          }
      }
  }
  
  
  function decorateList(list, nonRecursive) {
      if ($(list)) {
          if (typeof(nonRecursive) == 'undefined') {
              var items = $(list).select('li');
          }
          else {
              var items = $(list).childElements();
          }
          decorateGeneric(items, ['odd', 'even', 'last']);
      }
  }
  
  
  function decorateDataList(list) {
      list = $(list);
      if (list) {
          decorateGeneric(list.select('dt'), ['odd', 'even', 'last']);
          decorateGeneric(list.select('dd'), ['odd', 'even', 'last']);
      }
  }
  
  
  function parseSidUrl(baseUrl, urlExt) {
      var sidPos = baseUrl.indexOf('/?SID=');
      var sid = '';
      urlExt = (urlExt != undefined) ? urlExt : '';
  
      if(sidPos > -1) {
          sid = '?' + baseUrl.substring(sidPos + 2);
          baseUrl = baseUrl.substring(0, sidPos + 1);
      }
  
      return baseUrl+urlExt+sid;
  }
  
  
  function formatCurrency(price, format, showPlus){
      var precision = isNaN(format.precision = Math.abs(format.precision)) ? 2 : format.precision;
      var requiredPrecision = isNaN(format.requiredPrecision = Math.abs(format.requiredPrecision)) ? 2 : format.requiredPrecision;
  
      //precision = (precision > requiredPrecision) ? precision : requiredPrecision;
      //for now we don't need this difference so precision is requiredPrecision
      precision = requiredPrecision;
  
      var integerRequired = isNaN(format.integerRequired = Math.abs(format.integerRequired)) ? 1 : format.integerRequired;
  
      var decimalSymbol = format.decimalSymbol == undefined ? "," : format.decimalSymbol;
      var groupSymbol = format.groupSymbol == undefined ? "." : format.groupSymbol;
      var groupLength = format.groupLength == undefined ? 3 : format.groupLength;
  
      var s = '';
  
      if (showPlus == undefined || showPlus == true) {
          s = price < 0 ? "-" : ( showPlus ? "+" : "");
      } else if (showPlus == false) {
          s = '';
      }
  
      var i = parseInt(price = Math.abs(+price || 0).toFixed(precision)) + "";
      var pad = (i.length < integerRequired) ? (integerRequired - i.length) : 0;
      while (pad) { i = '0' + i; pad--; }
      j = (j = i.length) > groupLength ? j % groupLength : 0;
      re = new RegExp("(\\d{" + groupLength + "})(?=\\d)", "g");
  
      var r = (j ? i.substr(0, j) + groupSymbol : "") + i.substr(j).replace(re, "$1" + groupSymbol) + (precision ? decimalSymbol + Math.abs(price - i).toFixed(precision).replace(/-/, 0).slice(2) : "");
      var pattern = '';
      if (format.pattern.indexOf('{sign}') == -1) {
          pattern = s + format.pattern;
      } else {
          pattern = format.pattern.replace('{sign}', s);
      }
  
      return pattern.replace('%s', r).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };
  
  function expandDetails(el, childClass) {
      if (Element.hasClassName(el,'show-details')) {
          $$(childClass).each(function(item){
              item.hide();
          });
          Element.removeClassName(el,'show-details');
      }
      else {
          $$(childClass).each(function(item){
              item.show();
          });
          Element.addClassName(el,'show-details');
      }
  }
  
  // Version 1.0
  var isIE = navigator.appVersion.match(/MSIE/) == "MSIE";
  
  if (!window.Varien)
      var Varien = new Object();
  
  Varien.showLoading = function(){
      var loader = $('loading-process');
      loader && loader.show();
  };
  Varien.hideLoading = function(){
      var loader = $('loading-process');
      loader && loader.hide();
  };
  Varien.GlobalHandlers = {
      onCreate: function() {
          Varien.showLoading();
      },
  
      onComplete: function() {
          if(Ajax.activeRequestCount == 0) {
              Varien.hideLoading();
          }
      }
  };
  
  Ajax.Responders.register(Varien.GlobalHandlers);
  
  /**
   * Quick Search form client model
   */
  Varien.searchForm = Class.create();
  Varien.searchForm.prototype = {
      initialize : function(form, field, emptyText){
          this.form   = $(form);
          this.field  = $(field);
          this.emptyText = emptyText;
  
          Event.observe(this.form,  'submit', this.submit.bind(this));
          Event.observe(this.field, 'focus', this.focus.bind(this));
          Event.observe(this.field, 'blur', this.blur.bind(this));
          this.blur();
      },
  
      submit : function(event){
          if (this.field.value == this.emptyText || this.field.value == ''){
              Event.stop(event);
              return false;
          }
          return true;
      },
  
      focus : function(event){
          if(this.field.value==this.emptyText){
              this.field.value='';
          }
  
      },
  
      blur : function(event){
          if(this.field.value==''){
              this.field.value=this.emptyText;
          }
      },
  
      initAutocomplete : function(url, destinationElement){
          new Ajax.Autocompleter(
              this.field,
              destinationElement,
              url,
              {
                  paramName: this.field.name,
                  method: 'get',
                  minChars: 2,
                  updateElement: this._selectAutocompleteItem.bind(this),
                  onShow : function(element, update) {
                      if(!update.style.position || update.style.position=='absolute') {
                          update.style.position = 'absolute';
                          Position.clone(element, update, {
                              setHeight: false,
                              offsetTop: element.offsetHeight
                          });
                      }
                      Effect.Appear(update,{duration:0});
                  }
  
              }
          );
      },
  
      _selectAutocompleteItem : function(element){
          if(element.title){
              this.field.value = element.title;
          }
          this.form.submit();
      }
  };
  
  Varien.Tabs = Class.create();
  Varien.Tabs.prototype = {
    initialize: function(selector) {
      var self=this;
      $$(selector+' a').each(this.initTab.bind(this));
    },
  
    initTab: function(el) {
        el.href = 'javascript:void(0)';
        if ($(el.parentNode).hasClassName('active')) {
          this.showContent(el);
        }
        el.observe('click', this.showContent.bind(this, el));
    },
  
    showContent: function(a) {
      var li = $(a.parentNode), ul = $(li.parentNode);
      ul.getElementsBySelector('li', 'ol').each(function(el){
        var contents = $(el.id+'_contents');
        if (el==li) {
          el.addClassName('active');
          contents.show();
        } else {
          el.removeClassName('active');
          contents.hide();
        }
      });
    }
  };
  
  Varien.DateElement = Class.create();
  Varien.DateElement.prototype = {
      initialize: function(type, content, required, format) {
          if (type == 'id') {
              // id prefix
              this.day    = $(content + 'day');
              this.month  = $(content + 'month');
              this.year   = $(content + 'year');
              this.full   = $(content + 'full');
              this.advice = $(content + 'date-advice');
          } else if (type == 'container') {
              // content must be container with data
              this.day    = content.day;
              this.month  = content.month;
              this.year   = content.year;
              this.full   = content.full;
              this.advice = content.advice;
          } else {
              return;
          }
  
          this.required = required;
          this.format   = format;
  
          this.day.addClassName('validate-custom');
          this.day.validate = this.validate.bind(this);
          this.month.addClassName('validate-custom');
          this.month.validate = this.validate.bind(this);
          this.year.addClassName('validate-custom');
          this.year.validate = this.validate.bind(this);
  
          this.setDateRange(false, false);
          this.year.setAttribute('autocomplete','off');
  
          this.advice.hide();
  
          var date = new Date;
          this.curyear = date.getFullYear();
      },
      validate: function() {
          var error = false,
              day   = parseInt(this.day.value, 10)   || 0,
              month = parseInt(this.month.value, 10) || 0,
              year  = parseInt(this.year.value, 10)  || 0;
          if (this.day.value.strip().empty()
              && this.month.value.strip().empty()
              && this.year.value.strip().empty()
          ) {
              if (this.required) {
                  error = 'This date is a required value.';
              } else {
                  this.full.value = '';
              }
          } else if (!day || !month || !year) {
              error = 'Please enter a valid full date';
          } else {
              var date = new Date, countDaysInMonth = 0, errorType = null;
              date.setYear(year);date.setMonth(month-1);date.setDate(32);
              countDaysInMonth = 32 - date.getDate();
              if(!countDaysInMonth || countDaysInMonth>31) countDaysInMonth = 31;
              if(year < 1900) error = this.errorTextModifier(this.validateDataErrorText);
  
              if (day<1 || day>countDaysInMonth) {
                  errorType = 'day';
                  error = 'Please enter a valid day (1-%d).';
              } else if (month<1 || month>12) {
                  errorType = 'month';
                  error = 'Please enter a valid month (1-12).';
              } else {
                  if(day % 10 == day) this.day.value = '0'+day;
                  if(month % 10 == month) this.month.value = '0'+month;
                  this.full.value = this.format.replace(/%[mb]/i, this.month.value).replace(/%[de]/i, this.day.value).replace(/%y/i, this.year.value);
                  var testFull = this.month.value + '/' + this.day.value + '/'+ this.year.value;
                  var test = new Date(testFull);
                  if (isNaN(test)) {
                      error = 'Please enter a valid date.';
                  } else {
                      this.setFullDate(test);
                  }
              }
              var valueError = false;
              if (!error && !this.validateData()){//(year<1900 || year>curyear) {
                  errorType = this.validateDataErrorType;//'year';
                  valueError = this.validateDataErrorText;//'Please enter a valid year (1900-%d).';
                  error = valueError;
              }
          }
  
          if (error !== false) {
              try {
                  error = Translator.translate(error);
              }
              catch (e) {}
              if (!valueError) {
                  this.advice.innerHTML = error.replace('%d', countDaysInMonth);
              } else {
                  this.advice.innerHTML = this.errorTextModifier(error);
              }
              this.advice.show();
              return false;
          }
  
          // fixing elements class
          this.day.removeClassName('validation-failed');
          this.month.removeClassName('validation-failed');
          this.year.removeClassName('validation-failed');
  
          this.advice.hide();
          return true;
      },
      validateData: function() {
          var year = this.fullDate.getFullYear();
          return (year>=1900 && year<=this.curyear);
      },
      validateDataErrorType: 'year',
      validateDataErrorText: 'Please enter a valid year (1900-%d).',
      errorTextModifier: function(text) {
          text = Translator.translate(text);
          return text.replace('%d', this.curyear);
      },
      setDateRange: function(minDate, maxDate) {
          this.minDate = minDate;
          this.maxDate = maxDate;
      },
      setFullDate: function(date) {
          this.fullDate = date;
      }
  };
  
  Varien.DOB = Class.create();
  Varien.DOB.prototype = {
      initialize: function(selector, required, format) {
          var el = $$(selector)[0];
          var container       = {};
          container.day       = Element.select(el, '.dob-day input')[0];
          container.month     = Element.select(el, '.dob-month input')[0];
          container.year      = Element.select(el, '.dob-year input')[0];
          container.full      = Element.select(el, '.dob-full input')[0];
          container.advice    = Element.select(el, '.validation-advice')[0];
  
          new Varien.DateElement('container', container, required, format);
      }
  };
  
  Varien.dateRangeDate = Class.create();
  Varien.dateRangeDate.prototype = Object.extend(new Varien.DateElement(), {
      validateData: function() {
          var validate = true;
          if (this.minDate || this.maxValue) {
              if (this.minDate) {
                  this.minDate = new Date(this.minDate);
                  this.minDate.setHours(0);
                  if (isNaN(this.minDate)) {
                      this.minDate = new Date('1/1/1900');
                  }
                  validate = validate && (this.fullDate >= this.minDate);
              }
              if (this.maxDate) {
                  this.maxDate = new Date(this.maxDate);
                  this.minDate.setHours(0);
                  if (isNaN(this.maxDate)) {
                      this.maxDate = new Date();
                  }
                  validate = validate && (this.fullDate <= this.maxDate);
              }
              if (this.maxDate && this.minDate) {
                  this.validateDataErrorText = 'Please enter a valid date between %s and %s';
              } else if (this.maxDate) {
                  this.validateDataErrorText = 'Please enter a valid date less than or equal to %s';
              } else if (this.minDate) {
                  this.validateDataErrorText = 'Please enter a valid date equal to or greater than %s';
              } else {
                  this.validateDataErrorText = '';
              }
          }
          return validate;
      },
      validateDataErrorText: 'Date should be between %s and %s',
      errorTextModifier: function(text) {
          if (this.minDate) {
              text = text.sub('%s', this.dateFormat(this.minDate));
          }
          if (this.maxDate) {
              text = text.sub('%s', this.dateFormat(this.maxDate));
          }
          return text;
      },
      dateFormat: function(date) {
          return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      }
  });
  
  Varien.FileElement = Class.create();
  Varien.FileElement.prototype = {
      initialize: function (id) {
          this.fileElement = $(id);
          this.hiddenElement = $(id + '_value');
  
          this.fileElement.observe('change', this.selectFile.bind(this));
      },
      selectFile: function(event) {
          this.hiddenElement.value = this.fileElement.getValue();
      }
  };
  
  Validation.addAllThese([
      ['validate-custom', ' ', function(v,elm) {
          return elm.validate();
      }]
  ]);
  
  function truncateOptions() {
      $$('.truncated').each(function(element){
          Event.observe(element, 'mouseover', function(){
              if (element.down('div.truncated_full_value')) {
                  element.down('div.truncated_full_value').addClassName('show');
              }
          });
          Event.observe(element, 'mouseout', function(){
              if (element.down('div.truncated_full_value')) {
                  element.down('div.truncated_full_value').removeClassName('show');
              }
          });
  
      });
  }
  Event.observe(window, 'load', function(){
     truncateOptions();
  });
  
  Element.addMethods({
      getInnerText: function(element)
      {
          element = $(element);
          if(element.innerText && !Prototype.Browser.Opera) {
              return element.innerText;
          }
          return element.innerHTML.stripScripts().unescapeHTML().replace(/[\n\r\s]+/g, ' ').strip();
      }
  });
  
 
  function fireEvent(element, event) {
      if (document.createEvent) {
          // dispatch for all browsers except IE before version 9
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent(event, true, true ); // event type, bubbling, cancelable
          return element.dispatchEvent(evt);
      } else {
          // dispatch for IE before version 9
          var evt = document.createEventObject();
          return element.fireEvent('on' + event, evt);
      }
  }
  
  
  function modulo(dividend, divisor)
  {
      var epsilon = divisor / 10000;
      var remainder = dividend % divisor;
  
      if (Math.abs(remainder - divisor) < epsilon || Math.abs(remainder) < epsilon) {
          remainder = 0;
      }
  
      return remainder;
  }
  
  
  if ((typeof Range != "undefined") && !Range.prototype.createContextualFragment)
  {
      Range.prototype.createContextualFragment = function(html)
      {
          var frag = document.createDocumentFragment(),
          div = document.createElement("div");
          frag.appendChild(div);
          div.outerHTML = html;
          return frag;
      };
  }
  
  
  Varien.formCreator = Class.create();
  Varien.formCreator.prototype = {
      initialize : function(url, parametersArray, method) {
          this.url = url;
          this.parametersArray = JSON.parse(parametersArray);
          this.method = method;
          this.form = '';
  
          this.createForm();
          this.setFormData();
      },
      createForm : function() {
          this.form = new Element('form', { 'method': this.method, action: this.url });
      },
      setFormData : function () {
          for (var key in this.parametersArray) {
              Element.insert(
                  this.form,
                  new Element('input', { name: key, value: this.parametersArray[key], type: 'hidden' })
              );
          }
      }
  };
  
  function customFormSubmit(url, parametersArray, method) {
      var createdForm = new Varien.formCreator(url, parametersArray, method);
      Element.insert($$('body')[0], createdForm.form);
      createdForm.form.submit();
  }
  
  function customFormSubmitToParent(url, parametersArray, method) {
      new Ajax.Request(url, {
          method: method,
          parameters: JSON.parse(parametersArray),
          onSuccess: function (response) {
              var node = document.createElement('div');
              node.innerHTML = response.responseText;
              var responseMessage = node.getElementsByClassName('messages')[0];
              var pageTitle = window.document.body.getElementsByClassName('page-title')[0];
              pageTitle.insertAdjacentHTML('afterend', responseMessage.outerHTML);
              window.opener.focus();
              window.opener.location.href = response.transport.responseURL;
          }
      });
  }
  
  function buttonDisabler() {
      const buttons = document.querySelectorAll('button.save');
      buttons.forEach(button => button.disabled = true);
  }
  
  
  VarienForm = Class.create();
  VarienForm.prototype = {
      initialize: function(formId, firstFieldFocus){
          this.form       = $(formId);
          if (!this.form) {
              return;
          }
          this.cache      = $A();
          this.currLoader = false;
          this.currDataIndex = false;
          this.validator  = new Validation(this.form);
          this.elementFocus   = this.elementOnFocus.bindAsEventListener(this);
          this.elementBlur    = this.elementOnBlur.bindAsEventListener(this);
          this.childLoader    = this.onChangeChildLoad.bindAsEventListener(this);
          this.highlightClass = 'highlight';
          this.extraChildParams = '';
          this.firstFieldFocus= firstFieldFocus || false;
          this.bindElements();
          if(this.firstFieldFocus){
              try{
                  Form.Element.focus(Form.findFirstElement(this.form));
              }
              catch(e){}
          }
      },
  
      submit : function(url){
          if(this.validator && this.validator.validate()){
               this.form.submit();
          }
          return false;
      },
  
      bindElements:function (){
          var elements = Form.getElements(this.form);
          for (var row in elements) {
              if (elements[row].id) {
                  Event.observe(elements[row],'focus',this.elementFocus);
                  Event.observe(elements[row],'blur',this.elementBlur);
              }
          }
      },
  
      elementOnFocus: function(event){
          var element = Event.findElement(event, 'fieldset');
          if(element){
              Element.addClassName(element, this.highlightClass);
          }
      },
  
      elementOnBlur: function(event){
          var element = Event.findElement(event, 'fieldset');
          if(element){
              Element.removeClassName(element, this.highlightClass);
          }
      },
  
      setElementsRelation: function(parent, child, dataUrl, first){
          if (parent=$(parent)) {
              // TODO: array of relation and caching
              if (!this.cache[parent.id]){
                  this.cache[parent.id] = $A();
                  this.cache[parent.id]['child']     = child;
                  this.cache[parent.id]['dataUrl']   = dataUrl;
                  this.cache[parent.id]['data']      = $A();
                  this.cache[parent.id]['first']      = first || false;
              }
              Event.observe(parent,'change',this.childLoader);
          }
      },
  
      onChangeChildLoad: function(event){
          element = Event.element(event);
          this.elementChildLoad(element);
      },
  
      elementChildLoad: function(element, callback){
          this.callback = callback || false;
          if (element.value) {
              this.currLoader = element.id;
              this.currDataIndex = element.value;
              if (this.cache[element.id]['data'][element.value]) {
                  this.setDataToChild(this.cache[element.id]['data'][element.value]);
              }
              else{
                  new Ajax.Request(this.cache[this.currLoader]['dataUrl'],{
                          method: 'post',
                          parameters: {"parent":element.value},
                          onComplete: this.reloadChildren.bind(this)
                  });
              }
          }
      },
  
      reloadChildren: function(transport){
          var data = transport.responseJSON || transport.responseText.evalJSON(true) || {};
          this.cache[this.currLoader]['data'][this.currDataIndex] = data;
          this.setDataToChild(data);
      },
  
      setDataToChild: function(data){
          if (data.length) {
              var child = $(this.cache[this.currLoader]['child']);
              if (child){
                  var html = '<select name="'+child.name+'" id="'+child.id+'" class="'+child.className+'" title="'+child.title+'" '+this.extraChildParams+'>';
                  if(this.cache[this.currLoader]['first']){
                      html+= '<option value="">'+this.cache[this.currLoader]['first']+'</option>';
                  }
                  for (var i in data){
                      if(data[i].value) {
                          html+= '<option value="'+data[i].value+'"';
                          if(child.value && (child.value == data[i].value || child.value == data[i].label)){
                              html+= ' selected';
                          }
                          html+='>'+data[i].label+'</option>';
                      }
                  }
                  html+= '</select>';
                  Element.insert(child, {before: html});
                  Element.remove(child);
              }
          }
          else{
              var child = $(this.cache[this.currLoader]['child']);
              if (child){
                  var html = '<input type="text" name="'+child.name+'" id="'+child.id+'" class="'+child.className+'" title="'+child.title+'" '+this.extraChildParams+'>';
                  Element.insert(child, {before: html});
                  Element.remove(child);
              }
          }
  
          this.bindElements();
          if (this.callback) {
              this.callback();
          }
      }
  };
  
  RegionUpdater = Class.create();
  RegionUpdater.prototype = {
      initialize: function (countryEl, regionTextEl, regionSelectEl, regions, disableAction, zipEl)
      {
          this.countryEl = $(countryEl);
          this.regionTextEl = $(regionTextEl);
          this.regionSelectEl = $(regionSelectEl);
          this.zipEl = $(zipEl);
          this.config = regions['config'];
          delete regions.config;
          this.regions = regions;
  
          this.disableAction = (typeof disableAction=='undefined') ? 'hide' : disableAction;
          this.zipOptions = (typeof zipOptions=='undefined') ? false : zipOptions;
  
          if (this.regionSelectEl.options.length<=1) {
              this.update();
          }
  
          Event.observe(this.countryEl, 'change', this.update.bind(this));
      },
  
      _checkRegionRequired: function()
      {
          var label, wildCard;
          var elements = [this.regionTextEl, this.regionSelectEl];
          var that = this;
          if (typeof this.config == 'undefined') {
              return;
          }
          var regionRequired = this.config.regions_required.indexOf(this.countryEl.value) >= 0;
  
          elements.each(function(currentElement) {
              Validation.reset(currentElement);
              label = $$('label[for="' + currentElement.id + '"]')[0];
              if (label) {
                  wildCard = label.down('em') || label.down('span.required');
                  if (!that.config.show_all_regions) {
                      if (regionRequired) {
                          label.up().show();
                      } else {
                          label.up().hide();
                      }
                  }
              }
  
              if (label && wildCard) {
                  if (!regionRequired) {
                      wildCard.hide();
                      if (label.hasClassName('required')) {
                          label.removeClassName('required');
                      }
                  } else if (regionRequired) {
                      wildCard.show();
                      if (!label.hasClassName('required')) {
                          label.addClassName('required');
                      }
                  }
              }
  
              if (!regionRequired) {
                  if (currentElement.hasClassName('required-entry')) {
                      currentElement.removeClassName('required-entry');
                  }
                  if ('select' == currentElement.tagName.toLowerCase() &&
                      currentElement.hasClassName('validate-select')) {
                      currentElement.removeClassName('validate-select');
                  }
              } else {
                  if (!currentElement.hasClassName('required-entry')) {
                      currentElement.addClassName('required-entry');
                  }
                  if ('select' == currentElement.tagName.toLowerCase() &&
                      !currentElement.hasClassName('validate-select')) {
                      currentElement.addClassName('validate-select');
                  }
              }
          });
      },
  
      update: function()
      {
          if (this.regions[this.countryEl.value]) {
              var i, option, region, def;
  
              def = this.regionSelectEl.getAttribute('defaultValue');
              if (this.regionTextEl) {
                  if (!def) {
                      def = this.regionTextEl.value.toLowerCase();
                  }
                  this.regionTextEl.value = '';
              }
  
              this.regionSelectEl.options.length = 1;
              for (regionId in this.regions[this.countryEl.value]) {
                  region = this.regions[this.countryEl.value][regionId];
  
                  option = document.createElement('OPTION');
                  option.value = regionId;
                  option.text = region.name.stripTags();
                  option.title = region.name;
  
                  if (this.regionSelectEl.options.add) {
                      this.regionSelectEl.options.add(option);
                  } else {
                      this.regionSelectEl.appendChild(option);
                  }
  
                  if (regionId == def || (region.name && region.name.toLowerCase() == def)
                      || (region.name && region.code.toLowerCase() == def)
                  ) {
                      this.regionSelectEl.value = regionId;
                  }
              }
              this.sortSelect();
              if (this.disableAction == 'hide') {
                  if (this.regionTextEl) {
                      this.regionTextEl.style.display = 'none';
                  }
  
                  this.regionSelectEl.style.display = '';
              } else if (this.disableAction == 'disable') {
                  if (this.regionTextEl) {
                      this.regionTextEl.disabled = true;
                  }
                  this.regionSelectEl.disabled = false;
              }
              this.setMarkDisplay(this.regionSelectEl, true);
          } else {
              this.regionSelectEl.options.length = 1;
              this.sortSelect();
              if (this.disableAction == 'hide') {
                  if (this.regionTextEl) {
                      this.regionTextEl.style.display = '';
                  }
                  this.regionSelectEl.style.display = 'none';
                  Validation.reset(this.regionSelectEl);
              } else if (this.disableAction == 'disable') {
                  if (this.regionTextEl) {
                      this.regionTextEl.disabled = false;
                  }
                  this.regionSelectEl.disabled = true;
              } else if (this.disableAction == 'nullify') {
                  this.regionSelectEl.options.length = 1;
                  this.regionSelectEl.value = '';
                  this.regionSelectEl.selectedIndex = 0;
                  this.lastCountryId = '';
              }
              this.setMarkDisplay(this.regionSelectEl, false);
          }
  
          this._checkRegionRequired();
          // Make Zip and its label required/optional
          var zipUpdater = new ZipUpdater(this.countryEl.value, this.zipEl);
          zipUpdater.update();
      },
  
      setMarkDisplay: function(elem, display){
          elem = $(elem);
          var labelElement = elem.up(0).down('label > span.required') ||
                             elem.up(1).down('label > span.required') ||
                             elem.up(0).down('label.required > em') ||
                             elem.up(1).down('label.required > em');
          if(labelElement) {
              inputElement = labelElement.up().next('input');
              if (display) {
                  labelElement.show();
                  if (inputElement) {
                      inputElement.addClassName('required-entry');
                  }
              } else {
                  labelElement.hide();
                  if (inputElement) {
                      inputElement.removeClassName('required-entry');
                  }
              }
          }
      },
      sortSelect : function () {
          var elem = this.regionSelectEl;
          var tmpArray = new Array();
          var currentVal = $(elem).value;
          for (var i = 0; i < $(elem).options.length; i++) {
              if (i == 0) {
                  continue;
              }
              tmpArray[i-1] = new Array();
              tmpArray[i-1][0] = $(elem).options[i].text;
              tmpArray[i-1][1] = $(elem).options[i].value;
          }
          tmpArray.sort();
          for (var i = 1; i <= tmpArray.length; i++) {
              var op = new Option(tmpArray[i-1][0], tmpArray[i-1][1]);
              $(elem).options[i] = op;
          }
          $(elem).value = currentVal;
          return;
      }
  };
  
  ZipUpdater = Class.create();
  ZipUpdater.prototype = {
      initialize: function(country, zipElement)
      {
          this.country = country;
          this.zipElement = $(zipElement);
      },
  
      update: function()
      {
          // Country ISO 2-letter codes must be pre-defined
          if (typeof optionalZipCountries == 'undefined') {
              return false;
          }
  
          // Ajax-request and normal content load compatibility
          if (this.zipElement != undefined) {
              Validation.reset(this.zipElement);
              this._setPostcodeOptional();
          } else {
              Event.observe(window, "load", this._setPostcodeOptional.bind(this));
          }
      },
  
      _setPostcodeOptional: function()
      {
          this.zipElement = $(this.zipElement);
          if (this.zipElement == undefined) {
              return false;
          }
  
          // find label
          var label = $$('label[for="' + this.zipElement.id + '"]')[0];
          if (label != undefined) {
              var wildCard = label.down('em') || label.down('span.required');
          }
  
          // Make Zip and its label required/optional
          if (optionalZipCountries.indexOf(this.country) != -1) {
              while (this.zipElement.hasClassName('required-entry')) {
                  this.zipElement.removeClassName('required-entry');
              }
              if (wildCard != undefined) {
                  wildCard.hide();
              }
          } else {
              this.zipElement.addClassName('required-entry');
              if (wildCard != undefined) {
                  wildCard.show();
              }
          }
      }
  };
  
  
  var Translate = Class.create();
  Translate.prototype = {
      initialize: function(data){
          this.data = $H(data);
      },
  
      translate : function(){
          var args = arguments;
          var text = arguments[0];
  
          if(this.data.get(text)){
              return this.data.get(text);
          }
          return text;
      },
      add : function() {
          if (arguments.length > 1) {
              this.data.set(arguments[0], arguments[1]);
          } else if (typeof arguments[0] =='object') {
              $H(arguments[0]).each(function (pair){
                  this.data.set(pair.key, pair.value);
              }.bind(this));
          }
      }
  };
  
  
  if (!window.Mage) var Mage = {};
  
  Mage.Cookies = {};
  Mage.Cookies.expires  = null;
  Mage.Cookies.path     = '/';
  Mage.Cookies.domain   = null;
  Mage.Cookies.secure   = false;
  Mage.Cookies.set = function(name, value){
       var argv = arguments;
       var argc = arguments.length;
       var expires = (argc > 2) ? argv[2] : Mage.Cookies.expires;
       var path = (argc > 3) ? argv[3] : Mage.Cookies.path;
       var domain = (argc > 4) ? argv[4] : Mage.Cookies.domain;
       var secure = (argc > 5) ? argv[5] : Mage.Cookies.secure;
       document.cookie = name + "=" + escape (value) +
         ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
         ((path == null) ? "" : ("; path=" + path)) +
         ((domain == null) ? "" : ("; domain=" + domain)) +
         ((secure == true) ? "; secure" : "");
  };
  
  Mage.Cookies.get = function(name){
      var arg = name + "=";
      var alen = arg.length;
      var clen = document.cookie.length;
      var i = 0;
      var j = 0;
      while(i < clen){
          j = i + alen;
          if (document.cookie.substring(i, j) == arg)
              return Mage.Cookies.getCookieVal(j);
          i = document.cookie.indexOf(" ", i) + 1;
          if(i == 0)
              break;
      }
      return null;
  };
  
  Mage.Cookies.clear = function(name) {
    if(Mage.Cookies.get(name)){
      document.cookie = name + "=" +
      "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
  };
  
  Mage.Cookies.getCookieVal = function(offset){
     var endstr = document.cookie.indexOf(";", offset);
     if(endstr == -1){
         endstr = document.cookie.length;
     }
     return unescape(document.cookie.substring(offset, endstr));
  };
  
  
  
  function openItauShoplinePopUp()
  {
      
  }
  
  
  var Window = Class.create();
  
  Window.keepMultiModalWindow = false;
  Window.hasEffectLib = (typeof Effect != 'undefined');
  Window.resizeEffectDuration = 0.4;
  
  Window.prototype = {
    
    initialize: function() {
      var id;
      var optionIndex = 0;
      // For backward compatibility like win= new Window("id", {...}) instead of win = new Window({id: "id", ...})
      if (arguments.length > 0) {
        if (typeof arguments[0] == "string" ) {
          id = arguments[0];
          optionIndex = 1;
        }
        else
          id = arguments[0] ? arguments[0].id : null;
      }
      
      // Generate unique ID if not specified
      if (!id)
        id = "window_" + new Date().getTime();
        
      if ($(id))
        alert("Window " + id + " is already registered in the DOM! Make sure you use setDestroyOnClose() or destroyOnClose: true in the constructor");
  
      this.options = Object.extend({
        className:         "dialog",
        windowClassName:   null,
        blurClassName:     null,
        minWidth:          100, 
        minHeight:         20,
        resizable:         true,
        closable:          true,
        minimizable:       true,
        maximizable:       true,
        draggable:         true,
        userData:          null,
        showEffect:        (Window.hasEffectLib ? Effect.Appear : Element.show),
        hideEffect:        (Window.hasEffectLib ? Effect.Fade : Element.hide),
        showEffectOptions: {},
        hideEffectOptions: {},
        effectOptions:     null,
        parent:            document.body,
        title:             "&nbsp;",
        url:               null,
        onload:            Prototype.emptyFunction,
        width:             200,
        height:            300,
        opacity:           1,
        recenterAuto:      true,
        wiredDrag:         false,
        closeOnEsc:        true,
        closeCallback:     null,
        destroyOnClose:    false,
        gridX:             1, 
        gridY:             1      
      }, arguments[optionIndex] || {});
      if (this.options.blurClassName)
        this.options.focusClassName = this.options.className;
        
      if (typeof this.options.top == "undefined" &&  typeof this.options.bottom ==  "undefined") 
        this.options.top = this._round(Math.random()*500, this.options.gridY);
      if (typeof this.options.left == "undefined" &&  typeof this.options.right ==  "undefined") 
        this.options.left = this._round(Math.random()*500, this.options.gridX);
  
      if (this.options.effectOptions) {
        Object.extend(this.options.hideEffectOptions, this.options.effectOptions);
        Object.extend(this.options.showEffectOptions, this.options.effectOptions);
        if (this.options.showEffect == Element.Appear)
          this.options.showEffectOptions.to = this.options.opacity;
      }
      if (Window.hasEffectLib) {
        if (this.options.showEffect == Effect.Appear)
          this.options.showEffectOptions.to = this.options.opacity;
      
        if (this.options.hideEffect == Effect.Fade)
          this.options.hideEffectOptions.from = this.options.opacity;
      }
      if (this.options.hideEffect == Element.hide)
        this.options.hideEffect = function(){ Element.hide(this.element); if (this.options.destroyOnClose) this.destroy(); }.bind(this)
      
      if (this.options.parent != document.body)  
        this.options.parent = $(this.options.parent);
        
      this.element = this._createWindow(id);       
      this.element.win = this;
      
      // Bind event listener
      this.eventMouseDown = this._initDrag.bindAsEventListener(this);
      this.eventMouseUp   = this._endDrag.bindAsEventListener(this);
      this.eventMouseMove = this._updateDrag.bindAsEventListener(this);
      this.eventOnLoad    = this._getWindowBorderSize.bindAsEventListener(this);
      this.eventMouseDownContent = this.toFront.bindAsEventListener(this);
      this.eventResize = this._recenter.bindAsEventListener(this);
      this.eventKeyUp = this._keyUp.bindAsEventListener(this);
   
      this.topbar = $(this.element.id + "_top");
      this.bottombar = $(this.element.id + "_bottom");
      this.content = $(this.element.id + "_content");
      
      Event.observe(this.topbar, "mousedown", this.eventMouseDown);
      Event.observe(this.bottombar, "mousedown", this.eventMouseDown);
      Event.observe(this.content, "mousedown", this.eventMouseDownContent);
      Event.observe(window, "load", this.eventOnLoad);
      Event.observe(window, "resize", this.eventResize);
      Event.observe(window, "scroll", this.eventResize);
      Event.observe(document, "keyup", this.eventKeyUp);
      Event.observe(this.options.parent, "scroll", this.eventResize);
      
      if (this.options.draggable)  {
        var that = this;
        [this.topbar, this.topbar.up().previous(), this.topbar.up().next()].each(function(element) {
          element.observe("mousedown", that.eventMouseDown);
          element.addClassName("top_draggable");
        });
        [this.bottombar.up(), this.bottombar.up().previous(), this.bottombar.up().next()].each(function(element) {
          element.observe("mousedown", that.eventMouseDown);
          element.addClassName("bottom_draggable");
        });
        
      }    
      
      if (this.options.resizable) {
        this.sizer = $(this.element.id + "_sizer");
        Event.observe(this.sizer, "mousedown", this.eventMouseDown);
      }  
      
      this.useLeft = null;
      this.useTop = null;
      if (typeof this.options.left != "undefined") {
        this.element.setStyle({left: parseFloat(this.options.left) + 'px'});
        this.useLeft = true;
      }
      else {
        this.element.setStyle({right: parseFloat(this.options.right) + 'px'});
        this.useLeft = false;
      }
      
      if (typeof this.options.top != "undefined") {
        this.element.setStyle({top: parseFloat(this.options.top) + 'px'});
        this.useTop = true;
      }
      else {
        this.element.setStyle({bottom: parseFloat(this.options.bottom) + 'px'});      
        this.useTop = false;
      }
        
      this.storedLocation = null;
      
      this.setOpacity(this.options.opacity);
      if (this.options.zIndex)
        this.setZIndex(this.options.zIndex)
  
      if (this.options.destroyOnClose)
        this.setDestroyOnClose(true);
  
      this._getWindowBorderSize();
      this.width = this.options.width;
      this.height = this.options.height;
      this.visible = false;
      
      this.constraint = false;
      this.constraintPad = {top: 0, left:0, bottom:0, right:0};
      
      if (this.width && this.height)
        this.setSize(this.options.width, this.options.height);
      this.setTitle(this.options.title)
      Windows.register(this);      
    },
    
    // Destructor
    destroy: function() {
      this._notify("onDestroy");
      Event.stopObserving(this.topbar, "mousedown", this.eventMouseDown);
      Event.stopObserving(this.bottombar, "mousedown", this.eventMouseDown);
      Event.stopObserving(this.content, "mousedown", this.eventMouseDownContent);
      
      Event.stopObserving(window, "load", this.eventOnLoad);
      Event.stopObserving(window, "resize", this.eventResize);
      Event.stopObserving(window, "scroll", this.eventResize);
      
      Event.stopObserving(this.content, "load", this.options.onload);
      Event.stopObserving(document, "keyup", this.eventKeyUp);
  
      if (this._oldParent) {
        var content = this.getContent();
        var originalContent = null;
        for(var i = 0; i < content.childNodes.length; i++) {
          originalContent = content.childNodes[i];
          if (originalContent.nodeType == 1) 
            break;
          originalContent = null;
        }
        if (originalContent)
          this._oldParent.appendChild(originalContent);
        this._oldParent = null;
      }
  
      if (this.sizer)
          Event.stopObserving(this.sizer, "mousedown", this.eventMouseDown);
  
      if (this.options.url) 
        this.content.src = null
  
       if(this.iefix) 
        Element.remove(this.iefix);
  
      Element.remove(this.element);
      Windows.unregister(this);      
    },
      
    // Sets close callback, if it sets, it should return true to be able to close the window.
    setCloseCallback: function(callback) {
      this.options.closeCallback = callback;
    },
    
    // Gets window content
    getContent: function () {
      return this.content;
    },
    
    // Sets the content with an element id
    setContent: function(id, autoresize, autoposition) {
      var element = $(id);
      if (null == element) throw "Unable to find element '" + id + "' in DOM";
      this._oldParent = element.parentNode;
  
      var d = null;
      var p = null;
  
      if (autoresize) 
        d = Element.getDimensions(element);
      if (autoposition) 
        p = Position.cumulativeOffset(element);
  
      var content = this.getContent();
      // Clear HTML (and even iframe)
      this.setHTMLContent("");
      content = this.getContent();
      
      content.appendChild(element);
      element.show();
      if (autoresize) 
        this.setSize(d.width, d.height);
      if (autoposition) 
        this.setLocation(p[1] - this.heightN, p[0] - this.widthW);    
    },
    
    setHTMLContent: function(html) {
      // It was an url (iframe), recreate a div content instead of iframe content
      if (this.options.url) {
        this.content.src = null;
        this.options.url = null;
        
          var content ="<div id=\"" + this.getId() + "_content\" class=\"" + this.options.className + "_content\"> </div>";
        $(this.getId() +"_table_content").innerHTML = content;
        
        this.content = $(this.element.id + "_content");
      }
        
      this.getContent().innerHTML = html;
    },
    
    setAjaxContent: function(url, options, showCentered, showModal) {
      this.showFunction = showCentered ? "showCenter" : "show";
      this.showModal = showModal || false;
    
      options = options || {};
  
      // Clear HTML (and even iframe)
      this.setHTMLContent("");
   
      this.onComplete = options.onComplete;
      if (! this._onCompleteHandler)
        this._onCompleteHandler = this._setAjaxContent.bind(this);
      options.onComplete = this._onCompleteHandler;
  
      new Ajax.Request(url, options);    
      options.onComplete = this.onComplete;
    },
    
    _setAjaxContent: function(originalRequest) {
      Element.update(this.getContent(), originalRequest.responseText);
      if (this.onComplete)
        this.onComplete(originalRequest);
      this.onComplete = null;
      this[this.showFunction](this.showModal)
    },
    
    setURL: function(url) {
      // Not an url content, change div to iframe
      if (this.options.url) 
        this.content.src = null;
      this.options.url = url;
      var content= "<iframe frameborder='0' name='" + this.getId() + "_content'  id='" + this.getId() + "_content' src='" + url + "' width='" + this.width + "' height='" + this.height + "'> </iframe>";
      $(this.getId() +"_table_content").innerHTML = content;
      
      this.content = $(this.element.id + "_content");
    },
  
    getURL: function() {
        return this.options.url ? this.options.url : null;
    },
  
    refresh: function() {
      if (this.options.url)
          $(this.element.getAttribute('id') + '_content').src = this.options.url;
    },
    
    // Stores position/size in a cookie, by default named with window id
    setCookie: function(name, expires, path, domain, secure) {
      name = name || this.element.id;
      this.cookie = [name, expires, path, domain, secure];
      
      // Get cookie
      var value = WindowUtilities.getCookie(name)
      // If exists
      if (value) {
        var values = value.split(',');
        var x = values[0].split(':');
        var y = values[1].split(':');
  
        var w = parseFloat(values[2]), h = parseFloat(values[3]);
        var mini = values[4];
        var maxi = values[5];
  
        this.setSize(w, h);
        if (mini == "true")
          this.doMinimize = true; // Minimize will be done at onload window event
        else if (maxi == "true")
          this.doMaximize = true; // Maximize will be done at onload window event
  
        this.useLeft = x[0] == "l";
        this.useTop = y[0] == "t";
  
        this.element.setStyle(this.useLeft ? {left: x[1]} : {right: x[1]});
        this.element.setStyle(this.useTop ? {top: y[1]} : {bottom: y[1]});
      }
    },
    
    // Gets window ID
    getId: function() {
      return this.element.id;
    },
    
    // Detroys itself when closing 
    setDestroyOnClose: function() {
      this.options.destroyOnClose = true;
    },
    
    setConstraint: function(bool, padding) {
      this.constraint = bool;
      this.constraintPad = Object.extend(this.constraintPad, padding || {});
      // Reset location to apply constraint
      if (this.useTop && this.useLeft)
        this.setLocation(parseFloat(this.element.style.top), parseFloat(this.element.style.left));
    },
    
    // initDrag event
  
    _initDrag: function(event) {
      // No resize on minimized window
      if (Event.element(event) == this.sizer && this.isMinimized())
        return;
  
      // No move on maximzed window
      if (Event.element(event) != this.sizer && this.isMaximized())
        return;
        
      if (Prototype.Browser.IE && this.heightN == 0)
        this._getWindowBorderSize();
      
      // Get pointer X,Y
      this.pointer = [this._round(Event.pointerX(event), this.options.gridX), this._round(Event.pointerY(event), this.options.gridY)];
      if (this.options.wiredDrag) 
        this.currentDrag = this._createWiredElement();
      else
        this.currentDrag = this.element;
        
      // Resize
      if (Event.element(event) == this.sizer) {
        this.doResize = true;
        this.widthOrg = this.width;
        this.heightOrg = this.height;
        this.bottomOrg = parseFloat(this.element.getStyle('bottom'));
        this.rightOrg = parseFloat(this.element.getStyle('right'));
        this._notify("onStartResize");
      }
      else {
        this.doResize = false;
  
        // Check if click on close button, 
        var closeButton = $(this.getId() + '_close');
        if (closeButton && Position.within(closeButton, this.pointer[0], this.pointer[1])) {
          this.currentDrag = null;
          return;
        }
  
        this.toFront();
  
        if (! this.options.draggable) 
          return;
        this._notify("onStartMove");
      }    
      // Register global event to capture mouseUp and mouseMove
      Event.observe(document, "mouseup", this.eventMouseUp, false);
      Event.observe(document, "mousemove", this.eventMouseMove, false);
      
      // Add an invisible div to keep catching mouse event over iframes
      WindowUtilities.disableScreen('__invisible__', '__invisible__', this.overlayOpacity);
  
      // Stop selection while dragging
      document.body.ondrag = function () { return false; };
      document.body.onselectstart = function () { return false; };
      
      this.currentDrag.show();
      Event.stop(event);
    },
    
    _round: function(val, round) {
      return round == 1 ? val  : val = Math.floor(val / round) * round;
    },
  
    // updateDrag event
    _updateDrag: function(event) {
      var pointer =  [this._round(Event.pointerX(event), this.options.gridX), this._round(Event.pointerY(event), this.options.gridY)];  
      var dx = pointer[0] - this.pointer[0];
      var dy = pointer[1] - this.pointer[1];
      
      // Resize case, update width/height
      if (this.doResize) {
        var w = this.widthOrg + dx;
        var h = this.heightOrg + dy;
        
        dx = this.width - this.widthOrg
        dy = this.height - this.heightOrg
        
        // Check if it's a right position, update it to keep upper-left corner at the same position
        if (this.useLeft) 
          w = this._updateWidthConstraint(w)
        else 
          this.currentDrag.setStyle({right: (this.rightOrg -dx) + 'px'});
        // Check if it's a bottom position, update it to keep upper-left corner at the same position
        if (this.useTop) 
          h = this._updateHeightConstraint(h)
        else
          this.currentDrag.setStyle({bottom: (this.bottomOrg -dy) + 'px'});
          
        this.setSize(w , h);
        this._notify("onResize");
      }
      // Move case, update top/left
      else {
        this.pointer = pointer;
        
        if (this.useLeft) {
          var left =  parseFloat(this.currentDrag.getStyle('left')) + dx;
          var newLeft = this._updateLeftConstraint(left);
          // Keep mouse pointer correct
          this.pointer[0] += newLeft-left;
          this.currentDrag.setStyle({left: newLeft + 'px'});
        }
        else 
          this.currentDrag.setStyle({right: parseFloat(this.currentDrag.getStyle('right')) - dx + 'px'});
        
        if (this.useTop) {
          var top =  parseFloat(this.currentDrag.getStyle('top')) + dy;
          var newTop = this._updateTopConstraint(top);
          // Keep mouse pointer correct
          this.pointer[1] += newTop - top;
          this.currentDrag.setStyle({top: newTop + 'px'});
        }
        else 
          this.currentDrag.setStyle({bottom: parseFloat(this.currentDrag.getStyle('bottom')) - dy + 'px'});
  
        this._notify("onMove");
      }
      if (this.iefix) 
        this._fixIEOverlapping(); 
        
      this._removeStoreLocation();
      Event.stop(event);
    },
  
     // endDrag callback
     _endDrag: function(event) {
      // Remove temporary div over iframes
       WindowUtilities.enableScreen('__invisible__');
      
      if (this.doResize)
        this._notify("onEndResize");
      else
        this._notify("onEndMove");
      
      // Release event observing
      Event.stopObserving(document, "mouseup", this.eventMouseUp,false);
      Event.stopObserving(document, "mousemove", this.eventMouseMove, false);
  
      Event.stop(event);
      
      this._hideWiredElement();
  
      // Store new location/size if need be
      this._saveCookie()
        
      // Restore selection
      document.body.ondrag = null;
      document.body.onselectstart = null;
    },
  
    _updateLeftConstraint: function(left) {
      if (this.constraint && this.useLeft && this.useTop) {
        var width = this.options.parent == document.body ? WindowUtilities.getPageSize().windowWidth : this.options.parent.getDimensions().width;
  
        if (left < this.constraintPad.left)
          left = this.constraintPad.left;
        if (left + this.width + this.widthE + this.widthW > width - this.constraintPad.right) 
          left = width - this.constraintPad.right - this.width - this.widthE - this.widthW;
      }
      return left;
    },
    
    _updateTopConstraint: function(top) {
      if (this.constraint && this.useLeft && this.useTop) {        
        var height = this.options.parent == document.body ? WindowUtilities.getPageSize().windowHeight : this.options.parent.getDimensions().height;
        
        var h = this.height + this.heightN + this.heightS;
  
        if (top < this.constraintPad.top)
          top = this.constraintPad.top;
        if (top + h > height - this.constraintPad.bottom) 
          top = height - this.constraintPad.bottom - h;
      }
      return top;
    },
    
    _updateWidthConstraint: function(w) {
      if (this.constraint && this.useLeft && this.useTop) {
        var width = this.options.parent == document.body ? WindowUtilities.getPageSize().windowWidth : this.options.parent.getDimensions().width;
        var left =  parseFloat(this.element.getStyle("left"));
  
        if (left + w + this.widthE + this.widthW > width - this.constraintPad.right) 
          w = width - this.constraintPad.right - left - this.widthE - this.widthW;
      }
      return w;
    },
    
    _updateHeightConstraint: function(h) {
      if (this.constraint && this.useLeft && this.useTop) {
        var height = this.options.parent == document.body ? WindowUtilities.getPageSize().windowHeight : this.options.parent.getDimensions().height;
        var top =  parseFloat(this.element.getStyle("top"));
  
        if (top + h + this.heightN + this.heightS > height - this.constraintPad.bottom) 
          h = height - this.constraintPad.bottom - top - this.heightN - this.heightS;
      }
      return h;
    },
    
    
    // Creates HTML window code
    _createWindow: function(id) {
      var className = this.options.className;
      var win = document.createElement("div");
      win.setAttribute('id', id);
      win.className = "dialog";
      if (this.options.windowClassName) {
        win.className += ' ' + this.options.windowClassName;
      }
  
      var content;
      if (this.options.url)
        content= "<iframe frameborder=\"0\" name=\"" + id + "_content\"  id=\"" + id + "_content\" src=\"" + this.options.url + "\"> </iframe>";
      else
        content ="<div id=\"" + id + "_content\" class=\"" +className + "_content\"> </div>";
  
      var closeDiv = this.options.closable ? "<div class='"+ className +"_close' id='"+ id +"_close' onclick='Windows.close(\""+ id +"\", event)'> </div>" : "";
      var minDiv = this.options.minimizable ? "<div class='"+ className + "_minimize' id='"+ id +"_minimize' onclick='Windows.minimize(\""+ id +"\", event)'> </div>" : "";
      var maxDiv = this.options.maximizable ? "<div class='"+ className + "_maximize' id='"+ id +"_maximize' onclick='Windows.maximize(\""+ id +"\", event)'> </div>" : "";
      var seAttributes = this.options.resizable ? "class='" + className + "_sizer' id='" + id + "_sizer'" : "class='"  + className + "_se'";
      var blank = "../themes/default/blank.gif";
      
      win.innerHTML = closeDiv + minDiv + maxDiv + "\
        <a href='#' id='"+ id +"_focus_anchor'><!-- --></a>\
        <table id='"+ id +"_row1' class=\"top table_window\">\
          <tr>\
            <td class='"+ className +"_nw'></td>\
            <td class='"+ className +"_n'><div id='"+ id +"_top' class='"+ className +"_title title_window'>"+ this.options.title +"</div></td>\
            <td class='"+ className +"_ne'></td>\
          </tr>\
        </table>\
        <table id='"+ id +"_row2' class=\"mid table_window\">\
          <tr>\
            <td class='"+ className +"_w'></td>\
              <td id='"+ id +"_table_content' class='"+ className +"_content' valign='top'>" + content + "</td>\
            <td class='"+ className +"_e'></td>\
          </tr>\
        </table>\
          <table id='"+ id +"_row3' class=\"bot table_window\">\
          <tr>\
            <td class='"+ className +"_sw'></td>\
              <td class='"+ className +"_s'><div id='"+ id +"_bottom' class='status_bar'><span style='float:left; width:1px; height:1px'></span></div></td>\
              <td " + seAttributes + "></td>\
          </tr>\
        </table>\
      ";
      Element.hide(win);
      this.options.parent.insertBefore(win, this.options.parent.firstChild);
      Event.observe($(id + "_content"), "load", this.options.onload);
      return win;
    },
    
    
    changeClassName: function(newClassName) {    
      var className = this.options.className;
      var id = this.getId();
      $A(["_close", "_minimize", "_maximize", "_sizer", "_content"]).each(function(value) { this._toggleClassName($(id + value), className + value, newClassName + value) }.bind(this));
      this._toggleClassName($(id + "_top"), className + "_title", newClassName + "_title");
      $$("#" + id + " td").each(function(td) {td.className = td.className.sub(className,newClassName); });
      this.options.className = newClassName;
    },
    
    _toggleClassName: function(element, oldClassName, newClassName) { 
      if (element) {
        element.removeClassName(oldClassName);
        element.addClassName(newClassName);
      }
    },
    
    // Sets window location
    setLocation: function(top, left) {
      top = this._updateTopConstraint(top);
      left = this._updateLeftConstraint(left);
  
      var e = this.currentDrag || this.element;
      e.setStyle({top: top + 'px'});
      e.setStyle({left: left + 'px'});
  
      this.useLeft = true;
      this.useTop = true;
    },
      
    getLocation: function() {
      var location = {};
      if (this.useTop)
        location = Object.extend(location, {top: this.element.getStyle("top")});
      else
        location = Object.extend(location, {bottom: this.element.getStyle("bottom")});
      if (this.useLeft)
        location = Object.extend(location, {left: this.element.getStyle("left")});
      else
        location = Object.extend(location, {right: this.element.getStyle("right")});
      
      return location;
    },
    
    // Gets window size
    getSize: function() {
      return {width: this.width, height: this.height};
    },
      
    // Sets window size
    setSize: function(width, height, useEffect) {    
      width = parseFloat(width);
      height = parseFloat(height);
      
      // Check min and max size
      if (!this.minimized && width < this.options.minWidth)
        width = this.options.minWidth;
  
      if (!this.minimized && height < this.options.minHeight)
        height = this.options.minHeight;
        
      if (this.options. maxHeight && height > this.options. maxHeight)
        height = this.options. maxHeight;
  
      if (this.options. maxWidth && width > this.options. maxWidth)
        width = this.options. maxWidth;
  
      
      if (this.useTop && this.useLeft && Window.hasEffectLib && Effect.ResizeWindow && useEffect) {
        new Effect.ResizeWindow(this, null, null, width, height, {duration: Window.resizeEffectDuration});
      } else {
        this.width = width;
        this.height = height;
        var e = this.currentDrag ? this.currentDrag : this.element;
  
        e.setStyle({width: width + this.widthW + this.widthE + "px"})
        e.setStyle({height: height  + this.heightN + this.heightS + "px"})
  
        // Update content size
        if (!this.currentDrag || this.currentDrag == this.element) {
          var content = $(this.element.id + '_content');
          content.setStyle({height: height  + 'px'});
          content.setStyle({width: width  + 'px'});
        }
      }
    },
    
    updateHeight: function() {
      this.setSize(this.width, this.content.scrollHeight, true);
    },
    
    updateWidth: function() {
      this.setSize(this.content.scrollWidth, this.height, true);
    },
    
    // Brings window to front
    toFront: function() {
      if (this.element.style.zIndex < Windows.maxZIndex)  
        this.setZIndex(Windows.maxZIndex + 1);
      if (this.iefix) 
        this._fixIEOverlapping(); 
    },
     
    getBounds: function(insideOnly) {
      if (! this.width || !this.height || !this.visible)  
        this.computeBounds();
      var w = this.width;
      var h = this.height;
  
      if (!insideOnly) {
        w += this.widthW + this.widthE;
        h += this.heightN + this.heightS;
      }
      var bounds = Object.extend(this.getLocation(), {width: w + "px", height: h + "px"});
      return bounds;
    },
        
    computeBounds: function() {
       if (! this.width || !this.height) {
        var size = WindowUtilities._computeSize(this.content.innerHTML, this.content.id, this.width, this.height, 0, this.options.className)
        if (this.height)
          this.width = size + 5
        else
          this.height = size + 5
      }
  
      this.setSize(this.width, this.height);
      if (this.centered)
        this._center(this.centerTop, this.centerLeft);    
    },
    
    // Displays window modal state or not
    show: function(modal) {
      this.visible = true;
      if (modal) {
        // Hack for Safari !!
        if (typeof this.overlayOpacity == "undefined") {
          var that = this;
          setTimeout(function() {that.show(modal)}, 10);
          return;
        }
        Windows.addModalWindow(this);
        
        this.modal = true;      
        this.setZIndex(Windows.maxZIndex + 1);
        Windows.unsetOverflow(this);
      }
      else    
        if (!this.element.style.zIndex) 
          this.setZIndex(Windows.maxZIndex + 1);        
        
      // To restore overflow if need be
      if (this.oldStyle)
        this.getContent().setStyle({overflow: this.oldStyle});
        
      this.computeBounds();
      
      this._notify("onBeforeShow");   
      if (this.options.showEffect != Element.show && this.options.showEffectOptions)
        this.options.showEffect(this.element, this.options.showEffectOptions);  
      else
        this.options.showEffect(this.element);  
        
      this._checkIEOverlapping();
      WindowUtilities.focusedWindow = this
      this._notify("onShow");   
      $(this.element.id + '_focus_anchor').focus();
    },
    
    // Displays window modal state or not at the center of the page
    showCenter: function(modal, top, left) {
      this.centered = true;
      this.centerTop = top;
      this.centerLeft = left;
  
      this.show(modal);
    },
    
    isVisible: function() {
      return this.visible;
    },
    
    _center: function(top, left) {    
      var windowScroll = WindowUtilities.getWindowScroll(this.options.parent);    
      var pageSize = WindowUtilities.getPageSize(this.options.parent);    
      if (typeof top == "undefined")
        top = (pageSize.windowHeight - (this.height + this.heightN + this.heightS))/2;
      top += windowScroll.top
      
      if (typeof left == "undefined")
        left = (pageSize.windowWidth - (this.width + this.widthW + this.widthE))/2;
      left += windowScroll.left      
      this.setLocation(top, left);
      this.toFront();
    },
    
    _recenter: function(event) {     
      if (this.centered) {
        var pageSize = WindowUtilities.getPageSize(this.options.parent);
        var windowScroll = WindowUtilities.getWindowScroll(this.options.parent);    
  
        // Check for this stupid IE that sends dumb events
        if (this.pageSize && this.pageSize.windowWidth == pageSize.windowWidth && this.pageSize.windowHeight == pageSize.windowHeight && 
            this.windowScroll.left == windowScroll.left && this.windowScroll.top == windowScroll.top) 
          return;
        this.pageSize = pageSize;
        this.windowScroll = windowScroll;
        // set height of Overlay to take up whole page and show
        if ($('overlay_modal')) 
          $('overlay_modal').setStyle({height: (pageSize.pageHeight + 'px')});
        
        if (this.options.recenterAuto)
          this._center(this.centerTop, this.centerLeft);    
      }
    },
    
    // Hides window
    hide: function() {
      this.visible = false;
      if (this.modal) {
        Windows.removeModalWindow(this);
        Windows.resetOverflow();
      }
      // To avoid bug on scrolling bar
      this.oldStyle = this.getContent().getStyle('overflow') || "auto"
      this.getContent().setStyle({overflow: "hidden"});
  
      this.options.hideEffect(this.element, this.options.hideEffectOptions);  
  
       if(this.iefix) 
        this.iefix.hide();
  
      if (!this.doNotNotifyHide)
        this._notify("onHide");
    },
  
    close: function() {
      // Asks closeCallback if exists
      if (this.visible) {
        if (this.options.closeCallback && ! this.options.closeCallback(this)) 
          return;
  
        if (this.options.destroyOnClose) {
          var destroyFunc = this.destroy.bind(this);
          if (this.options.hideEffectOptions.afterFinish) {
            var func = this.options.hideEffectOptions.afterFinish;
            this.options.hideEffectOptions.afterFinish = function() {func();destroyFunc() }
          }
          else 
            this.options.hideEffectOptions.afterFinish = function() {destroyFunc() }
        }
        Windows.updateFocusedWindow();
        
        this.doNotNotifyHide = true;
        this.hide();
        this.doNotNotifyHide = false;
        this._notify("onClose");
      }
    },
    
    minimize: function() {
      if (this.resizing)
        return;
      
      var r2 = $(this.getId() + "_row2");
      
      if (!this.minimized) {
        this.minimized = true;
  
        var dh = r2.getDimensions().height;
        this.r2Height = dh;
        var h  = this.element.getHeight() - dh;
  
        if (this.useLeft && this.useTop && Window.hasEffectLib && Effect.ResizeWindow) {
          new Effect.ResizeWindow(this, null, null, null, this.height -dh, {duration: Window.resizeEffectDuration});
        } else  {
          this.height -= dh;
          this.element.setStyle({height: h + "px"});
          r2.hide();
        }
  
        if (! this.useTop) {
          var bottom = parseFloat(this.element.getStyle('bottom'));
          this.element.setStyle({bottom: (bottom + dh) + 'px'});
        }
      } 
      else {      
        this.minimized = false;
        
        var dh = this.r2Height;
        this.r2Height = null;
        if (this.useLeft && this.useTop && Window.hasEffectLib && Effect.ResizeWindow) {
          new Effect.ResizeWindow(this, null, null, null, this.height + dh, {duration: Window.resizeEffectDuration});
        }
        else {
          var h  = this.element.getHeight() + dh;
          this.height += dh;
          this.element.setStyle({height: h + "px"})
          r2.show();
        }
        if (! this.useTop) {
          var bottom = parseFloat(this.element.getStyle('bottom'));
          this.element.setStyle({bottom: (bottom - dh) + 'px'});
        }
        this.toFront();
      }
      this._notify("onMinimize");
      
      // Store new location/size if need be
      this._saveCookie()
    },
    
    maximize: function() {
      if (this.isMinimized() || this.resizing)
        return;
    
      if (Prototype.Browser.IE && this.heightN == 0)
        this._getWindowBorderSize();
        
      if (this.storedLocation != null) {
        this._restoreLocation();
        if(this.iefix) 
          this.iefix.hide();
      }
      else {
        this._storeLocation();
        Windows.unsetOverflow(this);
        
        var windowScroll = WindowUtilities.getWindowScroll(this.options.parent);
        var pageSize = WindowUtilities.getPageSize(this.options.parent);    
        var left = windowScroll.left;
        var top = windowScroll.top;
        
        if (this.options.parent != document.body) {
          windowScroll =  {top:0, left:0, bottom:0, right:0};
          var dim = this.options.parent.getDimensions();
          pageSize.windowWidth = dim.width;
          pageSize.windowHeight = dim.height;
          top = 0; 
          left = 0;
        }
        
        if (this.constraint) {
          pageSize.windowWidth -= Math.max(0, this.constraintPad.left) + Math.max(0, this.constraintPad.right);
          pageSize.windowHeight -= Math.max(0, this.constraintPad.top) + Math.max(0, this.constraintPad.bottom);
          left +=  Math.max(0, this.constraintPad.left);
          top +=  Math.max(0, this.constraintPad.top);
        }
        
        var width = pageSize.windowWidth - this.widthW - this.widthE;
        var height= pageSize.windowHeight - this.heightN - this.heightS;
  
        if (this.useLeft && this.useTop && Window.hasEffectLib && Effect.ResizeWindow) {
          new Effect.ResizeWindow(this, top, left, width, height, {duration: Window.resizeEffectDuration});
        }
        else {
          this.setSize(width, height);
          this.element.setStyle(this.useLeft ? {left: left} : {right: left});
          this.element.setStyle(this.useTop ? {top: top} : {bottom: top});
        }
          
        this.toFront();
        if (this.iefix) 
          this._fixIEOverlapping(); 
      }
      this._notify("onMaximize");
  
      // Store new location/size if need be
      this._saveCookie()
    },
    
    isMinimized: function() {
      return this.minimized;
    },
    
    isMaximized: function() {
      return (this.storedLocation != null);
    },
    
    setOpacity: function(opacity) {
      if (Element.setOpacity)
        Element.setOpacity(this.element, opacity);
    },
    
    setZIndex: function(zindex) {
      this.element.setStyle({zIndex: zindex});
      Windows.updateZindex(zindex, this);
    },
  
    setTitle: function(newTitle) {
      if (!newTitle || newTitle == "") 
        newTitle = "&nbsp;";
        
      Element.update(this.element.id + '_top', newTitle);
    },
     
    getTitle: function() {
      return $(this.element.id + '_top').innerHTML;
    },
    
    setStatusBar: function(element) {
      var statusBar = $(this.getId() + "_bottom");
  
      if (typeof(element) == "object") {
        if (this.bottombar.firstChild)
          this.bottombar.replaceChild(element, this.bottombar.firstChild);
        else
          this.bottombar.appendChild(element);
      }
      else
        this.bottombar.innerHTML = element;
    },
  
    _checkIEOverlapping: function() {
      if(!this.iefix && (navigator.appVersion.indexOf('MSIE')>0) && (navigator.userAgent.indexOf('Opera')<0) && (this.element.getStyle('position')=='absolute')) {
          new Insertion.After(this.element.id, '<iframe id="' + this.element.id + '_iefix" '+ 'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" ' + 'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
          this.iefix = $(this.element.id+'_iefix');
      }
      if(this.iefix) 
        setTimeout(this._fixIEOverlapping.bind(this), 50);
    },
  
    _fixIEOverlapping: function() {
        Position.clone(this.element, this.iefix);
        this.iefix.style.zIndex = this.element.style.zIndex - 1;
        this.iefix.show();
    },
    
    _keyUp: function(event) {
        if (27 == event.keyCode && this.options.closeOnEsc) {
            this.close();
        }
    },
  
    _getWindowBorderSize: function(event) {
      // Hack to get real window border size!!
      var div = this._createHiddenDiv(this.options.className + "_n")
      this.heightN = Element.getDimensions(div).height;    
      div.parentNode.removeChild(div)
  
      var div = this._createHiddenDiv(this.options.className + "_s")
      this.heightS = Element.getDimensions(div).height;    
      div.parentNode.removeChild(div)
  
      var div = this._createHiddenDiv(this.options.className + "_e")
      this.widthE = Element.getDimensions(div).width;    
      div.parentNode.removeChild(div)
  
      var div = this._createHiddenDiv(this.options.className + "_w")
      this.widthW = Element.getDimensions(div).width;
      div.parentNode.removeChild(div);
      
      var div = document.createElement("div");
      div.className = "overlay_" + this.options.className ;
      document.body.appendChild(div);
      //alert("no timeout:\nopacity: " + div.getStyle("opacity") + "\nwidth: " + document.defaultView.getComputedStyle(div, null).width);
      var that = this;
      
      // Workaround for Safari!!
      setTimeout(function() {that.overlayOpacity = ($(div).getStyle("opacity")); div.parentNode.removeChild(div);}, 10);
      
      // Workaround for IE!!
      if (Prototype.Browser.IE) {
        this.heightS = $(this.getId() +"_row3").getDimensions().height;
        this.heightN = $(this.getId() +"_row1").getDimensions().height;
      }
  
      // Safari size fix
      if (Prototype.Browser.WebKit && Prototype.Browser.WebKitVersion < 420)
        this.setSize(this.width, this.height);
      if (this.doMaximize)
        this.maximize();
      if (this.doMinimize)
        this.minimize();
    },
   
    _createHiddenDiv: function(className) {
      var objBody = document.body;
      var win = document.createElement("div");
      win.setAttribute('id', this.element.id+ "_tmp");
      win.className = className;
      win.style.display = 'none';
      win.innerHTML = '';
      objBody.insertBefore(win, objBody.firstChild);
      return win;
    },
    
    _storeLocation: function() {
      if (this.storedLocation == null) {
        this.storedLocation = {useTop: this.useTop, useLeft: this.useLeft, 
                               top: this.element.getStyle('top'), bottom: this.element.getStyle('bottom'),
                               left: this.element.getStyle('left'), right: this.element.getStyle('right'),
                               width: this.width, height: this.height };
      }
    },
    
    _restoreLocation: function() {
      if (this.storedLocation != null) {
        this.useLeft = this.storedLocation.useLeft;
        this.useTop = this.storedLocation.useTop;
        
        if (this.useLeft && this.useTop && Window.hasEffectLib && Effect.ResizeWindow)
          new Effect.ResizeWindow(this, this.storedLocation.top, this.storedLocation.left, this.storedLocation.width, this.storedLocation.height, {duration: Window.resizeEffectDuration});
        else {
          this.element.setStyle(this.useLeft ? {left: this.storedLocation.left} : {right: this.storedLocation.right});
          this.element.setStyle(this.useTop ? {top: this.storedLocation.top} : {bottom: this.storedLocation.bottom});
          this.setSize(this.storedLocation.width, this.storedLocation.height);
        }
        
        Windows.resetOverflow();
        this._removeStoreLocation();
      }
    },
    
    _removeStoreLocation: function() {
      this.storedLocation = null;
    },
    
    _saveCookie: function() {
      if (this.cookie) {
        var value = "";
        if (this.useLeft)
          value += "l:" +  (this.storedLocation ? this.storedLocation.left : this.element.getStyle('left'))
        else
          value += "r:" + (this.storedLocation ? this.storedLocation.right : this.element.getStyle('right'))
        if (this.useTop)
          value += ",t:" + (this.storedLocation ? this.storedLocation.top : this.element.getStyle('top'))
        else
          value += ",b:" + (this.storedLocation ? this.storedLocation.bottom :this.element.getStyle('bottom'))
          
        value += "," + (this.storedLocation ? this.storedLocation.width : this.width);
        value += "," + (this.storedLocation ? this.storedLocation.height : this.height);
        value += "," + this.isMinimized();
        value += "," + this.isMaximized();
        WindowUtilities.setCookie(value, this.cookie)
      }
    },
    
    _createWiredElement: function() {
      if (! this.wiredElement) {
        if (Prototype.Browser.IE)
          this._getWindowBorderSize();
        var div = document.createElement("div");
        div.className = "wired_frame " + this.options.className + "_wired_frame";
        
        div.style.position = 'absolute';
        this.options.parent.insertBefore(div, this.options.parent.firstChild);
        this.wiredElement = $(div);
      }
      if (this.useLeft) 
        this.wiredElement.setStyle({left: this.element.getStyle('left')});
      else 
        this.wiredElement.setStyle({right: this.element.getStyle('right')});
        
      if (this.useTop) 
        this.wiredElement.setStyle({top: this.element.getStyle('top')});
      else 
        this.wiredElement.setStyle({bottom: this.element.getStyle('bottom')});
  
      var dim = this.element.getDimensions();
      this.wiredElement.setStyle({width: dim.width + "px", height: dim.height +"px"});
  
      this.wiredElement.setStyle({zIndex: Windows.maxZIndex+30});
      return this.wiredElement;
    },
    
    _hideWiredElement: function() {
      if (! this.wiredElement || ! this.currentDrag)
        return;
      if (this.currentDrag == this.element) 
        this.currentDrag = null;
      else {
        if (this.useLeft) 
          this.element.setStyle({left: this.currentDrag.getStyle('left')});
        else 
          this.element.setStyle({right: this.currentDrag.getStyle('right')});
  
        if (this.useTop) 
          this.element.setStyle({top: this.currentDrag.getStyle('top')});
        else 
          this.element.setStyle({bottom: this.currentDrag.getStyle('bottom')});
  
        this.currentDrag.hide();
        this.currentDrag = null;
        if (this.doResize)
          this.setSize(this.width, this.height);
      } 
    },
    
    _notify: function(eventName) {
      if (this.options[eventName])
        this.options[eventName](this);
      else
        Windows.notify(eventName, this);
    }
  };
  
  // Windows containers, register all page windows
  var Windows = {
    windows: [],
    modalWindows: [],
    observers: [],
    focusedWindow: null,
    maxZIndex: 0,
    overlayShowEffectOptions: {duration: 0.5},
    overlayHideEffectOptions: {duration: 0.5},
  
    addObserver: function(observer) {
      this.removeObserver(observer);
      this.observers.push(observer);
    },
    
    removeObserver: function(observer) {  
      this.observers = this.observers.reject( function(o) { return o==observer });
    },
    
    // onDestroy onStartResize onStartMove onResize onMove onEndResize onEndMove onFocus onBlur onBeforeShow onShow onHide onMinimize onMaximize onClose
    notify: function(eventName, win) {  
      this.observers.each( function(o) {if(o[eventName]) o[eventName](eventName, win);});
    },
  
    // Gets window from its id
    getWindow: function(id) {
      return this.windows.detect(function(d) { return d.getId() ==id });
    },
  
    // Gets the last focused window
    getFocusedWindow: function() {
      return this.focusedWindow;
    },
  
    updateFocusedWindow: function() {
      this.focusedWindow = this.windows.length >=2 ? this.windows[this.windows.length-2] : null;    
    },
    
    // Registers a new window (called by Windows constructor)
    register: function(win) {
      this.windows.push(win);
    },
      
    // Add a modal window in the stack
    addModalWindow: function(win) {
      // Disable screen if first modal window
      if (this.modalWindows.length == 0) {
        WindowUtilities.disableScreen(win.options.className, 'overlay_modal', win.overlayOpacity, win.getId(), win.options.parent);
      }
      else {
        // Move overlay over all windows
        if (Window.keepMultiModalWindow) {
          $('overlay_modal').style.zIndex = Windows.maxZIndex + 1;
          Windows.maxZIndex += 1;
          WindowUtilities._hideSelect(this.modalWindows.last().getId());
        }
        // Hide current modal window
        else
          this.modalWindows.last().element.hide();
        // Fucking IE select issue
        WindowUtilities._showSelect(win.getId());
      }      
      this.modalWindows.push(win);    
    },
    
    removeModalWindow: function(win) {
      this.modalWindows.pop();
      
      // No more modal windows
      if (this.modalWindows.length == 0)
        WindowUtilities.enableScreen();     
      else {
        if (Window.keepMultiModalWindow) {
          this.modalWindows.last().toFront();
          WindowUtilities._showSelect(this.modalWindows.last().getId());        
        }
        else
          this.modalWindows.last().element.show();
      }
    },
    
    // Registers a new window (called by Windows constructor)
    register: function(win) {
      this.windows.push(win);
    },
    
    // Unregisters a window (called by Windows destructor)
    unregister: function(win) {
      this.windows = this.windows.reject(function(d) { return d==win });
    }, 
    
    // Closes all windows
    closeAll: function() {  
      this.windows.each( function(w) {Windows.close(w.getId())} );
    },
    
    closeAllModalWindows: function() {
      WindowUtilities.enableScreen();     
      this.modalWindows.each( function(win) {if (win) win.close()});    
    },
  
    // Minimizes a window with its id
    minimize: function(id, event) {
      var win = this.getWindow(id)
      if (win && win.visible)
        win.minimize();
      Event.stop(event);
    },
    
    // Maximizes a window with its id
    maximize: function(id, event) {
      var win = this.getWindow(id)
      if (win && win.visible)
        win.maximize();
      Event.stop(event);
    },
  
    // Closes a window with its id
    close: function(id, event) {
      var win = this.getWindow(id);
      if (win) 
        win.close();
      if (event)
        Event.stop(event);
    },
    
    blur: function(id) {
      var win = this.getWindow(id);  
      if (!win)
        return;
      if (win.options.blurClassName)
        win.changeClassName(win.options.blurClassName);
      if (this.focusedWindow == win)  
        this.focusedWindow = null;
      win._notify("onBlur");  
    },
    
    focus: function(id) {
      var win = this.getWindow(id);  
      if (!win)
        return;       
      if (this.focusedWindow)
        this.blur(this.focusedWindow.getId())
  
      if (win.options.focusClassName)
        win.changeClassName(win.options.focusClassName);  
      this.focusedWindow = win;
      win._notify("onFocus");
    },
    
    unsetOverflow: function(except) {    
      this.windows.each(function(d) { d.oldOverflow = d.getContent().getStyle("overflow") || "auto" ; d.getContent().setStyle({overflow: "hidden"}) });
      if (except && except.oldOverflow)
        except.getContent().setStyle({overflow: except.oldOverflow});
    },
  
    resetOverflow: function() {
      this.windows.each(function(d) { if (d.oldOverflow) d.getContent().setStyle({overflow: d.oldOverflow}) });
    },
  
    updateZindex: function(zindex, win) { 
      if (zindex > this.maxZIndex) {   
        this.maxZIndex = zindex;    
        if (this.focusedWindow) 
          this.blur(this.focusedWindow.getId())
      }
      this.focusedWindow = win;
      if (this.focusedWindow) 
        this.focus(this.focusedWindow.getId())
    }
  };
  
  var Dialog = {
    dialogId: null,
    onCompleteFunc: null,
    callFunc: null, 
    parameters: null, 
      
    confirm: function(content, parameters) {
      // Get Ajax return before
      if (content && typeof content != "string") {
        Dialog._runAjaxRequest(content, parameters, Dialog.confirm);
        return 
      }
      content = content || "";
      
      parameters = parameters || {};
      var okLabel = parameters.okLabel ? parameters.okLabel : "Ok";
      var cancelLabel = parameters.cancelLabel ? parameters.cancelLabel : "Cancel";
  
      // Backward compatibility
      parameters = Object.extend(parameters, parameters.windowParameters || {});
      parameters.windowParameters = parameters.windowParameters || {};
  
      parameters.className = parameters.className || "alert";
  
      var okButtonClass = "class ='" + (parameters.buttonClass ? parameters.buttonClass + " " : "") + " ok_button'" 
      var cancelButtonClass = "class ='" + (parameters.buttonClass ? parameters.buttonClass + " " : "") + " cancel_button'" 
  /*     var content = "\
        <div class='" + parameters.className + "_message'>" + content  + "</div>\
          <div class='" + parameters.className + "_buttons'>\
            <input type='button' value='" + okLabel + "' onclick='Dialog.okCallback()' " + okButtonClass + "/>\
            <input type='button' value='" + cancelLabel + "' onclick='Dialog.cancelCallback()' " + cancelButtonClass + "/>\
          </div>\
      "; */
      var content = "\
        <div class='" + parameters.className + "_message'>" + content  + "</div>\
          <div class='" + parameters.className + "_buttons'>\
            <button type='button' title='" + okLabel + "' onclick='Dialog.okCallback()' " + okButtonClass + "><span><span><span>" + okLabel + "</span></span></span></button>\
            <button type='button' title='" + cancelLabel + "' onclick='Dialog.cancelCallback()' " + cancelButtonClass + "><span><span><span>" + cancelLabel + "</span></span></span></button>\
          </div>\
      ";
      return this._openDialog(content, parameters)
    },
    
    alert: function(content, parameters) {
      // Get Ajax return before
      if (content && typeof content != "string") {
        Dialog._runAjaxRequest(content, parameters, Dialog.alert);
        return 
      }
      content = content || "";
      
      parameters = parameters || {};
      var okLabel = parameters.okLabel ? parameters.okLabel : "Ok";
  
      // Backward compatibility    
      parameters = Object.extend(parameters, parameters.windowParameters || {});
      parameters.windowParameters = parameters.windowParameters || {};
      
      parameters.className = parameters.className || "alert";
      
      var okButtonClass = "class ='" + (parameters.buttonClass ? parameters.buttonClass + " " : "") + " ok_button'" 
  /*     var content = "\
        <div class='" + parameters.className + "_message'>" + content  + "</div>\
          <div class='" + parameters.className + "_buttons'>\
            <input type='button' value='" + okLabel + "' onclick='Dialog.okCallback()' " + okButtonClass + "/>\
          </div>";   */
      var content = "\
        <div class='" + parameters.className + "_message'>" + content  + "</div>\
          <div class='" + parameters.className + "_buttons'>\
            <button type='button' title='" + okLabel + "' onclick='Dialog.okCallback()' " + okButtonClass + "><span><span><span>" + okLabel + "</span></span></span></button>\
          </div>";                  
      return this._openDialog(content, parameters)
    },
    
    info: function(content, parameters) {
      // Get Ajax return before
      if (content && typeof content != "string") {
        Dialog._runAjaxRequest(content, parameters, Dialog.info);
        return 
      }
      content = content || "";
       
      // Backward compatibility
      parameters = parameters || {};
      parameters = Object.extend(parameters, parameters.windowParameters || {});
      parameters.windowParameters = parameters.windowParameters || {};
      
      parameters.className = parameters.className || "alert";
      
      var content = "<div id='modal_dialog_message' class='" + parameters.className + "_message'>" + content  + "</div>";
      if (parameters.showProgress)
        content += "<div id='modal_dialog_progress' class='" + parameters.className + "_progress'>  </div>";
  
      parameters.ok = null;
      parameters.cancel = null;
      
      return this._openDialog(content, parameters)
    },
    
    setInfoMessage: function(message) {
      $('modal_dialog_message').update(message);
    },
    
    closeInfo: function() {
      Windows.close(this.dialogId);
    },
    
    _openDialog: function(content, parameters) {
      var className = parameters.className;
      
      if (! parameters.height && ! parameters.width) {
        parameters.width = WindowUtilities.getPageSize(parameters.options.parent || document.body).pageWidth / 2;
      }
      if (parameters.id)
        this.dialogId = parameters.id;
      else { 
        var t = new Date();
        this.dialogId = 'modal_dialog_' + t.getTime();
        parameters.id = this.dialogId;
      }
  
      // compute height or width if need be
      if (! parameters.height || ! parameters.width) {
        var size = WindowUtilities._computeSize(content, this.dialogId, parameters.width, parameters.height, 5, className)
        if (parameters.height)
          parameters.width = size + 5
        else
          parameters.height = size + 5
      }
      parameters.effectOptions = parameters.effectOptions ;
      parameters.resizable   = parameters.resizable || false;
      parameters.minimizable = parameters.minimizable || false;
      parameters.maximizable = parameters.maximizable ||  false;
      parameters.draggable   = parameters.draggable || false;
      parameters.closable    = parameters.closable || false;
  
      var win = new Window(parameters);
      win.getContent().innerHTML = content;
      
      win.showCenter(true, parameters.top, parameters.left);  
      win.setDestroyOnClose();
      
      win.cancelCallback = parameters.onCancel || parameters.cancel; 
      win.okCallback = parameters.onOk || parameters.ok;
      
      return win;    
    },
    
    _getAjaxContent: function(originalRequest)  {
        Dialog.callFunc(originalRequest.responseText, Dialog.parameters)
    },
    
    _runAjaxRequest: function(message, parameters, callFunc) {
      if (message.options == null)
        message.options = {}  
      Dialog.onCompleteFunc = message.options.onComplete;
      Dialog.parameters = parameters;
      Dialog.callFunc = callFunc;
      
      message.options.onComplete = Dialog._getAjaxContent;
      new Ajax.Request(message.url, message.options);
    },
    
    okCallback: function() {
      var win = Windows.focusedWindow;
      if (!win.okCallback || win.okCallback(win)) {
        // Remove onclick on button
        $$("#" + win.getId()+" input").each(function(element) {element.onclick=null;})
        win.close();
      }
    },
  
    cancelCallback: function() {
      var win = Windows.focusedWindow;
      // Remove onclick on button
      $$("#" + win.getId()+" input").each(function(element) {element.onclick=null})
      win.close();
      if (win.cancelCallback)
        win.cancelCallback(win);
    }
  };
  
  
  if (Prototype.Browser.WebKit) {
    var array = navigator.userAgent.match(new RegExp(/AppleWebKit\/([\d\.\+]*)/));
    Prototype.Browser.WebKitVersion = parseFloat(array[1]);
  }
  
  var WindowUtilities = {  
    // From dragdrop.js
    getWindowScroll: function(parent) {
      var T, L, W, H;
      parent = parent || document.body;              
      if (parent != document.body) {
        T = parent.scrollTop;
        L = parent.scrollLeft;
        W = parent.scrollWidth;
        H = parent.scrollHeight;
      } 
      else {
        var w = window;
        with (w.document) {
          if (w.document.documentElement && documentElement.scrollTop) {
            T = documentElement.scrollTop;
            L = documentElement.scrollLeft;
          } else if (w.document.body) {
            T = body.scrollTop;
            L = body.scrollLeft;
          }
          if (w.innerWidth) {
            W = w.innerWidth;
            H = w.innerHeight;
          } else if (w.document.documentElement && documentElement.clientWidth) {
            W = documentElement.clientWidth;
            H = documentElement.clientHeight;
          } else {
            W = body.offsetWidth;
            H = body.offsetHeight
          }
        }
      }
      return { top: T, left: L, width: W, height: H };
    }, 
    
    getPageSize: function(parent){
      parent = parent || document.body;              
      var windowWidth, windowHeight;
      var pageHeight, pageWidth;
      if (parent != document.body) {
        windowWidth = parent.getWidth();
        windowHeight = parent.getHeight();                                
        pageWidth = parent.scrollWidth;
        pageHeight = parent.scrollHeight;                                
      } 
      else {
        var xScroll, yScroll;
  
        if (window.innerHeight && window.scrollMaxY) {  
          xScroll = document.body.scrollWidth;
          yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
          xScroll = document.body.scrollWidth;
          yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
          xScroll = document.body.offsetWidth;
          yScroll = document.body.offsetHeight;
        }
  
  
        if (self.innerHeight) {  // all except Explorer
          windowWidth = document.documentElement.clientWidth;//self.innerWidth;
          windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
          windowWidth = document.documentElement.clientWidth;
          windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
          windowWidth = document.body.clientWidth;
          windowHeight = document.body.clientHeight;
        }  
  
        // for small pages with total height less then height of the viewport
        if(yScroll < windowHeight){
          pageHeight = windowHeight;
        } else { 
          pageHeight = yScroll;
        }
  
        // for small pages with total width less then width of the viewport
        if(xScroll < windowWidth){  
          pageWidth = windowWidth;
        } else {
          pageWidth = xScroll;
        }
      }             
      return {pageWidth: pageWidth ,pageHeight: pageHeight , windowWidth: windowWidth, windowHeight: windowHeight};
    },
  
    disableScreen: function(className, overlayId, overlayOpacity, contentId, parent) {
      WindowUtilities.initLightbox(overlayId, className, function() {this._disableScreen(className, overlayId, overlayOpacity, contentId)}.bind(this), parent || document.body);
    },
  
    _disableScreen: function(className, overlayId, overlayOpacity, contentId) {
      // prep objects
      var objOverlay = $(overlayId);
  
      var pageSize = WindowUtilities.getPageSize(objOverlay.parentNode);
  
      // Hide select boxes as they will 'peek' through the image in IE, store old value
      if (contentId && Prototype.Browser.IE) {
        WindowUtilities._hideSelect();
        WindowUtilities._showSelect(contentId);
      }  
    
      // set height of Overlay to take up whole page and show
      objOverlay.style.height = (pageSize.pageHeight + 'px');
      objOverlay.style.display = 'none'; 
      if (overlayId == "overlay_modal" && Window.hasEffectLib && Windows.overlayShowEffectOptions) {
        objOverlay.overlayOpacity = overlayOpacity;
        new Effect.Appear(objOverlay, Object.extend({from: 0, to: overlayOpacity}, Windows.overlayShowEffectOptions));
      }
      else
        objOverlay.style.display = "block";
    },
    
    enableScreen: function(id) {
      id = id || 'overlay_modal';
      var objOverlay =  $(id);
      if (objOverlay) {
        // hide lightbox and overlay
        if (id == "overlay_modal" && Window.hasEffectLib && Windows.overlayHideEffectOptions)
          new Effect.Fade(objOverlay, Object.extend({from: objOverlay.overlayOpacity, to:0}, Windows.overlayHideEffectOptions));
        else {
          objOverlay.style.display = 'none';
          objOverlay.parentNode.removeChild(objOverlay);
        }
        
        // make select boxes visible using old value
        if (id != "__invisible__") 
          WindowUtilities._showSelect();
      }
    },
  
    _hideSelect: function(id) {
      if (Prototype.Browser.IE) {
        id = id ==  null ? "" : "#" + id + " ";
        $$(id + 'select').each(function(element) {
          if (! WindowUtilities.isDefined(element.oldVisibility)) {
            element.oldVisibility = element.style.visibility ? element.style.visibility : "visible";
            element.style.visibility = "hidden";
          }
        });
      }
    },
    
    _showSelect: function(id) {
      if (Prototype.Browser.IE) {
        id = id ==  null ? "" : "#" + id + " ";
        $$(id + 'select').each(function(element) {
          if (WindowUtilities.isDefined(element.oldVisibility)) {
            // Why?? Ask IE
            try {
              element.style.visibility = element.oldVisibility;
            } catch(e) {
              element.style.visibility = "visible";
            }
            element.oldVisibility = null;
          }
          else {
            if (element.style.visibility)
              element.style.visibility = "visible";
          }
        });
      }
    },
  
    isDefined: function(object) {
      return typeof(object) != "undefined" && object != null;
    },
    
    initLightbox: function(id, className, doneHandler, parent) {
      // Already done, just update zIndex
      if ($(id)) {
        Element.setStyle(id, {zIndex: Windows.maxZIndex + 1});
        Windows.maxZIndex++;
        doneHandler();
      }
      // create overlay div and hardcode some functional styles (aesthetic styles are in CSS file)
      else {
        var objOverlay = document.createElement("div");
        objOverlay.setAttribute('id', id);
        objOverlay.className = "overlay_" + className
        objOverlay.style.display = 'none';
        objOverlay.style.position = 'absolute';
        objOverlay.style.top = '0';
        objOverlay.style.left = '0';
        objOverlay.style.zIndex = Windows.maxZIndex + 1;
        Windows.maxZIndex++;
        objOverlay.style.width = '100%';
        parent.insertBefore(objOverlay, parent.firstChild);
        if (Prototype.Browser.WebKit && id == "overlay_modal") {
          setTimeout(function() {doneHandler()}, 10);
        }
        else
          doneHandler();
      }    
    },
    
    setCookie: function(value, parameters) {
      document.cookie= parameters[0] + "=" + escape(value) +
        ((parameters[1]) ? "; expires=" + parameters[1].toGMTString() : "") +
        ((parameters[2]) ? "; path=" + parameters[2] : "") +
        ((parameters[3]) ? "; domain=" + parameters[3] : "") +
        ((parameters[4]) ? "; secure" : "");
    },
  
    getCookie: function(name) {
      var dc = document.cookie;
      var prefix = name + "=";
      var begin = dc.indexOf("; " + prefix);
      if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
      } else {
        begin += 2;
      }
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
        end = dc.length;
      }
      return unescape(dc.substring(begin + prefix.length, end));
    },
      
    _computeSize: function(content, id, width, height, margin, className) {
      var objBody = document.body;
      var tmpObj = document.createElement("div");
      tmpObj.setAttribute('id', id);
      tmpObj.className = className + "_content";
  
      if (height)
        tmpObj.style.height = height + "px"
      else
        tmpObj.style.width = width + "px"
    
      tmpObj.style.position = 'absolute';
      tmpObj.style.top = '0';
      tmpObj.style.left = '0';
      tmpObj.style.display = 'none';
  
      tmpObj.innerHTML = content;
      objBody.insertBefore(tmpObj, objBody.firstChild);
  
      var size;
      if (height)
        size = $(tmpObj).getDimensions().width + margin;
      else
        size = $(tmpObj).getDimensions().height + margin;
      objBody.removeChild(tmpObj);
      return size;
    }  
  };
  
  
  function alteraPaddingBottomBody(){var e,t;jQuery("body").hasClass("catalog-product-view")&&(t=jQuery(".block-payment-condition"),(e=jQuery(".catalog-product-view")).width()<=750?(t=t.height()+2*parseInt(t.css("padding-bottom").replace(/\D/g,"")),e.css("padding-bottom",t)):e.css("padding-bottom",0))}function validate_entries(){var e=jQuery("#password").val(),t=(e.toLowerCase(),jQuery("#confirmation").val()),n=!0;e.length<6?(jQuery("#password_requirements_length").removeClass("compliant"),jQuery("#fa-caractere").removeClass("fa-check"),jQuery("#fa-caractere").addClass("fa-times"),n=!1,jQuery("#btn-cadastro").attr("disabled","disabled")):(jQuery("#password_requirements_length").addClass("compliant"),jQuery("#fa-caractere").addClass("fa-check"),jQuery("#fa-caractere").removeClass("fa-times")),e.match(/[^a-zA-Z]/)&&e.match(/[a-zA-Z]/)?(jQuery("#password_requirements_non_alpha").addClass("compliant"),jQuery("#fa-pontuacao").addClass("fa-check"),jQuery("#fa-pontuacao").removeClass("fa-times")):(jQuery("#password_requirements_non_alpha").removeClass("compliant"),jQuery("#fa-pontuacao").removeClass("fa-check"),jQuery("#fa-pontuacao").addClass("fa-times"),n=!1,jQuery("#btn-cadastro").attr("disabled","disabled")),e===t?(jQuery("#password_requirements_confirmation").addClass("compliant"),jQuery("#fa-igualdade").addClass("fa-check"),jQuery("#fa-igualdade").removeClass("fa-times")):(jQuery("#password_requirements_confirmation").removeClass("compliant"),jQuery("#fa-igualdade").removeClass("fa-check"),jQuery("#fa-igualdade").addClass("fa-times"),n=!1,jQuery("#btn-cadastro").attr("disabled","disabled")),!0===n&&jQuery("#btn-cadastro").removeAttr("disabled","disabled")}function searchAddressByPostcode(url,postcode,prefix){new Ajax.Request(url,{method:"post",parameters:"postcode="+postcode,onComplete:function(transport){var responseJson=eval("("+transport.responseText+")");$(prefix+"street1").setValue(responseJson.street),$(prefix+"street4").setValue(responseJson.district),$(prefix+"city").setValue(responseJson.city),$(prefix+"region_id").setValue(responseJson.region_id)}})}!function(e,t){"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(e.document)return t(e);throw new Error("jQuery requires a window with a document")}:t(e)}("undefined"!=typeof window?window:this,function(h,q){function M(e,t){return t.toUpperCase()}var d=[],u=d.slice,F=d.concat,P=d.push,R=d.indexOf,n={},B=n.toString,m=n.hasOwnProperty,g={},e="1.11.1",jQuery=function(e,t){return new jQuery.fn.init(e,t)},W=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,z=/^-ms-/,I=/-([\da-z])/gi;function Q(e){var t=e.length,n=jQuery.type(e);return"function"!==n&&!jQuery.isWindow(e)&&(!(1!==e.nodeType||!t)||("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e))}jQuery.fn=jQuery.prototype={jquery:e,constructor:jQuery,selector:"",length:0,toArray:function(){return u.call(this)},get:function(e){return null!=e?e<0?this[e+this.length]:this[e]:u.call(this)},pushStack:function(e){e=jQuery.merge(this.constructor(),e);return e.prevObject=this,e.context=this.context,e},each:function(e,t){return jQuery.each(this,e,t)},map:function(n){return this.pushStack(jQuery.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(u.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,e=+e+(e<0?t:0);return this.pushStack(0<=e&&e<t?[this[e]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:P,sort:d.sort,splice:d.splice},jQuery.extend=jQuery.fn.extend=function(){var e,t,n,i,o,r=arguments[0]||{},s=1,a=arguments.length,l=!1;for("boolean"==typeof r&&(l=r,r=arguments[s]||{},s++),"object"==typeof r||jQuery.isFunction(r)||(r={}),s===a&&(r=this,s--);s<a;s++)if(null!=(i=arguments[s]))for(n in i)o=r[n],r!==(t=i[n])&&(l&&t&&(jQuery.isPlainObject(t)||(e=jQuery.isArray(t)))?(o=e?(e=!1,o&&jQuery.isArray(o)?o:[]):o&&jQuery.isPlainObject(o)?o:{},r[n]=jQuery.extend(l,o,t)):void 0!==t&&(r[n]=t));return r},jQuery.extend({expando:"jQuery"+(e+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isFunction:function(e){return"function"===jQuery.type(e)},isArray:Array.isArray||function(e){return"array"===jQuery.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!jQuery.isArray(e)&&0<=e-parseFloat(e)},isEmptyObject:function(e){for(var t in e)return!1;return!0},isPlainObject:function(e){if(!e||"object"!==jQuery.type(e)||e.nodeType||jQuery.isWindow(e))return!1;try{if(e.constructor&&!m.call(e,"constructor")&&!m.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(e){return!1}if(g.ownLast)for(var t in e)return m.call(e,t);for(t in e);return void 0===t||m.call(e,t)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[B.call(e)]||"object":typeof e},globalEval:function(e){e&&jQuery.trim(e)&&(h.execScript||function(e){h.eval.call(h,e)})(e)},camelCase:function(e){return e.replace(z,"ms-").replace(I,M)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var i=0,o=e.length,r=Q(e);if(n){if(r)for(;i<o&&!1!==t.apply(e[i],n);i++);else for(i in e)if(!1===t.apply(e[i],n))break}else if(r)for(;i<o&&!1!==t.call(e[i],i,e[i]);i++);else for(i in e)if(!1===t.call(e[i],i,e[i]))break;return e},trim:function(e){return null==e?"":(e+"").replace(W,"")},makeArray:function(e,t){t=t||[];return null!=e&&(Q(Object(e))?jQuery.merge(t,"string"==typeof e?[e]:e):P.call(t,e)),t},inArray:function(e,t,n){var i;if(t){if(R)return R.call(t,e,n);for(i=t.length,n=n?n<0?Math.max(0,i+n):n:0;n<i;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,t){for(var n=+t.length,i=0,o=e.length;i<n;)e[o++]=t[i++];if(n!=n)for(;void 0!==t[i];)e[o++]=t[i++];return e.length=o,e},grep:function(e,t,n){for(var i=[],o=0,r=e.length,s=!n;o<r;o++)!t(e[o],o)!=s&&i.push(e[o]);return i},map:function(e,t,n){var i,o=0,r=e.length,s=[];if(Q(e))for(;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return F.apply([],s)},guid:1,proxy:function(e,t){var n,i;if("string"==typeof t&&(i=e[t],t=e,e=i),jQuery.isFunction(e))return n=u.call(arguments,2),(i=function(){return e.apply(t||this,n.concat(u.call(arguments)))}).guid=e.guid=e.guid||jQuery.guid++,i},now:function(){return+new Date},support:g}),jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var e=function(M){function d(e,t,n){var i="0x"+t-65536;return i!=i||n?t:i<0?String.fromCharCode(65536+i):String.fromCharCode(i>>10|55296,1023&i|56320)}var e,p,x,r,F,f,P,R,w,c,u,h,C,t,m,g,i,o,y,b="sizzle"+-new Date,v=M.document,T=0,B=0,W=ue(),z=ue(),I=ue(),Q=function(e,t){return e===t&&(u=!0),0},n="undefined",X={}.hasOwnProperty,s=[],U=s.pop,V=s.push,k=s.push,J=s.slice,E=s.indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(this[t]===e)return t;return-1},Y="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",a="[\\x20\\t\\r\\n\\f]",l="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",Z=l.replace("w","w#"),G="\\["+a+"*("+l+")(?:"+a+"*([*^$|!~]?=)"+a+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+Z+"))|)"+a+"*\\]",K=":("+l+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+G+")*)|.*)\\)|)",N=new RegExp("^"+a+"+|((?:^|[^\\\\])(?:\\\\.)*)"+a+"+$","g"),ee=new RegExp("^"+a+"*,"+a+"*"),te=new RegExp("^"+a+"*([>+~]|"+a+")"+a+"*"),ne=new RegExp("="+a+"*([^\\]'\"]*?)"+a+"*\\]","g"),ie=new RegExp(K),oe=new RegExp("^"+Z+"$"),S={ID:new RegExp("^#("+l+")"),CLASS:new RegExp("^\\.("+l+")"),TAG:new RegExp("^("+l.replace("w","w*")+")"),ATTR:new RegExp("^"+G),PSEUDO:new RegExp("^"+K),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+a+"*(even|odd|(([+-]|)(\\d*)n|)"+a+"*(?:([+-]|)"+a+"*(\\d+)|))"+a+"*\\)|)","i"),bool:new RegExp("^(?:"+Y+")$","i"),needsContext:new RegExp("^"+a+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+a+"*((?:-\\d)?\\d*)"+a+"*\\)|)(?=[^-]|$)","i")},re=/^(?:input|select|textarea|button)$/i,se=/^h\d$/i,j=/^[^{]+\{\s*\[native \w/,ae=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,le=/[+~]/,ce=/'|\\/g,D=new RegExp("\\\\([\\da-f]{1,6}"+a+"?|("+a+")|.)","ig");try{k.apply(s=J.call(v.childNodes),v.childNodes),s[v.childNodes.length].nodeType}catch(e){k={apply:s.length?function(e,t){V.apply(e,J.call(t))}:function(e,t){for(var n=e.length,i=0;e[n++]=t[i++];);e.length=n-1}}}function A(e,t,n,i){var o,r,s,a,l,c,u;if((t?t.ownerDocument||t:v)!==C&&h(t),n=n||[],!e||"string"!=typeof e)return n;if(1!==(o=(t=t||C).nodeType)&&9!==o)return[];if(m&&!i){if(c=ae.exec(e))if(u=c[1]){if(9===o){if(!(a=t.getElementById(u))||!a.parentNode)return n;if(a.id===u)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(u))&&y(t,a)&&a.id===u)return n.push(a),n}else{if(c[2])return k.apply(n,t.getElementsByTagName(e)),n;if((u=c[3])&&p.getElementsByClassName&&t.getElementsByClassName)return k.apply(n,t.getElementsByClassName(u)),n}if(p.qsa&&(!g||!g.test(e))){if(l=a=b,c=t,u=9===o&&e,1===o&&"object"!==t.nodeName.toLowerCase()){for(s=f(e),(a=t.getAttribute("id"))?l=a.replace(ce,"\\$&"):t.setAttribute("id",l),l="[id='"+l+"'] ",r=s.length;r--;)s[r]=l+O(s[r]);c=le.test(e)&&fe(t.parentNode)||t,u=s.join(",")}if(u)try{return k.apply(n,c.querySelectorAll(u)),n}catch(e){}finally{a||t.removeAttribute("id")}}}return R(e.replace(N,"$1"),t,n,i)}function ue(){var n=[];function i(e,t){return n.push(e+" ")>x.cacheLength&&delete i[n.shift()],i[e+" "]=t}return i}function L(e){return e[b]=!0,e}function H(e){var t=C.createElement("div");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t)}}function de(e,t){for(var n=e.split("|"),i=e.length;i--;)x.attrHandle[n[i]]=t}function pe(e,t){var n=t&&e,i=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||1<<31)-(~e.sourceIndex||1<<31);if(i)return i;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function _(s){return L(function(r){return r=+r,L(function(e,t){for(var n,i=s([],e.length,r),o=i.length;o--;)e[n=i[o]]&&(e[n]=!(t[n]=e[n]))})})}function fe(e){return e&&typeof e.getElementsByTagName!==n&&e}for(e in p=A.support={},F=A.isXML=function(e){e=e&&(e.ownerDocument||e).documentElement;return!!e&&"HTML"!==e.nodeName},h=A.setDocument=function(e){var l=e?e.ownerDocument||e:v,e=l.defaultView;return l!==C&&9===l.nodeType&&l.documentElement?(t=(C=l).documentElement,m=!F(l),e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",function(){h()},!1):e.attachEvent&&e.attachEvent("onunload",function(){h()})),p.attributes=H(function(e){return e.className="i",!e.getAttribute("className")}),p.getElementsByTagName=H(function(e){return e.appendChild(l.createComment("")),!e.getElementsByTagName("*").length}),p.getElementsByClassName=j.test(l.getElementsByClassName)&&H(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),p.getById=H(function(e){return t.appendChild(e).id=b,!l.getElementsByName||!l.getElementsByName(b).length}),p.getById?(x.find.ID=function(e,t){if(typeof t.getElementById!==n&&m)return(t=t.getElementById(e))&&t.parentNode?[t]:[]},x.filter.ID=function(e){var t=e.replace(D,d);return function(e){return e.getAttribute("id")===t}}):(delete x.find.ID,x.filter.ID=function(e){var t=e.replace(D,d);return function(e){e=typeof e.getAttributeNode!==n&&e.getAttributeNode("id");return e&&e.value===t}}),x.find.TAG=p.getElementsByTagName?function(e,t){if(typeof t.getElementsByTagName!==n)return t.getElementsByTagName(e)}:function(e,t){var n,i=[],o=0,r=t.getElementsByTagName(e);if("*"!==e)return r;for(;n=r[o++];)1===n.nodeType&&i.push(n);return i},x.find.CLASS=p.getElementsByClassName&&function(e,t){if(typeof t.getElementsByClassName!==n&&m)return t.getElementsByClassName(e)},i=[],g=[],(p.qsa=j.test(l.querySelectorAll))&&(H(function(e){e.innerHTML="<select msallowclip=''><option selected=''></option></select>",e.querySelectorAll("[msallowclip^='']").length&&g.push("[*^$]="+a+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||g.push("\\["+a+"*(?:value|"+Y+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),H(function(e){var t=l.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&g.push("name"+a+"*[*^$|!~]?="),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(p.matchesSelector=j.test(o=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.msMatchesSelector))&&H(function(e){p.disconnectedMatch=o.call(e,"div"),o.call(e,"[s!='']:x"),i.push("!=",K)}),g=g.length&&new RegExp(g.join("|")),i=i.length&&new RegExp(i.join("|")),e=j.test(t.compareDocumentPosition),y=e||j.test(t.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,t=t&&t.parentNode;return e===t||!(!t||1!==t.nodeType||!(n.contains?n.contains(t):e.compareDocumentPosition&&16&e.compareDocumentPosition(t)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},Q=e?function(e,t){if(e===t)return u=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!p.sortDetached&&t.compareDocumentPosition(e)===n?e===l||e.ownerDocument===v&&y(v,e)?-1:t===l||t.ownerDocument===v&&y(v,t)?1:c?E.call(c,e)-E.call(c,t):0:4&n?-1:1)}:function(e,t){if(e===t)return u=!0,0;var n,i=0,o=e.parentNode,r=t.parentNode,s=[e],a=[t];if(!o||!r)return e===l?-1:t===l?1:o?-1:r?1:c?E.call(c,e)-E.call(c,t):0;if(o===r)return pe(e,t);for(n=e;n=n.parentNode;)s.unshift(n);for(n=t;n=n.parentNode;)a.unshift(n);for(;s[i]===a[i];)i++;return i?pe(s[i],a[i]):s[i]===v?-1:a[i]===v?1:0},l):C},A.matches=function(e,t){return A(e,null,null,t)},A.matchesSelector=function(e,t){if((e.ownerDocument||e)!==C&&h(e),t=t.replace(ne,"='$1']"),p.matchesSelector&&m&&(!i||!i.test(t))&&(!g||!g.test(t)))try{var n=o.call(e,t);if(n||p.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){}return 0<A(t,C,null,[e]).length},A.contains=function(e,t){return(e.ownerDocument||e)!==C&&h(e),y(e,t)},A.attr=function(e,t){(e.ownerDocument||e)!==C&&h(e);var n=x.attrHandle[t.toLowerCase()],n=n&&X.call(x.attrHandle,t.toLowerCase())?n(e,t,!m):void 0;return void 0!==n?n:p.attributes||!m?e.getAttribute(t):(n=e.getAttributeNode(t))&&n.specified?n.value:null},A.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},A.uniqueSort=function(e){var t,n=[],i=0,o=0;if(u=!p.detectDuplicates,c=!p.sortStable&&e.slice(0),e.sort(Q),u){for(;t=e[o++];)t===e[o]&&(i=n.push(o));for(;i--;)e.splice(n[i],1)}return c=null,e},r=A.getText=function(e){var t,n="",i=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=r(e)}else if(3===o||4===o)return e.nodeValue}else for(;t=e[i++];)n+=r(t);return n},(x=A.selectors={cacheLength:50,createPseudo:L,match:S,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(D,d),e[3]=(e[3]||e[4]||e[5]||"").replace(D,d),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||A.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&A.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return S.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&ie.test(n)&&(t=f(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(D,d).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=W[e+" "];return t||(t=new RegExp("(^|"+a+")"+e+"("+a+"|$)"))&&W(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==n&&e.getAttribute("class")||"")})},ATTR:function(t,n,i){return function(e){e=A.attr(e,t);return null==e?"!="===n:!n||(e+="","="===n?e===i:"!="===n?e!==i:"^="===n?i&&0===e.indexOf(i):"*="===n?i&&-1<e.indexOf(i):"$="===n?i&&e.slice(-i.length)===i:"~="===n?-1<(" "+e+" ").indexOf(i):"|="===n&&(e===i||e.slice(0,i.length+1)===i+"-"))}},CHILD:function(f,e,t,h,m){var g="nth"!==f.slice(0,3),y="last"!==f.slice(-4),v="of-type"===e;return 1===h&&0===m?function(e){return!!e.parentNode}:function(e,t,n){var i,o,r,s,a,l,c=g!=y?"nextSibling":"previousSibling",u=e.parentNode,d=v&&e.nodeName.toLowerCase(),p=!n&&!v;if(u){if(g){for(;c;){for(r=e;r=r[c];)if(v?r.nodeName.toLowerCase()===d:1===r.nodeType)return!1;l=c="only"===f&&!l&&"nextSibling"}return!0}if(l=[y?u.firstChild:u.lastChild],y&&p){for(a=(i=(o=u[b]||(u[b]={}))[f]||[])[0]===T&&i[1],s=i[0]===T&&i[2],r=a&&u.childNodes[a];r=++a&&r&&r[c]||(s=a=0)||l.pop();)if(1===r.nodeType&&++s&&r===e){o[f]=[T,a,s];break}}else if(p&&(i=(e[b]||(e[b]={}))[f])&&i[0]===T)s=i[1];else for(;(r=++a&&r&&r[c]||(s=a=0)||l.pop())&&((v?r.nodeName.toLowerCase()!==d:1!==r.nodeType)||!++s||(p&&((r[b]||(r[b]={}))[f]=[T,s]),r!==e)););return(s-=m)===h||s%h==0&&0<=s/h}}},PSEUDO:function(e,r){var t,s=x.pseudos[e]||x.setFilters[e.toLowerCase()]||A.error("unsupported pseudo: "+e);return s[b]?s(r):1<s.length?(t=[e,e,"",r],x.setFilters.hasOwnProperty(e.toLowerCase())?L(function(e,t){for(var n,i=s(e,r),o=i.length;o--;)e[n=E.call(e,i[o])]=!(t[n]=i[o])}):function(e){return s(e,0,t)}):s}},pseudos:{not:L(function(e){var i=[],o=[],a=P(e.replace(N,"$1"));return a[b]?L(function(e,t,n,i){for(var o,r=a(e,null,i,[]),s=e.length;s--;)(o=r[s])&&(e[s]=!(t[s]=o))}):function(e,t,n){return i[0]=e,a(i,null,n,o),!o.pop()}}),has:L(function(t){return function(e){return 0<A(t,e).length}}),contains:L(function(t){return function(e){return-1<(e.textContent||e.innerText||r(e)).indexOf(t)}}),lang:L(function(n){return oe.test(n||"")||A.error("unsupported lang: "+n),n=n.replace(D,d).toLowerCase(),function(e){var t;do{if(t=m?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=M.location&&M.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===t},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return!1===e.disabled},disabled:function(e){return!0===e.disabled},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!x.pseudos.empty(e)},header:function(e){return se.test(e.nodeName)},input:function(e){return re.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(e=e.getAttribute("type"))||"text"===e.toLowerCase())},first:_(function(){return[0]}),last:_(function(e,t){return[t-1]}),eq:_(function(e,t,n){return[n<0?n+t:n]}),even:_(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:_(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:_(function(e,t,n){for(var i=n<0?n+t:n;0<=--i;)e.push(i);return e}),gt:_(function(e,t,n){for(var i=n<0?n+t:n;++i<t;)e.push(i);return e})}}).pseudos.nth=x.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})x.pseudos[e]=function(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}(e);for(e in{submit:!0,reset:!0})x.pseudos[e]=function(n){return function(e){var t=e.nodeName.toLowerCase();return("input"===t||"button"===t)&&e.type===n}}(e);function he(){}function O(e){for(var t=0,n=e.length,i="";t<n;t++)i+=e[t].value;return i}function me(s,e,t){var a=e.dir,l=t&&"parentNode"===a,c=B++;return e.first?function(e,t,n){for(;e=e[a];)if(1===e.nodeType||l)return s(e,t,n)}:function(e,t,n){var i,o,r=[T,c];if(n){for(;e=e[a];)if((1===e.nodeType||l)&&s(e,t,n))return!0}else for(;e=e[a];)if(1===e.nodeType||l){if((i=(o=e[b]||(e[b]={}))[a])&&i[0]===T&&i[1]===c)return r[2]=i[2];if((o[a]=r)[2]=s(e,t,n))return!0}}}function ge(o){return 1<o.length?function(e,t,n){for(var i=o.length;i--;)if(!o[i](e,t,n))return!1;return!0}:o[0]}function q(e,t,n,i,o){for(var r,s=[],a=0,l=e.length,c=null!=t;a<l;a++)!(r=e[a])||n&&!n(r,i,o)||(s.push(r),c&&t.push(a));return s}function ye(f,h,m,g,y,e){return g&&!g[b]&&(g=ye(g)),y&&!y[b]&&(y=ye(y,e)),L(function(e,t,n,i){var o,r,s,a=[],l=[],c=t.length,u=e||function(e,t,n){for(var i=0,o=t.length;i<o;i++)A(e,t[i],n);return n}(h||"*",n.nodeType?[n]:n,[]),d=!f||!e&&h?u:q(u,a,f,n,i),p=m?y||(e?f:c||g)?[]:t:d;if(m&&m(d,p,n,i),g)for(o=q(p,l),g(o,[],n,i),r=o.length;r--;)(s=o[r])&&(p[l[r]]=!(d[l[r]]=s));if(e){if(y||f){if(y){for(o=[],r=p.length;r--;)(s=p[r])&&o.push(d[r]=s);y(null,p=[],o,i)}for(r=p.length;r--;)(s=p[r])&&-1<(o=y?E.call(e,s):a[r])&&(e[o]=!(t[o]=s))}}else p=q(p===t?p.splice(c,p.length):p),y?y(null,t,p,i):k.apply(t,p)})}function ve(g,y){function e(e,t,n,i,o){var r,s,a,l=0,c="0",u=e&&[],d=[],p=w,f=e||b&&x.find.TAG("*",o),h=T+=null==p?1:Math.random()||.1,m=f.length;for(o&&(w=t!==C&&t);c!==m&&null!=(r=f[c]);c++){if(b&&r){for(s=0;a=g[s++];)if(a(r,t,n)){i.push(r);break}o&&(T=h)}v&&((r=!a&&r)&&l--,e&&u.push(r))}if(l+=c,v&&c!==l){for(s=0;a=y[s++];)a(u,d,t,n);if(e){if(0<l)for(;c--;)u[c]||d[c]||(d[c]=U.call(i));d=q(d)}k.apply(i,d),o&&!e&&0<d.length&&1<l+y.length&&A.uniqueSort(i)}return o&&(T=h,w=p),u}var v=0<y.length,b=0<g.length;return v?L(e):e}return he.prototype=x.filters=x.pseudos,x.setFilters=new he,f=A.tokenize=function(e,t){var n,i,o,r,s,a,l,c=z[e+" "];if(c)return t?0:c.slice(0);for(s=e,a=[],l=x.preFilter;s;){for(r in n&&!(i=ee.exec(s))||(i&&(s=s.slice(i[0].length)||s),a.push(o=[])),n=!1,(i=te.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(N," ")}),s=s.slice(n.length)),x.filter)!(i=S[r].exec(s))||l[r]&&!(i=l[r](i))||(n=i.shift(),o.push({value:n,type:r,matches:i}),s=s.slice(n.length));if(!n)break}return t?s.length:s?A.error(e):z(e,a).slice(0)},P=A.compile=function(e,t){var n,i=[],o=[],r=I[e+" "];if(!r){for(n=(t=t||f(e)).length;n--;)((r=function e(t){for(var i,n,o,r=t.length,s=x.relative[t[0].type],a=s||x.relative[" "],l=s?1:0,c=me(function(e){return e===i},a,!0),u=me(function(e){return-1<E.call(i,e)},a,!0),d=[function(e,t,n){return!s&&(n||t!==w)||((i=t).nodeType?c:u)(e,t,n)}];l<r;l++)if(n=x.relative[t[l].type])d=[me(ge(d),n)];else{if((n=x.filter[t[l].type].apply(null,t[l].matches))[b]){for(o=++l;o<r&&!x.relative[t[o].type];o++);return ye(1<l&&ge(d),1<l&&O(t.slice(0,l-1).concat({value:" "===t[l-2].type?"*":""})).replace(N,"$1"),n,l<o&&e(t.slice(l,o)),o<r&&e(t=t.slice(o)),o<r&&O(t))}d.push(n)}return ge(d)}(t[n]))[b]?i:o).push(r);(r=I(e,ve(o,i))).selector=e}return r},R=A.select=function(e,t,n,i){var o,r,s,a,l,c="function"==typeof e&&e,u=!i&&f(e=c.selector||e);if(n=n||[],1===u.length){if(2<(r=u[0]=u[0].slice(0)).length&&"ID"===(s=r[0]).type&&p.getById&&9===t.nodeType&&m&&x.relative[r[1].type]){if(!(t=(x.find.ID(s.matches[0].replace(D,d),t)||[])[0]))return n;c&&(t=t.parentNode),e=e.slice(r.shift().value.length)}for(o=S.needsContext.test(e)?0:r.length;o--&&(s=r[o],!x.relative[a=s.type]);)if((l=x.find[a])&&(i=l(s.matches[0].replace(D,d),le.test(r[0].type)&&fe(t.parentNode)||t))){if(r.splice(o,1),e=i.length&&O(r))break;return k.apply(n,i),n}}return(c||P(e,u))(i,t,!m,n,le.test(e)&&fe(t.parentNode)||t),n},p.sortStable=b.split("").sort(Q).join("")===b,p.detectDuplicates=!!u,h(),p.sortDetached=H(function(e){return 1&e.compareDocumentPosition(C.createElement("div"))}),H(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||de("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),p.attributes&&H(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||de("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),H(function(e){return null==e.getAttribute("disabled")})||de(Y,function(e,t,n){if(!n)return!0===e[t]?t.toLowerCase():(n=e.getAttributeNode(t))&&n.specified?n.value:null}),A}(h),X=(jQuery.find=e,jQuery.expr=e.selectors,jQuery.expr[":"]=jQuery.expr.pseudos,jQuery.unique=e.uniqueSort,jQuery.text=e.getText,jQuery.isXMLDoc=e.isXML,jQuery.contains=e.contains,jQuery.expr.match.needsContext),U=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,V=/^.[^:#\[\.,]*$/;function J(e,n,i){if(jQuery.isFunction(n))return jQuery.grep(e,function(e,t){return!!n.call(e,t,e)!==i});if(n.nodeType)return jQuery.grep(e,function(e){return e===n!==i});if("string"==typeof n){if(V.test(n))return jQuery.filter(n,e,i);n=jQuery.filter(n,e)}return jQuery.grep(e,function(e){return 0<=jQuery.inArray(e,n)!==i})}jQuery.filter=function(e,t,n){var i=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===i.nodeType?jQuery.find.matchesSelector(i,e)?[i]:[]:jQuery.find.matches(e,jQuery.grep(t,function(e){return 1===e.nodeType}))},jQuery.fn.extend({find:function(e){var t,n=[],i=this,o=i.length;if("string"!=typeof e)return this.pushStack(jQuery(e).filter(function(){for(t=0;t<o;t++)if(jQuery.contains(i[t],this))return!0}));for(t=0;t<o;t++)jQuery.find(e,i[t],n);return(n=this.pushStack(1<o?jQuery.unique(n):n)).selector=this.selector?this.selector+" "+e:e,n},filter:function(e){return this.pushStack(J(this,e||[],!1))},not:function(e){return this.pushStack(J(this,e||[],!0))},is:function(e){return!!J(this,"string"==typeof e&&X.test(e)?jQuery(e):e||[],!1).length}});var o,y=h.document,Y=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,Z=((jQuery.fn.init=function(e,t){var n,i;if(!e)return this;if("string"!=typeof e)return e.nodeType?(this.context=this[0]=e,this.length=1,this):jQuery.isFunction(e)?void 0!==o.ready?o.ready(e):e(jQuery):(void 0!==e.selector&&(this.selector=e.selector,this.context=e.context),jQuery.makeArray(e,this));if(!(n="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&3<=e.length?[null,e,null]:Y.exec(e))||!n[1]&&t)return(!t||t.jquery?t||o:this.constructor(t)).find(e);if(n[1]){if(t=t instanceof jQuery?t[0]:t,jQuery.merge(this,jQuery.parseHTML(n[1],t&&t.nodeType?t.ownerDocument||t:y,!0)),U.test(n[1])&&jQuery.isPlainObject(t))for(n in t)jQuery.isFunction(this[n])?this[n](t[n]):this.attr(n,t[n]);return this}if((i=y.getElementById(n[2]))&&i.parentNode){if(i.id!==n[2])return o.find(e);this.length=1,this[0]=i}return this.context=y,this.selector=e,this}).prototype=jQuery.fn,o=jQuery(y),/^(?:parents|prev(?:Until|All))/),G={children:!0,contents:!0,next:!0,prev:!0};function K(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}jQuery.extend({dir:function(e,t,n){for(var i=[],o=e[t];o&&9!==o.nodeType&&(void 0===n||1!==o.nodeType||!jQuery(o).is(n));)1===o.nodeType&&i.push(o),o=o[t];return i},sibling:function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}}),jQuery.fn.extend({has:function(e){var t,n=jQuery(e,this),i=n.length;return this.filter(function(){for(t=0;t<i;t++)if(jQuery.contains(this,n[t]))return!0})},closest:function(e,t){for(var n,i=0,o=this.length,r=[],s=X.test(e)||"string"!=typeof e?jQuery(e,t||this.context):0;i<o;i++)for(n=this[i];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(s?-1<s.index(n):1===n.nodeType&&jQuery.find.matchesSelector(n,e))){r.push(n);break}return this.pushStack(1<r.length?jQuery.unique(r):r)},index:function(e){return e?"string"==typeof e?jQuery.inArray(this[0],jQuery(e)):jQuery.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(jQuery.unique(jQuery.merge(this.get(),jQuery(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),jQuery.each({parent:function(e){e=e.parentNode;return e&&11!==e.nodeType?e:null},parents:function(e){return jQuery.dir(e,"parentNode")},parentsUntil:function(e,t,n){return jQuery.dir(e,"parentNode",n)},next:function(e){return K(e,"nextSibling")},prev:function(e){return K(e,"previousSibling")},nextAll:function(e){return jQuery.dir(e,"nextSibling")},prevAll:function(e){return jQuery.dir(e,"previousSibling")},nextUntil:function(e,t,n){return jQuery.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return jQuery.dir(e,"previousSibling",n)},siblings:function(e){return jQuery.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return jQuery.sibling(e.firstChild)},contents:function(e){return jQuery.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:jQuery.merge([],e.childNodes)}},function(i,o){jQuery.fn[i]=function(e,t){var n=jQuery.map(this,o,e);return(t="Until"!==i.slice(-5)?e:t)&&"string"==typeof t&&(n=jQuery.filter(t,n)),1<this.length&&(G[i]||(n=jQuery.unique(n)),Z.test(i)&&(n=n.reverse())),this.pushStack(n)}});var t,w=/\S+/g,ee={};function te(){y.addEventListener?(y.removeEventListener("DOMContentLoaded",i,!1),h.removeEventListener("load",i,!1)):(y.detachEvent("onreadystatechange",i),h.detachEvent("onload",i))}function i(){!y.addEventListener&&"load"!==event.type&&"complete"!==y.readyState||(te(),jQuery.ready())}jQuery.Callbacks=function(o){var e,n;o="string"==typeof o?ee[o]||(n=ee[e=o]={},jQuery.each(e.match(w)||[],function(e,t){n[t]=!0}),n):jQuery.extend({},o);function i(e){for(t=o.memory&&e,s=!0,l=c||0,c=0,a=u.length,r=!0;u&&l<a;l++)if(!1===u[l].apply(e[0],e[1])&&o.stopOnFalse){t=!1;break}r=!1,u&&(d?d.length&&i(d.shift()):t?u=[]:p.disable())}var r,t,s,a,l,c,u=[],d=!o.once&&[],p={add:function(){var e;return u&&(e=u.length,function i(e){jQuery.each(e,function(e,t){var n=jQuery.type(t);"function"===n?o.unique&&p.has(t)||u.push(t):t&&t.length&&"string"!==n&&i(t)})}(arguments),r?a=u.length:t&&(c=e,i(t))),this},remove:function(){return u&&jQuery.each(arguments,function(e,t){for(var n;-1<(n=jQuery.inArray(t,u,n));)u.splice(n,1),r&&(n<=a&&a--,n<=l&&l--)}),this},has:function(e){return e?-1<jQuery.inArray(e,u):!(!u||!u.length)},empty:function(){return u=[],a=0,this},disable:function(){return u=d=t=void 0,this},disabled:function(){return!u},lock:function(){return d=void 0,t||p.disable(),this},locked:function(){return!d},fireWith:function(e,t){return!u||s&&!d||(t=[e,(t=t||[]).slice?t.slice():t],r?d.push(t):i(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!s}};return p},jQuery.extend({Deferred:function(e){var r=[["resolve","done",jQuery.Callbacks("once memory"),"resolved"],["reject","fail",jQuery.Callbacks("once memory"),"rejected"],["notify","progress",jQuery.Callbacks("memory")]],o="pending",s={state:function(){return o},always:function(){return a.done(arguments).fail(arguments),this},then:function(){var o=arguments;return jQuery.Deferred(function(i){jQuery.each(r,function(e,t){var n=jQuery.isFunction(o[e])&&o[e];a[t[1]](function(){var e=n&&n.apply(this,arguments);e&&jQuery.isFunction(e.promise)?e.promise().done(i.resolve).fail(i.reject).progress(i.notify):i[t[0]+"With"](this===s?i.promise():this,n?[e]:arguments)})}),o=null}).promise()},promise:function(e){return null!=e?jQuery.extend(e,s):s}},a={};return s.pipe=s.then,jQuery.each(r,function(e,t){var n=t[2],i=t[3];s[t[1]]=n.add,i&&n.add(function(){o=i},r[1^e][2].disable,r[2][2].lock),a[t[0]]=function(){return a[t[0]+"With"](this===a?s:this,arguments),this},a[t[0]+"With"]=n.fireWith}),s.promise(a),e&&e.call(a,a),a},when:function(e){function t(t,n,i){return function(e){n[t]=this,i[t]=1<arguments.length?u.call(arguments):e,i===o?c.notifyWith(n,i):--l||c.resolveWith(n,i)}}var o,n,i,r=0,s=u.call(arguments),a=s.length,l=1!==a||e&&jQuery.isFunction(e.promise)?a:0,c=1===l?e:jQuery.Deferred();if(1<a)for(o=new Array(a),n=new Array(a),i=new Array(a);r<a;r++)s[r]&&jQuery.isFunction(s[r].promise)?s[r].promise().done(t(r,i,s)).fail(c.reject).progress(t(r,n,o)):--l;return l||c.resolveWith(i,s),c.promise()}}),jQuery.fn.ready=function(e){return jQuery.ready.promise().done(e),this},jQuery.extend({isReady:!1,readyWait:1,holdReady:function(e){e?jQuery.readyWait++:jQuery.ready(!0)},ready:function(e){if(!0===e?!--jQuery.readyWait:!jQuery.isReady){if(!y.body)return setTimeout(jQuery.ready);(jQuery.isReady=!0)!==e&&0<--jQuery.readyWait||(t.resolveWith(y,[jQuery]),jQuery.fn.triggerHandler&&(jQuery(y).triggerHandler("ready"),jQuery(y).off("ready")))}}}),jQuery.ready.promise=function(e){if(!t)if(t=jQuery.Deferred(),"complete"===y.readyState)setTimeout(jQuery.ready);else if(y.addEventListener)y.addEventListener("DOMContentLoaded",i,!1),h.addEventListener("load",i,!1);else{y.attachEvent("onreadystatechange",i),h.attachEvent("onload",i);var n=!1;try{n=null==h.frameElement&&y.documentElement}catch(e){}n&&n.doScroll&&!function t(){if(!jQuery.isReady){try{n.doScroll("left")}catch(e){return setTimeout(t,50)}te(),jQuery.ready()}}()}return t.promise(e)};var ne,v="undefined";for(ne in jQuery(g))break;g.ownLast="0"!==ne,g.inlineBlockNeedsLayout=!1,jQuery(function(){var e,t,n=y.getElementsByTagName("body")[0];n&&n.style&&(e=y.createElement("div"),(t=y.createElement("div")).style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",n.appendChild(t).appendChild(e),typeof e.style.zoom!=v&&(e.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",g.inlineBlockNeedsLayout=e=3===e.offsetWidth,e&&(n.style.zoom=1)),n.removeChild(t))});e=y.createElement("div");if(null==g.deleteExpando){g.deleteExpando=!0;try{delete e.test}catch(e){g.deleteExpando=!1}}jQuery.acceptData=function(e){var t=jQuery.noData[(e.nodeName+" ").toLowerCase()],n=+e.nodeType||1;return(1===n||9===n)&&(!t||!0!==t&&e.getAttribute("classid")===t)};var ie=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,oe=/([A-Z])/g;function re(e,t,n){if(void 0===n&&1===e.nodeType){var i="data-"+t.replace(oe,"-$1").toLowerCase();if("string"==typeof(n=e.getAttribute(i))){try{n="true"===n||"false"!==n&&("null"===n?null:+n+""===n?+n:ie.test(n)?jQuery.parseJSON(n):n)}catch(e){}jQuery.data(e,t,n)}else n=void 0}return n}function se(e){for(var t in e)if(("data"!==t||!jQuery.isEmptyObject(e[t]))&&"toJSON"!==t)return;return 1}function ae(e,t,n,i){if(jQuery.acceptData(e)){var o,r=jQuery.expando,s=e.nodeType,a=s?jQuery.cache:e,l=s?e[r]:e[r]&&r;if(l&&a[l]&&(i||a[l].data)||void 0!==n||"string"!=typeof t)return a[l=l||(s?e[r]=d.pop()||jQuery.guid++:r)]||(a[l]=s?{}:{toJSON:jQuery.noop}),"object"!=typeof t&&"function"!=typeof t||(i?a[l]=jQuery.extend(a[l],t):a[l].data=jQuery.extend(a[l].data,t)),e=a[l],i||(e.data||(e.data={}),e=e.data),void 0!==n&&(e[jQuery.camelCase(t)]=n),"string"==typeof t?null==(o=e[t])&&(o=e[jQuery.camelCase(t)]):o=e,o}}function le(e,t,n){if(jQuery.acceptData(e)){var i,o,r=e.nodeType,s=r?jQuery.cache:e,a=r?e[jQuery.expando]:jQuery.expando;if(s[a]){if(t&&(i=n?s[a]:s[a].data)){o=(t=jQuery.isArray(t)?t.concat(jQuery.map(t,jQuery.camelCase)):t in i||(t=jQuery.camelCase(t))in i?[t]:t.split(" ")).length;for(;o--;)delete i[t[o]];if(n?!se(i):!jQuery.isEmptyObject(i))return}(n||(delete s[a].data,se(s[a])))&&(r?jQuery.cleanData([e],!0):g.deleteExpando||s!=s.window?delete s[a]:s[a]=null)}}}jQuery.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return!!(e=e.nodeType?jQuery.cache[e[jQuery.expando]]:e[jQuery.expando])&&!se(e)},data:function(e,t,n){return ae(e,t,n)},removeData:function(e,t){return le(e,t)},_data:function(e,t,n){return ae(e,t,n,!0)},_removeData:function(e,t){return le(e,t,!0)}}),jQuery.fn.extend({data:function(e,t){var n,i,o,r=this[0],s=r&&r.attributes;if(void 0!==e)return"object"==typeof e?this.each(function(){jQuery.data(this,e)}):1<arguments.length?this.each(function(){jQuery.data(this,e,t)}):r?re(r,e,jQuery.data(r,e)):void 0;if(this.length&&(o=jQuery.data(r),1===r.nodeType&&!jQuery._data(r,"parsedAttrs"))){for(n=s.length;n--;)s[n]&&0===(i=s[n].name).indexOf("data-")&&re(r,i=jQuery.camelCase(i.slice(5)),o[i]);jQuery._data(r,"parsedAttrs",!0)}return o},removeData:function(e){return this.each(function(){jQuery.removeData(this,e)})}}),jQuery.extend({queue:function(e,t,n){var i;if(e)return i=jQuery._data(e,t=(t||"fx")+"queue"),n&&(!i||jQuery.isArray(n)?i=jQuery._data(e,t,jQuery.makeArray(n)):i.push(n)),i||[]},dequeue:function(e,t){t=t||"fx";var n=jQuery.queue(e,t),i=n.length,o=n.shift(),r=jQuery._queueHooks(e,t);"inprogress"===o&&(o=n.shift(),i--),o&&("fx"===t&&n.unshift("inprogress"),delete r.stop,o.call(e,function(){jQuery.dequeue(e,t)},r)),!i&&r&&r.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return jQuery._data(e,n)||jQuery._data(e,n,{empty:jQuery.Callbacks("once memory").add(function(){jQuery._removeData(e,t+"queue"),jQuery._removeData(e,n)})})}}),jQuery.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?jQuery.queue(this[0],t):void 0===n?this:this.each(function(){var e=jQuery.queue(this,t,n);jQuery._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&jQuery.dequeue(this,t)})},dequeue:function(e){return this.each(function(){jQuery.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){function n(){--o||r.resolveWith(s,[s])}var i,o=1,r=jQuery.Deferred(),s=this,a=this.length;for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";a--;)(i=jQuery._data(s[a],e+"queueHooks"))&&i.empty&&(o++,i.empty.add(n));return n(),r.promise(t)}});function b(e,t){return"none"===jQuery.css(e=t||e,"display")||!jQuery.contains(e.ownerDocument,e)}var e=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,a=["Top","Right","Bottom","Left"],l=jQuery.access=function(e,t,n,i,o,r,s){var a=0,l=e.length,c=null==n;if("object"===jQuery.type(n))for(a in o=!0,n)jQuery.access(e,t,a,n[a],!0,r,s);else if(void 0!==i&&(o=!0,jQuery.isFunction(i)||(s=!0),t=c?s?(t.call(e,i),null):(c=t,function(e,t,n){return c.call(jQuery(e),n)}):t))for(;a<l;a++)t(e[a],n,s?i:i.call(e[a],a,t(e[a],n)));return o?e:c?t.call(e):l?t(e[0],n):r},ce=/^(?:checkbox|radio)$/i,r=y.createElement("input"),s=y.createElement("div"),c=y.createDocumentFragment();if(s.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",g.leadingWhitespace=3===s.firstChild.nodeType,g.tbody=!s.getElementsByTagName("tbody").length,g.htmlSerialize=!!s.getElementsByTagName("link").length,g.html5Clone="<:nav></:nav>"!==y.createElement("nav").cloneNode(!0).outerHTML,r.type="checkbox",r.checked=!0,c.appendChild(r),g.appendChecked=r.checked,s.innerHTML="<textarea>x</textarea>",g.noCloneChecked=!!s.cloneNode(!0).lastChild.defaultValue,c.appendChild(s),s.innerHTML="<input type='radio' checked='checked' name='t'/>",g.checkClone=s.cloneNode(!0).cloneNode(!0).lastChild.checked,g.noCloneEvent=!0,s.attachEvent&&(s.attachEvent("onclick",function(){g.noCloneEvent=!1}),s.cloneNode(!0).click()),null==g.deleteExpando){g.deleteExpando=!0;try{delete s.test}catch(e){g.deleteExpando=!1}}var p,ue,de=y.createElement("div");for(p in{submit:!0,change:!0,focusin:!0})(g[p+"Bubbles"]=(ue="on"+p)in h)||(de.setAttribute(ue,"t"),g[p+"Bubbles"]=!1===de.attributes[ue].expando);var pe=/^(?:input|select|textarea)$/i,fe=/^key/,he=/^(?:mouse|pointer|contextmenu)|click/,me=/^(?:focusinfocus|focusoutblur)$/,ge=/^([^.]*)(?:\.(.+)|)$/;function ye(){return!0}function f(){return!1}function ve(){try{return y.activeElement}catch(e){}}function be(e){var t=xe.split("|"),n=e.createDocumentFragment();if(n.createElement)for(;t.length;)n.createElement(t.pop());return n}jQuery.event={global:{},add:function(e,t,n,i,o){var r,s,a,l,c,u,d,p,f,h=jQuery._data(e);if(h)for(n.handler&&(n=(a=n).handler,o=a.selector),n.guid||(n.guid=jQuery.guid++),(r=h.events)||(r=h.events={}),(c=h.handle)||((c=h.handle=function(e){return typeof jQuery==v||e&&jQuery.event.triggered===e.type?void 0:jQuery.event.dispatch.apply(c.elem,arguments)}).elem=e),s=(t=(t||"").match(w)||[""]).length;s--;)d=f=(p=ge.exec(t[s])||[])[1],p=(p[2]||"").split(".").sort(),d&&(l=jQuery.event.special[d]||{},d=(o?l.delegateType:l.bindType)||d,l=jQuery.event.special[d]||{},f=jQuery.extend({type:d,origType:f,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&jQuery.expr.match.needsContext.test(o),namespace:p.join(".")},a),(u=r[d])||((u=r[d]=[]).delegateCount=0,l.setup&&!1!==l.setup.call(e,i,p,c)||(e.addEventListener?e.addEventListener(d,c,!1):e.attachEvent&&e.attachEvent("on"+d,c))),l.add&&(l.add.call(e,f),f.handler.guid||(f.handler.guid=n.guid)),o?u.splice(u.delegateCount++,0,f):u.push(f),jQuery.event.global[d]=!0)},remove:function(e,t,n,i,o){var r,s,a,l,c,u,d,p,f,h,m,g=jQuery.hasData(e)&&jQuery._data(e);if(g&&(u=g.events)){for(c=(t=(t||"").match(w)||[""]).length;c--;)if(f=m=(a=ge.exec(t[c])||[])[1],h=(a[2]||"").split(".").sort(),f){for(d=jQuery.event.special[f]||{},p=u[f=(i?d.delegateType:d.bindType)||f]||[],a=a[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=r=p.length;r--;)s=p[r],!o&&m!==s.origType||n&&n.guid!==s.guid||a&&!a.test(s.namespace)||i&&i!==s.selector&&("**"!==i||!s.selector)||(p.splice(r,1),s.selector&&p.delegateCount--,d.remove&&d.remove.call(e,s));l&&!p.length&&(d.teardown&&!1!==d.teardown.call(e,h,g.handle)||jQuery.removeEvent(e,f,g.handle),delete u[f])}else for(f in u)jQuery.event.remove(e,f+t[c],n,i,!0);jQuery.isEmptyObject(u)&&(delete g.handle,jQuery._removeData(e,"events"))}},trigger:function(e,t,n,i){var o,r,s,a,l,c,u=[n||y],d=m.call(e,"type")?e.type:e,p=m.call(e,"namespace")?e.namespace.split("."):[],f=l=n=n||y;if(3!==n.nodeType&&8!==n.nodeType&&!me.test(d+jQuery.event.triggered)&&(0<=d.indexOf(".")&&(d=(p=d.split(".")).shift(),p.sort()),r=d.indexOf(":")<0&&"on"+d,(e=e[jQuery.expando]?e:new jQuery.Event(d,"object"==typeof e&&e)).isTrigger=i?2:3,e.namespace=p.join("."),e.namespace_re=e.namespace?new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:jQuery.makeArray(t,[e]),a=jQuery.event.special[d]||{},i||!a.trigger||!1!==a.trigger.apply(n,t))){if(!i&&!a.noBubble&&!jQuery.isWindow(n)){for(s=a.delegateType||d,me.test(s+d)||(f=f.parentNode);f;f=f.parentNode)u.push(f),l=f;l===(n.ownerDocument||y)&&u.push(l.defaultView||l.parentWindow||h)}for(c=0;(f=u[c++])&&!e.isPropagationStopped();)e.type=1<c?s:a.bindType||d,(o=(jQuery._data(f,"events")||{})[e.type]&&jQuery._data(f,"handle"))&&o.apply(f,t),(o=r&&f[r])&&o.apply&&jQuery.acceptData(f)&&(e.result=o.apply(f,t),!1===e.result&&e.preventDefault());if(e.type=d,!i&&!e.isDefaultPrevented()&&(!a._default||!1===a._default.apply(u.pop(),t))&&jQuery.acceptData(n)&&r&&n[d]&&!jQuery.isWindow(n)){(l=n[r])&&(n[r]=null),jQuery.event.triggered=d;try{n[d]()}catch(e){}jQuery.event.triggered=void 0,l&&(n[r]=l)}return e.result}},dispatch:function(e){e=jQuery.event.fix(e);var t,n,i,o,r,s=u.call(arguments),a=(jQuery._data(this,"events")||{})[e.type]||[],l=jQuery.event.special[e.type]||{};if((s[0]=e).delegateTarget=this,!l.preDispatch||!1!==l.preDispatch.call(this,e)){for(r=jQuery.event.handlers.call(this,e,a),t=0;(i=r[t++])&&!e.isPropagationStopped();)for(e.currentTarget=i.elem,o=0;(n=i.handlers[o++])&&!e.isImmediatePropagationStopped();)e.namespace_re&&!e.namespace_re.test(n.namespace)||(e.handleObj=n,e.data=n.data,void 0!==(n=((jQuery.event.special[n.origType]||{}).handle||n.handler).apply(i.elem,s))&&!1===(e.result=n)&&(e.preventDefault(),e.stopPropagation()));return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,i,o,r,s=[],a=t.delegateCount,l=e.target;if(a&&l.nodeType&&(!e.button||"click"!==e.type))for(;l!=this;l=l.parentNode||this)if(1===l.nodeType&&(!0!==l.disabled||"click"!==e.type)){for(o=[],r=0;r<a;r++)void 0===o[n=(i=t[r]).selector+" "]&&(o[n]=i.needsContext?0<=jQuery(n,this).index(l):jQuery.find(n,this,null,[l]).length),o[n]&&o.push(i);o.length&&s.push({elem:l,handlers:o})}return a<t.length&&s.push({elem:this,handlers:t.slice(a)}),s},fix:function(e){if(e[jQuery.expando])return e;var t,n,i,o=e.type,r=e,s=this.fixHooks[o];for(s||(this.fixHooks[o]=s=he.test(o)?this.mouseHooks:fe.test(o)?this.keyHooks:{}),i=s.props?this.props.concat(s.props):this.props,e=new jQuery.Event(r),t=i.length;t--;)e[n=i[t]]=r[n];return e.target||(e.target=r.srcElement||y),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,r):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,i,o=t.button,r=t.fromElement;return null==e.pageX&&null!=t.clientX&&(i=(n=e.target.ownerDocument||y).documentElement,n=n.body,e.pageX=t.clientX+(i&&i.scrollLeft||n&&n.scrollLeft||0)-(i&&i.clientLeft||n&&n.clientLeft||0),e.pageY=t.clientY+(i&&i.scrollTop||n&&n.scrollTop||0)-(i&&i.clientTop||n&&n.clientTop||0)),!e.relatedTarget&&r&&(e.relatedTarget=r===e.target?t.toElement:r),e.which||void 0===o||(e.which=1&o?1:2&o?3:4&o?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==ve()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){if(this===ve()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if(jQuery.nodeName(this,"input")&&"checkbox"===this.type&&this.click)return this.click(),!1},_default:function(e){return jQuery.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,i){e=jQuery.extend(new jQuery.Event,n,{type:e,isSimulated:!0,originalEvent:{}});i?jQuery.event.trigger(e,null,t):jQuery.event.dispatch.call(t,e),e.isDefaultPrevented()&&n.preventDefault()}},jQuery.removeEvent=y.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){t="on"+t;e.detachEvent&&(typeof e[t]==v&&(e[t]=null),e.detachEvent(t,n))},jQuery.Event=function(e,t){if(!(this instanceof jQuery.Event))return new jQuery.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?ye:f):this.type=e,t&&jQuery.extend(this,t),this.timeStamp=e&&e.timeStamp||jQuery.now(),this[jQuery.expando]=!0},jQuery.Event.prototype={isDefaultPrevented:f,isPropagationStopped:f,isImmediatePropagationStopped:f,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=ye,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=ye,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=ye,e&&e.stopImmediatePropagation&&e.stopImmediatePropagation(),this.stopPropagation()}},jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,o){jQuery.event.special[e]={delegateType:o,bindType:o,handle:function(e){var t,n=e.relatedTarget,i=e.handleObj;return n&&(n===this||jQuery.contains(this,n))||(e.type=i.origType,t=i.handler.apply(this,arguments),e.type=o),t}}}),g.submitBubbles||(jQuery.event.special.submit={setup:function(){if(jQuery.nodeName(this,"form"))return!1;jQuery.event.add(this,"click._submit keypress._submit",function(e){e=e.target,e=jQuery.nodeName(e,"input")||jQuery.nodeName(e,"button")?e.form:void 0;e&&!jQuery._data(e,"submitBubbles")&&(jQuery.event.add(e,"submit._submit",function(e){e._submit_bubble=!0}),jQuery._data(e,"submitBubbles",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&jQuery.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){if(jQuery.nodeName(this,"form"))return!1;jQuery.event.remove(this,"._submit")}}),g.changeBubbles||(jQuery.event.special.change={setup:function(){if(pe.test(this.nodeName))return"checkbox"!==this.type&&"radio"!==this.type||(jQuery.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),jQuery.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),jQuery.event.simulate("change",this,e,!0)})),!1;jQuery.event.add(this,"beforeactivate._change",function(e){e=e.target;pe.test(e.nodeName)&&!jQuery._data(e,"changeBubbles")&&(jQuery.event.add(e,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||jQuery.event.simulate("change",this.parentNode,e,!0)}),jQuery._data(e,"changeBubbles",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||"radio"!==t.type&&"checkbox"!==t.type)return e.handleObj.handler.apply(this,arguments)},teardown:function(){return jQuery.event.remove(this,"._change"),!pe.test(this.nodeName)}}),g.focusinBubbles||jQuery.each({focus:"focusin",blur:"focusout"},function(n,i){function o(e){jQuery.event.simulate(i,e.target,jQuery.event.fix(e),!0)}jQuery.event.special[i]={setup:function(){var e=this.ownerDocument||this,t=jQuery._data(e,i);t||e.addEventListener(n,o,!0),jQuery._data(e,i,(t||0)+1)},teardown:function(){var e=this.ownerDocument||this,t=jQuery._data(e,i)-1;t?jQuery._data(e,i,t):(e.removeEventListener(n,o,!0),jQuery._removeData(e,i))}}}),jQuery.fn.extend({on:function(e,t,n,i,o){var r,s;if("object"==typeof e){for(r in"string"!=typeof t&&(n=n||t,t=void 0),e)this.on(r,t,n,e[r],o);return this}if(null==n&&null==i?(i=t,n=t=void 0):null==i&&("string"==typeof t?(i=n,n=void 0):(i=n,n=t,t=void 0)),!1===i)i=f;else if(!i)return this;return 1===o&&(s=i,(i=function(e){return jQuery().off(e),s.apply(this,arguments)}).guid=s.guid||(s.guid=jQuery.guid++)),this.each(function(){jQuery.event.add(this,e,i,n,t)})},one:function(e,t,n,i){return this.on(e,t,n,i,1)},off:function(e,t,n){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,jQuery(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"!=typeof e)return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=f),this.each(function(){jQuery.event.remove(this,e,n,t)});for(o in e)this.off(o,t,e[o]);return this},trigger:function(e,t){return this.each(function(){jQuery.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return jQuery.event.trigger(e,t,n,!0)}});var xe="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",we=/ jQuery\d+="(?:null|\d+)"/g,Ce=new RegExp("<(?:abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video)[\\s/>]","i"),Te=/^\s+/,ke=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,Ee=/<([\w:]+)/,Ne=/<tbody/i,$e=/<|&#?\w+;/,Se=/<(?:script|style|link)/i,je=/checked\s*(?:[^=]|=\s*.checked.)/i,De=/^$|\/(?:java|ecma)script/i,Ae=/^true\/(.*)/,Le=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,x={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:g.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},He=be(y).appendChild(y.createElement("div"));function C(e,t){var n,i,o=0,r=typeof e.getElementsByTagName!=v?e.getElementsByTagName(t||"*"):typeof e.querySelectorAll!=v?e.querySelectorAll(t||"*"):void 0;if(!r)for(r=[],n=e.childNodes||e;null!=(i=n[o]);o++)!t||jQuery.nodeName(i,t)?r.push(i):jQuery.merge(r,C(i,t));return void 0===t||t&&jQuery.nodeName(e,t)?jQuery.merge([e],r):r}function _e(e){ce.test(e.type)&&(e.defaultChecked=e.checked)}function Oe(e,t){return jQuery.nodeName(e,"table")&&jQuery.nodeName(11!==t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function qe(e){return e.type=(null!==jQuery.find.attr(e,"type"))+"/"+e.type,e}function Me(e){var t=Ae.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function Fe(e,t){for(var n,i=0;null!=(n=e[i]);i++)jQuery._data(n,"globalEval",!t||jQuery._data(t[i],"globalEval"))}function Pe(e,t){if(1===t.nodeType&&jQuery.hasData(e)){var n,i,o,e=jQuery._data(e),r=jQuery._data(t,e),s=e.events;if(s)for(n in delete r.handle,r.events={},s)for(i=0,o=s[n].length;i<o;i++)jQuery.event.add(t,n,s[n][i]);r.data&&(r.data=jQuery.extend({},r.data))}}x.optgroup=x.option,x.tbody=x.tfoot=x.colgroup=x.caption=x.thead,x.th=x.td,jQuery.extend({clone:function(e,t,n){var i,o,r,s,a,l=jQuery.contains(e.ownerDocument,e);if(g.html5Clone||jQuery.isXMLDoc(e)||!Ce.test("<"+e.nodeName+">")?r=e.cloneNode(!0):(He.innerHTML=e.outerHTML,He.removeChild(r=He.firstChild)),!(g.noCloneEvent&&g.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||jQuery.isXMLDoc(e)))for(i=C(r),a=C(e),s=0;null!=(o=a[s]);++s)if(i[s]){d=u=c=f=p=void 0;var c,u,d,p=o,f=i[s];if(1===f.nodeType){if(c=f.nodeName.toLowerCase(),!g.noCloneEvent&&f[jQuery.expando]){for(u in(d=jQuery._data(f)).events)jQuery.removeEvent(f,u,d.handle);f.removeAttribute(jQuery.expando)}"script"===c&&f.text!==p.text?(qe(f).text=p.text,Me(f)):"object"===c?(f.parentNode&&(f.outerHTML=p.outerHTML),g.html5Clone&&p.innerHTML&&!jQuery.trim(f.innerHTML)&&(f.innerHTML=p.innerHTML)):"input"===c&&ce.test(p.type)?(f.defaultChecked=f.checked=p.checked,f.value!==p.value&&(f.value=p.value)):"option"===c?f.defaultSelected=f.selected=p.defaultSelected:"input"!==c&&"textarea"!==c||(f.defaultValue=p.defaultValue)}}if(t)if(n)for(a=a||C(e),i=i||C(r),s=0;null!=(o=a[s]);s++)Pe(o,i[s]);else Pe(e,r);return 0<(i=C(r,"script")).length&&Fe(i,!l&&C(e,"script")),i=a=o=null,r},buildFragment:function(e,t,n,i){for(var o,r,s,a,l,c,u,d=e.length,p=be(t),f=[],h=0;h<d;h++)if((r=e[h])||0===r)if("object"===jQuery.type(r))jQuery.merge(f,r.nodeType?[r]:r);else if($e.test(r)){for(a=a||p.appendChild(t.createElement("div")),l=(Ee.exec(r)||["",""])[1].toLowerCase(),u=x[l]||x._default,a.innerHTML=u[1]+r.replace(ke,"<$1></$2>")+u[2],o=u[0];o--;)a=a.lastChild;if(!g.leadingWhitespace&&Te.test(r)&&f.push(t.createTextNode(Te.exec(r)[0])),!g.tbody)for(o=(r="table"!==l||Ne.test(r)?"<table>"!==u[1]||Ne.test(r)?0:a:a.firstChild)&&r.childNodes.length;o--;)jQuery.nodeName(c=r.childNodes[o],"tbody")&&!c.childNodes.length&&r.removeChild(c);for(jQuery.merge(f,a.childNodes),a.textContent="";a.firstChild;)a.removeChild(a.firstChild);a=p.lastChild}else f.push(t.createTextNode(r));for(a&&p.removeChild(a),g.appendChecked||jQuery.grep(C(f,"input"),_e),h=0;r=f[h++];)if((!i||-1===jQuery.inArray(r,i))&&(s=jQuery.contains(r.ownerDocument,r),a=C(p.appendChild(r),"script"),s&&Fe(a),n))for(o=0;r=a[o++];)De.test(r.type||"")&&n.push(r);return a=null,p},cleanData:function(e,t){for(var n,i,o,r,s=0,a=jQuery.expando,l=jQuery.cache,c=g.deleteExpando,u=jQuery.event.special;null!=(n=e[s]);s++)if((t||jQuery.acceptData(n))&&(r=(o=n[a])&&l[o])){if(r.events)for(i in r.events)u[i]?jQuery.event.remove(n,i):jQuery.removeEvent(n,i,r.handle);l[o]&&(delete l[o],c?delete n[a]:typeof n.removeAttribute!=v?n.removeAttribute(a):n[a]=null,d.push(o))}}}),jQuery.fn.extend({text:function(e){return l(this,function(e){return void 0===e?jQuery.text(this):this.empty().append((this[0]&&this[0].ownerDocument||y).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Oe(this,e).appendChild(e)})},prepend:function(){return this.domManip(arguments,function(e){var t;1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(t=Oe(this,e)).insertBefore(e,t.firstChild)})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){for(var n,i=e?jQuery.filter(e,this):this,o=0;null!=(n=i[o]);o++)t||1!==n.nodeType||jQuery.cleanData(C(n)),n.parentNode&&(t&&jQuery.contains(n.ownerDocument,n)&&Fe(C(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){for(var e,t=0;null!=(e=this[t]);t++){for(1===e.nodeType&&jQuery.cleanData(C(e,!1));e.firstChild;)e.removeChild(e.firstChild);e.options&&jQuery.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return jQuery.clone(this,e,t)})},html:function(e){return l(this,function(e){var t=this[0]||{},n=0,i=this.length;if(void 0===e)return 1===t.nodeType?t.innerHTML.replace(we,""):void 0;if("string"==typeof e&&!Se.test(e)&&(g.htmlSerialize||!Ce.test(e))&&(g.leadingWhitespace||!Te.test(e))&&!x[(Ee.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(ke,"<$1></$2>");try{for(;n<i;n++)1===(t=this[n]||{}).nodeType&&(jQuery.cleanData(C(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var t=arguments[0];return this.domManip(arguments,function(e){t=this.parentNode,jQuery.cleanData(C(this)),t&&t.replaceChild(e,this)}),t&&(t.length||t.nodeType)?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(n,i){n=F.apply([],n);var e,t,o,r,s,a,l=0,c=this.length,u=this,d=c-1,p=n[0],f=jQuery.isFunction(p);if(f||1<c&&"string"==typeof p&&!g.checkClone&&je.test(p))return this.each(function(e){var t=u.eq(e);f&&(n[0]=p.call(this,e,t.html())),t.domManip(n,i)});if(c&&(e=(a=jQuery.buildFragment(n,this[0].ownerDocument,!1,this)).firstChild,1===a.childNodes.length&&(a=e),e)){for(o=(r=jQuery.map(C(a,"script"),qe)).length;l<c;l++)t=a,l!==d&&(t=jQuery.clone(t,!0,!0),o&&jQuery.merge(r,C(t,"script"))),i.call(this[l],t,l);if(o)for(s=r[r.length-1].ownerDocument,jQuery.map(r,Me),l=0;l<o;l++)t=r[l],De.test(t.type||"")&&!jQuery._data(t,"globalEval")&&jQuery.contains(s,t)&&(t.src?jQuery._evalUrl&&jQuery._evalUrl(t.src):jQuery.globalEval((t.text||t.textContent||t.innerHTML||"").replace(Le,"")));a=e=null}return this}}),jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,s){jQuery.fn[e]=function(e){for(var t,n=0,i=[],o=jQuery(e),r=o.length-1;n<=r;n++)t=n===r?this:this.clone(!0),jQuery(o[n])[s](t),P.apply(i,t.get());return this.pushStack(i)}});var Re,T,Be={};function We(e,t){e=jQuery(t.createElement(e)).appendTo(t.body),t=h.getDefaultComputedStyle&&(t=h.getDefaultComputedStyle(e[0]))?t.display:jQuery.css(e[0],"display");return e.detach(),t}function ze(e){var t=y,n=Be[e];return n||("none"!==(n=We(e,t))&&n||((t=((Re=(Re||jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentWindow||Re[0].contentDocument).document).write(),t.close(),n=We(e,t),Re.detach()),Be[e]=n),n}g.shrinkWrapBlocks=function(){return null!=T?T:(T=!1,(t=y.getElementsByTagName("body")[0])&&t.style?(e=y.createElement("div"),(n=y.createElement("div")).style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",t.appendChild(n).appendChild(e),typeof e.style.zoom!=v&&(e.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",e.appendChild(y.createElement("div")).style.width="5px",T=3!==e.offsetWidth),t.removeChild(n),T):void 0);var e,t,n};var k,E,Ie,Qe,Xe,Ue,Ve=/^margin/,Je=new RegExp("^("+e+")(?!px)[a-z%]+$","i"),Ye=/^(top|right|bottom|left)$/;function Ze(t,n){return{get:function(){var e=t();if(null!=e){if(!e)return(this.get=n).apply(this,arguments);delete this.get}}}}function Ge(){var e,t,n,i=y.getElementsByTagName("body")[0];i&&i.style&&(e=y.createElement("div"),(t=y.createElement("div")).style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",i.appendChild(t).appendChild(e),e.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",Ie=Qe=!1,Ue=!0,h.getComputedStyle&&(Ie="1%"!==(h.getComputedStyle(e,null)||{}).top,Qe="4px"===(h.getComputedStyle(e,null)||{width:"4px"}).width,(n=e.appendChild(y.createElement("div"))).style.cssText=e.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",n.style.marginRight=n.style.width="0",e.style.width="1px",Ue=!parseFloat((h.getComputedStyle(n,null)||{}).marginRight)),e.innerHTML="<table><tr><td></td><td>t</td></tr></table>",(n=e.getElementsByTagName("td"))[0].style.cssText="margin:0;border:0;padding:0;display:none",(Xe=0===n[0].offsetHeight)&&(n[0].style.display="",n[1].style.display="none",Xe=0===n[0].offsetHeight),i.removeChild(t))}h.getComputedStyle?(k=function(e){return e.ownerDocument.defaultView.getComputedStyle(e,null)},E=function(e,t,n){var i,o=e.style,r=(n=n||k(e))?n.getPropertyValue(t)||n[t]:void 0;return n&&(""!==r||jQuery.contains(e.ownerDocument,e)||(r=jQuery.style(e,t)),Je.test(r)&&Ve.test(t)&&(e=o.width,t=o.minWidth,i=o.maxWidth,o.minWidth=o.maxWidth=o.width=r,r=n.width,o.width=e,o.minWidth=t,o.maxWidth=i)),void 0===r?r:r+""}):y.documentElement.currentStyle&&(k=function(e){return e.currentStyle},E=function(e,t,n){var i,o,r,s=e.style;return null==(n=(n=n||k(e))?n[t]:void 0)&&s&&s[t]&&(n=s[t]),Je.test(n)&&!Ye.test(t)&&(i=s.left,(r=(o=e.runtimeStyle)&&o.left)&&(o.left=e.currentStyle.left),s.left="fontSize"===t?"1em":n,n=s.pixelLeft+"px",s.left=i,r&&(o.left=r)),void 0===n?n:n+""||"auto"}),(r=y.createElement("div")).innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",(c=(c=r.getElementsByTagName("a")[0])&&c.style)&&(c.cssText="float:left;opacity:.5",g.opacity="0.5"===c.opacity,g.cssFloat=!!c.cssFloat,r.style.backgroundClip="content-box",r.cloneNode(!0).style.backgroundClip="",g.clearCloneStyle="content-box"===r.style.backgroundClip,g.boxSizing=""===c.boxSizing||""===c.MozBoxSizing||""===c.WebkitBoxSizing,jQuery.extend(g,{reliableHiddenOffsets:function(){return null==Xe&&Ge(),Xe},boxSizingReliable:function(){return null==Qe&&Ge(),Qe},pixelPosition:function(){return null==Ie&&Ge(),Ie},reliableMarginRight:function(){return null==Ue&&Ge(),Ue}})),jQuery.swap=function(e,t,n,i){var o,r={};for(o in t)r[o]=e.style[o],e.style[o]=t[o];for(o in n=n.apply(e,i||[]),t)e.style[o]=r[o];return n};var Ke=/alpha\([^)]*\)/i,et=/opacity\s*=\s*([^)]*)/,tt=/^(none|table(?!-c[ea]).+)/,nt=new RegExp("^("+e+")(.*)$","i"),it=new RegExp("^([+-])=("+e+")","i"),ot={position:"absolute",visibility:"hidden",display:"block"},rt={letterSpacing:"0",fontWeight:"400"},st=["Webkit","O","Moz","ms"];function at(e,t){if(t in e)return t;for(var n=t.charAt(0).toUpperCase()+t.slice(1),i=t,o=st.length;o--;)if((t=st[o]+n)in e)return t;return i}function lt(e,t){for(var n,i,o,r=[],s=0,a=e.length;s<a;s++)(i=e[s]).style&&(r[s]=jQuery._data(i,"olddisplay"),n=i.style.display,t?(r[s]||"none"!==n||(i.style.display=""),""===i.style.display&&b(i)&&(r[s]=jQuery._data(i,"olddisplay",ze(i.nodeName)))):(o=b(i),(n&&"none"!==n||!o)&&jQuery._data(i,"olddisplay",o?n:jQuery.css(i,"display"))));for(s=0;s<a;s++)!(i=e[s]).style||t&&"none"!==i.style.display&&""!==i.style.display||(i.style.display=t?r[s]||"":"none");return e}function ct(e,t,n){var i=nt.exec(t);return i?Math.max(0,i[1]-(n||0))+(i[2]||"px"):t}function ut(e,t,n,i,o){for(var r=n===(i?"border":"content")?4:"width"===t?1:0,s=0;r<4;r+=2)"margin"===n&&(s+=jQuery.css(e,n+a[r],!0,o)),i?("content"===n&&(s-=jQuery.css(e,"padding"+a[r],!0,o)),"margin"!==n&&(s-=jQuery.css(e,"border"+a[r]+"Width",!0,o))):(s+=jQuery.css(e,"padding"+a[r],!0,o),"padding"!==n&&(s+=jQuery.css(e,"border"+a[r]+"Width",!0,o)));return s}function dt(e,t,n){var i=!0,o="width"===t?e.offsetWidth:e.offsetHeight,r=k(e),s=g.boxSizing&&"border-box"===jQuery.css(e,"boxSizing",!1,r);if(o<=0||null==o){if(((o=E(e,t,r))<0||null==o)&&(o=e.style[t]),Je.test(o))return o;i=s&&(g.boxSizingReliable()||o===e.style[t]),o=parseFloat(o)||0}return o+ut(e,t,n||(s?"border":"content"),i,r)+"px"}function N(e,t,n,i,o){return new N.prototype.init(e,t,n,i,o)}jQuery.extend({cssHooks:{opacity:{get:function(e,t){if(t)return""===(t=E(e,"opacity"))?"1":t}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{float:g.cssFloat?"cssFloat":"styleFloat"},style:function(e,t,n,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,r,s,a=jQuery.camelCase(t),l=e.style;if(t=jQuery.cssProps[a]||(jQuery.cssProps[a]=at(l,a)),s=jQuery.cssHooks[t]||jQuery.cssHooks[a],void 0===n)return s&&"get"in s&&void 0!==(o=s.get(e,!1,i))?o:l[t];if("string"===(r=typeof n)&&(o=it.exec(n))&&(n=(o[1]+1)*o[2]+parseFloat(jQuery.css(e,t)),r="number"),null!=n&&n==n&&("number"!==r||jQuery.cssNumber[a]||(n+="px"),g.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),!(s&&"set"in s&&void 0===(n=s.set(e,n,i)))))try{l[t]=n}catch(e){}}},css:function(e,t,n,i){var o,r=jQuery.camelCase(t);return t=jQuery.cssProps[r]||(jQuery.cssProps[r]=at(e.style,r)),"normal"===(o=void 0===(o=(r=jQuery.cssHooks[t]||jQuery.cssHooks[r])&&"get"in r?r.get(e,!0,n):o)?E(e,t,i):o)&&t in rt&&(o=rt[t]),""===n||n?(r=parseFloat(o),!0===n||jQuery.isNumeric(r)?r||0:o):o}}),jQuery.each(["height","width"],function(e,o){jQuery.cssHooks[o]={get:function(e,t,n){if(t)return tt.test(jQuery.css(e,"display"))&&0===e.offsetWidth?jQuery.swap(e,ot,function(){return dt(e,o,n)}):dt(e,o,n)},set:function(e,t,n){var i=n&&k(e);return ct(0,t,n?ut(e,o,n,g.boxSizing&&"border-box"===jQuery.css(e,"boxSizing",!1,i),i):0)}}}),g.opacity||(jQuery.cssHooks.opacity={get:function(e,t){return et.test((t&&e.currentStyle?e.currentStyle:e.style).filter||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,e=e.currentStyle,i=jQuery.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=e&&e.filter||n.filter||"";((n.zoom=1)<=t||""===t)&&""===jQuery.trim(o.replace(Ke,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||e&&!e.filter)||(n.filter=Ke.test(o)?o.replace(Ke,i):o+" "+i)}}),jQuery.cssHooks.marginRight=Ze(g.reliableMarginRight,function(e,t){if(t)return jQuery.swap(e,{display:"inline-block"},E,[e,"marginRight"])}),jQuery.each({margin:"",padding:"",border:"Width"},function(o,r){jQuery.cssHooks[o+r]={expand:function(e){for(var t=0,n={},i="string"==typeof e?e.split(" "):[e];t<4;t++)n[o+a[t]+r]=i[t]||i[t-2]||i[0];return n}},Ve.test(o)||(jQuery.cssHooks[o+r].set=ct)}),jQuery.fn.extend({css:function(e,t){return l(this,function(e,t,n){var i,o,r={},s=0;if(jQuery.isArray(t)){for(i=k(e),o=t.length;s<o;s++)r[t[s]]=jQuery.css(e,t[s],!1,i);return r}return void 0!==n?jQuery.style(e,t,n):jQuery.css(e,t)},e,t,1<arguments.length)},show:function(){return lt(this,!0)},hide:function(){return lt(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){b(this)?jQuery(this).show():jQuery(this).hide()})}}),((jQuery.Tween=N).prototype={constructor:N,init:function(e,t,n,i,o,r){this.elem=e,this.prop=n,this.easing=o||"swing",this.options=t,this.start=this.now=this.cur(),this.end=i,this.unit=r||(jQuery.cssNumber[n]?"":"px")},cur:function(){var e=N.propHooks[this.prop];return(e&&e.get?e:N.propHooks._default).get(this)},run:function(e){var t,n=N.propHooks[this.prop];return this.options.duration?this.pos=t=jQuery.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),(n&&n.set?n:N.propHooks._default).set(this),this}}).init.prototype=N.prototype,(N.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=jQuery.css(e.elem,e.prop,""))&&"auto"!==t?t:0:e.elem[e.prop]},set:function(e){jQuery.fx.step[e.prop]?jQuery.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[jQuery.cssProps[e.prop]]||jQuery.cssHooks[e.prop])?jQuery.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}}).scrollTop=N.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},jQuery.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},jQuery.fx=N.prototype.init,jQuery.fx.step={};var S,pt,j,ft=/^(?:toggle|show|hide)$/,ht=new RegExp("^(?:([+-])=|)("+e+")([a-z%]*)$","i"),mt=/queueHooks$/,gt=[function(t,e,n){var i,o,r,s,a,l,c,u=this,d={},p=t.style,f=t.nodeType&&b(t),h=jQuery._data(t,"fxshow");n.queue||(null==(a=jQuery._queueHooks(t,"fx")).unqueued&&(a.unqueued=0,l=a.empty.fire,a.empty.fire=function(){a.unqueued||l()}),a.unqueued++,u.always(function(){u.always(function(){a.unqueued--,jQuery.queue(t,"fx").length||a.empty.fire()})}));1===t.nodeType&&("height"in e||"width"in e)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],c=jQuery.css(t,"display"),"inline"===("none"===c?jQuery._data(t,"olddisplay")||ze(t.nodeName):c)&&"none"===jQuery.css(t,"float")&&(g.inlineBlockNeedsLayout&&"inline"!==ze(t.nodeName)?p.zoom=1:p.display="inline-block"));n.overflow&&(p.overflow="hidden",g.shrinkWrapBlocks()||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(i in e)if(o=e[i],ft.exec(o)){if(delete e[i],r=r||"toggle"===o,o===(f?"hide":"show")){if("show"!==o||!h||void 0===h[i])continue;f=!0}d[i]=h&&h[i]||jQuery.style(t,i)}else c=void 0;if(jQuery.isEmptyObject(d))"inline"===("none"===c?ze(t.nodeName):c)&&(p.display=c);else for(i in h?"hidden"in h&&(f=h.hidden):h=jQuery._data(t,"fxshow",{}),r&&(h.hidden=!f),f?jQuery(t).show():u.done(function(){jQuery(t).hide()}),u.done(function(){for(var e in jQuery._removeData(t,"fxshow"),d)jQuery.style(t,e,d[e])}),d)s=bt(f?h[i]:0,i,u),i in h||(h[i]=s.start,f&&(s.end=s.start,s.start="width"===i||"height"===i?1:0))}],D={"*":[function(e,t){var n=this.createTween(e,t),i=n.cur(),t=ht.exec(t),o=t&&t[3]||(jQuery.cssNumber[e]?"":"px"),r=(jQuery.cssNumber[e]||"px"!==o&&+i)&&ht.exec(jQuery.css(n.elem,e)),s=1,a=20;if(r&&r[3]!==o)for(o=o||r[3],t=t||[],r=+i||1;r/=s=s||".5",jQuery.style(n.elem,e,r+o),s!==(s=n.cur()/i)&&1!==s&&--a;);return t&&(r=n.start=+r||+i||0,n.unit=o,n.end=t[1]?r+(t[1]+1)*t[2]:+t[2]),n}]};function yt(){return setTimeout(function(){S=void 0}),S=jQuery.now()}function vt(e,t){var n,i={height:e},o=0;for(t=t?1:0;o<4;o+=2-t)i["margin"+(n=a[o])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function bt(e,t,n){for(var i,o=(D[t]||[]).concat(D["*"]),r=0,s=o.length;r<s;r++)if(i=o[r].call(n,t,e))return i}function xt(o,e,t){var n,r,i,s,a,l,c,u=0,d=gt.length,p=jQuery.Deferred().always(function(){delete f.elem}),f=function(){if(r)return!1;for(var e=S||yt(),e=Math.max(0,h.startTime+h.duration-e),t=1-(e/h.duration||0),n=0,i=h.tweens.length;n<i;n++)h.tweens[n].run(t);return p.notifyWith(o,[h,t,e]),t<1&&i?e:(p.resolveWith(o,[h]),!1)},h=p.promise({elem:o,props:jQuery.extend({},e),opts:jQuery.extend(!0,{specialEasing:{}},t),originalProperties:e,originalOptions:t,startTime:S||yt(),duration:t.duration,tweens:[],createTween:function(e,t){t=jQuery.Tween(o,h.opts,e,t,h.opts.specialEasing[e]||h.opts.easing);return h.tweens.push(t),t},stop:function(e){var t=0,n=e?h.tweens.length:0;if(!r){for(r=!0;t<n;t++)h.tweens[t].run(1);e?p.resolveWith(o,[h,e]):p.rejectWith(o,[h,e])}return this}}),m=h.props,g=m,y=h.opts.specialEasing;for(i in g)if(a=y[s=jQuery.camelCase(i)],l=g[i],jQuery.isArray(l)&&(a=l[1],l=g[i]=l[0]),i!==s&&(g[s]=l,delete g[i]),(c=jQuery.cssHooks[s])&&"expand"in c)for(i in l=c.expand(l),delete g[s],l)i in g||(g[i]=l[i],y[i]=a);else y[s]=a;for(;u<d;u++)if(n=gt[u].call(h,o,m,h.opts))return n;return jQuery.map(m,bt,h),jQuery.isFunction(h.opts.start)&&h.opts.start.call(o,h),jQuery.fx.timer(jQuery.extend(f,{elem:o,anim:h,queue:h.opts.queue})),h.progress(h.opts.progress).done(h.opts.done,h.opts.complete).fail(h.opts.fail).always(h.opts.always)}jQuery.Animation=jQuery.extend(xt,{tweener:function(e,t){for(var n,i=0,o=(e=jQuery.isFunction(e)?(t=e,["*"]):e.split(" ")).length;i<o;i++)n=e[i],D[n]=D[n]||[],D[n].unshift(t)},prefilter:function(e,t){t?gt.unshift(e):gt.push(e)}}),jQuery.speed=function(e,t,n){var i=e&&"object"==typeof e?jQuery.extend({},e):{complete:n||!n&&t||jQuery.isFunction(e)&&e,duration:e,easing:n&&t||t&&!jQuery.isFunction(t)&&t};return i.duration=jQuery.fx.off?0:"number"==typeof i.duration?i.duration:i.duration in jQuery.fx.speeds?jQuery.fx.speeds[i.duration]:jQuery.fx.speeds._default,null!=i.queue&&!0!==i.queue||(i.queue="fx"),i.old=i.complete,i.complete=function(){jQuery.isFunction(i.old)&&i.old.call(this),i.queue&&jQuery.dequeue(this,i.queue)},i},jQuery.fn.extend({fadeTo:function(e,t,n,i){return this.filter(b).css("opacity",0).show().end().animate({opacity:t},e,n,i)},animate:function(t,e,n,i){function o(){var e=xt(this,jQuery.extend({},t),s);(r||jQuery._data(this,"finish"))&&e.stop(!0)}var r=jQuery.isEmptyObject(t),s=jQuery.speed(e,n,i);return o.finish=o,r||!1===s.queue?this.each(o):this.queue(s.queue,o)},stop:function(o,e,r){function s(e){var t=e.stop;delete e.stop,t(r)}return"string"!=typeof o&&(r=e,e=o,o=void 0),e&&!1!==o&&this.queue(o||"fx",[]),this.each(function(){var e=!0,t=null!=o&&o+"queueHooks",n=jQuery.timers,i=jQuery._data(this);if(t)i[t]&&i[t].stop&&s(i[t]);else for(t in i)i[t]&&i[t].stop&&mt.test(t)&&s(i[t]);for(t=n.length;t--;)n[t].elem!==this||null!=o&&n[t].queue!==o||(n[t].anim.stop(r),e=!1,n.splice(t,1));!e&&r||jQuery.dequeue(this,o)})},finish:function(s){return!1!==s&&(s=s||"fx"),this.each(function(){var e,t=jQuery._data(this),n=t[s+"queue"],i=t[s+"queueHooks"],o=jQuery.timers,r=n?n.length:0;for(t.finish=!0,jQuery.queue(this,s,[]),i&&i.stop&&i.stop.call(this,!0),e=o.length;e--;)o[e].elem===this&&o[e].queue===s&&(o[e].anim.stop(!0),o.splice(e,1));for(e=0;e<r;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),jQuery.each(["toggle","show","hide"],function(e,i){var o=jQuery.fn[i];jQuery.fn[i]=function(e,t,n){return null==e||"boolean"==typeof e?o.apply(this,arguments):this.animate(vt(i,!0),e,t,n)}}),jQuery.each({slideDown:vt("show"),slideUp:vt("hide"),slideToggle:vt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,i){jQuery.fn[e]=function(e,t,n){return this.animate(i,e,t,n)}}),jQuery.timers=[],jQuery.fx.tick=function(){var e,t=jQuery.timers,n=0;for(S=jQuery.now();n<t.length;n++)(e=t[n])()||t[n]!==e||t.splice(n--,1);t.length||jQuery.fx.stop(),S=void 0},jQuery.fx.timer=function(e){jQuery.timers.push(e),e()?jQuery.fx.start():jQuery.timers.pop()},jQuery.fx.interval=13,jQuery.fx.start=function(){pt=pt||setInterval(jQuery.fx.tick,jQuery.fx.interval)},jQuery.fx.stop=function(){clearInterval(pt),pt=null},jQuery.fx.speeds={slow:600,fast:200,_default:400},jQuery.fn.delay=function(i,e){return i=jQuery.fx&&jQuery.fx.speeds[i]||i,this.queue(e=e||"fx",function(e,t){var n=setTimeout(e,i);t.stop=function(){clearTimeout(n)}})},(s=y.createElement("div")).setAttribute("className","t"),s.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",r=s.getElementsByTagName("a")[0],e=(c=y.createElement("select")).appendChild(y.createElement("option")),j=s.getElementsByTagName("input")[0],r.style.cssText="top:1px",g.getSetAttribute="t"!==s.className,g.style=/top/.test(r.getAttribute("style")),g.hrefNormalized="/a"===r.getAttribute("href"),g.checkOn=!!j.value,g.optSelected=e.selected,g.enctype=!!y.createElement("form").enctype,c.disabled=!0,g.optDisabled=!e.disabled,(j=y.createElement("input")).setAttribute("value",""),g.input=""===j.getAttribute("value"),j.value="t",j.setAttribute("type","radio"),g.radioValue="t"===j.value;var wt=/\r/g;jQuery.fn.extend({val:function(t){var n,e,i,o=this[0];return arguments.length?(i=jQuery.isFunction(t),this.each(function(e){1===this.nodeType&&(null==(e=i?t.call(this,e,jQuery(this).val()):t)?e="":"number"==typeof e?e+="":jQuery.isArray(e)&&(e=jQuery.map(e,function(e){return null==e?"":e+""})),(n=jQuery.valHooks[this.type]||jQuery.valHooks[this.nodeName.toLowerCase()])&&"set"in n&&void 0!==n.set(this,e,"value")||(this.value=e))})):o?(n=jQuery.valHooks[o.type]||jQuery.valHooks[o.nodeName.toLowerCase()])&&"get"in n&&void 0!==(e=n.get(o,"value"))?e:"string"==typeof(e=o.value)?e.replace(wt,""):null==e?"":e:void 0}}),jQuery.extend({valHooks:{option:{get:function(e){var t=jQuery.find.attr(e,"value");return null!=t?t:jQuery.trim(jQuery.text(e))}},select:{get:function(e){for(var t,n=e.options,i=e.selectedIndex,o="select-one"===e.type||i<0,r=o?null:[],s=o?i+1:n.length,a=i<0?s:o?i:0;a<s;a++)if(((t=n[a]).selected||a===i)&&(g.optDisabled?!t.disabled:null===t.getAttribute("disabled"))&&(!t.parentNode.disabled||!jQuery.nodeName(t.parentNode,"optgroup"))){if(t=jQuery(t).val(),o)return t;r.push(t)}return r},set:function(e,t){for(var n,i,o=e.options,r=jQuery.makeArray(t),s=o.length;s--;)if(i=o[s],0<=jQuery.inArray(jQuery.valHooks.option.get(i),r))try{i.selected=n=!0}catch(e){i.scrollHeight}else i.selected=!1;return n||(e.selectedIndex=-1),o}}}}),jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={set:function(e,t){if(jQuery.isArray(t))return e.checked=0<=jQuery.inArray(jQuery(e).val(),t)}},g.checkOn||(jQuery.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var A,Ct,L=jQuery.expr.attrHandle,Tt=/^(?:checked|selected)$/i,H=g.getSetAttribute,kt=g.input,Et=(jQuery.fn.extend({attr:function(e,t){return l(this,jQuery.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){jQuery.removeAttr(this,e)})}}),jQuery.extend({attr:function(e,t,n){var i,o,r=e.nodeType;if(e&&3!==r&&8!==r&&2!==r)return typeof e.getAttribute==v?jQuery.prop(e,t,n):(1===r&&jQuery.isXMLDoc(e)||(t=t.toLowerCase(),i=jQuery.attrHooks[t]||(jQuery.expr.match.bool.test(t)?Ct:A)),void 0===n?!(i&&"get"in i&&null!==(o=i.get(e,t)))&&null==(o=jQuery.find.attr(e,t))?void 0:o:null!==n?i&&"set"in i&&void 0!==(o=i.set(e,n,t))?o:(e.setAttribute(t,n+""),n):void jQuery.removeAttr(e,t))},removeAttr:function(e,t){var n,i,o=0,r=t&&t.match(w);if(r&&1===e.nodeType)for(;n=r[o++];)i=jQuery.propFix[n]||n,jQuery.expr.match.bool.test(n)?kt&&H||!Tt.test(n)?e[i]=!1:e[jQuery.camelCase("default-"+n)]=e[i]=!1:jQuery.attr(e,n,""),e.removeAttribute(H?n:i)},attrHooks:{type:{set:function(e,t){var n;if(!g.radioValue&&"radio"===t&&jQuery.nodeName(e,"input"))return n=e.value,e.setAttribute("type",t),n&&(e.value=n),t}}}}),Ct={set:function(e,t,n){return!1===t?jQuery.removeAttr(e,n):kt&&H||!Tt.test(n)?e.setAttribute(!H&&jQuery.propFix[n]||n,n):e[jQuery.camelCase("default-"+n)]=e[n]=!0,n}},jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g),function(e,t){var r=L[t]||jQuery.find.attr;L[t]=kt&&H||!Tt.test(t)?function(e,t,n){var i,o;return n||(o=L[t],L[t]=i,i=null!=r(e,t,n)?t.toLowerCase():null,L[t]=o),i}:function(e,t,n){if(!n)return e[jQuery.camelCase("default-"+t)]?t.toLowerCase():null}}),kt&&H||(jQuery.attrHooks.value={set:function(e,t,n){if(!jQuery.nodeName(e,"input"))return A&&A.set(e,t,n);e.defaultValue=t}}),H||(A={set:function(e,t,n){var i=e.getAttributeNode(n);if(i||e.setAttributeNode(i=e.ownerDocument.createAttribute(n)),i.value=t+="","value"===n||t===e.getAttribute(n))return t}},L.id=L.name=L.coords=function(e,t,n){if(!n)return(n=e.getAttributeNode(t))&&""!==n.value?n.value:null},jQuery.valHooks.button={get:function(e,t){e=e.getAttributeNode(t);if(e&&e.specified)return e.value},set:A.set},jQuery.attrHooks.contenteditable={set:function(e,t,n){A.set(e,""!==t&&t,n)}},jQuery.each(["width","height"],function(e,n){jQuery.attrHooks[n]={set:function(e,t){if(""===t)return e.setAttribute(n,"auto"),t}}})),g.style||(jQuery.attrHooks.style={get:function(e){return e.style.cssText||void 0},set:function(e,t){return e.style.cssText=t+""}}),/^(?:input|select|textarea|button|object)$/i),Nt=/^(?:a|area)$/i,$t=(jQuery.fn.extend({prop:function(e,t){return l(this,jQuery.prop,e,t,1<arguments.length)},removeProp:function(e){return e=jQuery.propFix[e]||e,this.each(function(){try{this[e]=void 0,delete this[e]}catch(e){}})}}),jQuery.extend({propFix:{for:"htmlFor",class:"className"},prop:function(e,t,n){var i,o,r=e.nodeType;if(e&&3!==r&&8!==r&&2!==r)return(1!==r||!jQuery.isXMLDoc(e))&&(t=jQuery.propFix[t]||t,o=jQuery.propHooks[t]),void 0!==n?o&&"set"in o&&void 0!==(i=o.set(e,n,t))?i:e[t]=n:o&&"get"in o&&null!==(i=o.get(e,t))?i:e[t]},propHooks:{tabIndex:{get:function(e){var t=jQuery.find.attr(e,"tabindex");return t?parseInt(t,10):Et.test(e.nodeName)||Nt.test(e.nodeName)&&e.href?0:-1}}}}),g.hrefNormalized||jQuery.each(["href","src"],function(e,t){jQuery.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),g.optSelected||(jQuery.propHooks.selected={get:function(e){e=e.parentNode;return e&&(e.selectedIndex,e.parentNode&&e.parentNode.selectedIndex),null}}),jQuery.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){jQuery.propFix[this.toLowerCase()]=this}),g.enctype||(jQuery.propFix.enctype="encoding"),/[\t\r\n\f]/g),St=(jQuery.fn.extend({addClass:function(t){var e,n,i,o,r,s,a=0,l=this.length,c="string"==typeof t&&t;if(jQuery.isFunction(t))return this.each(function(e){jQuery(this).addClass(t.call(this,e,this.className))});if(c)for(e=(t||"").match(w)||[];a<l;a++)if(i=1===(n=this[a]).nodeType&&(n.className?(" "+n.className+" ").replace($t," "):" ")){for(r=0;o=e[r++];)i.indexOf(" "+o+" ")<0&&(i+=o+" ");s=jQuery.trim(i),n.className!==s&&(n.className=s)}return this},removeClass:function(t){var e,n,i,o,r,s,a=0,l=this.length,c=0===arguments.length||"string"==typeof t&&t;if(jQuery.isFunction(t))return this.each(function(e){jQuery(this).removeClass(t.call(this,e,this.className))});if(c)for(e=(t||"").match(w)||[];a<l;a++)if(i=1===(n=this[a]).nodeType&&(n.className?(" "+n.className+" ").replace($t," "):"")){for(r=0;o=e[r++];)for(;0<=i.indexOf(" "+o+" ");)i=i.replace(" "+o+" "," ");s=t?jQuery.trim(i):"",n.className!==s&&(n.className=s)}return this},toggleClass:function(o,t){var r=typeof o;return"boolean"==typeof t&&"string"==r?t?this.addClass(o):this.removeClass(o):jQuery.isFunction(o)?this.each(function(e){jQuery(this).toggleClass(o.call(this,e,this.className,t),t)}):this.each(function(){if("string"==r)for(var e,t=0,n=jQuery(this),i=o.match(w)||[];e=i[t++];)n.hasClass(e)?n.removeClass(e):n.addClass(e);else r!=v&&"boolean"!=r||(this.className&&jQuery._data(this,"__className__",this.className),this.className=!this.className&&!1!==o&&jQuery._data(this,"__className__")||"")})},hasClass:function(e){for(var t=" "+e+" ",n=0,i=this.length;n<i;n++)if(1===this[n].nodeType&&0<=(" "+this[n].className+" ").replace($t," ").indexOf(t))return!0;return!1}}),jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,n){jQuery.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}}),jQuery.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,i){return this.on(t,e,n,i)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),jQuery.now()),jt=/\?/,Dt=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;jQuery.parseJSON=function(e){if(h.JSON&&h.JSON.parse)return h.JSON.parse(e+"");var o,r=null,t=jQuery.trim(e+"");return t&&!jQuery.trim(t.replace(Dt,function(e,t,n,i){return 0===(r=o&&t?0:r)?e:(o=n||t,r+=!i-!n,"")}))?Function("return "+t)():jQuery.error("Invalid JSON: "+e)},jQuery.parseXML=function(e){var t;if(!e||"string"!=typeof e)return null;try{h.DOMParser?t=(new DOMParser).parseFromString(e,"text/xml"):((t=new ActiveXObject("Microsoft.XMLDOM")).async="false",t.loadXML(e))}catch(e){t=void 0}return t&&t.documentElement&&!t.getElementsByTagName("parsererror").length||jQuery.error("Invalid XML: "+e),t};var _,O,At=/#.*$/,Lt=/([?&])_=[^&]*/,Ht=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,_t=/^(?:GET|HEAD)$/,Ot=/^\/\//,qt=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Mt={},Ft={},Pt="*/".concat("*");try{O=location.href}catch(e){(O=y.createElement("a")).href="",O=O.href}function Rt(r){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,i=0,o=e.toLowerCase().match(w)||[];if(jQuery.isFunction(t))for(;n=o[i++];)"+"===n.charAt(0)?(n=n.slice(1)||"*",(r[n]=r[n]||[]).unshift(t)):(r[n]=r[n]||[]).push(t)}}function Bt(t,i,o,r){var s={},a=t===Ft;function l(e){var n;return s[e]=!0,jQuery.each(t[e]||[],function(e,t){t=t(i,o,r);return"string"!=typeof t||a||s[t]?a?!(n=t):void 0:(i.dataTypes.unshift(t),l(t),!1)}),n}return l(i.dataTypes[0])||!s["*"]&&l("*")}function Wt(e,t){var n,i,o=jQuery.ajaxSettings.flatOptions||{};for(i in t)void 0!==t[i]&&((o[i]?e:n=n||{})[i]=t[i]);return n&&jQuery.extend(!0,e,n),e}_=qt.exec(O.toLowerCase())||[],jQuery.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:O,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(_[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Pt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":jQuery.parseJSON,"text xml":jQuery.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Wt(Wt(e,jQuery.ajaxSettings),t):Wt(jQuery.ajaxSettings,e)},ajaxPrefilter:Rt(Mt),ajaxTransport:Rt(Ft),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0);var n,l,c,u,d,p,i,f=jQuery.ajaxSetup({},t=t||{}),h=f.context||f,m=f.context&&(h.nodeType||h.jquery)?jQuery(h):jQuery.event,g=jQuery.Deferred(),y=jQuery.Callbacks("once memory"),v=f.statusCode||{},o={},r={},b=0,s="canceled",x={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!i)for(i={};t=Ht.exec(c);)i[t[1].toLowerCase()]=t[2];t=i[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?c:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=r[n]=r[n]||e,o[e]=t),this},overrideMimeType:function(e){return b||(f.mimeType=e),this},statusCode:function(e){if(e)if(b<2)for(var t in e)v[t]=[v[t],e[t]];else x.always(e[x.status]);return this},abort:function(e){e=e||s;return p&&p.abort(e),a(0,e),this}};if(g.promise(x).complete=y.add,x.success=x.done,x.error=x.fail,f.url=((e||f.url||O)+"").replace(At,"").replace(Ot,_[1]+"//"),f.type=t.method||t.type||f.method||f.type,f.dataTypes=jQuery.trim(f.dataType||"*").toLowerCase().match(w)||[""],null==f.crossDomain&&(e=qt.exec(f.url.toLowerCase()),f.crossDomain=!(!e||e[1]===_[1]&&e[2]===_[2]&&(e[3]||("http:"===e[1]?"80":"443"))===(_[3]||("http:"===_[1]?"80":"443")))),f.data&&f.processData&&"string"!=typeof f.data&&(f.data=jQuery.param(f.data,f.traditional)),Bt(Mt,f,t,x),2!==b){for(n in(d=f.global)&&0==jQuery.active++&&jQuery.event.trigger("ajaxStart"),f.type=f.type.toUpperCase(),f.hasContent=!_t.test(f.type),l=f.url,f.hasContent||(f.data&&(l=f.url+=(jt.test(l)?"&":"?")+f.data,delete f.data),!1===f.cache&&(f.url=Lt.test(l)?l.replace(Lt,"$1_="+St++):l+(jt.test(l)?"&":"?")+"_="+St++)),f.ifModified&&(jQuery.lastModified[l]&&x.setRequestHeader("If-Modified-Since",jQuery.lastModified[l]),jQuery.etag[l]&&x.setRequestHeader("If-None-Match",jQuery.etag[l])),(f.data&&f.hasContent&&!1!==f.contentType||t.contentType)&&x.setRequestHeader("Content-Type",f.contentType),x.setRequestHeader("Accept",f.dataTypes[0]&&f.accepts[f.dataTypes[0]]?f.accepts[f.dataTypes[0]]+("*"!==f.dataTypes[0]?", "+Pt+"; q=0.01":""):f.accepts["*"]),f.headers)x.setRequestHeader(n,f.headers[n]);if(f.beforeSend&&(!1===f.beforeSend.call(h,x,f)||2===b))return x.abort();for(n in s="abort",{success:1,error:1,complete:1})x[n](f[n]);if(p=Bt(Ft,f,t,x)){x.readyState=1,d&&m.trigger("ajaxSend",[x,f]),f.async&&0<f.timeout&&(u=setTimeout(function(){x.abort("timeout")},f.timeout));try{b=1,p.send(o,a)}catch(e){if(!(b<2))throw e;a(-1,e)}}else a(-1,"No Transport")}return x;function a(e,t,n,i){var o,r,s,a=t;2!==b&&(b=2,u&&clearTimeout(u),p=void 0,c=i||"",x.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){for(var i,o,r,s,a=e.contents,l=e.dataTypes;"*"===l[0];)l.shift(),void 0===o&&(o=e.mimeType||t.getResponseHeader("Content-Type"));if(o)for(s in a)if(a[s]&&a[s].test(o)){l.unshift(s);break}if(l[0]in n)r=l[0];else{for(s in n){if(!l[0]||e.converters[s+" "+l[0]]){r=s;break}i=i||s}r=r||i}if(r)return r!==l[0]&&l.unshift(r),n[r]}(f,x,n)),s=function(e,t,n,i){var o,r,s,a,l,c={},u=e.dataTypes.slice();if(u[1])for(s in e.converters)c[s.toLowerCase()]=e.converters[s];for(r=u.shift();r;)if(e.responseFields[r]&&(n[e.responseFields[r]]=t),!l&&i&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=r,r=u.shift())if("*"===r)r=l;else if("*"!==l&&l!==r){if(!(s=c[l+" "+r]||c["* "+r]))for(o in c)if((a=o.split(" "))[1]===r&&(s=c[l+" "+a[0]]||c["* "+a[0]])){!0===s?s=c[o]:!0!==c[o]&&(r=a[0],u.unshift(a[1]));break}if(!0!==s)if(s&&e.throws)t=s(t);else try{t=s(t)}catch(e){return{state:"parsererror",error:s?e:"No conversion from "+l+" to "+r}}}return{state:"success",data:t}}(f,s,x,i),i?(f.ifModified&&((n=x.getResponseHeader("Last-Modified"))&&(jQuery.lastModified[l]=n),(n=x.getResponseHeader("etag"))&&(jQuery.etag[l]=n)),204===e||"HEAD"===f.type?a="nocontent":304===e?a="notmodified":(a=s.state,o=s.data,i=!(r=s.error))):(r=a,!e&&a||(a="error",e<0&&(e=0))),x.status=e,x.statusText=(t||a)+"",i?g.resolveWith(h,[o,a,x]):g.rejectWith(h,[x,a,r]),x.statusCode(v),v=void 0,d&&m.trigger(i?"ajaxSuccess":"ajaxError",[x,f,i?o:r]),y.fireWith(h,[x,a]),d&&(m.trigger("ajaxComplete",[x,f]),--jQuery.active||jQuery.event.trigger("ajaxStop")))}},getJSON:function(e,t,n){return jQuery.get(e,t,n,"json")},getScript:function(e,t){return jQuery.get(e,void 0,t,"script")}}),jQuery.each(["get","post"],function(e,o){jQuery[o]=function(e,t,n,i){return jQuery.isFunction(t)&&(i=i||n,n=t,t=void 0),jQuery.ajax({url:e,type:o,dataType:i,data:t,success:n})}}),jQuery.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){jQuery.fn[t]=function(e){return this.on(t,e)}}),jQuery._evalUrl=function(e){return jQuery.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,throws:!0})},jQuery.fn.extend({wrapAll:function(t){return jQuery.isFunction(t)?this.each(function(e){jQuery(this).wrapAll(t.call(this,e))}):(this[0]&&(e=jQuery(t,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&e.insertBefore(this[0]),e.map(function(){for(var e=this;e.firstChild&&1===e.firstChild.nodeType;)e=e.firstChild;return e}).append(this)),this);var e},wrapInner:function(n){return jQuery.isFunction(n)?this.each(function(e){jQuery(this).wrapInner(n.call(this,e))}):this.each(function(){var e=jQuery(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=jQuery.isFunction(t);return this.each(function(e){jQuery(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(){return this.parent().each(function(){jQuery.nodeName(this,"body")||jQuery(this).replaceWith(this.childNodes)}).end()}}),jQuery.expr.filters.hidden=function(e){return e.offsetWidth<=0&&e.offsetHeight<=0||!g.reliableHiddenOffsets()&&"none"===(e.style&&e.style.display||jQuery.css(e,"display"))},jQuery.expr.filters.visible=function(e){return!jQuery.expr.filters.hidden(e)};var zt=/%20/g,It=/\[\]$/,Qt=/\r?\n/g,Xt=/^(?:submit|button|image|reset|file)$/i,Ut=/^(?:input|select|textarea|keygen)/i;jQuery.param=function(e,t){function n(e,t){t=jQuery.isFunction(t)?t():null==t?"":t,o[o.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)}var i,o=[];if(void 0===t&&(t=jQuery.ajaxSettings&&jQuery.ajaxSettings.traditional),jQuery.isArray(e)||e.jquery&&!jQuery.isPlainObject(e))jQuery.each(e,function(){n(this.name,this.value)});else for(i in e)!function n(i,e,o,r){if(jQuery.isArray(e))jQuery.each(e,function(e,t){o||It.test(i)?r(i,t):n(i+"["+("object"==typeof t?e:"")+"]",t,o,r)});else if(o||"object"!==jQuery.type(e))r(i,e);else for(var t in e)n(i+"["+t+"]",e[t],o,r)}(i,e[i],t,n);return o.join("&").replace(zt,"+")},jQuery.fn.extend({serialize:function(){return jQuery.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=jQuery.prop(this,"elements");return e?jQuery.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!jQuery(this).is(":disabled")&&Ut.test(this.nodeName)&&!Xt.test(e)&&(this.checked||!ce.test(e))}).map(function(e,t){var n=jQuery(this).val();return null==n?null:jQuery.isArray(n)?jQuery.map(n,function(e){return{name:t.name,value:e.replace(Qt,"\r\n")}}):{name:t.name,value:n.replace(Qt,"\r\n")}}).get()}}),jQuery.ajaxSettings.xhr=void 0!==h.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&Yt()||function(){try{return new h.ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}()}:Yt;var Vt=0,Jt={},s=jQuery.ajaxSettings.xhr();function Yt(){try{return new h.XMLHttpRequest}catch(e){}}h.ActiveXObject&&jQuery(h).on("unload",function(){for(var e in Jt)Jt[e](void 0,!0)}),g.cors=!!s&&"withCredentials"in s,(s=g.ajax=!!s)&&jQuery.ajaxTransport(function(l){var c;if(!l.crossDomain||g.cors)return{send:function(e,r){var t,s=l.xhr(),a=++Vt;if(s.open(l.type,l.url,l.async,l.username,l.password),l.xhrFields)for(t in l.xhrFields)s[t]=l.xhrFields[t];for(t in l.mimeType&&s.overrideMimeType&&s.overrideMimeType(l.mimeType),l.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)void 0!==e[t]&&s.setRequestHeader(t,e[t]+"");s.send(l.hasContent&&l.data||null),c=function(e,t){var n,i,o;if(c&&(t||4===s.readyState))if(delete Jt[a],c=void 0,s.onreadystatechange=jQuery.noop,t)4!==s.readyState&&s.abort();else{o={},n=s.status,"string"==typeof s.responseText&&(o.text=s.responseText);try{i=s.statusText}catch(e){i=""}n||!l.isLocal||l.crossDomain?1223===n&&(n=204):n=o.text?200:404}o&&r(n,i,o,s.getAllResponseHeaders())},l.async?4===s.readyState?setTimeout(c):s.onreadystatechange=Jt[a]=c:c()},abort:function(){c&&c(void 0,!0)}}}),jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return jQuery.globalEval(e),e}}}),jQuery.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),jQuery.ajaxTransport("script",function(t){var i,o;if(t.crossDomain)return o=y.head||jQuery("head")[0]||y.documentElement,{send:function(e,n){(i=y.createElement("script")).async=!0,t.scriptCharset&&(i.charset=t.scriptCharset),i.src=t.url,i.onload=i.onreadystatechange=function(e,t){!t&&i.readyState&&!/loaded|complete/.test(i.readyState)||(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),i=null,t||n(200,"success"))},o.insertBefore(i,o.firstChild)},abort:function(){i&&i.onload(void 0,!0)}}});var Zt=[],Gt=/(=)\?(?=&|$)|\?\?/,Kt=(jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Zt.pop()||jQuery.expando+"_"+St++;return this[e]=!0,e}}),jQuery.ajaxPrefilter("json jsonp",function(e,t,n){var i,o,r,s=!1!==e.jsonp&&(Gt.test(e.url)?"url":"string"==typeof e.data&&!(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gt.test(e.data)&&"data");if(s||"jsonp"===e.dataTypes[0])return i=e.jsonpCallback=jQuery.isFunction(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,s?e[s]=e[s].replace(Gt,"$1"+i):!1!==e.jsonp&&(e.url+=(jt.test(e.url)?"&":"?")+e.jsonp+"="+i),e.converters["script json"]=function(){return r||jQuery.error(i+" was not called"),r[0]},e.dataTypes[0]="json",o=h[i],h[i]=function(){r=arguments},n.always(function(){h[i]=o,e[i]&&(e.jsonpCallback=t.jsonpCallback,Zt.push(i)),r&&jQuery.isFunction(o)&&o(r[0]),r=o=void 0}),"script"}),jQuery.parseHTML=function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||y;var i=U.exec(e),n=!n&&[];return i?[t.createElement(i[1])]:(i=jQuery.buildFragment([e],t,n),n&&n.length&&jQuery(n).remove(),jQuery.merge([],i.childNodes))},jQuery.fn.load),en=(jQuery.fn.load=function(e,t,n){if("string"!=typeof e&&Kt)return Kt.apply(this,arguments);var i,o,r,s=this,a=e.indexOf(" ");return 0<=a&&(i=jQuery.trim(e.slice(a,e.length)),e=e.slice(0,a)),jQuery.isFunction(t)?(n=t,t=void 0):t&&"object"==typeof t&&(r="POST"),0<s.length&&jQuery.ajax({url:e,type:r,dataType:"html",data:t}).done(function(e){o=arguments,s.html(i?jQuery("<div>").append(jQuery.parseHTML(e)).find(i):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},jQuery.expr.filters.animated=function(t){return jQuery.grep(jQuery.timers,function(e){return t===e.elem}).length},h.document.documentElement);function tn(e){return jQuery.isWindow(e)?e:9===e.nodeType&&(e.defaultView||e.parentWindow)}jQuery.offset={setOffset:function(e,t,n){var i,o,r,s,a=jQuery.css(e,"position"),l=jQuery(e),c={};"static"===a&&(e.style.position="relative"),r=l.offset(),i=jQuery.css(e,"top"),s=jQuery.css(e,"left"),a=("absolute"===a||"fixed"===a)&&-1<jQuery.inArray("auto",[i,s])?(o=(a=l.position()).top,a.left):(o=parseFloat(i)||0,parseFloat(s)||0),null!=(t=jQuery.isFunction(t)?t.call(e,n,r):t).top&&(c.top=t.top-r.top+o),null!=t.left&&(c.left=t.left-r.left+a),"using"in t?t.using.call(e,c):l.css(c)}},jQuery.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){jQuery.offset.setOffset(this,t,e)});var e,n={top:0,left:0},i=this[0],o=i&&i.ownerDocument;return o?(e=o.documentElement,jQuery.contains(e,i)?(typeof i.getBoundingClientRect!=v&&(n=i.getBoundingClientRect()),i=tn(o),{top:n.top+(i.pageYOffset||e.scrollTop)-(e.clientTop||0),left:n.left+(i.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}):n):void 0},position:function(){var e,t,n,i;if(this[0])return n={top:0,left:0},i=this[0],"fixed"===jQuery.css(i,"position")?t=i.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),(n=jQuery.nodeName(e[0],"html")?n:e.offset()).top+=jQuery.css(e[0],"borderTopWidth",!0),n.left+=jQuery.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-jQuery.css(i,"marginTop",!0),left:t.left-n.left-jQuery.css(i,"marginLeft",!0)}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent||en;e&&!jQuery.nodeName(e,"html")&&"static"===jQuery.css(e,"position");)e=e.offsetParent;return e||en})}}),jQuery.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,o){var r=/Y/.test(o);jQuery.fn[t]=function(e){return l(this,function(e,t,n){var i=tn(e);if(void 0===n)return i?o in i?i[o]:i.document.documentElement[t]:e[t];i?i.scrollTo(r?jQuery(i).scrollLeft():n,r?n:jQuery(i).scrollTop()):e[t]=n},t,e,arguments.length,null)}}),jQuery.each(["top","left"],function(e,n){jQuery.cssHooks[n]=Ze(g.pixelPosition,function(e,t){if(t)return t=E(e,n),Je.test(t)?jQuery(e).position()[n]+"px":t})}),jQuery.each({Height:"height",Width:"width"},function(r,s){jQuery.each({padding:"inner"+r,content:s,"":"outer"+r},function(i,e){jQuery.fn[e]=function(e,t){var n=arguments.length&&(i||"boolean"!=typeof e),o=i||(!0===e||!0===t?"margin":"border");return l(this,function(e,t,n){var i;return jQuery.isWindow(e)?e.document.documentElement["client"+r]:9===e.nodeType?(i=e.documentElement,Math.max(e.body["scroll"+r],i["scroll"+r],e.body["offset"+r],i["offset"+r],i["client"+r])):void 0===n?jQuery.css(e,t,o):jQuery.style(e,t,n,o)},s,n?e:void 0,n,null)}})}),jQuery.fn.size=function(){return this.length},jQuery.fn.andSelf=jQuery.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return jQuery});var nn=h.jQuery,on=h.$;return jQuery.noConflict=function(e){return h.$===jQuery&&(h.$=on),e&&h.jQuery===jQuery&&(h.jQuery=nn),jQuery},typeof q==v&&(h.jQuery=h.$=jQuery),jQuery}),!function($){"use strict";$.fn.emulateTransitionEnd=function(e){var t=!1,n=this;$(this).one("bsTransitionEnd",function(){t=!0});return setTimeout(function(){t||$(n).trigger($.support.transition.end)},e),this},$(function(){$.support.transition=function(){var e,t=document.createElement("bootstrap"),n={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(e in n)if(void 0!==t.style[e])return{end:n[e]};return!1}(),$.support.transition&&($.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}})})}(jQuery),!function($){"use strict";function i(e){$(e).on("click",t,this.close)}var t='[data-dismiss="alert"]';i.VERSION="3.2.0",i.prototype.close=function(e){var t=$(this),n=(n=t.attr("data-target"))||(n=t.attr("href"))&&n.replace(/.*(?=#[^\s]*$)/,""),i=$(n);function o(){i.detach().trigger("closed.bs.alert").remove()}e&&e.preventDefault(),(i=i.length?i:t.hasClass("alert")?t:t.parent()).trigger(e=$.Event("close.bs.alert")),e.isDefaultPrevented()||(i.removeClass("in"),$.support.transition&&i.hasClass("fade")?i.one("bsTransitionEnd",o).emulateTransitionEnd(150):o())};var e=$.fn.alert;$.fn.alert=function(n){return this.each(function(){var e=$(this),t=e.data("bs.alert");t||e.data("bs.alert",t=new i(this)),"string"==typeof n&&t[n].call(e)})},$.fn.alert.Constructor=i,$.fn.alert.noConflict=function(){return $.fn.alert=e,this},$(document).on("click.bs.alert.data-api",t,i.prototype.close)}(jQuery),!function($){"use strict";function r(e,t){this.$element=$(e).on("keydown.bs.carousel",$.proxy(this.keydown,this)),this.$indicators=this.$element.find(".carousel-indicators"),this.options=t,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter.bs.carousel",$.proxy(this.pause,this)).on("mouseleave.bs.carousel",$.proxy(this.cycle,this))}function o(o){return this.each(function(){var e=$(this),t=e.data("bs.carousel"),n=$.extend({},r.DEFAULTS,e.data(),"object"==typeof o&&o),i="string"==typeof o?o:n.slide;t||e.data("bs.carousel",t=new r(this,n)),"number"==typeof o?t.to(o):i?t[i]():n.interval&&t.pause().cycle()})}r.VERSION="3.2.0",r.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},r.prototype.keydown=function(e){switch(e.which){case 37:this.prev();break;case 39:this.next();break;default:return}e.preventDefault()},r.prototype.cycle=function(e){return e||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval)),this},r.prototype.getItemIndex=function(e){return this.$items=e.parent().children(".item"),this.$items.index(e||this.$active)},r.prototype.to=function(e){var t=this,n=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(e>this.$items.length-1||e<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){t.to(e)}):n==e?this.pause().cycle():this.slide(n<e?"next":"prev",$(this.$items[e]))},r.prototype.pause=function(e){return e||(this.paused=!0),this.$element.find(".next, .prev").length&&$.support.transition&&(this.$element.trigger($.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},r.prototype.next=function(){if(!this.sliding)return this.slide("next")},r.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},r.prototype.slide=function(e,t){var n=this.$element.find(".item.active"),i=t||n[e](),t=this.interval,o="next"==e?"left":"right",r="next"==e?"first":"last",s=this;if(!i.length){if(!this.options.wrap)return;i=this.$element.find(".item")[r]()}if(i.hasClass("active"))return this.sliding=!1;var a,r=i[0],l=$.Event("slide.bs.carousel",{relatedTarget:r,direction:o});if(this.$element.trigger(l),!l.isDefaultPrevented())return this.sliding=!0,t&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),(l=$(this.$indicators.children()[this.getItemIndex(i)]))&&l.addClass("active")),a=$.Event("slid.bs.carousel",{relatedTarget:r,direction:o}),$.support.transition&&this.$element.hasClass("slide")?(i.addClass(e),i[0].offsetWidth,n.addClass(o),i.addClass(o),n.one("bsTransitionEnd",function(){i.removeClass([e,o].join(" ")).addClass("active"),n.removeClass(["active",o].join(" ")),s.sliding=!1,setTimeout(function(){s.$element.trigger(a)},0)}).emulateTransitionEnd(1e3*n.css("transition-duration").slice(0,-1))):(n.removeClass("active"),i.addClass("active"),this.sliding=!1,this.$element.trigger(a)),t&&this.cycle(),this};var e=$.fn.carousel;$.fn.carousel=o,$.fn.carousel.Constructor=r,$.fn.carousel.noConflict=function(){return $.fn.carousel=e,this},$(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(e){var t,n=$(this),i=$(n.attr("data-target")||(i=n.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,""));i.hasClass("carousel")&&(t=$.extend({},i.data(),n.data()),(n=n.attr("data-slide-to"))&&(t.interval=!1),o.call(i,t),n&&i.data("bs.carousel").to(n),e.preventDefault())}),$(window).on("load",function(){$('[data-ride="carousel"]').each(function(){var e=$(this);o.call(e,e.data())})})}(jQuery),!function($){"use strict";function o(e,t){this.$element=$(e),this.options=$.extend({},o.DEFAULTS,t),this.transitioning=null,this.options.parent&&(this.$parent=$(this.options.parent)),this.options.toggle&&this.toggle()}function s(i){return this.each(function(){var e=$(this),t=e.data("bs.collapse"),n=$.extend({},o.DEFAULTS,e.data(),"object"==typeof i&&i);!t&&n.toggle&&"show"==i&&(i=!i),t||e.data("bs.collapse",t=new o(this,n)),"string"==typeof i&&t[i]()})}o.VERSION="3.2.0",o.DEFAULTS={toggle:!0},o.prototype.dimension=function(){return this.$element.hasClass("width")?"width":"height"},o.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var e=$.Event("show.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){e=this.$parent&&this.$parent.find("> .panel > .in");if(e&&e.length){var t=e.data("bs.collapse");if(t&&t.transitioning)return;s.call(e,"hide"),t||e.data("bs.collapse",null)}var n=this.dimension(),t=(this.$element.removeClass("collapse").addClass("collapsing")[n](0),this.transitioning=1,function(){this.$element.removeClass("collapsing").addClass("collapse in")[n](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")});if(!$.support.transition)return t.call(this);e=$.camelCase(["scroll",n].join("-"));this.$element.one("bsTransitionEnd",$.proxy(t,this)).emulateTransitionEnd(350)[n](this.$element[0][e])}}},o.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var e=$.Event("hide.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){var e=this.dimension(),t=(this.$element[e](this.$element[e]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1,function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")});if(!$.support.transition)return t.call(this);this.$element[e](0).one("bsTransitionEnd",$.proxy(t,this)).emulateTransitionEnd(350)}}},o.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var e=$.fn.collapse;$.fn.collapse=s,$.fn.collapse.Constructor=o,$.fn.collapse.noConflict=function(){return $.fn.collapse=e,this},$(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(e){var t=$(this),e=t.attr("data-target")||e.preventDefault()||(e=t.attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,""),e=$(e),n=e.data("bs.collapse"),i=n?"toggle":t.data(),o=t.attr("data-parent"),r=o&&$(o);n&&n.transitioning||(r&&r.find('[data-toggle="collapse"][data-parent="'+o+'"]').not(t).addClass("collapsed"),t[e.hasClass("in")?"addClass":"removeClass"]("collapsed")),s.call(e,i)})}(jQuery),!function($){"use strict";function i(e){$(e).on("click.bs.dropdown",this.toggle)}var o='[data-toggle="dropdown"]';function r(n){n&&3===n.which||($(".dropdown-backdrop").remove(),$(o).each(function(){var e=s($(this)),t={relatedTarget:this};e.hasClass("open")&&(e.trigger(n=$.Event("hide.bs.dropdown",t)),n.isDefaultPrevented()||e.removeClass("open").trigger("hidden.bs.dropdown",t))}))}function s(e){var t=e.attr("data-target"),t=(t=t||(t=e.attr("href"))&&/#[A-Za-z]/.test(t)&&t.replace(/.*(?=#[^\s]*$)/,""))&&$(t);return t&&t.length?t:e.parent()}i.VERSION="3.2.0",i.prototype.toggle=function(e){var t=$(this);if(!t.is(".disabled, :disabled")){var n=s(t),i=n.hasClass("open");if(r(),!i){"ontouchstart"in document.documentElement&&!n.closest(".navbar-nav").length&&$('<div class="dropdown-backdrop"/>').insertAfter($(this)).on("click",r);i={relatedTarget:this};if(n.trigger(e=$.Event("show.bs.dropdown",i)),e.isDefaultPrevented())return;t.trigger("focus"),n.toggleClass("open").trigger("shown.bs.dropdown",i)}return!1}},i.prototype.keydown=function(e){if(/(38|40|27)/.test(e.keyCode)){var t=$(this);if(e.preventDefault(),e.stopPropagation(),!t.is(".disabled, :disabled")){var n=s(t),i=n.hasClass("open");if(!i||27==e.keyCode)return 27==e.which&&n.find(o).trigger("focus"),t.trigger("click");i=" li:not(.divider):visible a",t=n.find('[role="menu"]'+i+', [role="listbox"]'+i);t.length&&(n=t.index(t.filter(":focus")),38==e.keyCode&&0<n&&n--,40==e.keyCode&&n<t.length-1&&n++,t.eq(n=~n?n:0).trigger("focus"))}}};var e=$.fn.dropdown;$.fn.dropdown=function(n){return this.each(function(){var e=$(this),t=e.data("bs.dropdown");t||e.data("bs.dropdown",t=new i(this)),"string"==typeof n&&t[n].call(e)})},$.fn.dropdown.Constructor=i,$.fn.dropdown.noConflict=function(){return $.fn.dropdown=e,this},$(document).on("click.bs.dropdown.data-api",r).on("click.bs.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.bs.dropdown.data-api",o,i.prototype.toggle).on("keydown.bs.dropdown.data-api",o+', [role="menu"], [role="listbox"]',i.prototype.keydown)}(jQuery),!function($){"use strict";function r(e,t){this.options=t,this.$body=$(document.body),this.$element=$(e),this.$backdrop=this.isShown=null,this.scrollbarWidth=0,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,$.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))}function o(i,o){return this.each(function(){var e=$(this),t=e.data("bs.modal"),n=$.extend({},r.DEFAULTS,e.data(),"object"==typeof i&&i);t||e.data("bs.modal",t=new r(this,n)),"string"==typeof i?t[i](o):n.show&&t.show(o)})}r.VERSION="3.2.0",r.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},r.prototype.toggle=function(e){return this.isShown?this.hide():this.show(e)},r.prototype.show=function(n){var i=this,e=$.Event("show.bs.modal",{relatedTarget:n});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.$body.addClass("modal-open"),this.setScrollbar(),this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',$.proxy(this.hide,this)),this.backdrop(function(){var e=$.support.transition&&i.$element.hasClass("fade"),t=(i.$element.parent().length||i.$element.appendTo(i.$body),i.$element.show().scrollTop(0),e&&i.$element[0].offsetWidth,i.$element.addClass("in").attr("aria-hidden",!1),i.enforceFocus(),$.Event("shown.bs.modal",{relatedTarget:n}));e?i.$element.find(".modal-dialog").one("bsTransitionEnd",function(){i.$element.trigger("focus").trigger(t)}).emulateTransitionEnd(300):i.$element.trigger("focus").trigger(t)}))},r.prototype.hide=function(e){e&&e.preventDefault(),e=$.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.$body.removeClass("modal-open"),this.resetScrollbar(),this.escape(),$(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),$.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",$.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},r.prototype.enforceFocus=function(){$(document).off("focusin.bs.modal").on("focusin.bs.modal",$.proxy(function(e){this.$element[0]===e.target||this.$element.has(e.target).length||this.$element.trigger("focus")},this))},r.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",$.proxy(function(e){27==e.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},r.prototype.hideModal=function(){var e=this;this.$element.hide(),this.backdrop(function(){e.$element.trigger("hidden.bs.modal")})},r.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},r.prototype.backdrop=function(e){var t,n=this,i=this.$element.hasClass("fade")?"fade":"";this.isShown&&this.options.backdrop?(t=$.support.transition&&i,this.$backdrop=$('<div class="modal-backdrop '+i+'" />').appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",$.proxy(function(e){e.target===e.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),t&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),e&&(t?this.$backdrop.one("bsTransitionEnd",e).emulateTransitionEnd(150):e())):!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),i=function(){n.removeBackdrop(),e&&e()},$.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",i).emulateTransitionEnd(150):i()):e&&e()},r.prototype.checkScrollbar=function(){document.body.clientWidth>=window.innerWidth||(this.scrollbarWidth=this.scrollbarWidth||this.measureScrollbar())},r.prototype.setScrollbar=function(){var e=parseInt(this.$body.css("padding-right")||0,10);this.scrollbarWidth&&this.$body.css("padding-right",e+this.scrollbarWidth)},r.prototype.resetScrollbar=function(){this.$body.css("padding-right","")},r.prototype.measureScrollbar=function(){var e=document.createElement("div"),t=(e.className="modal-scrollbar-measure",this.$body.append(e),e.offsetWidth-e.clientWidth);return this.$body[0].removeChild(e),t};var e=$.fn.modal;$.fn.modal=o,$.fn.modal.Constructor=r,$.fn.modal.noConflict=function(){return $.fn.modal=e,this},$(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(e){var t=$(this),n=t.attr("href"),i=$(t.attr("data-target")||n&&n.replace(/.*(?=#[^\s]+$)/,"")),n=i.data("bs.modal")?"toggle":$.extend({remote:!/#/.test(n)&&n},i.data(),t.data());t.is("a")&&e.preventDefault(),i.one("show.bs.modal",function(e){e.isDefaultPrevented()||i.one("hidden.bs.modal",function(){t.is(":visible")&&t.trigger("focus")})}),o.call(i,n,this)})}(jQuery),!function($){"use strict";function i(e,t){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",e,t)}i.VERSION="3.2.0",i.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},i.prototype.init=function(e,t,n){this.enabled=!0,this.type=e,this.$element=$(t),this.options=this.getOptions(n),this.$viewport=this.options.viewport&&$(this.options.viewport.selector||this.options.viewport);for(var i=this.options.trigger.split(" "),o=i.length;o--;){var r,s=i[o];"click"==s?this.$element.on("click."+this.type,this.options.selector,$.proxy(this.toggle,this)):"manual"!=s&&(r="hover"==s?"mouseleave":"focusout",this.$element.on(("hover"==s?"mouseenter":"focusin")+"."+this.type,this.options.selector,$.proxy(this.enter,this)),this.$element.on(r+"."+this.type,this.options.selector,$.proxy(this.leave,this)))}this.options.selector?this._options=$.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},i.prototype.getDefaults=function(){return i.DEFAULTS},i.prototype.getOptions=function(e){return(e=$.extend({},this.getDefaults(),this.$element.data(),e)).delay&&"number"==typeof e.delay&&(e.delay={show:e.delay,hide:e.delay}),e},i.prototype.getDelegateOptions=function(){var n={},i=this.getDefaults();return this._options&&$.each(this._options,function(e,t){i[e]!=t&&(n[e]=t)}),n},i.prototype.enter=function(e){var t=e instanceof this.constructor?e:$(e.currentTarget).data("bs."+this.type);if(t||(t=new this.constructor(e.currentTarget,this.getDelegateOptions()),$(e.currentTarget).data("bs."+this.type,t)),clearTimeout(t.timeout),t.hoverState="in",!t.options.delay||!t.options.delay.show)return t.show();t.timeout=setTimeout(function(){"in"==t.hoverState&&t.show()},t.options.delay.show)},i.prototype.leave=function(e){var t=e instanceof this.constructor?e:$(e.currentTarget).data("bs."+this.type);if(t||(t=new this.constructor(e.currentTarget,this.getDelegateOptions()),$(e.currentTarget).data("bs."+this.type,t)),clearTimeout(t.timeout),t.hoverState="out",!t.options.delay||!t.options.delay.hide)return t.hide();t.timeout=setTimeout(function(){"out"==t.hoverState&&t.hide()},t.options.delay.hide)},i.prototype.show=function(){var e,t,n,i,o,r,s,a=$.Event("show.bs."+this.type);this.hasContent()&&this.enabled&&(this.$element.trigger(a),o=$.contains(document.documentElement,this.$element[0]),!a.isDefaultPrevented()&&o&&(a=(e=this).tip(),o=this.getUID(this.type),this.setContent(),a.attr("id",o),this.$element.attr("aria-describedby",o),this.options.animation&&a.addClass("fade"),o="function"==typeof this.options.placement?this.options.placement.call(this,a[0],this.$element[0]):this.options.placement,(s=(t=/\s?auto?\s?/i).test(o))&&(o=o.replace(t,"")||"top"),a.detach().css({top:0,left:0,display:"block"}).addClass(o).data("bs."+this.type,this),this.options.container?a.appendTo(this.options.container):a.insertAfter(this.$element),t=this.getPosition(),n=a[0].offsetWidth,i=a[0].offsetHeight,s&&(s=o,r=this.$element.parent(),r=this.getPosition(r),o="bottom"==o&&t.top+t.height+i-r.scroll>r.height?"top":"top"==o&&t.top-r.scroll-i<0?"bottom":"right"==o&&t.right+n>r.width?"left":"left"==o&&t.left-n<r.left?"right":o,a.removeClass(s).addClass(o)),r=this.getCalculatedOffset(o,t,n,i),this.applyPlacement(r,o),s=function(){e.$element.trigger("shown.bs."+e.type),e.hoverState=null},$.support.transition&&this.$tip.hasClass("fade")?a.one("bsTransitionEnd",s).emulateTransitionEnd(150):s()))},i.prototype.applyPlacement=function(e,t){var n=this.tip(),i=n[0].offsetWidth,o=n[0].offsetHeight,r=parseInt(n.css("margin-top"),10),s=parseInt(n.css("margin-left"),10),r=(isNaN(r)&&(r=0),isNaN(s)&&(s=0),e.top=e.top+r,e.left=e.left+s,$.offset.setOffset(n[0],$.extend({using:function(e){n.css({top:Math.round(e.top),left:Math.round(e.left)})}},e),0),n.addClass("in"),n[0].offsetWidth),s=n[0].offsetHeight,t=("top"==t&&s!=o&&(e.top=e.top+o-s),this.getViewportAdjustedDelta(t,e,r,s)),i=(t.left?e.left+=t.left:e.top+=t.top,t.left?2*t.left-i+r:2*t.top-o+s),r=t.left?"left":"top",o=t.left?"offsetWidth":"offsetHeight";n.offset(e),this.replaceArrow(i,n[0][o],r)},i.prototype.replaceArrow=function(e,t,n){this.arrow().css(n,e?50*(1-e/t)+"%":"")},i.prototype.setContent=function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},i.prototype.hide=function(){var e=this,t=this.tip(),n=$.Event("hide.bs."+this.type);function i(){"in"!=e.hoverState&&t.detach(),e.$element.trigger("hidden.bs."+e.type)}if(this.$element.removeAttr("aria-describedby"),this.$element.trigger(n),!n.isDefaultPrevented())return t.removeClass("in"),$.support.transition&&this.$tip.hasClass("fade")?t.one("bsTransitionEnd",i).emulateTransitionEnd(150):i(),this.hoverState=null,this},i.prototype.fixTitle=function(){var e=this.$element;!e.attr("title")&&"string"==typeof e.attr("data-original-title")||e.attr("data-original-title",e.attr("title")||"").attr("title","")},i.prototype.hasContent=function(){return this.getTitle()},i.prototype.getPosition=function(e){var t=(e=e||this.$element)[0],n="BODY"==t.tagName;return $.extend({},"function"==typeof t.getBoundingClientRect?t.getBoundingClientRect():null,{scroll:n?document.documentElement.scrollTop||document.body.scrollTop:e.scrollTop(),width:n?$(window).width():e.outerWidth(),height:n?$(window).height():e.outerHeight()},n?{top:0,left:0}:e.offset())},i.prototype.getCalculatedOffset=function(e,t,n,i){return"bottom"==e?{top:t.top+t.height,left:t.left+t.width/2-n/2}:"top"==e?{top:t.top-i,left:t.left+t.width/2-n/2}:"left"==e?{top:t.top+t.height/2-i/2,left:t.left-n}:{top:t.top+t.height/2-i/2,left:t.left+t.width}},i.prototype.getViewportAdjustedDelta=function(e,t,n,i){var o,r,s={top:0,left:0};return this.$viewport&&(o=this.options.viewport&&this.options.viewport.padding||0,r=this.getPosition(this.$viewport),/right|left/.test(e)?(e=t.top-o-r.scroll,i=t.top+o-r.scroll+i,e<r.top?s.top=r.top-e:i>r.top+r.height&&(s.top=r.top+r.height-i)):(e=t.left-o,i=t.left+o+n,e<r.left?s.left=r.left-e:i>r.width&&(s.left=r.left+r.width-i))),s},i.prototype.getTitle=function(){var e=this.$element,t=this.options;return e.attr("data-original-title")||("function"==typeof t.title?t.title.call(e[0]):t.title)},i.prototype.getUID=function(e){for(;e+=~~(1e6*Math.random()),document.getElementById(e););return e},i.prototype.tip=function(){return this.$tip=this.$tip||$(this.options.template)},i.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},i.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},i.prototype.enable=function(){this.enabled=!0},i.prototype.disable=function(){this.enabled=!1},i.prototype.toggleEnabled=function(){this.enabled=!this.enabled},i.prototype.toggle=function(e){var t=this;e&&!(t=$(e.currentTarget).data("bs."+this.type))&&(t=new this.constructor(e.currentTarget,this.getDelegateOptions()),$(e.currentTarget).data("bs."+this.type,t)),t.tip().hasClass("in")?t.leave(t):t.enter(t)},i.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var e=$.fn.tooltip;$.fn.tooltip=function(n){return this.each(function(){var e=$(this),t=e.data("bs.tooltip");!t&&"destroy"==n||(t||e.data("bs.tooltip",t=new i(this,"object"==typeof n&&n)),"string"==typeof n&&t[n]())})},$.fn.tooltip.Constructor=i,$.fn.tooltip.noConflict=function(){return $.fn.tooltip=e,this}}(jQuery),!function($){"use strict";function i(e,t){this.init("popover",e,t)}if(!$.fn.tooltip)throw new Error("Popover requires tooltip.js");i.VERSION="3.2.0",i.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),((i.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)).constructor=i).prototype.getDefaults=function(){return i.DEFAULTS},i.prototype.setContent=function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t),e.find(".popover-content").empty()[this.options.html?"string"==typeof n?"html":"append":"text"](n),e.removeClass("fade top bottom left right in"),e.find(".popover-title").html()||e.find(".popover-title").hide()},i.prototype.hasContent=function(){return this.getTitle()||this.getContent()},i.prototype.getContent=function(){var e=this.$element,t=this.options;return e.attr("data-content")||("function"==typeof t.content?t.content.call(e[0]):t.content)},i.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},i.prototype.tip=function(){return this.$tip||(this.$tip=$(this.options.template)),this.$tip};var e=$.fn.popover;$.fn.popover=function(n){return this.each(function(){var e=$(this),t=e.data("bs.popover");!t&&"destroy"==n||(t||e.data("bs.popover",t=new i(this,"object"==typeof n&&n)),"string"==typeof n&&t[n]())})},$.fn.popover.Constructor=i,$.fn.popover.noConflict=function(){return $.fn.popover=e,this}}(jQuery),!function($){function t(e,t,n,i){var o=e.text(),t=o.split(t),r="";t.length&&($(t).each(function(e,t){r+='<span class="'+n+(e+1)+'" aria-hidden="true">'+t+"</span>"+i}),e.attr("aria-label",o).empty().append(r))}var n={init:function(){return this.each(function(){t($(this),"","char","")})},words:function(){return this.each(function(){t($(this)," ","word"," ")})},lines:function(){return this.each(function(){var e="eefec303079ad17405c889e092e105b0";t($(this).children("br").replaceWith(e).end(),e,"line","")})}};$.fn.lettering=function(e){return e&&n[e]?n[e].apply(this,[].slice.call(arguments,1)):"letters"!==e&&e?($.error("Method "+e+" does not exist on jQuery.lettering"),this):n.init.apply(this,[].slice.call(arguments,0))}}(jQuery),!function($){t=document.createElement("input"),e="onpaste",t.setAttribute(e,"");var y,e,v=("function"==typeof t[e]?"paste":"input")+".mask",t=navigator.userAgent,b=/iphone/i.test(t),x=/android/i.test(t);$.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},dataName:"rawMaskFn",placeholder:"_"},$.fn.extend({caret:function(e,t){var n;if(0!==this.length&&!this.is(":hidden"))return"number"==typeof e?(t="number"==typeof t?t:e,this.each(function(){this.setSelectionRange?this.setSelectionRange(e,t):this.createTextRange&&((n=this.createTextRange()).collapse(!0),n.moveEnd("character",t),n.moveStart("character",e),n.select())})):(this[0].setSelectionRange?(e=this[0].selectionStart,t=this[0].selectionEnd):document.selection&&document.selection.createRange&&(n=document.selection.createRange(),e=0-n.duplicate().moveStart("character",-1e5),t=e+n.text.length),{begin:e,end:t})},unmask:function(){return this.trigger("unmask")},mask:function(n,h){var i,m,s,a,g;return!n&&0<this.length?$(this[0]).data($.mask.dataName)():(h=$.extend({placeholder:$.mask.placeholder,completed:null},h),i=$.mask.definitions,m=[],s=g=n.length,a=null,$.each(n.split(""),function(e,t){"?"==t?(g--,s=e):i[t]?(m.push(new RegExp(i[t])),null===a&&(a=m.length-1)):m.push(null)}),this.trigger("unmask").each(function(){var l=$(this),c=$.map(n.split(""),function(e,t){if("?"!=e)return i[e]?h.placeholder:e}),o=l.val();function u(e){for(;++e<g&&!m[e];);return e}function d(e,t){var n,i;if(!(e<0)){for(n=e,i=u(t);n<g;n++)if(m[n]){if(!(i<g&&m[n].test(c[i])))break;c[n]=c[i],c[i]=h.placeholder,i=u(i)}f(),l.caret(Math.max(a,e))}}function e(e){var t,n,i=e.which;8===i||46===i||b&&127===i?(t=(n=l.caret()).begin,(n=n.end)-t==0&&(t=46!==i?function(e){for(;0<=--e&&!m[e];);return e}(t):n=u(t-1),n=46===i?u(n):n),p(t,n),d(t,n-1),e.preventDefault()):27==i&&(l.val(o),l.caret(0,r()),e.preventDefault())}function t(e){var t,n=e.which,i=l.caret();if(!(e.ctrlKey||e.altKey||e.metaKey||n<32)&&n){if(i.end-i.begin!=0&&(p(i.begin,i.end),d(i.begin,i.end-1)),(i=u(i.begin-1))<g&&(t=String.fromCharCode(n),m[i].test(t))){for(var o,r,s=i,a=h.placeholder;s<g;s++)if(m[s]){if(o=u(s),r=c[s],c[s]=a,!(o<g&&m[o].test(r)))break;a=r}c[i]=t,f(),n=u(i),x?setTimeout($.proxy($.fn.caret,l,n),0):l.caret(n),h.completed&&g<=n&&h.completed.call(l)}e.preventDefault()}}function p(e,t){for(var n=e;n<t&&n<g;n++)m[n]&&(c[n]=h.placeholder)}function f(){l.val(c.join(""))}function r(e){var t,n=l.val(),i=-1,o=0;for(pos=0;o<g;o++)if(m[o]){for(c[o]=h.placeholder;pos++<n.length;)if(t=n.charAt(pos-1),m[o].test(t)){c[o]=t,i=o;break}if(pos>n.length)break}else c[o]===n.charAt(pos)&&o!==s&&(pos++,i=o);return e?f():i+1<s?(l.val(""),p(0,g)):(f(),l.val(l.val().substring(0,i+1))),s?o:a}l.data($.mask.dataName,function(){return $.map(c,function(e,t){return m[t]&&e!=h.placeholder?e:null}).join("")}),l.attr("readonly")||l.one("unmask",function(){l.unbind(".mask").removeData($.mask.dataName)}).bind("focus.mask",function(){var e;clearTimeout(y),o=l.val(),e=r(),y=setTimeout(function(){f(),e==n.length?l.caret(0,e):l.caret(e)},10)}).bind("blur.mask",function(){r(),l.val()!=o&&l.change()}).bind("keydown.mask",e).bind("keypress.mask",t).bind(v,function(){setTimeout(function(){var e=r(!0);l.caret(e),h.completed&&e==l.val().length&&h.completed.call(l)},0)}),r()}))}})}(jQuery),!function($){"use strict";var a,l,c,u,n,i,o={loadingNotice:"Carregando Foto",errorNotice:"A foto nÃ£o pÃ´de ser carregada",errorDuration:2500,preventClicks:!0,onShow:void 0,onHide:void 0};function r(e,t){return this.$target=$(e),this.opts=$.extend({},o,t),void 0===this.isOpen&&this._init(),this}r.prototype._init=function(){var t=this;this.$link=this.$target.find("a"),this.$image=this.$target.find("img"),this.$flyout=$('<div class="easyzoom-flyout" oncontextmenu="return false" draggable="false" />'),this.$notice=$('<div class="easyzoom-notice" />'),this.$target.on("mouseenter.easyzoom touchstart.easyzoom",function(e){t.isMouseOver=!0,768<jQuery(window).width()&&(e.originalEvent.touches&&1!==e.originalEvent.touches.length||(e.preventDefault(),t.show(e,!0)))}).on("mousemove.easyzoom touchmove.easyzoom",function(e){768<jQuery(window).width()&&t.isOpen&&(e.preventDefault(),t._move(e))}).on("mouseleave.easyzoom touchend.easyzoom",function(){t.isMouseOver=!1,768<jQuery(window).width()&&t.isOpen&&t.hide()}),this.opts.preventClicks&&this.$target.on("click.easyzoom","a",function(e){e.preventDefault()})},r.prototype.show=function(e,t){var n,i,o,r,s=this;this.isReady?(this.$target.append(this.$flyout),n=this.$target.width(),i=this.$target.height(),o=this.$flyout.width(),r=this.$flyout.height(),a=this.$zoom.width()-o,l=this.$zoom.height()-r,c=a/n,u=l/i,this.isOpen=!0,this.opts.onShow&&this.opts.onShow.call(this),e&&this._move(e)):this._load(this.$link.attr("href"),function(){!s.isMouseOver&&t||s.show(e)})},r.prototype._load=function(e,t){var n=new Image;this.$target.addClass("is-loading").append(this.$notice.text(this.opts.loadingNotice)),this.$zoom=$(n),n.onerror=$.proxy(function(){var e=this;this.$notice.text(this.opts.errorNotice),this.$target.removeClass("is-loading").addClass("is-error"),this.detachNotice=setTimeout(function(){e.$notice.detach(),e.detachNotice=null},this.opts.errorDuration)},this),n.onload=$.proxy(function(){n.width&&(this.isReady=!0,this.$notice.detach(),this.$flyout.html(this.$zoom),this.$target.removeClass("is-loading").addClass("is-ready"),t())},this),n.style.position="absolute",n.src=e},r.prototype._move=function(e){i=0===e.type.indexOf("touch")?(t=e.touches||e.originalEvent.touches,n=t[0].pageX,t[0].pageY):(n=e.pageX||n,e.pageY||i);var t=this.$target.offset(),e=i-t.top,t=n-t.left,e=Math.ceil(e*u),t=Math.ceil(t*c);t<0||e<0||a<t||l<e?this.hide():this.$zoom.css({top:-1*e+"px",left:-1*t+"px"})},r.prototype.hide=function(){this.isOpen&&(this.$flyout.detach(),this.isOpen=!1,this.opts.onHide&&this.opts.onHide.call(this))},r.prototype.swap=function(e,t,n){this.hide(),this.isReady=!1,this.detachNotice&&clearTimeout(this.detachNotice),this.$notice.parent().length&&this.$notice.detach(),$.isArray(n)&&(n=n.join()),this.$target.removeClass("is-loading is-ready is-error"),this.$image.attr({src:e,srcset:n}),this.$link.attr("href",t)},r.prototype.teardown=function(){this.hide(),this.$target.removeClass("is-loading is-ready is-error").off(".easyzoom"),this.detachNotice&&clearTimeout(this.detachNotice),delete this.$link,delete this.$zoom,delete this.$image,delete this.$notice,delete this.$flyout,delete this.isOpen,delete this.isReady},$.fn.easyZoom=function(t){return this.each(function(){var e=$.data(this,"easyZoom");e?void 0===e.isOpen&&e._init():$.data(this,"easyZoom",new r(this,t))})},"function"==typeof define&&define.amd?define(function(){return r}):"undefined"!=typeof module&&module.exports&&(module.exports=r)}(jQuery),!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?e(require("jquery")):e(jQuery)}(function($){var n=/\+/g;function d(e){return f.raw?e:encodeURIComponent(e)}function p(e,t){e=f.raw?e:function(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(n," ")),f.json?JSON.parse(e):e}catch(e){}}(e);return $.isFunction(t)?t(e):e}var f=$.cookie=function(e,t,n){var i,o;if(void 0!==t&&!$.isFunction(t))return"number"==typeof(n=$.extend({},f.defaults,n)).expires&&(i=n.expires,(o=n.expires=new Date).setTime(+o+864e5*i)),document.cookie=[d(e),"=",(o=t,d(f.json?JSON.stringify(o):String(o))),n.expires?"; expires="+n.expires.toUTCString():"",n.path?"; path="+n.path:"",n.domain?"; domain="+n.domain:"",n.secure?"; secure":""].join("");for(var r=e?void 0:{},s=document.cookie?document.cookie.split("; "):[],a=0,l=s.length;a<l;a++){var c=s[a].split("="),u=(u=c.shift(),f.raw?u:decodeURIComponent(u)),c=c.join("=");if(e&&e===u){r=p(c,t);break}e||void 0===(c=p(c))||(r[u]=c)}return r};f.defaults={},$.removeCookie=function(e,t){return void 0!==$.cookie(e)&&($.cookie(e,"",$.extend({},t,{expires:-1})),!$.cookie(e))}}),jQuery.noConflict(),!function($){"use strict";function e(e){this.windowLoaded=!1}e.prototype={constructor:e,start:function(){var e=this;$(window).load(function(){e.windowLoaded=!0}),this.attach()},attach:function(){this.attachBootstrapPrototypeCompatibility(),this.attachMedia()},attachBootstrapPrototypeCompatibility:function(){$("*").on("show.bs.dropdown show.bs.collapse",function(e){$(e.target).addClass("bs-prototype-override")}),$("*").on("hidden.bs.collapse",function(e){$(e.target).removeClass("bs-prototype-override")})},attachMedia:function(){var e=$('[data-toggle="media"]');e.length&&e.on("click",function(e){e.preventDefault();var e=$(this),t=$(e.attr("href")),n=t.find(".carousel"),e=parseInt(e.data("index"));return n.carousel(e),t.modal("show"),!1})}},jQuery(document).ready(function($){(new e).start()})}(jQuery),!function(){var n,i=!1,t=(window.jQuery&&(n=jQuery("*"),jQuery.each(["hide.bs.dropdown","hide.bs.collapse","hide.bs.modal","hide.bs.tooltip","hide.bs.popover"],function(e,t){n.on(t,function(e){i=!0})})),Element.hide);Element.addMethods({hide:function(e){return i?(i=!1,e):t(e)}})}(),jQuery(document).ready(function(jQuery){var e=location.pathname.split("/");jQuery("body").hasClass("cms-"+e[e.length-1])&&jQuery("#cms-"+e[e.length-1]).addClass("active"),jQuery(window).resize(function(){alteraPaddingBottomBody()}),alteraPaddingBottomBody(),jQuery(".link-wishlist").tooltip(),jQuery(".link-compare").tooltip(),jQuery(".order-tooltip").tooltip();jQuery(".info-cvv-popover").popover({template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><img src="../skin/frontend/default/dhcpv5/images/cvv_code.png" alt="CÃ³digo CVV" width="334px" height="199px"></div>'}),jQuery(".price").lettering(),jQuery(".welcome-msg").lettering("words"),jQuery(".badge-resultados").lettering();var n=jQuery(".easyzoom").easyZoom().filter(".easyzoom--with-thumbnails").data("easyZoom");jQuery(".thumbnails").on("click","a",function(e){var t=jQuery(this);e.preventDefault(),n.swap(t.data("standard"),t.attr("href"))}),jQuery("#postcode, #zip, #cep, .validate-zip-international").mask("99999-999"),jQuery(".cpf").mask("999.999.999-99"),jQuery(".cnpj").mask("99.999.999/9999-99"),jQuery("#telephone, #billing\\:telephone, #shipping\\:telephone").mask("(99) 99999999?9"),jQuery("#fax, #billing\\:fax, #shipping\\:fax").mask("(99) 99999999?9"),jQuery("#day").mask("99"),jQuery("#month").mask("99"),jQuery("#year").mask("9999"),jQuery("#data").mask("99/99/9999")});
  //# sourceMappingURL=/src/skin/frontend/default/dhcpv5/js/scripts.min.js.map

  