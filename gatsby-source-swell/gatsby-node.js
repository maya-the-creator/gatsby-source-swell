const { createRemoteFileNode } = require('gatsby-source-filesystem')
const swell = require('swell-js')

exports.sourceNodes = async (
  { actions: { createNode }, createContentDigest, createNodeId, reporter },
  { storeId, publicKey }
) => {
  if (!storeId || !publicKey) {
    return reporter.panic(
      'gatsby-source-swell: You must provide your Swell store credentials'
    )
  }

  reporter.info(`starting to fetch product data from Swell`)

  swell.init(storeId, publicKey, {
    useCamelCase: true,
  })

  const response = await swell.products.list()

  response.results.forEach(product => {
    const nodeId = createNodeId(`swell-product-${product.id}`)
    const nodeData = Object.assign({}, product, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: 'SwellProduct',
        content: JSON.stringify(product),
        contentDigest: createContentDigest(product),
      },
    })

    createNode(nodeData)
  })

  reporter.info(`fetched and processed Product nodes`)
  reporter.info(`finished fetching product data from Swell`)
}

exports.onCreateNode = async ({
  actions: { createNode },
  store,
  node,
  cache,
  createNodeId,
}) => {
  if (node.internal.type === 'SwellProduct' && node.images.length > 0) {
    const localImages = []

    node.images.map(async image => {
      const fileNode = await createRemoteFileNode({
        url: image.file.url,
        cache,
        createNode,
        createNodeId,
        parentNodeId: node.id,
        store,
      })

      if (fileNode) {
        localImages.push(fileNode.id)
        node.imagesLocal___NODE = localImages
      }
    })
  }
}
