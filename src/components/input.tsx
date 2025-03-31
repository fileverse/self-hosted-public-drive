import { Label, TextField } from '@fileverse/ui'

type InputProps = {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  id: string
  placeholder?: string
}

export const Input = ({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  id,
}: InputProps) => {
  return (
    <div className="flex items-center gap-4">
      <Label className="text-body-sm w-[170px]" required={required}>
        {label}
      </Label>

      <TextField
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
        className="bg-white"
      />
    </div>
  )
}
