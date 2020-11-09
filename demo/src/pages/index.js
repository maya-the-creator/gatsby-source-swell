import React, { Fragment } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'

const pageQuery = graphql`
  {
    allSwellProduct {
      nodes {
        id
        name
        description
        price
        imagesLocal {
          id
          childImageSharp {
            fixed(width: 500) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`

const IndexPage = () => {
  const {
    allSwellProduct: { nodes },
  } = useStaticQuery(pageQuery)

  return (
    <>
      {nodes.map(({ id, name, description, price, imagesLocal }) => {
        return (
          <div key={id}>
            <h1>{name}</h1>
            <div dangerouslySetInnerHTML={{ __html: description }} />
            <h2>{`$${price.toFixed(2)}`}</h2>
            {imagesLocal.map(image => (
              <Fragment key={image.id}>
                <Img fixed={image.childImageSharp.fixed} />
              </Fragment>
            ))}
            <hr />
          </div>
        )
      })}
    </>
  )
}

export default IndexPage
