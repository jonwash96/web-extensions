class AdNone {
 static count = 0;
  
 constructor(obj, saveLocal=1, getLocal=1) {
  const typeErr = (arg, num) => new TypeError(`Got [${typeof arg} ${arg.constructor.name}]\nAt AdNone arg(${num}).\nAdNone accepts only 3 parameters: (config<Object|Array|String>, saveLocal<Boolean>, getLocal<Boolean>).\nArg0 'config' must be either <Object>{ selectors<Array>, rules<Array>, saveLocal<Boolean>, getLocal<Boolean> }, OR <Array _selectors_>, OR <String _selector_>.`);
   
  this.id = `AdNone-${this.constructor.count++}`;
  let selectors=[], rules=[];
  if (Array.isArray(obj)) {
   selectors = obj;
  } else if (obj.constructor.name === 'Object') {
   if (Object.hasOwn(obj, 'selectors')) (
    selectors = obj.selectors );
   if (Object.hasOwn(obj, 'rules')) (
    rules = obj.rules );
   if (Object.hasOwn(obj, 'saveLocal')) (
    saveLocal = obj.saveLocal );
   if (Object.hasOwn(obj, 'getLocal')) (
    getLocal = obj.getLocal );
  } else if (typeof obj === 'string') {
   selectors.push(obj);
  } else throw typeErr(obj, 0);
  
  for (const localOp of [
   [saveLocal,1], [getLocal,2] 
  ]) {
   if (typeof localOp[0] !== 'boolean') {
    if (localOp[0] === 1)
     localOp[0] = this.id.endsWith('-0');
    else throw typeErr(...localOp);
   }
  }
  
  this.saveLocal = saveLocal;
  this.getLocal = getLocal;
  
  const stylesheet = document.createElement('style');
  stylesheet.id = this.id;
  
  if (getLocal) this.getFromLocal(stylesheet);
  
  this.addSelectors(stylesheet, selectors);
  this.addRules(stylesheet, rules);
  
  document.head.append(stylesheet);
  
  if (saveLocal) this.saveToLocal();
  console.log("AdNone Started", this);
 }
 
 selectors = [];
 rules = [];
 
 get target() {
  return document.getElementById(this.id);
 }
   
 get elements() { 
  return [
   this.selectors.map(s => 
    Array.from(document.querySelectorAll(s)))
     .flat(1),
   
   this.rules.map(r =>
    Array.from(document.querySelectorAll(r[0])))
     .flat(1)
  ].flat(1);
 }
 
 get items() {
  return { 
   selectors: this.selectors, 
   rules: this.rules 
  }
 }
 
 get config() {
 	return {
 		id: this.id,
 		saveLocal: this.saveLocal,
 		getLocal: this.getLocal,
 		selectors: this.selectors, 
   rules: this.rules 
 	}
 }
  
 saveToLocal(obj=this.items) {
  localStorage.setItem (
    'AdNone', 
    JSON.stringify(obj)
  )
 }
 
 getFromLocal(stylesheet=this.target) {
  let local = localStorage.getItem('AdNone');
  if (!local) console.warn('AdNone local config not found.');
  else {
   local = JSON.parse(local);
   if (Object.hasOwn(local, 'selectors')) {
    this.addSelectors (
     stylesheet, 
     local.selectors
    )}
   if (Object.hasOwn(local, 'rules')) {
    this.addRules (
     stylesheet, 
     local.rules
    )}
    return this.items
   }
 }
 
 addSelectors(stylesheet, selectors, pushItems=true) {
  stylesheet.innerHTML += (
   `${selectors.join(',\n')} {\ndisplay:none;\n}\n\n`
  );
   if (pushItems) this.selectors.push(...selectors);
 }
 
 addRules(stylesheet, rules, pushItems=true) {
  for (const rule of rules) {
     stylesheet.innerHTML += `${rule[0]} {\n${rule[1].join(';\n')}\n}\n\n`;
   }
   if (pushItems) this.rules.push(...rules);
 }
  
 append(obj, saveLocal=null) {
  if (Array.isArray(obj)) {
   this.addSelectors (
    this.target, 
    obj.filter(i => typeof i === 'string')
   );
   this.addRules (
    this.target,
    obj.filter(i => Array.isArray(i))
   );
  } else if (obj.constructor.name === 'Object') {
   obj.selectors && this.addSelectors (
    this.target, 
    obj.selectors
   );
   obj.rules && this.addRules (
    this.target,
    obj.rules
   );
  } else if (typeof obj === 'string') {
   this.addSelectors (
    this.target, 
    [obj]
   );
  } else throw new TypeError(`First arg of AdNone.append() must be one of: (<Array>, <Object>, <String>), but got [${typeof obj} ${obj.constructor.name}].`);
  if (saveLocal ?? this.saveLocal) 
   this.saveToLocal();
  return this.items
 }
 
 removeItems(array, saveLocal=null) {
  this.removeSelectors(array, false);
  this.removeRules(array, false);
  rewriteStylesheet();
  if (saveLocal ?? this.saveLocal) 
   this.saveToLocal();
  return this.items
 }
 
 removeSelectors(array, rewrite=true) {
  this.selectors = this.selectors
   .filter(selector => 
    !array.includes(selector)
   );
   if (rewrite) rewriteStylesheet();
 }
 
 removeRules(array, rewrite=true) {
  for (const rule of array) {
   if (Array.isArray(rule)) {
    const R = this.rules.find(r => 
     r[0] === rule[0] );
    if (!R) console.warn(`Rule '${rule[0]}' was not found.`);
    else R[1] = R[1].filter(r => 
     !rule[1].startsWith(r) );
   } else {
    const R = this.rules.findIndex(r => 
     r[0] === rule );
    if (R >= 0) this.rules = this.rules
     .splice(R, 1);
   }
  };
  if (rewrite) rewriteStylesheet();
 }
  
 rewriteStylesheet() {
  this.target.innerHTML = '';
  addSelectors(this.target, this.selectors, false);
  addRules(this.target, this.rules, false);
 }
 
 clearStorage() {
  localStorage.removeItem('AdNone')
 }
 
 destroy() {
  this.target.remove();
  this.selectors = [];
  this.rules = [];
 }
 
 reset(getStorage=false) {
  this.destroy();
  const stylesheet = document.createElement('style');
   stylesheet.id = this.id;
   if (getStorage) {
    this.getFromLocal(stylesheet);
   }
  document.head.append(stylesheet);
 }
}


// Auto Run
(function() {
	var local = localStorage.getItem('AdNone');
	if (local) local = JSON.parse(local);
	window.adNone = new AdNone(local)
})()