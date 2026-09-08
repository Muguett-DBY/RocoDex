var RUNTIME_PUBLIC_PATH = "server/chunks/ssr/[turbopack]_runtime.js";
var RELATIVE_ROOT_PATH = "..";
var ASSET_PREFIX = "/_next/";
// Apply forwarded globals from workerData if running in a worker thread
if (typeof require !== 'undefined') {
    try {
        var { workerData } = require('worker_threads');
        if (workerData?.__turbopack_globals__) {
            Object.assign(globalThis, workerData.__turbopack_globals__);
            // Remove internal data so it's not visible to user code
            delete workerData.__turbopack_globals__;
        }
    } catch (_) {
        // Not in a worker thread context, ignore
    }
}
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
/// <reference path="./async-module.ts" />
/**
 * Describes why a module was instantiated.
 * Shared between browser and Node.js runtimes.
 */ var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    /**
   * The module was instantiated because it was included in a chunk's hot module
   * update.
   * SourceData is an array of ModuleIds or undefined.
   */ SourceType[SourceType["Update"] = 2] = "Update";
    return SourceType;
}(SourceType || {});
/**
 * Flag indicating which module object type to create when a module is merged. Set to `true`
 * by each runtime that uses ModuleWithDirection (browser dev-base.ts, nodejs dev-base.ts,
 * nodejs build-base.ts). Browser production (build-base.ts) leaves it as `false` since it
 * uses plain Module objects.
 */ let createModuleWithDirectionFlag = false;
const REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
const contextPrototype = Context.prototype;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    let module = moduleCache[id];
    if (!module) {
        if (createModuleWithDirectionFlag) {
            // set in development modes for hmr support
            module = createModuleWithDirection(id);
        } else {
            module = createModuleObject(id);
        }
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined
    };
}
function createModuleWithDirection(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined,
        parents: [],
        children: []
    };
}
const BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings, dynamic) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    let i = 0;
    while(i < bindings.length){
        const propName = bindings[i++];
        const tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error(`unexpected tag: ${tagOrFunction}`);
            }
        } else {
            const getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                const setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    // The properties defined above are already non-configurable and
    // non-writable, so the namespace's existing exports are effectively
    // immutable. Sealing additionally makes the object non-extensible, matching
    // real ESM-namespace semantics. Modules with dynamic re-exports
    // (`export *` from a CommonJS module) must stay extensible so the dynamic
    // export proxy can surface keys discovered at runtime, so skip the seal for
    // them.
    if (!dynamic) Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id, dynamic) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings, dynamic);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    let reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        // Returns the re-exported object that provides `prop` as an own property,
        // or `undefined` if none does. The traps share this logic so they always
        // agree on which keys are synthesized from `reexportedObjects`. `default`
        // is never re-exported by `export *`, so it is never synthesized.
        const reexportOwning = (prop)=>{
            if (prop !== 'default') {
                for (const obj of reexportedObjects){
                    if (hasOwnProperty.call(obj, prop)) return obj;
                }
            }
            return undefined;
        };
        // Modules with dynamic re-exports are not sealed by `esm()`, so the
        // target beneath the namespace stays extensible. That is what lets the
        // `ownKeys` and `getOwnPropertyDescriptor` traps legally report keys that
        // exist on `reexportedObjects` but not on the target itself.
        module.exports = module.namespaceObject = new Proxy(exports, {
            get (target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                const obj = reexportOwning(prop);
                return obj && Reflect.get(obj, prop);
            },
            // The namespace is read-only, like a real esm namespace object. The
            // re-exported modules can still mutate their own exports (exposed live
            // via `get`), but mutating the namespace itself is rejected. Refusing
            // here, rather than forwarding to the extensible target, also prevents an
            // assignment/definition from shadowing a dynamic re-export. It also
            // prevents delete from removing a static export.
            set () {
                return false;
            },
            defineProperty () {
                return false;
            },
            deleteProperty () {
                return false;
            },
            // The `has` trap ensures that `'exportName' in starImports` will reflect
            // the truth of whether a key is exported.
            has (target, prop) {
                if (Reflect.has(target, prop)) return true;
                if (prop === 'default' || prop === '__esModule') return false;
                return reexportOwning(prop) !== undefined;
            },
            // ownKeys and getOwnPropertyDescriptor together make the keys enumerable.
            // If a value is returned from `ownKeys` but its property descriptor is
            // not enumerable, it will not be visible to iterator methods.
            // Collectively, they allow code like the following:
            //
            // ```
            // // module.js re-exports dynamic CJS exports
            // export * from './legacyModule.cjs'
            //
            // // from another JS file, reference the re-exported dynamic values
            // import * as Namespace from './module.js'
            // Object.keys(Namespace)
            // ```
            ownKeys (target) {
                const keys = Reflect.ownKeys(target);
                for (const obj of reexportedObjects){
                    for (const key of Reflect.ownKeys(obj)){
                        if (key !== 'default' && !keys.includes(key)) keys.push(key);
                    }
                }
                return keys;
            },
            getOwnPropertyDescriptor (target, prop) {
                const own = Reflect.getOwnPropertyDescriptor(target, prop);
                if (own || prop === 'default' || prop === '__esModule') return own;
                const obj = reexportOwning(prop);
                if (obj) {
                    // Synthetic keys don't exist on the target, so they MUST be
                    // reported as configurable. However the set/delete traps above will
                    // prevent them from actually being changed
                    return {
                        enumerable: true,
                        configurable: true,
                        get: ()=>Reflect.get(obj, prop)
                    };
                }
                return undefined;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    const reexportedObjects = ensureDynamicExports(module, exports);
    if (typeof object === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return ()=>obj[key];
}
/**
 * @returns prototype of the object
 */ const getProto = Object.getPrototypeOf ? (obj)=>Object.getPrototypeOf(obj) : (obj)=>obj.__proto__;
/** Prototypes that are not expanded for exports */ const LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    const bindings = [];
    let defaultLocation = -1;
    for(let current = raw; (typeof current === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        for (const key of Object.getOwnPropertyNames(current)){
            bindings.push(key, createGetter(raw, key));
            if (defaultLocation === -1 && key === 'default') {
                defaultLocation = bindings.length - 1;
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function(...args) {
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    const module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    const raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    const loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
const runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * Remove fragments and query parameters since they are never part of the context map keys
 *
 * This matches how we parse patterns at resolving time.  Arguably we should only do this for
 * strings passed to `import` but the resolve does it for `import` and `require` and so we do
 * here as well.
 */ function parseRequest(request) {
    // Per the URI spec fragments can contain `?` characters, so we should trim it off first
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
    const hashIndex = request.indexOf('#');
    if (hashIndex !== -1) {
        request = request.substring(0, hashIndex);
    }
    const queryIndex = request.indexOf('?');
    if (queryIndex !== -1) {
        request = request.substring(0, queryIndex);
    }
    return request;
}
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = ()=>{
        return Object.keys(map);
    };
    moduleContext.resolve = (id)=>{
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = async (id)=>{
        return await moduleContext(id);
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    let i = offset;
    while(i < chunkModules.length){
        let end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Install the factory for each module ID that doesn't already have one.
        // When some IDs in this group already have a factory, reuse that existing
        // group factory for the missing IDs to keep all IDs in the group consistent.
        // Otherwise, install the factory from this chunk.
        const moduleFactoryFn = chunkModules[end];
        let existingGroupFactory = undefined;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            const existingFactory = moduleFactories.get(id);
            if (existingFactory) {
                existingGroupFactory = existingFactory;
                break;
            }
        }
        const factoryToInstall = existingGroupFactory ?? moduleFactoryFn;
        let didInstallFactory = false;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            if (!moduleFactories.has(id)) {
                if (!didInstallFactory) {
                    if (factoryToInstall === moduleFactoryFn) {
                        applyModuleFactoryName(moduleFactoryFn);
                    }
                    didInstallFactory = true;
                }
                moduleFactories.set(id, factoryToInstall);
                newModuleId?.(id);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ const relativeURL = function relativeURL(inputUrl) {
    const realUrl = new URL(inputUrl, 'x:/');
    const values = {};
    for(const key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = (..._args)=>inputUrl;
    for(const key in values)Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        value: values[key]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error(`Invariant: ${computeMessage(never)}`);
}
/**
 * Constructs an error message for when a module factory is not available.
 */ function factoryNotAvailableMessage(moduleId, sourceType, sourceData) {
    let instantiationReason;
    switch(sourceType){
        case 0:
            instantiationReason = `as a runtime entry of chunk ${sourceData}`;
            break;
        case 1:
            instantiationReason = `because it was required from module ${sourceData}`;
            break;
        case 2:
            instantiationReason = 'because of an HMR update';
            break;
        default:
            invariant(sourceType, (sourceType)=>`Unknown source type: ${sourceType}`);
    }
    return `Module ${moduleId} was instantiated ${instantiationReason}, but the module factory is not available.`;
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/// <reference path="./runtime-types.d.ts" />
/// <reference path="./runtime-utils.ts" />
/**
 * Top-level-await / async-module machinery. This is only included in the runtime
 * when the module graph actually contains an async module (a module with
 * top-level await, or one that transitively depends on one). When no async
 * module is present, the chunk items never reference `__turbopack_context__.a`,
 * so this whole file can be omitted.
 *
 * everything below is adapted from webpack
 * https://github.com/webpack/webpack/blob/6be4065ade1e252c1d8dcba4af0f43e32af1bdc1/lib/runtime/AsyncModuleRuntimeModule.js#L13
 */ const turbopackQueues = Symbol('turbopack queues');
const turbopackExports = Symbol('turbopack exports');
const turbopackError = Symbol('turbopack error');
function isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise === 'object' && 'then' in maybePromise && typeof maybePromise.then === 'function';
}
function isAsyncModuleExt(obj) {
    return turbopackQueues in obj;
}
function createPromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        reject = rej;
        resolve = res;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
}
function resolveQueue(queue) {
    if (queue && queue.status !== 1) {
        queue.status = 1;
        queue.forEach((fn)=>fn.queueCount--);
        queue.forEach((fn)=>fn.queueCount-- ? fn.queueCount++ : fn());
    }
}
function wrapDeps(deps) {
    return deps.map((dep)=>{
        if (dep !== null && typeof dep === 'object') {
            if (isAsyncModuleExt(dep)) return dep;
            if (isPromise(dep)) {
                const queue = Object.assign([], {
                    status: 0
                });
                const obj = {
                    [turbopackExports]: {},
                    [turbopackQueues]: (fn)=>fn(queue)
                };
                dep.then((res)=>{
                    obj[turbopackExports] = res;
                    resolveQueue(queue);
                }, (err)=>{
                    obj[turbopackError] = err;
                    resolveQueue(queue);
                });
                return obj;
            }
        }
        return {
            [turbopackExports]: dep,
            [turbopackQueues]: ()=>{}
        };
    });
}
function asyncModule(body, hasAwait) {
    const module = this.m;
    const queue = hasAwait ? Object.assign([], {
        status: -1
    }) : undefined;
    const depQueues = new Set();
    const { resolve, reject, promise: rawPromise } = createPromise();
    const promise = Object.assign(rawPromise, {
        [turbopackExports]: module.exports,
        [turbopackQueues]: (fn)=>{
            queue && fn(queue);
            depQueues.forEach(fn);
            promise['catch'](()=>{});
        }
    });
    const attributes = {
        get () {
            return promise;
        },
        set (v) {
            // Calling `esmExport` leads to this.
            if (v !== promise) {
                promise[turbopackExports] = v;
            }
        }
    };
    Object.defineProperty(module, 'exports', attributes);
    Object.defineProperty(module, 'namespaceObject', attributes);
    function handleAsyncDependencies(deps) {
        const currentDeps = wrapDeps(deps);
        const getResult = ()=>currentDeps.map((d)=>{
                if (d[turbopackError]) throw d[turbopackError];
                return d[turbopackExports];
            });
        const { promise, resolve } = createPromise();
        const fn = Object.assign(()=>resolve(getResult), {
            queueCount: 0
        });
        function fnQueue(q) {
            if (q !== queue && !depQueues.has(q)) {
                depQueues.add(q);
                if (q && q.status === 0) {
                    fn.queueCount++;
                    q.push(fn);
                }
            }
        }
        currentDeps.map((dep)=>dep[turbopackQueues](fnQueue));
        return fn.queueCount ? promise : getResult();
    }
    function asyncResult(err) {
        if (err) {
            reject(promise[turbopackError] = err);
        } else {
            resolve(promise[turbopackExports]);
        }
        resolveQueue(queue);
    }
    body(handleAsyncDependencies, asyncResult);
    if (queue && queue.status === -1) {
        queue.status = 0;
    }
}
contextPrototype.a = asyncModule;
/// <reference path="../shared/runtime/runtime-utils.ts" />
/// A 'base' utilities to support runtime can have externals.
/// Currently this is for node.js / edge runtime both.
/// If a fn requires node.js specific behavior, it should be placed in `node-external-utils` instead.
async function externalImport(id) {
    let raw;
    try {
        switch (id) {
  case "next/dist/compiled/@vercel/og/index.node.js":
    raw = await import("next/dist/compiled/@vercel/og/index.edge.js");
    break;
  case "next-mdx-remote-bb3b2464f4f590a5/rsc":
    raw = await import("next-mdx-remote-bb3b2464f4f590a5/rsc");
    break;
  case "shiki-43d062b67f27bbdc":
    raw = await import("shiki-43d062b67f27bbdc");
    break;
  default:
    raw = await import(id);
};
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (raw && raw.__esModule && raw.default && 'default' in raw.default) {
        return interopEsm(raw.default, createNS(raw), true);
    }
    return raw;
}
contextPrototype.y = externalImport;
function externalRequire(id, thunk, esm = false) {
    let raw;
    try {
        raw = thunk();
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (!esm || raw.__esModule) {
        return raw;
    }
    return interopEsm(raw, createNS(raw), true);
}
externalRequire.resolve = (id, options)=>{
    return require.resolve(id, options);
};
contextPrototype.x = externalRequire;
/* eslint-disable @typescript-eslint/no-unused-vars */ const path = require('path');
const relativePathToRuntimeRoot = path.relative(RUNTIME_PUBLIC_PATH, '.');
// Compute the relative path to the `distDir`.
const relativePathToDistRoot = path.join(relativePathToRuntimeRoot, RELATIVE_ROOT_PATH);
const RUNTIME_ROOT = path.resolve(__filename, relativePathToRuntimeRoot);
// Compute the absolute path to the root, by stripping distDir from the absolute path to this file.
const ABSOLUTE_ROOT = path.resolve(__filename, relativePathToDistRoot);
/**
 * Returns an absolute path to the given module path.
 * Module path should be relative, either path to a file or a directory.
 *
 * This fn allows to calculate an absolute path for some global static values, such as
 * `__dirname` or `import.meta.url` that Turbopack will not embeds in compile time.
 * See ImportMetaBinding::code_generation for the usage.
 */ function resolveAbsolutePath(modulePath) {
    if (modulePath) {
        return path.join(ABSOLUTE_ROOT, modulePath);
    }
    return ABSOLUTE_ROOT;
}
Context.prototype.P = resolveAbsolutePath;
/**
 * Returns an absolute `file://` URL for the given module path.
 *
 * Uses `url.pathToFileURL` so that the resulting URL is a valid file URI on
 * all platforms (forward slashes on Windows, drive letters handled
 * correctly, path segments URL-encoded).
 */ function resolveFileUrl(modulePath) {
    return require('url').pathToFileURL(resolveAbsolutePath(modulePath)).href;
}
Context.prototype.F = resolveFileUrl;
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../../shared/runtime/runtime-utils.ts" />
/// <reference path="../../shared-node/base-externals-utils.ts" />
/// <reference path="../../shared-node/node-externals-utils.ts" />
/// <reference path="./nodejs-globals.d.ts" />
/**
 * Base Node.js runtime shared between production and development.
 * Contains chunk loading, module caching, and other non-HMR functionality.
 */ process.env.TURBOPACK = '1';
const url = require('url');
const moduleFactories = new Map();
const moduleCache = Object.create(null);
/**
 * Returns an absolute path to the given module's id.
 */ function resolvePathFromModule(moduleId) {
    const exported = this.r(moduleId);
    const exportedPath = exported?.default ?? exported;
    if (typeof exportedPath !== 'string') {
        return exported;
    }
    const strippedAssetPrefix = exportedPath.slice(ASSET_PREFIX.length);
    const resolved = path.resolve(RUNTIME_ROOT, strippedAssetPrefix);
    return url.pathToFileURL(resolved).href;
}
/**
 * Exports a URL value. No suffix is added in Node.js runtime.
 */ function exportUrl(urlValue, id) {
    exportValue.call(this, urlValue, id);
}
function loadRuntimeChunk(sourcePath, chunkData) {
    if (typeof chunkData === 'string') {
        loadRuntimeChunkPath(sourcePath, chunkData);
    } else {
        loadRuntimeChunkPath(sourcePath, chunkData.path);
    }
}
const loadedChunks = new Set();
const unsupportedLoadChunk = Promise.resolve(undefined);
const loadedChunk = Promise.resolve(undefined);
const chunkCache = new Map();
function clearChunkCache() {
    chunkCache.clear();
    loadedChunks.clear();
}
function loadRuntimeChunkPath(sourcePath, chunkPath) {
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return;
    }
    if (loadedChunks.has(chunkPath)) {
        return;
    }
    try {
        const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
        const chunkModules = requireChunk(chunkPath);
        installCompressedModuleFactories(chunkModules, 0, moduleFactories);
        loadedChunks.add(chunkPath);
    } catch (cause) {
        let errorMessage = `Failed to load chunk ${chunkPath}`;
        if (sourcePath) {
            errorMessage += ` from runtime for chunk ${sourcePath}`;
        }
        const error = new Error(errorMessage, {
            cause
        });
        error.name = 'ChunkLoadError';
        throw error;
    }
}
function loadChunkAsync(chunkData) {
    const chunkPath = typeof chunkData === 'string' ? chunkData : chunkData.path;
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return unsupportedLoadChunk;
    }
    let entry = chunkCache.get(chunkPath);
    if (entry === undefined) {
        try {
            // resolve to an absolute path to simplify `require` handling
            const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
            // TODO: consider switching to `import()` to enable concurrent chunk loading and async file io
            // However this is incompatible with hot reloading (since `import` doesn't use the require cache)
            const chunkModules = requireChunk(chunkPath);
            installCompressedModuleFactories(chunkModules, 0, moduleFactories);
            entry = loadedChunk;
        } catch (cause) {
            const errorMessage = `Failed to load chunk ${chunkPath} from module ${this.m.id}`;
            const error = new Error(errorMessage, {
                cause
            });
            error.name = 'ChunkLoadError';
            // Cache the failure promise, future requests will also get this same rejection
            entry = Promise.reject(error);
        }
        chunkCache.set(chunkPath, entry);
    }
    // TODO: Return an instrumented Promise that React can use instead of relying on referential equality.
    return entry;
}
contextPrototype.l = loadChunkAsync;
function loadChunkAsyncByUrl(chunkUrl) {
    const path1 = url.fileURLToPath(new URL(chunkUrl, RUNTIME_ROOT));
    return loadChunkAsync.call(this, path1);
}
contextPrototype.L = loadChunkAsyncByUrl;
// Shared runtime primitive: the root that on-disk chunk paths are resolved
// against. Used by the bundled wasm helper (exposed as `__turbopack_runtime_root__`).
contextPrototype.w = RUNTIME_ROOT;
const regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-base.ts" />
/**
 * Production Node.js runtime.
 * Uses ModuleWithDirection and simple module instantiation without HMR support.
 */ // moduleCache and moduleFactories are declared in runtime-base.ts
// this is read in runtime-utils.ts so it creates a module with direction for hmr
createModuleWithDirectionFlag = true;
const nodeContextPrototype = Context.prototype;
nodeContextPrototype.q = exportUrl;
nodeContextPrototype.M = moduleFactories;
// Cast moduleCache to ModuleWithDirection for production mode
nodeContextPrototype.c = moduleCache;
nodeContextPrototype.R = resolvePathFromModule;
nodeContextPrototype.C = clearChunkCache;
function instantiateModule(id, sourceType, sourceData) {
    const moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        throw new Error(factoryNotAvailableMessage(id, sourceType, sourceData));
    }
    const module1 = createModuleWithDirection(id);
    const exports = module1.exports;
    moduleCache[id] = module1;
    const context = new Context(module1, exports);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        moduleFactory(context, module1, exports);
    } catch (error) {
        module1.error = error;
        throw error;
    }
    ;
    module1.loaded = true;
    if (module1.namespaceObject && module1.exports !== module1.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module1.exports, module1.namespaceObject);
    }
    return module1;
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore
function getOrInstantiateModuleFromParent(id, sourceModule) {
    const module1 = moduleCache[id];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateModule(id, SourceType.Parent, sourceModule.id);
}
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(chunkPath, moduleId) {
    return instantiateModule(moduleId, SourceType.Runtime, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it as a runtime module if it is not cached.
 */ // @ts-ignore TypeScript doesn't separate this module space from the browser runtime
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    const module1 = moduleCache[moduleId];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateRuntimeModule(chunkPath, moduleId);
}
module.exports = (sourcePath)=>({
        m: (id)=>getOrInstantiateRuntimeModule(sourcePath, id),
        c: (chunkData)=>loadRuntimeChunk(sourcePath, chunkData)
    });


//# sourceMappingURL=%5Bturbopack%5D_runtime.js.map

  function requireChunk(chunkPath) {
    switch(chunkPath) {
      case "server/chunks/[externals]__1_tg3-c._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[externals]__1_tg3-c._.js");
      case "server/chunks/[root-of-the-server]__1dc_hi3._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1dc_hi3._.js");
      case "server/chunks/[turbopack]_runtime.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[turbopack]_runtime.js");
      case "server/chunks/ssr/[root-of-the-server]__0_fk5be._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0_fk5be._.js");
      case "server/chunks/ssr/[root-of-the-server]__0t0d4ms._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0t0d4ms._.js");
      case "server/chunks/ssr/[root-of-the-server]__12u481u._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__12u481u._.js");
      case "server/chunks/ssr/[root-of-the-server]__13y8zco._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__13y8zco._.js");
      case "server/chunks/ssr/[turbopack]_runtime.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[turbopack]_runtime.js");
      case "server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0pt47yr.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0pt47yr.js");
      case "server/chunks/ssr/node_modules_1w8vxjs._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_1w8vxjs._.js");
      case "server/chunks/ssr/node_modules_1wax83z._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_1wax83z._.js");
      case "server/chunks/ssr/node_modules_next_dist_1n3w9lb._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1n3w9lb._.js");
      case "server/chunks/ssr/node_modules_next_dist_1v8aef8._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1v8aef8._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_0wpq8j3._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_0wpq8j3._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_0symwr9.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_0symwr9.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0l_sp0x.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0l_sp0x.js");
      case "server/chunks/ssr/[externals]_next_dist_compiled_@vercel_og_index_node_01np1ap.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[externals]_next_dist_compiled_@vercel_og_index_node_01np1ap.js");
      case "server/chunks/ssr/[root-of-the-server]__02qksg6._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__02qksg6._.js");
      case "server/chunks/ssr/[root-of-the-server]__0nvpywb._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0nvpywb._.js");
      case "server/chunks/ssr/[root-of-the-server]__196zao4._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__196zao4._.js");
      case "server/chunks/ssr/[root-of-the-server]__1ukwtnm._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1ukwtnm._.js");
      case "server/chunks/ssr/[root-of-the-server]__1xbctzk._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1xbctzk._.js");
      case "server/chunks/ssr/_06q-ilr._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_06q-ilr._.js");
      case "server/chunks/ssr/_0aga9m_._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0aga9m_._.js");
      case "server/chunks/ssr/_0d_5el7._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0d_5el7._.js");
      case "server/chunks/ssr/_0hih7sv._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0hih7sv._.js");
      case "server/chunks/ssr/_0nxxd_d._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0nxxd_d._.js");
      case "server/chunks/ssr/_0zm6pee._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0zm6pee._.js");
      case "server/chunks/ssr/_1aqecyw._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_1aqecyw._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_about_page_actions_1tal7k1.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_about_page_actions_1tal7k1.js");
      case "server/chunks/ssr/node_modules_@vercel_analytics_dist_next_index_mjs_1b3sl0t._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_@vercel_analytics_dist_next_index_mjs_1b3sl0t._.js");
      case "server/chunks/ssr/node_modules_@vercel_speed-insights_dist_next_index_mjs_0r5y6xj._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_@vercel_speed-insights_dist_next_index_mjs_0r5y6xj._.js");
      case "server/chunks/ssr/node_modules_next_0x3i8za._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_0x3i8za._.js");
      case "server/chunks/ssr/node_modules_next_0y869mc._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_0y869mc._.js");
      case "server/chunks/ssr/node_modules_next_dist_077yo5w._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_077yo5w._.js");
      case "server/chunks/ssr/node_modules_next_dist_1clrtm1._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1clrtm1._.js");
      case "server/chunks/ssr/node_modules_next_dist_1knwlsz._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1knwlsz._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0q-w892.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0q-w892.js");
      case "server/chunks/ssr/src_1fvwvni._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_1fvwvni._.js");
      case "server/chunks/ssr/src_sites_personal-homepage_11xeyi6._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_sites_personal-homepage_11xeyi6._.js");
      case "server/chunks/ssr/src_sites_personal-homepage_16ktoub._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_sites_personal-homepage_16ktoub._.js");
      case "server/chunks/ssr/src_sites_personal-homepage_components_site_cstd-telemetry_tsx_046gio0._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_sites_personal-homepage_components_site_cstd-telemetry_tsx_046gio0._.js");
      case "server/chunks/ssr/src_sites_personal-homepage_experience_runtime-capabilities_ts_0jov-rr._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_sites_personal-homepage_experience_runtime-capabilities_ts_0jov-rr._.js");
      case "server/chunks/ssr/src_sites_personal-homepage_voxel_voxel-game-engine_ts_0b6ft54._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_sites_personal-homepage_voxel_voxel-game-engine_ts_0b6ft54._.js");
      case "server/chunks/ssr/src_sites_personal-homepage_voxel_voxel-game-engine_ts_1oi7hrs._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_sites_personal-homepage_voxel_voxel-game-engine_ts_1oi7hrs._.js");
      case "server/chunks/1oeh_server_app_(personal)_cstd_content-health_json_route_actions_1rixn6f.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal)_cstd_content-health_json_route_actions_1rixn6f.js");
      case "server/chunks/[root-of-the-server]__15bjnu5._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__15bjnu5._.js");
      case "server/chunks/[root-of-the-server]__1bx80uf._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1bx80uf._.js");
      case "server/chunks/node_modules_@upstash_redis_nodejs_mjs_12fr2l8._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/node_modules_@upstash_redis_nodejs_mjs_12fr2l8._.js");
      case "server/chunks/src_sites_personal-homepage_08udu0o._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/src_sites_personal-homepage_08udu0o._.js");
      case "server/chunks/src_sites_personal-homepage_1mkuiqg._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/src_sites_personal-homepage_1mkuiqg._.js");
      case "server/chunks/[root-of-the-server]__1m4wm01._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1m4wm01._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_experience_json_route_actions_14x5iwz.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_experience_json_route_actions_14x5iwz.js");
      case "server/chunks/[root-of-the-server]__0_-yybt._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0_-yybt._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_feed_json_route_actions_10tnwak.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_feed_json_route_actions_10tnwak.js");
      case "server/chunks/ssr/[root-of-the-server]__06zbt8i._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__06zbt8i._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_for_[audience]_page_actions_12cmd4j.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_for_[audience]_page_actions_12cmd4j.js");
      case "server/chunks/[root-of-the-server]__0doj_po._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0doj_po._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_graph_json_route_actions_16abcgn.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_graph_json_route_actions_16abcgn.js");
      case "server/chunks/ssr/[root-of-the-server]__0rg9110._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0rg9110._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_lab_page_actions_09sfebw.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_lab_page_actions_09sfebw.js");
      case "server/chunks/ssr/[root-of-the-server]__1_o8qmo._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1_o8qmo._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_lab_[slug]_page_actions_0xb-l5r.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_lab_[slug]_page_actions_0xb-l5r.js");
      case "server/chunks/[root-of-the-server]__0290j-v._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0290j-v._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_llms_txt_route_actions_0jy-3m6.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_llms_txt_route_actions_0jy-3m6.js");
      case "server/chunks/1oeh_server_app_(personal)_cstd_manifest_webmanifest_route_actions_13xdslt.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal)_cstd_manifest_webmanifest_route_actions_13xdslt.js");
      case "server/chunks/[root-of-the-server]__1o2fa2i._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1o2fa2i._.js");
      case "server/chunks/ssr/[root-of-the-server]__19xtxnp._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__19xtxnp._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_map_page_actions_1q9i01-.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_map_page_actions_1q9i01-.js");
      case "server/chunks/ssr/[root-of-the-server]__076ijf-._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__076ijf-._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_notes_page_actions_0br-vj3.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_notes_page_actions_0br-vj3.js");
      case "server/chunks/1jng_app_(personal)_cstd_notes_[slug]_opengraph-image-1dxzbn_route_actions_032htp5.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1jng_app_(personal)_cstd_notes_[slug]_opengraph-image-1dxzbn_route_actions_032htp5.js");
      case "server/chunks/[externals]_next_dist_compiled_@vercel_og_index_node_01np1ap.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[externals]_next_dist_compiled_@vercel_og_index_node_01np1ap.js");
      case "server/chunks/[externals]_next_dist_compiled_@vercel_og_index_node_1m93lox.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[externals]_next_dist_compiled_@vercel_og_index_node_1m93lox.js");
      case "server/chunks/[root-of-the-server]__10tubjq._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__10tubjq._.js");
      case "server/chunks/node_modules_next_1zc5q0a._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/node_modules_next_1zc5q0a._.js");
      case "server/chunks/src_sites_personal-homepage_0aur07g._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/src_sites_personal-homepage_0aur07g._.js");
      case "server/chunks/ssr/[root-of-the-server]__1uglob2._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1uglob2._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_notes_[slug]_page_actions_02agk-y.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_notes_[slug]_page_actions_02agk-y.js");
      case "server/chunks/ssr/src_app_(personal)_cstd_notes_[slug]_opengraph-image--metadata_1jyugvb.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(personal)_cstd_notes_[slug]_opengraph-image--metadata_1jyugvb.js");
      case "server/chunks/ssr/[root-of-the-server]__137x6ur._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__137x6ur._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_now_page_actions_16v1-10.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_now_page_actions_16v1-10.js");
      case "server/chunks/[root-of-the-server]__0s1g15c._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0s1g15c._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_observatory_json_route_actions_1f1ubvd.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_observatory_json_route_actions_1f1ubvd.js");
      case "server/chunks/1oeh_server_app_(personal)_cstd_opengraph-image-18ex63_route_actions_1qa5wz7.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal)_cstd_opengraph-image-18ex63_route_actions_1qa5wz7.js");
      case "server/chunks/[root-of-the-server]__1vmsy_p._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1vmsy_p._.js");
      case "server/chunks/_1s0wabv._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_1s0wabv._.js");
      case "server/chunks/ssr/[root-of-the-server]__0ofcewj._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ofcewj._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_page_actions_19hosi8.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_page_actions_19hosi8.js");
      case "server/chunks/ssr/src_sites_personal-homepage_server_ts_07a7hlt._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_sites_personal-homepage_server_ts_07a7hlt._.js");
      case "server/chunks/[root-of-the-server]__1tr27t5._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1tr27t5._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_performance_json_route_actions_0__1e83.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_performance_json_route_actions_0__1e83.js");
      case "server/chunks/[root-of-the-server]__16oiobf._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__16oiobf._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_proof_json_route_actions_15o7e6n.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_proof_json_route_actions_15o7e6n.js");
      case "server/chunks/[root-of-the-server]__02a_mhs._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__02a_mhs._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_releases_json_route_actions_18db85a.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_releases_json_route_actions_18db85a.js");
      case "server/chunks/ssr/[root-of-the-server]__1rxso36._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1rxso36._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_resume_page_actions_1h8fmsi.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_resume_page_actions_1h8fmsi.js");
      case "server/chunks/[root-of-the-server]__1p6963r._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1p6963r._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_resume_json_route_actions_1r0ytyz.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_resume_json_route_actions_1r0ytyz.js");
      case "server/chunks/[root-of-the-server]__06bl2bc._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__06bl2bc._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_status_json_route_actions_1wmpc_u.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_status_json_route_actions_1wmpc_u.js");
      case "server/chunks/[root-of-the-server]__20_j-d9._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__20_j-d9._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_studio_json_route_actions_1un3dtp.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_studio_json_route_actions_1un3dtp.js");
      case "server/chunks/ssr/[root-of-the-server]__21a38-0._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__21a38-0._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_topics_page_actions_1fsjxg3.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_topics_page_actions_1fsjxg3.js");
      case "server/chunks/ssr/[root-of-the-server]__0ovc2po._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ovc2po._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_topics_[slug]_page_actions_145o33k.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_topics_[slug]_page_actions_145o33k.js");
      case "server/chunks/[root-of-the-server]__0yoha1x._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0yoha1x._.js");
      case "server/chunks/_next-internal_server_app_(personal)_cstd_topics_json_route_actions_1wzh_id.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal)_cstd_topics_json_route_actions_1wzh_id.js");
      case "server/chunks/ssr/[root-of-the-server]__0r8753m._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0r8753m._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_voxel_page_actions_10--5_2.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_voxel_page_actions_10--5_2.js");
      case "server/chunks/ssr/[root-of-the-server]__04m_4jx._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__04m_4jx._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_work_page_actions_0m48gqd.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_work_page_actions_0m48gqd.js");
      case "server/chunks/1jng_app_(personal)_cstd_work_[slug]_opengraph-image-1wh80r_route_actions_1bxw-hy.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1jng_app_(personal)_cstd_work_[slug]_opengraph-image-1wh80r_route_actions_1bxw-hy.js");
      case "server/chunks/[root-of-the-server]__0fba0bx._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0fba0bx._.js");
      case "server/chunks/_0dq-mqu._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_0dq-mqu._.js");
      case "server/chunks/ssr/[root-of-the-server]__0_rc-8b._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0_rc-8b._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal)_cstd_work_[slug]_page_actions_09rf6h_.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal)_cstd_work_[slug]_page_actions_09rf6h_.js");
      case "server/chunks/ssr/src_app_(personal)_cstd_work_[slug]_opengraph-image--metadata_0659m9o.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(personal)_cstd_work_[slug]_opengraph-image--metadata_0659m9o.js");
      case "server/chunks/ssr/[root-of-the-server]__20elpe1._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__20elpe1._.js");
      case "server/chunks/ssr/_031mzw0._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_031mzw0._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_about_page_actions_0smkb8e.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_about_page_actions_0smkb8e.js");
      case "server/chunks/ssr/src_1zrt77x._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_1zrt77x._.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_content-health_json_route_actions_1et1x-y.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_content-health_json_route_actions_1et1x-y.js");
      case "server/chunks/[root-of-the-server]__0-4qshy._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0-4qshy._.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_experience_json_route_actions_1-dzywj.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_experience_json_route_actions_1-dzywj.js");
      case "server/chunks/[root-of-the-server]__16di037._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__16di037._.js");
      case "server/chunks/[root-of-the-server]__1mmg97i._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1mmg97i._.js");
      case "server/chunks/_next-internal_server_app_(personal-en)_cstd_en_feed_json_route_actions_1e12-sp.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal-en)_cstd_en_feed_json_route_actions_1e12-sp.js");
      case "server/chunks/ssr/1oeh_server_app_(personal-en)_cstd_en_for_[audience]_page_actions_1tf6gg-.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/1oeh_server_app_(personal-en)_cstd_en_for_[audience]_page_actions_1tf6gg-.js");
      case "server/chunks/ssr/[root-of-the-server]__1xyjfg4._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1xyjfg4._.js");
      case "server/chunks/[root-of-the-server]__0lp5f-9._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0lp5f-9._.js");
      case "server/chunks/_next-internal_server_app_(personal-en)_cstd_en_graph_json_route_actions_17gu6f1.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal-en)_cstd_en_graph_json_route_actions_17gu6f1.js");
      case "server/chunks/ssr/[root-of-the-server]__1_ehndy._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1_ehndy._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_lab_page_actions_0tqnj6o.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_lab_page_actions_0tqnj6o.js");
      case "server/chunks/ssr/[root-of-the-server]__06-jfut._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__06-jfut._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_lab_[slug]_page_actions_20r4poh.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_lab_[slug]_page_actions_20r4poh.js");
      case "server/chunks/[root-of-the-server]__1v1ka1k._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1v1ka1k._.js");
      case "server/chunks/_next-internal_server_app_(personal-en)_cstd_en_llms_txt_route_actions_097xlas.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal-en)_cstd_en_llms_txt_route_actions_097xlas.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_manifest_webmanifest_route_actions_150-9di.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_manifest_webmanifest_route_actions_150-9di.js");
      case "server/chunks/[root-of-the-server]__1np06gc._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1np06gc._.js");
      case "server/chunks/ssr/[root-of-the-server]__10y4hpk._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__10y4hpk._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_map_page_actions_1echa6o.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_map_page_actions_1echa6o.js");
      case "server/chunks/ssr/[root-of-the-server]__1oc6-dq._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1oc6-dq._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_notes_page_actions_059cp-2.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_notes_page_actions_059cp-2.js");
      case "server/chunks/ssr/1oeh_server_app_(personal-en)_cstd_en_notes_[slug]_page_actions_0wsvnlh.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/1oeh_server_app_(personal-en)_cstd_en_notes_[slug]_page_actions_0wsvnlh.js");
      case "server/chunks/ssr/[root-of-the-server]__1f6ie1i._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1f6ie1i._.js");
      case "server/chunks/ssr/[root-of-the-server]__1s4qjkz._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1s4qjkz._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_now_page_actions_214sl0n.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_now_page_actions_214sl0n.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_observatory_json_route_actions_1nb3bq0.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_observatory_json_route_actions_1nb3bq0.js");
      case "server/chunks/[root-of-the-server]__11hjw2l._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__11hjw2l._.js");
      case "server/chunks/ssr/[root-of-the-server]__1h27u0k._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1h27u0k._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_page_actions_12rmh9d.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_page_actions_12rmh9d.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_performance_json_route_actions_0war16b.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_performance_json_route_actions_0war16b.js");
      case "server/chunks/[root-of-the-server]__0ch_76u._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0ch_76u._.js");
      case "server/chunks/[root-of-the-server]__1sj2ev7._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1sj2ev7._.js");
      case "server/chunks/_next-internal_server_app_(personal-en)_cstd_en_proof_json_route_actions_04o90w1.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_(personal-en)_cstd_en_proof_json_route_actions_04o90w1.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_releases_json_route_actions_1btfhja.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_releases_json_route_actions_1btfhja.js");
      case "server/chunks/[root-of-the-server]__1ydhcrk._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1ydhcrk._.js");
      case "server/chunks/ssr/[root-of-the-server]__0m2q34l._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0m2q34l._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_resume_page_actions_1muna7m.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_resume_page_actions_1muna7m.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_resume_json_route_actions_15z-slg.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_resume_json_route_actions_15z-slg.js");
      case "server/chunks/[root-of-the-server]__0blsm7x._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0blsm7x._.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_status_json_route_actions_08hn2f-.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_status_json_route_actions_08hn2f-.js");
      case "server/chunks/[root-of-the-server]__076p1vs._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__076p1vs._.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_studio_json_route_actions_1aflof1.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_studio_json_route_actions_1aflof1.js");
      case "server/chunks/[root-of-the-server]__1da1ote._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1da1ote._.js");
      case "server/chunks/ssr/[root-of-the-server]__0rh7x1m._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0rh7x1m._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_topics_page_actions_000qbtl.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_topics_page_actions_000qbtl.js");
      case "server/chunks/ssr/1oeh_server_app_(personal-en)_cstd_en_topics_[slug]_page_actions_1irk5n0.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/1oeh_server_app_(personal-en)_cstd_en_topics_[slug]_page_actions_1irk5n0.js");
      case "server/chunks/ssr/[root-of-the-server]__0eukjtf._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0eukjtf._.js");
      case "server/chunks/1oeh_server_app_(personal-en)_cstd_en_topics_json_route_actions_1e6cz3k.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_(personal-en)_cstd_en_topics_json_route_actions_1e6cz3k.js");
      case "server/chunks/[root-of-the-server]__0ow2ips._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0ow2ips._.js");
      case "server/chunks/ssr/[root-of-the-server]__1f1j09g._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1f1j09g._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_voxel_page_actions_1p1fg4_.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_voxel_page_actions_1p1fg4_.js");
      case "server/chunks/ssr/[root-of-the-server]__1f32uoz._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1f32uoz._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_work_page_actions_0ivuqvw.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_work_page_actions_0ivuqvw.js");
      case "server/chunks/ssr/[root-of-the-server]__1euumwt._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1euumwt._.js");
      case "server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_work_[slug]_page_actions_1gcrff2.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(personal-en)_cstd_en_work_[slug]_page_actions_1gcrff2.js");
      case "server/chunks/ssr/[root-of-the-server]__0bp70gc._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0bp70gc._.js");
      case "server/chunks/ssr/[root-of-the-server]__0qc2i4j._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0qc2i4j._.js");
      case "server/chunks/ssr/[root-of-the-server]__1fv-ec8._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1fv-ec8._.js");
      case "server/chunks/ssr/[root-of-the-server]__1g3eztm._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1g3eztm._.js");
      case "server/chunks/ssr/[root-of-the-server]__1pufccb._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1pufccb._.js");
      case "server/chunks/ssr/_0181fqm._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0181fqm._.js");
      case "server/chunks/ssr/_0fbvok4._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0fbvok4._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_about_page_actions_18uzvc8.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_about_page_actions_18uzvc8.js");
      case "server/chunks/ssr/node_modules_next_dist_0kq7z60._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_0kq7z60._.js");
      case "server/chunks/ssr/src_0ta6ua-._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_0ta6ua-._.js");
      case "server/chunks/ssr/src_15o_c-5._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_15o_c-5._.js");
      case "server/chunks/ssr/src_data_creatures_ts_0kpq383._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_data_creatures_ts_0kpq383._.js");
      case "server/chunks/ssr/src_lib_utils_ts_0m4hn6s._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_lib_utils_ts_0m4hn6s._.js");
      case "server/chunks/ssr/[root-of-the-server]__04x_jom._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__04x_jom._.js");
      case "server/chunks/ssr/[root-of-the-server]__1923ux8._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1923ux8._.js");
      case "server/chunks/ssr/_0iggf2l._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0iggf2l._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_collection_page_actions_0ofzyrb.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_collection_page_actions_0ofzyrb.js");
      case "server/chunks/ssr/node_modules_next_dist_1ymd6cg._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1ymd6cg._.js");
      case "server/chunks/ssr/src_10_g21l._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_10_g21l._.js");
      case "server/chunks/ssr/src_data_0yak8_7._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_data_0yak8_7._.js");
      case "server/chunks/ssr/src_data_1126l7q._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_data_1126l7q._.js");
      case "server/chunks/ssr/src_data_creatures_ts_07eu6fl._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_data_creatures_ts_07eu6fl._.js");
      case "server/chunks/ssr/[root-of-the-server]__0c0pe42._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0c0pe42._.js");
      case "server/chunks/ssr/[root-of-the-server]__0cvb0dt._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0cvb0dt._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_compare_page_actions_1qxmcx8.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_compare_page_actions_1qxmcx8.js");
      case "server/chunks/ssr/src_01x2x56._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_01x2x56._.js");
      case "server/chunks/ssr/[root-of-the-server]__0jrwxsj._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0jrwxsj._.js");
      case "server/chunks/ssr/[root-of-the-server]__1_hcgkk._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1_hcgkk._.js");
      case "server/chunks/ssr/_0iaqhr4._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0iaqhr4._.js");
      case "server/chunks/ssr/_1r6az8i._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_1r6az8i._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_creatures_page_actions_11lh_tq.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_creatures_page_actions_11lh_tq.js");
      case "server/chunks/ssr/src_data_creatures_ts_1cf_b73._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_data_creatures_ts_1cf_b73._.js");
      case "server/chunks/ssr/[root-of-the-server]__0rwqh4_._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0rwqh4_._.js");
      case "server/chunks/ssr/[root-of-the-server]__0sayg0h._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0sayg0h._.js");
      case "server/chunks/ssr/_18zb2vk._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_18zb2vk._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_creatures_[id]_page_actions_0voo5uu.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_creatures_[id]_page_actions_0voo5uu.js");
      case "server/chunks/ssr/[root-of-the-server]__0gf_1qb._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0gf_1qb._.js");
      case "server/chunks/ssr/[root-of-the-server]__17eu7j3._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__17eu7j3._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_data-status_page_actions_183g5_k.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_data-status_page_actions_183g5_k.js");
      case "server/chunks/ssr/src_0y5y--l._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_0y5y--l._.js");
      case "server/chunks/ssr/[root-of-the-server]__13gf6h6._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__13gf6h6._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_discover_page_actions_1dq5bot.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_discover_page_actions_1dq5bot.js");
      case "server/chunks/ssr/[root-of-the-server]__15drog9._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__15drog9._.js");
      case "server/chunks/ssr/[root-of-the-server]__1j-qyv_._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1j-qyv_._.js");
      case "server/chunks/ssr/_0qrvph4._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0qrvph4._.js");
      case "server/chunks/ssr/_0ytmu8m._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0ytmu8m._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_discover_[slug]_page_actions_1wmt_9t.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_discover_[slug]_page_actions_1wmt_9t.js");
      case "server/chunks/ssr/src_0r40xnw._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_0r40xnw._.js");
      case "server/chunks/ssr/[root-of-the-server]__1iptrfw._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1iptrfw._.js");
      case "server/chunks/ssr/[root-of-the-server]__1uqkwa-._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1uqkwa-._.js");
      case "server/chunks/ssr/_0t7nx-3._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0t7nx-3._.js");
      case "server/chunks/ssr/_11jcfp8._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_11jcfp8._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_guides_page_actions_18uxzo-.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_guides_page_actions_18uxzo-.js");
      case "server/chunks/ssr/src_components_guide-explorer_tsx_1dhf8yr._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_guide-explorer_tsx_1dhf8yr._.js");
      case "server/chunks/ssr/[root-of-the-server]__1wj0o7z._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1wj0o7z._.js");
      case "server/chunks/ssr/[root-of-the-server]__1yzuigb._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1yzuigb._.js");
      case "server/chunks/ssr/_174g0id._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_174g0id._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_guides_[slug]_page_actions_1pf4osk.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_guides_[slug]_page_actions_1pf4osk.js");
      case "server/chunks/ssr/src_15l3dy6._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_15l3dy6._.js");
      case "server/chunks/ssr/[root-of-the-server]__0vqthnx._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0vqthnx._.js");
      case "server/chunks/ssr/[root-of-the-server]__1fxmrn8._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1fxmrn8._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_login_page_actions_0ot0-t4.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_login_page_actions_0ot0-t4.js");
      case "server/chunks/ssr/node_modules_0634vpf._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_0634vpf._.js");
      case "server/chunks/ssr/src_0zrqx33._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_0zrqx33._.js");
      case "server/chunks/ssr/[root-of-the-server]__0htwh0c._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0htwh0c._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_matchups_page_actions_1tttcwp.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_matchups_page_actions_1tttcwp.js");
      case "server/chunks/ssr/src_components_matchup-explorer_tsx_1xw_12f._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_matchup-explorer_tsx_1xw_12f._.js");
      case "server/chunks/ssr/[root-of-the-server]__0rlwaab._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0rlwaab._.js");
      case "server/chunks/ssr/[root-of-the-server]__15k4k_6._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__15k4k_6._.js");
      case "server/chunks/ssr/_0ze4-3j._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_0ze4-3j._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_page_actions_05rv5_s.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_page_actions_05rv5_s.js");
      case "server/chunks/ssr/[root-of-the-server]__03ih3hy._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__03ih3hy._.js");
      case "server/chunks/ssr/[root-of-the-server]__0xasgjo._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0xasgjo._.js");
      case "server/chunks/ssr/_1oyb2xh._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_1oyb2xh._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_pvp-teams_page_actions_0bss5jg.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_pvp-teams_page_actions_0bss5jg.js");
      case "server/chunks/ssr/src_data_pvp-teams_ts_054bo7p._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_data_pvp-teams_ts_054bo7p._.js");
      case "server/chunks/ssr/src_data_pvp-teams_ts_1cg2hnt._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_data_pvp-teams_ts_1cg2hnt._.js");
      case "server/chunks/ssr/[root-of-the-server]__02j0yie._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__02j0yie._.js");
      case "server/chunks/ssr/_1a6vzk4._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_1a6vzk4._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_pvp-teams_[slug]_page_actions_121dyxi.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_pvp-teams_[slug]_page_actions_121dyxi.js");
      case "server/chunks/ssr/src_1p_r3-m._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_1p_r3-m._.js");
      case "server/chunks/ssr/[root-of-the-server]__0z3rw3d._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0z3rw3d._.js");
      case "server/chunks/ssr/[root-of-the-server]__1lk-z94._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1lk-z94._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_register_page_actions_1blmqgm.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_register_page_actions_1blmqgm.js");
      case "server/chunks/ssr/src_095dkdu._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_095dkdu._.js");
      case "server/chunks/ssr/[root-of-the-server]__0e8hu-j._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0e8hu-j._.js");
      case "server/chunks/ssr/[root-of-the-server]__1dovzu6._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1dovzu6._.js");
      case "server/chunks/ssr/_1_seby5._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_1_seby5._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_rkti_page_actions_1crvqe-.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_rkti_page_actions_1crvqe-.js");
      case "server/chunks/ssr/src_components_rkti-quiz_tsx_1h_5zrt._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_rkti-quiz_tsx_1h_5zrt._.js");
      case "server/chunks/ssr/[root-of-the-server]__1--j5_g._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1--j5_g._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_skills_page_actions_1c2otbp.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_skills_page_actions_1c2otbp.js");
      case "server/chunks/ssr/src_01gwyn9._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/src_01gwyn9._.js");
      case "server/chunks/ssr/[root-of-the-server]__004m00x._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__004m00x._.js");
      case "server/chunks/ssr/_next-internal_server_app_(rocodex)_[___not-found]_page_actions_0sjv_to.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(rocodex)_[___not-found]_page_actions_0sjv_to.js");
      case "server/chunks/[root-of-the-server]__0s2mzdd._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0s2mzdd._.js");
      case "server/chunks/_next-internal_server_app__well-known_security_txt_route_actions_0kjl623.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app__well-known_security_txt_route_actions_0kjl623.js");
      case "server/chunks/[root-of-the-server]__10p1nrh._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__10p1nrh._.js");
      case "server/chunks/_next-internal_server_app_api_account-status_route_actions_0isw427.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_account-status_route_actions_0isw427.js");
      case "server/chunks/[root-of-the-server]__1_52og5._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1_52og5._.js");
      case "server/chunks/_192bjdy._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_192bjdy._.js");
      case "server/chunks/_next-internal_server_app_api_auth_[___nextauth]_route_actions_08nexdk.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_[___nextauth]_route_actions_08nexdk.js");
      case "server/chunks/node_modules_bcryptjs_index_0k82xso.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/node_modules_bcryptjs_index_0k82xso.js");
      case "server/chunks/[root-of-the-server]__0wl4nlq._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0wl4nlq._.js");
      case "server/chunks/_next-internal_server_app_api_cstd-vitals_route_actions_1n9x0i1.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_cstd-vitals_route_actions_1n9x0i1.js");
      case "server/chunks/[root-of-the-server]__1ur-ij7._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1ur-ij7._.js");
      case "server/chunks/_14w9nrd._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_14w9nrd._.js");
      case "server/chunks/_next-internal_server_app_api_register_route_actions_0vlzh_c.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_register_route_actions_0vlzh_c.js");
      case "server/chunks/[root-of-the-server]__0rbld-f._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0rbld-f._.js");
      case "server/chunks/_next-internal_server_app_api_register_verify-cleanup_route_actions_1eirhc1.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_register_verify-cleanup_route_actions_1eirhc1.js");
      case "server/chunks/[externals]__1mn3361._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[externals]__1mn3361._.js");
      case "server/chunks/_0uxp3uh._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_0uxp3uh._.js");
      case "server/chunks/_next-internal_server_app_favicon_ico_route_actions_0g2jjls.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_favicon_ico_route_actions_0g2jjls.js");
      case "server/chunks/[root-of-the-server]__09f92t5._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__09f92t5._.js");
      case "server/chunks/_next-internal_server_app_robots_txt_route_actions_15vc_89.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_robots_txt_route_actions_15vc_89.js");
      case "server/chunks/[root-of-the-server]__1ifq3-p._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1ifq3-p._.js");
      case "server/chunks/_next-internal_server_app_rss_xml_route_actions_104a-jb.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_rss_xml_route_actions_104a-jb.js");
      case "server/chunks/[root-of-the-server]__0iry5_t._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0iry5_t._.js");
      case "server/chunks/_0xl2xhd._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_0xl2xhd._.js");
      case "server/chunks/_next-internal_server_app_sitemap_xml_route_actions_05l5km9.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_sitemap_xml_route_actions_05l5km9.js");
      case "server/chunks/ssr/[root-of-the-server]__09al2tz._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__09al2tz._.js");
      case "server/chunks/ssr/[root-of-the-server]__1f2jx51._.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1f2jx51._.js");
      case "server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0zi5s8-.js": return require("E:/DEV/RocoDex/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0zi5s8-.js");
      default:
        throw new Error(`Not found ${chunkPath}`);
    }
  }


  async function loadWasmChunk(chunkPath) {
    switch (chunkPath) {
      case "E:/DEV/RocoDex/.open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og/resvg.wasm": return (await import("E:/DEV/RocoDex/.open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og/resvg.wasm")).default;
      case "E:/DEV/RocoDex/.open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og/yoga.wasm": return (await import("E:/DEV/RocoDex/.open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og/yoga.wasm")).default;
      default:
        throw new Error(`Unknown wasm chunk: ${chunkPath}`);
    }
  }
