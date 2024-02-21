export default function Textbox({
    label,
    validator,
    error_text,
    input_name,
    value,
    handler,
    pattern,
    type = "text",
    max_length,
    button,
    required = false,
    disabled = false,
}: {
    label: any;
    validator?: boolean;
    error_text?: string;
    input_name: string;
    value: string | number;
    handler: any;
    pattern?: string;
    type?: string;
    max_length?: number;
    button?:any;
    required?: boolean;
    disabled?:boolean
}) {
    return (
        <label className="block w-full text-sm font-medium leading-6 text-gray-900 dark:text-gray-400">
            {label}{" "}
            <span className="text-red-500">
                {validator ? " *" + error_text : ""}
            </span>
            {button}
            <input
                name={input_name}
                type={type}
                value={value}
                onChange={handler}
                pattern={pattern}
                maxLength={max_length}
                required={required}
                disabled={disabled}
                autoComplete="off"
                className="mt-2 w-full rounded-md border-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 bg-white dark:bg-white/5 py-1.5 pl-3 pr-12 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                
                "
            />
        </label>
    );
}
