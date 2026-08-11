import React from 'react'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 px-4 py-3">
        <img src="/images/Logo2.jpg" alt="Logo" className="h-12 w-13 rounded-full" />
        <span>
            Sakin Pharmacy
        </span>

    </Link>
  )
}

export default Logo