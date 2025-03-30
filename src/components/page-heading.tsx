import { IconButton } from '@fileverse/ui'

type PageHeadingProps = {
  heading: string
  onBackClick?: () => void
}

export const PageHeading = (props: PageHeadingProps) => {
  const { heading, onBackClick } = props

  if (onBackClick && typeof onBackClick === 'function')
    return (
      <div className="flex gap-4 items-center">
        <IconButton variant="ghost" onClick={onBackClick} icon="ArrowLeft" />
        <HeadingText heading={heading} />
      </div>
    )

  return <HeadingText heading={heading} />
}

const HeadingText = ({ heading }: { heading: string }) => {
  return (
    <h1 className="font-bold text-heading-2xlg leading-10 text-[#363B3F]">
      {heading}
    </h1>
  )
}
