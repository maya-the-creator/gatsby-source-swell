# gatsby-source-swell

Source plugin for pulling product data into [Gatsby](https://www.gatsbyjs.com/) from [Swell](https://www.swell.is/) stores via the [Swell API](https://swell.store/docs/api/).

## Features

- Provides public shop data available via the [Swell API](https://swell.store/docs/api/)
- Supports `gatsby-transformer-sharp` and `gatsby-image` for product images

## Install

```shell
yarn add gatsby-source-swell
```

## How to use

In your `gatsby-config.js` add the following config to enable this plugin:

```js
plugins: [
  /*
   * Gatsby's data processing layer begins with “source”
   * plugins. Here the site sources its data from Swell.
   */
  {
    resolve: 'gatsby-source-swell',
    options: {
      storeId: 'swell-store-id',
      publicKey: 'example-wou7evoh0eexuf6chooz2jai2qui9pae4tieph1sei4deiboj',
    },
  },
]
```
