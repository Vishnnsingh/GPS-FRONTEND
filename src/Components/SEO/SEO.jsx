import { useEffect } from 'react'
import {
  buildAbsoluteUrl,
  buildCanonicalUrl,
  buildSchoolJsonLd,
  DEFAULT_DESCRIPTION,
  formatPageTitle,
  SCHOOL_KEYWORDS,
  SCHOOL_NAME,
} from '../../seo/siteSeo'

const META_ATTR = 'data-gps-seo'

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      element.removeAttribute(key)
      return
    }

    element.setAttribute(key, String(value))
  })

  element.setAttribute(META_ATTR, 'true')
  return element
}

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      element.removeAttribute(key)
      return
    }

    element.setAttribute(key, String(value))
  })

  element.setAttribute(META_ATTR, 'true')
  return element
}

function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = SCHOOL_KEYWORDS,
  canonicalPath = '/',
  noIndex = false,
  image = buildAbsoluteUrl('/logo.png'),
  type = 'website',
  twitterCard = 'summary_large_image',
  jsonLd = null,
  lang = 'en-IN',
}) {
  useEffect(() => {
    const previousLang = document.documentElement.lang
    document.documentElement.lang = lang

    document.title = formatPageTitle(title)

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    })

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: formatPageTitle(title) })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: buildCanonicalUrl(canonicalPath) })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SCHOOL_NAME })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: twitterCard })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: formatPageTitle(title) })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: buildCanonicalUrl(canonicalPath) })

    const jsonLdId = 'gps-jsonld-schema'
    let jsonLdScript = document.head.querySelector(`#${jsonLdId}`)
    if (jsonLdScript) {
      jsonLdScript.remove()
    }

    if (jsonLd) {
      jsonLdScript = document.createElement('script')
      jsonLdScript.id = jsonLdId
      jsonLdScript.type = 'application/ld+json'
      jsonLdScript.setAttribute(META_ATTR, 'true')
      jsonLdScript.text = JSON.stringify(jsonLd)
      document.head.appendChild(jsonLdScript)
    }

    return () => {
      document.documentElement.lang = previousLang || 'en'
    }
  }, [canonicalPath, description, image, jsonLd, keywords, lang, noIndex, title, twitterCard, type])

  return null
}

export default SEO

