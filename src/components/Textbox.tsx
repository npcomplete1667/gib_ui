export default function Textbox({
    label_text,
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
}: {
    label_text: string;
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
}) {
    return (
        <label className="mb-2 inline-block text-sm text-gray-800 dark:text-gray-400 sm:text-base">
            {label_text}{" "}
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
                className="block w-full rounded border dark:border-0  bg-gray-50 dark:bg-white/5 px-3.5 py-2 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
        </label>
    );
}
