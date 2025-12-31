# AWS Blog – Static Website Project

This repository contains a static website for an AWS-focused blog, built with HTML, CSS, and JavaScript. It includes a local development workflow and an Ansible-based deployment to AWS EC2. For detailed Ansible usage and commands, see [ansible-README.md](ansible-README.md).

## Features

- Simple, responsive static pages (HTML/CSS/JS).
- Ready-to-deploy content under [website/](website/).
- Ansible playbooks to bootstrap an EC2 host and deploy the site.

## Project Structure

- [index.html](index.html): Landing page.
- [fullstack.html](fullstack.html): Additional site content/page.
- [templates.html](templates.html): Shared or template markup.
- [style.css](style.css): Global styles.
- [script.js](script.js): Client-side interactions.
- [website/](website/): Deployable site assets (copied to EC2).
- [playbooks/](playbooks): Ansible playbooks (`site.yml`, `Deploy_Website.yml`).
- [inventory.ini](inventory.ini): Static inventory (gitignored).
- [ansible.cfg](ansible.cfg): Ansible configuration.
- [ansible-README.md](ansible-README.md): Ansible inventory, commands, and usage.

## Prerequisites

- macOS/Linux with Git, Python 3.
- Optional: Ansible installed (`pip install ansible`).
- For EC2 deployments: AWS credentials configured (see [ansible-README.md](ansible-README.md)).

## Local Development

- Open the HTML files directly, or run a simple local server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

You can also serve only the `website/` folder:

```bash
cd website
python3 -m http.server 8080
```

## Deployment (Overview)

Deployment is managed via Ansible to an AWS EC2 instance.

- Bootstrap server (install and configure Nginx): see [playbooks/site.yml](playbooks/site.yml).
- Deploy website content: see [playbooks/Deploy_Website.yml](playbooks/Deploy_Website.yml).
- Inventory options:
  - Static: [inventory.ini](inventory.ini)

For exact commands (`--syntax-check`, `--check`, group names, and credentials), use [ansible-README.md](ansible-README.md).

## Security

- Do not commit secrets (AWS keys, private keys, tokens) to the repo.
- `inventory.ini` is excluded via [.gitignore](.gitignore). Keep host/IP, user, and key path there.
- Store credentials in environment variables or your local AWS profile; avoid hardcoding in playbooks/vars.
- Review files before committing; if you add any `.pem`/`.key` files, ensure they remain ignored.

## Contributing

- Keep HTML/CSS/JS changes minimal and consistent.
- If adding assets (images/fonts), place them under [website/](website/) and ensure they’re referenced correctly.
- Run a local server to verify layout and links before deploying.

## License

This project is intended for personal use and demonstrations. If you plan to publish or redistribute, add an appropriate license here.
