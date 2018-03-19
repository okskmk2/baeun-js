# bhnjs
This js is Extend javascript with purejs style.

# Form.toJson()
```html
<form action="/info" id="formtest">
  <input type="text" name="username">
  <input type="password" name="password">
  <input type="radio" name="sex" value="female">
  <input type="radio" name="sex" value="male">
  <input type="checkbox" name='like' value="apple">
  <input type="checkbox" name='like' value="banana">
  <select name="city" multiple>
  <option>seoul</option>
  <option>beijing</option>
  <option>paris</option>
  </select>
  <input type='submit'>
</form>
<script>
query('#formtest').addEventListener('submit', function (ev) {
  let data = this.toJson();
  console.log(data);
  ev.preventDefault();
});
</script>
```

`output` {"username":"","password":"","sex":"female","like":["apple","banana"],"addr":["seoul","beijing","paris"]}


# Http Request 
```javascript
httpGet(url,fn);
httpPost(url,data,fn);
```

# query
```
query('#id .classname');
```

# json to table
```
Element.insertTable(JsonString);
```
