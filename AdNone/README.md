# AdNone

A Javascript module that allows you to compile, inject & modify a stylesheet onto any page; Intended for hiding Ads & theming pages.

Supports localStorage for per-site configs.

## Quick Start

> NOTE: If localStorage config exists, 
the script will attempt to auto-construct 
an instance with that config upon being loaded into the DOM.

```javascript
const script = document.createElement('script');
  script.id = "AdNone";
  script.src = "https://cdn.jsdelivr.net/gh/jonwash96/web-extensions/AdNone/AdNone.js";
document.body.appendChild(script);
```

```javascript
var adNone = new AdNone({
  selectors: ['iframe', '.ccAdTop', '.cAdRow'],
  rules: [
    ['body', ['background-color: #1f1f1f', 'color: white']], 
    ['main', ['margin: 0 auto']]
  ],
  saveLocal: true,
  getLocal: true
});

adNone.items; // ➡ { selectors: [Array], rules: [Array] }
adNone.elements; // ➡ Array(5) [ <HTMLElement>, <HTMLElement>, ... ]
adNone.target.innerHTML /* ➡ 
  iframe,
  .ccAdTop, 
  .cAdRow, { 
    display:none; 
  }

  body {
    background-color: #1f1f1f; 
    color: white;
  }

  main {
    margin: 0 auto;
  }
*/

adNone.append('google-ads'); 
  // ℹ️ <object _mixed_>, <array _mixed_>, <string _selector_>

adNone.append([
  '.ad-container', 
  ['div#ad-content', ['height: 0', 'visibility: hidden']]
], false); // ℹ️ 'arg1 = false' prevents auto-update localStorage

adNone.removeItems({
  selectors: ['.ad-container'],
  rules: [ ['div#ad-content', ['height: 0', 'visibility: hidden']] ]
}); // ℹ️ localStorage will be updated by default

adNone.removeSelectors(['google-ads']); 
  // ℹ️ lower-level methods do not support localStorage or types

adNone.saveToLocal();
adNone.destroy(); // ➡ Removes element from DOM & clears items

window.navigator.clipboard.writeText (
  localStorage.getItem('AdNone')
);
window.location.href = 'https://example.org';

var configFromPasteBoard; // ⬅ [^v]

const adNone = new AdNone (
  configFromPasteBoard, // ℹ️ <obj>, <arr>, <str>; if undefined, use getLocal
  true, // ℹ️ [saveLocal=true] can be arg1<bool> or property of arg0 if <obj>
  false // ℹ️ [getLocal=true] can be arg2<bool> or property of arg0 if <obj>
);
```

***

## Documemtation

### **Constructor**

```javascript
var adNone = new AdNone({
  selectors: ['iframe', '.ccAdTop', '.cAdRow'],
  rules: [
    ['body', ['background-color: #1f1f1f', 'color: white']], 
    ['main', ['margin: 0 auto']]
  ],
  saveLocal: true,
  getLocal: true
});
```

`@param0 {Object|Array|String} config`:

- *IF* `<Object>` (above): An object defining the instance's initial configuration.
	 - Compatible with output from `adNone.items` & localStorage.
	 - `@property {Array} [selectors]`: An array of query selector strings. Each will be assigned the CSS rule `{ display:none; }`.
	 - `@property {Array} [rules]`: An array of CSS rules. Each rule must be an array with exactly 2 values: 
	  	- `0: <string _CSS_selector_>`: The CSS selector for the rule. 
	  	- `1: <array _rules_>`:  An array of full CSS rules (i.e. `'css-property: value'`). Omit trailing semi-colons.
	 - `@property {Boolean} [saveLocal=true]`: If true, the config will be auto-saved to browser localStorage after the following operations:
		  - `constructor()`
		  - `append()`
		  - `removeItems()`
	 - `@property {Boolean} [getLocal=true]`: The 'save' counterpart to the above. The constructor will attempt to load saved rules into the stylesheet before new ones. 
- *IF* `<Array>`: A mixed array of selectors`<string>` & rules`<array>`. Use args 1 & 2 for storage options.
- *IF* `<String>`: A single selector to add to the stylesheet, which will be assigned the rule `{ display:none; }`.

`@param1 {Boolean} [saveLocal=true]`: If true (default), the config will be auto-saved to browser localStorage after each of the the following operations:
  - `constructor()`
  - `append()`
  - `removeItems()`
>If config is an object and this property is defined, the property will take presidence over the parameter.

`@param2 {Boolean} [getLocal=true]`: The 'save' counterpart to the above. The constructor will attempt to load saved rules into the stylesheet before new ones. 

***

### **Public Data Members**



`@property {Array} selectors`:

The array of selectors passed in from the constructor, inherited from local storage, and appended when methods like `append()` and `addSelectors()` are used. These elements will be assigned the rule `{ display:none; }`.

