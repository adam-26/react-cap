# react-cap

A fork of [react-helmet](https://github.com/nfl/react-helmet)

_its the helmet utils, with the data-react-helmet attribute removed_

  * No longer uses `data-react-helmet` attributes
  * Assumes all metadata is assigned using this package
  * Apply attribute `data-cap-ignore` to an html element to prevent it being removed
  * Apply attribute `data-cap-ignore="attrName,attrName"` to an html element to not modify specific attributes
  * Package is not intended to be used directly

See [react-html-metadata](https://github.com/adam-26/react-html-metadata) for an implementation that uses this package.

## License
MIT
