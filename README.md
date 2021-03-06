# react-cap

A fork of [react-helmet](https://github.com/nfl/react-helmet)

_its react-helmet, with the data-react-helmet attribute removed_

  * No longer uses `data-react-helmet` attributes
  * _Assumes_ all HTML metadata is assigned using this package
  * To prevent react-cap from removing metadata assigned **not using react-cap**:
    * apply attribute `data-ignore-metadata` to an html element to prevent it being removed
    * apply attribute `data-ignore-metadata="attrName,attrName"` to an html element to prevent modification of specific attributes

This package was originally created to support using HTML `<head>` metadata with the react v16 streaming interface.
See [react-html-metadata](https://github.com/adam-26/react-html-metadata) for an implementation that supports react server side streaming.

### Install

##### NPM
```sh
npm install --save react-cap
```

##### Yarn
```sh
yarn add react-cap
```

### Usage

```js
import Helmet from 'react-cap';
```

For **more documentation, see [react-helmet documentation](https://github.com/nfl/react-helmet)**
Usage is exactly the same as react-helmet.

#### Usage with webpack style-loader

To prevent the webpack `<style>` tags from being removed, you **must** configure
the [style-loader with an ignore attribute](https://github.com/webpack-contrib/style-loader#attrs).

```js
{
  test: /\.css$/,
  use: [
    { loader: 'style-loader', options: { attrs: { data-ignore-metadata: true } } }
  ]
}
```

#### Usage with webpack css-loader

Its recommended you utilize _asset_ files to apply css stylesheets using **react-cap**

## License
MIT
