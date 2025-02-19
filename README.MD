<p align="center"><img src="frontend/public/static/images/logo/logo.png" width="80"></p>
<h1 align="center">Atlas CMMS</h1>

[Atlas CMMS](https://github.com/grashjs/cmms) is a robust, free self hosted (web-mobile) based  Maintenance management tool using Docker. It is designed to streamline work order management, preventive maintenance, asset tracking, and team collaboration.

**Screenshot**:
![](https://i.ibb.co/7tGYCtv/Screenshot-502.png)


## ⚡ **Features**
### Work Orders & Maintenance
- 📝 Create, assign, and track work orders.
- ⏱️ Log time, set priorities, and track history.
- 🤖 Automate work orders with triggers.
- 📊 Export reports and view analytics.

### Analytics & Reporting
- 💼 Work order compliance and cost analysis.
- 🛠️ Equipment downtime and reliability insights.
- 💵 Cost trends and labor tracking.

### Equipment & Inventory
- ⚙️ Track equipment, downtime, and maintenance costs.
- 📦 Manage inventory with stock alerts.
- 🛒 Automate purchase orders and approvals.

### User & Workflow Management
- 👥 Assign tasks to teams or service providers.
- 🧑‍💼 Customizable user roles and permissions.
- 🔄 Define workflows with automation logic.

### Locations & Requests
- 📍 Manage locations with Google Maps integration.
- 📑 Create and track service requests.

You can check out the [complete list of features](api/Current%20features.pdf). 

We'd love to have **new contributors**, so feel free to join us!  
⭐ **Star this repo to support us!**

## Self Host

#### Clone the Repository
```sh
git clone https://github.com/grashjs/cmms.git
cd cmms
```
Configure the environment variables in this file [.env](.env)
The env variables at the top are required, others optional. [Here](api/README.md#how-to-run-locally-) you can see where to get them from
```sh
docker-compose up -d
```
Now, go to http://localhost:3000

Celebrate on how easy this was

## Getting help
You can first go to https://grashjs.github.io/user-guide.
If you still have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker or send an
email at [ibracool99@gmail.com](mailto:ibracool99@gmail.com).

## Supported languages
- English
- French
- Turkish

## 🏗️ **Tech Stack**
- [Api](api) with java Spring Boot
- [Website](frontend) with React/Typescript
- [Mobile](mobile) with React Native.

## Need Professional Help?
Don't want to handle the maintenance and management yourself? We offer a complete done-for-you service. [Please reach out to us](mailto:ibracool99@gmail.com)

## 🤝 Looking to contribute?

We welcome contributions! You can help by:
- ✅ Reporting bugs
- ✅ Suggesting new features
- ✅ Improving documentation
- ✅ Submitting pull requests

Check CONTRIBUTING.md inside each subproject for details.

You can also join our [Discord server](https://discord.gg/A6eMSNwg)
## Open source licensing info

1) [LICENSE](LICENSE)
