/* global field_group */
frappe.ui.form.on("Bulk Import Export Template", {
	refresh: function (frm) {
		frm.set_query("reference_doctype", function () {
			return {
				filters: {
					istable: 0,
					issingle: 0,
				},
			};
		});
	},

	reference_doctype: function (frm) {
		if (frm.doc.reference_doctype) {
			render_fields(frm);
		} else {
			frm.fields_dict.field_selection_html.$wrapper.html("");
		}
	},

	onload: function (frm) {
		if (frm.doc.reference_doctype) {
			render_fields(frm);
		}
	},
});

function render_fields(frm) {
	const doctype = frm.doc.reference_doctype;
	frappe.model.with_doctype(doctype, function () {
		const meta = frappe.get_meta(doctype);

		let current_data = [];
		try {
			current_data = JSON.parse(frm.doc.template_data || "[]");
		} catch (e) {
			current_data = [];
		}

		let doctype_config = current_data.find((d) => d[doctype]);
		let selected_fields = doctype_config ? doctype_config[doctype] : [];

		const field_definitions = [];

		const buttons_html = `
			<div class="mb-3">
				<h6 class="form-section-heading uppercase">${__("Select Fields")}</h6>
				<button class="btn btn-default btn-xs select-btn" data-action="select_all">
					${__("Select All")}
				</button>
				<button class="btn btn-default btn-xs select-btn" data-action="select_mandatory">
					${__("Select Mandatory")}
				</button>
				<button class="btn btn-default btn-xs select-btn" data-action="unselect_all">
					${__("Unselect All")}
				</button>
			</div>
		`;

		field_definitions.push({
			fieldtype: "HTML",
			fieldname: "select_all_buttons",
			options: buttons_html,
		});

		const main_fields = meta.fields.filter(
			(df) => !frappe.model.no_value_type.includes(df.fieldtype)
		);
		const main_options = [
			{
				label: __("ID"),
				value: "name",
				checked: selected_fields.includes("name"),
				danger: true,
			},
		];

		main_fields.forEach((df) => {
			main_options.push({
				label: __(df.label),
				value: df.fieldname,
				checked: selected_fields.includes(df.fieldname),
				danger: df.reqd,
			});
		});

		field_definitions.push({
			fieldtype: "MultiCheck",
			label: __(doctype),
			fieldname: "main_fields",
			options: main_options,
			columns: 2,
			on_change: function () {
				trigger_update(frm, field_group, doctype);
			},
		});

		const table_fields = frappe.meta.get_table_fields(doctype);
		const child_doctypes = table_fields.map((df) => df.options);
		const unique_child_doctypes = [...new Set(child_doctypes)];

		const load_child_metas = unique_child_doctypes.map((cd) => {
			return new Promise((resolve) => frappe.model.with_doctype(cd, resolve));
		});

		Promise.all(load_child_metas).then(() => {
			table_fields.forEach((df) => {
				const child_meta = frappe.get_meta(df.options);
				const child_doc_fields = child_meta.fields.filter(
					(cdf) => !frappe.model.no_value_type.includes(cdf.fieldtype)
				);

				const child_options = [
					{
						label: __("ID"),
						value: "name",
						checked: selected_fields.includes(`${df.fieldname}.name`),
						danger: true,
					},
				];

				child_doc_fields.forEach((cdf) => {
					child_options.push({
						label: __(cdf.label),
						value: cdf.fieldname,
						checked: selected_fields.includes(`${df.fieldname}.${cdf.fieldname}`),
						danger: cdf.reqd,
					});
				});

				field_definitions.push({
					fieldtype: "MultiCheck",
					label: `${__(df.label)} (${df.fieldname})`,
					fieldname: df.fieldname,
					options: child_options,
					columns: 2,
					on_change: function () {
						trigger_update(frm, field_group, doctype);
					},
				});
			});

			const $wrapper = frm.fields_dict.field_selection_html.$wrapper;
			$wrapper.empty();

			window.field_group = new frappe.ui.FieldGroup({
				fields: field_definitions,
				body: $wrapper,
			});
			field_group.make();

			$wrapper.find(".select-btn").on("click", function (e) {
				e.preventDefault();
				const action = $(this).data("action");
				const $all_checkboxes = $wrapper.find('input[type="checkbox"]');

				$all_checkboxes.each(function () {
					const $input = $(this);

					if (action === "select_all") {
						$input.prop("checked", true);
					} else if (action === "unselect_all") {
						$input.prop("checked", false);
					} else if (action === "select_mandatory") {
						const param_danger =
							$input.closest(".checkbox").find(".text-danger").length > 0;

						if (param_danger) {
							$input.prop("checked", true);
						}

						const val = $input.attr("data-unit");
						if (val === "name") {
							$input.prop("checked", true);
						}
					}
				});

				trigger_update(frm, field_group, doctype);
			});
		});
	});
}

function trigger_update(frm, field_group, doctype) {
	const values = {};

	field_group.fields_list.forEach((field) => {
		if (field.df.fieldtype === "MultiCheck") {
			const checked_vals = [];
			field.$wrapper.find('input[type="checkbox"]:checked').each(function () {
				checked_vals.push($(this).attr("data-unit"));
			});
			values[field.df.fieldname] = checked_vals;
		}
	});

	const result_list = [];

	if (values.main_fields) {
		values.main_fields.forEach((f) => result_list.push(f));
	}
	for (const key in values) {
		if (key !== "main_fields") {
			const child_selection = values[key];
			if (child_selection && Array.isArray(child_selection)) {
				child_selection.forEach((f) => {
					result_list.push(`${key}.${f}`);
				});
			}
		}
	}

	update_template_data(frm, doctype, result_list);
}

function update_template_data(frm, doctype, checked_fields) {
	let current_data = [];
	try {
		current_data = JSON.parse(frm.doc.template_data || "[]");
	} catch (e) {
		current_data = [];
	}

	const existing_index = current_data.findIndex((d) => d[doctype]);
	if (existing_index !== -1) {
		current_data[existing_index][doctype] = checked_fields;
	} else {
		let new_entry = {};
		new_entry[doctype] = checked_fields;
		current_data.push(new_entry);
	}

	frm.set_value("template_data", JSON.stringify(current_data));
}
