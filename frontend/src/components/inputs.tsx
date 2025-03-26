import React from "react";
interface InputProps {
    placeholder: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    name: string;
    type: string;
    additionalClass?: string;
  }



const Input: React.FC<InputProps> = ({placeholder, onChange, name, type, additionalClass=''}) => {
    if(type === 'textarea'){
        return (
            <textarea
            placeholder={placeholder}
            name={name}
            className={'bg-transparent rounded-lg placeholder:text-xl border border-slate-700  p-4 m-2' + additionalClass}
            rows={10}
            ></textarea>
        )
    }
    return (
        <input 
        placeholder={placeholder} 
        type={type}
        name={name}
        onChange={onChange}
        className={'bg-transparent rounded-lg placeholder:text-xl h-12 border border-slate-700  p-4 m-2' + additionalClass}
        />
    )
}

export default Input