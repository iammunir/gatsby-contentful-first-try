import * as React from "react"
import { Link, graphql } from "gatsby"
import { renderRichText } from 'gatsby-source-contentful/rich-text'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { INLINES, BLOCKS, MARKS } from '@contentful/rich-text-types'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({
  data: { previous, next, site, contentfulBlog: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`

  const plainTextContent = documentToPlainTextString(JSON.parse(post.content.raw));

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { gatsbyImageData, description } = node.data.target
        console.dir(node.data.target)
        return (
          <GatsbyImage
              image={getImage(node.data.target)}
              alt={description}
          />
        )
      },
    },
  };

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.title}</h1>
          <p>{post.date}</p>
        </header>
        <section
          itemProp="articleBody"
        >
          {post.content?.raw && renderRichText(post.content, options)}
        </section>
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={`/${previous.slug}`} rel="prev">
                ← {previous.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`/${next.slug}`} rel="next">
                {next.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { contentfulBlog: post } }) => {
  return (
    <Seo
      title={post.title}
      description={post.description.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulBlog(id: {eq: $id}) {
      id
      title
      description {
        description
      }
      date(formatString: "MMMM DD, YYYY")
      content {
        raw
        references {
          contentful_id
          title
          description
          gatsbyImageData(
            layout: CONSTRAINED
            quality: 80
            formats: [WEBP, AUTO]
            placeholder: BLURRED
          )
          __typename
        }
      }
    }
    previous: contentfulBlog(id: {eq: $previousPostId}) {
      slug
      title
    }
    next: contentfulBlog(id: {eq: $nextPostId}) {
      slug
      title
    }
  }
`
