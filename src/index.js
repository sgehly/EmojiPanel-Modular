const { EventEmitter } = require('fbemitter');

const Create = require('./create');
const Emojis = require('./emojis');
const List = require('./list');
const classnames = require('./classnames');

var config = {
    search: true,
    frequent: true,
    fitzpatrick: 'a',
    hidden_categories: [],

    pack_url: null,
    json_url: '/emojis.json',

    tether: true,
    placement: 'bottom',

    locale: {
        add: 'Add emoji',
        brand: 'Add Emoji!',
        frequent: 'Frequently used',
        loading: 'Loading...',
        no_results: 'No results',
        search: 'Search',
        search_results: 'Search results'
    },
    icons: {
        search: '<span class="fa fa-search"></span>'
    },
    customEmojis: [],
    classnames
};

export default class EmojiPanel extends EventEmitter {
    constructor(options) {
        super();

        this.options = Object.assign({}, config, options);

        const els = ['container', 'trigger', 'editable'];
        els.forEach(el => {
            if(typeof this.options[el] == 'string') {
                this.options[el] = document.querySelector(this.options[el]);
            }
        });

        const create = Create(this.options, this.emit.bind(this), this.toggle.bind(this));
        this.panel = create.panel;
        this.tether = create.tether;

        Emojis.load(this.options)
            .then(res => {

                //res[1].unshift({name: "Your Emojis", emojis: config.customEmojis, "icon": {"unicode": "1f44f","char": "👏"}});
                List(this.options, this.panel, res[1], this.emit.bind(this));
            });
    }

    toggle() {
        const open = this.panel.classList.toggle(this.options.classnames.open);
        const searchInput = this.panel.querySelector('.' + this.options.classnames.searchInput);
            
        this.emit('toggle', open);
        if(open && this.options.search && searchInput) {
            searchInput.focus();
        }
    }

    reposition() {
        if(this.tether) {
            this.tether.position();
        }
    }
}

if(typeof window != 'undefined') {
    window.EmojiPanel = EmojiPanel;
}
