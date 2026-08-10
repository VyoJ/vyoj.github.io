# Writing blog posts

Reference for authoring posts on this site. Distilled from the al-folio demo posts that used
to live in `_posts/` — they were deleted once this document captured what they demonstrated.

Every feature below is **opt-in per post** via front matter. A feature renders only when its
gem is loaded, its site flag is on, **and** the post opts in. Miss any one of those and the
tag silently renders nothing — no warning, no error. That is the single most common way a
post "looks broken" here.

<!--ts-->

- [Writing blog posts](#writing-blog-posts)
  - [Before your first post](#before-your-first-post)
  - [Creating a post](#creating-a-post)
  - [Core front matter](#core-front-matter)
  - [Images](#images)
    - [Comparison slider and galleries](#comparison-slider-and-galleries)
  - [Video and audio](#video-and-audio)
  - [Code](#code)
  - [Math](#math)
  - [Diagrams](#diagrams)
  - [Charts](#charts)
  - [Tables](#tables)
  - [Table of contents](#table-of-contents)
  - [Custom blockquotes](#custom-blockquotes)
  - [Citations and bibliography](#citations-and-bibliography)
  - [Comments](#comments)
  - [Notebooks and interactive Python](#notebooks-and-interactive-python)
  - [The distill layout](#the-distill-layout)
  - [Gotchas](#gotchas)

<!--te-->

## Before your first post

Three settings were switched off while the blog held only demo content. Flip all three back
on together, or your posts will be invisible:

| File              | Setting                | Change to |
| ----------------- | ---------------------- | --------- |
| `_pages/blog.md`  | `nav: false`           | `true`    |
| `_pages/about.md` | `latest_posts.enabled` | `true`    |
| `_config.yml`     | `posts_in_search`      | `true`    |

Optionally also re-enable the RSS feed: uncomment `jekyll-feed` in **both** the `Gemfile`
(`:jekyll_plugins` group) and `_config.yml`'s `plugins:` list, plus `rss_icon` in
`_data/socials.yml`. Jekyll auto-requires everything in that Gemfile group, so the Gemfile
is the one that actually controls whether `/feed.xml` is generated.

## Creating a post

Posts live in `_posts/` and **must** be named `YYYY-MM-DD-slug.md`.

> **The date prefix is mandatory here.** Unlike `_news/`, where the date comes from front
> matter and filenames are free-form, Jekyll derives a post's date from its **filename**.
> Drop the prefix and the file is silently ignored — it will not appear anywhere and you
> get no error.

The published URL is `/blog/:year/:title/` (set by `permalink` in `_config.yml`), so
`_posts/2026-09-14-scaling-synthetic-data.md` becomes `/blog/2026/scaling-synthetic-data/`.

A minimal post:

```markdown
---
layout: post
title: scaling synthetic data generation
date: 2026-09-14 10:00:00+0530
description: what broke when we went from 200k to 2M pages
tags: data-pipelines infrastructure
categories: notes
---

Your content here.
```

## Core front matter

| Key                | Purpose                                                                       |
| ------------------ | ----------------------------------------------------------------------------- |
| `layout`           | `post` for normal posts, `distill` for the academic two-column layout         |
| `title`            | Post title                                                                    |
| `date`             | Full timestamp. Include an offset (`+0530`) or times render as UTC            |
| `description`      | One line. Feeds the listing page, `<meta name="description">`, and Open Graph |
| `tags`             | Space-separated. Each gets an archive page at `/blog/tag/<tag>/`              |
| `categories`       | Space-separated. Each gets `/blog/category/<category>/`                       |
| `thumbnail`        | e.g. `assets/img/9.jpg`. Shows beside the post in the blog listing            |
| `featured: true`   | Pins the post to a highlighted card at the top of `/blog/`                    |
| `related_posts`    | `false` to hide the related-posts block. Defaults to on                       |
| `last_modified_at` | Optional revision timestamp                                                   |
| `lang`             | Language code, e.g. `fa`. Triggers RTL layout via `al_rtl`                    |
| `redirect`         | Makes the post a redirect to a URL or asset instead of a page                 |
| `_styles`          | A block of post-scoped CSS, injected into that page only                      |

To surface a tag or category on the blog landing page, add it to `display_tags` /
`display_categories` in `_config.yml`. Archive pages generate regardless.

## Images

Always use the `figure.liquid` include rather than raw `<img>` — it wires up responsive
`srcset`, WebP conversion (via `imagemagick`), and lazy loading.

```liquid
{% include figure.liquid path="assets/img/9.jpg" class="img-fluid rounded z-depth-1" %}
```

- `loading="eager"` — opt out of lazy loading for above-the-fold images
- `zoomable=true` — click to zoom (medium.com style), needs `enable_medium_zoom` site-wide
- `alt="…"`, `title="…"` — always set `alt`

Multi-column layouts use Bootstrap-style grid markup:

```html
<div class="row">
  <div class="col-sm mt-3 mt-md-0">{% include figure.liquid path="assets/img/1.jpg" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3 mt-md-0">{% include figure.liquid path="assets/img/2.jpg" class="img-fluid rounded z-depth-1" %}</div>
</div>
<div class="caption">Caption text sits in a div with class "caption".</div>
```

### Comparison slider and galleries

```yaml
images:
  compare: true # before/after slider
  slider: true # swiper carousel
  lightbox2: true # any of these four gallery engines
  photoswipe: true
  spotlight: true
  venobox: true
```

Then in the body, `<img-comparison-slider>` with `slot="first"` / `slot="second"` on two
figures, `<swiper-container>` wrapping `<swiper-slide>` elements, or anchors carrying the
relevant class (`class="spotlight"`, `class="venobox"`, `data-lightbox="…"`).

## Video and audio

```liquid
{% include video.liquid path="assets/video/clip.mp4" class="img-fluid rounded z-depth-1" controls=true %}
{% include audio.liquid path="assets/audio/track.mp3" controls=true %}
```

`video.liquid` also takes `autoplay=true`, and accepts a YouTube/Vimeo URL as `path`.

## Code

Fenced blocks with a language work out of the box (Rouge highlighting):

````markdown
```python
def f(x):
    return x
```
````

For line numbers, use the Liquid `highlight` tag instead:

```liquid
{% highlight c++ linenos %}
code here
{% endhighlight %}
```

| Feature     | Front matter       | Body                                                |
| ----------- | ------------------ | --------------------------------------------------- |
| Code diffs  | `code_diff: true`  | ` ```diff2html ` block containing a unified diff    |
| Pseudocode  | `pseudocode: true` | ` ```pseudocode ` block in LaTeX algorithmic syntax |
| Tabbed code | `tabs: true`       | `{% tabs group %}` / `{% tab group name %}`         |

Tabs syntax:

```liquid
{% tabs log %}
{% tab log php %}
...php code...
{% endtab %}
{% tab log js %}
...js code...
{% endtab %}
{% endtabs %}
```

> **Showing Liquid syntax in a post.** Wrap it in `{% raw %}` / `{% endraw %}`, or Jekyll
> will execute your example instead of printing it.

## Math

Enabled site-wide by `enable_math` (currently on), so no per-post flag is needed. Inline
math uses `$$ … $$` on one line; display math uses `$$ … $$` on its own lines. Note al-folio
uses `$$` for **both**, which differs from vanilla LaTeX.

## Diagrams

| Kind        | Front matter                               | Body                                          |
| ----------- | ------------------------------------------ | --------------------------------------------- |
| Mermaid     | `mermaid: {enabled: true, zoomable: true}` | ` ```mermaid `                                |
| TikZ        | `tikzjax: true`                            | ` ```tikzjax ` or `<script type="text/tikz">` |
| Typograms   | `typograms: true`                          | ` ```typograms `                              |
| GeoJSON map | `map: true`                                | ` ```geojson `                                |

## Charts

```yaml
chart:
  chartjs: true
  echarts: true
  vega_lite: true
  plotly: true
```

Each enables a matching fenced block — ` ```chartjs `, ` ```echarts `, ` ```vega `,
` ```plotly ` — whose content is the library's JSON spec. Enable only the ones a given post
uses; each one pulls in its own JS bundle.

## Tables

`pretty_table: true` turns Markdown tables into sortable, searchable bootstrap-tables. You
can also point one at a JSON file:

```html
<table id="table" data-toggle="table" data-url="{{ '/assets/json/data.json' | relative_url }}"></table>
```

## Table of contents

```yaml
toc:
  beginning: true # inline, at the top of the post
```

```yaml
toc:
  sidebar: left # floating sidebar; also accepts `right`
```

Generated automatically from your headings by `jekyll-toc`. The `distill` layout uses a
different, manually-specified `toc:` list — see below.

## Custom blockquotes

Append a class to a blockquote with Kramdown's `{: .class }` syntax. The attribute line goes
**immediately after** the blockquote, at column 0 — it is not part of the quote, so it carries
no `>` prefix:

<!-- prettier-ignore -->
```text
> ##### TIP
>
> A helpful aside.
{: .block-tip }
```

Available: `.block-tip`, `.block-warning`, `.block-danger`.

## Citations and bibliography

- **Cite your own publications** — set `related_publications: true`, then use
  `{% cite kolavi2025nayana %}` to reference entries from `_bibliography/papers.bib`.
- **Post-specific bibliography** — set `bibliography: my-post.bib` and add that file to
  `assets/bibliography/`. Mainly used with the distill layout.
- **Make a post citable** — `citation: true` renders a BibTeX block readers can copy.

## Comments

`giscus_comments: true` per post, with the `giscus:` block configured in `_config.yml`
(currently empty — fill in `repo`, `repo_id`, `category_id` from <https://giscus.app/>).
`disqus_comments: true` also exists but Disqus is deprecated in al-folio; prefer giscus.

## Notebooks and interactive Python

- **Jupyter** — put the `.ipynb` in `assets/jupyter/` and embed it with the
  `jupyter_notebook` Liquid tag wrapped in `{::nomarkdown}` … `{:/nomarkdown}`. Requires
  `jupyter` and `nbconvert` on PATH (`bin/setup-python-deps`); if missing, rendering is
  skipped silently.
- **marimo** — `marimo: true`, then wrap fenced Python blocks in
  `<div class="al-marimo-inline">` to make them runnable in the reader's browser.

## The distill layout

`layout: distill` gives the academic two-column layout with margin notes and sidenotes. It
needs more front matter than a normal post:

```yaml
layout: distill
title: …
description: …
date: 2026-05-22
authors:
  - name: Vyoman Jain
    url: "https://vyoj.github.io"
    affiliations:
      name: SUTD
bibliography: 2026-05-22-my-post.bib
toc:
  - name: Section One
    subsections:
      - name: A Subsection
  - name: Section Two
```

Two things to watch:

- The distill `toc` is **manually written** and its entries must match your actual heading
  text exactly, or the anchors break. This is unlike the automatic `jekyll-toc` above.
- Distill has its own citation system driven by the post's own `bibliography:` file.

## Gotchas

- **`baseurl` is blank on this site.** Build with a plain `bundle exec jekyll build`; never
  pass `--baseurl /al-folio`. Always write internal links through `relative_url`.
- **Local builds need Docker.** System Ruby is 2.6, too old for Jekyll 4. Use
  `docker compose up -d` and visit <http://127.0.0.1:8080/>.
- **Config edits need a container restart** — `--watch` does not reload `_config.yml`.
- **Run Prettier before pushing**: `npx prettier . --write`. CI enforces it, with
  `@shopify/prettier-plugin-liquid` and `printWidth: 150`.
- **Headings in this repo's Markdown get auto-TOC'd** by the `update-tocs` workflow, which
  may push a follow-up commit to `main`.
