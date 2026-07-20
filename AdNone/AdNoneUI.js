class AdNoneUI {
	static count = 0;
	
	constructor(id, instance) {
		this.id = id.replace('-', 'UI-');
		this.self = instance;
		
		const dialog = document.createElement('dialog');
			dialog.id = this.id;
			dialog.innerHTML = `
			<div style="float:right;" onclick="close()">❌</div>
			<small>${this.self.id}</small>
			<h1>AdNone</h1>
			<h3>Configuration</h3>
			<section id="${this.id}-settings">
			 <input id="${id}-saveLocal" type="checkbox" checked="${this.self.saveLocal}" />
			 <label for="${id}-saveLocal"> Auto-Save to Local Storage</label>
			 
			 <input id="${id}-getLocal" type="checkbox" checked="${this.self.getLocal}" />
			 <label for="${id}-getLocal"> Auto-Retrieve from Local Storage</label>
			</section>
			<h4>Items
			<section id="${this.id}-items">
				<div class="selectors">
					<span>Selectors:</span>
				</div>
				<div class="rules">
					<span>Rules:</span>
				</div>
			</section>
			<h4>Actions</h4>
			<section id="${this.id}-methods">
				${Object.entries(this.self.constructor)
					.filter(ent => typeof ent[1] === 'function')
					.map(([name])=> '<div>'+name+'</div>')
				}
			</section>
			`;
			
		const stylesheet = document.createElement('style');
			stylesheet.id = this.id;
			stylesheet.innerHTML = `
				dialog#${this.id} {
				 max-width: 90vw;
				 minWidth: 320px;
				}
			`;
			
			document.head.appendChild(stylesheet);
			document.body.append(dialog);
	}
}