import React from 'react'

const IconCheckbox = (
  props: React.SVGProps<SVGSVGElement> & { checked?: boolean }
) => {
  const { checked, ...rest } = props

  if (checked) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <rect
          x="1.5"
          y="1.5"
          width="21"
          height="21"
          rx="5.5"
          fill="currentColor"
        />
        <rect
          x="1.5"
          y="1.5"
          width="21"
          height="21"
          rx="5.5"
          stroke="currentColor"
        />
        <path
          d="M6 12.5l4 4 8-9"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="white" />
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" stroke="black" />
    </svg>
  )
}

export default IconCheckbox
