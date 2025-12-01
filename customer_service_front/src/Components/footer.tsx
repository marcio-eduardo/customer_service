export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full text-center p-4 border-t border-tas-accent/20 bg-tas-bg-card z-10">
      <p className="text-sm text-tas-text-secondary-on-card">
        Painel do parceiro &copy; Trust Assist System - {new Date().getFullYear()}
      </p>
    </footer>
  )
}