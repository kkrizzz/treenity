export function hook(name, func) {
  const systemPrototype = System.constructor.prototype;
  const originalInstantiate = systemPrototype[name]?.bind(systemPrototype);

  systemPrototype[name] = function (...args) {
    const next = originalInstantiate?.bind(null, ...args) || (() => {});
    return func(next, ...args);
  };
}
