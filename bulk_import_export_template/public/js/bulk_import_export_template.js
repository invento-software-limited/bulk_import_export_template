/* global bulk_import_export_template */
frappe.provide("bulk_import_export_template.data_import");

bulk_import_export_template.override_data_exporter = function () {
	// Check if the class exists and isn't already overridden
	if (!frappe.data_import || !frappe.data_import.DataExporter) {
		return;
	}

	if (bulk_import_export_template.data_import.DataExporterOverridden) {
		return;
	}

	const OriginalDataExporter = frappe.data_import.DataExporter;

	bulk_import_export_template.CustomDataExporter = class extends OriginalDataExporter {
		constructor(doctype, exporting_for) {
			super(doctype, exporting_for);
		}

		make_select_all_buttons() {
			let for_insert = this.exporting_for === "Insert New Records";
			let section_title = for_insert
				? __("Select Fields To Insert")
				: __("Select Fields To Update");
			let $select_all_buttons = $(`
			<div class="mb-3">
				<h6 class="form-section-heading uppercase">${section_title}</h6>
				<button class="btn btn-default btn-xs" data-action="select_all">
					${__("Select All")}
				</button>
				${
					for_insert
						? `<button class="btn btn-default btn-xs" data-action="select_mandatory">
					${__("Select Mandatory")}
				</button>`
						: ""
				}
				<button class="btn btn-default btn-xs" data-action="select_favourite">
					${__("Select Favourite")}
				</button>
				<button class="btn btn-default btn-xs" data-action="unselect_all">
					${__("Unselect All")}
				</button>
			</div>
		`);
			frappe.utils.bind_actions_with_object($select_all_buttons, this);
			this.dialog.get_field("select_all_buttons").$wrapper.html($select_all_buttons);
		}

		select_favourite() {
			this.unselect_all();

			frappe.db
				.get_single_value("Bulk Import Export Template", "template_data")
				.then((template_data) => {
					let data = [];
					try {
						data = JSON.parse(template_data || "[]");
					} catch (e) {
						data = [];
					}

					const doctype_config = data.find((d) => d[this.doctype]);

					if (
						!doctype_config ||
						!doctype_config[this.doctype] ||
						doctype_config[this.doctype].length === 0
					) {
						frappe.msgprint(__("Template not set for {0}", [this.doctype]));
						return;
					}

					const fields_to_select = doctype_config[this.doctype];

					fields_to_select.forEach((field_str) => {
						let target_multicheck_fieldname;
						let target_checkbox_value;

						if (field_str.includes(".")) {
							const parts = field_str.split(".");
							target_multicheck_fieldname = parts[0];
							target_checkbox_value = parts[1];
						} else {
							target_multicheck_fieldname = this.doctype;
							target_checkbox_value = field_str;
						}

						const field = this.dialog.get_field(target_multicheck_fieldname);
						if (field) {
							const $checkbox = field.$wrapper.find(
								`input[type="checkbox"][data-unit="${target_checkbox_value}"]`
							);
							if ($checkbox.length) {
								$checkbox.prop("checked", true).trigger("change");
							}
						}
					});
				});
		}
	};

	frappe.data_import.DataExporter = bulk_import_export_template.CustomDataExporter;
	bulk_import_export_template.data_import.DataExporterOverridden = true;
};

(function () {
	const original_require = frappe.require;
	frappe.require = function (items, callback) {
		const is_data_import = Array.isArray(items)
			? items.some((i) => typeof i === "string" && i.includes("data_import_tools.bundle.js"))
			: typeof items === "string" && items.includes("data_import_tools.bundle.js");

		if (is_data_import) {
			const original_callback = callback;
			callback = function () {
				try {
					bulk_import_export_template.override_data_exporter();
				} catch (e) {
					console.error("Failed to apply DataExporter override", e);
				}

				if (original_callback) {
					return original_callback.apply(this, arguments);
				}
			};
		}
		return original_require.call(this, items, callback);
	};
})();
