import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

test('menu, eventos de contato e visibilidade do atalho', () => {
  const listeners = {}, menuListeners = {}, emitted = [];
  const attributes = { 'aria-expanded': 'false' };
  const button = { setAttribute: (k, v) => attributes[k] = v, getAttribute: k => attributes[k], addEventListener: (name, fn) => menuListeners[name] = fn, focus() {} };
  const menu = { hidden: true, querySelectorAll: () => [] };
  const floating = { hidden: false };
  const contact = {}, footer = {};
  let observerCallback;
  const doc = {
    querySelector: selector => ({ '.menu-button': button, '#mobile-menu': menu, '.whatsapp-float': floating }[selector] || null),
    querySelectorAll: selector => selector === '.contact-section, .site-footer' ? [contact, footer] : [],
    addEventListener: (event, fn) => (listeners[event] ??= []).push(fn),
  };
  const win = { matchMedia: () => ({ addEventListener() {} }), dispatchEvent: event => emitted.push(event.detail), IntersectionObserver: true };
  vm.runInNewContext(fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8'), {
    document: doc, window: win,
    CustomEvent: class { constructor(name, data) { this.type = name; this.detail = data.detail; } },
    IntersectionObserver: class { constructor(fn) { observerCallback = fn; } observe() {} },
  });
  menuListeners.click();
  assert.equal(menu.hidden, false); assert.equal(attributes['aria-expanded'], 'true');
  listeners.keydown.forEach(fn => fn({ key: 'Escape' }));
  assert.equal(menu.hidden, true); assert.equal(attributes['aria-expanded'], 'false');
  const click = href => {
    const link = { getAttribute: () => href, classList: { contains: () => false }, closest: selector => selector === '.site-header' ? {} : null };
    const target = { closest: selector => selector === 'a[href]' ? link : null };
    listeners.click.forEach(fn => fn({ target }));
  };
  click('https://wa.me/5564992507888?text=mensagem');
  click('tel:+5564992507888');
  click('/consulta-tricologia-rio-verde/');
  assert.deepEqual(JSON.parse(JSON.stringify(emitted)), [
    { event: 'clique_whatsapp', placement: 'cabecalho' },
    { event: 'clique_telefone', placement: 'cabecalho' },
  ]);
  observerCallback([{ target: contact, isIntersecting: true }]); assert.equal(floating.hidden, true);
  observerCallback([{ target: footer, isIntersecting: true }, { target: contact, isIntersecting: false }]); assert.equal(floating.hidden, true);
  observerCallback([{ target: footer, isIntersecting: false }]); assert.equal(floating.hidden, false);
});
