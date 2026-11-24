import styles from './Button.module.css'

/** Botón con forma de paralelogramo. variant: oro | grafito | rojo | blanco */
export default function Button({ href, children, variant = 'oro', external, className = '', ...rest }) {
  const isExternal = external ?? /^https?:/.test(href)
  return (
    <a
      href={href}
      className={`${styles.btn} ${styles[variant]} ${className}`}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <span>{children}</span>
    </a>
  )
}
