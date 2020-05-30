# bhnspa project

## Define router.js
```javascript
const routes = [
    {
        path: "",
        component: "components/home.html"
    },
    {
        path: "townhall",
        component: "components/townhall.html"
    },
    {
        path: "myspace",
        component: "components/myspace.html",
        children: [
            {
                path: "",
                component: "components/myspace/profile.html"
            },
            {
                path: "note",
                component: "components/myspace/note.html"
            },
        ]
    },
];
```


## Place scripts and init bhninit()
place script before body tag end
```html
  <script src="./router.js"></script>
  <script src="./bhnspa.js"></script>
  <script>
      const main = document.querySelector('.main');
      bhninit(main); 
  </script>
```

## router-view and component
```html
  <div component='components/myspace/myspaceSnb.html'></div>
  <div router-view></div>
```

