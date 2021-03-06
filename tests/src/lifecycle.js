/* eslint-disable no-new-func */
/* eslint-disable prefer-template */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable prefer-spread */
/* eslint-disable max-classes-per-file */
const BaseComponent  = require('../../src/base-component');
const properties = require('../../src/properties');
const template = require('../../src/template');
const refs = require('../../src/refs');
const itemTemplate = require('../../src/item-template');
window.rand = require('randomizer');

// no actual test for this - it should just not cause an error
class TestNoProps extends BaseComponent {

}
BaseComponent.define('test-no-props', TestNoProps);



class TestInheritPropsBase extends BaseComponent {
	constructor() {
		super();
		this.fooBaseCalled = false;
		this.barBaseCalled = false;
	}
	onFoo(value) {
		this.fooBaseCalled = true;
	}
	onBar(value) {
		this.barBaseCalled = true;
	}
}
BaseComponent.define('test-inherit-props-base', TestInheritPropsBase, {
	props: ['foo', 'bar'],
	bools: ['readonly'],
	attrs: ['display']
});

class TestInheritProps extends TestInheritPropsBase {

	attributeChanged(prop, value) {
		this[`attr-${prop}`] = value;
	}
	onFoo(value) {
		super.onFoo(value);
	}
}
BaseComponent.define('test-inherit-props', TestInheritProps, {
	props: ['bazz', 'buzz'],
	bools: ['disabled'],
	attrs: ['value']
});




class TestValue extends BaseComponent {

	attributeChanged (name, value) {
		if (name === 'value') {
			this.value = dom.normalize(value);
		}
	}

	set value (value) {
		this.__value = value;
	}

	get value () {
		return this.__value;
	}
}

BaseComponent.define('test-value', TestValue, {
	props: [],
	bools: [],
	attrs: ['value']
});

class TestDefine extends BaseComponent {

	constructor(...args) {
		super();
	}

	onFoo () {
		on.fire(document, 'foo-called');
	}

	onNbc () {
		on.fire(document, 'nbc-called');
	}

	attributeChanged (name, value) {
		this[name + '-changed'] = dom.normalize(value) || value !== null;
	}
}

BaseComponent.define('test-define', TestDefine, {
	props: ['foo'],
	bools: ['nbc']
});

class TestProps extends BaseComponent {

	constructor(...args) {
		super();
	}

    onFoo () {
		on.fire(document, 'foo-called');
	}

	onNbc () {
		on.fire(document, 'nbc-called');
	}

    attributeChanged (name, value) {
        this[name + '-changed'] = dom.normalize(value) || value !== null;
	}
}


BaseComponent.define('test-props', TestProps, {
	props: ['foo', 'bar', 'tabindex', 'min', 'max', 'my-complex-prop'],
	bools: ['nbc', 'cbs', 'disabled', 'readonly']
});

class TestNewProps extends BaseComponent {

	constructor(...args) {
		super();
		console.log('NEW!');
		//this.setProps(['foo']);
	}

	getProps () {
		return ['foo']
	}

	// static get observedAttributes() {
	// 	debugger
	// 	return ['nbc']
	// }

	attributeChanged (name, value) {
		console.log(' ---- change', name, value);
	}
}
customElements.define('test-new-props', TestNewProps);
window.TestNewProps = TestNewProps;

class TestLifecycle extends BaseComponent {

    static get observedAttributes() {return ['foo', 'bar']; }

    set foo (value) {
        this.__foo = value;
    }

    get foo () {
        return this.__foo;
    }

    set bar (value) {
        this.__bar = value;
    }

    get bar () {
        return this.__bar || 'NOTSET';
    }

    constructor(...args) {
        super();
    }

    connected () {
        on.fire(document, 'connected-called', this);
    }

    domReady () {
        on.fire(document, 'domready-called', this);
    }

    disconnected () {
        on.fire(document, 'disconnected-called', this);
    }

}

customElements.define('test-lifecycle', TestLifecycle);

BaseComponent.addPlugin({
    init (node, a, b, c) {
        on.fire(document, 'init-called');
    },
    preConnected (node, a, b, c) {
        on.fire(document, 'preConnected-called');
    },
    postConnected (node, a, b, c) {
        on.fire(document, 'postConnected-called');
    },
    preDomReady (node, a, b, c) {
        on.fire(document, 'preDomReady-called');
    },
    postDomReady (node, a, b, c) {
        on.fire(document, 'postDomReady-called');
    }
});


