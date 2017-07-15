## Weather forecast proxy helper
### Usage
**replace** `https://api.darksky.net`

**by**        ` https://proxy-forecast.glitch.me`

The query params and the querystring are the same as the [draksky docs](https://darksky.net/dev/docs/forecast)

***expect*** the user should not provide his/her `dark sky key`

Only works for `forecast` not the `time machine`

### Caching
Responses are cached for one hour, except the ones with errors.

If the user change the query options, the cached data is updated

### Important
The Api only accept requests from codepen.

### Improvements
Refactoring the code responsible for caching

### Links
[Glitch Code](https://glitch.com/edit/#!/proxy-forecast?path=server.js:22:9)

[Api](https://proxy-forecast.glitch.me/)

[Github repo](https://github.com/AdelMahjoub/proxy-forecast-helper)