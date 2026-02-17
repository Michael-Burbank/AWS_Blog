#!/bin/bash
set -e

INVENTORY=${1:-${INVENTORY:-inventory.ini}}


echo "Running health checks..."

# Get web hosts
WEB_HOSTS=$(ansible -i ${INVENTORY} web --list-hosts | tail -n +2 | xargs)

if [ -z "${WEB_HOSTS}" ]; then
    echo "✗ No hosts found in group 'web' using inventory ${INVENTORY}"
    exit 1
fi

for host in $WEB_HOSTS; do
    echo "Checking ${host}..."
    
    # Get IP from inventory
    IP=$(ansible -i ${INVENTORY} ${host} -m debug -a "var=ansible_host" | grep ansible_host | awk '{print $2}' | tr -d '"')

    if [ -z "${IP}" ]; then
        echo "✗ ${host} has no ansible_host value in ${INVENTORY}"
        exit 1
    fi
    echo "Resolved target: ${IP}:80"
    
    # Quick TCP reachability check
    if ! nc -z -w 5 "${IP}" 80 2>/dev/null; then
        echo "✗ ${host} port 80 unreachable (TCP connect failed)"
        echo "  Check AWS Security Group inbound 80, NACL rules, subnet route to Internet Gateway, and host firewall."
        exit 1
    fi
    
    # Check HTTP response
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://${IP}" || true)
    if [ -z "${HTTP_CODE}" ]; then
        HTTP_CODE="000"
    fi
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✓ ${host} is healthy (HTTP ${HTTP_CODE})"
    else
        if [ "$HTTP_CODE" = "000" ]; then
            echo "✗ ${host} returned HTTP 000 (network timeout or connect failure)"
            echo "  Check AWS Security Group inbound 80/443, NACL rules, subnet route to Internet Gateway, and host firewall."
        else
            echo "✗ ${host} returned HTTP ${HTTP_CODE}"
        fi
        exit 1
    fi
done

echo "All health checks passed!"