class TestTmplString extends BaseComponent {
    get templateString () {
        return `<div>This is a simple template</div>`;
    }
}
customElements.define('test-tmpl-string', TestTmplString);

class TestTmplId extends BaseComponent {
    get templateId () {
        return 'test-tmpl-id-template';
    }
}
customElements.define('test-tmpl-id', TestTmplId);


class TestTmplRefs extends BaseComponent {
    get templateString () {
        return `<div on="click:onClick" ref="clickNode">
            <label ref="labelNode">label:</label>
            <span ref="valueNode">value</span>
        </div>`;
    }

    onClick () {
        on.fire(document, 'ref-click-called');
    }
}
customElements.define('test-tmpl-refs', TestTmplRefs);


class ChildButton extends BaseComponent {
	get templateString () {
		return `<button ref="btnNode" on="click:onClick">Click Me</button>`;
	}

	onClick () {
		this.emit('change', {value: this.getAttribute('value')});
	}

}
customElements.define('child-button', ChildButton);

class TestTmplCmptRefs extends BaseComponent {
	get templateString () {
		return `<div>
			<child-button on="change:onChange" value="A" ></child-button>
			<child-button on="change:onChange" value="B" ></child-button>
			<child-button on="change:onChange" value="C" ></child-button>
        </div>`;
	}

	onChange (e) {
		on.fire(document, 'ref-change-called', {value:e.value});
	}
}
customElements.define('test-tmpl-cmpt-refs', TestTmplCmptRefs);

class TestTmplContainer extends BaseComponent {
    get templateString () {
        return `<div>
            <label ref="labelNode">label:</label>
            <span ref="valueNode">value</span>
            <div ref="container"></div>
        </div>`;
    }
}
customElements.define('test-tmpl-container', TestTmplContainer);


// simple nested templates
class TestTmplNestedA extends BaseComponent {
    constructor () {
        super();
        this.nestedTemplate = true;
    }

    get templateString () {
        return `<section>
            <div>content A before</div>
            <section ref="container"></section>
            <div>content A after</div>
        </section>`;
    }
}
customElements.define('test-tmpl-nested-a', TestTmplNestedA);

class TestTmplNestedB extends TestTmplNestedA {
    get templateString () {
        return `<div>content B</div>`;
    }
}
customElements.define('test-tmpl-nested-b', TestTmplNestedB);


// nested plus light dom
class TestTmplNestedC extends TestTmplNestedA {
    get templateString () {
        return `<section>
            <div>content C before</div>
            <div ref="container"></div>
            <div>content C after</div>
        </section>`;
    }
}
customElements.define('test-tmpl-nested-c', TestTmplNestedC);


// 5-deep nested templates
class TestA extends BaseComponent {}
class TestB extends TestA {
    get templateString () {
        return `<section>
            <div>content B before</div>
            <section ref="container"></section>
            <div>content B after</div>
        </section>`;
    }
}
class TestC extends TestB {}
class TestD extends TestC {
    get templateString () {
        return `<div>content D</div>`;
    }
}
class TestE extends TestD {
    constructor () {
        super();
        this.nestedTemplate = true;
    }
}
customElements.define('test-a', TestA);
customElements.define('test-b', TestB);
customElements.define('test-c', TestC);
customElements.define('test-d', TestD);
customElements.define('test-e', TestE);

class TestList extends BaseComponent {

    static get observedAttributes() { return ['list-title']; }
    get props () { return ['list-title']; }

    get templateString () {
        return `
            <div class="title" ref="titleNode"></div>
            <div ref="container"></div>`;
    }
    
    set data (items) {
        this.renderList(items, this.container);
    }

    domReady () {
        this.titleNode.innerHTML = this['list-title'];
    }
}
customElements.define('test-list', TestList);

class TestListComponent extends BaseComponent {

	static get observedAttributes() { return ['item-tag']; }
	get props () { return ['item-tag']; }

	set data (items) {
		this.items = items;
		this.onConnected(this.renderItems.bind(this));
	}

	renderItems () {
		const frag = document.createDocumentFragment();
		const tag = this['item-tag'];
		const self = this;
		this.items.forEach((item) => {
			const node = dom(tag, {}, frag);
			node.data = item;
		});
		this.onDomReady(() => {
			this.appendChild(frag);
		});
	}

	domReady () {

	}
}
customElements.define('test-list-component', TestListComponent);

