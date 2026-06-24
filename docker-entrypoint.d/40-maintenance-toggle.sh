#!/bin/sh
# Pick the nginx config based on the ACTIVE env var (fed from the GitHub
# secret ACTIVE at deploy time). ACTIVE=true (default) -> live site;
# ACTIVE=false -> maintenance page ("Pagina indisponibila momentan", HTTP 503).
set -e

active="$(printf '%s' "${ACTIVE:-true}" | tr '[:upper:]' '[:lower:]')"

case "$active" in
  false|0|no|off)
    echo ">> SpaceBox: ACTIVE=$active -> MAINTENANCE mode"
    cp /etc/nginx/site-available/maintenance.conf /etc/nginx/conf.d/default.conf
    ;;
  *)
    echo ">> SpaceBox: ACTIVE=$active -> LIVE site"
    cp /etc/nginx/site-available/site.conf /etc/nginx/conf.d/default.conf
    ;;
esac
