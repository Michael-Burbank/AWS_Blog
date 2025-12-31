#!/bin/bash
set -e

INVENTORY=${1:-inventory.ini}
PLAYBOOK=${2:-playbooks/site.yml}

echo "Deploying with inventory: ${INVENTORY}"
echo "Using playbook: ${PLAYBOOK}"

# Syntax check
echo "Running syntax check..."
ansible-playbook -i ${INVENTORY} ${PLAYBOOK} --syntax-check

# Dry run
echo "Running dry run..."
ansible-playbook -i ${INVENTORY} ${PLAYBOOK} --check

# Confirm deployment
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Deploying..."
    ansible-playbook -i ${INVENTORY} ${PLAYBOOK}
    
    echo "Running health checks..."
    bash src/scripts/health-check.sh ${INVENTORY}
    
    echo "Deployment complete!"
else
    echo "Deployment cancelled"
    exit 1
fi
