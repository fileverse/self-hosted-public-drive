import { Label, TextField } from '@fileverse/ui'

type InputProps = {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  id: string
}

export const Input = ({
  label,
  value,
  onChange,
  required = false,
  id,
}: InputProps) => {
  return (
    <div className="flex items-center gap-4">
      <Label className="text-body-sm w-[170px]" required={required}>
        {label}
      </Label>
      <TextField value={value} onChange={onChange} id={id} />
    </div>
  )
}
