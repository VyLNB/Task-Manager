
type InputFieldProps = {
    label: string;
    type: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, placeholder, onChange, className }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-white text-sm font-medium mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 
                            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 
                            transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    );
}

export default InputField;