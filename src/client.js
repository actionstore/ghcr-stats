const jsdom = require('jsdom');
const humanize = require('humanize-plus');

const request = (owner, repo, name) => {
  if (!owner || !repo || !name) {
    throw new Error('The owner, repo and name parameters are required.')
  }
  const url = `https://github.com/${owner}/${repo}/pkgs/container/${name}`
  return fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`unable to fetch "${url}": [${response.status}] ${response.statusText}`)
      }

      return response.text()
    })
    .then((body) => {
      const stats = parse(body)
      return stats
    });
}

const parse = (html) => {
  const stats = {}
  const dom = new jsdom.JSDOM(html)
  const terms = dom.window.document.body.querySelectorAll(".repository-content div.lh-condensed")
  for (term of terms) {
    const span = term.querySelector('span')
    if (span !== null) {
      const heading = term.querySelector('h3[title]')
      if (!heading) {
        continue
      }
      const name = span.textContent.trim()
      if (name === 'Total downloads') {
        const value = parseInt(heading.getAttribute('title'))
        stats['downloads'] = value
        stats['downloads_compact'] = humanize.compactInteger(value, 1)
      } else if (name === 'Last published') {
        stats['last_updated'] = heading.getAttribute('title')
      }
    } else if (term.getAttribute('aria-label') === 'Downloads for the last 30 days') {
      let average = 0
      let week = 0
      let month = 0
      const days = term.querySelectorAll('svg rect[data-merge-count]')
      for (let day = 0; day < days.length; day++) {
        const count = parseInt(days[day].getAttribute('data-merge-count'))
        if (day < 7) {
          week += count
        }
        month += count
      }
      average = parseInt(week / 7)
      stats['downloads_day'] = average
      stats['downloads_day_compact'] = humanize.compactInteger(average, 1)
      stats['downloads_week'] = week
      stats['downloads_week_compact'] = humanize.compactInteger(week, 1)
      stats['downloads_month'] = month
      stats['downloads_month_compact'] = humanize.compactInteger(month, 1)
    }
  }

  return stats
}

module.exports = {
  request
}
