'use strict';
require('../sass/main.scss');

import Vue from 'vue/dist/vue.esm';
// import VueDraggable from 'vue-draggable';

// Vue.use(VueDraggable);

new Vue({
    el: 'main',
    data: {
        activeList: null,
        lists: {},

        itemDialogOpen: false,

        // Only data in these data keys will be saved/loaded
        savedKeys: ['lists', 'activeList']
    },
    methods: {
        modifyAmount(entry, val) {
            entry.amount += val;

            // Shouldn't happen as we remove the button, but just to make sure.
            if (entry.amount < 0) {
                entry.amount = 0;
            }

            this.save(true);
        },

        deleteEntry(key) {
            if (confirm('Delete this item?')) {
                this.lists[this.activeList].splice(key, 1);

                this.save();
            }
        },

        selectList(key) {
            this.activeList = key;

            this.save(true, ['activeList']);
        },

        addList() {
            let name = prompt('List name');
            if (name) {
                if (this.lists[name] === undefined) {
                    this.lists[name] = [];
                }
                this.activeList = name;

                this.save();
            }
        },

        openItemDialog() {
            if ( ! this.activeList) {
                alert('Create a list first');
                return false;
            }

            this.itemDialogOpen = true;

            let $input = document.getElementById('entry-name');
            $input.value = '';

            Vue.nextTick(() => {
                $input.focus();
            });
        },

        addEntry(event) {
            let $input = document.getElementById('entry-name');

            if ($input.value) {
                this.lists[this.activeList].push({
                    title: $input.value,
                    amount: 1
                });

                this.save();

                this.itemDialogOpen = false;
            }
        },

        save(async = false, keys = null) {
            if ( ! keys) {
                keys = this.savedKeys;
            }
            // @todo async saves should wait a second or so to save on I/O.
            keys.forEach(key => {
                let buffer = JSON.stringify(this[key]);
                localStorage.setItem(key, buffer);
            });
        },

        load() {
            try {
                this.savedKeys.forEach(key => {
                    let buffer = localStorage.getItem(key);
                    if (buffer) {
                        this[key] = JSON.parse(buffer);
                    }
                });
            }
            catch(exc) {}
        }
    },
    mounted() {
        this.load();
    }
});
