#!/bin/bash
set -e

  

echo "Running health checks..."

# Get web hosts
WEB_HOSTS=$(ansible -i ${INVENTORY} web --list-hosts | tail -n +2 | xargs)

for host in $WEB_HOSTS; do
    echo "Checking ${host}..."
    
    # Get IP from inventory
    IP=$(ansible -i ${INVENTORY} ${host} -m debug -a "var=ansible_host" | grep ansible_host | awk '{print $2}' | tr -d '"')
    
    # Check HTTP response
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://${IP} || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✓ ${host} is healthy (HTTP ${HTTP_CODE})"
    else
        echo "✗ ${host} returned HTTP ${HTTP_CODE}"
        exit 1
    fi
done

echo "All health checks passed!"
