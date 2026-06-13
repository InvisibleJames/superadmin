#!/usr/bin/env bash
#
# MedReco Super Admin — API smoke test.
#
# Boots the Laravel API on a throwaway SQLite database, logs in, and exercises
# every endpoint (auth, meta, and each resource's index/stats/filters), then
# tears everything down. Does NOT touch your real (MySQL) database.
#
# Usage:
#   ./scripts/smoke.sh
#   PORT=8899 ./scripts/smoke.sh
#
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$(cd "$SCRIPT_DIR/.." && pwd)/backend"
PORT="${PORT:-8765}"
BASE="http://127.0.0.1:${PORT}"
TMPDB="$(mktemp --suffix=.sqlite)"
SERVE_LOG="$(mktemp)"
SERVER_PID=""

PASS=0
FAIL=0

green() { printf '\033[32m%s\033[0m' "$1"; }
red()   { printf '\033[31m%s\033[0m' "$1"; }
dim()   { printf '\033[2m%s\033[0m' "$1"; }

cleanup() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  rm -f "$TMPDB" "$SERVE_LOG"
}
trap cleanup EXIT

# --- assert helpers ----------------------------------------------------------

# check <name> <expected-status> <curl-args...>
check() {
  local name="$1" expect="$2"; shift 2
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' "$@")"
  if [ "$code" = "$expect" ]; then
    printf '  %s  %s\n' "$(green '✓')" "$name"
    PASS=$((PASS + 1))
  else
    printf '  %s  %s %s\n' "$(red '✗')" "$name" "$(dim "(got $code, want $expect)")"
    FAIL=$((FAIL + 1))
  fi
}

# check_json <name> <url> <php-bool-expr over $d> — authorized GET, asserts body
check_json() {
  local name="$1" url="$2" expr="$3"
  local body ok
  body="$(curl -s "$url" -H "Authorization: Bearer $TOKEN" -H 'Accept: application/json')"
  ok="$(printf '%s' "$body" | php -r '$d=json_decode(file_get_contents("php://stdin"),true); echo ('"$expr"')?"1":"0";' 2>/dev/null)"
  if [ "$ok" = "1" ]; then
    printf '  %s  %s\n' "$(green '✓')" "$name"
    PASS=$((PASS + 1))
  else
    printf '  %s  %s %s\n' "$(red '✗')" "$name" "$(dim "assertion failed")"
    FAIL=$((FAIL + 1))
  fi
}

# --- boot --------------------------------------------------------------------

echo "▶ Booting API on $BASE (throwaway SQLite)…"
export DB_CONNECTION=sqlite DB_DATABASE="$TMPDB"
cd "$BACKEND"

# Free the port from any straggler so we always test a fresh server.
command -v fuser >/dev/null 2>&1 && fuser -k "${PORT}/tcp" >/dev/null 2>&1
sleep 1

php artisan migrate:fresh --seed --force >/dev/null 2>&1
# Run the server directly (no subshell) so $! is the php process we can kill.
php artisan serve --host=127.0.0.1 --port="$PORT" >"$SERVE_LOG" 2>&1 &
SERVER_PID=$!

# wait until it answers
for i in $(seq 1 20); do
  curl -s -o /dev/null "$BASE/api/meta" && break
  sleep 0.5
done

# --- auth --------------------------------------------------------------------

echo "▶ Auth"
check "rejects wrong password (422)" 422 -X POST "$BASE/api/auth/login" \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"email":"admin@medreco.com","password":"nope"}'
check "blocks unauthenticated /users (401)" 401 "$BASE/api/users" -H 'Accept: application/json'

TOKEN="$(curl -s -X POST "$BASE/api/auth/login" \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"email":"admin@medreco.com","password":"password"}' \
  | php -r 'echo json_decode(file_get_contents("php://stdin"))->token ?? "";')"

if [ -z "$TOKEN" ]; then
  echo "  $(red '✗')  login did not return a token — aborting"
  exit 1
fi
echo "  $(green '✓')  login returns a token"
PASS=$((PASS + 1))
check_json "/auth/me is the admin" "$BASE/api/auth/me" '($d["data"]["email"] ?? "") === "admin@medreco.com"'

# --- resources ---------------------------------------------------------------

echo "▶ Resources"
check_json "meta has all reference lists" "$BASE/api/meta" \
  'isset($d["roles"],$d["clinics"],$d["branches"],$d["provinces"],$d["genders"],$d["admin_roles"],$d["statuses"])'

check_json "users index paginates"  "$BASE/api/users?per_page=5"   'count($d["data"])<=5 && $d["meta"]["total"]>0'
check_json "users status filter"     "$BASE/api/users?status=active" 'count(array_filter($d["data"],fn($r)=>$r["status"]!=="active"))===0'
check_json "users stats"             "$BASE/api/users/stats"        'isset($d["total"],$d["active"],$d["inactive"],$d["roles"])'

check_json "clinics index w/ counts" "$BASE/api/clinics"           'isset($d["data"][0]["branches_count"],$d["data"][0]["patients_count"])'
check_json "clinics stats"           "$BASE/api/clinics/stats"      'isset($d["total"],$d["branches"])'

check_json "branches index"          "$BASE/api/branches"          '$d["meta"]["total"]>0'
check_json "branches stats clinics"  "$BASE/api/branches/stats"    'isset($d["clinics"]) && $d["clinics"]>0'

check_json "patients index"          "$BASE/api/patients"          '$d["meta"]["total"]>0'
check_json "patients gender filter"  "$BASE/api/patients?gender=Female" 'count(array_filter($d["data"],fn($r)=>$r["gender"]!=="Female"))===0'
check_json "patients stats"          "$BASE/api/patients/stats"    'isset($d["new_this_month"])'

check_json "sa-users index"          "$BASE/api/sa-users"          '$d["meta"]["total"]>0'
check_json "sa-users role tone"      "$BASE/api/sa-users?admin_role=Super%20Admin" 'count(array_filter($d["data"],fn($r)=>$r["admin_role"]!=="Super Admin"))===0'
check_json "sa-users stats"          "$BASE/api/sa-users/stats"    'isset($d["super_admins"],$d["two_fa"])'

# --- summary -----------------------------------------------------------------

echo
echo "──────────────────────────────────────"
printf '  %s passed, %s failed\n' "$(green "$PASS")" "$([ "$FAIL" -gt 0 ] && red "$FAIL" || echo "$FAIL")"
echo "──────────────────────────────────────"
[ "$FAIL" -eq 0 ]
