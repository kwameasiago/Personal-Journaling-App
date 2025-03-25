import React from "react";
interface InputProps {
    placeholder: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    value: string;
    type: string;
    additionalClass: string;
  }



const Input: React.FC<InputProps> = ({placeholder, onChange, value, type}) => {
    return (
        <input 
        placeholder={placeholder} 
        type={type}
        value={value}
        onChange={onChange}
        className='bg-transparent placeholder:text-xl h-12 border border-slate-900  p-4 m-2'
        />
    )
}

export default Input