***

`@property {Array} rules`:

The array of rules passed in from the constructor, inherited from local storage, and appended when methods like `append()` and `addRules()` are used.

***

`@getter {HTMLElement<style>} target`:

The accessor for the target DOM node. Each instance of AdNone is bound to its own style element, identified by an id attribute matching the instance's `id` property, including its creation index (zero-indexed). 

***

`@property {String} id`:

*example:*
```
AdNone { id: 'AdNone-0' }
<style id="AdNone-0" />
```

A distinguishing string to identify each instance by. The instance's id always matches the id attribute of its target element.

***

`@getter {Object} items`:

An object with 2 properties: the selectors & rules arrays.

***

`@getter {Array} elements`:

A 1-level-deep array containing every DOM node referenced by each selector (including rule selectors). Selectors returning multiple elements are all sequentially folded into the single level of the array.

***

### **Public Methods**



`@function saveToLocal`:

Save items to localStorage('AdNone').

- `@param0 {Object} [items=this.items]`
- `@returns undefined`

***

`@function getFromLocal`:

Get Items from localStorage('AdNone').

- `@param0 {HTMLElement<style>} [stylesheet=this.target]`
- `@returns {Object} items`

***

`@function addSelectors`:

Low-level function to add selectors. 
>It is reccomended to use `append()` instead.

- `@param0 {HTMLElement<style>} stylesheet`
- `@param1 {Array} selectors`
- `@param2 {Boolean} [pushItems=true]`: If false, selectors will not be pushed into the selectors array.
- `@returns undefined`

***

`@function addRules`:

Low-level function to add rules.
>It is reccomended to use `append()` instead.

- `@param0 {HTMLElement<style>} stylesheet`
- `@param1 {Array} rules`
- `@param2 {Boolean} pushItems`: If false, rules will not be pushed into the rules array.
- `@returns undefined`

***

`@function append`:

Append Selectors & rules.

- `@param0 {Object|Array|String} obj`:
	 - *IF* `<Object>`: An object with 1-2 properties: { selectors, rules }.
	 	- Compatible with output from `adNone.items` & localStorage.
	 	- `@property {Array} [selectors]`: An array of query selector strings. Each will be assigned the CSS rule `{ display:none; }`.
	 	- `@property {Array} [rules]`: An array of CSS rules. Each rule must be an array with exactly 2 values: 
	  		- `0: <string _CSS_selector_>`: The CSS selector for the rule. 
	 	 	- `1: <array _rules_>`:  An array of full CSS rules (i.e. `'css-property: value'`). Omit trailing semi-colons.
	- *IF* `<Array>`: A mixed array of selectors`<string>` & rules`<array>`.
	- *IF* `<String>`: A single selector to add to the stylesheet, which will be assigned the rule `{ display:none; }`.
- `@param1 {Boolean} [saveLocal]`: By default, differs to global saveLocal setting. If true or false, bypasses global setting.
- `@returns {Object} items`

***

`@function removeItems`:

High-level function to remove selectors & rules.
>Note: This function does not support polymorphic input like `append()`.

- `@param0 {Array} array`: A mixed array of selectors`<string>` & rules`<array>`.
- `@param1 {Boolean} [saveLocal]`: By default, differs to global saveLocal setting. If true or false, bypasses global setting.
- `@returns {Object} items`

***

`@function removeSelectors`:

Lower-level function to remove selectors.
>It is reccomended to use `removeItems()` instead.

- `@param0 {Array} selectors`
- `@param1 {Boolean} [rewrite=true]`: When items are removed, the stylesheet is fully rebuilt from the updated items arrays. Setting this false prevents the rewrite process and only the array is updated.
- `@returns undefined`

***

`@function removeRules`:

Lower-level function to remove rules.
>It is reccomended to use `removeItems()` instead.

- `@param0 {Array} rules`
- `@param1 {Boolean} [rewrite=true]`: When items are removed, the stylesheet is fully rebuilt from the updated items arrays. Setting this false prevents the rewrite process and only the array is updated.
- `@returns undefined`

***

`@function rewriteStylesheet`:

Rewrites the stylesheet from current items arrays.\
This function is called after every call to a remove function, unless the respective parameter is set to false.

- `@returns undefined`

***

`@function clearStorage`:

Clears localStorage('AdNone').

- `@returns undefined`

***

`@function destroy`:

Removes the style tag from the DOM & clears the items arrays.

- `@returns undefined`

***

`@function reset`:

Calls `destroy()`, removing the target element from the DOM & clearing the items arrays, then creates & appends a new, empty stylesheet to the DOM with the same id.

- `@param0 {Boolean} [getLocal=false]`: *IF* true, repopulates the instance & element with the localStorage config.
- `@returns undefined`
