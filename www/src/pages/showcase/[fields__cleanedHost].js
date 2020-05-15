import React from "react"
import { graphql, createPagesFromData } from "gatsby"
import ShowcaseDetails from "../components/showcase-details"

function Showcase({ location, data }) {
  const isModal =
    location.state && location.state.isModal && window.innerWidth > 750

  const categories = data.categories || []

  /*
   * This shouldn't ever happen due to filtering on hasScreenshot field
   * However, it appears to break Gatsby Build
   * so let's avoid a failure here
   */
  if (
    !data.sitesYaml.childScreenshot ||
    !data.sitesYaml.childScreenshot.screenshotFile
  ) {
    data.sitesYaml.childScreenshot = {
      screenshotFile: data.fallback,
    }
  }

  return (
    <ShowcaseDetails
      isModal={isModal}
      site={data.sitesYaml}
      categories={categories}
      location={location}
    />
  )
}

export default createPagesFromData(
  Showcase,
  `allSitesYaml(filter: { main_url: { ne: null }, fields: { ne: null, slug: { ne: null }, hasScreenshot: { ne: null } } }`
)

export const query = graphql`
  query Showcase($host: String!) {
    fallback: file(relativePath: { eq: "screenshot-fallback.png" }) {
      childImageSharp {
        ...ScreenshotDetails
      }
    }
    sitesYaml(fields: { cleanedHost: { eq: $host } }) {
      id
      title
      main_url
      featured
      categories
      built_by
      built_by_url
      source_url
      description
      childScreenshot {
        screenshotFile {
          childImageSharp {
            resize(width: 1200, height: 627, cropFocus: NORTH, toFormat: JPG) {
              src
              height
              width
            }
          }
        }
      }
      fields {
        cleanedHost
        slug
        hasScreenshot
      }
    }
  }
`