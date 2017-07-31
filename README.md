# Jinkela-Forest

## Install

```bash
npm install jinkela-forest
```

## Usage

### new Forest([args])

* `args` **Object** Set of configurable options to set. Can have the following fields:
  * `defaultValue` **Any** The default value.
  * `placeholder` **String** The placeholder text.
  * `readonly` **Boolean** The readonly flag.
  * `options` **Array&lt;option&gt;** Cascading options.

* `option` **Object** The cascading option item. Can have the following fields:
  * `id` **Any** The unique id of item.
  * `parentId` **Any** The parent id of item.
  * `text` **String** The item text.

## Demo

```html
<script src="https://unpkg.com/jinkela@1.2.19/umd.js"></script>
<script src="index.js"></script>
<script>
addEventListener('DOMContentLoaded', () => {

  new Forest({
    options: [
      { id: 1, text: 'item 1' },
      { id: 2, parentId: 1, text: 'item 2' },
      { id: 3, parentId: 1, text: 'item 3' },
      { id: 4, parentId: 2, text: 'item 4' },
      { id: 5, parentId: 2, text: 'item 5' },
      { id: 6, parentId: 3, text: 'item 6' },
      { id: 7, parentId: 3, text: 'item 7' },
      { id: 8, text: 'item 8' },
      { id: 9, parentId: 8, text: 'item 9' },
      { id: 10, parentId: 8, text: 'item 10' },
      { id: 11, parentId: 9, text: 'item 11' },
      { id: 12, parentId: 9, text: 'item 12' },
      { id: 13, parentId: 10, text: 'item 13' },
      { id: 14, parentId: 10, text: 'item 14' }
    ] 
  }).to(document.body);

});
</script>
```
