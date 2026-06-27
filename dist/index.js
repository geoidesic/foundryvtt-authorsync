const MODULE_ID = "foundryvtt-authorsync";
const MODULE_TITLE = "Foundryvtt Authorsync";
const LOG_PREFIX = "FOUNDRYVTTAUTHORSYNC |";
const log = {
  ASSERT: 1,
  ERROR: 2,
  WARN: 3,
  INFO: 4,
  DEBUG: 5,
  VERBOSE: 6,
  set level(level) {
    this.a = level >= this.ASSERT ? console.assert.bind(window.console, LOG_PREFIX) : () => {
    };
    this.e = level >= this.ERROR ? console.error.bind(window.console, LOG_PREFIX) : () => {
    };
    this.w = level >= this.WARN ? console.warn.bind(window.console, LOG_PREFIX) : () => {
    };
    this.i = level >= this.INFO ? console.info.bind(window.console, LOG_PREFIX) : () => {
    };
    this.d = level >= this.DEBUG ? console.debug.bind(window.console, LOG_PREFIX) : () => {
    };
    this.v = level >= this.VERBOSE ? console.log.bind(window.console, LOG_PREFIX) : () => {
    };
    this.loggingLevel = level;
  },
  get level() {
    return this.loggingLevel;
  }
};
function safeGetSetting(module, key, defaultValue = void 0) {
  try {
    if (!globalThis?.game || !game.settings) return defaultValue;
    const fullKey = `${module}.${key}`;
    if (game.settings.settings?.has?.(fullKey)) return game.settings.get(module, key);
    return defaultValue;
  } catch (e) {
    console.warn(`safeGetSetting: failed to read ${module}.${key}`, e);
    return defaultValue;
  }
}
function localize$1(string) {
  if (typeof game === "undefined") return string;
  return game.i18n.localize(`${MODULE_ID}.${string}`);
}
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src) tar[k] = src[k];
  return (
    /** @type {T & S} */
    tar
  );
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (element_src === url) return true;
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) ;
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0) raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0) raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node) return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  style_element.textContent = "/* empty */";
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(
    /** @type {Document} */
    node.head || node,
    style
  );
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i]) iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data) return;
  text2.data = /** @type {string} */
  data;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
function construct_svelte_component(component, props) {
  return new component(props);
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--) hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    // remove all Svelte animations
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active) clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active) return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode) detach(ownerNode);
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2) block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  const options = { direction: "in" };
  let config = fn(node, params, options);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name) delete_rule(node, animation_name);
  }
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task) task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(t, 1 - t);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started) return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config(options);
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  const options = { direction: "out" };
  let config = fn(node, params, options);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  let original_inert_value;
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css) animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    if ("inert" in node) {
      original_inert_value = /** @type {HTMLElement} */
      node.inert;
      node.inert = true;
    }
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config(options);
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && "inert" in node) {
        node.inert = original_inert_value;
      }
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name) delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n)) to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2)) update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init$1(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready2 = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
      if (ready2) make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready2 = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$ = void 0;
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$set = void 0;
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
class Frozen {
  /**
   * @hideconstructor
   */
  constructor() {
    throw new Error("Frozen constructor: This is a static class and should not be constructed.");
  }
  /**
   * @param {Iterable<[K, V]>} [entries] - Target Map or iterable of [key, value] pairs.
   *
   * @returns {ReadonlyMap<K, V>} A strictly ReadonlyMap.
   *
   * @template K, V
   */
  static Map(entries) {
    const result = new Map(entries);
    result.set = void 0;
    result.delete = void 0;
    result.clear = void 0;
    return (
      /** @type {ReadonlyMap<K, V>} */
      result
    );
  }
  /**
   * @param {Iterable<T>} [data] - Target Set or iterable list.
   *
   * @returns {ReadonlySet<T>} A strictly ReadonlySet.
   *
   * @template T
   */
  static Set(data) {
    const result = new Set(data);
    result.add = void 0;
    result.delete = void 0;
    result.clear = void 0;
    return (
      /** @type {ReadonlySet<T>} */
      result
    );
  }
}
Object.freeze(Frozen);
function deepMerge(target, ...sourceObj) {
  if (Object.prototype.toString.call(target) !== "[object Object]") {
    throw new TypeError(`deepMerge error: 'target' is not an object.`);
  }
  if (sourceObj.length === 0) {
    throw new TypeError(`deepMerge error: 'sourceObj' is not an object.`);
  }
  for (let cntr = 0; cntr < sourceObj.length; cntr++) {
    if (Object.prototype.toString.call(sourceObj[cntr]) !== "[object Object]") {
      throw new TypeError(`deepMerge error: 'sourceObj[${cntr}]' is not an object.`);
    }
  }
  if (sourceObj.length === 1) {
    const stack = [];
    for (const obj of sourceObj) {
      stack.push({ target, source: obj });
    }
    while (stack.length > 0) {
      const { target: target2, source } = stack.pop();
      for (const prop in source) {
        if (Object.hasOwn(source, prop)) {
          const sourceValue = source[prop];
          const targetValue = target2[prop];
          if (Object.hasOwn(target2, prop) && targetValue?.constructor === Object && sourceValue?.constructor === Object) {
            stack.push({ target: targetValue, source: sourceValue });
          } else {
            target2[prop] = sourceValue;
          }
        }
      }
    }
  } else {
    const stack = [{ target, sources: sourceObj }];
    while (stack.length > 0) {
      const { target: target2, sources } = stack.pop();
      for (const source of sources) {
        for (const prop in source) {
          if (Object.hasOwn(source, prop)) {
            const sourceValue = source[prop];
            const targetValue = target2[prop];
            if (Object.hasOwn(target2, prop) && targetValue?.constructor === Object && sourceValue?.constructor === Object) {
              target2[prop] = Object.assign({}, targetValue);
              stack.push({ target: target2[prop], sources: [sourceValue] });
            } else {
              target2[prop] = sourceValue;
            }
          }
        }
      }
    }
  }
  return target;
}
function hasGetter(object, accessor) {
  if (typeof object !== "object" || object === null || object === void 0) {
    return false;
  }
  const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
  if (iDescriptor !== void 0 && iDescriptor.get !== void 0) {
    return true;
  }
  for (let o = Object.getPrototypeOf(object); o; o = Object.getPrototypeOf(o)) {
    const descriptor = Object.getOwnPropertyDescriptor(o, accessor);
    if (descriptor !== void 0 && descriptor.get !== void 0) {
      return true;
    }
  }
  return false;
}
function isIterable(value) {
  if (value === null || value === void 0 || typeof value !== "object") {
    return false;
  }
  return Symbol.iterator in value;
}
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isPlainObject(value) {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
function safeAccess(data, accessor, defaultValue) {
  if (typeof data !== "object" || data === null) {
    return defaultValue;
  }
  if (typeof accessor !== "string") {
    return defaultValue;
  }
  const keys = accessor.split(".");
  let result = data;
  for (let cntr = 0; cntr < keys.length; cntr++) {
    if (result[keys[cntr]] === void 0 || result[keys[cntr]] === null) {
      return defaultValue;
    }
    result = result[keys[cntr]];
  }
  return result;
}
function safeSet(data, accessor, value, { operation = "set", createMissing = false } = {}) {
  if (typeof data !== "object" || data === null) {
    throw new TypeError(`safeSet error: 'data' is not an object.`);
  }
  if (typeof accessor !== "string") {
    throw new TypeError(`safeSet error: 'accessor' is not a string.`);
  }
  if (typeof operation !== "string") {
    throw new TypeError(`safeSet error: 'options.operation' is not a string.`);
  }
  if (operation !== "add" && operation !== "div" && operation !== "mult" && operation !== "set" && operation !== "set-undefined" && operation !== "sub") {
    throw new Error(`safeSet error: Unknown 'options.operation'.`);
  }
  if (typeof createMissing !== "boolean") {
    throw new TypeError(`safeSet error: 'options.createMissing' is not a boolean.`);
  }
  const access = accessor.split(".");
  let result = false;
  if (access.length === 1 && !createMissing && !(access[0] in data)) {
    return false;
  }
  for (let cntr = 0; cntr < access.length; cntr++) {
    if (Array.isArray(data)) {
      const number = +access[cntr];
      if (!Number.isInteger(number) || number < 0) {
        return false;
      }
    }
    if (cntr === access.length - 1) {
      switch (operation) {
        case "add":
          data[access[cntr]] += value;
          result = true;
          break;
        case "div":
          data[access[cntr]] /= value;
          result = true;
          break;
        case "mult":
          data[access[cntr]] *= value;
          result = true;
          break;
        case "set":
          data[access[cntr]] = value;
          result = true;
          break;
        case "set-undefined":
          if (data[access[cntr]] === void 0) {
            data[access[cntr]] = value;
          }
          result = true;
          break;
        case "sub":
          data[access[cntr]] -= value;
          result = true;
          break;
      }
    } else {
      if (createMissing && data[access[cntr]] === void 0) {
        data[access[cntr]] = {};
      }
      if (data[access[cntr]] === null || typeof data[access[cntr]] !== "object") {
        return false;
      }
      data = data[access[cntr]];
    }
  }
  return result;
}
class CrossWindow {
  /**
   * @private
   */
  constructor() {
    throw new Error("CrossWindow constructor: This is a static class and should not be constructed.");
  }
  /**
   * Class names for all focusable element types.
   */
  static #FocusableElementClassNames = [
    "HTMLAnchorElement",
    "HTMLButtonElement",
    "HTMLDetailsElement",
    "HTMLEmbedElement",
    "HTMLIFrameElement",
    "HTMLInputElement",
    "HTMLObjectElement",
    "HTMLSelectElement",
    "HTMLTextAreaElement"
  ];
  /**
   * DOM nodes with defined `ownerDocument` property.
   */
  static #NodesWithOwnerDocument = /* @__PURE__ */ new Set([
    Node.ELEMENT_NODE,
    Node.TEXT_NODE,
    Node.COMMENT_NODE,
    Node.DOCUMENT_FRAGMENT_NODE
  ]);
  // Various UIEvent sets for duck typing by constructor name.
  /**
   * Duck typing class names for pointer events.
   */
  static #PointerEventSet = /* @__PURE__ */ new Set(["MouseEvent", "PointerEvent"]);
  /**
   * Duck typing class names for all UIEvents.
   */
  static #UIEventSet = /* @__PURE__ */ new Set([
    "UIEvent",
    "FocusEvent",
    "MouseEvent",
    "WheelEvent",
    "KeyboardEvent",
    "PointerEvent",
    "TouchEvent",
    "InputEvent",
    "CompositionEvent",
    "DragEvent"
  ]);
  /**
   * Duck typing class names for events considered as user input.
   */
  static #UserInputEventSet = /* @__PURE__ */ new Set(["KeyboardEvent", "MouseEvent", "PointerEvent"]);
  /**
   * Internal options used by `#checkDOMInstanceType` when retrieving the Window reference from a Node that doesn't
   * define `ownerDocument`.
   */
  static #optionsInternalCheckDOM = { throws: false };
  // DOM Querying ---------------------------------------------------------------------------------------------------
  /**
   * Convenience method to test if the given target element is the current active element.
   *
   * @param target - Element to test as current active element.
   */
  static isActiveElement(target) {
    if (this.#hasOwnerDocument(target)) {
      return target?.ownerDocument?.activeElement === target;
    }
    return false;
  }
  /**
   * Convenience method to retrieve the `document.activeElement` value in the current Window context of a DOM Node /
   * Element, EventTarget, Document, or Window.
   *
   * @param target - DOM Node / Element, EventTarget, Document, UIEvent or Window to query.
   *
   * @param [options] - Options.
   *
   * @returns Active element or `undefined` when `throws` option is `false` and the target is invalid.
   *
   * @throws {@link TypeError} Target must be a DOM Node / Element, Document, UIEvent, or Window.
   */
  static getActiveElement(target, { throws = true } = {}) {
    if (this.#hasOwnerDocument(target)) {
      return target?.ownerDocument?.activeElement ?? null;
    }
    if (this.isUIEvent(target) && isObject(target?.view)) {
      return target?.view?.document?.activeElement ?? null;
    }
    if (this.isDocument(target)) {
      return target?.activeElement ?? null;
    }
    if (this.isWindow(target)) {
      return target?.document?.activeElement ?? null;
    }
    if (throws) {
      throw new TypeError(`'target' must be a DOM Node / Element, Document, UIEvent, or Window.`);
    }
    return void 0;
  }
  /**
   * Convenience method to retrieve the `Document` value in the current context of a DOM Node / Element, EventTarget,
   * Document, UIEvent, or Window.
   *
   * @param target - DOM Node / Element, EventTarget, Document, UIEvent or Window to query.
   *
   * @param [options] - Options.
   *
   * @returns {Document} Active document or `undefined` when `throws` option is `false` and the target is invalid.
   *
   * @throws {@link TypeError} Target must be a DOM Node / Element, Document, UIEvent, or Window.
   */
  static getDocument(target, { throws = true } = {}) {
    if (this.#hasOwnerDocument(target)) {
      return target?.ownerDocument;
    }
    if (this.isUIEvent(target) && isObject(target?.view)) {
      return target?.view?.document;
    }
    if (this.isDocument(target)) {
      return target;
    }
    if (this.isWindow(target)) {
      return target?.document;
    }
    if (throws) {
      throw new TypeError(`'target' must be a DOM Node / Element, Document, UIEvent, or Window.`);
    }
    return void 0;
  }
  /**
   * Convenience method to retrieve the `Window` value in the current context of a DOM Node / Element, EventTarget,
   * Document, or Window.
   *
   * @param target - DOM Node / Element, EventTarget, Document, UIEvent or Window to query.
   *
   * @param [options] - Options.
   *
   * @returns Active window or `undefined` when `throws` option is `false` and the target is invalid.
   *
   * @throws {@link TypeError} Target must be a DOM Node / Element, Document, UIEvent, or Window.
   */
  static getWindow(target, { throws = true } = {}) {
    if (this.#hasOwnerDocument(target)) {
      return target.ownerDocument?.defaultView ?? globalThis;
    }
    if (this.isUIEvent(target) && isObject(target?.view)) {
      return target.view ?? globalThis;
    }
    if (this.isDocument(target)) {
      return target.defaultView ?? globalThis;
    }
    if (this.isWindow(target)) {
      return target;
    }
    if (throws) {
      throw new TypeError(`'target' must be a DOM Node / Element, Document, UIEvent, or Window.`);
    }
    return void 0;
  }
  // ES / Browser API basic prototype tests -------------------------------------------------------------------------
  /**
   * Provides basic prototype string type checking if `target` is a CSSImportRule.
   *
   * @param target - A potential CSSImportRule to test.
   *
   * @returns Is `target` a CSSImportRule.
   */
  static isCSSImportRule(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object CSSImportRule]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a CSSLayerBlockRule.
   *
   * @param target - A potential CSSLayerBlockRule to test.
   *
   * @returns Is `target` a CSSLayerBlockRule.
   */
  static isCSSLayerBlockRule(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object CSSLayerBlockRule]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a CSSStyleRule.
   *
   * @param target - A potential CSSStyleRule to test.
   *
   * @returns Is `target` a CSSStyleRule.
   */
  static isCSSStyleRule(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object CSSStyleRule]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a CSSStyleSheet.
   *
   * @param target - A potential CSSStyleSheet to test.
   *
   * @returns Is `target` a CSSStyleSheet.
   */
  static isCSSStyleSheet(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object CSSStyleSheet]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a Document.
   *
   * @param target - A potential Document to test.
   *
   * @returns Is `target` a Document.
   */
  static isDocument(target) {
    return isObject(target) && /^\[object (HTML)?Document]$/.test(Object.prototype.toString.call(target));
  }
  /**
   * Provides basic prototype string type checking if `target` is a Map.
   *
   * @param target - A potential Map to test.
   *
   * @returns Is `target` a Map.
   */
  static isMap(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object Map]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a Promise.
   *
   * @param target - A potential Promise to test.
   *
   * @returns Is `target` a Promise.
   */
  static isPromise(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object Promise]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a RegExp.
   *
   * @param target - A potential RegExp to test.
   *
   * @returns Is `target` a RegExp.
   */
  static isRegExp(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object RegExp]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a Set.
   *
   * @param target - A potential Set to test.
   *
   * @returns Is `target` a Set.
   */
  static isSet(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object Set]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a URL.
   *
   * @param target - A potential URL to test.
   *
   * @returns Is `target` a URL.
   */
  static isURL(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object URL]";
  }
  /**
   * Provides basic prototype string type checking if `target` is a Window.
   *
   * @param target - A potential Window to test.
   *
   * @returns Is `target` a Window.
   */
  static isWindow(target) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object Window]";
  }
  // DOM Element typing ---------------------------------------------------------------------------------------------
  /**
   * Ensures that the given target is an `instanceof` all known DOM elements that are focusable. Please note that
   * additional checks are required regarding focusable state; use {@link A11yHelper.isFocusable} for a complete check.
   *
   * @param target - Target to test for `instanceof` focusable HTML element.
   *
   * @returns Is target an `instanceof` a focusable DOM element.
   */
  static isFocusableHTMLElement(target) {
    for (let cntr = this.#FocusableElementClassNames.length; --cntr >= 0; ) {
      if (this.#checkDOMInstanceType(target, Node.ELEMENT_NODE, this.#FocusableElementClassNames[cntr])) {
        return true;
      }
    }
    return false;
  }
  /**
   * Provides precise type checking if `target` is a DocumentFragment.
   *
   * @param target - A potential DocumentFragment to test.
   *
   * @returns Is `target` a DocumentFragment.
   */
  static isDocumentFragment(target) {
    return this.#checkDOMInstanceType(target, Node.DOCUMENT_FRAGMENT_NODE, "DocumentFragment");
  }
  /**
   * Provides precise type checking if `target` is an Element.
   *
   * @param target - A potential Element to test.
   *
   * @returns Is `target` an Element.
   */
  static isElement(target) {
    return this.#checkDOMInstanceType(target, Node.ELEMENT_NODE, "Element");
  }
  /**
   * Provides precise type checking if `target` is a HTMLAnchorElement.
   *
   * @param target - A potential HTMLAnchorElement to test.
   *
   * @returns Is `target` a HTMLAnchorElement.
   */
  static isHTMLAnchorElement(target) {
    return this.#checkDOMInstanceType(target, Node.ELEMENT_NODE, "HTMLAnchorElement");
  }
  /**
   * Provides precise type checking if `target` is an HTMLElement.
   *
   * @param target - A potential HTMLElement to test.
   *
   * @returns Is `target` a HTMLElement.
   */
  static isHTMLElement(target) {
    return this.#checkDOMInstanceType(target, Node.ELEMENT_NODE, "HTMLElement");
  }
  /**
   * Provides precise type checking if `target` is a Node.
   *
   * @param target - A potential Node to test.
   *
   * @returns Is `target` a DOM Node.
   */
  static isNode(target) {
    if (typeof target?.nodeType !== "number") {
      return false;
    }
    if (target instanceof globalThis.Node) {
      return true;
    }
    const activeWindow = this.getWindow(target, this.#optionsInternalCheckDOM);
    const TargetNode = activeWindow?.Node;
    return TargetNode && target instanceof TargetNode;
  }
  /**
   * Provides precise type checking if `target` is a ShadowRoot.
   *
   * @param target - A potential ShadowRoot to test.
   *
   * @returns Is `target` a ShadowRoot.
   */
  static isShadowRoot(target) {
    return this.#checkDOMInstanceType(target, Node.DOCUMENT_FRAGMENT_NODE, "ShadowRoot");
  }
  /**
   * Provides precise type checking if `target` is a SVGElement.
   *
   * @param target - A potential SVGElement to test.
   *
   * @returns Is `target` a SVGElement.
   */
  static isSVGElement(target) {
    return this.#checkDOMInstanceType(target, Node.ELEMENT_NODE, "SVGElement");
  }
  // Event typing ---------------------------------------------------------------------------------------------------
  /**
   * Provides basic duck type checking for `Event` signature and optional constructor name(s).
   *
   * @param target - A potential DOM event to test.
   *
   * @param [types] Specific constructor name or Set of constructor names to match.
   *
   * @returns Is `target` an Event with optional constructor name check.
   */
  static isEvent(target, types) {
    if (typeof target?.type !== "string" || typeof target?.defaultPrevented !== "boolean" || typeof target?.stopPropagation !== "function") {
      return false;
    }
    return types !== void 0 ? this.isCtorName(target, types) : true;
  }
  /**
   * Provides basic duck type checking for `Event` signature for standard mouse / pointer events including
   * `MouseEvent` and `PointerEvent`.
   *
   * @param target - A potential DOM event to test.
   *
   * @returns Is `target` a MouseEvent or PointerEvent.
   */
  static isPointerEvent(target) {
    return this.isEvent(target, this.#PointerEventSet);
  }
  /**
   * Provides basic duck type checking for `Event` signature for all UI events.
   *
   * @param target - A potential DOM event to test.
   *
   * @returns Is `target` a UIEvent.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/UIEvent
   */
  static isUIEvent(target) {
    return this.isEvent(target, this.#UIEventSet);
  }
  /**
   * Provides basic duck type checking for `Event` signature for standard user input events including `KeyboardEvent`,
   * `MouseEvent`, and `PointerEvent`.
   *
   * @param target - A potential DOM event to test.
   *
   * @returns Is `target` a Keyboard, MouseEvent, or PointerEvent.
   */
  static isUserInputEvent(target) {
    return this.isEvent(target, this.#UserInputEventSet);
  }
  // Generic typing -------------------------------------------------------------------------------------------------
  /**
   * Provides basic type checking by constructor name(s) for objects. This can be useful when checking multiple
   * constructor names against a provided Set.
   *
   * @param target - Object to test for constructor name.
   *
   * @param types Specific constructor name or Set of constructor names to match.
   *
   * @returns Does the provided object constructor name match the types provided.
   */
  static isCtorName(target, types) {
    if (!isObject(target)) {
      return false;
    }
    if (typeof types === "string" && target?.constructor?.name === types) {
      return true;
    }
    return !!types?.has(target?.constructor?.name);
  }
  // Errors ---------------------------------------------------------------------------------------------------------
  /**
   * Provides basic duck type checking and error name for {@link DOMException}.
   *
   * @param target - Error to duck type test.
   *
   * @param name - Specific error name.
   *
   * @returns Is target a DOMException matching the error name.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException#error_names
   */
  static isDOMException(target, name) {
    return isObject(target) && Object.prototype.toString.call(target) === "[object DOMException]" && target.name === name;
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Internal generic DOM `instanceof` check. First will attempt to find the class name by `globalThis` falling back
   * to the {@link Window} associated with the DOM node.
   *
   * @param target - Target to test.
   *
   * @param nodeType - Node type constant.
   *
   * @param className - DOM classname for instanceof check.
   *
   * @returns Is the target the given nodeType and instance of class name.
   */
  static #checkDOMInstanceType(target, nodeType, className) {
    if (!isObject(target)) {
      return false;
    }
    if (target.nodeType !== nodeType) {
      return false;
    }
    const GlobalClass = window[className];
    if (GlobalClass && target instanceof GlobalClass) {
      return true;
    }
    const activeWindow = this.#hasOwnerDocument(target) ? target?.ownerDocument?.defaultView : (
      // @ts-ignore: Safe in this context.
      this.getWindow(target, this.#optionsInternalCheckDOM)
    );
    const TargetClass = activeWindow?.[className];
    return TargetClass && target instanceof TargetClass;
  }
  static #hasOwnerDocument(target) {
    return typeof target === "object" && target !== null && this.#NodesWithOwnerDocument.has(target?.nodeType);
  }
}
class URLParser {
  /**
   * @private
   */
  constructor() {
    throw new Error("URLParser constructor: This is a static class and should not be constructed.");
  }
  /**
   * Parses a URL string converting it to a fully qualified URL. If URL is an existing URL instance, it is returned
   * immediately. Optionally, you may construct a fully qualified URL from a relative base origin / path or with a
   * route prefix added to the current location origin.
   *
   * @param options - Options.
   *
   * @param options.url - URL string to convert to a URL.
   *
   * @param [options.base] - Optional fully qualified base path for relative URL construction.
   *
   * @param [options.routePrefix] - Optional route prefix to add to location origin for absolute URL strings
   *        when `base` is not defined.
   *
   * @returns Parsed URL or null if `url` is not parsed.
   */
  static parse({ url, base, routePrefix }) {
    if (CrossWindow.isURL(url)) {
      return url;
    }
    if (typeof url !== "string") {
      return null;
    }
    if (base !== void 0 && typeof base !== "string") {
      return null;
    }
    if (routePrefix !== void 0 && typeof routePrefix !== "string") {
      return null;
    }
    const targetURL = this.#createURL(url);
    if (targetURL) {
      return targetURL;
    }
    let targetBase;
    if (url.startsWith("./") || url.startsWith("../")) {
      targetBase = base ? base : `${globalThis.location.origin}${globalThis.location.pathname}`;
    } else {
      let targetRoutePrefix = "";
      if (routePrefix) {
        targetRoutePrefix = routePrefix.startsWith("/") ? routePrefix : `/${routePrefix}`;
        targetRoutePrefix = targetRoutePrefix.endsWith("/") ? targetRoutePrefix : `${targetRoutePrefix}/`;
      }
      targetBase = `${globalThis.location.origin}${targetRoutePrefix}`;
    }
    return this.#createURL(url, targetBase);
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Helper to create a URL and catch any exception. Useful until `URL.parse` and `URL.canParse` are more widespread.
   *
   * @param url - URL string.
   *
   * @param base - Base origin / path.
   *
   * @returns Valid URL or null.
   */
  static #createURL(url, base = "") {
    try {
      return new URL(url, base);
    } catch (err) {
      return null;
    }
  }
}
class AssetValidator {
  /** Default media types. */
  static #mediaTypes = Object.freeze({
    all: Frozen.Set(["audio", "img", "svg", "video"]),
    audio: Frozen.Set(["audio"]),
    img: Frozen.Set(["img"]),
    img_svg: Frozen.Set(["img", "svg"]),
    img_svg_video: Frozen.Set(["img", "svg", "video"]),
    video: Frozen.Set(["video"])
  });
  /** Supported audio extensions. */
  static #audioExtensions = /* @__PURE__ */ new Set(["mp3", "wav", "ogg", "aac", "flac", "webm"]);
  /** Supported image extensions. */
  static #imageExtensions = /* @__PURE__ */ new Set(["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"]);
  /** Supported SVG extensions. */
  static #svgExtensions = /* @__PURE__ */ new Set(["svg"]);
  /** Supported video extensions. */
  static #videoExtensions = /* @__PURE__ */ new Set(["mp4", "webm", "ogg"]);
  /**
   * @private
   */
  constructor() {
    throw new Error("AssetValidator constructor: This is a static class and should not be constructed.");
  }
  /**
   * Provides several readonly default media type Sets useful for the `mediaTypes` option.
   */
  static get MediaTypes() {
    return this.#mediaTypes;
  }
  /**
   * Parses the provided file path to determine the media type and validity based on the file extension. Certain
   * extensions can be excluded in addition to filtering by specified media types.
   *
   * @param options - Options.
   *
   * @returns The parsed asset information containing the file path, extension, element type, and whether the parsing
   *          is valid for the file extension is supported and not excluded.
   *
   * @throws {TypeError} If the provided `url` is not a string or URL, `routePrefix` is not a string,
   *         `exclude` is not a Set, or `mediaTypes` is not a Set.
   */
  static parseMedia({ url, routePrefix, exclude, mediaTypes = this.#mediaTypes.all, raiseException = false }) {
    const throws = typeof raiseException === "boolean" ? raiseException : true;
    if (typeof url !== "string" && !CrossWindow.isURL(url)) {
      if (throws) {
        throw new TypeError(`'url' is not a string or URL instance.`);
      } else {
        return { url, valid: false };
      }
    }
    if (routePrefix !== void 0 && typeof routePrefix !== "string") {
      if (throws) {
        throw new TypeError(`'routePrefix' is not a string.`);
      } else {
        return { url, valid: false };
      }
    }
    if (exclude !== void 0 && !CrossWindow.isSet(exclude)) {
      if (throws) {
        throw new TypeError(`'exclude' is not a Set.`);
      } else {
        return { url, valid: false };
      }
    }
    if (!CrossWindow.isSet(mediaTypes)) {
      if (throws) {
        throw new TypeError(`'mediaTypes' is not a Set.`);
      } else {
        return { url, valid: false };
      }
    }
    const targetURL = typeof url === "string" ? URLParser.parse({ url, routePrefix }) : url;
    if (!targetURL) {
      if (throws) {
        throw new TypeError(`'url' is invalid.`);
      } else {
        return { url, valid: false };
      }
    }
    const extensionMatch = targetURL.pathname.match(/\.([a-zA-Z0-9]+)$/);
    const extension = extensionMatch ? extensionMatch[1].toLowerCase() : void 0;
    const isExcluded = extension && CrossWindow.isSet(exclude) ? exclude.has(extension) : false;
    let elementType = void 0;
    let valid = false;
    if (extension && !isExcluded) {
      if (this.#svgExtensions.has(extension) && mediaTypes.has("svg")) {
        elementType = "svg";
        valid = true;
      } else if (this.#imageExtensions.has(extension) && mediaTypes.has("img")) {
        elementType = "img";
        valid = true;
      } else if (this.#videoExtensions.has(extension) && mediaTypes.has("video")) {
        elementType = "video";
        valid = true;
      } else if (this.#audioExtensions.has(extension) && mediaTypes.has("audio")) {
        elementType = "audio";
        valid = true;
      }
    }
    return valid ? {
      src: url,
      url: targetURL,
      extension,
      elementType,
      valid
    } : { url, valid: false };
  }
}
Object.freeze(AssetValidator);
class BrowserSupports {
  /**
   * @private
   */
  constructor() {
    throw new Error("BrowserSupports constructor: This is a static class and should not be constructed.");
  }
  /**
   * Check for container query support.
   *
   * @returns True if container queries supported.
   */
  static get containerQueries() {
    return "container" in document.documentElement.style;
  }
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update2) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update2);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i) => subscribe(
        store,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
class ThemeObserver {
  /**
   * All readable theme stores.
   *
   * @type {Readonly<({
   *    themeName: Readonly<import('svelte/store').Readable<string>>
   *    themeToken: Readonly<import('svelte/store').Readable<string>>
   * })>}
   */
  static #stores;
  /**
   * Internal setter for theme stores.
   *
   * @type {{ themeName: Function, themeToken: Function }}
   */
  static #storeSet;
  /**
   * Current theme name.
   *
   * @type {string}
   */
  static #themeName = "";
  /**
   * Current theme token.
   *
   * @type {string}
   */
  static #themeToken = "";
  /**
   * @hideconstructor
   */
  constructor() {
    throw new Error("ThemeObserver constructor: This is a static class and should not be constructed.");
  }
  /**
   * @returns {Readonly<({
   *    themeName: Readonly<import('svelte/store').Readable<string>>
   *    themeToken: Readonly<import('svelte/store').Readable<string>>
   * })>} Current platform theme stores.
   */
  static get stores() {
    return this.#stores;
  }
  /**
   * @returns {string} Current theme name; may be different from the theme token.
   */
  static get themeName() {
    return this.#themeName;
  }
  /**
   * @returns {string} Current theme token - CSS class.
   */
  static get themeToken() {
    return this.#themeToken;
  }
  /**
   * Verify that the given `theme` name or token (CSS class) is the current platform theme.
   *
   * @param {string} theme - A theme name or token to verify.
   *
   * @returns {boolean} If the requested theme matches the current platform theme.
   */
  static isTheme(theme) {
    return typeof theme === "string" && (this.#themeName === theme || this.#themeToken === theme);
  }
  /**
   * Detect if theming tokens (CSS classes) are present in the given iterable list.
   *
   * @param {Iterable<string>}  tokens - a token list to verify if any theming tokens are included.
   *
   * @param {object} [options] - Optional parameters.
   *
   * @param {boolean} [options.strict=false] - When true, all theming tokens required if multiple are verified.
   *
   * @returns {boolean} True if theming tokens present.
   */
  static hasThemedTokens(tokens, { strict = false } = {}) {
    if (!isIterable(tokens)) {
      return false;
    }
    let strictFound = !strict;
    let themeFound = false;
    for (const entry of tokens) {
      if (typeof entry !== "string") {
        continue;
      }
      if (entry.startsWith("theme-")) {
        themeFound = true;
      }
      if (entry === "themed") {
        strictFound = true;
      }
    }
    return themeFound && strictFound;
  }
  /**
   * Initialize `document.body` theme observation.
   *
   * @internal
   */
  static initialize() {
    if (this.#stores !== void 0) {
      return;
    }
    const themeName = writable(this.#themeName);
    const themeToken = writable(this.#themeToken);
    this.#stores = Object.freeze({
      themeName: Object.freeze({ subscribe: themeName.subscribe }),
      themeToken: Object.freeze({ subscribe: themeToken.subscribe })
    });
    this.#storeSet = {
      themeName: themeName.set,
      themeToken: themeToken.set
    };
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("theme-light")) {
        this.#themeName = "light";
        this.#themeToken = "theme-light";
      } else if (document.body.classList.contains("theme-dark")) {
        this.#themeName = "dark";
        this.#themeToken = "theme-dark";
      }
      this.#storeSet.themeName(this.#themeName);
      this.#storeSet.themeToken(this.#themeToken);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
  /**
   * Determine the nearest theme tokens (CSS classes) from the given element.
   *
   * @param {object} options - Required options.
   *
   * @param {Element | EventTarget} options.element - A DOM element.
   *
   * @param {Set<string>} [options.output] - An optional source Set of existing tokens.
   *
   * @param {boolean} [options.override=true] - When true, override any existing theme tokens.
   *
   * @param {boolean} [options.strict=false] - When true, ensure all required theming tokens in output.
   *
   * @returns {Iterable<string>} Any theming tokens found from the given element.
   */
  static nearestThemedTokens({ element: element2, output = /* @__PURE__ */ new Set(), override = true, strict = false }) {
    if (!CrossWindow.isSet(output)) {
      throw new TypeError(`'output' is not a Set.`);
    }
    if (!CrossWindow.isElement(element2)) {
      return output;
    }
    if (!override && ThemeObserver.hasThemedTokens(output)) {
      if (strict) {
        output.add("themed");
      }
      return output;
    }
    const nearestThemed = element2.closest(".themed") ?? CrossWindow.getDocument(element2).body;
    const match = nearestThemed.className.match(/(?:^|\s)(theme-\w+)/);
    if (match) {
      output.add("themed");
      output.add(match[1]);
    }
    return output;
  }
}
function isWritableStore(store) {
  if (store === null || store === void 0) {
    return false;
  }
  switch (typeof store) {
    case "function":
    case "object":
      return typeof store.subscribe === "function" && typeof store.set === "function" && typeof store.update === "function";
  }
  return false;
}
function subscribeIgnoreFirst(store, update2) {
  let firedFirst = false;
  return store.subscribe((value) => {
    if (!firedFirst) {
      firedFirst = true;
    } else {
      update2(value);
    }
  });
}
class SvelteSet extends Set {
  /**
   * Stores the subscribers.
   */
  #subscribers = [];
  constructor(entries) {
    super();
    if (entries !== void 0 && !isIterable(entries)) {
      throw new TypeError(`'entries' must be an iterable list.`);
    }
    if (entries) {
      for (const entry of entries) {
        super.add(entry);
      }
    }
  }
  /**
   * Appends a new element with a specified value to the end of the Set.
   *
   * @param value - Value to add.
   *
   * @returns This instance.
   */
  add(value) {
    const hasValue = super.has(value);
    super.add(value);
    if (!hasValue) {
      this.#updateSubscribers();
    }
    return this;
  }
  /**
   * Clears this set.
   */
  clear() {
    if (this.size === 0) {
      return;
    }
    super.clear();
    this.#updateSubscribers();
  }
  /**
   * Removes a specified value from the Set.
   *
   * @param value - Value to delete.
   *
   * @returns Returns true if an element in the Set existed and has been removed, or false if the element
   *          does not exist.
   */
  delete(value) {
    const result = super.delete(value);
    if (result) {
      this.#updateSubscribers();
    }
    return result;
  }
  // Store subscriber implementation --------------------------------------------------------------------------------
  /**
   * @param handler - Callback function that is invoked on update / changes.
   *
   * @returns Unsubscribe function.
   */
  subscribe(handler) {
    const currentIdx = this.#subscribers.findIndex((sub) => sub === handler);
    if (currentIdx === -1) {
      this.#subscribers.push(handler);
      handler(this);
    }
    return () => {
      const index = this.#subscribers.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscribers.splice(index, 1);
      }
    };
  }
  /**
   * Updates subscribers.
   */
  #updateSubscribers() {
    for (let cntr = 0; cntr < this.#subscribers.length; cntr++) {
      this.#subscribers[cntr](this);
    }
  }
}
function storeGenerator({ storage, serialize = JSON.stringify, deserialize = JSON.parse }) {
  function isSimpleDeriver(deriver) {
    return deriver.length < 2;
  }
  function storageReadable(key, value, start) {
    return {
      subscribe: storageWritable(key, value, start).subscribe
    };
  }
  function storageWritable(key, value, start) {
    function wrap_start(ogSet) {
      return start(function wrap_set(new_value) {
        if (storage) {
          storage.setItem(key, serialize(new_value));
        }
        return ogSet(new_value);
      }, function wrap_update(fn) {
        set(fn(get_store_value(ogStore)));
      });
    }
    if (storage) {
      const storageValue = storage.getItem(key);
      try {
        if (storageValue) {
          value = deserialize(storageValue);
        }
      } catch (err) {
      }
      storage.setItem(key, serialize(value));
    }
    const ogStore = writable(value, start ? wrap_start : void 0);
    function set(new_value) {
      if (storage) {
        storage.setItem(key, serialize(new_value));
      }
      ogStore.set(new_value);
    }
    function update2(fn) {
      set(fn(get_store_value(ogStore)));
    }
    function subscribe2(run2, invalidate) {
      return ogStore.subscribe(run2, invalidate);
    }
    return { set, update: update2, subscribe: subscribe2 };
  }
  function storageDerived(key, stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;
    if (storage && storage.getItem(key)) {
      try {
        initial_value = deserialize(storage.getItem(key));
      } catch (err) {
      }
    }
    return storageReadable(key, initial_value, (set, update2) => {
      let inited = false;
      const values = [];
      let pending = 0;
      let cleanup;
      const sync = () => {
        if (pending) {
          return;
        }
        cleanup?.();
        const input = single ? values[0] : values;
        if (isSimpleDeriver(fn)) {
          set(fn(input));
        } else {
          const result = fn(input, set, update2);
          if (typeof result === "function") {
            cleanup = result;
          }
        }
      };
      const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
        values[i] = value;
        pending &= ~(1 << i);
        if (inited) {
          sync();
        }
      }, () => {
        pending |= 1 << i;
      }));
      inited = true;
      sync();
      return function stop() {
        unsubscribers.forEach((unsubscriber) => unsubscriber());
        cleanup?.();
      };
    });
  }
  return {
    readable: storageReadable,
    writable: storageWritable,
    derived: storageDerived,
    storage,
    serialize,
    deserialize
  };
}
const sessionStores = storeGenerator({ storage: globalThis?.sessionStorage });
class TJSWebStorage {
  /** @type {import('./').StorageStores} */
  #storageStores;
  /**
   * @type {(Map<string, {
   *    store: import('svelte/store').Writable,
   *    deserialize?: (value: string, ...rest: any[]) => any,
   *    serialize?: (value: any, ...rest: any[]) => string
   * }>)}
   */
  #stores = /* @__PURE__ */ new Map();
  /**
   * @param {import('./').StorageStores} storageStores - Provides a complete set of
   *        storage API store helper functions and the associated storage API instance and serializations strategy.
   */
  constructor(storageStores) {
    this.#storageStores = storageStores;
  }
  /**
   * Creates a new store for the given key.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in stores map.
   *
   * @param {T}        [defaultValue] - A default value to set for the store.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The new store.
   */
  #createStore(key, defaultValue = void 0, storageStores) {
    try {
      const value = this.#storageStores.storage.getItem(key);
      if (value !== null) {
        const deserialize = storageStores?.deserialize ?? this.#storageStores.deserialize;
        defaultValue = deserialize(value);
      }
    } catch (err) {
    }
    const writable2 = storageStores?.writable ?? this.#storageStores.writable;
    return writable2(key, defaultValue);
  }
  /**
   * @param {string}   key - Storage key.
   *
   * @returns {(value: string, ...rest: any[]) => any} Deserialize function.
   */
  #getDeserialize(key) {
    return this.#stores.get(key)?.deserialize ?? this.#storageStores.deserialize;
  }
  /**
   * @param {string}   key - Storage key.
   *
   * @returns {(value: any, ...rest: any[]) => string} Serialize function.
   */
  #getSerialize(key) {
    return this.#stores.get(key)?.serialize ?? this.#storageStores.serialize;
  }
  /**
   * Gets a store from the `stores` Map or creates a new store for the key and a given default value.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in stores map.
   *
   * @param {T}        [defaultValue] - A default value to set for the store.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The store for the given key.
   */
  #getStore(key, defaultValue = void 0, storageStores) {
    const storeEntry = this.#stores.get(key);
    if (storeEntry) {
      return storeEntry.store;
    }
    const store = this.#createStore(key, defaultValue, storageStores);
    this.#stores.set(key, {
      store,
      deserialize: storageStores?.deserialize,
      serialize: storageStores?.serialize
    });
    return store;
  }
  /**
   * Get value from the storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {*} Value from session storage or if not defined any default value provided.
   */
  getItem(key, defaultValue) {
    let value = defaultValue;
    const storageValue = this.#storageStores.storage.getItem(key);
    if (storageValue !== null) {
      try {
        value = this.#getDeserialize(key)(storageValue);
      } catch (err) {
        value = defaultValue;
      }
    } else if (defaultValue !== void 0) {
      try {
        const newValue = this.#getSerialize(key)(defaultValue);
        this.#storageStores.storage.setItem(key, newValue);
      } catch (err) {
      }
    }
    return value;
  }
  /**
   * Returns the backing Svelte store for the given key; potentially sets a default value if the key
   * is not already set.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {T}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The Svelte store for this key.
   */
  getStore(key, defaultValue, storageStores) {
    return this.#getStore(key, defaultValue, storageStores);
  }
  /**
   * Returns whether a store has already been created for the given key.
   *
   * @param {string}   key - Key to lookup in storage API.
   */
  hasStore(key) {
    return this.#stores.has(key);
  }
  /**
   * Sets the value for the given key in storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        value - A value to set for this key.
   */
  setItem(key, value) {
    const store = this.#getStore(key);
    store.set(value);
  }
  /**
   * Convenience method to swap a boolean value stored in storage API updating the associated store value.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {boolean} The boolean swap for the given key.
   */
  swapItemBoolean(key, defaultValue) {
    const store = this.#getStore(key, defaultValue);
    let currentValue = false;
    try {
      currentValue = !!this.#getDeserialize(key)(this.#storageStores.storage.getItem(key));
    } catch (err) {
    }
    const newValue = typeof currentValue === "boolean" ? !currentValue : false;
    store.set(newValue);
    return newValue;
  }
  // Iterators ------------------------------------------------------------------------------------------------------
  /**
   * @template T
   *
   * Returns an iterable for the session storage keys and stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<[string, import('svelte/store').Writable<T>]>} Iterable iterator of keys and stores.
   * @yields {import('svelte/store').Writable<[string, Writable<T>]>}
   */
  *entries(regex = void 0) {
    if (regex !== void 0 && !CrossWindow.isRegExp(regex)) {
      throw new TypeError(`'regex' is not a RegExp`);
    }
    if (!this.#stores.size) {
      return void 0;
    }
    if (regex) {
      for (const key of this.#stores.keys()) {
        if (regex.test(key)) {
          yield [key, this.getStore(key)];
        }
      }
    } else {
      for (const key of this.#stores.keys()) {
        yield [key, this.getStore(key)];
      }
    }
  }
  /**
   * Returns an iterable for the session storage keys from existing stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<string>} Iterable iterator of session storage keys.
   * @yields {string}
   */
  *keys(regex = void 0) {
    if (regex !== void 0 && !CrossWindow.isRegExp(regex)) {
      throw new TypeError(`'regex' is not a RegExp`);
    }
    if (!this.#stores.size) {
      return void 0;
    }
    if (regex) {
      for (const key of this.#stores.keys()) {
        if (regex.test(key)) {
          yield key;
        }
      }
    } else {
      for (const key of this.#stores.keys()) {
        yield key;
      }
    }
  }
  /**
   * @template T
   *
   * Returns an iterable for the session storage stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<import('svelte/store').Writable<T>>} Iterable iterator of stores.
   * @yields {import('svelte/store').Writable<T>}
   */
  *stores(regex = void 0) {
    if (regex !== void 0 && !CrossWindow.isRegExp(regex)) {
      throw new TypeError(`'regex' is not a RegExp`);
    }
    if (!this.#stores.size) {
      return void 0;
    }
    if (regex) {
      for (const key of this.#stores.keys()) {
        if (regex.test(key)) {
          yield this.getStore(key);
        }
      }
    } else {
      for (const key of this.#stores.keys()) {
        yield this.getStore(key);
      }
    }
  }
}
class TJSSessionStorage extends TJSWebStorage {
  constructor() {
    super(sessionStores);
  }
}
function writableDerived(origins, derive, reflect, initial) {
  var childDerivedSetter, originValues, blockNextDerive = false;
  var reflectOldValues = reflect.length >= 2;
  var wrappedDerive = (got, set, update3) => {
    childDerivedSetter = set;
    if (reflectOldValues) {
      originValues = got;
    }
    if (!blockNextDerive) {
      let returned = derive(got, set, update3);
      if (derive.length < 2) {
        set(returned);
      } else {
        return returned;
      }
    }
    blockNextDerive = false;
  };
  var childDerived = derived(origins, wrappedDerive, initial);
  var singleOrigin = !Array.isArray(origins);
  function doReflect(reflecting) {
    var setWith = reflect(reflecting, originValues);
    if (singleOrigin) {
      blockNextDerive = true;
      origins.set(setWith);
    } else {
      setWith.forEach((value, i) => {
        blockNextDerive = true;
        origins[i].set(value);
      });
    }
    blockNextDerive = false;
  }
  var tryingSet = false;
  function update2(fn) {
    var isUpdated, mutatedBySubscriptions, oldValue, newValue;
    if (tryingSet) {
      newValue = fn(get_store_value(childDerived));
      childDerivedSetter(newValue);
      return;
    }
    var unsubscribe = childDerived.subscribe((value) => {
      if (!tryingSet) {
        oldValue = value;
      } else if (!isUpdated) {
        isUpdated = true;
      } else {
        mutatedBySubscriptions = true;
      }
    });
    newValue = fn(oldValue);
    tryingSet = true;
    childDerivedSetter(newValue);
    unsubscribe();
    tryingSet = false;
    if (mutatedBySubscriptions) {
      newValue = get_store_value(childDerived);
    }
    if (isUpdated) {
      doReflect(newValue);
    }
  }
  return {
    subscribe: childDerived.subscribe,
    set(value) {
      update2(() => value);
    },
    update: update2
  };
}
function propertyStore(origin, propName) {
  if (!Array.isArray(propName)) {
    return writableDerived(
      origin,
      (object) => object[propName],
      (reflecting, object) => {
        object[propName] = reflecting;
        return object;
      }
    );
  } else {
    let props = propName.concat();
    return writableDerived(
      origin,
      (value) => {
        for (let i = 0; i < props.length; ++i) {
          value = value[props[i]];
        }
        return value;
      },
      (reflecting, object) => {
        let target = object;
        for (let i = 0; i < props.length - 1; ++i) {
          target = target[props[i]];
        }
        target[props[props.length - 1]] = reflecting;
        return object;
      }
    );
  }
}
class APIConfig {
  constructor() {
  }
  /**
   * Validates `config` argument whether it is a valid {@link TJSSvelte.Config.Dynamic} or
   * {@link TJSSvelte.Config.Standard} configuration object suitable for parsing by
   * {@link TJSSvelte.API.Config.parseConfig}.
   *
   * @param config - The potential config object to validate.
   *
   * @param [options] - Options.
   *
   * @param [options.raiseException=false] - If validation fails raise an exception.
   *
   * @returns Is the config a valid TJSSvelte.Config.Dynamic or TJSSvelte.Config.Standard configuration object.
   *
   * @throws {TypeError}  Any validation error when `raiseException` is enabled.
   */
  static isConfig(config, { raiseException = false } = {}) {
    if (!isObject(config)) {
      if (raiseException) {
        throw new TypeError(`TJSSvelte.config.isConfig error: 'config' is not an object.`);
      }
      return false;
    }
    if (!TJSSvelte.util.isComponent(config.class)) {
      if (raiseException) {
        throw new TypeError(`TJSSvelte.config.isConfig error: 'config.class' is not a Svelte component constructor.`);
      }
      return false;
    }
    return true;
  }
  /**
   * Validates `config` argument whether it is a valid {@link TJSSvelte.Config.Embed} configuration object
   * suitable for directly mounting via the `<svelte:component>` directive.
   *
   * @param config - The potential config object to validate.
   *
   * @param [options] - Options.
   *
   * @param [options.raiseException=false] - If validation fails raise an exception.
   *
   * @returns Is the config a valid TJSSvelte.Config.Embed configuration object.
   *
   * @throws {TypeError}  Any validation error when `raiseException` is enabled.
   */
  static isConfigEmbed(config, { raiseException = false } = {}) {
    if (!isObject(config)) {
      if (raiseException) {
        throw new TypeError(`TJSSvelte.config.isConfigEmbed error: 'config' is not an object.`);
      }
      return false;
    }
    if (!TJSSvelte.util.isComponent(config.class)) {
      if (raiseException) {
        throw new TypeError(`TJSSvelte.config.isConfigEmbed error: 'config.class' is not a Svelte component constructor.`);
      }
      return false;
    }
    if (config.props !== void 0 && !isObject(config.props)) {
      if (raiseException) {
        throw new TypeError(`TJSSvelte.config.isConfigEmbed error: 'config.props' is not an object.`);
      }
      return false;
    }
    return true;
  }
  /**
   * Parses a TyphonJS Svelte dynamic or standard config object ensuring that the class specified is a Svelte
   * component, loads any dynamic defined `context` or `props` preparing the config object for loading into the
   * Svelte component.
   *
   * @param config - Svelte config object.
   *
   * @param [options] - Options.
   *
   * @param [options.contextExternal] - When true any context data provided will be loaded into `#external`
   *        context separating it from any internal context created by the component.
   *
   * @param [options.thisArg] - `This` reference to set for invoking any `context` or `props` defined as
   *        functions for {@link Config.Dynamic} configuration objects.
   *
   * @returns The processed Svelte config object turned with parsed `props` & `context` converted into the format
   *          supported by Svelte.
   */
  static parseConfig(config, { contextExternal = false, thisArg = void 0 } = {}) {
    if (!isObject(config)) {
      throw new TypeError(`TJSSvelte.config.parseConfig - 'config' is not an object:
${JSON.stringify(config)}.`);
    }
    if (!TJSSvelte.util.isComponent(config.class)) {
      throw new TypeError(`TJSSvelte.config.parseConfig - 'class' is not a Svelte component constructor for config:
${JSON.stringify(config)}.`);
    }
    if (config.hydrate !== void 0 && typeof config.hydrate !== "boolean") {
      throw new TypeError(`TJSSvelte.config.parseConfig - 'hydrate' is not a boolean for config:
${JSON.stringify(config)}.`);
    }
    if (config.intro !== void 0 && typeof config.intro !== "boolean") {
      throw new TypeError(`TJSSvelte.config.parseConfig - 'intro' is not a boolean for config:
${JSON.stringify(config)}.`);
    }
    if (config.target !== void 0 && !CrossWindow.isElement(config.target) && !CrossWindow.isShadowRoot(config.target) && !CrossWindow.isDocumentFragment(config.target)) {
      throw new TypeError(`TJSSvelte.config.parseConfig - 'target' is not a Element, ShadowRoot, or DocumentFragment for config:
${JSON.stringify(config)}.`);
    }
    if (config.anchor !== void 0 && !CrossWindow.isElement(config.anchor) && !CrossWindow.isShadowRoot(config.anchor) && !CrossWindow.isDocumentFragment(config.anchor)) {
      throw new TypeError(`TJSSvelte.config.parseConfig - 'anchor' is not a string, Element for config:
${JSON.stringify(config)}.`);
    }
    if (config.context !== void 0 && typeof config.context !== "function" && !isObject(config.context)) {
      throw new TypeError(`TJSSvelte.config.parseConfig - 'context' is not a function or object for config:
${JSON.stringify(config)}.`);
    }
    const svelteConfig = { ...config };
    let context = {};
    if (typeof svelteConfig.context === "function") {
      const contextFunc = svelteConfig.context;
      delete svelteConfig.context;
      const result = contextFunc.call(thisArg);
      if (isObject(result)) {
        context = { ...result };
      } else {
        throw new Error(`TJSSvelte.config.parseConfig - 'context' is a function that did not return an object for config:
${JSON.stringify(config)}`);
      }
    } else if (isObject(svelteConfig.context)) {
      context = svelteConfig.context;
      delete svelteConfig.context;
    }
    svelteConfig.props = this.#processProps(svelteConfig.props, thisArg, config);
    if (contextExternal) {
      svelteConfig.context = /* @__PURE__ */ new Map();
      svelteConfig.context.set("#external", context);
    } else {
      svelteConfig.context = new Map(Object.entries(context));
    }
    return svelteConfig;
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Processes Svelte props. Potentially props can be a function to invoke with `thisArg`.
   *
   * @param props - Svelte props.
   *
   * @param thisArg - `This` reference to set for invoking any props function.
   *
   * @param config - Svelte config
   *
   * @returns Svelte props.
   */
  static #processProps(props, thisArg, config) {
    if (typeof props === "function") {
      const result = props.call(thisArg);
      if (isObject(result)) {
        return result;
      } else {
        throw new Error(`TJSSvelte.config.parseConfig - 'props' is a function that did not return an object for config:
${JSON.stringify(config)}`);
      }
    } else if (isObject(props)) {
      return props;
    } else if (props !== void 0) {
      throw new Error(`TJSSvelte.config.parseConfig - 'props' is not a function or an object for config:
${JSON.stringify(config)}`);
    }
    return {};
  }
}
Object.seal(APIConfig);
class APIUtil {
  constructor() {
  }
  /**
   * Provides basic duck typing to determine if the provided function is a constructor function for a Svelte
   * component.
   *
   * @param comp - Data to check as a Svelte component.
   *
   * @returns Whether basic duck typing succeeds.
   */
  static isComponent(comp) {
    if (comp === null || comp === void 0 || typeof comp !== "function") {
      return false;
    }
    const prototypeName = comp?.prototype?.constructor?.name;
    if (typeof prototypeName === "string" && (prototypeName.startsWith("Proxy<") || prototypeName === "ProxyComponent")) {
      return true;
    }
    return typeof window !== "undefined" ? typeof comp?.prototype?.$destroy === "function" && typeof comp?.prototype?.$on === "function" : (
      // client-side
      typeof comp?.prototype?.render === "function"
    );
  }
  /**
   * Provides basic duck typing to determine if the provided object is a HMR ProxyComponent instance or class.
   *
   * @param {unknown}  comp - Data to check as a HMR proxy component.
   *
   * @returns {boolean} Whether basic duck typing succeeds.
   */
  static isHMRProxy(comp) {
    const instanceName = comp?.constructor?.name;
    if (typeof instanceName === "string" && (instanceName.startsWith("Proxy<") || instanceName === "ProxyComponent")) {
      return true;
    }
    const prototypeName = comp?.prototype?.constructor?.name;
    return typeof prototypeName === "string" && (prototypeName.startsWith("Proxy<") || prototypeName === "ProxyComponent");
  }
  /**
   * Runs outro transition then destroys Svelte component.
   *
   * Workaround for https://github.com/sveltejs/svelte/issues/4056
   *
   * @param instance - A Svelte component.
   *
   * @returns Promise returned after outro transition completed and component destroyed.
   */
  static async outroAndDestroy(instance2) {
    if (instance2 === void 0 || instance2 === null) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      if (instance2?.$$?.fragment && instance2?.$$?.fragment?.o) {
        group_outros();
        transition_out(instance2.$$.fragment, 0, 0, () => {
          instance2?.$destroy?.();
          resolve();
        });
        check_outros();
      } else {
        instance2?.$destroy?.();
        resolve();
      }
    });
  }
}
Object.seal(APIUtil);
class TJSSvelte {
  constructor() {
  }
  static get config() {
    return APIConfig;
  }
  /**
   * @returns The utility API.
   */
  static get util() {
    return APIUtil;
  }
}
Object.seal(TJSSvelte);
const semver = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
const validateAndParse = (version2) => {
  if (typeof version2 !== "string") {
    throw new TypeError("Invalid argument expected string");
  }
  const match = version2.match(semver);
  if (!match) {
    throw new Error(`Invalid argument not valid semver ('${version2}' received)`);
  }
  match.shift();
  return match;
};
const isWildcard = (s) => s === "*" || s === "x" || s === "X";
const tryParse = (v) => {
  const n = parseInt(v, 10);
  return isNaN(n) ? v : n;
};
const forceType = (a, b) => typeof a !== typeof b ? [String(a), String(b)] : [a, b];
const compareStrings = (a, b) => {
  if (isWildcard(a) || isWildcard(b))
    return 0;
  const [ap, bp] = forceType(tryParse(a), tryParse(b));
  if (ap > bp)
    return 1;
  if (ap < bp)
    return -1;
  return 0;
};
const compareSegments = (a, b) => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const r = compareStrings(a[i] || "0", b[i] || "0");
    if (r !== 0)
      return r;
  }
  return 0;
};
const compareVersions = (v1, v2) => {
  const n1 = validateAndParse(v1);
  const n2 = validateAndParse(v2);
  const p1 = n1.pop();
  const p2 = n2.pop();
  const r = compareSegments(n1, n2);
  if (r !== 0)
    return r;
  if (p1 && p2) {
    return compareSegments(p1.split("."), p2.split("."));
  } else if (p1 || p2) {
    return p1 ? -1 : 1;
  }
  return 0;
};
const compare = (v1, v2, operator) => {
  assertValidOperator(operator);
  const res = compareVersions(v1, v2);
  return operatorResMap[operator].includes(res);
};
const operatorResMap = {
  ">": [1],
  ">=": [0, 1],
  "=": [0],
  "<=": [-1, 0],
  "<": [-1],
  "!=": [-1, 1]
};
const allowedOperators = Object.keys(operatorResMap);
const assertValidOperator = (op) => {
  if (typeof op !== "string") {
    throw new TypeError(`Invalid operator type, expected string but got ${typeof op}`);
  }
  if (allowedOperators.indexOf(op) === -1) {
    throw new Error(`Invalid operator, expected one of ${allowedOperators.join("|")}`);
  }
};
const satisfies = (version2, range) => {
  range = range.replace(/([><=]+)\s+/g, "$1");
  if (range.includes("||")) {
    return range.split("||").some((r4) => satisfies(version2, r4));
  } else if (range.includes(" - ")) {
    const [a, b] = range.split(" - ", 2);
    return satisfies(version2, `>=${a} <=${b}`);
  } else if (range.includes(" ")) {
    return range.trim().replace(/\s{2,}/g, " ").split(" ").every((r4) => satisfies(version2, r4));
  }
  const m = range.match(/^([<>=~^]+)/);
  const op = m ? m[1] : "=";
  if (op !== "^" && op !== "~")
    return compare(version2, range, op);
  const [v1, v2, v3, , vp] = validateAndParse(version2);
  const [r1, r2, r3, , rp] = validateAndParse(range);
  const v = [v1, v2, v3];
  const r = [r1, r2 !== null && r2 !== void 0 ? r2 : "x", r3 !== null && r3 !== void 0 ? r3 : "x"];
  if (rp) {
    if (!vp)
      return false;
    if (compareSegments(v, r) !== 0)
      return false;
    if (compareSegments(vp.split("."), rp.split(".")) === -1)
      return false;
  }
  const nonZero = r.findIndex((v4) => v4 !== "0") + 1;
  const i = op === "~" ? 2 : nonZero > 1 ? nonZero : 1;
  if (compareSegments(v.slice(0, i), r.slice(0, i)) !== 0)
    return false;
  if (compareSegments(v.slice(i), r.slice(i)) === -1)
    return false;
  return true;
};
const validateStrict = (version2) => typeof version2 === "string" && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(version2);
class StyleParse {
  static #regexPixels = /(\d+)\s*px/;
  /**
   * @private
   */
  constructor() {
    throw new Error("StyleParse constructor: This is a static class and should not be constructed.");
  }
  /**
   * Parse a CSS declaration block / {@link CSSDeclarationBlock} (IE `color: red; font-size: 14px;`) into an object of
   * property / value pairs.
   *
   * This implementation is optimized for parsing the output of `CSSStyleRule.style.cssText`, which is always
   * well-formed according to the CSSOM spec. It is designed to be:
   * ```
   * - **Fast**: minimal allocations, no regex in the hot loop.
   * - **Accurate**: ignores `;` inside quotes or parentheses.
   * - **Flexible**: supports optional camel case conversion.
   * - **CSS variable safe**: leaves `--*` properties untouched.
   *```
   *
   * @param cssText - A valid CSS declaration block (no selectors).
   *
   * @param [options] - Optional parser settings.
   *
   * @param [options.camelCase=false] - Convert hyphen-case property names to camel case.
   *
   * @returns An object mapping property names to their CSS values.
   */
  static cssText(cssText, { camelCase = false } = {}) {
    if (typeof cssText !== "string" || cssText.length === 0) {
      return {};
    }
    if (cssText.indexOf(":") === -1) {
      return {};
    }
    const out = {};
    let segStart = 0;
    let parens = 0;
    let inSQ = false;
    let inDQ = false;
    for (let i = 0; i < cssText.length; i++) {
      const ch = cssText[i];
      if (ch === '"' && !inSQ) {
        inDQ = !inDQ;
      } else if (ch === "'" && !inDQ) {
        inSQ = !inSQ;
      } else if (!inSQ && !inDQ) {
        if (ch === "(") {
          parens++;
        } else if (ch === ")") {
          if (parens > 0) {
            parens--;
          }
        } else if (ch === ";" && parens === 0) {
          if (i > segStart) {
            const chunk = cssText.slice(segStart, i).trim();
            if (chunk) {
              this.#cssTextFlushDecl(chunk, out, camelCase);
            }
          }
          segStart = i + 1;
        }
      }
    }
    if (segStart < cssText.length) {
      const chunk = cssText.slice(segStart).trim();
      if (chunk) {
        this.#cssTextFlushDecl(chunk, out, camelCase);
      }
    }
    return out;
  }
  /**
   * Parses a pixel string / computed styles. Ex. `100px` returns `100`.
   *
   * @param   value - Value to parse.
   *
   * @returns The integer component of a pixel string.
   */
  static pixels(value) {
    if (typeof value !== "string") {
      return void 0;
    }
    const isPixels = this.#regexPixels.test(value);
    const number = parseInt(value);
    return isPixels && Number.isFinite(number) ? number : void 0;
  }
  /**
   * Returns the pixel value for `1rem` based on the root document element. You may apply an optional multiplier.
   *
   * @param [multiplier=1] - Optional multiplier to apply to `rem` pixel value; default: 1.
   *
   * @param [options] - Optional parameters.
   *
   * @param [options.targetDocument=document] The target DOM {@link Document} if different from the main
   *        browser global `document`.
   *
   * @returns The pixel value for `1rem` with or without a multiplier based on the root document element.
   */
  static remPixels(multiplier = 1, { targetDocument = window.document } = {}) {
    return targetDocument?.documentElement ? multiplier * parseFloat(window.getComputedStyle(targetDocument.documentElement).fontSize) : void 0;
  }
  /**
   * Split a CSS selector list into individual selectors, honoring commas that appear only at the top level
   * (IE not inside (), [], or quotes). Additional options provide inclusion / exclusion filtering of selector parts.
   *
   * Examples:
   *   '.a, .b'                                  → ['.a', '.b']
   *   ':is(.a, .b):not([data-x=","]) .c, .d'    → [':is(.a, .b):not([data-x=","]) .c', '.d']
   *
   * @param selectorText - `CSSStyleRule.selectorText` to parse.
   *
   * @param [options] - Optional filtering options.
   *
   * @param [options.excludeSelectorParts] - An array of RegExp instances to filter by exclusion.
   *
   * @param [options.includeSelectorPartSet] - A Set of strings to filter by inclusion.
   *
   * @returns Array of trimmed selector strings w/ optional filtering of parts.
   */
  static selectorText(selectorText, { excludeSelectorParts, includeSelectorPartSet } = {}) {
    const parts = [];
    if (typeof selectorText !== "string" || selectorText.length === 0) {
      return parts;
    }
    const hasExclude = Array.isArray(excludeSelectorParts) && excludeSelectorParts.length > 0;
    const hasInclude = CrossWindow.isSet(includeSelectorPartSet) && includeSelectorPartSet.size > 0;
    let start = 0;
    let inSQ = false;
    let inDQ = false;
    let paren = 0;
    let bracket = 0;
    for (let i = 0; i < selectorText.length; i++) {
      const ch = selectorText[i];
      if (ch === '"' && !inSQ) {
        inDQ = !inDQ;
        continue;
      }
      if (ch === "'" && !inDQ) {
        inSQ = !inSQ;
        continue;
      }
      if (inSQ || inDQ) {
        continue;
      }
      if (ch === "(") {
        paren++;
        continue;
      }
      if (ch === ")") {
        if (paren > 0) {
          paren--;
        }
        continue;
      }
      if (ch === "[") {
        bracket++;
        continue;
      }
      if (ch === "]") {
        if (bracket > 0) {
          bracket--;
        }
        continue;
      }
      if (ch === "," && paren === 0 && bracket === 0) {
        const piece = selectorText.slice(start, i).trim();
        if (piece && (!hasInclude || includeSelectorPartSet.has(piece)) && (!hasExclude || !excludeSelectorParts.some((rx) => rx.test(piece)))) {
          parts.push(piece);
        }
        start = i + 1;
      }
    }
    const last = selectorText.slice(start).trim();
    if (last && (!hasInclude || includeSelectorPartSet.has(last)) && (!hasExclude || !excludeSelectorParts.some((rx) => rx.test(last)))) {
      parts.push(last);
    }
    return parts;
  }
  // Internal Implementation ----------------------------------------------------------------------------------------
  /**
   * Parse a single CSS declaration string into a property / value pair and store it in the output object.
   *
   * Note: Used by {@link StyleParse.cssText}.
   *
   * This method:
   * ```
   * - Splits on the first `:` into property and value parts
   * - Trims whitespace from both
   * - Optionally converts hyphen-case to camelCase
   * - Ignores empty or malformed declarations
   * ```
   *
   * @param chunk - The raw CSS declaration string (IE `"color: red"`).
   *
   * @param out - The object to store the parsed property / value pair.
   *
   * @param camelCase - Whether to convert hyphen-case keys to camel case.
   */
  static #cssTextFlushDecl(chunk, out, camelCase) {
    const idx = chunk.indexOf(":");
    if (idx < 0) {
      return;
    }
    let key = chunk.slice(0, idx).trim();
    if (!key) {
      return;
    }
    const value = chunk.slice(idx + 1).trim();
    if (camelCase && !key.startsWith("--")) {
      let s = "";
      for (let i = 0; i < key.length; i++) {
        const code = key.charCodeAt(i);
        if (code === 45 && i + 1 < key.length) {
          i++;
          s += key[i].toUpperCase();
        } else {
          s += key[i];
        }
      }
      key = s;
    }
    out[key] = value;
  }
}
class RuleManager {
  /**
   * The specific rule instance in the association HTMLStyleElement.
   */
  #cssRule;
  /**
   * The CSS selector for this rule manager.
   */
  #selector;
  /**
   * The name that this rule manager is indexed by in the associated `StyleManager` instance.
   */
  #name;
  /**
   * @param   cssRule -
   *
   * @param   name -
   *
   * @param   selector -
   */
  constructor(cssRule, name, selector) {
    if (!CrossWindow.isCSSStyleRule(cssRule)) {
      throw new TypeError(`RuleManager error: 'cssRule' is not a CSSStyleRule instance..`);
    }
    if (typeof name !== "string") {
      throw new TypeError(`RuleManager error: 'name' is not a string.`);
    }
    if (typeof selector !== "string") {
      throw new TypeError(`RuleManager error: 'selector' is not a string.`);
    }
    this.#cssRule = cssRule;
    this.#name = name;
    this.#selector = selector;
  }
  // Accessors ------------------------------------------------------------------------------------------------------
  /**
   * @returns Provides an accessor to get the `cssText` for the style rule or undefined if not connected.
   */
  get cssText() {
    return this.isConnected ? this.#cssRule.style.cssText : void 0;
  }
  /**
   * Determines if this RuleManager is still connected / available.
   *
   * @returns Is RuleManager connected.
   */
  get isConnected() {
    const sheet = this.#cssRule?.parentStyleSheet;
    const owner = sheet?.ownerNode;
    return !!(sheet && owner && owner.isConnected);
  }
  /**
   * @returns Name of this RuleManager indexed by associated StyleManager.
   */
  get name() {
    return this.#name;
  }
  /**
   * @returns The associated selector for this CSS rule.
   */
  get selector() {
    return this.#selector;
  }
  /**
   * @param   cssText - Provides an accessor to set the `cssText` for the style rule.
   */
  set cssText(cssText) {
    if (!this.isConnected) {
      return;
    }
    this.#cssRule.style.cssText = typeof cssText === "string" ? cssText : "";
  }
  // Iterator -------------------------------------------------------------------------------------------------------
  /**
   * Allows usage in `for of` loops directly.
   *
   * @returns Entries Map iterator.
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  // Methods --------------------------------------------------------------------------------------------------------
  /**
   * @returns Iterator of CSS property entries in hyphen-case.
   */
  entries() {
    return Object.entries(this.get() ?? {})[Symbol.iterator]();
  }
  /**
   * Retrieves an object with the current CSS rule data.
   *
   * @param [options] - Optional settings.
   *
   * @param [options.camelCase=false] - Whether to convert property names to camel case.
   *
   * @returns Current CSS style data or undefined if not connected.
   */
  get(options = {}) {
    return this.isConnected ? StyleParse.cssText(this.#cssRule.style.cssText, options) : void 0;
  }
  /**
   * Gets a particular CSS property value.
   *
   * @param key - CSS property key; must be in hyphen-case (IE `background-color`).
   *
   * @returns Returns CSS property value or undefined if non-existent.
   */
  getProperty(key) {
    if (!this.isConnected) {
      return void 0;
    }
    if (typeof key !== "string") {
      throw new TypeError(`RuleManager error: 'key' is not a string.`);
    }
    const result = this.#cssRule.style.getPropertyValue(key);
    return result !== "" ? result : void 0;
  }
  /**
   * Returns whether this CSS rule manager has a given property key.
   *
   * @param key - CSS property key; must be in hyphen-case (IE `background-color`).
   *
   * @returns Property key exists / is defined.
   */
  hasProperty(key) {
    if (!this.isConnected) {
      return false;
    }
    if (typeof key !== "string") {
      throw new TypeError(`RuleManager error: 'key' is not a string.`);
    }
    return this.#cssRule.style.getPropertyValue(key) !== "";
  }
  /**
   * @returns Iterator of CSS property keys in hyphen-case.
   */
  keys() {
    return Object.keys(this.get() ?? {})[Symbol.iterator]();
  }
  /**
   * Set CSS properties in bulk by property / value. Must use hyphen-case.
   *
   * @param styles - CSS styles object.
   *
   * @param [options] - Options.
   *
   * @param [override=true] - When true overrides any existing values; default: `true`.
   */
  setProperties(styles, { override = true } = {}) {
    if (!this.isConnected) {
      return;
    }
    if (!isObject(styles)) {
      throw new TypeError(`RuleManager error: 'styles' is not an object.`);
    }
    if (typeof override !== "boolean") {
      throw new TypeError(`RuleManager error: 'override' is not a boolean.`);
    }
    if (override) {
      for (const [key, value] of Object.entries(styles)) {
        this.#cssRule.style.setProperty(key, value);
      }
    } else {
      for (const [key, value] of Object.entries(styles)) {
        if (this.#cssRule.style.getPropertyValue(key) === "") {
          this.#cssRule.style.setProperty(key, value);
        }
      }
    }
  }
  /**
   * Sets a particular property.
   *
   * @param key - CSS property key; must be in hyphen-case (IE `background-color`).
   *
   * @param value - CSS property value.
   *
   * @param [options] - Options.
   *
   * @param [options.override=true] - When true overrides any existing value; default: `true`.
   */
  setProperty(key, value, { override = true } = {}) {
    if (!this.isConnected) {
      return;
    }
    if (typeof key !== "string") {
      throw new TypeError(`RuleManager error: 'key' is not a string.`);
    }
    if (typeof value !== "string") {
      throw new TypeError(`RuleManager error: 'value' is not a string.`);
    }
    if (typeof override !== "boolean") {
      throw new TypeError(`RuleManager error: 'override' is not a boolean.`);
    }
    if (override) {
      this.#cssRule.style.setProperty(key, value);
    } else {
      if (this.#cssRule.style.getPropertyValue(key) === "") {
        this.#cssRule.style.setProperty(key, value);
      }
    }
  }
  /**
   * Removes the property keys specified. If `keys` is an iterable list then all property keys in the list are
   * removed. The keys must be in hyphen-case (IE `background-color`).
   *
   * @param keys - The property keys to remove.
   */
  removeProperties(keys) {
    if (!this.isConnected) {
      return;
    }
    if (!isIterable(keys)) {
      throw new TypeError(`RuleManager error: 'keys' is not an iterable list.`);
    }
    for (const key of keys) {
      if (typeof key === "string") {
        this.#cssRule.style.removeProperty(key);
      }
    }
  }
  /**
   * Removes a particular CSS property.
   *
   * @param key - CSS property key; must be in hyphen-case (IE `background-color`).
   *
   * @returns CSS value when removed or undefined if non-existent.
   */
  removeProperty(key) {
    if (!this.isConnected) {
      return void 0;
    }
    if (typeof key !== "string") {
      throw new TypeError(`RuleManager error: 'key' is not a string.`);
    }
    const result = this.#cssRule.style.removeProperty(key);
    return result !== "" ? result : void 0;
  }
}
class StyleManager {
  /**
   * Provides a token allowing internal instance construction.
   */
  static #CTOR_TOKEN = Symbol("StyleManager.CTOR_TOKEN");
  /**
   * Stores configured RuleManager instance by name.
   */
  #cssRuleMap;
  /**
   * CSS ID associated with style element.
   */
  #id;
  /**
   * Any associated CSS layer name.
   */
  #layerName;
  /**
   * The target style element.
   */
  #styleElement;
  /**
   * The version of this style manager.
   */
  #version;
  /**
   * @private
   */
  constructor({ cssRuleMap, id, styleElement, version: version2, layerName, token }) {
    if (token !== StyleManager.#CTOR_TOKEN) {
      throw new Error("StyleManager constructor: Please use the static `create` or `connect` methods.");
    }
    this.#cssRuleMap = cssRuleMap;
    this.#id = id;
    this.#layerName = layerName;
    this.#styleElement = styleElement;
    this.#version = version2;
  }
  // Static Methods -------------------------------------------------------------------------------------------------
  /**
   * Connect to an existing dynamic styles managed element by CSS ID with semver check on version range compatibility.
   *
   * @param   options - Options.
   */
  static connect({ id, range, document: document2 = window.document, warn = false }) {
    if (typeof id !== "string") {
      throw new TypeError(`'id' is not a string.`);
    }
    if (typeof range !== "string") {
      throw new TypeError(`'range' is not a string.`);
    }
    if (!CrossWindow.isDocument(document2)) {
      throw new TypeError(`'document' is not an instance of HTMLDocument.`);
    }
    return this.#initializeConnect(document2, id, range, warn);
  }
  /**
   * @param   options - Options.
   *
   * @returns Created style manager instance or undefined if already exists with a higher version.
   */
  static create(options) {
    return this.#createImpl(options);
  }
  /**
   * Query and check for an existing dynamic style manager element / instance given a CSS ID.
   *
   * @param   options - Options.
   *
   * @returns Undefined if no style manager is configured for the given CSS ID otherwise an object containing the
   *          current version and HTMLStyleElement associated with the CSS ID.
   */
  static exists({ id, document: document2 = window.document }) {
    if (typeof id !== "string") {
      throw new TypeError(`'id' is not a string.`);
    }
    if (!CrossWindow.isDocument(document2)) {
      throw new TypeError(`'document' is not an instance of HTMLDocument.`);
    }
    const existingStyleEl = document2.querySelector(`head style#${id}`);
    if (existingStyleEl) {
      const existingVersion = existingStyleEl.getAttribute("data-version") ?? "";
      if (validateStrict(existingVersion)) {
        return {
          id,
          version: existingVersion,
          element: existingStyleEl
        };
      }
    }
    return void 0;
  }
  // Accessors ------------------------------------------------------------------------------------------------------
  /**
   * Determines if this StyleManager style element is still connected / available.
   *
   * @returns Is StyleManager connected.
   */
  get isConnected() {
    return !!this.#styleElement?.isConnected;
  }
  /**
   * @returns Provides an accessor to get the `textContent` for the style sheet.
   */
  get textContent() {
    return this.#styleElement?.textContent;
  }
  /**
   * @returns Returns the version of this instance.
   */
  get version() {
    return this.#version;
  }
  // Iterator -------------------------------------------------------------------------------------------------------
  /**
   * Allows usage in `for of` loops directly.
   *
   * @returns Entries Map iterator.
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  // Methods --------------------------------------------------------------------------------------------------------
  /**
   * Provides a copy constructor to duplicate an existing StyleManager instance into a new document.
   *
   * @param   options - Required clone options.
   *
   * @returns New style manager instance or undefined if not connected.
   */
  clone({ document: document2, force = false, warn = false }) {
    if (!this.isConnected) {
      StyleManager.#log(warn, "clone", `This style manager instance is not connected for id: ${this.#id}`);
      return void 0;
    }
    if (!CrossWindow.isDocument(document2)) {
      throw new TypeError(`'document' is not an instance of HTMLDocument.`);
    }
    const rules = {};
    for (const key of this.#cssRuleMap.keys()) {
      const selector = this.#cssRuleMap.get(key)?.selector;
      if (selector) {
        rules[key] = selector;
      }
    }
    const newStyleManager = StyleManager.#createImpl({
      id: this.#id,
      version: this.#version,
      layerName: this.#layerName,
      rules,
      document: document2,
      force,
      warn
    });
    if (newStyleManager) {
      for (const key of this.#cssRuleMap.keys()) {
        if (newStyleManager.#cssRuleMap.has(key)) {
          const value = this.#cssRuleMap.get(key)?.cssText;
          const targetRuleManager = newStyleManager.#cssRuleMap.get(key);
          if (value && targetRuleManager) {
            targetRuleManager.cssText = value;
          }
        }
      }
      return newStyleManager;
    }
    return void 0;
  }
  /**
   * @returns RuleManager entries iterator.
   */
  entries() {
    return this.#cssRuleMap.entries();
  }
  /**
   * Retrieves an associated {@link RuleManager} by name.
   *
   * @param   ruleName - Rule name.
   *
   * @returns Associated rule manager for given name or undefined if the rule name is not defined or manager is
   *          unconnected.
   */
  get(ruleName) {
    if (!this.isConnected) {
      return;
    }
    return this.#cssRuleMap.get(ruleName);
  }
  /**
   * Returns whether a {@link StyleManager.CSSRuleManger} exists for the given name.
   *
   * @param ruleName - Rule name.
   *
   * @returns Is there a CSS rule manager with the given name.
   */
  has(ruleName) {
    return this.#cssRuleMap.has(ruleName);
  }
  /**
   * @returns {MapIterator<string>} RuleManager keys iterator.
   */
  keys() {
    return this.#cssRuleMap.keys();
  }
  /**
   * @returns Iterator of all RuleManager instances.
   */
  values() {
    return this.#cssRuleMap.values();
  }
  // Internal Implementation ----------------------------------------------------------------------------------------
  /**
   * Internal `create` implementation with additional `force` option to override any version check.
   *
   * @param   options - Options.
   *
   * @returns Created style manager instance or undefined if already exists with a higher version.
   */
  static #createImpl({ id, rules, version: version2, layerName, document: document2 = window.document, force = false, warn = false }) {
    if (typeof id !== "string") {
      throw new TypeError(`'id' is not a string.`);
    }
    if (!isObject(rules)) {
      throw new TypeError(`'rules' is not an object.`);
    }
    if (!CrossWindow.isDocument(document2)) {
      throw new TypeError(`'document' is not an instance of HTMLDocument.`);
    }
    if (!validateStrict(version2)) {
      throw new TypeError(`'version' is not a valid semver string.`);
    }
    if (typeof force !== "boolean") {
      throw new TypeError(`'force' is not a boolean.`);
    }
    if (typeof warn !== "boolean") {
      throw new TypeError(`'warn' is not a boolean.`);
    }
    if (layerName !== void 0 && typeof layerName !== "string") {
      throw new TypeError(`'layerName' is not a string.`);
    }
    const current = this.exists({ id, document: document2 });
    if (isObject(current)) {
      if (force || compare(version2, current.version, ">")) {
        current.element?.remove?.();
        return this.#initializeCreate(document2, id, rules, version2, layerName);
      } else {
        this.#log(warn, "create", `Could not create instance as one already exists with a higher version for ID: ${id}.`);
        return void 0;
      }
    } else {
      return this.#initializeCreate(document2, id, rules, version2, layerName);
    }
  }
  /**
   * @param document - Target Document.
   *
   * @param id - Associated CSS ID
   *
   * @param range - SemVer version or version range.
   *
   * @param warn - When true, log warnings.
   *
   * @returns Style manager connected to existing element / style rules or undefined if no connection possible.
   */
  static #initializeConnect(document2, id, range, warn = false) {
    const styleElement = document2.querySelector(`head style#${id}`);
    if (!styleElement || styleElement?.sheet === null) {
      this.#log(warn, "connect", `Could not find existing style element for id: ${id}`);
      return void 0;
    }
    const existingRules = styleElement._tjsRules;
    const existingVersion = styleElement._tjsVersion;
    const existingLayerName = styleElement._tjsLayerName;
    let targetSheet = styleElement.sheet;
    if (!isObject(existingRules)) {
      this.#log(warn, "connect", `Could not find rules configuration on existing style element for id: ${id}`);
      return void 0;
    }
    if (!validateStrict(existingVersion)) {
      this.#log(warn, "connect", `Could not find version on existing style element for id: ${id}`);
      return void 0;
    }
    if (existingLayerName !== void 0 && typeof existingLayerName !== "string") {
      this.#log(warn, "connect", `Could not find layer name on existing style element for id: ${id}`);
      return void 0;
    }
    if (!satisfies(existingVersion, range)) {
      this.#log(warn, "connect", `Requested range (${range}) does not satisfy existing version: ${existingVersion}`);
      return void 0;
    }
    if (!CrossWindow.isCSSStyleSheet(targetSheet)) {
      return void 0;
    }
    const cssRuleMap = /* @__PURE__ */ new Map();
    const reverseRuleMap = new Map(Object.entries(existingRules).map(([key, value]) => [value, key]));
    try {
      if (typeof existingLayerName) {
        let foundLayer = false;
        for (const rule of Array.from(targetSheet.cssRules)) {
          if (CrossWindow.isCSSLayerBlockRule(rule) && rule.name === existingLayerName) {
            targetSheet = rule;
            foundLayer = true;
          }
        }
        if (!foundLayer) {
          this.#log(warn, "connect", `Could not find CSSLayerBlockRule for existing layer name: ${existingLayerName}`);
          return void 0;
        }
      }
      for (const cssRule of Array.from(targetSheet.cssRules)) {
        if (!CrossWindow.isCSSStyleRule(cssRule)) {
          continue;
        }
        const selector = cssRule?.selectorText;
        if (reverseRuleMap.has(selector)) {
          const ruleName = reverseRuleMap.get(selector);
          cssRuleMap.set(ruleName, new RuleManager(cssRule, ruleName, selector));
          reverseRuleMap.delete(selector);
        }
      }
      if (reverseRuleMap.size > 0) {
        this.#log(warn, "connect", `Could not find CSSStyleRules for these rule configurations: ${JSON.stringify([...reverseRuleMap])}`);
        return void 0;
      }
      return new StyleManager({
        cssRuleMap,
        id,
        version: existingVersion,
        layerName: existingLayerName,
        styleElement,
        token: StyleManager.#CTOR_TOKEN
      });
    } catch (error) {
      console.error(`TyphonJS Runtime [StyleManager error]: Please update your browser to the latest version.`, error);
    }
    return void 0;
  }
  /**
   * @param document - Target Document.
   *
   * @param id - Associated CSS ID
   *
   * @param rules -
   *
   * @param version -
   *
   * @param layerName -
   *
   * @returns New StyleManager instance.
   */
  static #initializeCreate(document2, id, rules, version2, layerName) {
    const styleElement = document2.createElement("style");
    styleElement.id = id;
    styleElement.setAttribute("data-version", String(version2));
    styleElement._tjsRules = rules;
    styleElement._tjsVersion = version2;
    styleElement._tjsLayerName = layerName;
    document2.head.append(styleElement);
    let targetSheet;
    if (styleElement.sheet === null) {
      return void 0;
    }
    const cssRuleMap = /* @__PURE__ */ new Map();
    try {
      if (layerName) {
        const index = styleElement.sheet.insertRule(`@layer ${layerName} {}`);
        targetSheet = styleElement.sheet.cssRules[index];
      } else {
        targetSheet = styleElement.sheet;
      }
      if (rules) {
        for (const ruleName in rules) {
          const selector = rules[ruleName];
          const index = targetSheet.insertRule(`${selector} {}`);
          const cssRule = targetSheet.cssRules[index];
          cssRuleMap.set(ruleName, new RuleManager(cssRule, ruleName, selector));
        }
      }
      return new StyleManager({
        cssRuleMap,
        id,
        version: version2,
        layerName,
        styleElement,
        token: StyleManager.#CTOR_TOKEN
      });
    } catch (error) {
      console.error(`TyphonJS Runtime [StyleManager error]: Please update your browser to the latest version.`, error);
      if (styleElement && styleElement.parentNode) {
        styleElement.remove();
      }
    }
    return void 0;
  }
  /**
   * @param   warn - When true, log warnings.
   *
   * @param   path - Particular interaction path for warning.
   *
   * @param   message - Message to log.
   */
  static #log(warn, path, message) {
    if (warn) {
      console.warn(`[TRL StyleManager] ${path} warning: ${message}`);
    }
  }
}
var _a$1, _b;
class StyleSheetResolve {
  /**
   * Detects hyphen-case separator for camel case property key conversion.
   */
  static #HYPHEN_CASE_REGEX = /-([a-z])/g;
  /**
   * Detects just a single `(prefers-*)` CSSMediaRule condition.
   */
  static #MEDIA_RULE_PREFERS = /^\s*\(?\s*prefers-[^)]+(?:\s*:\s*[^)]+)?\)?\s*$/i;
  /**
   * Detects relative `url()` references in CSSStyleRule `cssText`.
   */
  static #URL_DETECTION_REGEX = /\burl\(\s*(['"]?)(?!data:|https?:|\/|#)/i;
  /**
   * Captures contents of `url()` references.
   */
  static #URL_REGEX = /url\((['"]?)([^'")]+)\1\)/g;
  /**
   * Internal tracking of frozen state; once frozen, no more modifications are possible.
   */
  #frozen = false;
  /**
   * Parsed selector to associated style properties.
   */
  #sheetMap = /* @__PURE__ */ new Map();
  /**
   * Parse a CSSStyleSheet instance with the given options or accept a pre-filled Map generating a new
   * `StyleSheetResolve` instance.
   *
   * @param styleSheetOrMap - The stylesheet instance to parse or an existing parsed stylesheet Map.
   *
   * @param [options] - Options for parsing stylesheet.
   *
   * @returns {StyleSheetResolve} New instance with the given parsed data.
   */
  static parse(styleSheetOrMap, options = {}) {
    return new _a$1().parse(styleSheetOrMap, options);
  }
  /**
   * Instantiate an empty `StyleSheetResolve` instance.
   */
  constructor() {
  }
  // Accessors ------------------------------------------------------------------------------------------------------
  /**
   * @returns Current frozen state; when true no more modifications are possible.
   */
  get frozen() {
    return this.#frozen;
  }
  /**
   * @returns Returns the size / count of selector properties tracked.
   */
  get size() {
    return this.#sheetMap.size;
  }
  // Iterator -------------------------------------------------------------------------------------------------------
  /**
   * Allows usage in `for of` loops directly.
   *
   * @returns Entries Map iterator.
   */
  *[Symbol.iterator]() {
    yield* this.entries();
  }
  // Methods --------------------------------------------------------------------------------------------------------
  /**
   * Clears any existing parsed styles.
   */
  clear() {
    if (this.#frozen) {
      throw new Error("Cannot modify a frozen StyleSheetResolve instance.");
    }
    this.#sheetMap.clear();
  }
  /**
   * Clones this instance returning a new `StyleSheetResolve` instance with a copy of the data.
   *
   * @returns Cloned instance.
   */
  clone() {
    return _a$1.parse(this.#clone(this.#sheetMap));
  }
  /**
   * Deletes an entry in the parsed stylesheet Map.
   *
   * @param   selector - Selector key to delete.
   *
   * @returns Success state.
   */
  delete(selector) {
    if (this.#frozen) {
      throw new Error("Cannot modify a frozen StyleSheetResolve instance.");
    }
    return this.#sheetMap.delete(selector);
  }
  /**
   * Entries iterator of selector / style properties objects.
   *
   * @returns {MapIterator<[string, { [key: string]: string }]>} Tracked CSS selector key / value iterator.
   * @yields
   */
  *entries() {
    for (const key of this.#sheetMap.keys()) {
      yield [key, { ...this.#sheetMap.get(key) }];
    }
  }
  /**
   * Freezes this instance disallowing further modifications to the stylesheet data.
   *
   * @returns This instance.
   */
  freeze() {
    if (this.#frozen) {
      return this;
    }
    this.#frozen = true;
    for (const props of this.#sheetMap.values()) {
      Object.freeze(props);
    }
    Object.freeze(this.#sheetMap);
    return this;
  }
  /**
   * Gets all properties associated with the given selector(s). You may combine multiple selectors for a
   * combined result. You may also provide additional selectors as the `resolve` option to substitute any CSS variables
   * in the target selector(s).
   *
   * @param selector - A selector or list of selectors to retrieve.
   *
   * @param [options] - Options.
   *
   * @returns Style properties object or undefined.
   */
  get(selector, { camelCase = false, depth, resolve, warnCycles = false, warnResolve = false } = {}) {
    if (typeof selector !== "string" && !isIterable(selector)) {
      throw new TypeError(`'selector' must be a string or an iterable list of strings.`);
    }
    if (typeof camelCase !== "boolean") {
      throw new TypeError(`'camelCase' must be a boolean.`);
    }
    if (depth !== void 0 && (!Number.isInteger(depth) || depth < 1)) {
      throw new TypeError(`'depth' must be a positive integer >= 1.`);
    }
    if (resolve !== void 0 && typeof resolve !== "string" && !isIterable(resolve)) {
      throw new TypeError(`'resolve' must be a string or an iterable list of strings.`);
    }
    if (typeof warnCycles !== "boolean") {
      throw new TypeError(`'warnCycles' must be a boolean.`);
    }
    if (typeof warnResolve !== "boolean") {
      throw new TypeError(`'warnResolve' must be a boolean.`);
    }
    let result = void 0;
    if (isIterable(selector)) {
      for (const entry of selector) {
        if (this.#sheetMap.has(entry)) {
          result = Object.assign(result ?? {}, this.#sheetMap.get(entry));
        }
      }
    } else {
      if (this.#sheetMap.has(selector)) {
        result = Object.assign(result ?? {}, this.#sheetMap.get(selector));
      }
    }
    if (result && (typeof resolve === "string" || isIterable(resolve))) {
      const resolveList = typeof resolve === "string" ? [resolve] : Array.from(resolve);
      depth = typeof depth === "number" ? depth : Math.max(1, resolveList.length);
      const resolveData = {
        parentNotFound: /* @__PURE__ */ new Set(),
        seenCycles: /* @__PURE__ */ new Set(),
        warnCycles
      };
      for (let cntr = 0; cntr < depth && cntr < resolveList.length; cntr++) {
        this.#resolve(result, resolveList, resolveData);
      }
      if (resolveData.parentNotFound.size > 0) {
        console.warn(`[TyphonJS Runtime] StyleSheetResolve - resolve - Could not locate parent selector(s) for resolution: '${[...resolveData.parentNotFound].join(", ")}'`);
      }
    }
    if (result && camelCase) {
      const remapped = {};
      const toUpper = (_, str) => str.toUpperCase();
      for (const key in result) {
        const mappedKey = key.startsWith("--") ? key : key.replace(_a$1.#HYPHEN_CASE_REGEX, toUpper);
        remapped[mappedKey] = result[key];
      }
      result = remapped;
    }
    return result;
  }
  /**
   * Gets a specific property value from the given `selector` and `property` key.
   *
   * @param   selector - A selector or list of selectors to retrieve.
   *
   * @param   property - Specific property to locate.
   *
   * @param   [options] - Options.
   *
   * @returns Style property value.
   */
  getProperty(selector, property, options) {
    const data = this.get(selector, options);
    return isObject(data) && property in data ? data[property] : void 0;
  }
  /**
   * Test if `StyleSheetResolve` tracks the given selector.
   *
   * @param   selector - CSS selector to check.
   *
   * @returns StyleSheetResolve tracks the given selector.
   */
  has(selector) {
    return this.#sheetMap.has(selector);
  }
  /**
   * @returns Tracked CSS selector keys iterator.
   */
  keys() {
    return this.#sheetMap.keys();
  }
  /**
   * Merges selectors and style properties from another StyleSheetResolve instance into this one. By default, the
   * source of the merge overrides existing properties. You may choose to preserve existing values along with
   * specifying exact selector matches.
   *
   * @param   source - Another instance to merge from.
   *
   * @param   [options] - Options.
   *
   * @returns This instance.
   */
  merge(source, { exactMatch = false, strategy = "override" } = {}) {
    if (this.#frozen) {
      throw new Error("Cannot modify a frozen StyleSheetResolve instance.");
    }
    if (!(source instanceof _a$1)) {
      throw new TypeError(`'source' is not a StyleSheetResolve instance.`);
    }
    for (const selectorPart of source.keys()) {
      if (exactMatch && !this.#sheetMap.has(selectorPart)) {
        continue;
      }
      const incoming = source.#sheetMap.get(selectorPart);
      if (!incoming) {
        continue;
      }
      const current = this.#sheetMap.get(selectorPart) ?? {};
      const merged = strategy === "preserve" ? Object.assign({}, { ...incoming }, current) : Object.assign({}, current, incoming);
      this.#sheetMap.set(selectorPart, merged);
    }
    return this;
  }
  /**
   * Clears existing stylesheet mapping and parses the given stylesheet or Map.
   *
   * @param   styleSheetOrMap - The stylesheet element to parse or an existing parsed stylesheet Map.
   *
   * @param   [options] - Options for parsing stylesheet.
   *
   * @returns This instance.
   */
  parse(styleSheetOrMap, options = {}) {
    if (this.#frozen) {
      throw new Error("Cannot modify a frozen StyleSheetResolve instance.");
    }
    this.#sheetMap.clear();
    if (!CrossWindow.isCSSStyleSheet(styleSheetOrMap) && !CrossWindow.isMap(styleSheetOrMap)) {
      throw new TypeError(`'styleSheetOrMap' must be a 'CSSStyleSheet' instance or a parsed Map of stylesheet entries.`);
    }
    if (!isObject(options)) {
      throw new TypeError(`'options' is not an object.`);
    }
    if (options.baseHref !== void 0 && typeof options.baseHref !== "string") {
      throw new TypeError(`'baseHref' must be a string.`);
    }
    if (options.excludeSelectorParts !== void 0 && !isIterable(options.excludeSelectorParts)) {
      throw new TypeError(`'excludeSelectorParts' must be a list of RegExp instances.`);
    }
    if (options.includeCSSLayers !== void 0 && !isIterable(options.includeCSSLayers)) {
      throw new TypeError(`'includeCSSLayers' must be a list of RegExp instances.`);
    }
    if (options.includeSelectorPartSet !== void 0 && !CrossWindow.isSet(options.includeSelectorPartSet)) {
      throw new TypeError(`'includeSelectorPartSet' must be a Set of strings.`);
    }
    if (options.mediaQuery !== void 0 && typeof options.mediaQuery !== "boolean") {
      throw new TypeError(`'mediaQuery' must be a boolean.`);
    }
    if (options.urlRewrite !== void 0 && typeof options.urlRewrite !== "boolean") {
      throw new TypeError(`'urlRewrite' must be a boolean.`);
    }
    if (CrossWindow.isCSSStyleSheet(styleSheetOrMap)) {
      this.#parse(styleSheetOrMap, options);
    } else if (CrossWindow.isMap(styleSheetOrMap)) {
      this.#sheetMap = this.#clone(styleSheetOrMap);
    }
    return this;
  }
  /**
   * Directly sets a selector key with the given style properties object.
   *
   * @param   selector - A single selector key to set.
   *
   * @param   styleObj - Style data object of property / value pairs.
   */
  set(selector, styleObj) {
    if (this.#frozen) {
      throw new Error("Cannot modify a frozen StyleSheetResolve instance.");
    }
    if (typeof selector !== "string") {
      throw new TypeError(`'selector' must be a string.`);
    }
    if (!isObject(styleObj)) {
      throw new TypeError(`'styleObj' must be an object.`);
    }
    this.#sheetMap.set(selector, styleObj);
  }
  // Internal Implementation ----------------------------------------------------------------------------------------
  /**
   * Shallow clone of source Map into target Map.
   *
   * @param   sourceMap - Source Map.
   *
   * @param   [targetMap] - Target Map.
   *
   * @returns Shallow copy cloned Map.
   */
  #clone(sourceMap, targetMap = /* @__PURE__ */ new Map()) {
    for (const [selector, props] of sourceMap.entries()) {
      targetMap.set(selector, { ...props });
    }
    return targetMap;
  }
  /**
   * Parses the given CSSStyleSheet instance.
   *
   * @param styleSheet - The stylesheet to parse.
   *
   * @param [opts] - Options for parsing stylesheet.
   */
  #parse(styleSheet, opts) {
    const options = {
      baseHref: styleSheet.href ?? opts.baseHref,
      excludeSelectorParts: isIterable(opts.excludeSelectorParts) ? Array.from(opts.excludeSelectorParts) : [],
      includeCSSLayers: isIterable(opts.includeCSSLayers) ? Array.from(opts.includeCSSLayers) : [],
      includeSelectorPartSet: CrossWindow.isSet(opts.includeSelectorPartSet) ? opts.includeSelectorPartSet : /* @__PURE__ */ new Set(),
      mediaQuery: opts.mediaQuery ?? true,
      urlRewrite: opts.urlRewrite ?? true
    };
    const rules = styleSheet.cssRules;
    const allStyleRules = [];
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      switch (rule.constructor.name) {
        case "CSSLayerBlockRule":
          this.#processLayerBlockRule(rule, void 0, allStyleRules, options);
          break;
        case "CSSMediaRule":
          this.#processMediaRule(rule, allStyleRules, options);
          break;
        case "CSSStyleRule":
          allStyleRules.push(rule);
          break;
      }
    }
    this.#processStyleRules(allStyleRules, options);
  }
  /**
   * Recursively parses / processes a CSSLayerBlockRule and encountered CSSStyleRule entries.
   *
   * @param   blockRule - The `CSSLayerBlockRule` to parse.
   *
   * @param   parentLayerName - Name of parent CSS layer.
   *
   * @param   allStyleRules - All style rules to process.
   *
   * @param   opts - Sanitized process options.
   */
  #processLayerBlockRule(blockRule, parentLayerName, allStyleRules, opts) {
    const fullname = typeof parentLayerName === "string" ? `${parentLayerName}.${blockRule.name}` : blockRule.name;
    const includeLayer = opts.includeCSSLayers.length === 0 || opts.includeCSSLayers.some((regex) => regex.test(fullname));
    const layerBlockRules = [];
    const rules = blockRule.cssRules;
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      switch (rule.constructor.name) {
        case "CSSLayerBlockRule":
          layerBlockRules.push(rule);
          break;
        case "CSSMediaRule":
          this.#processMediaRule(rule, allStyleRules, opts);
          break;
        case "CSSStyleRule":
          if (includeLayer) {
            allStyleRules.push(rule);
          }
          break;
      }
    }
    for (let i = 0; i < layerBlockRules.length; i++) {
      this.#processLayerBlockRule(layerBlockRules[i], fullname, allStyleRules, opts);
    }
  }
  /**
   * Simple processing of a CSSMediaRule and directly nested CSSStyleRule entries.
   *
   * @param   mediaRule - The `CSSMediaRule` to parse.
   *
   * @param   allStyleRules - All style rules to process.
   *
   * @param   opts - Sanitized process options.
   */
  #processMediaRule(mediaRule, allStyleRules, opts) {
    if (!opts.mediaQuery) {
      return;
    }
    if (!window.matchMedia(mediaRule.media.mediaText).matches) {
      return;
    }
    if (!_a$1.#MEDIA_RULE_PREFERS.test(mediaRule.media.mediaText)) {
      return;
    }
    const rules = mediaRule.cssRules;
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      switch (rule.constructor.name) {
        case "CSSStyleRule":
          allStyleRules.push(rule);
          break;
      }
    }
  }
  /**
   * Processes all collected `CSSStyleRules`.
   *
   * @param   allStyleRules - Style rules to parse.
   *
   * @param   opts - ProcessOptions.
   */
  #processStyleRules(allStyleRules, opts) {
    for (let i = 0; i < allStyleRules.length; i++) {
      const styleRule = allStyleRules[i];
      const selectorParts = StyleParse.selectorText(styleRule.selectorText, opts);
      if (selectorParts.length) {
        const result = StyleParse.cssText(styleRule.style.cssText);
        if (opts.urlRewrite && opts.baseHref && _a$1.#URL_DETECTION_REGEX.test(styleRule.style.cssText)) {
          this.#processStyleRuleUrls(result, opts);
        }
        for (let j = selectorParts.length; --j >= 0; ) {
          const part = selectorParts[j];
          if (this.#sheetMap.has(part)) {
            Object.assign(this.#sheetMap.get(part), result);
          } else {
            this.#sheetMap.set(part, result);
          }
        }
      }
    }
  }
  /**
   * Resolve relative `url(...)` references in CSS property values based on the stylesheet origin.
   *
   * This method rewrites relative paths in `url(...)` to absolute paths (IE `/assets/img.png`) using the
   * CSSStyleSheet `href` when available or falling back to the provided `baseHref` for inline stylesheets.
   *
   * @param result - Parsed CSS property key-value map.
   *
   * @param opts - Processing options.
   */
  #processStyleRuleUrls(result, opts) {
    const baseHref = opts.baseHref;
    for (const key in result) {
      let value = result[key];
      if (value.indexOf("url(") === -1) {
        continue;
      }
      if (!_a$1.#URL_DETECTION_REGEX.test(value)) {
        continue;
      }
      let modified = false;
      value = value.replace(_a$1.#URL_REGEX, (match, quote, relPath) => {
        try {
          const absPath = new URL(relPath, baseHref).pathname;
          modified = true;
          return `url(${quote}${absPath}${quote})`;
        } catch {
          return match;
        }
      });
      if (modified) {
        result[key] = value;
      }
    }
  }
  /**
   * Resolves intermediate CSS variables defined in the `result` style properties object with data from the given
   * `resolve` selector(s).
   *
   * @param   result - Copy of source selector style properties to resolve.
   *
   * @param   resolve - Parent CSS variable resolution selectors.
   *
   * @param   resolveData - Resolution data.
   */
  #resolve(result, resolve, resolveData) {
    const parentVars = {};
    for (let i = 0; i < resolve.length; i++) {
      const entry = resolve[i];
      const parent = this.get(entry);
      if (!isObject(parent)) {
        resolveData.parentNotFound.add(entry);
        continue;
      }
      for (const key in parent) {
        if (key.startsWith("--")) {
          parentVars[key] = parent[key];
        }
      }
    }
    const cssVars = new ResolveVars(result, parentVars, resolveData);
    if (!cssVars.unresolvedCount) {
      return;
    }
    for (const key in parentVars) {
      cssVars.set(key, parentVars[key]);
    }
    Object.assign(result, cssVars.resolved);
  }
}
_a$1 = StyleSheetResolve;
class ResolveVars {
  /**
   * Detect CSS variable.
   */
  static #DETECT_CSS_VAR_REGEX = /--[\w-]+/g;
  /**
   * Capture CSS variable fallbacks.
   */
  static #CSS_VAR_FALLBACK_REGEX = /^var\((?<varName>--[\w-]+)\s*,\s*(?<fallback>.+?)\)$/;
  /**
   * Replace CSS variable fallbacks.
   */
  static #CSS_VAR_FALLBACK_REPLACE_REGEX = /var\((--[\w-]+)(?:\s*,\s*[^()]*?)?\)/g;
  /**
   * Closed CSS variable.
   */
  static #CSS_VAR_REGEX = /^var\((--[\w-]+)\)$/;
  /**
   * Open CSS variable.
   */
  static #CSS_VAR_PARTIAL_REGEX = /^var\((--[\w-]+)/;
  /**
   * Prevent deep fallback recursion.
   */
  static #MAX_FALLBACK_DEPTH = 10;
  /**
   * Initial style properties w/ CSS variables to track.
   */
  #propMap = /* @__PURE__ */ new Map();
  /**
   * Reverse lookup for CSS variable name to associated property.
   */
  #varToProp = /* @__PURE__ */ new Map();
  /**
   * Resolved CSS variable from parent selector properties.
   */
  #varResolved = /* @__PURE__ */ new Map();
  #parentVars;
  #resolveData;
  /**
   * @param initial - Initial style entry to resolve.
   *
   * @param parentVars - All parent resolution vars.
   *
   * @param resolveData - Resolution data.
   */
  constructor(initial, parentVars, resolveData) {
    this.#parentVars = parentVars;
    this.#resolveData = resolveData;
    for (const prop in initial) {
      const value = initial[prop];
      let match;
      _b.#DETECT_CSS_VAR_REGEX.lastIndex = 0;
      let found = false;
      while (match = _b.#DETECT_CSS_VAR_REGEX.exec(value)) {
        const entry = match[0];
        if (!this.#varToProp.has(entry))
          this.#varToProp.set(entry, /* @__PURE__ */ new Set());
        this.#varToProp.get(entry).add(prop);
        found = true;
      }
      if (found)
        this.#propMap.set(prop, value);
    }
  }
  /**
   * Resolves properties in `#propMap` by substituting var(...) expressions using resolved values in #varResolved. If
   * no resolution is available, attempts to preserve fallback expressions in their original var(...) form.
   *
   * Supports chained fallbacks like: var(--a, var(--b, var(--c, red))) and resolving variables in statements like
   * `calc(1rem + var(--x))`.
   *
   * @returns All fields that have been resolved.
   */
  get resolved() {
    const result = {};
    for (const entry of this.#varToProp.keys()) {
      const props = this.#varToProp.get(entry);
      const varResolved = this.#varResolved.get(entry);
      if (!props) {
        continue;
      }
      if (varResolved) {
        for (const prop of props) {
          let value = this.#propMap.get(prop);
          if (value.indexOf(`var(${entry}`) !== -1) {
            value = value.replace(_b.#CSS_VAR_FALLBACK_REPLACE_REGEX, (match) => {
              const varName = match.match(_b.#CSS_VAR_PARTIAL_REGEX)?.[1];
              const resolved = this.#varResolved.get(varName);
              return resolved ?? match;
            });
          }
          this.#propMap.set(prop, value);
          result[prop] = value;
        }
      } else {
        for (const prop of props) {
          const value = this.#propMap.get(prop);
          if (value.indexOf(`var(${entry}`) === -1) {
            continue;
          }
          const fallback = this.#resolveNestedFallback(value);
          this.#propMap.set(prop, fallback);
          result[prop] = fallback;
        }
      }
    }
    return result;
  }
  /**
   * @returns Unresolved field count.
   */
  get unresolvedCount() {
    let count = 0;
    for (const entry of this.#varToProp.keys()) {
      if (!this.#varResolved.has(entry)) {
        count++;
      }
    }
    return count;
  }
  /**
   * Sets the parent selector defined CSS variable for resolution.
   *
   * @param name - CSS variable name
   *
   * @param value - Value of target CSS variable.
   */
  set(name, value) {
    if (typeof value !== "string" || value.length === 0) {
      return;
    }
    if (this.#resolveData.warnCycles) {
      this.#setCycleWarn(name, value);
    } else {
      if (this.#varToProp.has(name) && !this.#varResolved.has(name)) {
        this.#varResolved.set(name, value);
      }
    }
  }
  // Internal Implementation ----------------------------------------------------------------------------------------
  /**
   * Performs DFS traversal to detect cycles in CSS variable resolution. Tracks the resolution path and emits a
   * warning if a cycle is found. Each affected property is reported once with its originating chain.
   *
   * @param   value - Value of target CSS variable.
   *
   * @param   visited - Visited CSS variables.
   *
   * @param   seenCycles - Dedupe cyclic dependency warnings.
   *
   * @returns Resolution result or undefined.
   */
  #resolveCycleWarn(value, visited, seenCycles) {
    const match = value.match(_b.#CSS_VAR_REGEX);
    if (!match) {
      return value;
    }
    const next = match[1];
    if (visited.has(next)) {
      const cycleChain = [...visited, next];
      const cycleKey = cycleChain.join("→");
      if (!seenCycles.has(cycleKey)) {
        seenCycles.add(cycleKey);
        const affected = cycleChain.flatMap((varName) => Array.from(this.#varToProp.get(varName) ?? []).map((prop) => `- ${prop} (via ${varName})`));
        if (affected.length > 0) {
          console.warn(`[TyphonJS Runtime] StyleSheetResolve - CSS variable cyclic dependency detected: ${cycleChain.join(" → ")}
Affected properties:
${affected.join("\n")}`);
        }
      }
      return void 0;
    }
    visited.add(next);
    const nextValue = this.#varResolved.get(next) ?? this.#parentVars[next];
    if (typeof nextValue !== "string") {
      return void 0;
    }
    return this.#resolveCycleWarn(nextValue, visited, seenCycles);
  }
  /**
   * Resolve fallback chains of the form: var(--a, var(--b, ...))
   * - Only replaces the top-level var if it is resolved.
   * - Leaves fallback intact if unresolved.
   * - Recursively evaluates nested fallbacks if they are var(...).
   * - Limits recursion depth to prevent cycles or stack overflow.
   *
   * @param   expr - CSS var expression to resolve.
   *
   * @param   depth - Recursion guard
   *
   * @returns Nested fallback resolution result.
   */
  #resolveNestedFallback(expr, depth = 0) {
    if (depth > _b.#MAX_FALLBACK_DEPTH) {
      return expr;
    }
    const match = expr.match(_b.#CSS_VAR_FALLBACK_REGEX);
    if (!match?.groups) {
      return expr;
    }
    const { varName, fallback } = match.groups;
    const resolved = this.#varResolved.get(varName);
    if (resolved !== void 0) {
      return resolved;
    }
    const fallbackTrimmed = fallback.trim();
    if (fallbackTrimmed.startsWith("var(")) {
      let nested = this.#resolveNestedFallback(fallbackTrimmed, depth + 1);
      const innerMatch = nested.match(_b.#CSS_VAR_REGEX);
      if (innerMatch) {
        const innerResolved = this.#varResolved.get(innerMatch[1]);
        if (innerResolved !== void 0) {
          nested = innerResolved;
        }
      }
      return `var(${varName}, ${nested})`;
    }
    return `var(${varName}, ${fallbackTrimmed})`;
  }
  /**
   * Sets the parent selector defined CSS variable for resolution with additional cyclic dependency metrics.
   *
   * @param   name - CSS variable name
   *
   * @param   value - Value of target CSS variable.
   */
  #setCycleWarn(name, value) {
    const resolved = this.#resolveCycleWarn(value, /* @__PURE__ */ new Set([name]), this.#resolveData.seenCycles);
    if (resolved !== void 0 && this.#varToProp.has(name) && !this.#varResolved.has(name)) {
      this.#varResolved.set(name, resolved);
    }
  }
}
_b = ResolveVars;
function backInOut(t) {
  const s = 1.70158 * 1.525;
  if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));
  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
}
function backIn(t) {
  const s = 1.70158;
  return t * t * ((s + 1) * t - s);
}
function backOut(t) {
  const s = 1.70158;
  return --t * t * ((s + 1) * t + s) + 1;
}
function bounceOut(t) {
  const a = 4 / 11;
  const b = 8 / 11;
  const c = 9 / 10;
  const ca = 4356 / 361;
  const cb = 35442 / 1805;
  const cc = 16061 / 1805;
  const t2 = t * t;
  return t < a ? 7.5625 * t2 : t < b ? 9.075 * t2 - 9.9 * t + 3.4 : t < c ? ca * t2 - cb * t + cc : 10.8 * t * t - 20.52 * t + 10.72;
}
function bounceInOut(t) {
  return t < 0.5 ? 0.5 * (1 - bounceOut(1 - t * 2)) : 0.5 * bounceOut(t * 2 - 1) + 0.5;
}
function bounceIn(t) {
  return 1 - bounceOut(1 - t);
}
function circInOut(t) {
  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
}
function circIn(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function circOut(t) {
  return Math.sqrt(1 - --t * t);
}
function cubicInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 0.5 * Math.pow(2 * t - 2, 3) + 1;
}
function cubicIn(t) {
  return t * t * t;
}
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function elasticInOut(t) {
  return t < 0.5 ? 0.5 * Math.sin(13 * Math.PI / 2 * 2 * t) * Math.pow(2, 10 * (2 * t - 1)) : 0.5 * Math.sin(-13 * Math.PI / 2 * (2 * t - 1 + 1)) * Math.pow(2, -10 * (2 * t - 1)) + 1;
}
function elasticIn(t) {
  return Math.sin(13 * t * Math.PI / 2) * Math.pow(2, 10 * (t - 1));
}
function elasticOut(t) {
  return Math.sin(-13 * (t + 1) * Math.PI / 2) * Math.pow(2, -10 * t) + 1;
}
function expoInOut(t) {
  return t === 0 || t === 1 ? t : t < 0.5 ? 0.5 * Math.pow(2, 20 * t - 10) : -0.5 * Math.pow(2, 10 - t * 20) + 1;
}
function expoIn(t) {
  return t === 0 ? t : Math.pow(2, 10 * (t - 1));
}
function expoOut(t) {
  return t === 1 ? t : 1 - Math.pow(2, -10 * t);
}
function quadInOut(t) {
  t /= 0.5;
  if (t < 1) return 0.5 * t * t;
  t--;
  return -0.5 * (t * (t - 2) - 1);
}
function quadIn(t) {
  return t * t;
}
function quadOut(t) {
  return -t * (t - 2);
}
function quartInOut(t) {
  return t < 0.5 ? 8 * Math.pow(t, 4) : -8 * Math.pow(t - 1, 4) + 1;
}
function quartIn(t) {
  return Math.pow(t, 4);
}
function quartOut(t) {
  return Math.pow(t - 1, 3) * (1 - t) + 1;
}
function quintInOut(t) {
  if ((t *= 2) < 1) return 0.5 * t * t * t * t * t;
  return 0.5 * ((t -= 2) * t * t * t * t + 2);
}
function quintIn(t) {
  return t * t * t * t * t;
}
function quintOut(t) {
  return --t * t * t * t * t + 1;
}
function sineInOut(t) {
  return -0.5 * (Math.cos(Math.PI * t) - 1);
}
function sineIn(t) {
  const v = Math.cos(t * Math.PI * 0.5);
  if (Math.abs(v) < 1e-14) return 1;
  else return 1 - v;
}
function sineOut(t) {
  return Math.sin(t * Math.PI / 2);
}
const svelteEasingFunc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  backIn,
  backInOut,
  backOut,
  bounceIn,
  bounceInOut,
  bounceOut,
  circIn,
  circInOut,
  circOut,
  cubicIn,
  cubicInOut,
  cubicOut,
  elasticIn,
  elasticInOut,
  elasticOut,
  expoIn,
  expoInOut,
  expoOut,
  linear: identity,
  quadIn,
  quadInOut,
  quadOut,
  quartIn,
  quartInOut,
  quartOut,
  quintIn,
  quintInOut,
  quintOut,
  sineIn,
  sineInOut,
  sineOut
}, Symbol.toStringTag, { value: "Module" }));
const easingFunc = svelteEasingFunc;
function getEasingFunc(easingRef, options) {
  if (typeof easingRef === "function") {
    return easingRef;
  }
  const easingFn = easingFunc[easingRef];
  return easingFn ? easingFn : easingFunc[options?.default ?? "linear"];
}
class A11yHelper {
  /**
   * You can set global focus debugging enabled by setting `A11yHelper.debug = true`.
   *
   * @type {boolean}
   */
  static #globalDebug = false;
  /**
   * @private
   */
  constructor() {
    throw new Error("A11yHelper constructor: This is a static class and should not be constructed.");
  }
  /**
   * @returns {boolean} Global debugging enabled.
   */
  static get debug() {
    return this.#globalDebug;
  }
  /**
   * @param {boolean}  debug - Global debug enabled
   */
  static set debug(debug) {
    if (typeof debug !== "boolean") {
      throw new TypeError(`'debug' is not a boolean.`);
    }
    this.#globalDebug = debug;
  }
  /**
   * Runs a media query to determine if the user / OS configuration is set up for reduced motion / animation.
   *
   * @returns {boolean} User prefers reduced motion.
   */
  static get prefersReducedMotion() {
    return globalThis?.matchMedia("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }
  /**
   * Apply focus to the HTMLElement / SVGElement targets in a given A11yFocusSource data object. An iterable list
   * `options.focusEl` can contain HTMLElement / SVGElements or selector strings. If multiple focus targets are
   * provided in a list then the first valid target found will be focused. If focus target is a string then a lookup
   * via `document.querySelector` is performed. In this case you should provide a unique selector for the desired
   * focus target.
   *
   * Note: The body of this method is postponed to the next clock tick to allow any changes in the DOM to occur that
   * might alter focus targets before applying.
   *
   * @param {A11yFocusSource | { focusSource: A11yFocusSource }}   options - The focus options instance to apply.
   */
  static applyFocusSource(options) {
    if (!isObject(options)) {
      if (this.debug) {
        console.debug(`A11yHelper.applyFocusSource debug - options is not an object: `, options);
      }
      return;
    }
    const focusOpts = isObject(options?.focusSource) ? options.focusSource : options;
    setTimeout(() => {
      const debug = typeof focusOpts.debug === "boolean" ? this.debug || focusOpts.debug : this.debug;
      if (isIterable(focusOpts.focusEl)) {
        if (debug) {
          console.debug(
            `A11yHelper.applyFocusSource debug - Attempting to apply focus target: `,
            focusOpts.focusEl
          );
        }
        for (const target of focusOpts.focusEl) {
          if (target?.nodeType === Node.ELEMENT_NODE && target?.isConnected) {
            target?.focus();
            if (debug) {
              console.debug(`A11yHelper.applyFocusSource debug - Applied focus to target: `, target);
            }
            break;
          } else if (typeof target === "string") {
            const element2 = document.querySelector(target);
            if (element2?.nodeType === Node.ELEMENT_NODE && element2?.isConnected) {
              element2?.focus();
              if (debug) {
                console.debug(`A11yHelper.applyFocusSource debug - Applied focus to target: `, element2);
              }
              break;
            } else if (debug) {
              console.debug(`A11yHelper.applyFocusSource debug - Could not query selector: `, target);
            }
          }
        }
      } else if (debug) {
        console.debug(`A11yHelper.applyFocusSource debug - No focus targets defined.`);
      }
    }, 0);
  }
  /**
   * Returns first focusable element within a specified element.
   *
   * @param {Element | Document} [element=document] - Optional element to start query.
   *
   * @param {FocusableElementOptions} [options] - Optional parameters.
   *
   * @returns {FocusableElement} First focusable child element.
   */
  static getFirstFocusableElement(element2 = document, options) {
    const focusableElements = this.getFocusableElements(element2, options);
    return focusableElements.length > 0 ? focusableElements[0] : void 0;
  }
  /**
   * Returns all focusable elements within a specified element.
   *
   * @param {Element | Document} [element=document] Optional element to start query.
   *
   * @param {FocusableElementOptions} [options] - Optional parameters.
   *
   * @returns {Array<FocusableElement>} Child keyboard focusable elements.
   */
  static getFocusableElements(element2 = document, {
    anchorHref = true,
    ignoreClasses,
    ignoreElements,
    parentHidden = false,
    selectors
  } = {}) {
    if (element2?.nodeType !== Node.ELEMENT_NODE && element2?.nodeType !== Node.DOCUMENT_NODE) {
      throw new TypeError(`'element' is not a HTMLElement, SVGElement, or Document instance.`);
    }
    if (typeof anchorHref !== "boolean") {
      throw new TypeError(`'anchorHref' is not a boolean.`);
    }
    if (ignoreClasses !== void 0 && !isIterable(ignoreClasses)) {
      throw new TypeError(`'ignoreClasses' is not an iterable list.`);
    }
    if (ignoreElements !== void 0 && !CrossWindow.isSet(ignoreElements)) {
      throw new TypeError(`'ignoreElements' is not a Set.`);
    }
    if (selectors !== void 0 && typeof selectors !== "string") {
      throw new TypeError(`'selectors' is not a string.`);
    }
    const selectorQuery = selectors ?? this.#getFocusableSelectors(anchorHref);
    let allElements = [...element2.querySelectorAll(selectorQuery)];
    if (ignoreElements && ignoreClasses) {
      allElements = allElements.filter((el) => {
        let hasIgnoreClass = false;
        for (const ignoreClass of ignoreClasses) {
          if (el.classList.contains(ignoreClass)) {
            hasIgnoreClass = true;
            break;
          }
        }
        return !hasIgnoreClass && !ignoreElements.has(el) && el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
      });
    } else if (ignoreClasses) {
      allElements = allElements.filter((el) => {
        let hasIgnoreClass = false;
        for (const ignoreClass of ignoreClasses) {
          if (el.classList.contains(ignoreClass)) {
            hasIgnoreClass = true;
            break;
          }
        }
        return !hasIgnoreClass && el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
      });
    } else if (ignoreElements) {
      allElements = allElements.filter((el) => {
        return !ignoreElements.has(el) && el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
      });
    } else {
      allElements = allElements.filter((el) => {
        return el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
      });
    }
    if (parentHidden) {
      allElements = allElements.filter((el) => {
        return !this.isParentHidden(el, element2);
      });
    }
    return allElements;
  }
  /**
   * Returns the default focusable selectors query.
   *
   * @param {boolean}  [anchorHref=true] - When true anchors must have an HREF.
   *
   * @returns {string} Focusable selectors for `querySelectorAll`.
   */
  static #getFocusableSelectors(anchorHref = true) {
    return `button, [contenteditable=""], [contenteditable="true"], details summary:not([tabindex="-1"]), embed, a${anchorHref ? "[href]" : ""}, iframe, object, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])`;
  }
  /**
   * Gets a A11yFocusSource object from the given DOM event allowing for optional X / Y screen space overrides.
   * Browsers (Firefox / Chrome) forwards a mouse event for the context menu keyboard button. Provides detection of
   * when the context menu event is from the keyboard. Firefox as of (1/23) does not provide the correct screen space
   * coordinates, so for keyboard context menu presses coordinates are generated from the centroid point of the
   * element.
   *
   * A default fallback element or selector string may be provided to provide the focus target. If the event comes from
   * the keyboard however the source focused element is inserted as the target with the fallback value appended to the
   * list of focus targets. When A11yFocusSource is applied by {@link A11yHelper.applyFocusSource} the target focus
   * list is iterated through until a connected target is found and focus applied.
   *
   * @param {object} options - Options
   *
   * @param {KeyboardEvent | MouseEvent}   [options.event] - The source DOM event.
   *
   * @param {boolean} [options.debug] - When true {@link A11yHelper.applyFocusSource} logs focus target data.
   *
   * @param {FocusableElement | string} [options.focusEl] - A specific HTMLElement / SVGElement or selector
   *        string as the focus target.
   *
   * @param {number}   [options.x] - Used when an event isn't provided; integer of event source in screen space.
   *
   * @param {number}   [options.y] - Used when an event isn't provided; integer of event source in screen space.
   *
   * @returns {A11yFocusSource} A A11yFocusSource object.
   *
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1426671
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=314314
   *
   * @privateRemarks
   * TODO: Evaluate / test against touch input devices.
   */
  static getFocusSource({ event, x, y, focusEl, debug = false }) {
    if (focusEl !== void 0 && !this.isFocusSource(focusEl)) {
      throw new TypeError(
        `A11yHelper.getFocusSource error: 'focusEl' is not a HTMLElement, SVGElement, or string.`
      );
    }
    if (debug !== void 0 && typeof debug !== "boolean") {
      throw new TypeError(`A11yHelper.getFocusSource error: 'debug' is not a boolean.`);
    }
    const debugEnabled = typeof debug === "boolean" ? this.debug || debug : this.debug;
    if (event === void 0) {
      if (typeof x !== "number") {
        throw new TypeError(`A11yHelper.getFocusSource error: 'event' not defined and 'x' is not a number.`);
      }
      if (typeof y !== "number") {
        throw new TypeError(`A11yHelper.getFocusSource error: 'event' not defined and 'y' is not a number.`);
      }
      const result2 = {
        debug,
        focusEl: focusEl !== void 0 ? [focusEl] : void 0,
        x,
        y
      };
      if (debugEnabled) {
        console.debug(`A11yHelper.getFocusSource debug: generated 'focusSource' without event: `, result2);
      }
      return result2;
    }
    if (event !== void 0 && !CrossWindow.isUserInputEvent(event)) {
      throw new TypeError(
        `A11yHelper.getFocusSource error: 'event' is not a KeyboardEvent, MouseEvent, or PointerEvent.`
      );
    }
    if (x !== void 0 && !Number.isFinite(x)) {
      throw new TypeError(`A11yHelper.getFocusSource error: 'x' is not a number.`);
    }
    if (y !== void 0 && !Number.isFinite(y)) {
      throw new TypeError(`A11yHelper.getFocusSource error: 'y' is not a number.`);
    }
    let targetEl;
    if (event) {
      if (A11yHelper.isFocusable(event.target)) {
        targetEl = event.target;
        if (debugEnabled) {
          console.debug(`A11yHelper.getFocusSource debug: 'targetEl' set to event.target: `, targetEl);
        }
      } else if (A11yHelper.isFocusable(event.currentTarget)) {
        targetEl = event.currentTarget;
        if (debugEnabled) {
          console.debug(`A11yHelper.getFocusSource debug: 'targetEl' set to event.currentTarget: `, targetEl);
        }
      } else {
        if (debugEnabled) {
          console.debug(
            `A11yHelper.getFocusSource debug: 'event.target' / 'event.currentTarget' are not focusable.`
          );
          console.debug(`A11yHelper.getFocusSource debug: 'event.target': `, event.target);
          console.debug(`A11yHelper.getFocusSource debug: 'event.currentTarget': `, event.currentTarget);
        }
      }
      if (targetEl) {
        if (targetEl?.nodeType !== Node.ELEMENT_NODE && typeof targetEl?.focus !== "function") {
          throw new TypeError(`A11yHelper.getFocusSource error: 'targetEl' is not an HTMLElement or SVGElement.`);
        }
      }
    }
    const result = { debug };
    if (CrossWindow.isPointerEvent(event)) {
      if (event?.button !== 2 && event.type === "contextmenu") {
        const rectTarget = targetEl ?? event.target;
        const rect = rectTarget.getBoundingClientRect();
        result.source = "keyboard";
        result.x = x ?? rect.left + rect.width / 2;
        result.y = y ?? rect.top + rect.height / 2;
        result.focusEl = targetEl ? [targetEl] : [];
        if (focusEl) {
          result.focusEl.push(focusEl);
        }
      } else {
        result.source = "pointer";
        result.x = x ?? event.pageX;
        result.y = y ?? event.pageY;
        result.focusEl = targetEl ? [targetEl] : [];
        if (focusEl) {
          result.focusEl.push(focusEl);
        }
      }
    } else {
      const rectTarget = targetEl ?? event?.target;
      if (rectTarget) {
        const rect = rectTarget.getBoundingClientRect();
        result.source = "keyboard";
        result.x = x ?? rect.left + rect.width / 2;
        result.y = y ?? rect.top + rect.height / 2;
        result.focusEl = targetEl ? [targetEl] : [];
      }
      if (focusEl) {
        result.focusEl.push(focusEl);
      }
    }
    if (debugEnabled) {
      console.debug(`A11yHelper.getFocusSource debug: generated 'focusSource' with event: `, result);
    }
    return result;
  }
  /**
   * Returns first focusable element within a specified element.
   *
   * @param {Element | Document} [element=document] - Optional element to start query.
   *
   * @param {FocusableElementOptions} [options] - Optional parameters.
   *
   * @returns {FocusableElement} Last focusable child element.
   */
  static getLastFocusableElement(element2 = document, options) {
    const focusableElements = this.getFocusableElements(element2, options);
    return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : void 0;
  }
  /**
   * Tests if the given element is focusable.
   *
   * Note: A special case for focus testing occurs when an element has `tabindex` of `-1` _and_ the
   * `tjs-a11y-focusable` class.
   *
   * @param {unknown} el - Element to test.
   *
   * @param {object} [options] - Optional parameters.
   *
   * @param {boolean} [options.anchorHref=true] - When true anchors must have an HREF.
   *
   * @param {Iterable<string>} [options.ignoreClasses] - Iterable list of classes to ignore elements.
   *
   * @returns {boolean} Element is focusable.
   */
  static isFocusable(el, { anchorHref = true, ignoreClasses } = {}) {
    if (el === void 0 || el === null || el?.hidden || !el?.isConnected || el?.nodeType !== Node.ELEMENT_NODE || typeof el?.focus !== "function") {
      return false;
    }
    if (typeof anchorHref !== "boolean") {
      throw new TypeError(`'anchorHref' is not a boolean.`);
    }
    if (ignoreClasses !== void 0 && !isIterable(ignoreClasses)) {
      throw new TypeError(`'ignoreClasses' is not an iterable list.`);
    }
    const contenteditableAttr = el.getAttribute("contenteditable");
    const contenteditableFocusable = typeof contenteditableAttr === "string" && (contenteditableAttr === "" || contenteditableAttr === "true");
    const tabindexAttr = globalThis.parseInt(el.getAttribute("tabindex"));
    const tabindexFocusable = Number.isInteger(tabindexAttr) && (tabindexAttr >= 0 || tabindexAttr === -1 && el.classList.contains("tjs-a11y-focusable"));
    if (contenteditableFocusable || tabindexFocusable || CrossWindow.isFocusableHTMLElement(el)) {
      if (anchorHref && !tabindexFocusable && CrossWindow.isHTMLAnchorElement(el) && typeof el.getAttribute("href") !== "string") {
        return false;
      }
      return el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
    }
    return false;
  }
  /**
   * Convenience method to check if the given data is a valid focus source.
   *
   * @param {Element | EventTarget | string}   data - Either an HTMLElement, SVGElement, or selector string.
   *
   * @returns {boolean} Is valid focus source.
   */
  static isFocusSource(data) {
    return typeof data === "string" || data?.nodeType === Node.ELEMENT_NODE && typeof data?.focus === "function";
  }
  /**
   * Tests if the given `element` is a Element node and has a `focus` method.
   *
   * @param {unknown}  element - Element to test for focus method.
   *
   * @returns {element is FocusableElement} Whether the element has a focus method.
   */
  static isFocusTarget(element2) {
    return element2 !== void 0 && element2 !== null && element2?.nodeType === Node.ELEMENT_NODE && typeof element2?.focus === "function";
  }
  /**
   * Perform a parent traversal from the current active element attempting to match the given element to test whether
   * current active element is within that element.
   *
   * @param {Element}  element - An element to match in parent traversal from the active element.
   *
   * @returns {boolean} Whether there is focus within the given element.
   */
  static isFocusWithin(element2) {
    if (!isObject(element2) || element2?.hidden || !element2?.isConnected) {
      return false;
    }
    let active2 = CrossWindow.getActiveElement(element2);
    if (!active2) {
      return false;
    }
    while (active2) {
      if (active2 === element2) {
        return true;
      }
      active2 = active2.parentElement;
    }
    return false;
  }
  /**
   * Traverses the given element's parent elements to check if any parent has `offsetWidth` and `offsetHeight` of 0,
   * indicating that a parent element is hidden. If a parent element is hidden, the given element is also considered
   * hidden. This is a reasonably efficient check and can be enabled as a filter step in conjunction with focusable
   * element detection methods like {@link A11yHelper.getFocusableElements}.
   *
   * @param {Element}  element - The starting element to check.
   *
   * @param {Element}  [stopElement] - The stopping parent element for traversal. If not defined, `document.body` is
   *        used as the stopping element.
   *
   * @returns {boolean} `true` if a parent element of the given element is hidden; otherwise, `false`.
   */
  static isParentHidden(element2, stopElement) {
    if (!CrossWindow.isElement(element2)) {
      throw new TypeError(`'element' is not an Element.`);
    }
    stopElement = stopElement ?? CrossWindow.getDocument(element2)?.body;
    if (!CrossWindow.isElement(stopElement)) {
      throw new TypeError(`'stopElement' must be an Element.`);
    }
    let current = element2.parentElement;
    while (current) {
      if (current === stopElement) {
        break;
      }
      if (current.offsetWidth === 0 && current.offsetHeight === 0) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }
}
function clamp(value = 0, min = 0, max = 0) {
  return Math.min(Math.max(value, min), max);
}
function degToRad(deg) {
  return deg * (Math.PI / 180);
}
function radToDeg(rad) {
  return rad * (180 / Math.PI);
}
function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end;
}
// @license MIT (https://github.com/toji/gl-matrix/blob/master/LICENSE.md)
var GLM_EPSILON = 1e-6;
var Mat4 = class _Mat4 extends Float32Array {
  static #IDENTITY_4X4 = new Float32Array([
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ]);
  /**
   * Temporary variable to prevent repeated allocations in the algorithms within Mat4.
   * These are declared as TypedArrays to aid in tree-shaking.
   */
  static #TMP_VEC3 = new Float32Array(3);
  /**
   * Create a {@link Mat4}.
   *
   * @category Constructor
   */
  constructor(...values) {
    switch (values.length) {
      case 16:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 16);
        break;
      case 1:
        const v = values[0];
        if (typeof v === "number") {
          super([
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v
          ]);
        } else {
          super(v, 0, 16);
        }
        break;
      default:
        super(_Mat4.#IDENTITY_4X4);
        break;
    }
  }
  // ============
  // Accessors
  // ============
  /**
   * A string representation of `this`
   * Equivalent to `Mat4.str(this);`
   *
   * @category Accessors
   */
  get str() {
    return _Mat4.str(this);
  }
  // ===================
  // Instance methods
  // ===================
  /**
   * Copy the values from another {@link Mat4} into `this`.
   * @category Methods
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a) {
    this.set(a);
    return this;
  }
  /**
   * Set `this` to the identity matrix
   * Equivalent to Mat4.identity(this)
   * @category Methods
   *
   * @returns `this`
   */
  identity() {
    this.set(_Mat4.#IDENTITY_4X4);
    return this;
  }
  /**
   * Multiplies this {@link Mat4} against another one
   * Equivalent to `Mat4.multiply(this, this, b);`
   * @category Methods
   *
   * @param b - The second operand
   * @returns `this`
   */
  multiply(b) {
    return _Mat4.multiply(this, this, b);
  }
  /**
   * Alias for {@link Mat4.multiply}
   * @category Methods
   */
  mul(b) {
    return this;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Transpose this {@link Mat4}
   * Equivalent to `Mat4.transpose(this, this);`
   * @category Methods
   *
   * @returns `this`
   */
  transpose() {
    return _Mat4.transpose(this, this);
  }
  /**
   * Inverts this {@link Mat4}
   * Equivalent to `Mat4.invert(this, this);`
   * @category Methods
   *
   * @returns `this`
   */
  invert() {
    return _Mat4.invert(this, this);
  }
  /**
   * Translate this {@link Mat4} by the given vector
   * Equivalent to `Mat4.translate(this, this, v);`
   * @category Methods
   *
   * @param v - The {@link Vec3} to translate by
   * @returns `this`
   */
  translate(v) {
    return _Mat4.translate(this, this, v);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the given axis
   * Equivalent to `Mat4.rotate(this, this, rad, axis);`
   * @category Methods
   *
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `this`
   */
  rotate(rad, axis) {
    return _Mat4.rotate(this, this, rad, axis);
  }
  /**
   * Scales this {@link Mat4} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat4.scale(this, this, v);`
   * @category Methods
   *
   * @param v - The {@link Vec3} to scale the matrix by
   * @returns `this`
   */
  scale(v) {
    return _Mat4.scale(this, this, v);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the X axis
   * Equivalent to `Mat4.rotateX(this, this, rad);`
   * @category Methods
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateX(rad) {
    return _Mat4.rotateX(this, this, rad);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Y axis
   * Equivalent to `Mat4.rotateY(this, this, rad);`
   * @category Methods
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateY(rad) {
    return _Mat4.rotateY(this, this, rad);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Z axis
   * Equivalent to `Mat4.rotateZ(this, this, rad);`
   * @category Methods
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateZ(rad) {
    return _Mat4.rotateZ(this, this, rad);
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * Equivalent to `Mat4.perspectiveNO(this, fovy, aspect, near, far);`
   * @category Methods
   *
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `this`
   */
  perspectiveNO(fovy, aspect, near, far) {
    return _Mat4.perspectiveNO(this, fovy, aspect, near, far);
  }
  /**
   * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * Equivalent to `Mat4.perspectiveZO(this, fovy, aspect, near, far);`
   * @category Methods
   *
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `this`
   */
  perspectiveZO(fovy, aspect, near, far) {
    return _Mat4.perspectiveZO(this, fovy, aspect, near, far);
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Equivalent to `Mat4.orthoNO(this, left, right, bottom, top, near, far);`
   * @category Methods
   *
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `this`
   */
  orthoNO(left, right, bottom, top, near, far) {
    return _Mat4.orthoNO(this, left, right, bottom, top, near, far);
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Equivalent to `Mat4.orthoZO(this, left, right, bottom, top, near, far);`
   * @category Methods
   *
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `this`
   */
  orthoZO(left, right, bottom, top, near, far) {
    return _Mat4.orthoZO(this, left, right, bottom, top, near, far);
  }
  // ===================
  // Static accessors
  // ===================
  /**
   * @category Static
   *
   * @returns The number of bytes in a {@link Mat4}.
   */
  static get BYTE_LENGTH() {
    return 16 * Float32Array.BYTES_PER_ELEMENT;
  }
  // ===================
  // Static methods
  // ===================
  /**
   * Creates a new, identity {@link Mat4}
   * @category Static
   *
   * @returns A new {@link Mat4}
   */
  static create() {
    return new _Mat4();
  }
  /**
   * Creates a new {@link Mat4} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat4}
   */
  static clone(a) {
    return new _Mat4(a);
  }
  /**
   * Copy the values from one {@link Mat4} to another
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - Matrix to copy
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Create a new mat4 with the given values
   * @category Static
   *
   * @param values - Matrix components
   * @returns A new {@link Mat4}
   */
  static fromValues(...values) {
    return new _Mat4(...values);
  }
  /**
   * Set the components of a mat4 to the given values
   * @category Static
   *
   * @param out - The receiving matrix
   * @param values - Matrix components
   * @returns `out`
   */
  static set(out, ...values) {
    out[0] = values[0];
    out[1] = values[1];
    out[2] = values[2];
    out[3] = values[3];
    out[4] = values[4];
    out[5] = values[5];
    out[6] = values[6];
    out[7] = values[7];
    out[8] = values[8];
    out[9] = values[9];
    out[10] = values[10];
    out[11] = values[11];
    out[12] = values[12];
    out[13] = values[13];
    out[14] = values[14];
    out[15] = values[15];
    return out;
  }
  /**
   * Set a {@link Mat4} to the identity matrix
   * @category Static
   *
   * @param out - The receiving Matrix
   * @returns `out`
   */
  static identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Transpose the values of a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static transpose(out, a) {
    if (out === a) {
      const a01 = a[1], a02 = a[2], a03 = a[3];
      const a12 = a[6], a13 = a[7];
      const a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  /**
   * Inverts a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out` or `null` if the matrix is not invertible
   */
  static invert(out, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  /**
   * Calculates the adjugate of a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static adjoint(out, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    out[0] = a11 * b11 - a12 * b10 + a13 * b09;
    out[1] = a02 * b10 - a01 * b11 - a03 * b09;
    out[2] = a31 * b05 - a32 * b04 + a33 * b03;
    out[3] = a22 * b04 - a21 * b05 - a23 * b03;
    out[4] = a12 * b08 - a10 * b11 - a13 * b07;
    out[5] = a00 * b11 - a02 * b08 + a03 * b07;
    out[6] = a32 * b02 - a30 * b05 - a33 * b01;
    out[7] = a20 * b05 - a22 * b02 + a23 * b01;
    out[8] = a10 * b10 - a11 * b08 + a13 * b06;
    out[9] = a01 * b08 - a00 * b10 - a03 * b06;
    out[10] = a30 * b04 - a31 * b02 + a33 * b00;
    out[11] = a21 * b02 - a20 * b04 - a23 * b00;
    out[12] = a11 * b07 - a10 * b09 - a12 * b06;
    out[13] = a00 * b09 - a01 * b07 + a02 * b06;
    out[14] = a31 * b01 - a30 * b03 - a32 * b00;
    out[15] = a20 * b03 - a21 * b01 + a22 * b00;
    return out;
  }
  /**
   * Calculates the determinant of a {@link Mat4}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b0 = a00 * a11 - a01 * a10;
    const b1 = a00 * a12 - a02 * a10;
    const b2 = a01 * a12 - a02 * a11;
    const b3 = a20 * a31 - a21 * a30;
    const b4 = a20 * a32 - a22 * a30;
    const b5 = a21 * a32 - a22 * a31;
    const b6 = a00 * b5 - a01 * b4 + a02 * b3;
    const b7 = a10 * b5 - a11 * b4 + a12 * b3;
    const b8 = a20 * b2 - a21 * b1 + a22 * b0;
    const b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  /**
   * Multiplies two {@link Mat4}s
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  /**
   * Alias for {@link Mat4.multiply}
   * @category Static
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static mul(out, a, b) {
    return out;
  }
  /**
   * Translate a {@link Mat4} by the given vector
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to translate
   * @param v - vector to translate by
   * @returns `out`
   */
  static translate(out, a, v) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      const a00 = a[0];
      const a01 = a[1];
      const a02 = a[2];
      const a03 = a[3];
      const a10 = a[4];
      const a11 = a[5];
      const a12 = a[6];
      const a13 = a[7];
      const a20 = a[8];
      const a21 = a[9];
      const a22 = a[10];
      const a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  /**
   * Scales the {@link Mat4} by the dimensions in the given {@link Vec3} not using vectorization
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param v - the {@link Vec3} to scale the matrix by
   * @returns `out`
   **/
  static scale(out, a, v) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Rotates a {@link Mat4} by the given angle around the given axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out` or `null` if axis has a length of 0
   */
  static rotate(out, a, rad, axis) {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    if (len < GLM_EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the X axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateX(out, a, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Y axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateY(out, a, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Z axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateZ(out, a, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a vector translation
   * This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.translate(dest, dest, vec);
   * ```
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param v - Translation vector
   * @returns `out`
   */
  static fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a vector scaling
   * This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.scale(dest, dest, vec);
   * ```
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param v - Scaling vector
   * @returns `out`
   */
  static fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a given angle around a given axis
   * This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.rotate(dest, dest, rad, axis);
   * ```
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out` or `null` if `axis` has a length of 0
   */
  static fromRotation(out, rad, axis) {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    if (len < GLM_EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the X axis
   * This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.rotateX(dest, dest, rad);
   * ```
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromXRotation(out, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Y axis
   * This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.rotateY(dest, dest, rad);
   * ```
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromYRotation(out, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Z axis
   * This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.rotateZ(dest, dest, rad);
   * ```
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromZRotation(out, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.translate(dest, vec);
   *   let quatMat = mat4.create();
   *   quat4.toMat4(quat, quatMat);
   *   mat4.multiply(dest, quatMat);
   * ```
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @returns `out`
   */
  static fromRotationTranslation(out, q, v) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Sets a {@link Mat4} from a {@link Quat2}.
   * @category Static
   *
   * @param out - Matrix
   * @param a - Dual Quaternion
   * @returns `out`
   */
  static fromQuat2(out, a) {
    const bx = -a[0];
    const by = -a[1];
    const bz = -a[2];
    const bw = a[3];
    const ax = a[4];
    const ay = a[5];
    const az = a[6];
    const aw = a[7];
    const magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      _Mat4.#TMP_VEC3[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      _Mat4.#TMP_VEC3[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      _Mat4.#TMP_VEC3[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      _Mat4.#TMP_VEC3[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      _Mat4.#TMP_VEC3[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      _Mat4.#TMP_VEC3[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    _Mat4.fromRotationTranslation(out, a, _Mat4.#TMP_VEC3);
    return out;
  }
  /**
   * Calculates a {@link Mat4} normal matrix (transpose inverse) from a {@link Mat4}
   * @category Static
   *
   * @param out - Matrix receiving operation result
   * @param a - Mat4 to derive the normal matrix from
   * @returns `out` or `null` if the matrix is not invertible
   */
  static normalFromMat4(out, a) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = 0;
    out[4] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[7] = 0;
    out[8] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[9] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Calculates a {@link Mat4} normal matrix (transpose inverse) from a {@link Mat4}
   * This version omits the calculation of the constant factor (1/determinant), so
   * any normals transformed with it will need to be renormalized.
   * From https://stackoverflow.com/a/27616419/25968
   * @category Static
   *
   * @param out - Matrix receiving operation result
   * @param a - Mat4 to derive the normal matrix from
   * @returns `out`
   */
  static normalFromMat4Fast(out, a) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = a[4];
    const by = a[5];
    const bz = a[6];
    const cx = a[8];
    const cy = a[9];
    const cz = a[10];
    out[0] = by * cz - cz * cy;
    out[1] = bz * cx - cx * cz;
    out[2] = bx * cy - cy * cx;
    out[3] = 0;
    out[4] = cy * az - cz * ay;
    out[5] = cz * ax - cx * az;
    out[6] = cx * ay - cy * ax;
    out[7] = 0;
    out[8] = ay * bz - az * by;
    out[9] = az * bx - ax * bz;
    out[10] = ax * by - ay * bx;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Returns the translation vector component of a transformation
   * matrix. If a matrix is built with fromRotationTranslation,
   * the returned vector will be the same as the translation vector
   * originally supplied.
   * @category Static
   *
   * @param  {vec3} out Vector to receive translation component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  static getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  /**
   * Returns the scaling factor component of a transformation
   * matrix. If a matrix is built with fromRotationTranslationScale
   * with a normalized Quaternion parameter, the returned vector will be
   * the same as the scaling vector
   * originally supplied.
   * @category Static
   *
   * @param  {vec3} out Vector to receive scaling factor component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  static getScaling(out, mat) {
    const m11 = mat[0];
    const m12 = mat[1];
    const m13 = mat[2];
    const m21 = mat[4];
    const m22 = mat[5];
    const m23 = mat[6];
    const m31 = mat[8];
    const m32 = mat[9];
    const m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  /**
   * Returns a quaternion representing the rotational component
   * of a transformation matrix. If a matrix is built with
   * fromRotationTranslation, the returned quaternion will be the
   * same as the quaternion originally supplied.
   * @category Static
   *
   * @param out - Quaternion to receive the rotation component
   * @param mat - Matrix to be decomposed (input)
   * @return `out`
   */
  static getRotation(out, mat) {
    _Mat4.getScaling(_Mat4.#TMP_VEC3, mat);
    const is1 = 1 / _Mat4.#TMP_VEC3[0];
    const is2 = 1 / _Mat4.#TMP_VEC3[1];
    const is3 = 1 / _Mat4.#TMP_VEC3[2];
    const sm11 = mat[0] * is1;
    const sm12 = mat[1] * is2;
    const sm13 = mat[2] * is3;
    const sm21 = mat[4] * is1;
    const sm22 = mat[5] * is2;
    const sm23 = mat[6] * is3;
    const sm31 = mat[8] * is1;
    const sm32 = mat[9] * is2;
    const sm33 = mat[10] * is3;
    const trace = sm11 + sm22 + sm33;
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  /**
   * Decomposes a transformation matrix into its rotation, translation
   * and scale components. Returns only the rotation component
   * @category Static
   *
   * @param out_r - Quaternion to receive the rotation component
   * @param out_t - Vector to receive the translation vector
   * @param out_s - Vector to receive the scaling factor
   * @param mat - Matrix to be decomposed (input)
   * @returns `out_r`
   */
  static decompose(out_r, out_t, out_s, mat) {
    out_t[0] = mat[12];
    out_t[1] = mat[13];
    out_t[2] = mat[14];
    const m11 = mat[0];
    const m12 = mat[1];
    const m13 = mat[2];
    const m21 = mat[4];
    const m22 = mat[5];
    const m23 = mat[6];
    const m31 = mat[8];
    const m32 = mat[9];
    const m33 = mat[10];
    out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    const is1 = 1 / out_s[0];
    const is2 = 1 / out_s[1];
    const is3 = 1 / out_s[2];
    const sm11 = m11 * is1;
    const sm12 = m12 * is2;
    const sm13 = m13 * is3;
    const sm21 = m21 * is1;
    const sm22 = m22 * is2;
    const sm23 = m23 * is3;
    const sm31 = m31 * is1;
    const sm32 = m32 * is2;
    const sm33 = m33 * is3;
    const trace = sm11 + sm22 + sm33;
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out_r[3] = 0.25 * S;
      out_r[0] = (sm23 - sm32) / S;
      out_r[1] = (sm31 - sm13) / S;
      out_r[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out_r[3] = (sm23 - sm32) / S;
      out_r[0] = 0.25 * S;
      out_r[1] = (sm12 + sm21) / S;
      out_r[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out_r[3] = (sm31 - sm13) / S;
      out_r[0] = (sm12 + sm21) / S;
      out_r[1] = 0.25 * S;
      out_r[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out_r[3] = (sm12 - sm21) / S;
      out_r[0] = (sm31 + sm13) / S;
      out_r[1] = (sm23 + sm32) / S;
      out_r[2] = 0.25 * S;
    }
    return out_r;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale
   * This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.translate(dest, vec);
   *   let quatMat = mat4.create();
   *   quat4.toMat4(quat, quatMat);
   *   mat4.multiply(dest, quatMat);
   *   mat4.scale(dest, scale);
   * ```
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @param s - Scaling vector
   * @returns `out`
   */
  static fromRotationTranslationScale(out, q, v, s) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = s[0];
    const sy = s[1];
    const sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the
   * given origin. This is equivalent to (but much faster than):
   * ```js
   *   mat4.identity(dest);
   *   mat4.translate(dest, vec);
   *   mat4.translate(dest, origin);
   *   let quatMat = mat4.create();
   *   quat4.toMat4(quat, quatMat);
   *   mat4.multiply(dest, quatMat);
   *   mat4.scale(dest, scale)
   *   mat4.translate(dest, negativeOrigin);
   * ```
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @param s - Scaling vector
   * @param o - The origin vector around which to scale and rotate
   * @returns `out`
   */
  static fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = s[0];
    const sy = s[1];
    const sz = s[2];
    const ox = o[0];
    const oy = o[1];
    const oz = o[2];
    const out0 = (1 - (yy + zz)) * sx;
    const out1 = (xy + wz) * sx;
    const out2 = (xz - wy) * sx;
    const out4 = (xy - wz) * sy;
    const out5 = (1 - (xx + zz)) * sy;
    const out6 = (yz + wx) * sy;
    const out8 = (xz + wy) * sz;
    const out9 = (yz - wx) * sz;
    const out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  /**
   * Calculates a 4x4 matrix from the given quaternion
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Quaternion to create matrix from
   * @returns `out`
   */
  static fromQuat(out, q) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a frustum matrix with the given bounds
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far -  Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static frustumNO(out, left, right, bottom, top, near, far = Infinity) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  /**
   * Alias for {@link Mat4.frustumNO}
   * @category Static
   * @deprecated Use {@link Mat4.frustumNO} or {@link Mat4.frustumZO} explicitly
   */
  static frustum(out, left, right, bottom, top, near, far = Infinity) {
    return out;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Generates a frustum matrix with the given bounds
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static frustumZO(out, left, right, bottom, top, near, far = Infinity) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static perspectiveNO(out, fovy, aspect, near, far = Infinity) {
    const f = 1 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  /**
   * Alias for {@link Mat4.perspectiveNO}
   * @category Static
   * @deprecated Use {@link Mat4.perspectiveNO} or {@link Mat4.perspectiveZO} explicitly
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static perspective(out, fovy, aspect, near, far = Infinity) {
    return out;
  }
  /**
   * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static perspectiveZO(out, fovy, aspect, near, far = Infinity) {
    const f = 1 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given field of view. This is primarily useful for generating
   * projection matrices to be used with the still experimental WebVR API.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fov - Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   * @deprecated
   */
  static perspectiveFromFieldOfView(out, fov, near, far) {
    const upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    const downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    const leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    const rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    const xScale = 2 / (leftTan + rightTan);
    const yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  /**
   * Generates an orthogonal projection matrix with the given bounds. The near / far clip planes correspond to a
   * normalized device coordinate Z range of [-1, 1], which matches WebGL / OpenGLs clip volume.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static orthoNO(out, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Alias for {@link Mat4.orthoNO}
   * @category Static
   * @deprecated Use {@link Mat4.orthoNO} or {@link Mat4.orthoZO} explicitly
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static ortho(out, left, right, bottom, top, near, far) {
    return out;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds. The near / far clip planes correspond to a
   * normalized device coordinate Z range of [0, 1], which matches WebGPU / Vulkan / DirectX / Metal's clip volume.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static orthoZO(out, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis. If you want a matrix that
   * actually makes an object look at another object, you should use targetTo instead.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param eye - Position of the viewer
   * @param center - Point the viewer is looking at
   * @param up - vec3 pointing up
   * @returns `out`
   */
  static lookAt(out, eye, center, up) {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];
    if (Math.abs(eyex - centerx) < GLM_EPSILON && Math.abs(eyey - centery) < GLM_EPSILON && Math.abs(eyez - centerz) < GLM_EPSILON) {
      return _Mat4.identity(out);
    }
    let z0 = eyex - centerx;
    let z1 = eyey - centery;
    let z2 = eyez - centerz;
    let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    let x0 = upy * z2 - upz * z1;
    let x1 = upz * z0 - upx * z2;
    let x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    let y0 = z1 * x2 - z2 * x1;
    let y1 = z2 * x0 - z0 * x2;
    let y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  /**
   * Generates a matrix that makes something look at something else.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param eye - Position of the viewer
   * @param target - Point the viewer is looking at
   * @param up - vec3 pointing up
   * @returns `out`
   */
  static targetTo(out, eye, target, up) {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    let z0 = eyex - target[0];
    let z1 = eyey - target[1];
    let z2 = eyez - target[2];
    let len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }
    let x0 = upy * z2 - upz * z1;
    let x1 = upz * z0 - upx * z2;
    let x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  /**
   * Returns Frobenius norm of a {@link Mat4}
   * @category Static
   *
   * @param a - the matrix to calculate Frobenius norm of
   * @returns Frobenius norm
   */
  static frob(a) {
    return Math.sqrt(
      a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7] + a[8] * a[8] + a[9] * a[9] + a[10] * a[10] + a[11] * a[11] + a[12] * a[12] + a[13] * a[13] + a[14] * a[14] + a[15] * a[15]
    );
  }
  /**
   * Adds two {@link Mat4}'s
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  /**
   * Alias for {@link Mat4.subtract}
   * @category Static
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static sub(out, a, b) {
    return out;
  }
  /**
   * Multiply each element of the matrix by a scalar.
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param b - amount to scale the matrix's elements by
   * @returns `out`
   */
  static multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }
  /**
   * Adds two mat4's after multiplying each element of the second operand by a scalar value.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b's elements by before adding
   * @returns `out`
   */
  static multiplyScalarAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    out[6] = a[6] + b[6] * scale;
    out[7] = a[7] + b[7] * scale;
    out[8] = a[8] + b[8] * scale;
    out[9] = a[9] + b[9] * scale;
    out[10] = a[10] + b[10] * scale;
    out[11] = a[11] + b[11] * scale;
    out[12] = a[12] + b[12] * scale;
    out[13] = a[13] + b[13] * scale;
    out[14] = a[14] + b[14] * scale;
    out[15] = a[15] + b[15] * scale;
    return out;
  }
  /**
   * Returns whether two {@link Mat4}s have exactly the same elements in the same position (when compared with ===).
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  /**
   * Returns whether two {@link Mat4}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    const a3 = a[3];
    const a4 = a[4];
    const a5 = a[5];
    const a6 = a[6];
    const a7 = a[7];
    const a8 = a[8];
    const a9 = a[9];
    const a10 = a[10];
    const a11 = a[11];
    const a12 = a[12];
    const a13 = a[13];
    const a14 = a[14];
    const a15 = a[15];
    const b0 = b[0];
    const b1 = b[1];
    const b2 = b[2];
    const b3 = b[3];
    const b4 = b[4];
    const b5 = b[5];
    const b6 = b[6];
    const b7 = b[7];
    const b8 = b[8];
    const b9 = b[9];
    const b10 = b[10];
    const b11 = b[11];
    const b12 = b[12];
    const b13 = b[13];
    const b14 = b[14];
    const b15 = b[15];
    return Math.abs(a0 - b0) <= GLM_EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= GLM_EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= GLM_EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= GLM_EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= GLM_EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= GLM_EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= GLM_EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= GLM_EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= GLM_EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= GLM_EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= GLM_EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= GLM_EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= GLM_EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= GLM_EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= GLM_EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= GLM_EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  /**
   * Returns a string representation of a {@link Mat4}
   * @category Static
   *
   * @param a - matrix to represent as a string
   * @returns string representation of the matrix
   */
  static str(a) {
    return `Mat4(${a.join(", ")})`;
  }
};
Mat4.prototype.mul = Mat4.prototype.multiply;
Mat4.sub = Mat4.subtract;
Mat4.mul = Mat4.multiply;
Mat4.frustum = Mat4.frustumNO;
Mat4.perspective = Mat4.perspectiveNO;
Mat4.ortho = Mat4.orthoNO;
var Vec3 = class _Vec3 extends Float32Array {
  /**
   * Create a {@link Vec3}.
   *
   * @category Constructor
   */
  constructor(...values) {
    switch (values.length) {
      case 3:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 3);
        break;
      case 1: {
        const v = values[0];
        if (typeof v === "number") {
          super([v, v, v]);
        } else {
          super(v, 0, 3);
        }
        break;
      }
      default:
        super(3);
        break;
    }
  }
  // ============
  // Accessors
  // ============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector Components
   */
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector Components
   */
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  /**
   * The z component of the vector. Equivalent to `this[2];`
   * @category Vector Components
   */
  get z() {
    return this[2];
  }
  set z(value) {
    this[2] = value;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color Components
   */
  get r() {
    return this[0];
  }
  set r(value) {
    this[0] = value;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color Components
   */
  get g() {
    return this[1];
  }
  set g(value) {
    this[1] = value;
  }
  /**
   * The b component of the vector. Equivalent to `this[2];`
   * @category Color Components
   */
  get b() {
    return this[2];
  }
  set b(value) {
    this[2] = value;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec3.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   *
   * @category Accessors
   */
  get magnitude() {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Alias for {@link Vec3.magnitude}
   *
   * @category Accessors
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * The squared magnitude (length) of `this`.
   * Equivalent to `Vec3.squaredMagnitude(this);`
   *
   * @category Accessors
   */
  get squaredMagnitude() {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    return x * x + y * y + z * z;
  }
  /**
   * Alias for {@link Vec3.squaredMagnitude}
   *
   * @category Accessors
   */
  get sqrMag() {
    return this.squaredMagnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec3.str(this);`
   *
   * @category Accessors
   */
  get str() {
    return _Vec3.str(this);
  }
  // ===================
  // Instances methods
  // ===================
  /**
   * Copy the values from another {@link Vec3} into `this`.
   * @category Methods
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a) {
    this.set(a);
    return this;
  }
  /**
   * Adds a {@link Vec3} to `this`.
   * Equivalent to `Vec3.add(this, this, b);`
   * @category Methods
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(b) {
    this[0] += b[0];
    this[1] += b[1];
    this[2] += b[2];
    return this;
  }
  /**
   * Subtracts a {@link Vec3} from `this`.
   * Equivalent to `Vec3.subtract(this, this, b);`
   * @category Methods
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(b) {
    this[0] -= b[0];
    this[1] -= b[1];
    this[2] -= b[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.subtract}
   * @category Methods
   */
  sub(b) {
    return this;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Multiplies `this` by a {@link Vec3}.
   * Equivalent to `Vec3.multiply(this, this, b);`
   * @category Methods
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(b) {
    this[0] *= b[0];
    this[1] *= b[1];
    this[2] *= b[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.multiply}
   * @category Methods
   */
  mul(b) {
    return this;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Divides `this` by a {@link Vec3}.
   * Equivalent to `Vec3.divide(this, this, b);`
   * @category Methods
   *
   * @param b - The vector to divide `this` by
   * @returns `this`
   */
  divide(b) {
    this[0] /= b[0];
    this[1] /= b[1];
    this[2] /= b[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.divide}
   * @category Methods
   */
  div(b) {
    return this;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec3.scale(this, this, b);`
   * @category Methods
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(b) {
    this[0] *= b;
    this[1] *= b;
    this[2] *= b;
    return this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec3.scaleAndAdd(this, this, b, scale);`
   * @category Methods
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(b, scale) {
    this[0] += b[0] * scale;
    this[1] += b[1] * scale;
    this[2] += b[2] * scale;
    return this;
  }
  /**
   * Calculates the Euclidean distance between another {@link Vec3} and `this`.
   * Equivalent to `Vec3.distance(this, b);`
   * @category Methods
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(b) {
    return _Vec3.distance(this, b);
  }
  /**
   * Alias for {@link Vec3.distance}
   * @category Methods
   */
  dist(b) {
    return 0;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Calculates the squared Euclidean distance between another {@link Vec3} and `this`.
   * Equivalent to `Vec3.squaredDistance(this, b);`
   * @category Methods
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(b) {
    return _Vec3.squaredDistance(this, b);
  }
  /**
   * Alias for {@link Vec3.squaredDistance}
   * @category Methods
   */
  sqrDist(b) {
    return 0;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec3.negate(this, this);`
   * @category Methods
   *
   * @returns `this`
   */
  negate() {
    this[0] *= -1;
    this[1] *= -1;
    this[2] *= -1;
    return this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec3.inverse(this, this);`
   * @category Methods
   *
   * @returns `this`
   */
  invert() {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    this[2] = 1 / this[2];
    return this;
  }
  /**
   * Sets each component of `this` to its absolute value.
   * Equivalent to `Vec3.abs(this, this);`
   * @category Methods
   *
   * @returns `this`
   */
  abs() {
    this[0] = Math.abs(this[0]);
    this[1] = Math.abs(this[1]);
    this[2] = Math.abs(this[2]);
    return this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec3}.
   * Equivalent to `Vec3.dot(this, b);`
   * @category Methods
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(b) {
    return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec3.normalize(this, this);`
   * @category Methods
   *
   * @returns `this`
   */
  normalize() {
    return _Vec3.normalize(this, this);
  }
  // ===================
  // Static accessors
  // ===================
  /**
   * @category Static
   *
   * @returns The number of bytes in a {@link Vec3}.
   */
  static get BYTE_LENGTH() {
    return 3 * Float32Array.BYTES_PER_ELEMENT;
  }
  // ===================
  // Static methods
  // ===================
  /**
   * Creates a new, empty vec3
   * @category Static
   *
   * @returns a new 3D vector
   */
  static create() {
    return new _Vec3();
  }
  /**
   * Creates a new vec3 initialized with values from an existing vector
   * @category Static
   *
   * @param a - vector to clone
   * @returns a new 3D vector
   */
  static clone(a) {
    return new _Vec3(a);
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec3}
   * @category Static
   *
   * @param a - Vector to calculate magnitude of
   * @returns Magnitude of a
   */
  static magnitude(a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   */
  static mag(a) {
    return 0;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   * @deprecated Use {@link Vec3.magnitude} to avoid conflicts with builtin `length` methods/attribs
   *
   * @param a - vector to calculate length of
   * @returns length of a
   */
  // Length conflicts with Function.length
  static length(a) {
    return 0;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   * @deprecated Use {@link Vec3.mag}
   */
  static len(a) {
    return 0;
  }
  // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
   * Creates a new vec3 initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @returns a new 3D vector
   */
  static fromValues(x, y, z) {
    return new _Vec3(x, y, z);
  }
  /**
   * Copy the values from one vec3 to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the source vector
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  /**
   * Set the components of a vec3 to the given values
   * @category Static
   *
   * @param out - the receiving vector
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @returns `out`
   */
  static set(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Adds two {@link Vec3}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.subtract}
   * @category Static
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static sub(out, a, b) {
    return [0, 0, 0];
  }
  /**
   * Multiplies two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.multiply}
   * @category Static
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static mul(out, a, b) {
    return [0, 0, 0];
  }
  /**
   * Divides two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.divide}
   * @category Static
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static div(out, a, b) {
    return [0, 0, 0];
  }
  /**
   * Math.ceil the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to ceil
   * @returns `out`
   */
  static ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  /**
   * Math.floor the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to floor
   * @returns `out`
   */
  static floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  /**
   * Returns the minimum of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }
  /**
   * Returns the maximum of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }
  /**
   * symmetric round the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to round
   * @returns `out`
   */
  /*
    static round(out: Vec3Like, a: Readonly<Vec3Like>): Vec3Like {
    out[0] = glMatrix.round(a[0]);
    out[1] = glMatrix.round(a[1]);
    out[2] = glMatrix.round(a[2]);
    return out;
  }*/
  /**
   * Scales a vec3 by a scalar number
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param scale - amount to scale the vector by
   * @returns `out`
   */
  static scale(out, a, scale) {
    out[0] = a[0] * scale;
    out[1] = a[1] * scale;
    out[2] = a[2] * scale;
    return out;
  }
  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    return out;
  }
  /**
   * Calculates the Euclidean distance between two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns distance between a and b
   */
  static distance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Alias for {@link Vec3.distance}
   * @category Static
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static dist(a, b) {
    return 0;
  }
  /**
   * Calculates the squared Euclidean distance between two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns squared distance between a and b
   */
  static squaredDistance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  /**
   * Alias for {@link Vec3.squaredDistance}
   * @category Static
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static sqrDist(a, b) {
    return 0;
  }
  /**
   * Calculates the squared length of a vec3
   * @category Static
   *
   * @param a - vector to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    return x * x + y * y + z * z;
  }
  /**
   * Alias for {@link Vec3.squaredLength}
   * @category Static
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static sqrLen(a, b) {
    return 0;
  }
  /**
   * Negates the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to negate
   * @returns `out`
   */
  static negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  /**
   * Returns the inverse of the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to invert
   * @returns `out`
   */
  static inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  /**
   * Returns the absolute value of the components of a {@link Vec3}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to compute the absolute values of
   * @returns `out`
   */
  static abs(out, a) {
    out[0] = Math.abs(a[0]);
    out[1] = Math.abs(a[1]);
    out[2] = Math.abs(a[2]);
    return out;
  }
  /**
   * Normalize a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to normalize
   * @returns `out`
   */
  static normalize(out, a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    let len = x * x + y * y + z * z;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static cross(out, a, b) {
    const ax = a[0], ay = a[1], az = a[2];
    const bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Performs a linear interpolation between two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(out, a, b, t) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static slerp(out, a, b, t) {
    const angle = Math.acos(Math.min(Math.max(_Vec3.dot(a, b), -1), 1));
    const sinTotal = Math.sin(angle);
    const ratioA = Math.sin((1 - t) * angle) / sinTotal;
    const ratioB = Math.sin(t * angle) / sinTotal;
    out[0] = ratioA * a[0] + ratioB * b[0];
    out[1] = ratioA * a[1] + ratioB * b[1];
    out[2] = ratioA * a[2] + ratioB * b[2];
    return out;
  }
  /**
   * Performs a hermite interpolation with two control points
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static hermite(out, a, b, c, d, t) {
    const factorTimes2 = t * t;
    const factor1 = factorTimes2 * (2 * t - 3) + 1;
    const factor2 = factorTimes2 * (t - 2) + t;
    const factor3 = factorTimes2 * (t - 1);
    const factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  /**
   * Performs a bezier interpolation with two control points
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static bezier(out, a, b, c, d, t) {
    const inverseFactor = 1 - t;
    const inverseFactorTimesTwo = inverseFactor * inverseFactor;
    const factorTimes2 = t * t;
    const factor1 = inverseFactorTimesTwo * inverseFactor;
    const factor2 = 3 * t * inverseFactorTimesTwo;
    const factor3 = 3 * factorTimes2 * inverseFactor;
    const factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  /**
   * Generates a random vector with the given scale
   * @category Static
   *
   * @param out - the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
   * @returns `out`
   */
  /*
      static random(out: Vec3Like, scale) {
      scale = scale === undefined ? 1.0 : scale;
  
      let r = glMatrix.RANDOM() * 2.0 * Math.PI;
      let z = glMatrix.RANDOM() * 2.0 - 1.0;
      let zScale = Math.sqrt(1.0 - z * z) * scale;
  
      out[0] = Math.cos(r) * zScale;
      out[1] = Math.sin(r) * zScale;
      out[2] = z * scale;
      return out;
    }*/
  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - matrix to transform with
   * @returns `out`
   */
  static transformMat4(out, a, m) {
    const x = a[0], y = a[1], z = a[2];
    const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  /**
   * Transforms the vec3 with a mat3.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - the 3x3 matrix to transform with
   * @returns `out`
   */
  static transformMat3(out, a, m) {
    const x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  /**
   * Transforms the vec3 with a quat
   * Can also be used for dual quaternions. (Multiply it with the real part)
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param q - quaternion to transform with
   * @returns `out`
   */
  static transformQuat(out, a, q) {
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const w2 = q[3] * 2;
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const uvx = qy * z - qz * y;
    const uvy = qz * x - qx * z;
    const uvz = qx * y - qy * x;
    const uuvx = (qy * uvz - qz * uvy) * 2;
    const uuvy = (qz * uvx - qx * uvz) * 2;
    const uuvz = (qx * uvy - qy * uvx) * 2;
    out[0] = x + uvx * w2 + uuvx;
    out[1] = y + uvy * w2 + uuvy;
    out[2] = z + uvz * w2 + uuvz;
    return out;
  }
  /**
   * Rotate a 3D vector around the x-axis
   * @category Static
   *
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateX(out, a, b, rad) {
    const by = b[1];
    const bz = b[2];
    const py = a[1] - by;
    const pz = a[2] - bz;
    out[0] = a[0];
    out[1] = py * Math.cos(rad) - pz * Math.sin(rad) + by;
    out[2] = py * Math.sin(rad) + pz * Math.cos(rad) + bz;
    return out;
  }
  /**
   * Rotate a 3D vector around the y-axis
   * @category Static
   *
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateY(out, a, b, rad) {
    const bx = b[0];
    const bz = b[2];
    const px = a[0] - bx;
    const pz = a[2] - bz;
    out[0] = pz * Math.sin(rad) + px * Math.cos(rad) + bx;
    out[1] = a[1];
    out[2] = pz * Math.cos(rad) - px * Math.sin(rad) + bz;
    return out;
  }
  /**
   * Rotate a 3D vector around the z-axis
   * @category Static
   *
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateZ(out, a, b, rad) {
    const bx = b[0];
    const by = b[1];
    const px = a[0] - bx;
    const py = a[1] - by;
    out[0] = px * Math.cos(rad) - py * Math.sin(rad) + bx;
    out[1] = px * Math.sin(rad) + py * Math.cos(rad) + by;
    out[2] = b[2];
    return out;
  }
  /**
   * Get the angle between two 3D vectors
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns The angle in radians
   */
  static angle(a, b) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
    const cosine = mag && _Vec3.dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  /**
   * Set the components of a vec3 to zero
   * @category Static
   *
   * @param out - the receiving vector
   * @returns `out`
   */
  static zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  /**
   * Returns a string representation of a vector
   * @category Static
   *
   * @param a - vector to represent as a string
   * @returns string representation of the vector
   */
  static str(a) {
    return `Vec3(${a.join(", ")})`;
  }
  /**
   * Returns whether the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  /**
   * Returns whether the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static equals(a, b) {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    const b0 = b[0];
    const b1 = b[1];
    const b2 = b[2];
    return Math.abs(a0 - b0) <= GLM_EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= GLM_EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= GLM_EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
  }
};
Vec3.prototype.sub = Vec3.prototype.subtract;
Vec3.prototype.mul = Vec3.prototype.multiply;
Vec3.prototype.div = Vec3.prototype.divide;
Vec3.prototype.dist = Vec3.prototype.distance;
Vec3.prototype.sqrDist = Vec3.prototype.squaredDistance;
Vec3.sub = Vec3.subtract;
Vec3.mul = Vec3.multiply;
Vec3.div = Vec3.divide;
Vec3.dist = Vec3.distance;
Vec3.sqrDist = Vec3.squaredDistance;
Vec3.sqrLen = Vec3.squaredLength;
Vec3.mag = Vec3.magnitude;
Vec3.length = Vec3.magnitude;
Vec3.len = Vec3.magnitude;
async function nextAnimationFrame(cntr = 1) {
  if (!Number.isInteger(cntr) || cntr < 1) {
    throw new TypeError(`nextAnimationFrame error: 'cntr' must be a positive integer greater than 0.`);
  }
  let currentTime;
  for (; --cntr >= 0; ) {
    currentTime = await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return currentTime;
}
function draggable(node, { position, enabled = true, button = 0, storeDragging = void 0, tween = false, tweenOptions = { duration: 1, ease: "cubicOut" }, hasTargetClassList, ignoreTargetClassList }) {
  if (hasTargetClassList !== void 0 && !isIterable(hasTargetClassList)) {
    throw new TypeError(`'hasTargetClassList' is not iterable.`);
  }
  if (ignoreTargetClassList !== void 0 && !isIterable(ignoreTargetClassList)) {
    throw new TypeError(`'ignoreTargetClassList' is not iterable.`);
  }
  const positionData = { left: 0, top: 0 };
  let actualPosition = position?.position ?? position;
  let initialPosition = null;
  let initialDragPoint = { x: 0, y: 0 };
  let dragging = false;
  let quickTo = actualPosition.animate.quickTo(["top", "left"], tweenOptions);
  const handlers = {
    dragDown: ["pointerdown", onDragPointerDown, false],
    dragMove: ["pointermove", onDragPointerChange, false],
    dragUp: ["pointerup", onDragPointerUp, false]
  };
  function activateListeners() {
    node.addEventListener(...handlers.dragDown);
    node.classList.add("tjs-draggable");
  }
  function removeListeners() {
    if (typeof storeDragging?.set === "function") {
      storeDragging.set(false);
    }
    node.removeEventListener(...handlers.dragDown);
    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
    node.classList.remove("tjs-draggable");
  }
  if (enabled) {
    activateListeners();
  }
  function onDragPointerDown(event) {
    if (event.button !== button || !event.isPrimary) {
      return;
    }
    if (!actualPosition.enabled) {
      return;
    }
    if (ignoreTargetClassList !== void 0 && A11yHelper.isFocusTarget(event.target)) {
      for (const targetClass of ignoreTargetClassList) {
        if (event.target.classList.contains(targetClass)) {
          return;
        }
      }
    }
    if (hasTargetClassList !== void 0 && A11yHelper.isFocusTarget(event.target)) {
      let foundTarget = false;
      for (const targetClass of hasTargetClassList) {
        if (event.target.classList.contains(targetClass)) {
          foundTarget = true;
          break;
        }
      }
      if (!foundTarget) {
        return;
      }
    }
    event.preventDefault();
    dragging = false;
    initialPosition = actualPosition.get();
    initialDragPoint = { x: event.clientX, y: event.clientY };
    node.addEventListener(...handlers.dragMove);
    node.addEventListener(...handlers.dragUp);
    node.setPointerCapture(event.pointerId);
  }
  function onDragPointerChange(event) {
    if ((event.buttons & 1) === 0) {
      onDragPointerUp(event);
      return;
    }
    if (event.button !== -1 || !event.isPrimary) {
      return;
    }
    event.preventDefault();
    if (!dragging && typeof storeDragging?.set === "function") {
      dragging = true;
      storeDragging.set(true);
    }
    const newLeft = initialPosition?.left + (event.clientX - initialDragPoint.x);
    const newTop = initialPosition?.top + (event.clientY - initialDragPoint.y);
    if (tween) {
      quickTo(newTop, newLeft);
    } else {
      positionData.left = newLeft;
      positionData.top = newTop;
      actualPosition.set(positionData);
    }
  }
  function onDragPointerUp(event) {
    event.preventDefault();
    dragging = false;
    if (typeof storeDragging?.set === "function") {
      storeDragging.set(false);
    }
    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
  }
  return {
    // The default of enabled being true won't automatically add listeners twice.
    update: (options) => {
      if (options.position !== void 0) {
        const newPosition = options.position?.position ?? options.position;
        if (newPosition !== actualPosition) {
          actualPosition = newPosition;
          quickTo = actualPosition.animate.quickTo(["top", "left"], tweenOptions);
        }
      }
      if (typeof options.enabled === "boolean") {
        enabled = options.enabled;
        if (enabled) {
          activateListeners();
        } else {
          removeListeners();
        }
      }
      if (typeof options.button === "number") {
        button = options.button;
      }
      if (typeof options.tween === "boolean") {
        tween = options.tween;
      }
      if (isObject(options.tweenOptions)) {
        tweenOptions = options.tweenOptions;
        quickTo.options(tweenOptions);
      }
      if (options.hasTargetClassList !== void 0) {
        if (!isIterable(options.hasTargetClassList)) {
          throw new TypeError(`'hasTargetClassList' is not iterable.`);
        } else {
          hasTargetClassList = options.hasTargetClassList;
        }
      }
      if (options.ignoreTargetClassList !== void 0) {
        if (!isIterable(options.ignoreTargetClassList)) {
          throw new TypeError(`'ignoreTargetClassList' is not iterable.`);
        } else {
          ignoreTargetClassList = options.ignoreTargetClassList;
        }
      }
    },
    destroy: () => removeListeners()
  };
}
class DraggableOptionsStore {
  tween;
  tweenOptions;
  #initialTween;
  /**
   */
  #initialTweenOptions;
  #tween = false;
  /**
   */
  #tweenOptions = { duration: 1, ease: "cubicOut" };
  /**
   * Stores the subscribers.
   */
  #subscribers = [];
  /**
   * @param [opts] - Optional parameters.
   *
   * @param [opts.tween = false] - Tween enabled.
   *
   * @param [opts.tweenOptions] - Quick tween options.
   */
  constructor({ tween = false, tweenOptions } = {}) {
    Object.defineProperty(this, "tween", {
      get: () => {
        return this.#tween;
      },
      set: (newTween) => {
        if (typeof newTween !== "boolean") {
          throw new TypeError(`'tween' is not a boolean.`);
        }
        this.#tween = newTween;
        this.#updateSubscribers();
      },
      enumerable: true
    });
    Object.defineProperty(this, "tweenOptions", {
      get: () => {
        return this.#tweenOptions;
      },
      set: (newTweenOptions) => {
        if (!isObject(newTweenOptions)) {
          throw new TypeError(`'tweenOptions' is not an object.`);
        }
        if (newTweenOptions.duration !== void 0) {
          if (!Number.isFinite(newTweenOptions.duration)) {
            throw new TypeError(`'tweenOptions.duration' is not a finite number.`);
          }
          if (newTweenOptions.duration < 0) {
            this.#tweenOptions.duration = 0;
          } else {
            this.#tweenOptions.duration = newTweenOptions.duration;
          }
        }
        if (newTweenOptions.ease !== void 0) {
          const easeFn = getEasingFunc(newTweenOptions.ease);
          if (typeof easeFn !== "function") {
            throw new TypeError(`'tweenOptions.ease' is not a function or Svelte easing function name.`);
          }
          this.#tweenOptions.ease = newTweenOptions.ease;
        }
        this.#updateSubscribers();
      },
      enumerable: true
    });
    if (tween !== void 0) {
      this.tween = tween;
    }
    if (tweenOptions !== void 0) {
      this.tweenOptions = tweenOptions;
    }
    this.#initialTween = this.#tween;
    this.#initialTweenOptions = Object.assign({}, this.#tweenOptions);
  }
  /**
   * @returns Get tween duration.
   */
  get tweenDuration() {
    return this.#tweenOptions.duration;
  }
  /**
   * @returns Get easing function or easing function name.
   */
  get tweenEase() {
    return this.#tweenOptions.ease;
  }
  /**
   * @param duration - Set tween duration.
   */
  set tweenDuration(duration) {
    if (!Number.isFinite(duration)) {
      throw new TypeError(`'duration' is not a finite number.`);
    }
    if (duration < 0) {
      duration = 0;
    }
    this.#tweenOptions.duration = duration;
    this.#updateSubscribers();
  }
  /**
   * @param ease - Set easing function by name or direct function.
   */
  set tweenEase(ease) {
    const easeFn = getEasingFunc(ease);
    if (typeof easeFn !== "function") {
      throw new TypeError(`'ease' is not a function or Svelte easing function name.`);
    }
    this.#tweenOptions.ease = ease;
    this.#updateSubscribers();
  }
  /**
   * Resets all options data to initial values.
   */
  reset() {
    this.#tween = this.#initialTween;
    this.#tweenOptions = Object.assign({}, this.#initialTweenOptions);
    this.#updateSubscribers();
  }
  /**
   * Resets tween enabled state to initial value.
   */
  resetTween() {
    this.#tween = this.#initialTween;
    this.#updateSubscribers();
  }
  /**
   * Resets tween options to initial values.
   */
  resetTweenOptions() {
    this.#tweenOptions = Object.assign({}, this.#initialTweenOptions);
    this.#updateSubscribers();
  }
  /**
   * Store subscribe method.
   *
   * @param handler - Callback function that is invoked on update / changes. Receives the DraggableOptionsStore
   *        instance.
   *
   * @returns Unsubscribe function.
   */
  subscribe(handler) {
    const currentIdx = this.#subscribers.findIndex((entry) => entry === handler);
    if (currentIdx === -1) {
      this.#subscribers.push(handler);
      handler(this);
    }
    return () => {
      const existingIdx = this.#subscribers.findIndex((entry) => entry === handler);
      if (existingIdx !== -1) {
        this.#subscribers.splice(existingIdx, 1);
      }
    };
  }
  #updateSubscribers() {
    const subscriptions = this.#subscribers;
    if (subscriptions.length > 0) {
      for (let cntr = 0; cntr < subscriptions.length; cntr++) {
        subscriptions[cntr](this);
      }
    }
  }
}
draggable.options = (options) => new DraggableOptionsStore(options);
class AnimationControl {
  /**
   */
  #animationData;
  /**
   */
  #finishedPromise;
  /**
   */
  #willFinish;
  /**
   * Defines a static empty / void animation control.
   */
  static #voidControl = new AnimationControl(null);
  /**
   * Provides a static void / undefined AnimationControl that is automatically resolved.
   */
  static get voidControl() {
    return this.#voidControl;
  }
  /**
   * @param [animationData] - Animation data.
   *
   * @param [willFinish] - Promise that tracks animation finished state.
   */
  constructor(animationData, willFinish = false) {
    this.#animationData = animationData;
    this.#willFinish = willFinish;
    if (isObject(animationData)) {
      animationData.control = this;
    }
  }
  /**
   * Get a promise that resolves when animation is finished.
   *
   * @returns Animation finished Promise.
   */
  get finished() {
    if (!CrossWindow.isPromise(this.#finishedPromise)) {
      this.#finishedPromise = this.#willFinish ? new Promise((resolve) => this.#animationData.resolve = resolve) : Promise.resolve({ cancelled: false });
    }
    return this.#finishedPromise;
  }
  /**
   * Returns whether this animation is currently active / animating.
   *
   * Note: a delayed animation may not be started / active yet. Use {@link AnimationControl.isFinished} to determine
   * if an animation is actually finished.
   *
   * @returns Animation active state.
   */
  get isActive() {
    return this.#animationData?.active ?? false;
  }
  /**
   * Returns whether this animation is completely finished.
   *
   * @returns Animation finished state.
   */
  get isFinished() {
    return this.#animationData?.finished ?? true;
  }
  /**
   * Cancels the animation.
   */
  cancel() {
    const animationData = this.#animationData;
    if (animationData === null || animationData === void 0) {
      return;
    }
    animationData.cancelled = true;
  }
}
class AnimationManager {
  /**
   * Cancels all animations except `quickTo` animations.
   */
  static cancelFn = (data) => data?.quickTo !== true;
  /**
   * Cancels all animations.
   */
  static cancelAllFn = () => true;
  /**
   * Defines the options used for {@link TJSPosition.set}.
   */
  static #tjsPositionSetOptions = Object.freeze({ immediateElementUpdate: true });
  /**
   */
  static #activeList = [];
  /**
   * Provides the `this` context for {@link AnimationManager.animate} to be scheduled on rAF.
   */
  static #animateBound = AnimationManager.animate.bind(AnimationManager);
  /**
   */
  static #pendingList = [];
  /**
   * Tracks whether a requestAnimationFrame callback is pending via {@link AnimationManager.add};
   */
  static #rafPending = false;
  /**
   * Time of last `rAF` callback.
   */
  static #timeFrame;
  /**
   * Time of `performance.now()` at last `rAF` callback.
   */
  static #timeNow;
  /**
   * @returns Time of last `rAF` callback.
   */
  static get timeFrame() {
    return this.#timeFrame;
  }
  /**
   * @returns Time of `performance.now()` at last `rAF` callback.
   */
  static get timeNow() {
    return this.#timeNow;
  }
  /**
   * Add animation data.
   *
   * @param data -
   */
  static add(data) {
    if (data.cancelled) {
      this.#cleanupData(data);
      return;
    }
    AnimationManager.#pendingList.push(data);
    if (!AnimationManager.#rafPending) {
      AnimationManager.#rafPending = true;
      globalThis.requestAnimationFrame(this.#animateBound);
    }
  }
  /**
   * Manage all animation.
   *
   * @param timeFrame - rAF callback time.
   */
  static animate(timeFrame) {
    AnimationManager.#rafPending = false;
    AnimationManager.#timeNow = globalThis.performance.now();
    AnimationManager.#timeFrame = timeFrame;
    if (AnimationManager.#activeList.length === 0 && AnimationManager.#pendingList.length === 0) {
      return;
    }
    if (AnimationManager.#pendingList.length) {
      for (let cntr = AnimationManager.#pendingList.length; --cntr >= 0; ) {
        const data = AnimationManager.#pendingList[cntr];
        if (data.cancelled || data.el !== void 0 && !data.el.isConnected) {
          AnimationManager.#pendingList.splice(cntr, 1);
          this.#cleanupData(data);
        }
        if (data.active) {
          if (data.transformOrigin) {
            data.position.set({ transformOrigin: data.transformOrigin });
          }
          data.start = AnimationManager.#timeFrame;
          AnimationManager.#pendingList.splice(cntr, 1);
          AnimationManager.#activeList.push(data);
        }
      }
    }
    for (let cntr = AnimationManager.#activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.#activeList[cntr];
      if (data.cancelled) {
        AnimationManager.#activeList.splice(cntr, 1);
        this.#cleanupData(data);
        continue;
      }
      data.current = timeFrame - data.start;
      if (data.current >= data.duration) {
        for (let dataCntr = data.keys.length; --dataCntr >= 0; ) {
          const key = data.keys[dataCntr];
          data.newData[key] = data.destination[key];
        }
        data.position.set(data.newData, AnimationManager.#tjsPositionSetOptions);
        AnimationManager.#activeList.splice(cntr, 1);
        this.#cleanupData(data);
        continue;
      }
      const easedTime = data.ease(data.current / data.duration);
      for (let dataCntr = data.keys.length; --dataCntr >= 0; ) {
        const key = data.keys[dataCntr];
        data.newData[key] = data.interpolate(data.initial[key], data.destination[key], easedTime);
      }
      data.position.set(data.newData, AnimationManager.#tjsPositionSetOptions);
    }
    globalThis.requestAnimationFrame(this.#animateBound);
  }
  /**
   * Cancels all animations for given TJSPosition instance.
   *
   * @param position - TJSPosition instance.
   *
   * @param [cancelFn] - An optional function to control cancelling animations.
   */
  static cancel(position, cancelFn = AnimationManager.cancelFn) {
    for (let cntr = AnimationManager.#activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.#activeList[cntr];
      if (data.cancelable && data.position === position && cancelFn(data)) {
        AnimationManager.#activeList.splice(cntr, 1);
        data.cancelled = true;
        this.#cleanupData(data);
      }
    }
    for (let cntr = AnimationManager.#pendingList.length; --cntr >= 0; ) {
      const data = AnimationManager.#pendingList[cntr];
      if (data.cancelable && data.position === position && cancelFn(data)) {
        AnimationManager.#pendingList.splice(cntr, 1);
        data.cancelled = true;
        this.#cleanupData(data);
      }
    }
  }
  /**
   * Cancels all active and delayed animations.
   */
  static cancelAll() {
    for (let cntr = AnimationManager.#activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.#activeList[cntr];
      data.cancelled = true;
      this.#cleanupData(data);
    }
    for (let cntr = AnimationManager.#pendingList.length; --cntr >= 0; ) {
      const data = AnimationManager.#pendingList[cntr];
      data.cancelled = true;
      this.#cleanupData(data);
    }
    AnimationManager.#activeList.length = 0;
    AnimationManager.#pendingList.length = 0;
  }
  /**
   * @param data - Animation data to cleanup.
   */
  static #cleanupData(data) {
    data.active = false;
    data.finished = true;
    if (data.transformOriginInitial) {
      data.position.set({ transformOrigin: data.transformOriginInitial });
    }
    if (typeof data.cleanup === "function") {
      data.cleanup(data);
    }
    if (typeof data.resolve === "function") {
      data.resolve({ cancelled: data.cancelled });
    }
    if (!data.quickTo) {
      data.cleanup = void 0;
      data.control = void 0;
      data.destination = void 0;
      data.el = void 0;
      data.ease = void 0;
      data.initial = void 0;
      data.interpolate = void 0;
      data.keys = void 0;
      data.newData = void 0;
      data.position = void 0;
      data.resolve = void 0;
    }
  }
  /**
   * Gets all {@link AnimationControl} instances for a given TJSPosition instance.
   *
   * @param position - TJSPosition instance.
   *
   * @returns All scheduled AnimationControl instances for the given TJSPosition instance.
   */
  static getScheduled(position) {
    const results = [];
    for (let cntr = AnimationManager.#activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.#activeList[cntr];
      if (data.position === position && data.control) {
        results.push(data.control);
      }
    }
    for (let cntr = AnimationManager.#pendingList.length; --cntr >= 0; ) {
      const data = AnimationManager.#pendingList[cntr];
      if (data.position === position && data.control) {
        results.push(data.control);
      }
    }
    return results;
  }
  /**
   * Returns the status of any scheduled or pending animations for the given {@link TJSPosition} instance.
   *
   * @param position - TJSPosition instance.
   *
   * @param [options] - Scheduling options.
   *
   * @returns True if scheduled / false if not.
   */
  static isScheduled(position, { active: active2 = true, pending = true } = {}) {
    if (active2) {
      for (let cntr = AnimationManager.#activeList.length; --cntr >= 0; ) {
        if (AnimationManager.#activeList[cntr].position === position) {
          return true;
        }
      }
    }
    if (pending) {
      for (let cntr = AnimationManager.#pendingList.length; --cntr >= 0; ) {
        if (AnimationManager.#pendingList[cntr].position === position) {
          return true;
        }
      }
    }
    return false;
  }
}
class TJSPositionData {
  height;
  left;
  maxHeight;
  maxWidth;
  minHeight;
  minWidth;
  rotateX;
  rotateY;
  rotateZ;
  scale;
  top;
  transformOrigin;
  translateX;
  translateY;
  translateZ;
  width;
  zIndex;
  /**
   * @param [opts] - Options.
   *
   * @param [opts.height] -
   *
   * @param [opts.left] -
   *
   * @param [opts.maxHeight] -
   *
   * @param [opts.maxWidth] -
   *
   * @param [opts.minHeight] -
   *
   * @param [opts.minWidth] -
   *
   * @param [opts.rotateX] -
   *
   * @param [opts.rotateY] -
   *
   * @param [opts.rotateZ] -
   *
   * @param [opts.scale] -
   *
   * @param [opts.translateX] -
   *
   * @param [opts.translateY] -
   *
   * @param [opts.translateZ] -
   *
   * @param [opts.top] -
   *
   * @param [opts.transformOrigin] -
   *
   * @param [opts.width] -
   *
   * @param [opts.zIndex] -
   */
  constructor({ height = null, left = null, maxHeight = null, maxWidth = null, minHeight = null, minWidth = null, rotateX = null, rotateY = null, rotateZ = null, scale = null, translateX = null, translateY = null, translateZ = null, top = null, transformOrigin = null, width = null, zIndex = null } = {}) {
    this.height = height;
    this.left = left;
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.minWidth = minWidth;
    this.rotateX = rotateX;
    this.rotateY = rotateY;
    this.rotateZ = rotateZ;
    this.scale = scale;
    this.top = top;
    this.transformOrigin = transformOrigin;
    this.translateX = translateX;
    this.translateY = translateY;
    this.translateZ = translateZ;
    this.width = width;
    this.zIndex = zIndex;
  }
}
class TJSPositionDataUtil {
  /**
   * Stores the TJSPositionData properties that can be animated.
   */
  static #animateKeys = Object.freeze(/* @__PURE__ */ new Set([
    // Main keys
    "left",
    "top",
    "maxWidth",
    "maxHeight",
    "minWidth",
    "minHeight",
    "width",
    "height",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "translateX",
    "translateY",
    "translateZ",
    "zIndex",
    // Aliases
    "rotation"
  ]));
  /**
   * Stores the TJSPositionData property aliases that can be animated.
   */
  static #animateKeyAliases = Object.freeze(/* @__PURE__ */ new Map([["rotation", "rotateZ"]]));
  /**
   * Provides numeric defaults for all parameters. This is used by {@link TJSPosition.get} to optionally provide
   * numeric defaults.
   */
  static #numericDefaults = Object.freeze({
    // Other keys
    height: 0,
    left: 0,
    maxHeight: null,
    maxWidth: null,
    minHeight: null,
    minWidth: null,
    top: 0,
    transformOrigin: null,
    width: 0,
    zIndex: null,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    translateZ: 0
  });
  /**
   * Convenience to copy from source to target of two TJSPositionData like objects. If a target is not supplied a new
   * {@link TJSPositionData} instance is created.
   *
   * @param source - The source instance to copy from.
   *
   * @param [target] - Target TJSPositionData like object; if one is not provided a new instance is created.
   *
   * @returns The target instance with all TJSPositionData fields.
   */
  static copyData(source, target = new TJSPositionData()) {
    target.height = source.height ?? null;
    target.left = source.left ?? null;
    target.maxHeight = source.maxHeight ?? null;
    target.maxWidth = source.maxWidth ?? null;
    target.minHeight = source.minHeight ?? null;
    target.minWidth = source.minWidth ?? null;
    target.rotateX = source.rotateX ?? null;
    target.rotateY = source.rotateY ?? null;
    target.rotateZ = source.rotateZ ?? null;
    target.scale = source.scale ?? null;
    target.top = source.top ?? null;
    target.transformOrigin = source.transformOrigin ?? null;
    target.translateX = source.translateX ?? null;
    target.translateY = source.translateY ?? null;
    target.translateZ = source.translateZ ?? null;
    target.width = source.width ?? null;
    target.zIndex = source.zIndex ?? null;
    return target;
  }
  /**
   * Returns the non-aliased animation key.
   *
   * @param key - Animation key / possibly aliased key.
   *
   * @returns Actual non-aliased animation key.
   */
  static getAnimationKey(key) {
    return this.#animateKeyAliases.get(key) ?? key;
  }
  /**
   * Queries an object by the given key or otherwise returns any numeric default.
   *
   * @param data - An object to query for the given animation key.
   *
   * @param key - Animation key.
   *
   * @returns Data at key or numeric default.
   */
  static getDataOrDefault(data, key) {
    key = this.#animateKeyAliases.get(key) ?? key;
    return data[key] ?? this.#numericDefaults[key];
  }
  /**
   * Tests if the given key is an animation key.
   *
   * @param key - A potential animation key.
   *
   * @returns Is animation key.
   */
  static isAnimationKey(key) {
    return this.#animateKeys.has(key);
  }
  /**
   * Sets numeric defaults for a {@link TJSPositionData} like object.
   *
   * @param data - A TJSPositionData like object.
   */
  static setNumericDefaults(data) {
    if (data.rotateX === null) {
      data.rotateX = 0;
    }
    if (data.rotateY === null) {
      data.rotateY = 0;
    }
    if (data.rotateZ === null) {
      data.rotateZ = 0;
    }
    if (data.translateX === null) {
      data.translateX = 0;
    }
    if (data.translateY === null) {
      data.translateY = 0;
    }
    if (data.translateZ === null) {
      data.translateZ = 0;
    }
    if (data.scale === null) {
      data.scale = 1;
    }
  }
}
class ConvertStringData {
  /**
   * Animation keys for different processing categories.
   */
  static #animKeyTypes = {
    // Animation keys that can be specified in `px` converted to a number.
    numPx: Object.freeze(/* @__PURE__ */ new Set([
      "left",
      "top",
      "maxWidth",
      "maxHeight",
      "minWidth",
      "minHeight",
      "width",
      "height",
      "translateX",
      "translateY",
      "translateZ"
    ])),
    // Animation keys that can be specified in percentage of parent element constraint.
    percentParent: Object.freeze(/* @__PURE__ */ new Set([
      "left",
      "top",
      "maxWidth",
      "maxHeight",
      "minWidth",
      "minHeight",
      "width",
      "height"
    ])),
    // Only rotation animation keys can be specified in `rad` / `turn` converted to a number.
    rotationRadTurn: Object.freeze(/* @__PURE__ */ new Set(["rotateX", "rotateY", "rotateZ", "rotation"]))
  };
  /**
   * Parses string data values. Relative values must start with leading values '+=', '-=', or '*=' followed by a
   * float / numeric value. IE `+=45` or for percentage '+=10%'. Also handles exact percent value such as `10` or
   * `10%`. Percentage values are based on the current value, parent element constraints, or constraints of the type
   * of value like rotation being bound by 360 degrees.
   *
   * @privateRemarks
   * TODO: In the future support more specific CSS unit types.
   */
  static #regexStringData = /^(?<operation>[-+*]=)?(?<value>-?\d*\.?\d+)(?<unit>%|%~|px|rad|turn)?$/;
  /**
   * Stores the results for match groups from `regexStringData`;
   */
  static #matchResults = Object.seal({
    operation: void 0,
    value: 0,
    unit: void 0
  });
  /**
   * Converts any relative string values for animatable keys to actual updates performed against current data.
   *
   * @param data - position data.
   *
   * @param position - The source position data.
   *
   * @param el - Target positioned element.
   *
   * @returns Converted data.
   */
  static process(data, position, el) {
    let parentClientHeight = Number.NaN;
    let parentClientWidth = Number.NaN;
    for (const key in data) {
      if (TJSPositionDataUtil.isAnimationKey(key)) {
        const value = data[key];
        if (typeof value !== "string") {
          continue;
        }
        if (value === "auto" || value === "inherit") {
          continue;
        }
        const animKey = key;
        const regexResults = this.#regexStringData.exec(value);
        let handled = false;
        if (regexResults && regexResults.groups) {
          const results = this.#matchResults;
          results.operation = regexResults.groups.operation;
          results.value = parseFloat(regexResults.groups.value);
          results.unit = regexResults.groups.unit;
          const current = TJSPositionDataUtil.getDataOrDefault(position, key);
          switch (results.unit) {
            case "%": {
              if (this.#animKeyTypes.percentParent.has(key) && (Number.isNaN(parentClientHeight) || Number.isNaN(parentClientWidth))) {
                if (el?.parentElement?.isConnected) {
                  parentClientHeight = el.parentElement.clientHeight;
                  parentClientWidth = el.parentElement.clientWidth;
                } else {
                  parentClientHeight = 0;
                  parentClientWidth = 0;
                  console.warn(`TJSPosition - ConvertStringData warning: could not determine parent constraints for key '${key}' with value '${value}'.`);
                  data[key] = void 0;
                  continue;
                }
              }
              handled = this.#handlePercent(animKey, current, data, results, parentClientHeight, parentClientWidth);
              break;
            }
            case "%~":
              handled = this.#handleRelativePercent(animKey, current, data, results);
              break;
            case "px":
              handled = this.#animKeyTypes.numPx.has(key) ? this.#applyResultsValue(animKey, current, data, results) : false;
              break;
            case "rad":
            case "turn":
              handled = this.#animKeyTypes.rotationRadTurn.has(key) ? this.#handleRotationRadTurn(animKey, current, data, results) : false;
              break;
            default:
              handled = this.#applyResultsValue(animKey, current, data, results);
              break;
          }
        }
        if (!regexResults || !handled) {
          console.warn(`TJSPosition - ConvertStringData warning: malformed key '${key}' with value '${value}'.`);
          data[key] = void 0;
        }
      }
    }
    return data;
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Provides the common update to source data after `results.value` has been converted to the proper value
   * respectively.
   *
   * @param key - Animation key.
   *
   * @param current - Current value
   *
   * @param data - Source data to convert.
   *
   * @param results - Match results.
   *
   * @returns Adjustment successful.
   */
  static #applyResultsValue(key, current, data, results) {
    if (!results.operation) {
      data[key] = results.value;
      return true;
    }
    switch (results.operation) {
      case "-=":
        data[key] = current - results.value;
        break;
      case "+=":
        data[key] = current + results.value;
        break;
      case "*=":
        data[key] = current * results.value;
        break;
      default:
        return false;
    }
    return true;
  }
  /**
   * Handles the `%` unit type where values are adjusted against the parent element client width / height or in the
   * case of rotation the percentage of 360 degrees.
   *
   * @param key - Animation key.
   *
   * @param current - Current value
   *
   * @param data - Source data to convert.
   *
   * @param results - Match results.
   *
   * @param parentClientHeight - Parent element client height.
   *
   * @param parentClientWidth - Parent element client width.
   *
   * @returns Adjustment successful.
   */
  static #handlePercent(key, current, data, results, parentClientHeight, parentClientWidth) {
    switch (key) {
      case "left":
      case "maxWidth":
      case "minWidth":
      case "width":
      case "translateX":
        results.value = parentClientWidth * (results.value / 100);
        break;
      case "top":
      case "maxHeight":
      case "minHeight":
      case "height":
      case "translateY":
        results.value = parentClientHeight * (results.value / 100);
        break;
      case "rotateX":
      case "rotateY":
      case "rotateZ":
      case "rotation":
        results.value = 360 * (results.value / 100);
        break;
      default:
        return false;
    }
    return this.#applyResultsValue(key, current, data, results);
  }
  /**
   * Handles the `%~` unit type where values are adjusted against the current value for the given key.
   *
   * @param key - Animation key.
   *
   * @param current - Current value
   *
   * @param data - Source data to convert.
   *
   * @param results - Match results.
   *
   * @returns Adjustment successful.
   */
  static #handleRelativePercent(key, current, data, results) {
    results.value = results.value / 100;
    if (!results.operation) {
      data[key] = current * results.value;
      return true;
    }
    switch (results.operation) {
      case "-=":
        data[key] = current - current * results.value;
        break;
      case "+=":
        data[key] = current + current * results.value;
        break;
      case "*=":
        data[key] = current * (current * results.value);
        break;
      default:
        return false;
    }
    return true;
  }
  /**
   * Handles the `rad` / `turn` unit types for rotation animation keys.
   *
   * @param key - Animation key.
   *
   * @param current - Current value
   *
   * @param data - Source data to convert.
   *
   * @param results - Match results.
   *
   * @returns Adjustment successful.
   */
  static #handleRotationRadTurn(key, current, data, results) {
    switch (results.unit) {
      case "rad":
        results.value = radToDeg(results.value);
        break;
      case "turn":
        results.value = 360 * results.value;
        break;
    }
    return this.#applyResultsValue(key, current, data, results);
  }
}
class TJSTransformData {
  constructor() {
    Object.seal(this);
  }
  /**
   * Stores the calculated bounding rectangle.
   */
  #boundingRect = new DOMRect();
  /**
   * Stores the individual transformed corner points of the window in screen space clockwise from:
   * top left -> top right -> bottom right -> bottom left.
   */
  #corners = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
  /**
   * Stores the current gl-matrix Mat4 data.
   */
  #mat4 = new Mat4();
  /**
   * Stores the pre-origin & post-origin translations to apply to matrix transforms.
   */
  #originTranslations = [new Mat4(), new Mat4()];
  /**
   * @returns The bounding rectangle.
   */
  get boundingRect() {
    return this.#boundingRect;
  }
  /**
   * @returns The transformed corner points as Vec3 in screen space.
   */
  get corners() {
    return this.#corners;
  }
  /**
   * @returns Returns the CSS style string for the transform matrix.
   */
  get css() {
    return `matrix3d(${this.mat4.join(",")})`;
  }
  /**
   * @returns The transform matrix.
   */
  get mat4() {
    return this.#mat4;
  }
  /**
   * @returns The pre / post translation matrices for origin translation.
   */
  get originTranslations() {
    return this.#originTranslations;
  }
}
class NumberGuard {
  constructor() {
  }
  static isFinite(value) {
    return typeof value === "number" && Number.isFinite(value);
  }
  static isFiniteOrNull(value) {
    return value === null || typeof value === "number" && Number.isFinite(value);
  }
}
class TJSPositionStyleCache {
  el;
  computed;
  marginLeft;
  marginTop;
  maxHeight;
  maxWidth;
  minHeight;
  minWidth;
  hasWillChange;
  stores;
  resizeObserved;
  constructor() {
    this.el = void 0;
    this.computed = void 0;
    this.marginLeft = void 0;
    this.marginTop = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.minHeight = void 0;
    this.minWidth = void 0;
    this.hasWillChange = false;
    this.resizeObserved = Object.seal({
      contentHeight: void 0,
      contentWidth: void 0,
      offsetHeight: void 0,
      offsetWidth: void 0
    });
    const storeResizeObserved = writable(this.resizeObserved);
    this.stores = {
      element: writable(this.el),
      resizeContentHeight: propertyStore(storeResizeObserved, "contentHeight"),
      resizeContentWidth: propertyStore(storeResizeObserved, "contentWidth"),
      resizeObserved: storeResizeObserved,
      resizeObservable: writable(false),
      resizeObservableHeight: writable(false),
      resizeObservableWidth: writable(false),
      resizeOffsetHeight: propertyStore(storeResizeObserved, "offsetHeight"),
      resizeOffsetWidth: propertyStore(storeResizeObserved, "offsetWidth")
    };
  }
  /**
   * Returns the cached offsetHeight from any attached `resizeObserver` action otherwise gets the offsetHeight from
   * the element directly. The more optimized path is using `resizeObserver` as getting it from the element
   * directly is more expensive and alters the execution order of an animation frame.
   *
   * @returns The element offsetHeight.
   */
  get offsetHeight() {
    if (this.el !== void 0 && A11yHelper.isFocusTarget(this.el)) {
      return this.resizeObserved.offsetHeight !== void 0 ? this.resizeObserved.offsetHeight : this.el.offsetHeight;
    }
    throw new Error(`TJSPositionStyleCache - get offsetHeight error: no element assigned.`);
  }
  /**
   * Returns the cached offsetWidth from any attached `resizeObserver` action otherwise gets the offsetWidth from
   * the element directly. The more optimized path is using `resizeObserver` as getting it from the element
   * directly is more expensive and alters the execution order of an animation frame.
   *
   * @returns The element offsetHeight.
   */
  get offsetWidth() {
    if (this.el !== void 0 && A11yHelper.isFocusTarget(this.el)) {
      return this.resizeObserved.offsetWidth !== void 0 ? this.resizeObserved.offsetWidth : this.el.offsetWidth;
    }
    throw new Error(`TJSPositionStyleCache - get offsetWidth error: no element assigned.`);
  }
  /**
   * @param el -
   *
   * @returns Does element match cached element.
   */
  hasData(el) {
    return this.el === el;
  }
  /**
   * Resets the style cache.
   */
  reset() {
    if (this.el !== void 0 && A11yHelper.isFocusTarget(this.el) && this.el.isConnected && !this.hasWillChange) {
      this.el.style.willChange = "";
    }
    this.el = void 0;
    this.computed = void 0;
    this.marginLeft = void 0;
    this.marginTop = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.minHeight = void 0;
    this.minWidth = void 0;
    this.hasWillChange = false;
    this.resizeObserved.contentHeight = void 0;
    this.resizeObserved.contentWidth = void 0;
    this.resizeObserved.offsetHeight = void 0;
    this.resizeObserved.offsetWidth = void 0;
    this.stores.element.set(void 0);
  }
  /**
   * Updates the style cache with new data from the given element.
   *
   * @param el - An HTML element.
   */
  update(el) {
    this.el = el;
    this.computed = globalThis.getComputedStyle(el);
    this.marginLeft = StyleParse.pixels(el.style.marginLeft) ?? StyleParse.pixels(this.computed.marginLeft);
    this.marginTop = StyleParse.pixels(el.style.marginTop) ?? StyleParse.pixels(this.computed.marginTop);
    this.maxHeight = StyleParse.pixels(el.style.maxHeight) ?? StyleParse.pixels(this.computed.maxHeight);
    this.maxWidth = StyleParse.pixels(el.style.maxWidth) ?? StyleParse.pixels(this.computed.maxWidth);
    this.minHeight = StyleParse.pixels(el.style.minHeight) ?? StyleParse.pixels(this.computed.minHeight);
    this.minWidth = StyleParse.pixels(el.style.minWidth) ?? StyleParse.pixels(this.computed.minWidth);
    const willChange = el.style.willChange !== "" ? el.style.willChange : this.computed.willChange ?? "";
    this.hasWillChange = willChange !== "" && willChange !== "auto";
    this.stores.element.set(el);
  }
}
class TJSTransforms {
  /**
   * Stores transform data.
   */
  #data = {};
  /**
   * Stores the transform keys in the order added.
   */
  #orderList = [];
  /**
   * Defines the keys of TJSPositionData that are transform keys.
   *
   * Note: `rotateZ` is the most likely transform applied in 2D context. Putting it first makes `hasTransform` slightly
   * quicker.
   */
  static #transformKeys = Object.freeze([
    "rotateZ",
    "scale",
    "rotateX",
    "rotateY",
    "translateX",
    "translateY",
    "translateZ"
  ]);
  /**
   * Validates that a given key is a transform key.
   *
   * @param key - A potential transform key.
   */
  static #isTransformKey(key) {
    return this.#transformKeys.includes(key);
  }
  /**
   * Defines bitwise keys for transforms used in {@link TJSTransforms.getMat4}.
   */
  static #transformKeysBitwise = Object.freeze({
    rotateX: 1,
    rotateY: 2,
    rotateZ: 4,
    scale: 8,
    translateX: 16,
    translateY: 32,
    translateZ: 64
  });
  /**
   * Defines the default transform origin.
   */
  static #transformOriginDefault = "top left";
  /**
   * Defines the valid transform origins.
   */
  static #transformOrigins = Object.freeze([
    "top left",
    "top center",
    "top right",
    "center left",
    "center",
    "center right",
    "bottom left",
    "bottom center",
    "bottom right"
  ]);
  /**
   * Defines a valid Set of transform origins.
   */
  static #transformOriginsSet = Object.freeze(new Set(this.#transformOrigins));
  // Temporary variables --------------------------------------------------------------------------------------------
  /**
   */
  static #mat4Result = new Mat4();
  /**
   */
  static #mat4Temp = new Mat4();
  /**
   */
  static #vec3Temp = new Vec3();
  /**
   */
  static #vectorScale = [1, 1, 1];
  /**
   */
  static #vectorTranslate = [0, 0, 0];
  /**
   * Returns a list of supported transform origins.
   *
   * @returns The supported transform origin strings.
   */
  static get transformOrigins() {
    return this.#transformOrigins;
  }
  /**
   * Returns whether the given string is a {@link TransformAPI.TransformOrigin}.
   *
   * @param origin - A potential transform origin string.
   *
   * @returns True if origin is a TransformOrigin string.
   */
  static isTransformOrigin(origin) {
    return this.#transformOriginsSet.has(origin);
  }
  /**
   * @returns Whether there are active transforms in local data.
   */
  get isActive() {
    return this.#orderList.length > 0;
  }
  /**
   * @returns Any local rotateX data.
   */
  get rotateX() {
    return this.#data.rotateX;
  }
  /**
   * @returns Any local rotateY data.
   */
  get rotateY() {
    return this.#data.rotateY;
  }
  /**
   * @returns Any local rotateZ data.
   */
  get rotateZ() {
    return this.#data.rotateZ;
  }
  /**
   * @returns Any local rotateZ scale.
   */
  get scale() {
    return this.#data.scale;
  }
  /**
   * @returns Any local translateZ data.
   */
  get translateX() {
    return this.#data.translateX;
  }
  /**
   * @returns Any local translateZ data.
   */
  get translateY() {
    return this.#data.translateY;
  }
  /**
   * @returns Any local translateZ data.
   */
  get translateZ() {
    return this.#data.translateZ;
  }
  /**
   * Sets the local rotateX data if the value is a finite number otherwise removes the local data.
   *
   * @param value - A value to set.
   */
  set rotateX(value) {
    if (Number.isFinite(value)) {
      if (this.#data.rotateX === void 0) {
        this.#orderList.push("rotateX");
      }
      this.#data.rotateX = value;
    } else {
      if (this.#data.rotateX !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateX");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this.#data.rotateX;
    }
  }
  /**
   * Sets the local rotateY data if the value is a finite number otherwise removes the local data.
   *
   * @param value - A value to set.
   */
  set rotateY(value) {
    if (Number.isFinite(value)) {
      if (this.#data.rotateY === void 0) {
        this.#orderList.push("rotateY");
      }
      this.#data.rotateY = value;
    } else {
      if (this.#data.rotateY !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateY");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this.#data.rotateY;
    }
  }
  /**
   * Sets the local rotateZ data if the value is a finite number otherwise removes the local data.
   *
   * @param value - A value to set.
   */
  set rotateZ(value) {
    if (Number.isFinite(value)) {
      if (this.#data.rotateZ === void 0) {
        this.#orderList.push("rotateZ");
      }
      this.#data.rotateZ = value;
    } else {
      if (this.#data.rotateZ !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateZ");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this.#data.rotateZ;
    }
  }
  /**
   * Sets the local scale data if the value is a finite number otherwise removes the local data.
   *
   * @param value - A value to set.
   */
  set scale(value) {
    if (Number.isFinite(value)) {
      if (this.#data.scale === void 0) {
        this.#orderList.push("scale");
      }
      this.#data.scale = value;
    } else {
      if (this.#data.scale !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "scale");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this.#data.scale;
    }
  }
  /**
   * Sets the local translateX data if the value is a finite number otherwise removes the local data.
   *
   * @param value - A value to set.
   */
  set translateX(value) {
    if (Number.isFinite(value)) {
      if (this.#data.translateX === void 0) {
        this.#orderList.push("translateX");
      }
      this.#data.translateX = value;
    } else {
      if (this.#data.translateX !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateX");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this.#data.translateX;
    }
  }
  /**
   * Sets the local translateY data if the value is a finite number otherwise removes the local data.
   *
   * @param value - A value to set.
   */
  set translateY(value) {
    if (Number.isFinite(value)) {
      if (this.#data.translateY === void 0) {
        this.#orderList.push("translateY");
      }
      this.#data.translateY = value;
    } else {
      if (this.#data.translateY !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateY");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this.#data.translateY;
    }
  }
  /**
   * Sets the local translateZ data if the value is a finite number otherwise removes the local data.
   *
   * @param value - A value to set.
   */
  set translateZ(value) {
    if (Number.isFinite(value)) {
      if (this.#data.translateZ === void 0) {
        this.#orderList.push("translateZ");
      }
      this.#data.translateZ = value;
    } else {
      if (this.#data.translateZ !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateZ");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this.#data.translateZ;
    }
  }
  /**
   * Returns the `matrix3d` CSS transform for the given position / transform data.
   *
   * @param [data] - Optional position data otherwise use local stored transform data.
   *
   * @returns The CSS `matrix3d` string.
   */
  getCSS(data = this.#data) {
    return `matrix3d(${this.getMat4(data, TJSTransforms.#mat4Result).join(",")})`;
  }
  /**
   * Returns the `matrix3d` CSS transform for the given position / transform data.
   *
   * @param [data] - Optional position data otherwise use local stored transform data.
   *
   * @returns The CSS `matrix3d` string.
   */
  getCSSOrtho(data = this.#data) {
    return `matrix3d(${this.getMat4Ortho(data, TJSTransforms.#mat4Result).join(",")})`;
  }
  /**
   * Collects all data including a bounding rect, transform matrix, and points array of the given
   * {@link TJSPositionData} instance with the applied local transform data.
   *
   * @param position - The position data to process.
   *
   * @param [output] - Optional TJSTransformData output instance.
   *
   * @param [validationData] - Optional validation data for adjustment parameters.
   *
   * @returns The output TJSTransformData instance.
   */
  getData(position, output = new TJSTransformData(), validationData) {
    const valWidth = validationData?.width ?? 0;
    const valHeight = validationData?.height ?? 0;
    const valOffsetTop = validationData?.offsetTop ?? validationData?.marginTop ?? 0;
    const valOffsetLeft = validationData?.offsetLeft ?? validationData?.marginLeft ?? 0;
    position.top += valOffsetTop;
    position.left += valOffsetLeft;
    const width = NumberGuard.isFinite(position.width) ? position.width : valWidth;
    const height = NumberGuard.isFinite(position.height) ? position.height : valHeight;
    const rect = output.corners;
    if (this.hasTransform(position)) {
      rect[0][0] = rect[0][1] = rect[0][2] = 0;
      rect[1][0] = width;
      rect[1][1] = rect[1][2] = 0;
      rect[2][0] = width;
      rect[2][1] = height;
      rect[2][2] = 0;
      rect[3][0] = 0;
      rect[3][1] = height;
      rect[3][2] = 0;
      const matrix = this.getMat4(position, output.mat4);
      const translate = TJSTransforms.#getOriginTranslation(position.transformOrigin, width, height, output.originTranslations);
      if (TJSTransforms.#transformOriginDefault === position.transformOrigin) {
        Vec3.transformMat4(rect[0], rect[0], matrix);
        Vec3.transformMat4(rect[1], rect[1], matrix);
        Vec3.transformMat4(rect[2], rect[2], matrix);
        Vec3.transformMat4(rect[3], rect[3], matrix);
      } else {
        Vec3.transformMat4(rect[0], rect[0], translate[0]);
        Vec3.transformMat4(rect[0], rect[0], matrix);
        Vec3.transformMat4(rect[0], rect[0], translate[1]);
        Vec3.transformMat4(rect[1], rect[1], translate[0]);
        Vec3.transformMat4(rect[1], rect[1], matrix);
        Vec3.transformMat4(rect[1], rect[1], translate[1]);
        Vec3.transformMat4(rect[2], rect[2], translate[0]);
        Vec3.transformMat4(rect[2], rect[2], matrix);
        Vec3.transformMat4(rect[2], rect[2], translate[1]);
        Vec3.transformMat4(rect[3], rect[3], translate[0]);
        Vec3.transformMat4(rect[3], rect[3], matrix);
        Vec3.transformMat4(rect[3], rect[3], translate[1]);
      }
      rect[0][0] = position.left + rect[0][0];
      rect[0][1] = position.top + rect[0][1];
      rect[1][0] = position.left + rect[1][0];
      rect[1][1] = position.top + rect[1][1];
      rect[2][0] = position.left + rect[2][0];
      rect[2][1] = position.top + rect[2][1];
      rect[3][0] = position.left + rect[3][0];
      rect[3][1] = position.top + rect[3][1];
    } else {
      rect[0][0] = position.left;
      rect[0][1] = position.top;
      rect[1][0] = position.left + width;
      rect[1][1] = position.top;
      rect[2][0] = position.left + width;
      rect[2][1] = position.top + height;
      rect[3][0] = position.left;
      rect[3][1] = position.top + height;
      Mat4.identity(output.mat4);
    }
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    for (let cntr = 4; --cntr >= 0; ) {
      if (rect[cntr][0] > maxX) {
        maxX = rect[cntr][0];
      }
      if (rect[cntr][0] < minX) {
        minX = rect[cntr][0];
      }
      if (rect[cntr][1] > maxY) {
        maxY = rect[cntr][1];
      }
      if (rect[cntr][1] < minY) {
        minY = rect[cntr][1];
      }
    }
    const boundingRect = output.boundingRect;
    boundingRect.x = minX;
    boundingRect.y = minY;
    boundingRect.width = maxX - minX;
    boundingRect.height = maxY - minY;
    position.top -= valOffsetTop;
    position.left -= valOffsetLeft;
    return output;
  }
  /**
   * Creates a transform matrix based on local data applied in order it was added.
   *
   * If no data object is provided then the source is the local transform data. If another data object is supplied
   * then the stored local transform order is applied then all remaining transform keys are applied. This allows the
   * construction of a transform matrix in advance of setting local data and is useful in collision detection.
   *
   * @param [data] - TJSPositionData instance or local transform data.
   *
   * @param [output] - The output mat4 instance.
   *
   * @returns Transform matrix.
   */
  getMat4(data = this.#data, output = new Mat4()) {
    const matrix = Mat4.identity(output);
    let seenKeys = 0;
    const orderList = this.#orderList;
    for (let cntr = 0; cntr < orderList.length; cntr++) {
      const key = orderList[cntr];
      switch (key) {
        case "rotateX":
          seenKeys |= TJSTransforms.#transformKeysBitwise.rotateX;
          Mat4.multiply(matrix, matrix, Mat4.fromXRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
          break;
        case "rotateY":
          seenKeys |= TJSTransforms.#transformKeysBitwise.rotateY;
          Mat4.multiply(matrix, matrix, Mat4.fromYRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
          break;
        case "rotateZ":
          seenKeys |= TJSTransforms.#transformKeysBitwise.rotateZ;
          Mat4.multiply(matrix, matrix, Mat4.fromZRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
          break;
        case "scale":
          seenKeys |= TJSTransforms.#transformKeysBitwise.scale;
          TJSTransforms.#vectorScale[0] = TJSTransforms.#vectorScale[1] = data[key] ?? 0;
          Mat4.multiply(matrix, matrix, Mat4.fromScaling(TJSTransforms.#mat4Temp, TJSTransforms.#vectorScale));
          break;
        case "translateX":
          seenKeys |= TJSTransforms.#transformKeysBitwise.translateX;
          TJSTransforms.#vectorTranslate[0] = data.translateX ?? 0;
          TJSTransforms.#vectorTranslate[1] = 0;
          TJSTransforms.#vectorTranslate[2] = 0;
          Mat4.multiply(matrix, matrix, Mat4.fromTranslation(TJSTransforms.#mat4Temp, TJSTransforms.#vectorTranslate));
          break;
        case "translateY":
          seenKeys |= TJSTransforms.#transformKeysBitwise.translateY;
          TJSTransforms.#vectorTranslate[0] = 0;
          TJSTransforms.#vectorTranslate[1] = data.translateY ?? 0;
          TJSTransforms.#vectorTranslate[2] = 0;
          Mat4.multiply(matrix, matrix, Mat4.fromTranslation(TJSTransforms.#mat4Temp, TJSTransforms.#vectorTranslate));
          break;
        case "translateZ":
          seenKeys |= TJSTransforms.#transformKeysBitwise.translateZ;
          TJSTransforms.#vectorTranslate[0] = 0;
          TJSTransforms.#vectorTranslate[1] = 0;
          TJSTransforms.#vectorTranslate[2] = data.translateZ ?? 0;
          Mat4.multiply(matrix, matrix, Mat4.fromTranslation(TJSTransforms.#mat4Temp, TJSTransforms.#vectorTranslate));
          break;
      }
    }
    if (data !== this.#data) {
      for (let cntr = 0; cntr < TJSTransforms.#transformKeys.length; cntr++) {
        const key = TJSTransforms.#transformKeys[cntr];
        if (data[key] === null || (seenKeys & TJSTransforms.#transformKeysBitwise[key]) > 0) {
          continue;
        }
        const value = data[key];
        switch (key) {
          case "rotateX":
            Mat4.multiply(matrix, matrix, Mat4.fromXRotation(TJSTransforms.#mat4Temp, degToRad(value)));
            break;
          case "rotateY":
            Mat4.multiply(matrix, matrix, Mat4.fromYRotation(TJSTransforms.#mat4Temp, degToRad(value)));
            break;
          case "rotateZ":
            Mat4.multiply(matrix, matrix, Mat4.fromZRotation(TJSTransforms.#mat4Temp, degToRad(value)));
            break;
          case "scale":
            TJSTransforms.#vectorScale[0] = TJSTransforms.#vectorScale[1] = value;
            Mat4.multiply(matrix, matrix, Mat4.fromScaling(TJSTransforms.#mat4Temp, TJSTransforms.#vectorScale));
            break;
          case "translateX":
            TJSTransforms.#vectorTranslate[0] = value;
            TJSTransforms.#vectorTranslate[1] = 0;
            TJSTransforms.#vectorTranslate[2] = 0;
            Mat4.multiply(matrix, matrix, Mat4.fromTranslation(TJSTransforms.#mat4Temp, TJSTransforms.#vectorTranslate));
            break;
          case "translateY":
            TJSTransforms.#vectorTranslate[0] = 0;
            TJSTransforms.#vectorTranslate[1] = value;
            TJSTransforms.#vectorTranslate[2] = 0;
            Mat4.multiply(matrix, matrix, Mat4.fromTranslation(TJSTransforms.#mat4Temp, TJSTransforms.#vectorTranslate));
            break;
          case "translateZ":
            TJSTransforms.#vectorTranslate[0] = 0;
            TJSTransforms.#vectorTranslate[1] = 0;
            TJSTransforms.#vectorTranslate[2] = value;
            Mat4.multiply(matrix, matrix, Mat4.fromTranslation(TJSTransforms.#mat4Temp, TJSTransforms.#vectorTranslate));
            break;
        }
      }
    }
    return matrix;
  }
  /**
   * Provides an orthographic enhancement to convert left / top positional data to a translate operation.
   *
   * This transform matrix takes into account that the remaining operations are , but adds any left / top attributes
   * from passed in data to translate X / Y.
   *
   * If no data object is provided then the source is the local transform data. If another data object is supplied
   * then the stored local transform order is applied then all remaining transform keys are applied. This allows the
   * construction of a transform matrix in advance of setting local data and is useful in collision detection.
   *
   * @param [data] - TJSPositionData instance or local transform data.
   *
   * @param [output] - The output mat4 instance.
   *
   * @returns Transform matrix.
   */
  getMat4Ortho(data = this.#data, output = new Mat4()) {
    const matrix = Mat4.identity(output);
    TJSTransforms.#vectorTranslate[0] = (data.left ?? 0) + (data.translateX ?? 0);
    TJSTransforms.#vectorTranslate[1] = (data.top ?? 0) + (data.translateY ?? 0);
    TJSTransforms.#vectorTranslate[2] = data.translateZ ?? 0;
    Mat4.multiply(matrix, matrix, Mat4.fromTranslation(TJSTransforms.#mat4Temp, TJSTransforms.#vectorTranslate));
    if (data.scale !== null && data.scale !== void 0) {
      TJSTransforms.#vectorScale[0] = TJSTransforms.#vectorScale[1] = data.scale;
      Mat4.multiply(matrix, matrix, Mat4.fromScaling(TJSTransforms.#mat4Temp, TJSTransforms.#vectorScale));
    }
    if (data.rotateX === null && data.rotateY === null && data.rotateZ === null) {
      return matrix;
    }
    let seenKeys = 0;
    const orderList = this.#orderList;
    for (let cntr = 0; cntr < orderList.length; cntr++) {
      const key = orderList[cntr];
      switch (key) {
        case "rotateX":
          seenKeys |= TJSTransforms.#transformKeysBitwise.rotateX;
          Mat4.multiply(matrix, matrix, Mat4.fromXRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
          break;
        case "rotateY":
          seenKeys |= TJSTransforms.#transformKeysBitwise.rotateY;
          Mat4.multiply(matrix, matrix, Mat4.fromYRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
          break;
        case "rotateZ":
          seenKeys |= TJSTransforms.#transformKeysBitwise.rotateZ;
          Mat4.multiply(matrix, matrix, Mat4.fromZRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
          break;
      }
    }
    if (data !== this.#data) {
      for (let cntr = 0; cntr < TJSTransforms.#transformKeys.length; cntr++) {
        const key = TJSTransforms.#transformKeys[cntr];
        if (data[key] === null || (seenKeys & TJSTransforms.#transformKeysBitwise[key]) > 0) {
          continue;
        }
        switch (key) {
          case "rotateX":
            Mat4.multiply(matrix, matrix, Mat4.fromXRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
            break;
          case "rotateY":
            Mat4.multiply(matrix, matrix, Mat4.fromYRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
            break;
          case "rotateZ":
            Mat4.multiply(matrix, matrix, Mat4.fromZRotation(TJSTransforms.#mat4Temp, degToRad(data[key] ?? 0)));
            break;
        }
      }
    }
    return matrix;
  }
  /**
   * Tests an object if it contains transform keys and the values are finite numbers.
   *
   * @param data - An object to test for transform data.
   *
   * @returns Whether the given TJSPositionData has transforms.
   */
  hasTransform(data) {
    for (let cntr = 0; cntr < TJSTransforms.#transformKeys.length; cntr++) {
      if (Number.isFinite(data[TJSTransforms.#transformKeys[cntr]])) {
        return true;
      }
    }
    return false;
  }
  /**
   * Resets internal data from the given object containing valid transform keys.
   *
   * @param data - An object with transform data.
   */
  reset(data) {
    for (const key in data) {
      if (TJSTransforms.#isTransformKey(key)) {
        const value = data[key];
        if (NumberGuard.isFinite(value)) {
          this.#data[key] = value;
        } else {
          const index = this.#orderList.findIndex((entry) => entry === key);
          if (index >= 0) {
            this.#orderList.splice(index, 1);
          }
          delete this.#data[key];
        }
      }
    }
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Returns the translations necessary to translate a matrix operation based on the `transformOrigin` parameter of the
   * given position instance. The first entry / index 0 is the pre-translation and last entry / index 1 is the post-
   * translation.
   *
   * This method is used internally, but may be useful if you need the origin translation matrices to transform
   * bespoke points based on any `transformOrigin` set in {@link TJSPositionData}.
   *
   * @param transformOrigin - The transform origin attribute from TJSPositionData.
   *
   * @param width - The TJSPositionData width or validation data width when 'auto'.
   *
   * @param height - The TJSPositionData height or validation data height when 'auto'.
   *
   * @param output - Output Mat4 array.
   *
   * @returns Output Mat4 array.
   */
  static #getOriginTranslation(transformOrigin, width, height, output) {
    const vector = TJSTransforms.#vec3Temp;
    switch (transformOrigin) {
      case "top left":
        vector[0] = vector[1] = 0;
        Mat4.fromTranslation(output[0], vector);
        Mat4.fromTranslation(output[1], vector);
        break;
      case "top center":
        vector[0] = -width * 0.5;
        vector[1] = 0;
        Mat4.fromTranslation(output[0], vector);
        vector[0] = width * 0.5;
        Mat4.fromTranslation(output[1], vector);
        break;
      case "top right":
        vector[0] = -width;
        vector[1] = 0;
        Mat4.fromTranslation(output[0], vector);
        vector[0] = width;
        Mat4.fromTranslation(output[1], vector);
        break;
      case "center left":
        vector[0] = 0;
        vector[1] = -height * 0.5;
        Mat4.fromTranslation(output[0], vector);
        vector[1] = height * 0.5;
        Mat4.fromTranslation(output[1], vector);
        break;
      case null:
      case "center":
        vector[0] = -width * 0.5;
        vector[1] = -height * 0.5;
        Mat4.fromTranslation(output[0], vector);
        vector[0] = width * 0.5;
        vector[1] = height * 0.5;
        Mat4.fromTranslation(output[1], vector);
        break;
      case "center right":
        vector[0] = -width;
        vector[1] = -height * 0.5;
        Mat4.fromTranslation(output[0], vector);
        vector[0] = width;
        vector[1] = height * 0.5;
        Mat4.fromTranslation(output[1], vector);
        break;
      case "bottom left":
        vector[0] = 0;
        vector[1] = -height;
        Mat4.fromTranslation(output[0], vector);
        vector[1] = height;
        Mat4.fromTranslation(output[1], vector);
        break;
      case "bottom center":
        vector[0] = -width * 0.5;
        vector[1] = -height;
        Mat4.fromTranslation(output[0], vector);
        vector[0] = width * 0.5;
        vector[1] = height;
        Mat4.fromTranslation(output[1], vector);
        break;
      case "bottom right":
        vector[0] = -width;
        vector[1] = -height;
        Mat4.fromTranslation(output[0], vector);
        vector[0] = width;
        vector[1] = height;
        Mat4.fromTranslation(output[1], vector);
        break;
      default:
        Mat4.identity(output[0]);
        Mat4.identity(output[1]);
        break;
    }
    return output;
  }
}
class AnimationScheduler {
  /**
   * Used to copy data from a TJSPosition instance.
   */
  static #data = {};
  static #getEaseOptions = Object.freeze({ default: false });
  /**
   * Adds / schedules an animation w/ the AnimationManager. This contains the final steps common to all tweens.
   *
   * @param position -
   *
   * @param initial -
   *
   * @param destination -
   *
   * @param duration -
   *
   * @param el -
   *
   * @param cancelable -
   *
   * @param delay -
   *
   * @param ease -
   *
   * @param [interpolate=lerp] -
   *
   * @param [transformOrigin] -
   *
   * @param [transformOriginInitial] -
   *
   * @param [cleanup] -
   *
   * @returns An AnimationControl instance or null if none created.
   */
  static #addAnimation(position, initial, destination, duration, el, cancelable, delay, ease, interpolate = lerp, transformOrigin, transformOriginInitial, cleanup) {
    TJSPositionDataUtil.setNumericDefaults(initial);
    TJSPositionDataUtil.setNumericDefaults(destination);
    for (const key in initial) {
      if (!Number.isFinite(initial[key])) {
        delete initial[key];
      }
    }
    const keys = Object.keys(initial);
    const newData = Object.assign({}, initial);
    if (keys.length === 0) {
      return null;
    }
    const animationData = {
      active: true,
      cleanup,
      cancelable,
      cancelled: false,
      control: void 0,
      current: 0,
      destination,
      duration: duration * 1e3,
      // Internally the AnimationManager works in ms.
      ease,
      el,
      finished: false,
      initial,
      interpolate,
      keys,
      newData,
      position,
      resolve: void 0,
      start: void 0,
      transformOrigin,
      transformOriginInitial,
      quickTo: false
    };
    if (delay > 0) {
      animationData.active = false;
      setTimeout(() => animationData.active = true, delay * 1e3);
    }
    AnimationManager.add(animationData);
    return new AnimationControl(animationData, true);
  }
  /**
   * Provides a tween from given position data to the current position.
   *
   * @param position - The target position instance.
   *
   * @param fromData - The starting position.
   *
   * @param options - Tween options.
   *
   * @param [cleanup] - Custom animation cleanup function.
   *
   * @returns An AnimationControl instance or null if none created.
   */
  static from(position, fromData, options = {}, cleanup) {
    if (!isObject(fromData)) {
      throw new TypeError(`AnimationAPI.from error: 'fromData' is not an object.`);
    }
    const parent = position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return null;
    }
    let { cancelable = true, delay = 0, duration = 1, ease = "cubicOut", strategy, transformOrigin } = options;
    if (strategy !== void 0) {
      if (this.#handleStrategy(position, strategy) === null) {
        return null;
      }
    }
    const targetEl = A11yHelper.isFocusTarget(parent) ? parent : parent?.elementTarget;
    const el = A11yHelper.isFocusTarget(targetEl) && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationScheduler.from error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationScheduler.from error: 'duration' is not a positive number.`);
    }
    ease = getEasingFunc(ease, this.#getEaseOptions);
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationScheduler.from error: 'ease' is not a function or valid Svelte easing function name.`);
    }
    const initial = {};
    const destination = {};
    position.get(this.#data);
    transformOrigin = TJSTransforms.isTransformOrigin(transformOrigin) ? transformOrigin : void 0;
    const transformOriginInitial = transformOrigin !== void 0 ? this.#data.transformOrigin : void 0;
    for (const key in fromData) {
      const animKey = TJSPositionDataUtil.getAnimationKey(key);
      if (this.#data[animKey] !== void 0 && fromData[key] !== this.#data[animKey]) {
        initial[key] = fromData[key];
        destination[key] = this.#data[animKey];
      }
    }
    ConvertStringData.process(initial, this.#data, el);
    return this.#addAnimation(position, initial, destination, duration, el, cancelable, delay, ease, lerp, transformOrigin, transformOriginInitial, cleanup);
  }
  /**
   * Provides a tween from given position data to the given position.
   *
   * @param position - The target position instance.
   *
   * @param fromData - The starting position.
   *
   * @param toData - The ending position.
   *
   * @param options - Tween options.
   *
   * @param [cleanup] - Custom animation cleanup function.
   *
   * @returns An AnimationControl instance or null if none created.
   */
  static fromTo(position, fromData, toData, options = {}, cleanup) {
    if (!isObject(fromData)) {
      throw new TypeError(`AnimationScheduler.fromTo error: 'fromData' is not an object.`);
    }
    if (!isObject(toData)) {
      throw new TypeError(`AnimationScheduler.fromTo error: 'toData' is not an object.`);
    }
    const parent = position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return null;
    }
    let { cancelable = true, delay = 0, duration = 1, ease = "cubicOut", strategy, transformOrigin } = options;
    if (strategy !== void 0) {
      if (this.#handleStrategy(position, strategy) === null) {
        return null;
      }
    }
    const targetEl = A11yHelper.isFocusTarget(parent) ? parent : parent?.elementTarget;
    const el = A11yHelper.isFocusTarget(targetEl) && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationScheduler.fromTo error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationScheduler.fromTo error: 'duration' is not a positive number.`);
    }
    ease = getEasingFunc(ease, this.#getEaseOptions);
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationScheduler.fromTo error: 'ease' is not a function or valid Svelte easing function name.`);
    }
    const initial = {};
    const destination = {};
    position.get(this.#data);
    transformOrigin = TJSTransforms.isTransformOrigin(transformOrigin) ? transformOrigin : void 0;
    const transformOriginInitial = transformOrigin !== void 0 ? this.#data.transformOrigin : void 0;
    for (const key in fromData) {
      if (toData[key] === void 0) {
        console.warn(`AnimationScheduler.fromTo warning: skipping key ('${key}') from 'fromData' as it is missing in 'toData'.`);
        continue;
      }
      const animKey = TJSPositionDataUtil.getAnimationKey(key);
      if (this.#data[animKey] !== void 0) {
        initial[key] = fromData[key];
        destination[key] = toData[key];
      }
    }
    ConvertStringData.process(initial, this.#data, el);
    ConvertStringData.process(destination, this.#data, el);
    return this.#addAnimation(position, initial, destination, duration, el, cancelable, delay, ease, lerp, transformOrigin, transformOriginInitial, cleanup);
  }
  /**
   * Provides a tween to given position data from the current position.
   *
   * @param position - The target position instance.
   *
   * @param toData - The destination position.
   *
   * @param options - Tween options.
   *
   * @param [cleanup] - Custom animation cleanup function.
   *
   * @returns An AnimationControl instance or null if none created.
   */
  static to(position, toData, options, cleanup) {
    if (!isObject(toData)) {
      throw new TypeError(`AnimationScheduler.to error: 'toData' is not an object.`);
    }
    const parent = position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return null;
    }
    let { cancelable = true, delay = 0, duration = 1, ease = "cubicOut", strategy, transformOrigin } = options;
    if (strategy !== void 0) {
      if (this.#handleStrategy(position, strategy) === null) {
        return null;
      }
    }
    const targetEl = A11yHelper.isFocusTarget(parent) ? parent : parent?.elementTarget;
    const el = A11yHelper.isFocusTarget(targetEl) && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationScheduler.to error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationScheduler.to error: 'duration' is not a positive number.`);
    }
    ease = getEasingFunc(ease, this.#getEaseOptions);
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationScheduler.to error: 'ease' is not a function or valid Svelte easing function name.`);
    }
    const initial = {};
    const destination = {};
    position.get(this.#data);
    transformOrigin = TJSTransforms.isTransformOrigin(transformOrigin) ? transformOrigin : void 0;
    const transformOriginInitial = transformOrigin !== void 0 ? this.#data.transformOrigin : void 0;
    for (const key in toData) {
      const animKey = TJSPositionDataUtil.getAnimationKey(key);
      if (this.#data[animKey] !== void 0 && toData[key] !== this.#data[animKey]) {
        destination[key] = toData[key];
        initial[key] = this.#data[animKey];
      }
    }
    ConvertStringData.process(destination, this.#data, el);
    return this.#addAnimation(position, initial, destination, duration, el, cancelable, delay, ease, lerp, transformOrigin, transformOriginInitial, cleanup);
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Handle any defined scheduling strategy allowing existing scheduled animations for the same position instance
   * to be controlled.
   *
   * @param position - The target position instance.
   *
   * @param strategy - A scheduling strategy to apply.
   *
   * @returns Returns null to abort scheduling current animation.
   */
  static #handleStrategy(position, strategy) {
    switch (strategy) {
      case "cancel":
        if (AnimationManager.isScheduled(position)) {
          AnimationManager.cancel(position);
        }
        break;
      case "cancelAll":
        if (AnimationManager.isScheduled(position)) {
          AnimationManager.cancel(position, AnimationManager.cancelAllFn);
        }
        break;
      case "exclusive":
        if (AnimationManager.isScheduled(position)) {
          return null;
        }
        break;
      default:
        console.warn(`AnimationScheduler error: 'strategy' is not 'cancel', 'cancelAll', or 'exclusive'.`);
        return null;
    }
  }
}
class AnimationAPIImpl {
  static #getEaseOptions = Object.freeze({ default: false });
  /**
   */
  #data;
  #position;
  /**
   * @param position -
   *
   * @param data -
   */
  constructor(position, data) {
    this.#position = position;
    this.#data = data;
    Object.seal(this);
  }
  /**
   * Returns if there are scheduled animations whether active or pending for this TJSPosition instance.
   *
   * @returns Are there scheduled animations.
   */
  get isScheduled() {
    return AnimationManager.isScheduled(this.#position);
  }
  /**
   * Cancels all animation instances for this TJSPosition instance.
   */
  cancel() {
    AnimationManager.cancel(this.#position, AnimationManager.cancelAllFn);
  }
  /**
   * Returns all currently scheduled AnimationControl instances for this TJSPosition instance.
   *
   * @returns All currently scheduled animation controls for this TJSPosition instance.
   */
  getScheduled() {
    return AnimationManager.getScheduled(this.#position);
  }
  /**
   * Provides a tween from given position data to the current position.
   *
   * @param fromData - The starting position.
   *
   * @param [options] - Optional tween parameters.
   *
   * @returns A control object that can cancel animation and provides a `finished` Promise.
   */
  from(fromData, options) {
    const animationControl = AnimationScheduler.from(this.#position, fromData, options);
    return animationControl ? animationControl : AnimationControl.voidControl;
  }
  /**
   * Provides a tween from given position data to the given position.
   *
   * @param fromData - The starting position.
   *
   * @param toData - The ending position.
   *
   * @param [options] - Optional tween parameters.
   *
   * @returns A control object that can cancel animation and provides a `finished` Promise.
   */
  fromTo(fromData, toData, options) {
    const animationControl = AnimationScheduler.fromTo(this.#position, fromData, toData, options);
    return animationControl ? animationControl : AnimationControl.voidControl;
  }
  /**
   * Provides a tween to given position data from the current position.
   *
   * @param toData - The destination position.
   *
   * @param [options] - Optional tween parameters.
   *
   * @returns A control object that can cancel animation and provides a `finished` Promise.
   */
  to(toData, options) {
    const animationControl = AnimationScheduler.to(this.#position, toData, options);
    return animationControl ? animationControl : AnimationControl.voidControl;
  }
  /**
   * Returns a function that provides an optimized way to constantly update a to-tween.
   *
   * @param keys - The keys for quickTo.
   *
   * @param [options] - Optional quick tween parameters.
   *
   * @returns quick-to tween function.
   */
  quickTo(keys, options = {}) {
    if (!isIterable(keys)) {
      throw new TypeError(`AnimationAPI.quickTo error: 'keys' is not an iterable list.`);
    }
    const parent = this.#position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      throw new Error(`AnimationAPI.quickTo error: 'parent' is not positionable.`);
    }
    let { duration = 1, ease = "cubicOut" } = options;
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.quickTo error: 'duration' is not a positive number.`);
    }
    ease = getEasingFunc(ease, AnimationAPIImpl.#getEaseOptions);
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.quickTo error: 'ease' is not a function or valid Svelte easing function name.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key of keys) {
      if (typeof key !== "string") {
        throw new TypeError(`AnimationAPI.quickTo error: key ('${key}') is not a string.`);
      }
      if (!TJSPositionDataUtil.isAnimationKey(key)) {
        throw new Error(`AnimationAPI.quickTo error: key ('${key}') is not animatable.`);
      }
      const value = TJSPositionDataUtil.getDataOrDefault(data, key);
      if (value !== null) {
        destination[key] = value;
        initial[key] = value;
      }
    }
    const keysArray = [...keys];
    Object.freeze(keysArray);
    const newData = Object.assign({}, initial);
    const animationData = {
      active: true,
      cancelable: true,
      cancelled: false,
      control: void 0,
      current: 0,
      destination,
      duration: duration * 1e3,
      // Internally the AnimationManager works in ms.
      ease,
      el: void 0,
      finished: true,
      // Note: start in finished state to add to AnimationManager on first callback.
      initial,
      interpolate: lerp,
      keys: keysArray,
      newData,
      position: this.#position,
      resolve: void 0,
      start: 0,
      quickTo: true
    };
    const quickToCB = (...args) => {
      const argsLength = args.length;
      if (argsLength === 0) {
        return;
      }
      for (let cntr = keysArray.length; --cntr >= 0; ) {
        const key = keysArray[cntr];
        const animKey = TJSPositionDataUtil.getAnimationKey(key);
        if (data[animKey] !== void 0) {
          initial[key] = data[animKey];
        }
      }
      if (isObject(args[0])) {
        const objData = args[0];
        for (const key in objData) {
          if (destination[key] !== void 0) {
            destination[key] = objData[key];
          }
        }
      } else {
        for (let cntr = 0; cntr < argsLength && cntr < keysArray.length; cntr++) {
          const key = keysArray[cntr];
          if (destination[key] !== void 0) {
            destination[key] = args[cntr];
          }
        }
      }
      TJSPositionDataUtil.setNumericDefaults(initial);
      TJSPositionDataUtil.setNumericDefaults(destination);
      const targetEl = A11yHelper.isFocusTarget(parent) ? parent : parent?.elementTarget;
      animationData.el = A11yHelper.isFocusTarget(targetEl) && targetEl.isConnected ? targetEl : void 0;
      ConvertStringData.process(destination, data, animationData.el);
      if (animationData.finished) {
        animationData.cancelled = false;
        animationData.finished = false;
        animationData.active = true;
        animationData.current = 0;
        AnimationManager.add(animationData);
      } else {
        const now2 = globalThis.performance.now();
        animationData.cancelled = false;
        animationData.current = 0;
        animationData.start = now2 + (AnimationManager.timeNow - now2);
      }
    };
    Object.defineProperty(quickToCB, "keys", {
      value: keysArray,
      writable: false,
      configurable: false
    });
    Object.defineProperty(quickToCB, "options", {
      value: (optionsCB) => {
        let { duration: duration2, ease: ease2 } = optionsCB;
        if (duration2 !== void 0 && (!Number.isFinite(duration2) || duration2 < 0)) {
          throw new TypeError(`AnimationAPI.quickTo.options error: 'duration' is not a positive number.`);
        }
        ease2 = getEasingFunc(ease2, AnimationAPIImpl.#getEaseOptions);
        if (ease2 !== void 0 && typeof ease2 !== "function") {
          throw new TypeError(`AnimationAPI.quickTo.options error: 'ease' is not a function or valid Svelte easing function name.`);
        }
        if (NumberGuard.isFinite(duration2) && duration2 >= 0) {
          animationData.duration = duration2 * 1e3;
        }
        if (ease2) {
          animationData.ease = ease2;
        }
        return quickToCB;
      },
      writable: false,
      configurable: false
    });
    return quickToCB;
  }
}
class AnimationGroupControl {
  /**
   */
  #animationControls;
  /**
   */
  #finishedPromise;
  /**
   * Defines a static empty / void animation control.
   */
  static #voidControl = new AnimationGroupControl(null);
  /**
   * Provides a static void / undefined AnimationGroupControl that is automatically resolved.
   */
  static get voidControl() {
    return this.#voidControl;
  }
  /**
   * @param animationControls - A Set of AnimationControl instances.
   */
  constructor(animationControls) {
    this.#animationControls = animationControls;
  }
  /**
   * Get a promise that resolves when all animations are finished.
   *
   * @returns Finished Promise for all animations.
   */
  get finished() {
    const animationControls = this.#animationControls;
    if (!CrossWindow.isPromise(this.#finishedPromise)) {
      if (animationControls === null || animationControls === void 0 || animationControls.size === 0) {
        this.#finishedPromise = Promise.resolve({ cancelled: false });
      } else {
        const promises = [];
        for (const animationControl of animationControls) {
          promises.push(animationControl.finished);
        }
        this.#finishedPromise = Promise.allSettled(promises).then((results) => {
          const anyCancelled = results.some((result) => result.status === "rejected" || result.status === "fulfilled" && result.value.cancelled);
          return { cancelled: anyCancelled };
        });
      }
    }
    return this.#finishedPromise;
  }
  /**
   * Returns whether there are active animation instances for this group.
   *
   * Note: a delayed animation may not be started / active yet. Use {@link AnimationGroupControl.isFinished} to
   * determine if all animations in the group are finished.
   *
   * @returns Are there active animation instances.
   */
  get isActive() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0 || animationControls.size === 0) {
      return false;
    }
    for (const animationControl of animationControls) {
      if (animationControl.isActive) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns whether all animations in the group are finished.
   *
   * @returns Are all animation instances finished.
   */
  get isFinished() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0 || animationControls.size === 0) {
      return true;
    }
    for (const animationControl of animationControls) {
      if (!animationControl.isFinished) {
        return false;
      }
    }
    return true;
  }
  /**
   * Cancels the all animations.
   */
  cancel() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0 || animationControls.size === 0) {
      return;
    }
    for (const animationControl of animationControls) {
      animationControl.cancel();
    }
  }
}
class AnimationGroupAPIImpl {
  constructor() {
  }
  /**
   * Returns the TJSPosition instance for the possible given positionable by checking the instance by checking for
   * AnimationAPI.
   *
   * @param positionable - Possible position group entry.
   *
   * @returns Returns actual TJSPosition instance.
   */
  static #getPosition(positionable) {
    if (!isObject(positionable)) {
      return null;
    }
    if (positionable.animate instanceof AnimationAPIImpl) {
      return positionable;
    }
    if (positionable.position?.animate instanceof AnimationAPIImpl) {
      return positionable.position;
    }
    return null;
  }
  /**
   * Cancels any animation for given TJSPosition.PositionGroup data.
   *
   * @param positionGroup - The position group to cancel.
   */
  static cancel(positionGroup) {
    if (isIterable(positionGroup)) {
      let index = -1;
      for (const entry of positionGroup) {
        index++;
        const actualPosition = this.#getPosition(entry);
        if (!actualPosition) {
          console.warn(`AnimationGroupAPI.cancel warning: No TJSPosition instance found at index: ${index}.`);
          continue;
        }
        AnimationManager.cancel(actualPosition);
      }
    } else {
      const actualPosition = this.#getPosition(positionGroup);
      if (!actualPosition) {
        console.warn(`AnimationGroupAPI.cancel warning: No TJSPosition instance found.`);
        return;
      }
      AnimationManager.cancel(actualPosition);
    }
  }
  /**
   * Cancels all TJSPosition animation.
   */
  static cancelAll() {
    AnimationManager.cancelAll();
  }
  /**
   * Gets all animation controls for the given position group data.
   *
   * @param positionGroup - A position group.
   *
   * @returns Results array.
   */
  static getScheduled(positionGroup) {
    const results = [];
    if (isIterable(positionGroup)) {
      let index = -1;
      for (const entry of positionGroup) {
        index++;
        const actualPosition = this.#getPosition(entry);
        if (!actualPosition) {
          console.warn(`AnimationGroupAPI.getScheduled warning: No TJSPosition instance found at index: ${index}.`);
          continue;
        }
        const controls = AnimationManager.getScheduled(actualPosition);
        results.push({
          position: actualPosition,
          entry: actualPosition !== entry ? entry : void 0,
          controls
        });
      }
    } else {
      const actualPosition = this.#getPosition(positionGroup);
      if (!actualPosition) {
        console.warn(`AnimationGroupAPI.getScheduled warning: No TJSPosition instance found.`);
        return results;
      }
      const controls = AnimationManager.getScheduled(actualPosition);
      results.push({
        position: actualPosition,
        entry: actualPosition !== positionGroup ? positionGroup : void 0,
        controls
      });
    }
    return results;
  }
  /**
   * Provides a type guard to test in the given key is an {@link AnimationAPIImpl.AnimationKey}.
   *
   * @param key - A key value to test.
   *
   * @returns Whether the given key is an animation key.
   */
  static isAnimationKey(key) {
    return TJSPositionDataUtil.isAnimationKey(key);
  }
  /**
   * Returns the status _for the entire position group_ specified if all position instances of the group are scheduled.
   *
   * @param positionGroup - A position group.
   *
   * @param [options] - Options.
   *
   * @returns True if all are scheduled / false if just one position instance in the group is not scheduled.
   */
  static isScheduled(positionGroup, options) {
    if (isIterable(positionGroup)) {
      let index = -1;
      for (const entry of positionGroup) {
        index++;
        const actualPosition = this.#getPosition(entry);
        if (!actualPosition) {
          console.warn(`AnimationGroupAPI.isScheduled warning: No TJSPosition instance found at index: ${index}.`);
          continue;
        }
        if (!AnimationManager.isScheduled(actualPosition, options)) {
          return false;
        }
      }
    } else {
      const actualPosition = this.#getPosition(positionGroup);
      if (!actualPosition) {
        console.warn(`AnimationGroupAPI.isScheduled warning: No TJSPosition instance found.`);
        return false;
      }
      if (!AnimationManager.isScheduled(actualPosition, options)) {
        return false;
      }
    }
    return true;
  }
  /**
   * Provides the `from` animation tween for one or more positionable instances as a group.
   *
   * @param positionGroup - A position group.
   *
   * @param fromData - A position data object assigned to all positionable instances or a callback function invoked for
   *        unique data for each instance.
   *
   * @param [options] - Tween options assigned to all positionable instances or a callback function invoked for unique
   *        options for each instance.
   *
   * @returns Basic animation control.
   */
  static from(positionGroup, fromData, options) {
    if (!isObject(fromData) && typeof fromData !== "function") {
      throw new TypeError(`AnimationGroupAPI.from error: 'fromData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.from error: 'options' is not an object or function.`);
    }
    const animationControls = /* @__PURE__ */ new Set();
    const cleanupFn = (data) => animationControls.delete(data.control);
    let index = -1;
    let callbackOptions;
    const hasDataCallback = typeof fromData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasDataCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, entry: void 0 };
    }
    let actualFromData = fromData;
    let actualOptions = isObject(options) ? options : void 0;
    if (isIterable(positionGroup)) {
      for (const entry of positionGroup) {
        index++;
        const actualPosition = this.#getPosition(entry);
        if (!actualPosition) {
          console.warn(`AnimationGroupAPI.from warning: No TJSPosition instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = actualPosition;
          callbackOptions.entry = actualPosition !== entry ? entry : void 0;
        }
        if (hasDataCallback && typeof fromData === "function") {
          actualFromData = fromData(callbackOptions);
          if (actualFromData === null || actualFromData === void 0) {
            continue;
          }
          if (!isObject(actualFromData)) {
            throw new TypeError(`AnimationGroupAPI.from error: 'fromData' callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback && typeof options === "function") {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (!isObject(actualOptions)) {
            throw new TypeError(`AnimationGroupAPI.from error: 'options' callback function iteration(${index}) failed to return an object.`);
          }
        }
        const animationControl = AnimationScheduler.from(actualPosition, actualFromData, actualOptions, cleanupFn);
        if (animationControl) {
          animationControls.add(animationControl);
        }
      }
    } else {
      const actualPosition = this.#getPosition(positionGroup);
      if (!actualPosition) {
        console.warn(`AnimationGroupAPI.from warning: No TJSPosition instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = actualPosition;
        callbackOptions.entry = actualPosition !== positionGroup ? positionGroup : void 0;
      }
      if (hasDataCallback && typeof fromData === "function") {
        actualFromData = fromData(callbackOptions);
        if (actualFromData === null || actualFromData === void 0) {
          return AnimationGroupControl.voidControl;
        }
        if (!isObject(actualFromData)) {
          throw new TypeError(`AnimationGroupAPI.from error: 'fromData' callback function failed to return an object.`);
        }
      }
      if (hasOptionCallback && typeof options === "function") {
        actualOptions = options(callbackOptions);
        if (actualOptions === null || actualOptions === void 0) {
          return AnimationGroupControl.voidControl;
        }
        if (!isObject(actualOptions)) {
          throw new TypeError(`AnimationGroupAPI.from error: 'options' callback function failed to return an object.`);
        }
      }
      const animationControl = AnimationScheduler.from(actualPosition, actualFromData, actualOptions, cleanupFn);
      if (animationControl) {
        animationControls.add(animationControl);
      }
    }
    return new AnimationGroupControl(animationControls);
  }
  /**
   * Provides the `fromTo` animation tween for one or more positionable instances as a group.
   *
   * @param positionGroup - A position group.
   *
   * @param fromData - A position data object assigned to all positionable instances or a callback function invoked for
   *        unique data for each instance.
   *
   * @param toData - A position data object assigned to all positionable instances or a callback function invoked for
   *        unique data for each instance.
   *
   * @param [options] - Tween options assigned to all positionable instances or a callback function invoked for unique
   *        options for each instance.
   *
   * @returns Basic animation control.
   */
  static fromTo(positionGroup, fromData, toData, options) {
    if (!isObject(fromData) && typeof fromData !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'fromData' is not an object or function.`);
    }
    if (!isObject(toData) && typeof toData !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'toData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'options' is not an object or function.`);
    }
    const animationControls = /* @__PURE__ */ new Set();
    const cleanupFn = (data) => animationControls.delete(data.control);
    let index = -1;
    let callbackOptions;
    const hasFromCallback = typeof fromData === "function";
    const hasToCallback = typeof toData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasFromCallback || hasToCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, entry: void 0 };
    }
    let actualFromData = fromData;
    let actualToData = toData;
    let actualOptions = isObject(options) ? options : void 0;
    if (isIterable(positionGroup)) {
      for (const entry of positionGroup) {
        index++;
        const actualPosition = this.#getPosition(entry);
        if (!actualPosition) {
          console.warn(`AnimationGroupAPI.fromTo warning: No TJSPosition instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = actualPosition;
          callbackOptions.entry = actualPosition !== entry ? entry : void 0;
        }
        if (hasFromCallback && typeof fromData === "function") {
          actualFromData = fromData(callbackOptions);
          if (actualFromData === null || actualFromData === void 0) {
            continue;
          }
          if (!isObject(actualFromData)) {
            throw new TypeError(`AnimationGroupAPI.fromTo error: 'fromData' callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasToCallback && typeof toData === "function") {
          actualToData = toData(callbackOptions);
          if (actualToData === null || actualToData === void 0) {
            continue;
          }
          if (!isObject(actualToData)) {
            throw new TypeError(`AnimationGroupAPI.fromTo error: 'toData' callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback && typeof options === "function") {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (!isObject(actualOptions)) {
            throw new TypeError(`AnimationGroupAPI.fromTo error: 'options' callback function iteration(${index}) failed to return an object.`);
          }
        }
        const animationControl = AnimationScheduler.fromTo(actualPosition, actualFromData, actualToData, actualOptions, cleanupFn);
        if (animationControl) {
          animationControls.add(animationControl);
        }
      }
    } else {
      const actualPosition = this.#getPosition(positionGroup);
      if (!actualPosition) {
        console.warn(`AnimationGroupAPI.fromTo warning: No TJSPosition instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = actualPosition;
        callbackOptions.entry = actualPosition !== positionGroup ? positionGroup : void 0;
      }
      if (hasFromCallback && typeof fromData === "function") {
        actualFromData = fromData(callbackOptions);
        if (actualFromData === null || actualFromData === void 0) {
          return AnimationGroupControl.voidControl;
        }
        if (!isObject(actualFromData)) {
          throw new TypeError(`AnimationGroupAPI.fromTo error: 'fromData' callback function failed to return an object.`);
        }
      }
      if (hasToCallback && typeof toData === "function") {
        actualToData = toData(callbackOptions);
        if (actualToData === null || actualToData === void 0) {
          return AnimationGroupControl.voidControl;
        }
        if (!isObject(actualToData)) {
          throw new TypeError(`AnimationGroupAPI.fromTo error: 'toData' callback function failed to return an object.`);
        }
      }
      if (hasOptionCallback && typeof options === "function") {
        actualOptions = options(callbackOptions);
        if (actualOptions === null || actualOptions === void 0) {
          return AnimationGroupControl.voidControl;
        }
        if (!isObject(actualOptions)) {
          throw new TypeError(`AnimationGroupAPI.fromTo error: 'options' callback function failed to return an object.`);
        }
      }
      const animationControl = AnimationScheduler.fromTo(actualPosition, actualFromData, actualToData, actualOptions, cleanupFn);
      if (animationControl) {
        animationControls.add(animationControl);
      }
    }
    return new AnimationGroupControl(animationControls);
  }
  /**
   * Provides the `to` animation tween for one or more positionable instances as a group.
   *
   * @param positionGroup - A position group.
   *
   * @param toData - A position data object assigned to all positionable instances or a callback function invoked for
   *        unique data for each instance.
   *
   * @param [options] - Tween options assigned to all positionable instances or a callback function invoked for unique
   *        options for each instance.
   *
   * @returns Basic animation control.
   */
  static to(positionGroup, toData, options) {
    if (!isObject(toData) && typeof toData !== "function") {
      throw new TypeError(`AnimationGroupAPI.to error: 'toData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.to error: 'options' is not an object or function.`);
    }
    const animationControls = /* @__PURE__ */ new Set();
    const cleanupFn = (data) => animationControls.delete(data.control);
    let index = -1;
    let callbackOptions;
    const hasDataCallback = typeof toData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasDataCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, entry: void 0 };
    }
    let actualToData = toData;
    let actualOptions = isObject(options) ? options : void 0;
    if (isIterable(positionGroup)) {
      for (const entry of positionGroup) {
        index++;
        const actualPosition = this.#getPosition(entry);
        if (!actualPosition) {
          console.warn(`AnimationGroupAPI.to warning: No TJSPosition instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = actualPosition;
          callbackOptions.entry = actualPosition !== entry ? entry : void 0;
        }
        if (hasDataCallback && typeof toData === "function") {
          actualToData = toData(callbackOptions);
          if (actualToData === null || actualToData === void 0) {
            continue;
          }
          if (!isObject(actualToData)) {
            throw new TypeError(`AnimationGroupAPI.to error: 'toData' callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback && typeof options === "function") {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (!isObject(actualOptions)) {
            throw new TypeError(`AnimationGroupAPI.to error: 'options' callback function iteration(${index}) failed to return an object.`);
          }
        }
        const animationControl = AnimationScheduler.to(actualPosition, actualToData, actualOptions, cleanupFn);
        if (animationControl) {
          animationControls.add(animationControl);
        }
      }
    } else {
      const actualPosition = this.#getPosition(positionGroup);
      if (!actualPosition) {
        console.warn(`AnimationGroupAPI.to warning: No TJSPosition instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = actualPosition;
        callbackOptions.entry = actualPosition !== positionGroup ? positionGroup : void 0;
      }
      if (hasDataCallback && typeof toData === "function") {
        actualToData = toData(callbackOptions);
        if (actualToData === null || actualToData === void 0) {
          return AnimationGroupControl.voidControl;
        }
        if (!isObject(actualToData)) {
          throw new TypeError(`AnimationGroupAPI.to error: 'toData' callback function failed to return an object.`);
        }
      }
      if (hasOptionCallback && typeof options === "function") {
        actualOptions = options(callbackOptions);
        if (actualOptions === null || actualOptions === void 0) {
          return AnimationGroupControl.voidControl;
        }
        if (!isObject(actualOptions)) {
          throw new TypeError(`AnimationGroupAPI.to error: 'options' callback function failed to return an object.`);
        }
      }
      const animationControl = AnimationScheduler.to(actualPosition, actualToData, actualOptions, cleanupFn);
      if (animationControl) {
        animationControls.add(animationControl);
      }
    }
    return new AnimationGroupControl(animationControls);
  }
  /**
   * Provides the `quickTo` animation tweening function for one or more positionable instances as a group.
   *
   * @param positionGroup - A position group.
   *
   * @param keys - Animation keys to target.
   *
   * @param [options] - Quick tween options assigned to all positionable instances or a callback function invoked for
   *        unique options for each instance.
   *
   * @returns quick-to tween function.
   */
  static quickTo(positionGroup, keys, options) {
    if (!isIterable(keys)) {
      throw new TypeError(`AnimationGroupAPI.quickTo error: 'keys' is not an iterable list.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' is not an object or function.`);
    }
    const quickToCallbacks = [];
    let index = -1;
    const hasOptionCallback = typeof options === "function";
    const callbackOptions = { index, position: void 0, entry: void 0 };
    let actualOptions = isObject(options) ? options : void 0;
    if (isIterable(positionGroup)) {
      for (const entry of positionGroup) {
        index++;
        const actualPosition = this.#getPosition(entry);
        if (!actualPosition) {
          console.warn(`AnimationGroupAPI.quickTo warning: No TJSPosition instance found at index: ${index}.`);
          continue;
        }
        callbackOptions.index = index;
        callbackOptions.position = actualPosition;
        callbackOptions.entry = actualPosition !== entry ? entry : void 0;
        if (hasOptionCallback && typeof options === "function") {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (!isObject(actualOptions)) {
            throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' callback function iteration(${index}) failed to return an object.`);
          }
        }
        quickToCallbacks.push(actualPosition.animate.quickTo(keys, actualOptions));
      }
    } else {
      const actualPosition = this.#getPosition(positionGroup);
      if (!actualPosition) {
        console.warn(`AnimationGroupAPI.quickTo warning: No TJSPosition instance found.`);
        return;
      }
      callbackOptions.index = 0;
      callbackOptions.position = actualPosition;
      callbackOptions.entry = actualPosition !== positionGroup ? positionGroup : void 0;
      if (hasOptionCallback && typeof options === "function") {
        actualOptions = options(callbackOptions);
        if (actualOptions === null || actualOptions === void 0) {
          return;
        }
        if (!isObject(actualOptions)) {
          throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' callback function failed to return an object.`);
        }
      }
      quickToCallbacks.push(actualPosition.animate.quickTo(keys, actualOptions));
    }
    const keysArray = [...keys];
    Object.freeze(keysArray);
    const quickToCB = (...args) => {
      const argsLength = args.length;
      if (argsLength === 0) {
        return;
      }
      if (typeof args[0] === "function") {
        const dataCallback = args[0];
        index = -1;
        let cntr = 0;
        if (isIterable(positionGroup)) {
          for (const entry of positionGroup) {
            index++;
            const actualPosition = this.#getPosition(entry);
            if (!actualPosition) {
              continue;
            }
            callbackOptions.index = index;
            callbackOptions.position = actualPosition;
            callbackOptions.entry = actualPosition !== entry ? entry : void 0;
            const toData = dataCallback(callbackOptions);
            if (toData === null || toData === void 0) {
              continue;
            }
            const toDataIterable = isIterable(toData);
            if (!Number.isFinite(toData) && !toDataIterable && !isObject(toData)) {
              throw new TypeError(`AnimationGroupAPI.quickTo error: 'toData' callback function iteration(${index}) failed to return a finite number, iterable list, or object.`);
            }
            if (toDataIterable) {
              quickToCallbacks[cntr++](...toData);
            } else {
              quickToCallbacks[cntr++](toData);
            }
          }
        } else {
          const actualPosition = this.#getPosition(positionGroup);
          if (!actualPosition) {
            return;
          }
          callbackOptions.index = 0;
          callbackOptions.position = actualPosition;
          callbackOptions.entry = actualPosition !== positionGroup ? positionGroup : void 0;
          const toData = dataCallback(callbackOptions);
          if (toData === null || toData === void 0) {
            return;
          }
          const toDataIterable = isIterable(toData);
          if (!Number.isFinite(toData) && !toDataIterable && !isObject(toData)) {
            throw new TypeError(`AnimationGroupAPI.quickTo error: 'toData' callback function iteration(${index}) failed to return a finite number, iterable list, or object.`);
          }
          if (toDataIterable) {
            quickToCallbacks[cntr++](...toData);
          } else {
            quickToCallbacks[cntr++](toData);
          }
        }
      } else {
        for (let cntr = quickToCallbacks.length; --cntr >= 0; ) {
          quickToCallbacks[cntr](...args);
        }
      }
    };
    Object.defineProperty(quickToCB, "keys", {
      value: keysArray,
      writable: false,
      configurable: false
    });
    Object.defineProperty(quickToCB, "options", {
      /**
       * Sets options of quickTo tween.
       * @param options -
       */
      value: (options2) => {
        if (options2 !== void 0 && !isObject(options2)) {
          throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' is not an object.`);
        }
        if (isObject(options2)) {
          for (let cntr = quickToCallbacks.length; --cntr >= 0; ) {
            quickToCallbacks[cntr].options(options2);
          }
        }
        return quickToCB;
      },
      writable: false,
      configurable: false
    });
    return quickToCB;
  }
}
Object.seal(AnimationGroupAPIImpl);
class PositionStateAPI {
  /**
   */
  #data;
  /**
   */
  #dataSaved = /* @__PURE__ */ new Map();
  /**
   */
  #position;
  /**
   */
  #transforms;
  constructor(position, data, transforms) {
    this.#position = position;
    this.#data = data;
    this.#transforms = transforms;
    Object.seal(this);
  }
  /**
   * Clears all saved position data except any default state.
   */
  clear() {
    for (const key of this.#dataSaved.keys()) {
      if (key !== "#defaultData") {
        this.#dataSaved.delete(key);
      }
    }
  }
  /**
   * Returns any stored save state by name.
   *
   * @param options - Options.
   *
   * @param options.name - Saved data name.
   *
   * @returns Any saved position data.
   */
  get({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`TJSPosition - get error: 'name' is not a string.`);
    }
    return this.#dataSaved.get(name);
  }
  /**
   * Returns any associated default position data.
   *
   * @returns Any saved default position data.
   */
  getDefault() {
    return this.#dataSaved.get("#defaultData");
  }
  /**
   * @returns The saved position data names / keys.
   */
  keys() {
    return this.#dataSaved.keys();
  }
  /**
   * Removes and returns any position data by name.
   *
   * @param options - Options.
   *
   * @param options.name - Name to remove and retrieve.
   *
   * @returns Any saved position data.
   */
  remove({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`TJSPosition - remove: 'name' is not a string.`);
    }
    const data = this.#dataSaved.get(name);
    this.#dataSaved.delete(name);
    return data;
  }
  /**
   * Resets position instance to default data and invokes set.
   *
   * @param [options] - Optional parameters.
   *
   * @param [options.keepZIndex=false] - When true keeps current z-index.
   *
   * @param [options.invokeSet=true] - When true invokes set method.
   *
   * @returns Operation successful.
   */
  reset({ keepZIndex = false, invokeSet = true } = {}) {
    const defaultData = this.#dataSaved.get("#defaultData");
    if (!isObject(defaultData)) {
      return false;
    }
    if (this.#position.animate.isScheduled) {
      this.#position.animate.cancel();
    }
    const zIndex = this.#position.zIndex;
    const data = Object.assign({}, defaultData);
    if (keepZIndex) {
      data.zIndex = zIndex;
    }
    this.#transforms.reset(data);
    const parent = this.#position.parent;
    if (parent?.reactive?.minimized) {
      parent?.maximize?.({ animate: false, duration: 0 });
    }
    if (invokeSet) {
      setTimeout(() => this.#position.set(data), 0);
    }
    return true;
  }
  /**
   * Restores a saved positional state returning the data. Several optional parameters are available to control
   * whether the restore action occurs silently (no store / inline styles updates), animates to the stored data, or
   * simply sets the stored data. Restoring via {@link AnimationAPI.to} allows specification of the duration and
   * easing along with configuring a Promise to be returned if awaiting the end of the animation.
   *
   * @param options - Parameters
   *
   * @param options.name - Saved data set name.
   *
   * @param [options.remove=false] - Deletes data set.
   *
   * @param [options.properties] - Specific properties to set / animate.
   *
   * @param [options.silent] - Set position data directly; no store or style updates.
   *
   * @param [options.async=false] - If animating return a Promise that resolves with any saved data.
   *
   * @param [options.animateTo=false] - Animate to restore data.
   *
   * @param [options.cancelable=true] - When false, any animation can not be cancelled.
   *
   * @param [options.duration=0.1] - Duration in seconds.
   *
   * @param [options.ease='linear'] - Easing function name or function.
   *
   * @returns Any saved position data.
   */
  restore({ name, remove = false, properties, silent = false, async = false, animateTo = false, cancelable = true, duration = 0.1, ease = "linear" }) {
    if (typeof name !== "string") {
      throw new TypeError(`TJSPosition - restore error: 'name' is not a string.`);
    }
    const dataSaved = this.#dataSaved.get(name);
    if (dataSaved) {
      if (remove) {
        this.#dataSaved.delete(name);
      }
      let data = dataSaved;
      if (isIterable(properties)) {
        data = {};
        for (const property of properties) {
          data[property] = dataSaved[property];
        }
      }
      if (silent) {
        for (const property in data) {
          if (property in this.#data) {
            this.#data[property] = data[property];
          }
        }
        return dataSaved;
      } else if (animateTo) {
        if (data.transformOrigin !== this.#position.transformOrigin) {
          this.#position.transformOrigin = data.transformOrigin;
        }
        if (async) {
          return this.#position.animate.to(data, { cancelable, duration, ease }).finished.then(() => dataSaved);
        } else {
          this.#position.animate.to(data, { cancelable, duration, ease });
        }
      } else {
        this.#position.set(data);
      }
    }
    return async ? Promise.resolve(dataSaved) : dataSaved;
  }
  /**
   * Saves current position state with the opportunity to add extra data to the saved state. Simply include extra
   * properties in `options` to save extra data.
   *
   * @param options - Options.
   *
   * @param options.name - name to index this saved data.
   *
   * @param [optionsGet] - Additional options for {@link TJSPosition.get} when serializing position state. By default,
   *        `nullable` values are included.
   *
   * @returns Current position data plus any extra data stored.
   */
  save({ name, ...extra }, optionsGet) {
    if (typeof name !== "string") {
      throw new TypeError(`TJSPosition - save error: 'name' is not a string.`);
    }
    const data = this.#position.get(extra, optionsGet);
    this.#dataSaved.set(name, data);
    return data;
  }
  /**
   * Directly sets a saved position state. Simply include extra properties in `options` to set extra data.
   *
   * @param opts - Options.
   *
   * @param opts.name - name to index this saved data.
   */
  set({ name, ...data }) {
    if (typeof name !== "string") {
      throw new TypeError(`TJSPosition - set error: 'name' is not a string.`);
    }
    this.#dataSaved.set(name, data);
  }
}
class SystemBase {
  /**
   * When true constrains the min / max width or height to element.
   */
  #constrain;
  /**
   */
  #element;
  /**
   * When true the validator is active.
   */
  #enabled;
  /**
   * Provides a manual setting of the element height. As things go `offsetHeight` causes a browser layout and is not
   * performance oriented. If manually set this height is used instead of `offsetHeight`.
   */
  #height;
  /**
   * Set from an optional value in the constructor to lock accessors preventing modification.
   */
  #lock;
  /**
   * Stores the subscribers.
   */
  #subscribers = [];
  /**
   * Provides a manual setting of the element width. As things go `offsetWidth` causes a browser layout and is not
   * performance oriented. If manually set this width is used instead of `offsetWidth`.
   */
  #width;
  /**
   * @param [options] - Initial options.
   *
   * @param [options.constrain=true] - Initial constrained state.
   *
   * @param [options.element] - Target element.
   *
   * @param [options.enabled=true] - Enabled state.
   *
   * @param [options.lock=false] - Lock parameters from being set.
   *
   * @param [options.width] - Manual width.
   *
   * @param [options.height] - Manual height.
   */
  constructor({ constrain = true, element: element2, enabled = true, lock = false, width, height } = {}) {
    this.#constrain = true;
    this.#enabled = true;
    this.constrain = constrain;
    this.element = element2;
    this.enabled = enabled;
    this.width = width;
    this.height = height;
    this.#lock = typeof lock === "boolean" ? lock : false;
  }
  /**
   * @returns The current constrain state.
   */
  get constrain() {
    return this.#constrain;
  }
  /**
   * @returns Target element.
   */
  get element() {
    return this.#element;
  }
  /**
   * @returns The current enabled state.
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * @returns Get manual height.
   */
  get height() {
    return this.#height;
  }
  /**
   * @return Get locked state.
   */
  get locked() {
    return this.#lock;
  }
  /**
   * @returns Get manual width.
   */
  get width() {
    return this.#width;
  }
  /**
   * @param constrain - New constrain state.
   */
  set constrain(constrain) {
    if (this.#lock) {
      return;
    }
    if (typeof constrain !== "boolean") {
      throw new TypeError(`'constrain' is not a boolean.`);
    }
    this.#constrain = constrain;
    this.#updateSubscribers();
  }
  /**
   * @param element - Set target element.
   */
  set element(element2) {
    if (this.#lock) {
      return;
    }
    if (element2 === void 0 || element2 === null || A11yHelper.isFocusTarget(element2)) {
      this.#element = element2;
    } else {
      throw new TypeError(`'element' is not a HTMLElement, undefined, or null.`);
    }
    this.#updateSubscribers();
  }
  /**
   * @param enabled - New enabled state.
   */
  set enabled(enabled) {
    if (this.#lock) {
      return;
    }
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
    this.#updateSubscribers();
  }
  /**
   * @param height - Set manual height.
   */
  set height(height) {
    if (this.#lock) {
      return;
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
    this.#updateSubscribers();
  }
  /**
   * @param width - Set manual width.
   */
  set width(width) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
    this.#updateSubscribers();
  }
  /**
   * Set manual width & height.
   *
   * @param width - New manual width.
   *
   * @param height - New manual height.
   */
  setDimension(width, height) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
    this.#updateSubscribers();
  }
  /**
   * @param handler - Callback function that is invoked on update / changes. Receives a copy of the TJSPositionData.
   *
   * @returns Unsubscribe function.
   */
  subscribe(handler) {
    const currentIdx = this.#subscribers.findIndex((entry) => entry === handler);
    if (currentIdx === -1) {
      this.#subscribers.push(handler);
      handler(this);
    }
    return () => {
      const existingIdx = this.#subscribers.findIndex((entry) => entry === handler);
      if (existingIdx !== -1) {
        this.#subscribers.splice(existingIdx, 1);
      }
    };
  }
  /**
   * Updates subscribers on changes.
   */
  #updateSubscribers() {
    for (let cntr = 0; cntr < this.#subscribers.length; cntr++) {
      this.#subscribers[cntr](this);
    }
  }
}
class Centered extends SystemBase {
  /**
   * Get the left constraint based on any manual target values or the browser inner width.
   *
   * @param width - Target width.
   *
   * @returns Calculated left constraint.
   */
  getLeft(width) {
    const boundsWidth = this.width ?? this.element?.offsetWidth ?? globalThis.innerWidth;
    return (boundsWidth - width) / 2;
  }
  /**
   * Get the top constraint based on any manual target values or the browser inner height.
   *
   * @param height - Target height.
   *
   * @returns Calculated top constraint.
   */
  getTop(height) {
    const boundsHeight = this.height ?? this.element?.offsetHeight ?? globalThis.innerHeight;
    return (boundsHeight - height) / 2;
  }
}
class AdapterValidators {
  /**
   */
  #enabled = true;
  /**
   */
  #validatorData;
  /**
   */
  #mapUnsubscribe = /* @__PURE__ */ new Map();
  #updateFn;
  /**
   * @returns Returns this and internal storage for validator adapter.
   */
  static create(updateFn) {
    const validatorAPI = new AdapterValidators(updateFn);
    return [validatorAPI, validatorAPI.#validatorData];
  }
  /**
   */
  constructor(updateFn) {
    this.#validatorData = [];
    this.#updateFn = updateFn;
    Object.seal(this);
  }
  /**
   * @returns Returns the enabled state.
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * @returns Returns the length of the validators array.
   */
  get length() {
    return this.#validatorData.length;
  }
  /**
   * @param enabled - Sets enabled state.
   */
  set enabled(enabled) {
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
  }
  /**
   * Provides an iterator for validators.
   *
   * @returns iterator.
   */
  *[Symbol.iterator]() {
    if (this.#validatorData.length === 0) {
      return;
    }
    for (const entry of this.#validatorData) {
      yield { ...entry };
    }
  }
  /**
   * Adds the given validators.
   *
   * @param validators - Validators to add.
   */
  add(...validators) {
    let subscribeCount = 0;
    for (const validator of validators) {
      const validatorType = typeof validator;
      if (validatorType !== "function" && validatorType !== "object" || validator === null) {
        throw new TypeError(`AdapterValidator error: 'validator' is not a function or object.`);
      }
      let data = void 0;
      let subscribeFn = void 0;
      switch (validatorType) {
        case "function":
          data = {
            id: void 0,
            validate: validator,
            weight: 1
          };
          subscribeFn = validator.subscribe;
          break;
        case "object":
          if ("validate" in validator) {
            if (typeof validator.validate !== "function") {
              throw new TypeError(`AdapterValidator error: 'validate' attribute is not a function.`);
            }
            if (validator.weight !== void 0 && typeof validator.weight !== "number" || (validator?.weight < 0 || validator?.weight > 1)) {
              throw new TypeError(`AdapterValidator error: 'weight' attribute is not a number between '0 - 1' inclusive.`);
            }
            data = {
              id: validator.id !== void 0 ? validator.id : void 0,
              validate: validator.validate.bind(validator),
              weight: validator.weight || 1
            };
            subscribeFn = validator.validate.subscribe ?? validator.subscribe;
          } else {
            throw new TypeError(`AdapterValidator error: 'validate' attribute is not a function.`);
          }
          break;
      }
      const index = this.#validatorData.findIndex((value) => data.weight < value.weight);
      if (index >= 0) {
        this.#validatorData.splice(index, 0, data);
      } else {
        this.#validatorData.push(data);
      }
      if (typeof subscribeFn === "function") {
        const unsubscribe = subscribeFn.call(validator, this.#updateFn);
        if (typeof unsubscribe !== "function") {
          throw new TypeError("AdapterValidator error: Validator has subscribe function, but no unsubscribe function is returned.");
        }
        if (this.#mapUnsubscribe.has(data.validate)) {
          throw new Error("AdapterValidator error: Validator added already has an unsubscribe function registered.");
        }
        this.#mapUnsubscribe.set(data.validate, unsubscribe);
        subscribeCount++;
      }
    }
    if (subscribeCount < validators.length) {
      this.#updateFn();
    }
  }
  /**
   * Clears / removes all validators.
   */
  clear() {
    this.#validatorData.length = 0;
    for (const unsubscribe of this.#mapUnsubscribe.values()) {
      unsubscribe();
    }
    this.#mapUnsubscribe.clear();
    this.#updateFn();
  }
  /**
   * Removes one or more given validators.
   *
   * @param validators - Validators to remove.
   */
  remove(...validators) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    for (const data of validators) {
      const actualValidator = typeof data === "function" ? data : isObject(data) ? data.validate : void 0;
      if (!actualValidator) {
        continue;
      }
      for (let cntr = this.#validatorData.length; --cntr >= 0; ) {
        if (this.#validatorData[cntr].validate === actualValidator) {
          this.#validatorData.splice(cntr, 1);
          let unsubscribe = void 0;
          if (typeof (unsubscribe = this.#mapUnsubscribe.get(actualValidator)) === "function") {
            unsubscribe();
            this.#mapUnsubscribe.delete(actualValidator);
          }
        }
      }
    }
    if (length !== this.#validatorData.length) {
      this.#updateFn();
    }
  }
  /**
   * Remove validators by the provided callback. The callback takes 3 parameters: `id`, `validator`, and `weight`.
   * Any truthy value returned will remove that validator.
   *
   * @param callback - Callback function to evaluate each validator entry.
   */
  removeBy(callback) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    if (typeof callback !== "function") {
      throw new TypeError(`AdapterValidator error: 'callback' is not a function.`);
    }
    this.#validatorData = this.#validatorData.filter((data) => {
      const remove = callback.call(callback, { ...data });
      if (remove) {
        let unsubscribe;
        if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.validate)) === "function") {
          unsubscribe();
          this.#mapUnsubscribe.delete(data.validate);
        }
      }
      return !remove;
    });
    if (length !== this.#validatorData.length) {
      this.#updateFn();
    }
  }
  /**
   * Removes any validators with matching IDs.
   *
   * @param ids - IDs to remove.
   */
  removeById(...ids) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    this.#validatorData = this.#validatorData.filter((data) => {
      let remove = false;
      for (const id of ids) {
        remove ||= data.id === id;
      }
      if (remove) {
        let unsubscribe;
        if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.validate)) === "function") {
          unsubscribe();
          this.#mapUnsubscribe.delete(data.validate);
        }
      }
      return !remove;
    });
    if (length !== this.#validatorData.length) {
      this.#updateFn();
    }
  }
}
class TransformBounds extends SystemBase {
  static #TRANSFORM_DATA = new TJSTransformData();
  /**
   * Provides a validator that respects transforms in positional data constraining the position to within the target
   * elements bounds.
   *
   * @param valData - The associated validation data for position updates.
   *
   * @returns Potentially adjusted position data.
   */
  validate(valData) {
    if (!this.enabled) {
      return valData.position;
    }
    const boundsWidth = this.width ?? this.element?.offsetWidth ?? globalThis.innerWidth;
    const boundsHeight = this.height ?? this.element?.offsetHeight ?? globalThis.innerHeight;
    if (typeof valData.position.width === "number") {
      const maxW = valData.maxWidth ?? (this.constrain ? boundsWidth : Number.MAX_SAFE_INTEGER);
      valData.position.width = clamp(valData.width, valData.minWidth, maxW);
    }
    if (typeof valData.position.height === "number") {
      const maxH = valData.maxHeight ?? (this.constrain ? boundsHeight : Number.MAX_SAFE_INTEGER);
      valData.position.height = clamp(valData.height, valData.minHeight, maxH);
    }
    const data = valData.transforms.getData(valData.position, TransformBounds.#TRANSFORM_DATA, valData);
    const initialX = data.boundingRect.x;
    const initialY = data.boundingRect.y;
    const marginTop = valData.marginTop ?? 0;
    const marginLeft = valData.marginLeft ?? 0;
    if (data.boundingRect.bottom + marginTop > boundsHeight) {
      data.boundingRect.y += boundsHeight - data.boundingRect.bottom - marginTop;
    }
    if (data.boundingRect.right + marginLeft > boundsWidth) {
      data.boundingRect.x += boundsWidth - data.boundingRect.right - marginLeft;
    }
    if (data.boundingRect.top - marginTop < 0) {
      data.boundingRect.y += Math.abs(data.boundingRect.top - marginTop);
    }
    if (data.boundingRect.left - marginLeft < 0) {
      data.boundingRect.x += Math.abs(data.boundingRect.left - marginLeft);
    }
    valData.position.left -= initialX - data.boundingRect.x;
    valData.position.top -= initialY - data.boundingRect.y;
    return valData.position;
  }
}
class PositionChangeSet {
  left;
  top;
  width;
  height;
  maxHeight;
  maxWidth;
  minHeight;
  minWidth;
  zIndex;
  transform;
  transformOrigin;
  constructor() {
    this.left = false;
    this.top = false;
    this.width = false;
    this.height = false;
    this.maxHeight = false;
    this.maxWidth = false;
    this.minHeight = false;
    this.minWidth = false;
    this.zIndex = false;
    this.transform = false;
    this.transformOrigin = false;
  }
  hasChange() {
    return this.left || this.top || this.width || this.height || this.maxHeight || this.maxWidth || this.minHeight || this.minWidth || this.zIndex || this.transform || this.transformOrigin;
  }
  set(value) {
    this.left = value;
    this.top = value;
    this.width = value;
    this.height = value;
    this.maxHeight = value;
    this.maxWidth = value;
    this.minHeight = value;
    this.minWidth = value;
    this.zIndex = value;
    this.transform = value;
    this.transformOrigin = value;
  }
}
class UpdateElementData {
  changeSet;
  data;
  dataSubscribers;
  dimensionData;
  options;
  queued;
  storeDimension;
  storeTransform;
  styleCache;
  subscribers;
  transforms;
  transformData;
  constructor(changeSet, data, options, styleCache, subscribers, transforms) {
    this.changeSet = changeSet;
    this.data = data;
    this.dataSubscribers = Object.seal(new TJSPositionData());
    this.dimensionData = Object.seal({ width: 0, height: 0 });
    this.options = options;
    this.queued = false;
    this.styleCache = styleCache;
    this.storeDimension = writable(this.dimensionData);
    this.subscribers = subscribers;
    this.transforms = transforms;
    this.transformData = new TJSTransformData();
    this.storeTransform = writable(this.transformData, () => {
      this.options.transformSubscribed = true;
      return () => this.options.transformSubscribed = false;
    });
  }
}
class UpdateElementManager {
  /**
   * Stores the active list of all TJSPosition instances currently updating. The list entries are recycled between
   * updates.
   */
  static list = [];
  /**
   * Tracks the current position in the list.
   */
  static listCntr = 0;
  static updatePromise;
  /**
   * Potentially adds the given element and internal updateData instance to the list.
   *
   * @param el - An HTMLElement instance.
   *
   * @param updateData - An UpdateElementData instance.
   *
   * @returns The unified next frame update promise. Returns `currentTime`.
   */
  static add(el, updateData) {
    if (this.listCntr < this.list.length) {
      const entry = this.list[this.listCntr];
      entry[0] = el;
      entry[1] = updateData;
    } else {
      this.list.push([el, updateData]);
    }
    this.listCntr++;
    updateData.queued = true;
    if (!this.updatePromise) {
      this.updatePromise = this.wait();
    }
    return this.updatePromise;
  }
  /**
   * Await on `nextAnimationFrame` and iterate over list map invoking callback functions.
   *
   * @returns The next frame Promise / currentTime from nextAnimationFrame.
   */
  static async wait() {
    const currentTime = await nextAnimationFrame();
    this.updatePromise = void 0;
    for (let cntr = this.listCntr; --cntr >= 0; ) {
      const entry = this.list[cntr];
      const el = entry[0];
      const updateData = entry[1];
      entry[0] = void 0;
      entry[1] = void 0;
      updateData.queued = false;
      if (updateData.options.ortho) {
        UpdateElementManager.#updateElementOrtho(el, updateData);
      } else {
        UpdateElementManager.#updateElement(el, updateData);
      }
      if (updateData.options.calculateTransform || updateData.options.transformSubscribed) {
        UpdateElementManager.#updateTransform(updateData);
      }
      this.updateSubscribers(updateData);
    }
    this.listCntr = 0;
    return currentTime;
  }
  /**
   * Potentially immediately updates the given element.
   *
   * @param el - An HTMLElement instance.
   *
   * @param updateData - An UpdateElementData instance.
   */
  static immediate(el, updateData) {
    if (updateData.options.ortho) {
      UpdateElementManager.#updateElementOrtho(el, updateData);
    } else {
      UpdateElementManager.#updateElement(el, updateData);
    }
    if (updateData.options.calculateTransform || updateData.options.transformSubscribed) {
      UpdateElementManager.#updateTransform(updateData);
    }
    this.updateSubscribers(updateData);
  }
  /**
   * @param updateData - Data change set.
   */
  static updateSubscribers(updateData) {
    const data = updateData.data;
    const changeSet = updateData.changeSet;
    if (!changeSet.hasChange()) {
      return;
    }
    const output = TJSPositionDataUtil.copyData(data, updateData.dataSubscribers);
    const subscribers = updateData.subscribers;
    if (subscribers.length > 0) {
      for (let cntr = 0; cntr < subscribers.length; cntr++) {
        subscribers[cntr](output);
      }
    }
    if (changeSet.width || changeSet.height) {
      updateData.dimensionData.width = data.width;
      updateData.dimensionData.height = data.height;
      updateData.storeDimension.set(updateData.dimensionData);
    }
    changeSet.set(false);
  }
  // Internal Implementation ----------------------------------------------------------------------------------------
  /**
   * Temporary data for validation.
   */
  static #validationData = Object.seal({
    height: 0,
    width: 0,
    marginLeft: 0,
    marginTop: 0
  });
  /**
   * Decouples updates to any parent target HTMLElement inline styles. Invoke {@link TJSPosition.elementUpdated} to
   * await on the returned promise that is resolved with the current render time via `nextAnimationFrame` /
   * `requestAnimationFrame`. This allows the underlying data model to be updated immediately while updates to the
   * element are in sync with the browser and potentially in the future be further throttled.
   *
   * @param el - The target HTMLElement.
   *
   * @param updateData - Update data.
   */
  static #updateElement(el, updateData) {
    const changeSet = updateData.changeSet;
    const data = updateData.data;
    if (changeSet.left) {
      el.style.left = `${data.left}px`;
    }
    if (changeSet.top) {
      el.style.top = `${data.top}px`;
    }
    if (changeSet.zIndex) {
      el.style.zIndex = typeof data.zIndex === "number" ? `${data.zIndex}` : "";
    }
    if (changeSet.width) {
      el.style.width = typeof data.width === "number" ? `${data.width}px` : data.width;
    }
    if (changeSet.height) {
      el.style.height = typeof data.height === "number" ? `${data.height}px` : data.height;
    }
    if (changeSet.transformOrigin) {
      el.style.transformOrigin = data.transformOrigin;
    }
    if (changeSet.transform) {
      el.style.transform = updateData.transforms.isActive ? updateData.transforms.getCSS() : "";
    }
  }
  /**
   * Decouples updates to any parent target HTMLElement inline styles. Invoke {@link TJSPosition.elementUpdated} to
   * await on the returned promise that is resolved with the current render time via `nextAnimationFrame` /
   * `requestAnimationFrame`. This allows the underlying data model to be updated immediately while updates to the
   * element are in sync with the browser and potentially in the future be further throttled.
   *
   * @param el - The target HTMLElement.
   *
   * @param updateData - Update data.
   */
  static #updateElementOrtho(el, updateData) {
    const changeSet = updateData.changeSet;
    const data = updateData.data;
    if (changeSet.zIndex) {
      el.style.zIndex = typeof data.zIndex === "number" ? `${data.zIndex}` : "";
    }
    if (changeSet.width) {
      el.style.width = typeof data.width === "number" ? `${data.width}px` : data.width;
    }
    if (changeSet.height) {
      el.style.height = typeof data.height === "number" ? `${data.height}px` : data.height;
    }
    if (changeSet.transformOrigin) {
      el.style.transformOrigin = data.transformOrigin;
    }
    if (changeSet.left || changeSet.top || changeSet.transform) {
      el.style.transform = updateData.transforms.getCSSOrtho(data);
    }
  }
  /**
   * Updates the applied transform data and sets the readable `transform` store.
   *
   * @param updateData - Update element data.
   */
  static #updateTransform(updateData) {
    const validationData = this.#validationData;
    validationData.height = updateData.data.height !== "auto" && updateData.data.height !== "inherit" ? updateData.data.height : updateData.styleCache.offsetHeight;
    validationData.width = updateData.data.width !== "auto" && updateData.data.width !== "inherit" ? updateData.data.width : updateData.styleCache.offsetWidth;
    validationData.marginLeft = updateData.styleCache.marginLeft;
    validationData.marginTop = updateData.styleCache.marginTop;
    updateData.transforms.getData(updateData.data, updateData.transformData, validationData);
    updateData.storeTransform.set(updateData.transformData);
  }
}
var _a;
class TJSPosition {
  /**
   * Public API for {@link TJSPosition.Initial}.
   */
  static #positionInitial = Object.freeze({
    browserCentered: new Centered({ lock: true }),
    Centered
  });
  /**
   * Public API for {@link TJSPosition.Validators}
   */
  static #positionValidators = Object.freeze({
    TransformBounds,
    transformWindow: new TransformBounds({ lock: true })
  });
  /**
   * Stores all position data / properties.
   */
  #data = Object.seal(new TJSPositionData());
  /**
   * Provides the animation API.
   */
  #animate = new AnimationAPIImpl(this, this.#data);
  /**
   * Provides a way to turn on / off the position handling.
   */
  #enabled = true;
  /**
   * Stores ongoing options that are set in the constructor or by transform store subscription.
   */
  #options = {
    calculateTransform: false,
    initial: void 0,
    ortho: true,
    transformSubscribed: false
  };
  /**
   * The associated parent for positional data tracking. Used in validators.
   */
  #parent;
  /**
   * Stores the style attributes that changed on update.
   */
  #positionChangeSet = new PositionChangeSet();
  /**
   * Tracks the current state if this position instance is a candidate for resize observation by the `resizeObserver`
   * action. This is `true` when `width` or `height` is `auto` or `inherit`.
   */
  #resizeObservable = false;
  /**
   * Tracks the current state if this position instance is a candidate for resize observation by the `resizeObserver`
   * action. This is `true` when `height` is `auto` or `inherit`.
   */
  #resizeObservableHeight = false;
  /**
   * Tracks the current state if this position instance is a candidate for resize observation by the `resizeObserver`
   * action. This is `true` when `width` is `auto` or `inherit`.
   */
  #resizeObservableWidth = false;
  /**
   */
  #stores;
  /**
   * Stores an instance of the computer styles for the target element.
   */
  #styleCache;
  /**
   * Stores the subscribers.
   */
  #subscribers = [];
  /**
   */
  #transforms = new TJSTransforms();
  /**
   */
  #updateElementData;
  /**
   * Stores the UpdateElementManager wait promise.
   */
  #updateElementPromise;
  /**
   */
  #validators;
  /**
   */
  #validatorData;
  /**
   */
  #state = new PositionStateAPI(this, this.#data, this.#transforms);
  /**
   * @returns Public Animation Group API.
   */
  static get Animate() {
    return AnimationGroupAPIImpl;
  }
  /**
   * @returns TJSPositionData constructor.
   */
  static get Data() {
    return TJSPositionData;
  }
  /**
   * @returns TJSPosition default initial systems.
   */
  static get Initial() {
    return this.#positionInitial;
  }
  /**
   * @returns `SystemBase` constructor.
   */
  static get SystemBase() {
    return SystemBase;
  }
  /**
   * Returns TJSTransformData class / constructor.
   *
   * @returns TransformData class / constructor.
   */
  static get TransformData() {
    return TJSTransformData;
  }
  /**
   * Returns default validator systems.
   *
   * @returns Available validators.
   */
  static get Validators() {
    return this.#positionValidators;
  }
  /**
   * Returns a list of supported transform origins.
   *
   * @returns The supported transform origin strings.
   */
  static get transformOrigins() {
    return TJSTransforms.transformOrigins;
  }
  /**
   * Convenience to copy from source to target of two TJSPositionData like objects. If a target is not supplied a new
   * {@link TJSPositionData} instance is created.
   *
   * @param source - The source instance to copy from.
   *
   * @param [target] - Target TJSPositionData like object; if one is not provided a new instance is created.
   *
   * @returns The target instance with all TJSPositionData fields.
   */
  static copyData(source, target) {
    return TJSPositionDataUtil.copyData(source, target);
  }
  /**
   * Returns a duplicate of a given position instance copying any options and validators. The position parent is not
   * copied, and a new one must be set manually via the {@link TJSPosition.parent} setter.
   *
   * @param position - A position instance.
   *
   * @param [options] - Unique new options to set.
   *
   * @returns A duplicate position instance.
   */
  static duplicate(position, options = {}) {
    if (!(position instanceof _a)) {
      throw new TypeError(`'position' is not an instance of TJSPosition.`);
    }
    const newPosition = new _a(options);
    newPosition.#options = Object.assign({}, position.#options, options);
    newPosition.#validators.add(...position.#validators);
    newPosition.set(position.#data);
    return newPosition;
  }
  /**
   * @param [parentOrOptions] - A potential parent element or object w/ `elementTarget` accessor. You may also forego
   *        setting the parent and pass in the configuration options object.
   *
   * @param [options] - The configuration options object.
   */
  constructor(parentOrOptions, options) {
    if (isPlainObject(parentOrOptions)) {
      options = parentOrOptions;
    } else {
      this.#parent = parentOrOptions;
    }
    this.#styleCache = new TJSPositionStyleCache();
    const updateData = new UpdateElementData(this.#positionChangeSet, this.#data, this.#options, this.#styleCache, this.#subscribers, this.#transforms);
    this.#updateElementData = updateData;
    if (typeof options?.calculateTransform === "boolean") {
      this.#options.calculateTransform = options.calculateTransform;
    }
    if (typeof options?.ortho === "boolean") {
      this.#options.ortho = options.ortho;
    }
    this.#stores = Object.freeze({
      // The main properties for manipulating TJSPosition.
      height: propertyStore(this, "height"),
      left: propertyStore(this, "left"),
      rotateX: propertyStore(this, "rotateX"),
      rotateY: propertyStore(this, "rotateY"),
      rotateZ: propertyStore(this, "rotateZ"),
      scale: propertyStore(this, "scale"),
      top: propertyStore(this, "top"),
      transformOrigin: propertyStore(this, "transformOrigin"),
      translateX: propertyStore(this, "translateX"),
      translateY: propertyStore(this, "translateY"),
      translateZ: propertyStore(this, "translateZ"),
      width: propertyStore(this, "width"),
      zIndex: propertyStore(this, "zIndex"),
      // Stores that control validation when width / height is not `auto`.
      maxHeight: propertyStore(this, "maxHeight"),
      maxWidth: propertyStore(this, "maxWidth"),
      minHeight: propertyStore(this, "minHeight"),
      minWidth: propertyStore(this, "minWidth"),
      // Readable stores based on updates or from resize observer changes.
      dimension: { subscribe: updateData.storeDimension.subscribe },
      element: { subscribe: this.#styleCache.stores.element.subscribe },
      resizeContentHeight: { subscribe: this.#styleCache.stores.resizeContentHeight.subscribe },
      resizeContentWidth: { subscribe: this.#styleCache.stores.resizeContentWidth.subscribe },
      resizeObservable: { subscribe: this.#styleCache.stores.resizeObservable.subscribe },
      resizeObservableHeight: { subscribe: this.#styleCache.stores.resizeObservableHeight.subscribe },
      resizeObservableWidth: { subscribe: this.#styleCache.stores.resizeObservableWidth.subscribe },
      resizeOffsetHeight: { subscribe: this.#styleCache.stores.resizeOffsetHeight.subscribe },
      resizeOffsetWidth: { subscribe: this.#styleCache.stores.resizeOffsetWidth.subscribe },
      transform: { subscribe: updateData.storeTransform.subscribe },
      // Protected store that should only be set by resizeObserver action.
      resizeObserved: this.#styleCache.stores.resizeObserved
    });
    Object.defineProperty(this.#stores.transformOrigin, "values", {
      get: () => _a.transformOrigins
    });
    subscribeIgnoreFirst(this.#stores.resizeObserved, (resizeData) => {
      const parent = this.#parent;
      const el = A11yHelper.isFocusTarget(parent) ? parent : parent?.elementTarget;
      if (A11yHelper.isFocusTarget(el) && Number.isFinite(resizeData?.offsetWidth) && Number.isFinite(resizeData?.offsetHeight)) {
        this.set();
      }
    });
    [this.#validators, this.#validatorData] = AdapterValidators.create(() => this.set());
    if (options?.initial) {
      const initial = options.initial;
      if (typeof initial?.getLeft !== "function" || typeof initial?.getTop !== "function") {
        throw new Error(`'options.initial' position helper does not contain 'getLeft' and / or 'getTop' functions.`);
      }
      this.#options.initial = initial;
    }
    if (options?.validator) {
      if (isIterable(options?.validator)) {
        this.validators.add(...options.validator);
      } else {
        const validatorFn = options.validator;
        this.validators.add(validatorFn);
      }
    }
    Object.seal(this);
    if (isObject(options)) {
      this.set(options);
    }
  }
  /**
   * Returns the animation API.
   *
   * @returns Animation instance API.
   */
  get animate() {
    return this.#animate;
  }
  /**
   * Returns the dimension data for the readable store.
   *
   * @returns Dimension data.
   */
  get dimension() {
    return this.#updateElementData.dimensionData;
  }
  /**
   * Returns the enabled state.
   *
   * @returns Enabled state.
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Returns the current HTMLElement being positioned.
   *
   * @returns Current HTMLElement being positioned.
   */
  get element() {
    return this.#styleCache.el;
  }
  /**
   * Returns a promise that is resolved on the next element update with the time of the update.
   *
   * @returns Promise resolved on element update.
   */
  get elementUpdated() {
    return this.#updateElementPromise;
  }
  /**
   * Returns the associated {@link TJSPosition.PositionParent} instance.
   *
   * @returns The current position parent instance.
   */
  get parent() {
    return this.#parent;
  }
  /**
   * Returns the resize observable state which is `true` whenever `width` or `height` is `auto` or `inherit`.
   */
  get resizeObservable() {
    return this.#resizeObservable;
  }
  /**
   * Returns the resize observable state which is `true` whenever `height` is `auto` or `inherit`.
   */
  get resizeObservableHeight() {
    return this.#resizeObservableHeight;
  }
  /**
   * Returns the resize observable state which is `true` whenever `width` is `auto` or `inherit`.
   */
  get resizeObservableWidth() {
    return this.#resizeObservableWidth;
  }
  /**
   * Returns the state API.
   *
   * @returns TJSPosition state API.
   */
  get state() {
    return this.#state;
  }
  /**
   * Returns the derived writable stores for individual data variables.
   *
   * @returns Derived / writable stores.
   */
  get stores() {
    return this.#stores;
  }
  /**
   * Returns the transform data for the readable store.
   *
   * @returns Transform Data.
   */
  get transform() {
    return this.#updateElementData.transformData;
  }
  /**
   * Returns the validators.
   *
   * @returns Validators API
   */
  get validators() {
    return this.#validators;
  }
  /**
   * Sets the enabled state.
   *
   * @param enabled - Newly enabled state.
   */
  set enabled(enabled) {
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    if (this.#enabled !== enabled) {
      this.#enabled = enabled;
      if (enabled) {
        this.set(this.#data);
      }
    }
  }
  /**
   * Sets the associated {@link TJSPosition.PositionParent} instance. Resets the style cache and default data.
   *
   * @param parent - A PositionParent instance or undefined to disassociate
   */
  set parent(parent) {
    if (parent !== void 0 && !A11yHelper.isFocusTarget(parent) && !isObject(parent)) {
      throw new TypeError(`'parent' is not an HTMLElement, object, or undefined.`);
    }
    this.#parent = parent;
    this.#state.remove({ name: "#defaultData" });
    this.#styleCache.reset();
    if (parent) {
      this.set(this.#data);
    }
  }
  // Data accessors ----------------------------------------------------------------------------------------------------
  /**
   * @returns height
   */
  get height() {
    return this.#data.height;
  }
  /**
   * @returns left
   */
  get left() {
    return this.#data.left;
  }
  /**
   * @returns maxHeight
   */
  get maxHeight() {
    return this.#data.maxHeight;
  }
  /**
   * @returns maxWidth
   */
  get maxWidth() {
    return this.#data.maxWidth;
  }
  /**
   * @returns minHeight
   */
  get minHeight() {
    return this.#data.minHeight;
  }
  /**
   * @returns minWidth
   */
  get minWidth() {
    return this.#data.minWidth;
  }
  /**
   * @returns rotateX
   */
  get rotateX() {
    return this.#data.rotateX;
  }
  /**
   * @returns rotateY
   */
  get rotateY() {
    return this.#data.rotateY;
  }
  /**
   * @returns rotateZ
   */
  get rotateZ() {
    return this.#data.rotateZ;
  }
  /**
   * @returns Alias for rotateZ
   */
  get rotation() {
    return this.#data.rotateZ;
  }
  /**
   * @returns scale
   */
  get scale() {
    return this.#data.scale;
  }
  /**
   * @returns top
   */
  get top() {
    return this.#data.top;
  }
  /**
   * @returns transformOrigin
   */
  get transformOrigin() {
    return this.#data.transformOrigin;
  }
  /**
   * @returns translateX
   */
  get translateX() {
    return this.#data.translateX;
  }
  /**
   * @returns translateY
   */
  get translateY() {
    return this.#data.translateY;
  }
  /**
   * @returns translateZ
   */
  get translateZ() {
    return this.#data.translateZ;
  }
  /**
   * @returns width
   */
  get width() {
    return this.#data.width;
  }
  /**
   * @returns z-index
   */
  get zIndex() {
    return this.#data.zIndex;
  }
  /**
   * @param height -
   */
  set height(height) {
    this.#stores.height.set(height);
  }
  /**
   * @param left -
   */
  set left(left) {
    this.#stores.left.set(left);
  }
  /**
   * @param maxHeight -
   */
  set maxHeight(maxHeight) {
    this.#stores.maxHeight.set(maxHeight);
  }
  /**
   * @param maxWidth -
   */
  set maxWidth(maxWidth) {
    this.#stores.maxWidth.set(maxWidth);
  }
  /**
   * @param minHeight -
   */
  set minHeight(minHeight) {
    this.#stores.minHeight.set(minHeight);
  }
  /**
   * @param minWidth -
   */
  set minWidth(minWidth) {
    this.#stores.minWidth.set(minWidth);
  }
  /**
   * @param rotateX -
   */
  set rotateX(rotateX) {
    this.#stores.rotateX.set(rotateX);
  }
  /**
   * @param rotateY -
   */
  set rotateY(rotateY) {
    this.#stores.rotateY.set(rotateY);
  }
  /**
   * @param rotateZ -
   */
  set rotateZ(rotateZ) {
    this.#stores.rotateZ.set(rotateZ);
  }
  /**
   * @param  rotateZ - alias for rotateZ
   */
  set rotation(rotateZ) {
    this.#stores.rotateZ.set(rotateZ);
  }
  /**
   * @param scale -
   */
  set scale(scale) {
    this.#stores.scale.set(scale);
  }
  /**
   * @param top -
   */
  set top(top) {
    this.#stores.top.set(top);
  }
  /**
   * @param transformOrigin -
   */
  set transformOrigin(transformOrigin) {
    if (TJSTransforms.transformOrigins.includes(transformOrigin)) {
      this.#stores.transformOrigin.set(transformOrigin);
    }
  }
  /**
   * @param translateX -
   */
  set translateX(translateX) {
    this.#stores.translateX.set(translateX);
  }
  /**
   * @param translateY -
   */
  set translateY(translateY) {
    this.#stores.translateY.set(translateY);
  }
  /**
   * @param translateZ -
   */
  set translateZ(translateZ) {
    this.#stores.translateZ.set(translateZ);
  }
  /**
   * @param width -
   */
  set width(width) {
    this.#stores.width.set(width);
  }
  /**
   * @param zIndex -
   */
  set zIndex(zIndex) {
    this.#stores.zIndex.set(zIndex);
  }
  /**
   * Assigns current position data to the given object `data` object. By default, `null` position data is not assigned.
   * Other options allow configuration of the data assigned, including setting default numeric values for any
   * properties that are null.
   *
   * @param [data] - Target to assign current position data.
   *
   * @param [options] - Defines options for specific keys and substituting null for numeric default values. By
   *        default, nullable keys are included.
   *
   * @returns Any passed in data object with current position data.
   */
  get(data = {}, options = {}) {
    const keys = options?.keys;
    const excludeKeys = options?.exclude;
    const nullable = options?.nullable ?? true;
    const numeric = options?.numeric ?? false;
    if (isIterable(keys)) {
      for (const key of keys) {
        data[key] = numeric ? TJSPositionDataUtil.getDataOrDefault(this, key) : this[key];
        if (!nullable && data[key] === null) {
          delete data[key];
        }
      }
      if (isIterable(excludeKeys)) {
        for (const key of excludeKeys) {
          delete data[key];
        }
      }
      return data;
    } else {
      data = Object.assign(data, this.#data);
      if (isIterable(excludeKeys)) {
        for (const key of excludeKeys) {
          delete data[key];
        }
      }
      if (numeric) {
        TJSPositionDataUtil.setNumericDefaults(data);
      }
      if (!nullable) {
        for (const key in data) {
          if (data[key] === null) {
            delete data[key];
          }
        }
      }
      return data;
    }
  }
  /**
   * @returns Current position data.
   */
  toJSON() {
    return Object.assign({}, this.#data);
  }
  /**
   * All calculation and updates of position are implemented in {@link TJSPosition}. This allows position to be fully
   * reactive and in control of updating inline styles for a connected {@link HTMLElement}.
   *
   * The initial set call with a target element will always set width / height as this is necessary for correct
   * calculations.
   *
   * When a target element is present, updated styles are applied after validation. To modify the behavior of set,
   * implement one or more validator functions and add them via the validator API available from
   * {@link TJSPosition.validators}.
   *
   * Updates to any target element are decoupled from the underlying TJSPosition data. This method returns this
   * instance that you can then await on the target element inline style update by using
   * {@link TJSPosition.elementUpdated}.
   *
   * Relative updates to any property of {@link TJSPositionData} are possible by specifying properties as strings.
   * This string should be in the form of '+=', '-=', or '*=' and float / numeric value. IE '+=0.2'.
   * {@link TJSPosition.set} will apply the `addition`, `subtraction`, or `multiplication` operation specified against
   * the current value of the given property. Please see {@link Data.TJSPositionDataRelative} for a detailed
   * description.
   *
   * @param [position] - TJSPosition data to set.
   *
   * @param [options] - Additional options.
   *
   * @returns This TJSPosition instance.
   */
  set(position = {}, options = {}) {
    if (!isObject(position)) {
      throw new TypeError(`TJSPosition - set error: 'position' is not an object.`);
    }
    const parent = this.#parent;
    if (!this.#enabled) {
      return this;
    }
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return this;
    }
    const immediateElementUpdate = options?.immediateElementUpdate ?? false;
    const data = this.#data;
    const transforms = this.#transforms;
    const targetEl = A11yHelper.isFocusTarget(parent) ? parent : parent?.elementTarget;
    const el = A11yHelper.isFocusTarget(targetEl) ? targetEl : void 0;
    const changeSet = this.#positionChangeSet;
    const styleCache = this.#styleCache;
    if (el) {
      if (!styleCache.hasData(el)) {
        styleCache.update(el);
        if (!styleCache.hasWillChange) ;
        changeSet.set(true);
        this.#updateElementData.queued = false;
      }
      ConvertStringData.process(position, this.#data, el);
      position = this.#updatePosition(position, parent, el, styleCache);
      if (position === null) {
        return this;
      }
    }
    if (NumberGuard.isFinite(position.left)) {
      position.left = Math.round(position.left);
      if (data.left !== position.left) {
        data.left = position.left;
        changeSet.left = true;
      }
    }
    if (NumberGuard.isFinite(position.top)) {
      position.top = Math.round(position.top);
      if (data.top !== position.top) {
        data.top = position.top;
        changeSet.top = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.maxHeight)) {
      position.maxHeight = typeof position.maxHeight === "number" ? Math.round(position.maxHeight) : null;
      if (data.maxHeight !== position.maxHeight) {
        data.maxHeight = position.maxHeight;
        changeSet.maxHeight = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.maxWidth)) {
      position.maxWidth = typeof position.maxWidth === "number" ? Math.round(position.maxWidth) : null;
      if (data.maxWidth !== position.maxWidth) {
        data.maxWidth = position.maxWidth;
        changeSet.maxWidth = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.minHeight)) {
      position.minHeight = typeof position.minHeight === "number" ? Math.round(position.minHeight) : null;
      if (data.minHeight !== position.minHeight) {
        data.minHeight = position.minHeight;
        changeSet.minHeight = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.minWidth)) {
      position.minWidth = typeof position.minWidth === "number" ? Math.round(position.minWidth) : null;
      if (data.minWidth !== position.minWidth) {
        data.minWidth = position.minWidth;
        changeSet.minWidth = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.rotateX)) {
      if (data.rotateX !== position.rotateX) {
        data.rotateX = transforms.rotateX = position.rotateX;
        changeSet.transform = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.rotateY)) {
      if (data.rotateY !== position.rotateY) {
        data.rotateY = transforms.rotateY = position.rotateY;
        changeSet.transform = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.rotateZ)) {
      if (data.rotateZ !== position.rotateZ) {
        data.rotateZ = transforms.rotateZ = position.rotateZ;
        changeSet.transform = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.scale)) {
      position.scale = typeof position.scale === "number" ? clamp(position.scale, 0, 1e3) : null;
      if (data.scale !== position.scale) {
        data.scale = transforms.scale = position.scale;
        changeSet.transform = true;
      }
    }
    if (typeof position.transformOrigin === "string" && TJSTransforms.transformOrigins.includes(position.transformOrigin) || position.transformOrigin === null) {
      if (data.transformOrigin !== position.transformOrigin) {
        data.transformOrigin = position.transformOrigin;
        changeSet.transformOrigin = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.translateX)) {
      if (data.translateX !== position.translateX) {
        data.translateX = transforms.translateX = position.translateX;
        changeSet.transform = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.translateY)) {
      if (data.translateY !== position.translateY) {
        data.translateY = transforms.translateY = position.translateY;
        changeSet.transform = true;
      }
    }
    if (NumberGuard.isFiniteOrNull(position.translateZ)) {
      if (data.translateZ !== position.translateZ) {
        data.translateZ = transforms.translateZ = position.translateZ;
        changeSet.transform = true;
      }
    }
    if (NumberGuard.isFinite(position.zIndex)) {
      position.zIndex = Math.round(position.zIndex);
      if (data.zIndex !== position.zIndex) {
        data.zIndex = position.zIndex;
        changeSet.zIndex = true;
      }
    }
    const widthIsObservable = position.width === "auto" || position.width === "inherit";
    if (NumberGuard.isFiniteOrNull(position.width) || widthIsObservable) {
      position.width = typeof position.width === "number" ? Math.round(position.width) : position.width;
      if (data.width !== position.width) {
        data.width = position.width;
        changeSet.width = true;
      }
    }
    const heightIsObservable = position.height === "auto" || position.height === "inherit";
    if (NumberGuard.isFiniteOrNull(position.height) || heightIsObservable) {
      position.height = typeof position.height === "number" ? Math.round(position.height) : position.height;
      if (data.height !== position.height) {
        data.height = position.height;
        changeSet.height = true;
      }
    }
    const resizeObservable = widthIsObservable || heightIsObservable;
    if (this.#resizeObservable !== resizeObservable) {
      this.#resizeObservable = resizeObservable;
      this.#styleCache.stores.resizeObservable.set(resizeObservable);
    }
    if (this.#resizeObservableHeight !== heightIsObservable) {
      this.#resizeObservableHeight = heightIsObservable;
      this.#styleCache.stores.resizeObservableHeight.set(heightIsObservable);
    }
    if (this.#resizeObservableWidth !== widthIsObservable) {
      this.#resizeObservableWidth = widthIsObservable;
      this.#styleCache.stores.resizeObservableWidth.set(widthIsObservable);
    }
    if (el) {
      const defaultData = this.#state.getDefault();
      if (!isObject(defaultData)) {
        this.#state.save({ name: "#defaultData", ...Object.assign({}, data) });
      }
      if (immediateElementUpdate) {
        UpdateElementManager.immediate(el, this.#updateElementData);
        this.#updateElementPromise = Promise.resolve(globalThis.performance.now());
      } else if (!this.#updateElementData.queued) {
        this.#updateElementPromise = UpdateElementManager.add(el, this.#updateElementData);
      }
    } else {
      UpdateElementManager.updateSubscribers(this.#updateElementData);
    }
    return this;
  }
  /**
   * @param handler - Callback function that is invoked on update / changes. Receives a readonly copy of the
   *        TJSPositionData.
   *
   * @returns Unsubscribe function.
   */
  subscribe(handler) {
    const currentIdx = this.#subscribers.findIndex((entry) => entry === handler);
    if (currentIdx === -1) {
      this.#subscribers.push(handler);
      handler(Object.assign({}, this.#data));
    }
    return () => {
      const existingIdx = this.#subscribers.findIndex((entry) => entry === handler);
      if (existingIdx !== -1) {
        this.#subscribers.splice(existingIdx, 1);
      }
    };
  }
  /**
   * Provides the {@link Writable} store `update` method. Receive and return a {@link TJSPositionData} instance to
   * update the position state. You may manipulate numeric properties by providing relative adjustments described in
   * {@link TJSPositionDataRelative}.
   *
   * @param updater -
   */
  update(updater) {
    const result = updater(this.get());
    if (!isObject(result)) {
      throw new TypeError(`'result' of 'updater' is not an object.`);
    }
    this.set(result);
  }
  // Internal Implementation ----------------------------------------------------------------------------------------
  /**
   * Temporary data storage for `TJSPosition.#updatePosition`.
   */
  static #updateDataCopy = Object.seal(new TJSPositionData());
  /**
   * Temporary data storage for `TJSPosition.#updatePosition`.
   */
  static #validationData = Object.seal({
    position: void 0,
    parent: void 0,
    el: void 0,
    computed: void 0,
    transforms: void 0,
    height: void 0,
    width: void 0,
    marginLeft: void 0,
    marginTop: void 0,
    maxHeight: void 0,
    maxWidth: void 0,
    minHeight: void 0,
    minWidth: void 0,
    rest: void 0
  });
  /**
   * @param data -
   *
   * @param parent -
   *
   * @param el -
   *
   * @param styleCache -
   *
   * @returns Updated position data or null if validation fails.
   */
  #updatePosition({
    // Directly supported parameters
    left,
    top,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    width,
    height,
    rotateX,
    rotateY,
    rotateZ,
    scale,
    transformOrigin,
    translateX,
    translateY,
    translateZ,
    zIndex,
    // Aliased parameters.
    rotation,
    ...rest
  }, parent, el, styleCache) {
    let currentPosition = TJSPositionDataUtil.copyData(this.#data, _a.#updateDataCopy);
    if (width !== void 0 || el.style.width === "") {
      const widthValid = width === null || Number.isFinite(width);
      if (width === "auto" || currentPosition.width === "auto" && !widthValid) {
        currentPosition.width = "auto";
        width = styleCache.offsetWidth;
      } else if (width === "inherit" || currentPosition.width === "inherit" && !widthValid) {
        currentPosition.width = "inherit";
        width = styleCache.offsetWidth;
      } else {
        const newWidth = NumberGuard.isFinite(width) ? width : currentPosition.width;
        currentPosition.width = width = NumberGuard.isFinite(newWidth) ? Math.round(newWidth) : styleCache.offsetWidth;
      }
    } else {
      width = Number.isFinite(currentPosition.width) ? currentPosition.width : styleCache.offsetWidth;
    }
    if (height !== void 0 || el.style.height === "") {
      const heightValid = height === null || Number.isFinite(height);
      if (height === "auto" || currentPosition.height === "auto" && !heightValid) {
        currentPosition.height = "auto";
        height = styleCache.offsetHeight;
      } else if (height === "inherit" || currentPosition.height === "inherit" && !heightValid) {
        currentPosition.height = "inherit";
        height = styleCache.offsetHeight;
      } else {
        const newHeight = NumberGuard.isFinite(height) ? height : currentPosition.height;
        currentPosition.height = height = NumberGuard.isFinite(newHeight) ? Math.round(newHeight) : styleCache.offsetHeight;
      }
    } else {
      height = Number.isFinite(currentPosition.height) ? currentPosition.height : styleCache.offsetHeight;
    }
    if (NumberGuard.isFinite(left)) {
      currentPosition.left = left;
    } else if (!Number.isFinite(currentPosition.left)) {
      currentPosition.left = typeof this.#options?.initial?.getLeft === "function" ? this.#options.initial.getLeft(width) : 0;
    }
    if (Number.isFinite(top)) {
      currentPosition.top = top;
    } else if (!Number.isFinite(currentPosition.top)) {
      currentPosition.top = typeof this.#options?.initial?.getTop === "function" ? this.#options.initial.getTop(height) : 0;
    }
    if (NumberGuard.isFiniteOrNull(maxHeight)) {
      currentPosition.maxHeight = NumberGuard.isFinite(maxHeight) ? Math.round(maxHeight) : null;
    }
    if (NumberGuard.isFiniteOrNull(maxWidth)) {
      currentPosition.maxWidth = NumberGuard.isFinite(maxWidth) ? Math.round(maxWidth) : null;
    }
    if (NumberGuard.isFiniteOrNull(minHeight)) {
      currentPosition.minHeight = NumberGuard.isFinite(minHeight) ? Math.round(minHeight) : null;
    }
    if (NumberGuard.isFiniteOrNull(minWidth)) {
      currentPosition.minWidth = NumberGuard.isFinite(minWidth) ? Math.round(minWidth) : null;
    }
    if (NumberGuard.isFiniteOrNull(rotateX)) {
      currentPosition.rotateX = rotateX;
    }
    if (NumberGuard.isFiniteOrNull(rotateY)) {
      currentPosition.rotateY = rotateY;
    }
    if (rotateZ !== currentPosition.rotateZ && NumberGuard.isFiniteOrNull(rotateZ)) {
      currentPosition.rotateZ = rotateZ;
    } else if (rotation !== currentPosition.rotateZ && NumberGuard.isFiniteOrNull(rotation)) {
      currentPosition.rotateZ = rotation;
    }
    if (NumberGuard.isFiniteOrNull(translateX)) {
      currentPosition.translateX = translateX;
    }
    if (NumberGuard.isFiniteOrNull(translateY)) {
      currentPosition.translateY = translateY;
    }
    if (NumberGuard.isFiniteOrNull(translateZ)) {
      currentPosition.translateZ = translateZ;
    }
    if (NumberGuard.isFiniteOrNull(scale)) {
      currentPosition.scale = typeof scale === "number" ? clamp(scale, 0, 1e3) : null;
    }
    if (typeof transformOrigin === "string" || transformOrigin === null) {
      currentPosition.transformOrigin = TJSTransforms.transformOrigins.includes(transformOrigin) ? transformOrigin : null;
    }
    if (NumberGuard.isFiniteOrNull(zIndex)) {
      currentPosition.zIndex = typeof zIndex === "number" ? Math.round(zIndex) : zIndex;
    }
    const validatorData = this.#validatorData;
    if (this.#validators.enabled && validatorData.length) {
      const validationData = _a.#validationData;
      validationData.parent = parent;
      validationData.el = el;
      validationData.computed = styleCache.computed;
      validationData.transforms = this.#transforms;
      validationData.height = height;
      validationData.width = width;
      validationData.marginLeft = styleCache.marginLeft;
      validationData.marginTop = styleCache.marginTop;
      validationData.maxHeight = styleCache.maxHeight ?? currentPosition.maxHeight;
      validationData.maxWidth = styleCache.maxWidth ?? currentPosition.maxWidth;
      const isMinimized = parent?.reactive?.minimized ?? false;
      validationData.minHeight = isMinimized ? currentPosition.minHeight ?? 0 : styleCache.minHeight || (currentPosition.minHeight ?? 0);
      validationData.minWidth = isMinimized ? currentPosition.minWidth ?? 0 : styleCache.minWidth || (currentPosition.minWidth ?? 0);
      for (let cntr = 0; cntr < validatorData.length; cntr++) {
        validationData.position = currentPosition;
        validationData.rest = rest;
        currentPosition = validatorData[cntr].validate(validationData);
        if (currentPosition === null) {
          return null;
        }
      }
    }
    return currentPosition;
  }
}
_a = TJSPosition;
class CQPositionValidate {
  /**
   * Associated TJSPosition.
   */
  #position;
  /**
   * Stores the subscribers.
   */
  #subscribers = [];
  /**
   * Unsubscriber when subscribed to backing SvelteSet.
   */
  #unsubscribe = [];
  #resizeObservableHeight = false;
  #resizeObservableWidth = false;
  #updateStateBound;
  /**
   * @param [position] - Associated TJSPosition instance.
   */
  constructor(position) {
    this.#updateStateBound = this.#updateState.bind(this);
    if (position) {
      this.setPosition(position);
    }
  }
  /**
   * Manually destroy and cleanup associations to any subscribers and TJSPosition instance.
   */
  destroy() {
    this.#cleanup();
  }
  /**
   * Returns the associated TJSPosition instance.
   */
  getPosition() {
    return this.#deref();
  }
  /**
   * Set a new TJSPosition instance to monitor.
   *
   * @param position - New TJSPosition instance to associate.
   */
  setPosition(position) {
    const current = this.#deref();
    if (position === current) {
      return;
    }
    this.#cleanup();
    this.#position = void 0;
    if (position instanceof TJSPosition) {
      this.#position = new WeakRef(position);
      if (this.#subscribers.length) {
        this.#unsubscribe.push(position.stores.resizeObservableHeight.subscribe(this.#updateStateBound));
        this.#unsubscribe.push(position.stores.resizeObservableWidth.subscribe(this.#updateStateBound));
      }
    }
  }
  /**
   * Returns the serialized state tracking supported container types.
   */
  toJSON() {
    return {
      inlineSize: !this.#resizeObservableWidth,
      normal: true,
      size: !this.#resizeObservableWidth && !this.#resizeObservableHeight
    };
  }
  /**
   * @param cqType - The container query type to validate against current associated {@link TJSPosition} state.
   *
   * @returns Whether the browser and associated TJSPosition current state supports the requested container query type.
   */
  validate(cqType) {
    if (!BrowserSupports.containerQueries) {
      return false;
    }
    const hasPosition = this.#deref() !== void 0;
    switch (cqType) {
      case "inline-size":
        return hasPosition && !this.#resizeObservableWidth;
      case "normal":
        return true;
      case "size":
        return hasPosition && !this.#resizeObservableWidth && !this.#resizeObservableHeight;
    }
    return false;
  }
  // Store subscriber implementation --------------------------------------------------------------------------------
  /**
   * @param handler - Callback function that is invoked on update / changes.
   *
   * @returns Unsubscribe function.
   */
  subscribe(handler) {
    const currentIdx = this.#subscribers.findIndex((sub) => sub === handler);
    if (currentIdx === -1) {
      this.#subscribers.push(handler);
      if (this.#subscribers.length === 1) {
        const position = this.#deref();
        if (position) {
          this.#unsubscribe.push(position.stores.resizeObservableHeight.subscribe(this.#updateStateBound));
          this.#unsubscribe.push(position.stores.resizeObservableWidth.subscribe(this.#updateStateBound));
        }
      }
      handler(this);
    }
    return () => {
      const index = this.#subscribers.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscribers.splice(index, 1);
        if (this.#subscribers.length === 0) {
          this.#cleanup();
        }
      }
    };
  }
  // Internal Implementation ----------------------------------------------------------------------------------------
  #cleanup(notify = false) {
    for (const unsubscribe of this.#unsubscribe) {
      unsubscribe();
    }
    this.#unsubscribe.length = 0;
    this.#resizeObservableHeight = false;
    this.#resizeObservableWidth = false;
    if (notify) {
      this.#updateSubscribers();
    }
  }
  #deref() {
    const position = this.#position?.deref();
    if (!position) {
      this.#cleanup(true);
    }
    return position;
  }
  #updateState() {
    const position = this.#deref();
    if (position) {
      this.#resizeObservableHeight = position.resizeObservableHeight;
      this.#resizeObservableWidth = position.resizeObservableWidth;
    }
    this.#updateSubscribers();
  }
  /**
   * Updates subscribers.
   */
  #updateSubscribers() {
    for (let cntr = 0; cntr < this.#subscribers.length; cntr++) {
      this.#subscribers[cntr](this);
    }
  }
}
function applyStyles(node, properties) {
  function setProperties() {
    if (!isObject(properties)) {
      return;
    }
    for (const prop of Object.keys(properties)) {
      node.style.setProperty(`${prop}`, properties[prop]);
    }
  }
  setProperties();
  return {
    /**
     * @param {{ [key: string]: string | null }}  newProperties - Key / value object of properties to set.
     */
    update: (newProperties) => {
      properties = newProperties;
      setProperties();
    }
  };
}
function localize(stringId, data) {
  const result = !isObject(data) ? globalThis.game.i18n.localize(stringId) : globalThis.game.i18n.format(stringId, data);
  return result !== void 0 ? result : "";
}
class ApplicationState {
  /** @type {import('../../SvelteApp.js').SvelteApp} */
  #application;
  /**
   * Stores the current save state key being restored by animating. When a restore is already being animated with the
   * same name the subsequent restore animation is ignored.
   *
   * @type {string | undefined}
   */
  #currentRestoreKey;
  /** @type {Map<string, import('../../types').SvelteApp.API.State.Data>} */
  #dataSaved = /* @__PURE__ */ new Map();
  /**
   * @param {import('../../SvelteApp.js').SvelteApp}   application - The application.
   */
  constructor(application) {
    this.#application = application;
    Object.seal(this);
  }
  /**
   * Clears all saved application state.
   */
  clear() {
    this.#dataSaved.clear();
  }
  /**
   * Returns current application state along with any extra data passed into method.
   *
   * @param {object} [extra] - Extra data to add to application state.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data} Passed in object with current application state.
   */
  current(extra = {}) {
    return Object.assign(extra, {
      position: this.#application?.position?.get(),
      beforeMinimized: this.#application?.position?.state.get({ name: "#beforeMinimized" }),
      options: this.#application?.reactive?.toJSON(),
      ui: { minimized: this.#application?.reactive?.minimized }
    });
  }
  /**
   * Gets any saved application state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Saved data set name.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data | undefined} Any saved application state.
   */
  get({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`[SvelteApp.state.get] error: 'name' is not a string.`);
    }
    return this.#dataSaved.get(name);
  }
  /**
   * @returns {IterableIterator<string>} The saved application state names / keys.
   */
  keys() {
    return this.#dataSaved.keys();
  }
  /**
   * Removes and returns any saved application state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Name to remove and retrieve.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data | undefined} Any saved application state.
   */
  remove({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`[SvelteApp.state.remove] error: 'name' is not a string.`);
    }
    const data = this.#dataSaved.get(name);
    this.#dataSaved.delete(name);
    return data;
  }
  /**
   * Restores a previously saved application state by `name` returning the data. Several optional parameters are
   * available to animate / tween to the new state. When `animateTo` is true an animation is scheduled via
   * {@link #runtime/svelte/store/position!TJSPosition.API.Animation.to} and the duration and easing name or function may be
   * specified.
   *
   * @param {object}            options - Options.
   *
   * @param {string}            options.name - Saved data set name.
   *
   * @param {boolean}           [options.remove=false] - Remove data set.
   *
   * @param {boolean}           [options.animateTo=false] - Animate to restore data.
   *
   * @param {boolean}           [options.cancelable=true] - When true, animation is cancelable.
   *
   * @param {number}            [options.duration=0.1] - Duration in seconds.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/easing').EasingReference} [options.ease='linear'] - Easing function or easing
   *        function name.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data | undefined} Any saved application state.
   */
  restore({ name, remove = false, animateTo = false, cancelable = true, duration = 0.1, ease = "linear" }) {
    if (typeof name !== "string") {
      throw new TypeError(`[SvelteApp.state.restore] error: 'name' is not a string.`);
    }
    const dataSaved = this.#dataSaved.get(name);
    if (dataSaved) {
      if (remove) {
        this.#dataSaved.delete(name);
      }
      if (animateTo && name !== this.#currentRestoreKey) {
        this.#currentRestoreKey = name;
        this.#setImpl(dataSaved, {
          animateTo,
          async: true,
          cancelable,
          duration,
          ease
        }).then(() => {
          if (name === this.#currentRestoreKey) {
            this.#currentRestoreKey = void 0;
          }
        });
      }
    }
    return dataSaved;
  }
  /**
   * Saves current application state with the opportunity to add extra data to the saved state.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Name to index this saved state.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data} Current saved application state.
   */
  save({ name, ...extra }) {
    if (typeof name !== "string") {
      throw new TypeError(`[SvelteApp.state.save] error: 'name' is not a string.`);
    }
    const data = this.current(extra);
    this.#dataSaved.set(name, data);
    return data;
  }
  /**
   * Sets application state from the given `SvelteApp.API.State.Data` instance. Several optional parameters are
   * available to animate / tween to the new state. When `animateTo` is true an animation is scheduled via
   * {@link #runtime/svelte/store/position!AnimationAPI.to} and the duration and easing name or function may be
   * specified.
   *
   * Note: If serializing application state any minimized apps will use the before minimized state on initial render
   * of the app as it is currently not possible to render apps with Foundry VTT core API in the minimized state.
   *
   * @param {import('../../types').SvelteApp.API.State.Data}   data - Saved data set name.
   *
   * @param {object}         [options] - Optional parameters
   *
   * @param {boolean}        [options.animateTo=false] - Animate to restore data.
   *
   * @param {boolean}        [options.cancelable=true] - When true, animation is cancelable.
   *
   * @param {number}         [options.duration=0.1] - Duration in seconds.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/easing').EasingReference} [options.ease='linear'] - Easing function or easing
   *        function name.
   */
  set(data, options = {}) {
    this.#setImpl(data, { ...options, async: false });
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Sets application state from the given `SvelteApp.API.State.Data` instance. Several optional parameters are
   * available to animate / tween to the new state. When `animateTo` is true an animation is scheduled via
   * {@link #runtime/svelte/store/position!AnimationAPI.to} and the duration and easing name or function may be
   * specified.
   *
   * Note: If serializing application state any minimized apps will use the before minimized state on initial render
   * of the app as it is currently not possible to render apps with Foundry VTT core API in the minimized state.
   *
   * @privateRemarks
   * TODO: THIS METHOD NEEDS TO BE REFACTORED WHEN TRL IS MADE INTO A STANDALONE FRAMEWORK.
   *
   * @param {import('../../types').SvelteApp.API.State.Data}   data - Saved data set name.
   *
   * @param {object}            [opts] - Optional parameters
   *
   * @param {boolean}           [opts.async=false] - If animating return a Promise that resolves with any saved data.
   *
   * @param {boolean}           [opts.animateTo=false] - Animate to restore data.
   *
   * @param {boolean}           [opts.cancelable=true] - When true, animation is cancelable.
   *
   * @param {number}            [opts.duration=0.1] - Duration in seconds.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/easing').EasingReference} [opts.ease='linear'] - Easing function or easing
   *        function name.
   *
   * @returns {undefined | Promise<void>} When asynchronous the animation Promise.
   */
  #setImpl(data, { async = false, animateTo = false, cancelable = true, duration = 0.1, ease = "linear" } = {}) {
    if (!isObject(data)) {
      throw new TypeError(`[SvelteApp.state.set] error: 'data' is not an object.`);
    }
    const application = this.#application;
    if (!isObject(data?.position)) {
      console.warn(`[SvelteApp.state.set] warning: 'data.position' is not an object.`);
      return;
    }
    const rendered = application.rendered;
    if (animateTo) {
      if (!rendered) {
        console.warn(`[SvelteApp.state.set] warning: application is not rendered and 'animateTo' is true.`);
        return;
      }
      if (data.position.transformOrigin !== application.position.transformOrigin) {
        application.position.transformOrigin = data.position.transformOrigin;
      }
      if (isObject(data?.ui)) {
        const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
        if (application?.reactive?.minimized && !minimized) {
          application.maximize({ animate: false, duration: 0 });
        }
      }
      const promise2 = application.position.animate.to(data.position, {
        cancelable,
        duration,
        ease,
        strategy: "cancelAll"
      }).finished.then(({ cancelled }) => {
        if (cancelled) {
          return;
        }
        if (isObject(data?.options)) {
          application?.reactive.mergeOptions(data.options);
        }
        if (isObject(data?.ui)) {
          const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
          if (!application?.reactive?.minimized && minimized) {
            application.minimize({ animate: false, duration: 0 });
          }
        }
        if (isObject(data?.beforeMinimized)) {
          application.position.state.set({ name: "#beforeMinimized", ...data.beforeMinimized });
        }
      });
      if (async) {
        return promise2;
      }
    } else {
      if (isObject(data?.options)) {
        application?.reactive.mergeOptions(data.options);
      }
      if (rendered) {
        if (isObject(data?.ui)) {
          const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
          if (application?.reactive?.minimized && !minimized) {
            application.maximize({ animate: false, duration: 0 });
          } else if (!application?.reactive?.minimized && minimized) {
            application.minimize({ animate: false, duration });
          }
        }
        if (isObject(data?.beforeMinimized)) {
          application.position.state.set({ name: "#beforeMinimized", ...data.beforeMinimized });
        }
        application.position.set(data.position);
      } else {
        let positionData = data.position;
        if (isObject(data.beforeMinimized)) {
          positionData = data.beforeMinimized;
          positionData.left = data.position.left;
          positionData.top = data.position.top;
        }
        application.position.set(positionData);
      }
    }
  }
}
class GetSvelteData {
  /** @type {import('svelte').SvelteComponent[] | null[]} */
  #applicationShellHolder;
  /** @type {import('./types').SvelteData[]} */
  #svelteData;
  /**
   * Keep a direct reference to the SvelteData array in an associated {@link SvelteApp}.
   *
   * @param {import('svelte').SvelteComponent[] | null[]}  applicationShellHolder - A reference to the mounted app shell.
   *
   * @param {import('./types').SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
   */
  constructor(applicationShellHolder, svelteData) {
    this.#applicationShellHolder = applicationShellHolder;
    this.#svelteData = svelteData;
  }
  /**
   * Returns any mounted application shell.
   *
   * @returns {import('svelte').SvelteComponent} Any mounted application shell.
   */
  get appShell() {
    return this.#applicationShellHolder[0];
  }
  /**
   * Returns any mounted application shell.
   *
   * @deprecated Use {@link GetSvelteData.appShell}; since `0.2.0` removal in `0.5.0`.
   *
   * @returns {import('svelte').SvelteComponent} Any mounted application shell.
   */
  get applicationShell() {
    return this.#applicationShellHolder[0];
  }
  /**
   * Returns mounted application shell data / config.
   *
   * @internal
   *
   * @returns {import('./types').SvelteData} Any mounted application shell data.
   */
  get appShellData() {
    return this.#svelteData[0];
  }
}
function handleAlwaysOnTop(application, enabled, initialPopOut) {
  if (typeof enabled !== "boolean") {
    throw new TypeError(`[SvelteApp handleAlwaysOnTop error]: 'enabled' is not a boolean.`);
  }
  if (typeof initialPopOut !== "boolean") {
    throw new TypeError(`[SvelteApp handleAlwaysOnTop error]: 'initialPopOut' is not a boolean.`);
  }
  const version2 = globalThis?.TRL_SVELTE_APP_DATA?.VERSION;
  if (typeof version2 !== "number") {
    console.error("[SvelteApp handleAlwaysOnTop error]: global SvelteApp data unavailable.");
    return;
  }
  if (enabled) {
    globalThis.requestAnimationFrame(() => {
      application.reactive.popOut = false;
      globalThis.requestAnimationFrame(() => application.bringToTop({ force: true }));
    });
  } else {
    globalThis.requestAnimationFrame(() => {
      application.position.zIndex = foundry.applications.api.ApplicationV2._maxZ - 1;
      application.reactive.popOut = initialPopOut;
      globalThis.requestAnimationFrame(() => application.bringToTop({ force: true }));
    });
  }
}
const applicationShellContract = ["elementRoot"];
Object.freeze(applicationShellContract);
function isApplicationShell(component) {
  if (component === null || component === void 0) {
    return false;
  }
  let compHasContract = true;
  let protoHasContract = true;
  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(component, accessor);
    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      compHasContract = false;
    }
  }
  const prototype = Object.getPrototypeOf(component);
  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, accessor);
    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      protoHasContract = false;
    }
  }
  return compHasContract || protoHasContract;
}
function loadSvelteConfig({ app, config, elementRootUpdate } = {}) {
  let target;
  if (CrossWindow.isHTMLElement(config.target)) {
    target = config.target;
  } else if (typeof config.target === "string") {
    const activeWindow = app?.reactive?.activeWindow;
    target = activeWindow?.document?.querySelector(config.target);
  }
  if (!CrossWindow.isHTMLElement(target)) {
    console.log(
      `%c[TRL] loadSvelteConfig error - Could not find target, '${config.target}', for config:
`,
      "background: rgb(57,34,34)",
      config
    );
    throw new Error();
  }
  const NewSvelteComponent = config.class;
  const svelteConfig = TJSSvelte.config.parseConfig({ ...config, target }, { contextExternal: true, thisArg: app });
  const externalContext = svelteConfig.context.get("#external");
  externalContext.application = app;
  externalContext.elementRootUpdate = elementRootUpdate;
  externalContext.sessionStorage = app.reactive.sessionStorage;
  let eventbus;
  if (isObject(app._eventbus) && typeof app._eventbus.createProxy === "function") {
    eventbus = app._eventbus.createProxy();
    externalContext.eventbus = eventbus;
  }
  Object.seal(externalContext);
  const component = new NewSvelteComponent(svelteConfig);
  svelteConfig.eventbus = eventbus;
  let element2;
  if (isApplicationShell(component)) {
    element2 = component.elementRoot;
  }
  if (!CrossWindow.isHTMLElement(element2)) {
    console.log(
      `%c[TRL] loadSvelteConfig error - No application shell contract found. Did you bind and export a HTMLElement as 'elementRoot' and include '<svelte:options accessors={true}/>'?

Offending config:
`,
      "background: rgb(57,34,34)",
      config
    );
    throw new Error();
  }
  return { config: svelteConfig, component, element: element2 };
}
class SvelteReactive {
  /**
   * @type {SvelteSet<string>}
   */
  #activeClasses;
  /**
   * @type {import('../SvelteApp').SvelteApp}
   */
  #application;
  /**
   * @type {boolean}
   */
  #initialized = false;
  /**
   * @type {boolean}
   */
  #initialPopOut;
  /** @type {import('@typhonjs-fvtt/runtime/svelte/store/web-storage').WebStorage} */
  #sessionStorage;
  /**
   * The Application option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {import('../../types').SvelteApp.API.Reactive.AppOptions}
   */
  #storeAppOptions;
  /**
   * Stores the update function for `#storeAppOptions`.
   *
   * @type {(this: void, updater: import('svelte/store').Updater<object>) => void}
   */
  #storeAppOptionsUpdate;
  /**
   * Stores the UI state data to make it accessible via getters.
   *
   * @type {import('../../types').SvelteApp.API.Reactive.UIStateData}
   */
  #dataUIState;
  /**
   * The UI option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {import('../../types').SvelteApp.API.Reactive.UIState}
   */
  #storeUIState;
  /**
   * Stores the update function for `#storeUIState`.
   *
   * @type {(this: void, updater: import('svelte/store').Updater<object>) => void}
   */
  #storeUIStateUpdate;
  /**
   * Stores the unsubscribe functions from local store subscriptions.
   *
   * @type {import('svelte/store').Unsubscriber[]}
   */
  #storeUnsubscribe = [];
  /**
   * @param {import('../SvelteApp').SvelteApp} application - The host Foundry application.
   *
   * @param {boolean} initialPopOut - Initial `popOut` state on app construction.
   */
  constructor(application, initialPopOut) {
    this.#application = application;
    this.#initialPopOut = initialPopOut;
    const optionsSessionStorage = application?.options?.sessionStorage;
    if (optionsSessionStorage !== void 0 && !(optionsSessionStorage instanceof TJSWebStorage)) {
      throw new TypeError(`'options.sessionStorage' is not an instance of TJSWebStorage.`);
    }
    this.#sessionStorage = optionsSessionStorage !== void 0 ? optionsSessionStorage : new TJSSessionStorage();
  }
  /**
   * Initializes reactive support. Package private for internal use.
   *
   * @returns {import('./types-local').SvelteReactiveStores | undefined} Internal methods to interact with Svelte
   * stores.
   *
   * @package
   * @internal
   */
  initialize() {
    if (this.#initialized) {
      return;
    }
    this.#initialized = true;
    this.#storesInitialize();
    return {
      appOptionsUpdate: this.#storeAppOptionsUpdate,
      uiStateUpdate: this.#storeUIStateUpdate,
      subscribe: this.#storesSubscribe.bind(this),
      unsubscribe: this.#storesUnsubscribe.bind(this)
    };
  }
  // Store getters -----------------------------------------------------------------------------------------------------
  /**
   * @returns {import('@typhonjs-fvtt/runtime/svelte/store/web-storage').WebStorage} Returns WebStorage (session) instance.
   */
  get sessionStorage() {
    return this.#sessionStorage;
  }
  /**
   * Returns the store for app options.
   *
   * @returns {import('../../types').SvelteApp.API.Reactive.AppOptions} App options store.
   */
  get storeAppOptions() {
    return this.#storeAppOptions;
  }
  /**
   * Returns the store for UI options.
   *
   * @returns {import('../../types').SvelteApp.API.Reactive.UIState} UI options store.
   */
  get storeUIState() {
    return this.#storeUIState;
  }
  // Only reactive getters ---------------------------------------------------------------------------------------------
  /**
   * Returns the current active CSS classes Set applied to the app window. This is reactive for any modifications.
   *
   * @returns {SvelteSet<string>} Active app CSS classes Set.
   */
  get activeClasses() {
    return this.#activeClasses;
  }
  /**
   * Returns the current active Window / WindowProxy UI state.
   *
   * @returns {Window} Active window UI state.
   */
  get activeWindow() {
    return this.#dataUIState.activeWindow ?? globalThis;
  }
  /**
   * Returns the current dragging UI state.
   *
   * @returns {boolean} Dragging UI state.
   */
  get dragging() {
    return this.#dataUIState.dragging;
  }
  /**
   * Returns whether the app is detached from the main browser window.
   *
   * @returns {boolean} App detached state.
   */
  get detached() {
    return this.#dataUIState.activeWindow !== globalThis;
  }
  /**
   * Returns the current minimized UI state.
   *
   * @returns {boolean} Minimized UI state.
   */
  get minimized() {
    return this.#dataUIState.minimized;
  }
  /**
   * Returns the current resizing UI state.
   *
   * @returns {boolean} Resizing UI state.
   */
  get resizing() {
    return this.#dataUIState.resizing;
  }
  /**
   * Sets the current active Window / WindowProxy UI state.
   *
   * Note: This is protected usage and used internally.
   *
   * @param {Window} activeWindow - Active Window / WindowProxy UI state.
   *
   * @internal
   */
  set activeWindow(activeWindow) {
    if (activeWindow === void 0 || activeWindow === null || Object.prototype.toString.call(activeWindow) === "[object Window]") {
      this.#storeUIStateUpdate((options) => deepMerge(options, { activeWindow: activeWindow ?? globalThis }));
    }
  }
  // Reactive getter / setters -----------------------------------------------------------------------------------------
  /**
   * Returns the alwaysOnTop app option.
   *
   * @returns {boolean} Always on top app option.
   */
  get alwaysOnTop() {
    return this.#application?.options?.alwaysOnTop;
  }
  /**
   * Returns the containerQueryType app option.
   *
   * @returns {string} App content container query app option.
   */
  get containerQueryType() {
    return this.#application?.options?.containerQueryType;
  }
  /**
   * Returns the draggable app option.
   *
   * @returns {boolean} Draggable app option.
   */
  get draggable() {
    return this.#application?.options?.draggable;
  }
  /**
   * Returns the focusAuto app option.
   *
   * @returns {boolean} When true auto-management of app focus is enabled.
   */
  get focusAuto() {
    return this.#application?.options?.focusAuto;
  }
  /**
   * Returns the focusKeep app option.
   *
   * @returns {boolean} When `focusAuto` and `focusKeep` is true; keeps internal focus.
   */
  get focusKeep() {
    return this.#application?.options?.focusKeep;
  }
  /**
   * Returns the focusTrap app option.
   *
   * @returns {boolean} When true focus trapping / wrapping is enabled keeping focus inside app.
   */
  get focusTrap() {
    return this.#application?.options?.focusTrap;
  }
  /**
   * Returns the headerButtonNoClose app option.
   *
   * @returns {boolean} Remove the close the button in header app option.
   */
  get headerButtonNoClose() {
    return this.#application?.options?.headerButtonNoClose;
  }
  /**
   * Returns the headerButtonNoLabel app option.
   *
   * @returns {boolean} Remove the labels from buttons in the header app option.
   */
  get headerButtonNoLabel() {
    return this.#application?.options?.headerButtonNoLabel;
  }
  /**
   * Returns the headerIcon app option.
   *
   * @returns {string | undefined} URL for header app icon.
   */
  get headerIcon() {
    return this.#application?.options?.headerIcon;
  }
  /**
   * Returns the headerNoTitleMinimized app option.
   *
   * @returns {boolean} When true removes the header title when minimized.
   */
  get headerNoTitleMinimized() {
    return this.#application?.options?.headerNoTitleMinimized;
  }
  /**
   * Returns the minimizable app option.
   *
   * @returns {boolean} Minimizable app option.
   */
  get minimizable() {
    return this.#application?.options?.minimizable;
  }
  /**
   * Returns the Foundry popOut state; {@link Application.popOut}
   *
   * @returns {boolean} Positionable app option.
   */
  get popOut() {
    return this.#application.popOut;
  }
  /**
   * Returns the positionable app option; {@link SvelteApp.Options.positionable}
   *
   * @returns {boolean} Positionable app option.
   */
  get positionable() {
    return this.#application?.options?.positionable;
  }
  /**
   * Returns the resizable option.
   *
   * @returns {boolean} Resizable app option.
   */
  get resizable() {
    return this.#application?.options?.resizable;
  }
  /**
   * Returns the explicit theme name option.
   *
   * @returns {string | undefined} Theme name option.
   */
  get themeName() {
    return this.#application?.options?.themeName;
  }
  /**
   * Returns the title accessor from the parent Application class; {@link Application.title}
   *
   * @privateRemarks
   * TODO: Application v2; note that super.title localizes `this.options.title`; IMHO it shouldn't.    *
   *
   * @returns {string} Title.
   */
  get title() {
    return this.#application.title;
  }
  /**
   * Sets `this.options.alwaysOnTop`, which is reactive for application shells.
   *
   * @param {boolean}  alwaysOnTop - Sets the `alwaysOnTop` option.
   */
  set alwaysOnTop(alwaysOnTop) {
    if (typeof alwaysOnTop === "boolean") {
      this.setOptions("alwaysOnTop", alwaysOnTop);
    }
  }
  /**
   * Sets `this.options.containerQueryType`, which is reactive for application shells.
   *
   * @param {string}  containerQueryType - Sets the `containerQueryType` option.
   */
  set containerQueryType(containerQueryType) {
    if (containerQueryType === void 0 || containerQueryType === "inline-size" || containerQueryType === "size") {
      this.setOptions("containerQueryType", containerQueryType);
    }
  }
  /**
   * Sets `this.options.draggable`, which is reactive for application shells.
   *
   * @param {boolean}  draggable - Sets the draggable option.
   */
  set draggable(draggable2) {
    if (typeof draggable2 === "boolean") {
      this.setOptions("draggable", draggable2);
    }
  }
  /**
   * Sets `this.options.focusAuto`, which is reactive for application shells.
   *
   * @param {boolean}  focusAuto - Sets the focusAuto option.
   */
  set focusAuto(focusAuto) {
    if (typeof focusAuto === "boolean") {
      this.setOptions("focusAuto", focusAuto);
    }
  }
  /**
   * Sets `this.options.focusKeep`, which is reactive for application shells.
   *
   * @param {boolean}  focusKeep - Sets the focusKeep option.
   */
  set focusKeep(focusKeep) {
    if (typeof focusKeep === "boolean") {
      this.setOptions("focusKeep", focusKeep);
    }
  }
  /**
   * Sets `this.options.focusTrap`, which is reactive for application shells.
   *
   * @param {boolean}  focusTrap - Sets the focusTrap option.
   */
  set focusTrap(focusTrap) {
    if (typeof focusTrap === "boolean") {
      this.setOptions("focusTrap", focusTrap);
    }
  }
  /**
   * Sets `this.options.headerButtonNoClose`, which is reactive for application shells.
   *
   * @param {boolean}  headerButtonNoClose - Sets the headerButtonNoClose option.
   */
  set headerButtonNoClose(headerButtonNoClose) {
    if (typeof headerButtonNoClose === "boolean") {
      this.setOptions("headerButtonNoClose", headerButtonNoClose);
    }
  }
  /**
   * Sets `this.options.headerButtonNoLabel`, which is reactive for application shells.
   *
   * @param {boolean}  headerButtonNoLabel - Sets the headerButtonNoLabel option.
   */
  set headerButtonNoLabel(headerButtonNoLabel) {
    if (typeof headerButtonNoLabel === "boolean") {
      this.setOptions("headerButtonNoLabel", headerButtonNoLabel);
    }
  }
  /**
   * Sets `this.options.headerIcon`, which is reactive for application shells.
   *
   * @param {string | undefined}  headerIcon - Sets the headerButtonNoLabel option.
   */
  set headerIcon(headerIcon) {
    if (headerIcon === void 0 || typeof headerIcon === "string") {
      this.setOptions("headerIcon", headerIcon);
    }
  }
  /**
   * Sets `this.options.headerNoTitleMinimized`, which is reactive for application shells.
   *
   * @param {boolean}  headerNoTitleMinimized - Sets the headerNoTitleMinimized option.
   */
  set headerNoTitleMinimized(headerNoTitleMinimized) {
    if (typeof headerNoTitleMinimized === "boolean") {
      this.setOptions("headerNoTitleMinimized", headerNoTitleMinimized);
    }
  }
  /**
   * Sets `this.options.minimizable`, which is reactive for application shells that are also pop out.
   *
   * @param {boolean}  minimizable - Sets the minimizable option.
   */
  set minimizable(minimizable) {
    if (typeof minimizable === "boolean") {
      this.setOptions("minimizable", minimizable);
    }
  }
  /**
   * Sets `this.options.popOut` which is reactive for application shells. This will add / remove this application
   * from `ui.windows` via the subscription set in `#storesSubscribe`.
   *
   * @param {boolean}  popOut - Sets the popOut option.
   */
  set popOut(popOut) {
    if (typeof popOut === "boolean") {
      this.setOptions("popOut", popOut);
    }
  }
  /**
   * Sets `this.options.positionable`, enabling / disabling {@link SvelteApp.position}.
   *
   * @param {boolean}  positionable - Sets the positionable option.
   */
  set positionable(positionable) {
    if (typeof positionable === "boolean") {
      this.setOptions("positionable", positionable);
    }
  }
  /**
   * Sets `this.options.resizable`, which is reactive for application shells.
   *
   * @param {boolean}  resizable - Sets the resizable option.
   */
  set resizable(resizable) {
    if (typeof resizable === "boolean") {
      this.setOptions("resizable", resizable);
    }
  }
  /**
   * Sets `this.options.themeName`, which is reactive for application shells.
   *
   * @param {string | undefined}  themeName - Sets the themeName option.
   */
  set themeName(themeName) {
    if (themeName === void 0 || typeof themeName === "string") {
      this.setOptions("themeName", themeName);
    }
  }
  /**
   * Sets `this.options.title`, which is reactive for application shells.
   *
   * Note: Will set empty string if title is undefined or null.
   *
   * @param {string | undefined | null}   title - Application title; will be localized, so a translation key is fine.
   */
  set title(title) {
    if (typeof title === "string") {
      this.setOptions("title", title);
    } else if (title === void 0 || title === null) {
      this.setOptions("title", "");
    }
  }
  // Reactive Options API -------------------------------------------------------------------------------------------
  /**
   * Provides a way to safely get this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * @privateRemarks
   * TODO: DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        [defaultValue] - A default value returned if the accessor is not found.
   *
   * @returns {*} Value at the accessor.
   */
  getOptions(accessor, defaultValue) {
    return safeAccess(this.#application.options, accessor, defaultValue);
  }
  /**
   * Provides a way to merge `options` into the application options and update the appOptions store.
   *
   * @param {object}   options - The options object to merge with `this.options`.
   */
  mergeOptions(options) {
    this.#storeAppOptionsUpdate((instanceOptions) => deepMerge(instanceOptions, options));
  }
  /**
   * Provides a way to safely set the application options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format, the accessor string with `.` between entries
   * to walk.
   *
   * Additionally, if an application shell Svelte component is mounted and exports the `appOptions` property, then
   * the application options are set to `appOptions` potentially updating the application shell / Svelte component.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {any}      value - Value to set.
   */
  setOptions(accessor, value) {
    const success = safeSet(this.#application.options, accessor, value, { createMissing: true });
    if (success) {
      this.#storeAppOptionsUpdate(() => this.#application.options);
    }
  }
  /**
   * Serializes the main {@link SvelteApp.Options} for common application state.
   *
   * @returns {import('../../types').SvelteApp.API.Reactive.SerializedData} Common application state.
   */
  toJSON() {
    return {
      alwaysOnTop: this.#application?.options?.alwaysOnTop ?? false,
      draggable: this.#application?.options?.draggable ?? true,
      focusAuto: this.#application?.options?.focusAuto ?? true,
      focusKeep: this.#application?.options?.focusKeep ?? false,
      focusTrap: this.#application?.options?.focusTrap ?? true,
      headerButtonNoClose: this.#application?.options?.headerButtonNoClose ?? false,
      headerButtonNoLabel: this.#application?.options?.headerButtonNoLabel ?? false,
      headerNoTitleMinimized: this.#application?.options?.headerNoTitleMinimized ?? false,
      minimizable: this.#application?.options?.minimizable ?? true,
      positionable: this.#application?.options?.positionable ?? true,
      resizable: this.#application?.options?.resizable ?? true,
      themeName: this.#application?.options?.themeName ?? void 0
    };
  }
  /**
   * Updates the UI Options store with the current header buttons. You may dynamically add / remove header buttons
   * if using an application shell Svelte component. In either overriding `_getHeaderButtons` or responding to the
   * Hooks fired return a new button array, and the uiOptions store is updated, and the application shell will render
   * the new buttons.
   *
   * Optionally you can set in the SvelteApp app options {@link SvelteApp.Options.headerButtonNoClose}
   * to remove the close button from the header buttons.
   *
   * @param {object} [opts] - Optional parameters (for internal use)
   *
   * @param {boolean} [opts.headerButtonNoClose] - The value for `headerButtonNoClose`.
   */
  updateHeaderButtons({ headerButtonNoClose = this.#application.options.headerButtonNoClose } = {}) {
    queueMicrotask(() => {
      let buttons = this.#application._getHeaderButtons();
      if (typeof headerButtonNoClose === "boolean" && headerButtonNoClose) {
        buttons = buttons.filter((button) => button.class !== "close");
      }
      const closeButton = buttons.find((button) => button.class === "close");
      if (closeButton) {
        closeButton.keepMinimized = true;
        closeButton.label = "APPLICATION.TOOLS.Close";
      }
      this.#storeUIStateUpdate((options) => {
        options.headerButtons = buttons;
        return options;
      });
    });
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Initializes the Svelte stores and derived stores for the application options and UI state.
   *
   * While writable stores are created, the update method is stored in private variables locally and derived Readable
   * stores are provided for essential options which are commonly used.
   *
   * These stores are injected into all Svelte components mounted under the `external` context: `storeAppOptions` and
   * `storeUIState`.
   */
  #storesInitialize() {
    this.#activeClasses = new SvelteSet();
    for (const entry of this.#application.options?.classes ?? []) {
      if (typeof entry !== "string") {
        continue;
      }
      if (entry === "themed" || entry.startsWith("theme-")) {
        continue;
      }
      this.#activeClasses.add(entry);
    }
    const writableAppOptions = writable(this.#application.options);
    this.#storeAppOptionsUpdate = writableAppOptions.update;
    const storeAppOptions = {
      subscribe: writableAppOptions.subscribe,
      alwaysOnTop: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "alwaysOnTop")
      ),
      containerQueryType: (
        /** @type {import('svelte/store').Writable<string>} */
        propertyStore(writableAppOptions, "containerQueryType")
      ),
      draggable: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "draggable")
      ),
      focusAuto: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "focusAuto")
      ),
      focusKeep: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "focusKeep")
      ),
      focusTrap: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "focusTrap")
      ),
      headerButtonNoClose: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "headerButtonNoClose")
      ),
      headerButtonNoLabel: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "headerButtonNoLabel")
      ),
      headerIcon: (
        /** @type {import('svelte/store').Writable<string | undefined>} */
        propertyStore(writableAppOptions, "headerIcon")
      ),
      headerNoTitleMinimized: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "headerNoTitleMinimized")
      ),
      minimizable: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "minimizable")
      ),
      popOut: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "popOut")
      ),
      positionable: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "positionable")
      ),
      resizable: (
        /** @type {import('svelte/store').Writable<boolean>} */
        propertyStore(writableAppOptions, "resizable")
      ),
      themeName: (
        /** @type {import('svelte/store').Writable<string | undefined>} */
        propertyStore(writableAppOptions, "themeName")
      ),
      title: (
        /** @type {import('svelte/store').Writable<string>} */
        propertyStore(writableAppOptions, "title")
      )
    };
    Object.freeze(storeAppOptions);
    this.#storeAppOptions = storeAppOptions;
    this.#dataUIState = {
      activeWindow: window,
      dragging: false,
      headerButtons: [],
      minimized: this.#application._minimized,
      resizing: false
    };
    const writableUIOptions = writable(this.#dataUIState);
    this.#storeUIStateUpdate = writableUIOptions.update;
    const storeUIState = {
      subscribe: writableUIOptions.subscribe,
      activeWindow: (
        /** @type {import('svelte/store').Readable<Window>} */
        derived(writableUIOptions, ($options, set) => set($options.activeWindow))
      ),
      detached: (
        /** @type {import('svelte/store').Readable<boolean>} */
        derived(writableUIOptions, ($options, set) => set($options.activeWindow !== globalThis))
      ),
      dragging: (
        /** @type {import('svelte/store').Readable<boolean>} */
        propertyStore(writableUIOptions, "dragging")
      ),
      headerButtons: (
        /** @type {import('svelte/store').Readable<import('../../types').SvelteApp.HeaderButton>} */
        derived(writableUIOptions, ($options, set) => set($options.headerButtons))
      ),
      minimized: (
        /** @type {import('svelte/store').Readable<boolean>} */
        derived(writableUIOptions, ($options, set) => set($options.minimized))
      ),
      resizing: (
        /** @type {import('svelte/store').Readable<boolean>} */
        propertyStore(writableUIOptions, "resizing")
      )
    };
    Object.freeze(storeUIState);
    this.#storeUIState = storeUIState;
  }
  /**
   * Registers local store subscriptions for app options. `popOut` controls registering this app with `ui.windows`.
   *
   * @see SvelteApp._injectHTML
   */
  #storesSubscribe() {
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(
      this.#storeAppOptions.alwaysOnTop,
      (enabled) => handleAlwaysOnTop(this.#application, enabled, this.#initialPopOut)
    ));
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.headerButtonNoClose, (value) => this.updateHeaderButtons({ headerButtonNoClose: value })));
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.popOut, (value) => {
      if (value) {
        if (globalThis?.ui?.windows?.[this.#application.appId] !== this.#application) {
          globalThis.ui.windows[this.#application.appId] = this.#application;
        }
      } else {
        if (globalThis?.ui?.activeWindow === this.#application) {
          globalThis.ui.activeWindow = null;
        }
        if (globalThis?.ui?.windows?.[this.#application.appId] === this.#application) {
          delete globalThis.ui.windows[this.#application.appId];
        }
      }
    }));
  }
  /**
   * Unsubscribes from any locally monitored stores.
   *
   * @see SvelteApp.close
   */
  #storesUnsubscribe() {
    this.#storeUnsubscribe.forEach((unsubscribe) => unsubscribe());
    this.#storeUnsubscribe = [];
  }
}
class TJSAppIndex {
  /**
   * Stores all visible / rendered apps.
   *
   * @type {Map<string, import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp>}
   */
  static #visibleApps = /* @__PURE__ */ new Map();
  /**
   * Adds a SvelteApp to all visible apps tracked.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp} app - A SvelteApp
   *
   * @package
   */
  static add(app) {
    this.#visibleApps.set(app.id, app);
  }
  /**
   * Removes a SvelteApp from all visible apps tracked.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp} app - A SvelteApp
   *
   * @package
   */
  static delete(app) {
    this.#visibleApps.delete(app.id);
  }
  /**
   * Gets a particular app by ID.
   *
   * @param {string}   key - App ID.
   *
   * @returns {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp} Associated app.
   */
  static get(key) {
    return this.#visibleApps.get(key);
  }
  /**
   * Returns whether an associated app by ID is being tracked.
   *
   * @param {string}   key - App ID.
   *
   * @returns {boolean} The given App ID is visible.
   */
  static has(key) {
    return this.#visibleApps.has(key);
  }
  /**
   * @returns {IterableIterator<string>} All visible app IDs.
   */
  static keys() {
    return this.#visibleApps.keys();
  }
  /**
   * @returns {IterableIterator<import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp>} All visible apps.
   */
  static values() {
    return this.#visibleApps.values();
  }
}
class FoundryStyles {
  /**
   * Parsed Foundry core stylesheet.
   *
   * @type {StyleSheetResolve}
   */
  static #core;
  /**
   * Dummy / no-op instance when parsing or CORS / SecurityException occurs.
   *
   * @type {StyleSheetResolve}
   */
  static #dummy = new StyleSheetResolve().freeze();
  /**
   * Parsed Foundry core stylesheet with extended game system / module overrides.
   *
   * @type {StyleSheetResolve}
   */
  static #ext;
  static #initialized = false;
  /**
   * @hideconstructor
   */
  constructor() {
    throw new Error("FoundryStyles constructor: This is a static class and should not be constructed.");
  }
  /**
   * @returns {StyleSheetResolve} Core parsed styles.
   */
  static get core() {
    if (!this.#initialized) {
      this.#initialize();
    }
    return this.#core ?? this.#dummy;
  }
  /**
   * @returns {StyleSheetResolve} Core parsed styles with extended game system / module overrides.
   */
  static get ext() {
    if (!this.#initialized) {
      this.#initialize();
    }
    return this.#ext ?? this.#dummy;
  }
  // Internal Implementation ----------------------------------------------------------------------------------------
  /**
   * Find the core Foundry CSSStyleSheet instance and any 3rd party game system / module stylesheets.
   *
   * Resolve the core sheet and then create the extended resolved style sheet merging the core with all system / module
   * sheets.
   */
  static #initialize() {
    this.#initialized = true;
    const styleSheets = Array.from(document.styleSheets);
    let foundryStyleSheet;
    const moduleSheets = [];
    const systemSheets = [];
    const failedSheets = [];
    for (let i = 0; i < styleSheets.length; i++) {
      const sheet = styleSheets[i];
      if (typeof sheet?.href === "string") {
        try {
          if (sheet.href.endsWith("/css/foundry2.css") && sheet?.cssRules?.length) {
            foundryStyleSheet = sheet;
          }
        } catch (err) {
          if (CrossWindow.isDOMException(err, "SecurityException")) {
            failedSheets.push({ href: sheet.href, core: true });
          }
        }
      } else {
        try {
          if (sheet?.cssRules?.length) {
            for (const rule of sheet.cssRules) {
              if (!CrossWindow.isCSSImportRule(rule) || !CrossWindow.isCSSStyleSheet(rule?.styleSheet)) {
                continue;
              }
              try {
                switch (rule?.layerName) {
                  case "modules":
                    if (rule.styleSheet?.cssRules?.length) {
                      moduleSheets.push(rule.styleSheet);
                    }
                    break;
                  case "system":
                    if (rule.styleSheet?.cssRules?.length) {
                      systemSheets.push(rule.styleSheet);
                    }
                    break;
                }
              } catch (err) {
                if (CrossWindow.isDOMException(err, "SecurityException")) {
                  failedSheets.push({ href: rule.styleSheet.href, core: false, layer: rule.layerName });
                }
              }
            }
          }
        } catch (err) {
          if (CrossWindow.isDOMException(err, "SecurityException")) {
            failedSheets.push({ href: "", core: false, layer: "inline-stylesheet" });
          }
        }
      }
    }
    if (failedSheets.length) {
      console.warn(`[TyphonJS Runtime] CORS / SecurityException error: FoundryStyles could not load style sheets: ${JSON.stringify(failedSheets, null, 2)}`);
    }
    if (!foundryStyleSheet) {
      console.warn(`[TyphonJS Runtime] error: FoundryStyles could not load core style sheet.`);
      return;
    }
    this.#resolveCore(foundryStyleSheet);
    this.#resolveExt(moduleSheets, systemSheets);
    this.#core.freeze();
    this.#ext.freeze();
  }
  /**
   * @param {CSSStyleSheet}  sheet - Foundry core style sheet.
   */
  static #resolveCore(sheet) {
    this.#core = StyleSheetResolve.parse(sheet, {
      // Exclude any selector parts that match the following.
      excludeSelectorParts: [
        />\s*[^ ]+/,
        // Direct child selectors
        /(^|\s)\*/,
        // Universal selectors
        /(^|\s)\.app(?![\w-])/,
        // AppV1 class
        /^\.application\.[a-z]/,
        // All `.application.theme` / any specific core application.
        /^body\.auth/,
        /^body(?:\.[\w-]+)*\.application\b/,
        // Remove unnecessary `body.<theme>.application` pairing.
        /^\.\u037c\d/i,
        // Code-mirror `.ͼ1`
        /code-?mirror/i,
        /(^|[^a-zA-Z0-9_-])#(?!context-menu\b)[\w-]+|[^ \t>+~]#context-menu\b/,
        /^\.faded-ui/,
        /(^|\s)kbd\b/,
        /^input.placeholder-fa-solid\b/,
        /(^|\s)label\b/,
        /^\.mixin-theme/,
        // Remove all mixin related styles left in by core.
        /prose-?mirror/i,
        /(^|\s)section\b/,
        /\.window-app/,
        // Exclude various core applications.
        /^\.active-effect-config/,
        /^\.adventure-importer/,
        /^\.camera-view/,
        /#camera-views/,
        /^\.card-config/,
        /^\.cards-config/,
        /^\.category-browser/,
        /^\.chat-message/,
        /^\.chat-sidebar/,
        /\.combat-sidebar/,
        /\.compendium-directory/,
        /\.compendium-sidebar/,
        /^\.document-ownership/,
        /^\.effects-tooltip/,
        /^\.journal-category-config/,
        /\.journal-entry-page/,
        /^\.macro-config/,
        /^\.package-list/,
        /^\.playlists-sidebar/,
        /\.placeable-hud/,
        /^\.region-config/,
        /^\.roll-table-sheet/,
        /^\.scene-config/,
        /^\.scenes-sidebar/,
        /\.settings-sidebar/,
        /^\.sheet.journal-entry/,
        /^\.template-config/,
        /^\.token-config/,
        /^\.tour/,
        /\.ui-control/,
        /^\.wall-config/
      ],
      // Only parse CSS layers matching the following regexes.
      includeCSSLayers: [
        /^applications$/,
        /^blocks.ui$/,
        /^elements/,
        /^variables\.base$/,
        /^variables\.themes/
      ]
    });
  }
  /**
   * @param {CSSStyleSheet[]}   moduleSheets - Module stylesheet data.
   *
   * @param {CSSStyleSheet[]}   systemSheets - System stylesheet data.
   */
  static #resolveExt(moduleSheets, systemSheets) {
    const resolvedSheets = [];
    const options = { includeSelectorPartSet: /* @__PURE__ */ new Set([...this.#core.keys()]) };
    for (const sheet of systemSheets) {
      resolvedSheets.push(StyleSheetResolve.parse(sheet, options));
    }
    for (const sheet of moduleSheets) {
      resolvedSheets.push(StyleSheetResolve.parse(sheet, options));
    }
    this.#ext = this.#core.clone();
    for (const sheet of resolvedSheets) {
      this.#ext.merge(sheet);
    }
  }
}
class SvelteApp extends Application {
  /**
   * Disable Foundry v13+ warnings for AppV1.
   *
   * @type {boolean}
   * @internal
   */
  static _warnedAppV1 = true;
  static #MIN_WINDOW_HEIGHT = 50;
  static #MIN_WINDOW_WIDTH = 200;
  /**
   * Stores the first mounted component which follows the application shell contract.
   *
   * @type {import('svelte').SvelteComponent[] | null[]} Application shell.
   */
  #applicationShellHolder = [null];
  /**
   * Stores and manages application state for saving / restoring / serializing.
   *
   * @type {import('./types').SvelteApp.API.State}
   */
  #applicationState;
  /**
   * Stores the target element which may not necessarily be the main element.
   *
   * @type {HTMLElement}
   */
  #elementTarget = null;
  /**
   * Stores the content element which is set for application shells.
   *
   * @type {HTMLElement}
   */
  #elementContent = null;
  /**
   * On initial render gating of `setPosition` invoked by `Application._render` occurs, so that percentage values
   * can correctly be positioned with initial helper constraints (centered).
   *
   * @type {boolean}
   */
  #gateSetPosition = false;
  /**
   * Tracks initial `popOut` state. `handleAlwaysOnTop` will return the `popOut` state to this value.
   */
  #initialPopOut;
  /**
   * Stores initial z-index from `_renderOuter` to set to target element / Svelte component.
   *
   * @type {number}
   */
  #initialZIndex = 95;
  /**
   * Stores on mount state which is checked in _render to trigger onSvelteMount callback.
   *
   * @type {boolean}
   */
  #onMount = false;
  /**
   * The position store.
   *
   * @type {TJSPosition}
   */
  #position;
  /**
   * Contains the Svelte stores and reactive accessors.
   *
   * @type {SvelteReactive}
   */
  #reactive;
  /**
   * Stores SvelteData entries with instantiated Svelte components.
   *
   * @type {import('./internal/state-svelte/types').SvelteData[] | null[]}
   */
  #svelteData = [null];
  /**
   * Provides a helper class that combines multiple methods for interacting with the mounted components tracked in
   * #svelteData.
   *
   * @type {import('./types').SvelteApp.API.Svelte<import('./types').SvelteApp.Options>}
   */
  #getSvelteData = new GetSvelteData(this.#applicationShellHolder, this.#svelteData);
  /**
   * Contains methods to interact with the Svelte stores.
   *
   * @type {import('./internal/state-reactive/types-local').SvelteReactiveStores}
   */
  #stores;
  /**
   * @param {Partial<import('./types').SvelteApp.Options>} [options] - The options for the application.
   */
  constructor(options = {}) {
    super(options);
    if (!isObject(this.options.svelte)) {
      throw new Error(`SvelteApp - constructor - No Svelte configuration object found in 'options'.`);
    }
    if (Array.isArray(this.options.classes)) {
      this.options.classes = this.options.classes.filter(
        (entry) => entry !== "themed" && !entry?.startsWith("theme-")
      );
    }
    this.#initialPopOut = this.popOut;
    this.#applicationState = new ApplicationState(this);
    this.#position = new TJSPosition(this, {
      ...this.position,
      ...this.options,
      initial: this.options.positionInitial,
      ortho: this.options.positionOrtho,
      validator: this.options.positionValidator
    });
    delete this.position;
    Object.defineProperty(this, "position", {
      get: () => this.#position,
      set: (position) => {
        if (isObject(position)) {
          this.#position.set(position);
        }
      }
    });
    this.#reactive = new SvelteReactive(this, this.#initialPopOut);
    this.#stores = this.#reactive.initialize();
  }
  /**
   * Specifies the default options that SvelteApp supports.
   *
   * @returns {import('./types').SvelteApp.Options} options - Application options.
   * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
   */
  static get defaultOptions() {
    return (
      /** @type {import('./types').SvelteApp.Options} */
      deepMerge(super.defaultOptions, {
        alwaysOnTop: false,
        // Assigned to position. When true, the app window is floated always on top.
        containerQueryType: "inline-size",
        // App window content container query type.
        defaultCloseAnimation: true,
        // If false, the default slide close animation is not run.
        draggable: true,
        // If true, then application shells are draggable.
        focusAuto: true,
        // When true, auto-management of app focus is enabled.
        focusKeep: false,
        // When `focusAuto` and `focusKeep` is true; keeps internal focus.
        focusSource: void 0,
        // Stores any A11yFocusSource data that is applied when app is closed.
        focusTrap: true,
        // When true focus trapping / wrapping is enabled keeping focus inside app.
        headerButtonNoClose: false,
        // If true, then the close header button is removed.
        headerButtonNoLabel: false,
        // If true, then the header button labels are removed for application shells.
        headerIcon: void 0,
        // Sets a header icon given an image URL.
        headerNoTitleMinimized: false,
        // If true, then the header title is hidden when the application is minimized.
        maxHeight: void 0,
        // Assigned to position. Number specifying maximum window height.
        maxWidth: void 0,
        // Assigned to position. Number specifying maximum window width.
        minHeight: SvelteApp.#MIN_WINDOW_HEIGHT,
        // Assigned to position. Number specifying minimum window height.
        minWidth: SvelteApp.#MIN_WINDOW_WIDTH,
        // Assigned to position. Number specifying minimum window width.
        positionable: true,
        // If false, then `position.set` does not take effect.
        positionInitial: TJSPosition.Initial.browserCentered,
        // A helper for initial position placement.
        positionOrtho: true,
        // When true, TJSPosition is optimized for orthographic use.
        positionValidator: TJSPosition.Validators.transformWindow,
        // A function providing the default validator.
        sessionStorage: void 0,
        // An instance of WebStorage (session) to share across SvelteApps.
        svelte: void 0,
        // A Svelte configuration object.
        themeName: void 0,
        // An explicit theme name to apply.
        transformOrigin: "top left"
        // By default, 'top / left' respects rotation when minimizing.
      })
    );
  }
  /**
   * Returns the content element if an application shell is mounted.
   *
   * @returns {HTMLElement} Content element.
   */
  get elementContent() {
    return this.#elementContent;
  }
  /**
   * Returns the target element or main element if no target defined.
   *
   * @returns {HTMLElement} Target element.
   */
  get elementTarget() {
    return this.#elementTarget;
  }
  /**
   * Returns the reactive accessors & Svelte stores for SvelteApp.
   *
   * @returns {import('./types').SvelteApp.API.Reactive} The reactive accessors & Svelte stores.
   */
  get reactive() {
    return this.#reactive;
  }
  /**
   * Returns the application state manager.
   *
   * @returns {import('./types').SvelteApp.API.State} The application state manager.
   */
  get state() {
    return this.#applicationState;
  }
  /**
   * Returns the `Svelte` helper class w/ various methods to access the mounted application shell component.
   *
   * @returns {import('./types').SvelteApp.API.Svelte<Options>} `Svelte` / mounted application shell API.
   */
  get svelte() {
    return this.#getSvelteData;
  }
  /**
   * In this case of when a template is defined in app options `html` references the inner HTML / template. However,
   * to activate classic v1 tabs for a Svelte component the element target is passed as an array simulating JQuery as
   * the element is retrieved immediately and the core listeners use standard DOM queries.
   *
   * @protected
   * @ignore
   * @internal
   */
  _activateCoreListeners(html) {
    super._activateCoreListeners(typeof this.options.template === "string" ? html : [this.popOut ? this.#elementTarget?.firstChild : this.#elementTarget]);
  }
  /**
   * Provide an override to set this application as the active window regardless of z-index. Changes behaviour from
   * Foundry core.
   *
   * @param {object} [opts] - Optional parameters.
   *
   * @param {boolean} [opts.focus=true] - When true and the active element is not contained in the app `elementTarget`
   *        is focused..
   *
   * @param {boolean} [opts.force=false] - Force bring to top; will increment z-index by popOut order.
   *
   * @ignore
   * @internal
   */
  bringToTop({ focus = true, force = false } = {}) {
    if (this.reactive.activeWindow !== globalThis) {
      return;
    }
    if (typeof this?.options?.positionable === "boolean" && !this.options.positionable) {
      return;
    }
    if (force || globalThis.ui.activeWindow !== this) {
      const z = this.position.zIndex;
      if (this.popOut && z < foundry.applications.api.ApplicationV2._maxZ) {
        this.position.zIndex = Math.min(++foundry.applications.api.ApplicationV2._maxZ, 99999);
      } else if (!this.popOut && this.options.alwaysOnTop) {
        const newAlwaysOnTopZIndex = globalThis?.TRL_SVELTE_APP_DATA?.alwaysOnTop?.getAndIncrement();
        if (typeof newAlwaysOnTopZIndex === "number") {
          this.position.zIndex = newAlwaysOnTopZIndex;
        }
      }
    }
    const elementTarget = this.elementTarget;
    const activeElement = document.activeElement;
    if (focus && elementTarget && activeElement !== elementTarget && !elementTarget?.contains(activeElement)) {
      if (A11yHelper.isFocusTarget(activeElement)) {
        activeElement.blur();
      }
      elementTarget?.focus();
    }
    globalThis.ui.activeWindow = this;
  }
  /**
   * Note: This method is fully overridden and duplicated as Svelte components need to be destroyed manually and the
   * best visual result is to destroy them after the default slide up animation occurs, but before the element
   * is removed from the DOM.
   *
   * If you destroy the Svelte components before the slide up animation the Svelte elements are removed immediately
   * from the DOM. The purpose of overriding ensures the slide up animation is always completed before
   * the Svelte components are destroyed and then the element is removed from the DOM.
   *
   * Close the application and unregisters references to it within UI mappings.
   * This function returns a Promise which resolves once the window closing animation concludes.
   *
   * @param {object}   [options] - Optional parameters.
   *
   * @param {boolean}  [options.force] - Force close regardless of render state.
   *
   * @returns {Promise<void>}    A Promise which resolves once the application is closed.
   *
   * @ignore
   * @internal
   */
  async close(options = {}) {
    const states = Application.RENDER_STATES;
    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) {
      return;
    }
    const el = this.#elementTarget;
    if (!el) {
      this._state = states.CLOSED;
      return;
    }
    if (CrossWindow.getWindow(el, { throws: false }) !== globalThis) {
      return;
    }
    this._state = states.CLOSING;
    this.#stores.unsubscribe();
    const content = el.querySelector(".window-content");
    if (content) {
      content.style.overflow = "hidden";
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = "hidden";
      }
    }
    for (const cls of this.constructor._getInheritanceChain()) {
      Hooks.call(`close${cls.name}`, this, $(el));
    }
    const animate = typeof this.options.defaultCloseAnimation === "boolean" ? this.options.defaultCloseAnimation : true;
    if (animate) {
      el.style.minHeight = "0";
      const { paddingBottom, paddingTop } = globalThis.getComputedStyle(el);
      await el.animate([
        { maxHeight: `${el.clientHeight}px`, paddingTop, paddingBottom },
        { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
      ], { duration: 250, easing: "ease-in", fill: "forwards" }).finished;
    }
    const svelteDestroyPromises = [];
    for (const entry of this.#svelteData) {
      if (!isObject(entry)) {
        continue;
      }
      svelteDestroyPromises.push(TJSSvelte.util.outroAndDestroy(entry.component));
      const eventbus = entry.config.eventbus;
      if (isObject(eventbus) && typeof eventbus.off === "function") {
        eventbus.off();
        entry.config.eventbus = void 0;
      }
    }
    await Promise.allSettled(svelteDestroyPromises);
    TJSAppIndex.delete(this);
    this.#svelteData[0] = null;
    el.remove();
    this.position.state.restore({
      name: "#beforeMinimized",
      properties: ["width", "height"],
      silent: true,
      remove: true
    });
    this.#applicationShellHolder[0] = null;
    this._element = null;
    this.#elementContent = null;
    this.#elementTarget = null;
    delete globalThis.ui.windows[this.appId];
    this._minimized = false;
    this._scrollPositions = null;
    this._state = states.CLOSED;
    this.#onMount = false;
    this.#stores.uiStateUpdate((storeOptions) => deepMerge(storeOptions, { minimized: this._minimized }));
    A11yHelper.applyFocusSource(this.options.focusSource);
    delete this.options.focusSource;
  }
  /**
   * Specify the set of config buttons which should appear in the SvelteApp header. Buttons should be returned as
   * an Array of objects. The header buttons which are added to the application can be modified by the
   * `getApplicationHeaderButtons` hook.
   *
   * SvelteApp extends the button functionality with full reactivity for state changes during callbacks. Callbacks
   * receive the button data and can modify it to update the button state.
   *
   * @privateRemarks Provide a basic override implementation to extend types with additional SvelteApp functionality.
   *
   * @returns {import('./types').SvelteApp.HeaderButton[]} All header buttons.
   * @protected
   */
  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    const closeButton = buttons.find((entry) => entry?.class === "close");
    if (closeButton) {
      closeButton.onclick = () => {
        globalThis?.game?.tooltip?.deactivate?.();
        this.close();
      };
    }
    return buttons;
  }
  /**
   * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
   * pop-out of Application or provide no template and render into a document fragment which is then attached to the
   * DOM.
   *
   * @protected
   * @ignore
   * @internal
   */
  _injectHTML() {
    this.reactive.updateHeaderButtons();
    const elementRootUpdate = () => {
      let cntr = 0;
      return (elementRoot) => {
        if (elementRoot !== null && elementRoot !== void 0 && cntr++ > 0) {
          this.#updateApplicationShell();
          return true;
        }
        return false;
      };
    };
    if (!isObject(this.options.svelte)) {
      throw new Error(`SvelteApp - _injectHTML - No Svelte configuration object found in 'options'.`);
    }
    const svelteData = loadSvelteConfig({
      app: this,
      config: this.options.svelte,
      elementRootUpdate
    });
    if (this.svelte.appShell !== null) {
      throw new Error(
        `SvelteApp - _injectHTML - An application shell is already mounted; offending config:
${JSON.stringify(this.options.svelte)}`
      );
    }
    this.#applicationShellHolder[0] = svelteData.component;
    if (TJSSvelte.util.isHMRProxy(svelteData.component) && Array.isArray(svelteData.component?.$$?.on_hmr)) {
      svelteData.component.$$.on_hmr.push(() => () => this.#updateApplicationShell());
    }
    this.#svelteData[0] = svelteData;
    this._element = $(this.svelte.appShell.elementRoot);
    this.#elementContent = hasGetter(this.svelte.appShell, "elementContent") ? this.svelte.appShell.elementContent : null;
    this.#elementTarget = hasGetter(this.svelte.appShell, "elementTarget") ? this.svelte.appShell.elementTarget : this.svelte.appShell.elementRoot;
    if (typeof this.options.positionable === "boolean" && this.options.positionable) {
      this.#elementTarget.style.zIndex = typeof this.options.zIndex === "number" ? this.options.zIndex : this.#initialZIndex ?? 95;
    }
    this.#stores.subscribe();
  }
  /**
   * Provides a mechanism to update the UI options store for maximized.
   *
   * Note: the sanity check is duplicated from {@link Application.maximize} the store is updated _before_
   * performing the rest of animations. This allows application shells to remove / show any resize handlers
   * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApp.minimize}
   * to animate the content area.
   *
   * @param {object}   [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.animate=true] - When true perform default maximizing animation.
   *
   * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
   */
  async maximize({ animate = true, duration = 0.1 } = {}) {
    if (!this.popOut && !this.options.alwaysOnTop || [false, null].includes(this._minimized)) {
      return;
    }
    this._minimized = null;
    const durationMS = duration * 1e3;
    const element2 = this.elementTarget;
    const header = element2.querySelector(".window-header");
    const content = element2.querySelector(".window-content");
    const positionBefore = this.position.state.get({ name: "#beforeMinimized" });
    if (animate) {
      await this.position.state.restore({
        name: "#beforeMinimized",
        async: true,
        animateTo: true,
        properties: ["width"],
        cancelable: false,
        duration: 0.1
      });
    }
    element2.classList.remove("minimized");
    for (let cntr = header.children.length; --cntr >= 0; ) {
      header.children[cntr].style.display = null;
    }
    content.style.display = null;
    let constraints;
    if (animate) {
      ({ constraints } = this.position.state.restore({
        name: "#beforeMinimized",
        animateTo: true,
        properties: ["height"],
        remove: true,
        cancelable: false,
        duration
      }));
    } else {
      ({ constraints } = this.position.state.remove({ name: "#beforeMinimized" }));
    }
    await content.animate([
      { maxHeight: 0, paddingTop: 0, paddingBottom: 0, offset: 0 },
      { ...constraints, offset: 1 },
      { maxHeight: "100%", offset: 1 }
    ], { duration: durationMS, fill: "forwards" }).finished;
    this.position.set({
      minHeight: positionBefore.minHeight ?? this.options?.minHeight ?? SvelteApp.#MIN_WINDOW_HEIGHT,
      minWidth: positionBefore.minWidth ?? this.options?.minWidth ?? SvelteApp.#MIN_WINDOW_WIDTH
    });
    element2.style.minWidth = null;
    element2.style.minHeight = null;
    this._minimized = false;
    setTimeout(() => {
      content.style.overflow = null;
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = null;
      }
    }, 50);
    this.#stores.uiStateUpdate((options) => deepMerge(options, { minimized: false }));
  }
  /**
   * Provides a mechanism to update the UI options store for minimized.
   *
   * Note: the sanity check is duplicated from {@link Application.minimize} the store is updated _before_
   * performing the rest of animations. This allows application shells to remove / show any resize handlers
   * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApp.minimize}
   * to animate the content area.
   *
   * @param {object}   [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.animate=true] - When true perform default minimizing animation.
   *
   * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
   */
  async minimize({ animate = true, duration = 0.1 } = {}) {
    if (!this.rendered || !this.popOut && !this.options.alwaysOnTop || [true, null].includes(this._minimized)) {
      return;
    }
    this.#stores.uiStateUpdate((options) => deepMerge(options, { minimized: true }));
    this._minimized = null;
    const durationMS = duration * 1e3;
    const element2 = this.elementTarget;
    const header = element2.querySelector(".window-header");
    const content = element2.querySelector(".window-content");
    const beforeMinWidth = this.position.minWidth;
    const beforeMinHeight = this.position.minHeight;
    this.position.set({ minWidth: 100, minHeight: 30 });
    element2.style.minWidth = "100px";
    element2.style.minHeight = "30px";
    if (content) {
      content.style.overflow = "hidden";
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = "hidden";
      }
    }
    const { paddingBottom, paddingTop } = globalThis.getComputedStyle(content);
    const constraints = {
      maxHeight: `${content.clientHeight}px`,
      paddingTop,
      paddingBottom
    };
    if (animate) {
      const animation = content.animate([
        constraints,
        { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
      ], { duration: durationMS, fill: "forwards" });
      animation.finished.then(() => content.style.display = "none");
    } else {
      setTimeout(() => content.style.display = "none", durationMS);
    }
    const saved = this.position.state.save({ name: "#beforeMinimized", constraints });
    saved.minWidth = beforeMinWidth;
    saved.minHeight = beforeMinHeight;
    const headerOffsetHeight = header.offsetHeight;
    this.position.minHeight = headerOffsetHeight;
    if (animate) {
      await this.position.animate.to({ height: headerOffsetHeight }, { cancelable: false, duration }).finished;
    }
    for (let cntr = header.children.length; --cntr >= 0; ) {
      let className = header.children[cntr]?.className;
      className = className?.baseVal ?? className;
      if (typeof className !== "string" || className.includes("window-title") || className.includes("close")) {
        continue;
      }
      if (className.includes("keep-minimized")) {
        header.children[cntr].style.display = "block";
        continue;
      }
      header.children[cntr].style.display = "none";
    }
    if (animate) {
      await this.position.animate.to({ width: SvelteApp.#MIN_WINDOW_WIDTH }, {
        cancelable: false,
        duration: 0.1
      }).finished;
    }
    element2.classList.add("minimized");
    this._minimized = true;
  }
  /**
   * Provides a callback after all Svelte components are initialized.
   */
  onSvelteMount() {
  }
  // eslint-disable-line no-unused-vars
  /**
   * Provides a callback after the main application shell is remounted. This may occur during HMR / hot module
   * replacement or directly invoked from the `elementRootUpdate` callback passed to the application shell component
   * context.
   */
  onSvelteRemount() {
  }
  // eslint-disable-line no-unused-vars
  /**
   * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
   * application frame / title for pop-out applications.
   *
   * @protected
   * @ignore
   * @internal
   */
  _replaceHTML(element2, html) {
    if (!element2.length) {
      return;
    }
    this.reactive.updateHeaderButtons();
  }
  /**
   * Provides an override verifying that a new Application being rendered for the first time doesn't have a
   * corresponding DOM element already loaded. This is a check that only occurs when `this._state` is
   * `Application.RENDER_STATES.NONE`. It is useful in particular when SvelteApp has a static ID
   * explicitly set in `this.options.id` and long intro / outro transitions are assigned. If a new application
   * sharing this static ID attempts to open / render for the first time while an existing DOM element sharing
   * this static ID exists then the initial render is cancelled below rather than crashing later in the render
   * cycle {@link TJSPosition.set}.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _render(force = false, options = {}) {
    if (isObject(options?.focusSource)) {
      this.options.focusSource = options.focusSource;
    }
    const activeWindow = this.reactive.activeWindow;
    try {
      if (this._state === Application.RENDER_STATES.NONE && A11yHelper.isFocusTarget(activeWindow.document.querySelector(`#${this.id}`))) {
        console.warn(`SvelteApp - _render: A DOM element already exists for CSS ID '${this.id}'. Cancelling initial render for new application with appId '${this.appId}'.`);
        return;
      }
    } catch (err) {
      console.warn(`SvelteApp - _render: Potentially malformed application ID '${this.id}'. Cancelling initial render for new application with appId '${this.appId}'.`);
      return;
    }
    this.#gateSetPosition = true;
    const popOut = typeof this.options.alwaysOnTop === "boolean" && this.options.alwaysOnTop ? false : this.popOut;
    await super._render(force, { ...options, popOut });
    this.#gateSetPosition = false;
    if ([Application.RENDER_STATES.CLOSING, Application.RENDER_STATES.RENDERING].includes(this._state)) {
      return;
    }
    if (!force && this._state <= Application.RENDER_STATES.NONE) {
      return;
    }
    if (!this._minimized) {
      this.#position.set({
        left: typeof this.options?.left === "string" ? this.options.left : void 0,
        height: typeof this.options?.height === "string" ? this.options.height : void 0,
        maxHeight: typeof this.options?.maxHeight === "string" ? this.options.maxHeight : void 0,
        maxWidth: typeof this.options?.maxWidth === "string" ? this.options.maxWidth : void 0,
        minHeight: typeof this.options?.minHeight === "string" ? this.options.minHeight : void 0,
        minWidth: typeof this.options?.minWidth === "string" ? this.options.minWidth : void 0,
        rotateX: typeof this.options?.rotateX === "string" ? this.options.rotateX : void 0,
        rotateY: typeof this.options?.rotateY === "string" ? this.options.rotateY : void 0,
        rotateZ: typeof this.options?.rotateZ === "string" ? this.options.rotateZ : void 0,
        rotation: typeof this.options?.rotation === "string" ? this.options.rotation : void 0,
        top: typeof this.options?.top === "string" ? this.options.top : void 0,
        width: typeof this.options?.width === "string" ? this.options.width : void 0,
        ...options
      });
    }
    if (!this.#onMount) {
      this.#onMount = true;
      TJSAppIndex.add(this);
      if (typeof this.options.alwaysOnTop === "boolean" && this.options.alwaysOnTop) {
        handleAlwaysOnTop(this, true, this.#initialPopOut);
      }
      nextAnimationFrame().then(() => this.onSvelteMount());
    }
  }
  /**
   * Render the inner application content. Provide an empty JQuery element per the core Foundry API.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _renderInner() {
    const activeWindow = this.reactive.activeWindow;
    const html = activeWindow.document.createDocumentFragment();
    return $(html);
  }
  /**
   * Stores the initial z-index set in `_renderOuter` which is used in `_injectHTML` to set the target element
   * z-index after the Svelte component is mounted.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _renderOuter() {
    const html = await super._renderOuter();
    this.#initialZIndex = html[0].style.zIndex;
    return html;
  }
  /**
   * All calculation and updates of position are implemented in {@link TJSPosition.set}.
   * This allows position to be fully reactive and in control of updating inline styles for the application.
   *
   * This method remains for backward compatibility with Foundry. If you have a custom override quite likely you need
   * to update to using the {@link TJSPosition.validators} / ValidatorAPI functionality.
   *
   * @param {TJSPosition.API.Data.TJSPositionDataRelative}   [position] - TJSPosition data.
   *
   * @returns {TJSPosition} The updated position object for the application containing the new values.
   * @ignore
   */
  setPosition(position) {
    return !this.#gateSetPosition ? this.position.set(position) : this.position;
  }
  /**
   * This method is invoked by the `elementRootUpdate` callback that is added to the external context passed to
   * Svelte components. When invoked it updates the local element roots tracked by SvelteApp.
   *
   * This method may also be invoked by HMR / hot module replacement via `svelte-hmr`.
   */
  #updateApplicationShell() {
    const applicationShell = this.svelte.appShell;
    if (applicationShell !== null) {
      this._element = $(applicationShell.elementRoot);
      this.#elementContent = hasGetter(applicationShell, "elementContent") ? applicationShell.elementContent : null;
      this.#elementTarget = hasGetter(applicationShell, "elementTarget") ? applicationShell.elementTarget : null;
      if (this.#elementTarget === null) {
        this.#elementTarget = typeof this.options.selectorTarget === "string" ? this._element[0].querySelector(this.options.selectorTarget) : this._element[0];
      }
      if (typeof this.options.positionable === "boolean" && this.options.positionable) {
        this.#elementTarget.style.zIndex = typeof this.options.zIndex === "number" ? this.options.zIndex : this.#initialZIndex ?? 95;
        super.bringToTop();
        this.position.set(this.position.get());
      }
      super._activateCoreListeners([this.popOut ? this.#elementTarget?.firstChild : this.#elementTarget]);
      if (typeof this.options.alwaysOnTop === "boolean" && this.options.alwaysOnTop) {
        handleAlwaysOnTop(this, true, this.#initialPopOut);
      }
      nextAnimationFrame().then(() => {
        this.render();
        this.onSvelteRemount();
      });
    }
  }
}
class PopoutSupport {
  static initialize() {
    Hooks.on("PopOut:loading", (app, popout) => {
      if (app instanceof SvelteApp) {
        app.position.enabled = false;
        app.state.save({
          name: "#beforePopout",
          headerButtonNoClose: app.reactive.headerButtonNoClose
        });
        app.reactive.activeWindow = popout;
        app.reactive.headerButtonNoClose = true;
      }
    });
    Hooks.on("PopOut:popin", (app) => this.#handleRejoin(app));
    Hooks.on("PopOut:close", (app) => this.#handleRejoin(app));
  }
  /**
   * Handles rejoining the app to main browser window.
   *
   * @param {Application} app - The target app.
   */
  static #handleRejoin(app) {
    if (app instanceof SvelteApp) {
      app.position.enabled = true;
      const beforeData = app.state.remove({ name: "#beforePopout" });
      if (beforeData) {
        app.reactive.headerButtonNoClose = beforeData?.headerButtonNoClose ?? false;
      }
      app.reactive.activeWindow = void 0;
    }
  }
}
class SvelteAppData {
  static #initialized = false;
  /**
   * @returns {number} Version number for SvelteAppData.
   */
  static get VERSION() {
    return 1;
  }
  static get alwaysOnTop() {
    return AlwaysOnTop;
  }
  static initialize() {
    if (this.#initialized) {
      return;
    }
    this.#initialized = true;
    const currentVersion = globalThis?.TRL_SVELTE_APP_DATA?.VERSION;
    if (typeof currentVersion !== "number" || currentVersion < this.VERSION) {
      globalThis.TRL_SVELTE_APP_DATA = this;
    }
  }
}
class AlwaysOnTop {
  /**
   * Stores the max z-index.
   *
   * @type {number}
   */
  static #max = 2 ** 31 - 1e3;
  /**
   * Stores the min z-index.
   *
   * @type {number}
   */
  static #min = 2 ** 31 - 1e5;
  /**
   * Stores the current z-index for the top most `alwaysOnTop` app.
   *
   * @type {number}
   */
  static #current = this.#min;
  /**
   * @returns {number} Increments the current always on top z-index and returns it.
   */
  static getAndIncrement() {
    this.#current = Math.min(++this.#current, this.#max);
    return this.#current;
  }
  static get current() {
    return this.#current;
  }
  static get max() {
    return this.#max;
  }
  static get min() {
    return this.#min;
  }
}
SvelteAppData.initialize();
ThemeObserver.initialize();
PopoutSupport.initialize();
function getRoutePrefix(url) {
  return globalThis.foundry.utils.getRoute(url);
}
const cursorCSSVariables = {
  "--tjs-cursor-all-scroll": "all-scroll",
  "--tjs-cursor-all-scroll-down": "all-scroll",
  "--tjs-cursor-alias": "alias",
  "--tjs-cursor-alias-down": "alias",
  "--tjs-cursor-cell": "cell",
  "--tjs-cursor-cell-down": "cell",
  "--tjs-cursor-copy": "copy",
  "--tjs-cursor-copy-down": "copy",
  "--tjs-cursor-context-menu": "context-menu",
  "--tjs-cursor-context-menu-down": "context-menu",
  "--tjs-cursor-crosshair": "crosshair",
  "--tjs-cursor-crosshair-down": "crosshair",
  "--tjs-cursor-default": "default",
  "--tjs-cursor-default-down": "default",
  "--tjs-cursor-grab": "grab",
  "--tjs-cursor-grab-down": "var(--tjs-cursor-grabbing, grabbing)",
  "--tjs-cursor-grabbing": "grabbing",
  "--tjs-cursor-grabbing-down": "grabbing",
  "--tjs-cursor-help": "help",
  "--tjs-cursor-help-down": "help",
  "--tjs-cursor-pointer": "pointer",
  "--tjs-cursor-pointer-down": "pointer",
  "--tjs-cursor-move": "move",
  "--tjs-cursor-move-down": "move",
  "--tjs-cursor-no-drop": "no-drop",
  "--tjs-cursor-no-drop-down": "no-drop",
  "--tjs-cursor-not-allowed": "not-allowed",
  "--tjs-cursor-not-allowed-down": "not-allowed",
  "--tjs-cursor-progress": "progress",
  "--tjs-cursor-progress-down": "progress",
  "--tjs-cursor-resize-col": "col-resize",
  "--tjs-cursor-resize-col-down": "col-resize",
  "--tjs-cursor-resize-e": "e-resize",
  "--tjs-cursor-resize-e-down": "e-resize",
  "--tjs-cursor-resize-ew": "ew-resize",
  "--tjs-cursor-resize-ew-down": "ew-resize",
  "--tjs-cursor-resize-n": "n-resize",
  "--tjs-cursor-resize-n-down": "n-resize",
  "--tjs-cursor-resize-ne": "ne-resize",
  "--tjs-cursor-resize-ne-down": "ne-resize",
  "--tjs-cursor-resize-nesw": "nesw-resize",
  "--tjs-cursor-resize-nesw-down": "nesw-resize",
  "--tjs-cursor-resize-ns": "ns-resize",
  "--tjs-cursor-resize-ns-down": "ns-resize",
  "--tjs-cursor-resize-nw": "nw-resize",
  "--tjs-cursor-resize-nw-down": "nw-resize",
  "--tjs-cursor-resize-nwse": "nwse-resize",
  "--tjs-cursor-resize-nwse-down": "nwse-resize",
  "--tjs-cursor-resize-row": "row-resize",
  "--tjs-cursor-resize-row-down": "row-resize",
  "--tjs-cursor-resize-s": "s-resize",
  "--tjs-cursor-resize-s-down": "s-resize",
  "--tjs-cursor-resize-se": "se-resize",
  "--tjs-cursor-resize-se-down": "se-resize",
  "--tjs-cursor-resize-sw": "sw-resize",
  "--tjs-cursor-resize-sw-down": "sw-resize",
  "--tjs-cursor-resize-w": "w-resize",
  "--tjs-cursor-resize-w-down": "w-resize",
  "--tjs-cursor-text": "text",
  "--tjs-cursor-text-down": "text",
  "--tjs-cursor-text-vertical": "vertical-text",
  "--tjs-cursor-text-vertical-down": "vertical-text",
  "--tjs-cursor-wait": "wait",
  "--tjs-cursor-wait-down": "wait",
  "--tjs-cursor-zoom-in": "zoom-in",
  "--tjs-cursor-zoom-in-down": "zoom-in",
  "--tjs-cursor-zoom-out": "zoom-out",
  "--tjs-cursor-zoom-out-down": "zoom-out"
};
class FVTTAppTheme {
  /**
   * Generate all app classes with applied core or explicitly set theme.
   *
   * @param {Set<string>} activeClasses - Active app classes Set.
   *
   * @param {string} coreTheme - Current core theme class.
   *
   * @param {string} appThemeName - Any explicitly set app theme name override.
   *
   * @returns {string} All app classes.
   */
  static appClasses(activeClasses, coreTheme, appThemeName) {
    const classes = new Set(activeClasses);
    for (const entry of classes) {
      if (entry.startsWith("theme-")) {
        classes.delete(entry);
      }
    }
    classes.add("themed");
    classes.add(appThemeName ? `theme-${appThemeName}` : coreTheme);
    return Array.from(classes).join(" ");
  }
}
class FVTTConfigure {
  static #initialized = false;
  static initialize() {
    if (this.#initialized) {
      return;
    }
    const manager = StyleManager.create({
      id: "__tjs-runtime-vars",
      version: "0.1.1",
      layerName: "variables.tjs-runtime-vars",
      rules: {
        themeDark: "body, .themed.theme-dark",
        themeLight: ".themed.theme-light"
      }
    });
    if (!manager?.isConnected) {
      this.#initialized = true;
      return;
    }
    this.#initialized = true;
    document?.["#__trl-root-styles"]?.remove?.();
    const themeDarkRoot = manager.get("themeDark");
    const themeLight = manager.get("themeLight");
    Hooks.once("ready", () => this.#setCoreInlineStyles(themeDarkRoot));
    themeDarkRoot.setProperties(cursorCSSVariables);
    this.#app(themeDarkRoot, themeLight);
    Hooks.on("PopOut:loading", (app, popout) => {
      popout.document.addEventListener(
        "DOMContentLoaded",
        () => manager.clone({ document: popout.document, force: true })
      );
    });
  }
  /**
   * @param {import('@typhonjs-fvtt/runtime/util/dom/style').StyleManager.RuleManager}  themeDarkRoot -
   *
   * @param {import('@typhonjs-fvtt/runtime/util/dom/style').StyleManager.RuleManager}  themeLight -
   */
  static #app(themeDarkRoot, themeLight) {
    const opts = { camelCase: true };
    const propsApp = FoundryStyles.ext.get(".application", opts);
    const propsAppDark = FoundryStyles.ext.get(".application", { ...opts, resolve: [
      ".themed.theme-dark .application"
    ] });
    const propsAppHeader = FoundryStyles.ext.get(".application .window-header", { ...opts, resolve: [
      ".application",
      ".themed.theme-dark .application"
    ] });
    const propsAppHeaderBtn = FoundryStyles.ext.get(".application .window-header button.header-control", opts);
    const propsAppHandle = FoundryStyles.ext.get(".application .window-resize-handle", opts);
    const propsAppHandleDark = FoundryStyles.ext.get(".themed.theme-dark.application .window-resize-handle", opts);
    const propsBody = FoundryStyles.ext.get("body", opts);
    themeDarkRoot.setProperties({
      // `:root` properties applying to all themes ----------------------------------------------------------------
      // For `TJSApplicationShell.svelte` app background.
      "--tjs-app-background": `url(${getRoutePrefix("/ui/denim075.png")})`,
      "--tjs-app-color": propsApp?.color ?? "var(--color-text-primary)",
      "--tjs-app-font-family": propsBody?.fontFamily ?? "var(--font-body)",
      "--tjs-app-font-size": propsApp?.fontSize ?? "var(--font-size-14)",
      // For `TJSApplicationHeader.svelte`
      "--tjs-app-header-flex": propsAppHeader?.flex ?? "0 0 var(--header-height)",
      "--tjs-app-header-font-size": propsAppHeader?.fontSize ?? "var(--font-size-13)",
      "--tjs-app-header-height": propsApp?.["--header-height"] ?? "36px",
      // For `TJSHeaderButton.svelte / core only provides one set of properties across themes.
      "--tjs-app-header-button-border": propsAppHeaderBtn?.border ?? "none",
      "--tjs-app-header-button-margin": propsAppHeaderBtn?.margin ?? "0",
      "--tjs-app-header-button-size": propsAppHeaderBtn?.["--button-size"] ?? "1.5rem",
      "--tjs-app-header-button-color": propsAppHeaderBtn?.["--button-text-color"] ?? "var(--color-light-1)",
      // For `ResizeHandle.svelte` / the resize handle.
      "--tjs-app-resize-handle-background": propsAppHandle?.background ?? `url(${getRoutePrefix("/ui/resize-handle.webp")}) center center / contain no-repeat transparent`,
      "--tjs-app-resize-handle-inset": propsAppHandle?.inset ?? "auto 1px 1px auto",
      "--tjs-app-resize-handle-position": propsAppHandle?.position ?? "absolute",
      "--tjs-app-resize-handle-height": propsAppHandle?.height ?? "11x",
      "--tjs-app-resize-handle-width": propsAppHandle?.width ?? "11px",
      // Explicit dark theme properties ---------------------------------------------------------------------------
      // For `TJSApplicationShell.svelte`.
      "--tjs-app-border": propsAppDark?.border ?? "1px solid var(--color-cool-4)",
      // For `TJSApplicationHeader.svelte
      "--tjs-app-header-background": propsAppHeader?.background ?? "rgba(0, 0, 0, 0.5)",
      "--tjs-app-header-border-bottom": propsAppHeader?.borderBottom ?? "1px solid var(--color-cool-4)",
      "--tjs-app-header-color": propsAppHeader?.color ?? "var(--color-light-1)",
      // For `ResizeHandle.svelte` / invert the resize handle.
      "--tjs-app-resize-handle-filter": propsAppHandleDark?.filter ?? "invert(1)"
    });
    const propsAppLight = FoundryStyles.ext.get(".application", {
      camelCase: true,
      resolve: "body.theme-light .application"
    });
    const propsAppHeaderLight = FoundryStyles.ext.get(".application .window-header", {
      camelCase: true,
      resolve: "body.theme-light .application"
    });
    themeLight.setProperties({
      // For `TJSApplicationShell.svelte`.
      "--tjs-app-border": propsAppLight?.border ?? "1px solid var(--color-cool-4)",
      // For `TJSApplicationHeader.svelte`
      "--tjs-app-header-background": propsAppHeaderLight?.background ?? "var(--color-dark-3)",
      "--tjs-app-header-border-bottom": propsAppHeaderLight?.borderBottom ?? "1px solid green",
      // '1px solid var(--color-cool-4)',
      // For `ResizeHandle.svelte` / cancel invert of the resize handle / there is no core style to set.
      "--tjs-app-resize-handle-filter": "none"
    });
  }
  /**
   * Sets any top level inline styles to TRL CSS variables defined in root `<html>` element by Foundry or game system
   * override.
   *
   * @param {import('@typhonjs-fvtt/runtime/util/dom/style').StyleManager.RuleManager}   ruleManager - Target rule manager.
   */
  static #setCoreInlineStyles(ruleManager) {
    const htmlStyles = StyleParse.cssText(document.documentElement.style.cssText);
    for (const key in htmlStyles) {
      if (key.startsWith("--cursor-")) {
        const tjsCursorKey = key.replace(/^--cursor-/, "--tjs-cursor-");
        if (ruleManager.hasProperty(tjsCursorKey)) {
          ruleManager.setProperty(tjsCursorKey, htmlStyles[key]);
        }
      }
    }
  }
}
class ResizeObserverManager {
  /** @type {Map<HTMLElement, import('./types-local').ResizeObserverSubscriber[]>} */
  #elMap = /* @__PURE__ */ new Map();
  /** @type {ResizeObserver} */
  #resizeObserver;
  /**
   * Defines the various shape / update type of the given target.
   *
   * @type {{ [key: string]: number }}
   */
  static #updateTypes = Object.freeze({
    none: 0,
    attribute: 1,
    function: 2,
    resizeObserved: 3,
    setContentBounds: 4,
    setDimension: 5,
    storeObject: 6,
    storesObject: 7
  });
  constructor() {
    this.#resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const subscribers = this.#elMap.get(entry?.target);
        if (Array.isArray(subscribers)) {
          const contentWidth = entry.contentRect.width;
          const contentHeight = entry.contentRect.height;
          for (const subscriber of subscribers) {
            ResizeObserverManager.#updateSubscriber(subscriber, contentWidth, contentHeight);
          }
        }
      }
    });
  }
  /**
   * Add an {@link HTMLElement} and {@link ResizeObserverData.ResizeTarget} instance for monitoring. Create cached
   * style attributes for the given element include border & padding dimensions for offset width / height calculations.
   *
   * @param {HTMLElement}    el - The element to observe.
   *
   * @param {import('./types').ResizeObserverData.ResizeTarget} target - A target that contains one of several
   *        mechanisms for updating resize data.
   */
  add(el, target) {
    if (!CrossWindow.isHTMLElement(el)) {
      throw new TypeError(`ResizeObserverManager.add error: 'el' is not a HTMLElement.`);
    }
    if (this.#hasTarget(el, target)) {
      return;
    }
    const updateType = ResizeObserverManager.#getUpdateType(target);
    if (updateType === 0) {
      throw new Error(`ResizeObserverManager.add error: 'target' is not a valid ResizeObserverManager target.`);
    }
    const computed = globalThis.getComputedStyle(el);
    const borderBottom = StyleParse.pixels(el.style.borderBottom) ?? StyleParse.pixels(computed.borderBottom) ?? 0;
    const borderLeft = StyleParse.pixels(el.style.borderLeft) ?? StyleParse.pixels(computed.borderLeft) ?? 0;
    const borderRight = StyleParse.pixels(el.style.borderRight) ?? StyleParse.pixels(computed.borderRight) ?? 0;
    const borderTop = StyleParse.pixels(el.style.borderTop) ?? StyleParse.pixels(computed.borderTop) ?? 0;
    const paddingBottom = StyleParse.pixels(el.style.paddingBottom) ?? StyleParse.pixels(computed.paddingBottom) ?? 0;
    const paddingLeft = StyleParse.pixels(el.style.paddingLeft) ?? StyleParse.pixels(computed.paddingLeft) ?? 0;
    const paddingRight = StyleParse.pixels(el.style.paddingRight) ?? StyleParse.pixels(computed.paddingRight) ?? 0;
    const paddingTop = StyleParse.pixels(el.style.paddingTop) ?? StyleParse.pixels(computed.paddingTop) ?? 0;
    const data = {
      updateType,
      target,
      // Stores most recent contentRect.width and contentRect.height values from ResizeObserver.
      contentWidth: 0,
      contentHeight: 0,
      // Convenience data for total border & padding for offset width & height calculations.
      styles: {
        additionalWidth: borderLeft + borderRight + paddingLeft + paddingRight,
        additionalHeight: borderTop + borderBottom + paddingTop + paddingBottom
      }
    };
    if (this.#elMap.has(el)) {
      const subscribers = this.#elMap.get(el);
      subscribers.push(data);
    } else {
      this.#elMap.set(el, [data]);
    }
    this.#resizeObserver.observe(el);
  }
  /**
   * Clears and unobserves all currently tracked elements and managed targets.
   */
  clear() {
    for (const el of this.#elMap.keys()) {
      this.#resizeObserver.unobserve(el);
    }
    this.#elMap.clear();
  }
  /**
   * Removes all {@link ResizeObserverData.ResizeTarget} instances for the given element from monitoring when just an
   * element is provided otherwise removes a specific target from the monitoring map. If no more targets remain then
   * the element is removed from monitoring.
   *
   * @param {HTMLElement} el - Element to remove from monitoring.
   *
   * @param {import('./types').ResizeObserverData.ResizeTarget} [target] - A specific target to remove from monitoring.
   */
  remove(el, target = void 0) {
    const subscribers = this.#elMap.get(el);
    if (Array.isArray(subscribers)) {
      if (target !== void 0) {
        const index = subscribers.findIndex((entry) => entry.target === target);
        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      } else {
        subscribers.length = 0;
      }
      if (subscribers.length === 0) {
        this.#elMap.delete(el);
        this.#resizeObserver.unobserve(el);
      }
    }
  }
  /**
   * Provides a function that when invoked with an element updates the cached styles for each subscriber of the
   * element.
   *
   * The style attributes cached to calculate offset height / width include border & padding dimensions. You only need
   * to update the cache if you change border or padding attributes of the element.
   *
   * @param {HTMLElement} el - A HTML element.
   */
  updateCache(el) {
    const subscribers = this.#elMap.get(el);
    if (Array.isArray(subscribers)) {
      const computed = globalThis.getComputedStyle(el);
      const borderBottom = StyleParse.pixels(el.style.borderBottom) ?? StyleParse.pixels(computed.borderBottom) ?? 0;
      const borderLeft = StyleParse.pixels(el.style.borderLeft) ?? StyleParse.pixels(computed.borderLeft) ?? 0;
      const borderRight = StyleParse.pixels(el.style.borderRight) ?? StyleParse.pixels(computed.borderRight) ?? 0;
      const borderTop = StyleParse.pixels(el.style.borderTop) ?? StyleParse.pixels(computed.borderTop) ?? 0;
      const paddingBottom = StyleParse.pixels(el.style.paddingBottom) ?? StyleParse.pixels(computed.paddingBottom) ?? 0;
      const paddingLeft = StyleParse.pixels(el.style.paddingLeft) ?? StyleParse.pixels(computed.paddingLeft) ?? 0;
      const paddingRight = StyleParse.pixels(el.style.paddingRight) ?? StyleParse.pixels(computed.paddingRight) ?? 0;
      const paddingTop = StyleParse.pixels(el.style.paddingTop) ?? StyleParse.pixels(computed.paddingTop) ?? 0;
      const additionalWidth = borderLeft + borderRight + paddingLeft + paddingRight;
      const additionalHeight = borderTop + borderBottom + paddingTop + paddingBottom;
      for (const subscriber of subscribers) {
        subscriber.styles.additionalWidth = additionalWidth;
        subscriber.styles.additionalHeight = additionalHeight;
        ResizeObserverManager.#updateSubscriber(subscriber, subscriber.contentWidth, subscriber.contentHeight);
      }
    }
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Determines the shape of the target instance regarding valid update mechanisms to set width & height changes.
   *
   * @param {import('./types').ResizeObserverData.ResizeTarget}  target - The target instance.
   *
   * @returns {number} Update type value.
   */
  static #getUpdateType(target) {
    if (typeof target?.resizeObserved === "function") {
      return this.#updateTypes.resizeObserved;
    }
    if (typeof target?.setDimension === "function") {
      return this.#updateTypes.setDimension;
    }
    if (typeof target?.setContentBounds === "function") {
      return this.#updateTypes.setContentBounds;
    }
    const targetType = typeof target;
    if (targetType !== null && (targetType === "object" || targetType === "function")) {
      if (isWritableStore(target.resizeObserved)) {
        return this.#updateTypes.storeObject;
      }
      const stores = target?.stores;
      if (isObject(stores) || typeof stores === "function") {
        if (isWritableStore(stores.resizeObserved)) {
          return this.#updateTypes.storesObject;
        }
      }
    }
    if (targetType !== null && targetType === "object") {
      return this.#updateTypes.attribute;
    }
    if (targetType === "function") {
      return this.#updateTypes.function;
    }
    return this.#updateTypes.none;
  }
  /**
   * Determines if a given element and target is already being observed.
   *
   * @param {HTMLElement} el - A HTMLElement.
   *
   * @param {import('./types').ResizeObserverData.ResizeTarget} [target] - A specific target to find.
   *
   * @returns {boolean} Whether the target is already being tracked for the given element.
   */
  #hasTarget(el, target) {
    if (target === void 0 || target === null) {
      return false;
    }
    const subscribers = this.#elMap.get(el);
    if (Array.isArray(subscribers)) {
      return subscribers.findIndex((entry) => entry.target === target) >= 0;
    }
    return false;
  }
  /**
   * Updates a subscriber target with given content width & height values. Offset width & height is calculated from
   * the content values + cached styles.
   *
   * @param {import('./types-local').ResizeObserverSubscriber} subscriber - Internal data about subscriber.
   *
   * @param {number|undefined}  contentWidth - ResizeObserver `contentRect.width` value or undefined.
   *
   * @param {number|undefined}  contentHeight - ResizeObserver `contentRect.height` value or undefined.
   */
  static #updateSubscriber(subscriber, contentWidth, contentHeight) {
    const styles = subscriber.styles;
    subscriber.contentWidth = contentWidth;
    subscriber.contentHeight = contentHeight;
    const offsetWidth = Number.isFinite(contentWidth) ? contentWidth + styles.additionalWidth : void 0;
    const offsetHeight = Number.isFinite(contentHeight) ? contentHeight + styles.additionalHeight : void 0;
    const target = subscriber.target;
    switch (subscriber.updateType) {
      case this.#updateTypes.attribute:
        target.contentWidth = contentWidth;
        target.contentHeight = contentHeight;
        target.offsetWidth = offsetWidth;
        target.offsetHeight = offsetHeight;
        break;
      case this.#updateTypes.function:
        target?.(offsetWidth, offsetHeight, contentWidth, contentHeight);
        break;
      case this.#updateTypes.resizeObserved:
        target.resizeObserved?.(offsetWidth, offsetHeight, contentWidth, contentHeight);
        break;
      case this.#updateTypes.setContentBounds:
        target.setContentBounds?.(contentWidth, contentHeight);
        break;
      case this.#updateTypes.setDimension:
        target.setDimension?.(offsetWidth, offsetHeight);
        break;
      case this.#updateTypes.storeObject:
        target.resizeObserved.update((object) => {
          object.contentHeight = contentHeight;
          object.contentWidth = contentWidth;
          object.offsetHeight = offsetHeight;
          object.offsetWidth = offsetWidth;
          return object;
        });
        break;
      case this.#updateTypes.storesObject:
        target.stores.resizeObserved.update((object) => {
          object.contentHeight = contentHeight;
          object.contentWidth = contentWidth;
          object.offsetHeight = offsetHeight;
          object.offsetWidth = offsetWidth;
          return object;
        });
        break;
    }
  }
}
const resizeObserverActionManager = new ResizeObserverManager();
function resizeObserver(node, target) {
  resizeObserverActionManager.add(node, target);
  return {
    /**
     * @param {import('#runtime/util/dom/observer').ResizeObserverData.ResizeTarget} newTarget - A
     *        {@link ResizeObserverManager} target to update with observed width & height changes.
     */
    update: (newTarget) => {
      resizeObserverActionManager.remove(node, target);
      target = newTarget;
      resizeObserverActionManager.add(node, target);
    },
    destroy: () => {
      resizeObserverActionManager.remove(node, target);
    }
  };
}
resizeObserver.updateCache = function(el) {
  resizeObserverActionManager.updateCache(el);
};
function dynamicAction(node, { action, data } = {}) {
  let actionResult;
  if (typeof action === "function") {
    actionResult = action(node, data);
  }
  return {
    /**
     * @param {import('./types').DynamicActionOptions} newOptions - Defines the new action to dynamically mount.
     */
    update: (newOptions) => {
      if (!isObject(newOptions)) {
        actionResult?.destroy?.();
        action = void 0;
        data = void 0;
        return;
      }
      const { action: newAction, data: newData } = newOptions;
      if (typeof newAction !== "function") {
        console.warn(`dynamicAction.update warning: Aborting as 'action' is not a function.`);
        return;
      }
      const hasNewData = newData !== data;
      if (hasNewData) {
        data = newData;
      }
      if (newAction !== action) {
        actionResult?.destroy?.();
        action = newAction;
        actionResult = action(node, data);
      } else if (hasNewData) {
        actionResult?.update?.(data);
      }
    },
    destroy: () => {
      actionResult?.destroy?.();
      action = void 0;
      data = void 0;
      actionResult = void 0;
    }
  };
}
class TJSDefaultTransition {
  static #options = {};
  static #default = () => void 0;
  /**
   * @returns {() => undefined} Default empty transition.
   */
  static get default() {
    return this.#default;
  }
  /**
   * @returns {{}} Default empty options.
   */
  static get options() {
    return this.#options;
  }
}
class AppShellContextInternal {
  /** @type {import('./types').AppShell.Context.InternalAppStores} */
  #stores;
  constructor() {
    this.#stores = {
      // When app shell has content resize observation enabled these stores are updated.
      contentOffsetWidth: writable(0),
      contentOffsetHeight: writable(0),
      contentWidth: writable(0),
      contentHeight: writable(0),
      cqEnabled: writable(false),
      elementContent: writable(void 0),
      elementRoot: writable(void 0)
    };
    Object.freeze(this.#stores);
    Object.seal(this);
  }
  /**
   * @returns {import('./types').AppShell.Context.InternalAppStores} The internal context stores:
   * - `cqEnabled` - Container query enabled state.
   * - `elementContent` - The bound elementContent element reference.
   * - `elementRoot` - The bound elementRoot element reference.
   */
  get stores() {
    return this.#stores;
  }
}
const DIMENSION_REGEX = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?)\s*([a-zA-Z%]+)?$/;
function extractDimensionNumberAndUnit(dimension) {
  const [, num, unit = ""] = dimension.trim().match(DIMENSION_REGEX) ?? [];
  return { number: parseInt(num, 10), unit };
}
function calculateNewDimensions(base, constraint) {
  const { width, height } = base;
  if ("width" in constraint) {
    const { width: constraintWidth } = constraint;
    return {
      width: constraintWidth,
      height: constraintWidth / width * height
    };
  }
  const { height: constraintHeight } = constraint;
  return {
    width: constraintHeight / height * width,
    height: constraintHeight
  };
}
function calculateDimensions(local, remote) {
  const lWidthStr = local.getAttribute("width");
  const lHeightStr = local.getAttribute("height");
  if (lWidthStr && lHeightStr) {
    return { width: lWidthStr, height: lHeightStr };
  }
  const lDimension = { width: lWidthStr || "", height: lHeightStr || "" };
  const rWidthStr = remote.getAttribute("width");
  const rHeightStr = remote.getAttribute("height");
  const rViewBox = remote.getAttribute("viewBox");
  if (!(rWidthStr && rHeightStr || rViewBox)) {
    return lDimension;
  }
  let rWidth = 0;
  let rHeight = 0;
  let rWidthUnit = "";
  let rHeightUnit = "";
  if (rWidthStr && rHeightStr) {
    ({ number: rWidth, unit: rWidthUnit } = extractDimensionNumberAndUnit(rWidthStr));
    ({ number: rHeight, unit: rHeightUnit } = extractDimensionNumberAndUnit(rHeightStr));
  } else if (rViewBox) {
    [, , rWidth, rHeight] = rViewBox.split(" ").map((s) => parseInt(s, 10));
  }
  if (rWidthUnit !== rHeightUnit) {
    return {
      width: lWidthStr || rWidthStr || "",
      height: lHeightStr || rHeightStr || ""
    };
  }
  if (lWidthStr) {
    const { number, unit } = extractDimensionNumberAndUnit(lWidthStr);
    const cDimension = calculateNewDimensions(
      { width: rWidth, height: rHeight },
      { width: number }
    );
    const cUnit = unit || rWidthUnit;
    return {
      width: cDimension.width.toFixed(2) + cUnit,
      height: cDimension.height.toFixed(2) + cUnit
    };
  }
  if (lHeightStr) {
    const { number, unit } = extractDimensionNumberAndUnit(lHeightStr);
    const cDimension = calculateNewDimensions(
      { width: rWidth, height: rHeight },
      { height: number }
    );
    const cUnit = unit || rHeightUnit;
    return {
      width: cDimension.width.toFixed(2) + cUnit,
      height: cDimension.height.toFixed(2) + cUnit
    };
  }
  return {
    width: rWidth + rWidthUnit,
    height: rHeight + rHeightUnit
  };
}
function inlineSvg(node, param) {
  let config = resolveConfig(param);
  async function op() {
    if (config.src) {
      const response = await fetch(config.src, { cache: config.cache });
      const str = config.transform(await response.text());
      const svg = new DOMParser().parseFromString(str, "image/svg+xml").documentElement;
      for (let i = 0; i < svg.attributes.length; i++) {
        const attr2 = svg.attributes[i];
        if (!node.hasAttribute(attr2.name) && !["width", "height"].includes(attr2.name)) {
          node.setAttribute(attr2.name, attr2.value);
        }
      }
      if (config.autoDimensions) {
        const dimensions = calculateDimensions(node, svg);
        node.setAttribute("width", dimensions.width);
        node.setAttribute("height", dimensions.height);
      } else {
        node.setAttribute("width", node.getAttribute("width") || "");
        node.setAttribute("height", node.getAttribute("height") || "");
      }
      node.innerHTML = svg.innerHTML;
    }
  }
  op();
  return {
    update(update2) {
      config = resolveConfig(update2);
      op();
    }
  };
}
const DEFAULT_INLINE_SVG_ACTION_CONFIG = {
  src: "",
  cache: "no-cache",
  autoDimensions: true,
  transform: (svg) => svg
};
function resolveConfig(param = "") {
  if (typeof param === "string") {
    return {
      ...DEFAULT_INLINE_SVG_ACTION_CONFIG,
      src: param
    };
  }
  return {
    ...DEFAULT_INLINE_SVG_ACTION_CONFIG,
    ...param
  };
}
function popoverTooltip(node, { cssClass, direction, isHTML, locked, tooltip }) {
  function setAttributes() {
    if (typeof tooltip === "string") {
      if (isHTML) {
        node.setAttribute("data-tooltip-html", tooltip);
        node.removeAttribute("data-tooltip");
      } else {
        node.setAttribute("data-tooltip", tooltip);
        node.removeAttribute("data-tooltip-html");
      }
    } else {
      node.removeAttribute("data-tooltip");
      node.removeAttribute("data-tooltip-html");
    }
    if (typeof cssClass === "string") {
      node.setAttribute("data-tooltip-class", cssClass);
    } else {
      node.removeAttribute("data-tooltip-class");
    }
    if (typeof direction === "string") {
      node.setAttribute("data-tooltip-direction", direction);
    } else {
      node.removeAttribute("data-tooltip-direction");
    }
    if (typeof locked === "boolean" && locked) {
      node.setAttribute("data-locked", String(locked));
    } else {
      node.removeAttribute("data-locked");
    }
    if (node === globalThis?.game?.tooltip?.element) {
      globalThis?.game?.tooltip?.activate(node);
    }
  }
  setAttributes();
  return {
    /**
     * @param {TooltipOptions}  options - Update tooltip.
     */
    update: (options) => {
      cssClass = typeof options?.cssClass === "string" ? options.cssClass : void 0;
      direction = typeof options?.direction === "string" ? options.direction : void 0;
      isHTML = typeof options?.isHTML === "boolean" ? options.isHTML : void 0;
      locked = typeof options?.locked === "boolean" ? options.locked : void 0;
      tooltip = typeof options?.tooltip === "string" ? options.tooltip : void 0;
      setAttributes();
    }
  };
}
function create_if_block$2(ctx) {
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (
      /*iconType*/
      ctx2[3] === "font"
    ) return create_if_block_1$1;
    if (
      /*iconType*/
      ctx2[3] === "img"
    ) return create_if_block_2$1;
    if (
      /*iconType*/
      ctx2[3] === "svg"
    ) return create_if_block_3;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type && current_block_type(ctx);
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block) if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) {
        if_block.d(detaching);
      }
    }
  };
}
function create_if_block_3(ctx) {
  let svg;
  let inlineSvg_action;
  let mounted;
  let dispose;
  return {
    c() {
      svg = svg_element("svg");
      attr(svg, "class", "icon-int svelte-guag71");
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      if (!mounted) {
        dispose = action_destroyer(inlineSvg_action = inlineSvg.call(null, svg, { src: (
          /*icon*/
          ctx[2]
        ) }));
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (inlineSvg_action && is_function(inlineSvg_action.update) && dirty & /*icon*/
      4) inlineSvg_action.update.call(null, { src: (
        /*icon*/
        ctx2[2]
      ) });
    },
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_2$1(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (!src_url_equal(img.src, img_src_value = /*icon*/
      ctx[2])) attr(img, "src", img_src_value);
      attr(img, "alt", "");
      attr(img, "class", "icon-int svelte-guag71");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*icon*/
      4 && !src_url_equal(img.src, img_src_value = /*icon*/
      ctx2[2])) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(img);
      }
    }
  };
}
function create_if_block_1$1(ctx) {
  let i;
  let i_class_value;
  return {
    c() {
      i = element("i");
      attr(i, "class", i_class_value = null_to_empty(
        /*icon*/
        ctx[2]
      ) + " svelte-guag71");
    },
    m(target, anchor) {
      insert(target, i, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*icon*/
      4 && i_class_value !== (i_class_value = null_to_empty(
        /*icon*/
        ctx2[2]
      ) + " svelte-guag71")) {
        attr(i, "class", i_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(i);
      }
    }
  };
}
function create_fragment$5(ctx) {
  let button_1;
  let button_1_class_value;
  let applyStyles_action;
  let popoverTooltip_action;
  let mounted;
  let dispose;
  let if_block = (
    /*icon*/
    ctx[2] && create_if_block$2(ctx)
  );
  return {
    c() {
      button_1 = element("button");
      if (if_block) if_block.c();
      attr(button_1, "type", "button");
      attr(button_1, "class", button_1_class_value = "header-control icon" + (typeof /*button*/
      ctx[0].class === "string" ? ` ${/*button*/
      ctx[0].class}` : "") + " svelte-guag71");
      toggle_class(
        button_1,
        "keep-minimized",
        /*keepMinimized*/
        ctx[5]
      );
    },
    m(target, anchor) {
      insert(target, button_1, anchor);
      if (if_block) if_block.m(button_1, null);
      if (!mounted) {
        dispose = [
          listen(button_1, "click", stop_propagation(prevent_default(
            /*onClick*/
            ctx[9]
          ))),
          listen(button_1, "contextmenu", stop_propagation(prevent_default(
            /*onContextMenu*/
            ctx[10]
          ))),
          listen(
            button_1,
            "keydown",
            /*onKeydown*/
            ctx[11]
          ),
          listen(
            button_1,
            "keyup",
            /*onKeyup*/
            ctx[12]
          ),
          action_destroyer(applyStyles_action = applyStyles.call(
            null,
            button_1,
            /*styles*/
            ctx[4]
          )),
          action_destroyer(popoverTooltip_action = popoverTooltip.call(null, button_1, {
            ariaLabel: true,
            tooltip: (
              /*$storeHeaderButtonNoLabel*/
              ctx[8] ? void 0 : (
                /*label*/
                ctx[7]
              )
            ),
            direction: (
              /*tooltipDirection*/
              ctx[6]
            )
          }))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (
        /*icon*/
        ctx2[2]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          if_block.m(button_1, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & /*button*/
      1 && button_1_class_value !== (button_1_class_value = "header-control icon" + (typeof /*button*/
      ctx2[0].class === "string" ? ` ${/*button*/
      ctx2[0].class}` : "") + " svelte-guag71")) {
        attr(button_1, "class", button_1_class_value);
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty & /*styles*/
      16) applyStyles_action.update.call(
        null,
        /*styles*/
        ctx2[4]
      );
      if (popoverTooltip_action && is_function(popoverTooltip_action.update) && dirty & /*$storeHeaderButtonNoLabel, label, tooltipDirection*/
      448) popoverTooltip_action.update.call(null, {
        ariaLabel: true,
        tooltip: (
          /*$storeHeaderButtonNoLabel*/
          ctx2[8] ? void 0 : (
            /*label*/
            ctx2[7]
          )
        ),
        direction: (
          /*tooltipDirection*/
          ctx2[6]
        )
      });
      if (dirty & /*button, keepMinimized*/
      33) {
        toggle_class(
          button_1,
          "keep-minimized",
          /*keepMinimized*/
          ctx2[5]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(button_1);
      }
      if (if_block) if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let icon;
  let label;
  let tooltipDirection;
  let keepMinimized;
  let keyCode;
  let styles;
  let $storeHeaderButtonNoLabel, $$unsubscribe_storeHeaderButtonNoLabel = noop, $$subscribe_storeHeaderButtonNoLabel = () => ($$unsubscribe_storeHeaderButtonNoLabel(), $$unsubscribe_storeHeaderButtonNoLabel = subscribe(storeHeaderButtonNoLabel, ($$value) => $$invalidate(8, $storeHeaderButtonNoLabel = $$value)), storeHeaderButtonNoLabel);
  $$self.$$.on_destroy.push(() => $$unsubscribe_storeHeaderButtonNoLabel());
  let { button = void 0 } = $$props;
  let { storeHeaderButtonNoLabel = void 0 } = $$props;
  $$subscribe_storeHeaderButtonNoLabel();
  let iconType;
  function onClick(event) {
    const invoke = button?.onPress ?? button?.onclick;
    if (typeof invoke === "function") {
      invoke({ button, event });
      $$invalidate(0, button);
    }
  }
  function onContextMenu(event) {
    if (button?.onContextMenu === "function") {
      button.onContextMenu({ button, event });
      $$invalidate(0, button);
    }
  }
  function onKeydown(event) {
    if (event.code === keyCode) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  function onKeyup(event) {
    if (event.code === keyCode) {
      const invoke = button.onPress ?? button.onclick;
      if (typeof invoke === "function") {
        invoke({ button, event });
        $$invalidate(0, button);
      }
      event.preventDefault();
      event.stopPropagation();
    }
  }
  $$self.$$set = ($$props2) => {
    if ("button" in $$props2) $$invalidate(0, button = $$props2.button);
    if ("storeHeaderButtonNoLabel" in $$props2) $$subscribe_storeHeaderButtonNoLabel($$invalidate(1, storeHeaderButtonNoLabel = $$props2.storeHeaderButtonNoLabel));
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(2, icon = isObject(button) && typeof button.icon === "string" ? button.icon : void 0);
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(7, label = isObject(button) && typeof button.label === "string" ? localize(button.label) : void 0);
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(6, tooltipDirection = isObject(button) && typeof button.tooltipDirection === "string" ? button.tooltipDirection : void 0);
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(5, keepMinimized = isObject(button) && typeof button.keepMinimized === "boolean" ? button.keepMinimized : false);
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      keyCode = isObject(button) && typeof button.keyCode === "string" ? button.keyCode : "Enter";
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(4, styles = isObject(button) && isObject(button.styles) ? button.styles : void 0);
    }
    if ($$self.$$.dirty & /*icon*/
    4) {
      {
        const result = AssetValidator.parseMedia({
          url: icon,
          mediaTypes: AssetValidator.MediaTypes.img_svg
        });
        $$invalidate(3, iconType = result.valid ? result.elementType : "font");
      }
    }
  };
  return [
    button,
    storeHeaderButtonNoLabel,
    icon,
    iconType,
    styles,
    keepMinimized,
    tooltipDirection,
    label,
    $storeHeaderButtonNoLabel,
    onClick,
    onContextMenu,
    onKeydown,
    onKeyup
  ];
}
class TJSHeaderButton extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { button: 0, storeHeaderButtonNoLabel: 1 });
  }
  get button() {
    return this.$$.ctx[0];
  }
  set button(button) {
    this.$$set({ button });
    flush();
  }
  get storeHeaderButtonNoLabel() {
    return this.$$.ctx[1];
  }
  set storeHeaderButtonNoLabel(storeHeaderButtonNoLabel) {
    this.$$set({ storeHeaderButtonNoLabel });
    flush();
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[40] = list[i];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[40] = list[i];
  return child_ctx;
}
function create_if_block_2(ctx) {
  let svg;
  let inlineSvg_action;
  let mounted;
  let dispose;
  return {
    c() {
      svg = svg_element("svg");
      attr(svg, "class", "tjs-app-icon keep-minimized svelte-1n4tpql");
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      if (!mounted) {
        dispose = action_destroyer(inlineSvg_action = inlineSvg.call(null, svg, { src: (
          /*$storeHeaderIcon*/
          ctx[4]
        ) }));
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (inlineSvg_action && is_function(inlineSvg_action.update) && dirty[0] & /*$storeHeaderIcon*/
      16) inlineSvg_action.update.call(null, { src: (
        /*$storeHeaderIcon*/
        ctx2[4]
      ) });
    },
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1(ctx) {
  let i;
  let i_class_value;
  return {
    c() {
      i = element("i");
      attr(i, "class", i_class_value = "window-icon keep-minimized " + /*$storeHeaderIcon*/
      ctx[4] + " svelte-1n4tpql");
    },
    m(target, anchor) {
      insert(target, i, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$storeHeaderIcon*/
      16 && i_class_value !== (i_class_value = "window-icon keep-minimized " + /*$storeHeaderIcon*/
      ctx2[4] + " svelte-1n4tpql")) {
        attr(i, "class", i_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(i);
      }
    }
  };
}
function create_if_block$1(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      attr(img, "class", "tjs-app-icon keep-minimized svelte-1n4tpql");
      if (!src_url_equal(img.src, img_src_value = getRoutePrefix(
        /*$storeHeaderIcon*/
        ctx[4]
      ))) attr(img, "src", img_src_value);
      attr(img, "alt", "icon");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$storeHeaderIcon*/
      16 && !src_url_equal(img.src, img_src_value = getRoutePrefix(
        /*$storeHeaderIcon*/
        ctx2[4]
      ))) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(img);
      }
    }
  };
}
function create_each_block_1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*button*/
    ctx[40].props
  ];
  var switch_value = (
    /*button*/
    ctx[40].class
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    if (dirty !== void 0 && dirty[0] & /*buttonsLeft*/
    4) {
      switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [get_spread_object(
        /*button*/
        ctx2[40].props
      )]));
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*buttonsLeft*/
      4 && switch_value !== (switch_value = /*button*/
      ctx2[40].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty[0] & /*buttonsLeft*/
        4 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
          /*button*/
          ctx2[40].props
        )]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_each_block(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*button*/
    ctx[40].props
  ];
  var switch_value = (
    /*button*/
    ctx[40].class
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    if (dirty !== void 0 && dirty[0] & /*buttonsRight*/
    8) {
      switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [get_spread_object(
        /*button*/
        ctx2[40].props
      )]));
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*buttonsRight*/
      8 && switch_value !== (switch_value = /*button*/
      ctx2[40].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty[0] & /*buttonsRight*/
        8 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
          /*button*/
          ctx2[40].props
        )]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_key_block(ctx) {
  let header;
  let t0;
  let h1;
  let t1_value = localize(
    /*$storeTitle*/
    ctx[10]
  ) + "";
  let t1;
  let t2;
  let t3;
  let span;
  let t4;
  let draggable_action;
  let minimizable_action;
  let current;
  let mounted;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (
      /*mediaType*/
      ctx2[8] === "img"
    ) return create_if_block$1;
    if (
      /*mediaType*/
      ctx2[8] === "font"
    ) return create_if_block_1;
    if (
      /*mediaType*/
      ctx2[8] === "svg"
    ) return create_if_block_2;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type && current_block_type(ctx);
  let each_value_1 = ensure_array_like(
    /*buttonsLeft*/
    ctx[2]
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  const out = (i) => transition_out(each_blocks_1[i], 1, 1, () => {
    each_blocks_1[i] = null;
  });
  let each_value = ensure_array_like(
    /*buttonsRight*/
    ctx[3]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out_1 = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      header = element("header");
      if (if_block) if_block.c();
      t0 = space();
      h1 = element("h1");
      t1 = text(t1_value);
      t2 = space();
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t3 = space();
      span = element("span");
      t4 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(h1, "class", "window-title svelte-1n4tpql");
      set_style(
        h1,
        "display",
        /*displayHeaderTitle*/
        ctx[7]
      );
      attr(span, "class", "tjs-window-header-spacer keep-minimized svelte-1n4tpql");
      attr(header, "class", "window-header svelte-1n4tpql");
      toggle_class(header, "not-draggable", !/*$storeDraggable*/
      ctx[5]);
    },
    m(target, anchor) {
      insert(target, header, anchor);
      if (if_block) if_block.m(header, null);
      append(header, t0);
      append(header, h1);
      append(h1, t1);
      append(header, t2);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(header, null);
        }
      }
      append(header, t3);
      append(header, span);
      append(header, t4);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(header, null);
        }
      }
      ctx[31](header);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            header,
            "pointerdown",
            /*onPointerdown*/
            ctx[24]
          ),
          action_destroyer(draggable_action = /*draggable*/
          ctx[0].call(
            null,
            header,
            /*dragOptions*/
            ctx[6]
          )),
          action_destroyer(minimizable_action = /*minimizable*/
          ctx[23].call(
            null,
            header,
            /*$storeMinimizable*/
            ctx[9]
          ))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block) if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(header, t0);
        }
      }
      if ((!current || dirty[0] & /*$storeTitle*/
      1024) && t1_value !== (t1_value = localize(
        /*$storeTitle*/
        ctx2[10]
      ) + "")) set_data(t1, t1_value);
      if (dirty[0] & /*displayHeaderTitle*/
      128) {
        set_style(
          h1,
          "display",
          /*displayHeaderTitle*/
          ctx2[7]
        );
      }
      if (dirty[0] & /*buttonsLeft*/
      4) {
        each_value_1 = ensure_array_like(
          /*buttonsLeft*/
          ctx2[2]
        );
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
            transition_in(each_blocks_1[i], 1);
          } else {
            each_blocks_1[i] = create_each_block_1(child_ctx);
            each_blocks_1[i].c();
            transition_in(each_blocks_1[i], 1);
            each_blocks_1[i].m(header, t3);
          }
        }
        group_outros();
        for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (dirty[0] & /*buttonsRight*/
      8) {
        each_value = ensure_array_like(
          /*buttonsRight*/
          ctx2[3]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(header, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out_1(i);
        }
        check_outros();
      }
      if (draggable_action && is_function(draggable_action.update) && dirty[0] & /*dragOptions*/
      64) draggable_action.update.call(
        null,
        /*dragOptions*/
        ctx2[6]
      );
      if (minimizable_action && is_function(minimizable_action.update) && dirty[0] & /*$storeMinimizable*/
      512) minimizable_action.update.call(
        null,
        /*$storeMinimizable*/
        ctx2[9]
      );
      if (!current || dirty[0] & /*$storeDraggable*/
      32) {
        toggle_class(header, "not-draggable", !/*$storeDraggable*/
        ctx2[5]);
      }
    },
    i(local) {
      if (current) return;
      for (let i = 0; i < each_value_1.length; i += 1) {
        transition_in(each_blocks_1[i]);
      }
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks_1 = each_blocks_1.filter(Boolean);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        transition_out(each_blocks_1[i]);
      }
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(header);
      }
      if (if_block) {
        if_block.d();
      }
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      ctx[31](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$4(ctx) {
  let previous_key = (
    /*draggable*/
    ctx[0]
  );
  let key_block_anchor;
  let current;
  let key_block = create_key_block(ctx);
  return {
    c() {
      key_block.c();
      key_block_anchor = empty();
    },
    m(target, anchor) {
      key_block.m(target, anchor);
      insert(target, key_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*draggable*/
      1 && safe_not_equal(previous_key, previous_key = /*draggable*/
      ctx2[0])) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(key_block_anchor.parentNode, key_block_anchor);
      } else {
        key_block.p(ctx2, dirty);
      }
    },
    i(local) {
      if (current) return;
      transition_in(key_block);
      current = true;
    },
    o(local) {
      transition_out(key_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(key_block_anchor);
      }
      key_block.d(detaching);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let $focusKeep;
  let $focusAuto;
  let $elementRoot;
  let $storeHeaderIcon;
  let $storeHeaderButtons;
  let $storeMinimized;
  let $storeHeaderNoTitleMinimized;
  let $storeDraggable;
  let $storeDetached;
  let $storeAlwaysOnTop;
  let $storeMinimizable;
  let $storeTitle;
  let { draggable: draggable$1 = void 0 } = $$props;
  let { draggableOptions = void 0 } = $$props;
  const application = getContext("#external")?.application;
  const { focusAuto, focusKeep } = application.reactive.storeAppOptions;
  component_subscribe($$self, focusAuto, (value) => $$invalidate(33, $focusAuto = value));
  component_subscribe($$self, focusKeep, (value) => $$invalidate(32, $focusKeep = value));
  const { elementRoot } = getContext("#internal").stores;
  component_subscribe($$self, elementRoot, (value) => $$invalidate(34, $elementRoot = value));
  const storeAlwaysOnTop = application.reactive.storeAppOptions.alwaysOnTop;
  component_subscribe($$self, storeAlwaysOnTop, (value) => $$invalidate(30, $storeAlwaysOnTop = value));
  const storeDraggable = application.reactive.storeAppOptions.draggable;
  component_subscribe($$self, storeDraggable, (value) => $$invalidate(5, $storeDraggable = value));
  const storeDetached = application.reactive.storeUIState.detached;
  component_subscribe($$self, storeDetached, (value) => $$invalidate(29, $storeDetached = value));
  const storeDragging = application.reactive.storeUIState.dragging;
  const storeHeaderButtons = application.reactive.storeUIState.headerButtons;
  component_subscribe($$self, storeHeaderButtons, (value) => $$invalidate(26, $storeHeaderButtons = value));
  const storeHeaderButtonNoLabel = application.reactive.storeAppOptions.headerButtonNoLabel;
  const storeHeaderIcon = application.reactive.storeAppOptions.headerIcon;
  component_subscribe($$self, storeHeaderIcon, (value) => $$invalidate(4, $storeHeaderIcon = value));
  const storeHeaderNoTitleMinimized = application.reactive.storeAppOptions.headerNoTitleMinimized;
  component_subscribe($$self, storeHeaderNoTitleMinimized, (value) => $$invalidate(28, $storeHeaderNoTitleMinimized = value));
  const storeMinimizable = application.reactive.storeAppOptions.minimizable;
  component_subscribe($$self, storeMinimizable, (value) => $$invalidate(9, $storeMinimizable = value));
  const storeMinimized = application.reactive.storeUIState.minimized;
  component_subscribe($$self, storeMinimized, (value) => $$invalidate(27, $storeMinimized = value));
  const storeTitle = application.reactive.storeAppOptions.title;
  component_subscribe($$self, storeTitle, (value) => $$invalidate(10, $storeTitle = value));
  const s_DRAG_TARGET_CLASSLIST = Object.freeze(["tjs-app-icon", "tjs-window-header-spacer", "window-header", "window-title"]);
  let headerEl;
  function checkAlwaysOnTop(hide) {
    if (hide) {
      headerEl?.querySelector(".popout-module-button")?.setAttribute("hidden", "");
    } else {
      headerEl?.querySelector(".popout-module-button")?.removeAttribute("hidden");
    }
  }
  let dragOptions;
  let displayHeaderTitle;
  let buttonsLeft;
  let buttonsRight;
  let mediaType = void 0;
  function minimizable(node, booleanStore) {
    const callback = (event) => {
      if (event.target.classList.contains("window-title") || event.target.classList.contains("window-header") || event.target.classList.contains("keep-minimized")) {
        application._onToggleMinimize(event);
      }
    };
    function activateListeners() {
      node.addEventListener("dblclick", callback);
    }
    function removeListeners() {
      node.removeEventListener("dblclick", callback);
    }
    if (booleanStore) {
      activateListeners();
    }
    return {
      update: (booleanStore2) => {
        if (booleanStore2) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }
  function onPointerdown(event) {
    const rootEl = $elementRoot;
    application.position.animate.cancel();
    if ($focusAuto && A11yHelper.isFocusTarget(rootEl) && rootEl?.isConnected) {
      if ($focusKeep) {
        const activeWindow = application.reactive.activeWindow;
        const focusOutside = A11yHelper.isFocusTarget(activeWindow.document.activeElement) && !rootEl.contains(activeWindow.document.activeElement);
        if (focusOutside) {
          rootEl.focus();
        } else {
          event.preventDefault();
        }
      } else {
        rootEl.focus();
      }
    }
  }
  function header_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      headerEl = $$value;
      $$invalidate(1, headerEl);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("draggable" in $$props2) $$invalidate(0, draggable$1 = $$props2.draggable);
    if ("draggableOptions" in $$props2) $$invalidate(25, draggableOptions = $$props2.draggableOptions);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*headerEl, $storeAlwaysOnTop, $storeDetached*/
    1610612738) {
      if (headerEl) {
        checkAlwaysOnTop($storeAlwaysOnTop && !$storeDetached);
      }
    }
    if ($$self.$$.dirty[0] & /*draggable*/
    1) {
      $$invalidate(0, draggable$1 = typeof draggable$1 === "function" ? draggable$1 : draggable);
    }
    if ($$self.$$.dirty[0] & /*draggableOptions, $storeDraggable*/
    33554464) {
      $$invalidate(6, dragOptions = Object.assign(
        {},
        {
          tween: true,
          tweenOptions: { duration: 0.06, ease: "cubicOut" }
        },
        isObject(draggableOptions) ? draggableOptions : {},
        {
          position: application.position,
          enabled: $storeDraggable,
          storeDragging,
          hasTargetClassList: s_DRAG_TARGET_CLASSLIST
        }
      ));
    }
    if ($$self.$$.dirty[0] & /*$storeHeaderNoTitleMinimized, $storeMinimized*/
    402653184) {
      $$invalidate(7, displayHeaderTitle = $storeHeaderNoTitleMinimized && $storeMinimized ? "none" : null);
    }
    if ($$self.$$.dirty[0] & /*$storeHeaderButtons, buttonsLeft, buttonsRight*/
    67108876) {
      {
        $$invalidate(2, buttonsLeft = []);
        $$invalidate(3, buttonsRight = []);
        for (const button of $storeHeaderButtons) {
          const buttonsList = typeof button?.alignLeft === "boolean" && button?.alignLeft ? buttonsLeft : buttonsRight;
          buttonsList.push(TJSSvelte.config.isConfigEmbed(button?.svelte) ? { ...button.svelte } : {
            class: TJSHeaderButton,
            props: { button, storeHeaderButtonNoLabel }
          });
        }
      }
    }
    if ($$self.$$.dirty[0] & /*$storeHeaderIcon*/
    16) {
      if (typeof $storeHeaderIcon === "string") {
        const result = AssetValidator.parseMedia({
          url: $storeHeaderIcon,
          mediaTypes: AssetValidator.MediaTypes.img_svg
        });
        $$invalidate(8, mediaType = result.valid ? result.elementType : "font");
      } else {
        $$invalidate(8, mediaType = void 0);
      }
    }
  };
  return [
    draggable$1,
    headerEl,
    buttonsLeft,
    buttonsRight,
    $storeHeaderIcon,
    $storeDraggable,
    dragOptions,
    displayHeaderTitle,
    mediaType,
    $storeMinimizable,
    $storeTitle,
    focusAuto,
    focusKeep,
    elementRoot,
    storeAlwaysOnTop,
    storeDraggable,
    storeDetached,
    storeHeaderButtons,
    storeHeaderIcon,
    storeHeaderNoTitleMinimized,
    storeMinimizable,
    storeMinimized,
    storeTitle,
    minimizable,
    onPointerdown,
    draggableOptions,
    $storeHeaderButtons,
    $storeMinimized,
    $storeHeaderNoTitleMinimized,
    $storeDetached,
    $storeAlwaysOnTop,
    header_binding
  ];
}
class TJSApplicationHeader extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { draggable: 0, draggableOptions: 25 }, null, [-1, -1]);
  }
}
class ResizeHandleTransform {
  /**
   * Stores inverted app transform matrix.
   */
  static #invMat = new Mat4();
  /**
   * Stores converted world delta width & height change.
   */
  static #pDeltaLocal = new Vec3();
  /**
   * Stores point down in local space.
   */
  static #pLocalDown = new Vec3();
  /**
   * Stores point drag in local space.
   */
  static #pLocalDrag = new Vec3();
  /**
   * Stores point down in world space.
   */
  static #pScreenDown = new Vec3();
  /**
   * Stores point drag in world space.
   */
  static #pScreenDrag = new Vec3();
  /**
   * Compute the delta width and height in local space given the app transform matrix and initial pointer down and
   * drag screen coordinates.
   *
   * @param {Mat4} transformMat - App transform matrix.
   *
   * @param {number} pScreenDownX - Pointer down X position in screen coords.
   *
   * @param {number} pScreenDownY - Pointer down Y position in screen coords.
   *
   * @param {number} pScreenDragX - Current pointer drag X position in screen coords.
   *
   * @param {number} pScreenDragY - Current pointer drag Y position in screen coords.
   *
   * @returns {Vec3} Output vector for width & height changes (x = deltaWidth, y = deltaHeight).
   */
  static computeDelta(transformMat, pScreenDownX, pScreenDownY, pScreenDragX, pScreenDragY) {
    Mat4.invert(this.#invMat, transformMat);
    this.#pScreenDown[0] = pScreenDownX;
    this.#pScreenDown[1] = pScreenDownY;
    this.#pScreenDrag[0] = pScreenDragX;
    this.#pScreenDrag[1] = pScreenDragY;
    Vec3.transformMat4(this.#pLocalDown, this.#pScreenDown, this.#invMat);
    Vec3.transformMat4(this.#pLocalDrag, this.#pScreenDrag, this.#invMat);
    this.#pDeltaLocal[0] = this.#pLocalDrag[0] - this.#pLocalDown[0];
    this.#pDeltaLocal[1] = this.#pLocalDrag[1] - this.#pLocalDown[1];
    return this.#pDeltaLocal;
  }
}
function create_fragment$3(ctx) {
  let div;
  let resizable_action;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      div.innerHTML = ``;
      attr(div, "class", "window-resize-handle svelte-1kzx9yd");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      ctx[13](div);
      if (!mounted) {
        dispose = [
          listen(
            div,
            "pointerdown",
            /*onPointerdown*/
            ctx[8]
          ),
          action_destroyer(resizable_action = /*resizable*/
          ctx[9].call(null, div, {
            active: (
              /*$storeResizable*/
              ctx[1] && !/*$storeDetached*/
              ctx[2]
            ),
            storeResizing: (
              /*storeResizing*/
              ctx[7]
            )
          }))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (resizable_action && is_function(resizable_action.update) && dirty & /*$storeResizable, $storeDetached*/
      6) resizable_action.update.call(null, {
        active: (
          /*$storeResizable*/
          ctx2[1] && !/*$storeDetached*/
          ctx2[2]
        ),
        storeResizing: (
          /*storeResizing*/
          ctx2[7]
        )
      });
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      ctx[13](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let $storeElementRoot;
  let $storeMinimized;
  let $storeResizable;
  let $storeDetached;
  let { isResizable = false } = $$props;
  const application = getContext("#external")?.application;
  const storeElementRoot = getContext("#internal").stores.elementRoot;
  component_subscribe($$self, storeElementRoot, (value) => $$invalidate(11, $storeElementRoot = value));
  const storeResizable = application.reactive.storeAppOptions.resizable;
  component_subscribe($$self, storeResizable, (value) => $$invalidate(1, $storeResizable = value));
  const storeDetached = application.reactive.storeUIState.detached;
  component_subscribe($$self, storeDetached, (value) => $$invalidate(2, $storeDetached = value));
  const storeMinimized = application.reactive.storeUIState.minimized;
  component_subscribe($$self, storeMinimized, (value) => $$invalidate(12, $storeMinimized = value));
  const storeResizing = application.reactive.storeUIState.resizing;
  let elementResize;
  function onPointerdown() {
    application.position.animate.cancel();
  }
  function resizable(node, { active: active2 = true, storeResizing: storeResizing2 = void 0 } = {}) {
    let position = null;
    let resizing = false;
    let pScreenDownX = 0;
    let pScreenDownY = 0;
    const handlers = {
      resizeDown: ["pointerdown", (e) => onResizePointerDown(e), false],
      resizeMove: ["pointermove", (e) => onResizePointerMove(e), false],
      resizeUp: ["pointerup", (e) => onResizePointerUp(e), false]
    };
    function activateListeners() {
      node.addEventListener(...handlers.resizeDown);
      $$invalidate(10, isResizable = true);
      node.style.display = "block";
    }
    function removeListeners() {
      if (typeof storeResizing2?.set === "function") {
        storeResizing2.set(false);
      }
      node.removeEventListener(...handlers.resizeDown);
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);
      node.style.display = "none";
      $$invalidate(10, isResizable = false);
    }
    if (active2) {
      activateListeners();
    } else {
      node.style.display = "none";
    }
    function onResizePointerDown(event) {
      event.preventDefault();
      resizing = false;
      position = application.position.get();
      if (position.height === "auto") {
        position.height = $storeElementRoot.clientHeight;
      }
      if (position.width === "auto") {
        position.width = $storeElementRoot.clientWidth;
      }
      pScreenDownX = event.clientX;
      pScreenDownY = event.clientY;
      node.addEventListener(...handlers.resizeMove);
      node.addEventListener(...handlers.resizeUp);
      node.setPointerCapture(event.pointerId);
    }
    function onResizePointerMove(event) {
      event.preventDefault();
      if (!resizing && typeof storeResizing2?.set === "function") {
        resizing = true;
        storeResizing2.set(true);
      }
      const pDeltaLocal = ResizeHandleTransform.computeDelta(application.position.transform.mat4, pScreenDownX, pScreenDownY, event.clientX, event.clientY);
      application.position.set({
        width: position.width + pDeltaLocal[0],
        height: position.height + pDeltaLocal[1]
      });
    }
    function onResizePointerUp(event) {
      resizing = false;
      if (typeof storeResizing2?.set === "function") {
        storeResizing2.set(false);
      }
      event.preventDefault();
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);
      application?._onResize?.(event);
    }
    return {
      update: ({ active: active3 }) => {
        if (active3) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementResize = $$value;
      $$invalidate(0, elementResize), $$invalidate(10, isResizable), $$invalidate(12, $storeMinimized), $$invalidate(11, $storeElementRoot);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("isResizable" in $$props2) $$invalidate(10, isResizable = $$props2.isResizable);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*elementResize, isResizable, $storeMinimized, $storeElementRoot*/
    7169) {
      if (elementResize) {
        $$invalidate(0, elementResize.style.display = isResizable && !$storeMinimized ? "block" : "none", elementResize);
        const elementRoot = $storeElementRoot;
        if (elementRoot) {
          elementRoot.classList[isResizable ? "add" : "remove"]("resizable");
        }
      }
    }
  };
  return [
    elementResize,
    $storeResizable,
    $storeDetached,
    storeElementRoot,
    storeResizable,
    storeDetached,
    storeMinimized,
    storeResizing,
    onPointerdown,
    resizable,
    isResizable,
    $storeElementRoot,
    $storeMinimized,
    div_binding
  ];
}
class ResizableHandle extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { isResizable: 10 });
  }
}
function create_fragment$2(ctx) {
  let div;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      attr(div, "class", "tjs-focus-wrap svelte-kjcljd");
      attr(div, "tabindex", "0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      ctx[4](div);
      if (!mounted) {
        dispose = listen(
          div,
          "focus",
          /*onFocus*/
          ctx[1]
        );
        mounted = true;
      }
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      ctx[4](null);
      mounted = false;
      dispose();
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { elementRoot = void 0 } = $$props;
  let { enabled = true } = $$props;
  let ignoreElements, wrapEl;
  function onFocus() {
    if (!enabled) {
      return;
    }
    if (A11yHelper.isFocusTarget(elementRoot)) {
      const firstFocusEl = A11yHelper.getFirstFocusableElement(elementRoot, ignoreElements);
      if (A11yHelper.isFocusTarget(firstFocusEl) && firstFocusEl !== wrapEl) {
        firstFocusEl.focus();
      } else {
        elementRoot.focus();
      }
    }
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      wrapEl = $$value;
      $$invalidate(0, wrapEl);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2) $$invalidate(2, elementRoot = $$props2.elementRoot);
    if ("enabled" in $$props2) $$invalidate(3, enabled = $$props2.enabled);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*wrapEl*/
    1) {
      if (wrapEl) {
        ignoreElements = /* @__PURE__ */ new Set([wrapEl]);
      }
    }
  };
  return [wrapEl, onFocus, elementRoot, enabled, div_binding];
}
class TJSFocusWrap extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { elementRoot: 2, enabled: 3 });
  }
}
function create_else_block(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let applyStyles_action;
  let t1;
  let resizablehandle;
  let t2;
  let tjsfocuswrap;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let applyStyles_action_1;
  let dynamicAction_action;
  let current;
  let mounted;
  let dispose;
  tjsapplicationheader = new TJSApplicationHeader({
    props: {
      draggable: (
        /*draggable*/
        ctx[6]
      ),
      draggableOptions: (
        /*draggableOptions*/
        ctx[7]
      )
    }
  });
  const default_slot_template = (
    /*#slots*/
    ctx[51].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[50],
    null
  );
  resizablehandle = new ResizableHandle({});
  tjsfocuswrap = new TJSFocusWrap({
    props: {
      elementRoot: (
        /*elementRoot*/
        ctx[1]
      ),
      enabled: (
        /*focusWrapEnabled*/
        ctx[12]
      )
    }
  });
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if (default_slot) default_slot.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      t2 = space();
      create_component(tjsfocuswrap.$$.fragment);
      attr(section, "class", "window-content svelte-xfthie");
      attr(section, "tabindex", "-1");
      attr(div, "id", div_id_value = /*application*/
      ctx[10].id);
      attr(div, "class", div_class_value = "application tjs-app " + /*appClasses*/
      ctx[14] + " svelte-xfthie");
      attr(div, "data-appid", div_data_appid_value = /*application*/
      ctx[10].appId);
      attr(div, "role", "application");
      attr(div, "tabindex", "-1");
      toggle_class(
        div,
        "tjs-cq-inline-size",
        /*cqEnabled*/
        ctx[13] && /*$containerQueryType*/
        ctx[11] === "inline-size"
      );
      toggle_class(
        div,
        "tjs-cq-size",
        /*cqEnabled*/
        ctx[13] && /*$containerQueryType*/
        ctx[11] === "size"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if (default_slot) {
        default_slot.m(section, null);
      }
      ctx[54](section);
      append(div, t1);
      mount_component(resizablehandle, div, null);
      append(div, t2);
      mount_component(tjsfocuswrap, div, null);
      ctx[55](div);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            section,
            "pointerdown",
            /*onPointerdownContent*/
            ctx[30]
          ),
          action_destroyer(applyStyles_action = applyStyles.call(
            null,
            section,
            /*stylesContent*/
            ctx[9]
          )),
          action_destroyer(
            /*contentResizeObserver*/
            ctx[23].call(
              null,
              section,
              /*resizeObservedContent*/
              ctx[31]
            )
          ),
          listen(div, "close:popup", stop_propagation(prevent_default(
            /*onClosePopup*/
            ctx[27]
          ))),
          listen(
            div,
            "keydown",
            /*onKeydown*/
            ctx[28]
          ),
          listen(
            div,
            "pointerdown",
            /*onPointerdownAppCapture*/
            ctx[29],
            true
          ),
          action_destroyer(applyStyles_action_1 = applyStyles.call(
            null,
            div,
            /*stylesApp*/
            ctx[8]
          )),
          action_destroyer(dynamicAction_action = dynamicAction.call(
            null,
            div,
            /*appResizeObserver*/
            ctx[15]
          ))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const tjsapplicationheader_changes = {};
      if (dirty[0] & /*draggable*/
      64) tjsapplicationheader_changes.draggable = /*draggable*/
      ctx2[6];
      if (dirty[0] & /*draggableOptions*/
      128) tjsapplicationheader_changes.draggableOptions = /*draggableOptions*/
      ctx2[7];
      tjsapplicationheader.$set(tjsapplicationheader_changes);
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        524288)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[50],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[50]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[50],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty[0] & /*stylesContent*/
      512) applyStyles_action.update.call(
        null,
        /*stylesContent*/
        ctx2[9]
      );
      const tjsfocuswrap_changes = {};
      if (dirty[0] & /*elementRoot*/
      2) tjsfocuswrap_changes.elementRoot = /*elementRoot*/
      ctx2[1];
      if (dirty[0] & /*focusWrapEnabled*/
      4096) tjsfocuswrap_changes.enabled = /*focusWrapEnabled*/
      ctx2[12];
      tjsfocuswrap.$set(tjsfocuswrap_changes);
      if (!current || dirty[0] & /*application*/
      1024 && div_id_value !== (div_id_value = /*application*/
      ctx2[10].id)) {
        attr(div, "id", div_id_value);
      }
      if (!current || dirty[0] & /*appClasses*/
      16384 && div_class_value !== (div_class_value = "application tjs-app " + /*appClasses*/
      ctx2[14] + " svelte-xfthie")) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty[0] & /*application*/
      1024 && div_data_appid_value !== (div_data_appid_value = /*application*/
      ctx2[10].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }
      if (applyStyles_action_1 && is_function(applyStyles_action_1.update) && dirty[0] & /*stylesApp*/
      256) applyStyles_action_1.update.call(
        null,
        /*stylesApp*/
        ctx2[8]
      );
      if (dynamicAction_action && is_function(dynamicAction_action.update) && dirty[0] & /*appResizeObserver*/
      32768) dynamicAction_action.update.call(
        null,
        /*appResizeObserver*/
        ctx2[15]
      );
      if (!current || dirty[0] & /*appClasses, cqEnabled, $containerQueryType*/
      26624) {
        toggle_class(
          div,
          "tjs-cq-inline-size",
          /*cqEnabled*/
          ctx2[13] && /*$containerQueryType*/
          ctx2[11] === "inline-size"
        );
      }
      if (!current || dirty[0] & /*appClasses, cqEnabled, $containerQueryType*/
      26624) {
        toggle_class(
          div,
          "tjs-cq-size",
          /*cqEnabled*/
          ctx2[13] && /*$containerQueryType*/
          ctx2[11] === "size"
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(default_slot, local);
      transition_in(resizablehandle.$$.fragment, local);
      transition_in(tjsfocuswrap.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(default_slot, local);
      transition_out(resizablehandle.$$.fragment, local);
      transition_out(tjsfocuswrap.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(tjsapplicationheader);
      if (default_slot) default_slot.d(detaching);
      ctx[54](null);
      destroy_component(resizablehandle);
      destroy_component(tjsfocuswrap);
      ctx[55](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let applyStyles_action;
  let t1;
  let resizablehandle;
  let t2;
  let tjsfocuswrap;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let applyStyles_action_1;
  let dynamicAction_action;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  tjsapplicationheader = new TJSApplicationHeader({
    props: {
      draggable: (
        /*draggable*/
        ctx[6]
      ),
      draggableOptions: (
        /*draggableOptions*/
        ctx[7]
      )
    }
  });
  const default_slot_template = (
    /*#slots*/
    ctx[51].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[50],
    null
  );
  resizablehandle = new ResizableHandle({});
  tjsfocuswrap = new TJSFocusWrap({
    props: { elementRoot: (
      /*elementRoot*/
      ctx[1]
    ) }
  });
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if (default_slot) default_slot.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      t2 = space();
      create_component(tjsfocuswrap.$$.fragment);
      attr(section, "class", "window-content svelte-xfthie");
      attr(section, "tabindex", "-1");
      attr(div, "id", div_id_value = /*application*/
      ctx[10].id);
      attr(div, "class", div_class_value = "application tjs-app " + /*appClasses*/
      ctx[14] + " svelte-xfthie");
      attr(div, "data-appid", div_data_appid_value = /*application*/
      ctx[10].appId);
      attr(div, "role", "application");
      attr(div, "tabindex", "-1");
      toggle_class(
        div,
        "tjs-cq-inline-size",
        /*cqEnabled*/
        ctx[13] && /*$containerQueryType*/
        ctx[11] === "inline-size"
      );
      toggle_class(
        div,
        "tjs-cq-size",
        /*cqEnabled*/
        ctx[13] && /*$containerQueryType*/
        ctx[11] === "size"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if (default_slot) {
        default_slot.m(section, null);
      }
      ctx[52](section);
      append(div, t1);
      mount_component(resizablehandle, div, null);
      append(div, t2);
      mount_component(tjsfocuswrap, div, null);
      ctx[53](div);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            section,
            "pointerdown",
            /*onPointerdownContent*/
            ctx[30]
          ),
          action_destroyer(applyStyles_action = applyStyles.call(
            null,
            section,
            /*stylesContent*/
            ctx[9]
          )),
          action_destroyer(
            /*contentResizeObserver*/
            ctx[23].call(
              null,
              section,
              /*resizeObservedContent*/
              ctx[31]
            )
          ),
          listen(div, "close:popup", stop_propagation(prevent_default(
            /*onClosePopup*/
            ctx[27]
          ))),
          listen(
            div,
            "keydown",
            /*onKeydown*/
            ctx[28]
          ),
          listen(
            div,
            "pointerdown",
            /*onPointerdownAppCapture*/
            ctx[29],
            true
          ),
          action_destroyer(applyStyles_action_1 = applyStyles.call(
            null,
            div,
            /*stylesApp*/
            ctx[8]
          )),
          action_destroyer(dynamicAction_action = dynamicAction.call(
            null,
            div,
            /*appResizeObserver*/
            ctx[15]
          ))
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const tjsapplicationheader_changes = {};
      if (dirty[0] & /*draggable*/
      64) tjsapplicationheader_changes.draggable = /*draggable*/
      ctx[6];
      if (dirty[0] & /*draggableOptions*/
      128) tjsapplicationheader_changes.draggableOptions = /*draggableOptions*/
      ctx[7];
      tjsapplicationheader.$set(tjsapplicationheader_changes);
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        524288)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx,
            /*$$scope*/
            ctx[50],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[50]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx[50],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty[0] & /*stylesContent*/
      512) applyStyles_action.update.call(
        null,
        /*stylesContent*/
        ctx[9]
      );
      const tjsfocuswrap_changes = {};
      if (dirty[0] & /*elementRoot*/
      2) tjsfocuswrap_changes.elementRoot = /*elementRoot*/
      ctx[1];
      tjsfocuswrap.$set(tjsfocuswrap_changes);
      if (!current || dirty[0] & /*application*/
      1024 && div_id_value !== (div_id_value = /*application*/
      ctx[10].id)) {
        attr(div, "id", div_id_value);
      }
      if (!current || dirty[0] & /*appClasses*/
      16384 && div_class_value !== (div_class_value = "application tjs-app " + /*appClasses*/
      ctx[14] + " svelte-xfthie")) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty[0] & /*application*/
      1024 && div_data_appid_value !== (div_data_appid_value = /*application*/
      ctx[10].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }
      if (applyStyles_action_1 && is_function(applyStyles_action_1.update) && dirty[0] & /*stylesApp*/
      256) applyStyles_action_1.update.call(
        null,
        /*stylesApp*/
        ctx[8]
      );
      if (dynamicAction_action && is_function(dynamicAction_action.update) && dirty[0] & /*appResizeObserver*/
      32768) dynamicAction_action.update.call(
        null,
        /*appResizeObserver*/
        ctx[15]
      );
      if (!current || dirty[0] & /*appClasses, cqEnabled, $containerQueryType*/
      26624) {
        toggle_class(
          div,
          "tjs-cq-inline-size",
          /*cqEnabled*/
          ctx[13] && /*$containerQueryType*/
          ctx[11] === "inline-size"
        );
      }
      if (!current || dirty[0] & /*appClasses, cqEnabled, $containerQueryType*/
      26624) {
        toggle_class(
          div,
          "tjs-cq-size",
          /*cqEnabled*/
          ctx[13] && /*$containerQueryType*/
          ctx[11] === "size"
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(default_slot, local);
      transition_in(resizablehandle.$$.fragment, local);
      transition_in(tjsfocuswrap.$$.fragment, local);
      add_render_callback(() => {
        if (!current) return;
        if (div_outro) div_outro.end(1);
        div_intro = create_in_transition(
          div,
          /*inTransition*/
          ctx[2],
          /*inTransitionOptions*/
          ctx[4]
        );
        div_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(default_slot, local);
      transition_out(resizablehandle.$$.fragment, local);
      transition_out(tjsfocuswrap.$$.fragment, local);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(
        div,
        /*outTransition*/
        ctx[3],
        /*outTransitionOptions*/
        ctx[5]
      );
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(tjsapplicationheader);
      if (default_slot) default_slot.d(detaching);
      ctx[52](null);
      destroy_component(resizablehandle);
      destroy_component(tjsfocuswrap);
      ctx[53](null);
      if (detaching && div_outro) div_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*inTransition*/
      ctx2[2] !== TJSDefaultTransition.default || /*outTransition*/
      ctx2[3] !== TJSDefaultTransition.default
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let appResizeObserver;
  let appClasses;
  let $focusKeep;
  let $focusAuto;
  let $containerQueryType;
  let $cqTypes;
  let $appThemeName;
  let $themeTokenStore;
  let $activeClasses;
  let $minimized;
  let $focusTrap;
  let $resizeObservable;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { elementContent = void 0 } = $$props;
  let { elementRoot = void 0 } = $$props;
  let { draggable: draggable2 = void 0 } = $$props;
  let { draggableOptions = void 0 } = $$props;
  let { stylesApp = void 0 } = $$props;
  let { stylesContent = void 0 } = $$props;
  const application = getContext("#external")?.application;
  const { containerQueryType, focusAuto, focusKeep, focusTrap } = application.reactive.storeAppOptions;
  component_subscribe($$self, containerQueryType, (value) => $$invalidate(11, $containerQueryType = value));
  component_subscribe($$self, focusAuto, (value) => $$invalidate(42, $focusAuto = value));
  component_subscribe($$self, focusKeep, (value) => $$invalidate(56, $focusKeep = value));
  component_subscribe($$self, focusTrap, (value) => $$invalidate(48, $focusTrap = value));
  const { minimized } = application.reactive.storeUIState;
  component_subscribe($$self, minimized, (value) => $$invalidate(47, $minimized = value));
  const { resizeObservable } = application.position.stores;
  component_subscribe($$self, resizeObservable, (value) => $$invalidate(49, $resizeObservable = value));
  const cqTypes = new CQPositionValidate(application.position);
  component_subscribe($$self, cqTypes, (value) => $$invalidate(43, $cqTypes = value));
  let { appOffsetHeight = false } = $$props;
  let { appOffsetWidth = false } = $$props;
  const initialAppResizeObserver = !!appOffsetHeight || !!appOffsetWidth;
  let { contentOffsetHeight = false } = $$props;
  let { contentOffsetWidth = false } = $$props;
  let { contentHeight = false } = $$props;
  let { contentWidth = false } = $$props;
  const contentResizeObserver = !!contentOffsetHeight || !!contentOffsetWidth || !!contentHeight || !!contentWidth ? resizeObserver : () => null;
  const internal = new AppShellContextInternal();
  const s_IGNORE_CLASSES = { ignoreClasses: ["tjs-focus-wrap"] };
  setContext("#internal", internal);
  let focusWrapEnabled;
  let { transition = TJSDefaultTransition.default } = $$props;
  let { inTransition = TJSDefaultTransition.default } = $$props;
  let { outTransition = TJSDefaultTransition.default } = $$props;
  let { transitionOptions = void 0 } = $$props;
  let { inTransitionOptions = TJSDefaultTransition.options } = $$props;
  let { outTransitionOptions = TJSDefaultTransition.options } = $$props;
  let oldTransition = TJSDefaultTransition.default;
  let oldTransitionOptions = void 0;
  const themeTokenStore = ThemeObserver.stores.themeToken;
  component_subscribe($$self, themeTokenStore, (value) => $$invalidate(45, $themeTokenStore = value));
  const activeClasses = application.reactive.activeClasses;
  component_subscribe($$self, activeClasses, (value) => $$invalidate(46, $activeClasses = value));
  const appThemeName = application.reactive.storeAppOptions.themeName;
  component_subscribe($$self, appThemeName, (value) => $$invalidate(44, $appThemeName = value));
  onMount(() => {
    if ($focusAuto) {
      elementRoot.focus();
    }
  });
  let cqEnabled = false;
  function onClosePopup(event) {
    if (!$focusAuto) {
      return;
    }
    const targetEl = event?.detail?.target;
    if (!A11yHelper.isFocusTarget(targetEl)) {
      return;
    }
    if (A11yHelper.isFocusable(targetEl)) {
      return;
    }
    const elementRootContains = elementRoot.contains(targetEl);
    if (targetEl === elementRoot) {
      elementRoot.focus();
    } else if (targetEl === elementContent) {
      elementContent.focus();
    } else if (elementRootContains) {
      if (elementContent.contains(targetEl)) {
        elementContent.focus();
      } else {
        elementRoot.focus();
      }
    }
  }
  function onKeydown(event) {
    const FVTTKeyboardManager = foundry.helpers.interaction.KeyboardManager;
    if ((event.target === elementRoot || event.target === elementContent) && FVTTKeyboardManager && FVTTKeyboardManager?._getMatchingActions?.(FVTTKeyboardManager?.getKeyboardEventContext?.(event))?.length) {
      event.target?.blur();
      return;
    }
    if (focusWrapEnabled && event.shiftKey && event.code === "Tab") {
      const allFocusable = A11yHelper.getFocusableElements(elementRoot, s_IGNORE_CLASSES);
      const firstFocusEl = allFocusable.length > 0 ? allFocusable[0] : void 0;
      const lastFocusEl = allFocusable.length > 0 ? allFocusable[allFocusable.length - 1] : void 0;
      const activeWindow = application.reactive.activeWindow;
      if (elementRoot === activeWindow.document.activeElement || firstFocusEl === activeWindow.document.activeElement) {
        if (A11yHelper.isFocusTarget(lastFocusEl) && firstFocusEl !== lastFocusEl) {
          lastFocusEl.focus();
        }
        event.preventDefault();
        event.stopPropagation();
      }
    }
    application.bringToTop.call(application);
  }
  function onPointerdownAppCapture() {
    application.bringToTop.call(application);
  }
  function onPointerdownContent(event) {
    const focusable = A11yHelper.isFocusable(event.target);
    if (!focusable && $focusAuto) {
      if ($focusKeep) {
        const activeWindow = application.reactive.activeWindow;
        const focusOutside = !elementRoot.contains(activeWindow.document.activeElement);
        if (focusOutside) {
          elementContent.focus();
        } else {
          event.preventDefault();
        }
      } else {
        elementContent.focus();
      }
    }
  }
  function resizeObservedApp(offsetWidth, offsetHeight, width, height) {
    application.position.stores.resizeObserved.update((object) => {
      object.contentWidth = width;
      object.contentHeight = height;
      object.offsetWidth = offsetWidth;
      object.offsetHeight = offsetHeight;
      return object;
    });
    $$invalidate(32, appOffsetHeight = offsetHeight);
    $$invalidate(33, appOffsetWidth = offsetWidth);
  }
  function resizeObservedContent(offsetWidth, offsetHeight, width, height) {
    $$invalidate(35, contentOffsetWidth = offsetWidth);
    $$invalidate(34, contentOffsetHeight = offsetHeight);
    $$invalidate(37, contentWidth = width);
    $$invalidate(36, contentHeight = height);
    internal.stores.contentOffsetWidth.set(contentOffsetWidth);
    internal.stores.contentOffsetHeight.set(contentOffsetHeight);
    internal.stores.contentWidth.set(contentWidth);
    internal.stores.contentHeight.set(contentHeight);
  }
  function section_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementContent = $$value;
      $$invalidate(0, elementContent);
    });
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementRoot = $$value;
      $$invalidate(1, elementRoot);
    });
  }
  function section_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementContent = $$value;
      $$invalidate(0, elementContent);
    });
  }
  function div_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementRoot = $$value;
      $$invalidate(1, elementRoot);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("elementContent" in $$props2) $$invalidate(0, elementContent = $$props2.elementContent);
    if ("elementRoot" in $$props2) $$invalidate(1, elementRoot = $$props2.elementRoot);
    if ("draggable" in $$props2) $$invalidate(6, draggable2 = $$props2.draggable);
    if ("draggableOptions" in $$props2) $$invalidate(7, draggableOptions = $$props2.draggableOptions);
    if ("stylesApp" in $$props2) $$invalidate(8, stylesApp = $$props2.stylesApp);
    if ("stylesContent" in $$props2) $$invalidate(9, stylesContent = $$props2.stylesContent);
    if ("appOffsetHeight" in $$props2) $$invalidate(32, appOffsetHeight = $$props2.appOffsetHeight);
    if ("appOffsetWidth" in $$props2) $$invalidate(33, appOffsetWidth = $$props2.appOffsetWidth);
    if ("contentOffsetHeight" in $$props2) $$invalidate(34, contentOffsetHeight = $$props2.contentOffsetHeight);
    if ("contentOffsetWidth" in $$props2) $$invalidate(35, contentOffsetWidth = $$props2.contentOffsetWidth);
    if ("contentHeight" in $$props2) $$invalidate(36, contentHeight = $$props2.contentHeight);
    if ("contentWidth" in $$props2) $$invalidate(37, contentWidth = $$props2.contentWidth);
    if ("transition" in $$props2) $$invalidate(38, transition = $$props2.transition);
    if ("inTransition" in $$props2) $$invalidate(2, inTransition = $$props2.inTransition);
    if ("outTransition" in $$props2) $$invalidate(3, outTransition = $$props2.outTransition);
    if ("transitionOptions" in $$props2) $$invalidate(39, transitionOptions = $$props2.transitionOptions);
    if ("inTransitionOptions" in $$props2) $$invalidate(4, inTransitionOptions = $$props2.inTransitionOptions);
    if ("outTransitionOptions" in $$props2) $$invalidate(5, outTransitionOptions = $$props2.outTransitionOptions);
    if ("$$scope" in $$props2) $$invalidate(50, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[1] & /*$resizeObservable*/
    262144) {
      $$invalidate(15, appResizeObserver = initialAppResizeObserver || $resizeObservable ? {
        action: resizeObserver,
        data: resizeObservedApp
      } : void 0);
    }
    if ($$self.$$.dirty[0] & /*elementContent*/
    1) {
      if (elementContent !== void 0 && elementContent !== null) {
        internal.stores.elementContent.set(elementContent);
      }
    }
    if ($$self.$$.dirty[0] & /*elementRoot*/
    2) {
      if (elementRoot !== void 0 && elementRoot !== null) {
        internal.stores.elementRoot.set(elementRoot);
      }
    }
    if ($$self.$$.dirty[1] & /*$focusAuto, $focusTrap, $minimized*/
    198656) {
      $$invalidate(12, focusWrapEnabled = $focusAuto && $focusTrap && !$minimized);
    }
    if ($$self.$$.dirty[1] & /*oldTransition, transition*/
    640) {
      if (oldTransition !== transition) {
        const newTransition = typeof transition === "function" ? transition : TJSDefaultTransition.default;
        $$invalidate(2, inTransition = newTransition);
        $$invalidate(3, outTransition = newTransition);
        $$invalidate(40, oldTransition = newTransition);
      }
    }
    if ($$self.$$.dirty[1] & /*oldTransitionOptions, transitionOptions*/
    1280) {
      if (oldTransitionOptions !== transitionOptions) {
        const newOptions = transitionOptions !== TJSDefaultTransition.options && isObject(transitionOptions) ? transitionOptions : TJSDefaultTransition.options;
        $$invalidate(4, inTransitionOptions = newOptions);
        $$invalidate(5, outTransitionOptions = newOptions);
        $$invalidate(41, oldTransitionOptions = newOptions);
      }
    }
    if ($$self.$$.dirty[0] & /*inTransition*/
    4) {
      if (typeof inTransition !== "function") {
        $$invalidate(2, inTransition = TJSDefaultTransition.default);
      }
    }
    if ($$self.$$.dirty[0] & /*outTransition, application*/
    1032) {
      {
        if (typeof outTransition !== "function") {
          $$invalidate(3, outTransition = TJSDefaultTransition.default);
        }
        const defaultCloseAnimation = application?.options?.defaultCloseAnimation;
        if (typeof defaultCloseAnimation === "boolean" && defaultCloseAnimation && outTransition !== TJSDefaultTransition.default) {
          $$invalidate(10, application.options.defaultCloseAnimation = false, application);
        }
      }
    }
    if ($$self.$$.dirty[0] & /*inTransitionOptions*/
    16) {
      if (!isObject(inTransitionOptions)) {
        $$invalidate(4, inTransitionOptions = TJSDefaultTransition.options);
      }
    }
    if ($$self.$$.dirty[0] & /*outTransitionOptions*/
    32) {
      if (!isObject(outTransitionOptions)) {
        $$invalidate(5, outTransitionOptions = TJSDefaultTransition.options);
      }
    }
    if ($$self.$$.dirty[1] & /*$activeClasses, $themeTokenStore, $appThemeName*/
    57344) {
      $$invalidate(14, appClasses = FVTTAppTheme.appClasses($activeClasses, $themeTokenStore, $appThemeName));
    }
    if ($$self.$$.dirty[0] & /*$containerQueryType*/
    2048 | $$self.$$.dirty[1] & /*$cqTypes*/
    4096) {
      if ($cqTypes.validate($containerQueryType)) {
        internal.stores.cqEnabled.set(true);
        requestAnimationFrame(() => $$invalidate(13, cqEnabled = true));
      } else {
        $$invalidate(13, cqEnabled = false);
        internal.stores.cqEnabled.set(false);
      }
    }
  };
  return [
    elementContent,
    elementRoot,
    inTransition,
    outTransition,
    inTransitionOptions,
    outTransitionOptions,
    draggable2,
    draggableOptions,
    stylesApp,
    stylesContent,
    application,
    $containerQueryType,
    focusWrapEnabled,
    cqEnabled,
    appClasses,
    appResizeObserver,
    containerQueryType,
    focusAuto,
    focusKeep,
    focusTrap,
    minimized,
    resizeObservable,
    cqTypes,
    contentResizeObserver,
    themeTokenStore,
    activeClasses,
    appThemeName,
    onClosePopup,
    onKeydown,
    onPointerdownAppCapture,
    onPointerdownContent,
    resizeObservedContent,
    appOffsetHeight,
    appOffsetWidth,
    contentOffsetHeight,
    contentOffsetWidth,
    contentHeight,
    contentWidth,
    transition,
    transitionOptions,
    oldTransition,
    oldTransitionOptions,
    $focusAuto,
    $cqTypes,
    $appThemeName,
    $themeTokenStore,
    $activeClasses,
    $minimized,
    $focusTrap,
    $resizeObservable,
    $$scope,
    slots,
    section_binding,
    div_binding,
    section_binding_1,
    div_binding_1
  ];
}
class ApplicationShell extends SvelteComponent {
  constructor(options) {
    super();
    init$1(
      this,
      options,
      instance$1,
      create_fragment$1,
      safe_not_equal,
      {
        elementContent: 0,
        elementRoot: 1,
        draggable: 6,
        draggableOptions: 7,
        stylesApp: 8,
        stylesContent: 9,
        appOffsetHeight: 32,
        appOffsetWidth: 33,
        contentOffsetHeight: 34,
        contentOffsetWidth: 35,
        contentHeight: 36,
        contentWidth: 37,
        transition: 38,
        inTransition: 2,
        outTransition: 3,
        transitionOptions: 39,
        inTransitionOptions: 4,
        outTransitionOptions: 5
      },
      null,
      [-1, -1]
    );
  }
  get elementContent() {
    return this.$$.ctx[0];
  }
  set elementContent(elementContent) {
    this.$$set({ elementContent });
    flush();
  }
  get elementRoot() {
    return this.$$.ctx[1];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get draggable() {
    return this.$$.ctx[6];
  }
  set draggable(draggable2) {
    this.$$set({ draggable: draggable2 });
    flush();
  }
  get draggableOptions() {
    return this.$$.ctx[7];
  }
  set draggableOptions(draggableOptions) {
    this.$$set({ draggableOptions });
    flush();
  }
  get stylesApp() {
    return this.$$.ctx[8];
  }
  set stylesApp(stylesApp) {
    this.$$set({ stylesApp });
    flush();
  }
  get stylesContent() {
    return this.$$.ctx[9];
  }
  set stylesContent(stylesContent) {
    this.$$set({ stylesContent });
    flush();
  }
  get appOffsetHeight() {
    return this.$$.ctx[32];
  }
  set appOffsetHeight(appOffsetHeight) {
    this.$$set({ appOffsetHeight });
    flush();
  }
  get appOffsetWidth() {
    return this.$$.ctx[33];
  }
  set appOffsetWidth(appOffsetWidth) {
    this.$$set({ appOffsetWidth });
    flush();
  }
  get contentOffsetHeight() {
    return this.$$.ctx[34];
  }
  set contentOffsetHeight(contentOffsetHeight) {
    this.$$set({ contentOffsetHeight });
    flush();
  }
  get contentOffsetWidth() {
    return this.$$.ctx[35];
  }
  set contentOffsetWidth(contentOffsetWidth) {
    this.$$set({ contentOffsetWidth });
    flush();
  }
  get contentHeight() {
    return this.$$.ctx[36];
  }
  set contentHeight(contentHeight) {
    this.$$set({ contentHeight });
    flush();
  }
  get contentWidth() {
    return this.$$.ctx[37];
  }
  set contentWidth(contentWidth) {
    this.$$set({ contentWidth });
    flush();
  }
  get transition() {
    return this.$$.ctx[38];
  }
  set transition(transition) {
    this.$$set({ transition });
    flush();
  }
  get inTransition() {
    return this.$$.ctx[2];
  }
  set inTransition(inTransition) {
    this.$$set({ inTransition });
    flush();
  }
  get outTransition() {
    return this.$$.ctx[3];
  }
  set outTransition(outTransition) {
    this.$$set({ outTransition });
    flush();
  }
  get transitionOptions() {
    return this.$$.ctx[39];
  }
  set transitionOptions(transitionOptions) {
    this.$$set({ transitionOptions });
    flush();
  }
  get inTransitionOptions() {
    return this.$$.ctx[4];
  }
  set inTransitionOptions(inTransitionOptions) {
    this.$$set({ inTransitionOptions });
    flush();
  }
  get outTransitionOptions() {
    return this.$$.ctx[5];
  }
  set outTransitionOptions(outTransitionOptions) {
    this.$$set({ outTransitionOptions });
    flush();
  }
}
Hooks.once("init", () => FVTTConfigure.initialize());
function create_default_slot(ctx) {
  let main;
  let h3;
  let p0;
  let p1;
  let p2;
  let footer0;
  let div0;
  let div2;
  let div1;
  let a1;
  let footer1;
  let p3;
  let a2;
  return {
    c() {
      main = element("main");
      h3 = element("h3");
      h3.textContent = "AuthorSync Integration";
      p0 = element("p");
      p0.textContent = "This module adds an AuthorSync export action directly to the Foundry Journal sheet.";
      p1 = element("p");
      p1.textContent = "Use the button in the Journal header to export the current JournalEntry as a ZIP bundle for AuthorSync.";
      p2 = element("p");
      p2.textContent = "The welcome panel is informational only and no longer contains export controls.";
      footer0 = element("footer");
      div0 = element("div");
      div0.innerHTML = `<a href="https://www.aardvark.games" class="svelte-69t7wh"><img class="white" src="/modules/${MODULE_ID}/assets/aardvark-logo.webp" alt="Aardvark Game Studios Logo" height="50" width="50" style="fill: white; border: none; width: auto;"/></a>`;
      div2 = element("div");
      div1 = element("div");
      div1.textContent = `${localize$1("Title")} ${localize$1("Welcome.CreatedBy")}`;
      a1 = element("a");
      a1.textContent = "Aardvark Game Studios";
      footer1 = element("footer");
      p3 = element("p");
      p3.textContent = `${MODULE_TITLE} is sponsored by`;
      a2 = element("a");
      a2.textContent = "Round Table Games";
      attr(h3, "class", "svelte-69t7wh");
      attr(p0, "class", "svelte-69t7wh");
      attr(p1, "class", "svelte-69t7wh");
      attr(p2, "class", "svelte-69t7wh");
      attr(div0, "class", "logo");
      attr(a1, "href", "https://www.aardvark.games");
      attr(a1, "class", "svelte-69t7wh");
      attr(div2, "class", "left");
      attr(footer0, "class", "svelte-69t7wh");
      attr(main, "class", "svelte-69t7wh");
      attr(a2, "href", "https://www.round-table.games");
      attr(a2, "class", "svelte-69t7wh");
      attr(footer1, "class", "svelte-69t7wh");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, h3);
      append(main, p0);
      append(main, p1);
      append(main, p2);
      append(main, footer0);
      append(footer0, div0);
      append(footer0, div2);
      append(div2, div1);
      append(div2, a1);
      insert(target, footer1, anchor);
      append(footer1, p3);
      append(footer1, a2);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(main);
        detach(footer1);
      }
    }
  };
}
function create_fragment(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let current;
  function applicationshell_elementRoot_binding(value) {
    ctx[3](value);
  }
  let applicationshell_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  if (
    /*elementRoot*/
    ctx[0] !== void 0
  ) {
    applicationshell_props.elementRoot = /*elementRoot*/
    ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const applicationshell_changes = {};
      if (dirty & /*$$scope*/
      128) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & /*elementRoot*/
      1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = /*elementRoot*/
        ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current) return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { elementRoot = void 0 } = $$props;
  let { version: version2 = void 0 } = $$props;
  const application = getContext("#external").application;
  let draggable2 = application.reactive.draggable;
  draggable2 = true;
  onMount(async () => {
  });
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2) $$invalidate(0, elementRoot = $$props2.elementRoot);
    if ("version" in $$props2) $$invalidate(1, version2 = $$props2.version);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*draggable*/
    4) {
      application.reactive.draggable = draggable2;
    }
  };
  game.settings.get(MODULE_ID, "dontShowWelcome");
  return [elementRoot, version2, draggable2, applicationshell_elementRoot_binding];
}
class WelcomeAppShell extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance, create_fragment, safe_not_equal, { elementRoot: 0, version: 1 });
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get version() {
    return this.$$.ctx[1];
  }
  set version(version2) {
    this.$$set({ version: version2 });
    flush();
  }
}
const version = "0.0.2";
class WelcomeApplication extends SvelteApp {
  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: `${MODULE_ID}-welcome`,
      classes: ["<s_SVELTE_HASH_ID>"],
      resizable: true,
      minimizable: true,
      width: 500,
      height: 400,
      // headerIcon: 'path/to/img.svg',
      title: game.i18n.localize(`${MODULE_TITLE} v${version}`),
      svelte: {
        class: WelcomeAppShell,
        target: document.body,
        intro: true,
        props: {
          version
          // A prop passed to HelloFoundryAppShell for the initial message displayed.
        }
      }
    });
  }
}
function registerSettings(app) {
  log.i("Building module settings");
  debugSetting();
  debugHooksSetting();
  dontShowWelcome();
}
function dontShowWelcome() {
  game.settings.register(MODULE_ID, "dontShowWelcome", {
    name: game.i18n.localize(`${MODULE_ID}.Setting.DontShowWelcome.Name`),
    hint: game.i18n.localize(`${MODULE_ID}.Setting.DontShowWelcome.Hint`),
    scope: "user",
    config: true,
    default: false,
    type: Boolean
  });
}
function debugSetting() {
  game.settings.register(MODULE_ID, "debug", {
    name: game.i18n.localize(`${MODULE_ID}.Setting.Debug.Name`),
    hint: game.i18n.localize(`${MODULE_ID}.Setting.Debug.Hint`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => {
      Dialog.confirm({
        title: game.i18n.localize(`${MODULE_ID}.Setting.ReloadRequiredTitle`),
        content: `<p>${game.i18n.localize(`${MODULE_ID}.Setting.ReloadRequiredContent`)}</p>`,
        yes: () => window.location.reload(),
        no: () => {
        },
        defaultYes: true
      });
    }
  });
}
function debugHooksSetting() {
  game.settings.register(MODULE_ID, "debug.hooks", {
    name: game.i18n.localize(`${MODULE_ID}.Setting.DebugHooks.Name`),
    hint: game.i18n.localize(`${MODULE_ID}.Setting.DebugHooks.Hint`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => {
      Dialog.confirm({
        title: game.i18n.localize(`${MODULE_ID}.Setting.ReloadRequiredTitle`),
        content: `<p>${game.i18n.localize(`${MODULE_ID}.Setting.ReloadRequiredContent`)}</p>`,
        yes: () => window.location.reload(),
        no: () => {
        },
        defaultYes: true
      });
    }
  });
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var jszip_min = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
(function(module, exports) {
  !function(e) {
    module.exports = e();
  }(function() {
    return function s(a, o, h) {
      function u(r, e2) {
        if (!o[r]) {
          if (!a[r]) {
            var t = "function" == typeof commonjsRequire && commonjsRequire;
            if (!e2 && t) return t(r, true);
            if (l) return l(r, true);
            var n = new Error("Cannot find module '" + r + "'");
            throw n.code = "MODULE_NOT_FOUND", n;
          }
          var i = o[r] = { exports: {} };
          a[r][0].call(i.exports, function(e3) {
            var t2 = a[r][1][e3];
            return u(t2 || e3);
          }, i, i.exports, s, a, o, h);
        }
        return o[r].exports;
      }
      for (var l = "function" == typeof commonjsRequire && commonjsRequire, e = 0; e < h.length; e++) u(h[e]);
      return u;
    }({ 1: [function(e, t, r) {
      var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      r.encode = function(e2) {
        for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; ) f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
        return h.join("");
      }, r.decode = function(e2) {
        var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
        if (e2.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
        var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
        for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; ) t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r2), 64 !== a && (l[h++] = n);
        return l;
      };
    }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
      var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
      function o(e2, t2, r2, n2, i2) {
        this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
      }
      o.prototype = { getContentWorker: function() {
        var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
        return e2.on("end", function() {
          if (this.streamInfo.data_length !== t2.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
        }), e2;
      }, getCompressedWorker: function() {
        return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      } }, o.createWorkerFrom = function(e2, t2, r2) {
        return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
      }, t.exports = o;
    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
      var n = e("./stream/GenericWorker");
      r.STORE = { magic: "\0\0", compressWorker: function() {
        return new n("STORE compression");
      }, uncompressWorker: function() {
        return new n("STORE decompression");
      } }, r.DEFLATE = e("./flate");
    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
      var n = e("./utils");
      var o = function() {
        for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
          e2 = r2;
          for (var n2 = 0; n2 < 8; n2++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
          t2[r2] = e2;
        }
        return t2;
      }();
      t.exports = function(e2, t2) {
        return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? function(e3, t3, r2, n2) {
          var i = o, s = n2 + r2;
          e3 ^= -1;
          for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
          return -1 ^ e3;
        }(0 | t2, e2, e2.length, 0) : function(e3, t3, r2, n2) {
          var i = o, s = n2 + r2;
          e3 ^= -1;
          for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
          return -1 ^ e3;
        }(0 | t2, e2, e2.length, 0) : 0;
      };
    }, { "./utils": 32 }], 5: [function(e, t, r) {
      r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
    }, {}], 6: [function(e, t, r) {
      var n = null;
      n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
    }, { lie: 37 }], 7: [function(e, t, r) {
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
      function h(e2, t2) {
        a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
      }
      r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
        this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
      }, h.prototype.flush = function() {
        a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
      }, h.prototype.cleanUp = function() {
        a.prototype.cleanUp.call(this), this._pako = null;
      }, h.prototype._createPako = function() {
        this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
        var t2 = this;
        this._pako.onData = function(e2) {
          t2.push({ data: e2, meta: t2.meta });
        };
      }, r.compressWorker = function(e2) {
        return new h("Deflate", e2);
      }, r.uncompressWorker = function() {
        return new h("Inflate", {});
      };
    }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
      function A(e2, t2) {
        var r2, n2 = "";
        for (r2 = 0; r2 < t2; r2++) n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
        return n2;
      }
      function n(e2, t2, r2, n2, i2, s2) {
        var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
        var S = 0;
        t2 && (S |= 8), l || !_ && !g || (S |= 2048);
        var z = 0, C = 0;
        w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= function(e3, t3) {
          var r3 = e3;
          return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
        }(h.unixPermissions, w)) : (C = 20, z |= function(e3) {
          return 63 & (e3 || 0);
        }(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
        var E = "";
        return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
      }
      var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
      function s(e2, t2, r2, n2) {
        i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      I.inherits(s, i), s.prototype.push = function(e2) {
        var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
        this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
      }, s.prototype.openedSource = function(e2) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
        var t2 = this.streamFiles && !e2.file.dir;
        if (t2) {
          var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({ data: r2.fileRecord, meta: { percent: 0 } });
        } else this.accumulate = true;
      }, s.prototype.closedSource = function(e2) {
        this.accumulate = false;
        var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(r2.dirRecord), t2) this.push({ data: function(e3) {
          return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
        }(e2), meta: { percent: 100 } });
        else for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, s.prototype.flush = function() {
        for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++) this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
        var r2 = this.bytesWritten - e2, n2 = function(e3, t3, r3, n3, i2) {
          var s2 = I.transformTo("string", i2(n3));
          return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
        }(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
        this.push({ data: n2, meta: { percent: 100 } });
      }, s.prototype.prepareNextSource = function() {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, s.prototype.registerPrevious = function(e2) {
        this._sources.push(e2);
        var t2 = this;
        return e2.on("data", function(e3) {
          t2.processChunk(e3);
        }), e2.on("end", function() {
          t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
        }), e2.on("error", function(e3) {
          t2.error(e3);
        }), this;
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
      }, s.prototype.error = function(e2) {
        var t2 = this._sources;
        if (!i.prototype.error.call(this, e2)) return false;
        for (var r2 = 0; r2 < t2.length; r2++) try {
          t2[r2].error(e2);
        } catch (e3) {
        }
        return true;
      }, s.prototype.lock = function() {
        i.prototype.lock.call(this);
        for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++) e2[t2].lock();
      }, t.exports = s;
    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
      var u = e("../compressions"), n = e("./ZipFileWorker");
      r.generateWorker = function(e2, a, t2) {
        var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
        try {
          e2.forEach(function(e3, t3) {
            h++;
            var r2 = function(e4, t4) {
              var r3 = e4 || t4, n3 = u[r3];
              if (!n3) throw new Error(r3 + " is not a valid compression method !");
              return n3;
            }(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
            t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
          }), o.entriesCount = h;
        } catch (e3) {
          o.error(e3);
        }
        return o;
      };
    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
      function n() {
        if (!(this instanceof n)) return new n();
        if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
          var e2 = new n();
          for (var t2 in this) "function" != typeof this[t2] && (e2[t2] = this[t2]);
          return e2;
        };
      }
      (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e2, t2) {
        return new n().loadAsync(e2, t2);
      }, n.external = e("./external"), t.exports = n;
    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
      var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
      function f(n2) {
        return new i.Promise(function(e2, t2) {
          var r2 = n2.decompressed.getContentWorker().pipe(new a());
          r2.on("error", function(e3) {
            t2(e3);
          }).on("end", function() {
            r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
          }).resume();
        });
      }
      t.exports = function(e2, o) {
        var h = this;
        return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
          var t2 = new s(o);
          return t2.load(e3), t2;
        }).then(function(e3) {
          var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
          if (o.checkCRC32) for (var n2 = 0; n2 < r2.length; n2++) t2.push(f(r2[n2]));
          return i.Promise.all(t2);
        }).then(function(e3) {
          for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
            var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
            h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
          }
          return t2.zipComment.length && (h.comment = t2.zipComment), h;
        });
      };
    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
      var n = e("../utils"), i = e("../stream/GenericWorker");
      function s(e2, t2) {
        i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
      }
      n.inherits(s, i), s.prototype._bindStream = function(e2) {
        var t2 = this;
        (this._stream = e2).pause(), e2.on("data", function(e3) {
          t2.push({ data: e3, meta: { percent: 0 } });
        }).on("error", function(e3) {
          t2.isPaused ? this.generatedError = e3 : t2.error(e3);
        }).on("end", function() {
          t2.isPaused ? t2._upstreamEnded = true : t2.end();
        });
      }, s.prototype.pause = function() {
        return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
      }, t.exports = s;
    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
      var i = e("readable-stream").Readable;
      function n(e2, t2, r2) {
        i.call(this, t2), this._helper = e2;
        var n2 = this;
        e2.on("data", function(e3, t3) {
          n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
        }).on("error", function(e3) {
          n2.emit("error", e3);
        }).on("end", function() {
          n2.push(null);
        });
      }
      e("../utils").inherits(n, i), n.prototype._read = function() {
        this._helper.resume();
      }, t.exports = n;
    }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
      t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e2, t2);
        if ("number" == typeof e2) throw new Error('The "data" argument must not be a number');
        return new Buffer(e2, t2);
      }, allocBuffer: function(e2) {
        if (Buffer.alloc) return Buffer.alloc(e2);
        var t2 = new Buffer(e2);
        return t2.fill(0), t2;
      }, isBuffer: function(e2) {
        return Buffer.isBuffer(e2);
      }, isStream: function(e2) {
        return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
      } };
    }, {}], 15: [function(e, t, r) {
      function s(e2, t2, r2) {
        var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
        s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
        var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
        r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
        var o2 = null;
        o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
        var h2 = new d(e2, o2, s2);
        this.files[e2] = h2;
      }
      var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
        "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
        var t2 = e2.lastIndexOf("/");
        return 0 < t2 ? e2.substring(0, t2) : "";
      }, g = function(e2) {
        return "/" !== e2.slice(-1) && (e2 += "/"), e2;
      }, b = function(e2, t2) {
        return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
      };
      function h(e2) {
        return "[object RegExp]" === Object.prototype.toString.call(e2);
      }
      var n = { load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, forEach: function(e2) {
        var t2, r2, n2;
        for (t2 in this.files) n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
      }, filter: function(r2) {
        var n2 = [];
        return this.forEach(function(e2, t2) {
          r2(e2, t2) && n2.push(t2);
        }), n2;
      }, file: function(e2, t2, r2) {
        if (1 !== arguments.length) return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
        if (h(e2)) {
          var n2 = e2;
          return this.filter(function(e3, t3) {
            return !t3.dir && n2.test(e3);
          });
        }
        var i2 = this.files[this.root + e2];
        return i2 && !i2.dir ? i2 : null;
      }, folder: function(r2) {
        if (!r2) return this;
        if (h(r2)) return this.filter(function(e3, t3) {
          return t3.dir && r2.test(e3);
        });
        var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
        return n2.root = t2.name, n2;
      }, remove: function(r2) {
        r2 = this.root + r2;
        var e2 = this.files[r2];
        if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir) delete this.files[r2];
        else for (var t2 = this.filter(function(e3, t3) {
          return t3.name.slice(0, r2.length) === r2;
        }), n2 = 0; n2 < t2.length; n2++) delete this.files[t2[n2].name];
        return this;
      }, generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, generateInternalStream: function(e2) {
        var t2, r2 = {};
        try {
          if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type) throw new Error("No output type specified.");
          u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
          var n2 = r2.comment || this.comment || "";
          t2 = o.generateWorker(this, r2, n2);
        } catch (e3) {
          (t2 = new l("error")).error(e3);
        }
        return new a(t2, r2.type || "string", r2.mimeType);
      }, generateAsync: function(e2, t2) {
        return this.generateInternalStream(e2).accumulate(t2);
      }, generateNodeStream: function(e2, t2) {
        return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
      } };
      t.exports = n;
    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
      t.exports = e("stream");
    }, { stream: void 0 }], 17: [function(e, t, r) {
      var n = e("./DataReader");
      function i(e2) {
        n.call(this, e2);
        for (var t2 = 0; t2 < this.data.length; t2++) e2[t2] = 255 & e2[t2];
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
        return this.data[this.zero + e2];
      }, i.prototype.lastIndexOfSignature = function(e2) {
        for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2) return s - this.zero;
        return -1;
      }, i.prototype.readAndCheckSignature = function(e2) {
        var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
        return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
      }, i.prototype.readData = function(e2) {
        if (this.checkOffset(e2), 0 === e2) return [];
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
      var n = e("../utils");
      function i(e2) {
        this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
      }
      i.prototype = { checkOffset: function(e2) {
        this.checkIndex(this.index + e2);
      }, checkIndex: function(e2) {
        if (this.length < this.zero + e2 || e2 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
      }, setIndex: function(e2) {
        this.checkIndex(e2), this.index = e2;
      }, skip: function(e2) {
        this.setIndex(this.index + e2);
      }, byteAt: function() {
      }, readInt: function(e2) {
        var t2, r2 = 0;
        for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--) r2 = (r2 << 8) + this.byteAt(t2);
        return this.index += e2, r2;
      }, readString: function(e2) {
        return n.transformTo("string", this.readData(e2));
      }, readData: function() {
      }, lastIndexOfSignature: function() {
      }, readAndCheckSignature: function() {
      }, readDate: function() {
        var e2 = this.readInt(4);
        return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
      } }, t.exports = i;
    }, { "../utils": 32 }], 19: [function(e, t, r) {
      var n = e("./Uint8ArrayReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
        this.checkOffset(e2);
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
      var n = e("./DataReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
        return this.data.charCodeAt(this.zero + e2);
      }, i.prototype.lastIndexOfSignature = function(e2) {
        return this.data.lastIndexOf(e2) - this.zero;
      }, i.prototype.readAndCheckSignature = function(e2) {
        return e2 === this.readData(4);
      }, i.prototype.readData = function(e2) {
        this.checkOffset(e2);
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
      var n = e("./ArrayReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
        if (this.checkOffset(e2), 0 === e2) return new Uint8Array(0);
        var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
      var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
      t.exports = function(e2) {
        var t2 = n.getTypeOf(e2);
        return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
      };
    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
      r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
    }, {}], 24: [function(e, t, r) {
      var n = e("./GenericWorker"), i = e("../utils");
      function s(e2) {
        n.call(this, "ConvertWorker to " + e2), this.destType = e2;
      }
      i.inherits(s, n), s.prototype.processChunk = function(e2) {
        this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
      var n = e("./GenericWorker"), i = e("../crc32");
      function s() {
        n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
        this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
      }, t.exports = s;
    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
      var n = e("../utils"), i = e("./GenericWorker");
      function s(e2) {
        i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
      }
      n.inherits(s, i), s.prototype.processChunk = function(e2) {
        if (e2) {
          var t2 = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = t2 + e2.data.length;
        }
        i.prototype.processChunk.call(this, e2);
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
      var n = e("../utils"), i = e("./GenericWorker");
      function s(e2) {
        i.call(this, "DataWorker");
        var t2 = this;
        this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
          t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
        }, function(e3) {
          t2.error(e3);
        });
      }
      n.inherits(s, i), s.prototype.cleanUp = function() {
        i.prototype.cleanUp.call(this), this.data = null;
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
      }, s.prototype._tickAndRepeat = function() {
        this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
      }, s.prototype._tick = function() {
        if (this.isPaused || this.isFinished) return false;
        var e2 = null, t2 = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max) return this.end();
        switch (this.type) {
          case "string":
            e2 = this.data.substring(this.index, t2);
            break;
          case "uint8array":
            e2 = this.data.subarray(this.index, t2);
            break;
          case "array":
          case "nodebuffer":
            e2 = this.data.slice(this.index, t2);
        }
        return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
      function n(e2) {
        this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
      }
      n.prototype = { push: function(e2) {
        this.emit("data", e2);
      }, end: function() {
        if (this.isFinished) return false;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = true;
        } catch (e2) {
          this.emit("error", e2);
        }
        return true;
      }, error: function(e2) {
        return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
      }, on: function(e2, t2) {
        return this._listeners[e2].push(t2), this;
      }, cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      }, emit: function(e2, t2) {
        if (this._listeners[e2]) for (var r2 = 0; r2 < this._listeners[e2].length; r2++) this._listeners[e2][r2].call(this, t2);
      }, pipe: function(e2) {
        return e2.registerPrevious(this);
      }, registerPrevious: function(e2) {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
        var t2 = this;
        return e2.on("data", function(e3) {
          t2.processChunk(e3);
        }), e2.on("end", function() {
          t2.end();
        }), e2.on("error", function(e3) {
          t2.error(e3);
        }), this;
      }, pause: function() {
        return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
      }, resume: function() {
        if (!this.isPaused || this.isFinished) return false;
        var e2 = this.isPaused = false;
        return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
      }, flush: function() {
      }, processChunk: function(e2) {
        this.push(e2);
      }, withStreamInfo: function(e2, t2) {
        return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
      }, mergeStreamInfo: function() {
        for (var e2 in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
      }, lock: function() {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = true, this.previous && this.previous.lock();
      }, toString: function() {
        var e2 = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + e2 : e2;
      } }, t.exports = n;
    }, {}], 29: [function(e, t, r) {
      var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
      if (n.nodestream) try {
        o = e("../nodejs/NodejsStreamOutputAdapter");
      } catch (e2) {
      }
      function l(e2, o2) {
        return new a.Promise(function(t2, r2) {
          var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
          e2.on("data", function(e3, t3) {
            n2.push(e3), o2 && o2(t3);
          }).on("error", function(e3) {
            n2 = [], r2(e3);
          }).on("end", function() {
            try {
              var e3 = function(e4, t3, r3) {
                switch (e4) {
                  case "blob":
                    return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                  case "base64":
                    return u.encode(t3);
                  default:
                    return h.transformTo(e4, t3);
                }
              }(s2, function(e4, t3) {
                var r3, n3 = 0, i3 = null, s3 = 0;
                for (r3 = 0; r3 < t3.length; r3++) s3 += t3[r3].length;
                switch (e4) {
                  case "string":
                    return t3.join("");
                  case "array":
                    return Array.prototype.concat.apply([], t3);
                  case "uint8array":
                    for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++) i3.set(t3[r3], n3), n3 += t3[r3].length;
                    return i3;
                  case "nodebuffer":
                    return Buffer.concat(t3);
                  default:
                    throw new Error("concat : unsupported type '" + e4 + "'");
                }
              }(i2, n2), a2);
              t2(e3);
            } catch (e4) {
              r2(e4);
            }
            n2 = [];
          }).resume();
        });
      }
      function f(e2, t2, r2) {
        var n2 = t2;
        switch (t2) {
          case "blob":
          case "arraybuffer":
            n2 = "uint8array";
            break;
          case "base64":
            n2 = "string";
        }
        try {
          this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
        } catch (e3) {
          this._worker = new s("error"), this._worker.error(e3);
        }
      }
      f.prototype = { accumulate: function(e2) {
        return l(this, e2);
      }, on: function(e2, t2) {
        var r2 = this;
        return "data" === e2 ? this._worker.on(e2, function(e3) {
          t2.call(r2, e3.data, e3.meta);
        }) : this._worker.on(e2, function() {
          h.delay(t2, arguments, r2);
        }), this;
      }, resume: function() {
        return h.delay(this._worker.resume, [], this._worker), this;
      }, pause: function() {
        return this._worker.pause(), this;
      }, toNodejsStream: function(e2) {
        if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
        return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
      } }, t.exports = f;
    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
      if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = false;
      else {
        var n = new ArrayBuffer(0);
        try {
          r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
        } catch (e2) {
          try {
            var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
          } catch (e3) {
            r.blob = false;
          }
        }
      }
      try {
        r.nodestream = !!e("readable-stream").Readable;
      } catch (e2) {
        r.nodestream = false;
      }
    }, { "readable-stream": 16 }], 31: [function(e, t, s) {
      for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
      u[254] = u[254] = 1;
      function a() {
        n.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function l() {
        n.call(this, "utf-8 encode");
      }
      s.utf8encode = function(e2) {
        return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : function(e3) {
          var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
          for (i2 = 0; i2 < a2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
          for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
          return t2;
        }(e2);
      }, s.utf8decode = function(e2) {
        return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : function(e3) {
          var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
          for (t2 = r2 = 0; t2 < s2; ) if ((n2 = e3[t2++]) < 128) a2[r2++] = n2;
          else if (4 < (i2 = u[n2])) a2[r2++] = 65533, t2 += i2 - 1;
          else {
            for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; ) n2 = n2 << 6 | 63 & e3[t2++], i2--;
            1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
          }
          return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
        }(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
      }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
        var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
        if (this.leftOver && this.leftOver.length) {
          if (h.uint8array) {
            var r2 = t2;
            (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
          } else t2 = this.leftOver.concat(t2);
          this.leftOver = null;
        }
        var n2 = function(e3, t3) {
          var r3;
          for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); ) r3--;
          return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
        }(t2), i2 = t2;
        n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
      }, a.prototype.flush = function() {
        this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
      }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
        this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
      }, s.Utf8EncodeWorker = l;
    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
      var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
      function n(e2) {
        return e2;
      }
      function l(e2, t2) {
        for (var r2 = 0; r2 < e2.length; ++r2) t2[r2] = 255 & e2.charCodeAt(r2);
        return t2;
      }
      e("setimmediate"), a.newBlob = function(t2, r2) {
        a.checkSupport("blob");
        try {
          return new Blob([t2], { type: r2 });
        } catch (e2) {
          try {
            var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return n2.append(t2), n2.getBlob(r2);
          } catch (e3) {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var i = { stringifyByChunk: function(e2, t2, r2) {
        var n2 = [], i2 = 0, s2 = e2.length;
        if (s2 <= r2) return String.fromCharCode.apply(null, e2);
        for (; i2 < s2; ) "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
        return n2.join("");
      }, stringifyByChar: function(e2) {
        for (var t2 = "", r2 = 0; r2 < e2.length; r2++) t2 += String.fromCharCode(e2[r2]);
        return t2;
      }, applyCanBeUsed: { uint8array: function() {
        try {
          return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
        } catch (e2) {
          return false;
        }
      }(), nodebuffer: function() {
        try {
          return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
        } catch (e2) {
          return false;
        }
      }() } };
      function s(e2) {
        var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
        if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2) for (; 1 < t2; ) try {
          return i.stringifyByChunk(e2, r2, t2);
        } catch (e3) {
          t2 = Math.floor(t2 / 2);
        }
        return i.stringifyByChar(e2);
      }
      function f(e2, t2) {
        for (var r2 = 0; r2 < e2.length; r2++) t2[r2] = e2[r2];
        return t2;
      }
      a.applyFromCharCode = s;
      var c = {};
      c.string = { string: n, array: function(e2) {
        return l(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return c.string.uint8array(e2).buffer;
      }, uint8array: function(e2) {
        return l(e2, new Uint8Array(e2.length));
      }, nodebuffer: function(e2) {
        return l(e2, r.allocBuffer(e2.length));
      } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
        return new Uint8Array(e2).buffer;
      }, uint8array: function(e2) {
        return new Uint8Array(e2);
      }, nodebuffer: function(e2) {
        return r.newBufferFrom(e2);
      } }, c.arraybuffer = { string: function(e2) {
        return s(new Uint8Array(e2));
      }, array: function(e2) {
        return f(new Uint8Array(e2), new Array(e2.byteLength));
      }, arraybuffer: n, uint8array: function(e2) {
        return new Uint8Array(e2);
      }, nodebuffer: function(e2) {
        return r.newBufferFrom(new Uint8Array(e2));
      } }, c.uint8array = { string: s, array: function(e2) {
        return f(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return e2.buffer;
      }, uint8array: n, nodebuffer: function(e2) {
        return r.newBufferFrom(e2);
      } }, c.nodebuffer = { string: s, array: function(e2) {
        return f(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return c.nodebuffer.uint8array(e2).buffer;
      }, uint8array: function(e2) {
        return f(e2, new Uint8Array(e2.length));
      }, nodebuffer: n }, a.transformTo = function(e2, t2) {
        if (t2 = t2 || "", !e2) return t2;
        a.checkSupport(e2);
        var r2 = a.getTypeOf(t2);
        return c[r2][e2](t2);
      }, a.resolve = function(e2) {
        for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
          var i2 = t2[n2];
          "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
        }
        return r2.join("/");
      }, a.getTypeOf = function(e2) {
        return "string" == typeof e2 ? "string" : "[object Array]" === Object.prototype.toString.call(e2) ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && e2 instanceof Uint8Array ? "uint8array" : o.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, a.checkSupport = function(e2) {
        if (!o[e2.toLowerCase()]) throw new Error(e2 + " is not supported by this platform");
      }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
        var t2, r2, n2 = "";
        for (r2 = 0; r2 < (e2 || "").length; r2++) n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
        return n2;
      }, a.delay = function(e2, t2, r2) {
        setImmediate(function() {
          e2.apply(r2 || null, t2 || []);
        });
      }, a.inherits = function(e2, t2) {
        function r2() {
        }
        r2.prototype = t2.prototype, e2.prototype = new r2();
      }, a.extend = function() {
        var e2, t2, r2 = {};
        for (e2 = 0; e2 < arguments.length; e2++) for (t2 in arguments[e2]) Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
        return r2;
      }, a.prepareContent = function(r2, e2, n2, i2, s2) {
        return u.Promise.resolve(e2).then(function(n3) {
          return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) && "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
            var e3 = new FileReader();
            e3.onload = function(e4) {
              t2(e4.target.result);
            }, e3.onerror = function(e4) {
              r3(e4.target.error);
            }, e3.readAsArrayBuffer(n3);
          }) : n3;
        }).then(function(e3) {
          var t2 = a.getTypeOf(e3);
          return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = function(e4) {
            return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
          }(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
      var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
      function h(e2) {
        this.files = [], this.loadOptions = e2;
      }
      h.prototype = { checkSignature: function(e2) {
        if (!this.reader.readAndCheckSignature(e2)) {
          this.reader.index -= 4;
          var t2 = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
        }
      }, isSignature: function(e2, t2) {
        var r2 = this.reader.index;
        this.reader.setIndex(e2);
        var n2 = this.reader.readString(4) === t2;
        return this.reader.setIndex(r2), n2;
      }, readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
        this.zipComment = this.loadOptions.decodeFileName(r2);
      }, readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; ) e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
      }, readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
      }, readLocalFiles: function() {
        var e2, t2;
        for (e2 = 0; e2 < this.files.length; e2++) t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
      }, readCentralDir: function() {
        var e2;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
        if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      }, readEndOfCentral: function() {
        var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
        if (e2 < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
        this.reader.setIndex(e2);
        var t2 = e2;
        if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
          if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var r2 = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
        var n2 = t2 - r2;
        if (0 < n2) this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
        else if (n2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
      }, prepareReader: function(e2) {
        this.reader = n(e2);
      }, load: function(e2) {
        this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      } }, t.exports = h;
    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
      var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
      function l(e2, t2) {
        this.options = e2, this.loadOptions = t2;
      }
      l.prototype = { isEncrypted: function() {
        return 1 == (1 & this.bitFlag);
      }, useUTF8: function() {
        return 2048 == (2048 & this.bitFlag);
      }, readLocalPart: function(e2) {
        var t2, r2;
        if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if (null === (t2 = function(e3) {
          for (var t3 in h) if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3) return h[t3];
          return null;
        }(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
        this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
      }, readCentralPart: function(e2) {
        this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
        var t2 = e2.readInt(2);
        if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
        e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
      }, processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var e2 = this.versionMadeBy >> 8;
        this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
      }, parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var e2 = n(this.extraFields[1].value);
          this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
        }
      }, readExtraFields: function(e2) {
        var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
        for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; ) t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
        e2.setIndex(i2);
      }, handleUTF8: function() {
        var e2 = u.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
        else {
          var t2 = this.findExtraFieldUnicodePath();
          if (null !== t2) this.fileNameStr = t2;
          else {
            var r2 = s.transformTo(e2, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(r2);
          }
          var n2 = this.findExtraFieldUnicodeComment();
          if (null !== n2) this.fileCommentStr = n2;
          else {
            var i2 = s.transformTo(e2, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(i2);
          }
        }
      }, findExtraFieldUnicodePath: function() {
        var e2 = this.extraFields[28789];
        if (e2) {
          var t2 = n(e2.value);
          return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
        }
        return null;
      }, findExtraFieldUnicodeComment: function() {
        var e2 = this.extraFields[25461];
        if (e2) {
          var t2 = n(e2.value);
          return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
        }
        return null;
      } }, t.exports = l;
    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
      function n(e2, t2, r2) {
        this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
      }
      var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
      n.prototype = { internalStream: function(e2) {
        var t2 = null, r2 = "string";
        try {
          if (!e2) throw new Error("No output type specified.");
          var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
          "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
          var i2 = !this._dataBinary;
          i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
        } catch (e3) {
          (t2 = new h("error")).error(e3);
        }
        return new s(t2, r2, "");
      }, async: function(e2, t2) {
        return this.internalStream(e2).accumulate(t2);
      }, nodeStream: function(e2, t2) {
        return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
      }, _compressWorker: function(e2, t2) {
        if (this._data instanceof o && this._data.compression.magic === e2.magic) return this._data.getCompressedWorker();
        var r2 = this._decompressWorker();
        return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
      }, _decompressWorker: function() {
        return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
      } };
      for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
      t.exports = n;
    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
      (function(t2) {
        var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
        if (e2) {
          var i = 0, s = new e2(u), a = t2.document.createTextNode("");
          s.observe(a, { characterData: true }), r = function() {
            a.data = i = ++i % 2;
          };
        } else if (t2.setImmediate || void 0 === t2.MessageChannel) r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
          var e3 = t2.document.createElement("script");
          e3.onreadystatechange = function() {
            u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
          }, t2.document.documentElement.appendChild(e3);
        } : function() {
          setTimeout(u, 0);
        };
        else {
          var o = new t2.MessageChannel();
          o.port1.onmessage = u, r = function() {
            o.port2.postMessage(0);
          };
        }
        var h = [];
        function u() {
          var e3, t3;
          n = true;
          for (var r2 = h.length; r2; ) {
            for (t3 = h, h = [], e3 = -1; ++e3 < r2; ) t3[e3]();
            r2 = h.length;
          }
          n = false;
        }
        l.exports = function(e3) {
          1 !== h.push(e3) || n || r();
        };
      }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 37: [function(e, t, r) {
      var i = e("immediate");
      function u() {
      }
      var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
      function o(e2) {
        if ("function" != typeof e2) throw new TypeError("resolver must be a function");
        this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
      }
      function h(e2, t2, r2) {
        this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
      }
      function f(t2, r2, n2) {
        i(function() {
          var e2;
          try {
            e2 = r2(n2);
          } catch (e3) {
            return l.reject(t2, e3);
          }
          e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
        });
      }
      function c(e2) {
        var t2 = e2 && e2.then;
        if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2) return function() {
          t2.apply(e2, arguments);
        };
      }
      function d(t2, e2) {
        var r2 = false;
        function n2(e3) {
          r2 || (r2 = true, l.reject(t2, e3));
        }
        function i2(e3) {
          r2 || (r2 = true, l.resolve(t2, e3));
        }
        var s2 = p(function() {
          e2(i2, n2);
        });
        "error" === s2.status && n2(s2.value);
      }
      function p(e2, t2) {
        var r2 = {};
        try {
          r2.value = e2(t2), r2.status = "success";
        } catch (e3) {
          r2.status = "error", r2.value = e3;
        }
        return r2;
      }
      (t.exports = o).prototype.finally = function(t2) {
        if ("function" != typeof t2) return this;
        var r2 = this.constructor;
        return this.then(function(e2) {
          return r2.resolve(t2()).then(function() {
            return e2;
          });
        }, function(e2) {
          return r2.resolve(t2()).then(function() {
            throw e2;
          });
        });
      }, o.prototype.catch = function(e2) {
        return this.then(null, e2);
      }, o.prototype.then = function(e2, t2) {
        if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s) return this;
        var r2 = new this.constructor(u);
        this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
        return r2;
      }, h.prototype.callFulfilled = function(e2) {
        l.resolve(this.promise, e2);
      }, h.prototype.otherCallFulfilled = function(e2) {
        f(this.promise, this.onFulfilled, e2);
      }, h.prototype.callRejected = function(e2) {
        l.reject(this.promise, e2);
      }, h.prototype.otherCallRejected = function(e2) {
        f(this.promise, this.onRejected, e2);
      }, l.resolve = function(e2, t2) {
        var r2 = p(c, t2);
        if ("error" === r2.status) return l.reject(e2, r2.value);
        var n2 = r2.value;
        if (n2) d(e2, n2);
        else {
          e2.state = a, e2.outcome = t2;
          for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; ) e2.queue[i2].callFulfilled(t2);
        }
        return e2;
      }, l.reject = function(e2, t2) {
        e2.state = s, e2.outcome = t2;
        for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; ) e2.queue[r2].callRejected(t2);
        return e2;
      }, o.resolve = function(e2) {
        if (e2 instanceof this) return e2;
        return l.resolve(new this(u), e2);
      }, o.reject = function(e2) {
        var t2 = new this(u);
        return l.reject(t2, e2);
      }, o.all = function(e2) {
        var r2 = this;
        if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
        var n2 = e2.length, i2 = false;
        if (!n2) return this.resolve([]);
        var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
        for (; ++t2 < n2; ) h2(e2[t2], t2);
        return o2;
        function h2(e3, t3) {
          r2.resolve(e3).then(function(e4) {
            s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
          }, function(e4) {
            i2 || (i2 = true, l.reject(o2, e4));
          });
        }
      }, o.race = function(e2) {
        var t2 = this;
        if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
        var r2 = e2.length, n2 = false;
        if (!r2) return this.resolve([]);
        var i2 = -1, s2 = new this(u);
        for (; ++i2 < r2; ) a2 = e2[i2], t2.resolve(a2).then(function(e3) {
          n2 || (n2 = true, l.resolve(s2, e3));
        }, function(e3) {
          n2 || (n2 = true, l.reject(s2, e3));
        });
        var a2;
        return s2;
      };
    }, { immediate: 36 }], 38: [function(e, t, r) {
      var n = {};
      (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
      var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
      function p(e2) {
        if (!(this instanceof p)) return new p(e2);
        this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
        var t2 = this.options;
        t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
        var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
        if (r2 !== l) throw new Error(i[r2]);
        if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
          var n2;
          if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l) throw new Error(i[r2]);
          this._dict_set = true;
        }
      }
      function n(e2, t2) {
        var r2 = new p(t2);
        if (r2.push(e2, true), r2.err) throw r2.msg || i[r2.err];
        return r2.result;
      }
      p.prototype.push = function(e2, t2) {
        var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
        if (this.ended) return false;
        n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
        do {
          if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l) return this.onEnd(r2), !(this.ended = true);
          0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
        } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
        return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
      }, p.prototype.onData = function(e2) {
        this.chunks.push(e2);
      }, p.prototype.onEnd = function(e2) {
        e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
      }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
        return (t2 = t2 || {}).raw = true, n(e2, t2);
      }, r.gzip = function(e2, t2) {
        return (t2 = t2 || {}).gzip = true, n(e2, t2);
      };
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
      var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
      function a(e2) {
        if (!(this instanceof a)) return new a(e2);
        this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
        var t2 = this.options;
        t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
        var r2 = c.inflateInit2(this.strm, t2.windowBits);
        if (r2 !== m.Z_OK) throw new Error(n[r2]);
        this.header = new s(), c.inflateGetHeader(this.strm, this.header);
      }
      function o(e2, t2) {
        var r2 = new a(t2);
        if (r2.push(e2, true), r2.err) throw r2.msg || n[r2.err];
        return r2.result;
      }
      a.prototype.push = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
        if (this.ended) return false;
        n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
        do {
          if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK) return this.onEnd(r2), !(this.ended = true);
          h.next_out && (0 !== h.avail_out && r2 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
        } while ((0 < h.avail_in || 0 === h.avail_out) && r2 !== m.Z_STREAM_END);
        return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
      }, a.prototype.onData = function(e2) {
        this.chunks.push(e2);
      }, a.prototype.onEnd = function(e2) {
        e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
      }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
        return (t2 = t2 || {}).raw = true, o(e2, t2);
      }, r.ungzip = o;
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
      r.assign = function(e2) {
        for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
          var r2 = t2.shift();
          if (r2) {
            if ("object" != typeof r2) throw new TypeError(r2 + "must be non-object");
            for (var n2 in r2) r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
          }
        }
        return e2;
      }, r.shrinkBuf = function(e2, t2) {
        return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
      };
      var i = { arraySet: function(e2, t2, r2, n2, i2) {
        if (t2.subarray && e2.subarray) e2.set(t2.subarray(r2, r2 + n2), i2);
        else for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
      }, flattenChunks: function(e2) {
        var t2, r2, n2, i2, s2, a;
        for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++) n2 += e2[t2].length;
        for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++) s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
        return a;
      } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
        for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
      }, flattenChunks: function(e2) {
        return [].concat.apply([], e2);
      } };
      r.setTyped = function(e2) {
        e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
      }, r.setTyped(n);
    }, {}], 42: [function(e, t, r) {
      var h = e("./common"), i = true, s = true;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch (e2) {
        i = false;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (e2) {
        s = false;
      }
      for (var u = new h.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
      function l(e2, t2) {
        if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
        for (var r2 = "", n2 = 0; n2 < t2; n2++) r2 += String.fromCharCode(e2[n2]);
        return r2;
      }
      u[254] = u[254] = 1, r.string2buf = function(e2) {
        var t2, r2, n2, i2, s2, a = e2.length, o = 0;
        for (i2 = 0; i2 < a; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
        for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
        return t2;
      }, r.buf2binstring = function(e2) {
        return l(e2, e2.length);
      }, r.binstring2buf = function(e2) {
        for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++) t2[r2] = e2.charCodeAt(r2);
        return t2;
      }, r.buf2string = function(e2, t2) {
        var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
        for (r2 = n2 = 0; r2 < a; ) if ((i2 = e2[r2++]) < 128) o[n2++] = i2;
        else if (4 < (s2 = u[i2])) o[n2++] = 65533, r2 += s2 - 1;
        else {
          for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; ) i2 = i2 << 6 | 63 & e2[r2++], s2--;
          1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
        }
        return l(o, n2);
      }, r.utf8border = function(e2, t2) {
        var r2;
        for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); ) r2--;
        return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
      };
    }, { "./common": 41 }], 43: [function(e, t, r) {
      t.exports = function(e2, t2, r2, n) {
        for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
          for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; ) ;
          i %= 65521, s %= 65521;
        }
        return i | s << 16 | 0;
      };
    }, {}], 44: [function(e, t, r) {
      t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 45: [function(e, t, r) {
      var o = function() {
        for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
          e2 = r2;
          for (var n = 0; n < 8; n++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
          t2[r2] = e2;
        }
        return t2;
      }();
      t.exports = function(e2, t2, r2, n) {
        var i = o, s = n + r2;
        e2 ^= -1;
        for (var a = n; a < s; a++) e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
        return -1 ^ e2;
      };
    }, {}], 46: [function(e, t, r) {
      var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
      function R(e2, t2) {
        return e2.msg = n[t2], t2;
      }
      function T(e2) {
        return (e2 << 1) - (4 < e2 ? 9 : 0);
      }
      function D(e2) {
        for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
      }
      function F(e2) {
        var t2 = e2.state, r2 = t2.pending;
        r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
      }
      function N(e2, t2) {
        u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = t2;
      }
      function P(e2, t2) {
        e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
      }
      function L(e2, t2) {
        var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
        e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
        do {
          if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
            s2 += 2, r2++;
            do {
            } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
            if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
              if (e2.match_start = t2, o2 <= (a2 = n2)) break;
              d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            }
          }
        } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
        return a2 <= e2.lookahead ? a2 : e2.lookahead;
      }
      function j(e2) {
        var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
        do {
          if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
            for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
            for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
            i2 += f2;
          }
          if (0 === e2.strm.avail_in) break;
          if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x) for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); ) ;
        } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
      }
      function Z(e2, t2) {
        for (var r2, n2; ; ) {
          if (e2.lookahead < z) {
            if (j(e2), e2.lookahead < z && t2 === l) return A;
            if (0 === e2.lookahead) break;
          }
          if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x) if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
            for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; ) ;
            e2.strstart++;
          } else e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
          else n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
          if (n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
        }
        return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
      }
      function W(e2, t2) {
        for (var r2, n2, i2; ; ) {
          if (e2.lookahead < z) {
            if (j(e2), e2.lookahead < z && t2 === l) return A;
            if (0 === e2.lookahead) break;
          }
          if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
            for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; ) ;
            if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
          } else if (e2.match_available) {
            if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out) return A;
          } else e2.match_available = 1, e2.strstart++, e2.lookahead--;
        }
        return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
      }
      function M(e2, t2, r2, n2, i2) {
        this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
      }
      function H() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function G(e2) {
        var t2;
        return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
      }
      function K(e2) {
        var t2 = G(e2);
        return t2 === m && function(e3) {
          e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
        }(e2.state), t2;
      }
      function Y(e2, t2, r2, n2, i2, s2) {
        if (!e2) return _;
        var a2 = 1;
        if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2) return R(e2, _);
        8 === n2 && (n2 = 9);
        var o2 = new H();
        return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
      }
      h = [new M(0, 0, 0, 0, function(e2, t2) {
        var r2 = 65535;
        for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
          if (e2.lookahead <= 1) {
            if (j(e2), 0 === e2.lookahead && t2 === l) return A;
            if (0 === e2.lookahead) break;
          }
          e2.strstart += e2.lookahead, e2.lookahead = 0;
          var n2 = e2.block_start + r2;
          if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out)) return A;
          if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out)) return A;
        }
        return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
      }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
        return Y(e2, t2, v, 15, 8, 0);
      }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
        return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
      }, r.deflate = function(e2, t2) {
        var r2, n2, i2, s2;
        if (!e2 || !e2.state || 5 < t2 || t2 < 0) return e2 ? R(e2, _) : _;
        if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f) return R(e2, 0 === e2.avail_out ? -5 : _);
        if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C) if (2 === n2.wrap) e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
        else {
          var a2 = v + (n2.w_bits - 8 << 4) << 8;
          a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
        }
        if (69 === n2.status) if (n2.gzhead.extra) {
          for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
          n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
        } else n2.status = 73;
        if (73 === n2.status) if (n2.gzhead.name) {
          i2 = n2.pending;
          do {
            if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
              s2 = 1;
              break;
            }
            s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
          } while (0 !== s2);
          n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
        } else n2.status = 91;
        if (91 === n2.status) if (n2.gzhead.comment) {
          i2 = n2.pending;
          do {
            if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
              s2 = 1;
              break;
            }
            s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
          } while (0 !== s2);
          n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
        } else n2.status = 103;
        if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
          if (F(e2), 0 === e2.avail_out) return n2.last_flush = -1, m;
        } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f) return R(e2, -5);
        if (666 === n2.status && 0 !== e2.avail_in) return R(e2, -5);
        if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
          var o2 = 2 === n2.strategy ? function(e3, t3) {
            for (var r3; ; ) {
              if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                if (t3 === l) return A;
                break;
              }
              if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
          }(n2, t2) : 3 === n2.strategy ? function(e3, t3) {
            for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
              if (e3.lookahead <= S) {
                if (j(e3), e3.lookahead <= S && t3 === l) return A;
                if (0 === e3.lookahead) break;
              }
              if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                s3 = e3.strstart + S;
                do {
                } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
              }
              if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
          }(n2, t2) : h[n2.level].func(n2, t2);
          if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O) return 0 === e2.avail_out && (n2.last_flush = -1), m;
          if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out)) return n2.last_flush = -1, m;
        }
        return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
      }, r.deflateEnd = function(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
      }, r.deflateSetDictionary = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
        if (!e2 || !e2.state) return _;
        if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead) return _;
        for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
          for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; ) ;
          r2.strstart = n2, r2.lookahead = x - 1, j(r2);
        }
        return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
      }, r.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
      t.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
      };
    }, {}], 48: [function(e, t, r) {
      t.exports = function(e2, t2) {
        var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
        r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
        e: do {
          p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
          t: for (; ; ) {
            if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
            else {
              if (!(16 & y)) {
                if (0 == (64 & y)) {
                  v = m[(65535 & v) + (d & (1 << y) - 1)];
                  continue t;
                }
                if (32 & y) {
                  r2.mode = 12;
                  break e;
                }
                e2.msg = "invalid literal/length code", r2.mode = 30;
                break e;
              }
              w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
              r: for (; ; ) {
                if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                  if (0 == (64 & y)) {
                    v = _[(65535 & v) + (d & (1 << y) - 1)];
                    continue r;
                  }
                  e2.msg = "invalid distance code", r2.mode = 30;
                  break e;
                }
                if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break e;
                }
                if (d >>>= y, p -= y, (y = s - a) < k) {
                  if (l < (y = k - y) && r2.sane) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break e;
                  }
                  if (S = c, (x = 0) === f) {
                    if (x += u - y, y < w) {
                      for (w -= y; C[s++] = c[x++], --y; ) ;
                      x = s - k, S = C;
                    }
                  } else if (f < y) {
                    if (x += u + f - y, (y -= f) < w) {
                      for (w -= y; C[s++] = c[x++], --y; ) ;
                      if (x = 0, f < w) {
                        for (w -= y = f; C[s++] = c[x++], --y; ) ;
                        x = s - k, S = C;
                      }
                    }
                  } else if (x += f - y, y < w) {
                    for (w -= y; C[s++] = c[x++], --y; ) ;
                    x = s - k, S = C;
                  }
                  for (; 2 < w; ) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                  w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                } else {
                  for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); ) ;
                  w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                }
                break;
              }
            }
            break;
          }
        } while (n < i && s < o);
        n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
      };
    }, {}], 49: [function(e, t, r) {
      var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
      function L(e2) {
        return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
      }
      function s() {
        this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function a(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
      }
      function o(e2) {
        var t2;
        return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
      }
      function h(e2, t2) {
        var r2, n2;
        return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
      }
      function u(e2, t2) {
        var r2, n2;
        return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
      }
      var l, f, c = true;
      function j(e2) {
        if (c) {
          var t2;
          for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; ) e2.lens[t2++] = 8;
          for (; t2 < 256; ) e2.lens[t2++] = 9;
          for (; t2 < 280; ) e2.lens[t2++] = 7;
          for (; t2 < 288; ) e2.lens[t2++] = 8;
          for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; ) e2.lens[t2++] = 5;
          T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
        }
        e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
      }
      function Z(e2, t2, r2, n2) {
        var i2, s2 = e2.state;
        return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
      }
      r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
        return u(e2, 15);
      }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in) return U;
        12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
        e: for (; ; ) switch (r2.mode) {
          case P:
            if (0 === r2.wrap) {
              r2.mode = 13;
              break;
            }
            for (; l2 < 16; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (2 & r2.wrap && 35615 === u2) {
              E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
              break;
            }
            if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
              e2.msg = "incorrect header check", r2.mode = 30;
              break;
            }
            if (8 != (15 & u2)) {
              e2.msg = "unknown compression method", r2.mode = 30;
              break;
            }
            if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits) r2.wbits = k;
            else if (k > r2.wbits) {
              e2.msg = "invalid window size", r2.mode = 30;
              break;
            }
            r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
            break;
          case 2:
            for (; l2 < 16; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (r2.flags = u2, 8 != (255 & r2.flags)) {
              e2.msg = "unknown compression method", r2.mode = 30;
              break;
            }
            if (57344 & r2.flags) {
              e2.msg = "unknown header flags set", r2.mode = 30;
              break;
            }
            r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
          case 3:
            for (; l2 < 32; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
          case 4:
            for (; l2 < 16; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
          case 5:
            if (1024 & r2.flags) {
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
            } else r2.head && (r2.head.extra = null);
            r2.mode = 6;
          case 6:
            if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length)) break e;
            r2.length = 0, r2.mode = 7;
          case 7:
            if (2048 & r2.flags) {
              if (0 === o2) break e;
              for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; ) ;
              if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
            } else r2.head && (r2.head.name = null);
            r2.length = 0, r2.mode = 8;
          case 8:
            if (4096 & r2.flags) {
              if (0 === o2) break e;
              for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; ) ;
              if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
            } else r2.head && (r2.head.comment = null);
            r2.mode = 9;
          case 9:
            if (512 & r2.flags) {
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (u2 !== (65535 & r2.check)) {
                e2.msg = "header crc mismatch", r2.mode = 30;
                break;
              }
              l2 = u2 = 0;
            }
            r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
            break;
          case 10:
            for (; l2 < 32; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
          case 11:
            if (0 === r2.havedict) return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
            e2.adler = r2.check = 1, r2.mode = 12;
          case 12:
            if (5 === t2 || 6 === t2) break e;
          case 13:
            if (r2.last) {
              u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
              break;
            }
            for (; l2 < 3; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
              case 0:
                r2.mode = 14;
                break;
              case 1:
                if (j(r2), r2.mode = 20, 6 !== t2) break;
                u2 >>>= 2, l2 -= 2;
                break e;
              case 2:
                r2.mode = 17;
                break;
              case 3:
                e2.msg = "invalid block type", r2.mode = 30;
            }
            u2 >>>= 2, l2 -= 2;
            break;
          case 14:
            for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
              e2.msg = "invalid stored block lengths", r2.mode = 30;
              break;
            }
            if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2) break e;
          case 15:
            r2.mode = 16;
          case 16:
            if (d = r2.length) {
              if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d) break e;
              I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
              break;
            }
            r2.mode = 12;
            break;
          case 17:
            for (; l2 < 14; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
              e2.msg = "too many length or distance symbols", r2.mode = 30;
              break;
            }
            r2.have = 0, r2.mode = 18;
          case 18:
            for (; r2.have < r2.ncode; ) {
              for (; l2 < 3; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
            }
            for (; r2.have < 19; ) r2.lens[A[r2.have++]] = 0;
            if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
              e2.msg = "invalid code lengths set", r2.mode = 30;
              break;
            }
            r2.have = 0, r2.mode = 19;
          case 19:
            for (; r2.have < r2.nlen + r2.ndist; ) {
              for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (b < 16) u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
              else {
                if (16 === b) {
                  for (z = _ + 2; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                    e2.msg = "invalid bit length repeat", r2.mode = 30;
                    break;
                  }
                  k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                } else if (17 === b) {
                  for (z = _ + 3; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                } else {
                  for (z = _ + 7; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                }
                if (r2.have + d > r2.nlen + r2.ndist) {
                  e2.msg = "invalid bit length repeat", r2.mode = 30;
                  break;
                }
                for (; d--; ) r2.lens[r2.have++] = k;
              }
            }
            if (30 === r2.mode) break;
            if (0 === r2.lens[256]) {
              e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
              break;
            }
            if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
              e2.msg = "invalid literal/lengths set", r2.mode = 30;
              break;
            }
            if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
              e2.msg = "invalid distances set", r2.mode = 30;
              break;
            }
            if (r2.mode = 20, 6 === t2) break e;
          case 20:
            r2.mode = 21;
          case 21:
            if (6 <= o2 && 258 <= h2) {
              e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
              break;
            }
            for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (g && 0 == (240 & g)) {
              for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              u2 >>>= v, l2 -= v, r2.back += v;
            }
            if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
              r2.mode = 26;
              break;
            }
            if (32 & g) {
              r2.back = -1, r2.mode = 12;
              break;
            }
            if (64 & g) {
              e2.msg = "invalid literal/length code", r2.mode = 30;
              break;
            }
            r2.extra = 15 & g, r2.mode = 22;
          case 22:
            if (r2.extra) {
              for (z = r2.extra; l2 < z; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
            }
            r2.was = r2.length, r2.mode = 23;
          case 23:
            for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (0 == (240 & g)) {
              for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              u2 >>>= v, l2 -= v, r2.back += v;
            }
            if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
              e2.msg = "invalid distance code", r2.mode = 30;
              break;
            }
            r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
          case 24:
            if (r2.extra) {
              for (z = r2.extra; l2 < z; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
            }
            if (r2.offset > r2.dmax) {
              e2.msg = "invalid distance too far back", r2.mode = 30;
              break;
            }
            r2.mode = 25;
          case 25:
            if (0 === h2) break e;
            if (d = c2 - h2, r2.offset > d) {
              if ((d = r2.offset - d) > r2.whave && r2.sane) {
                e2.msg = "invalid distance too far back", r2.mode = 30;
                break;
              }
              p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
            } else m = i2, p = a2 - r2.offset, d = r2.length;
            for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; ) ;
            0 === r2.length && (r2.mode = 21);
            break;
          case 26:
            if (0 === h2) break e;
            i2[a2++] = r2.length, h2--, r2.mode = 21;
            break;
          case 27:
            if (r2.wrap) {
              for (; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 |= n2[s2++] << l2, l2 += 8;
              }
              if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                e2.msg = "incorrect data check", r2.mode = 30;
                break;
              }
              l2 = u2 = 0;
            }
            r2.mode = 28;
          case 28:
            if (r2.wrap && r2.flags) {
              for (; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (u2 !== (4294967295 & r2.total)) {
                e2.msg = "incorrect length check", r2.mode = 30;
                break;
              }
              l2 = u2 = 0;
            }
            r2.mode = 29;
          case 29:
            x = 1;
            break e;
          case 30:
            x = -3;
            break e;
          case 31:
            return -4;
          case 32:
          default:
            return U;
        }
        return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
      }, r.inflateEnd = function(e2) {
        if (!e2 || !e2.state) return U;
        var t2 = e2.state;
        return t2.window && (t2.window = null), e2.state = null, N;
      }, r.inflateGetHeader = function(e2, t2) {
        var r2;
        return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
      }, r.inflateSetDictionary = function(e2, t2) {
        var r2, n2 = t2.length;
        return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
      }, r.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
      var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      t.exports = function(e2, t2, r2, n, i, s, a, o) {
        var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
        for (b = 0; b <= 15; b++) O[b] = 0;
        for (v = 0; v < n; v++) O[t2[r2 + v]]++;
        for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) ;
        if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
        for (y = 1; y < w && 0 === O[y]; y++) ;
        for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
        if (0 < z && (0 === e2 || 1 !== w)) return -1;
        for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];
        for (v = 0; v < n; v++) 0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
        if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
        for (; ; ) {
          for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; ) ;
          for (h = 1 << b - 1; E & h; ) h >>= 1;
          if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
            if (b === w) break;
            b = t2[r2 + a[v]];
          }
          if (k < b && (E & f) !== l) {
            for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); ) x++, z <<= 1;
            if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
            i[l = E & f] = k << 24 | x << 16 | c - s | 0;
          }
        }
        return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(e, t, r) {
      t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(e, t, r) {
      var i = e("../utils/common"), o = 0, h = 1;
      function n(e2) {
        for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
      }
      var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
      n(z);
      var C = new Array(2 * f);
      n(C);
      var E = new Array(512);
      n(E);
      var A = new Array(256);
      n(A);
      var I = new Array(a);
      n(I);
      var O, B, R, T = new Array(f);
      function D(e2, t2, r2, n2, i2) {
        this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
      }
      function F(e2, t2) {
        this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
      }
      function N(e2) {
        return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
      }
      function P(e2, t2, r2) {
        e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
      }
      function L(e2, t2, r2) {
        P(e2, r2[2 * t2], r2[2 * t2 + 1]);
      }
      function j(e2, t2) {
        for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; ) ;
        return r2 >>> 1;
      }
      function Z(e2, t2, r2) {
        var n2, i2, s2 = new Array(g + 1), a2 = 0;
        for (n2 = 1; n2 <= g; n2++) s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
        for (i2 = 0; i2 <= t2; i2++) {
          var o2 = e2[2 * i2 + 1];
          0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
        }
      }
      function W(e2) {
        var t2;
        for (t2 = 0; t2 < l; t2++) e2.dyn_ltree[2 * t2] = 0;
        for (t2 = 0; t2 < f; t2++) e2.dyn_dtree[2 * t2] = 0;
        for (t2 = 0; t2 < c; t2++) e2.bl_tree[2 * t2] = 0;
        e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
      }
      function M(e2) {
        8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
      }
      function H(e2, t2, r2, n2) {
        var i2 = 2 * t2, s2 = 2 * r2;
        return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
      }
      function G(e2, t2, r2) {
        for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); ) e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
        e2.heap[r2] = n2;
      }
      function K(e2, t2, r2) {
        var n2, i2, s2, a2, o2 = 0;
        if (0 !== e2.last_lit) for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; ) ;
        L(e2, m, t2);
      }
      function Y(e2, t2) {
        var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
        for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++) 0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
        for (; e2.heap_len < 2; ) s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
        for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--) G(e2, s2, r2);
        for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; ) ;
        e2.heap[--e2.heap_max] = e2.heap[1], function(e3, t3) {
          var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
          for (s3 = 0; s3 <= g; s3++) e3.bl_count[s3] = 0;
          for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++) p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
          if (0 !== m2) {
            do {
              for (s3 = p2 - 1; 0 === e3.bl_count[s3]; ) s3--;
              e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
            } while (0 < m2);
            for (s3 = p2; 0 !== s3; s3--) for (n3 = e3.bl_count[s3]; 0 !== n3; ) u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
          }
        }(e2, t2), Z(s2, u2, e2.bl_count);
      }
      function X(e2, t2, r2) {
        var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
        for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++) i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
      }
      function V(e2, t2, r2) {
        var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
        for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++) if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
          if (o2 < u2) for (; L(e2, i2, e2.bl_tree), 0 != --o2; ) ;
          else 0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
          s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
        }
      }
      n(T);
      var q = false;
      function J(e2, t2, r2, n2) {
        P(e2, (s << 1) + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          M(e3), U(e3, r3), U(e3, ~r3), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
        }(e2, t2, r2);
      }
      r._tr_init = function(e2) {
        q || (function() {
          var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
          for (n2 = r2 = 0; n2 < a - 1; n2++) for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++) A[r2++] = n2;
          for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++) for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++) E[i2++] = n2;
          for (i2 >>= 7; n2 < f; n2++) for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++) E[256 + i2++] = n2;
          for (t2 = 0; t2 <= g; t2++) s2[t2] = 0;
          for (e3 = 0; e3 <= 143; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
          for (; e3 <= 255; ) z[2 * e3 + 1] = 9, e3++, s2[9]++;
          for (; e3 <= 279; ) z[2 * e3 + 1] = 7, e3++, s2[7]++;
          for (; e3 <= 287; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
          for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++) C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
          O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
        }(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
      }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
        var i2, s2, a2 = 0;
        0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = function(e3) {
          var t3, r3 = 4093624447;
          for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1) if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3]) return o;
          if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26]) return h;
          for (t3 = 32; t3 < u; t3++) if (0 !== e3.dyn_ltree[2 * t3]) return h;
          return o;
        }(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = function(e3) {
          var t3;
          for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--) ;
          return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
        }(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          var i3;
          for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++) P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
          V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
        }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
      }, r._tr_tally = function(e2, t2, r2) {
        return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
      }, r._tr_align = function(e2) {
        P(e2, 2, 3), L(e2, m, z), function(e3) {
          16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
        }(e2);
      };
    }, { "../utils/common": 41 }], 53: [function(e, t, r) {
      t.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}], 54: [function(e, t, r) {
      (function(e2) {
        !function(r2, n) {
          if (!r2.setImmediate) {
            var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
            e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
              process.nextTick(function() {
                c(e4);
              });
            } : function() {
              if (r2.postMessage && !r2.importScripts) {
                var e4 = true, t3 = r2.onmessage;
                return r2.onmessage = function() {
                  e4 = false;
                }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
              }
            }() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
              r2.postMessage(a + e4, "*");
            }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
              c(e4.data);
            }, function(e4) {
              t2.port2.postMessage(e4);
            }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
              var t3 = l.createElement("script");
              t3.onreadystatechange = function() {
                c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
              }, s.appendChild(t3);
            }) : function(e4) {
              setTimeout(c, 0, e4);
            }, e3.setImmediate = function(e4) {
              "function" != typeof e4 && (e4 = new Function("" + e4));
              for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++) t3[r3] = arguments[r3 + 1];
              var n2 = { callback: e4, args: t3 };
              return h[o] = n2, i(o), o++;
            }, e3.clearImmediate = f;
          }
          function f(e4) {
            delete h[e4];
          }
          function c(e4) {
            if (u) setTimeout(c, 0, e4);
            else {
              var t3 = h[e4];
              if (t3) {
                u = true;
                try {
                  !function(e5) {
                    var t4 = e5.callback, r3 = e5.args;
                    switch (r3.length) {
                      case 0:
                        t4();
                        break;
                      case 1:
                        t4(r3[0]);
                        break;
                      case 2:
                        t4(r3[0], r3[1]);
                        break;
                      case 3:
                        t4(r3[0], r3[1], r3[2]);
                        break;
                      default:
                        t4.apply(n, r3);
                    }
                  }(t3);
                } finally {
                  f(e4), u = false;
                }
              }
            }
          }
          function d(e4) {
            e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
          }
        }("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
      }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}] }, {}, [10])(10);
  });
})(jszip_min);
var jszip_minExports = jszip_min.exports;
const JSZip = /* @__PURE__ */ getDefaultExportFromCjs(jszip_minExports);
function looksLikeTiptapJson(content) {
  if (!content || typeof content !== "string") return false;
  const trimmed = content.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    const parsed = JSON.parse(trimmed);
    return Boolean(parsed && typeof parsed === "object" && parsed.type === "doc");
  } catch {
    return false;
  }
}
function applyMark(mark, text2) {
  switch (mark.type) {
    case "bold":
    case "strong":
      return `<strong>${text2}</strong>`;
    case "italic":
    case "em":
      return `<em>${text2}</em>`;
    case "underline":
      return `<u>${text2}</u>`;
    case "strike":
      return `<s>${text2}</s>`;
    case "code":
      return `<code>${text2}</code>`;
    case "link": {
      const href = mark.attrs?.href ?? "#";
      return `<a href="${escapeAttr(href)}">${text2}</a>`;
    }
    default:
      return text2;
  }
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(value) {
  return escapeHtml(String(value)).replace(/"/g, "&quot;");
}
function renderNode(node) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "text") {
    let text2 = escapeHtml(node.text ?? "");
    for (const mark of node.marks ?? []) {
      text2 = applyMark(mark, text2);
    }
    return text2;
  }
  const children2 = Array.isArray(node.content) ? node.content.map(renderNode).join("") : "";
  switch (node.type) {
    case "doc":
      return children2;
    case "paragraph":
      return `<p>${children2 || "<br>"}</p>`;
    case "heading": {
      const level = Math.min(6, Math.max(1, Number(node.attrs?.level) || 1));
      return `<h${level}>${children2}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${children2}</ul>`;
    case "orderedList":
      return `<ol>${children2}</ol>`;
    case "listItem":
      return `<li>${children2}</li>`;
    case "blockquote":
      return `<blockquote>${children2}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children2}</code></pre>`;
    case "horizontalRule":
      return "<hr>";
    case "hardBreak":
      return "<br>";
    case "image": {
      const src = node.attrs?.src ?? "";
      const alt = node.attrs?.alt ?? "";
      const title = node.attrs?.title ?? "";
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
      return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${titleAttr}>`;
    }
    case "table":
      return `<table>${children2}</table>`;
    case "tableRow":
      return `<tr>${children2}</tr>`;
    case "tableHeader":
      return `<th>${children2}</th>`;
    case "tableCell":
      return `<td>${children2}</td>`;
    default:
      return children2;
  }
}
function tiptapJsonToHtml(content) {
  const parsed = typeof content === "string" ? JSON.parse(content) : content;
  return renderNode(parsed);
}
class AuthorSyncAdapter {
  /**
   * Converts a Foundry JournalEntry into an AuthorSync-compatible tree node array.
   * @param {JournalEntry} journalEntry - The Foundry JournalEntry to export.
   * @returns {Array<Object>} The AuthorSync tree node array.
   */
  static exportJournal(journalEntry) {
    log.i(`Exporting JournalEntry "${journalEntry.name}" to AuthorSync format`);
    const rootNode = {
      id: journalEntry.id,
      label: journalEntry.name,
      type: "branch",
      children: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const pages = journalEntry.pages.contents.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    rootNode.children = pages.map((page) => {
      const isMarkdown = page.text.format === CONST.JOURNAL_ENTRY_PAGE_FORMATS.MARKDOWN;
      return {
        id: page.id,
        label: page.name,
        type: "leaf",
        content: isMarkdown ? page.text.markdown || page.text.content || "" : page.text.content || "",
        contentType: isMarkdown ? "markdown" : "html",
        order: page.sort || 0,
        createdAt: page._stats?.createdTime || Date.now(),
        updatedAt: page._stats?.modifiedTime || Date.now()
      };
    });
    return [rootNode];
  }
  /**
   * Export a JournalEntry as a zip bundle that includes exported data and referenced assets.
   * @param {JournalEntry} journalEntry
   * @returns {Promise<Blob>} Zip blob containing the export
   */
  static async exportJournalAsZip(journalEntry) {
    const exportData = this.exportJournal(journalEntry);
    const zip = new JSZip();
    zip.file("data.json", JSON.stringify(exportData, null, 2));
    const assetUrls = this.extractAssetUrlsFromJournal(journalEntry);
    if (assetUrls.size > 0) {
      const assetsFolder = zip.folder("assets");
      await Promise.all(Array.from(assetUrls, async (assetUrl) => {
        try {
          const blob = await this.downloadAssetBlob(assetUrl);
          const filename = this.assetFilename(assetUrl);
          assetsFolder.file(filename, blob);
        } catch (error) {
          console.warn("AuthorSyncAdapter: failed to bundle asset", assetUrl, error);
        }
      }));
    }
    return zip.generateAsync({ type: "blob" });
  }
  static extractAssetUrlsFromJournal(journalEntry) {
    const urls = /* @__PURE__ */ new Set();
    const markdownImageRegex = /!\[[^\]]*]\(([^)]+)\)/g;
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    for (const page of journalEntry.pages.contents) {
      const content = page.text.content || "";
      if (page.text.format === 1) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, "text/html");
          doc.querySelectorAll("img").forEach((img) => {
            if (img.src) urls.add(img.src);
          });
        } catch (error) {
          console.warn("AuthorSyncAdapter: HTML parse failed", error);
        }
      }
      let match;
      while ((match = markdownImageRegex.exec(content)) !== null) {
        if (match[1]) urls.add(match[1]);
      }
      while ((match = htmlImageRegex.exec(content)) !== null) {
        if (match[1]) urls.add(match[1]);
      }
    }
    return urls;
  }
  static assetFilename(assetUrl) {
    try {
      const url = new URL(assetUrl, window.location.href);
      return url.pathname.split("/").pop() || `asset-${Date.now()}`;
    } catch {
      return `asset-${Date.now()}`;
    }
  }
  static async downloadAssetBlob(assetUrl) {
    const resolvedUrl = new URL(assetUrl, window.location.href).toString();
    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(`Failed to download asset ${resolvedUrl}: ${response.statusText}`);
    }
    return await response.blob();
  }
  static downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  /**
   * Parse AuthorSync export JSON into a node array (tree or single node).
   * @param {unknown} authorSyncJson
   * @returns {Array<Object>}
   */
  static parseImportNodes(authorSyncJson) {
    if (Array.isArray(authorSyncJson)) {
      return authorSyncJson;
    }
    if (authorSyncJson && typeof authorSyncJson === "object") {
      if (Array.isArray(authorSyncJson.tree)) {
        return authorSyncJson.tree;
      }
      if (authorSyncJson.type === "branch" || authorSyncJson.type === "leaf") {
        return [authorSyncJson];
      }
    }
    throw new Error("Invalid AuthorSync JSON format");
  }
  /**
   * Import an AuthorSync .zip or .json file into Foundry journals.
   * @param {File|Blob} file
   * @param {{ parentFolderId?: string|null, createImportFolder?: boolean }} [options]
   * @returns {Promise<Array<JournalEntry|Folder>>}
   */
  static async importFromFile(file, options = {}) {
    const name = file.name?.toLowerCase?.() ?? "";
    if (name.endsWith(".zip")) {
      return this.importFromZip(file, options);
    }
    const text2 = await file.text();
    const parsed = JSON.parse(text2);
    const nodes = this.parseImportNodes(parsed);
    const preparedNodes = await this.prepareNodesForFoundry(nodes, /* @__PURE__ */ new Map());
    return this.importToJournal(preparedNodes, options);
  }
  /**
   * Import an AuthorSync zip bundle (data.json plus images/assets).
   * @param {Blob|File} zipBlob
   * @param {{ parentFolderId?: string|null, createImportFolder?: boolean }} [options]
   * @returns {Promise<Array<JournalEntry|Folder>>}
   */
  static async importFromZip(zipBlob, options = {}) {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipBlob);
    const dataFile = zipContent.file("data.json");
    if (!dataFile) {
      throw new Error("Invalid AuthorSync export: missing data.json");
    }
    const parsed = JSON.parse(await dataFile.async("string"));
    const nodes = this.parseImportNodes(parsed);
    const imageBlobs = await this.extractImageBlobsFromZip(zipContent);
    const preparedNodes = await this.prepareNodesForFoundry(nodes, imageBlobs);
    return this.importToJournal(preparedNodes, options);
  }
  /**
   * @param {JSZip} zipContent
   * @returns {Promise<Map<string, Blob>>}
   */
  static async extractImageBlobsFromZip(zipContent) {
    const images = /* @__PURE__ */ new Map();
    for (const folderName of ["images", "assets"]) {
      const prefix = `${folderName}/`;
      await Promise.all(
        Object.keys(zipContent.files).map(async (fullPath) => {
          if (!fullPath.startsWith(prefix) || fullPath.endsWith("/")) return;
          const file = zipContent.file(fullPath);
          if (!file) return;
          const blob = await file.async("blob");
          const storageKey = fullPath.slice(prefix.length);
          if (!storageKey) return;
          images.set(storageKey, blob);
          const withoutExt = storageKey.replace(/\.[^/.]+$/, "");
          if (withoutExt !== storageKey) {
            images.set(withoutExt, blob);
          }
          const basename = storageKey.split("/").pop();
          if (basename) {
            images.set(basename, blob);
            const basenameNoExt = basename.replace(/\.[^/.]+$/, "");
            if (basenameNoExt !== basename) {
              images.set(basenameNoExt, blob);
            }
          }
        })
      );
    }
    return images;
  }
  /**
   * @param {string} src
   * @returns {string|null}
   */
  static parseImageStorageKey(src) {
    if (!src || typeof src !== "string") return null;
    const apiPathMatch = src.match(/\/api\/images\/[^/]+\/([^/"'\s)?]+)/);
    if (apiPathMatch) return apiPathMatch[1];
    const queryMatch = src.match(/[?&]imageId=([^&"'\s)]+)/);
    if (queryMatch) {
      const imageId = queryMatch[1];
      return imageId.includes(".") ? imageId : `${imageId}.jpg`;
    }
    const legacyPathMatch = src.match(/\/api\/images\/(.+?)(?:\.|$|[)"'])/);
    if (legacyPathMatch) {
      const segment = legacyPathMatch[1].split("/").pop() || legacyPathMatch[1];
      return segment.includes(".") ? segment : `${segment}.jpg`;
    }
    const assetMatch = src.match(
      /(?:^|\/)assets\/([^/"'\s)?]+\.[a-zA-Z0-9]+)|(?:images\/)([^/"'\s)?]+\.[a-zA-Z0-9]+)/
    );
    if (assetMatch) return assetMatch[1] || assetMatch[2];
    const filenameMatch = src.match(/([^/"'\s)?]+\.(?:png|jpe?g|gif|webp|svg))/i);
    if (filenameMatch) return filenameMatch[1];
    return null;
  }
  /**
   * @param {Map<string, Blob>} imageBlobs
   * @returns {Promise<Map<string, string>>}
   */
  static async uploadImportImages(imageBlobs) {
    const uploaded = /* @__PURE__ */ new Map();
    if (!imageBlobs.size) return uploaded;
    const basePath = `worlds/${game.world.id}/authorsync-import`;
    const uploadedByFilename = /* @__PURE__ */ new Map();
    for (const [storageKey, blob] of imageBlobs.entries()) {
      const filename = storageKey.includes("/") ? storageKey.split("/").pop() : storageKey;
      if (!filename) continue;
      let path = uploadedByFilename.get(filename);
      if (!path) {
        const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
        const targetPath = `${basePath}/${filename}`;
        const response = await FilePicker.upload("data", targetPath, file, {}, { notify: false });
        path = response?.path ?? targetPath;
        uploadedByFilename.set(filename, path);
      }
      uploaded.set(storageKey, path);
      const withoutExt = storageKey.replace(/\.[^/.]+$/, "");
      if (withoutExt !== storageKey) uploaded.set(withoutExt, path);
      uploaded.set(filename, path);
      uploaded.set(`assets/${filename}`, path);
      uploaded.set(`images/${filename}`, path);
    }
    return uploaded;
  }
  /**
   * @param {string} src
   * @param {Map<string, string>} uploadedImages
   * @returns {string}
   */
  static rewriteImageReference(src, uploadedImages) {
    const storageKey = this.parseImageStorageKey(src);
    if (!storageKey) return src;
    for (const candidate of [
      storageKey,
      storageKey.replace(/\.[^/.]+$/, ""),
      storageKey.split("/").pop()
    ]) {
      if (candidate && uploadedImages.has(candidate)) {
        return uploadedImages.get(candidate);
      }
    }
    return src;
  }
  /**
   * @param {string} content
   * @param {Map<string, string>} uploadedImages
   * @returns {string}
   */
  static rewriteImageUrlsInContent(content, uploadedImages) {
    if (!content || uploadedImages.size === 0) return content;
    if (looksLikeTiptapJson(content)) {
      const doc = JSON.parse(content);
      const rewriteNode = (node) => {
        if (!node || typeof node !== "object") return;
        if (node.type === "image" && node.attrs?.src) {
          node.attrs.src = this.rewriteImageReference(node.attrs.src, uploadedImages);
        }
        for (const child of node.content ?? []) {
          rewriteNode(child);
        }
      };
      rewriteNode(doc);
      return JSON.stringify(doc);
    }
    return content.replace(/!\[[^\]]*]\(([^)]+)\)/g, (match, src) => {
      const rewritten = this.rewriteImageReference(src, uploadedImages);
      return rewritten === src ? match : `![](${rewritten})`;
    }).replace(/<img([^>]+)src=["']([^"']+)["']/gi, (match, attrs, src) => {
      const rewritten = this.rewriteImageReference(src, uploadedImages);
      return rewritten === src ? match : `<img${attrs}src="${rewritten}"`;
    });
  }
  /**
   * @param {Array<Object>} nodes
   * @param {Map<string, Blob>} imageBlobs
   * @returns {Promise<Array<Object>>}
   */
  static async prepareNodesForFoundry(nodes, imageBlobs) {
    const uploadedImages = await this.uploadImportImages(imageBlobs);
    const prepareNode = async (node) => {
      if (!node || typeof node !== "object") return null;
      const copy = { ...node };
      if (copy.type === "leaf" && copy.content) {
        let content = this.rewriteImageUrlsInContent(copy.content, uploadedImages);
        if (looksLikeTiptapJson(content)) {
          copy.content = tiptapJsonToHtml(content);
          copy.contentType = "html";
        } else if (!copy.contentType) {
          copy.contentType = content.trim().startsWith("<") ? "html" : "markdown";
        }
      }
      if (Array.isArray(copy.children)) {
        const children2 = [];
        for (const child of copy.children) {
          const preparedChild = await prepareNode(child);
          if (preparedChild) children2.push(preparedChild);
        }
        copy.children = children2;
      }
      return copy;
    };
    const prepared = [];
    for (const node of nodes) {
      const preparedNode = await prepareNode(node);
      if (preparedNode) prepared.push(preparedNode);
    }
    return prepared;
  }
  /**
   * @param {Array<Object>|Object} authorSyncJson
   * @param {{ parentFolderId?: string|null, createImportFolder?: boolean }} [options]
   * @returns {Promise<Array<JournalEntry|Folder>>}
   */
  static async importToJournal(authorSyncJson, options = {}) {
    log.i(`Importing AuthorSync tree to Foundry`);
    const nodes = Array.isArray(authorSyncJson) ? authorSyncJson : this.parseImportNodes(authorSyncJson);
    let parentFolderId = options.parentFolderId ?? null;
    if (options.createImportFolder !== false && parentFolderId == null) {
      const importFolder = await Folder.create({
        name: "AuthorSync Import",
        type: "JournalEntry",
        parent: null
      });
      parentFolderId = importFolder.id;
    }
    const createdItems = [];
    for (const node of nodes) {
      const item = await this.importNodeRecursive(node, parentFolderId);
      if (item) createdItems.push(item);
    }
    log.i(`Successfully imported ${createdItems.length} top-level AuthorSync node(s)`);
    return createdItems;
  }
  static async importNodeRecursive(node, parentFolderId) {
    if (!node) return null;
    if (node.type === "branch") {
      const branchLeaves = (node.children || []).filter((child) => child.type === "leaf");
      const branchBranches = (node.children || []).filter((child) => child.type === "branch");
      if (branchBranches.length === 0 && branchLeaves.length > 0) {
        const journalEntry = await JournalEntry.create({
          name: node.label || "Imported from AuthorSync",
          folder: parentFolderId
        });
        const pageData = branchLeaves.map(
          (child, index) => this.buildJournalPageData(child, index)
        );
        if (pageData.length > 0) {
          await journalEntry.createEmbeddedDocuments("JournalEntryPage", pageData);
        }
        return journalEntry;
      }
      const folder = await Folder.create({
        name: node.label || "Imported Branch",
        type: "JournalEntry",
        parent: parentFolderId
      });
      for (const child of node.children || []) {
        await this.importNodeRecursive(child, folder.id);
      }
      return folder;
    }
    if (node.type === "leaf") {
      const journalEntry = await JournalEntry.create({
        name: node.label || "Imported from AuthorSync",
        folder: parentFolderId
      });
      const pageData = [this.buildJournalPageData(node, node.order || 0)];
      await journalEntry.createEmbeddedDocuments("JournalEntryPage", pageData);
      return journalEntry;
    }
    return null;
  }
  /**
   * Build Foundry journal page data from an AuthorSync leaf node.
   * @param {Object} node
   * @param {number} sort
   * @returns {Object}
   */
  static buildJournalPageData(node, sort = 0) {
    const isMarkdown = node.contentType === "markdown";
    const source = node.content || "";
    const text2 = {
      format: isMarkdown ? CONST.JOURNAL_ENTRY_PAGE_FORMATS.MARKDOWN : CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML,
      content: isMarkdown ? "" : source
    };
    if (isMarkdown) {
      text2.markdown = source;
      const converter = foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet?._converter;
      if (converter?.makeHTML) {
        text2.content = converter.makeHTML(source);
      }
    }
    return {
      name: node.label || "Page",
      type: "text",
      text: text2,
      sort: node.order ?? sort
    };
  }
}
const AUTHORSYNC_LOGO_ICON_CLASS = "authorsync-logo-icon";
function authorsyncButtonHtml(label) {
  return `<i class="${AUTHORSYNC_LOGO_ICON_CLASS}"></i> ${label}`;
}
function pickAuthorSyncImportFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip,.json,application/zip,application/json";
    input.addEventListener("change", () => resolve(input.files?.[0] ?? null));
    input.addEventListener("cancel", () => resolve(null));
    input.click();
  });
}
function decorateAuthorSyncButton(button, label) {
  button.type = "button";
  button.classList.add("button", "authorsync-action-btn");
  button.setAttribute("data-tooltip", label);
  button.innerHTML = authorsyncButtonHtml(label);
}
function pushJournalContextOption(options, config) {
  const iconClass = config.iconClass ?? AUTHORSYNC_LOGO_ICON_CLASS;
  const visible = config.visible ?? (() => true);
  const onClick = config.onClick;
  if (Number(game.version) >= 13) {
    options.push({
      name: config.label,
      icon: `<i class="${iconClass}"></i>`,
      condition: visible,
      callback: (li) => onClick(new Event("click"), li)
    });
    return;
  }
  options.push({
    label: config.label,
    icon: iconClass,
    visible,
    onClick
  });
}
async function runAuthorSyncImport() {
  const file = await pickAuthorSyncImportFile();
  if (!file) return;
  const created = await AuthorSyncAdapter.importFromFile(file, {
    parentFolderId: null,
    createImportFolder: true
  });
  const count = created.length;
  ui.notifications.info(
    count === 1 ? `Imported 1 item from AuthorSync` : `Imported ${count} items from AuthorSync`
  );
}
async function runAuthorSyncExport(journal) {
  const zipBlob = await AuthorSyncAdapter.exportJournalAsZip(journal);
  AuthorSyncAdapter.downloadBlob(zipBlob, `authorsync-${journal.name.slugify()}.zip`);
  ui.notifications.info(`Exported "${journal.name}" to AuthorSync zip`);
}
function createAuthorSyncActionButton(action, handler) {
  const button = document.createElement("button");
  decorateAuthorSyncButton(button, action === "export" ? "Export" : "Import");
  button.classList.add(`authorsync-${action}-btn`);
  button.addEventListener("click", handler);
  return button;
}
async function handleExport(journal) {
  try {
    await runAuthorSyncExport(journal);
  } catch (err) {
    console.error(err);
    ui.notifications.error(`AuthorSync export failed: ${err.message}`);
  }
}
async function handleImport() {
  try {
    await runAuthorSyncImport();
  } catch (err) {
    console.error(err);
    ui.notifications.error(`AuthorSync import failed: ${err.message}`);
  }
}
function init(app, html, data) {
  log.i("Initialising");
  if (safeGetSetting(MODULE_ID, "debug.hooks", false)) {
    CONFIG.debug.hooks = true;
  }
  if (game.version > 13) {
    window.MIN_WINDOW_WIDTH = 200;
    window.MIN_WINDOW_HEIGHT = 50;
  }
  registerSettings();
  Hooks.on("renderJournalEntrySheet", (app2, html2) => {
    const header = html2.querySelector(".journal-header");
    if (!header) return;
    if (header.querySelector(".authorsync-export-btn")) return;
    const exportButton = createAuthorSyncActionButton("export", async () => {
      await handleExport(app2.document);
    });
    header.append(exportButton);
  });
  Hooks.on("renderJournalDirectory", (app2, html2) => {
    const header = html2.querySelector(".directory-header .header-actions") ?? html2.querySelector(".directory-header .action-buttons") ?? html2.querySelector(".directory-header");
    if (!header) return;
    if (header.querySelector(".authorsync-import-btn")) return;
    const importButton = createAuthorSyncActionButton("import", async () => {
      await handleImport();
    });
    header.append(importButton);
  });
  Hooks.on("getJournalEntryContextOptions", (directory, options) => {
    pushJournalContextOption(options, {
      label: "Export to AuthorSync",
      visible: (li) => {
        const entryId = li.dataset.entryId;
        const entry = directory.collection.get(entryId);
        return entry?.isOwner;
      },
      onClick: async (_event, li) => {
        const entryId = li.dataset.entryId;
        const journal = directory.collection.get(entryId);
        if (!journal) return;
        await handleExport(journal);
      }
    });
  });
}
function ready(app, html, data) {
  if (!game.modules.get(MODULE_ID).active) {
    log.w("Module is not active");
    return;
  }
  if (!safeGetSetting(MODULE_ID, "dontShowWelcome", false)) {
    new WelcomeApplication().render(true, { focus: true });
  }
}
window.log = log;
log.level = log.DEBUG;
Hooks.once("init", init);
Hooks.once("ready", ready);
//# sourceMappingURL=index.js.map