// address1:"6441"
// address2:"Alexander Way"
// birthday:"01/14/2018"
// city:"Durham"
// company:"Craigslist"
// email:"jcurtis@craigslist.com"
// firstName:"Jordan"
// lastName:"Curtis"
// phone:"704-750-4316"
// ssn:"361-17-6344"
// state:"North Carolina"
// zipcode:"86310"


class TestListComponentItem extends BaseComponent {

	static get observedAttributes() { return ['list-title']; }
	get props () { return ['list-title']; }

	set data (item) {
		this.item = item;
		this.onConnected(this.renderItem.bind(this));
	}

	renderItem () {
		const item = this.item;
		const self = this;

		dom('div', {html:[
			dom('label', {html: 'Name:'}),
			dom('span', {html: item.firstName}),
			dom('span', {html: item.lastName})
		]}, this);

		dom('div', {html:[
			dom('div', {class: 'indent', html:[
				dom('div', {html:[
					dom('label', {html: 'Address:'}),
					dom('span', {html: item.address1}),
					dom('span', {html: item.address2}),
					dom('span', {html: item.city}),
					dom('span', {html: item.state}),
					dom('span', {html: item.zipcode})
				]}),
				dom('div', {html:[
					dom('label', {html: 'Company:'}),
					dom('span', {html: item.company})
				]}),
				dom('div', {html:[
					dom('label', {html: 'Birthday:'}),
					dom('span', {html: item.birthday})
				]}),
				dom('div', {html:[
					dom('label', {html: 'SSN:'}),
					dom('span', {html: item.ssn})
				]})
			]})
		]}, this);
	}

	domReady () {

	}
}
customElements.define('test-list-component-item', TestListComponentItem);

class TestListComponentTmpl extends BaseComponent {

	static get observedAttributes() { return ['list-title']; }
	get props () { return ['list-title']; }

	get templateString () {
		return `
            <div>
            	<label>Name:</label><span ref="firstName"></span><span ref="lastName"></span>
			</div>
			<div class="indent">
				<div>
					<label>Address:</label><span ref="address1"></span><span ref="address2"></span><span ref="city"></span><span ref="state"></span><span ref="zipcode"></span>
				</div>
				<div>
					<label>Company:</label><span ref="company"></span>
				</div>
				<div>
					<label>DOB:</label><span ref="birthday"></span>
				</div>
				<div>
					<label>SSN:</label><span ref="ssn"></span>
				</div>
			</div>
		`;
	}

	set data (item) {
		this.item = item;
		this.onConnected(this.renderItem.bind(this));
	}

	renderItem () {
		const item = this.item;
		const self = this;
		Object.keys(item).forEach((key) => {
			if(self[key]){
				const node = document.createTextNode(item[key]);
				self[key].appendChild(node);
			}
		})
	}

	domReady () {

	}
}
customElements.define('test-list-component-tmpl', TestListComponentTmpl);

window.itemTemplateString = `<template>
    <div id="{{id}}">
        <span>{{first}}</span>
        <span>{{last}}</span>
        <span>{{role}}</span>
    </div>
</template>`;

window.ifAttrTemplateString = `<template>
    <div id="{{id}}">
        <span>{{first}}</span>
        <span>{{last}}</span>
        <span>{{role}}</span>
        <span if="{{amount}} < 2" class="amount">{{amount}}</span>
        <span if="{{type}} === 'sane'" class="sanity">{{type}}</span>
    </div>
</template>`;

function dev () {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let s = '{{amount}} + {{num}} + 3';
    const list = [{amount: 1, num: 2}, {amount: 3, num: 4}, {amount: 5, num: 6}];
    const r = /\{\{\w*}}/g;
    const fn = [];
    const args = [];
    s = s.replace(r, (w) => {
        console.log('word', w);
        const v = alphabet.shift();
        fn.push(v);
        args.push(/\w+/g.exec(w)[0]);
        return v;
    });
    fn.push(s);

    console.log('fn', fn);
    console.log('args', args);
    //s = 'return ' + s + ';';
    console.log('s', s);

    window.f = new Function(s);

    const dynFn = function (a,b,c,d,e,f) {
        const r = eval(s);
        return r;
    };

    console.log('  f:', dynFn(1,2));
    //
    list.forEach((item) => {
        const a = args.map((arg) => {
            return item[arg];
        });
        const re = dynFn.apply(null, a);
        console.log('r', re);
    });


}
//dev();