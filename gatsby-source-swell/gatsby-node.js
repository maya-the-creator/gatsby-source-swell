const { createRemoteFileNode } = require('gatsby-source-filesystem')
const swell = require('swell-node')
const { NODE_PREFIX, NODE_TYPES } = require('./constants')

exports.sourceNodes = async (
  { actions: { createNode }, createContentDigest, createNodeId, reporter },
  { storeId, secretKey, dataTypes }
) => {
  if (!storeId || !secretKey) {
    return reporter.panic(
      'gatsby-source-swell: You must provide your Swell store credentials'
    )
  }

  swell.init(storeId, secretKey, {
    useCamelCase: true,
  })

  // if unspecified, set default data types
  const defaultDataTypes = dataTypes || ['category', 'product']
  const fetchDataTypes = NODE_TYPES.filter(type =>
    defaultDataTypes.includes(type.label)
  )

  await Promise.all(
    fetchDataTypes.map(async dataType => {
      const response = await swell.get(dataType.endpoint, dataType.arguments)

      response.results.forEach(thisNode => {
        const nodeId = createNodeId(
          `${NODE_PREFIX.toLocaleLowerCase()}-${dataType.label}-${thisNode.id}`
        )
        const nodeData = Object.assign({}, thisNode, {
          id: nodeId,
          parent: null,
          children: [],
          internal: {
            type: `${NODE_PREFIX}${dataType.type}`,
            content: JSON.stringify(thisNode),
            contentDigest: createContentDigest(thisNode),
          },
        })

        createNode(nodeData)
      })
    })
  )
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
        store,
        cache,
        createNode,
        createNodeId,
        parentNodeId: node.id,
        url: image.file.url,
      })

      if (fileNode) {
        localImages.push(fileNode.id)
        node.images_local___NODE = localImages
      }
    })
  }
}
