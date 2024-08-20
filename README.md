# GitHub Container Registry Stats Action

GitHub Action to collect container registry stats, such as downloads (pulls) count.

**The action support public packages only.**

## How it Work?

This action crawls stats from GitHub, and save it as a JSON file.

## Usage

Create a GitHub workflow (i.e. `.github/workflows/ghcr-stats.yml`) with the following content, tweak the inputs and then commit to your repository.

```yaml
name: GHCR Stats

on:
  workflow_dispatch: # to debug via triggering the workflow manually.
  schedule:
    - cron: '0 * * * *' # run job hourly, I'd suggest not setting the interval too narrow, to avoid abusing GitHub resources.

jobs:
  ghcr-stats:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # generate the stats file.
      - uses: actionstore/ghcr-stats@v1
        with:
          owner: hugomods # repository owner, required.
          repo: docker # repository name, required.
          name: hugo # package name, required.
          path: ghcr-stats.json
      
      # commit the stats file.
      - uses: EndBug/add-and-commit@v9
        with:
          add: ghcr-stats.json # MUST be same as the `path` of `actionstore/ghcr-stats` action.
          message: 'chore: update GHCR stats [skip ci]' # `[skip ci]` to avoid triggering other workflows.
```

## JSON Properties

| Property | Type | Description |
| -------- | :--: | ----------- |
| `last_updated` | string | Last updated time. |
| `downloads` | number | The total downloads count. |
| `downloads_compact` | string | The humanized version of total downloads count. |
| `downloads_day` | number | The downloads count of today. |
| `downloads_day_compact` | string | The humanized version of downloads count of today. |
| `downloads_week` | number | The downloads count within last 7 days. |
| `downloads_week_compact` | string | The humanized version of downloads count within last 7 days. |
| `downloads_month` | number | The downloads count within last 30 days. |
| `downloads_month_compact` | string | The humanized version of downloads count within last 30 days. |

## Badges

With [Shields.io Dynamic JSON Badge](https://shields.io/badges/dynamic-json-badge) service, it's easy to generate GHCR badges, to use it, just replace the following raw stats file URL (`https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json` in this example) with yours.

![GHCR Pulls](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json&query=downloads_compact&label=ghcr+pulls&style=flat-square)
![GHCR Pulls Monthly](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json&query=downloads_month_compact&label=ghcr+pulls&suffix=/month&style=flat-square)
![GHCR Pulls Weekly](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json&query=downloads_week_compact&label=ghcr+pulls&suffix=/week&style=flat-square)
![GHCR Pulls Daily](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json&query=downloads_day_compact&label=ghcr+pulls&suffix=/day&style=flat-square)

```markdown
![GHCR Pulls](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json&query=downloads_compact&label=ghcr+pulls&style=flat-square)
![GHCR Pulls Monthly](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json&query=downloads_month_compact&label=ghcr+pulls&suffix=/month&style=flat-square)
![GHCR Pulls Weekly](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json&query=downloads_week_compact&label=ghcr+pulls&suffix=/week&style=flat-square)
![GHCR Pulls Daily](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/hugomods/docker/main/ghcr-stats.json&query=downloads_day_compact&label=ghcr+pulls&suffix=/day&style=flat-square)
```
