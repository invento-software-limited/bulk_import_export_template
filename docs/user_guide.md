# User Guide

## Installation

Install the app using the Frappe Bench CLI:

```bash
# Navigate to your bench directory
cd /path/to/your/bench

# Get the app
bench get-app https://github.com/invento-software-limited/bulk_import_export_template

# Install on your site
bench --site your-site.com install-app bulk_import_export_template
```

### Prerequisites

- Frappe Bench v16+
- ERPNext v16+
- Python 3.10+

---

## Creating a Template

### Step 1: Open the DocType

1. Go to **Bulk Import Export Template** from the ERPNext Awesome Bar or module list.
2. Click **+ Add Bulk Import Export Template** to create a new template.

### Step 2: Configure Your Template

| Field | Description |
|---|---|
| **Template Name** | Give your template a descriptive name (e.g., "Customer Import — Standard Fields") |
| **Reference DocType** | Select the DocType you want to create a template for (e.g., Customer, Item, Sales Invoice) |
| **Fields** | Interactive field selection area showing all fields of the selected DocType |

### Step 3: Select Fields

1. After selecting the **Reference DocType**, the field selection area populates with all available fields.
2. Check the fields you want to include in your import/export.
3. **Child table support**: If the DocType has child tables (e.g., Items in Sales Invoice), you can drill into each child table and select its fields too.
4. The selected fields appear in order — you can rearrange them.

### Step 4: Save as Favourite

1. Click **Save**.
2. Toggle **Is Favourite** to mark this template for quick access in the Data Import tool.

---

## Using Templates in Data Import

### During Import

1. Navigate to the standard Frappe **Data Import** tool.
2. Select your DocType and prepare your CSV/Excel file as usual.
3. In the field mapping section, click the **Select Favourite** button.
4. Choose your saved template from the list.
5. The fields are automatically mapped — proceed with your import.

### During Export

1. Go to the **Data Import** tool and select the DocType to export.
2. Click **Select Favourite** in the field selection area.
3. Pick your template.
4. The export will include only the fields defined in your template.

---

## Managing Templates

### Edit a Template
1. Go to the **Bulk Import Export Template** list.
2. Click on any template to open it.
3. Modify the field selections or template name.
4. Save your changes.

### Delete a Template
1. Open the template you want to remove.
2. Click the **Delete** action button (trash icon).
3. Confirm the deletion.

### Toggle Favourite Status
- Open a template and check/uncheck **Is Favourite** to control whether it appears in the Data Import tool's quick-select list.

---

## Troubleshooting

| Issue | Possible Cause | Solution |
|---|---|---|
| Template not showing in Data Import | **Is Favourite** not enabled | Open the template and enable **Is Favourite** |
| Fields not appearing after selecting DocType | DocType might not have any fields | Verify the DocType exists and has fields defined |
| Child table fields not visible | Browser console error | Try refreshing the page and re-selecting the DocType |
| Template list is empty | No templates created yet | Create at least one template first |

---

## FAQ

**Q: Can I use the same template for both import and export?**
A: Yes! Templates work for both import and export operations in the Data Import tool.

**Q: How many fields can I include in a template?**
A: There's no hard limit — you can select all fields of a DocType if needed.

**Q: Does this work for custom DocTypes?**
A: Yes, any DocType registered in your ERPNext instance will appear in the Reference DocType selector.

**Q: Can I share templates with other users?**
A: Currently, templates are user-specific. Team sharing is on the roadmap.

**Q: Is the app free?**
A: Yes, it's open source under the MIT license. Premium features (like shared template libraries) are planned.

---

## API Reference

This app does not expose a public API. It enhances the existing Frappe Data Import user interface on the client side.

---

## Support

For issues, feature requests, or professional support:

- 📧 **Email:** [munim@invento.com.bd](mailto:munim@invento.com.bd)
- 🐞 **GitHub Issues:** [Submit an issue](https://github.com/invento-software-limited/bulk_import_export_template/issues)
- 🌟 **Contribute:** Star the repo and submit pull requests
