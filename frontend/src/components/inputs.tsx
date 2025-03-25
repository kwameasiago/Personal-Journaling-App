import React from "react";
interface InputProps {
    placeholder: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    name: string;
    type: string;
    additionalClass: string;
  }



const Input: React.FC<InputProps> = ({placeholder, onChange, name, type}) => {
    return (
        <input 
        placeholder={placeholder} 
        type={type}
        name={name}
        onChange={onChange}
        className='bg-transparent placeholder:text-xl h-12 border border-slate-900  p-4 m-2'
        />
    )
}

export default Input