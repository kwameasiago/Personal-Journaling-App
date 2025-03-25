import React from "react";
import Input from "./inputs";

interface InputProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  additionalClass?: string;
}

interface ReusableFormProps {
  inputs: InputProps[];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const ReusableForm: React.FC<ReusableFormProps> = ({ inputs, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col  w-156">
      {inputs.map((inputProps, index) => (
        <Input
          key={index}
          placeholder={inputProps.placeholder}
          type={inputProps.type}
          value={inputProps.value}
          onChange={inputProps.onChange}
          additionalClass={inputProps.additionalClass || ""}
        />
      ))}
     <button 
     className='text-white bg-slate-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
     >Login</button>

    </form>
  );
};

export default ReusableForm;
