#!/bin/sh
# Writes the Shell's runtime federation manifest from environment variables
# when the container starts, so one Shell image works in every environment.
#
#   ENABLED_REMOTES   comma-separated sections to show (blog,docs,tools,
#                     playground) or "all" (default). Disabled sections are
#                     left out of the manifest and hidden by the Shell.
#   REMOTE_<NAME>_URL remoteEntry.json URL per remote; defaults assume the
#                     TG Labs gateway layout (/mfe/<name>/ on the same origin).
set -eu

manifest=/usr/share/nginx/html/federation.manifest.json
enabled=$(echo "${ENABLED_REMOTES:-all}" | tr -d ' ')

is_enabled() {
  [ "$enabled" = "all" ] && return 0
  case ",$enabled," in
    *",$1,"*) return 0 ;;
    *) return 1 ;;
  esac
}

for key in $(echo "$enabled" | tr ',' ' '); do
  case "$key" in
    all | blog | docs | tools | playground) ;;
    *)
      echo "federation-manifest: unknown ENABLED_REMOTES value: $key" >&2
      exit 1
      ;;
  esac
done

entries=""
add() {
  key=$1 name=$2 url=$3
  is_enabled "$key" || return 0
  case "$url" in
    *\"* | *\\*)
      echo "federation-manifest: invalid remote URL: $url" >&2
      exit 1
      ;;
  esac
  [ -n "$entries" ] && entries="$entries,"
  entries="$entries
  \"$name\": \"$url\""
}

add blog blog-mfe "${REMOTE_BLOG_URL:-/mfe/blog/remoteEntry.json}"
add docs docs-mfe "${REMOTE_DOCS_URL:-/mfe/docs/remoteEntry.json}"
add tools tools-mfe "${REMOTE_TOOLS_URL:-/mfe/tools/remoteEntry.json}"
add playground playground-mfe "${REMOTE_PLAYGROUND_URL:-/mfe/playground/remoteEntry.json}"

printf '{%s\n}\n' "$entries" > "$manifest"
echo "federation-manifest: wrote $manifest (enabled: $enabled)"
