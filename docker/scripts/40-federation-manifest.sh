#!/bin/sh
# Writes the Shell's runtime federation manifest from environment variables
# when the container starts, so one Shell image works in every environment.
# Defaults assume the TG Labs gateway layout (/mfe/<name>/ on the same origin).
set -eu

manifest=/usr/share/nginx/html/federation.manifest.json

blog=${REMOTE_BLOG_URL:-/mfe/blog/remoteEntry.json}
docs=${REMOTE_DOCS_URL:-/mfe/docs/remoteEntry.json}
tools=${REMOTE_TOOLS_URL:-/mfe/tools/remoteEntry.json}
playground=${REMOTE_PLAYGROUND_URL:-/mfe/playground/remoteEntry.json}

for url in "$blog" "$docs" "$tools" "$playground"; do
  case "$url" in
    *\"* | *\\*)
      echo "federation-manifest: invalid remote URL: $url" >&2
      exit 1
      ;;
  esac
done

cat > "$manifest" <<JSON
{
  "blog-mfe": "$blog",
  "docs-mfe": "$docs",
  "tools-mfe": "$tools",
  "playground-mfe": "$playground"
}
JSON

echo "federation-manifest: wrote $manifest"
