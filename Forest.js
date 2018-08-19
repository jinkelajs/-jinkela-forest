{

  const INACTIVE_ICON = URL.createObjectURL(new Blob([ `
    <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"><path transform="translate(-98,-78)" fill="#c0ccda" d="M99.3333333,90.0037973 C99.3333333,91.4746588 100.525409,92.6666667 101.996203,92.6666667 L110.003797,92.6666667 C111.474659,92.6666667 112.666667,91.4745907 112.666667,90.0037973 L112.666667,81.9962027 C112.666667,80.5253412 111.474591,79.3333333 110.003797,79.3333333 L101.996203,79.3333333 C100.525341,79.3333333 99.3333333,80.5254093 99.3333333,81.9962027 L99.3333333,90.0037973 Z M101.996203,78 L110.003797,78 C112.210839,78 114,79.7888304 114,81.9962027 L114,90.0037973 C114,92.2108391 112.21117,94 110.003797,94 L101.996203,94 C99.7891609,94 98,92.2111696 98,90.0037973 L98,81.9962027 C98,79.7891609 99.7888304,78 101.996203,78 Z"></path></svg>
  ` ], { type: 'image/svg+xml' }));

  const ON_DATA = 'M132,81.9962027 C132,79.7891609 133.78883,78 135.996203,78 L144.003797,78 C146.210839,78 148,79.7888304 148,81.9962027 L148,90.0037973 C148,92.2108391 146.21117,94 144.003797,94 L135.996203,94 C133.789161,94 132,92.2111696 132,90.0037973 L132,81.9962027 Z M137.698564,89.8954727 C137.928214,90.1318772 138.300826,90.1370767 138.541509,89.8963942 L145.089943,83.3479599 C145.403039,83.0348634 145.402466,82.5266599 145.087164,82.2113581 L144.969466,82.0936604 C144.654835,81.779029 144.147907,81.7758387 143.836075,82.0876707 L138.171522,87.7522235 L136.055486,85.6361881 C135.740937,85.3216388 135.231556,85.3210349 134.916254,85.6363368 L134.798556,85.7540345 C134.483925,86.0686658 134.483805,86.5861628 134.785566,86.8967982 L137.698564,89.8954727 Z';

  const ACTIVE_ICON = URL.createObjectURL(new Blob([ `
    <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"><path transform="translate(-132,-78)" fill="#20a0ff" d="${ON_DATA}"></path></svg>
  ` ], { type: 'image/svg+xml' }));

  const WEAK_ACTIVE_ICON = URL.createObjectURL(new Blob([ `
    <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"><path transform="translate(-132,-78)" fill="rgba(32,160,255,.3)" d="${ON_DATA}"></path></svg>
  ` ], { type: 'image/svg+xml' }));

  const MENU_CACHE = Symbol('Menu Cache');

  const PANEL_CLASS_NAME = 'jinkela_forest_' + Array.from({ length: 16 }, () => (36 * Math.random() | 0).toString(36)).join('');

  class ForestItem extends Jinkela {

    get tagName() { return 'li'; }

    init() {
      this.element.jinkela = this;
      this.element.textContent = this.text;
      if (this.options) this.element.classList.add('has-children');
      this.element.addEventListener('mouseenter', () => this.mouseenter());
    }

    mouseenter() {
      let event = new CustomEvent('hover', { bubbles: true, detail: this });
      this.element.dispatchEvent(event);
    }

    set isActive(value) {
      if (value) {
        this.element.classList.add('active');
      } else {
        this.element.classList.remove('active');
      }
    }

    get isActive() {
      return this.element.classList.contains('active');
    }

    set isWeakActive(value) {
      if (value) {
        this.element.classList.add('weak-active');
      } else {
        this.element.classList.remove('weak-active');
      }
    }

    get isWeakActive() {
      return this.element.classList.contains('weak-active');
    }

    get styleSheet() {
      return `
        :scope {
          font-size: 14px;
          padding: 8px 30px 8px 32px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #48576a;
          height: 36px;
          line-height: 1.5;
          box-sizing: border-box;
          cursor: pointer;
          background-image: url("${INACTIVE_ICON}");
          background-repeat: no-repeat;
          background-position: 8px center;
          &.hover, &:hover { background-color: #e4e8f1; }
          &.weak-active { background-image: url("${WEAK_ACTIVE_ICON}"); }
          &.active { background-image: url("${ACTIVE_ICON}"); }
          &.has-children::after {
            content: '';
            position: absolute;
            margin: auto;
            width: 0;
            height: 0;
            right: 12px;
            top: 0;
            bottom: 0;
            border: 5px solid transparent;
            border-left-color: #bfcad9;
          }
        }
      `;
    }

  }

  class ForestMenu extends Jinkela {

    static create(options = [], forest) {
      let menu = options[MENU_CACHE] = options[MENU_CACHE] || new ForestMenu({ options, forest });
      menu.update();
      menu.clearHoverItem();
      return menu;
    }

    get tagName() { return 'ul'; }

    init() {
      let { options } = this;
      this.element.jinkela = this;
      options.forEach(item => item.to(this));
      this.element.addEventListener('hover', event => this.hover(event));
    }

    hover(event) {
      event.stopPropagation();
      let { options } = event.detail;
      this.clearHoverItem();
      event.detail.element.classList.add('hover');
      while (this.element.nextSibling) this.element.nextSibling.remove();
      if (options) ForestMenu.create(options, this.forest).to(this.element.parentNode);
    }

    clearHoverItem() {
      let oldHover = this.element.querySelector('.hover');
      if (oldHover) oldHover.classList.remove('hover');
    }

    update() {
      for (let i of this.options) {
        i.isWeakActive = this.forest.fullValue.includes(i.id);
        i.isActive = this.forest.value.includes(i.id);
      }
    }

    get styleSheet() {
      return `
        :scope {
          display: inline-block;
          vertical-align: top;
          height: 204px;
          background-color: #fff;
          border-left: 1px solid #d1dbe5;
          box-sizing: border-box;
          margin: 0;
          overflow: auto;
          padding: 6px 0;
          min-width: 160px;
          &:first-child {
            border-left: 0;
          }
        }
      `;
    }

  }

  class ForestPanel extends Jinkela {

    init() {
      this.cache = {};
      this.element.jinkela = this;
      this.element.addEventListener('click', event => this.click(event));
      this.element.classList.add(PANEL_CLASS_NAME);
      let { options } = this.forest;
      while (this.element.firstChild) this.element.firstChild.remove();
      ForestMenu.create(options, this.forest).to(this);
    }

    update() {
      for (let i = this.element.firstElementChild; i; i = i.nextElementSibling) if (i.jinkela) i.jinkela.update();
      this.updatePosition();
    }

    click(event) {
      let { jinkela } = event.target;
      if (!jinkela) return;
      let { id } = jinkela;
      this.forest.toggle(id);
    }

    updatePosition() {
      let rect = this.forest.element.getBoundingClientRect();
      let clientHeight = document.body.clientHeight;
      if (clientHeight / 2 > rect.top + rect.height / 2) {
        this.element.style.top = rect.top + rect.height + 5;
        this.element.style.bottom = 'auto';
      } else {
        this.element.style.top = 'auto';
        this.element.style.bottom = clientHeight - rect.top + 5;
      }
      this.element.style.left = rect.left;
    }

    show() {
      this.updatePosition();
      if (this.element.parentNode !== document.body) document.body.appendChild(this.element);
    }

    hide() {
      this.element.remove();
    }

    hideIfOut(target) {
      if (
        this.element.contains(target) || this.element === target ||
        this.forest.element.contains(target) || this.forest.element === target
      ) return;
      this.hide();
    }

    get styleSheet() {
      return `
        :scope {
          position: fixed;
          transform-origin: center top 0px;
          z-index: 2005;
          border: 1px solid #d1dbe5;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
          overflow: auto;
          border-right: 1px solid #d1dbe5;
          background-color: #fff;
          box-sizing: border-box;
        }
      `;
    }

  }

  class ForestSelectedItem extends Jinkela {

    remove() {
      if (this.noRemovingAnimation) {
        this.element.remove();
      } else {
        this.element.animate([
          { transform: 'scale(1)' }, { transform: 'scale(.01)' }
        ], { duration: 200, easing: 'ease' }).addEventListener('finish', () => this.element.remove());
      }
    }

    dispatchRemoveEvent() {
      let event = new CustomEvent('remove', { bubbles: true, detail: this });
      this.element.dispatchEvent(event);
    }

    get template() {
      return `
        <span>
          <span>{text}</span>
          <svg on-click="{dispatchRemoveEvent}" viewBox="0 0 18 18">
            <path d="M 4 4 L 14 14 M 4 14 L 14 4 Z" />
          </svg>
        </span>
      `;
    }

    get styleSheet() {
      return `
        @keyframes ${PANEL_CLASS_NAME}_show {
          from { transform: scale(0.01); }
          to { transform: scale(1); }
        }
        :scope {
          box-sizing: border-box;
          border: 1px solid transparent;
          background-color: rgba(32,160,255,.1);
          border-color: rgba(32,160,255,.2);
          color: #20a0ff;
          stroke: currentColor;
          border-radius: 4px;
          padding: 5px;
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          justify-content: center;
          margin: 2px 3px;
          align-items: center;
          display: inline-flex;
          -webkit-box-pack: center;
          -webkit-box-align: center;
          animation: 200ms ease ${PANEL_CLASS_NAME}_show;
          > svg {
            width: 12px;
            height: 12px;
            cursor: pointer;
            border: 1px solid transparent;
            border-radius: 100%;
            margin-left: 4px;
            &:hover {
              background: currentColor;
              border-color: #fff;
              stroke: #fff;
            }
          }
        }
        .disabled :scope {
          filter: saturate(0);
          animation: unset;
          > svg { display: none; }
        }
      `;
    }

  }

  class ForestSelectedList extends Jinkela {

    init() {
      this.element.addEventListener('remove', event => this.remove(event));
      this.element.addEventListener('click', () => this.click());
      this.element.style.setProperty('--placeholder', JSON.stringify(this.forest.placeholder));
      this.list = [];
      if (this.forest.readonly) this.element.classList.add('disabled');
    }

    click() {
      if (this.forest.readonly) return;
      this.forest.panel.show();
    }

    remove(event) {
      event.stopPropagation();
      this.forest.toggle(event.detail.id);
    }

    clear() {
      while (this.element.firstChild) this.element.firstChild.remove();
    }

    update() {
      let { noRemovingAnimation } = this.forest;
      let data = this.forest.value.map(id => this.forest.indexForId[id]).filter(Boolean);
      let { list } = this;
      for (let i = 0; i < data.length; i++) {
        if (list[i]) {
          if (list[i].id !== data[i].id) list.splice(i--, 1).forEach(item => item.remove());
        } else {
          list.push(new ForestSelectedItem(data[i], { noRemovingAnimation }).to(this));
        }
      }
      list.splice(data.length).forEach(item => item.remove());
    }

    get styleSheet() {
      return `
        :scope {
          &:empty::before {
            content: var(--placeholder);
            color: #757575;
            line-height: 24px;
            display: inline-block;
            margin: 2px 4px;
          }
          border-radius: 4px;
          box-sizing: border-box;
          min-height: 36px;
          width: 222px;
          padding: 3px 3px;
          border: 1px solid #bfcbd9;
          &:hover {
            border-color: #8391a5;
          }
          &.disabled {
            background-color: #eff2f7;
            border-color: #d3dce6;
            color: #bbb;
            cursor: not-allowed;
            &:hover {
              border-color: #d3dce6;
            }
          }
        }
      `;
    }

  }

  class Forest extends Jinkela {

    beforeParse(params) {
      params.placeholder = params.placeholder || 'Forest Selector';

      // Build Indexes
      let options = JSON.parse(JSON.stringify(params.options));
      options = ForestItem.from(options);
      let indexForId = params.indexForId = {};
      for (let i = 0; i < options.length; i++) indexForId[options[i].id] = options[i];
      let root = {};
      for (let i = 0; i < options.length; i++) {
        let item = options[i];
        let parentItem = indexForId[item.parentId] || root;
        if (!(parentItem.options instanceof Array)) parentItem.options = [];
        parentItem.options.push(item);
      }
      params.options = root.options;

    }

    init() {
      if (!this.$hasValue) this.value = void 0;
      this.selectedList.to(this);
    }

    get panel() {
      let value = new ForestPanel({ forest: this });
      Object.defineProperty(this, 'panel', { configurable: true, value });
      return value;
    }

    get selectedList() {
      let value = new ForestSelectedList({ forest: this });
      Object.defineProperty(this, 'selectedList', { configurable: true, value });
      return value;
    }

    focus() {
      if (this.readonly) return;
      this.panel.show();
    }

    toggle(id) {
      if (this.value.includes(id)) {
        this.value = this.value.filter(i => i !== id);
      } else {
        this.value = this.value.concat(id);
      }
    }

    set value(value = this.defaultValue) {
      if (!(value instanceof Array)) value = [];
      if (this.maxLength) value = value.slice(-this.maxLength);
      this.$hasValue = true;
      this.$value = value;
      delete this.fullValue;
      this.selectedList.update();
      this.panel.update();
    }

    get value() { return this.$value; }

    get fullValue() {
      let { value, indexForId } = this;
      value = value.reduce(function callee(result, id) {
        result.push(id);
        indexForId[id] && indexForId[id].options && indexForId[id].options.map(i => i.id).reduce(callee, result);
        return result;
      }, []);
      Object.defineProperty(this, 'fullValue', { configurable: true, value });
      return value;
    }

    get styleSheet() {
      return `
        :scope {
          display: inline-block;
          position: relative;
          font-size: 14px;
          overflow: hidden;
          font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `;
    }

  }

  addEventListener('click', event => {
    let list = document.querySelectorAll('.' + PANEL_CLASS_NAME);
    for (let i = 0; i < list.length; i++) list[i].jinkela.hideIfOut(event.target);
  }, true);

  window.Forest = Forest;

}
