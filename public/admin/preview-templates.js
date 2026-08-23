/**
 * Visual previews for the CMS.
 *
 * These mirror the markup and class names of the real React components and load
 * the real site stylesheet (public/admin/preview.css, generated from
 * src/styles/), so what the owner sees while editing matches the published page.
 *
 * They are previews only — no drag and drop, no layout editing. The React app
 * owns the layout; the CMS owns the words and pictures.
 *
 * Sections a screen does not own (for example About inside the Homepage
 * preview) are drawn from the last saved content and marked with a chip saying
 * where they are edited.
 */
;(function () {
  var h = window.h
  var CMS = window.CMS
  var SNAP = window.PORTFOLIO_CONTENT || {}

  /* ---------------------------------------------------------------- styles */

  CMS.registerPreviewStyle(
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap'
  )
  CMS.registerPreviewStyle('/admin/preview.css')
  CMS.registerPreviewStyle(
    [
      /* Chrome that belongs to the preview itself, not the site. */
      '.pv-chip{position:absolute;top:12px;left:16px;z-index:5;display:inline-flex;align-items:center;gap:.4rem;',
      'padding:.3rem .6rem;border:1px solid rgba(96,165,250,.35);border-radius:999px;background:rgba(4,12,22,.85);',
      'color:#93c5fd;font-family:var(--font-body);font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}',
      '.pv-section{position:relative}',
      '.pv-ph{display:flex;align-items:center;justify-content:center;width:100%;height:100%;',
      'color:var(--text-dim);font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-align:center;padding:1rem}',
      '.pv-empty{opacity:.45;font-style:italic}',
      'body{overflow-x:hidden}'
    ].join(''),
    { raw: true }
  )

  /* --------------------------------------------------------------- helpers */

  function plain(value) {
    return value && typeof value.toJS === 'function' ? value.toJS() : value
  }

  /** Entry data as a plain object. */
  function dataOf(props) {
    var d = props.entry && props.entry.get('data')
    return plain(d) || {}
  }

  /**
   * Showing an image the owner has only just chosen.
   *
   * Decap reports the path the file *will* have once the site is rebuilt, so
   * rendering that path straight away gives a broken image until Netlify
   * deploys. Instead, remember every file as it is picked and show that copy
   * from the browser's own memory, so the preview updates the instant a photo
   * is selected.
   *
   * Keyed by filename, normalised the same way Decap normalises uploads.
   */
  var pickedFiles = Object.create(null)

  function normaliseName(value) {
    return String(value)
      .split('/')
      .pop()
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/-+/g, '-')
  }

  document.addEventListener(
    'change',
    function (event) {
      var input = event.target
      if (!input || input.type !== 'file' || !input.files) return
      Array.prototype.forEach.call(input.files, function (file) {
        if (!file || !/^image\//.test(file.type)) return
        pickedFiles[normaliseName(file.name)] = URL.createObjectURL(file)
      })
    },
    true
  )

  function asset(props, value) {
    if (!value) return ''
    var picked = pickedFiles[normaliseName(value)]
    if (picked) return picked
    try {
      var a = props.getAsset ? props.getAsset(value) : null
      var file = a && a.fileObj
      if (file && typeof file.size === 'number') return URL.createObjectURL(file)
      var url = a ? String(a) : ''
      return url || value
    } catch (e) {
      return value
    }
  }

  function list(value) {
    var v = plain(value)
    return Array.isArray(v) ? v : []
  }

  function text(value, fallback) {
    if (value === undefined || value === null || value === '') {
      return h('span', { className: 'pv-empty' }, fallback || '—')
    }
    return value
  }

  /**
   * Mirror of src/lib/whatsapp.js so the preview links exactly like the site.
   * Keep the two in step.
   */
  function whatsAppUrl(phone) {
    if (!phone) return ''
    var digits = String(phone).replace(/\D/g, '')
    if (!digits) return ''
    if (digits.indexOf('00') === 0) {
      digits = digits.slice(2)
    } else if (digits.charAt(0) === '0') {
      digits = '62' + digits.slice(1)
    }
    return /^[1-9]\d{7,14}$/.test(digits) ? 'https://wa.me/' + digits : ''
  }

  function chip(label) {
    return h('span', { className: 'pv-chip' }, label)
  }

  var ARROW = h(
    'svg',
    { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M4 12h15' }),
    h('path', { d: 'm13 6 6 6-6 6' })
  )

  function icon(paths) {
    return h(
      'svg',
      { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' },
      paths.map(function (d, i) {
        return h('path', { key: i, d: d })
      })
    )
  }

  var ICONS = {
    brand: ['M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'],
    digital: ['M3 4.5h18v13H3z', 'M8 21h8', 'M7 9h5', 'M7 12.5h8'],
    performance: ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'M12 12 19 5'],
    growth: ['M4 19 10 13l3.2 3.2L20 9', 'M15 9h5v5']
  }

  /* ------------------------------------------------------------ site parts */

  function Navbar(name) {
    var parts = String(name || 'Panji Prakorso').split(' ')
    return h(
      'header',
      { className: 'nav is-scrolled', style: { position: 'static' } },
      h(
        'div',
        { className: 'shell nav__inner' },
        h(
          'span',
          { className: 'nav__brand' },
          h('span', { className: 'nav__brand-text' }, parts[0] + ' ', h('strong', null, parts.slice(1).join(' ')))
        ),
        h(
          'nav',
          { className: 'nav__links' },
          ['Home', 'About', 'Experience', 'Projects', 'Contact'].map(function (l, i) {
            return h('span', { key: l, className: 'nav__link' + (i === 0 ? ' is-active' : '') }, l)
          })
        ),
        h('div', { className: 'nav__actions' }, h('span', { className: 'btn btn--sm' }, 'Get in touch'))
      )
    )
  }

  function Hero(props, hero, stats) {
    hero = hero || {}
    var image = asset(props, hero.image)
    return h(
      'section',
      { className: 'hero pv-section' },
      chip('Hero'),
      h(
        'div',
        { className: 'hero__backdrop', 'aria-hidden': true },
        h('span', { className: 'hero__grid' }),
        h('span', { className: 'hero__diagonal' }),
        h('span', { className: 'hero__glow' })
      ),
      h(
        'div',
        { className: 'shell hero__inner' },
        h(
          'div',
          { className: 'hero__content' },
          h('span', { className: 'label' }, text(hero.eyebrow, 'Small text above the heading')),
          h(
            'h1',
            { className: 'hero__title' },
            list(hero.headingLines).map(function (line, i) {
              return h('span', { key: i, className: 'hero__line' + (line && line.accent ? ' accent' : '') }, (line && line.text) || '')
            })
          ),
          h('p', { className: 'hero__lead' }, text(hero.description, 'Hero introduction paragraph')),
          h(
            'div',
            { className: 'hero__actions' },
            h('span', { className: 'btn' }, text(hero.primaryCtaLabel, 'Primary button'), ARROW),
            h('span', { className: 'btn btn--ghost' }, text(hero.secondaryCtaLabel, 'Secondary button'))
          )
        ),
        h(
          'div',
          { className: 'hero__portrait' },
          h(
            'div',
            { className: 'portrait' },
            h('span', { className: 'portrait__shape portrait__shape--a' }),
            h('span', { className: 'portrait__shape portrait__shape--b' }),
            h('span', { className: 'portrait__dots' }),
            image
              ? h('img', { className: 'portrait__img', src: image, alt: hero.imageAlt || '' })
              : h('div', { className: 'portrait__img' }, h('span', { className: 'pv-ph' }, 'Hero photo')),
            hero.badge
              ? h('div', { className: 'portrait__tag' }, h('span', { className: 'portrait__tag-dot' }), hero.badge)
              : null
          )
        )
      ),
      h(
        'div',
        { className: 'shell' },
        h(
          'ul',
          { className: 'hero__stats' },
          list(stats).map(function (s, i) {
            return h(
              'li',
              { key: i, className: 'hero__stat' },
              h('span', { className: 'hero__stat-value' }, text(s.value, '0')),
              h('span', { className: 'hero__stat-label' }, text(s.label, 'Label'))
            )
          })
        )
      )
    )
  }

  function About(about, chipLabel) {
    about = about || {}
    return h(
      'section',
      { className: 'section about pv-section' },
      chip(chipLabel || 'About'),
      h(
        'div',
        { className: 'shell about__inner' },
        h(
          'div',
          { className: 'about__intro' },
          h('span', { className: 'label' }, text(about.label, 'Section label')),
          h('h2', { className: 'section-title' }, text(about.heading, 'Heading'), ' ', h('span', { className: 'accent' }, about.headingAccent || '')),
          h('p', { className: 'section-lead' }, text(about.description, 'Description')),
          about.note ? h('p', { className: 'about__note' }, about.note) : null,
          about.cvUrl ? h('span', { className: 'btn btn--ghost about__cta' }, about.cvLabel || 'Download CV') : null
        ),
        h(
          'div',
          { className: 'capabilities' },
          list(about.disciplines).map(function (d, i) {
            return h(
              'article',
              { key: i, className: 'capability' },
              h(
                'div',
                { className: 'capability__head' },
                h('span', { className: 'capability__icon' }, icon(ICONS[d.icon] || ICONS.growth)),
                h('span', { className: 'capability__number' }, d.number || '')
              ),
              h('h3', { className: 'capability__title' }, text(d.title, 'Title')),
              d.description ? h('p', { className: 'capability__desc' }, d.description) : null,
              h(
                'ul',
                { className: 'capability__list' },
                list(d.points).map(function (p, j) {
                  return h('li', { key: j }, p)
                })
              )
            )
          })
        )
      )
    )
  }

  function Experience(exp, chipLabel) {
    exp = exp || {}
    var items = list(exp.milestones).slice().sort(function (a, b) {
      return (a.order || 999) - (b.order || 999)
    })
    return h(
      'section',
      { className: 'section section--panel timeline-section pv-section' },
      chip(chipLabel || 'Experience'),
      h(
        'div',
        { className: 'shell' },
        h(
          'div',
          { className: 'eyebrow-row' },
          h('div', null, h('span', { className: 'label' }, text(exp.label, 'Label')), h('h2', { className: 'section-title' }, text(exp.title, 'Career Milestones'))),
          h('p', { className: 'section-lead timeline-section__lead' }, exp.lead || '')
        ),
        h(
          'ol',
          { className: 'timeline' },
          h('span', { className: 'timeline__rail' }),
          items.map(function (m, i) {
            return h(
              'li',
              { key: i, className: 'milestone' },
              h('span', { className: 'milestone__marker' }, h('span', { className: 'milestone__dot' })),
              h('span', { className: 'milestone__year' }, text(m.year, '20XX')),
              h('h3', { className: 'milestone__title' }, text(m.title, 'Position')),
              m.company ? h('p', { className: 'milestone__company' }, m.company) : null,
              h('p', { className: 'milestone__text' }, m.description || ''),
              list(m.achievements).length
                ? h(
                    'ul',
                    { className: 'milestone__achievements' },
                    list(m.achievements).map(function (a, j) {
                      return h('li', { key: j }, a)
                    })
                  )
                : null
            )
          })
        )
      )
    )
  }

  function ProjectCard(project, props) {
    project = project || {}
    var image = props ? asset(props, project.heroImage) : project.heroImage
    var metrics = list(project.cardMetrics)
    return h(
      'article',
      { className: 'project-card' },
      h(
        'div',
        { className: 'project-card__media' },
        image
          ? h('img', { className: 'project-card__image', src: image, alt: '' })
          : h('div', { className: 'pv-ph' }, 'Built-in graphic: ' + (project.visual || 'dashboard')),
        project.logo ? h('img', { className: 'project-card__logo', src: props ? asset(props, project.logo) : project.logo, alt: '' }) : null,
        h('span', { className: 'project-card__number' }, project.number || '')
      ),
      h(
        'div',
        { className: 'project-card__body' },
        h('p', { className: 'project-card__category' }, text(project.category, 'Category')),
        h('h3', { className: 'project-card__title' }, text(project.displayTitle || project.title, 'Project name')),
        h('p', { className: 'project-card__desc' }, text(project.shortDescription, 'Short description')),
        metrics.length
          ? h(
              'ul',
              { className: 'project-card__metrics' },
              metrics.map(function (m, i) {
                return h(
                  'li',
                  { key: i },
                  h('span', { className: 'project-card__metric-value' }, m.value || ''),
                  h('span', { className: 'project-card__metric-label' }, m.label || '')
                )
              })
            )
          : h(
              'ul',
              { className: 'project-card__tags' },
              list(project.tags).map(function (t, i) {
                return h('li', { key: i }, t)
              })
            )
      ),
      h('span', { className: 'project-card__cta link-cta' }, 'View case study', ARROW)
    )
  }

  function FeaturedProjects(heading, slugs) {
    heading = heading || {}
    var all = SNAP.projects || []
    var chosen = list(slugs)
      .map(function (slug) {
        return all.filter(function (p) {
          return p.slug === slug
        })[0]
      })
      .filter(Boolean)
    if (!chosen.length) chosen = all
    return h(
      'section',
      { className: 'section projects pv-section' },
      chip('Featured projects'),
      h(
        'div',
        { className: 'shell' },
        h(
          'div',
          { className: 'eyebrow-row projects__head' },
          h(
            'div',
            null,
            h('span', { className: 'label' }, text(heading.label, 'Label')),
            h('h2', { className: 'section-title' }, text(heading.title, 'Selected Work')),
            h('p', { className: 'section-lead' }, heading.lead || '')
          )
        )
      ),
      h(
        'div',
        { className: 'carousel' },
        h(
          'div',
          { className: 'carousel__track', style: { overflowX: 'hidden' } },
          h('span', { className: 'carousel__pad' }),
          chosen.map(function (p, i) {
            return h('div', { key: i, className: 'carousel__item' }, ProjectCard(p))
          })
        )
      )
    )
  }

  function Impact(impact) {
    impact = impact || {}
    return h(
      'section',
      { className: 'section section--tight impact pv-section' },
      chip('Impact'),
      h(
        'div',
        { className: 'shell impact__inner' },
        h('div', { className: 'impact__head' }, h('span', { className: 'label' }, text(impact.label, 'Label')), h('h2', { className: 'section-title' }, text(impact.title, 'Impact That Matters'))),
        h(
          'div',
          { className: 'impact__grid' },
          list(impact.items).map(function (m, i) {
            return h('div', { key: i, className: 'metric' }, h('span', { className: 'metric__value' }, text(m.value, '0')), h('span', { className: 'metric__label' }, m.label || ''))
          })
        )
      ),
      impact.note ? h('div', { className: 'shell' }, h('p', { className: 'impact__note' }, impact.note)) : null
    )
  }

  function Framework(fw, chipLabel) {
    fw = fw || {}
    return h(
      'section',
      { className: 'section section--alt framework pv-section' },
      chip(chipLabel || 'How I think'),
      h(
        'div',
        { className: 'shell' },
        h(
          'div',
          { className: 'eyebrow-row' },
          h('div', null, h('span', { className: 'label' }, text(fw.label, 'Label')), h('h2', { className: 'section-title' }, text(fw.title, 'Heading'), ' ', h('span', { className: 'accent' }, fw.titleAccent || ''))),
          h('p', { className: 'section-lead framework__lead' }, fw.lead || '')
        ),
        h(
          'ol',
          { className: 'framework__grid' },
          list(fw.steps).map(function (s, i) {
            return h(
              'li',
              { key: i, className: 'framework__step' },
              h('span', { className: 'framework__number' }, s.number || ''),
              h('h3', { className: 'framework__title' }, text(s.title, 'Step')),
              h('p', { className: 'framework__caption' }, s.caption || ''),
              h(
                'ul',
                { className: 'framework__items' },
                list(s.points).map(function (p, j) {
                  return h('li', { key: j }, p)
                })
              )
            )
          })
        )
      )
    )
  }

  function Tools(tools, chipLabel) {
    tools = tools || {}
    return h(
      'section',
      { className: 'section section--tight tools pv-section' },
      chip(chipLabel || 'Tools'),
      h(
        'div',
        { className: 'shell tools__inner' },
        h('div', { className: 'tools__head' }, h('span', { className: 'label' }, text(tools.label, 'Label')), h('h3', { className: 'tools__title' }, tools.title || '')),
        h(
          'div',
          { className: 'tools__groups' },
          list(tools.groups).map(function (g, i) {
            return h(
              'div',
              { key: i, className: 'tools__group' },
              h('span', { className: 'tools__group-name' }, g.group || ''),
              h(
                'ul',
                { className: 'tools__list' },
                list(g.tools).map(function (t, j) {
                  return h('li', { key: j, className: 'tools__chip' }, t)
                })
              )
            )
          })
        )
      )
    )
  }

  function Contact(contact, chipLabel) {
    contact = contact || {}
    function row(label, value, href) {
      if (!value) return null
      var props = { className: 'contact__row' }
      if (href) {
        props.href = href
        props.target = '_blank'
        props.rel = 'noopener noreferrer'
      }
      return h(
        href ? 'a' : 'span',
        props,
        h('span', { className: 'contact__icon' }, icon(['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z'])),
        h('span', null, h('span', { className: 'contact__row-label' }, label), value)
      )
    }
    return h(
      'section',
      { className: 'section contact pv-section' },
      chip(chipLabel || 'Contact'),
      h('span', { className: 'contact__mark' }, 'P'),
      h(
        'div',
        { className: 'shell contact__inner' },
        h(
          'div',
          { className: 'contact__content' },
          h('span', { className: 'label' }, text(contact.label, 'Label')),
          h('h2', { className: 'contact__title' }, text(contact.title, "Let's build"), ' ', h('span', { className: 'accent' }, contact.titleAccent || '')),
          h('p', { className: 'contact__lead' }, contact.lead || ''),
          h('span', { className: 'btn contact__cta' }, text(contact.ctaLabel, 'Get in touch'), ARROW)
        ),
        h(
          'div',
          { className: 'contact__details' },
          row('Email', contact.email, contact.email ? 'mailto:' + contact.email : ''),
          row('Phone', contact.phone, whatsAppUrl(contact.phone)),
          row('LinkedIn', contact.linkedinLabel, contact.linkedinUrl),
          row('Location', contact.location)
        )
      )
    )
  }

  function Footer(general, contact) {
    general = general || {}
    return h(
      'footer',
      { className: 'footer' },
      h(
        'div',
        { className: 'shell footer__inner' },
        h('div', { className: 'footer__brand' }, h('span', { className: 'footer__name' }, general.siteName || 'Panji Prakorso'), h('p', { className: 'footer__tagline' }, general.tagline || '')),
        h(
          'nav',
          { className: 'footer__nav' },
          ['Home', 'About', 'Experience', 'Projects', 'Contact'].map(function (l) {
            return h('span', { key: l }, l)
          })
        )
      ),
      h('div', { className: 'shell footer__bottom' }, h('p', null, '© ' + new Date().getFullYear() + ' ' + (general.siteName || '') + '. All rights reserved.'))
    )
  }

  /* ------------------------------------------------------------- templates */

  function HomepagePreview(props) {
    var d = dataOf(props)
    return h(
      'div',
      null,
      Navbar((SNAP.general || {}).siteName),
      Hero(props, d.hero, d.stats),
      About(SNAP.about, 'About — edited on the About page'),
      FeaturedProjects(d.projectsSection, d.featuredProjects),
      Impact(d.impact),
      Framework((SNAP.skills || {}).framework, 'How I think — edited on the Skills page'),
      Tools((SNAP.skills || {}).tools, 'Tools — edited on the Skills page'),
      Contact(SNAP.contact, 'Contact — edited on the Contact page'),
      Footer(SNAP.general, SNAP.contact)
    )
  }

  function AboutPreview(props) {
    return h('div', null, Navbar((SNAP.general || {}).siteName), About(dataOf(props)), Footer(SNAP.general))
  }

  function ExperiencePreview(props) {
    return h('div', null, Navbar((SNAP.general || {}).siteName), Experience(dataOf(props)), Footer(SNAP.general))
  }

  function SkillsPreview(props) {
    var d = dataOf(props)
    return h('div', null, Navbar((SNAP.general || {}).siteName), Framework(d.framework), Tools(d.tools), Footer(SNAP.general))
  }

  function ContactPreview(props) {
    return h('div', null, Navbar((SNAP.general || {}).siteName), Contact(dataOf(props)), Footer(SNAP.general, dataOf(props)))
  }

  function GeneralPreview(props) {
    var d = dataOf(props)
    return h('div', null, Navbar(d.siteName), h('div', { style: { padding: '4rem 0' } }), Footer(d, SNAP.contact))
  }

  function ProjectPreview(props) {
    var d = dataOf(props)
    var image = asset(props, d.heroImage)
    var impact = d.impact || {}
    var metrics = list(impact.items)
    var qualitative = list(impact.qualitative)
    var related = (SNAP.projects || []).filter(function (p) {
      return p.slug !== d.slug
    })

    return h(
      'article',
      { className: 'case' },
      Navbar((SNAP.general || {}).siteName),
      h(
        'header',
        { className: 'case__hero pv-section' },
        chip('Project hero'),
        h('div', { className: 'case__hero-bg' }, h('span', { className: 'case__hero-glow' }), h('span', { className: 'case__hero-diagonal' })),
        h(
          'div',
          { className: 'shell case__hero-inner' },
          h(
            'div',
            { className: 'case__hero-grid' },
            h(
              'div',
              null,
              h('span', { className: 'case__number' }, d.number || ''),
              h('h1', { className: 'case__title' }, text(d.displayTitle || d.title, 'Project name')),
              h('p', { className: 'case__category' }, text(d.category, 'Category')),
              h('p', { className: 'case__lead' }, text(d.heroDescription, 'Case study intro')),
              h(
                'ul',
                { className: 'case__tags' },
                list(d.tags).map(function (t, i) {
                  return h('li', { key: i }, t)
                })
              )
            ),
            h(
              'div',
              { className: 'case__hero-visual' },
              image ? h('img', { className: 'case__hero-image', src: image, alt: '' }) : h('div', { className: 'pv-ph', style: { minHeight: '220px' } }, 'Built-in graphic: ' + (d.visual || 'dashboard'))
            )
          )
        )
      ),

      h(
        'div',
        { className: 'shell case__body' },
        list(d.chapters).map(function (c, i) {
          return h(
            'section',
            { key: i, className: 'chapter pv-section' },
            h(
              'div',
              { className: 'chapter__aside' },
              h('span', { className: 'chapter__index' }, String(i + 1).padStart(2, '0')),
              h('span', { className: 'label label--bare' }, c.label || '')
            ),
            h(
              'div',
              { className: 'chapter__content' },
              h('h2', { className: 'chapter__title' }, text(c.title, 'Section title')),
              list(c.body).map(function (p, j) {
                return h('p', { key: j, className: 'chapter__text' }, p)
              }),
              list(c.bullets).length
                ? h(
                    'ul',
                    { className: 'chapter__bullets' },
                    list(c.bullets).map(function (b, j) {
                      return h('li', { key: j }, b)
                    })
                  )
                : null,
              list(c.columns).length
                ? h(
                    'div',
                    { className: 'chapter__columns' },
                    list(c.columns).map(function (col, j) {
                      return h(
                        'div',
                        { key: j, className: 'chapter__column' },
                        h('h3', { className: 'chapter__column-title' }, col.title || ''),
                        h(
                          'ul',
                          null,
                          list(col.items).map(function (it, k) {
                            return h('li', { key: k }, it)
                          })
                        )
                      )
                    })
                  )
                : null
            )
          )
        })
      ),

      h(
        'section',
        { className: 'section section--panel case__impact pv-section' },
        chip('Measured impact'),
        h(
          'div',
          { className: 'shell' },
          h('span', { className: 'label' }, text(impact.label, 'Measured Impact')),
          h('h2', { className: 'section-title' }, metrics.length ? 'The measured result' : 'Where it stands today'),
          metrics.length
            ? h(
                'div',
                { className: 'case__metrics' },
                metrics.map(function (m, i) {
                  return h('div', { key: i, className: 'metric metric--lg' }, h('span', { className: 'metric__value' }, m.value || ''), h('span', { className: 'metric__label' }, m.label || ''))
                })
              )
            : null,
          qualitative.length
            ? h(
                'ul',
                { className: 'case__qualitative' },
                qualitative.map(function (q, i) {
                  return h('li', { key: i }, q)
                })
              )
            : null,
          h(
            'div',
            { className: 'case__attribution' },
            h('span', { className: 'case__attribution-label' }, 'Attribution'),
            h('p', null, h('strong', null, impact.attribution || '—')),
            h('p', { className: 'case__attribution-note' }, impact.note || '')
          )
        )
      ),

      d.learning
        ? h(
            'section',
            { className: 'section case__learning pv-section' },
            chip('Key learning'),
            h('div', { className: 'shell' }, h('div', { className: 'case__learning-inner' }, h('span', { className: 'label' }, 'Key learning'), h('blockquote', { className: 'case__quote' }, d.learning)))
          )
        : null,

      h(
        'section',
        { className: 'section section--alt case__related pv-section' },
        chip('Related projects — automatic'),
        h(
          'div',
          { className: 'shell' },
          h('span', { className: 'label' }, 'Related projects'),
          h('h2', { className: 'section-title' }, 'Keep exploring'),
          h(
            'div',
            { className: 'case__related-grid' },
            related.map(function (p, i) {
              return h(
                'span',
                { key: i, className: 'related-card' },
                h('span', { className: 'related-card__number' }, p.number || ''),
                h('h3', { className: 'related-card__title' }, p.displayTitle || p.title),
                h('p', { className: 'related-card__category' }, p.categoryShort || ''),
                h('p', { className: 'related-card__desc' }, p.shortDescription || ''),
                h('span', { className: 'link-cta related-card__cta' }, 'View case study', ARROW)
              )
            })
          )
        )
      ),
      Footer(SNAP.general, SNAP.contact)
    )
  }

  CMS.registerPreviewTemplate('homepage', HomepagePreview)
  CMS.registerPreviewTemplate('about', AboutPreview)
  CMS.registerPreviewTemplate('experience', ExperiencePreview)
  CMS.registerPreviewTemplate('skills', SkillsPreview)
  CMS.registerPreviewTemplate('contact', ContactPreview)
  CMS.registerPreviewTemplate('general', GeneralPreview)
  CMS.registerPreviewTemplate('projects', ProjectPreview)
})()
