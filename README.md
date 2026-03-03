<p align="center">
  <img src="https://invento.com.bd/wp-content/uploads/2023/11/invento-logo-color.svg" width="250" alt="Invento Logo">
</p>

### 📦 Bulk Import Export Template

**Bulk Import Export Template** is a powerful Frappe app designed to streamline and turbocharge your data import/export workflows. By allowing you to create, save, and reuse custom field selection templates, it eliminates the frustration of manual field mapping for repetitive tasks. 🚀

### ✨ Key Features

- **🎯 Customizable Templates**: Precision-select fields for any DocType, including full support for nested child table fields.
- **💾 Template Persistence**: Save your perfectly tuned configurations as "Favourite" templates for instant reuse.
- **🔌 Seamless Integration**: Plugs directly into Frappe's native Data Import tool, adding a convenient "Select Favourite" button.
- **⚡ Boosted Efficiency**: Drastically reduce the time and effort spent on manual field selection and data mapping.

### 🛠 Usage

1.  **Create a Template**: Navigate to the **Bulk Import Export Template** DocType and select the DocType you want to create a template for.
2.  **Select Fields**: Use the interactive field selection area to pick the fields (and child table fields) you need.
3.  **Save**: Save the document.
4.  **Import/Export**: Go to the standard Frappe **Data Import** tool. When selecting fields for export or import, click the **Select Favourite** button to instantly apply your saved template. 🪄

### 🛡 Support

If you encounter any issues or have suggestions for improvements, please feel free to:

- 🌟 Star the repository if you find it helpful!
- 🐞 Open an [Issue](https://github.com/InventoSoftwareLimited/bulk_import_export_template/issues) on GitHub.
- 🏢 Contact **Invento Software Limited** at [munim@invento.com.bd](mailto:munim@invento.com.bd) for professional support.

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app bulk_import_export_template
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/bulk_import_export_template
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade

### License

mit
